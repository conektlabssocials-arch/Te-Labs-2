import { useSite } from "../../lib/SiteContext";

export default function Process() {
  const { t } = useSite();
  const steps = [
    { n: "01", week: `${t.tWeek} 01`, title: t.tStep1, body: t.tStep1Body },
    { n: "02", week: `${t.tWeek} 02`, title: t.tStep2, body: t.tStep2Body },
    { n: "03", week: `${t.tWeek} 03—04`, title: t.tStep3, body: t.tStep3Body },
    { n: "04", week: t.tOngoing, title: t.tStep4, body: t.tStep4Body },
  ];

  return (
    <div style={{ padding: "0 clamp(20px, 4vw, 40px) clamp(48px, 7vw, 84px)" }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "baseline",
          gap: "clamp(12px, 2vw, 24px)",
          marginBottom: "clamp(24px, 3.5vw, 36px)",
        }}
      >
        <span
          style={{
            font: "500 12px 'JetBrains Mono', monospace",
            letterSpacing: ".2em",
            color: "#E8BE7C",
          }}
        >
          03 / {t.tProcess}
        </span>
        <h2
          style={{
            margin: 0,
            font: "400 clamp(28px, 4.4vw, 62px)/0.96 Anton, sans-serif",
            textTransform: "uppercase",
          }}
        >
          {t.tProcessTitleA}
          <br />
          <span style={{ color: "#C6A0FF" }}>{t.tProcessTitleB}</span>
        </h2>
      </div>
      <div style={{ display: "grid", gap: 1, background: "#2A1E3A", border: "1px solid #2A1E3A" }}>
        {steps.map((s) => (
          <div
            key={s.n}
            className="te-process-row"
            style={{
              background: "#0B0710",
              display: "grid",
              gridTemplateColumns: "minmax(48px, 60px) minmax(120px, 200px) 1fr",
              alignItems: "center",
              gap: "clamp(12px, 2vw, 28px)",
              padding: "clamp(18px, 2.4vw, 26px)",
            }}
          >
            <div style={{ font: "400 36px Anton, sans-serif", color: "#33224A" }}>{s.n}</div>
            <div>
              <div
                style={{
                  font: "500 11px 'JetBrains Mono', monospace",
                  letterSpacing: ".18em",
                  color: "#E8BE7C",
                }}
              >
                {s.week}
              </div>
              <h3
                style={{
                  margin: "6px 0 0",
                  font: "400 22px Anton, sans-serif",
                  textTransform: "uppercase",
                }}
              >
                {s.title}
              </h3>
            </div>
            <p
              style={{
                margin: 0,
                font: "400 13px/1.65 'JetBrains Mono', monospace",
                color: "#9C8CB4",
              }}
            >
              {s.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
