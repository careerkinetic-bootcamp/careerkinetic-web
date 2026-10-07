import argparse
import sys
from typing import List

# Fix Windows console encoding for Unicode/emojis
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

from concurrent.futures import ThreadPoolExecutor, as_completed
from rich.console import Console

from engine.base_scraper import BaseScraper
from engine.dag_curriculum_engine import DAGCurriculumEngine
from engine.database import EnterpriseSQLiteWarehouse
from engine.models import RawJob
from engine.pipeline import IntelligencePipeline
from scrapers.remoteok_scraper import RemoteOKScraper
from scrapers.weworkremotely_scraper import WeWorkRemotelyScraper
from scrapers.hackernews_scraper import HackerNewsScraper
from scrapers.internshala_scraper import InternshalaScraper
from scrapers.unstop_scraper import UnstopScraper
from scrapers.arbeitnow_scraper import ArbeitnowScraper
from scrapers.iit_syllabus_scraper import IITSyllabusScraper

console = Console(legacy_windows=False)

SCRAPERS = {
    "internshala": InternshalaScraper,
    "unstop": UnstopScraper,
    "remoteok": RemoteOKScraper,
    "weworkremotely": WeWorkRemotelyScraper,
    "hackernews": HackerNewsScraper,
    "arbeitnow": ArbeitnowScraper,
}


def main():
    parser = argparse.ArgumentParser(
        description="CareerKinetic Enterprise Market & IIT Curriculum Intelligence Pipeline"
    )
    parser.add_argument(
        "--mode",
        choices=["all", "jobs", "curriculum"],
        default="all",
        help="Pipeline mode: 'jobs' (6 job boards), 'curriculum' (IIT Syllabus + 6M DAG), or 'all' (default)",
    )
    parser.add_argument(
        "--source",
        choices=["all", "internshala", "unstop", "remoteok", "weworkremotely", "hackernews", "arbeitnow"],
        default="all",
        help="Which job source adapter to run (default: all)",
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=30,
        help="Maximum jobs to fetch per source (default: 30)",
    )
    args = parser.parse_args()

    warehouse = EnterpriseSQLiteWarehouse()

    # ── PIPELINE 1: Live Job Market & Skill Intelligence ─────────────────────
    if args.mode in ("all", "jobs"):
        console.rule("[bold cyan]Pipeline 1: Live Job Market & Skill Intelligence (Parallel Engine)[/bold cyan]")

        sources_to_run: List[BaseScraper] = []
        if args.source == "all":
            sources_to_run = [cls() for cls in SCRAPERS.values()]
        else:
            sources_to_run = [SCRAPERS[args.source]()]

        all_raw_jobs: List[RawJob] = []

        if len(sources_to_run) > 1:
            console.print(f"[bold yellow]> Launching {len(sources_to_run)} scrapers concurrently (ThreadPoolExecutor)...[/bold yellow]")
            with ThreadPoolExecutor(max_workers=len(sources_to_run)) as executor:
                future_to_scraper = {
                    executor.submit(scraper.scrape, args.limit): scraper for scraper in sources_to_run
                }
                for future in as_completed(future_to_scraper):
                    scraper = future_to_scraper[future]
                    try:
                        jobs = future.result()
                        all_raw_jobs.extend(jobs)
                    except Exception as exc:
                        console.print(f"[red][{scraper.name}] Worker exception: {exc}[/red]")
        else:
            scraper = sources_to_run[0]
            console.print(f"\n[bold yellow]> Running Scraper: {scraper.name}[/bold yellow]")
            all_raw_jobs.extend(scraper.scrape(limit=args.limit))

        if all_raw_jobs:
            console.rule("[bold green]Data Normalization & Warehouse Upsert[/bold green]")
            pipeline = IntelligencePipeline(warehouse=warehouse)
            pipeline.process_jobs(all_raw_jobs)
        elif args.mode == "jobs":
            console.print("[red]No jobs were harvested. Please check network connection.[/red]")
            sys.exit(1)

    # ── PIPELINE 2: IIT Syllabus Extraction & 6-Month Placement DAG ──────────
    if args.mode in ("all", "curriculum") and args.source == "all":
        console.rule("[bold magenta]Pipeline 2: IIT Syllabus Scraper & 6-Month Placement DAG Engine[/bold magenta]")
        iit_scraper = IITSyllabusScraper()
        iit_modules = iit_scraper.scrape_iit_modules()

        dag_engine = DAGCurriculumEngine(warehouse=warehouse)
        dag_engine.build_6m_placement_roadmaps(iit_modules)

    stats = warehouse.get_warehouse_stats()
    console.rule("[bold cyan]Enterprise Pipeline Execution Complete[/bold cyan]")
    console.print(
        f"[bold green]✔ SQLite Warehouse Synced:[/bold green] "
        f"[cyan]{stats['active_jobs_in_warehouse']} active jobs[/cyan] | "
        f"[magenta]{stats['active_placement_modules']} IIT placement modules[/magenta] "
        f"({stats['pruned_theory_modules']} academic theory modules pruned) | "
        f"[yellow]{stats['roadmap_week_slots_generated']} DAG week slots[/yellow]"
    )
    console.print("[white]Outputs ready in [bold]data/processed/[/bold] and [bold]data/warehouse/careerkinetic_intelligence.db[/bold][/white]\n")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        console.print("\n[yellow]⚠ Scraper interrupted by user (Ctrl+C). Exiting cleanly.[/yellow]")
        sys.exit(0)

