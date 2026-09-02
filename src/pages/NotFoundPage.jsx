import { linkProps } from '../lib/router'

/**
 * The page a URL that resolves to nothing lands on.
 *
 * Deliberately the lightest page on the site: no three.js, no video, no
 * marquee. Someone who is already lost should not also wait on a 3D model —
 * the hero's gradient and grid carry the brand on their own, and every element
 * below the headline is a way back out.
 */
export default function NotFoundPage({ t, lang, navigate }) {
  // The main destinations that are not home, each with the line the page
  // itself leads with — so the choice is made on substance, not on a bare slug.
  const destinations = [
    { n: '01', page: 'services', label: t.tServices, blurb: `${t.tServicesHeroA} ${t.tServicesHeroB}` },
    { n: '02', page: 'work', label: t.tCreative, blurb: `${t.tWorkHeroA} ${t.tWorkHeroB}` },
    { n: '03', page: 'tech', label: t.tTech, blurb: `${t.tTechHeroA} ${t.tTechHeroB}` },
    { n: '04', page: 'contact', label: t.tContact, blurb: t.tHeroReassure },
  ]

  return (
    <div className="te-404">
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: 'radial-gradient(90% 80% at 74% 30%, rgba(139,47,248,.30), transparent 62%)',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage:
            'linear-gradient(rgba(198,160,255,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(198,160,255,.045) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />
      {/* The status code as a watermark rather than as the headline: it is what
          happened, not what the visitor needs to read first. */}
      <span className="te-404-ghost" aria-hidden="true">
        404
      </span>

      <div className="te-404-inner" data-no-reveal="1">
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 9,
            border: '1px solid #4A2E70',
            padding: '7px 13px',
            font: "500 11px 'JetBrains Mono', monospace",
            letterSpacing: '.2em',
            color: '#DCCBFF',
            marginBottom: 30,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              background: '#E8BE7C',
              borderRadius: '50%',
              animation: 'teBlink 1.4s steps(1) infinite',
              flex: '0 0 auto',
            }}
          />
          {t.t404Eyebrow}
        </div>

        <h1
          style={{
            margin: 0,
            font: "400 clamp(38px, 6.6vw, 94px)/0.92 Anton, sans-serif",
            letterSpacing: '-.01em',
            textTransform: 'uppercase',
          }}
        >
          <span style={{ display: 'block', color: '#6E5C86' }}>{t.t404A}</span>
          <span
            style={{
              display: 'block',
              color: '#F4F0FA',
              textShadow: '6px 0 0 rgba(139,47,248,.55)',
            }}
          >
            {t.t404B}
          </span>
        </h1>

        <p
          style={{
            maxWidth: 560,
            margin: '28px 0 36px',
            font: "400 16px/1.75 'JetBrains Mono', monospace",
            color: '#BFB2D4',
            textWrap: 'pretty',
          }}
        >
          {t.t404Sub}
        </p>

        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
          <a
            {...linkProps('home', lang, navigate)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              background: '#8B2FF8',
              color: '#fff',
              padding: '18px 26px',
              font: "700 13px 'JetBrains Mono', monospace",
              letterSpacing: '.16em',
              textTransform: 'uppercase',
            }}
          >
            {t.t404Home} →
          </a>
          <a
            className="te-talk-cta"
            {...linkProps('contact', lang, navigate)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '18px 26px',
              border: '1px solid #3A2A52',
              color: '#DCCBFF',
              font: "500 13px 'JetBrains Mono', monospace",
              letterSpacing: '.16em',
              textTransform: 'uppercase',
            }}
          >
            {t.tContact}
          </a>
        </div>
      </div>

      <nav className="te-404-index" aria-label={t.t404Index}>
        <h2
          style={{
            margin: '0 0 18px',
            font: "500 11px 'JetBrains Mono', monospace",
            letterSpacing: '.2em',
            color: '#E8BE7C',
            textTransform: 'uppercase',
          }}
        >
          {t.t404Index}
        </h2>

        <div className="te-404-list">
          {destinations.map(({ n, page, label, blurb }) => (
            <a key={page} className="te-404-row te-lift" {...linkProps(page, lang, navigate)}>
              <span
                style={{
                  font: "500 12px 'JetBrains Mono', monospace",
                  letterSpacing: '.16em',
                  color: '#8B2FF8',
                }}
              >
                {n}
              </span>
              <span
                style={{
                  font: "400 clamp(20px, 2.6vw, 30px)/1 Anton, sans-serif",
                  textTransform: 'uppercase',
                  color: '#F4F0FA',
                }}
              >
                {label}
              </span>
              <span
                style={{
                  font: "400 12px/1.6 'JetBrains Mono', monospace",
                  color: '#9C8CB4',
                }}
              >
                {blurb}
              </span>
              <span aria-hidden="true" className="te-404-arrow">
                →
              </span>
            </a>
          ))}
        </div>

        <p
          style={{
            margin: '22px 0 0',
            font: "400 12px/1.7 'JetBrains Mono', monospace",
            color: '#6E5C86',
          }}
        >
          {t.t404Lost}{' '}
          <a href={`mailto:${t.tEmail}`} style={{ color: '#C6A0FF' }}>
            {t.tEmail}
          </a>
        </p>
      </nav>
    </div>
  )
}
