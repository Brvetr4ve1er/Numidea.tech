#!/usr/bin/env node
/**
 * Design-intent gate — `npm run design`. vbugs only floors type at 12px; this
 * asks whether the page holds the system it claims: one type scale with a top,
 * one space set, one button, few card paddings, one grid gutter, and whether
 * what the CSS claims is what is painted.
 *
 *   type      every painted text size is a token (--t-*), the hero heading or
 *             the section heading
 *   hero      .hero-h ÷ h2.sec at least 1.5 at 1440 and 1.25 at 390
 *   titles    no h3/h4 at or above the section heading
 *   space     gaps and paddings of boxes are on the space set (--s-*, card pads)
 *   button    one .btn geometry per page (the mobile menu's own row excepted)
 *   cards     at most two card paddings per page
 *   gutter    at 1440 the columns of the section bands' grids (a grid that is
 *             a child of a section or its .wrap) with the same count start at
 *             the same x, within 1px, across bands
 *   paint     text is read where it is drawn: each text box is repainted with
 *             its glyphs hidden, and the pixels it sits on are held against the
 *             text's own colour (a pseudo-element or a gradient over the text
 *             does not show in the CSS contrast test, the dune caption's
 *             "8.5:1" was about 1.9:1); the 20th-percentile pixel must reach 3:1
 *   hover     no :hover rule outside @media (hover: hover) (a tap leaves it on)
 *   cover     fixed + sticky elements together cover at most 30% of the screen
 *             at 390×844, 360×780, 844×390 and 640×400, at every scroll stop
 *   labels    one visible link label has one destination
 *   art       hub/bible/art/*.webp: one alpha connected component of any size
 *             (no sprite debris beside the figure); the Kūro motion marks are listed
 *   rtl       /ar/, /ar/tarifs/ and the Arabic 404: the word space of mono-role
 *             text is 0.3em or less, no glyph is drawn in a system face (CDP
 *             getPlatformFontsForNode), no rendered "+" in front of a number
 *             in a right-to-left run (it flips to the number's end)
 *
 * STRICT by default: exits 1 on any failure. DESIGN_REPORT=1 prints the same
 * and exits 0. Every check has its target (above); a figure the page does not
 * meet yet is held at its measured value in CEIL below (a ratchet: it may
 * fall, never rise), and `npm run design` names each one as "above target".
 * Pages: the main site (home in three languages, the price guide, the
 * Arabic 404); hub/ has its own gates (check.mjs 17b, keys, vbugs).
 */
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';
import { serve, launch } from './lib/serve.mjs';
import { ROOT } from './site.mjs';

const PAGES = ['/', '/en/', '/ar/', '/tarifs/', '/ar/tarifs/'];
const VIEWS = [[1440, 900], [390, 844]];
const STRICT = process.env.DESIGN_REPORT !== '1';

/* the targets, and where the site stands: a key here is a check that is above
   its target today, held at what was measured on 2026-11-07 */
