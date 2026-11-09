#!/usr/bin/env node
/**
 * Project preview capture — committed-screenshot pipeline.
 *
 * Captures each LIVE project page at 1440×900 and 2x, crops it to its 16:10
 * window (CROP below), and writes assets/previews/<file>.webp at 1280 with a
 * 720 copy beside it (<file>-720.webp): the srcset's candidates on the home
 * page's plate and work cards (the cards are two abreast from 720px, 91vw
 * on a phone: a 1280 file covers a 2x screen at 1440).
 *
 * The settings are the project sheets' (scripts/work-capture.mjs, the
 * captures /scene/ shows): French, reduced motion (no reveal caught half
 * way), software GL (Alliance's globe drew black without it), the page
 * settled after networkidle and every image decoded, and a fixed header
 * lifted off the client's h1. Where a preview shows the page a sheet frame
 * shows (`sheet`), the two are compared after the capture: a preview that
 * differs from its sheet frame by more than DRIFT (mean absolute difference
 * of the two downscaled to 64×40 in grey, 0–255) is reported, so the first
 * capture a buyer sees can no longer be an older build than the one /scene/
 * shows (the 2026-08 Bordj Steel preview, with an English nav, sat on the
 * plate two months after the sheet showed the current site). A preview whose
 * bottom 15% is flat (grey sd under BAND) is reported too: the
 * client's hero ended above the frame (Nomara's cream band).
 *
 * The Glaive demo has no preview any more (`demo: true`): it is a made-up
 * brand, one muted line under the four clients on the home page, not a card
 * with a capture.
 *
 * Usage:
 *   npm install
 *   npx playwright install chromium     # one-time, downloads the browser
 *   npm run shots                       # capture everything
 *   npm run shots -- almaflowclim       # capture a single file
 *   npm run shots -- --check            # compare the committed files only
 *
 * The browser is the one every gate uses (scripts/lib/serve.mjs launch():
 * CHROMIUM_PATH, else a pre-installed build, else Playwright's own).
 * Re-run whenever a site ships or changes (and after npm run work:capture),
 * then look at every file and commit the updated .webp.
 */
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { launch } from './lib/serve.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'assets', 'previews');

// preview file → { capture: URL screenshotted, client: data-client slug on the
// main page (the plate and card links carry it; check.mjs keeps them in step),
// sheet: the work frame (assets/work/<sheet>.webp) of the same page, or null
// where no sheet shows it (Nomara has no sheet), dark: the client's own dark
// scheme, as work-capture.mjs takes it for Alliance's trip pages }.
// Alliance's home hero is a WebGL globe that draws black in headless Chromium
// even on software GL (its sheet opens on #voyages for the same reason): its
// preview is the Istanbul page, the sheet's d2, in French under a French nav.
// capture stays on the netlify build even if a card links a production domain.
export const PROJECTS = {
  bordjsteel:            { capture: 'https://bordjsteelb2b.netlify.app',          client: 'bordjsteel', sheet: 'bordjsteel/d1' },
  // the first card's: the references page (a steelwork under a crane, four
  // totals), so the card repeats neither the plate's home nor the white
  // catalogue (6 px text on a white page, its footer cut at the bottom edge)
  // soft: a 0.6 px blur before the encode, the crane photo's grain being most of its bytes (the 1280 file was 61 KB at quality 56, over the 53 KB ceiling)
  'bordjsteel-references': { capture: 'https://bordjsteelb2b.netlify.app/references', client: 'bordjsteel', sheet: 'bordjsteel/d3', soft: 0.6 },
  almaflowclim:          { capture: 'https://almaflowclim.netlify.app',           client: 'almaflow',   sheet: 'almaflow/d1' },
  // a 1152×720 window (16:10 itself): at 1440×900 the hero ended at two thirds
  // and the last third was the next band's faint card tops under a chat bubble;
  // the bubble is hidden (`bare`) and no 1440 sheet frame is comparable (sheet: null)
  // Fleet 7 round 2: the home's destinations band, not a trip page (a black slab of 6 px text): the heading
  // is scrolled off and the first photographic cards fill the frame (#voyages, 230 px lower, the fixed nav and
  // the chat bubble out: bare 'all'). The hero is the WebGL globe that draws black headless; the card photos are the client's own.
  alliancetravel:        { capture: 'https://alliancetravel34.netlify.app/#voyages', client: 'alliance', sheet: null, scroll: 230, bare: 'all', soft: 0.8 },
  nomara:                { capture: 'https://nomaravoyages.netlify.app',          client: 'nomara',     sheet: null },
  // the portfolio demo: its link on the home page carries data-client (check.mjs 5 pairs the slugs), but it has no
  // preview file: the home shows it as one line under the clients, not as a card with a capture
  glaive:                { capture: 'https://glaivestore.netlify.app',            client: 'glaive',     sheet: 'glaive/d1', demo: true },
};

