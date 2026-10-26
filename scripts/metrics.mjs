#!/usr/bin/env node
/**
 * Page metrics — `npm run metrics`. Not a gate: it measures, so the weekly
 * improvement cycle (IMPROVEMENTS.md) can see what a change did to the page
 * and keep a history the 14-day Lighthouse artifacts cannot.
 *
 * For index.html in French, English and Arabic, on a phone (390x844) and a
 * desktop (1280x900), after scrolling the whole page so every lazy image and
 * engraving mask has loaded, per top-level block (header, each section of
 * <main>, the plates, the footer):
 *  - top and height in px and in screens (height / viewport height);
 *  - words visible (innerText, so closed <details>, display:none and the
 *    other languages' text do not count) and controls visible;
 *  - bytes of the images and masks it shows (img currentSrc, CSS
 *    background-image and mask-image of every descendant), read from the
 *    resource timing entries (encodedBodySize, so as transferred).
 * And for the page: total height and screens, words, controls, requests and
 * bytes by type, and how far a reader scrolls before each thing a buyer
 * looks for first appears (ANSWERS: a price, a delivery time, a client, the
 * founder, a way to write, payment terms, who owns the site, a guarantee);
 * null when the page never says it.
 *
 * The other pages (scene/, hub/, workspacehq/, 404.html) get the page
 * totals only, at both sizes, scene/ in all three languages.
 *
 *   METRICS_BASE=<url>  measure a deployed copy instead of this checkout, e.g.
 *                       METRICS_BASE=https://brvetr4ve1er.github.io/Numidea.tech
 *   METRICS_OUT=<file>  where the JSON goes (default: .tmp/metrics.json, git-ignored)
 *
 * Prints one summary table and the line IMPROVEMENTS.md's history takes.
 * Motion is reduced so reveals show without waiting; the theme is the default
 * (Arcanum), as a first visit sees it.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { serve, launch } from './lib/serve.mjs';
import { ROOT } from './site.mjs';

const REMOTE = (process.env.METRICS_BASE || '').trim().replace(/\/+$/, '');
const OUT = process.env.METRICS_OUT || join(ROOT, '.tmp/metrics.json');
const SIZES = { phone: { width: 390, height: 844, touch: true }, desktop: { width: 1280, height: 900, touch: false } };

// what a buyer looks for, in the three languages; the first visible text node that matches marks it
const ANSWERS = {
  price: /(\d{1,3}(?:[\s\u00a0\u202f.,]\d{3})+|\d{3,})\s?(DA|DZD|دج|€|\$)|(€|\$)\s?\d{2,}/,   // an amount, not the Aperçu's "0 DA"
  delay: /\d+\s?[–-]?\s?\d*\s?(semaines?|jours? ouvrés|weeks?|working days|أسابيع|أيام عمل)/i,
  client: /Bordj Steel|Alliance Travel|AlmaFlowClim/,
  founder: /Yasser|ياسر/,
  write: null,                                  // a mailto:/wa.me link or a form field, found by element
  payment: /acompte|deposit|دفعة مقدمة|échéancier|payment schedule|modalités de paiement/i,
  ownership: /propriétaire|propriété du code|ownership|you own|vous appartient|ملكية/i,
  guarantee: /garantie|guarantee|warranty|ضمان/i,
};

const srv = REMOTE ? null : await serve(ROOT, { compress: true });
const B = REMOTE || srv.base;
const b = await launch();

async function measure(path, { lang, size, sections }) {
  const vp = SIZES[size];
  const ctx = await b.newContext({ viewport: { width: vp.width, height: vp.height }, hasTouch: vp.touch, isMobile: vp.touch, reducedMotion: 'reduce' });
  if (lang) await ctx.addInitScript((l) => { try { localStorage.setItem('numidea-lang', l); } catch (e) { /* storage off */ } }, lang);
  const p = await ctx.newPage();
  await p.goto(B + path, { waitUntil: 'networkidle' });
  // scroll the whole page so lazy images and masks load, then come back up
  await p.evaluate(async () => {
    document.documentElement.style.scrollBehavior = 'auto';
    for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight / 2) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
    scrollTo(0, 0);
  });
  await p.waitForLoadState('networkidle');
  await p.waitForTimeout(400);
  const m = await p.evaluate(async ({ sections, answers }) => {
    const words = (t) => (t.match(/[\p{L}\p{N}][\p{L}\p{N}'’\-]*/gu) || []).length;
    const shown = (e) => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && !e.closest('[hidden],[inert]'); };
    const CTRL = 'a[href],button,input,select,textarea,summary';
    const res = new Map(performance.getEntriesByType('resource').map((r) => [r.name.split('#')[0], r]));
    const urls = (el) => {
      const out = new Set();
      for (const e of [el, ...el.querySelectorAll('*')]) {
        if (e.tagName === 'IMG' && e.currentSrc) out.add(e.currentSrc);
        // the engravings are masks on ::before / ::after as often as on the element
        for (const s of [getComputedStyle(e), getComputedStyle(e, '::before'), getComputedStyle(e, '::after')])
          for (const v of [s.backgroundImage, s.maskImage, s.webkitMaskImage]) for (const u of (v || '').matchAll(/url\("?([^")]+)"?\)/g)) if (!u[1].startsWith('data:')) out.add(new URL(u[1], location.href).href);
      }
      return out;
    };
    const bytes = (set) => [...set].reduce((n, u) => n + (res.get(u)?.encodedBodySize || 0), 0);
    const H = document.documentElement.scrollHeight, vh = innerHeight;
    const out = { height: H, screens: +(H / vh).toFixed(1), words: words(document.body.innerText),
      controls: [...document.querySelectorAll(CTRL)].filter(shown).length };
    const all = performance.getEntriesByType('resource');
    const kind = (r) => /\.woff2/.test(r.name) ? 'font' : /\.css/.test(r.name) ? 'css' : /\.m?js/.test(r.name) ? 'js' : /\.(webp|png|jpe?g|svg|gif|avif)/.test(r.name) ? 'image' : 'other';
    out.requests = all.length + 1;
    out.bytes = { html: performance.getEntriesByType('navigation')[0]?.encodedBodySize || 0 };
    for (const r of all) out.bytes[kind(r)] = (out.bytes[kind(r)] || 0) + (r.encodedBodySize || 0);
    out.bytes.total = Object.values(out.bytes).reduce((a, c) => a + c, 0);
    if (!sections) return out;

    const blocks = [...document.body.children].flatMap((e) => (e.tagName === 'MAIN' ? [...e.children] : [e]))
      .filter((e) => !['SCRIPT', 'NOSCRIPT', 'TEMPLATE'].includes(e.tagName) && e.offsetHeight > 0 && getComputedStyle(e).position !== 'fixed');
    out.sections = [];
    for (const e of blocks) {
      const r = e.getBoundingClientRect(), top = r.top + scrollY;
      const h = e.querySelector('h1,h2');
      // the engraving masks are switched on only near the viewport (app.js .lz-on), so read each block's
      // images while it is on screen; bytes of a file shown by two blocks count in both
      const seen = new Set();
      for (let y = top; y < top + r.height; y += vh) {
        scrollTo(0, y); await new Promise((ok) => setTimeout(ok, 120));
        for (const u of urls(e)) seen.add(u);
      }
      for (const x of performance.getEntriesByType('resource')) res.set(x.name.split('#')[0], x);
      out.sections.push({ block: e.id ? '#' + e.id : e.tagName.toLowerCase() + (typeof e.className === 'string' && e.className ? '.' + e.className.split(' ')[0] : ''),
        heading: h ? h.innerText.trim().replace(/\s+/g, ' ').slice(0, 60) : '', top: Math.round(top), height: Math.round(r.height),
        screens: +(r.height / vh).toFixed(2), words: words(e.innerText || ''), controls: [...e.querySelectorAll(CTRL)].filter(shown).length, imageBytes: bytes(seen) });
    }
    scrollTo(0, 0);
    // the first place each answer appears, in screens from the top
    const depth = {};
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n; (n = walker.nextNode());) {
      const el = n.parentElement; if (!el || !n.nodeValue.trim() || !shown(el)) continue;
      // a price is often split across elements ("90 000 – 160 000" + "DA"), so read the text around the node too
      const around = (el.parentElement || el).textContent.replace(/\s+/g, ' ').slice(0, 400);
      for (const [k, re] of Object.entries(answers)) if (re && depth[k] === undefined && new RegExp(re.s, re.f).test(n.nodeValue + ' ' + (k === 'price' ? around : '')))
        depth[k] = +((el.getBoundingClientRect().top + scrollY) / vh).toFixed(1);
    }
    const w = [...document.querySelectorAll('a[href^="mailto:"],a[href*="wa.me"],form textarea')].filter(shown)
      .map((e) => (e.getBoundingClientRect().top + scrollY) / vh).sort((a, c) => a - c)[0];
    depth.write = w === undefined ? null : +w.toFixed(1);
    for (const k of Object.keys(answers)) if (depth[k] === undefined) depth[k] = null;
    out.answers = depth;
    return out;
  }, { sections, answers: Object.fromEntries(Object.entries(ANSWERS).map(([k, re]) => [k, re && { s: re.source, f: re.flags }])) });
  await ctx.close();
  return m;
}

