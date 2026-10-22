export default function ScanGauge({ value = 0, label, color = 'var(--amber)', size = 132 }) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = circumference - (clamped / 100) * circumference;
  const center = size / 2;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx={center} cy={center} r={radius}
            fill="none" stroke="var(--hairline)" strokeWidth="8"
          />
          <circle
            cx={center} cy={center} r={radius}
            fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 900ms cubic-bezier(0.22, 1, 0.36, 1)' }}
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <span className="mono" style={{ fontSize: size * 0.24, fontWeight: 700, color: 'var(--paper)', lineHeight: 1 }}>
            {Math.round(clamped)}
          </span>
          <span className="mono" style={{ fontSize: 10, color: 'var(--slate)', marginTop: 2 }}>/ 100</span>
        </div>
      </div>
      {label && (
        <span style={{
          fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 600,
          color: 'var(--paper-dim)', textTransform: 'uppercase', letterSpacing: '0.06em',
          textAlign: 'center',
        }}>
          {label}
        </span>
      )}
    </div>
  );
}
