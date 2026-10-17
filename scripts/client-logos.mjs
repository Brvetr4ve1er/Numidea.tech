#!/usr/bin/env node
/**
 * The client logos of the home page's trust strip — `npm run logos`.
 * Needs the network; re-run only when a client changes its logo.
 *
 * Each file is the logo the client's live site shows in its header, taken
 * from that site and never redrawn. Before saving, the script checks that the
 * file it takes really is the header logo, and stops if a site has changed:
 *
 *   bordjsteel.svg  the inline <svg> in the header link ("Accueil Bordj Steel")
 *                   of bordjsteelb2b.netlify.app, as served, except that
 *                   transform-origin="center" (an SVG 2 attribute librsvg and
 *                   older WebKit ignore) is written as the matrix it means,
 *                   and the page's class and editor attributes are dropped.
 *   alliance.svg    alliancetravel34.netlify.app/assets/images/logo.svg. The
 *                   header inlines this drawing; the script compares their
 *                   path data and refuses a file that differs.
 *   almaflow.webp   almaflowclim.netlify.app/assets/images/logo-almaflow.png,
 *                   the header <img> (the site shows it as a white silhouette).
 *   nomara.webp     nomaravoyages.netlify.app/assets/images/logo-light.png,
 *                   the header logo in the site's dark mode (its stylesheet
 *                   swaps the <img> to it); logo-dark.png is the same drawing
 *                   in dark ink for the light mode.
 *
 * Colour stays as served: the page paints every logo in one theme colour
 * through a CSS mask (styles.css, "r3/b: client logos"), so no recoloured
 * copy is stored. Every file is cropped to its drawing (the viewBox, or the
 * transparent margin of a raster), so the strip sizes marks by their ink.
 * SVG path data is written to 2 decimals (Alliance's came with 6: at most
 * 0.005 of a viewBox unit, about 0.002 px at the strip's size; nothing is
 * redrawn). Rasters are resized for the strip (at most RASTER_H px tall,
 * about 2.5x their largest display height) and saved as WebP at quality 75,
 * alpha 70: the page only uses them as masks, and at the strip's size the
 * mask matches the lossless-alpha file (q90/alpha 100) to the eye at half
 * the bytes. The four files load with the page (the CSS mask is fetched when
 * the strip is styled, `loading="lazy"` or not): keep them small.
 *
 * Only the four delivered client sites have a logo here. Glaive Store (a
 * portfolio demo) and WorkspaceHQ (the studio's own product) are not clients.
 */
import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { launch } from './lib/serve.mjs';
import { ROOT } from './site.mjs';

const OUT = join(ROOT, 'assets/clients');
const RASTER_H = 96;
mkdirSync(OUT, { recursive: true });
const b = await launch();
const page = await b.newPage({ viewport: { width: 1280, height: 900 } });
const get = async (url) => {
  const r = await page.request.get(url, { timeout: 60000 });
  if (!r.ok()) throw new Error(`${url}: HTTP ${r.status()}`);
  return r.body();
};
const ACTIVE = /<script|<foreignObject|<image|\son[a-z]+=|javascript:/i;

/* Path data to 2 decimals, without the spaces around its commands. Neither
   logo uses arcs, whose packed flags a number pass would misread. */
const two = (n) => { const s = (+n).toFixed(2).replace(/\.?0+$/, ''); return s === '-0' ? '0' : s; };
function tidyPaths(svg) {
  if (/\sd="[^"]*[Aa]/.test(svg)) throw new Error('an SVG logo now draws arcs; teach tidyPaths their flags first');
  return svg.replace(/\sd="([^"]*)"/g, (_, d) => ` d="${d.replace(/-?\d*\.?\d+(?:e-?\d+)?/gi, two).replace(/\s+/g, ' ').replace(/ ?([A-Za-z]) ?/g, '$1').trim()}"`);
}

/* The drawing's box in viewBox units: rasterise at 4 px per unit, trim the
   transparent margin, map back. Clip paths and CSS classes are honoured
   (librsvg), so the box is what is painted, not what the paths span. */
