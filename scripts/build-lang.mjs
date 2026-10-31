#!/usr/bin/env node
/**
 * The landing page in its three languages — `node scripts/build-lang.mjs`
 * (`--check` exits 1 when a page differs; check.mjs 8e runs the same test).
 *
 * index.html is the French page and the template. It ships French so the
 * page reads right before app.js runs, with scripts off, and to every
 * scraper that never runs them; app.js then re-applies the dictionary on
 * load, so any drift between the two shows as text changing after paint,
 * and a no-JS reader (or a search engine reading the FAQ structured data)
 * sees an offer the page no longer makes. en/index.html and ar/index.html
 * are the same page written from it, so one markup serves the three
 * languages and a change to index.html reaches them at the next build.
 * bakeLang() writes a language's dictionary (assets/i18n/<lang>.js) into:
 *   - every data-i18n element's inner HTML,
 *   - every data-i18n-ph / -aria / -alt attribute's placeholder / aria-label / alt,
 *   - <title>, the meta description, og:title, og:description,
 *     og:image:alt, twitter:title and twitter:description (the meta.* keys),
 *   - the studio's ProfessionalService JSON-LD description (= meta.desc, as
 *     applyLang() sets it),
 *   - the FAQPage JSON-LD (script#ld-faq), built by faqLd() exactly as
 *     applyLang() rebuilds it,
 *   - every WhatsApp link (a.wa-link): with window.NUMIDEA_WA set in the
 *     page, its wa.me link with the opening line (data-wa-text, else
 *     wa.hello), as app.js §13 builds it, so the hero's WhatsApp button works
 *     on the first screen before the deferred app.js arrives; with no number,
 *     the guard app.js applies (no href, aria-disabled). app.js then adds
 *     the ad's [ref],
 *   - html lang and dir, the language switch's current link (aria-current),
 *     og:url, og:locale and its two alternates, the share card (og:image and
 *     twitter:image: assets/og.jpg, og-en.jpg, og-ar.jpg, scripts/build-og.mjs)
 *     and the dictionary file the page loads before app.js.
 * en/ and ar/ sit one folder down (depth 1): every relative src, href and
 * srcset gets ../, the head script's font path too, and a link to a page
 * that still switches language with ?lang= (MULTILINGUAL in
 * build-sitemap.mjs: scene/, legal/) carries the page's language. Their
 * head script loses the French-only block (between the LANG:fr-only
 * markers: the ?lang= and stored-preference redirect, the scripted
 * canonical) and gets BAKED = their language; a static canonical names each
 * of them, as their head script reads no ?lang= (check.mjs 6); and their
 * CSP meta is their own, as the head script's hash differs (build-csp.mjs
 * applies the same policy again last, a no-op). bakeFr(html) is
 * bakeLang(html, 'fr'), the French page's check.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { pathToFileURL } from 'node:url';
import { ROOT, BASE, LANGS } from './site.mjs';
import { loadDicts, i18nNodes, toMarkup, faqLd, I18N_FILES } from './lib/i18n.mjs';
import { MULTILINGUAL } from './build-sitemap.mjs';
import { withCsp } from './lib/csp.mjs';

export const LANG_PAGES = { fr: 'index.html', en: 'en/index.html', ar: 'ar/index.html' };
const LOCALE = { fr: 'fr_FR', en: 'en_US', ar: 'ar_DZ' };
const CARD = { fr: 'assets/og.jpg', en: 'assets/og-en.jpg', ar: 'assets/og-ar.jpg' };   // build-og.mjs
const NAME = { fr: 'French', en: 'English', ar: 'Arabic' };
const ATTR = { ph: 'placeholder', aria: 'aria-label', alt: 'alt' };
const attrEsc = (s) => toMarkup(s).replace(/"/g, '&quot;');
const LD = /(<script type="application\/ld\+json" id="ld-faq">)[\s\S]*?(<\/script>)/;
/* Put `text` between the two groups `re` captures, literally. A string
   replacement would expand $&, $', $` and $1 found in the copy (a price in
   "US$1 000", say) into pieces of the page; a replacer function inserts the
   text as it is. The tag must be there: a head that lost it would otherwise
   ship the template's text in every language. */
const between = (s, re, text, what) => {
  if (!re.test(s)) throw new Error(`index.html has no ${what}`);
  return s.replace(re, (_, open, close) => open + text + close);
};
// one <meta name|property="…" content="…">
const meta = (attr, name) => new RegExp(`(<meta ${attr}="${name}" content=")[^"]*(")`);
// a page's head texts: [attribute, name, dictionary key]
const HEAD_TEXTS = [
  ['name', 'description', 'meta.desc'], ['property', 'og:title', 'meta.ogTitle'], ['property', 'og:description', 'meta.ogDesc'],
  ['property', 'og:image:alt', 'meta.ogAlt'], ['name', 'twitter:title', 'meta.ogTitle'], ['name', 'twitter:description', 'meta.twDesc'],
];
// the page folders that switch language in place (scene, legal), from MULTILINGUAL
const SWITCHING = [...MULTILINGUAL].map((p) => dirname(p));

