import json
import re
from pathlib import Path
from typing import List, Dict, Set, Tuple

CATALOG_PATH = Path(__file__).parent / "skills_catalog.json"

class SkillNormalizer:
    def __init__(self, catalog_path: Path = CATALOG_PATH):
        with open(catalog_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        
        self.skills_data = data.get("skills", [])
        self.skill_patterns: List[Tuple[str, str, re.Pattern]] = []
        
        for item in self.skills_data:
            name = item["name"]
            category = item["category"]
            aliases = item.get("aliases", [name.lower()])
            
            # Build regex pattern for aliases
            escaped_aliases = []
            for alias in aliases:
                # If alias already has regex markers, keep it, otherwise escape and wrap with \b
                if "\\" in alias:
                    escaped_aliases.append(alias)
                else:
                    escaped_aliases.append(r"\b" + re.escape(alias) + r"\b")
            
            pattern_str = "|".join(escaped_aliases)
            compiled_pat = re.compile(pattern_str, re.IGNORECASE)
            self.skill_patterns.append((name, category, compiled_pat))
            
    def extract_skills(self, text: str) -> List[Dict[str, str]]:
        """
        Extracts all canonical skills from raw job text.
        Returns a list of dicts: [{'name': 'React', 'category': 'Frontend'}, ...]
        """
        if not text:
            return []
            
        matched_skills = {}
        for name, category, pattern in self.skill_patterns:
            if pattern.search(text):
                matched_skills[name] = {"name": name, "category": category}
                
        return list(matched_skills.values())

    def classify_role(self, title: str, description: str = "") -> str:
        """
        Classifies the job into: 'frontend', 'backend', 'fullstack', 'ai_ml', 'devops', or 'general_software'
        """
        text = f"{title} {description}".lower()
        title_lower = title.lower()
        
        if "full stack" in title_lower or "fullstack" in title_lower or "full-stack" in title_lower:
            return "fullstack"
        if "frontend" in title_lower or "front-end" in title_lower or "front end" in title_lower or "react developer" in title_lower:
            return "frontend"
        if "backend" in title_lower or "back-end" in title_lower or "back end" in title_lower or "api engineer" in title_lower:
            return "backend"
        if any(w in title_lower for w in ["ai ", "machine learning", "ml ", "data scientist", "llm"]):
            return "ai_ml"
        if any(w in title_lower for w in ["devops", "cloud engineer", "sre", "infrastructure"]):
            return "devops"
            
        # Fallback to description analysis
        if "frontend" in text and "backend" in text:
            return "fullstack"
        elif "frontend" in text:
            return "frontend"
        elif "backend" in text:
            return "backend"
        return "general_software"