/* The 16:10 window of each capture that keeps the client's h1, its lede and
   its first action whole, in CSS pixels of the 1440×900 page (x, y, width;
   the height follows). The whole frame unless noted; a sheet frame is
   compared through the same window. Nomara's hero ends at
   y≈620 (a cream band below it filled the old preview's last quarter): the
   window stops there, from the reading start (the right: the site is Arabic).
   Its left edge is the widest the 620px hero allows at 16:10 (992 wide, x 448):
   the headline's last letter starts at x 455, so any x above 448 cuts it, and
   the nav's last item shows as an 11px sliver. The catalogue's frame is the
   whole 1440 (Fleet 6: x 80 / w 1280 cut the logo and "Accueil" off the left
   of the nav and the tagline off the right). */
export const CROP = {
  nomara: { x: 448, y: 0, w: 992 },
  // the references page: the nav, the crane photo and its heading (the totals below are on the sheet)
  // Fleet 6 round 2: the references page's header only, nav to the crane photo's foot (y 540):
  // the white totals panel below it was half the plate and read as a hole in a dark page
  // Fleet 7 round 2: the card is the feature row now (7/12 of the width), so the window is tighter again: the nav,
  // the crane under its heading, nothing of the white totals panel (a 540 px hero: 864 wide is the widest 16:10 that fits)
  'bordjsteel-references': { x: 288, y: 0, w: 864 },
  // the first two destination cards whole under their price pills (1440 viewport, 230 px below #voyages)
  alliancetravel: { x: 145, y: 291, w: 780 },
};

const VW = 1440, VH = 900, DPR = 2;
const SIZES = [1280, 720];
const DRIFT = 28, BAND = 10;
const CEIL = 52000;   // under check.mjs's 53 kB (53,000 bytes) per file in assets/previews

const args = process.argv.slice(2);
const checkOnly = args.includes('--check');
const only = args.find((a) => !a.startsWith('--'));

function windowOf(file) {
  const c = CROP[file] || { x: 0, y: 0, w: (PROJECTS[file].vp || { w: VW }).w };
  return { left: c.x, top: c.y, width: c.w, height: Math.round((c.w * 10) / 16) };
}

// grey 64×40 thumbnails, compared pixel by pixel
async function grey(input) {
  return sharp(input).resize(64, 40, { fit: 'fill' }).greyscale().raw().toBuffer();
}
async function drift(file) {
  const p = PROJECTS[file];
  const src = p.sheet && join(ROOT, 'assets', 'work', p.sheet + '.webp');
  if (!src || !existsSync(src)) return null;
  const w = windowOf(file);
  const meta = await sharp(src).metadata();
  const k = meta.width / VW;   // the sheet frames are 1440 wide (1x)
  const crop = await sharp(src).extract({ left: Math.round(w.left * k), top: Math.round(w.top * k), width: Math.round(w.width * k), height: Math.round(w.height * k) }).toBuffer();
  const [a, b] = await Promise.all([grey(join(OUT, file + '.webp')), grey(crop)]);
  let s = 0;
  for (let i = 0; i < a.length; i++) s += Math.abs(a[i] - b[i]);
  return s / a.length;
}
// the grey standard deviation of the bottom 15% as one region: a hero that
// ended above the frame leaves a flat band there, a stray label aside (the
// old Nomara preview: 6.7; a dark footer strip of icons and text: 20 and up)
async function band(file) {
  const { data, info } = await sharp(join(OUT, file + '.webp')).greyscale().raw().toBuffer({ resolveWithObject: true });
  let m = 0, q = 0;
  const from = Math.floor(info.height * 0.85) * info.width, n = data.length - from;
  for (let i = from; i < data.length; i++) { m += data[i]; q += data[i] * data[i]; }
  m /= n;
  return Math.sqrt(Math.max(0, q / n - m * m));
}

