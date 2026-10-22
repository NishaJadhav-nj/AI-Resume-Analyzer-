import uuid
from typing import Dict

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from app.matcher import match_resume_to_job
from app.models import MatchRequest
from app.parser import detect_experience_level, detect_sections, extract_text
from app.scorer import ats_keyword_analysis, score_resume
from app.skills import extract_skills, group_by_category

app = FastAPI(title="Resume Analyzer API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory store: resume_id -> { filename, text, sections }
# Swap for a real database in production.
RESUME_STORE: Dict[str, dict] = {}


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.post("/api/upload")
async def upload_resume(file: UploadFile = File(...)):
    if not file.filename.lower().endswith((".pdf", ".docx", ".doc")):
        raise HTTPException(400, "Only PDF and DOCX files are supported.")

    file_bytes = await file.read()
    if not file_bytes:
        raise HTTPException(400, "Uploaded file is empty.")

    try:
        text = extract_text(file_bytes, file.filename)
    except Exception as e:
        raise HTTPException(400, f"Could not parse file: {e}")

    if not text.strip():
        raise HTTPException(422, "No extractable text found — the file may be a scanned image.")

    sections = detect_sections(text)
    skills = extract_skills(text)
    experience = detect_experience_level(text, sections)

    resume_id = str(uuid.uuid4())
    RESUME_STORE[resume_id] = {"filename": file.filename, "text": text, "sections": sections}

    return {
        "resume_id": resume_id,
        "filename": file.filename,
        "word_count": len(text.split()),
        "sections_detected": [k for k in sections.keys() if k != "header"],
        "skills": skills,
        "skills_by_category": group_by_category(skills),
        "experience_level": experience,
        "extracted_text_preview": text[:600],
    }


@app.post("/api/analyze/{resume_id}")
def analyze_resume(resume_id: str):
    resume = RESUME_STORE.get(resume_id)
    if not resume:
        raise HTTPException(404, "Resume not found. Please upload again.")

    skills = extract_skills(resume["text"])
    score = score_resume(resume["text"], resume["sections"])
    ats = ats_keyword_analysis(resume["text"], skills)

    return {"resume_id": resume_id, "score": score, "ats_analysis": ats}


@app.post("/api/match")
def match_job(payload: MatchRequest):
    resume = RESUME_STORE.get(payload.resume_id)
    if not resume:
        raise HTTPException(404, "Resume not found. Please upload again.")
    if not payload.job_description.strip():
        raise HTTPException(400, "Job description cannot be empty.")

    result = match_resume_to_job(resume["text"], payload.job_description)
    return {"resume_id": payload.resume_id, "match": result}


@app.delete("/api/resume/{resume_id}")
def delete_resume(resume_id: str):
    RESUME_STORE.pop(resume_id, None)
    return {"deleted": True}
