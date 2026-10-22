const ALL_SECTIONS = ['summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'awards'];

export default function SectionLedger({ detected = [] }) {
  return (
    <div style={{ background: 'var(--panel)', border: '1px solid var(--hairline)', borderRadius: 4, padding: 20 }}>
      <SectionTitle>Section Ledger</SectionTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginTop: 12 }}>
        {ALL_SECTIONS.map((s, i) => {
          const found = detected.includes(s);
          return (
            <div key={s} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '9px 0', borderTop: i === 0 ? 'none' : '1px solid var(--hairline)',
            }}>
              <span style={{ fontSize: 14, color: found ? 'var(--paper)' : 'var(--slate)', textTransform: 'capitalize' }}>
                {s}
              </span>
              <span className="mono" style={{
                fontSize: 11, letterSpacing: '0.06em',
                color: found ? 'var(--teal)' : 'var(--coral)',
              }}>
                {found ? 'DETECTED' : 'MISSING'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function SectionTitle({ children, accent }) {
  return (
    <div style={{
      fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 600,
      textTransform: 'uppercase', letterSpacing: '0.08em',
      color: accent || 'var(--paper-dim)',
    }}>
      {children}
    </div>
  );
}
