import { useState } from 'react'
import { ImageSlot } from '../components/Media'
import { APP_WORK, CASE_STUDIES, SOFTWARE_WORK, WEBSITE_WORK } from '../data/work'
import { linkProps } from '../lib/router'

function ProjectImage({ src, alt, placeholder }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <ImageSlot placeholder={placeholder} />
      {src ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.style.display = 'none'
          }}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      ) : null}
    </div>
  )
}

function SectionHeader({ n, title, count, expanded, hovered, onOpen, onHover, onLeave }) {
  const active = hovered || expanded

  return (
    <button
      type="button"
      className="te-work-press"
      onClick={onOpen}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        width: '100%',
        background: 'none',
        border: 0,
        borderBottom: '1px solid #241933',
        padding: '0 0 18px',
        marginBottom: 26,
        cursor: 'pointer',
        textAlign: 'left',
      }}
    >
      <span
        style={{
          font: "500 11px 'JetBrains Mono', monospace",
          letterSpacing: '.2em',
          color: '#8B2FF8',
        }}
      >
        {n}
      </span>
      <h2
        style={{
          margin: 0,
          font: '400 clamp(24px, 3.2vw, 36px) Anton, sans-serif',
          textTransform: 'uppercase',
          color: hovered ? '#FFFFFF' : '#F4F0FA',
        }}
      >
        {title}
      </h2>
      <span
        style={{
          font: '400 30px Anton, sans-serif',
          color: '#C6A0FF',
          opacity: active ? 1 : 0,
          transform: `translateX(${active ? '0px' : '-14px'})`,
          transition: 'opacity .18s ease, transform .18s ease',
        }}
      >
        →
      </span>
      <span style={{ flex: 1, minWidth: 20, height: 1, background: '#241933' }} />
      <span
        style={{
          font: "500 10px 'JetBrains Mono', monospace",
          letterSpacing: '.16em',
          color: '#6E5C86',
          whiteSpace: 'nowrap',
        }}
      >
        {count}
      </span>
    </button>
  )
}

function ProjectGrid({ items, type, t, lang, navigate }) {
  const isApp = type === 'app'
  const isSoftware = type === 'software'
  const isCaseStudy = type === 'case-study'

  return (
    <div className="te-web-grid">
      {items.map((item) => {
        const card = (
          <>
            <div style={{ border: '1px solid #2A1E3A', background: '#050308' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                padding: '10px 12px',
                borderBottom: '1px solid #2A1E3A',
                background: '#150C20',
              }}
            >
              <div style={{ display: 'flex', gap: 5 }} aria-hidden="true">
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#3A2E4C' }} />
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#3A2E4C' }} />
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#8B2FF8' }} />
              </div>
              <span
                style={{
                  font: "500 9px 'JetBrains Mono', monospace",
                  letterSpacing: '.14em',
                  color: '#8B7BA3',
                }}
              >
                {isCaseStudy
                  ? t.tCaseStudyBadge
                  : isSoftware
                    ? t.tSoftwareBadge
                    : isApp
                      ? t.tAppBadge
                      : t.tWebsiteBadge}
              </span>
            </div>
            <div style={{ aspectRatio: '16/9' }}>
              <ProjectImage
                src={item.thumbnail}
                alt={`${item.title} — ${isCaseStudy ? t.tAltCaseStudy : isSoftware ? t.tAltSoftware : isApp ? t.tAltApp : t.tAltWeb}`}
                placeholder={item.title}
              />
            </div>
          </div>
            <div style={{ marginTop: 10 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 12,
                  font: "500 11px 'JetBrains Mono', monospace",
                  letterSpacing: '.1em',
                  color: '#BFB2D4',
                }}
              >
                <span>{item.title}</span>
                {item.url || item.page ? <span style={{ color: '#C6A0FF' }}>↗</span> : null}
              </div>
              {item.descriptionKey ? (
                <p
                  style={{
                    margin: '8px 0 0',
                    font: "400 11px/1.65 'JetBrains Mono', monospace",
                    color: '#7F7096',
                    letterSpacing: 0,
                  }}
                >
                  {t[item.descriptionKey]}
                </p>
              ) : null}
            </div>
          </>
        )

        if (item.page) {
          return (
            <a
              key={item.id}
              className="te-work-lift"
              {...linkProps(item.page, lang, navigate)}
              aria-label={`${item.title} — ${t.tOpenProject}`}
            >
              {card}
            </a>
          )
        }

        return item.url ? (
          <a
            key={item.id}
            className="te-work-lift"
            href={item.url}
            target="_blank"
            rel="noreferrer"
            aria-label={`${item.title} — ${isCaseStudy ? t.tOpenCaseStudy : t.tOpenProject}`}
          >
            {card}
          </a>
        ) : (
          <div key={item.id} className="te-work-lift">
            {card}
          </div>
        )
      })}
    </div>
  )
}

