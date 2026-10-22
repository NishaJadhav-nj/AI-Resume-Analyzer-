# Resume Scanner

A full-stack resume analysis tool: upload a PDF or DOCX resume, extract its
structure and skills, get a deterministic strength score and ATS keyword
analysis, then match it against any job description to see what's covered
and what's missing.

## Features (this version)

- **PDF/DOCX upload** with text extraction (`pdfplumber`, `python-docx`)
- **Section detection** — summary, experience, education, skills, projects, certifications, awards
- **Skills extraction** — 200+ term taxonomy across 10 categories (languages, frameworks, cloud, data, AI/ML, soft skills, etc.)
- **Experience-level detection** — heuristic year-range parsing from the experience section
- **Resume scoring** — composite, explainable score from section completeness, quantified achievements, action-verb usage, length, and ATS friendliness
- **ATS keyword analysis** — keyword density, top keywords, formatting red flags (missing contact info, heavy tables, etc.)
- **Job description matching** — TF-IDF cosine similarity blended with explicit skill-set overlap
- **Missing skills detection** — skills present in the job description but absent from the resume, grouped by category

Scoring and matching are fully deterministic (TF-IDF + rule-based heuristics) —
no external AI API calls, no resume content leaves your machine.

## Project structure

```
resume-analyzer/
├── backend/                 # FastAPI service
│   ├── app/
│   │   ├── parser.py        # text extraction + section detection
│   │   ├── skills.py        # skill extraction
│   │   ├── skills_db.py     # skills taxonomy + section headers + action verbs
│   │   ├── scorer.py        # resume scoring + ATS keyword analysis
│   │   ├── matcher.py       # job description matching
│   │   └── models.py        # pydantic schemas
│   ├── main.py               # API routes
│   └── requirements.txt
└── frontend/                 # React + Vite
    └── src/
        ├── App.jsx
        ├── api.js
        └── components/
```

## Running it locally

### Backend

```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate   # optional but recommended
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

The API is now live at `http://localhost:8000` (docs at `/docs`).

### Frontend

```bash
cd frontend
npm install
cp .env.example .env     # points the app at your backend URL
npm run dev
```

Open the printed local URL (typically `http://localhost:5173`).

## API reference

| Method | Path                       | Description                                  |
|--------|----------------------------|-----------------------------------------------|
| POST   | `/api/upload`               | Upload a resume file, returns extracted data  |
| POST   | `/api/analyze/{resume_id}`  | Returns score + ATS keyword analysis          |
| POST   | `/api/match`                | Body: `{resume_id, job_description}` — returns match score, matched/missing skills |
| DELETE | `/api/resume/{resume_id}`   | Removes a resume from memory                  |
| GET    | `/api/health`               | Health check                                  |

Resumes are stored **in memory** on the backend for simplicity — restarting
the server clears them. Swap `RESUME_STORE` in `main.py` for a real database
(Postgres, SQLite, etc.) for persistence.

## Extending this project

The feature list you shared includes several items not built in this pass —
good next additions, roughly in order of effort:

- **AI improvement suggestions / bullet-point rewriting** — wire in an LLM
  call (e.g. the Claude API) that takes a bullet and the job description and
  proposes a rewrite. `app/matcher.py` and `app/scorer.py` already produce
  the structured signals (weak phrases, missing skills) to feed as context.
- **Resume-job semantic similarity (upgraded)** — swap the TF-IDF vectorizer
  in `matcher.py` for sentence embeddings (e.g. `sentence-transformers`) for
  a more semantic match beyond keyword overlap.
- **Project quality analysis** — extend `scorer.py` with heuristics specific
  to the `projects` section (tech stack diversity, links to repos/demos).
- **Interactive dashboard / resume comparison** — the frontend already
  exposes `resume_id`s; a comparison view can upload two resumes and diff
  their `/api/analyze` and `/api/match` results side by side.
- **Personalized learning roadmap** — given `missing_skills_by_category`
  from `/api/match`, generate a study plan (can start rule-based, then move
  to LLM-generated).

## Notes

- File parsing assumes text-based PDFs/DOCX. Scanned/image-only PDFs will
  return a 422 — OCR (e.g. `pytesseract`) would be a reasonable addition.
- Section detection and skill extraction are heuristic, not ML-based. They
  work well on standard resume formats but can miss heavily stylized layouts.
