#!/usr/bin/env node
/**
 * The Studio on a phone and a tablet — `node scripts/check-hub-mobile.mjs`
 * (CHROMIUM_PATH as the other browser gates). The mobile pass of 2026-11-14
 * (hub/style.css "phones and tablets", hub/app.js 10-12) broke three things
 * that no other gate looks at; this holds them:
 *
 *   overflow   at 280, 320, 360, 390 and 430 px, in French, English and
 *              Arabic, the page is not wider than the screen (the estimator's
 *              handwritten line made it 315px wide at 280)
 *   tiles      on a phone no case tile is wider than its track, and the
 *              track's arrows move it to the next tile's edge, one tile
 *              each (they moved it by 0.8 of a width, to mid-tile)
 *   rig        the bubble Yasser speaks in lies inside the screen
 *   menu       under 1160px the Menu button opens a sheet that holds the six
 *              sections (and, since 2026-11-19, la fabrique as a seventh line,
 *              not counted), and closes with Escape
 *   viewer     on a phone the viewer holds the picture, previous and next
 *              under it (not over it), and a swipe moves one picture (run on
 *              the world's page, hub/monde.html, where the diary is)
 *   fabrique   la fabrique (hub/fabrique.html) is held to the overflow rule
 *              too, at the same widths and in the same languages
 * Touch is driven with real touch events (CDP): synthesized scroll gestures
 * do nothing in the headless build.
 */
import { launch, serve } from './lib/serve.mjs';
import { devices } from 'playwright';

const srv = await serve(undefined, { compress: true });
const browser = await launch();
const bad = [];
const note = (m) => bad.push(m);
let nOk = 0;

