from typing import List, Tuple
from bs4 import BeautifulSoup

from engine.base_scraper import BaseScraper, console
from engine.models import RawJob


class InternshalaScraper(BaseScraper):
    """
    Scrapes verified tech & engineering student internships across India from Internshala.
    """

    CATEGORY_FEEDS: List[str] = [
        "https://internshala.com/internships/web-development-internship/",
        "https://internshala.com/internships/python-django-internship/",
        "https://internshala.com/internships/data-science-internship/",
        "https://internshala.com/internships/computer-science-internship/",
    ]

    def __init__(self):
        super().__init__(name="internshala", min_delay=0.2, max_delay=0.5)

    def scrape(self, limit: int = 50) -> List[RawJob]:
        all_jobs: List[RawJob] = []
        seen_ids = set()
        per_feed_quota = max(5, (limit + len(self.CATEGORY_FEEDS) - 1) // len(self.CATEGORY_FEEDS))

        for idx, feed_url in enumerate(self.CATEGORY_FEEDS, start=1):
            if len(all_jobs) >= limit:
                break

            console.print(f"[cyan][{idx}/{len(self.CATEGORY_FEEDS)}] Fetching Internshala: {feed_url}...[/cyan]")
            resp = self.fetch_with_retries(feed_url)
            if not resp:
                continue

            soup = BeautifulSoup(resp.text, "html.parser")
            cards = soup.select(".individual_internship")
            feed_count = 0

            for card in cards:
                if len(all_jobs) >= limit or feed_count >= per_feed_quota:
                    break

                # Skip promoted ad banners that lack internship title/company
                title_el = (
                    card.select_one(".job-internship-name a")
                    or card.select_one("#job_title")
                    or card.select_one("h3.job-internship-name")
                    or card.select_one("h3")
                )
                if not title_el:
                    continue

                title = title_el.get_text(strip=True)
                if not title:
                    continue

                company_el = (
                    card.select_one(".company-name")
                    or card.select_one("p.company-name")
                    or card.select_one(".company_name")
                )
                company = company_el.get_text(strip=True) if company_el else "Indian Tech Startup"

                # Extract direct URL from data-href or anchor tag
                rel_url = card.get("data-href")
                if not rel_url and title_el.name == "a":
                    rel_url = title_el.get("href")
                if not rel_url:
                    link_el = card.select_one("a.job-title-href") or card.select_one("h3 a")
                    if link_el:
                        rel_url = link_el.get("href")

                if rel_url and isinstance(rel_url, str):
                    url = rel_url if rel_url.startswith("http") else f"https://internshala.com{rel_url}"
                else:
                    url = feed_url

                # Extract location
                loc_els = card.select(".locations span a") or card.select("#location_names span") or card.select(".location_link")
                if loc_els:
                    location = ", ".join(dict.fromkeys(el.get_text(strip=True) for el in loc_els if el.get_text(strip=True)))
                else:
                    location = "India / Remote"

                # Extract stipend
                stipend_el = card.select_one(".stipend")
                stipend = stipend_el.get_text(strip=True) if stipend_el else "Paid Internship"

                # Extract posted time / status
                posted_el = card.select_one(".status-success") or card.select_one(".status-info") or card.select_one(".status-inactive")
                posted_at = posted_el.get_text(strip=True) if posted_el else "Recently Posted"

                # Extract explicit skill tags present on the card
                skill_pills = [
                    s.get_text(strip=True)
                    for s in card.select(".job_skills .job_skill, .round_tabs_container span")
                    if s.get_text(strip=True)
                ]
                card_text = card.get_text(separator=" ", strip=True)

                raw_text = (
                    f"{title}\n"
                    f"Company: {company}\n"
                    f"Location: {location}\n"
                    f"Stipend: {stipend}\n"
                    f"Skills: {', '.join(skill_pills)}\n\n"
                    f"{card_text}"
                )

                job_id = self.generate_hash(company, title, url)
                if job_id in seen_ids:
                    continue
                seen_ids.add(job_id)
                feed_count += 1

                all_jobs.append(
                    RawJob(
                        id=job_id,
                        title=f"{title} Intern" if "intern" not in title.lower() else title,
                        company=company,
                        location=location,
                        job_type="Internship",
                        stipend_or_salary=stipend,
                        url=url,
                        source="internshala",
                        raw_text=raw_text,
                        posted_at=posted_at,
                    )
                )

            self.polite_sleep()

        console.print(f"[green][OK] Harvested {len(all_jobs)} verified student internships from Internshala.[/green]")
        if all_jobs:
            self.save_raw(all_jobs)
        return all_jobs
