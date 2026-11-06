#!/usr/bin/env node
/**
 * The link-preview cards — `node scripts/build-og.mjs` → assets/og.jpg,
 * og-en.jpg, og-ar.jpg, scene/og.jpg, hub/og.jpg, workspacehq/og.jpg (one
 * card: `node scripts/build-og.mjs ar`, `… hub`)
 *
 * Scrapers (WhatsApp, LinkedIn, Facebook, X) read og:image without running
 * scripts, so each page names its own static card: the language pages theirs
 * (index.html the French one, en/ and ar/ theirs: scripts/build-lang.mjs),
 * scene/, hub/ and workspacehq/ each its own. The home cards are drawn with
 * the site's own Arcanum tokens (themes.css) and self-hosted faces
 * (fonts.css), so they cannot drift from the brand; the Arabic one is set
 * right to left in the page's Plex Arabic faces, the logo staying in Latin
 * script as it does on the page. Their image is one of the site's own
 * engravings (Plate II, the Arch of Trajan at Timgad), drawn in the theme's
 * ink the way the page draws it. It used to be a capture of a client's
 * site, captioned "site livré". The owner replaced that on 2026-10-26: no
 * client has yet given written permission to appear in marketing, and a
 * share card is marketing. The scene card keeps that rule: a drafting sheet
 * in the page's own look, the frame empty, the sheets counted from
 * scene-data. The hub card is the character bible's cover: its paper, Archivo
 * and the marker hand, the 夜 seal and the cover's drawing of the two;
 * the WorkspaceHQ card its arcade palette, Press Start 2P and VT323, the
 * product's name and the whole headline (its first screen, captured, cut
 * the headline and showed no product). Each card is 1200×630, a JPEG
 * (check.mjs block 17 holds every og.jpg to 300 kB, and some messengers
 * drop previews over that). Re-run after a theme or copy change.
 */
import { join } from 'node:path';
import { serve, launch } from './lib/serve.mjs';
import { ROOT } from './site.mjs';
import { WORDMARK } from './lib/wordmark.mjs';
import { PROJECTS, UI } from './scene-data.mjs';

const PLATE = 'assets/illus/arch.webp';     // 1000x558
// the hub's cover drawing: Yasser on the floor with his coffee, Kūro beside
// him (the cover's picture and 04b's duo, scripts/build-hub-rig.mjs)
const DUO = 'hub/art/actor-duo-a.webp';
// Bit, WorkspaceHQ's sidekick, as the hub's cartridge drew him until 56f29c1: a 12×9 pixel sprite
const BIT = '<svg viewBox="0 0 12 9" shape-rendering="crispEdges" aria-hidden="true"><rect x="3" y="0" width="6" height="1" fill="#d97757"/><rect x="2" y="1" width="1" height="1" fill="#d97757"/><rect x="3" y="1" width="1" height="1" fill="#f2a27e"/><rect x="4" y="1" width="6" height="1" fill="#d97757"/><rect x="1" y="2" width="1" height="1" fill="#d97757"/><rect x="2" y="2" width="1" height="1" fill="#f2a27e"/><rect x="3" y="2" width="8" height="1" fill="#d97757"/><rect x="1" y="3" width="10" height="1" fill="#d97757"/><rect x="1" y="4" width="10" height="1" fill="#d97757"/><rect x="0" y="5" width="12" height="1" fill="#d97757"/><rect x="1" y="6" width="10" height="1" fill="#d97757"/><rect x="1" y="7" width="10" height="1" fill="#a5543a"/><rect x="2" y="8" width="1" height="1" fill="#a5543a"/><rect x="4" y="8" width="1" height="1" fill="#a5543a"/><rect x="7" y="8" width="1" height="1" fill="#a5543a"/><rect x="9" y="8" width="1" height="1" fill="#a5543a"/><rect x="3" y="3" width="1" height="1" fill="#1b1430"/><rect x="8" y="3" width="1" height="1" fill="#1b1430"/><rect x="3" y="4" width="1" height="1" fill="#1b1430"/><rect x="8" y="4" width="1" height="1" fill="#1b1430"/></svg>';

const pad = (n) => String(n).padStart(2, '0');
const nLive = PROJECTS.filter((p) => p.status === 'live').length;

