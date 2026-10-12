/**
 * The landing page's dictionaries, read from assets/app.js without running
 * the page: the I18N and EXTRA object literals are plain data, evaluated
 * here and merged the way app.js merges them. Used by check.mjs (the French
 * baked into index.html must equal I18N.fr) and by build-fr.mjs (which
 * writes it). No dependencies.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from '../site.mjs';

function literal(src, name) {
  const start = src.indexOf(`var ${name} = {`);
  if (start < 0) throw new Error(`assets/app.js: no "var ${name} = {"`);
  const end = src.indexOf('\n  };', start);
  if (end < 0) throw new Error(`assets/app.js: ${name} has no closing "  };"`);
  return src.slice(src.indexOf('{', start), end + 4);
}

export function loadDicts(app = readFileSync(join(ROOT, 'assets/app.js'), 'utf8')) {
  const I18N = new Function(`return ${literal(app, 'I18N')}`)();
  const EXTRA = new Function(`return ${literal(app, 'EXTRA')}`)();
  for (const l of Object.keys(EXTRA)) Object.assign(I18N[l], EXTRA[l]);
  return I18N;
}

/* Every element carrying data-i18n="key", with the span of its inner HTML.
   The container's own tag is matched to its closing tag by depth, so nested
   elements of the same name are handled; the dictionary only ever holds
   inline markup. */
export function i18nNodes(html) {
  const out = [];
  const open = /<([a-zA-Z][a-zA-Z0-9-]*)\b[^>]*?\sdata-i18n="([^"]+)"[^>]*>/g;
  let m;
  while ((m = open.exec(html))) {
    const tag = m[1].toLowerCase(), from = m.index + m[0].length;
    const re = new RegExp(`<(/?)${tag}\\b[^>]*>`, 'gi');
    re.lastIndex = from;
    let depth = 1, x, to = -1;
    while ((x = re.exec(html))) {
      if (x[1]) { if (--depth === 0) { to = x.index; break; } }
      else if (!x[0].endsWith('/>')) depth++;
    }
    if (to < 0) throw new Error(`index.html: <${tag} data-i18n="${m[2]}"> is never closed`);
    out.push({ key: m[2], tag, from, to });
  }
  return out;
}

/* Compare markup with dictionary text as a browser would render it:
   entities decoded, runs of ordinary whitespace collapsed (NBSP and the
   narrow no-break space are significant and kept). */
const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
export const norm = (s) => String(s)
  .replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (e, n) => n[0] === '#'
    ? String.fromCodePoint(n[1].toLowerCase() === 'x' ? parseInt(n.slice(2), 16) : parseInt(n.slice(1), 10))
    : ENT[n.toLowerCase()] ?? e)
  .replace(/[ \t\r\n]+/g, ' ').trim();

/* Text for HTML: a bare & becomes &amp; and a < that opens no tag becomes
   &lt; (html-validate wants both); markup and existing entities are kept. */
export const toMarkup = (s) => String(s)
  .replace(/&(?!(#x[0-9a-f]+|#\d+|[a-z]+);)/gi, '&amp;')
  .replace(/<(?![a-zA-Z\/!])/g, '&lt;');

/* The FAQPage structured data for one language, from the same strings the
   page shows. app.js builds the identical object at runtime (applyLang). */
export function faqLd(dict) {
  const plain = (s) => norm(String(s).replace(/<[^>]+>/g, ''));
  const items = [];
  for (let i = 1; dict[`faq${i}.q`] != null; i++) {
    items.push({ '@type': 'Question', name: plain(dict[`faq${i}.q`]),
      acceptedAnswer: { '@type': 'Answer', text: plain(dict[`faq${i}.a`]) } });
  }
  return { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: items };
}
