"""
Skill extraction: matches resume/job-description text against the curated
skills taxonomy using word-boundary-safe substring matching.
"""
import re
from typing import Dict, List

from .skills_db import ALL_SKILLS, SKILL_TO_CATEGORY


def extract_skills(text: str) -> List[Dict]:
    """
    Returns a list of {skill, category} dicts found in the text.
    Longer skill names are matched first so e.g. 'node.js' wins over 'node'.
    """
    normalized = text.lower()
    found = []
    seen = set()

    for skill in ALL_SKILLS:
        if skill in seen:
            continue
        pattern = r"(?<![a-z0-9+#.])" + re.escape(skill) + r"(?![a-z0-9+#])"
        if re.search(pattern, normalized):
            found.append({"skill": skill, "category": SKILL_TO_CATEGORY[skill]})
            seen.add(skill)

    return found


def group_by_category(skills: List[Dict]) -> Dict[str, List[str]]:
    grouped: Dict[str, List[str]] = {}
    for item in skills:
        grouped.setdefault(item["category"], []).append(item["skill"])
    return grouped