const TARGET = { type: 0, space: 0, btn: 1, cards: 2, titles: 0, gutter: 1 };
const CEIL = {
  // page @width: { check: ceiling }
  '/ @1440': { space: 52, btn: 3, cards: 4, gutter: 425 },
  '/ @390': { space: 17, btn: 3, cards: 3 },
  '/en/ @1440': { space: 52, btn: 3, cards: 4, gutter: 425 },
  '/en/ @390': { space: 17, btn: 3, cards: 3 },
  '/ar/ @1440': { type: 1, space: 46, btn: 3, cards: 4, gutter: 425 },
  '/ar/ @390': { type: 1, space: 11, btn: 3, cards: 3 },
  '/tarifs/ @1440': { type: 2, space: 26, btn: 2, gutter: 665 },
  '/tarifs/ @390': { type: 2, space: 21, btn: 3 },
  '/ar/tarifs/ @1440': { type: 3, space: 20, btn: 2, gutter: 525 },
  '/ar/tarifs/ @390': { type: 3, space: 15, btn: 3 },
};
// how many text boxes may read under 3:1 painted, how many :hover rules sit
// outside (hover: hover), how many labels have two destinations, and the
// most the fixed + sticky chrome may cover on a phone
const CEIL_DATE = '2026-11-07';
// glyphs the Arabic pages may still draw in a system face (typed arrows and marks no loaded face has; the home's markup, the 404's French line)
const RTL_SYS = { '/ar/': 52, '/ar/tarifs/': 18, '/404.html?lang=ar': 4 };   // Liberation Sans (typed arrows, ↗ ← →) and DejaVu Sans on /ar/ (12)
// bible art with more than one alpha component today, held at its count (the figure plus a speck or a prop that
// came away in the cut: the assets owner's to clean; the Kūro motion marks are several parts by design)
const ART_PARTS = new Map([['face-smirk.webp', 2], ['pose-facepalm.webp', 2], ['pose-handover.webp', 2], ['pose-laptop.webp', 2],
  ['pose-receipt.webp', 3], ['rig-y-glasses.webp', 2], ['rig-y-sip.webp', 2]]);
const LIMITS = { paint: 0, hover: 0, labels: 3, cover: 0.30 };
// measured on 2026-11-07: 36% and 40% (the price guide's sticky estimate panel and phone bar over its estimator); 25% and 25%
const COVER_CEIL = { '390x844': 0.37, '360x780': 0.41, '844x390': 0.30, '640x400': 0.30 };

const measure = () => {
  const vis = (el) => {
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };
  const px = (v) => +parseFloat(v).toFixed(2);
  // tokens resolved by a probe, so clamp() and media queries are measured as painted
  const probe = (decl) => {
    const e = document.createElement('i');
    e.style.cssText = `position:absolute;visibility:hidden;${decl}`;
    document.body.append(e);
    const v = px(getComputedStyle(e)[decl.split(':')[0].trim() === 'font-size' ? 'fontSize' : 'paddingLeft']);
    e.remove();
    return v;
  };
  const tIds = ['label', 'small', 'ui', 'body', 'lead', 'title', 'feature', 'cv', 'display', 'h2'];
  const sizeSet = new Set(tIds.map((t) => probe(`font-size:var(--t-${t},0px)`)).filter(Boolean));
  const h1 = document.querySelector('.hero-h');
  const h2 = document.querySelector('h2.sec');
  const hs = h1 ? px(getComputedStyle(h1).fontSize) : 0;
  const h2s = h2 ? px(getComputedStyle(h2).fontSize) : 0;
  if (hs) sizeSet.add(hs);
  if (h2s) sizeSet.add(h2s);
  const spaceSet = new Set([0]);
  for (let i = 1; i <= 10; i++) spaceSet.add(probe(`padding-left:var(--s-${i},0px)`));
  for (const k of ['card-pad', 'card-pad-lg', 'gutter']) spaceSet.add(probe(`padding-left:var(--${k},0px)`));

  const out = { hs, h2s, offSizes: {}, titles: [], offSpace: {}, btn: {}, cardPads: {}, cols: {} };
  const skip = (el) => el.closest('[aria-hidden="true"], .sr-only, script, style, template, noscript, .mobile-menu, .theme-menu');
  const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = tw.nextNode())) {
    if (!n.nodeValue.trim()) continue;
    const el = n.parentElement;
    if (!el || skip(el) || !vis(el)) continue;
    const s = px(getComputedStyle(el).fontSize);
    if (!sizeSet.has(s)) { const k = s + ' ' + (el.className || el.tagName).toString().split(' ')[0]; out.offSizes[k] = (out.offSizes[k] || 0) + 1; }
  }
  if (h2s) {
    for (const t of document.querySelectorAll('main h3, main h4')) {
      if (skip(t) || !vis(t)) continue;
      const s = px(getComputedStyle(t).fontSize);
      if (s >= h2s) out.titles.push(`${t.tagName.toLowerCase()}.${t.className || '-'} ${s}`);
    }
  }
  for (const el of document.body.querySelectorAll('*')) {
    if (skip(el) || !vis(el)) continue;
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    const sides = ['Top', 'Right', 'Bottom', 'Left'].filter((d) => px(cs['border' + d + 'Width']) > 0 && cs['border' + d + 'Style'] !== 'none');
    const isBox = sides.length >= 3 && r.width >= 200 && r.height >= 60;
    const tag = (el.className || el.tagName).toString().split(' ')[0];
    if (isBox) {
      const p = px(cs.paddingLeft);
      if (p > 0) (out.cardPads[p] ||= []).push(tag);
    }
    if (r.width >= 120 && (isBox || cs.display === 'grid' || cs.display === 'flex')) {
      for (const prop of ['rowGap', 'columnGap', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft']) {
        if (cs[prop] === 'normal') continue;
        const v = px(cs[prop]);
        if (!spaceSet.has(v)) { const k = `${prop} ${v} ${tag}`; out.offSpace[k] = (out.offSpace[k] || 0) + 1; }
      }
    }
    // the section bands' grids only: a grid that is a child of a section or its wrap
    if (cs.display === 'grid' && el.closest('main') && el.parentElement && (el.parentElement.matches('section, .wrap') || el.parentElement.parentElement?.matches('section'))) {
      const cols = cs.gridTemplateColumns.split(' ').filter((c) => c !== 'none').length;
      const kids = [...el.children].filter(vis);
      if (cols >= 2 && kids.length >= cols) {
        const x = kids.slice(0, cols).map((k) => Math.round(k.getBoundingClientRect().left - r.left));
        (out.cols[cols] ||= []).push({ tag, x1: x[1] - px(cs.columnGap) });
      }
    }
  }
  for (const b of document.querySelectorAll('.btn')) {
    if (skip(b) || !vis(b)) continue;
    const cs = getComputedStyle(b);
    const k = `h${Math.round(b.getBoundingClientRect().height)} ${cs.fontSize} pad ${cs.paddingTop}/${cs.paddingLeft} r${cs.borderRadius}`;
    out.btn[k] = (out.btn[k] || 0) + 1;
  }
  return out;
};