// Each card: its template (below), its copy, the faces it must have loaded
// before the capture (a swap face only starts loading when text needs it,
// and fonts.ready can resolve before that: each is asked for by name, and a
// fallback refused) and the pictures it draws (a CSS mask or an <img>:
// loaded the same way, and a card without them refused).
// The home cards' offer as it is: one page (the homepage), its terms named;
// the Arabic copy follows the page's dictionary (assets/i18n/ar.js: prev.*,
// tb.*, pl.arch). The Latin cards set one Arabic glyph (the foot's ع); the
// Arabic card sets its title and lines in Plex Arabic 600 and 400.
const LATIN = ['700 30px Cinzel', '400 24px Geist', '400 16px "Geist Mono"', '600 16px "IBM Plex Sans Arabic"'];
const CARDS = {
  fr: {
    kind: 'home', out: 'assets/og.jpg', faces: LATIN, assets: [PLATE],
    kicker: "L'Aperçu · offre signature",
    title: "Voyez votre page d'accueil avant de payer.",
    sub: 'Gratuit et sans engagement · entreprises immatriculées · 4 par mois au maximum.',
    foot: 'Studio web · Bordj Bou Arréridj · FR · EN · <b lang="ar">ع</b>',
    plateCap: 'Pl. II — Arc de Trajan · Timgad',   // the site's own caption (pl.arch)
  },
  en: {
    kind: 'home', out: 'assets/og-en.jpg', faces: LATIN, assets: [PLATE],
    kicker: 'The Preview · signature offer',
    title: 'See your new homepage before you pay.',
    sub: 'Free, no obligation · registered businesses · at most 4 a month.',
    foot: 'Web studio · Bordj Bou Arréridj · EN · FR · <b lang="ar">ع</b>',
    plateCap: 'Pl. II — Arch of Trajan · Timgad',
  },
  ar: {
    kind: 'home', out: 'assets/og-ar.jpg', assets: [PLATE],
    faces: ['700 30px Cinzel', '400 24px Geist', '400 16px "Geist Mono"', '600 52px "IBM Plex Sans Arabic"', '400 24px "IBM Plex Sans Arabic"'],
    kicker: 'المعاينة · عرضنا المميّز',
    title: 'شاهد الصفحة الرئيسية لموقعك الجديد قبل أن تدفع.',
    sub: 'مجّاناً ودون التزام · للشركات المسجّلة · 4 في الشهر كحدّ أقصى.',
    foot: 'استوديو ويب · برج بوعريريج · العربية · الفرنسية · الإنجليزية',
    plateCap: 'لوحة 2 — قوس تراجان · تيمقاد',
  },
  // the sheets' page, in French (its og:title is UI.fr.title); the copy is
  // the page's own kicker, heading and description (scripts/scene-data.mjs)
  scene: {
    kind: 'scene', out: 'scene/og.jpg', assets: [],
    faces: ['700 30px Cinzel', '400 24px Geist', '400 16px "Geist Mono"'],
    crumb: UI.fr.crumb, kicker: UI.fr.kicker, title: UI.fr.h1, sub: UI.fr.desc,
    foot: `${pad(PROJECTS.length)} planches · ${nLive} sites livrés · FR · EN · AR`,
  },
  // the founder's page, his character bible: the cover as hub/index.html
  // sets it (the chip, the name, the seal, the marker line) and its
  // og:description as the line beside the seal, on its paper; the copy stays
  // inside the left column (inColumn), the drawing has the right
  hub: {
    kind: 'hub', out: 'hub/og.jpg', assets: [DUO], inColumn: true,
    faces: ['900 30px Archivo', '400 24px "Permanent Marker"', '900 34px "Noto Sans JP"', '400 24px Geist', '500 16px "Geist Mono"'],
    chip: 'Character bible', handle: 'br4vetr4veler', name: 'Yasser', seal: '夜',
    tag: "The builder who answers at 2 a.m. — and the black cat who decides if it's good enough.",
    marker: 'tired eyes · big ideas · same energy.', foot: 'Artist · Designer · Developer',
  },
  // the product's page: its name and its whole headline, in its arcade faces
  // quality 80, not 86: the aurora costs bytes, and check.mjs block 17 holds
  // workspacehq/'s own files to 64 kB
  workspacehq: {
    kind: 'workspacehq', out: 'workspacehq/og.jpg', assets: [], quality: 80,
    faces: ['400 20px "Press Start 2P"', '400 120px VT323'],
    kicker: 'Personal ops console · v3', coin: '[ insert coin ]',
    title: 'Your codebase,<br>now <em>playable.</em>', sub: 'An arcade cabinet for your codebase',
    foot: 'The code is public on GitHub · by br4vetr4veler · Numidea Labs',
  },
};

