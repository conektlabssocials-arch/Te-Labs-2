import { linkProps } from '../lib/router'

export default function FinalCta({ t, lang, navigate }) {
  return (
    <div className="te-final">
      <div style={{ minWidth: 0, flex: '1 1 280px' }}>
        {/* A real h2: this was a styled div, so the closing call to action
            carried no heading weight at all. */}
        <h2
          style={{
            margin: 0,
            font: "400 clamp(28px, 4.4vw, 60px)/0.98 Anton, sans-serif",
            color: '#0B0710',
            textTransform: 'uppercase',
          }}
        >
          {t.tFinalA}
          <br />
          {t.tFinalB}
        </h2>
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
      <a className="te-final-btn" {...linkProps('contact', lang, navigate)}>
        {t.tFinalCta} →
      </a>
    </div>
  )
}