/* the text boxes to repaint: a visible element with its own text, not hidden
   from the tree, a size and a place on the page; spread over the page, at most
   MAX per page. Each is returned with its colour, size and weight. */
const textBoxes = (MAX) => {
  const rows = [];
  const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const seen = new Set();
  let n;
  while ((n = tw.nextNode())) {
    const el = n.parentElement;
    if (!el || seen.has(el) || !n.nodeValue.trim() || n.nodeValue.trim().length < 3) continue;
    if (el.closest('[aria-hidden="true"], .sr-only, script, style, template, noscript, .mobile-menu, .theme-menu, svg, canvas, [hidden], details:not([open]) > :not(summary)')) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0 || cs.color.endsWith(', 0)')) continue;
    // the text's own box, not its element's (a card's padding is not text)
    const rg = document.createRange();
    rg.selectNodeContents(n);
    const r = rg.getBoundingClientRect();
    if (r.width < 24 || r.height < 8) continue;
    seen.add(el);
    el.setAttribute('data-dc', String(rows.length));
    rows.push({ i: rows.length, top: r.top + scrollY, h: r.height, color: cs.color, size: parseFloat(cs.fontSize), weight: +cs.fontWeight, label: (el.className || el.tagName).toString().split(' ')[0] + ': ' + n.nodeValue.trim().slice(0, 28) });
  }
  const step = Math.max(1, Math.floor(rows.length / MAX));
  return rows.filter((_, i) => i % step === 0).slice(0, MAX);
};

