/**
 * The hub's art recipe: data only, read by scripts/build-hub-art.mjs
 * (`npm run hub:art`). Importing it has no side effects.
 *
 * The masters are the owner's illustrations of himself and his black cat
 * Kūro. They are private (campaign/hub-art/masters, git-ignored, never
 * deployed); only the web images the build cuts from them are committed,
 * in hub/art and hub/loops. Each master is pinned here by its pixel size,
 * whether it has alpha, and its sha256, so a re-exported or mixed-up file
 * fails the build instead of shipping.
 *
 * Coordinates are master pixels. An output width is never above its crop's
 * own width (no upscaling), and each file is named by its real width, so a
 * srcset descriptor `NNNw` always equals the width of the file it names.
 * Heights follow from the crop's ratio, rounded to the pixel.
 */

/* WebP settings for every still image. Sharp chroma subsampling keeps the
   thin burgundy, navy and teal lines of the line art from bleeding, for
   about 3% more bytes. */
export const ENCODE = { quality: 80, effort: 6, alphaQuality: 85, smartSubsample: true };

/* No single output above this (bytes). */
export const CEILING = 400 * 1000;

/* A loop plays for at most this long in total: its loop count times the sum
   of its frame delays. Auto-starting motion over 5 s needs a pause control
   (WCAG 2.2.2); the loops have none, so they stop before. */
export const MOTION_MS = 5000;

export const MASTERS = {
  'band-design.png': { w: 2752, h: 1536, alpha: false, sha256: 'd9a815b29dc60f1110c8af1aba694c0e55e48f19d26b04bacdb432275a62aea7' },
  'band-diary.png': { w: 2752, h: 1536, alpha: false, sha256: 'e59ce2505eca23d4923c3f30e1d4c767b5369323d32d289af4505867f64e3399' },
  'diary-4am.png': { w: 2528, h: 1696, alpha: false, sha256: 'ee1918b211d8835391aa15a681dbcf54cf4bcdde6bf4f2a452fe4e921a28acd4' },
  'diary-art-director.png': { w: 1264, h: 848, alpha: false, sha256: '3c8ec97d4b83b11f9e83e6d8e4b3b89bc610e0dd66d6391e05ccade5787af061' },
  'diary-buried.png': { w: 1264, h: 848, alpha: false, sha256: '65cde37912e2c1dc9892fac72370846a0aa3745f8957713674d517cfaaa4c7a1' },
  'diary-miniature.png': { w: 2528, h: 1696, alpha: false, sha256: '1a7fdf0346eab468d2d05cfdda3a5c36c75f218fdf163f32371cc1790e799a67' },
  'diary-morning.png': { w: 1376, h: 768, alpha: false, sha256: '493a751a5aa05ce56343272f93a17511d41d64afc3a51e9d2fe953157489c6ec' },
  'diary-second-brain.png': { w: 1264, h: 848, alpha: false, sha256: '4a8093d6fb499875dcb61b05644c4d0fbc5a43d0614f73be61dbfa5d0eae9c70' },
  'diary-traveler.png': { w: 2528, h: 1696, alpha: false, sha256: '33361311582a1c9041a28baad4d23a6a3e6d478ba13f100456664f75d3b38aba' },
  'diary-wandering.png': { w: 1264, h: 848, alpha: false, sha256: 'ed8444522d1c0a793ba2bcadc33b0799a82c4aa467d5447ea85b75d9a558dd18' },
  'hero-bg.png': { w: 2752, h: 1536, alpha: false, sha256: '8e584f18480a778b1ea03f19f9012e85ba968c380ae6da182d397b3f4a2e6bfd' },
  'hero-kuro.png': { w: 2752, h: 1536, alpha: true, sha256: 'e226904ac2413e3b487ea47106ca6e69ce4f06fc55e7dd0bc223a061c1288493' },
  'hero-yasser.png': { w: 2752, h: 1536, alpha: true, sha256: '097af66fabf7929cb1a368ad8ff4be34855fe7a089ffdcb50b656befa5fd45cb' },
  'kuro-paw.png': { w: 525, h: 744, alpha: true, sha256: 'd419aa87f82a4b4c1e6b4864579c4b1f75a6f26cbdab49ede99e53aeff33129f' },
  'kuro-sit.png': { w: 445, h: 664, alpha: true, sha256: 'b9813b78054e7716e7c700f9f569c9b720d0c5c0ab7fea93accd41f40894c284' },
  'loops/kuro-sleep-still.png': { w: 705, h: 785, alpha: true, sha256: 'fb740effa6db2f5797c4334f690b3ecef663154320c849447f7b9f8bfd2ce38f' },
  'loops/kuro-sleep.webp': { w: 705, h: 785, alpha: true, sha256: '60a5bb189891216198ae45d467040ffa8b719e0f23bdf452229e9fb087537d28' },
  'loops/yasser-lost-still.png': { w: 1080, h: 994, alpha: true, sha256: 'd890b5d1a189ba23df38e1e90a63f3d461803af22d808149f667a19e7eb2f508' },
  'loops/yasser-lost.webp': { w: 1080, h: 994, alpha: true, sha256: 'a93ac4927726665af9ee9bfbc4100420c2beb240479cda93d2d77d194761db0f' },
  'loops/yasser-wave-still.png': { w: 517, h: 963, alpha: true, sha256: '7f3a8b79633f2b007152a155162979db6f4f93bfbbb1fdbd1c1810fa5a7b158e' },
  'loops/yasser-wave.webp': { w: 517, h: 963, alpha: true, sha256: '6df360d335acac4c1595988d876bcf16e465f36c96b7b242b321eee62d8d3b0b' },
  'make-artist.png': { w: 981, h: 804, alpha: true, sha256: '705af67359745d15a992fa5e08313290052340dec6cf3b0bc94023f1edf92093' },
  'make-designer.png': { w: 1036, h: 1023, alpha: true, sha256: '35994bc431654cc08c32aa9307690ecfb00ba01b1c1203fb9ac3df90bae7e630' },
  'make-developer.png': { w: 903, h: 776, alpha: true, sha256: 'bd6112825b58607a338a99928134720113782c76fe2f175babb33f6c3a424c3c' },
};

