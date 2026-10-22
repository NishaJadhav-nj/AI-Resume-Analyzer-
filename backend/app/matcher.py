"""
Resume <-> Job Description matching: TF-IDF cosine similarity for a
semantic-ish match score, plus explicit skill-set comparison for
matched/missing skills.
"""
from typing import Dict, List

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from .skills import extract_skills


def compute_similarity(resume_text: str, job_text: str) -> float:
    """TF-IDF cosine similarity between resume and job description, 0-100."""
    vectorizer = TfidfVectorizer(stop_words="english", max_features=5000)
    try:
        tfidf = vectorizer.fit_transform([resume_text, job_text])
        sim = cosine_similarity(tfidf[0:1], tfidf[1:2])[0][0]
    except ValueError:
        sim = 0.0
    return round(float(sim) * 100, 1)


def match_resume_to_job(resume_text: str, job_text: str) -> Dict:
    resume_skills = {s["skill"] for s in extract_skills(resume_text)}
    job_skills_list = extract_skills(job_text)
    job_skills = {s["skill"]: s["category"] for s in job_skills_list}

    matched = sorted(resume_skills & set(job_skills.keys()))
    missing = sorted(set(job_skills.keys()) - resume_skills)

    similarity_score = compute_similarity(resume_text, job_text)
    skill_coverage = round((len(matched) / len(job_skills) * 100), 1) if job_skills else 0.0

    # Blend semantic similarity with explicit skill coverage for a final match score
    overall_match = round(similarity_score * 0.45 + skill_coverage * 0.55, 1)

    missing_by_category: Dict[str, List[str]] = {}
    for skill in missing:
        missing_by_category.setdefault(job_skills[skill], []).append(skill)

    return {
        "overall_match_score": overall_match,
        "semantic_similarity": similarity_score,
        "skill_coverage_percent": skill_coverage,
        "matched_skills": matched,
        "missing_skills": missing,
        "missing_skills_by_category": missing_by_category,
        "total_job_skills_detected": len(job_skills),
    }
