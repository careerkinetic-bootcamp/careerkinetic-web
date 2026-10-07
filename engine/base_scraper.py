import hashlib
import json
import random
import socket
import time
from abc import ABC, abstractmethod
from datetime import datetime, timezone
from pathlib import Path
from typing import List, Optional
import httpx
from rich.console import Console

from engine.models import RawJob

# Force IPv4 DNS resolution (AF_INET) to prevent Windows AAAA DNS & IPv6 socket stalls
_orig_getaddrinfo = socket.getaddrinfo
def _ipv4_only_getaddrinfo(host, port, family=0, type=0, proto=0, flags=0):
    return _orig_getaddrinfo(host, port, socket.AF_INET, type, proto, flags)
socket.getaddrinfo = _ipv4_only_getaddrinfo

console = Console(legacy_windows=False)

USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:129.0) Gecko/20100101 Firefox/129.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15",
]

class BaseScraper(ABC):
    def __init__(self, name: str, min_delay: float = 0.3, max_delay: float = 0.8):
        self.name = name
        self.min_delay = min_delay
        self.max_delay = max_delay
        self.raw_data_dir = Path(__file__).parent.parent / "data" / "raw"
        self.raw_data_dir.mkdir(parents=True, exist_ok=True)
        transport = httpx.HTTPTransport(retries=1)
        timeout = httpx.Timeout(connect=5.0, read=10.0, write=5.0, pool=5.0)
        self._client = httpx.Client(transport=transport, timeout=timeout, follow_redirects=True)
        
    def get_headers(self, custom_headers: Optional[dict] = None) -> dict:
        headers = {
            "User-Agent": random.choice(USER_AGENTS),
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
            "DNT": "1",
            "Connection": "keep-alive",
        }
        if custom_headers:
            headers.update(custom_headers)
        return headers

    def polite_sleep(self):
        """Sleep with random jitter to avoid repetitive bot-like cadences."""
        sleep_time = random.uniform(self.min_delay, self.max_delay)
        time.sleep(sleep_time)

    def generate_hash(self, company: str, title: str, url: str) -> str:
        """Create a unique deterministic SHA-256 fingerprint for deduplication."""
        fingerprint = f"{company.strip().lower()}:{title.strip().lower()}:{url.strip()}".encode("utf-8")
        return hashlib.sha256(fingerprint).hexdigest()

    def fetch_with_retries(self, url: str, headers: Optional[dict] = None, max_retries: int = 3) -> Optional[httpx.Response]:
        """Fetch URL over persistent IPv4 connection pool with exponential backoff on transient errors."""
        effective_headers = self.get_headers(headers)
        for attempt in range(1, max_retries + 1):
            try:
                resp = self._client.get(url, headers=effective_headers)
                if resp.status_code == 200:
                    return resp
                elif resp.status_code == 429:
                    wait = attempt * 2.0
                    console.print(f"[yellow][{self.name}] Rate limited (429). Backing off for {wait}s...[/yellow]")
                    time.sleep(wait)
                else:
                    console.print(f"[yellow][{self.name}] HTTP {resp.status_code} for {url}. Attempt {attempt}/{max_retries}[/yellow]")
            except httpx.RequestError as exc:
                console.print(f"[red][{self.name}] Network error on {url}: {exc}. Attempt {attempt}/{max_retries}[/red]")
                time.sleep(1.0 * attempt)
        return None

    def save_raw(self, jobs: List[RawJob]) -> Path:
        """Saves raw jobs into json datalake."""
        timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
        filename = self.raw_data_dir / f"{self.name}_{timestamp}.json"
        
        with open(filename, "w", encoding="utf-8") as f:
            json.dump([j.model_dump() for j in jobs], f, indent=2)
            
        console.print(f"[green][OK] Saved {len(jobs)} raw jobs from {self.name} to {filename.name}[/green]")
        return filename

    @abstractmethod
    def scrape(self, limit: int = 50) -> List[RawJob]:
        """Execute scraping logic and return a list of RawJob instances."""
        pass
