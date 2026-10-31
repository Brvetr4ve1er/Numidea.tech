#!/usr/bin/env node
/**
 * The link-preview cards — `node scripts/build-og.mjs` → assets/og.jpg,
 * og-en.jpg, og-ar.jpg (one language: `node scripts/build-og.mjs ar`)
 *
 * Scrapers (WhatsApp, LinkedIn, Facebook, X) read og:image without running
 * scripts, so each language page names its own static card (index.html the
 * French one, en/ and ar/ theirs: scripts/build-lang.mjs). The three are
 * drawn with the site's own Arcanum tokens (themes.css) and self-hosted
 * faces (fonts.css), so they cannot drift from the brand; the Arabic one is
 * set right to left in the page's Plex Arabic faces, the logo staying in
 * Latin script as it does on the page. Their image is one of the site's own
 * engravings (Plate II, the Arch of Trajan at Timgad), drawn in the theme's
 * ink the way the page draws it. It used to be a capture of a client's
 * site, captioned "site livré". The owner replaced that on 2026-10-26: no
 * client has yet given written permission to appear in marketing, and a
 * share card is marketing. Re-run after a theme or copy change.
 */
import { join } from 'node:path';
import { serve, launch } from './lib/serve.mjs';
import { ROOT } from './site.mjs';

const PLATE = 'assets/illus/arch.webp';     // 1000x558
// the offer as it is: one page (the homepage), its terms named; the Arabic
// copy follows the page's dictionary (assets/i18n/ar.js: prev.*, tb.*, pl.arch)
const CARDS = {
  fr: {
    out: 'assets/og.jpg',
    kicker: "L'Aperçu · offre signature",
    title: "Voyez votre page d'accueil avant de payer.",
    sub: 'Gratuit et sans engagement · entreprises immatriculées · 4 par mois au maximum.',
    foot: 'Studio web · Bordj Bou Arréridj · FR · EN · <b lang="ar">ع</b>',
    plateCap: 'Pl. II — Arc de Trajan · Timgad',   // the site's own caption (pl.arch)
  },
  en: {
    out: 'assets/og-en.jpg',
    kicker: 'The Preview · signature offer',
    title: 'See your new homepage before you pay.',
    sub: 'Free, no obligation · registered businesses · at most 4 a month.',
    foot: 'Web studio · Bordj Bou Arréridj · EN · FR · <b lang="ar">ع</b>',
    plateCap: 'Pl. II — Arch of Trajan · Timgad',
  },
  ar: {
    out: 'assets/og-ar.jpg',
    kicker: 'المعاينة · عرضنا المميّز',
    title: 'شاهد الصفحة الرئيسية لموقعك الجديد قبل أن تدفع.',
    sub: 'مجّاناً ودون التزام · للشركات المسجّلة · 4 في الشهر كحدّ أقصى.',
    foot: 'استوديو ويب · برج بوعريريج · العربية · الفرنسية · الإنجليزية',
    plateCap: 'لوحة 2 — قوس تراجان · تيمقاد',
  },
};

const html = (base, lang, card) => `<!doctype html><html lang="${lang}" dir="${lang === 'ar' ? 'rtl' : 'ltr'}" data-theme="arcanum"><head><meta charset="utf-8">
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
  <div class="logo">Num<i>idea</i> Labs</div>
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

const only = process.argv[2];
if (only && !CARDS[only]) { console.error(`✗ no card for "${only}" (one of: ${Object.keys(CARDS).join(', ')})`); process.exit(1); }

const { base, close } = await serve();
const b = await launch();
try {
  for (const [lang, card] of Object.entries(CARDS)) {
    if (only && lang !== only) continue;
    const p = await (await b.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })).newPage();
    // be on the server's origin first: from about:blank every font request is
    // cross-origin, and font loads are CORS requests the static server refuses
    await p.goto(base + '/404.html');
    await p.setContent(html(base, lang, card), { waitUntil: 'networkidle' });
    // swap faces only start loading when text needs them, and fonts.ready can
    // resolve before that: ask for each face by name, and refuse a fallback.
    // The Latin cards set one Arabic glyph (the foot's ع); the Arabic card
    // sets its title and lines in Plex Arabic 600 and 400
    const FACES = lang === 'ar'
      ? ['700 30px Cinzel', '400 24px Geist', '400 16px "Geist Mono"', '600 52px "IBM Plex Sans Arabic"', '400 24px "IBM Plex Sans Arabic"']
      : ['700 30px Cinzel', '400 24px Geist', '400 16px "Geist Mono"', '600 16px "IBM Plex Sans Arabic"'];
    const absent = await p.evaluate(async (faces) => {
      await Promise.all(faces.map((f) => document.fonts.load(f, f.includes('Arabic') ? 'ع' : 'Aé')));
      await document.fonts.ready;
      return faces.filter((f) => !document.fonts.check(f, f.includes('Arabic') ? 'ع' : 'Aé'));
    }, FACES);
    if (absent.length) throw new Error(`og card ${lang}: faces did not load: ` + absent.join(', '));
    // the engraving is a CSS mask, not an <img>: load it the same way and refuse a card without it
    const plateOk = await p.evaluate(async (src) => { const i = new Image(); i.src = src; try { await i.decode(); return i.naturalWidth > 0; } catch { return false; } }, PLATE);
    if (!plateOk) throw new Error(`og card ${lang}: the plate did not load`);
    // the copy fits the card: nothing runs past the 630px it is cut at
    const over = await p.evaluate(() => [...document.querySelectorAll('.l > *, .r > *')].filter((e) => e.getBoundingClientRect().bottom > 630).length);
    if (over) throw new Error(`og card ${lang}: ${over} block(s) run past the card's foot (shorten the copy)`);
    await p.waitForTimeout(300);
    // JPEG: a photographic card as PNG is ~530 KB, and some messengers drop
    // previews over ~300 KB
    await p.screenshot({ path: join(ROOT, card.out), type: 'jpeg', quality: 86 });
    console.log(`✓ ${card.out} (1200×630, ${lang})`);
    await p.context().close();
  }
} finally { await b.close(); close(); }
