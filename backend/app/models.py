from typing import Dict, List, Optional
from pydantic import BaseModel


class MatchRequest(BaseModel):
    resume_id: str
    job_description: str


class UploadResponse(BaseModel):
    resume_id: str
    filename: str
    word_count: int
    sections_detected: List[str]
    skills: List[Dict]
    skills_by_category: Dict[str, List[str]]
    experience_level: Dict


class AnalyzeResponse(BaseModel):
    resume_id: str
    score: Dict
    ats_analysis: Dict


class MatchResponse(BaseModel):
    resume_id: str
    match: Dict
