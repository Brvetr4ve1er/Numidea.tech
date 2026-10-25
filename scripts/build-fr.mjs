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
 *   - the studio's ProfessionalService JSON-LD description (= meta.desc, as
 *     applyLang() sets it for the visitor's language),
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
/* Put `text` between the two groups `re` captures, literally. A string
   replacement would expand $&, $', $` and $1 found in the copy (a price in
   "US$1 000", say) into pieces of the page; a replacer function inserts the
   text as it is. */
const between = (s, re, text) => s.replace(re, (_, open, close) => open + text + close);

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
      return re.test(tag) ? between(tag, re, attrEsc(fr[key])) : tag;
    });
  }
  html = between(html, /(<title>)[^<]*(<\/title>)/, toMarkup(fr.title));
  html = between(html, /(<meta name="description" content=")[^"]*(")/, attrEsc(fr['meta.desc']));
  // the studio's structured data: only its description, written in place
  let studio = 0;
  html = html.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/g, (all, open, body, close) => {
    let o; try { o = JSON.parse(body); } catch { return all; }
    if (o['@type'] !== 'ProfessionalService') return all;
    studio++;
    const re = /("description":\s*)"(?:[^"\\]|\\.)*"/;
    if (!re.test(body)) throw new Error('the ProfessionalService JSON-LD in index.html has no "description"');
    return open + body.replace(re, (_, key) => key + JSON.stringify(fr['meta.desc'])) + close;
  });
  if (studio !== 1) throw new Error(`index.html has ${studio} ProfessionalService JSON-LD blocks (want one)`);
  if (!LD.test(html)) throw new Error('index.html has no <script type="application/ld+json" id="ld-faq">');
  html = between(html, LD, ldText(fr));
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