async function capture(browser, file, { capture: url, dark, vp, bare, soft, scroll }) {
  const ctx = await browser.newContext({
    viewport: { width: vp ? vp.w : VW, height: vp ? vp.h : VH }, deviceScaleFactor: DPR,
    locale: 'fr-FR', reducedMotion: 'reduce', colorScheme: dark ? 'dark' : 'light',
  });
  const page = await ctx.newPage();
  try {
    try { await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 }); }
    catch { await page.goto(url, { waitUntil: 'load', timeout: 45000 }); }   // a site that keeps a socket open
    await page.waitForTimeout(2500);
    // Alliance's trip pages open on a title intro; its own "Passer" (skip)
    // shows the page a visitor lands on (work-capture.mjs does the same)
    const skip = page.locator('button:has-text("Passer"), a:has-text("Passer")').first();
    if (await skip.count() && await skip.isVisible()) { await skip.click().catch(() => {}); await page.waitForTimeout(1500); }
    // every image painted, not still decoding
    await page.evaluate(() => Promise.race([
      Promise.all([...document.images].filter((i) => i.complete).map((i) => i.decode().catch(() => {}))),
      new Promise((r) => setTimeout(r, 4000)),
    ]));
    // a fixed header must not sit on the client's h1 (work-capture.mjs's rule)
    const lift = await page.evaluate(() => {
      const h = document.querySelector('h1'); if (!h) return 0;
      let nb = 0;
      for (const e of document.querySelectorAll('body *')) {
        const c = getComputedStyle(e);
        if (c.position === 'fixed' || c.position === 'sticky') {
          const r = e.getBoundingClientRect();
          if (r.height > 20 && r.height <= 200 && r.width > 300 && r.top <= 100 && r.bottom > 0) nb = Math.max(nb, r.bottom);
        }
      }
      const t = h.getBoundingClientRect().top;
      if (!nb || t >= nb + 24 || h.getBoundingClientRect().bottom < 0) return 0;
      const d = Math.min(nb + 24 - t, scrollY); window.scrollBy({ top: -d, behavior: 'instant' }); return d;
    });
    if (lift) await page.waitForTimeout(1200);
    // a chat or call bubble floating in a lower corner is the client's widget,
    // not the page: out of the frame
    if (scroll) { await page.evaluate((d) => window.scrollBy({ top: d, behavior: 'instant' }), scroll); await page.waitForTimeout(1200); }
    if (bare) await page.evaluate((all) => {
      for (const e of document.querySelectorAll('body *')) {
        const r = e.getBoundingClientRect();
        if (getComputedStyle(e).position !== 'fixed') continue;
        if (all === 'all' || (r.top > innerHeight * 0.5 && r.width < 400 && r.height < 100)) e.style.visibility = 'hidden';
      }
    }, bare);
    const png = await page.screenshot({ type: 'png' });
    const w = windowOf(file);
    const region = { left: w.left * DPR, top: w.top * DPR, width: w.width * DPR, height: w.height * DPR };
    for (const s of SIZES) {
      // quality 80, lowered in steps while the file is over check.mjs's
      // ceiling for assets/previews (a photographic hero, Nomara's, came
      // to 69 KB at 80)
      let buf, q = 80;
      do {
        let img = sharp(png).extract(region).resize(s, Math.round((s * 10) / 16), { fit: 'fill' });
        if (soft) img = img.blur(soft);
        buf = await img.webp({ quality: q, effort: 6 }).toBuffer();
        q -= 6;
      } while (buf.length > CEIL && q >= 30);
      await writeFile(join(OUT, `${file}${s === 1280 ? '' : '-' + s}.webp`), buf);
    }
    console.log(`✓ ${file}.webp + -720  ←  ${url}`);
  } catch (e) {
    console.warn(`✗ ${file}: ${e.message.split('\n')[0]} (kept existing capture)`);
  } finally {
    await ctx.close();
  }
}

async function run() {
  await mkdir(OUT, { recursive: true });
  const targets = Object.entries(PROJECTS).filter(([file, p]) => !p.demo && (!only || file === only));
  if (!targets.length) { console.log('Nothing to capture (no file matches).'); return; }

  if (!checkOnly) {
    // software GL, as work-capture.mjs: Alliance's hero globe is WebGL
    const browser = await launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
    for (const [file, p] of targets) await capture(browser, file, p);
    await browser.close();
  }

  let off = 0;
  for (const [file] of targets) {
    if (!existsSync(join(OUT, file + '.webp'))) { console.warn(`✗ ${file}: no file`); off++; continue; }
    const d = await drift(file), b = await band(file);
    const dTxt = d === null ? 'no sheet frame' : `drift ${d.toFixed(1)}${d > DRIFT ? ' > ' + DRIFT + ': older or other than its sheet frame' : ''}`;
    const bTxt = `bottom 15% sd ${b.toFixed(1)}${b < BAND ? ' < ' + BAND + ': a blank band' : ''}`;
    const bad = (d !== null && d > DRIFT) || b < BAND;
    if (bad) off++;
    console.log(`${bad ? '✗' : '·'} ${file}: ${dTxt}; ${bTxt}`);
  }
  if (off) process.exitCode = 1;
}

run().catch((e) => { console.error(e); process.exit(1); });
