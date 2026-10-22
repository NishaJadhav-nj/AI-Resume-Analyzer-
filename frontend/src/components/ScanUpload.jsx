import { useCallback, useRef, useState } from 'react';

export default function ScanUpload({ onFileSelected, isScanning, filename }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef(null);

  const handleFiles = useCallback((files) => {
    if (files && files[0]) onFileSelected(files[0]);
  }, [onFileSelected]);

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => { e.preventDefault(); setIsDragOver(false); handleFiles(e.dataTransfer.files); }}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click(); }}
      style={{
        position: 'relative',
        overflow: 'hidden',
        border: `1px dashed ${isDragOver ? 'var(--amber)' : 'var(--hairline)'}`,
        borderRadius: 4,
        background: 'var(--panel)',
        padding: '56px 32px',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'border-color 200ms ease',
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,.doc"
        style={{ display: 'none' }}
        onChange={(e) => handleFiles(e.target.files)}
      />

      {isScanning && (
        <div style={{
          position: 'absolute', left: 0, right: 0, height: 2,
          background: 'linear-gradient(90deg, transparent, var(--amber), transparent)',
          animation: 'scanline 1.4s ease-in-out infinite',
          boxShadow: '0 0 12px var(--amber)',
        }} />
      )}
      <style>{`
        @keyframes scanline {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>

      <div className="mono" style={{ fontSize: 11, color: 'var(--slate)', letterSpacing: '0.12em', marginBottom: 14 }}>
        {isScanning ? 'SCANNING DOCUMENT…' : 'PDF · DOCX'}
      </div>

      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" style={{ margin: '0 auto 16px' }}>
        <rect x="8" y="4" width="24" height="32" rx="1.5" stroke="var(--paper-dim)" strokeWidth="1.5" />
        <line x1="13" y1="13" x2="27" y2="13" stroke="var(--paper-dim)" strokeWidth="1.5" />
        <line x1="13" y1="19" x2="27" y2="19" stroke="var(--paper-dim)" strokeWidth="1.5" />
        <line x1="13" y1="25" x2="22" y2="25" stroke="var(--paper-dim)" strokeWidth="1.5" />
      </svg>

      <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, marginBottom: 6 }}>
        {filename ? filename : 'Drop your resume here'}
      </div>
      <div style={{ fontSize: 13, color: 'var(--slate)' }}>
        {filename ? 'Click to replace file' : 'or click to browse — PDF or DOCX, up to 10MB'}
      </div>
    </div>
  );
}
