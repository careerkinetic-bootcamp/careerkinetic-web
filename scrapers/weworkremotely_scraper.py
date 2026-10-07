from typing import List
import warnings
from bs4 import BeautifulSoup, XMLParsedAsHTMLWarning

warnings.filterwarnings("ignore", category=XMLParsedAsHTMLWarning)

from engine.base_scraper import BaseScraper, console
from engine.models import RawJob

class WeWorkRemotelyScraper(BaseScraper):
    FEEDS = [
        "https://weworkremotely.com/categories/remote-full-stack-programming-jobs.rss",
        "https://weworkremotely.com/categories/remote-front-end-programming-jobs.rss",
        "https://weworkremotely.com/categories/remote-back-end-programming-jobs.rss",
    ]

    def __init__(self):
        super().__init__(name="weworkremotely", min_delay=1.0, max_delay=2.0)

    def scrape(self, limit: int = 50) -> List[RawJob]:
        all_jobs: List[RawJob] = []

        for feed_url in self.FEEDS:
            if len(all_jobs) >= limit:
                break

            console.print(f"[cyan]Fetching WeWorkRemotely feed: {feed_url}...[/cyan]")
            resp = self.fetch_with_retries(feed_url)
            if not resp:
                continue

            soup = BeautifulSoup(resp.text, "html.parser")
            items = soup.find_all("item")

            for item in items:
                if len(all_jobs) >= limit:
                    break

                raw_title = item.find("title").text if item.find("title") else "Software Engineer"
                # Often formatted as "Company: Title"
                if ":" in raw_title:
                    company, title = raw_title.split(":", 1)
                    company = company.strip()
                    title = title.strip()
                else:
                    company = "Unknown"
                    title = raw_title.strip()

                url = item.find("link").text if item.find("link") else "https://weworkremotely.com"
                pub_date = item.find("pubdate").text if item.find("pubdate") else None
                desc = item.find("description").text if item.find("description") else ""

                # Strip HTML tags from description if any
                clean_desc = BeautifulSoup(desc, "html.parser").get_text(separator="\n").strip()
                raw_text = f"{title}\nCompany: {company}\n\n{clean_desc}"

                job_id = self.generate_hash(company, title, url)
                all_jobs.append(
                    RawJob(
                        id=job_id,
                        title=title,
                        company=company,
                        location="Remote",
                        url=url,
                        source="weworkremotely",
                        raw_text=raw_text,
                        posted_at=pub_date
                    )
                )

            self.polite_sleep()

        console.print(f"[green][OK] Harvested {len(all_jobs)} active jobs from WeWorkRemotely.[/green]")
        if all_jobs:
            self.save_raw(all_jobs)
        return all_jobs