const result = { measured: new Date().toISOString(), base: REMOTE || 'checkout', pages: {} };
for (const lang of ['fr', 'en', 'ar']) for (const size of Object.keys(SIZES))
  result.pages[`index ${lang} ${size}`] = await measure('/index.html', { lang, size, sections: true });
for (const lang of ['fr', 'en', 'ar']) for (const size of Object.keys(SIZES))
  result.pages[`scene ${lang} ${size}`] = await measure('/scene/index.html', { lang, size });
for (const [name, path] of [['hub', '/hub/index.html'], ['workspacehq', '/workspacehq/index.html'], ['404', '/404.html']])
  for (const size of Object.keys(SIZES)) result.pages[`${name} ${size}`] = await measure(path, { size });
await b.close(); srv?.close();
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(result, null, 1) + '\n');

const kb = (n) => (n / 1024).toFixed(0) + ' KB';
console.log(`measured ${result.base} → ${OUT}\n`);
console.log('page'.padEnd(26), 'height'.padStart(8), 'screens'.padStart(8), 'words'.padStart(6), 'ctrls'.padStart(6), 'reqs'.padStart(5), 'bytes'.padStart(9));
for (const [k, m] of Object.entries(result.pages))
  console.log(k.padEnd(26), String(m.height).padStart(8), String(m.screens).padStart(8), String(m.words).padStart(6), String(m.controls).padStart(6), String(m.requests).padStart(5), kb(m.bytes.total).padStart(9));
const fp = result.pages['index fr phone'];
console.log('\nindex fr phone, by block:');
for (const s of fp.sections) console.log(' ', s.block.padEnd(22), (s.heading || '').slice(0, 34).padEnd(35), String(s.screens).padStart(6), 'scr', String(s.words).padStart(5), 'w', String(s.controls).padStart(4), 'ctl', kb(s.imageBytes).padStart(8));
console.log('\nscreens until each answer (index, phone):');
for (const l of ['fr', 'en', 'ar']) console.log(' ', l, JSON.stringify(result.pages[`index ${l} phone`].answers));
const fd = result.pages['index fr desktop'];
console.log(`\nhistory row: | ${result.measured.slice(0, 10)} | ${fp.screens} | ${fd.screens} | ${fp.words} | ${kb(fp.bytes.total)} | ${kb(fd.bytes.total)} |`);
