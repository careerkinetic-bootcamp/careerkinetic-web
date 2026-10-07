import contextlib
import json
import sqlite3
from datetime import datetime, timezone
from pathlib import Path
from typing import List, Dict, Any

from engine.models import (
    ProcessedJob,
    IITModuleNode,
    RolePlacementRoadmap6M,
    SkillDemandStat,
)


class EnterpriseSQLiteWarehouse:
    """
    Production-grade Idempotent SQLite Data Warehouse (WAL mode) with ON CONFLICT DO UPDATE (Upsert).
    Persists scraped jobs, IIT syllabus DAG nodes, and 6-month placement roadmaps across runs.
    """

    def __init__(self, db_path: Path | None = None):
        if db_path is None:
            warehouse_dir = Path(__file__).parent.parent / "data" / "warehouse"
            warehouse_dir.mkdir(parents=True, exist_ok=True)
            self.db_path = warehouse_dir / "careerkinetic_intelligence.db"
        else:
            self.db_path = db_path
            self.db_path.parent.mkdir(parents=True, exist_ok=True)

        self._init_schema()

    @contextlib.contextmanager
    def _connect(self):
        conn = sqlite3.connect(str(self.db_path), timeout=15.0)
        try:
            conn.row_factory = sqlite3.Row
            conn.execute("PRAGMA journal_mode=WAL;")
            conn.execute("PRAGMA synchronous=NORMAL;")
            conn.execute("PRAGMA foreign_keys=ON;")
            with conn:
                yield conn
        finally:
            conn.close()

    def _init_schema(self):
        with self._connect() as conn:
            conn.executescript(
                """
                CREATE TABLE IF NOT EXISTS scraped_jobs (
                    id TEXT PRIMARY KEY,
                    title TEXT NOT NULL,
                    company TEXT NOT NULL,
                    location TEXT,
                    job_type TEXT DEFAULT 'Full-Time',
                    stipend_or_salary TEXT,
                    url TEXT NOT NULL,
                    source TEXT NOT NULL,
                    role_category TEXT NOT NULL,
                    skills_json TEXT NOT NULL,
                    posted_at TEXT,
                    first_seen_at TEXT NOT NULL,
                    last_seen_at TEXT NOT NULL,
                    is_active INTEGER DEFAULT 1
                );

                CREATE INDEX IF NOT EXISTS idx_jobs_role ON scraped_jobs(role_category);
                CREATE INDEX IF NOT EXISTS idx_jobs_source ON scraped_jobs(source);

                CREATE TABLE IF NOT EXISTS iit_syllabus_modules (
                    id TEXT PRIMARY KEY,
                    course_code TEXT NOT NULL,
                    course_title TEXT NOT NULL,
                    iit_institute TEXT NOT NULL,
                    professor TEXT NOT NULL,
                    week_number INTEGER NOT NULL,
                    module_title TEXT NOT NULL,
                    atomic_topics_json TEXT NOT NULL,
                    skills_taught_json TEXT NOT NULL,
                    prerequisites_json TEXT NOT NULL,
                    target_roles_json TEXT NOT NULL,
                    estimated_hours INTEGER NOT NULL,
                    is_academic_theory_only INTEGER DEFAULT 0,
                    oa_interview_weight REAL DEFAULT 80.0,
                    hands_on_lab TEXT NOT NULL,
                    source_url TEXT NOT NULL,
                    content_hash TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                );

                CREATE TABLE IF NOT EXISTS placement_roadmaps_6m (
                    role_category TEXT NOT NULL,
                    week_number INTEGER NOT NULL,
                    phase_name TEXT NOT NULL,
                    module_id TEXT NOT NULL,
                    course_code TEXT NOT NULL,
                    title TEXT NOT NULL,
                    iit_source TEXT NOT NULL,
                    professor TEXT NOT NULL,
                    atomic_topics_json TEXT NOT NULL,
                    skills_unlocked_json TEXT NOT NULL,
                    prerequisites_satisfied_json TEXT NOT NULL,
                    study_hours INTEGER NOT NULL,
                    live_market_demand_pct REAL NOT NULL,
                    placement_roi_score REAL NOT NULL,
                    hands_on_deliverable TEXT NOT NULL,
                    unlocked_opportunities_count INTEGER DEFAULT 0,
                    updated_at TEXT NOT NULL,
                    PRIMARY KEY (role_category, week_number)
                );

                CREATE TABLE IF NOT EXISTS skill_market_telemetry (
                    skill_name TEXT PRIMARY KEY,
                    category TEXT NOT NULL,
                    job_count INTEGER NOT NULL,
                    demand_percentage REAL NOT NULL,
                    updated_at TEXT NOT NULL
                );
                """
            )

    def upsert_jobs(self, jobs: List[ProcessedJob]) -> int:
        now = datetime.now(timezone.utc).isoformat()
        with self._connect() as conn:
            for job in jobs:
                conn.execute(
                    """
                    INSERT INTO scraped_jobs (
                        id, title, company, location, job_type, stipend_or_salary,
                        url, source, role_category, skills_json, posted_at,
                        first_seen_at, last_seen_at, is_active
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
                    ON CONFLICT(id) DO UPDATE SET
                        title = excluded.title,
                        location = excluded.location,
                        job_type = excluded.job_type,
                        stipend_or_salary = COALESCE(excluded.stipend_or_salary, scraped_jobs.stipend_or_salary),
                        role_category = excluded.role_category,
                        skills_json = excluded.skills_json,
                        last_seen_at = excluded.last_seen_at,
                        is_active = 1;
                    """,
                    (
                        job.id,
                        job.title,
                        job.company,
                        job.location,
                        job.job_type,
                        job.stipend_or_salary,
                        job.url,
                        job.source,
                        job.role_category,
                        json.dumps(job.skills),
                        job.posted_at,
                        job.scraped_at or now,
                        now,
                    ),
                )
            total = conn.execute("SELECT COUNT(*) FROM scraped_jobs WHERE is_active = 1").fetchone()[0]
        return total

    def upsert_skill_telemetry(self, skills: List[SkillDemandStat]):
        now = datetime.now(timezone.utc).isoformat()
        with self._connect() as conn:
            for s in skills:
                conn.execute(
                    """
                    INSERT INTO skill_market_telemetry (
                        skill_name, category, job_count, demand_percentage, updated_at
                    ) VALUES (?, ?, ?, ?, ?)
                    ON CONFLICT(skill_name) DO UPDATE SET
                        category = excluded.category,
                        job_count = excluded.job_count,
                        demand_percentage = excluded.demand_percentage,
                        updated_at = excluded.updated_at;
                    """,
                    (s.skill_name, s.category, s.job_count, s.demand_percentage, now),
                )

    def upsert_iit_modules(self, modules: List[IITModuleNode]) -> int:
        now = datetime.now(timezone.utc).isoformat()
        with self._connect() as conn:
            for m in modules:
                conn.execute(
                    """
                    INSERT INTO iit_syllabus_modules (
                        id, course_code, course_title, iit_institute, professor,
                        week_number, module_title, atomic_topics_json, skills_taught_json,
                        prerequisites_json, target_roles_json, estimated_hours,
                        is_academic_theory_only, oa_interview_weight, hands_on_lab,
                        source_url, content_hash, updated_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ON CONFLICT(id) DO UPDATE SET
                        module_title = excluded.module_title,
                        atomic_topics_json = excluded.atomic_topics_json,
                        skills_taught_json = excluded.skills_taught_json,
                        prerequisites_json = excluded.prerequisites_json,
                        target_roles_json = excluded.target_roles_json,
                        is_academic_theory_only = excluded.is_academic_theory_only,
                        oa_interview_weight = excluded.oa_interview_weight,
                        hands_on_lab = excluded.hands_on_lab,
                        content_hash = excluded.content_hash,
                        updated_at = excluded.updated_at;
                    """,
                    (
                        m.id,
                        m.course_code,
                        m.course_title,
                        m.iit_institute,
                        m.professor,
                        m.week_number,
                        m.module_title,
                        json.dumps(m.atomic_topics),
                        json.dumps(m.skills_taught),
                        json.dumps(m.prerequisites),
                        json.dumps(m.target_roles),
                        m.estimated_hours,
                        1 if m.is_academic_theory_only else 0,
                        m.oa_interview_weight,
                        m.hands_on_lab,
                        m.source_url,
                        m.content_hash,
                        now,
                    ),
                )
            total = conn.execute("SELECT COUNT(*) FROM iit_syllabus_modules").fetchone()[0]
        return total

    def upsert_roadmaps(self, roadmaps: Dict[str, RolePlacementRoadmap6M]):
        now = datetime.now(timezone.utc).isoformat()
        with self._connect() as conn:
            for role, rm in roadmaps.items():
                for wp in rm.weekly_plan:
                    conn.execute(
                        """
                        INSERT INTO placement_roadmaps_6m (
                            role_category, week_number, phase_name, module_id, course_code,
                            title, iit_source, professor, atomic_topics_json,
                            skills_unlocked_json, prerequisites_satisfied_json, study_hours,
                            live_market_demand_pct, placement_roi_score, hands_on_deliverable,
                            unlocked_opportunities_count, updated_at
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                        ON CONFLICT(role_category, week_number) DO UPDATE SET
                            phase_name = excluded.phase_name,
                            module_id = excluded.module_id,
                            course_code = excluded.course_code,
                            title = excluded.title,
                            iit_source = excluded.iit_source,
                            professor = excluded.professor,
                            atomic_topics_json = excluded.atomic_topics_json,
                            skills_unlocked_json = excluded.skills_unlocked_json,
                            prerequisites_satisfied_json = excluded.prerequisites_satisfied_json,
                            study_hours = excluded.study_hours,
                            live_market_demand_pct = excluded.live_market_demand_pct,
                            placement_roi_score = excluded.placement_roi_score,
                            hands_on_deliverable = excluded.hands_on_deliverable,
                            unlocked_opportunities_count = excluded.unlocked_opportunities_count,
                            updated_at = excluded.updated_at;
                        """,
                        (
                            role,
                            wp.week,
                            wp.phase_name,
                            wp.module_id,
                            wp.course_code,
                            wp.title,
                            wp.iit_source,
                            wp.professor,
                            json.dumps(wp.atomic_topics),
                            json.dumps(wp.skills_unlocked),
                            json.dumps(wp.prerequisites_satisfied),
                            wp.study_hours,
                            wp.live_market_demand_pct,
                            wp.placement_roi_score,
                            wp.hands_on_deliverable,
                            wp.unlocked_opportunities_count,
                            now,
                        ),
                    )

    def get_warehouse_stats(self) -> Dict[str, Any]:
        with self._connect() as conn:
            jobs_count = conn.execute("SELECT COUNT(*) FROM scraped_jobs WHERE is_active = 1").fetchone()[0]
            iit_modules_count = conn.execute("SELECT COUNT(*) FROM iit_syllabus_modules").fetchone()[0]
            pruned_count = conn.execute("SELECT COUNT(*) FROM iit_syllabus_modules WHERE is_academic_theory_only = 1").fetchone()[0]
            roadmap_weeks = conn.execute("SELECT COUNT(*) FROM placement_roadmaps_6m").fetchone()[0]
            skills_tracked = conn.execute("SELECT COUNT(*) FROM skill_market_telemetry").fetchone()[0]
        return {
            "database_path": str(self.db_path),
            "active_jobs_in_warehouse": jobs_count,
            "total_iit_modules": iit_modules_count,
            "pruned_theory_modules": pruned_count,
            "active_placement_modules": iit_modules_count - pruned_count,
            "roadmap_week_slots_generated": roadmap_weeks,
            "canonical_skills_tracked": skills_tracked,
        }
