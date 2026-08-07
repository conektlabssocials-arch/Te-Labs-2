import { useSite } from "../../lib/SiteContext";

export default function CTABanner({ compact = false }) {
  const { t, go } = useSite();

  return (
    <div
      style={{
        background: "#8B2FF8",
        padding: compact
          ? "clamp(36px, 5vw, 54px) clamp(20px, 4vw, 40px)"
          : "clamp(40px, 6vw, 60px) clamp(20px, 4vw, 40px)",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "clamp(24px, 3vw, 50px)",
      }}
    >
      {compact ? (
        <div
          style={{
            font: "400 clamp(26px, 3.6vw, 46px)/1 Anton, sans-serif",
            color: "#0B0710",
            textTransform: "uppercase",
          }}
        >
          {t.tFinalA} {t.tFinalB}
        </div>
      ) : (
        <div>
          <div
            style={{
              font: "400 clamp(30px, 4.4vw, 60px)/0.98 Anton, sans-serif",
              color: "#0B0710",
              textTransform: "uppercase",
            }}
          >
            {t.tFinalA}
            <br />
            {t.tFinalB}
          </div>
          <p
            style={{
              margin: "16px 0 0",
              maxWidth: 560,
              font: "400 14px/1.7 'JetBrains Mono', monospace",
              color: "#2A0B4A",
            }}
          >
            {t.tFinalSub}
          </p>
        </div>
      )}
      <button
        type="button"
        onClick={() => go("contact")}
        style={{
          background: "#0B0710",
          color: "#fff",
          border: 0,
          padding: compact ? "22px 34px" : "26px 40px",
          cursor: "pointer",
          font: `700 ${compact ? 14 : 16}px 'JetBrains Mono', monospace`,
          letterSpacing: ".16em",
          whiteSpace: "nowrap",
        }}
      >
        {t.tCtaLong} →
      </button>
    </div>
  );
}
