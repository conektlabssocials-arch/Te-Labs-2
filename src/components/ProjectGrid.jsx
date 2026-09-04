import { ImageSlot } from './Media'
import { linkProps } from '../lib/router'

const CONTACT_URL = 'tel:+33613344339'

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

export default function ProjectGrid({ id, items, type, t, lang, navigate }) {
  const isApp = type === 'app'
  const isSoftware = type === 'software'
  const isCaseStudy = type === 'case-study'
  const actionLabel = isCaseStudy ? t.tOpenCaseStudy : t.tOpenProject

  return (
    <div id={id} className="te-web-grid">
      {items.map((item) => {
        const alt = isCaseStudy
          ? t.tAltCaseStudy
          : isSoftware
            ? t.tAltSoftware
            : isApp
              ? t.tAltApp
              : t.tAltWeb

        const action = item.contact ? (
          <a
            className="te-tech-card__action"
            href={CONTACT_URL}
            aria-label={`${t.tPortfolioContact} — ${item.title}`}
          >
            {t.tPortfolioContact}
            <span aria-hidden="true">→</span>
          </a>
        ) : item.url || item.page ? (
          <span className="te-tech-card__action">
            {actionLabel}
            <span aria-hidden="true">{item.page ? '→' : '↗'}</span>
          </span>
        ) : null

        const card = (
          <>
            <div
              className="te-tech-card__frame"
              style={{ border: '1px solid #2A1E3A', background: '#050308' }}
            >
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
                  alt={`${item.title} — ${alt}`}
                  placeholder={item.title}
                />
              </div>
            </div>
            <div style={{ marginTop: 10 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: 12,
                  font: "500 11px 'JetBrains Mono', monospace",
                  letterSpacing: '.1em',
                  color: '#BFB2D4',
                }}
              >
                <span>{item.title}</span>
                {action}
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

        if (item.url) {
          return (
            <a
              key={item.id}
              className="te-work-lift te-tech-card"
              href={item.url}
              target="_blank"
              rel="noreferrer"
              aria-label={`${item.title} — ${actionLabel}`}
            >
              {card}
            </a>
          )
        }

        return (
          <article key={item.id} className="te-work-lift te-tech-card te-tech-card--static">
            {card}
          </article>
        )
      })}
    </div>
  )
}