/* the home card: the Arcanum page, the offer on the left, the engraving on the right */
const home = (base, lang, card) => `<!doctype html><html lang="${lang}" dir="${lang === 'ar' ? 'rtl' : 'ltr'}" data-theme="arcanum"><head><meta charset="utf-8">
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
/* the wordmark, as the pages draw it (scripts/lib/wordmark.mjs): 22px of cap height */
.logo{display:block;color:var(--ice)}
.logo .wm{display:block;height:22px;width:auto;overflow:visible}
.kick{margin-top:56px;font-family:var(--font-mono);font-size:17px;letter-spacing:.18em;text-transform:uppercase;color:var(--crimson-text)}
h1{margin-top:18px;font-family:var(--font-head);font-weight:var(--head-weight);font-size:56px;line-height:1.08;letter-spacing:var(--head-tracking)}
p{margin-top:22px;font-size:24px;line-height:1.45;color:var(--body-strong);max-width:30em}
.foot{margin-top:auto;font-family:var(--font-mono);font-size:16px;letter-spacing:.14em;text-transform:uppercase;color:var(--teal-text)}
.foot b{font-family:var(--font-ar);font-weight:600;letter-spacing:0}
/* Arabic: the page's faces, no tracking (it breaks the joins), taller lines;
   the logo stays Latin and keeps its place at the reading start */
html[dir="rtl"] body{padding:64px 72px 56px 64px}
html[dir="rtl"] .logo{direction:ltr;align-self:flex-start}
html[dir="rtl"] .kick,html[dir="rtl"] .foot{font-family:var(--font-ar);font-weight:600;letter-spacing:0;text-transform:none}
html[dir="rtl"] h1{font-family:var(--font-ar);font-weight:600;font-size:52px;line-height:1.3;letter-spacing:0}
html[dir="rtl"] p{font-family:var(--font-ar);line-height:1.7}
.r{position:relative;align-self:center}
/* the plate, as the page draws its engravings: the image is a mask, the ink is the theme's */
.plate{position:relative;aspect-ratio:1000/558;border:1px solid var(--hairline-2);border-radius:4px;padding:18px}
.plate i{position:absolute;inset:18px;background:var(--teal-text);opacity:.62;
  -webkit-mask:url(${PLATE}) center/100% 100% no-repeat;mask:url(${PLATE}) center/100% 100% no-repeat;
  -webkit-mask-source-type:luminance;mask-mode:luminance}   /* a luminance mask, as styles.css draws every plate */
.plate b{position:absolute;width:14px;height:14px;border-color:var(--crimson-text);border-style:solid;border-width:0}
.plate .tl{top:-1px;left:-1px;border-top-width:2px;border-left-width:2px}.plate .tr{top:-1px;right:-1px;border-top-width:2px;border-right-width:2px}
.plate .bl{bottom:-1px;left:-1px;border-bottom-width:2px;border-left-width:2px}.plate .br{bottom:-1px;right:-1px;border-bottom-width:2px;border-right-width:2px}
.cap{margin-top:12px;font-family:var(--font-mono);font-size:14px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}
html[dir="rtl"] .cap{font-family:var(--font-ar);letter-spacing:0;text-transform:none}
</style></head><body>
<div class="l">
  <div class="logo">${WORDMARK}</div>
  <div class="kick">${card.kicker}</div>
  <h1>${card.title}</h1>
  <p>${card.sub}</p>
  <div class="foot">${card.foot}</div>
</div>
<div class="r">
  <div class="plate"><i></i><b class="tl"></b><b class="tr"></b><b class="bl"></b><b class="br"></b></div>
  <div class="cap">${card.plateCap}</div>
</div>
</body></html>`;

/* the scene card: a plotted sheet on the drafting paper (scene/style.css),
   the heading on the left and an empty, dimensioned frame on the right */
