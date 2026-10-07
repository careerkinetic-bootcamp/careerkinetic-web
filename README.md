# CareerKinetic Enterprise Market & IIT Curriculum Intelligence Engine

Production-grade **Medallion ELT Data Lakehouse (`Bronze -> Silver -> Gold`)**, **IIT Syllabus Prerequisite DAG Engine**, **Idempotent SQLite Data Warehouse**, and **Model Context Protocol (MCP) Server** for CareerKinetic.

---

## Enterprise Architecture Overview

```
careerkinetic-scraper/
├── main.py                         # Parallel CLI Orchestrator (--mode all | jobs | curriculum)
├── mcp_server.py                   # JSON-RPC 2.0 MCP Server + Interactive CLI Inspector (--demo)
├── taxonomy/
│   ├── skills_catalog.json         # 45+ canonical tech skills with word-boundary (\b) regex aliases
│   └── normalizer.py               # Token-boundary entity extractor & role classifier
├── engine/
│   ├── models.py                   # Strict Pydantic contracts (RawJob, IITModuleNode, RolePlacementRoadmap6M)
│   ├── base_scraper.py             # IPv4-enforced HTTP pool, User-Agent rotation, backoff, SHA-256 ID
│   ├── pipeline.py                 # Job skill demand %, role intelligence & co-occurrence synergy pairs
│   ├── dag_curriculum_engine.py    # Kahn's Topological Sort DAG + 4-Year Theory Pruner + 6M ROI Scorer
│   └── database.py                 # WAL-mode SQLite Data Warehouse with ON CONFLICT DO UPDATE (Upsert)
├── scrapers/
│   ├── iit_syllabus_scraper.py     # IIT Madras BS, IIT Bombay, IIT Kharagpur & NPTEL syllabus adapter
│   ├── internshala_scraper.py      # India student tech internships adapter (Web, Python, Data, CS)
│   ├── unstop_scraper.py           # India campus internships & fresher engineering jobs adapter
│   ├── remoteok_scraper.py         # RemoteOK developer jobs adapter
│   ├── weworkremotely_scraper.py   # WeWorkRemotely RSS feed adapter
│   ├── hackernews_scraper.py       # YC "Ask HN: Who is hiring?" startup jobs adapter
│   └── arbeitnow_scraper.py        # Arbeitnow global startup & remote engineering API adapter
├── tests/
│   └── test_pipeline.py            # 8 automated regression tests (DAG acyclicity, SHA-256, MCP, regex)
└── data/
    ├── raw/                        # Bronze Layer: Immutable raw JSON snapshots (jobs + syllabi/)
    ├── processed/                  # Gold Layer: Frontend-ready JSON feeds
    └── warehouse/                  # Relational Layer: careerkinetic_intelligence.db (SQLite WAL)
```

---

## Quickstart & Co-Founder Demo Commands

### 1. Run Full Dual Pipeline (Parallel 6 Job Boards + IIT 6-Month Placement DAG)
```powershell
cd C:\Users\Dell\OneDrive\Desktop\lucky\careerkinetic-scraper
.\.venv\Scripts\python.exe main.py --mode all --limit 30
```

### 2. Run Only the IIT Syllabus & 6-Month DAG Curriculum Engine (~2 seconds)
```powershell
.\.venv\Scripts\python.exe main.py --mode curriculum
```

### 3. Run the Model Context Protocol (MCP) Server Live Demo
```powershell
.\.venv\Scripts\python.exe mcp_server.py --demo --role fullstack --week 16
```

### 4. Call a Specific MCP Tool Directly
```powershell
.\.venv\Scripts\python.exe mcp_server.py --tool list_iit_syllabi
.\.venv\Scripts\python.exe mcp_server.py --tool get_6m_placement_roadmap --role ai_ml
.\.venv\Scripts\python.exe mcp_server.py --tool match_unlocked_jobs_for_week --role fullstack --week 16
.\.venv\Scripts\python.exe mcp_server.py --tool get_warehouse_health
```

### 5. Run the 8 Automated Unit Tests
```powershell
.\.venv\Scripts\python.exe -m unittest discover tests -v
```

---

## Gold Layer & Warehouse Outputs

* **[`data/processed/placement_6m_roadmap.json`](data/processed/placement_6m_roadmap.json)**: 24-Week (360-Hour) topologically sorted IIT Placement Curriculum per role (`fullstack`, `backend`, `frontend`, `ai_ml`) with live market demand % and cumulative unlocked job counts.
* **[`data/processed/iit_syllabi_catalog.json`](data/processed/iit_syllabi_catalog.json)**: Full catalog of active IIT placement modules vs. pruned 4-year theoretical proof modules.
* **[`data/processed/skills_summary.json`](data/processed/skills_summary.json)**: Live skill demand % and synergy pairs across 6 job boards.
* **[`data/processed/opportunities_feed.json`](data/processed/opportunities_feed.json)**: Deduplicated, skill-tagged internships & full-time roles.
* **[`data/warehouse/careerkinetic_intelligence.db`](data/warehouse/careerkinetic_intelligence.db)**: Persistent SQLite WAL data warehouse with idempotent `ON CONFLICT DO UPDATE` upserts.
