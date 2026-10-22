"""
Resume file parsing: extracts raw text from PDF/DOCX and detects
standard resume sections using header heuristics.
"""
import re
import io
from typing import Dict, List

import pdfplumber
from docx import Document

from .skills_db import SECTION_HEADERS


def extract_text(file_bytes: bytes, filename: str) -> str:
    """Extract raw text from a PDF or DOCX file's bytes."""
    ext = filename.lower().rsplit(".", 1)[-1]
    if ext == "pdf":
        return _extract_pdf(file_bytes)
    elif ext in ("docx", "doc"):
        return _extract_docx(file_bytes)
    else:
        raise ValueError(f"Unsupported file type: .{ext}. Please upload a PDF or DOCX.")


def _extract_pdf(file_bytes: bytes) -> str:
    text_chunks = []
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text() or ""
            text_chunks.append(page_text)
    return "\n".join(text_chunks)


def _extract_docx(file_bytes: bytes) -> str:
    doc = Document(io.BytesIO(file_bytes))
    paragraphs = [p.text for p in doc.paragraphs]
    # Also pull text out of tables (common in resume templates)
    for table in doc.tables:
        for row in table.rows:
            for cell in row.cells:
                if cell.text.strip():
                    paragraphs.append(cell.text)
    return "\n".join(paragraphs)


def detect_sections(text: str) -> Dict[str, str]:
    """
    Split resume text into labeled sections (summary, experience, education,
    skills, projects, certifications, awards) based on header line heuristics.
    Anything before the first detected header is treated as 'header' (contact info).
    """
    lines = text.split("\n")
    header_map = {}
    for canonical, aliases in SECTION_HEADERS.items():
        for alias in aliases:
            header_map[alias] = canonical

    matches: List[tuple] = []  # (line_index, canonical_section)
    for i, line in enumerate(lines):
        cleaned = re.sub(r"[^a-z\s]", "", line.lower()).strip()
        if not cleaned or len(cleaned) > 40:
            continue
        if cleaned in header_map:
            matches.append((i, header_map[cleaned]))

    sections: Dict[str, str] = {}
    if not matches:
        sections["full_text"] = text
        return sections

    sections["header"] = "\n".join(lines[: matches[0][0]]).strip()
    for idx, (line_no, name) in enumerate(matches):
        end = matches[idx + 1][0] if idx + 1 < len(matches) else len(lines)
        content = "\n".join(lines[line_no + 1: end]).strip()
        if name in sections:
            sections[name] += "\n" + content
        else:
            sections[name] = content

    return sections


def detect_experience_level(text: str, sections: Dict[str, str]) -> Dict:
    """
    Rough heuristic for years of experience: finds 4-digit year ranges
    (e.g. 2019 - 2023, 2020-Present) in the experience section and sums spans.
    """
    exp_text = sections.get("experience", text)
    year_pattern = re.compile(
        r"(19|20)\d{2}\s*(?:-|–|to)\s*((19|20)\d{2}|present|current)",
        re.IGNORECASE,
    )
    spans = []
    for match in year_pattern.finditer(exp_text):
        start_year = int(match.group(0)[:4])
        end_raw = match.group(2)
        end_year = 2026 if end_raw.lower() in ("present", "current") else int(end_raw)
        if end_year >= start_year:
            spans.append((start_year, end_year))

    if not spans:
        level = "Entry-level / Not detected"
        total_years = 0
    else:
        earliest = min(s[0] for s in spans)
        latest = max(s[1] for s in spans)
        total_years = max(latest - earliest, 0)
        if total_years <= 1:
            level = "Entry-level (0-1 yrs)"
        elif total_years <= 3:
            level = "Junior (1-3 yrs)"
        elif total_years <= 6:
            level = "Mid-level (3-6 yrs)"
        elif total_years <= 10:
            level = "Senior (6-10 yrs)"
        else:
            level = "Lead / Executive (10+ yrs)"

    return {"estimated_years": total_years, "level": level}
