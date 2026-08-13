import { useEffect, useMemo, useRef, useState } from 'react'
import { COPY } from './data/copy'
import ProgressBar from './components/ProgressBar'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import FinalCta from './components/FinalCta'
import HomePage from './pages/HomePage'
import ServicesPage from './pages/ServicesPage'
import WorkPage from './pages/WorkPage'
import ContactPage from './pages/ContactPage'
import { useMotion } from './hooks/useMotion'

export default function App() {
  const [page, setPage] = useState('home')
  const [lang, setLang] = useState(() => {
    try {
      const saved = localStorage.getItem('te-labs-lang')
      return saved === 'fr' || saved === 'en' ? saved : 'en'
    } catch {
      return 'en'
    }
  })
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

  useEffect(() => {
    try {
      localStorage.setItem('te-labs-lang', lang)
    } catch {
      /* ignore */
    }
  }, [lang])

  const t = COPY[lang] || COPY.en
  const fr = lang === 'fr'

  const go = (next) => {
    setPage(next)
    setExpanded(null)
    window.scrollTo(0, 0)
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
        />
      )}
      {page === 'services' && (
        <ServicesPage t={t} go={go} jump={jump} />
      )}
      {page === 'work' && <WorkPage t={t} helpers={workHelpers} />}
      {page === 'contact' && (
        <ContactPage t={t} form={form} setForm={setForm} send={send} />
      )}

      {page !== 'contact' && page !== 'services' && (
        <FinalCta t={t} onContact={() => go('contact')} />
      )}

      <Footer t={t} go={go} />
    </div>
  )
}
