export default function FinalCta({ t, onContact }) {
  return (
    <div className="te-final">
      <div style={{ minWidth: 0, flex: '1 1 280px' }}>
        <div
          style={{
            font: "400 clamp(28px, 4.4vw, 60px)/0.98 Anton, sans-serif",
            color: '#0B0710',
            textTransform: 'uppercase',
          }}
        >
          {t.tFinalA}
          <br />
          {t.tFinalB}
        </div>
        <p
          style={{
            margin: '16px 0 0',
            maxWidth: 560,
            font: "400 14px/1.7 'JetBrains Mono', monospace",
            color: '#2A0B4A',
          }}
        >
          {t.tFinalSub}
        </p>
      </div>
      <button type="button" className="te-final-btn" onClick={onContact}>
        {t.tFinalCta} →
      </button>
    </div>
  )
}