/* the :hover rules outside (hover: hover), read from every readable sheet */
const hoverRules = () => {
  const bad = [];
  const gated = (rule) => {
    for (let p = rule.parentRule; p; p = p.parentRule) if (p.media && /hover:\s*hover/.test(p.media.mediaText)) return true;
    return false;
  };
  const walk = (rules, sheet) => {
    for (const r of rules) {
      if (r.cssRules && !r.selectorText) walk(r.cssRules, sheet);
      else if (r.selectorText && /:hover/.test(r.selectorText) && !gated(r)) bad.push(r.selectorText.split(',').filter((s) => /:hover/.test(s))[0].trim().slice(0, 70));
      if (r.cssRules && r.selectorText) walk(r.cssRules, sheet);
    }
  };
  for (const sh of document.styleSheets) { try { walk(sh.cssRules, sh); } catch { /* cross-origin */ } }
  return [...new Set(bad)];
};

/* one visible link label, more than one destination */
const labelDestinations = () => {
  const m = new Map();
  for (const a of document.querySelectorAll('a[href]')) {
    if (a.closest('[aria-hidden="true"], .sr-only, template, [hidden], .mobile-menu')) continue;
    const r = a.getBoundingClientRect(), cs = getComputedStyle(a);
    if (!r.width || !r.height || cs.visibility === 'hidden' || cs.display === 'none') continue;
    const label = [...a.childNodes].filter((c) => !(c.nodeType === 1 && c.classList.contains('sr-only'))).map((c) => c.textContent).join('').replace(/\s+/g, ' ').trim().toLowerCase();
    if (label.length < 2 || /^[↗→←·•|]/.test(label)) continue;
    const u = new URL(a.href); u.search = '';
    const dest = u.href.replace(/\/$/, '');
    const card = a.closest('article');
    (m.get(label) || m.set(label, new Map()).get(label)).set(dest.replace(location.origin, ''), card);
  }
  // one label in a row of cards ("Voir le site" on each client's card) names its card by position; the same label twice in one place does not
  return [...m].filter(([, s]) => s.size > 1 && ![...s.values()].every((c, i, all) => c && all.indexOf(c) === i)).map(([l, s]) => [l, new Set(s.keys())]).map(([l, s]) => `"${l.slice(0, 30)}" → ${[...s].join(' | ')}`);
};

/* the share of the screen the fixed and sticky boxes hold, on a 24×24 grid */
const coverage = () => {
  const boxes = [];
  for (const el of document.body.querySelectorAll('*')) {
    const cs = getComputedStyle(el);
    if (cs.position !== 'fixed' && cs.position !== 'sticky') continue;
    if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0 || cs.pointerEvents === 'none') continue;
    const r = el.getBoundingClientRect();
    if (r.width < 8 || r.height < 8 || r.bottom <= 0 || r.top >= innerHeight) continue;
    // an element translated away (a hidden bar) reads as off screen above
    boxes.push(r);
  }
  let hit = 0;
  const N = 24;
  for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
    const x = (i + 0.5) * innerWidth / N, y = (j + 0.5) * innerHeight / N;
    if (boxes.some((r) => x >= r.left && x <= r.right && y >= r.top && y <= r.bottom)) hit++;
  }
  return hit / (N * N);
};

