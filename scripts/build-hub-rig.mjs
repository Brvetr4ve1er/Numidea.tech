#!/usr/bin/env node
/**
 * hub/bible/art from the character bible's drawings —
 * `HUB_BIBLE_DIR=/path/to/mascot node scripts/build-hub-rig.mjs`
 *
 * The masters are the owner's character sheet exports (RGBA PNG, private,
 * never deployed: the folder the owner keeps them in is named by
 * HUB_BIBLE_DIR, the `mascot/` folder of the export, with anim/, clean/,
 * poses/ and v3/ under it). This cuts them into hub/bible/art as the page names
 * them (hub/bible/index.html), WebP, quality 80 and alpha 85 like
 * build-hub-art.mjs (the rig's frames at 75), nothing upscaled: every master is smaller than twice
 * the box the page shows it in, so each ships at its own size, except
 * Kūro's ten cards, shown in 110px tiles and cut to 240px wide, the twelve
 * poses, shown in 5:4 boxes of 300px at most and cut to fit 560×440, and
 * the six actors' frames, shown 270px tall at most and cut to 540px tall.
 *   hub/bible/art/rig-y-<frame>.webp   the 13 Yasser frames of the live rig (501×565)
 *   hub/bible/art/rig-k-<frame>.webp   the 7 Kūro frames (360×294); flat, not in a
 *                                folder, because check.mjs block 17b reads
 *                                hub/bible/art one level deep
 *   hub/bible/art/face-<name>.webp     the twelve faces (section 03, and 06's thumbs)
 *   hub/bible/art/pose-<name>.webp     what he does (section 04)
 *   hub/bible/art/actor-<name>-{a,b}.webp   head to toe, two frames each (04b);
 *                                actor-duo-a is also the cover's picture
 *   hub/bible/art/kuro-<name>.webp     Kūro's ten cards (section 05)
 *   hub/bible/art/sil-<n>.webp         the four pixel silhouettes (section 02)
 * It fails on a rig frame over 60 kB, a rig set over 1.2 MB, any other file
 * over 300 kB, a master that is missing, or a source frame whose size is
 * not the rig's. It is not part of `npm run build`: CI has no masters, and
 * the committed files are its output. The page's width/height attributes
 * are the sizes it prints at the end (one line per file), so a re-export
 * that changes a size shows up in check.mjs block 17b.
 */
import { mkdirSync, statSync, existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';
import { ROOT } from './site.mjs';

const SRC = process.env.HUB_BIBLE_DIR;
if (!SRC || !existsSync(join(SRC, 'anim'))) {
  console.error('✗ HUB_BIBLE_DIR must name the character bible\'s mascot/ folder (anim/, clean/, poses/, v3/ inside)');
  process.exit(1);
}
const OUT = join(ROOT, 'hub/bible/art');
mkdirSync(OUT, { recursive: true });

const WEBP = { quality: 80, alphaQuality: 85, effort: 6 };
// the rig's twenty frames at 75: drawn line work, and the set is fetched whole
const WEBP_RIG = { quality: 75, alphaQuality: 85, effort: 6 };
const kB = 1000;
const RIG_FRAME_MAX = 60 * kB, RIG_SET_MAX = 1.2e6, FILE_MAX = 300 * kB;
const RIG = { y: [501, 565], k: [360, 294] };

const Y = ['base', 'half', 'blink', 'smirk', 'glance', 'glance-r', 'up', 'sip', 'talk-a', 'talk-b', 'yawn', 'laugh', 'glasses'];
const K = ['base', 'blink', 'wide', 'left', 'right', 'yawn', 'ear'];
const FACES = ['smirk', 'focus', 'think', 'pointyou', 'laugh', 'deadpan', 'sideeye', 'shocked', 'facepalm', 'tired', 'sleep', 'angry'];
const POSES = ['y-coffee', 'y-laptop', 'y-point', 'y-shrug', 'y-sign', 'y-facepalm', 'sc-inspect', 'sc-receipt', 'sc-invoice', 'sc-flagstack', 'sc-handover', 'sc-nap'];
const ACTORS = ['wave', 'pointup', 'phone', 'sketch', 'win', 'duo'];
const KURO = ['judge', 'loaf', 'smug', 'stamp', 'peek', 'shook', 'hiss', 'love', 'leave', 'mug'];
const SIL = [0, 2, 3, 5];

const jobs = [];
const job = (from, to, opts = {}) => jobs.push({ from: join(SRC, from), to, ...opts });
for (const f of Y) job(`anim/y-${f}.png`, `rig-y-${f}.webp`, { rig: 'y' });
for (const f of K) job(`anim/k-${f}.png`, `rig-k-${f}.webp`, { rig: 'k' });
for (const f of FACES) job(`clean/ye-${f}.png`, `face-${f}.webp`);
for (const f of POSES) job(`clean/${f}.png`, `pose-${f.replace(/^(y|sc)-/, '')}.webp`, { width: 560, height: 440 });
for (const f of ACTORS) for (const ab of ['a', 'b']) job(`poses/${f}-${ab}.png`, `actor-${f}-${ab}.webp`, { height: 540 });
for (const f of KURO) job(`clean/ke-${f}.png`, `kuro-${f}.webp`, { width: 240 });
for (const n of SIL) job(`v3/pose-${n}.png`, `sil-${n}.webp`);

const err = [], sizes = [];
let rigBytes = 0;
for (const j of jobs) {
  if (!existsSync(j.from)) { err.push(`missing master ${j.from}`); continue; }
  const meta = await sharp(j.from).metadata();
  if (j.rig) {
    const want = RIG[j.rig];
    if (meta.width !== want[0] || meta.height !== want[1]) err.push(`${j.from} is ${meta.width}×${meta.height}, not the rig's ${want.join('×')}`);
  }
  let s = sharp(j.from);
  // cut to fit the box, never upscaled (withoutEnlargement), the ratio kept
  if ((j.width && meta.width > j.width) || (j.height && meta.height > j.height)) s = s.resize({ width: j.width, height: j.height, fit: 'inside', withoutEnlargement: true });
  const buf = await s.webp(j.rig ? WEBP_RIG : WEBP).toBuffer();
  const out = join(OUT, j.to);
  writeFileSync(out, buf);
  const m = await sharp(buf).metadata();
  const n = statSync(out).size;
  sizes.push(`${j.to} ${m.width}×${m.height} ${n.toLocaleString('en')} B`);
  if (j.rig) { rigBytes += n; if (n > RIG_FRAME_MAX) err.push(`${j.to} is ${n} B, over ${RIG_FRAME_MAX}`); }
  else if (n > FILE_MAX) err.push(`${j.to} is ${n} B, over ${FILE_MAX}`);
}
if (rigBytes > RIG_SET_MAX) err.push(`the rig's ${Y.length + K.length} frames weigh ${rigBytes} B, over ${RIG_SET_MAX}`);
for (const s of sizes) console.log('  ' + s);
console.log(`rig set: ${rigBytes.toLocaleString('en')} B in ${Y.length + K.length} frames`);
if (err.length) { console.error('✗ ' + err.join('\n✗ ')); process.exit(1); }
console.log(`✓ ${jobs.length} files written to hub/bible/art`);
