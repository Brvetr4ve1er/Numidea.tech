#!/usr/bin/env node
/**
 * Ad creative — `node scripts/build-creative.mjs [ad-id …]` → campaign/out/
 *
 * Each image is a photographic scene (campaign/scenes, generated once with a
 * flat chroma-green device screen) with a real capture, or the neutral demo
 * homepage, warped onto the screen and every word set as text in the site's
 * own faces. No interface and no lettering is AI-drawn:
 *  - lib/screen-quad.mjs finds the green screen's corners and mask;
 *  - the capture is mapped onto those corners with a CSS matrix3d homography
 *    and clipped by the mask, so a thumb over the glass stays in front;
 *  - texts come from campaign/creative-data.mjs, copied from the reviewed kit,
 *    with prices filled from PRICE_MODEL in assets/app.js.
 * Sizes: 9x16 = 1080×1920 (Stories/Reels: top 14% and bottom 35% kept free of
 * text), 4x5 = 1080×1350 (feed, cropped from the 9:16 scene), 1x1 =
 * 1080×1080 (carousel cards).
 */
import { readFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';
import { serve, launch } from './lib/serve.mjs';
import { findScreen, maskPng, matrix3d, despill } from './lib/screen-quad.mjs';
import { ROOT } from './site.mjs';
import { SCENES, ADS, MOCK } from '../campaign/creative-data.mjs';

const OUT = join(ROOT, 'campaign/out');
const SIZES = { '9x16': [1080, 1920], '4x5': [1080, 1350], '1x1': [1080, 1080] };

// prices: the Essentiel floor as the site shows it (same FX and tidy() as app.js 12a)
const app = readFileSync(join(ROOT, 'assets/app.js'), 'utf8');
const floor = Number(/vitrine:\s*\{\s*base:\s*\[(\d+)/.exec(app)[1]);
const FX = JSON.parse(/var FX = (\{[^}]+\})/.exec(app)[1].replace(/(\w+):/g, '"$1":'));
const tidy = (n) => { const g = n >= 10000 ? 500 : n >= 1000 ? 100 : 10; return Math.max(g, Math.round(n / g) * g); };
const PRICES = { fromEUR: String(tidy(floor / FX.EUR)), fromUSD: String(tidy(floor / FX.USD)) };
const fill = (s) => s && s.replace(/\{(\w+)\}/g, (_, k) => PRICES[k] ?? `{${k}}`);
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

const FONTS = `<link rel="stylesheet" href="assets/fonts.css">`;

/* the neutral demo homepage, rendered at 390×844 CSS px (2×) */
const mockHtml = (base, m) => `<!doctype html><html lang="${m.dir === 'rtl' ? 'ar' : 'fr'}" dir="${m.dir}"><head><meta charset="utf-8"><base href="${base}/">${FONTS}
<style>*{box-sizing:border-box;margin:0}body{width:390px;height:844px;overflow:hidden;background:#F6F4EF;color:#14212E;
font-family:${m.dir === 'rtl' ? '"IBM Plex Sans Arabic"' : '"Geist"'},sans-serif}
.top{display:flex;align-items:center;justify-content:space-between;padding:54px 20px 14px}
.logo{border:1.5px dashed #9AA6B2;border-radius:8px;padding:8px 12px;font-size:13px;font-weight:600;color:#5B6875}
.langs{display:flex;gap:2px;border:1px solid #C9CFD6;border-radius:999px;padding:2px;font-size:11px}
.langs b{padding:4px 9px;border-radius:999px;font-weight:600;color:#5B6875}.langs b:first-child{background:#14212E;color:#fff}
.burger{width:22px;height:14px;border-top:2px solid #14212E;border-bottom:2px solid #14212E;position:relative}
.burger::after{content:"";position:absolute;inset-inline:0;top:4px;border-top:2px solid #14212E}
.hero{margin:10px 16px 0;height:330px;border-radius:18px;padding:26px 22px;display:flex;flex-direction:column;justify-content:flex-end;
background:linear-gradient(160deg,#1F3B57 0%,#2C5A7A 55%,#C98B3C 140%);color:#fff;position:relative;overflow:hidden}
.hero::before{content:"";position:absolute;width:260px;height:260px;border-radius:50%;inset-inline-end:-70px;top:-80px;background:rgba(255,255,255,.08)}
.hero::after{content:"";position:absolute;width:160px;height:160px;border-radius:50%;inset-inline-end:40px;top:60px;background:rgba(255,255,255,.06)}
.note{position:absolute;top:16px;inset-inline-start:16px;font-size:10.5px;letter-spacing:${m.dir === 'rtl' ? 0 : '.08em'};text-transform:uppercase;
background:rgba(255,255,255,.16);padding:5px 9px;border-radius:999px}
h1{font-size:34px;line-height:1.08;font-weight:700;position:relative}
.hero p{margin-top:10px;font-size:15px;line-height:1.45;opacity:.9;position:relative}
.btn{margin-top:18px;align-self:flex-start;background:#F2B24A;color:#14212E;font-weight:700;font-size:15px;padding:12px 18px;border-radius:12px;position:relative}
.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:18px 16px 0}
.card{background:#fff;border:1px solid #E3E0D8;border-radius:14px;padding:14px 10px;font-size:12.5px;font-weight:600;color:#3B4856;min-height:110px;
display:flex;flex-direction:column;gap:10px}.card i{width:28px;height:28px;border-radius:8px;background:#E7EEF4;display:block}
.card span{height:6px;border-radius:3px;background:#ECE9E2;display:block}.card span+span{width:70%}
.contact{margin:18px 16px 0;background:#fff;border:1px solid #E3E0D8;border-radius:14px;padding:16px;display:grid;gap:10px}
.contact b{font-size:14px;color:#14212E}.contact span{height:7px;border-radius:4px;background:#ECE9E2;display:block}
.contact span:nth-child(3){width:80%}.contact span:nth-child(4){width:60%}
.map{margin:12px 16px 0;height:120px;border-radius:14px;background:repeating-linear-gradient(45deg,#E7EEF4 0 10px,#EEF3F7 10px 20px)}
.foot{margin-top:18px;height:120px;background:#14212E}
</style></head><body>
<div class="top"><span class="logo">${esc(m.logo)}</span>${m.langs ? `<span class="langs">${m.langs.map((l) => `<b>${l}</b>`).join('')}</span>` : ''}<span class="burger"></span></div>
<div class="hero"><span class="note">${esc(m.note)}</span><h1>${esc(m.name)}</h1><p>${esc(m.line)}</p><span class="btn">${esc(m.cta)}</span></div>
<div class="cards">${m.cards.map((c) => `<div class="card"><i></i>${esc(c)}<span></span><span></span></div>`).join('')}</div>
<div class="contact"><b>${esc(m.contact)}</b><span></span><span></span><span></span></div><div class="map"></div><div class="foot"></div>
</body></html>`;

/* one ad image */
const adHtml = (base, ad, size, scene, layout) => {
  const [W, H] = SIZES[size];
  const rtl = ad.lang === 'ar';
  const face = rtl ? '"IBM Plex Sans Arabic"' : '"Geist"';
  const pad = 64, top = size === '9x16' ? Math.round(H * 0.14) + 24 : 56;
  const headPx = size === '1x1' ? 50 : size === '4x5' ? 58 : 66;
  const L = layout;   // { sw, sh, s, ox, oy, quad, maskUri, capUri, cw, ch }
  const badge = ad.badge ? `<div class="badge">${esc(ad.badge)}</div>` : '';
  const banner = ad.banner ? `<div class="banner">${esc(ad.banner)}</div>` : '';
  return `<!doctype html><html lang="${ad.lang}" dir="${rtl ? 'rtl' : 'ltr'}"><head><meta charset="utf-8"><base href="${base}/">${FONTS}
<style>*{box-sizing:border-box;margin:0}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:#0A1420}
.backdrop{position:absolute;inset:-60px;width:calc(100% + 120px);height:calc(100% + 120px);object-fit:cover;filter:blur(36px) brightness(.55)}
.stage{position:absolute;left:${-L.ox}px;top:${-L.oy}px;width:${L.sw * L.s}px;height:${L.sh * L.s}px}
.stage>img{position:absolute;inset:0;width:100%;height:100%${L.oy < 0 ? `;-webkit-mask:linear-gradient(180deg,transparent 0,#000 ${Math.round(-L.oy * 1.6)}px);mask:linear-gradient(180deg,transparent 0,#000 ${Math.round(-L.oy * 1.6)}px)` : ''}}
.screen{position:absolute;inset:0;-webkit-mask:url(${L.maskUri}) 0 0/100% 100% no-repeat;mask:url(${L.maskUri}) 0 0/100% 100% no-repeat}
.cap{position:absolute;left:0;top:0;width:${L.cw}px;height:${L.ch}px;transform-origin:0 0;transform:${L.m3d};overflow:hidden;background:#fff}
.cap img{width:100%;height:100%;object-fit:cover;object-position:top center;display:block}
.cap .badge{position:absolute;top:4%;inset-inline-end:4%;background:#E6B450;color:#0A1420;font:700 ${Math.round(L.cw * 0.05)}px "Geist Mono",monospace;padding:.35em .7em;border-radius:6px}
.cap .banner{position:absolute;left:0;right:0;top:0;background:#E6B450;color:#0A1420;text-align:center;
  font:700 ${Math.round(L.cw * (rtl ? 0.034 : 0.032))}px ${rtl ? '"IBM Plex Sans Arabic"' : '"Geist Mono",monospace'};padding:.55em .5em;letter-spacing:${rtl ? 0 : '.04em'}}
.scrim{position:absolute;inset:0;background:linear-gradient(180deg,rgba(6,12,20,.86) 0%,rgba(6,12,20,.62) ${size === '1x1' ? 30 : 34}%,rgba(6,12,20,0) ${size === '1x1' ? 50 : 52}%)}
.txt{position:absolute;left:${pad}px;right:${pad}px;top:${top}px;color:#F4F7FA;font-family:${face}}
.brand{font:700 26px "Cinzel",serif;letter-spacing:.04em;color:#F4F7FA;direction:ltr;${rtl ? 'text-align:right;' : ''}}
.brand i{font-style:normal;color:#34D0E8}
h1{margin-top:22px;font-weight:700;font-size:${headPx}px;line-height:1.08;letter-spacing:${rtl ? 0 : '-.015em'};text-wrap:balance}
.sub{margin-top:16px;font-size:${Math.round(headPx * 0.48)}px;line-height:1.35;color:#E6EDF3;text-wrap:balance}
.small{margin-top:14px;font-size:${size === '1x1' ? 20 : 22}px;line-height:1.4;color:#C9D6E2;max-width:${size === '1x1' ? 900 : 920}px}
</style></head><body>
<img class="backdrop" src="${scene}" alt=""><div class="stage"><img src="${scene}" alt=""><div class="screen"><div class="cap"><img src="${L.capUri}" alt="">${badge}${banner}</div></div></div>
<div class="scrim"></div>
<div class="txt"><div class="brand">Num<i>idea</i> Labs</div><h1>${esc(fill(ad.head))}</h1>${ad.sub ? `<div class="sub">${esc(fill(ad.sub))}</div>` : ''}${ad.small ? `<div class="small">${esc(fill(ad.small))}</div>` : ''}</div>
</body></html>`;
};

const only = new Set(process.argv.slice(2));
const ads = ADS.filter((a) => !only.size || only.has(a.id));
mkdirSync(OUT, { recursive: true });
const { base, close } = await serve();
const b = await launch();
const ctx = await b.newContext({ deviceScaleFactor: 1 });
const page = await ctx.newPage();
await page.goto(base + '/404.html');   // same origin for fonts and data
const ready = async () => {
  await page.evaluate(async () => {
    await Promise.all(['700 30px Cinzel', '700 40px Geist', '400 20px Geist', '700 20px "Geist Mono"', '700 30px "IBM Plex Sans Arabic"', '400 20px "IBM Plex Sans Arabic"']
      .map((f) => document.fonts.load(f, f.includes('Arabic') ? 'ع' : 'Aé')));
    await document.fonts.ready;
    await Promise.all([...document.images].map((i) => i.decode().catch(() => {})));
  });
};
const sceneCache = new Map(), mockCache = new Map();
let made = 0;
try {
  for (const ad of ads) {
    const [file, device] = SCENES[ad.scene];
    const scenePath = join(ROOT, 'campaign/scenes', file);
    if (!existsSync(scenePath)) { console.log(`· ${ad.id}: scene ${file} not generated yet, skipped`); continue; }
    if (!sceneCache.has(ad.scene)) {
      const scr = await findScreen(scenePath);
      sceneCache.set(ad.scene, { scr, maskUri: 'data:image/png;base64,' + (await maskPng(scr)).toString('base64'),
        sceneUri: 'data:image/jpeg;base64,' + (await despill(scenePath, scr)).toString('base64') });
    }
    const { scr, maskUri, sceneUri } = sceneCache.get(ad.scene);
    // what goes on the screen, as a data URI
    let capUri, capAspect;
    if (ad.screen.startsWith('mock:')) {
      const lang = ad.screen.slice(5);
      if (!mockCache.has(lang)) {
        const mp = await ctx.newPage(); await mp.setViewportSize({ width: 390, height: 844 });
        await mp.goto(base + '/404.html'); await mp.setContent(mockHtml(base, MOCK[lang]), { waitUntil: 'networkidle' });
        await mp.evaluate(() => document.fonts.ready);
        const shot = await (await b.newContext({ deviceScaleFactor: 2, viewport: { width: 390, height: 844 } })).newPage()
          .then(async (p2) => { await p2.goto(base + '/404.html'); await p2.setContent(mockHtml(base, MOCK[lang]), { waitUntil: 'networkidle' });
            await p2.evaluate(async () => { await document.fonts.load('700 30px Geist', 'A'); await document.fonts.load('700 30px "IBM Plex Sans Arabic"', 'ع'); await document.fonts.ready; });
            const buf = await p2.screenshot({ type: 'png' }); await p2.close(); return buf; });
        await mp.close();
        mockCache.set(lang, 'data:image/png;base64,' + shot.toString('base64'));
      }
      capUri = mockCache.get(lang); capAspect = 390 / 844;
    } else {
      const buf = await sharp(join(ROOT, ad.screen)).png().toBuffer();
      const meta = await sharp(buf).metadata();
      capUri = 'data:image/png;base64,' + buf.toString('base64'); capAspect = meta.width / meta.height;
    }
    // screen rectangle in its own proportions: average opposite sides of the quad
    const q = scr.corners, d = (a, b2) => Math.hypot(a[0] - b2[0], a[1] - b2[1]);
    const qw = (d(q[0], q[1]) + d(q[3], q[2])) / 2, qh = (d(q[0], q[3]) + d(q[1], q[2])) / 2;
    const cw = 600, ch = Math.round(cw * qh / qw);
    for (const size of ad.sizes) {
      const [W, H] = SIZES[size];
      const s = Math.max(W / scr.width, H / scr.height);
      // crop around the screen centre, clamped to the scene
      const cx = (q[0][0] + q[1][0] + q[2][0] + q[3][0]) / 4 * s, cy = (q[0][1] + q[1][1] + q[2][1] + q[3][1]) / 4 * s;
      const ox = Math.round(Math.min(Math.max(cx - W / 2, 0), scr.width * s - W));
      const top = Math.min(...q.map((c) => c[1])) * s;
      const want = { '9x16': 0.335, '4x5': 0.25, '1x1': 0.3 }[size] * H;   // text block sits above this
      // a scene framed too high may slide down by up to 12% of the height; the gap
      // above is filled with a blurred, darkened copy of the scene under the scrim
      const oy = Math.round(Math.min(Math.max(top - want, -0.12 * H), scr.height * s - H));
      const qc = [q.reduce((a, c) => a + c[0], 0) / 4, q.reduce((a, c) => a + c[1], 0) / 4];
      const grow = q.map(([x, y]) => [qc[0] + (x - qc[0]) * 1.012, qc[1] + (y - qc[1]) * 1.012]);
      const m3d = matrix3d(cw, ch, grow.map(([x, y]) => [x * s, y * s]));
      const html = adHtml(base, ad, size, sceneUri, { sw: scr.width, sh: scr.height, s, ox, oy, maskUri, capUri, cw, ch, m3d });
      await page.setViewportSize({ width: W, height: H });
      await page.setContent(html, { waitUntil: 'networkidle' });
      await ready();
      const out = join(OUT, `${ad.id}_${size}.jpg`);
      await page.screenshot({ path: out, type: 'jpeg', quality: 90 });
      made++;
      console.log(`✓ ${ad.id}_${size}.jpg${ad.gate ? `  (gate: ${ad.gate})` : ''}`);
    }
  }
} finally { await b.close(); close(); }
console.log(`${made} images in campaign/out/`);
