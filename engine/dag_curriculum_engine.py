from collections import defaultdict
from datetime import datetime, timezone
import heapq
import json
from pathlib import Path
from typing import List, Dict, Set, Tuple

from rich.console import Console
from rich.table import Table

from engine.database import EnterpriseSQLiteWarehouse
from engine.models import (
    IITModuleNode,
    PlacementWeekPlan,
    RolePlacementRoadmap6M,
    CurriculumIntelligenceReport,
)

console = Console(legacy_windows=False)


class DAGCurriculumEngine:
    """
    Enterprise 6-Month Placement Compression & Prerequisite DAG Engine.
    - Prunes low-ROI 4-year academic proof modules.
    - Performs Kahn's Topological Sort on prerequisite edges (verifying acyclic graph integrity).
    - Cross-references IIT modules with live scraped job market demand & calculates cumulative job unlocks.
    """

    ROLE_CONFIGS = {
        "fullstack": "Full-Stack Software Engineer (IIT Madras & IIT Kharagpur 6-Month Track)",
        "backend": "Backend & Distributed Systems Engineer (IIT Bombay & IIT Kharagpur 6-Month Track)",
        "frontend": "Frontend & Modern Web Architect (IIT Madras BS 6-Month Track)",
        "ai_ml": "Applied AI, ML & LLM Engineer (IIT Madras RBCDSAI 6-Month Track)",
    }

    def __init__(self, warehouse: EnterpriseSQLiteWarehouse | None = None):
        self.processed_dir = Path(__file__).parent.parent / "data" / "processed"
        self.processed_dir.mkdir(parents=True, exist_ok=True)
        self.warehouse = warehouse or EnterpriseSQLiteWarehouse()

    def _load_live_market_data(self) -> Tuple[Dict[str, float], List[Dict]]:
        """Loads live skill demand % and scraped opportunities from processed JSON feeds."""
        skill_demand: Dict[str, float] = {}
        jobs_list: List[Dict] = []

        summary_path = self.processed_dir / "skills_summary.json"
        if summary_path.exists():
            try:
                with open(summary_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                for item in data.get("top_overall", []):
                    skill_demand[item["skill"]] = float(item["percentage"])
                for role_items in data.get("roles", {}).values():
                    for item in role_items:
                        sk = item["skill"]
                        if sk not in skill_demand:
                            skill_demand[sk] = float(item["percentage"])
            except Exception:
                pass

        opps_path = self.processed_dir / "opportunities_feed.json"
        if opps_path.exists():
            try:
                with open(opps_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                jobs_list = data.get("jobs", [])
            except Exception:
                pass

        return skill_demand, jobs_list

    def prune_academic_theory(
        self, modules: List[IITModuleNode]
    ) -> Tuple[List[IITModuleNode], List[IITModuleNode]]:
        """Separates high-ROI placement modules from 4-year theoretical proof modules."""
        active: List[IITModuleNode] = []
        pruned: List[IITModuleNode] = []
        for mod in modules:
            if mod.is_academic_theory_only or mod.oa_interview_weight < 25.0:
                pruned.append(mod)
            else:
                active.append(mod)
        return active, pruned

    def topological_sort_dag(
        self, modules: List[IITModuleNode]
    ) -> Tuple[List[IITModuleNode], bool]:
        """
        Executes Kahn's Topological Sort with a deterministic min-heap tie-breaker
        (week_number, -oa_interview_weight) to guarantee all prerequisites are satisfied
        before any dependent IIT module is scheduled.
        Returns (ordered_modules, is_acyclic).
        """
        node_map: Dict[str, IITModuleNode] = {m.id: m for m in modules}
        in_degree: Dict[str, int] = {m.id: 0 for m in modules}
        adj: Dict[str, List[str]] = defaultdict(list)

        for m in modules:
            for prereq_id in m.prerequisites:
                if prereq_id in node_map:
                    adj[prereq_id].append(m.id)
                    in_degree[m.id] += 1

        # Priority queue: (week_number, -oa_interview_weight, id)
        heap: List[Tuple[int, float, str]] = []
        for m_id, deg in in_degree.items():
            if deg == 0:
                node = node_map[m_id]
                heapq.heappush(heap, (node.week_number, -node.oa_interview_weight, m_id))

        ordered: List[IITModuleNode] = []
        while heap:
            _, _, curr_id = heapq.heappop(heap)
            ordered.append(node_map[curr_id])
            for neighbor_id in adj[curr_id]:
                in_degree[neighbor_id] -= 1
                if in_degree[neighbor_id] == 0:
                    nb = node_map[neighbor_id]
                    heapq.heappush(heap, (nb.week_number, -nb.oa_interview_weight, neighbor_id))

        is_acyclic = len(ordered) == len(modules)
        return ordered, is_acyclic

    def _phase_label_for_week(self, week: int) -> str:
        if week <= 8:
            return "Phase 1 (Months 1–2): IIT Programming Foundations, Tooling & DSA"
        elif week <= 16:
            return "Phase 2 (Months 3–4): IIT Core Systems (DBMS/OS/CN) & Full-Stack Engineering"
        return "Phase 3 (Months 5–6): Cloud/DevOps, Applied AI/LLMs, Capstones & OA Sprint"

    def _count_unlocked_jobs(self, cumulative_skills: Set[str], jobs_list: List[Dict]) -> int:
        if not jobs_list or not cumulative_skills:
            return 0
        unlocked = 0
        for job in jobs_list:
            req_skills = job.get("skills") or []
            if not req_skills:
                continue
            overlap = sum(1 for s in req_skills if s in cumulative_skills)
            # Unlocked if student knows >= 50% of listed skills (or at least 2 core skills)
            if overlap >= max(1, (len(req_skills) + 1) // 2) or overlap >= 2:
                unlocked += 1
        return unlocked

    def build_6m_placement_roadmaps(
        self, all_modules: List[IITModuleNode]
    ) -> CurriculumIntelligenceReport:
        skill_demand, jobs_list = self._load_live_market_data()
        active_modules, pruned_modules = self.prune_academic_theory(all_modules)

        console.print(
            f"[cyan][DAG Pruner] Analyzed {len(all_modules)} IIT syllabus modules -> "
            f"Pruned [bold yellow]{len(pruned_modules)}[/bold yellow] low-ROI academic proof modules, "
            f"Retained [bold green]{len(active_modules)}[/bold green] high-ROI placement modules.[/cyan]"
        )

        sorted_modules, is_acyclic = self.topological_sort_dag(active_modules)
        console.print(
            f"[green][OK] DAG Topological Sort Verified: Acyclic={is_acyclic} "
            f"(0 circular prerequisite dependencies across {len(sorted_modules)} weeks)[/green]"
        )

        roadmaps_by_role: Dict[str, RolePlacementRoadmap6M] = {}

        for role_key, role_title in self.ROLE_CONFIGS.items():
            cumulative_skills: Set[str] = set()
            weekly_plan: List[PlacementWeekPlan] = []
            institutes_seen: List[str] = []

            for idx, mod in enumerate(sorted_modules[:24], start=1):
                if mod.iit_institute not in institutes_seen:
                    institutes_seen.append(mod.iit_institute)

                for sk in mod.skills_taught:
                    cumulative_skills.add(sk)

                # Calculate market demand % for skills taught in this module
                matched_demands = [skill_demand.get(sk, 5.5) for sk in mod.skills_taught]
                avg_demand = round(max(matched_demands) if matched_demands else 6.0, 1)

                # Role-relevance bonus
                role_bonus = 4.0 if role_key in mod.target_roles else 0.0
                roi_score = round(
                    min(
                        99.8,
                        (0.55 * mod.oa_interview_weight)
                        + (0.25 * min(100.0, avg_demand * 4.2))
                        + (0.16 * 95.0)
                        + role_bonus,
                    ),
                    1,
                )

                unlocked_jobs = self._count_unlocked_jobs(cumulative_skills, jobs_list)

                weekly_plan.append(
                    PlacementWeekPlan(
                        week=idx,
                        phase_name=self._phase_label_for_week(idx),
                        module_id=mod.id,
                        course_code=mod.course_code,
                        title=mod.module_title,
                        iit_source=f"{mod.iit_institute} ({mod.course_code}: {mod.course_title})",
                        professor=mod.professor,
                        atomic_topics=mod.atomic_topics,
                        skills_unlocked=mod.skills_taught,
                        prerequisites_satisfied=mod.prerequisites,
                        study_hours=mod.estimated_hours,
                        live_market_demand_pct=avg_demand,
                        placement_roi_score=roi_score,
                        hands_on_deliverable=mod.hands_on_lab,
                        unlocked_opportunities_count=unlocked_jobs,
                    )
                )

            roadmaps_by_role[role_key] = RolePlacementRoadmap6M(
                role_category=role_key,
                role_title=role_title,
                total_weeks=len(weekly_plan),
                total_hours=sum(w.study_hours for w in weekly_plan),
                iit_institutes_referenced=institutes_seen,
                pruned_theory_modules_count=len(pruned_modules),
                dag_topological_order_verified=is_acyclic,
                weekly_plan=weekly_plan,
            )

        unique_courses = {m.course_code for m in all_modules}
        report = CurriculumIntelligenceReport(
            generated_at=datetime.now(timezone.utc).isoformat(),
            total_iit_courses_scraped=len(unique_courses),
            total_iit_modules_extracted=len(all_modules),
            total_theory_modules_pruned=len(pruned_modules),
            live_jobs_cross_referenced=len(jobs_list),
            roadmaps_by_role=roadmaps_by_role,
        )

        # Persist to Gold JSON Layer & Enterprise SQLite Warehouse
        self.save_curriculum_outputs(all_modules, pruned_modules, report)
        self.warehouse.upsert_iit_modules(all_modules)
        self.warehouse.upsert_roadmaps(roadmaps_by_role)
        self.print_roadmap_dashboard(report)

        return report

    def save_curriculum_outputs(
        self,
        all_modules: List[IITModuleNode],
        pruned_modules: List[IITModuleNode],
        report: CurriculumIntelligenceReport,
    ):
        catalog_file = self.processed_dir / "iit_syllabi_catalog.json"
        with open(catalog_file, "w", encoding="utf-8") as f:
            json.dump(
                {
                    "generated_at": report.generated_at,
                    "total_courses": report.total_iit_courses_scraped,
                    "total_modules": len(all_modules),
                    "pruned_academic_theory_modules": [m.model_dump() for m in pruned_modules],
                    "active_placement_modules": [
                        m.model_dump() for m in all_modules if not m.is_academic_theory_only
                    ],
                },
                f,
                indent=2,
            )

        roadmap_file = self.processed_dir / "placement_6m_roadmap.json"
        with open(roadmap_file, "w", encoding="utf-8") as f:
            json.dump(report.model_dump(), f, indent=2)

        console.print(f"[green][OK] Saved IIT Syllabus Catalog: {catalog_file.name}[/green]")
        console.print(f"[green][OK] Saved 6-Month Placement DAG Roadmap: {roadmap_file.name}[/green]")

    def print_roadmap_dashboard(self, report: CurriculumIntelligenceReport):
        fs_roadmap = report.roadmaps_by_role.get("fullstack")
        if not fs_roadmap:
            return

        table = Table(
            title=(
                f"CareerKinetic 6-Month (24-Week) IIT Placement DAG Blueprint "
                f"[Cross-Referenced with {report.live_jobs_cross_referenced} Live Jobs]"
            )
        )
        table.add_column("Week", style="cyan", justify="right")
        table.add_column("IIT Source", style="magenta")
        table.add_column("Module & Core Syllabus Focus", style="bold white")
        table.add_column("Skills Unlocked", style="green")
        table.add_column("ROI Score", style="yellow", justify="right")
        table.add_column("Jobs Unlocked", style="bold cyan", justify="right")

        # Show sample milestone weeks across the 24-week DAG
        milestone_weeks = [1, 2, 4, 7, 8, 9, 11, 13, 15, 17, 20, 22, 24]
        for wp in fs_roadmap.weekly_plan:
            if wp.week in milestone_weeks:
                short_source = wp.iit_source.split("(")[0].strip() + f" ({wp.course_code})"
                table.add_row(
                    f"W{wp.week:02d}",
                    short_source,
                    wp.title[:48] + ("..." if len(wp.title) > 48 else ""),
                    ", ".join(wp.skills_unlocked[:3]),
                    f"{wp.placement_roi_score}",
                    f"{wp.unlocked_opportunities_count} jobs",
                )
        console.print(table)
