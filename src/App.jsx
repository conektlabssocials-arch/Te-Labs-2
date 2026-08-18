import { useEffect, useMemo, useRef, useState } from 'react'
import { COPY } from './data/copy'
import { useRoute } from './lib/router'
import { useHead } from './lib/head'
import { loadThreeElements } from './lib/three-elements'
import ProgressBar from './components/ProgressBar'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import FinalCta from './components/FinalCta'
import HomePage from './pages/HomePage'
import ServicesPage from './pages/ServicesPage'
import WorkPage from './pages/WorkPage'
import ContactPage from './pages/ContactPage'
import NotFoundPage from './pages/NotFoundPage'
import { NOT_FOUND } from './data/routes'
import { useMotion } from './hooks/useMotion'

export default function App({ url }) {
  // The URL is the single source of truth for both page and language. The old
  // localStorage preference is gone on purpose: a language that lives only in
  // browser storage has no address, so neither a crawler nor a shared link can
  // ever reach the English site.
  const { page, lang, navigate } = useRoute(url)
  const [expanded, setExpanded] = useState(null)
  const [hovered, setHovered] = useState(null)
  const [faq, setFaq] = useState(0)
  const [form, setForm] = useState({
    name: '',
    brand: '',
    service: 'Social media management',
    msg: '',
  })

  const rootRef = useRef(null)
  useMotion(rootRef, page)

  // Must run after hydration, not at import time — see lib/three-elements.js.
  useEffect(loadThreeElements, [])

  const t = COPY[lang] || COPY.en
  const fr = lang === 'fr'

  useHead(page, lang, t)

  const go = (next) => {
    setExpanded(null)
    navigate(next, lang)
  }

  /**
   * Switching language keeps you on the same page, at its other URL — except
   * on the error page, which has no URL in either language. From there the
   * toggle goes home, which is where pathFor already points its href.
   */
  const setLang = (next) => {
    setExpanded(null)
    if (page === NOT_FOUND) return navigate('home', next)
    navigate(page, next, { scroll: false })
  }

  const jump = (id) => {
    const el = document.getElementById(id)
    if (el) {
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - 84,
        behavior: 'smooth',
      })
    }
  }

  const send = () => {
    const body = [
      `Name: ${form.name}`,
      `Business: ${form.brand}`,
      `Service: ${form.service}`,
      '',
      form.msg,
    ].join('\n')
    window.open(`https://wa.me/?text=${encodeURIComponent(body)}`, '_blank')
  }

  const nav = useMemo(
    () => ({
      page,
      go,
      setLang,
      lang,
      navigate,
      ink: (p) => (page === p ? '#F4F0FA' : '#A99BBE'),
      enBg: fr ? 'transparent' : '#8B2FF8',
      enFg: fr ? '#A99BBE' : '#ffffff',
      frBg: fr ? '#8B2FF8' : 'transparent',
      frFg: fr ? '#ffffff' : '#A99BBE',
    }),
    [page, lang, fr],
  )

  const workHelpers = {
    expanded,
    hovered,
    setExpanded,
    setHovered,
    open: (key) => {
      setExpanded(key)
      window.scrollTo(0, 0)
    },
    collapse: () => setExpanded(null),
    count: (n, total) =>
      expanded ? `${total} / ${total}` : `${n} ${fr ? 'sur' : 'of'} ${total}`,
    arrow: (k) => (hovered === k || expanded === k ? 1 : 0),
    arrowX: (k) => (hovered === k || expanded === k ? '0px' : '-14px'),
    head: (k) => (hovered === k ? '#FFFFFF' : '#F4F0FA'),
  }

  return (
    <div
      ref={rootRef}
      style={{
        background: '#0B0710',
        color: '#F4F0FA',
        fontFamily: "'JetBrains Mono', monospace",
        minHeight: '100vh',
        overflowX: 'hidden',
      }}
    >
      <ProgressBar />
      <Navbar t={t} nav={nav} />

      {page === 'home' && (
        <HomePage
          t={t}
          go={go}
          faq={faq}
          setFaq={setFaq}
          lang={lang}
          navigate={navigate}
        />
      )}
      {page === 'services' && (
        <ServicesPage t={t} go={go} jump={jump} />
      )}
      {page === 'work' && <WorkPage t={t} helpers={workHelpers} />}
      {page === 'contact' && (
        <ContactPage t={t} form={form} setForm={setForm} send={send} />
      )}
      {page === NOT_FOUND && <NotFoundPage t={t} lang={lang} navigate={navigate} />}

      {/* The 404 page is already a list of ways out; the closing pitch would
          only compete with them. */}
      {page !== 'contact' && page !== 'services' && page !== NOT_FOUND && (
        <FinalCta t={t} lang={lang} navigate={navigate} />
      )}

      <Footer t={t} lang={lang} navigate={navigate} />
    </div>
  )
}
