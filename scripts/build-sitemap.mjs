#!/usr/bin/env node
/**
 * sitemap.xml from the deploy list — `node scripts/build-sitemap.mjs`
 * (`--check` exits 1 if the committed file differs; check.mjs runs the same
 * comparison).
 *
 * Every published page is listed; pages that switch language with ?lang=
 * (the landing page, the project sheets and, once published, legal/) carry
 * xhtml:link alternates for fr/en/ar plus x-default (the French original).
 * No lastmod: a date that is not maintained is worse than none, and
 * priority/changefreq are ignored by the engines that matter.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { ROOT, BASE, LANGS, PAGES } from './site.mjs';

// pages whose language follows ?lang= (an inline or app.js dictionary)
const MULTILINGUAL = new Set(['index.html', 'scene/index.html', 'legal/index.html']);

const url = (page) => BASE + page.replace(/index\.html$/, '');
export function renderSitemap() {
  const rows = PAGES.filter((p) => p !== '404.html').map((p) => {
    const loc = url(p);
    if (!MULTILINGUAL.has(p)) return `  <url><loc>${loc}</loc></url>`;
    const alt = LANGS.map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${l === 'fr' ? loc : loc + '?lang=' + l}"/>`)
      .concat(`    <xhtml:link rel="alternate" hreflang="x-default" href="${loc}"/>`);
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
