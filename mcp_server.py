import argparse
import json
import sys
from pathlib import Path
from typing import Dict, Any, List

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

from rich.console import Console
from rich.panel import Panel

from engine.database import EnterpriseSQLiteWarehouse

console = Console(legacy_windows=False)


class CareerKineticMCPServer:
    """
    Model Context Protocol (MCP) Server for CareerKinetic Curriculum & Job Intelligence.
    Supports both JSON-RPC 2.0 over stdio (for AI Agents / Claude / Cursor / Antigravity)
    and interactive CLI inspection (--demo / --tool) for Co-Founder demonstrations.
    """

    SERVER_INFO = {
        "name": "careerkinetic-curriculum-intelligence-mcp",
        "version": "2.0.0",
        "protocolVersion": "2024-11-05",
    }

    def __init__(self):
        self.processed_dir = Path(__file__).parent / "data" / "processed"
        self.warehouse = EnterpriseSQLiteWarehouse()

    def list_tools(self) -> List[Dict[str, Any]]:
        return [
            {
                "name": "list_iit_syllabi",
                "description": "Lists scraped IIT CSE & IIT Madras BS courses, professors, active DAG modules, and pruned 4-year theory modules.",
                "inputSchema": {"type": "object", "properties": {}},
            },
            {
                "name": "get_6m_placement_roadmap",
                "description": "Returns the 24-week (360-hour) topological DAG placement curriculum for a target engineering role.",
                "inputSchema": {
                    "type": "object",
                    "properties": {
                        "role": {
                            "type": "string",
                            "enum": ["fullstack", "backend", "frontend", "ai_ml"],
                            "default": "fullstack",
                        }
                    },
                },
            },
            {
                "name": "match_unlocked_jobs_for_week",
                "description": "Given a student's completed week (1..24) in the IIT 6-month roadmap, returns unlocked skills and matched live internships/jobs.",
                "inputSchema": {
                    "type": "object",
                    "properties": {
                        "role": {"type": "string", "default": "fullstack"},
                        "completed_week": {"type": "integer", "minimum": 1, "maximum": 24, "default": 16},
                    },
                },
            },
            {
                "name": "get_live_skill_intelligence",
                "description": "Returns live market skill demand percentages and co-occurrence synergy pairs from 6 job boards.",
                "inputSchema": {"type": "object", "properties": {}},
            },
            {
                "name": "get_warehouse_health",
                "description": "Returns live row counts and DAG status from the SQLite data warehouse (careerkinetic_intelligence.db).",
                "inputSchema": {"type": "object", "properties": {}},
            },
        ]

    # ── MCP Tool Implementations ──────────────────────────────────────────────

    def tool_list_iit_syllabi(self) -> Dict[str, Any]:
        catalog_path = self.processed_dir / "iit_syllabi_catalog.json"
        if not catalog_path.exists():
            return {"error": "Run `python main.py --mode curriculum` first to populate IIT catalog."}
        with open(catalog_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        courses_summary: Dict[str, Dict[str, Any]] = {}
        for mod in data.get("active_placement_modules", []):
            code = mod["course_code"]
            if code not in courses_summary:
                courses_summary[code] = {
                    "course_code": code,
                    "course_title": mod["course_title"],
                    "iit_institute": mod["iit_institute"],
                    "professor": mod["professor"],
                    "active_modules_count": 0,
                    "source_url": mod["source_url"],
                }
            courses_summary[code]["active_modules_count"] += 1

        return {
            "total_courses": len(courses_summary),
            "active_placement_modules": len(data.get("active_placement_modules", [])),
            "pruned_theory_modules": len(data.get("pruned_academic_theory_modules", [])),
            "courses": list(courses_summary.values()),
            "pruned_examples": [
                m["module_title"] for m in data.get("pruned_academic_theory_modules", [])[:4]
            ],
        }

    def tool_get_6m_placement_roadmap(self, role: str = "fullstack") -> Dict[str, Any]:
        roadmap_path = self.processed_dir / "placement_6m_roadmap.json"
        if not roadmap_path.exists():
            return {"error": "Run `python main.py --mode curriculum` first."}
        with open(roadmap_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        roadmaps = data.get("roadmaps_by_role", {})
        return roadmaps.get(role, roadmaps.get("fullstack", {}))

    def tool_match_unlocked_jobs_for_week(
        self, role: str = "fullstack", completed_week: int = 16
    ) -> Dict[str, Any]:
        rm = self.tool_get_6m_placement_roadmap(role)
        if "error" in rm:
            return rm

        cumulative_skills = set()
        for wp in rm.get("weekly_plan", []):
            if wp["week"] <= completed_week:
                cumulative_skills.update(wp.get("skills_unlocked", []))

        opps_path = self.processed_dir / "opportunities_feed.json"
        matched_jobs = []
        if opps_path.exists():
            with open(opps_path, "r", encoding="utf-8") as f:
                opps_data = json.load(f)
            for job in opps_data.get("jobs", []):
                req = job.get("skills", [])
                if not req:
                    continue
                overlap = [s for s in req if s in cumulative_skills]
                if len(overlap) >= max(1, (len(req) + 1) // 2) or len(overlap) >= 2:
                    matched_jobs.append(
                        {
                            "title": job["title"],
                            "company": job["company"],
                            "job_type": job.get("job_type", "Full-Time"),
                            "stipend_or_salary": job.get("stipend_or_salary"),
                            "source": job["source"],
                            "matched_skills": overlap,
                            "url": job["url"],
                        }
                    )

        matched_jobs.sort(
            key=lambda x: (
                len(x["matched_skills"]),
                1 if x["source"] in ("internshala", "unstop") else 0,
            ),
            reverse=True,
        )

        return {
            "role": role,
            "completed_week": completed_week,
            "cumulative_iit_skills_mastered": sorted(cumulative_skills),
            "total_unlocked_opportunities": len(matched_jobs),
            "top_matched_opportunities": matched_jobs[:8],
        }

    def tool_get_live_skill_intelligence(self) -> Dict[str, Any]:
        summary_path = self.processed_dir / "skills_summary.json"
        if not summary_path.exists():
            return {"error": "Run `python main.py` first."}
        with open(summary_path, "r", encoding="utf-8") as f:
            return json.load(f)

    def tool_get_warehouse_health(self) -> Dict[str, Any]:
        return self.warehouse.get_warehouse_stats()

    def call_tool(self, name: str, arguments: Dict[str, Any] | None = None) -> Dict[str, Any]:
        args = arguments or {}
        if name == "list_iit_syllabi":
            return self.tool_list_iit_syllabi()
        elif name == "get_6m_placement_roadmap":
            return self.tool_get_6m_placement_roadmap(role=args.get("role", "fullstack"))
        elif name == "match_unlocked_jobs_for_week":
            return self.tool_match_unlocked_jobs_for_week(
                role=args.get("role", "fullstack"),
                completed_week=int(args.get("completed_week", 16)),
            )
        elif name == "get_live_skill_intelligence":
            return self.tool_get_live_skill_intelligence()
        elif name == "get_warehouse_health":
            return self.tool_get_warehouse_health()
        return {"error": f"Unknown MCP tool: {name}"}

    def run_stdio_jsonrpc(self):
        """Standard JSON-RPC 2.0 loop over stdin/stdout for MCP clients."""
        for line in sys.stdin:
            line = line.strip()
            if not line:
                continue
            try:
                req = json.loads(line)
                req_id = req.get("id")
                method = req.get("method")
                params = req.get("params") or {}

                if method == "initialize":
                    result = {
                        "protocolVersion": self.SERVER_INFO["protocolVersion"],
                        "serverInfo": self.SERVER_INFO,
                        "capabilities": {"tools": {}},
                    }
                elif method == "tools/list":
                    result = {"tools": self.list_tools()}
                elif method == "tools/call":
                    tool_name = params.get("name", "")
                    tool_args = params.get("arguments", {})
                    output = self.call_tool(tool_name, tool_args)
                    result = {
                        "content": [{"type": "text", "text": json.dumps(output, indent=2)}]
                    }
                else:
                    result = {"status": "ok"}

                if req_id is not None:
                    resp = {"jsonrpc": "2.0", "id": req_id, "result": result}
                    sys.stdout.write(json.dumps(resp) + "\n")
                    sys.stdout.flush()
            except Exception as exc:
                err_resp = {
                    "jsonrpc": "2.0",
                    "id": None,
                    "error": {"code": -32603, "message": str(exc)},
                }
                sys.stdout.write(json.dumps(err_resp) + "\n")
                sys.stdout.flush()


def main():
    parser = argparse.ArgumentParser(description="CareerKinetic MCP Server (IIT Curriculum & Job Intelligence)")
    parser.add_argument("--demo", action="store_true", help="Run interactive MCP Tool demonstration in terminal")
    parser.add_argument("--tool", type=str, help="Call a specific MCP tool by name")
    parser.add_argument("--role", type=str, default="fullstack", help="Role argument for MCP tool")
    parser.add_argument("--week", type=int, default=16, help="Completed week (1..24) for job unlock matching")
    args = parser.parse_args()

    server = CareerKineticMCPServer()

    if args.tool:
        output = server.call_tool(args.tool, {"role": args.role, "completed_week": args.week})
        console.print_json(data=output)
        return

    if args.demo:
        console.rule("[bold cyan]CareerKinetic MCP Server — Live Tool Inspection[/bold cyan]")
        console.print(Panel.fit(
            f"[bold green]Server:[/bold green] {server.SERVER_INFO['name']} v{server.SERVER_INFO['version']}\n"
            f"[bold green]Registered MCP Tools:[/bold green] {', '.join(t['name'] for t in server.list_tools())}",
            title="Model Context Protocol (MCP) Status",
        ))

        console.print("\n[bold yellow]1. MCP Tool Call -> get_warehouse_health()[/bold yellow]")
        console.print_json(data=server.call_tool("get_warehouse_health"))

        console.print("\n[bold yellow]2. MCP Tool Call -> list_iit_syllabi()[/bold yellow]")
        console.print_json(data=server.call_tool("list_iit_syllabi"))

        console.print(f"\n[bold yellow]3. MCP Tool Call -> match_unlocked_jobs_for_week(role='{args.role}', completed_week={args.week})[/bold yellow]")
        console.print_json(data=server.call_tool("match_unlocked_jobs_for_week", {"role": args.role, "completed_week": args.week}))
        return

    # Default: run standard JSON-RPC 2.0 MCP server over stdio
    server.run_stdio_jsonrpc()


if __name__ == "__main__":
    main()
