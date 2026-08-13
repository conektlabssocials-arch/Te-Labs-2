import { Tower3D, Mini3D, CountStat, SectionLabel, AutoVideo } from '../components/Media'
import ClientsMarquee from '../components/ClientsMarquee'
import Faq from '../components/Faq'
import { REEL_SLOTS } from '../data/work'

// How many films ride the marquee before it repeats.
const REEL_COUNT = 6

const CLIENTS = [
  {
    src: 'https://framerusercontent.com/images/KAjd8f5TRi5rJGgRvp9pV3IQ4UQ.png?width=480&height=197',
    alt: 'Client 1',
  },
  {
    src: 'https://framerusercontent.com/images/GVtCa2XzR9RiLZWL5gPLCmJmw.png?width=2206&height=1434',
    alt: 'Client 2',
  },
  {
    src: 'https://framerusercontent.com/images/nPWVU8jqTjivz3LbV1oDprTzcR0.png?width=326&height=320',
    alt: 'Client 5',
  },
  {
    src: 'https://framerusercontent.com/images/HefBCJNpVLw4jh4IopVhmt80.png?width=826&height=283',
    alt: 'Client 7',
  },
  
  {
    src: 'https://framerusercontent.com/images/xup5drWRz2JNLuwhiDNwVO5nk.png?width=200&height=200',
    alt: 'Client 12',
  },
]

