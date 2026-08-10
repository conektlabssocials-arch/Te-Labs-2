export default function ServicesPage({ t, go, jump }) {
  const videoItems = [t.tVid1, t.tVid2, t.tVid3, t.tVid4, t.tVid5, t.tVid6, t.tVid7, t.tVid8]
  const socialItems = [
    t.tSocial1,
    t.tSocial2,
    t.tSocial3,
    t.tSocial4,
    t.tSocial5,
    t.tSocial6,
    t.tSocial7,
    t.tSocial8,
  ]
  const webItems = [t.tWeb1, t.tWeb2, t.tWeb3, t.tWeb4, t.tWeb5, t.tWeb6, t.tWeb7, t.tWeb8]

  return (
    <div>
      <div
        style={{
          padding: 'clamp(44px, 6vw, 72px) clamp(20px, 4vw, 40px) clamp(32px, 4vw, 56px)',
          borderBottom: '1px solid #241933',
        }}
      >
        <div
          style={{
            font: "500 12px 'JetBrains Mono', monospace",
            letterSpacing: '.2em',
            color: '#E8BE7C',
            marginBottom: 20,
          }}
        >
          {t.tServices}
        </div>
        <h1
          style={{
            margin: 0,
            font: "400 clamp(36px, 6vw, 84px)/0.94 Anton, sans-serif",
            textTransform: 'uppercase',
            maxWidth: 1040,
          }}
        >
          {t.tServicesHeroA} <span style={{ color: '#C6A0FF' }}>{t.tServicesHeroB}</span>
        </h1>
        <p
          style={{
            maxWidth: 700,
            margin: '26px 0 30px',
            font: "400 16px/1.75 'JetBrains Mono', monospace",
            color: '#BFB2D4',
          }}
        >
          {t.tServicesSub}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <span
            style={{
              font: "500 10px 'JetBrains Mono', monospace",
              letterSpacing: '.2em',
              color: '#6E5C86',
            }}
          >
            {t.tJump}
          </span>
          {[
            ['video', t.tVideo],
            ['social', t.tSocial],
            ['web', t.tWeb],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              className="te-jump"
              onClick={() => jump(id)}
              style={{
                background: 'none',
                border: '1px solid #3A2A52',
                color: '#DCCBFF',
                padding: '11px 18px',
                cursor: 'pointer',
                font: "500 11px 'JetBrains Mono', monospace",
                letterSpacing: '.14em',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <ServiceBlock id="video" index="01" title={t.tVideo} body={t.tVideoLong} items={videoItems} />
      <ServiceBlock
        id="social"
        index="02"
        title={t.tSocial}
        body={t.tSocialLong}
        items={socialItems}
      />

      <div id="web" style={{ padding: 'clamp(44px, 6vw, 74px) clamp(20px, 4vw, 40px)' }}>
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              flexWrap: 'wrap',
              marginBottom: 22,
            }}
          >
            <span style={{ font: '400 40px Anton, sans-serif', color: '#33224A' }}>03</span>
            <h2
              style={{
                margin: 0,
                font: "400 clamp(28px, 4vw, 52px)/0.98 Anton, sans-serif",
                textTransform: 'uppercase',
              }}
            >
              {t.tWeb}
            </h2>
            <span
              style={{
                font: "500 10px 'JetBrains Mono', monospace",
                letterSpacing: '.2em',
                color: '#E8BE7C',
                border: '1px solid #4A2E70',
                padding: '6px 10px',
              }}
            >
              {t.tWebBadge}
            </span>
          </div>
          <div
            style={{
              font: "500 11px 'JetBrains Mono', monospace",
              letterSpacing: '.2em',
              color: '#E8BE7C',
              marginBottom: 12,
            }}
          >
            {t.tImmEyebrow}
          </div>
          <h3
            style={{
              margin: '0 0 20px',
              font: "400 clamp(22px, 2.8vw, 38px)/1.04 Anton, sans-serif",
              textTransform: 'uppercase',
              maxWidth: 760,
            }}
          >
            {t.tImmA}
            <br />
            <span style={{ color: '#C6A0FF' }}>{t.tImmB}</span>
          </h3>
          <p
            style={{
              margin: '0 0 28px',
              maxWidth: 620,
              font: "400 15px/1.75 'JetBrains Mono', monospace",
              color: '#BFB2D4',
            }}
          >
            {t.tWebLong}
          </p>
          <ChipGrid items={webItems} />
        </div>
      </div>

      <div className="te-final">
        <div
          style={{
            font: "400 clamp(26px, 3.6vw, 46px)/1 Anton, sans-serif",
            color: '#0B0710',
            textTransform: 'uppercase',
            minWidth: 0,
            flex: '1 1 240px',
          }}
        >
          {t.tFinalA} {t.tFinalB}
        </div>
        <button type="button" className="te-final-btn" onClick={() => go('contact')}>
          {t.tCtaLong} →
        </button>
      </div>
    </div>
  )
}

function ServiceBlock({ id, index, title, body, items }) {
  return (
    <div
      id={id}
      style={{
        padding: 'clamp(44px, 6vw, 74px) clamp(20px, 4vw, 40px)',
        borderBottom: '1px solid #241933',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          flexWrap: 'wrap',
          marginBottom: 22,
        }}
      >
        <span style={{ font: '400 clamp(28px, 5vw, 40px) Anton, sans-serif', color: '#33224A' }}>
          {index}
        </span>
        <h2
          style={{
            margin: 0,
            font: "400 clamp(26px, 4vw, 52px)/0.98 Anton, sans-serif",
            textTransform: 'uppercase',
          }}
        >
          {title}
        </h2>
      </div>
      <p
        style={{
          margin: '0 0 28px',
          maxWidth: 620,
          font: "400 15px/1.75 'JetBrains Mono', monospace",
          color: '#BFB2D4',
        }}
      >
        {body}
      </p>
      <ChipGrid items={items} />
    </div>
  )
}

function ChipGrid({ items }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
        gap: 1,
        background: '#2A1E3A',
        border: '1px solid #2A1E3A',
      }}
    >
      {items.map((item) => (
        <div
          key={item}
          style={{
            background: '#0B0710',
            padding: '18px 20px',
            font: "400 13px 'JetBrains Mono', monospace",
            color: '#D6C9EA',
          }}
        >
          {item}
        </div>
      ))}
    </div>
  )
}