/* RTL: mono-role word space, and a "+" in front of a number in a right-to-left run */
const rtlMeasure = () => {
  const out = { spaces: [], plus: [] };
  const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = tw.nextNode())) {
    const el = n.parentElement;
    if (!el || el.closest('script, style, template, noscript, [aria-hidden="true"], .sr-only')) continue;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    const t = n.nodeValue;
    if (/mono/i.test(cs.fontFamily) && /[؀-ۿ]/.test(t)) {
      const at = t.search(/[؀-ۿ] [؀-ۿ]/);
      if (at >= 0) {
        const rg = document.createRange(); rg.setStart(n, at + 1); rg.setEnd(n, at + 2);
        const w = rg.getBoundingClientRect().width / parseFloat(cs.fontSize) + parseFloat(cs.wordSpacing || 0) / parseFloat(cs.fontSize);
        if (w > 0.3) out.spaces.push(`${(el.className || el.tagName).toString().split(' ')[0]} ${w.toFixed(2)}em`);
      }
    }
    // a "+" that leads a number, in an element whose direction is rtl and that does not isolate it
    if (cs.direction === 'rtl' && /(^|\s)\+\s?\d/.test(t) && !/isolate|embed|bidi-override/.test(cs.unicodeBidi) && !el.closest('[dir="ltr"]')) {
      const m = /(^|\s)(\+\s?\d[\d\s.,]*)/.exec(t);
      out.plus.push(`${(el.className || el.tagName).toString().split(' ')[0]} "${m[2].trim().slice(0, 14)}"`);
    }
  }
  return out;
};

/* WCAG contrast of two [r,g,b] */
const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
const rgbOf = (s) => (/rgba?\(([^)]+)\)/.exec(s) || [])[1]?.split(',').slice(0, 3).map(Number);

/* alpha connected components of a WebP (4-connected, alpha > 24, at least MIN px) */
async function components(file, MIN = 24) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  const on = (i) => data[i * 4 + 3] > 24;
  const seen = new Uint8Array(W * H);
  const comps = [];
  const stack = [];
  for (let s = 0; s < W * H; s++) {
    if (seen[s] || !on(s)) continue;
    let area = 0;
    stack.push(s); seen[s] = 1;
    while (stack.length) {
      const i = stack.pop(); area++;
      const x = i % W, y = (i / W) | 0;
      if (x > 0 && !seen[i - 1] && on(i - 1)) { seen[i - 1] = 1; stack.push(i - 1); }
      if (x < W - 1 && !seen[i + 1] && on(i + 1)) { seen[i + 1] = 1; stack.push(i + 1); }
      if (y > 0 && !seen[i - W] && on(i - W)) { seen[i - W] = 1; stack.push(i - W); }
      if (y < H - 1 && !seen[i + W] && on(i + W)) { seen[i + W] = 1; stack.push(i + W); }
    }
    if (area >= MIN) comps.push(area);
  }
  return comps;
}

const fails = [];
const above = [];
const srv = await serve(undefined, { fallback404: true });
const br = await launch();
console.log(`design-check (${STRICT ? 'strict' : 'report-only: DESIGN_REPORT=1'})`);

