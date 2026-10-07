from pathlib import Path
import tempfile
import unittest
from engine.base_scraper import BaseScraper
from engine.database import EnterpriseSQLiteWarehouse
from engine.models import RawJob
from engine.pipeline import IntelligencePipeline
from taxonomy.normalizer import SkillNormalizer

class DummyScraper(BaseScraper):
    def scrape(self, limit: int = 5):
        return []

class TestScraperPipeline(unittest.TestCase):
    def setUp(self):
        self._tmp_dir = tempfile.TemporaryDirectory()
        tmp_path = Path(self._tmp_dir.name)
        self.warehouse = EnterpriseSQLiteWarehouse(db_path=tmp_path / "test_warehouse.db")
        self.normalizer = SkillNormalizer()
        self.pipeline = IntelligencePipeline(warehouse=self.warehouse)
        self.pipeline.processed_dir = tmp_path
        self.scraper = DummyScraper(name="dummy")

    def tearDown(self):
        self._tmp_dir.cleanup()

    def test_skill_normalizer_exact_extraction(self):
        text = "We are hiring a Full-Stack Engineer skilled in React 18, TypeScript, Node.js, and PostgreSQL with Docker."
        extracted = self.normalizer.extract_skills(text)
        names = [s["name"] for s in extracted]
        
        self.assertIn("React", names)
        self.assertIn("TypeScript", names)
        self.assertIn("Node.js", names)
        self.assertIn("PostgreSQL", names)
        self.assertIn("Docker", names)

    def test_role_classification(self):
        self.assertEqual(self.normalizer.classify_role("Senior Full Stack Developer"), "fullstack")
        self.assertEqual(self.normalizer.classify_role("Lead Frontend Engineer (React/Next.js)"), "frontend")
        self.assertEqual(self.normalizer.classify_role("Backend Systems Engineer (Go/FastAPI)"), "backend")
        self.assertEqual(self.normalizer.classify_role("Applied AI & Machine Learning Scientist"), "ai_ml")
        self.assertEqual(self.normalizer.classify_role("DevOps / Cloud Infrastructure Engineer"), "devops")

    def test_sha256_job_deduplication(self):
        hash1 = self.scraper.generate_hash("Stripe", "Backend Engineer", "https://stripe.com/jobs/1")
        hash2 = self.scraper.generate_hash("Stripe", "Backend Engineer", "https://stripe.com/jobs/1")
        hash3 = self.scraper.generate_hash("Google", "Backend Engineer", "https://google.com/jobs/2")

        # Hashes for identical job must match exactly
        self.assertEqual(hash1, hash2)
        # Different jobs must have different hashes
        self.assertNotEqual(hash1, hash3)

    def test_pipeline_deduplication_and_metrics(self):
        # Create duplicate raw jobs
        raw_jobs = [
            RawJob(
                id="hash-1",
                title="Full Stack Engineer",
                company="Airbnb",
                url="https://airbnb.com/1",
                source="test",
                raw_text="Full-Stack role requiring React and TypeScript."
            ),
            RawJob(
                id="hash-1", # Duplicate id
                title="Full Stack Engineer",
                company="Airbnb",
                url="https://airbnb.com/1",
                source="test",
                raw_text="Full-Stack role requiring React and TypeScript."
            ),
            RawJob(
                id="hash-2",
                title="Python Backend Dev",
                company="Netflix",
                url="https://netflix.com/2",
                source="test",
                raw_text="Backend role with Python and PostgreSQL."
            ),
        ]

        report = self.pipeline.process_jobs(raw_jobs)
        # Should deduplicate from 3 to 2 unique jobs
        self.assertEqual(report.total_jobs_analyzed, 2)
        
        # Check skill demand calculations
        skill_names = [s.skill_name for s in report.top_overall_skills]
        self.assertIn("React", skill_names)
        self.assertIn("TypeScript", skill_names)
        self.assertIn("Python", skill_names)
        self.assertEqual(report.source_breakdown.get("test"), 2)

    def test_india_internship_metadata_and_source_breakdown(self):
        raw_jobs = [
            RawJob(
                id="intern-1",
                title="Full Stack Web Development Intern",
                company="Razorpay",
                location="Bangalore, India",
                job_type="Internship",
                stipend_or_salary="₹25,000 /month",
                url="https://internshala.com/internship/detail/1",
                source="internshala",
                raw_text="Hiring Full Stack Intern skilled in React, Node.js, TypeScript, and MongoDB.",
            ),
            RawJob(
                id="unstop-1",
                title="Software Engineer (Fresher)",
                company="Flipkart",
                location="Bengaluru",
                job_type="Full-Time",
                url="https://unstop.com/jobs/flipkart-1",
                source="unstop",
                raw_text="Backend engineering role using Java, Spring Boot, MySQL, Redis, and Docker.",
            ),
        ]
        report = self.pipeline.process_jobs(raw_jobs)
        self.assertEqual(report.total_jobs_analyzed, 2)
        self.assertEqual(report.source_breakdown.get("internshala"), 1)
        self.assertEqual(report.source_breakdown.get("unstop"), 1)

    def test_scraper_registry_has_six_sources(self):
        from main import SCRAPERS
        expected = {"internshala", "unstop", "remoteok", "weworkremotely", "hackernews", "arbeitnow"}
        self.assertEqual(set(SCRAPERS.keys()), expected)

    def test_iit_dag_topological_sort_and_theory_pruning(self):
        from scrapers.iit_syllabus_scraper import IITSyllabusScraper
        from engine.dag_curriculum_engine import DAGCurriculumEngine
        from engine.models import IITModuleNode

        iit_scraper = IITSyllabusScraper()
        specs = iit_scraper._get_canonical_iit_curriculum_specs()
        modules = [
            IITModuleNode(
                id=s["id"],
                course_code=s["course_code"],
                course_title=s["course_title"],
                iit_institute=s["iit_institute"],
                professor=s["professor"],
                week_number=s["week_number"],
                module_title=s["module_title"],
                atomic_topics=s["atomic_topics"],
                skills_taught=s.get("explicit_skills", []),
                prerequisites=s.get("prerequisites", []),
                target_roles=s["target_roles"],
                is_academic_theory_only=s.get("is_academic_theory_only", False),
                oa_interview_weight=s.get("oa_interview_weight", 85.0),
                hands_on_lab=s["hands_on_lab"],
                source_url=s["source_url"],
                content_hash="test-hash",
            )
            for s in specs
        ]

        dag_engine = DAGCurriculumEngine()
        active, pruned = dag_engine.prune_academic_theory(modules)
        self.assertEqual(len(active), 24)
        self.assertEqual(len(pruned), 6)

        ordered, is_acyclic = dag_engine.topological_sort_dag(active)
        self.assertTrue(is_acyclic)
        self.assertEqual(len(ordered), 24)

        # Verify every prerequisite appears strictly before its dependent node
        position_map = {m.id: idx for idx, m in enumerate(ordered)}
        for m in ordered:
            for prereq_id in m.prerequisites:
                self.assertLess(position_map[prereq_id], position_map[m.id])

    def test_mcp_server_tool_registry(self):
        from mcp_server import CareerKineticMCPServer

        mcp = CareerKineticMCPServer()
        tool_names = [t["name"] for t in mcp.list_tools()]
        self.assertIn("list_iit_syllabi", tool_names)
        self.assertIn("get_6m_placement_roadmap", tool_names)
        self.assertIn("match_unlocked_jobs_for_week", tool_names)
        self.assertIn("get_warehouse_health", tool_names)


if __name__ == "__main__":
    unittest.main()