/* Crop boxes, { left, top, width, height } in master pixels. An image
   without a box uses its whole frame. */
export const BOX = {
  // The hero's narrow-screen crop, full height. Its three layers are one
  // 2752×1536 canvas and are cut with this same box, so they stay
  // pixel-registered. Yasser spans x 2071-2580 and Kūro x 1731-2018 (alpha
  // bounding boxes), so the pair spans 1731-2580 and centres on 2156. The
  // frame ends at 2752, which leaves 596 px right of that centre: the box is
  // twice that, 1192 wide, with 171 px of paper on each side of the pair.
  // About 4:5 (0.776), the ratio of the stage below 700 px.
  heroTall: { left: 1560, top: 0, width: 1192, height: 1536 },
  // The bands' narrow-screen crop: the right 55% of the frame, full height.
  // On band-design it holds the floating prints, Yasser and Kūro; on
  // band-diary the desk, the lamp, Kūro and Yasser. The left part is the
  // art's empty ground, where the heading sits on wide screens.
  bandTall: { left: 1238, top: 0, width: 1514, height: 1536 },
};

/* Still images, written to hub/art/<name>-<width>.webp. `widths` are the
   srcset candidates; `full` (diary prints) is the lightbox file, 1600 wide
   or the master's own width when it is narrower. */
