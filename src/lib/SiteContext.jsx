import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { COPY } from "./copy";

const SiteContext = createContext(null);

export function SiteProvider({ children }) {
  const [page, setPage] = useState("home");
  const [lang, setLang] = useState(() => {
    try {
      const saved = localStorage.getItem("te-labs-lang");
      return saved === "fr" || saved === "en" ? saved : "en";
    } catch {
      return "en";
    }
  });
  const [expanded, setExpanded] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [faq, setFaq] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    brand: "",
    service: "Social media management",
    msg: "",
  });

  useEffect(() => {
    try {
      localStorage.setItem("te-labs-lang", lang);
    } catch {
      /* ignore */
    }
  }, [lang]);

  useEffect(() => {
    setMenuOpen(false);
  }, [page]);

  const go = useCallback((next) => {
    setPage(next);
    setExpanded(null);
    setMenuOpen(false);
    window.scrollTo(0, 0);
  }, []);

  const jump = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - 84,
        behavior: "smooth",
      });
    }
  }, []);

  const openWork = useCallback((key) => {
    setExpanded(key);
    window.scrollTo(0, 0);
  }, []);

  const send = useCallback(() => {
    const body = [
      `Name: ${form.name}`,
      `Business: ${form.brand}`,
      `Service: ${form.service}`,
      "",
      form.msg,
    ].join("\n");
    window.open(`https://wa.me/?text=${encodeURIComponent(body)}`, "_blank");
  }, [form]);

  const t = COPY[lang] || COPY.en;
  const fr = lang === "fr";

  const value = useMemo(
    () => ({
      page,
      lang,
      fr,
      t,
      expanded,
      hovered,
      faq,
      form,
      menuOpen,
      go,
      jump,
      setLang,
      setFaq,
      setForm,
      setHovered,
      setExpanded,
      setMenuOpen,
      openWork,
      send,
      ink: (p) => (page === p ? "#F4F0FA" : "#A99BBE"),
      countLabel: (n, total) =>
        expanded ? `${total} / ${total}` : `${n} ${fr ? "sur" : "of"} ${total}`,
    }),
    [page, lang, fr, t, expanded, hovered, faq, form, menuOpen, go, jump, openWork, send]
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used within SiteProvider");
  return ctx;
}
