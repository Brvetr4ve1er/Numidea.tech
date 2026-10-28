#!/usr/bin/env node
/**
 * Hub art: `npm run hub:art` → hub/art/*.webp and hub/loops/*.webp
 *
 * Cuts the hub's web images from the owner's private masters, following the
 * recipe in scripts/hub-art-data.mjs. The masters are not in this public
 * repository: put the masters folder at ./campaign/hub-art/masters
 * (git-ignored) or point HUB_ART_DIR at it. This is not part of
 * `npm run build`: CI has no masters, and the committed images are its output.
 *
 * 1. Every master is checked first: present, its sha256 and its pixel size
 *    (and alpha) as pinned in the recipe. Any mismatch stops the build
 *    before a file is written.
 * 2. Still images: each crop box is cut once and resized to each width
 *    (width and height given, so the three hero layers of one crop come out
 *    the same size and stay registered), then encoded as WebP. Opaque
 *    masters give opaque files, masters with alpha keep it.
 * 3. Loops: the animated master is resized frame by frame, frames are merged
 *    in groups (`step`), alpha is rounded to `alphaLevels` levels, and the
 *    frames are encoded again with the master's loop count, set explicitly.
 *    The output is read back: frame count, frame size, loop count and total
 *    duration must be what was asked, the loop finite and its motion at most
 *    MOTION_MS. No frame may have a visible pixel in its outer EDGE px (a
 *    die-cut sticker cut off by the canvas shows a straight edge). The
 *    poster frame is written beside it at the same size, held to the same
 *    edge.
 * 4. A table of every output (bytes, width, height) and the srcset, src and
 *    data-full strings for the page. A file over CEILING is not written, and
 *    the build fails.
 *
 * Files in hub/art and hub/loops that the recipe does not write are listed,
 * never deleted (the Behance covers, KEEP, are expected).
 */
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { join, resolve, relative } from 'node:path';
import sharp from 'sharp';
import { ROOT } from './site.mjs';
import { ENCODE, CEILING, MOTION_MS, MASTERS, IMAGES, LOOP_ENCODE, EDGE, LOOPS, KEEP } from './hub-art-data.mjs';

const SRC = resolve(process.env.HUB_ART_DIR || join(ROOT, 'campaign/hub-art/masters'));
const ART = join(ROOT, 'hub/art'), LOOPDIR = join(ROOT, 'hub/loops');
const kB = (n) => (n / 1000).toFixed(1) + ' kB';
const sum = (a) => a.reduce((x, y) => x + y, 0);

if (!existsSync(SRC)) {
  console.error(`✗ hub art masters not found at ${SRC}: put the masters folder there or set HUB_ART_DIR`);
  process.exit(1);
}

/* 1. the masters */
const srcErr = [];
for (const [file, want] of Object.entries(MASTERS)) {
  const p = join(SRC, file);
  if (!existsSync(p)) { srcErr.push(`${file} is missing`); continue; }
  const hash = createHash('sha256').update(readFileSync(p)).digest('hex');
  if (hash !== want.sha256) srcErr.push(`${file} has sha256 ${hash.slice(0, 12)}…, the recipe pins ${want.sha256.slice(0, 12)}…`);
  const m = await sharp(p, { animated: true }).metadata();
  const h = m.pageHeight || m.height;
  if (m.width !== want.w || h !== want.h) srcErr.push(`${file} is ${m.width}×${h}, the recipe says ${want.w}×${want.h}`);
  if (Boolean(m.hasAlpha) !== want.alpha) srcErr.push(`${file} ${m.hasAlpha ? 'has' : 'has no'} alpha, the recipe says ${want.alpha ? 'alpha' : 'opaque'}`);
}
if (srcErr.length) {
  console.error(`✗ hub art masters at ${SRC} do not match scripts/hub-art-data.mjs:\n  ` + srcErr.join('\n  '));
  process.exit(1);
}
console.log(`✓ ${Object.keys(MASTERS).length} masters match their size and sha256 (${relative(ROOT, SRC) || SRC})`);

mkdirSync(ART, { recursive: true });
mkdirSync(LOOPDIR, { recursive: true });
const rows = [], fail = [], written = new Set(), html = [];
const put = (dir, file, buf, w, h, note = '') => {
  const rel = relative(ROOT, join(dir, file));
  rows.push([rel, buf.length, w, h, note]);
  written.add(rel);
  if (buf.length > CEILING) { fail.push(`${rel} is ${buf.length.toLocaleString('en')} bytes, over the ${CEILING.toLocaleString('en')} ceiling (not written)`); return; }
  writeFileSync(join(dir, file), buf);
};

