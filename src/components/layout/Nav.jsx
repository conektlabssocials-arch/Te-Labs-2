import { useSite } from "../../lib/SiteContext";

const LINKS = [
  ["home", "tHome"],
  ["services", "tServices"],
  ["work", "tWork"],
  ["contact", "tContact"],
];

export default function Nav() {
  const { t, go, lang, setLang, ink, page, menuOpen, setMenuOpen } = useSite();

  return (
    <>
      <header className="te-nav">
        <button type="button" className="te-nav-brand" onClick={() => go("home")}>
          <span
            style={{
              width: 34,
              height: 34,
              background: "#8B2FF8",
              display: "grid",
              placeItems: "center",
              font: "700 15px 'Archivo Black', sans-serif",
              color: "#0B0710",
            }}
          >
            T
          </span>
          <span style={{ font: "400 20px Anton, sans-serif", letterSpacing: ".1em" }}>
            TE LABS
          </span>
        </button>

        <nav className="te-nav-links" aria-label="Primary">
          {LINKS.map(([id, key]) => (
            <button
              key={id}
              type="button"
              className="te-nav-link"
              onClick={() => go(id)}
              style={{ color: ink(id) }}
            >
              {t[key]}
            </button>
          ))}
        </nav>

        <div className="te-nav-actions">
          <div className="te-lang">
            <button
              type="button"
              onClick={() => setLang("en")}
              style={{
                background: lang === "en" ? "#8B2FF8" : "transparent",
                color: lang === "en" ? "#fff" : "#A99BBE",
              }}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLang("fr")}
              style={{
                background: lang === "fr" ? "#8B2FF8" : "transparent",
                color: lang === "fr" ? "#fff" : "#A99BBE",
              }}
            >
              FR
            </button>
          </div>
          <button type="button" className="te-nav-cta" onClick={() => go("contact")}>
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#fff",
                animation: "teBlink 1.4s steps(1) infinite",
              }}
            />
            {t.tCta}
          </button>
        </div>

        <button
          type="button"
          className={`te-nav-burger${menuOpen ? " is-open" : ""}`}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span />
        </button>
      </header>

      <div className={`te-nav-drawer${menuOpen ? " is-open" : ""}`} aria-hidden={!menuOpen}>
        {LINKS.map(([id, key]) => (
          <button
            key={id}
            type="button"
            className={`te-drawer-link${page === id ? " is-active" : ""}`}
            onClick={() => go(id)}
          >
            {t[key]}
          </button>
        ))}
        <div className="te-nav-drawer-foot">
          <div className="te-lang">
            <button
              type="button"
              onClick={() => setLang("en")}
              style={{
                background: lang === "en" ? "#8B2FF8" : "transparent",
                color: lang === "en" ? "#fff" : "#A99BBE",
              }}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLang("fr")}
              style={{
                background: lang === "fr" ? "#8B2FF8" : "transparent",
                color: lang === "fr" ? "#fff" : "#A99BBE",
              }}
            >
              FR
            </button>
          </div>
          <button type="button" className="te-nav-cta" onClick={() => go("contact")}>
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#fff",
                animation: "teBlink 1.4s steps(1) infinite",
              }}
            />
            {t.tCta}
          </button>
        </div>
      </div>
    </>
  );
}
