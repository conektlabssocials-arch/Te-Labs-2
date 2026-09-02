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
export const PAGES = ['home', 'services', 'work', 'tech', 'conektAds', 'contact']

/**
 * The error page. Deliberately not in PAGES: it has no canonical URL, earns no
 * sitemap entry and must never be crawled as content — it only exists as the
 * answer to a URL that does not resolve.
 */
export const NOT_FOUND = 'notfound'

/**
 * French is the default language and lives at the root — a .fr domain selling
 * to a French market should not make its primary audience sit through a
 * redirect. English is namespaced under /en.
 *
 * Slugs are translated per language because "réalisations" is the word French
 * users actually search for; "work" earns nothing on a French query.
 */
const SLUGS = {
  fr: { home: '', services: 'services', work: 'realisations', tech: 'tech', conektAds: 'tech/conekt-ads', contact: 'contact' },
  en: { home: '', services: 'services', work: 'work', tech: 'tech', conektAds: 'tech/conekt-ads', contact: 'contact' },
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
 * Resolve a pathname to a page and language.
 *
 * An unknown slug resolves to the error page, not to home: silently rendering
 * the home page at /whatever gives a broken link a 200 and a duplicate of the
 * home page at an address that should not exist. The language still comes from
 * the path prefix, so /en/typo lands on the English error page.
 */
export function matchPath(pathname = '/') {
  const clean = `/${String(pathname).split('?')[0].split('#')[0].replace(/^\/+|\/+$/g, '')}`
  const [, first, ...rest] = clean.split('/')
  const lang = LANGS.includes(first) && first !== DEFAULT_LANG ? first : DEFAULT_LANG
  const slug = (lang === DEFAULT_LANG ? [first, ...rest] : rest).filter(Boolean).join('/')

  if (!slug) return { page: 'home', lang }
  const page = PAGES.find((p) => SLUGS[lang][p] === slug)
  return { page: page || NOT_FOUND, lang }
}

/** Every (page, lang) pair — the list the prerenderer and sitemap iterate. */
export const ALL_ROUTES = LANGS.flatMap((lang) =>
  PAGES.map((page) => ({ page, lang, path: pathFor(page, lang), url: urlFor(page, lang) })),
)

/**
 * The error pages the prerenderer writes, kept out of ALL_ROUTES so they never
 * reach the sitemap. The French one becomes dist/404.html, which is the file a
 * static host serves — with a real 404 status — for any URL that matches
 * nothing. The English one sits at /en/404 for hosts that resolve the error
 * document per directory, and is reachable directly either way.
 */
export const ERROR_ROUTES = LANGS.map((lang) => ({
  page: NOT_FOUND,
  lang,
  path: lang === DEFAULT_LANG ? '/404' : `/${lang}/404`,
}))
