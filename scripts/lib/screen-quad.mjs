/**
 * Find a device screen in a photo whose display is flat chroma-key green.
 *
 * Returns the screen's four corners (TL, TR, BR, BL in image pixels) and a
 * mask of the green pixels. The corners come from fitting a straight line
 * to each edge and intersecting the lines, not from the extreme pixels:
 * phone screens have rounded corners and a notch, so extreme points sit
 * inside the true rectangle. Each edge fit is iterated with an outlier cut,
 * which drops the notch, the corner arcs and a thumb that crosses an edge.
 */
import sharp from 'sharp';

const isGreen = (r, g, b) => g > 110 && g > r * 1.45 && g > b * 1.45 && g - Math.max(r, b) > 50;

export async function findScreen(file) {
  const { data, info } = await sharp(file).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, N = W * H;
  const mask = new Uint8Array(N);
  for (let i = 0, p = 0; i < N; i++, p += 3) if (isGreen(data[p], data[p + 1], data[p + 2])) mask[i] = 1;

  // largest 4-connected green region (a plant or a sticker elsewhere is not the screen)
  const label = new Int32Array(N);
  let best = 0, bestSize = 0, cur = 0;
  const stack = new Int32Array(N);
  for (let s = 0; s < N; s++) {
    if (!mask[s] || label[s]) continue;
    cur++; let top = 0, size = 0; stack[top++] = s; label[s] = cur;
    while (top) {
      const i = stack[--top]; size++;
      const x = i % W;
      if (x > 0 && mask[i - 1] && !label[i - 1]) { label[i - 1] = cur; stack[top++] = i - 1; }
      if (x < W - 1 && mask[i + 1] && !label[i + 1]) { label[i + 1] = cur; stack[top++] = i + 1; }
      if (i >= W && mask[i - W] && !label[i - W]) { label[i - W] = cur; stack[top++] = i - W; }
      if (i < N - W && mask[i + W] && !label[i + W]) { label[i + W] = cur; stack[top++] = i + W; }
    }
    if (size > bestSize) { bestSize = size; best = cur; }
  }
  if (bestSize < N * 0.01) throw new Error(`${file}: no green screen found (largest region ${bestSize}px)`);
  const region = new Uint8Array(N);
  for (let i = 0; i < N; i++) if (label[i] === best) region[i] = 1;

  // boundary pixels of the region
  const bx = [], by = [];
  for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
    const i = y * W + x;
    if (region[i] && (!region[i - 1] || !region[i + 1] || !region[i - W] || !region[i + W])) { bx.push(x); by.push(y); }
  }
  // first guess: diagonal extremes
  let tl = 0, tr = 0, br = 0, bl = 0;
  for (let k = 1; k < bx.length; k++) {
    if (bx[k] + by[k] < bx[tl] + by[tl]) tl = k;
    if (bx[k] + by[k] > bx[br] + by[br]) br = k;
    if (bx[k] - by[k] > bx[tr] - by[tr]) tr = k;
    if (bx[k] - by[k] < bx[bl] - by[bl]) bl = k;
  }
  let C = [tl, tr, br, bl].map((k) => [bx[k], by[k]]);

  /* Fit a line to each side. Boundary points near that side are binned along
     it and only the OUTERMOST point of each bin is kept: the glass edge is the
     outer envelope, while a notch, a corner arc or a thumb only ever pushes
     the boundary inward. A RANSAC pass over the bin extremes then picks the
     line most of them agree with (a notch can fill a third of the top edge,
     enough to bias a plain least-squares fit), and a final total-least-squares
     fit runs on its inliers. */
  const cx0 = C.reduce((s, p) => s + p[0], 0) / 4, cy0 = C.reduce((s, p) => s + p[1], 0) / 4;
  const fit = (a, b) => {
    const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy);
    let nx = -dy / L, ny = dx / L;
    // make the normal point outward (away from the quad's centre)
    if ((a[0] - cx0) * nx + (a[1] - cy0) * ny < 0) { nx = -nx; ny = -ny; }
    const BINS = 60, ext = new Array(BINS).fill(null);
    for (let k = 0; k < bx.length; k++) {
      const px = bx[k] - a[0], py = by[k] - a[1];
      const t = (px * dx + py * dy) / (L * L), d = px * nx + py * ny;
      if (t <= 0.04 || t >= 0.96 || Math.abs(d) > L * 0.08) continue;
      const bin = Math.min(BINS - 1, Math.floor(t * BINS));
      if (!ext[bin] || d > ext[bin][2]) ext[bin] = [bx[k], by[k], d];
    }
    const pts = ext.filter(Boolean);
    if (pts.length < 8) throw new Error(`${file}: an edge of the screen has too few points`);
    let best = null, bestIn = -1;
    for (let i = 0; i < pts.length; i++) for (let j = i + 4; j < pts.length; j++) {
      const ux = pts[j][0] - pts[i][0], uy = pts[j][1] - pts[i][1], l = Math.hypot(ux, uy);
      const inl = pts.filter((p) => Math.abs(-(p[0] - pts[i][0]) * uy / l + (p[1] - pts[i][1]) * ux / l) < 2.5);
      if (inl.length > bestIn) { bestIn = inl.length; best = inl; }
    }
    const mx = best.reduce((s, p) => s + p[0], 0) / best.length, my = best.reduce((s, p) => s + p[1], 0) / best.length;
    let sxx = 0, syy = 0, sxy = 0;
    for (const [x, y] of best) { sxx += (x - mx) ** 2; syy += (y - my) ** 2; sxy += (x - mx) * (y - my); }
    const th = 0.5 * Math.atan2(2 * sxy, sxx - syy);
    return { mx, my, ux: Math.cos(th), uy: Math.sin(th) };
  };
  const meet = (l1, l2) => {
    const det = l1.ux * l2.uy - l1.uy * l2.ux;
    const t = ((l2.mx - l1.mx) * l2.uy - (l2.my - l1.my) * l2.ux) / det;
    return [l1.mx + t * l1.ux, l1.my + t * l1.uy];
  };
  const sides = [0, 1, 2, 3].map((i) => fit(C[i], C[(i + 1) % 4]));
  const corners = [0, 1, 2, 3].map((i) => meet(sides[(i + 3) % 4], sides[i]));   // TL, TR, BR, BL

  return { width: W, height: H, corners, region, area: bestSize };
}