const scene = (base, lang, card) => `<!doctype html><html lang="fr" data-theme="arcanum"><head><meta charset="utf-8">
<base href="${base}/">
<link rel="stylesheet" href="assets/fonts.css"><link rel="stylesheet" href="assets/themes.css">
<style>
:root{--display:"Cinzel","Cinzel Fallback",Georgia,serif;--body:"Geist","Geist Fallback",system-ui,sans-serif;--mono:"Geist Mono","Geist Mono Fallback",ui-monospace,monospace;
  --grid:color-mix(in srgb,var(--muted) 7%,transparent);--grid-2:color-mix(in srgb,var(--muted) 11%,transparent)}
*{box-sizing:border-box;margin:0}
html,body{width:1200px;height:630px;overflow:hidden}
body{position:relative;background:var(--void);color:var(--ice);font-family:var(--body);padding:40px}
/* the drafting paper: a fine 24px grid under a 120px major one */
body::before{content:"";position:absolute;inset:0;pointer-events:none;
  background-image:linear-gradient(var(--grid) 1px,transparent 1px),linear-gradient(90deg,var(--grid) 1px,transparent 1px),
    linear-gradient(var(--grid-2) 1px,transparent 1px),linear-gradient(90deg,var(--grid-2) 1px,transparent 1px);
  background-size:24px 24px,24px 24px,120px 120px,120px 120px}
.sheet{position:relative;height:100%;display:grid;grid-template-columns:560px 1fr;gap:48px;padding:44px 52px 40px;
  border:1px solid var(--hairline-2);border-radius:4px;background:color-mix(in srgb,var(--navy) 82%,transparent)}
.tick{position:absolute;width:16px;height:16px;border-color:var(--crimson-text);border-style:solid;border-width:0}
.tl{top:-1px;left:-1px;border-top-width:2px;border-left-width:2px}.tr{top:-1px;right:-1px;border-top-width:2px;border-right-width:2px}
.bl{bottom:-1px;left:-1px;border-bottom-width:2px;border-left-width:2px}.br{bottom:-1px;right:-1px;border-bottom-width:2px;border-right-width:2px}
.l{position:relative;display:flex;flex-direction:column;min-width:0}
.bc{display:flex;align-items:center;gap:14px;font:500 15px var(--mono);letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}
.bc .wm{display:block;height:17px;width:auto;overflow:visible;color:var(--ice)}
.kick{margin-top:52px;font:500 16px var(--mono);letter-spacing:.18em;text-transform:uppercase;color:var(--crimson-text)}
h1{margin-top:18px;font:700 54px/1.08 var(--display);letter-spacing:.01em}
h1 em{font-style:normal;color:var(--crimson-text)}
p{margin-top:22px;font-size:21px;line-height:1.5;color:var(--body-strong);max-width:26em}
.foot{margin-top:auto;font:500 15px var(--mono);letter-spacing:.14em;text-transform:uppercase;color:var(--teal-text)}
/* the frame: a browser bar, the sheet's plate as line work, its dimension under it */
.r{position:relative;align-self:center;padding:0 22px 30px 0}
.chrome{display:flex;align-items:center;gap:7px;height:32px;padding:0 14px;border:1px solid var(--hairline-2);border-bottom:0;border-radius:8px 8px 0 0;background:var(--plum)}
.chrome i{width:9px;height:9px;border-radius:50%;background:var(--hairline-2)}
.chrome span{margin-left:10px;height:14px;flex:1;max-width:220px;border-radius:3px;background:color-mix(in srgb,var(--hairline-2) 60%,transparent)}
.frame{position:relative;aspect-ratio:1440/900;border:1px solid var(--hairline-2);border-radius:0 0 8px 8px;background:var(--void);overflow:hidden;padding:7% 8%}
.frame i,.frame b{display:block;border:1px solid var(--teal-text);border-radius:3px;opacity:.55}
.frame i{height:5%;width:38%}
.frame .h{margin-top:7%;height:24%;width:70%;border-color:var(--crimson-text)}
.frame .cols{display:flex;gap:4%;margin-top:6%}
.frame .cols b{flex:1;height:72px}
.dim{position:absolute;left:0;right:22px;bottom:0;height:16px;display:grid;place-items:center;font:500 12px var(--mono);letter-spacing:.1em;color:var(--muted)}
.dim::before{content:"";position:absolute;left:0;right:0;top:50%;height:1px;background:var(--hairline-2)}
.dim::after{content:"";position:absolute;inset:0;border-left:1px solid var(--hairline-2);border-right:1px solid var(--hairline-2)}
.dim span{position:relative;padding:0 10px;background:color-mix(in srgb,var(--navy) 92%,var(--void))}
.dimh{position:absolute;top:32px;right:0;bottom:30px;width:16px}
.dimh::before{content:"";position:absolute;top:0;bottom:0;left:50%;width:1px;background:var(--hairline-2)}
.dimh::after{content:"";position:absolute;inset:0;border-top:1px solid var(--hairline-2);border-bottom:1px solid var(--hairline-2)}
.dimh span{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-90deg);padding:0 10px;font:500 12px var(--mono);letter-spacing:.1em;color:var(--muted);background:color-mix(in srgb,var(--navy) 92%,var(--void))}
</style></head><body>
<div class="sheet"><span class="tick tl"></span><span class="tick tr"></span><span class="tick bl"></span><span class="tick br"></span>
<div class="l">
  <div class="bc">${WORDMARK}<span>/ ${card.crumb}</span></div>
  <div class="kick">${card.kicker}</div>
  <h1>${card.title}</h1>
  <p>${card.sub}</p>
  <div class="foot">${card.foot}</div>
</div>
<div class="r">
  <div class="chrome"><i></i><i></i><i></i><span></span></div>
  <div class="frame"><i></i><b class="h"></b><div class="cols"><b></b><b></b><b></b></div></div>
  <div class="dim"><span>1440 px</span></div>
  <div class="dimh"><span>900</span></div>
</div>
</div>
</body></html>`;

