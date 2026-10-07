from datetime import datetime, timezone
from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field

class RawJob(BaseModel):
    id: str = Field(description="Unique SHA-256 hash of job")
    title: str
    company: str
    location: Optional[str] = "Remote"
    job_type: str = "Full-Time"
    stipend_or_salary: Optional[str] = None
    url: str
    source: str
    raw_text: str
    posted_at: Optional[str] = None
    scraped_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class SkillDetail(BaseModel):
    name: str
    category: str

class ProcessedJob(BaseModel):
    id: str
    title: str
    company: str
    location: Optional[str] = "Remote"
    job_type: str = "Full-Time"
    stipend_or_salary: Optional[str] = None
    url: str
    source: str
    role_category: str
    skills: List[str]
    skills_detailed: List[SkillDetail]
    posted_at: Optional[str] = None
    scraped_at: str

class SkillDemandStat(BaseModel):
    skill_name: str
    category: str
    job_count: int
    demand_percentage: float

class RoleIntelligence(BaseModel):
    role_category: str
    sample_size: int
    top_skills: List[SkillDemandStat]

class MarketIntelligenceReport(BaseModel):
    generated_at: str
    total_jobs_analyzed: int
    source_breakdown: Dict[str, int] = Field(default_factory=dict)
    roles: Dict[str, RoleIntelligence]
    top_overall_skills: List[SkillDemandStat]
    top_synergy_pairs: List[Dict[str, Any]]


# ──────────────────────────────────────────────────────────────────────────────
# Enterprise IIT Syllabus & 6-Month DAG Placement Models
# ──────────────────────────────────────────────────────────────────────────────

class IITModuleNode(BaseModel):
    id: str = Field(description="Deterministic SHA-256 hash of institute:course_code:week")
    course_code: str
    course_title: str
    iit_institute: str
    professor: str
    week_number: int
    module_title: str
    atomic_topics: List[str]
    skills_taught: List[str]
    prerequisites: List[str] = Field(default_factory=list, description="Prerequisite module IDs for DAG ordering")
    target_roles: List[str] = Field(default_factory=list)
    estimated_hours: int = 15
    is_academic_theory_only: bool = False
    oa_interview_weight: float = Field(default=80.0, description="0-100 importance in placement OAs & technical interviews")
    hands_on_lab: str
    source_url: str
    content_hash: str
    scraped_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class PlacementWeekPlan(BaseModel):
    week: int
    phase_name: str
    module_id: str
    course_code: str
    title: str
    iit_source: str
    professor: str
    atomic_topics: List[str]
    skills_unlocked: List[str]
    prerequisites_satisfied: List[str]
    study_hours: int
    live_market_demand_pct: float
    placement_roi_score: float
    hands_on_deliverable: str
    unlocked_opportunities_count: int = 0


class RolePlacementRoadmap6M(BaseModel):
    role_category: str
    role_title: str
    total_weeks: int = 24
    total_hours: int = 360
    iit_institutes_referenced: List[str]
    pruned_theory_modules_count: int
    dag_topological_order_verified: bool
    weekly_plan: List[PlacementWeekPlan]


class CurriculumIntelligenceReport(BaseModel):
    generated_at: str
    total_iit_courses_scraped: int
    total_iit_modules_extracted: int
    total_theory_modules_pruned: int
    live_jobs_cross_referenced: int
    roadmaps_by_role: Dict[str, RolePlacementRoadmap6M]

