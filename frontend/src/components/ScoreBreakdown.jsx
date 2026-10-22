import { SectionTitle } from './SectionLedger';

const LABELS = {
  sections: 'Section Completeness',
  quantification: 'Quantified Impact',
  action_verbs: 'Action-Verb Usage',
  length: 'Length & Density',
  ats_friendliness: 'ATS Friendliness',
};

function Bar({ value, color }) {
  return (
    <div style={{ height: 5, width: '100%', background: 'var(--hairline)', borderRadius: 3, overflow: 'hidden' }}>
      <div style={{
        width: `${Math.max(0, Math.min(100, value))}%`, height: '100%',
        background: color, transition: 'width 700ms cubic-bezier(0.22, 1, 0.36, 1)',
      }} />
    </div>
  );
}

function colorFor(value) {
  if (value >= 75) return 'var(--teal)';
  if (value >= 45) return 'var(--amber)';
  return 'var(--coral)';
}

export default function ScoreBreakdown({ breakdown = {} }) {
  const keys = Object.keys(LABELS).filter((k) => breakdown[k]);

  return (
    <div style={{ background: 'var(--panel)', border: '1px solid var(--hairline)', borderRadius: 4, padding: 20 }}>
      <SectionTitle>Score Breakdown</SectionTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
        {keys.map((k) => (
          <div key={k}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 13, color: 'var(--paper)' }}>{LABELS[k]}</span>
              <span className="mono" style={{ fontSize: 12, color: colorFor(breakdown[k].score) }}>
                {breakdown[k].score}
              </span>
            </div>
            <Bar value={breakdown[k].score} color={colorFor(breakdown[k].score)} />
          </div>
        ))}
      </div>
    </div>
  );
}