/* the hub card: the character bible's cover (hub/style.css): its paper
   with the grain, the Archivo name, the red 夜 seal, the marker line, and
   the cover's drawing in a framed box with a floor, as the page frames it */
const hub = (base, lang, card) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<base href="${base}/">
<style>
/* the page's faces (hub/fonts, assets/fonts), declared here without
   font-display:optional: with it a card painted in the fallback and, as
   optional never swaps, stayed there although the faces had loaded */
@font-face{font-family:"Archivo";font-weight:800 900;src:url(hub/fonts/archivo-800-900-latin.woff2) format("woff2")}
@font-face{font-family:"Permanent Marker";font-weight:400;src:url(hub/fonts/permanent-marker-latin.woff2) format("woff2")}
@font-face{font-family:"Noto Sans JP";font-weight:700 900;src:url(hub/fonts/noto-sans-jp-700-900-kanji.woff2) format("woff2")}
@font-face{font-family:"Geist";font-weight:400 700;src:url(assets/fonts/geist-latin.woff2) format("woff2")}
@font-face{font-family:"Geist Mono";font-weight:400 700;src:url(assets/fonts/geist-mono-latin.woff2) format("woff2")}
:root{--paper:#D8CBB8;--cream:#F3ECE1;--sand:#E8DFD1;--floor:#CFBFAB;--ink:#211E1B;--ink-2:#4F4238;--red:#A34135;--red-text:#8A3127}
*{box-sizing:border-box;margin:0}
html,body{width:1200px;height:630px;overflow:hidden}
body{position:relative;background:var(--paper);color:var(--ink);font-family:Geist,sans-serif;display:grid;grid-template-columns:660px 1fr;gap:36px;padding:48px 56px 44px 64px;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='360' height='360'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.95' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .97 0 0 0 0 .96 0 0 0 0 .94 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' fill='%23fff'/%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E");background-size:360px;background-blend-mode:multiply}
.l{position:relative;display:flex;flex-direction:column}
.bc{display:flex;align-items:center;gap:12px;font:500 15px "Geist Mono",monospace;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-2);--teal-text:var(--red-text)}
.bc .wm{display:block;height:15px;width:auto;overflow:visible;color:var(--ink)}
.bc b{font-weight:500;color:var(--ink)}.bc b i{font-style:normal;color:var(--red-text)}
.chips{margin-top:auto;display:flex;gap:12px;align-items:center;font:500 14px "Geist Mono",monospace;letter-spacing:.2em;text-transform:uppercase}
.chip{background:var(--ink);color:var(--cream);padding:5px 9px}
h1{margin-top:14px;font:900 136px/.82 Archivo,sans-serif;letter-spacing:-.03em;text-transform:uppercase;white-space:nowrap}
h1 span{color:var(--red)}
.row{margin-top:26px;display:flex;gap:18px;align-items:center}
.seal{flex:none;width:64px;height:64px;background:var(--red);border:3px solid var(--ink);display:grid;place-items:center;font:900 34px/1 "Noto Sans JP",sans-serif;color:var(--cream);transform:rotate(-6deg);box-shadow:3px 3px 0 var(--ink)}
.tag{font-size:23px;line-height:1.3;max-width:24ch}
.marker{margin-top:22px;font:400 24px "Permanent Marker",cursive;color:var(--red-text);transform:rotate(-2deg);transform-origin:left}
.foot{margin-top:auto;font:500 14px "Geist Mono",monospace;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-2)}
.r{position:relative;align-self:end}
.box{position:relative;height:534px;background:var(--sand);border:3px solid var(--ink);box-shadow:8px 8px 0 var(--ink);display:flex;align-items:flex-end;justify-content:center;overflow:hidden}
.box img{width:90%;height:auto;display:block;margin-bottom:9%}
.box i{position:absolute;left:0;right:0;bottom:0;height:7%;background:var(--floor);border-top:3px solid var(--ink)}
</style></head><body>
<div class="l">
  <div class="bc">${WORDMARK}<span>/</span><b>VOIDSPLUNKER<i>.std</i></b></div>
  <div class="chips"><span class="chip">${card.chip}</span><span>${card.handle}</span></div>
  <h1>${card.name}<span>.</span></h1>
  <div class="row"><span class="seal" lang="ja">${card.seal}</span><p class="tag">${card.tag}</p></div>
  <p class="marker">${card.marker}</p>
  <div class="foot">${card.foot}</div>
