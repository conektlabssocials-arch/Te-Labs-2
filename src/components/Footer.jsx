import { Logo } from './Media'
import { linkProps } from '../lib/router'

export default function Footer({ t, lang, navigate }) {
  const to = (key) => linkProps(key, lang, navigate)

  return (
    <>
      <div
        style={{
          padding: 'clamp(32px, 4vw, 46px) clamp(20px, 4vw, 40px)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          gap: 'clamp(24px, 3vw, 40px)',
          borderTop: '1px solid #241933',
        }}
      >
        <div style={{ maxWidth: 340 }}>
          <Logo height={30} />
          <div
            style={{
              marginTop: 10,
              font: "400 12px/1.7 'JetBrains Mono', monospace",
              color: '#6E5C86',
            }}
          >
            {t.tTagline}
            <br />
            Paris.
          </div>
          <div
            style={{
              marginTop: 18,
              display: 'grid',
              gap: 6,
              font: "400 12px 'JetBrains Mono', monospace",
            }}
          >
            <a href="mailto:tahinaelisa@telabs.fr" style={{ color: '#E4DAF5' }}>
              {t.tEmail}
            </a>
            <a href="tel:+33613344339" style={{ color: '#9C8CB4' }}>
              {t.tPhone}
            </a>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'clamp(28px, 5vw, 70px)',
            font: "400 12px/2 'JetBrains Mono', monospace",
            color: '#9C8CB4',
          }}
        >
          <div>
            <div style={{ color: '#C6A0FF', letterSpacing: '.16em', marginBottom: 8 }}>
              {t.tServices}
            </div>
            {/* Each service deep-links to its own section, so the three links
                no longer share one destination and one blob of anchor text. */}
            {[
              ['social', t.tSocialShort],
              ['web', t.tWeb],
              ['video', t.tVideo],
            ].map(([hash, label]) => (
              <a key={hash} {...linkProps('services', lang, navigate, hash)} style={footerLink}>
                {label}
              </a>
            ))}
          </div>
          <div>
            <div style={{ color: '#C6A0FF', letterSpacing: '.16em', marginBottom: 8 }}>
              {t.tStudio}
            </div>
            <a {...to('work')} style={footerLink}>
              {t.tWork}
            </a>
            <a {...linkProps('home', lang, navigate, 'process')} style={footerLink}>
              {t.tProcess}
            </a>
            <a {...to('contact')} style={footerLink}>
              {t.tContact}
            </a>
          </div>
        </div>
      </div>
      <div
        style={{
          padding: '16px clamp(20px, 4vw, 40px)',
          borderTop: '1px solid #241933',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 10,
          justifyContent: 'space-between',
          font: "500 10px 'JetBrains Mono', monospace",
          letterSpacing: '.16em',
          color: '#4A3A63',
        }}
      >
        <span>{t.tSignoff}</span>
        <span>{t.tTagline}</span>
        <span>FR / EN</span>
      </div>
    </>
  )
}

const footerLink = {
  display: 'block',
  textDecoration: 'none',
  font: 'inherit',
  color: 'inherit',
}