export function ldText(dict) {
  const o = faqLd(dict);
  const items = o.mainEntity.map((q) => JSON.stringify(q)).join(',\n');
  return `\n{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[\n${items}\n]}\n`;
}

/* exactly one match of re in s, replaced; the count says whether the
   template still has the shape this generator relies on */
function once(s, re, to, what) {
  const n = (s.match(new RegExp(re.source, 'g' + re.flags.replace('g', ''))) || []).length;
  if (n !== 1) throw new Error(`index.html: ${what} found ${n} times (want one)`);
  return s.replace(re, to);
}

/* A relative URL moved `depth` folders down: ../ per folder, "./" (the site
   root) becoming the parent. Absolute ones, fragments, schemes and template
   bindings are left as they are. */
const RELATIVE = /^(?![a-z][a-z0-9+.-]*:|\/\/|\/|#|\{\{)/i;
const up = (u, depth) => (u === '' || !RELATIVE.test(u) ? u : (u === './' ? '' : u).replace(/^/, '../'.repeat(depth)) || './');
/* a link into a folder that switches language with ?lang= carries the
   page's language, before any #fragment */
const langed = (u, lang) => {
  const m = new RegExp(`^((?:\\.\\./)*(?:${SWITCHING.join('|')})/)(\\?[^#]*)?(#.*)?$`).exec(u);
  if (!m) return u;
  return m[1] + (m[2] ? m[2] + '&lang=' + lang : '?lang=' + lang) + (m[3] || '');
};

/* every relative src, href and srcset moved down (a value holding a quote
   is script, not a path: skipped), the head script's font path with them,
   and the links to the in-place switchers given ?lang= */
function relocate(html, lang, depth) {
  html = html.replace(/(\s(?:src|href|poster)=")([^"]*)(")/g, (all, a, u, b) => (u.includes("'") ? all : a + langed(up(u, depth), lang) + b));
  html = html.replace(/(\ssrcset=")([^"]*)(")/g, (all, a, v, b) => a + v.split(',').map((c) => {
    const [u, ...d] = c.trim().split(/\s+/);
    return [up(u, depth), ...d].join(' ');
  }).join(', ') + b);
  // the preload tags the head script writes: href="assets/fonts/' + f + '.woff2"
  return once(html, /(href=")assets\/fonts\/'/, `$1${'../'.repeat(depth)}assets/fonts/'`, 'the head script\'s href="assets/fonts/\' literal');
}

/**
 * The page in one language. html: index.html (the template); dict: that
 * language's dictionary; depth: how many folders down the page sits (en/,
 * ar/: 1), for its relative paths; path: its URL path under BASE, for og:url
 * and the canonical. Throws on a key the dictionary lacks.
 */
export function bakeLang(html, lang, dict = loadDicts()[lang], { depth = lang === 'fr' ? 0 : 1, path = lang === 'fr' ? '' : lang + '/' } = {}) {
  if (!LANGS.includes(lang)) throw new Error(`no such language: ${lang}`);
  const missing = [];
  const need = (key) => { if (dict[key] == null) missing.push(key); return dict[key]; };
  // inner HTML, last node first so earlier offsets stay valid
  for (const n of i18nNodes(html).reverse()) {
    if (need(n.key) == null) continue;
    html = html.slice(0, n.from) + toMarkup(dict[n.key]) + html.slice(n.to);
  }
  // translated attributes, within the same tag
  for (const [suffix, attr] of Object.entries(ATTR)) {
    html = html.replace(new RegExp(`<[^>]*\\sdata-i18n-${suffix}="([^"]+)"[^>]*>`, 'g'), (tag, key) => {
      if (need(key) == null) return tag;
      const re = new RegExp(`(\\s${attr}=")[^"]*(")`);
      return re.test(tag) ? tag.replace(re, (_, open, close) => open + attrEsc(dict[key]) + close) : tag;
    });
  }
  // WhatsApp links: the attributes app.js §13 (wireWA) sets, in the page's
  // language; the tag's other attributes stay where they are
  const wa = ((/window\.NUMIDEA_WA = '([^']*)'/.exec(html) || [])[1] || '').replace(/\D/g, '');
  html = html.replace(/<a\b[^>]*\sclass="(?:[^"]*\s)?wa-link(?:\s[^"]*)?"[^>]*>/g, (tag) => {
    const key = (/\sdata-wa-text="([^"]+)"/.exec(tag) || [])[1] || 'wa.hello';
    if (need(key) == null) return tag;
    const bare = tag.replace(/\s(?:href|target|rel|aria-disabled)(?:="[^"]*")?(?=[\s>])/g, '');
    const set = wa
      ? ` href="https://wa.me/${wa}?text=${encodeURIComponent(dict[key])}" target="_blank" rel="noopener"`
      : ' aria-disabled="true"';
    return bare.replace(/>$/, set + '>');
  });
  // the head's texts
  if (need('title') != null) html = between(html, /(<title>)[^<]*(<\/title>)/, toMarkup(dict.title), '<title>');
  for (const [attr, name, key] of HEAD_TEXTS) if (need(key) != null) html = between(html, meta(attr, name), attrEsc(dict[key]), `<meta ${attr}="${name}">`);
  // the studio's structured data: only its description, written in place
  let studio = 0;
  html = html.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/g, (all, open, body, close) => {
    let o; try { o = JSON.parse(body); } catch { return all; }
    if (o['@type'] !== 'ProfessionalService') return all;
    studio++;
    const re = /("description":\s*)"(?:[^"\\]|\\.)*"/;
    if (!re.test(body)) throw new Error('the ProfessionalService JSON-LD in index.html has no "description"');
    return open + body.replace(re, (_, key) => key + JSON.stringify(dict['meta.desc'])) + close;
  });
  if (studio !== 1) throw new Error(`index.html has ${studio} ProfessionalService JSON-LD blocks (want one)`);
  html = between(html, LD, ldText(dict), '<script type="application/ld+json" id="ld-faq">');
  if (missing.length) throw new Error(`keys missing from I18N.${lang}: ` + [...new Set(missing)].join(', '));

  // the language itself: the root element, the switch's current link
  html = once(html, /(<html\b[^>]*\slang=")[^"]*(")/, `$1${lang}$2`, '<html lang>');
  html = once(html, /(<html\b[^>]*\sdir=")[^"]*(")/, `$1${dict.dir || (lang === 'ar' ? 'rtl' : 'ltr')}$2`, '<html dir>');
  html = html.replace(/<a\b[^>]*\shreflang="([a-z]{2})"[^>]*>/g, (tag, l) => {
    const bare = tag.replace(/\saria-current="[^"]*"/, '');
    return l === lang ? bare.replace(/>$/, ' aria-current="page">') : bare;
  });
  // the page's own address, locale, card and dictionary
  const self = BASE + path;
  html = between(html, meta('property', 'og:url'), self, '<meta property="og:url">');
  html = between(html, meta('property', 'og:locale'), LOCALE[lang], '<meta property="og:locale">');
  const others = LANGS.filter((l) => l !== lang);
  let alt = 0;
  html = html.replace(/(<meta property="og:locale:alternate" content=")[^"]*(")/g, (_, a, b) => a + LOCALE[others[alt++]] + b);
  if (alt !== others.length) throw new Error(`index.html has ${alt} og:locale:alternate metas (want ${others.length})`);
  for (const [attr, name] of [['property', 'og:image'], ['name', 'twitter:image']]) html = between(html, meta(attr, name), BASE + CARD[lang], `<meta ${attr}="${name}">`);
  html = once(html, /(<script src=")(?:\.\.\/)*assets\/i18n\/[a-z]{2}\.js(\?v=\d+" defer><\/script>)/, `$1${I18N_FILES[lang]}$2`, 'the dictionary <script>');

  if (depth) html = relocate(html, lang, depth);
  if (lang !== 'fr') {
    // the head script without the French page's block, baked for this language
    html = once(html, /[ \t]*\/\* LANG:fr-only[\s\S]*?\/\* \/LANG:fr-only \*\/\r?\n/, '', 'the LANG:fr-only block of the head script');
    html = once(html, /(\bBAKED = ')fr(')/, `$1${lang}$2`, "BAKED = 'fr' in the head script");
    // a static canonical, after the hreflang set; the scripted one went with the block
    html = html.replace(/[ \t]*<link rel="canonical"[^>]*>\r?\n?/g, '');
    html = once(html, /(<link rel="alternate" hreflang="x-default" href="[^"]*">\r?\n)/, (m) => m + `<link rel="canonical" href="${self}">\n`, 'the x-default hreflang link');
    html = once(html, /^<!DOCTYPE html>\r?\n/i, (m) => m + `<!-- Generated: the ${NAME[lang]} page, written from index.html (the French page, the\n     template) and ${I18N_FILES[lang]} by scripts/build-lang.mjs. Do not edit it here:\n     change index.html or the dictionary, then npm run build. -->\n`, 'the doctype');
    html = withCsp(html, 'page');
  }
  return html;
}

/* the French page: index.html baked from its own dictionary (check.mjs 8e) */
export const bakeFr = (html, fr = loadDicts().fr) => bakeLang(html, 'fr', fr);

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const check = process.argv.includes('--check');
  const dicts = loadDicts();
  const tpl = readFileSync(join(ROOT, 'index.html'), 'utf8');
  let stale = 0;
  for (const l of LANGS) {
    const file = LANG_PAGES[l], p = join(ROOT, file);
    const want = bakeLang(tpl, l, dicts[l]);
    const have = existsSync(p) ? readFileSync(p, 'utf8') : null;
    if (check) {
      console.log(have === want ? `✓ ${file} equals I18N.${l}` : `✗ ${file} differs from I18N.${l} (run: npm run build)`);
      if (have !== want) stale++;
      continue;
    }
    mkdirSync(dirname(p), { recursive: true });
    if (have !== want) writeFileSync(p, want);
    console.log(`✓ ${file} baked from I18N.${l}`);
  }
  if (check) process.exit(stale ? 1 : 0);
}
