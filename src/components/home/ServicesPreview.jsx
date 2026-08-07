import { useSite } from "../../lib/SiteContext";
import Mini3D from "../ui/Mini3D";

const LANES = [
  { num: "01", kind: "globe", titleKey: "tSocial", pitchKey: "tSocialPitch" },
  { num: "02", kind: "screen", titleKey: "tWeb", pitchKey: "tWebPitch" },
  { num: "03", kind: "reel", titleKey: "tVideo", pitchKey: "tVideoPitch" },
];

export default function ServicesPreview() {
  const { t, go } = useSite();

  return (
    <div style={{ padding: "clamp(48px, 7vw, 84px) clamp(20px, 4vw, 40px)" }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "baseline",
          gap: "clamp(12px, 2vw, 24px)",
          marginBottom: "clamp(28px, 4vw, 44px)",
        }}
      >
        <span
          style={{
            font: "500 12px 'JetBrains Mono', monospace",
            letterSpacing: ".2em",
            color: "#E8BE7C",
          }}
        >
          01 / {t.tServices}
        </span>
        <h2
          style={{
            margin: 0,
            font: "400 clamp(28px, 4.4vw, 62px)/0.96 Anton, sans-serif",
            textTransform: "uppercase",
          }}
        >
          {t.tThreeLanesA}
          <br />
          <span style={{ color: "#C6A0FF" }}>{t.tThreeLanesB}</span>
        </h2>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
          gap: 1,
          background: "#2A1E3A",
          border: "1px solid #2A1E3A",
        }}
      >
        {LANES.map((lane) => (
          <div
            key={lane.num}
            className="te-lift"
            onClick={() => go("services")}
            style={{
              background: "#0B0710",
              padding: "32px 28px",
              minHeight: 280,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              cursor: "pointer",
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 18,
                }}
              >
                <span
                  style={{
                    font: "500 11px 'JetBrains Mono', monospace",
                    letterSpacing: ".18em",
                    color: "#E8BE7C",
                  }}
                >
                  {lane.num}
                </span>
                <Mini3D kind={lane.kind} style={{ display: "block", width: 62, height: 62 }} />
              </div>
              <h3
                style={{
                  margin: "0 0 14px",
                  font: "400 28px Anton, sans-serif",
                  textTransform: "uppercase",
                }}
              >
                {t[lane.titleKey]}
              </h3>
              <p
                style={{
                  margin: 0,
                  font: "400 13px/1.7 'JetBrains Mono', monospace",
                  color: "#9C8CB4",
                }}
              >
                {t[lane.pitchKey]}
              </p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                go("services");
              }}
              style={{
                background: "none",
                border: 0,
                borderTop: "1px solid #241933",
                padding: "16px 0 0",
                cursor: "pointer",
                font: "500 11px 'JetBrains Mono', monospace",
                letterSpacing: ".16em",
                color: "#C6A0FF",
                width: "100%",
                textAlign: "left",
              }}
            >
              {t.tMore} →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
