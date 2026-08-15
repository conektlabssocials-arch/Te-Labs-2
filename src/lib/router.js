import { useCallback, useEffect, useState } from 'react'
import { matchPath, pathFor } from '../data/routes'

/**
 * A ~40-line History API router.
 *
 * react-router would work, but the whole app is a four-way switch on one state
 * value and the prerenderer needs to drive it from a plain string. A router
 * this small stays trivially server-renderable and adds no dependency.
 *
 * `ssrUrl` is passed during prerendering, where there is no window to read.
 */
export function useRoute(ssrUrl) {
  const [route, setRoute] = useState(() =>
    matchPath(ssrUrl ?? (typeof window === 'undefined' ? '/' : window.location.pathname)),
  )

  useEffect(() => {
    const sync = () => setRoute(matchPath(window.location.pathname))
    // The browser restores scroll itself on back/forward; let it.
    window.addEventListener('popstate', sync)
    sync()
    return () => window.removeEventListener('popstate', sync)
  }, [])

  const navigate = useCallback((page, lang, { scroll = true, hash = '' } = {}) => {
    const path = pathFor(page, lang)
    window.history.pushState({}, '', hash ? `${path}#${hash}` : path)
    setRoute({ page, lang })
    if (!scroll) return
    window.scrollTo(0, 0)
    if (!hash) return
    // The target section only exists after the new page renders.
    requestAnimationFrame(() => {
      const el = document.getElementById(hash)
      if (el) {
        window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 84 })
      }
    })
  }, [])

  return { ...route, navigate }
}

/**
 * Props for an anchor that is a real crawlable link *and* a client-side
 * navigation. Plain left-clicks are intercepted; modified clicks and
 * middle-clicks fall through to the browser so "open in new tab" still works.
 */
export function linkProps(page, lang, navigate, hash = '') {
  const path = pathFor(page, lang)
  return {
    href: hash ? `${path}#${hash}` : path,
    onClick: (e) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
        return
      }
      e.preventDefault()
      navigate(page, lang, { hash })
    },
  }
}