/* the region as a white-on-transparent PNG (dilated by r px to swallow the
   anti-aliased green fringe), for use as a CSS mask */
export async function maskPng({ region, width: W, height: H }, r = 3) {
  const out = new Uint8Array(W * H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (!region[y * W + x]) continue;
    for (let yy = Math.max(0, y - r); yy <= Math.min(H - 1, y + r); yy++)
      for (let xx = Math.max(0, x - r); xx <= Math.min(W - 1, x + r); xx++) out[yy * W + xx] = 255;
  }
  const rgba = Buffer.alloc(W * H * 4);
  for (let i = 0; i < W * H; i++) { rgba[i * 4] = rgba[i * 4 + 1] = rgba[i * 4 + 2] = 255; rgba[i * 4 + 3] = out[i]; }
  return sharp(rgba, { raw: { width: W, height: H, channels: 4 } }).png().toBuffer();
}

/* CSS matrix3d that maps the rectangle (0,0)-(w,h) onto the quad
   [TL, TR, BR, BL]; use with transform-origin: 0 0 */
export function matrix3d(w, h, q) {
  const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = q;
  // homography from the unit square, then scale by 1/w, 1/h
  const dx1 = x1 - x2, dx2 = x3 - x2, dy1 = y1 - y2, dy2 = y3 - y2;
  const sx = x0 - x1 + x2 - x3, sy = y0 - y1 + y2 - y3;
  const den = dx1 * dy2 - dx2 * dy1;
  const g = (sx * dy2 - dx2 * sy) / den, hh = (dx1 * sy - sx * dy1) / den;
  const a = x1 - x0 + g * x1, b = x3 - x0 + hh * x3, c = x0;
  const d = y1 - y0 + g * y1, e = y3 - y0 + hh * y3, f = y0;
  const A = a / w, B = b / h, D = d / w, E = e / h, G = g / w, Hh = hh / h;
  // column-major 4x4 for CSS
  return `matrix3d(${[A, D, 0, G, B, E, 0, Hh, 0, 0, 1, 0, c, f, 0, 1].map((v) => +v.toFixed(8)).join(',')})`;
}

/* The scene with its screen made neutral: green inside the screen region is
   replaced by near-black (a bezel colour, in case any sliver is left
   uncovered) and green spill on the anti-aliased rim around it is pulled down
   to the larger of red and blue. Returns a JPEG buffer. */
export async function despill(file, { region, width: W, height: H }, band = 12) {
  const { data } = await sharp(file).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const near = new Uint8Array(W * H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (!region[y * W + x]) continue;
    // mark a band around region pixels that touch the boundary
    const i = y * W + x;
    if (x > 0 && x < W - 1 && y > 0 && y < H - 1 && region[i - 1] && region[i + 1] && region[i - W] && region[i + W]) continue;
    for (let yy = Math.max(0, y - band); yy <= Math.min(H - 1, y + band); yy++)
      for (let xx = Math.max(0, x - band); xx <= Math.min(W - 1, x + band); xx++) near[yy * W + xx] = 1;
  }
  for (let i = 0, p = 0; i < W * H; i++, p += 3) {
    if (region[i]) { data[p] = 12; data[p + 1] = 12; data[p + 2] = 14; continue; }
    if (!near[i]) continue;
    const r = data[p], g = data[p + 1], b = data[p + 2], m = Math.max(r, b);
    if (g > m) data[p + 1] = m;
  }
  return sharp(data, { raw: { width: W, height: H, channels: 3 } }).jpeg({ quality: 92 }).toBuffer();
}
