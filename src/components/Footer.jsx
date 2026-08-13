import { Logo } from './Media'

export default function Footer({ t, go }) {
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
            <button type="button" onClick={() => go('services')} style={linkBtn}>
              {t.tSocialShort}
            </button>
            <button type="button" onClick={() => go('services')} style={linkBtn}>
              {t.tWeb}
            </button>
            <button type="button" onClick={() => go('services')} style={linkBtn}>
              {t.tVideo}
            </button>
          </div>
          <div>
            <div style={{ color: '#C6A0FF', letterSpacing: '.16em', marginBottom: 8 }}>
              {t.tStudio}
            </div>
            <button type="button" onClick={() => go('work')} style={linkBtn}>
              {t.tWork}
            </button>
            <button type="button" onClick={() => go('home')} style={linkBtn}>
              {t.tProcess}
            </button>
            <button type="button" onClick={() => go('contact')} style={linkBtn}>
              {t.tContact}
            </button>
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

const linkBtn = {
  display: 'block',
  background: 'none',
  border: 0,
  padding: 0,
  cursor: 'pointer',
  font: 'inherit',
  color: 'inherit',
}
