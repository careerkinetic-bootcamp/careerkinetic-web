from typing import List
from bs4 import BeautifulSoup
from engine.base_scraper import BaseScraper, console
from engine.models import RawJob

class HackerNewsScraper(BaseScraper):
    def __init__(self):
        super().__init__(name="hackernews", min_delay=0.5, max_delay=1.5)
        self.search_url = "https://hn.algolia.com/api/v1/search_by_date"

    def get_latest_whoishiring_story_id(self) -> str:
        """Finds the latest monthly 'Ask HN: Who is hiring?' thread."""
        params = {
            "query": "Ask HN: Who is hiring?",
            "tags": "story",
            "hitsPerPage": 3,
        }
        resp = self.fetch_with_retries(f"{self.search_url}?query=Ask%20HN:%20Who%20is%20hiring&tags=story&hitsPerPage=3")
        if not resp:
            return ""

        data = resp.json()
        hits = data.get("hits", [])
        for hit in hits:
            title = hit.get("title", "")
            if "Ask HN: Who is hiring?" in title:
                return str(hit.get("objectID", ""))
        return hits[0].get("objectID", "") if hits else ""

    def scrape(self, limit: int = 40) -> List[RawJob]:
        console.print("[cyan]Finding latest Hacker News 'Who is Hiring' thread...[/cyan]")
        story_id = self.get_latest_whoishiring_story_id()
        if not story_id:
            console.print("[red]Could not locate 'Who is Hiring' thread.[/red]")
            return []

        console.print(f"[cyan]Harvesting comments from thread ID: {story_id}...[/cyan]")
        url = f"{self.search_url}?tags=comment,story_{story_id}&hitsPerPage={min(limit, 100)}"
        resp = self.fetch_with_retries(url)
        if not resp:
            return []

        data = resp.json()
        hits = data.get("hits", [])
        jobs: List[RawJob] = []

        for hit in hits:
            comment_html = hit.get("comment_text", "")
            if not comment_html:
                continue

            # Convert HTML to clean plain text
            soup = BeautifulSoup(comment_html, "html.parser")
            lines = [line.strip() for line in soup.get_text(separator="\n").split("\n") if line.strip()]
            if not lines:
                continue

            first_line = lines[0]
            # Standard HN format: "Company | Role | Location | ..."
            parts = [p.strip() for p in first_line.split("|")]
            if len(parts) >= 2:
                company = parts[0]
                title = parts[1]
                location = parts[2] if len(parts) > 2 else "Remote / Onsite"
            else:
                company = "Tech Startup (HN)"
                title = first_line[:60]
                location = "Remote"

            clean_text = "\n".join(lines)
            job_url = f"https://news.ycombinator.com/item?id={hit.get('objectID')}"
            job_id = self.generate_hash(company, title, job_url)

            jobs.append(
                RawJob(
                    id=job_id,
                    title=title,
                    company=company,
                    location=location,
                    url=job_url,
                    source="hackernews",
                    raw_text=f"{title}\nCompany: {company}\nLocation: {location}\n\n{clean_text}",
                    posted_at=hit.get("created_at")
                )
            )

        console.print(f"[green][OK] Harvested {len(jobs)} active startup jobs from Hacker News.[/green]")
        if jobs:
            self.save_raw(jobs)
        return jobs
