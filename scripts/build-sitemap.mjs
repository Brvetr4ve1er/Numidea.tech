#!/usr/bin/env node
/**
 * sitemap.xml from the deploy list — `node scripts/build-sitemap.mjs`
 * (`--check` exits 1 if the committed file differs; check.mjs runs the same
 * comparison).
 *
 * Every published page is listed. The landing page is one static page per
 * language (index.html, en/, ar/: build-lang.mjs), each listed once with
 * xhtml:link alternates naming the three plus x-default (the French one);
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

// the landing page's static language versions, by page (build-lang.mjs)
export const STATIC_LANG = { 'index.html': 'fr', 'en/index.html': 'en', 'ar/index.html': 'ar' };
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
    if (STATIC_LANG[p]) {
      const alt = LANGS.map((l) => xhtml(l, BASE + (l === 'fr' ? '' : l + '/'))).concat(xhtml('x-default', BASE));
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
