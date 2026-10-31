/**
 * The landing page's dictionaries, read from assets/i18n/{fr,en,ar}.js
 * without running a page: each file is one `var I18N = {…};` object literal
 * (plain data: the page's strings, the services catalog and trust strip
 * that app.js once merged in as EXTRA), evaluated here. Used by check.mjs
 * (the text baked into index.html, en/ and ar/ must equal the dictionary of
 * each) and by build-lang.mjs (which writes it). No dependencies.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, LANGS } from '../site.mjs';

// one file per language, loaded by that language's page before app.js
export const I18N_FILES = Object.fromEntries(LANGS.map((l) => [l, `assets/i18n/${l}.js`]));

/* the object literal `var <name> = {…};` in src: from its "{" to the "}" of
   the first line that closes it with "};" (at the top level of a dictionary
   file, or indented inside a script) */
function literal(src, name, file) {
  const start = src.indexOf(`var ${name} = {`);
  if (start < 0) throw new Error(`${file}: no "var ${name} = {"`);
  const close = /\n[ \t]*\};/.exec(src.slice(start));
  if (!close) throw new Error(`${file}: ${name} has no closing "};" on a line of its own`);
  return src.slice(src.indexOf('{', start), start + close.index + close[0].length - 1);
}

/* { fr, en, ar }: each language's dictionary. sources: the files' text by
   language, for a caller that holds it (a page served from a copy, say);
   anything else means the files in assets/i18n/. */
export function loadDicts(sources) {
  const given = sources && typeof sources === 'object' ? sources : {};
  const out = {};
  for (const l of LANGS) {
    const file = I18N_FILES[l];
    const src = typeof given[l] === 'string' ? given[l] : readFileSync(join(ROOT, file), 'utf8');
    out[l] = new Function(`return ${literal(src, 'I18N', file)}`)();
  }
  return out;
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
const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: '\u00a0',
  thinsp: '\u2009', ensp: '\u2002', emsp: '\u2003', hairsp: '\u200a', numsp: '\u2007', puncsp: '\u2008' };
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

/* Plain text for a text node or a double-quoted attribute: what HTML would
   read as markup (& < > ") escaped, nothing kept. The generators that write
   a page from data (build-scene, build-voices, build-legal) share it. */
export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

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
