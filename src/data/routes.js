/**
 * The single source of truth for URLs, languages and per-page metadata.
 *
 * Both the client router and the build-time prerenderer read this file, so a
 * route only has to be declared once to get a real URL, a prerendered HTML
 * file, a sitemap entry and reciprocal hreflang tags.
 */

export const SITE_URL = 'https://www.telabs.fr'
export const DEFAULT_LANG = 'fr'
export const LANGS = ['fr', 'en']
export const PAGES = ['home', 'services', 'work', 'contact']

/**
 * French is the default language and lives at the root — a .fr domain selling
 * to a French market should not make its primary audience sit through a
 * redirect. English is namespaced under /en.
 *
 * Slugs are translated per language because "réalisations" is the word French
 * users actually search for; "work" earns nothing on a French query.
 */
const SLUGS = {
  fr: { home: '', services: 'services', work: 'realisations', contact: 'contact' },
  en: { home: '', services: 'services', work: 'work', contact: 'contact' },
}

/** Canonical path for a page in a language, e.g. ('work','fr') -> '/realisations'. */
export function pathFor(page, lang) {
  const slug = SLUGS[lang]?.[page]
  if (slug == null) return lang === DEFAULT_LANG ? '/' : `/${lang}`
  const prefix = lang === DEFAULT_LANG ? '' : `/${lang}`
  const path = slug ? `${prefix}/${slug}` : prefix
  return path || '/'
}

/** Absolute URL for a page, used for canonical, hreflang, OG and the sitemap. */
export function urlFor(page, lang) {
  const path = pathFor(page, lang)
  return path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`
}

/**
 * Resolve a pathname to a page and language. Unknown paths fall back to the
 * home page of the language implied by the prefix, which keeps the client
 * router forgiving without inventing routes the prerenderer never built.
 */
export function matchPath(pathname = '/') {
  const clean = `/${String(pathname).split('?')[0].split('#')[0].replace(/^\/+|\/+$/g, '')}`
  const [, first, ...rest] = clean.split('/')
  const lang = LANGS.includes(first) && first !== DEFAULT_LANG ? first : DEFAULT_LANG
  const slug = (lang === DEFAULT_LANG ? [first, ...rest] : rest).filter(Boolean).join('/')

  if (!slug) return { page: 'home', lang }
  const page = PAGES.find((p) => SLUGS[lang][p] === slug)
  return { page: page || 'home', lang }
}

/** Every (page, lang) pair — the list the prerenderer and sitemap iterate. */
export const ALL_ROUTES = LANGS.flatMap((lang) =>
  PAGES.map((page) => ({ page, lang, path: pathFor(page, lang), url: urlFor(page, lang) })),
)