for (const lang of ['fr', 'en', 'ar']) {
  for (const w of [280, 320, 360, 390, 430]) {
    const ctx = await browser.newContext({ ...devices['iPhone 13'], viewport: { width: w, height: 760 }, screen: { width: w, height: 760 }, hasTouch: true, isMobile: true });
    await ctx.addInitScript(() => { try { sessionStorage.setItem('numidea-sting', '1'); } catch (e) {} });
    const p = await ctx.newPage();
    await p.goto(`${srv.base}/hub/${lang === 'fr' ? '' : '?lang=' + lang}`, { waitUntil: 'load' });
    await p.waitForTimeout(600);
    await p.evaluate(async () => { document.documentElement.style.scrollBehavior = 'auto'; for (let y = 0; y < document.documentElement.scrollHeight; y += 600) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); } scrollTo(0, 0); });
    const m = await p.evaluate(() => {
      const wide = [];
      document.querySelectorAll('.st-case__track').forEach((t) => [...t.children].forEach((k) => { const r = k.getBoundingClientRect(); if (r.width > t.clientWidth - 8) wide.push(`${t.closest('.st-case').id} ${k.className.split(' ').slice(0, 2).join('.')} ${Math.round(r.width)}>${t.clientWidth}`); }));
      return { sw: document.documentElement.scrollWidth, iw: innerWidth, wide };
    });
    if (m.sw > m.iw) note(`${lang} ${w}: the page is ${m.sw}px wide on a ${m.iw}px screen`);
    if (m.wide.length) note(`${lang} ${w}: a case tile as wide as its track or wider: ${m.wide.slice(0, 3).join(', ')}`);
    nOk++;
    // la fabrique (hub/fabrique.html, 2026-11-19): the same rule, every breakdown open (the widest state)
    {
      const q = await ctx.newPage();
      await q.goto(`${srv.base}/hub/fabrique.html${lang === 'fr' ? '' : '?lang=' + lang}`, { waitUntil: 'load' }); await q.waitForTimeout(400);
      const f = await q.evaluate(async () => { document.documentElement.style.scrollBehavior = 'auto'; document.querySelectorAll('details').forEach((d) => { d.open = true; }); for (let y = 0; y < document.documentElement.scrollHeight; y += 700) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 30)); } return { sw: document.documentElement.scrollWidth, iw: innerWidth }; });
      if (f.sw > f.iw) note(`${lang} ${w}: la fabrique is ${f.sw}px wide on a ${f.iw}px screen`);
      await q.close(); nOk++;
    }
    if (w === 390) {
      // the rig's bubble
      await p.locator('.st-rig__y').tap(); await p.waitForTimeout(2200);
      const b = await p.evaluate(() => { const r = document.querySelector('.st-bubble').getBoundingClientRect(); return { l: r.left, r: r.right, on: document.querySelector('.st-bubble').classList.contains('on') }; });
      if (b.on && (b.l < 0 || b.r > 390)) note(`${lang} 390: the rig's bubble is at ${Math.round(b.l)}..${Math.round(b.r)}, off the screen`);
      // the arrows step by one tile
      const step = await p.evaluate(async () => {
        document.documentElement.style.scrollBehavior = 'auto';
        const t = document.getElementById('cb-track'); t.closest('.st-case').scrollIntoView(); t.scrollLeft = 0;
        const edges = () => { const tr = t.getBoundingClientRect(); return [...new Set([...t.children].map((k) => Math.round(k.getBoundingClientRect().left - tr.left + t.scrollLeft - 16)))].sort((a, b) => a - b); };
        const xs = edges(), seen = [];
        for (let i = 0; i < 3; i++) { document.querySelector('[data-track-next][aria-controls="cb-track"]').click(); await new Promise((r) => setTimeout(r, 900)); seen.push(Math.round(t.scrollLeft)); }
        return { xs, seen };
      });
      if (step.seen.some((x) => !step.xs.some((e) => Math.abs(e - x) <= 2))) note(`${lang} 390: the Bordj arrows stopped at ${step.seen.join(', ')}, not on tile edges ${step.xs.slice(0, 6).join(', ')}`);
      // the menu
      await p.evaluate(() => scrollTo(0, 0));
      await p.locator('[data-menu-open]').tap(); await p.waitForTimeout(300);
      const mn = await p.evaluate(() => ({ open: document.getElementById('menu').open, links: document.querySelectorAll('#menu .st-menu__nav a:not(.st-menu__world):not([href^="fabrique.html"])').length }));
      if (!mn.open || mn.links !== 6) note(`${lang} 390: the Menu button does not open the six sections (${JSON.stringify(mn)})`);
      await p.keyboard.press('Escape'); await p.waitForTimeout(200);
      if (await p.evaluate(() => document.getElementById('menu').open)) note(`${lang} 390: Escape does not close the menu`);
      // the viewer, on the world's page since 2026-11-18 (the diary went there with the Lab; same viewer, same script)
      await p.goto(`${srv.base}/hub/monde.html${lang === 'fr' ? '' : '?lang=' + lang}`, { waitUntil: 'load' }); await p.waitForTimeout(500);
      await p.evaluate(() => document.querySelector('.st-diary [data-zoom]').scrollIntoView({ block: 'center' })); await p.waitForTimeout(400);
      await p.locator('.st-diary [data-zoom]').first().tap(); await p.waitForTimeout(700);
      const g = await p.evaluate(() => { const q = (s) => document.querySelector(s).getBoundingClientRect(); const i = q('#lightbox > img'); return { imgBottom: i.bottom, prevTop: q('.st-lb__nav--prev').top, nextTop: q('.st-lb__nav--next').top, xBottom: q('.st-lb__x').bottom, imgTop: i.top, src: document.querySelector('#lightbox > img').getAttribute('src') }; });
      if (g.prevTop < g.imgBottom - 1 || g.nextTop < g.imgBottom - 1 || g.xBottom > g.imgTop + 1) note(`${lang} 390: the viewer's controls lie over the picture`);
      const cdp = await ctx.newCDPSession(p);
      const touch = async (pts) => { await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: pts[0][0], y: pts[0][1] }] }); for (const q of pts.slice(1)) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: q[0], y: q[1] }] }); await p.waitForTimeout(16); } await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await p.waitForTimeout(500); };
      await touch(Array.from({ length: 16 }, (_, i) => [300 - i * 13, 320]));
      const src2 = await p.evaluate(() => document.querySelector('#lightbox > img').getAttribute('src'));
      if (src2 === g.src) note(`${lang} 390: a swipe does not move the viewer on`);
      await touch(Array.from({ length: 16 }, (_, i) => [200, 250 + i * 14]));
      if (await p.evaluate(() => document.getElementById('lightbox').open)) note(`${lang} 390: a swipe down does not close the viewer`);
    }
    await ctx.close();
  }
}
await browser.close(); srv.close();
if (bad.length) { console.error('✗ hub mobile:\n  ' + bad.join('\n  ')); process.exit(1); }
console.log(`✓ hub mobile: ${nOk} width × language runs without overflow or a tile wider than its track; at 390 the bubble, the arrows, the menu and the viewer hold, in three languages`);