/* ---- type, space, button, cards, gutter, paint, labels, hover ---- */
const hoverSeen = new Set();
let paintBoxes = 0, paintBad = [];
for (const path of PAGES) {
  for (const [w, h] of VIEWS) {
    const ctx = await br.newContext({ viewport: { width: w, height: h }, reducedMotion: 'reduce' });
    const p = await ctx.newPage();
    await p.goto(srv.base + path, { waitUntil: 'networkidle' }).catch(() => {});
    await p.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 25)); } window.scrollTo(0, 0); });
    await p.waitForTimeout(300);
    const m = await p.evaluate(measure);
    const tag = `${path} @${w}`;
    const ceil = { ...TARGET, ...(CEIL[tag] || {}) };
    const bad = (msg) => fails.push(`${tag} ${msg}`);
    const note = (what, got, target) => { if (got > target) above.push(`${tag} ${what}: ${got}, target ${target}`); };
    const nOff = Object.keys(m.offSizes).length;
    const ratioH = m.hs && m.h2s ? +(m.hs / m.h2s).toFixed(2) : null;
    const nBtn = Object.keys(m.btn).length;
    const pads = Object.keys(m.cardPads);
    const nOffSpace = Object.keys(m.offSpace).length;
    const spread = w >= 1000 ? Math.max(0, ...Object.values(m.cols).map((list) => { const xs = list.map((l) => l.x1); return Math.max(...xs) - Math.min(...xs); })) : 0;
    console.log(`${tag.padEnd(22)} hero/h2 ${ratioH ?? '-'}  off-scale sizes ${nOff}  off-set spaces ${nOffSpace}  btn geometries ${nBtn}  card paddings ${pads.length} [${pads.join(',')}]  gutter spread ${spread}px`);
    if (nOff > ceil.type) bad(`type: ${Object.entries(m.offSizes).map(([k, v]) => `${k}×${v}`).slice(0, 8).join('; ')}`);
    note('type', nOff, TARGET.type);
    if (ratioH !== null && ratioH < (w >= 1000 ? 1.5 : 1.25)) bad(`hero: .hero-h ${m.hs}px ÷ h2.sec ${m.h2s}px = ${ratioH}`);
    if (m.titles.length > ceil.titles) bad(`titles at or above the section heading: ${m.titles.slice(0, 6).join('; ')}`);
    if (nOffSpace > ceil.space) bad(`space: ${nOffSpace} off-set (ceiling ${ceil.space}): ${Object.entries(m.offSpace).map(([k, v]) => `${k}×${v}`).slice(0, 8).join('; ')}`);
    note('space', nOffSpace, TARGET.space);
    if (nBtn > ceil.btn) bad(`button: ${nBtn} geometries (ceiling ${ceil.btn}): ${Object.keys(m.btn).join(' | ')}`);
    note('button geometries', nBtn, TARGET.btn);
    if (pads.length > ceil.cards) bad(`cards: ${pads.length} paddings (ceiling ${ceil.cards}): ${pads.map((k) => `${k}px (${[...new Set(m.cardPads[k])].slice(0, 3).join(',')})`).join('; ')}`);
    note('card paddings', pads.length, TARGET.cards);
    if (w >= 1000) {
      if (spread > ceil.gutter) bad(`gutter: column 2 of the section grids starts ${spread}px apart (ceiling ${ceil.gutter}px)`);
      note('gutter spread (px)', spread, TARGET.gutter);
    }
    // painted contrast, at the desktop size (the phone sheet repaints the same boxes)
    if (w >= 1000) {
      const rows = await p.evaluate(textBoxes, 50);
      for (const r of rows) {
        await p.evaluate((i) => window.scrollTo(0, Math.max(0, +document.querySelector(`[data-dc="${i}"]`).getBoundingClientRect().top + scrollY - innerHeight / 2)), r.i);
        await p.waitForTimeout(30);
        const box = await p.evaluate((i) => { const e = document.querySelector(`[data-dc="${i}"]`); const rg = document.createRange(); rg.selectNodeContents([...e.childNodes].find((c) => c.nodeType === 3 && c.nodeValue.trim().length > 2)); const b = rg.getBoundingClientRect(); const hit = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2); const seen = !!hit && (e === hit || e.contains(hit) || hit.contains(e)); e.__col = e.style.color; e.style.setProperty('color', 'transparent', 'important'); e.style.setProperty('text-shadow', 'none', 'important'); e.style.setProperty('-webkit-text-fill-color', 'transparent', 'important'); return { x: b.left, y: b.top, w: b.width, h: b.height, seen }; }, r.i);
        let ok = box.seen && box.w > 8 && box.h > 6 && box.y >= 0 && box.y + box.h <= h && box.x >= 0 && box.x + box.w <= w;
        let png;
        if (ok) png = await p.screenshot({ clip: { x: Math.floor(box.x), y: Math.floor(box.y), width: Math.ceil(box.w), height: Math.ceil(box.h) } }).catch(() => null);
        await p.evaluate((i) => { const e = document.querySelector(`[data-dc="${i}"]`); e.style.removeProperty('color'); e.style.removeProperty('text-shadow'); e.style.removeProperty('-webkit-text-fill-color'); if (e.__col) e.style.color = e.__col; }, r.i);
        if (!png) continue;
        const fg = rgbOf(r.color);
        if (!fg) continue;
        const { data, info } = await sharp(png).removeAlpha().raw().toBuffer({ resolveWithObject: true });
        const cs = [];
        for (let i = 0; i < info.width * info.height; i++) cs.push(ratio(fg, [data[i * 3], data[i * 3 + 1], data[i * 3 + 2]]));
        cs.sort((a, b) => a - b);
        const p20 = cs[Math.floor(cs.length * 0.2)];
        paintBoxes++;
        if (p20 < 3) paintBad.push(`${tag} ${r.label} painted ${p20.toFixed(1)}:1`);
      }
      await p.evaluate(() => window.scrollTo(0, 0));
      // labels
      const lab = await p.evaluate(labelDestinations);
      if (lab.length > LIMITS.labels) bad(`labels: ${lab.length} labels with two destinations (ceiling ${LIMITS.labels}): ${lab.slice(0, 4).join('; ')}`);
      else if (lab.length) lab.forEach((l) => above.push(`${tag} label with two destinations: ${l}`));
      // hover rules, once per stylesheet set
      for (const sel of await p.evaluate(hoverRules)) hoverSeen.add(sel);
    }
    await ctx.close();
  }
}
if (paintBad.length > LIMITS.paint) fails.push(`paint: ${paintBad.length} text boxes read under 3:1 as painted (ceiling ${LIMITS.paint}): ${paintBad.slice(0, 5).join('; ')}`);
else paintBad.forEach((m) => above.push('paint ' + m));
console.log(`paint: ${paintBoxes} text boxes repainted without their glyphs, ${paintBad.length} under 3:1`);
if (hoverSeen.size > LIMITS.hover) fails.push(`hover: ${hoverSeen.size} :hover selectors outside @media (hover: hover) (ceiling ${LIMITS.hover}): ${[...hoverSeen].slice(0, 6).join('; ')}`);
else [...hoverSeen].forEach((s) => above.push(`hover rule outside (hover: hover): ${s}`));
console.log(`hover: ${hoverSeen.size} :hover selectors outside @media (hover: hover)`);