</div>
<div class="r"><div class="box"><img src="${DUO}" alt=""><i></i></div></div>
</body></html>`;

/* the WorkspaceHQ card: the arcade cabinet (workspacehq/style.css), the
   product's name, the whole headline and Bit */
const workspacehq = (base, lang, card) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<base href="${base}/">
<style>
@font-face{font-family:"Press Start 2P";src:url(workspacehq/fonts/PressStart2P.woff2) format("woff2")}
@font-face{font-family:"VT323";src:url(workspacehq/fonts/VT323.woff2) format("woff2")}
:root{--bg:#07060f;--panel:#100d24;--ink:#050409;--frame:#322a5e;--text:#e8e6ff;--muted:#9a93c9;--faint:#8a83bd;
  --cyan:#00f0ff;--magenta:#ff2bd6;--gold:#ffd23f;--gold-2:#ffe27a;--px:"Press Start 2P",monospace;--term:"VT323",monospace}
*{box-sizing:border-box;margin:0}
html,body{width:1200px;height:630px;overflow:hidden}
body{position:relative;background:var(--bg);color:var(--text);font-family:var(--term);display:grid;grid-template-columns:720px 1fr;grid-template-rows:minmax(0,1fr);padding:56px 56px 48px 64px}
/* the page's atmosphere: the aurora and the 64px grid */
body::before{content:"";position:absolute;inset:0;pointer-events:none;
  background:radial-gradient(36% 36% at 80% 10%,rgba(255,210,63,.16),transparent 60%),radial-gradient(34% 34% at 10% 28%,rgba(0,240,255,.12),transparent 60%),
    radial-gradient(46% 46% at 60% 100%,rgba(90,78,168,.42),transparent 60%),radial-gradient(28% 28% at 96% 72%,rgba(255,43,214,.12),transparent 60%)}
body::after{content:"";position:absolute;inset:0;pointer-events:none;opacity:.07;
  background-image:linear-gradient(#5a4ea8 1px,transparent 1px),linear-gradient(90deg,#5a4ea8 1px,transparent 1px);background-size:64px 64px}
.l{position:relative;z-index:1;display:flex;flex-direction:column}
.brand{font:400 22px var(--px);letter-spacing:1px}
.brand span{color:var(--gold);text-shadow:0 0 10px rgba(255,210,63,.6)}
.kick{margin-top:auto;font:400 12px/1.8 var(--px);letter-spacing:2px;text-transform:uppercase;color:var(--cyan);text-shadow:0 0 9px rgba(0,240,255,.45)}
.kick b{font-weight:400;color:var(--magenta)}
h1{margin:22px 0 0 -.04em;font:400 124px/.8 var(--term);letter-spacing:-.01em}
h1 em{font-style:normal;color:var(--gold);text-shadow:0 0 38px rgba(255,210,63,.45)}
.sub{margin-top:30px;font:400 12px/1.8 var(--px);letter-spacing:1px;text-transform:uppercase;color:var(--muted)}
.foot{margin-top:auto;font:400 9px/1.8 var(--px);letter-spacing:1px;text-transform:uppercase;color:var(--faint)}
/* Bit on his floor, as the page's Bit card draws it */
.r{position:relative;z-index:1;display:flex;flex-direction:column;justify-content:flex-end;align-items:center}
.bit{width:312px;height:auto;display:block;filter:drop-shadow(0 0 22px rgba(217,119,87,.4))}
.floor{width:100%;margin-top:14px;border-bottom:2px solid var(--frame);height:56px;
  background:repeating-linear-gradient(90deg,transparent 0 31px,rgba(90,78,168,.12) 31px 32px),linear-gradient(0deg,rgba(90,78,168,.18),transparent 60%)}
.start{margin-top:18px;font:400 10px var(--px);letter-spacing:2px;color:var(--gold-2)}
.xp{position:absolute;top:60px;right:36px;font:400 13px var(--px);color:var(--gold);text-shadow:0 0 8px rgba(255,210,63,.8)}
</style></head><body>
<div class="l">
  <div class="brand">WORKSPACE<span>HQ</span></div>
  <div class="kick">${card.kicker} · <b>${card.coin}</b></div>
  <h1>${card.title}</h1>
  <div class="sub">${card.sub}</div>
  <div class="foot">${card.foot}</div>
</div>
<div class="r"><span class="xp">+1 XP</span><div class="bit">${BIT}</div><div class="floor"></div><div class="start">▶ PRESS START</div></div>
</body></html>`;

