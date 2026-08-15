import { linkProps } from '../lib/router'

export default function Faq({ t, faq, setFaq, lang, navigate }) {
  const items = [
    { q: t.tQ1, a: t.tA1 },
    { q: t.tQ2, a: t.tA2 },
    { q: t.tQ3, a: t.tA3 },
    { q: t.tQ4, a: t.tA4 },
    { q: t.tQ5, a: t.tA5 },
  ]

  return (
    <div id="faq" style={{ padding: '0 clamp(20px, 4vw, 40px) clamp(48px, 7vw, 84px)' }}>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'baseline',
          gap: 'clamp(12px, 2vw, 24px)',
          marginBottom: 'clamp(24px, 3.5vw, 36px)',
        }}
      >
        <span
          style={{
            font: "500 12px 'JetBrains Mono', monospace",
            letterSpacing: '.2em',
            color: '#E8BE7C',
          }}
        >
          05 / {t.tFaq}
        </span>
        <h2
          style={{
            margin: 0,
            font: "400 clamp(28px, 4.4vw, 62px)/0.96 Anton, sans-serif",
            textTransform: 'uppercase',
          }}
        >
          {t.tFaqTitle}
        </h2>
        <span
          style={{
            font: "400 11px 'JetBrains Mono', monospace",
            letterSpacing: '.16em',
            color: '#6E5C86',
            alignSelf: 'end',
          }}
        >
          {t.tFaqHint}
        </span>
      </div>
      <div
        style={{
          display: 'grid',
          gap: 1,
          background: '#2A1E3A',
          border: '1px solid #2A1E3A',
        }}
      >
        {items.map((item, idx) => {
          const open = faq === idx + 1
          const panelId = `te-faq-panel-${idx + 1}`
          return (
            <div key={item.q} style={{ background: '#0B0710' }}>
              <button
                type="button"
                className="te-faq-btn"
                onClick={() => setFaq(open ? 0 : idx + 1)}
                aria-expanded={open}
                aria-controls={panelId}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 30,
                  width: '100%',
                  background: 'none',
                  border: 0,
                  padding: '24px 28px',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    font: '400 20px Anton, sans-serif',
                    textTransform: 'uppercase',
                    color: '#E4DAF5',
                  }}
                >
                  {item.q}
                </h3>
                <span
                  style={{
                    font: "400 20px 'JetBrains Mono', monospace",
                    color: '#E8BE7C',
                  }}
                >
                  {open ? '−' : '+'}
                </span>
              </button>
              {/* Every answer stays in the DOM and is collapsed with CSS rather
                  than unmounted. All five answers are what the FAQPage schema
                  declares, and a crawler must be able to find each one in the
                  served HTML for the markup to be valid. */}
              <div
                id={panelId}
                className={`te-faq-panel${open ? ' te-faq-panel--open' : ''}`}
              >
                {/* The clip element carries no padding of its own: a grid track
                    sized 0fr still cannot shrink below its item's padding, so
                    padding here would leave the answer permanently peeking out. */}
                <div className="te-faq-panel__clip">
                  <p
                    style={{
                      margin: 0,
                      padding: '0 28px 26px',
                      maxWidth: 780,
                      font: "400 13px/1.75 'JetBrains Mono', monospace",
                      color: '#9C8CB4',
                    }}
                  >
                    {item.a}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <div className="te-faq-row">
        <span style={{ font: "400 13px 'JetBrains Mono', monospace", color: '#BFB2D4' }}>
          {t.tTalk}
        </span>
        <a
          className="te-talk-cta"
          {...linkProps('contact', lang, navigate)}
          style={{
            border: '1px solid #8B2FF8',
            color: '#E4DAF5',
            padding: '13px 22px',
            textDecoration: 'none',
            font: "700 12px 'JetBrains Mono', monospace",
            letterSpacing: '.14em',
          }}
        >
          {t.tTalkCta} →
        </a>
      </div>
    </div>
  )
}
