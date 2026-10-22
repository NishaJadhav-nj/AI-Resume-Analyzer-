const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

async function handle(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || `Request failed (${res.status})`);
  }
  return res.json();
}

export async function uploadResume(file) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_BASE}/api/upload`, { method: 'POST', body: formData });
  return handle(res);
}

export async function analyzeResume(resumeId) {
  const res = await fetch(`${API_BASE}/api/analyze/${resumeId}`, { method: 'POST' });
  return handle(res);
}

export async function matchJob(resumeId, jobDescription) {
  const res = await fetch(`${API_BASE}/api/match`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resume_id: resumeId, job_description: jobDescription }),
  });
  return handle(res);
}
