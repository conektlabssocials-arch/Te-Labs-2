import { useEffect } from 'react'
import { ALL_ROUTES, NOT_FOUND, urlFor } from '../data/routes'
import { OG_IMAGE, metaFor, schemasFor } from '../data/seo'

/**
 * Keeps <head> correct after a client-side navigation.
 *
 * The prerenderer writes the same tags into the served HTML, so a crawler
 * never depends on this running — this exists so that a human (and any crawler
 * that does execute JS) sees the right title after switching pages, instead of
 * the one 8-character title the whole site used to share.
 */
export function useHead(page, lang, t) {
  useEffect(() => {
    const { title, description } = metaFor(page, lang)
    const error = page === NOT_FOUND
    // An error page is served at whatever URL was mistyped, so it has no
    // canonical address to claim and no translated twin to point hreflang at.
    // It gets noindex instead — and the tags a real page left behind get
    // cleared, or a client-side navigation would leave the previous page's
    // canonical sitting on a URL that does not exist.
    const canonical = error ? null : urlFor(page, lang)

    document.title = title
    document.documentElement.lang = lang === 'fr' ? 'fr-FR' : 'en'

    setMeta('name', 'description', description)
    setMeta('name', 'robots', error ? 'noindex, follow' : 'index, follow')
    setLink('canonical', canonical)

    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', canonical ?? urlFor('home', lang))
    setMeta('property', 'og:image', OG_IMAGE)
    setMeta('property', 'og:locale', lang === 'fr' ? 'fr_FR' : 'en_GB')
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', description)
    setMeta('name', 'twitter:image', OG_IMAGE)

    syncAlternates(error ? null : page)
    syncSchema(schemasFor(page, lang, t))
  }, [page, lang, t])
}

function setMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

/** A null href removes the link entirely rather than pointing it at nothing. */
function setLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]:not([hreflang])`)
  if (href == null) {
    if (el) el.remove()
    return
  }
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

/** Reciprocal hreflang for the current page across both languages. */
function syncAlternates(page) {
  document.head.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => el.remove())
  if (page == null) return
  const rows = ALL_ROUTES.filter((r) => r.page === page).map((r) => [r.lang, r.url])
  rows.push(['x-default', urlFor(page, 'fr')])
  for (const [hreflang, href] of rows) {
    const el = document.createElement('link')
    el.setAttribute('rel', 'alternate')
    el.setAttribute('hreflang', hreflang)
    el.setAttribute('href', href)
    document.head.appendChild(el)
  }
}

function syncSchema(schemas) {
  document.head.querySelectorAll('script[data-te-schema]').forEach((el) => el.remove())
  for (const schema of schemas) {
    const el = document.createElement('script')
    el.type = 'application/ld+json'
    el.setAttribute('data-te-schema', '')
    el.textContent = JSON.stringify(schema)
    document.head.appendChild(el)
  }
}
