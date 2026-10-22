import { SectionTitle } from './SectionLedger';
import { Chip } from './SkillsPanel';

export default function AtsPanel({ ats, issues = [] }) {
  if (!ats) return null;
  return (
    <div style={{ background: 'var(--panel)', border: '1px solid var(--hairline)', borderRadius: 4, padding: 20 }}>
      <SectionTitle>ATS Keyword Scan</SectionTitle>

      <div style={{ display: 'flex', gap: 24, marginTop: 14, marginBottom: 16 }}>
        <Stat label="Keyword Density" value={`${ats.keyword_density_percent}%`} />
        <Stat label="Unique Keywords" value={ats.unique_keywords_found} />
      </div>

      {ats.top_keywords?.length > 0 && (
        <>
          <div className="mono" style={{ fontSize: 10.5, color: 'var(--slate)', letterSpacing: '0.06em', marginBottom: 7 }}>
            TOP KEYWORDS
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
            {ats.top_keywords.map((k) => (
              <Chip key={k.keyword} label={`${k.keyword} ×${k.count}`} />
            ))}
          </div>
        </>
      )}

      {issues.length > 0 && (
        <div>
          <div className="mono" style={{ fontSize: 10.5, color: 'var(--coral)', letterSpacing: '0.06em', marginBottom: 8 }}>
            FLAGGED ISSUES
          </div>
          <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {issues.map((issue, i) => (
              <li key={i} style={{ fontSize: 13, color: 'var(--paper-dim)' }}>{issue}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <div className="mono" style={{ fontSize: 20, fontWeight: 700, color: 'var(--paper)' }}>{value}</div>
      <div style={{ fontSize: 11.5, color: 'var(--slate)', marginTop: 2 }}>{label}</div>
    </div>
  );
}
