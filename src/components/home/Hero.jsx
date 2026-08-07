import { useSite } from "../../lib/SiteContext";
import Tower3D from "../ui/Tower3D";

export default function Hero() {
  const { t, go } = useSite();

  return (
    <div style={{ position: "relative", overflow: "hidden", borderBottom: "1px solid #241933" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(90% 80% at 74% 30%, rgba(139,47,248,.30), transparent 62%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage:
            "linear-gradient(rgba(198,160,255,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(198,160,255,.045) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />
      <Tower3D
        subjectX={0.74}
        className="te-hero-tower"
        style={{ position: "absolute", inset: 0, display: "block", zIndex: 0 }}
      />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 380px), 1fr))",
          alignItems: "center",
          minHeight: "clamp(560px, 82vh, 780px)",
          pointerEvents: "none",
        }}
      >
        <div
          className="te-hero-copy"
          style={{
            padding: "clamp(56px, 8vw, 76px) clamp(20px, 4vw, 40px)",
            pointerEvents: "auto",
          }}
          data-no-reveal="1"
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 9,
              border: "1px solid #4A2E70",
              padding: "7px 13px",
              font: "500 11px 'JetBrains Mono', monospace",
              letterSpacing: ".2em",
              color: "#DCCBFF",
              marginBottom: 30,
            }}
          >
            <span style={{ width: 6, height: 6, background: "#E8BE7C", borderRadius: "50%" }} />
            {t.tEyebrowHero}
          </div>
          <h1
            style={{
              margin: 0,
              font: "400 clamp(38px, 6.6vw, 94px)/0.92 Anton, sans-serif",
              letterSpacing: "-.01em",
              textTransform: "uppercase",
            }}
          >
            <span style={{ display: "block", color: "#6E5C86" }}>{t.tHeroA}</span>
            <span style={{ display: "block", color: "#6E5C86" }}>{t.tHeroB}</span>
            <span
              style={{
                display: "block",
                color: "#F4F0FA",
                textShadow: "6px 0 0 rgba(139,47,248,.55)",
              }}
            >
              {t.tHeroC}
            </span>
          </h1>
          <p
            style={{
              maxWidth: 600,
              margin: "28px 0 36px",
              font: "400 16px/1.75 'JetBrains Mono', monospace",
              color: "#BFB2D4",
              textWrap: "pretty",
            }}
          >
            {t.tHeroSub}
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
            <button
              type="button"
              onClick={() => go("contact")}
              style={{
                background: "#F4F0FA",
                color: "#0B0710",
                border: 0,
                padding: "18px 28px",
                cursor: "pointer",
                font: "700 13px 'JetBrains Mono', monospace",
                letterSpacing: ".14em",
              }}
            >
              {t.tCtaLong} →
            </button>
            <button
              type="button"
              onClick={() => go("work")}
              style={{
                border: "1px solid #4A2E70",
                background: "none",
                color: "#DCCBFF",
                padding: "18px 28px",
                cursor: "pointer",
                font: "700 13px 'JetBrains Mono', monospace",
                letterSpacing: ".14em",
              }}
            >
              {t.tSeeWork}
            </button>
          </div>
        </div>

        {/* Spacer so the grid keeps a right column on desktop; height follows the copy, not a fixed 720px. */}
        <div className="te-hero-tower-col" aria-hidden="true" />
      </div>

      {/* Hint pinned to the hero bottom (tower base), so it never sits mid-tower. */}
      <div className="te-hero-drag-hint">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            font: "500 10px 'JetBrains Mono', monospace",
            letterSpacing: ".2em",
            color: "#8B7BA3",
            whiteSpace: "nowrap",
          }}
        >
          <span
            style={{
              width: 26,
              height: 26,
              flex: "0 0 26px",
              border: "1px solid #4A2E70",
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              fontSize: 11,
              color: "#C6A0FF",
            }}
          >
            ↻
          </span>
          {t.tDragHint}
        </div>
      </div>
    </div>
  );
}
