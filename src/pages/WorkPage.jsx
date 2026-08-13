import { AutoVideo, ImageSlot } from '../components/Media'
import { SOCIAL_WORK, VIDEO_WORK, WEB_WORK } from '../data/work'

function SectionHeader({ n, title, count, expanded, hovered, onOpen, onHover, onLeave }) {
  const active = hovered || expanded;

  return (
    <button
      type="button"
      className="te-work-press"
      onClick={onOpen}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 18,
        width: "100%",
        background: "none",
        border: 0,
        borderBottom: "1px solid #241933",
        padding: "0 0 18px",
        marginBottom: 26,
        cursor: "pointer",
        textAlign: "left",
      }}
    >
      <span
        style={{
          font: "500 11px 'JetBrains Mono', monospace",
          letterSpacing: ".2em",
          color: "#8B2FF8",
        }}
      >
        {n}
      </span>
      <h2
        style={{
          margin: 0,
          font: "400 clamp(24px, 3.2vw, 36px) Anton, sans-serif",
          textTransform: "uppercase",
          color: hovered ? "#FFFFFF" : "#F4F0FA",
        }}
      >
        {title}
      </h2>
      <span
        style={{
          font: "400 30px Anton, sans-serif",
          color: "#C6A0FF",
          opacity: active ? 1 : 0,
          transform: `translateX(${active ? "0px" : "-14px"})`,
          transition: "opacity .18s ease, transform .18s ease",
        }}
      >
        →
      </span>
      <span style={{ flex: 1, minWidth: 20, height: 1, background: "#241933" }} />
      <span
        style={{
          font: "500 10px 'JetBrains Mono', monospace",
          letterSpacing: ".16em",
          color: "#6E5C86",
          whiteSpace: "nowrap",
        }}
      >
        {count}
      </span>
    </button>
  );
}

function ProjectVideo({ src, title }) {
  return <AutoVideo src={src} title={title} />;
}

function ProjectImage({ src, alt, placeholder }) {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <ImageSlot placeholder={placeholder} />
      {src ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      ) : null}
    </div>
  );
}

function SocialGrid({ items }) {
  return (
    <div className="te-social-grid">
      {items.map((item) => (
        <div key={item.id}>
          <div style={{ aspectRatio: "9/16", border: "1px solid #2A1E3A" }}>
            {item.videoSrc ? (
              <ProjectVideo src={item.videoSrc} title={item.title || item.label} />
            ) : (
              <ProjectImage src={item.src} alt={item.title} placeholder="Reel" />
            )}
          </div>
          <div
            style={{
              marginTop: 10,
              font: "500 11px 'JetBrains Mono', monospace",
              letterSpacing: ".1em",
              color: "#BFB2D4",
            }}
          >
            {item.title || item.label}
          </div>
        </div>
      ))}
    </div>
  );
}

function WebGrid({ items }) {
  return (
    <div className="te-web-grid">
      {items.map((item) => {
        const title = item.title || item.label;
        const card = (
          <>
            <div style={{ border: "1px solid #2A1E3A" }}>
              <div
                style={{
                  display: "flex",
                  gap: 5,
                  padding: "10px 12px",
                  borderBottom: "1px solid #2A1E3A",
                  background: "#150C20",
                }}
              >
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#3A2E4C" }} />
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#3A2E4C" }} />
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#8B2FF8" }} />
              </div>
              {/* 16/9 matches the source mockups (1672x941) exactly, so
                  object-fit: cover has nothing to crop. Any other ratio eats
                  the wordmark, which sits at the left edge of every one. */}
              <div style={{ aspectRatio: "16/9" }}>
                <ProjectImage
                  src={item.thumbnail || item.src}
                  alt={title}
                  placeholder="Project thumbnail"
                />
              </div>
            </div>
            <div
              style={{
                marginTop: 10,
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                font: "500 11px 'JetBrains Mono', monospace",
                letterSpacing: ".1em",
                color: "#BFB2D4",
              }}
            >
              <span>{title}</span>
              {item.url ? <span style={{ color: "#C6A0FF" }}>↗</span> : null}
            </div>
          </>
        );

        return item.url ? (
          <a
            key={item.id}
            className="te-work-lift"
            href={item.url}
            target="_blank"
            rel="noreferrer"
            aria-label={`${title} — open project`}
          >
            {card}
          </a>
        ) : (
          <div key={item.id}>{card}</div>
        );
      })}
    </div>
  );
}

function VideoCard({ item, layout, className = "", fill = false }) {
  const aspect = item.width / item.height;
  const orientation = aspect > 1.15 ? "landscape" : aspect < 0.85 ? "portrait" : "square";
  const displayAspect = layout === "landscape" ? "16/9" : "9/16";

  return (
    <div
      className={`te-video-card te-video-card--${orientation} ${className}`.trim()}
    >
      <div
        className="te-video-card__media"
        style={{
          position: "relative",
          ...(!fill ? { aspectRatio: displayAspect } : {}),
          border: "1px solid #2A1E3A",
          background: "#050308",
        }}
      >
        {item.videoSrc ? (
          <ProjectVideo src={item.videoSrc} title={item.label} />
        ) : (
          <ProjectImage src={item.src} alt={item.label} placeholder="Film" />
        )}
      </div>
    </div>
  );
}

