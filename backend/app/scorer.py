"""
Resume scoring: a composite, explainable score built from section
completeness, quantified achievements, action-verb usage, length,
and ATS-friendliness heuristics. No external AI calls — fully
deterministic so results are reproducible and free to run.
"""
import re
from typing import Dict, List

from .skills_db import ACTION_VERBS

NUMBER_PATTERN = re.compile(r"\b\d+(\.\d+)?%?\b")
WEAK_PHRASES = [
    "responsible for", "duties included", "worked on", "helped with",
    "involved in", "tasked with", "in charge of",
]
EXPECTED_SECTIONS = ["experience", "education", "skills"]


def _score_sections(sections: Dict[str, str]) -> Dict:
    present = [s for s in EXPECTED_SECTIONS if sections.get(s, "").strip()]
    bonus_present = [s for s in ("summary", "projects", "certifications") if sections.get(s, "").strip()]
    score = round((len(present) / len(EXPECTED_SECTIONS)) * 70 + (len(bonus_present) / 3) * 30)
    missing = [s for s in EXPECTED_SECTIONS if s not in present]
    return {
        "score": min(score, 100),
        "present_sections": present + bonus_present,
        "missing_sections": missing,
    }


def _score_quantification(text: str) -> Dict:
    bullet_lines = [l.strip() for l in text.split("\n") if l.strip().startswith(("-", "•", "*"))]
    if not bullet_lines:
        bullet_lines = [l.strip() for l in text.split("\n") if len(l.strip()) > 30]

    quantified = [l for l in bullet_lines if NUMBER_PATTERN.search(l)]
    ratio = len(quantified) / len(bullet_lines) if bullet_lines else 0
    score = round(min(ratio * 130, 100))  # reward up to full marks for ~77%+ quantified
    return {
        "score": score,
        "quantified_bullets": len(quantified),
        "total_bullets": len(bullet_lines),
    }


def _score_action_verbs(text: str) -> Dict:
    lower = text.lower()
    verbs_used = sorted({v for v in ACTION_VERBS if re.search(r"\b" + v + r"\b", lower)})
    weak_hits = sorted({p for p in WEAK_PHRASES if p in lower})
    score = round(min(len(verbs_used) * 8, 100))
    if weak_hits:
        score = max(score - len(weak_hits) * 5, 0)
    return {"score": score, "strong_verbs_found": verbs_used, "weak_phrases_found": weak_hits}


def _score_length(text: str) -> Dict:
    word_count = len(text.split())
    if 350 <= word_count <= 900:
        score = 100
    elif word_count < 350:
        score = round(max(word_count / 350 * 100, 20))
    else:
        overflow = word_count - 900
        score = round(max(100 - overflow / 15, 30))
    return {"score": score, "word_count": word_count}


def _score_ats_friendliness(text: str) -> Dict:
    issues = []
    score = 100
    if "\t" in text and text.count("\t") > 10:
        issues.append("Heavy use of tabs/tables detected — can confuse ATS parsers.")
        score -= 15
    if len(re.findall(r"[^\x00-\x7F]", text)) > 20:
        issues.append("Many special/non-standard characters found — may not parse cleanly.")
        score -= 10
    email_found = bool(re.search(r"[\w.+-]+@[\w-]+\.[\w.-]+", text))
    phone_found = bool(re.search(r"(\+?\d[\d\-\s()]{8,}\d)", text))
    if not email_found:
        issues.append("No email address detected.")
        score -= 15
    if not phone_found:
        issues.append("No phone number detected.")
        score -= 10
    return {"score": max(score, 0), "issues": issues, "email_found": email_found, "phone_found": phone_found}


def score_resume(text: str, sections: Dict[str, str]) -> Dict:
    section_result = _score_sections(sections)
    quant_result = _score_quantification(text)
    verb_result = _score_action_verbs(text)
    length_result = _score_length(text)
    ats_result = _score_ats_friendliness(text)

    weights = {
        "sections": 0.25,
        "quantification": 0.25,
        "action_verbs": 0.20,
        "length": 0.10,
        "ats_friendliness": 0.20,
    }
    overall = round(
        section_result["score"] * weights["sections"]
        + quant_result["score"] * weights["quantification"]
        + verb_result["score"] * weights["action_verbs"]
        + length_result["score"] * weights["length"]
        + ats_result["score"] * weights["ats_friendliness"]
    )

    return {
        "overall_score": overall,
        "breakdown": {
            "sections": section_result,
            "quantification": quant_result,
            "action_verbs": verb_result,
            "length": length_result,
            "ats_friendliness": ats_result,
        },
        "weights": weights,
    }


def ats_keyword_analysis(text: str, extracted_skills: List[Dict]) -> Dict:
    """Simple keyword frequency + density analysis for ATS-style scanning."""
    words = re.findall(r"[a-zA-Z][a-zA-Z0-9+.#]{1,}", text.lower())
    total_words = len(words) or 1
    freq: Dict[str, int] = {}
    for item in extracted_skills:
        skill = item["skill"]
        count = len(re.findall(r"\b" + re.escape(skill) + r"\b", text.lower()))
        if count:
            freq[skill] = count

    top_keywords = sorted(freq.items(), key=lambda x: x[1], reverse=True)[:15]
    density = round((sum(freq.values()) / total_words) * 100, 2)

    return {
        "keyword_density_percent": density,
        "top_keywords": [{"keyword": k, "count": v} for k, v in top_keywords],
        "unique_keywords_found": len(freq),
    }
