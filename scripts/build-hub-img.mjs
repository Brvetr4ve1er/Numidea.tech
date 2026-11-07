#!/usr/bin/env node
/**
 * hub/img from the Studio design's pictures —
 * `HUB_STUDIO_DIR=/path/to/project node scripts/build-hub-img.mjs`
 *
 * The masters are the owner's Studio design export (JPEG, PNG, SVG; private,
 * never deployed: the folder holding them is named by HUB_STUDIO_DIR, the
 * export's project root, with assets/, mascot/ and motion/ under it). This
 * cuts them into hub/img under the path the design gives them minus
 * "assets/", WebP, nothing upscaled: each thumb is cut to twice the box the
 * page shows it in (measured at 390, 820 and 1440 wide), and the pictures a
 * visitor can open get a second file, <name>.full.webp, at the size the
 * lightbox shows (1520 px on the long edge at most). The drawings the
 * character bible already ships (the rig, the actors, Kūro's cards, the
 * faces) are not exported again: check.mjs refuses two files with the same
 * bytes, so the Studio names hub/bible/art for them.
 *   photos and renders q78, posters q80, cutouts q82 with alpha 90, effort 6
 *   motion/sting-*.webp   the opening, landscape and portrait
 *   mascot/v2/grain.webp  the paper's grain, already laid on the paper colour
 *                         at the design's 32%: one opaque tile, no blend mode
 *   mascot/clean/y-sign   the one cutout the bible does not hold
 *   the two client logos (svg) vector logos, metadata stripped (a content
 *                         credential block of 40 kB rode inside each)
 * It is not part of `npm run build`: CI has no masters, and the committed
 * files are its output. The page's width/height attributes are the sizes it
 * prints at the end (one line per file).
 */
