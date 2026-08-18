import { renderToString } from 'react-dom/server'
import App from './App.jsx'
import { COPY } from './data/copy'
import { ALL_ROUTES, ERROR_ROUTES, NOT_FOUND, SITE_URL, urlFor } from './data/routes'
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

export { ALL_ROUTES, ERROR_ROUTES, SITE_URL }

function headFor(page, lang, t) {
  const { title, description } = metaFor(page, lang)
  const locale = lang === 'fr' ? 'fr_FR' : 'en_GB'

  // The error document is served under every URL that resolves to nothing, so
  // it can claim no canonical of its own and has no hreflang twin to declare.
  // noindex keeps it out of the index; follow lets the links out of it count.
  const error = page === NOT_FOUND
  const canonical = error ? null : urlFor(page, lang)

  const alternates = error
    ? []
    : ALL_ROUTES.filter((r) => r.page === page)
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
    tag('meta', { name: 'robots', content: error ? 'noindex, follow' : 'index, follow' }),
    // The route marker lets main.jsx notice when the served document was built
    // for a different route than the URL it ended up on — which is exactly what
    // happens when the host answers /en/typo with the root 404 document.
    tag('meta', { name: 'te:route', content: `${page}:${lang}` }),
    canonical ? tag('link', { rel: 'canonical', href: canonical }) : '',
    ...alternates,
    tag('meta', { property: 'og:type', content: 'website' }),
    tag('meta', { property: 'og:site_name', content: 'TE Labs' }),
    tag('meta', { property: 'og:title', content: title }),
    tag('meta', { property: 'og:description', content: description }),
    tag('meta', { property: 'og:url', content: canonical ?? urlFor('home', lang) }),
    tag('meta', { property: 'og:image', content: OG_IMAGE }),
    tag('meta', { property: 'og:locale', content: locale }),
    tag('meta', { name: 'twitter:card', content: 'summary_large_image' }),
    tag('meta', { name: 'twitter:title', content: title }),
    tag('meta', { name: 'twitter:description', content: description }),
    tag('meta', { name: 'twitter:image', content: OG_IMAGE }),
    schema,
  ]
    .filter(Boolean)
    .join('\n    ')
}

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const tag = (name, attrs) =>
  `<${name} ${Object.entries(attrs)
    .map(([k, v]) => `${k}="${esc(v)}"`)
    .join(' ')} />`
