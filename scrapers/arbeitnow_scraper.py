from datetime import datetime, timezone
from typing import List
from bs4 import BeautifulSoup

from engine.base_scraper import BaseScraper, console
from engine.models import RawJob


class ArbeitnowScraper(BaseScraper):
    """
    Scrapes verified global startup & remote tech jobs from Arbeitnow's public Job Board API.
    """

    TECH_KEYWORDS = (
        "software",
        "engineer",
        "developer",
        "frontend",
        "front-end",
        "backend",
        "back-end",
        "full stack",
        "full-stack",
        "fullstack",
        "data",
        "ai",
        "machine learning",
        "devops",
        "cloud",
        "python",
        "react",
        "java",
        "node",
        "security",
        "qa",
        "test",
        "architect",
        "wickler",
        "informatik",
    )

    def __init__(self):
        super().__init__(name="arbeitnow", min_delay=0.8, max_delay=1.5)
        self.api_url = "https://www.arbeitnow.com/api/job-board-api"

    def scrape(self, limit: int = 50) -> List[RawJob]:
        console.print("[cyan]Connecting to Arbeitnow Job Board API...[/cyan]")
        resp = self.fetch_with_retries(self.api_url, headers={"Accept": "application/json"})
        if not resp:
            console.print("[red]Failed to fetch Arbeitnow jobs.[/red]")
            return []

        try:
            payload = resp.json()
        except Exception as e:
            console.print(f"[red]Error parsing Arbeitnow JSON: {e}[/red]")
            return []

        items = payload.get("data", [])
        jobs: List[RawJob] = []

        for item in items:
            if len(jobs) >= limit:
                break
            if not isinstance(item, dict):
                continue

            title = (item.get("title") or "Software Engineer").strip()
            tags_lower = " ".join(item.get("tags") or []).lower()
            if not any(kw in title.lower() or kw in tags_lower for kw in self.TECH_KEYWORDS):
                continue
            company = (item.get("company_name") or "Tech Company").strip()
            url = (item.get("url") or "https://www.arbeitnow.com").strip()

            is_remote = item.get("remote", False)
            raw_loc = (item.get("location") or "").strip()
            location = f"Remote ({raw_loc})" if is_remote and raw_loc else ("Remote" if is_remote else (raw_loc or "Remote"))

            tags = item.get("tags") or []
            job_types = item.get("job_types") or []
            job_type = "Internship" if any("intern" in jt.lower() for jt in job_types) or "intern" in title.lower() else "Full-Time"

            desc_html = item.get("description") or ""
            clean_desc = BeautifulSoup(desc_html, "html.parser").get_text(separator="\n", strip=True)

            raw_text = (
                f"{title}\n"
                f"Company: {company}\n"
                f"Tags: {', '.join(tags)}\n\n"
                f"{clean_desc}"
            )

            created_at = item.get("created_at")
            if isinstance(created_at, (int, float)):
                posted_at = datetime.fromtimestamp(created_at, tz=timezone.utc).isoformat()
            else:
                posted_at = str(created_at) if created_at else None

            job_id = self.generate_hash(company, title, url)
            jobs.append(
                RawJob(
                    id=job_id,
                    title=title,
                    company=company,
                    location=location,
                    job_type=job_type,
                    stipend_or_salary=None,
                    url=url,
                    source="arbeitnow",
                    raw_text=raw_text,
                    posted_at=posted_at,
                )
            )

        console.print(f"[green][OK] Harvested {len(jobs)} active jobs from Arbeitnow.[/green]")
        if jobs:
            self.save_raw(jobs)
        return jobs
