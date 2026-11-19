#!/usr/bin/env node
/**
 * The Studio's short animation, cut down — `node scripts/build-hub-loops.mjs`
 * (not part of `npm run build`: it rewrites its own inputs, once).
 *
 * hub/img/studio/loops/kuro-sleep.webp (the footer's 56px icon) and
 * yasser-wave.webp (the contact card's 112px wave) were 31 and 22 frames at
 * 258px, 376 and 296 kB: 12% of a phone's page for two decorations at its end.
 * Each is now cut to twice the box it is shown in, every other frame at twice
 * the delay (the same length, the same count of plays, so the motion rule of
 * check.mjs 17b still holds: 3.2 s once, and 2 × 2.2 s), and its still beside
 * it (<name>-small-still.webp) at the same size; the full-size stills stay where the
 * character bible names them (kuro-sleep-still.webp), and yasser-wave-still.webp, which nothing
 * names any more, goes. app.js plays them only on a screen that has the room
 * for them and the data to spare (not a phone).
 * yasser-wave left with the contact stickers (2026-11-19: the contact card is
 * a painted scene now), and the footer's sleeping Kūro left the painted skyline
 * the same day (a cut-out on a painting), so nothing is left to cut: kuro-sleep.webp
 * and its small still are gone, and the full-size still stays for the bible and the radio.
 * Run on the committed files it halves them again if run twice: it reads the
 * frame count and stops when the animation is already cut (≤ 16 frames).
 */
import sharp from 'sharp';
import { readFileSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from './site.mjs';

const DIR = join(ROOT, 'hub/img/studio/loops');
const JOBS = [];   // was: { name: 'kuro-sleep', w: 112, q: 55 } (the footer icon, removed 2026-11-19)
for (const { name, w, q } of JOBS) {
  const file = join(DIR, `${name}.webp`), still = join(DIR, `${name}-still.webp`), small = join(DIR, `${name}-small-still.webp`);
  const src = readFileSync(file);
  const meta = await sharp(src, { animated: true }).metadata();
  if (meta.pages <= 16) { console.log(`${name}: ${meta.pages} frames, already cut`); continue; }
  const pageH = meta.pageHeight, loop = meta.loop;
  const keep = [...Array(meta.pages).keys()].filter((i) => i % 2 === 0);
  const frames = [];
  for (const i of keep) {
    frames.push(await sharp(src, { page: i }).resize({ width: w, kernel: 'lanczos3' }).ensureAlpha().raw().toBuffer({ resolveWithObject: true }));
  }
  const fw = frames[0].info.width, fh = frames[0].info.height;
  const stack = Buffer.concat(frames.map((f) => f.data));
  const delay = keep.map((i, k) => (meta.delay[i] || 100) + (meta.delay[i + 1] ?? meta.delay[i] ?? 100));
  const out = await sharp(stack, { raw: { width: fw, height: fh * frames.length, channels: 4, pageHeight: fh } })
    .webp({ quality: q, effort: 6, alphaQuality: 80, loop, delay, minSize: false, smartSubsample: true }).toBuffer();
  writeFileSync(file, out);
  const st = await sharp(readFileSync(still)).resize({ width: w, kernel: 'lanczos3' }).webp({ quality: 78, effort: 6, alphaQuality: 85, smartSubsample: true }).toBuffer();
  writeFileSync(small, st);
  console.log(`${name}: ${meta.width}×${pageH} ${meta.pages} frames ${statSync(file).size - out.length + out.length} → ${fw}×${fh} ${frames.length} frames, ${out.length} B; still ${st.length} B`);
}
