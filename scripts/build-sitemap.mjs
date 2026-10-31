#!/usr/bin/env node
/**
 * sitemap.xml from the deploy list — `node scripts/build-sitemap.mjs`
 * (`--check` exits 1 if the committed file differs; check.mjs runs the same
 * comparison).
 *
 * Every published page is listed. The landing page and the price guide are
 * one static page per language (index.html, en/, ar/: build-lang.mjs;
 * tarifs/, en/tarifs/, ar/tarifs/: build-tarifs.mjs), each listed once with
 * xhtml:link alternates naming its three plus x-default (the French one);
 * the pages that switch language with ?lang= (the project sheets and, once
 * published, legal/) carry the same alternates as ?lang= versions, one
 * <url> per version. No lastmod: a date that is not maintained is worse
 * than none, and priority/changefreq are ignored by the engines that
 * matter.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { ROOT, BASE, LANGS, PAGES } from './site.mjs';

/* The pages that exist once per language, static: a French page and its
   English and Arabic versions one folder down (en/, ar/). The landing page's
   map (build-lang.mjs) and the price guide's (build-tarifs.mjs), each page
   to its language; versions(p) gives any of them its three, by language, and
   LANG_FOLDERS the French folders they live in ('' is the root), for the
   links between them (build-lang.mjs: a link into one of these folders
   stays in the page's own language). */
export const STATIC_LANG = { 'index.html': 'fr', 'en/index.html': 'en', 'ar/index.html': 'ar' };
export const TARIFS_LANG = { 'tarifs/index.html': 'fr', 'en/tarifs/index.html': 'en', 'ar/tarifs/index.html': 'ar' };
const STATIC = { ...STATIC_LANG, ...TARIFS_LANG };
const frOf = (p) => p.replace(/^(?:en|ar)\//, '');
export const versions = (p) => Object.fromEntries(LANGS.map((l) => [l, (l === 'fr' ? '' : l + '/') + frOf(p)]));
export const LANG_FOLDERS = [...new Set(Object.keys(STATIC).map((p) => frOf(p).replace(/index\.html$/, '')))];
// pages whose language follows ?lang= (an inline dictionary, page-i18n.js);
// a link to one of them from en/ or ar/ carries ?lang= (build-lang.mjs)
export const MULTILINGUAL = new Set(['scene/index.html', 'legal/index.html']);

const url = (page) => BASE + page.replace(/index\.html$/, '');
const xhtml = (l, href) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${href}"/>`;
// pages: the published set; check.mjs passes PAGES plus legal/ to check the
// legal page's entry before it is published
export function renderSitemap(pages = PAGES) {
  const rows = pages.filter((p) => p !== '404.html').map((p) => {
    const loc = url(p);
    if (STATIC[p]) {
      const v = versions(p);
      const alt = LANGS.map((l) => xhtml(l, url(v[l]))).concat(xhtml('x-default', url(v.fr)));
      return `  <url>\n    <loc>${loc}</loc>\n${alt.join('\n')}\n  </url>`;
    }
    if (!MULTILINGUAL.has(p)) return `  <url><loc>${loc}</loc></url>`;
    const alt = LANGS.map((l) => xhtml(l, l === 'fr' ? loc : loc + '?lang=' + l)).concat(xhtml('x-default', loc));
    // one <url> per language version, each listing the full set
    return LANGS.map((l) => `  <url>\n    <loc>${(l === 'fr' ? loc : loc + '?lang=' + l).replace(/&/g, '&amp;')}</loc>\n${alt.join('\n')}\n  </url>`).join('\n');
  });
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${rows.join('\n')}
</urlset>
`;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const file = join(ROOT, 'sitemap.xml');
  if (process.argv.includes('--check')) {
    const same = readFileSync(file, 'utf8') === renderSitemap();
    console.log(same ? '✓ sitemap.xml matches the deploy list' : '✗ sitemap.xml is stale (run: npm run build)');
    process.exit(same ? 0 : 1);
  }
  writeFileSync(file, renderSitemap());
  console.log('✓ sitemap.xml written');
}
