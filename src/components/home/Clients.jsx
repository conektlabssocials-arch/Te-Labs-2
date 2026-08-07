import { useSite } from "../../lib/SiteContext";

const LOGOS = [
  "https://framerusercontent.com/images/KAjd8f5TRi5rJGgRvp9pV3IQ4UQ.png?width=480&height=197",
  "https://framerusercontent.com/images/GVtCa2XzR9RiLZWL5gPLCmJmw.png?width=2206&height=1434",
  "https://framerusercontent.com/images/nPWVU8jqTjivz3LbV1oDprTzcR0.png?width=326&height=320",
  "https://framerusercontent.com/images/HefBCJNpVLw4jh4IopVhmt80.png?width=826&height=283",
  "https://framerusercontent.com/images/xup5drWRz2JNLuwhiDNwVO5nk.png?width=200&height=200",
];

export default function Clients() {
  const { t } = useSite();
  const items = [...LOGOS, ...LOGOS];

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
            gap: 1,
            width: "max-content",
            animation: "teDrift 36s linear infinite",
          }}
        >
          {items.map((src, i) => (
            <div
              key={`${src}-${i}`}
              className="te-lift"
              style={{
                width: "clamp(140px, 18vw, 220px)",
                height: 104,
                padding: "18px 26px",
                boxSizing: "border-box",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#F4F0FA",
                borderRadius: 10,
                marginRight: 10,
              }}
            >
              <img
                src={src}
                alt={`Client ${(i % LOGOS.length) + 1}`}
                loading="lazy"
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
      </div>
    </div>
  );
}