/* 2. still images */
for (const img of IMAGES) {
  const want = MASTERS[img.master];
  const box = img.box || { left: 0, top: 0, width: want.w, height: want.h };
  if (box.left + box.width > want.w || box.top + box.height > want.h) { fail.push(`${img.name}: crop box falls outside ${img.master}`); continue; }
  const widths = [...new Set([...img.widths, ...(img.full ? [img.full] : [])])].sort((a, b) => a - b);
  const cut = sharp(join(SRC, img.master)).extract(box);
  const sizes = {};
  await Promise.all(widths.map(async (w) => {
    if (w > box.width) { fail.push(`${img.name}-${w}: wider than its crop (${box.width}); the recipe never upscales`); return; }
    const h = Math.round(box.height * w / box.width);
    const buf = await cut.clone().resize({ width: w, height: h, fit: 'fill' }).webp(ENCODE).toBuffer();
    const m = await sharp(buf).metadata();
    if (m.width !== w || m.height !== h) fail.push(`${img.name}-${w}: came out ${m.width}×${m.height}, expected ${w}×${h}`);
    if (Boolean(m.hasAlpha) !== want.alpha) fail.push(`${img.name}-${w}: alpha ${m.hasAlpha ? 'present' : 'lost'}`);
    sizes[w] = [w, h];
    put(ART, `${img.name}-${w}.webp`, buf, w, h, img.full === w ? 'lightbox' : want.alpha ? 'alpha' : '');
  }));
  const list = img.widths.filter((w) => sizes[w]);
  const [tw, th] = sizes[list[list.length - 1]] || [];
  html.push(`${img.name}: srcset="${list.map((w) => `art/${img.name}-${w}.webp ${w}w`).join(', ')}" width="${tw}" height="${th}"`
    + (img.full && sizes[img.full] ? ` data-full="art/${img.name}-${img.full}.webp" data-w="${sizes[img.full][0]}" data-h="${sizes[img.full][1]}"` : ''));
}

