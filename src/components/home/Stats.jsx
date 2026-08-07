import { useEffect, useRef } from "react";
import { useSite } from "../../lib/SiteContext";

function useCountUp(to, suffix = "", pad = false) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || to == null) return;
    const fmt = (n) => (pad && n < 10 ? `0${n}` : String(n)) + suffix;
    el.textContent = fmt(0);
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        const dur = 900;
        const t0 = performance.now();
        const step = (now) => {
          const k = Math.min(1, (now - t0) / dur);
          el.textContent = fmt(Math.round(to * (1 - Math.pow(1 - k, 3))));
          if (k < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to, suffix, pad]);

  return ref;
}

function Stat({ value, suffix, pad, label, staticText }) {
  const ref = useCountUp(staticText ? null : value, suffix, pad);
  return (
    <div style={{ background: "#0B0710", padding: "26px clamp(20px, 4vw, 40px)" }}>
      <div
        ref={staticText ? undefined : ref}
        style={{ font: "400 clamp(28px, 3.4vw, 40px) Anton, sans-serif", color: "#E8BE7C" }}
      >
        {staticText || null}
      </div>
      <div
        style={{
          font: "500 11px 'JetBrains Mono', monospace",
          letterSpacing: ".16em",
          color: "#8B7BA3",
          marginTop: 6,
        }}
      >
        {label}
      </div>
    </div>
  );
}

export default function Stats() {
  const { t } = useSite();
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 180px), 1fr))",
        gap: 1,
        background: "#2A1E3A",
        borderBottom: "1px solid #241933",
      }}
    >
      <Stat value={25} suffix="+" label={t.tStatClients} />
      <Stat value={1} pad label={t.tStatTeam} />
      <Stat staticText="FR / EN" label={t.tStatFirst} />
    </div>
  );
}
