import { SectionTitle } from './SectionLedger';

export default function SkillsPanel({ skillsByCategory = {} }) {
  const categories = Object.keys(skillsByCategory);

  return (
    <div style={{ background: 'var(--panel)', border: '1px solid var(--hairline)', borderRadius: 4, padding: 20 }}>
      <SectionTitle>Skills Detected</SectionTitle>
      {categories.length === 0 && (
        <p style={{ fontSize: 13, color: 'var(--slate)', marginTop: 12 }}>No taxonomy matches found yet.</p>
      )}
      <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {categories.map((cat) => (
          <div key={cat}>
            <div className="mono" style={{ fontSize: 10.5, color: 'var(--slate)', letterSpacing: '0.06em', marginBottom: 7 }}>
              {cat.toUpperCase()}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {skillsByCategory[cat].map((skill) => (
                <Chip key={skill} label={skill} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Chip({ label, tone = 'default' }) {
  const tones = {
    default: { bg: 'var(--panel-raised)', border: 'var(--hairline)', color: 'var(--paper)' },
    match: { bg: 'var(--teal-dim)', border: 'var(--teal)', color: 'var(--teal)' },
    missing: { bg: 'var(--coral-dim)', border: 'var(--coral)', color: 'var(--coral)' },
  };
  const t = tones[tone];
  return (
    <span className="mono" style={{
      fontSize: 11.5, padding: '4px 9px', borderRadius: 3,
      background: t.bg, border: `1px solid ${t.border}`, color: t.color,
    }}>
      {label}
    </span>
  );
}
