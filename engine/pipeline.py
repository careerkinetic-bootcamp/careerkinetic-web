from collections import Counter, defaultdict
from datetime import datetime, timezone
import itertools
import json
from pathlib import Path
from typing import List, Dict

from rich.console import Console
from rich.table import Table

from engine.database import EnterpriseSQLiteWarehouse
from engine.models import (
    RawJob,
    ProcessedJob,
    SkillDetail,
    SkillDemandStat,
    RoleIntelligence,
    MarketIntelligenceReport,
)
from taxonomy.normalizer import SkillNormalizer

console = Console(legacy_windows=False)

class IntelligencePipeline:
    def __init__(self, warehouse: EnterpriseSQLiteWarehouse | None = None):
        self.normalizer = SkillNormalizer()
        self.processed_dir = Path(__file__).parent.parent / "data" / "processed"
        self.processed_dir.mkdir(parents=True, exist_ok=True)
        self.warehouse = warehouse or EnterpriseSQLiteWarehouse()

    def process_jobs(self, raw_jobs: List[RawJob]) -> MarketIntelligenceReport:
        # 1. Deduplicate by unique hash
        unique_raw: Dict[str, RawJob] = {}
        for job in raw_jobs:
            if job.id not in unique_raw:
                unique_raw[job.id] = job

        total_unique = len(unique_raw)
        console.print(f"[cyan]Processing {total_unique} unique jobs through Skill Normalizer...[/cyan]")

        processed_jobs: List[ProcessedJob] = []
        overall_skill_counts = Counter()
        skill_categories = {}
        role_job_counts = Counter()
        source_job_counts = Counter()
        role_skill_counts = defaultdict(Counter)
        pair_counts = Counter()

        for job in unique_raw.values():
            role_cat = self.normalizer.classify_role(job.title, job.raw_text)
            role_job_counts[role_cat] += 1
            source_job_counts[job.source] += 1

            matched_skills = self.normalizer.extract_skills(job.raw_text)
            skill_names = [s["name"] for s in matched_skills]
            
            for s in matched_skills:
                overall_skill_counts[s["name"]] += 1
                skill_categories[s["name"]] = s["category"]
                role_skill_counts[role_cat][s["name"]] += 1

            # Count co-occurrence pairs (e.g. React + TypeScript)
            if len(skill_names) >= 2:
                for a, b in itertools.combinations(sorted(skill_names), 2):
                    pair_counts[f"{a} + {b}"] += 1

            processed_jobs.append(
                ProcessedJob(
                    id=job.id,
                    title=job.title,
                    company=job.company,
                    location=job.location,
                    job_type=job.job_type,
                    stipend_or_salary=job.stipend_or_salary,
                    url=job.url,
                    source=job.source,
                    role_category=role_cat,
                    skills=skill_names,
                    skills_detailed=[SkillDetail(**s) for s in matched_skills],
                    posted_at=job.posted_at,
                    scraped_at=job.scraped_at,
                )
            )

        # 2. Compute Top Overall Skills
        top_overall: List[SkillDemandStat] = []
        for name, count in overall_skill_counts.most_common(20):
            pct = round((count / total_unique) * 100, 1) if total_unique > 0 else 0.0
            top_overall.append(
                SkillDemandStat(
                    skill_name=name,
                    category=skill_categories.get(name, "Other"),
                    job_count=count,
                    demand_percentage=pct,
                )
            )

        # 3. Compute Per-Role Intelligence
        roles_data: Dict[str, RoleIntelligence] = {}
        for role, count in role_job_counts.items():
            top_for_role: List[SkillDemandStat] = []
            for name, s_count in role_skill_counts[role].most_common(12):
                pct = round((s_count / count) * 100, 1) if count > 0 else 0.0
                top_for_role.append(
                    SkillDemandStat(
                        skill_name=name,
                        category=skill_categories.get(name, "Other"),
                        job_count=s_count,
                        demand_percentage=pct,
                    )
                )
            roles_data[role] = RoleIntelligence(
                role_category=role,
                sample_size=count,
                top_skills=top_for_role,
            )

        # 4. Top Synergy Pairs
        top_synergies = [
            {"pair": pair, "count": count, "frequency_pct": round((count / total_unique) * 100, 1)}
            for pair, count in pair_counts.most_common(10)
        ]

        report = MarketIntelligenceReport(
            generated_at=datetime.now(timezone.utc).isoformat(),
            total_jobs_analyzed=total_unique,
            source_breakdown=dict(source_job_counts),
            roles=roles_data,
            top_overall_skills=top_overall,
            top_synergy_pairs=top_synergies,
        )

        # Save processed data
        self.save_reports(processed_jobs, report)
        self.print_dashboard(report)

        return report

    def save_reports(self, processed_jobs: List[ProcessedJob], report: MarketIntelligenceReport):
        # 1. Full report
        report_file = self.processed_dir / "market_intelligence_report.json"
        with open(report_file, "w", encoding="utf-8") as f:
            json.dump(report.model_dump(), f, indent=2)

        # 2. Compact clean format for frontend (CareerKinetic LearnPage)
        frontend_summary = {
            "last_updated": report.generated_at,
            "sample_size": report.total_jobs_analyzed,
            "sources": report.source_breakdown,
            "roles": {
                role: [
                    {"skill": s.skill_name, "percentage": s.demand_percentage, "category": s.category}
                    for s in r_data.top_skills
                ]
                for role, r_data in report.roles.items()
            },
            "top_overall": [
                {"skill": s.skill_name, "percentage": s.demand_percentage, "category": s.category}
                for s in report.top_overall_skills[:10]
            ],
            "synergies": report.top_synergy_pairs[:5],
        }
        summary_file = self.processed_dir / "skills_summary.json"
        with open(summary_file, "w", encoding="utf-8") as f:
            json.dump(frontend_summary, f, indent=2)

        # 3. Verified Opportunities Feed (for CareerKinetic OpportunitiesPage)
        opportunities_file = self.processed_dir / "opportunities_feed.json"
        with open(opportunities_file, "w", encoding="utf-8") as f:
            json.dump(
                {
                    "last_updated": report.generated_at,
                    "total_opportunities": len(processed_jobs),
                    "sources": report.source_breakdown,
                    "jobs": [j.model_dump() for j in processed_jobs],
                },
                f,
                indent=2,
            )

        # 4. Sync to Idempotent SQLite Data Warehouse
        total_warehoused = self.warehouse.upsert_jobs(processed_jobs)
        self.warehouse.upsert_skill_telemetry(report.top_overall_skills)

        console.print(f"[green][OK] Saved Market Report: {report_file.name}[/green]")
        console.print(f"[green][OK] Saved Frontend Summary: {summary_file.name}[/green]")
        console.print(f"[green][OK] Saved Opportunities Feed: {opportunities_file.name} ({len(processed_jobs)} verified roles)[/green]")
        console.print(f"[green][OK] Synced to SQLite Warehouse: careerkinetic_intelligence.db ({total_warehoused} active cumulative jobs)[/green]")

    def print_dashboard(self, report: MarketIntelligenceReport):
        if report.source_breakdown:
            sources_str = " | ".join(f"[bold cyan]{k}[/bold cyan]: {v}" for k, v in report.source_breakdown.items())
            console.print(f"\n[bold white]Sources Harvested:[/bold white] {sources_str}\n")

        table = Table(title=f"CareerKinetic Skill Intelligence ({report.total_jobs_analyzed} Live Tech Jobs & Internships)")
        table.add_column("Rank", style="cyan", justify="right")
        table.add_column("Skill", style="bold white")
        table.add_column("Category", style="magenta")
        table.add_column("Demand %", style="green", justify="right")
        table.add_column("Job Count", style="yellow", justify="right")

        for idx, skill in enumerate(report.top_overall_skills[:10], start=1):
            table.add_row(
                str(idx),
                skill.skill_name,
                skill.category,
                f"{skill.demand_percentage}%",
                str(skill.job_count),
            )
        console.print(table)
