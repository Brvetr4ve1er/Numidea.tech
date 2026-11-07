#!/usr/bin/env node
/**
 * Design-intent gate — `npm run design`. vbugs only floors type at 12px; this
 * asks whether the page holds the system it claims: one type scale with a top,
 * one space set, one button, few card paddings, one grid gutter.
 *
 *   type      every painted text size is a token (--t-*), the hero heading or
 *             the section heading
 *   hero      .hero-h ÷ h2.sec at least 1.5 at 1440 and 1.25 at 390
 *   titles    no h3/h4 at or above the section heading
 *   space     gaps and paddings of boxes are on the space set (--s-*, card pads)
 *   button    one .btn geometry per page (the mobile menu's own row excepted)
 *   cards     at most two card paddings per page
 *   gutter    at 1440 the columns of grids with the same count start at the
 *             same x, within 1px, across bands
 *
 * REPORT-ONLY for now: prints the figures and the would-fail list, exits 0.
 * DESIGN_STRICT=1 npm run design exits 1 on any would-fail. Pages: the main
 * site (home in three languages, the price guide, the product page); not hub/.
 */
import { serve, launch } from './lib/serve.mjs';

const PAGES = ['/', '/en/', '/ar/', '/tarifs/'];
const VIEWS = [[1440, 900], [390, 844]];
const STRICT = process.env.DESIGN_STRICT === '1';

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
    if (cs.display === 'grid' && el.closest('main')) {
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

const srv = await serve(undefined, { fallback404: true });
const br = await launch();
const fails = [];
console.log('design-check (report-only unless DESIGN_STRICT=1)');
for (const path of PAGES) {
  for (const [w, h] of VIEWS) {
    const ctx = await br.newContext({ viewport: { width: w, height: h }, reducedMotion: 'reduce' });
    const p = await ctx.newPage();
    await p.goto(srv.base + path, { waitUntil: 'networkidle' }).catch(() => {});
    await p.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 25)); } window.scrollTo(0, 0); });
    await p.waitForTimeout(300);
    const m = await p.evaluate(measure);
    await ctx.close();
    const tag = `${path} @${w}`;
    const bad = (msg) => fails.push(`${tag} ${msg}`);
    const nOff = Object.keys(m.offSizes).length;
    const ratio = m.hs && m.h2s ? +(m.hs / m.h2s).toFixed(2) : null;
    const nBtn = Object.keys(m.btn).length;
    const pads = Object.keys(m.cardPads);
    const nOffSpace = Object.keys(m.offSpace).length;
    console.log(`${tag.padEnd(22)} hero/h2 ${ratio ?? '-'}  off-scale sizes ${nOff}  off-set spaces ${nOffSpace}  btn geometries ${nBtn}  card paddings ${pads.length} [${pads.join(',')}]`);
    if (nOff) bad(`type: ${Object.entries(m.offSizes).map(([k, v]) => `${k}×${v}`).slice(0, 8).join('; ')}${nOff > 8 ? ' …' : ''}`);
    if (ratio !== null && ratio < (w >= 1000 ? 1.5 : 1.25)) bad(`hero: .hero-h ${m.hs}px ÷ h2.sec ${m.h2s}px = ${ratio}`);
    if (m.titles.length) bad(`titles at or above the section heading: ${m.titles.slice(0, 6).join('; ')}`);
    if (nOffSpace) bad(`space: ${Object.entries(m.offSpace).map(([k, v]) => `${k}×${v}`).slice(0, 8).join('; ')}${nOffSpace > 8 ? ' …' : ''}`);
    if (nBtn > 1) bad(`button: ${nBtn} geometries: ${Object.keys(m.btn).join(' | ')}`);
    if (pads.length > 2) bad(`cards: ${pads.length} paddings: ${pads.map((k) => `${k}px (${[...new Set(m.cardPads[k])].slice(0, 3).join(',')})`).join('; ')}`);
    if (w >= 1000) for (const [c, list] of Object.entries(m.cols)) {
      const xs = list.map((l) => l.x1);
      if (Math.max(...xs) - Math.min(...xs) > 1) bad(`gutter: ${c}-column grids start column 2 at ${[...new Set(xs)].join('/')}px`);
    }
  }
}
await br.close();
srv.close();
console.log(`\n${fails.length ? 'would fail' : 'clean'}: ${fails.length}`);
for (const f of fails) console.log('  ✗ ' + f);
process.exit(STRICT && fails.length ? 1 : 0);