export const IMAGES = [
  // hero layers: the wide frame from 1024 px, the tall crop below
  { name: 'hero-bg-wide', master: 'hero-bg.png', widths: [1280, 1920, 2560] },
  { name: 'hero-yasser-wide', master: 'hero-yasser.png', widths: [1280, 1920, 2560] },
  { name: 'hero-kuro-wide', master: 'hero-kuro.png', widths: [1280, 1920, 2560] },
  { name: 'hero-bg-tall', master: 'hero-bg.png', box: BOX.heroTall, widths: [640, 960, 1192] },
  { name: 'hero-yasser-tall', master: 'hero-yasser.png', box: BOX.heroTall, widths: [640, 960, 1192] },
  { name: 'hero-kuro-tall', master: 'hero-kuro.png', box: BOX.heroTall, widths: [640, 960, 1192] },
  // section bands
  { name: 'band-design', master: 'band-design.png', widths: [1280, 1920] },
  { name: 'band-design-tall', master: 'band-design.png', box: BOX.bandTall, widths: [800, 1200] },
  { name: 'band-diary', master: 'band-diary.png', widths: [1280, 1920] },
  { name: 'band-diary-tall', master: 'band-diary.png', box: BOX.bandTall, widths: [800, 1200] },
  // "What I make" vignettes (cut-outs)
  { name: 'make-designer', master: 'make-designer.png', widths: [480, 720, 960] },
  { name: 'make-developer', master: 'make-developer.png', widths: [480, 720, 903] },   // the master is 903 wide
  { name: 'make-artist', master: 'make-artist.png', widths: [480, 720, 960] },
  // Kūro die-cuts (marginalia)
  { name: 'kuro-sit', master: 'kuro-sit.png', widths: [240, 445] },                    // the master is 445 wide
  { name: 'kuro-paw', master: 'kuro-paw.png', widths: [240, 480] },
  // studio diary prints, in story order
  { name: 'diary-4am', master: 'diary-4am.png', widths: [640, 960, 1280], full: 1600 },
  { name: 'diary-buried', master: 'diary-buried.png', widths: [640, 960, 1264], full: 1264 },
  { name: 'diary-art-director', master: 'diary-art-director.png', widths: [640, 960, 1264], full: 1264 },
  { name: 'diary-second-brain', master: 'diary-second-brain.png', widths: [640, 960, 1264], full: 1264 },
  { name: 'diary-miniature', master: 'diary-miniature.png', widths: [640, 960, 1280], full: 1600 },
  { name: 'diary-morning', master: 'diary-morning.png', widths: [640, 960, 1280], full: 1376 },
  { name: 'diary-wandering', master: 'diary-wandering.png', widths: [640, 960, 1264], full: 1264 },
  { name: 'diary-traveler', master: 'diary-traveler.png', widths: [640, 960, 1280], full: 1600 },
];

/* Animated loops, written to hub/loops/<name>.webp, and their poster frame
   to hub/loops/<name>-still.webp at the same size (the page swaps one src for
   the other, so the two must match). The masters are finite animated WebPs
   (bone die-cut border; they start and end on the poster frame) at 20 fps.
   Each keeps its master's loop count and total duration. Three settings
   bring them under CEILING:
   - `long`: the longest side, in pixels;
   - `step`: frames merged per group. 2 gives 10 fps: each kept frame shows
     for the summed delays of its group, the last (poster) frame is always
     kept, and the total time does not change;
   - `alphaLevels`: alpha values rounded to this many levels before encoding,
     which is then lossless for alpha (alphaQuality 100). The die-cut edge
     moves from frame to frame, so the encoder cannot reuse the previous
     frame and stores each frame's alpha whole: at full precision the alpha
     cost about as much as the colour. Four levels look the same on the
     1-2 px edge, on paper and on navy.
   Measured at 20 fps, 480 px, quality 80 and alphaQuality 85, the three
   were 844 to 1,279 kB. */
export const LOOP_ENCODE = { quality: 80, effort: 6, alphaQuality: 100 };
export const LOOPS = [
  { name: 'yasser-wave', master: 'loops/yasser-wave.webp', still: 'loops/yasser-wave-still.png', long: 480, step: 2, alphaLevels: 4 },
  { name: 'yasser-lost', master: 'loops/yasser-lost.webp', still: 'loops/yasser-lost-still.png', long: 480, step: 2, alphaLevels: 4 },
  { name: 'kuro-sleep', master: 'loops/kuro-sleep.webp', still: 'loops/kuro-sleep-still.png', long: 480, step: 2, alphaLevels: 4 },
];

/* Files in hub/art that this recipe does not write and that stay: the
   Behance covers, exported by hand. */
export const KEEP = [/^be-\d\d\.webp$/];
