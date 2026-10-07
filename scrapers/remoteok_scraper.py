from typing import List
from engine.base_scraper import BaseScraper, console
from engine.models import RawJob

class RemoteOKScraper(BaseScraper):
    def __init__(self):
        super().__init__(name="remoteok", min_delay=1.0, max_delay=2.0)
        self.api_url = "https://remoteok.com/api"

    def scrape(self, limit: int = 50) -> List[RawJob]:
        console.print(f"[cyan]Connecting to RemoteOK API...[/cyan]")
        resp = self.fetch_with_retries(self.api_url)
        if not resp:
            console.print("[red]Failed to fetch RemoteOK jobs.[/red]")
            return []

        try:
            data = resp.json()
        except Exception as e:
            console.print(f"[red]Error parsing RemoteOK JSON: {e}[/red]")
            return []

        # The first item in remoteok API is often a legal/disclaimer object, skip it if 'id' or 'position' is missing
        job_items = [item for item in data if isinstance(item, dict) and "position" in item]
        
        jobs: List[RawJob] = []
        for item in job_items[:limit]:
            title = item.get("position", "Software Engineer")
            company = item.get("company", "Unknown")
            url = item.get("url", f"https://remoteok.com/remote-jobs/{item.get('id', '')}")
            location = item.get("location", "Remote")
            raw_text = f"{title}\n{company}\nTags: {', '.join(item.get('tags', []))}\n\n{item.get('description', '')}"
            posted_at = item.get("date", None)
            
            job_id = self.generate_hash(company, title, url)
            jobs.append(
                RawJob(
                    id=job_id,
                    title=title,
                    company=company,
                    location=location,
                    url=url,
                    source="remoteok",
                    raw_text=raw_text,
                    posted_at=posted_at
                )
            )

        console.print(f"[green][OK] Harvested {len(jobs)} active jobs from RemoteOK.[/green]")
        if jobs:
            self.save_raw(jobs)
        return jobs
