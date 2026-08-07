import { useSite } from "../../lib/SiteContext";
import ImageSlot from "../ui/ImageSlot";
import { REEL_SLOTS } from "../../lib/work";

function ReelCard({ item }) {
  return (
    <div
      style={{
        position: "relative",
        flex: "0 0 auto",
        width: "min(380px, 78vw)",
        aspectRatio: `${item.width}/${item.height}`,
        border: "1px solid #2A1E3A",
        overflow: "hidden",
        background: "#050308",
      }}
    >
      <ImageSlot id={item.id} placeholder={item.label} />
      <video
        src={item.videoSrc}
        aria-label={item.label}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
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
      <div
        style={{
          position: "absolute",
          inset: "auto 0 0",
          padding: "36px 14px 12px",
          background: "linear-gradient(transparent, rgba(5, 3, 8, .84))",
          font: "500 10px 'JetBrains Mono', monospace",
          letterSpacing: ".12em",
          color: "#F4F0FA",
          textTransform: "uppercase",
          pointerEvents: "none",
        }}
      >
        {item.label}
      </div>
    </div>
  );
}

export default function ReelStrip() {
  const { t, go } = useSite();

  return (
    <div style={{ padding: "0 0 84px" }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: 24,
          marginBottom: 32,
          padding: "0 clamp(20px, 4vw, 40px)",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 24, flexWrap: "wrap" }}>
          <span
            style={{
              font: "500 12px 'JetBrains Mono', monospace",
              letterSpacing: ".2em",
              color: "#E8BE7C",
            }}
          >
            02 / {t.tReel}
          </span>
          <h2
            style={{
              margin: 0,
              font: "400 clamp(28px, 4.4vw, 62px)/0.96 Anton, sans-serif",
              textTransform: "uppercase",
            }}
          >
            {t.tRecentWorkA}
            <br />
            <span style={{ color: "#C6A0FF" }}>{t.tRecentWorkB}</span>
          </h2>
        </div>
        <button
          type="button"
          onClick={() => go("work")}
          style={{
            background: "none",
            border: "1px solid #4A2E70",
            color: "#DCCBFF",
            padding: "14px 22px",
            cursor: "pointer",
            font: "700 12px 'JetBrains Mono', monospace",
            letterSpacing: ".14em",
            whiteSpace: "nowrap",
          }}
        >
          {t.tAllWork} →
        </button>
      </div>
      <div
        style={{
          overflow: "hidden",
          borderTop: "1px solid #241933",
          borderBottom: "1px solid #241933",
          padding: "20px 0",
          background: "#0D0814",
        }}
      >
        <div
          className="te-marquee"
          style={{
            display: "flex",
            width: "max-content",
            animation: "teDrift 44s linear infinite",
          }}
        >
          {["original", "repeat"].map((copy) => (
            <div
              key={copy}
              aria-hidden={copy === "repeat" ? "true" : undefined}
              style={{
                display: "flex",
                flex: "0 0 auto",
                gap: 16,
                paddingRight: 16,
              }}
            >
              {REEL_SLOTS.map((item) => (
                <ReelCard key={`${item.id}-${copy}`} item={item} />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          padding: "14px clamp(20px, 4vw, 40px) 0",
          font: "400 11px 'JetBrains Mono', monospace",
          color: "#6E5C86",
        }}
      >
        {t.tHoverPause}
      </div>
    </div>
  );
}
