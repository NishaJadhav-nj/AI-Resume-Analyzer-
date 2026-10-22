import { useState } from 'react';
import { SectionTitle } from './SectionLedger';
import { Chip } from './SkillsPanel';
import ScanGauge from './ScanGauge';

export default function JobMatchPanel({ onMatch, isMatching, result, error }) {
  const [jobText, setJobText] = useState('');

  return (
    <div style={{ background: 'var(--panel)', border: '1px solid var(--hairline)', borderRadius: 4, padding: 20 }}>
      <SectionTitle>Job Description Match</SectionTitle>
      <p style={{ fontSize: 13, color: 'var(--slate)', marginTop: 8, marginBottom: 12 }}>
        Paste a target job description to compare it against your resume.
      </p>

      <textarea
        value={jobText}
        onChange={(e) => setJobText(e.target.value)}
        placeholder="Paste the job description here…"
        rows={7}
        style={{
          width: '100%', resize: 'vertical', background: 'var(--panel-raised)',
          border: '1px solid var(--hairline)', borderRadius: 4, color: 'var(--paper)',
          fontFamily: 'var(--font-body)', fontSize: 13, padding: 12, lineHeight: 1.5,
        }}
      />

      <button
        onClick={() => onMatch(jobText)}
        disabled={!jobText.trim() || isMatching}
        style={{
          marginTop: 12, background: jobText.trim() ? 'var(--amber)' : 'var(--hairline)',
          color: jobText.trim() ? 'var(--ink)' : 'var(--slate)', border: 'none',
          borderRadius: 4, padding: '10px 18px', fontWeight: 600, fontSize: 13,
          fontFamily: 'var(--font-display)',
        }}
      >
        {isMatching ? 'Analyzing…' : 'Run Match'}
      </button>

      {error && <p style={{ color: 'var(--coral)', fontSize: 13, marginTop: 12 }}>{error}</p>}

      {result && (
        <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--hairline)' }}>
          <div style={{ display: 'flex', gap: 28, alignItems: 'center', flexWrap: 'wrap' }}>
            <ScanGauge value={result.overall_match_score} label="Overall Match" color="var(--teal)" size={112} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <MiniStat label="Semantic Similarity" value={`${result.semantic_similarity}%`} />
              <MiniStat label="Skill Coverage" value={`${result.skill_coverage_percent}%`} />
              <MiniStat label="Job Skills Detected" value={result.total_job_skills_detected} />
            </div>
          </div>

          <div style={{ marginTop: 20 }}>
            <div className="mono" style={{ fontSize: 10.5, color: 'var(--teal)', letterSpacing: '0.06em', marginBottom: 7 }}>
              MATCHED SKILLS ({result.matched_skills.length})
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {result.matched_skills.length === 0 && <Empty text="No overlapping skills detected." />}
              {result.matched_skills.map((s) => <Chip key={s} label={s} tone="match" />)}
            </div>
          </div>

          <div style={{ marginTop: 18 }}>
            <div className="mono" style={{ fontSize: 10.5, color: 'var(--coral)', letterSpacing: '0.06em', marginBottom: 7 }}>
              MISSING SKILLS ({result.missing_skills.length})
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {result.missing_skills.length === 0 && <Empty text="Nothing missing — full coverage." />}
              {result.missing_skills.map((s) => <Chip key={s} label={s} tone="missing" />)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div>
      <span className="mono" style={{ fontSize: 15, fontWeight: 700 }}>{value}</span>
      <span style={{ fontSize: 12, color: 'var(--slate)', marginLeft: 8 }}>{label}</span>
    </div>
  );
}

function Empty({ text }) {
  return <span style={{ fontSize: 12.5, color: 'var(--slate)', fontStyle: 'italic' }}>{text}</span>;
}