async function cropSvg(svg) {
  const vb = /viewBox="([\d.\s-]+)"/.exec(svg)[1].trim().split(/\s+/).map(Number);
  const k = 4;
  const sized = svg.replace(/<svg\b[^>]*>/, (tag) => tag.replace(/\s(width|height)="[^"]*"/g, '')
    .replace('<svg', `<svg width="${vb[2] * k}" height="${vb[3] * k}"`));
  const { info } = await sharp(Buffer.from(sized)).trim({ background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer({ resolveWithObject: true });
  const pad = 1;
  const x = vb[0] - info.trimOffsetLeft / k - pad, y = vb[1] - info.trimOffsetTop / k - pad;
  const w = info.width / k + 2 * pad, h = info.height / k + 2 * pad;
  const r = (n) => Math.round(n * 10) / 10;
  return svg.replace(/<svg\b[^>]*>/, (tag) => tag
    .replace(/\s(width|height)="[^"]*"/g, '')
    .replace(/viewBox="[^"]*"/, `viewBox="${[x, y, w, h].map(r).join(' ')}" width="${Math.round(w)}" height="${Math.round(h)}"`));
}

async function raster(url, name) {
  const t = await sharp(await get(url)).trim({ background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer({ resolveWithObject: true });
  const info = await sharp(t.data).resize({ height: Math.min(RASTER_H, t.info.height), kernel: 'lanczos3' })
    .webp({ quality: 75, alphaQuality: 70, effort: 6 }).toFile(join(OUT, name));
  console.log(`✓ ${name} ${info.width}×${info.height}, ${info.size} bytes  ← ${url}`);
}

// Bordj Steel: the header's inline SVG, as the live page renders it
await page.goto('https://bordjsteelb2b.netlify.app/', { waitUntil: 'networkidle', timeout: 60000 });
let bs = await page.evaluate(() => document.querySelector('a[aria-label="Accueil Bordj Steel"] svg').outerHTML);
if (!/transform="scale\(1\.5\)" transform-origin="center"/.test(bs) || ACTIVE.test(bs)) throw new Error('Bordj Steel: the header logo changed shape; look at it before re-running');
bs = bs
  .replace(/<svg\b[^>]*>/, '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080">')
  // scale(1.5) about the centre of the 1080 viewBox
  .replace('transform="scale(1.5)" transform-origin="center"', 'transform="matrix(1.5 0 0 1.5 -270 -270)"')
  .replace(/<style type="text\/css">\s*([\s\S]*?)\s*<\/style>/, (_, css) => `<style>${css.replace(/\s+/g, ' ').replace(/\s*([{};:])\s*/g, '$1')}</style>`)
  .replace(/><\/(path|polygon|rect)>/g, '/>');
bs = tidyPaths(await cropSvg(bs));
writeFileSync(join(OUT, 'bordjsteel.svg'), bs + '\n');
console.log(`✓ bordjsteel.svg ${bs.length} bytes  ← header of bordjsteelb2b.netlify.app`);

// Alliance Travel: the file whose drawing the header inlines
await page.goto('https://alliancetravel34.netlify.app/', { waitUntil: 'networkidle', timeout: 60000 });
const inline = await page.evaluate(() => document.querySelector('.nav-logo svg').outerHTML);
const al = (await get('https://alliancetravel34.netlify.app/assets/images/logo.svg')).toString('utf8').trim();
const paths = (s) => [...s.matchAll(/\sd="([^"]*)"/g)].map((m) => m[1]).join('|');
if (paths(inline) !== paths(al)) throw new Error('Alliance Travel: logo.svg is no longer the drawing in the header');
if (ACTIVE.test(al)) throw new Error('Alliance Travel: logo.svg carries active or embedded content');
const alOut = tidyPaths(await cropSvg(al));
writeFileSync(join(OUT, 'alliance.svg'), alOut + '\n');
console.log(`✓ alliance.svg ${alOut.length} bytes  ← alliancetravel34.netlify.app/assets/images/logo.svg (= header)`);

// AlmaFlowClim: the header <img>
await page.goto('https://almaflowclim.netlify.app/', { waitUntil: 'networkidle', timeout: 60000 });
const amSrc = await page.evaluate(() => document.querySelector('.nav-logo img').currentSrc);
if (!amSrc.endsWith('/assets/images/logo-almaflow.png')) throw new Error('AlmaFlowClim: header logo is now ' + amSrc);
await raster(amSrc, 'almaflow.webp');

// Nomara Voyages: the header <img> of the dark mode (light ink)
const nmCss = (await get('https://nomaravoyages.netlify.app/assets/css/styles.css')).toString('utf8');
if (!/\[data-theme="dark"\]\s*\.nav-logo img\s*\{\s*content:\s*url\("\/assets\/images\/logo-light\.png"\)/.test(nmCss)) {
  throw new Error('Nomara: the dark-mode header no longer shows logo-light.png');
}
await raster('https://nomaravoyages.netlify.app/assets/images/logo-light.png', 'nomara.webp');
await b.close();