export default function HomePage({ t, go, faq, setFaq }) {
  const lanes = [
    { n: '01', kind: 'reel', title: t.tVideo, pitch: t.tVideoPitch },
    { n: '02', kind: 'globe', title: t.tSocial, pitch: t.tSocialPitch },
    { n: '03', kind: 'screen', title: t.tWeb, pitch: t.tWebPitch },
  ]

  const steps = [
    { n: '01', week: `${t.tWeek} 01`, title: t.tStep1, body: t.tStep1Body },
    { n: '02', week: `${t.tWeek} 02`, title: t.tStep2, body: t.tStep2Body },
    { n: '03', week: `${t.tWeek} 03—04`, title: t.tStep3, body: t.tStep3Body },
    { n: '04', week: t.tOngoing, title: t.tStep4, body: t.tStep4Body },
  ]

  // teDrift slides the strip by -50%, so the second half has to be an exact
  // copy of the first for the loop to be seamless.
  const reels = REEL_SLOTS.slice(0, REEL_COUNT)
  const marquee = [...reels, ...reels]

  return (
    <div>
      <div className="te-hero">
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background:
              'radial-gradient(90% 80% at 74% 30%, rgba(139,47,248,.30), transparent 62%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            backgroundImage:
              'linear-gradient(rgba(198,160,255,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(198,160,255,.045) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
          }}
        />
        <Tower3D
          style={{ position: 'absolute', inset: 0, display: 'block', zIndex: 0 }}
        />
        <div className="te-hero-grid">
          <div className="te-hero-copy" data-no-reveal="1">
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
                }}
              />
              {t.tEyebrowHero}
            </div>
            <h1
              style={{
                margin: 0,
                font: "400 clamp(38px, 6.6vw, 94px)/0.92 Anton, sans-serif",
                letterSpacing: '-.01em',
                textTransform: 'uppercase',
              }}
            >
              <span style={{ display: 'block', color: '#6E5C86' }}>{t.tHeroA}</span>
              <span
                style={{
                  display: 'block',
                  color: '#F4F0FA',
                  textShadow: '6px 0 0 rgba(139,47,248,.55)',
                }}
              >
                {t.tHeroC}
              </span>
            </h1>
            <p
              style={{
                maxWidth: 600,
                margin: '28px 0 36px',
                font: "400 16px/1.75 'JetBrains Mono', monospace",
                color: '#BFB2D4',
                textWrap: 'pretty',
              }}
            >
              {t.tHeroSub}
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => go('contact')}
                style={{
                  background: '#F4F0FA',
                  color: '#0B0710',
                  border: 0,
                  padding: '16px 22px',
                  cursor: 'pointer',
                  font: "700 13px 'JetBrains Mono', monospace",
                  letterSpacing: '.14em',
                }}
              >
                {t.tHeroCta} →
              </button>
              <button
                type="button"
                onClick={() => go('work')}
                style={{
                  border: '1px solid #4A2E70',
                  background: 'none',
                  color: '#DCCBFF',
                  padding: '16px 22px',
                  cursor: 'pointer',
                  font: "700 13px 'JetBrains Mono', monospace",
                  letterSpacing: '.14em',
                }}
              >
                {t.tSeeWork}
              </button>
            </div>
          </div>
          <div className="te-hero-stage">
            <div className="te-hero-hint">
              <span
                style={{
                  width: 26,
                  height: 26,
                  flex: '0 0 26px',
                  border: '1px solid #4A2E70',
                  borderRadius: '50%',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: 11,
                  color: '#C6A0FF',
                }}
              >
                ↻
              </span>
              <span>{t.tDragHint}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="te-stats">
        <CountStat to={25} suffix="+" label={t.tStatClients} />
        <CountStat to={1} pad label={t.tStatTeam} />
        <div className="te-stat-cell">
          <div
            style={{
              font: "400 clamp(28px, 3.4vw, 40px) Anton, sans-serif",
              color: '#E8BE7C',
            }}
          >
            FR / EN
          </div>
          <div
            style={{
              font: "500 11px 'JetBrains Mono', monospace",
              letterSpacing: '.16em',
              color: '#8B7BA3',
              marginTop: 6,
            }}
          >
            {t.tStatFirst}
          </div>
        </div>
      </div>

      <div style={{ padding: 'clamp(48px, 7vw, 84px) clamp(20px, 4vw, 40px)' }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'baseline',
            gap: 'clamp(12px, 2vw, 24px)',
            marginBottom: 'clamp(28px, 4vw, 44px)',
          }}
        >
          <SectionLabel index="01" label={t.tServices} />
          <h2
            style={{
              margin: 0,
              font: "400 clamp(28px, 4.4vw, 62px)/0.96 Anton, sans-serif",
              textTransform: 'uppercase',
            }}
          >
            {t.tThreeLanesA}
            <br />
            <span style={{ color: '#C6A0FF' }}>{t.tThreeLanesB}</span>
          </h2>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
            gap: 1,
            background: '#2A1E3A',
            border: '1px solid #2A1E3A',
          }}
        >
          {lanes.map((lane) => (
            <div
              key={lane.n}
              data-lift="1"
              className="te-lift"
              onClick={() => go('services')}
              onKeyDown={(e) => e.key === 'Enter' && go('services')}
              role="button"
              tabIndex={0}
              style={{
                background: '#0B0710',
                padding: '32px 28px',
                minHeight: 300,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
              }}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 18,
                  }}
                >
                  <span
                    style={{
                      font: "500 11px 'JetBrains Mono', monospace",
                      letterSpacing: '.18em',
                      color: '#E8BE7C',
                    }}
                  >
                    {lane.n}
                  </span>
                  <Mini3D kind={lane.kind} style={{ display: 'block', width: 62, height: 62 }} />
                </div>
                <h3
                  style={{
                    margin: '0 0 14px',
                    font: '400 30px Anton, sans-serif',
                    textTransform: 'uppercase',
                  }}
                >
                  {lane.title}
                </h3>
                <p
                  style={{
                    margin: 0,
                    font: "400 13px/1.7 'JetBrains Mono', monospace",
                    color: '#9C8CB4',
                  }}
                >
                  {lane.pitch}
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  go('services')
                }}
                style={{
                  background: 'none',
                  border: 0,
                  borderTop: '1px solid #241933',
                  padding: '16px 0 0',
                  cursor: 'pointer',
                  font: "500 11px 'JetBrains Mono', monospace",
                  letterSpacing: '.16em',
                  color: '#C6A0FF',
                  width: '100%',
                  textAlign: 'left',
                }}
              >
                {t.tMore} →
              </button>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 0 clamp(48px, 7vw, 84px)' }}>
        <div
          className="te-section-pad"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            gap: 24,
            marginBottom: 32,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 24 }}>
            <SectionLabel index="02" label={t.tReel} />
            <h2
              style={{
                margin: 0,
                font: "400 clamp(28px, 4.4vw, 62px)/0.96 Anton, sans-serif",
                textTransform: 'uppercase',
              }}
            >
              {t.tRecentWorkA}
              <br />
              <span style={{ color: '#C6A0FF' }}>{t.tRecentWorkB}</span>
            </h2>
          </div>
          <button
            type="button"
            onClick={() => go('work')}
            style={{
              background: 'none',
              border: '1px solid #4A2E70',
              color: '#DCCBFF',
              padding: '14px 22px',
              cursor: 'pointer',
              font: "700 12px 'JetBrains Mono', monospace",
              letterSpacing: '.14em',
              whiteSpace: 'nowrap',
            }}
          >
            {t.tAllWork} →
          </button>
        </div>
        <div
          style={{
            overflow: 'hidden',
            borderTop: '1px solid #241933',
            borderBottom: '1px solid #241933',
            padding: '20px 0',
            background: '#0D0814',
          }}
        >
          <div
            className="te-marquee"
            style={{
              display: 'flex',
              gap: 16,
              width: 'max-content',
              animation: 'teDrift 44s linear infinite',
            }}
          >
            {marquee.map((item, i) => (
              <div key={`${item.id}-${i}`} className="te-reel-card">
                <AutoVideo src={item.videoSrc} title={item.label} />
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
            padding: '14px var(--pad-x) 0',
            font: "400 11px 'JetBrains Mono', monospace",
            color: '#6E5C86',
          }}
        >
          {t.tHoverPause}
        </div>
      </div>

      <div style={{ padding: '0 clamp(20px, 4vw, 40px) clamp(48px, 7vw, 84px)' }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'baseline',
            gap: 'clamp(12px, 2vw, 24px)',
            marginBottom: 'clamp(24px, 3.5vw, 36px)',
          }}
        >
          <SectionLabel index="03" label={t.tProcess} />
          <h2
            style={{
              margin: 0,
              font: "400 clamp(28px, 4.4vw, 62px)/0.96 Anton, sans-serif",
              textTransform: 'uppercase',
            }}
          >
            {t.tProcessTitleA}
            <br />
            <span style={{ color: '#C6A0FF' }}>{t.tProcessTitleB}</span>
          </h2>
        </div>
        <div
          style={{
            display: 'grid',
            gap: 1,
            background: '#2A1E3A',
            border: '1px solid #2A1E3A',
          }}
        >
          {steps.map((step) => (
            <div key={step.n} className="te-process-row">
              <div style={{ font: '400 clamp(28px, 5vw, 40px) Anton, sans-serif', color: '#33224A' }}>
                {step.n}
              </div>
              <div>
                <div
                  style={{
                    font: "500 11px 'JetBrains Mono', monospace",
                    letterSpacing: '.18em',
                    color: '#E8BE7C',
                  }}
                >
                  {step.week}
                </div>
                <h3
                  style={{
                    margin: '6px 0 0',
                    font: '400 clamp(20px, 4vw, 24px) Anton, sans-serif',
                    textTransform: 'uppercase',
                  }}
                >
                  {step.title}
                </h3>
              </div>
              <p
                style={{
                  margin: 0,
                  font: "400 13px/1.65 'JetBrains Mono', monospace",
                  color: '#9C8CB4',
                }}
              >
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 0 clamp(48px, 7vw, 84px)' }}>
        <div
          className="te-section-pad"
          style={{
            paddingBottom: 24,
            font: "500 12px 'JetBrains Mono', monospace",
            letterSpacing: '.2em',
            color: '#E8BE7C',
          }}
        >
          04 / {t.tClients}
        </div>
        <ClientsMarquee clients={CLIENTS} />
      </div>

      <Faq t={t} faq={faq} setFaq={setFaq} go={go} />
    </div>
  )
}