import { mkdirSync, statSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import sharp from 'sharp';
import { ROOT } from './site.mjs';

const SRC = process.env.HUB_STUDIO_DIR;
if (!SRC || !existsSync(join(SRC, 'assets/clients'))) {
  console.error('✗ HUB_STUDIO_DIR must name the Studio export\'s project folder (assets/, mascot/, motion/ inside)');
  process.exit(1);
}
const OUT = join(ROOT, 'hub/img');

const PHOTO = { quality: 78, effort: 6 };
const POSTER = { quality: 80, effort: 6 };
const CUTOUT = { quality: 82, alphaQuality: 90, effort: 6 };
const HEAVY = 200e3;
const PAPER = [0xD8, 0xCB, 0xB8];   // --paper, hub/style.css
const GRAIN = 0.32;                 // the design's overlay opacity

// [master under assets/ (mascot/ and motion/ at the root), thumb width, thumb height, lightbox width (0 = none)]
const PLAN = [
  ["clients/alliance/c-egypt-flyer.jpg", 301, 580, 700],
  ["clients/alliance/c-egypt-post.jpg", 460, 575, 900],
  ["clients/alliance/c-istanbul.jpg", 407, 576, 900],
  ["clients/alliance/heroes/hero__azerbaidjan--bg--mobile.jpg", 900, 599, 0],
  ["clients/alliance/heroes/hero__istanbul--bg--mobile.jpg", 900, 506, 0],
  ["clients/alliance/m-billboard.jpg", 952, 536, 1520],
  ["clients/alliance/m-egypt.jpg", 464, 576, 928],
  ["clients/alliance/m-istanbul.jpg", 928, 1152, 0],
  ["clients/alliance/m-kit.jpg", 769, 580, 1520],
  ["clients/alliance/m-store.jpg", 870, 580, 1520],
  ["clients/alliance/m-story.jpg", 464, 825, 891],
  ["clients/almaflow/m-cards.jpg", 769, 580, 1520],
  ["clients/almaflow/m-hanger.jpg", 464, 576, 928],
  ["clients/almaflow/m-phone.jpg", 464, 576, 928],
  ["clients/almaflow/m-shop.jpg", 870, 580, 1520],
  ["clients/almaflow/m-tech.jpg", 928, 1152, 0],
  ["clients/almaflow/m-van.jpg", 952, 635, 1520],
  ["clients/almaflow/x-ac.jpg", 952, 1692, 0],
  ["clients/bordj/h-charpente.jpg", 1400, 784, 0],
  ["clients/bordj/h-chaud.jpg", 952, 533, 0],
  ["clients/bordj/h-galva.jpg", 952, 533, 0],
  ["clients/bordj/h-sandwich.jpg", 952, 533, 0],
  ["clients/bordj/p-chaudfroid.jpg", 464, 580, 1100],
  ["clients/bordj/p-conception.jpg", 944, 1180, 0],
  ["clients/bordj/p-cuves.jpg", 460, 575, 1100],
  ["clients/bordj/p-galva.jpg", 460, 575, 1080],
  ["clients/bordj/p-mains.jpg", 944, 1180, 0],
  ["clients/bordj/p-resist.jpg", 944, 1180, 0],
  ["clients/bordj/p-site.jpg", 460, 575, 1080],
  ["clients/bordj/p-tower.jpg", 460, 575, 1100],
  ["clients/bordj/r-cold.jpg", 859, 576, 0],
  ["clients/bordj/r-roof.jpg", 386, 575, 0],
  ["clients/bordj/r-trap.jpg", 386, 575, 0],
  ["clients/bordj/r-wall.jpg", 859, 576, 0],
  ["clients/bordj/ref-condor.jpg", 442, 249, 0],
  ["clients/bordj/ref-duct.jpg", 442, 295, 0],
  ["clients/bordj/ref-softal.jpg", 442, 330, 0],
  ["clients/bordj/ref-utec.jpg", 442, 295, 0],
  ["clients/bordj/s-weld.jpg", 1400, 933, 0],
  ["clients/heetch/m-bill.jpg", 870, 580, 1400],
  ["clients/heetch/m-duo.jpg", 464, 576, 928],
  ["clients/heetch/m-merch.jpg", 928, 1152, 0],
  ["clients/heetch/m-phone.jpg", 464, 576, 928],
  ["clients/traveler/inkportrait.jpg", 978, 978, 0],
  ["clients/traveler/l-2104.jpg", 948, 533, 1200],
  ["clients/traveler/labyrinth.jpg", 882, 1176, 0],
  ["clients/traveler/m-flat.jpg", 928, 1152, 0],
  ["clients/traveler/m-hoodie.jpg", 464, 576, 928],
  ["clients/traveler/m-stickers.jpg", 580, 580, 1400],
  ["clients/traveler/m-store.jpg", 870, 580, 1400],
  ["clients/traveler/m-worn.jpg", 464, 576, 928],
  ["clients/traveler/peace.jpg", 900, 1200, 0],
  ["studio/c08.jpg", 636, 900, 0],
  ["studio/c09.jpg", 636, 900, 0],
  ["studio/c10.jpg", 715, 894, 0],
  ["studio/c11.jpg", 600, 900, 0],
  ["studio/m/desk.jpg", 1600, 893, 0],
  ["studio/m/diorama.jpg", 1132, 759, 0],
  ["studio/m/props.jpg", 814, 546, 0],
  ["studio/m/sunset.jpg", 823, 552, 0],
  ["mascot/clean/y-sign.png", 640, 543, 0],
];
const WEBP_PASS = ['clients/bordj/l-cevital.webp', 'clients/bordj/l-condor.webp', 'clients/bordj/l-hyundai.webp', 'clients/bordj/l-mobilis.webp', 'clients/bordj/l-sonatrach.webp', 'clients/bordj/l-sonelgaz.webp'];

const masterOf = (m) => join(SRC, /^(mascot|motion)\//.test(m) ? m : join('assets', m));
const jobs = [];
for (const [m, w, h, fw] of PLAN) {
  const to = m.replace(/\.(jpg|png|webp)$/, '.webp');
  const poster = /^studio\/c\d|^clients\/(alliance\/c-|bordj\/p-)/.test(m);
  jobs.push({ from: masterOf(m), to, w, h, opts: /\.png$/.test(m) ? CUTOUT : poster ? POSTER : PHOTO });
  if (fw) jobs.push({ from: masterOf(m), to: to.replace(/\.webp$/, '.full.webp'), w: fw, opts: PHOTO });
}

const err = [], sizes = [];
let total = 0;
const put = async (to, buf) => {
  const f = join(OUT, to);
  mkdirSync(dirname(f), { recursive: true });
  writeFileSync(f, buf);
  total += buf.length;
};
for (const j of jobs) {
  if (!existsSync(j.from)) { err.push(`missing master ${j.from}`); continue; }
  const meta = await sharp(j.from).metadata();
  const w = Math.min(j.w, meta.width);   // never upscale
  const cut = (o) => sharp(j.from).resize({ width: w, withoutEnlargement: true }).webp(o).toBuffer({ resolveWithObject: true });
  let out = await cut(j.opts);
  // film grain and paper texture do not compress: a file over 200 kB is cut again at 70
  if (out.data.length > HEAVY && !j.opts.alphaQuality) out = await cut({ ...j.opts, quality: 70 });
  await put(j.to, out.data);
  sizes.push(`${j.to} ${out.info.width}×${out.info.height} ${out.data.length}`);
}

// the six client logos the design already holds as WebP: cut to the 162×76 the page shows (2×)
for (const m of WEBP_PASS) {
  const from = masterOf(m);
  if (!existsSync(from)) { err.push(`missing master ${from}`); continue; }
  const out = await sharp(from).resize({ width: 162, withoutEnlargement: true }).webp(CUTOUT).toBuffer({ resolveWithObject: true });
  await put(m, out.data);
  sizes.push(`${m} ${out.info.width}×${out.info.height} ${out.data.length}`);
}

// the opening: 1920×1080 for a landscape window, 900×1600 for a portrait one
for (const [from, to, w] of [['motion/sting-169.jpg', 'motion/sting-169.webp', 1920], ['motion/sting-916.jpg', 'motion/sting-916.webp', 900]]) {
  const out = await sharp(masterOf(from)).resize({ width: w, withoutEnlargement: true }).webp({ quality: 78, effort: 6 }).toBuffer({ resolveWithObject: true });
  await put(to, out.data);
  sizes.push(`${to} ${out.info.width}×${out.info.height} ${out.data.length}`);
}

// the grain: the design multiplies a transparent tile over the page at 32%;
// laid once on the paper colour it is the same picture without a fixed layer
{
  const { data, info } = await sharp(masterOf('mascot/v2/grain.png')).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const px = Buffer.alloc(info.width * info.height * 3);
  for (let i = 0, o = 0; i < data.length; i += 4, o += 3) {
    const a = data[i + 3] / 255;
    for (let c = 0; c < 3; c++) {
      const g = (data[i + c] / 255) * a + (1 - a);          // the tile over white
      px[o + c] = Math.round(PAPER[c] * (1 - GRAIN + GRAIN * g));
    }
  }
  const out = await sharp(px, { raw: { width: info.width, height: info.height, channels: 3 } }).webp({ quality: 85, effort: 6 }).toBuffer({ resolveWithObject: true });
  await put('mascot/v2/grain.webp', out.data);
  sizes.push(`mascot/v2/grain.webp ${out.info.width}×${out.info.height} ${out.data.length}`);
}

// the AlmaFlow logo: shown 80 px tall at most, cut to 160
{
  const out = await sharp(masterOf('clients/almaflow/logo.png')).resize({ height: 160, withoutEnlargement: true }).webp(CUTOUT).toBuffer({ resolveWithObject: true });
  await put('clients/almaflow/logo.webp', out.data);
  sizes.push(`clients/almaflow/logo.webp ${out.info.width}×${out.info.height} ${out.data.length}`);
}

// the two vector logos: drop the content credential block, the editor
// namespaces and the comments; the viewBox stays, so the page sizes them
for (const m of ['clients/bordj/logo.svg', 'clients/alliance/logo-cream.svg']) {
  let s = readFileSync(masterOf(m), 'utf8');
  s = s.replace(/<\?xml[^>]*\?>/g, '').replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<metadata[\s\S]*?<\/metadata>/g, '')
    .replace(/\s+xmlns:c2pa="[^"]*"/g, '')
    .replace(/<svg\b[^>]*>/, (tag) => tag.replace(/\s+(xml:space|zoomAndPan|preserveAspectRatio|version|x|y|class)="[^"]*"/g, ''))
    .replace(/>\s+</g, '><').trim() + '\n';
  if (!/viewBox=/.test(s)) err.push(`${m} lost its viewBox`);
  if (/c2pa|manifest/i.test(s)) err.push(`${m} still carries a manifest`);
  await put(m, Buffer.from(s));
  sizes.push(`${m} ${Buffer.byteLength(s)}`);
}

console.log(sizes.join('\n'));
console.log(`${sizes.length} files, ${total} bytes`);
if (err.length) { console.error('✗ ' + err.join('\n✗ ')); process.exit(1); }