/* ---- the fixed + sticky cover on a phone, at scroll stops through each page ---- */
{
  for (const [w, h] of [[390, 844], [360, 780], [844, 390], [640, 400]]) {
    let worst = 0, where = '';
    for (const path of ['/', '/tarifs/']) {
      const ctx = await br.newContext({ viewport: { width: w, height: h }, reducedMotion: 'reduce', hasTouch: true, isMobile: w < 700 });
      const p = await ctx.newPage();
      await p.goto(srv.base + path, { waitUntil: 'networkidle' }).catch(() => {});
      const total = await p.evaluate(() => document.documentElement.scrollHeight);
      const stops = [];
      for (let y = 0; y < total; y += Math.round(h * 0.6)) stops.push(y);
      for (const sel of ['#pricing', '#estimator', '#estimate', '#est']) stops.push(await p.evaluate((s) => { const e = document.querySelector(s); return e ? e.getBoundingClientRect().top + scrollY : -1; }, sel));
      for (const y of stops.filter((y) => y >= 0)) {
        await p.evaluate((y) => window.scrollTo(0, y), y);
        await p.waitForTimeout(80);
        const c = await p.evaluate(coverage);
        if (c > worst) { worst = c; where = `${path} y${Math.round(y)}`; }
      }
      await ctx.close();
    }
    const key = `${w}x${h}`;
    console.log(`cover ${key}: ${(worst * 100).toFixed(0)}% (${where})`);
    if (worst > COVER_CEIL[key] + 0.005) fails.push(`cover: the fixed + sticky chrome covers ${(worst * 100).toFixed(0)}% of ${key} at ${where} (ceiling ${(COVER_CEIL[key] * 100).toFixed(0)}%)`);
    else if (worst > LIMITS.cover + 0.005) above.push(`cover ${key}: ${(worst * 100).toFixed(0)}% at ${where}, target ${(LIMITS.cover * 100).toFixed(0)}%`);
  }
}

