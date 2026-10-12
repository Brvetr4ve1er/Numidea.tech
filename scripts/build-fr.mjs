#!/usr/bin/env node
/**
 * The French baked into index.html — `node scripts/build-fr.mjs`
 * (`--check` exits 1 when index.html differs; check.mjs runs the same test).
 *
 * index.html ships French so the page reads right before app.js runs, with
 * scripts off, and to every scraper that never runs them. app.js then
 * re-applies I18N.fr on load, so any drift between the two shows as text
 * changing after paint, and a no-JS reader (or a search engine reading the
 * FAQ structured data) sees an offer the page no longer makes. This writes
 * I18N.fr (after EXTRA is merged) into:
 *   - every data-i18n element's inner HTML,
 *   - every data-i18n-ph / -aria / -alt attribute's placeholder / aria-label / alt,
 *   - <title> and the meta description,
 *   - the FAQPage JSON-LD (script#ld-faq), built by faqLd() exactly as
 *     applyLang() rebuilds it for the visitor's language.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { ROOT } from './site.mjs';
import { loadDicts, i18nNodes, toMarkup, faqLd } from './lib/i18n.mjs';

const ATTR = { ph: 'placeholder', aria: 'aria-label', alt: 'alt' };
const attrEsc = (s) => toMarkup(s).replace(/"/g, '&quot;');
const LD = /(<script type="application\/ld\+json" id="ld-faq">)[\s\S]*?(<\/script>)/;

export function ldText(dict) {
  const o = faqLd(dict);
  const items = o.mainEntity.map((q) => JSON.stringify(q)).join(',\n');
  return `\n{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[\n${items}\n]}\n`;
}

export function bakeFr(html, fr = loadDicts().fr) {
  const missing = [];
  // inner HTML, last node first so earlier offsets stay valid
  for (const n of i18nNodes(html).reverse()) {
    if (fr[n.key] == null) { missing.push(n.key); continue; }
    html = html.slice(0, n.from) + toMarkup(fr[n.key]) + html.slice(n.to);
  }
  // translated attributes, within the same tag
  for (const [suffix, attr] of Object.entries(ATTR)) {
    html = html.replace(new RegExp(`<[^>]*\\sdata-i18n-${suffix}="([^"]+)"[^>]*>`, 'g'), (tag, key) => {
      if (fr[key] == null) { missing.push(key); return tag; }
      const re = new RegExp(`(\\s${attr}=")[^"]*(")`);
      return re.test(tag) ? tag.replace(re, `$1${attrEsc(fr[key])}$2`) : tag;
    });
  }
  html = html.replace(/(<title>)[^<]*(<\/title>)/, `$1${toMarkup(fr.title)}$2`);
  html = html.replace(/(<meta name="description" content=")[^"]*(")/, `$1${attrEsc(fr['meta.desc'])}$2`);
  if (!LD.test(html)) throw new Error('index.html has no <script type="application/ld+json" id="ld-faq">');
  html = html.replace(LD, `$1${ldText(fr)}$2`);
  if (missing.length) throw new Error('keys missing from I18N.fr: ' + [...new Set(missing)].join(', '));
  return html;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const file = join(ROOT, 'index.html'), html = readFileSync(file, 'utf8'), want = bakeFr(html);
  if (process.argv.includes('--check')) {
    console.log(html === want ? '✓ index.html French equals I18N.fr' : '✗ index.html French differs from I18N.fr (run: npm run build)');
    process.exit(html === want ? 0 : 1);
  }
  writeFileSync(file, want);
  console.log('✓ index.html French baked from I18N.fr');
}
