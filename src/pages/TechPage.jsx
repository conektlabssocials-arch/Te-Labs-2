import { useEffect, useRef } from 'react'
import { ImageSlot } from '../components/Media'
import { APP_WORK, CASE_STUDIES, SOFTWARE_WORK, WEBSITE_WORK } from '../data/work'
import { linkProps } from '../lib/router'

const PROJECT_SECTION_STYLE = {
  paddingTop: 'clamp(40px, 6vw, 60px)',
  paddingBottom: 0,
}

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

function SectionHeader({ n, title, count }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        width: '100%',
        borderBottom: '1px solid #241933',
        padding: '0 0 18px',
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
        {n}
      </span>
      <h2
        style={{
          margin: 0,
          font: '400 clamp(24px, 3.2vw, 36px) Anton, sans-serif',
          textTransform: 'uppercase',
          color: '#F4F0FA',
        }}
      >
        {title}
      </h2>
      <span style={{ flex: 1, minWidth: 20, height: 1, background: '#241933' }} />
      <span
        style={{
          font: "500 10px 'JetBrains Mono', monospace",
          letterSpacing: '.16em',
          color: '#6E5C86',
          whiteSpace: 'nowrap',
        }}
      >
        {String(count).padStart(2, '0')}
      </span>
      <span aria-hidden="true" style={{ color: '#C6A0FF', fontSize: 20 }}>→</span>
    </div>
  )
}

function ProjectGrid({ items, type, t, lang, navigate, label }) {
  const railRef = useRef(null)
  const isApp = type === 'app'
  const isSoftware = type === 'software'
  const isCaseStudy = type === 'case-study'
  const actionLabel = isCaseStudy ? t.tOpenCaseStudy : t.tOpenProject

  useEffect(() => {
    const rail = railRef.current
    if (!rail) return undefined

    const handleWheel = (event) => {
      // Trackpads already provide native horizontal movement. Translate only
      // a primarily vertical wheel gesture when this rail can move further.
      if (!event.deltaY || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return

      const maxScrollLeft = rail.scrollWidth - rail.clientWidth
      const movingForward = event.deltaY > 0
      const canMove = movingForward
        ? rail.scrollLeft < maxScrollLeft - 1
        : rail.scrollLeft > 1

      if (!canMove) return

      event.preventDefault()
      const deltaScale = event.deltaMode === 1
        ? 24
        : event.deltaMode === 2
          ? rail.clientWidth
          : 1
      rail.scrollLeft += event.deltaY * deltaScale
    }

    rail.addEventListener('wheel', handleWheel, { passive: false })
    return () => rail.removeEventListener('wheel', handleWheel)
  }, [])

  return (
    <div
      ref={railRef}
      className="te-tech-rail"
      role="region"
      aria-label={label}
      tabIndex="0"
    >
      {items.map((item) => {
        const card = (
          <>
            <div className="te-tech-card__frame" style={{ border: '1px solid #2A1E3A', background: '#050308' }}>
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
                {item.url || item.page ? (
                  <span className="te-tech-card__action">
                    {actionLabel}
                    <span aria-hidden="true">{item.page ? '→' : '↗'}</span>
                  </span>
                ) : null}
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
              className="te-work-lift te-tech-card"
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
            className="te-work-lift te-tech-card"
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
        <div style={{ marginBottom: 20 }}>
          <span
            style={{
              font: "500 12px 'JetBrains Mono', monospace",
              letterSpacing: '.2em',
              color: '#8B2FF8',
            }}
          >
            {t.tTech}
          </span>
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

      <section id="software" className="te-work-pad-x" style={PROJECT_SECTION_STYLE}>
        <SectionHeader n="03" title={t.tSoftware} count={SOFTWARE_WORK.length} />
        <ProjectGrid items={SOFTWARE_WORK} type="software" t={t} lang={lang} navigate={navigate} label={t.tSoftware} />
      </section>

      <section id="apps" className="te-work-pad-x" style={PROJECT_SECTION_STYLE}>
        <SectionHeader n="02" title={t.tApps} count={APP_WORK.length} />
        <ProjectGrid items={APP_WORK} type="app" t={t} lang={lang} navigate={navigate} label={t.tApps} />
      </section>

      <section id="case-studies" className="te-work-pad-x" style={PROJECT_SECTION_STYLE}>
        <SectionHeader n="04" title={t.tCaseStudies} count={CASE_STUDIES.length} />
        <ProjectGrid items={CASE_STUDIES} type="case-study" t={t} lang={lang} navigate={navigate} label={t.tCaseStudies} />
      </section>

      <section id="websites" className="te-work-pad-x" style={PROJECT_SECTION_STYLE}>
        <SectionHeader n="01" title={t.tWebsites} count={WEBSITE_WORK.length} />
        <ProjectGrid items={WEBSITE_WORK} type="website" t={t} lang={lang} navigate={navigate} label={t.tWebsites} />
      </section>
    </div>
  )
}
