import { Logo } from './Media'
import { linkProps } from '../lib/router'
import { pathFor } from '../data/routes'

export default function Navbar({ t, nav }) {
  const { setLang, ink, enBg, enFg, frBg, frFg, lang, navigate, page } = nav
  const to = (key, hash = '') => linkProps(key, lang, navigate, hash)

  const links = [
    { id: 'home', page: 'home', label: t.tHome },
    { id: 'services', page: 'services', label: t.tServices },
    { id: 'creative', page: 'work', label: t.tCreative },
    { id: 'tech', page: 'tech', label: t.tTech },
    { id: 'contact', page: 'contact', label: t.tContact },
  ]

  return (
    <header className="te-nav">
      <a
        {...to('home')}
        aria-label={t.tHome}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          textDecoration: 'none',
          color: 'inherit',
        }}
      >
        <Logo height={26} />
      </a>

      <nav className="te-nav-links" aria-label="Primary">
        {links.map(({ id, page: targetPage, hash, label }) => (
          <a
            key={id}
            {...to(targetPage, hash)}
            aria-current={!hash && (page === targetPage || (targetPage === 'tech' && page === 'conektAds')) ? 'page' : undefined}
            style={{
              textDecoration: 'none',
              font: 'inherit',
              letterSpacing: 'inherit',
              textTransform: 'inherit',
              color:
                targetPage === 'tech' && page === 'conektAds'
                  ? '#F4F0FA'
                  : hash
                    ? '#A99BBE'
                    : ink(targetPage),
            }}
          >
            {label}
          </a>
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
          {/* Real hrefs, so each language version of a page is reachable and
              linkable rather than hidden behind a state toggle. */}
          <a
            href={pathFor(page, 'en')}
            hrefLang="en"
            onClick={(e) => {
              if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
              e.preventDefault()
              setLang('en')
            }}
            style={{
              background: enBg,
              color: enFg,
              padding: '8px 12px',
              textDecoration: 'none',
              font: 'inherit',
              letterSpacing: 'inherit',
            }}
          >
            EN
          </a>
          <a
            href={pathFor(page, 'fr')}
            hrefLang="fr"
            onClick={(e) => {
              if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
              e.preventDefault()
              setLang('fr')
            }}
            style={{
              background: frBg,
              color: frFg,
              padding: '8px 12px',
              textDecoration: 'none',
              font: 'inherit',
              letterSpacing: 'inherit',
            }}
          >
            FR
          </a>
        </div>
        <a
          {...to('contact')}
          style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 9,
            background: '#8B2FF8',
            color: '#fff',
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
        </a>
      </div>
    </header>
  )
}
