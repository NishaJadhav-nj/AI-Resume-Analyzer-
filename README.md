# Resume Scanner

> Turn a resume into a clear, actionable profile—and see how it aligns with a job description.

Resume Scanner is a full-stack web app that extracts information from PDF and DOCX resumes, evaluates resume quality, and compares resume skills with a job posting. Its analysis uses rule-based heuristics and TF-IDF; it does not call an external AI service.

## What it does

- **Extracts resume content** from text-based PDF and DOCX files.
- **Identifies common sections**, including summary, experience, education, skills, projects, certifications, and awards.
- **Finds skills** across a built-in taxonomy and estimates experience level from date ranges.
- **Scores resume strength** using section completeness, action verbs, quantified achievements, length, and ATS-related checks.
- **Reports ATS keywords** and potential formatting or contact-information issues.
- **Matches a resume to a job description** with TF-IDF text similarity and skill overlap, including matched and missing skills.
- **Presents results in a dashboard** with score breakdowns, detected sections, skills, and job-match results.

## Built with

| Frontend | Backend |
| --- | --- |
| React 19 | Python |
| Vite 8 | FastAPI |
| JavaScript | scikit-learn |
|  | pdfplumber, python-docx |

## How it works

1. Upload a PDF or DOCX resume.
2. The FastAPI backend extracts text, detects sections and skills, and estimates experience level.
3. Review the resume score and ATS analysis in the dashboard.
4. Paste a job description to see the match score, skill coverage, and missing skills.

## Getting started

### Prerequisites

- Python 3.12 or later
- Node.js 20.19+ or 22.12+, and npm

### 1. Start the backend

From the repository root, open a terminal:

**Windows (PowerShell)**

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**macOS / Linux**

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

The API is available at `http://localhost:8000`. Interactive API documentation is at `http://localhost:8000/docs`.

### 2. Start the frontend

In a second terminal:

```bash
cd frontend
npm ci
```

The frontend defaults to `http://localhost:8000` for its API. To use a different backend, create `frontend/.env` from `frontend/.env.example` and set `VITE_API_BASE`:

```env
VITE_API_BASE=http://localhost:8000
```

Then start the development server:

```bash
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`).

## API

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Check API status |
| `POST` | `/api/upload` | Upload a resume as multipart form data using the `file` field |
| `POST` | `/api/analyze/{resume_id}` | Get the resume score and ATS analysis |
| `POST` | `/api/match` | Compare a resume with a job description |
| `DELETE` | `/api/resume/{resume_id}` | Remove a resume from the in-memory store |

The `/api/match` request body is JSON:

```json
{
  "resume_id": "id-returned-by-upload",
  "job_description": "Paste the job description here."
}
```

## Project layout

```text
resume-analyzer/
├── backend/
│   ├── app/
│   │   ├── matcher.py       # Job-description matching
│   │   ├── models.py        # API request and data models
│   │   ├── parser.py        # Text extraction and section detection
│   │   ├── scorer.py        # Resume scoring and ATS analysis
│   │   ├── skills.py        # Skill extraction and categorization
│   │   └── skills_db.py     # Skill taxonomy and resume section headers
│   ├── main.py              # FastAPI routes
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── components/      # Upload, score, skills, ATS, and match UI
    │   ├── App.jsx
    │   └── api.js           # Backend API client
    ├── .env.example
    └── package.json
```

## Privacy and limitations

- Resume analysis runs on the backend you configure; no external AI provider is used. When using this app, the resume is uploaded to that backend.
- The backend keeps uploaded resume text in memory. Restarting the backend clears it; the API also provides a delete endpoint.
- Only text-based PDFs and DOCX files are supported. Scanned or image-only PDFs do not contain extractable text and may fail analysis.
- Section detection, skill extraction, experience estimation, and scoring are heuristic. Results can vary with resume formatting and should be treated as guidance, not a hiring decision.
- The in-memory store is intended for local development and does not provide durable storage or authentication. Add appropriate safeguards before exposing a deployment to other users.

## Development

Run the frontend production build and linter from `frontend/`:

```bash
npm run build
npm run lint
```

## License

No license has been specified yet.
