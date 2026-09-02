import { linkProps } from '../lib/router'
import { CONEKT_ADS_VIDEO } from '../data/work'

function InfoPanel({ index, title, body }) {
  return (
    <article
      style={{
        border: '1px solid #2A1E3A',
        background: '#100917',
        padding: 'clamp(24px, 3vw, 36px)',
      }}
    >
      <span
        style={{
          display: 'block',
          marginBottom: 18,
          font: "500 11px 'JetBrains Mono', monospace",
          letterSpacing: '.18em',
          color: '#8B2FF8',
        }}
      >
        {index}
      </span>
      <h2
        style={{
          margin: '0 0 14px',
          font: '400 clamp(25px, 3vw, 38px)/1 Anton, sans-serif',
          textTransform: 'uppercase',
        }}
      >
        {title}
      </h2>
      <p
        style={{
          margin: 0,
          font: "400 13px/1.8 'JetBrains Mono', monospace",
          color: '#A99BBE',
        }}
      >
        {body}
      </p>
    </article>
  )
}

export default function ConektAdsPage({ t, lang, navigate }) {
  const benefits = [
    [t.tConektBenefit1, t.tConektBenefit1Body],
    [t.tConektBenefit2, t.tConektBenefit2Body],
    [t.tConektBenefit3, t.tConektBenefit3Body],
    [t.tConektBenefit4, t.tConektBenefit4Body],
  ]

  return (
    <main>
      <section
        className="te-work-pad-x"
        style={{
          paddingTop: 'clamp(36px, 5vw, 64px)',
          paddingBottom: 'clamp(42px, 6vw, 72px)',
          borderBottom: '1px solid #241933',
        }}
      >
        <a
          {...linkProps('tech', lang, navigate, 'software')}
          style={{
            display: 'inline-block',
            marginBottom: 28,
            color: '#C6A0FF',
            font: "500 11px 'JetBrains Mono', monospace",
            letterSpacing: '.14em',
            textDecoration: 'none',
          }}
        >
          ← {t.tBackToTech}
        </a>
        <div
          style={{
            marginBottom: 20,
            font: "500 12px 'JetBrains Mono', monospace",
            letterSpacing: '.2em',
            color: '#8B2FF8',
          }}
        >
          {t.tConektEyebrow}
        </div>
        <h1
          style={{
            maxWidth: 1100,
            margin: 0,
            font: '400 clamp(38px, 6.4vw, 88px)/0.94 Anton, sans-serif',
            textTransform: 'uppercase',
          }}
        >
          {t.tConektHeroA}
          <br />
          <span style={{ color: '#C6A0FF' }}>{t.tConektHeroB}</span>
        </h1>
        <p
          style={{
            maxWidth: 760,
            margin: '28px 0 0',
            font: "400 15px/1.8 'JetBrains Mono', monospace",
            color: '#BFB2D4',
          }}
        >
          {t.tConektIntro}
        </p>
      </section>

      {/* <section
        className="te-work-pad-x"
        style={{ paddingTop: 'clamp(36px, 5vw, 64px)' }}
      >
        <div
          style={{
            maxWidth: 920,
            margin: '0 auto',
            overflow: 'hidden',
            border: '1px solid #2A1E3A',
            background: '#050308',
            boxShadow: '0 28px 80px rgba(139, 47, 248, .12)',
          }}
        >
          <img
            src="/assets/Project/Conekt_Ads.webp"
            alt={t.tConektImageAlt}
            width="1600"
            height="901"
            style={{ display: 'block', width: '100%', height: 'auto' }}
          />
        </div>
      </section> */}

      <section
        className="te-work-pad-x"
        style={{ paddingTop: 'clamp(42px, 6vw, 72px)' }}
      >
        <div style={{ maxWidth: 920, margin: '0 auto' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              marginBottom: 16,
              font: "500 11px 'JetBrains Mono', monospace",
              letterSpacing: '.16em',
              color: '#C6A0FF',
            }}
          >
            <span style={{ color: '#8B2FF8' }}>VIDEO</span>
            <span style={{ flex: 1, height: 1, background: '#241933' }} />
            <span>{t.tConektVideo}</span>
          </div>

          {CONEKT_ADS_VIDEO ? (
            <video
              controls
              playsInline
              preload="metadata"
              poster="/assets/Project/Conekt_Ads.webp"
              aria-label={t.tConektVideo}
              style={{
                display: 'block',
                width: '100%',
                aspectRatio: '16/9',
                border: '1px solid #2A1E3A',
                background: '#050308',
              }}
            >
              <source src={CONEKT_ADS_VIDEO} />
            </video>
          ) : (
            <div
              aria-label={t.tConektVideoPlaceholder}
              style={{
                aspectRatio: '16/9',
                display: 'grid',
                placeItems: 'center',
                border: '1px solid #2A1E3A',
                background:
                  'radial-gradient(circle at 50% 45%, rgba(139,47,248,.18), transparent 34%), linear-gradient(135deg, #100917, #050308)',
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <span
                  aria-hidden="true"
                  style={{
                    width: 58,
                    height: 58,
                    margin: '0 auto 16px',
                    display: 'grid',
                    placeItems: 'center',
                    border: '1px solid #6F35A8',
                    borderRadius: '50%',
                    color: '#C6A0FF',
                    fontSize: 20,
                  }}
                >
                  ▶
                </span>
                <span
                  style={{
                    font: "500 11px 'JetBrains Mono', monospace",
                    letterSpacing: '.14em',
                    color: '#8B7BA3',
                  }}
                >
                  {t.tConektVideoPlaceholder}
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      <section
        className="te-work-pad-x"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
          gap: 1,
          paddingTop: 'clamp(52px, 7vw, 84px)',
        }}
      >
        <InfoPanel index="01" title={t.tConektProblem} body={t.tConektProblemBody} />
        <InfoPanel index="02" title={t.tConektSolution} body={t.tConektSolutionBody} />
      </section>

      <section
        className="te-work-pad-x"
        style={{ paddingTop: 'clamp(52px, 7vw, 84px)', paddingBottom: 84 }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 18,
            paddingBottom: 18,
            borderBottom: '1px solid #241933',
            marginBottom: 26,
          }}
        >
          <span
            style={{
              font: "500 11px 'JetBrains Mono', monospace",
              letterSpacing: '.2em',
              color: '#8B2FF8',
            }}
          >
            03
          </span>
          <h2
            style={{
              margin: 0,
              font: '400 clamp(28px, 4vw, 48px)/1 Anton, sans-serif',
              textTransform: 'uppercase',
            }}
          >
            {t.tConektHelpful}
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 230px), 1fr))',
            gap: 1,
            background: '#2A1E3A',
            border: '1px solid #2A1E3A',
          }}
        >
          {benefits.map(([title, body], index) => (
            <article key={title} style={{ padding: '28px 24px', background: '#0B0710' }}>
              <span
                style={{
                  color: '#E8BE7C',
                  font: "500 10px 'JetBrains Mono', monospace",
                  letterSpacing: '.16em',
                }}
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3
                style={{
                  margin: '18px 0 10px',
                  font: '400 25px/1 Anton, sans-serif',
                  textTransform: 'uppercase',
                }}
              >
                {title}
              </h3>
              <p
                style={{
                  margin: 0,
                  font: "400 12px/1.7 'JetBrains Mono', monospace",
                  color: '#8B7BA3',
                }}
              >
                {body}
              </p>
            </article>
          ))}
        </div>

        <div
          style={{
            marginTop: 1,
            padding: '24px',
            border: '1px solid #2A1E3A',
            font: "400 12px/1.7 'JetBrains Mono', monospace",
            color: '#9C8CB4',
          }}
        >
          <span style={{ color: '#C6A0FF' }}>{t.tConektBuiltFor}: </span>
          {t.tConektBuiltForBody}
        </div>
      </section>
    </main>
  )
}