function VideoFeature({ portraits, landscapes }) {
  return (
    <div className="te-video-feature-grid">
      <VideoCard
        item={portraits[0]}
        layout="portrait"
        className="te-video-feature__portrait-a"
        fill
      />
      <VideoCard
        item={landscapes[0]}
        layout="landscape"
        className="te-video-feature__landscape-a"
        fill
      />
      <VideoCard
        item={landscapes[1]}
        layout="landscape"
        className="te-video-feature__landscape-b"
        fill
      />
      <VideoCard
        item={portraits[1]}
        layout="portrait"
        className="te-video-feature__portrait-b"
        fill
      />
    </div>
  );
}

function VideoGrid({ items }) {
  const portraits = items.filter((item) => item.width / item.height <= 1.15);
  const landscapes = items.filter((item) => item.width / item.height > 1.15);
  const featureCount = Math.min(
    2,
    Math.floor(portraits.length / 2),
    Math.floor(landscapes.length / 2),
  );
  const features = Array.from({ length: featureCount }, (_, index) => ({
    portraits: portraits.slice(index * 2, index * 2 + 2),
    landscapes: landscapes.slice(index * 2, index * 2 + 2),
  }));
  const featuredIds = new Set(
    features.flatMap((feature) => [...feature.portraits, ...feature.landscapes])
      .map((item) => item.id),
  );
  const remaining = items.filter((item) => !featuredIds.has(item.id));

  return (
    <div className="te-video-collage">
      {features.map((feature) => (
        <VideoFeature
          key={feature.portraits.map((item) => item.id).join("-")}
          portraits={feature.portraits}
          landscapes={feature.landscapes}
        />
      ))}
      {remaining.length ? (
        <div
          className="te-video-grid te-video-grid--landscape"
          style={{ "--video-columns": Math.min(4, remaining.length) }}
        >
          {remaining.map((item) => (
            <VideoCard key={item.id} item={item} layout="landscape" />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function WorkPage({ t, helpers }) {
  // App owns this state and hands it down as `helpers`; alias it to the names used below.
  const {
    expanded,
    hovered,
    open: openWork,
    setExpanded,
    setHovered,
    count: countLabel,
  } = helpers;
  const show = (key) => expanded === null || expanded === key;

  return (
    <div>
      <section
        className="te-work-pad-x"
        style={{
          paddingTop: "clamp(44px, 6vw, 72px)",
          paddingBottom: "clamp(28px, 4vw, 48px)",
          borderBottom: "1px solid #241933",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 20, flexWrap: "wrap" }}>
          <span
            style={{
              font: "500 12px 'JetBrains Mono', monospace",
              letterSpacing: ".2em",
              color: "#8B2FF8",
            }}
          >
            {t.tWork}
          </span>
          {expanded ? (
            <button
              type="button"
              className="te-work-press"
              onClick={() => setExpanded(null)}
              style={{
                background: "none",
                border: "1px solid #4A2E70",
                color: "#DCCBFF",
                padding: "8px 14px",
                cursor: "pointer",
                font: "500 10px 'JetBrains Mono', monospace",
                letterSpacing: ".16em",
              }}
            >
              ← {t.tAllWork}
            </button>
          ) : null}
        </div>
        <h1
          style={{
            margin: 0,
            font: "400 clamp(36px, 6vw, 84px)/0.94 Anton, sans-serif",
            textTransform: "uppercase",
          }}
        >
          {t.tWorkHeroA}
          <br />
          <span style={{ color: "#C6A0FF" }}>{t.tWorkHeroB}</span>
        </h1>
      </section>

      {show("video") ? (
        <section className="te-work-pad-x" style={{ paddingTop: "clamp(40px, 6vw, 60px)" }}>
          <SectionHeader
            n="01"
            title={t.tVideo}
            count={countLabel(Math.min(6, VIDEO_WORK.length), VIDEO_WORK.length)}
            expanded={expanded === "video"}
            hovered={hovered === "video"}
            onOpen={() => openWork("video")}
            onHover={() => setHovered("video")}
            onLeave={() => setHovered(null)}
          />
          <VideoGrid items={expanded === "video" ? VIDEO_WORK : VIDEO_WORK.slice(0, 6)} />
        </section>
      ) : null}

      {show("social") ? (
        <section className="te-work-pad-x" style={{ paddingTop: "clamp(40px, 6vw, 60px)" }}>
          <SectionHeader
            n="02"
            title={t.tSocial}
            count={countLabel(Math.min(4, SOCIAL_WORK.length), SOCIAL_WORK.length)}
            expanded={expanded === "social"}
            hovered={hovered === "social"}
            onOpen={() => openWork("social")}
            onHover={() => setHovered("social")}
            onLeave={() => setHovered(null)}
          />
          <SocialGrid items={SOCIAL_WORK.slice(0, 4)} />
          {expanded === "social" ? (
            <div style={{ marginTop: 14 }}>
              <SocialGrid items={SOCIAL_WORK.slice(4)} />
            </div>
          ) : null}
        </section>
      ) : null}

      {show("web") ? (
        <section className="te-work-pad-x" style={{ paddingTop: 60, paddingBottom: 84 }}>
          <SectionHeader
            n="03"
            title={t.tWeb}
            count={countLabel(Math.min(3, WEB_WORK.length), WEB_WORK.length)}
            expanded={expanded === "web"}
            hovered={hovered === "web"}
            onOpen={() => openWork("web")}
            onHover={() => setHovered("web")}
            onLeave={() => setHovered(null)}
          />
          <WebGrid items={WEB_WORK.slice(0, 3)} />
          {expanded === "web" ? (
            <div style={{ marginTop: 14 }}>
              <WebGrid items={WEB_WORK.slice(3)} />
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