/* 3. loops */
for (const loop of LOOPS) {
  const file = join(SRC, loop.master);
  const m = await sharp(file, { animated: true }).metadata();
  const pages = m.pages || 1, ph = m.pageHeight || m.height, delays = m.delay || [];
  const total = sum(delays);
  if (!(m.loop >= 1)) { fail.push(`${loop.name}: the master's loop count is ${m.loop} (0 plays forever); it must be finite`); continue; }
  if (pages < 2 || delays.length !== pages) { fail.push(`${loop.name}: the master is not an animation with one delay per frame`); continue; }
  if (m.loop * total > MOTION_MS) { fail.push(`${loop.name}: the master moves for ${m.loop * total} ms, over ${MOTION_MS}`); continue; }
  if (MASTERS[loop.still].w !== m.width || MASTERS[loop.still].h !== ph) { fail.push(`${loop.name}: the still master is not the animation's size`); continue; }
  // the longest side to `long` (an animated input is resized frame by frame)
  const { data, info } = await sharp(file, { animated: true }).resize(ph > m.width ? { height: loop.long } : { width: loop.long })
    .ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  if (info.height % pages) { fail.push(`${loop.name}: resized height ${info.height} is not a whole number of frames`); continue; }
  const w = info.width, h = info.height / pages, fb = w * h * 4;
  // frames merged in groups of `step`; the last (poster) frame always kept on its own
  const keep = [], delay = [];
  for (let p = 0; p < pages; p += loop.step) { keep.push(p); delay.push(sum(delays.slice(p, p + loop.step))); }
  if (keep[keep.length - 1] !== pages - 1) { delay[delay.length - 1] -= delays[pages - 1]; keep.push(pages - 1); delay.push(delays[pages - 1]); }
  const frames = Buffer.alloc(keep.length * fb);
  keep.forEach((p, i) => data.copy(frames, i * fb, p * fb, (p + 1) * fb));
  const L = loop.alphaLevels - 1;
  for (let i = 0; i < frames.length; i += 4) {
    const a = Math.round(Math.round(frames[i + 3] * L / 255) * 255 / L);
    frames[i + 3] = a;
    if (a === 0) frames[i] = frames[i + 1] = frames[i + 2] = 0;   // nothing hidden under clear pixels
  }
  // the outer EDGE px of every frame are clear
  const edgeHits = (buf, n) => {
    const hit = [];
    for (let f = 0; f < n; f++) {
      let bad = 0;
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        if (y >= EDGE && y < h - EDGE && x === EDGE) x = w - EDGE;   // skip the inside of the row
        if (buf[f * fb + (y * w + x) * 4 + 3] > 0) bad++;
      }
      if (bad) hit.push(`${f}:${bad}px`);
    }
    return hit;
  };
  const hits = edgeHits(frames, keep.length);
  if (hits.length) fail.push(`${loop.name}: ${hits.length} frames have visible pixels in their outer ${EDGE} px (${hits.slice(0, 4).join(', ')}${hits.length > 4 ? ', …' : ''}): the sticker is cut by the canvas edge`);
  const buf = await sharp(frames, { raw: { width: w, height: h * keep.length, channels: 4, pageHeight: h } })
    .webp({ ...LOOP_ENCODE, loop: m.loop, delay }).toBuffer();
  const o = await sharp(buf, { animated: true }).metadata();
  const oTotal = sum(o.delay || []);
  if (o.pages !== keep.length || o.width !== w || o.pageHeight !== h) fail.push(`${loop.name}: came out ${o.pages} frames of ${o.width}×${o.pageHeight}, expected ${keep.length} of ${w}×${h}`);
  if (o.loop !== m.loop) fail.push(`${loop.name}: loop count ${o.loop} after encoding, the master has ${m.loop}`);
  if (oTotal !== total) fail.push(`${loop.name}: frame delays sum to ${oTotal} ms after encoding, the master's to ${total} ms`);
  if (!(o.loop >= 1) || o.loop * oTotal > MOTION_MS) fail.push(`${loop.name}: moves for ${o.loop} × ${oTotal} ms, over ${MOTION_MS} ms or endless`);
  put(LOOPDIR, `${loop.name}.webp`, buf, w, h, `${o.pages} frames, ${o.loop} × ${oTotal} ms = ${o.loop * oTotal} ms (master ${pages} frames)`);
  const stillRaw = await sharp(join(SRC, loop.still)).resize({ width: w, height: h, fit: 'fill' }).ensureAlpha().raw().toBuffer();
  const stillHits = edgeHits(stillRaw.map((v, i) => (i % 4 === 3 && v <= 8 ? 0 : v)), 1);   // resampling may leave a trace of 1-8
  if (stillHits.length) fail.push(`${loop.name}: the still has visible pixels in its outer ${EDGE} px (${stillHits[0]})`);
  const still = await sharp(join(SRC, loop.still)).resize({ width: w, height: h, fit: 'fill' }).webp(ENCODE).toBuffer();
  put(LOOPDIR, `${loop.name}-still.webp`, still, w, h, 'poster frame');
  html.push(`${loop.name}: src="loops/${loop.name}-still.webp" data-anim="loops/${loop.name}.webp" width="${w}" height="${h}"`);
}

/* 4. report */
rows.sort((a, b) => a[0].localeCompare(b[0], 'en', { numeric: true }));
const pad = Math.max(...rows.map((r) => r[0].length));
console.log(`\n${'file'.padEnd(pad)}       bytes   width  height`);
for (const [f, n, w, h, note] of rows) console.log(`${f.padEnd(pad)} ${n.toLocaleString('en').padStart(11)} ${String(w).padStart(7)} ${String(h).padStart(7)}${note ? '  ' + note : ''}`);
const largest = rows.reduce((a, r) => (r[1] > a[1] ? r : a), rows[0]);
console.log(`${rows.length} files, ${kB(sum(rows.map((r) => r[1])))}; largest ${largest[0]} ${kB(largest[1])} (ceiling ${kB(CEILING)})`);
console.log('\nfor hub/index.html (paths relative to the page):\n  ' + html.join('\n  '));

const others = [[ART, 'hub/art'], [LOOPDIR, 'hub/loops']].flatMap(([dir, rel]) => readdirSync(dir)
  .filter((f) => !written.has(`${rel}/${f}`) && !KEEP.some((re) => rel === 'hub/art' && re.test(f))).map((f) => `${rel}/${f}`));
if (others.length) console.log(`\nnot written by this recipe (left in place): ${others.length} files: ${others.slice(0, 6).join(', ')}${others.length > 6 ? ', …' : ''}`);

if (fail.length) {
  console.error('\n✗ hub art: ' + fail.join('\n  '));
  process.exit(1);
}
console.log(`\n✓ hub art: ${rows.length} files written to hub/art and hub/loops`);
