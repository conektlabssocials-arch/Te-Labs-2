import { useSite } from "../../lib/SiteContext";

export default function ContactPage() {
  const { t, form, setForm, send } = useSite();

  const field = (label, children) => (
    <label style={{ display: "grid", gap: 8 }}>
      <span
        style={{
          font: "500 10px 'JetBrains Mono', monospace",
          letterSpacing: ".2em",
          color: "#8B7BA3",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
      {children}
    </label>
  );

  const inputStyle = {
    background: "none",
    border: 0,
    borderBottom: "1px solid #3A2A52",
    color: "#F4F0FA",
    font: "400 14px 'JetBrains Mono', monospace",
    padding: "8px 0",
    outline: "none",
    width: "100%",
  };

  return (
    <div
      style={{
        padding: "clamp(44px, 6vw, 72px) clamp(20px, 4vw, 40px) clamp(48px, 7vw, 84px)",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
        gap: "clamp(28px, 4vw, 64px)",
        alignItems: "start",
      }}
    >
      <div>
        <div
          style={{
            font: "500 12px 'JetBrains Mono', monospace",
            letterSpacing: ".2em",
            color: "#E8BE7C",
            marginBottom: 20,
          }}
        >
          {t.tContact}
        </div>
        <h1
          style={{
            margin: 0,
            font: "400 clamp(30px, 5.4vw, 74px)/0.96 Anton, sans-serif",
            textTransform: "uppercase",
          }}
        >
          {t.tContactHeroA}
          <br />
          <span style={{ color: "#C6A0FF" }}>{t.tContactHeroB}</span>
        </h1>
        <p
          style={{
            maxWidth: 520,
            margin: "26px 0 34px",
            font: "400 15px/1.75 'JetBrains Mono', monospace",
            color: "#BFB2D4",
          }}
        >
          {t.tContactSub}
        </p>
        <div
          style={{
            display: "grid",
            gap: 1,
            background: "#2A1E3A",
            border: "1px solid #2A1E3A",
            maxWidth: 520,
          }}
        >
          {[
            [t.tFirstReply, t.tSameDay],
            [t.tLanguages, "FR / EN"],
            [t.tBasedIn, "PARIS"],
            [t.tEmail, t.tPhone],
          ].map(([k, v]) => (
            <div
              key={k}
              style={{
                background: "#0B0710",
                padding: "18px 20px",
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                flexWrap: "wrap",
                font: "400 12px 'JetBrains Mono', monospace",
                color: "#9C8CB4",
              }}
            >
              <span>{k}</span>
              <span style={{ color: "#E4DAF5" }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ border: "1px solid #2A1E3A" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
            padding: "14px 20px",
            borderBottom: "1px solid #2A1E3A",
            background: "#150C20",
            font: "500 11px 'JetBrains Mono', monospace",
            letterSpacing: ".16em",
            color: "#C6A0FF",
          }}
        >
          <span>{t.tBriefForm}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 8, color: "#9C8CB4" }}>
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#E8BE7C",
                animation: "teBlink 1.6s steps(1) infinite",
              }}
            />
            {t.tSameDay}
          </span>
        </div>
        <div style={{ padding: 28, display: "grid", gap: 20 }}>
          {field(
            t.tName,
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              style={inputStyle}
            />
          )}
          {field(
            t.tBusiness,
            <input
              value={form.brand}
              onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
              style={inputStyle}
            />
          )}
          {field(
            t.tServiceNeeded,
            <select
              value={form.service}
              onChange={(e) => setForm((f) => ({ ...f, service: e.target.value }))}
              style={{ ...inputStyle, background: "#150C20", padding: "10px 8px" }}
            >
              <option>Social media management</option>
              <option>Website development</option>
              <option>AI video</option>
              <option>All three</option>
            </select>
          )}
          {field(
            t.tMessage,
            <textarea
              value={form.msg}
              onChange={(e) => setForm((f) => ({ ...f, msg: e.target.value }))}
              rows={4}
              style={{
                background: "none",
                border: "1px solid #3A2A52",
                color: "#F4F0FA",
                font: "400 14px/1.6 'JetBrains Mono', monospace",
                padding: 12,
                outline: "none",
                resize: "vertical",
                width: "100%",
              }}
            />
          )}
          <button
            type="button"
            onClick={send}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              background: "#8B2FF8",
              color: "#fff",
              border: 0,
              padding: 18,
              cursor: "pointer",
              font: "700 13px 'JetBrains Mono', monospace",
              letterSpacing: ".16em",
            }}
          >
            {t.tSendWhatsapp} →
          </button>
          <div style={{ font: "400 11px/1.6 'JetBrains Mono', monospace", color: "#6E5C86" }}>
            {t.tFormNote}
          </div>
        </div>
      </div>
    </div>
  );
}
