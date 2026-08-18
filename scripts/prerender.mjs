/**
 * Turns the built SPA into eight static HTML files — one per page per language.
 *
 * Runs after both Vite builds: the client build produces dist/index.html with
 * the hashed asset tags, the SSR build produces dist-ssr/entry-server.js. This
 * script renders each route with the server entry and splices the result into
 * the client shell, then writes a sitemap covering exactly the files it wrote.
 *
 * The point is that a crawler — Googlebot, but especially GPTBot, ClaudeBot and
 * PerplexityBot, which do not reliably run JavaScript — receives the words on
 * the page instead of an empty <div id="root">.
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')

const { render, ALL_ROUTES, ERROR_ROUTES, SITE_URL } = await import(
  join(dist + '-ssr', 'entry-server.js')
)

const shell = await readFile(join(dist, 'index.html'), 'utf8')

/** Splice one rendered route into the client shell. */
function page(path, name, lang) {
  const { html, head, lang: htmlLang } = render(path, name, lang)
  const out = shell
    .replace('<html lang="fr-FR">', `<html lang="${htmlLang}">`)
    .replace('<title>TE Labs</title>', head)
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`)
  return { out, kb: (html.length / 1024).toFixed(1) }
}

for (const { page: name, lang, path } of ALL_ROUTES) {
  const { out, kb } = page(path, name, lang)
  const dir = path === '/' ? dist : join(dist, path)
  await mkdir(dir, { recursive: true })
  await writeFile(join(dir, 'index.html'), out)
  console.log(`prerendered ${path.padEnd(16)} ${kb} KB`)
}

/**
 * The error documents, written as `404.html` rather than `404/index.html` —
 * that exact filename is what a static host (Vercel, Netlify, GitHub Pages)
 * serves, with a real 404 status, for a URL matching no file.
 *
 * The root one is French, matching the default language of a .fr domain. A
 * host that resolves the error document per directory picks up /en/404.html
 * for English URLs; one that always falls back to the root document still
 * answers with the correct 404 status, and main.jsx re-renders the page in
 * English once it sees the URL it actually landed on.
 */
for (const { page: name, lang, path } of ERROR_ROUTES) {
  const { out, kb } = page(path, name, lang)
  const file = join(dist, `${path.replace(/^\//, '')}.html`)
  await mkdir(dirname(file), { recursive: true })
  await writeFile(file, out)
  console.log(`prerendered ${path.padEnd(16)} ${kb} KB  (noindex)`)
}

// A sitemap generated from the same route table can never drift out of sync
// with the pages that actually exist.
const today = new Date().toISOString().slice(0, 10)
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${ALL_ROUTES.map(
  ({ page, url }) => `  <url>
    <loc>${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${page === 'home' ? '1.0' : '0.8'}</priority>
${ALL_ROUTES.filter((r) => r.page === page)
  .map((r) => `    <xhtml:link rel="alternate" hreflang="${r.lang}" href="${r.url}"/>`)
  .join('\n')}
  </url>`,
).join('\n')}
</urlset>
`
await writeFile(join(dist, 'sitemap.xml'), sitemap)
console.log(`sitemap.xml   ${ALL_ROUTES.length} urls -> ${SITE_URL}`)
