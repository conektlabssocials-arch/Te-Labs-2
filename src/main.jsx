import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App.jsx'
import { matchPath } from './data/routes'
import './index.css'

const container = document.getElementById('root')

/**
 * True when the markup on screen was built for the route the URL asks for.
 *
 * Every real route has its own file, so this is normally trivially true. It is
 * false in exactly one case: the host answered an unmatched /en/… URL with the
 * root 404 document, which was rendered in French. Hydrating French markup
 * against an English render would trip React's mismatch handling, so that one
 * case renders from scratch instead.
 */
function markupMatchesUrl() {
  const marker = document.querySelector('meta[name="te:route"]')?.content
  if (!marker) return true
  const { page, lang } = matchPath(window.location.pathname)
  return marker === `${page}:${lang}`
}

// Every route is prerendered, so the normal path is hydration — attaching to
// markup that is already on screen. createRoot stays as a fallback for the dev
// server, where index.html still ships the empty shell.
if (container.hasChildNodes() && markupMatchesUrl()) {
  hydrateRoot(container, <App />)
} else {
  createRoot(container).render(<App />)
}