export default function TechPage({ t, lang, navigate }) {
  const [expanded, setExpanded] = useState(null)
  const [hovered, setHovered] = useState(null)
  const show = (key) => expanded === null || expanded === key
  const open = (key) => {
    setExpanded(key)
    window.scrollTo(0, 0)
  }
  const count = (visible, total) =>
    expanded ? `${total} / ${total}` : `${visible} ${lang === 'fr' ? 'sur' : 'of'} ${total}`

  return (
    <div>
      <section
        className="te-work-pad-x"
        style={{
          paddingTop: 'clamp(44px, 6vw, 72px)',
          paddingBottom: 'clamp(28px, 4vw, 48px)',
          borderBottom: '1px solid #241933',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 20, flexWrap: 'wrap' }}>
          <span
            style={{
              font: "500 12px 'JetBrains Mono', monospace",
              letterSpacing: '.2em',
              color: '#8B2FF8',
            }}
          >
            {t.tTech}
          </span>
          {expanded ? (
            <button
              type="button"
              className="te-work-press"
              onClick={() => setExpanded(null)}
              style={{
                background: 'none',
                border: '1px solid #4A2E70',
                color: '#DCCBFF',
                padding: '8px 14px',
                cursor: 'pointer',
                font: "500 10px 'JetBrains Mono', monospace",
                letterSpacing: '.16em',
              }}
            >
              ← {t.tAllTech}
            </button>
          ) : null}
        </div>
        <h1
          style={{
            margin: 0,
            font: '400 clamp(36px, 6vw, 84px)/0.94 Anton, sans-serif',
            textTransform: 'uppercase',
          }}
        >
          {t.tTechHeroA}
          <br />
          <span style={{ color: '#C6A0FF' }}>{t.tTechHeroB}</span>
        </h1>
      </section>

      {show('websites') ? (
        <section
          id="websites"
          className="te-work-pad-x"
          style={{
            paddingTop: 'clamp(40px, 6vw, 60px)',
            paddingBottom: expanded === 'websites' ? 84 : 0,
          }}
        >
          <SectionHeader
            n="01"
            title={t.tWebsites}
            count={count(Math.min(3, WEBSITE_WORK.length), WEBSITE_WORK.length)}
            expanded={expanded === 'websites'}
            hovered={hovered === 'websites'}
            onOpen={() => open('websites')}
            onHover={() => setHovered('websites')}
            onLeave={() => setHovered(null)}
          />
          <ProjectGrid items={WEBSITE_WORK.slice(0, 3)} type="website" t={t} lang={lang} navigate={navigate} />
          {expanded === 'websites' ? (
            <div style={{ marginTop: 14 }}>
              <ProjectGrid items={WEBSITE_WORK.slice(3)} type="website" t={t} lang={lang} navigate={navigate} />
            </div>
          ) : null}
        </section>
      ) : null}

      {show('apps') ? (
        <section
          id="apps"
          className="te-work-pad-x"
          style={{
            paddingTop: 'clamp(40px, 6vw, 60px)',
            paddingBottom: expanded === 'apps' ? 84 : 0,
          }}
        >
          <SectionHeader
            n="02"
            title={t.tApps}
            count={count(Math.min(3, APP_WORK.length), APP_WORK.length)}
            expanded={expanded === 'apps'}
            hovered={hovered === 'apps'}
            onOpen={() => open('apps')}
            onHover={() => setHovered('apps')}
            onLeave={() => setHovered(null)}
          />
          <ProjectGrid items={APP_WORK.slice(0, 3)} type="app" t={t} lang={lang} navigate={navigate} />
          {expanded === 'apps' ? (
            <div style={{ marginTop: 14 }}>
              <ProjectGrid items={APP_WORK.slice(3)} type="app" t={t} lang={lang} navigate={navigate} />
            </div>
          ) : null}
        </section>
      ) : null}

      {show('software') ? (
        <section
          id="software"
          className="te-work-pad-x"
          style={{
            paddingTop: 'clamp(40px, 6vw, 60px)',
            paddingBottom: expanded === 'software' ? 84 : 0,
          }}
        >
          <SectionHeader
            n="03"
            title={t.tSoftware}
            count={count(SOFTWARE_WORK.length, SOFTWARE_WORK.length)}
            expanded={expanded === 'software'}
            hovered={hovered === 'software'}
            onOpen={() => open('software')}
            onHover={() => setHovered('software')}
            onLeave={() => setHovered(null)}
          />
          <ProjectGrid items={SOFTWARE_WORK} type="software" t={t} lang={lang} navigate={navigate} />
        </section>
      ) : null}

      {show('case-studies') ? (
        <section
          id="case-studies"
          className="te-work-pad-x"
          style={{ paddingTop: 'clamp(40px, 6vw, 60px)', paddingBottom: 84 }}
        >
          <SectionHeader
            n="04"
            title={t.tCaseStudies}
            count={count(Math.min(3, CASE_STUDIES.length), CASE_STUDIES.length)}
            expanded={expanded === 'case-studies'}
            hovered={hovered === 'case-studies'}
            onOpen={() => open('case-studies')}
            onHover={() => setHovered('case-studies')}
            onLeave={() => setHovered(null)}
          />
          <ProjectGrid items={CASE_STUDIES.slice(0, 3)} type="case-study" t={t} lang={lang} navigate={navigate} />
          {expanded === 'case-studies' ? (
            <div style={{ marginTop: 14 }}>
              <ProjectGrid items={CASE_STUDIES.slice(3)} type="case-study" t={t} lang={lang} navigate={navigate} />
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  )
}
