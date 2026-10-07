from typing import List, Tuple
from bs4 import BeautifulSoup

from engine.base_scraper import BaseScraper, console
from engine.models import RawJob


class UnstopScraper(BaseScraper):
    """
    Scrapes India campus & early-career tech internships and fresher jobs from Unstop (formerly Dare2Compete).
    """

    ENDPOINTS: List[Tuple[str, str]] = [
        (
            "https://unstop.com/api/public/opportunity/search-result?opportunity=internships&per_page=40&oppstatus=open&domain=2",
            "Internship",
        ),
        (
            "https://unstop.com/api/public/opportunity/search-result?opportunity=jobs&per_page=40&oppstatus=open&domain=2",
            "Full-Time",
        ),
    ]

    NON_TECH_KEYWORDS = (
        "social media",
        "sales",
        "human resource",
        "hr intern",
        "content writer",
        "graphic design",
        "video editor",
        "marketing intern",
        "business development",
        "campus ambassador",
    )

    def __init__(self):
        super().__init__(name="unstop", min_delay=0.8, max_delay=1.8)

    def scrape(self, limit: int = 50) -> List[RawJob]:
        all_jobs: List[RawJob] = []
        seen_ids = set()
        per_endpoint_quota = max(5, (limit + len(self.ENDPOINTS) - 1) // len(self.ENDPOINTS))

        headers = {
            "Accept": "application/json, text/plain, */*",
            "Referer": "https://unstop.com/internships",
        }

        for api_url, default_job_type in self.ENDPOINTS:
            if len(all_jobs) >= limit:
                break

            console.print(f"[cyan]Connecting to Unstop API ({default_job_type}s)...[/cyan]")
            resp = self.fetch_with_retries(api_url, headers=headers)
            if not resp:
                continue

            try:
                payload = resp.json()
            except Exception as e:
                console.print(f"[yellow][unstop] Failed to parse JSON: {e}[/yellow]")
                continue

            data_block = payload.get("data", {})
            items = data_block.get("data", []) if isinstance(data_block, dict) else []
            endpoint_count = 0

            for item in items:
                if len(all_jobs) >= limit or endpoint_count >= per_endpoint_quota:
                    break
                if not isinstance(item, dict):
                    continue

                title = (item.get("title") or "").strip()
                if not title:
                    continue

                title_lower = title.lower()
                if any(kw in title_lower for kw in self.NON_TECH_KEYWORDS):
                    continue

                org = item.get("organisation")
                if isinstance(org, dict) and org.get("name"):
                    company = org.get("name").strip()
                else:
                    company = (item.get("company") or "Unstop Partner Company").strip()

                seo_url = (item.get("seo_url") or "").strip()
                if seo_url.startswith("http"):
                    url = seo_url
                elif seo_url:
                    url = f"https://unstop.com/{seo_url.lstrip('/')}"
                else:
                    url = f"https://unstop.com/o/{item.get('id', '')}"

                # Extract location from jobDetail or region
                job_detail = item.get("jobDetail") or item.get("job_detail") or {}
                locations = []
                if isinstance(job_detail, dict):
                    locs = job_detail.get("locations") or []
                    if isinstance(locs, list):
                        for loc in locs:
                            if isinstance(loc, str):
                                locations.append(loc)
                            elif isinstance(loc, dict) and loc.get("city"):
                                locations.append(loc.get("city"))
                region = item.get("region") or ""
                if locations:
                    location = ", ".join(locations[:3])
                elif region:
                    location = f"{region.capitalize()} (India)"
                else:
                    location = "India / Remote"

                # Extract skills from required_skills / filters / tags
                skill_tags = []
                req_skills = item.get("required_skills") or item.get("skills") or []
                if isinstance(req_skills, list):
                    for sk in req_skills:
                        if isinstance(sk, dict):
                            sk_name = sk.get("skill_name") or sk.get("name") or ""
                            if sk_name:
                                skill_tags.append(sk_name)
                        elif isinstance(sk, str):
                            skill_tags.append(sk)

                filters = item.get("filters") or []
                if isinstance(filters, list):
                    for flt in filters:
                        if isinstance(flt, dict) and flt.get("name"):
                            skill_tags.append(flt.get("name"))

                details_html = item.get("details") or item.get("description") or ""
                clean_details = BeautifulSoup(str(details_html), "html.parser").get_text(separator="\n", strip=True)

                raw_text = (
                    f"{title}\n"
                    f"Company: {company}\n"
                    f"Location: {location}\n"
                    f"Skills & Eligibility: {', '.join(skill_tags)}\n\n"
                    f"{clean_details}"
                )

                job_id = self.generate_hash(company, title, url)
                if job_id in seen_ids:
                    continue
                seen_ids.add(job_id)
                endpoint_count += 1

                all_jobs.append(
                    RawJob(
                        id=job_id,
                        title=title,
                        company=company,
                        location=location,
                        job_type=default_job_type,
                        stipend_or_salary=None,
                        url=url,
                        source="unstop",
                        raw_text=raw_text,
                        posted_at=item.get("start_date") or item.get("updated_at"),
                    )
                )

            self.polite_sleep()

        console.print(f"[green][OK] Harvested {len(all_jobs)} active opportunities from Unstop.[/green]")
        if all_jobs:
            self.save_raw(all_jobs)
        return all_jobs
