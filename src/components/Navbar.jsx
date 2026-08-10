import { LogoMark } from './Media'

export default function Navbar({ t, nav }) {
  const { go, setLang, ink, enBg, enFg, frBg, frFg } = nav

  return (
    <header className="te-nav">
      <button
        type="button"
        onClick={() => go('home')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          background: 'none',
          border: 0,
          padding: 0,
          cursor: 'pointer',
          color: 'inherit',
        }}
      >
        <LogoMark size={34} />
        <span style={{ font: '400 20px Anton, sans-serif', letterSpacing: '.1em' }}>TE LABS</span>
      </button>

      <nav className="te-nav-links" aria-label="Primary">
        {[
          ['home', t.tHome],
          ['services', t.tServices],
          ['work', t.tWork],
          ['contact', t.tContact],
        ].map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => go(key)}
            style={{
              background: 'none',
              border: 0,
              padding: 0,
              cursor: 'pointer',
              font: 'inherit',
              letterSpacing: 'inherit',
              textTransform: 'inherit',
              color: ink(key),
            }}
          >
            {label}
          </button>
        ))}
      </nav>

      <div className="te-nav-actions">
        <div
          style={{
            display: 'flex',
            border: '1px solid #3A2A52',
            font: "500 11px 'JetBrains Mono', monospace",
            letterSpacing: '.12em',
          }}
        >
          <button
            type="button"
            onClick={() => setLang('en')}
            style={{
              background: enBg,
              color: enFg,
              border: 0,
              padding: '8px 12px',
              cursor: 'pointer',
              font: 'inherit',
              letterSpacing: 'inherit',
            }}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLang('fr')}
            style={{
              background: frBg,
              color: frFg,
              border: 0,
              padding: '8px 12px',
              cursor: 'pointer',
              font: 'inherit',
              letterSpacing: 'inherit',
            }}
          >
            FR
          </button>
        </div>
        <button
          type="button"
          onClick={() => go('contact')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 9,
            background: '#8B2FF8',
            color: '#fff',
            border: 0,
            padding: '12px 16px',
            cursor: 'pointer',
            font: "700 12px 'JetBrains Mono', monospace",
            letterSpacing: '.14em',
            whiteSpace: 'nowrap',
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: '#fff',
              animation: 'teBlink 1.4s steps(1) infinite',
              flex: '0 0 auto',
            }}
          />
          <span className="te-nav-cta-label">{t.tCta}</span>
          <span className="te-nav-cta-label-short">{t.tContact}</span>
        </button>
      </div>
    </header>
  )
}
