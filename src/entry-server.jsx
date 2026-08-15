import { renderToString } from 'react-dom/server'
import App from './App.jsx'
import { COPY } from './data/copy'
import { ALL_ROUTES, SITE_URL, urlFor } from './data/routes'
import { OG_IMAGE, metaFor, schemasFor } from './data/seo'

/**
 * Build-time entry. `scripts/prerender.mjs` calls render() once per route and
 * writes the result to disk, so every URL ships real HTML instead of an empty
 * <div id="root">. Nothing here runs in the browser.
 */
export function render(url, page, lang) {
  const t = COPY[lang]
  return {
    html: renderToString(<App url={url} />),
    head: headFor(page, lang, t),
    lang: lang === 'fr' ? 'fr-FR' : 'en',
  }
}

export { ALL_ROUTES, SITE_URL }

function headFor(page, lang, t) {
  const { title, description } = metaFor(page, lang)
  const canonical = urlFor(page, lang)
  const locale = lang === 'fr' ? 'fr_FR' : 'en_GB'

  const alternates = ALL_ROUTES.filter((r) => r.page === page)
    .map((r) => tag('link', { rel: 'alternate', hreflang: r.lang, href: r.url }))
    .concat(
      tag('link', { rel: 'alternate', hreflang: 'x-default', href: urlFor(page, 'fr') }),
    )

  const schema = schemasFor(page, lang, t)
    .map(
      (s) =>
        `<script type="application/ld+json" data-te-schema>${JSON.stringify(s).replace(
          /</g,
          '\\u003c',
        )}</script>`,
    )
    .join('\n    ')

  return [
    `<title>${esc(title)}</title>`,
    tag('meta', { name: 'description', content: description }),
    tag('link', { rel: 'canonical', href: canonical }),
    ...alternates,
    tag('meta', { property: 'og:type', content: 'website' }),
    tag('meta', { property: 'og:site_name', content: 'TE Labs' }),
    tag('meta', { property: 'og:title', content: title }),
    tag('meta', { property: 'og:description', content: description }),
    tag('meta', { property: 'og:url', content: canonical }),
    tag('meta', { property: 'og:image', content: OG_IMAGE }),
    tag('meta', { property: 'og:locale', content: locale }),
    tag('meta', { name: 'twitter:card', content: 'summary_large_image' }),
    tag('meta', { name: 'twitter:title', content: title }),
    tag('meta', { name: 'twitter:description', content: description }),
    tag('meta', { name: 'twitter:image', content: OG_IMAGE }),
    schema,
  ].join('\n    ')
}

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const tag = (name, attrs) =>
  `<${name} ${Object.entries(attrs)
    .map(([k, v]) => `${k}="${esc(v)}"`)
    .join(' ')} />`