const TEMPLATES = { home, scene, hub, workspacehq };

const only = process.argv[2];
if (only && !CARDS[only]) { console.error(`✗ no card for "${only}" (one of: ${Object.keys(CARDS).join(', ')})`); process.exit(1); }

const { base, close } = await serve();
const b = await launch();
try {
  for (const [name, card] of Object.entries(CARDS)) {
    if (only && name !== only) continue;
    const p = await (await b.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })).newPage();
    // be on the server's origin first: from about:blank every font request is
    // cross-origin, and font loads are CORS requests the static server refuses
    await p.goto(base + '/404.html');
    await p.setContent(TEMPLATES[card.kind](base, name, card), { waitUntil: 'networkidle' });
    const absent = await p.evaluate(async (faces) => {
      const probe = (f) => (f.includes('Arabic') ? 'ع' : f.includes('JP') ? '夜' : 'Aé');
      await Promise.all(faces.map((f) => document.fonts.load(f, probe(f))));
      await document.fonts.ready;
      return faces.filter((f) => !document.fonts.check(f, probe(f)));
    }, card.faces);
    if (absent.length) throw new Error(`og card ${name}: faces did not load: ` + absent.join(', '));
    // a CSS mask is not an <img>: each picture is loaded the same way, and a
    // card without one of them refused
    const lost = await p.evaluate(async (srcs) => {
      const out = [];
      for (const s of srcs) { const i = new Image(); i.src = s; try { await i.decode(); if (!i.naturalWidth) out.push(s); } catch { out.push(s); } }
      return out;
    }, card.assets);
    if (lost.length) throw new Error(`og card ${name}: pictures did not load: ` + lost.join(', '));
    // the copy fits the card: nothing runs past the 630px it is cut at, and
    // nothing past its right edge (the handle and the headline are one line),
    // or, on a card whose right column is a picture (inColumn: the hub's),
    // past its own column
    const over = await p.evaluate((inColumn) => [...document.querySelectorAll('.l > *, .r > *')].filter((e) => { const r = e.getBoundingClientRect();
      const lim = inColumn && e.closest('.l') ? document.querySelector('.l').getBoundingClientRect().right + 1 : 1200; return r.bottom > 630 || r.right > lim; }).map((e) => e.className || e.tagName), !!card.inColumn);
    if (over.length) throw new Error(`og card ${name}: ${over.join(', ')} run(s) past the card's edge (shorten the copy)`);
    await p.waitForTimeout(300);
    // JPEG: a photographic card as PNG is ~530 KB, and some messengers drop
    // previews over ~300 KB
    await p.screenshot({ path: join(ROOT, card.out), type: 'jpeg', quality: card.quality || 86 });
    console.log(`✓ ${card.out} (1200×630, ${name})`);
    await p.context().close();
  }
} finally { await b.close(); close(); }
