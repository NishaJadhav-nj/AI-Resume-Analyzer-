import { useState } from 'react';
import ScanUpload from './components/ScanUpload';
import ScanGauge from './components/ScanGauge';
import SectionLedger from './components/SectionLedger';
import SkillsPanel from './components/SkillsPanel';
import ScoreBreakdown from './components/ScoreBreakdown';
import AtsPanel from './components/AtsPanel';
import JobMatchPanel from './components/JobMatchPanel';
import { uploadResume, analyzeResume, matchJob } from './api';

export default function App() {
  const [stage, setStage] = useState('idle'); // idle | uploading | analyzing | ready
  const [resumeData, setResumeData] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [matchResult, setMatchResult] = useState(null);
  const [isMatching, setIsMatching] = useState(false);
  const [error, setError] = useState(null);
  const [matchError, setMatchError] = useState(null);

  async function handleFile(file) {
    setError(null);
    setMatchResult(null);
    setStage('uploading');
    try {
      const upload = await uploadResume(file);
      setResumeData(upload);
      setStage('analyzing');
      const result = await analyzeResume(upload.resume_id);
      setAnalysis(result);
      setStage('ready');
    } catch (e) {
      setError(e.message);
      setStage('idle');
    }
  }

  async function handleMatch(jobText) {
    setMatchError(null);
    setIsMatching(true);
    try {
      const res = await matchJob(resumeData.resume_id, jobText);
      setMatchResult(res.match);
    } catch (e) {
      setMatchError(e.message);
    } finally {
      setIsMatching(false);
    }
  }

  const isScanning = stage === 'uploading' || stage === 'analyzing';

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px 80px' }}>
      <Header />

      <div style={{ marginTop: 44 }}>
        <ScanUpload onFileSelected={handleFile} isScanning={isScanning} filename={resumeData?.filename} />
        {error && <p style={{ color: 'var(--coral)', fontSize: 13, marginTop: 10 }}>{error}</p>}
      </div>

      {stage === 'analyzing' && (
        <p className="mono" style={{ marginTop: 16, fontSize: 12, color: 'var(--amber)', letterSpacing: '0.06em' }}>
          RUNNING ANALYSIS…
        </p>
      )}

      {resumeData && analysis && (
        <div style={{ marginTop: 48, display: 'flex', flexDirection: 'column', gap: 40 }}>
          <SummaryStrip resumeData={resumeData} analysis={analysis} />

          <Grid>
            <ScoreBreakdown breakdown={analysis.score.breakdown} />
            <SectionLedger detected={resumeData.sections_detected} />
          </Grid>

          <Grid>
            <SkillsPanel skillsByCategory={resumeData.skills_by_category} />
            <AtsPanel ats={analysis.ats_analysis} issues={analysis.score.breakdown.ats_friendliness.issues} />
          </Grid>

          <JobMatchPanel
            onMatch={handleMatch}
            isMatching={isMatching}
            result={matchResult}
            error={matchError}
          />
        </div>
      )}

      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
      <div>
        <div className="mono" style={{ fontSize: 11, color: 'var(--amber)', letterSpacing: '0.14em', marginBottom: 6 }}>
          ◆ RESUME INTELLIGENCE
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 34, fontWeight: 700, margin: 0,
          letterSpacing: '-0.01em',
        }}>
          Resume Scanner
        </h1>
        <p style={{ color: 'var(--slate)', fontSize: 14.5, marginTop: 6, maxWidth: 480 }}>
          Upload a resume to extract structure, score its strength, and
          measure fit against any job description.
        </p>
      </div>
    </header>
  );
}

function SummaryStrip({ resumeData, analysis }) {
  return (
    <div style={{
      display: 'flex', gap: 32, alignItems: 'center', flexWrap: 'wrap',
      background: 'var(--panel)', border: '1px solid var(--hairline)', borderRadius: 4,
      padding: '24px 28px',
    }}>
      <ScanGauge value={analysis.score.overall_score} label="Resume Score" color="var(--amber)" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <InfoRow label="File" value={resumeData.filename} />
        <InfoRow label="Word Count" value={resumeData.word_count} />
        <InfoRow label="Experience Level" value={resumeData.experience_level.level} />
        <InfoRow label="Skills Detected" value={resumeData.skills.length} />
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}>
      <span className="mono" style={{ fontSize: 11, color: 'var(--slate)', letterSpacing: '0.05em', minWidth: 130 }}>
        {label.toUpperCase()}
      </span>
      <span style={{ fontSize: 14, color: 'var(--paper)' }}>{value}</span>
    </div>
  );
}

function Grid({ children }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
      {children}
    </div>
  );
}

function Footer() {
  return (
    <footer style={{ marginTop: 80, borderTop: '1px solid var(--hairline)', paddingTop: 20 }}>
      <p className="mono" style={{ fontSize: 11, color: 'var(--slate)', letterSpacing: '0.04em' }}>
        Scoring runs entirely offline — no resume content leaves your machine.
      </p>
    </footer>
  );
}
