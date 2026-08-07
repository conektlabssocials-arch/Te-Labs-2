import { useSite } from "../../lib/SiteContext";

const LOGOS = [
  "https://framerusercontent.com/images/KAjd8f5TRi5rJGgRvp9pV3IQ4UQ.png?width=480&height=197",
  "https://framerusercontent.com/images/GVtCa2XzR9RiLZWL5gPLCmJmw.png?width=2206&height=1434",
  "https://framerusercontent.com/images/nPWVU8jqTjivz3LbV1oDprTzcR0.png?width=326&height=320",
  "https://framerusercontent.com/images/HefBCJNpVLw4jh4IopVhmt80.png?width=826&height=283",
  "https://framerusercontent.com/images/xup5drWRz2JNLuwhiDNwVO5nk.png?width=200&height=200",
];

// Keep each half of the marquee wider than the viewport so it never exposes a gap.
const LOOP_LOGOS = [...LOGOS, ...LOGOS];

export default function Clients() {
  const { t } = useSite();

  return (
    <div style={{ padding: "0 0 84px" }}>
      <div
        style={{
          padding: "0 clamp(20px, 4vw, 40px) 24px",
          font: "500 12px 'JetBrains Mono', monospace",
          letterSpacing: ".2em",
          color: "#E8BE7C",
        }}
      >
        04 / {t.tClients}
      </div>
      <div
        style={{
          overflow: "hidden",
          borderTop: "1px solid #241933",
          borderBottom: "1px solid #241933",
          background: "#0D0814",
        }}
      >
        <div
          className="te-marquee"
          style={{
            display: "flex",
            alignItems: "center",
            width: "max-content",
            animation: "teDrift 36s linear infinite",
          }}
        >
          {["original", "repeat"].map((copy) => (
            <div
              key={copy}
              aria-hidden={copy === "repeat" ? "true" : undefined}
              style={{
                display: "flex",
                alignItems: "center",
                flex: "0 0 auto",
                gap: 10,
                paddingRight: 10,
              }}
            >
              {LOOP_LOGOS.map((src, i) => (
                <div
                  key={`${copy}-${i}`}
                  className="te-lift"
                  style={{
                    flex: "0 0 auto",
                    width: "clamp(140px, 18vw, 220px)",
                    height: 104,
                    padding: "18px 26px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#F4F0FA",
                    borderRadius: 10,
                  }}
                >
                  <img
                    src={src}
                    alt={copy === "original" && i < LOGOS.length ? `Client ${i + 1}` : ""}
                    loading="lazy"
                    draggable="false"
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
