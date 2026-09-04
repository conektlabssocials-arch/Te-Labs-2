import ProjectGrid from '../components/ProjectGrid'
import { APP_WORK, CASE_STUDIES, SOFTWARE_WORK } from '../data/work'

const PROJECT_SECTION_STYLE = {
  paddingTop: 'clamp(40px, 6vw, 60px)',
  paddingBottom: 0,
}
function SectionHeader({ n, title, count, visibleCount }) {
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
        {String(visibleCount).padStart(2, '0')} / {String(count).padStart(2, '0')}
      </span>
    </div>
  )
}

function SectionIntro({ children }) {
  return (
    <p
      style={{
        maxWidth: 760,
        margin: '0 0 28px',
        color: '#A99BBE',
        font: "400 13px/1.8 'JetBrains Mono', monospace",
      }}
    >
      {children}
    </p>
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
        <SectionHeader n="02" title={t.tSoftware} count={SOFTWARE_WORK.length} visibleCount={SOFTWARE_WORK.length} />
        <SectionIntro>{t.tSoftwareIntro}</SectionIntro>
        <ProjectGrid id="software-projects" items={SOFTWARE_WORK} type="software" t={t} lang={lang} navigate={navigate} />
      </section>

      <section id="apps" className="te-work-pad-x" style={PROJECT_SECTION_STYLE}>
        <SectionHeader n="03" title={t.tApps} count={APP_WORK.length} visibleCount={APP_WORK.length} />
        <SectionIntro>{t.tAppsIntro}</SectionIntro>
        <ProjectGrid id="apps-projects" items={APP_WORK} type="app" t={t} lang={lang} navigate={navigate} />
      </section>

      <section id="case-studies" className="te-work-pad-x" style={PROJECT_SECTION_STYLE}>
        <SectionHeader n="04" title={t.tCaseStudies} count={CASE_STUDIES.length} visibleCount={CASE_STUDIES.length} />
        <SectionIntro>{t.tAutomationIntro}</SectionIntro>
        <ProjectGrid id="case-studies-projects" items={CASE_STUDIES} type="case-study" t={t} lang={lang} navigate={navigate} />
      </section>
    </div>
  )
}
