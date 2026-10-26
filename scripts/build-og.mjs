#!/usr/bin/env node
/**
 * The link-preview card — `node scripts/build-og.mjs` → assets/og.jpg
 *
 * Scrapers (WhatsApp, LinkedIn, Facebook, X) read og:image without running
 * scripts, so one static card serves every language. It is French, the
 * language the page is written in and the first foreign market. It is drawn
 * with the site's own Arcanum tokens (themes.css) and self-hosted faces
 * (fonts.css), so it cannot drift from the brand. Its image is one of the
 * site's own engravings (Plate II, the Arch of Trajan at Timgad), drawn in
 * the theme's ink the way the page draws it. It used to be a capture of a
 * client's site, captioned "site livré". The owner replaced that on
 * 2026-10-26: no client has yet given written permission to appear in
 * marketing, and a share card is marketing. Re-run after a theme or copy
 * change.
 */
import { join } from 'node:path';
import { serve, launch } from './lib/serve.mjs';
import { ROOT } from './site.mjs';

const CARD = {
  kicker: "L'Aperçu · offre signature",
  // the offer as it is: one page (the homepage), its terms named
  title: "Voyez votre page d'accueil avant de payer.",
  sub: 'Gratuit et sans engagement · entreprises immatriculées · 4 par mois au maximum.',
  foot: 'Studio web · Bordj Bou Arréridj · FR · EN · ',
  plate: 'assets/illus/arch.webp',     // 1000x558
  plateCap: 'Pl.\u00a0II — Arc de Trajan · Timgad',   // the site's own caption (app.js pl.arch)
};

const html = (base) => `<!doctype html><html lang="fr" data-theme="arcanum"><head><meta charset="utf-8">
<base href="${base}/">
<link rel="stylesheet" href="assets/fonts.css"><link rel="stylesheet" href="assets/themes.css">
<style>
:root{--font-display:"Geist","Geist Fallback",system-ui,sans-serif;--font-swash:var(--font-display);
  --font-mono:"Geist Mono","Geist Mono Fallback",ui-monospace,monospace;--font-deco:"Cinzel","Cinzel Fallback",Georgia,serif;
  --font-deco-dec:"Cinzel Decorative","Cinzel Decorative Fallback",Georgia,serif;--font-ar:"IBM Plex Sans Arabic",sans-serif}
*{box-sizing:border-box;margin:0}
html,body{width:1200px;height:630px;overflow:hidden}
body{position:relative;background:var(--atmos),var(--grad-noir);color:var(--ice);font-family:var(--font-display);
  display:grid;grid-template-columns:600px 1fr;gap:40px;padding:64px 64px 56px 72px}
body::before{content:"";position:absolute;inset:0;pointer-events:none;opacity:var(--grid-opacity);
  background-image:linear-gradient(var(--grid-color) 1px,transparent 1px),linear-gradient(90deg,var(--grid-color) 1px,transparent 1px);
  background-size:var(--grid-size) var(--grid-size)}
.l{position:relative;display:flex;flex-direction:column}
.logo{font-family:var(--font-logo);font-weight:var(--logo-weight);letter-spacing:var(--logo-tracking);font-size:30px}
.logo i{font-style:normal;color:var(--teal-text)}
.kick{margin-top:56px;font-family:var(--font-mono);font-size:17px;letter-spacing:.18em;text-transform:uppercase;color:var(--crimson-text)}
h1{margin-top:18px;font-family:var(--font-head);font-weight:var(--head-weight);font-size:56px;line-height:1.08;letter-spacing:var(--head-tracking)}
p{margin-top:22px;font-size:24px;line-height:1.45;color:var(--body-strong);max-width:30em}
.foot{margin-top:auto;font-family:var(--font-mono);font-size:16px;letter-spacing:.14em;text-transform:uppercase;color:var(--teal-text)}
.foot b{font-family:var(--font-ar);font-weight:600;letter-spacing:0}
.r{position:relative;align-self:center}
/* the plate, as the page draws its engravings: the image is a mask, the ink is the theme's */
.plate{position:relative;aspect-ratio:1000/558;border:1px solid var(--hairline-2);border-radius:4px;padding:18px}
.plate i{position:absolute;inset:18px;background:var(--teal-text);opacity:.62;
  -webkit-mask:url(${CARD.plate}) center/100% 100% no-repeat;mask:url(${CARD.plate}) center/100% 100% no-repeat;
  -webkit-mask-source-type:luminance;mask-mode:luminance}   /* a luminance mask, as styles.css draws every plate */
.plate b{position:absolute;width:14px;height:14px;border-color:var(--crimson-text);border-style:solid;border-width:0}
.plate .tl{top:-1px;left:-1px;border-top-width:2px;border-left-width:2px}.plate .tr{top:-1px;right:-1px;border-top-width:2px;border-right-width:2px}
.plate .bl{bottom:-1px;left:-1px;border-bottom-width:2px;border-left-width:2px}.plate .br{bottom:-1px;right:-1px;border-bottom-width:2px;border-right-width:2px}
.cap{margin-top:12px;font-family:var(--font-mono);font-size:14px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}
</style></head><body>
<div class="l">
  <div class="logo">Num<i>idea</i> Labs</div>
  <div class="kick">${CARD.kicker}</div>
  <h1>${CARD.title}</h1>
  <p>${CARD.sub}</p>
  <div class="foot">${CARD.foot}<b lang="ar">ع</b></div>
</div>
<div class="r">
  <div class="plate"><i></i><b class="tl"></b><b class="tr"></b><b class="bl"></b><b class="br"></b></div>
  <div class="cap">${CARD.plateCap}</div>
</div>
</body></html>`;

const { base, close } = await serve();
const b = await launch();
try {
  const p = await (await b.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })).newPage();
  // be on the server's origin first: from about:blank every font request is
  // cross-origin, and font loads are CORS requests the static server refuses
  await p.goto(base + '/404.html');
  await p.setContent(html(base), { waitUntil: 'networkidle' });
  // swap faces only start loading when text needs them, and fonts.ready can
  // resolve before that: ask for each face by name, and refuse a fallback
  const FACES = ['700 30px Cinzel', '400 24px Geist', '400 16px "Geist Mono"', '600 16px "IBM Plex Sans Arabic"'];
  const absent = await p.evaluate(async (faces) => {
    await Promise.all(faces.map((f) => document.fonts.load(f, f.includes('Arabic') ? 'ع' : 'Aé')));
    await document.fonts.ready;
    return faces.filter((f) => !document.fonts.check(f, f.includes('Arabic') ? 'ع' : 'Aé'));
  }, FACES);
  if (absent.length) throw new Error('og card: faces did not load: ' + absent.join(', '));
  // the engraving is a CSS mask, not an <img>: load it the same way and refuse a card without it
  const plateOk = await p.evaluate(async (src) => { const i = new Image(); i.src = src; try { await i.decode(); return i.naturalWidth > 0; } catch { return false; } }, CARD.plate);
  if (!plateOk) throw new Error('og card: the plate did not load');
  await p.waitForTimeout(300);
  // JPEG: a photographic card as PNG is ~530 KB, and some messengers drop
  // previews over ~300 KB
  await p.screenshot({ path: join(ROOT, 'assets/og.jpg'), type: 'jpeg', quality: 86 });
  console.log('✓ assets/og.jpg (1200×630)');
} finally { await b.close(); close(); }