/* ---- Arabic: mono word spaces, system faces, a leading "+" ---- */
{
  for (const path of ['/ar/', '/ar/tarifs/', '/404.html?lang=ar']) {
    const ctx = await br.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    const p = await ctx.newPage();
    await p.goto(srv.base + path, { waitUntil: 'networkidle' }).catch(() => {});
    await p.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 25)); } window.scrollTo(0, 0); });
    await p.waitForTimeout(300);
    const r = await p.evaluate(rtlMeasure);
    // system faces, by the browser itself: the faces each text-bearing element is painted in
    const cdp = await ctx.newCDPSession(p);
    await cdp.send('DOM.enable'); await cdp.send('CSS.enable');
    const { root } = await cdp.send('DOM.getDocument', { depth: -1 });
    const { nodeIds } = await cdp.send('DOM.querySelectorAll', { nodeId: root.nodeId, selector: 'body *' });
    const sys = new Map();
    for (const nodeId of nodeIds) {
      try {
        const { fonts } = await cdp.send('CSS.getPlatformFontsForNode', { nodeId });
        for (const f of fonts) if (!f.isCustomFont) sys.set(f.familyName, (sys.get(f.familyName) || 0) + f.glyphCount);
      } catch { /* a node that is gone */ }
    }
    const nSys = [...sys.values()].reduce((a, b) => a + b, 0);
    console.log(`rtl ${path.padEnd(18)} mono word spaces over 0.3em ${r.spaces.length}  system-face glyphs ${nSys}${sys.size ? ' (' + [...sys].map(([k, v]) => `${k} ${v}`).join(', ') + ')' : ''}  leading "+" ${r.plus.length}`);
    if (r.spaces.length) fails.push(`rtl ${path}: mono word space over 0.3em: ${r.spaces.slice(0, 4).join('; ')}`);
    if (nSys > (RTL_SYS[path] || 0)) fails.push(`rtl ${path}: ${nSys} glyphs in a system face (ceiling ${RTL_SYS[path] || 0}): ${[...sys].map(([k, v]) => `${k} ${v}`).join(', ')}`);
    else if (nSys) above.push(`rtl ${path}: ${nSys} glyphs in a system face (${[...sys.keys()].join(', ')}), target 0`);
    if (r.plus.length) fails.push(`rtl ${path}: a "+" leads a number in a right-to-left run (it renders after it): ${r.plus.slice(0, 4).join('; ')}`);
    await ctx.close();
  }
}

/* ---- the hub's art: no debris beside the figure ---- */
{
  const dir = join(ROOT, 'hub/bible/art');
  const motion = /^(?:kuro-|rig-k-|motion-)/;   // the Kūro marks (stars, steam, z's) are parts by design
  const bad = [], held = [];
  let n = 0;
  for (const f of readdirSync(dir).filter((f) => /\.webp$/.test(f))) {
    const c = await components(join(dir, f));
    n++;
    if (c.length > 1 && !motion.test(f)) {
      if (c.length > (ART_PARTS.get(f) || 1)) bad.push(`${f} (${c.length} parts: ${c.slice(0, 4).join(', ')} px)`);
      else held.push(`art ${f}: ${c.length} alpha parts (${c.slice(1, 4).join(', ')} px beside the figure), target 1`);
    }
  }
  console.log(`art: ${n} hub/bible/art files, ${bad.length} with more than one alpha component`);
  held.forEach((h) => above.push(h));
  if (bad.length) fails.push(`art: more than one alpha connected component (sprite debris): ${bad.join('; ')}`);
}

await br.close();
srv.close();
console.log(`\n${fails.length ? 'FAIL' : 'clean'}: ${fails.length}`);
for (const f of fails) console.log('  ✗ ' + f);
console.log(`above target, held at ${CEIL_DATE} (a ratchet: it may fall, never rise): ${above.length}`);
for (const a of above) console.log('  · ' + a);
process.exit(STRICT && fails.length ? 1 : 0);
