#!/usr/bin/env node
/**
 * La Carte's map: `node scripts/build-carte.mjs` (`--check` exits 1 when
 * carte/index.html holds another drawing).
 *
 * The page carte/index.html is hand-written; its map (the inline SVG between
 * the MAP:start and MAP:end markers) is drawn here from coordinates, so a city,
 * a dune field or a route moves by editing a longitude, not a path. Art
 * direction: the doc « La carte du monde Numidea », section 4b (2026-11-28):
 * a campaign map inked at the night desk, the home's three inks, line work
 * instead of effects (no glow, no blur, no gradient).
 *
 * Projection: plain equirectangular at 28° N, the country's middle, so the
 * shape reads right without a library. The outline is hand-drawn (about 80
 * points), not survey-accurate; the cities sit at their real coordinates.
 * Everything is in a 1000 x 1100 viewBox; the page places the city seals over
 * it in percent of that box (carte.js reads the same numbers from the
 * data-x / data-y the markup carries, written below as CITIES).
 *
 * Deterministic: the scatter (dunes, stars, peaks) comes from a seeded random,
 * so a rebuild without an edit writes the same bytes.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { ROOT } from './site.mjs';

const W = 1000, H = 1100;
export const X = (lon) => +(60 + (lon + 8.67) * 42.62).toFixed(1);
export const Y = (lat) => +(170 + (37.09 - lat) * 48.27).toFixed(1);
const P = (lon, lat) => [X(lon), Y(lat)];
const r1 = (n) => +n.toFixed(1);

/* seeded random (mulberry32): the same scatter on every build */
function rng(seed) { return () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

/* Algeria, clockwise from the Moroccan border on the coast (lon, lat) */
const DZ = [
  [-2.21, 35.09], [-1.86, 35.10], [-1.40, 35.30], [-1.05, 35.55], [-0.64, 35.72], [-0.32, 35.88], [0.09, 35.93], [0.45, 36.13], [0.95, 36.40], [1.31, 36.51], [1.9, 36.56], [2.2, 36.60], [2.6, 36.62], [3.06, 36.77], [3.5, 36.79], [3.91, 36.92], [4.4, 36.90], [5.08, 36.75], [5.4, 36.66], [5.77, 36.82], [6.2, 36.95], [6.56, 37.06], [6.9, 36.90], [7.3, 36.95], [7.77, 36.90], [8.2, 36.93], [8.62, 36.94],
  [8.43, 36.55], [8.35, 36.0], [8.25, 35.45], [8.30, 34.80], [8.05, 34.40], [7.62, 34.05], [7.52, 33.60], [7.75, 33.20], [8.30, 32.80], [9.05, 32.10], [9.50, 30.23],
  [9.85, 29.40], [9.75, 28.30], [9.95, 27.20], [9.65, 26.40], [10.05, 25.30], [10.45, 24.60], [11.10, 24.40], [11.98, 23.52],
  [10.9, 22.95], [9.4, 22.15], [7.45, 20.85], [5.80, 19.45],
  [4.25, 19.15], [3.30, 19.00], [3.15, 19.70], [2.40, 20.05], [1.80, 20.30], [1.17, 20.73], [-1.0, 22.1], [-3.0, 23.4], [-4.83, 25.0],
  [-6.66, 26.13], [-8.67, 27.29], [-8.67, 27.67],
  [-8.68, 28.80], [-7.5, 29.45], [-6.4, 29.55], [-5.5, 29.62], [-4.6, 30.35], [-3.65, 30.85], [-3.6, 31.45], [-2.85, 31.70], [-1.70, 32.12], [-1.22, 32.10], [-1.25, 32.70], [-1.05, 33.20], [-1.68, 33.65], [-1.75, 34.75],
];
/* the neighbours' land: Morocco's coast to the west, Tunisia's and Libya's to the east, the rest of the sheet to the south */
const LON0 = -8.67 - 60 / 42.62, LON1 = -8.67 + 940 / 42.62, LATB = 37.09 - (H - 170) / 48.27;
const NEIGH = [[LON0, 35.9], [-5.9, 35.8], [-5.3, 35.9], [-4.2, 35.2], [-2.9, 35.25], ...DZ.slice(0, 27), [9.8, 37.33], [10.3, 37.2], [11.05, 37.08], [10.5, 36.45], [10.9, 35.55], [10.1, 34.3], [11.15, 33.2], [12.5, 32.85], [LON1, 32.85], [LON1, LATB], [LON0, LATB]];

const pts = (a) => a.map(([lo, la]) => P(lo, la));
const poly = (a) => 'M' + pts(a).map((p) => p.join(' ')).join('L') + 'Z';
const inside = ([x, y], ring) => { let o = false; for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) { const [xi, yi] = ring[i], [xj, yj] = ring[j]; if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) o = !o; } return o; };
const DZp = pts(DZ);

/* the four places: the seals sit here (also written into the markup as data-x / data-y, in percent) */
export const CITIES = {
  hq: { lon: 4.76, lat: 36.07 },          // Bordj Bou Arréridj, the studio
  oran: { lon: -0.64, lat: 35.70 },       // Le Vestiaire
  ghardaia: { lon: 3.67, lat: 32.49 },    // La Logithèque
  tamanrasset: { lon: 5.52, lat: 22.79 }, // L'Arcade
};
const C = Object.fromEntries(Object.entries(CITIES).map(([k, c]) => [k, P(c.lon, c.lat)]));

/* the caravan routes: from the HQ, through real towns on the way (lon, lat) */
const ROUTES = {
  oran: [[4.76, 36.07], [4.1, 36.3], [3.06, 36.62], [2.2, 36.25], [1.32, 36.17], [0.14, 35.74], [-0.64, 35.70]],              // Sétif side, Alger, Chlef, Relizane
  ghardaia: [[4.76, 36.07], [4.55, 35.5], [4.18, 35.21], [3.25, 34.67], [2.88, 33.8], [3.67, 32.49]],                       // M'Sila, Bou Saâda, Djelfa, Laghouat
  tamanrasset: [[4.76, 36.07], [4.55, 35.5], [4.18, 35.21], [3.25, 34.67], [2.88, 33.8], [3.67, 32.49], [2.88, 30.57], [2.47, 27.2], [3.9, 25.0], [5.52, 22.79]], // … El Meniaa, In Salah, Arak
};
/* a smooth line through points (Catmull-Rom as cubic Béziers) */
function smooth(a) {
  const p = pts(a); let d = `M${p[0][0]} ${p[0][1]}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] || p[i], p1 = p[i], p2 = p[i + 1], p3 = p[i + 2] || p2;
    d += `C${r1(p1[0] + (p2[0] - p0[0]) / 6)} ${r1(p1[1] + (p2[1] - p0[1]) / 6)} ${r1(p2[0] - (p3[0] - p1[0]) / 6)} ${r1(p2[1] - (p3[1] - p1[1]) / 6)} ${p2[0]} ${p2[1]}`;
  }
  return d;
}

/* ---------- the relief, in the vocabulary of fantasy maps ---------- */
const rand = rng(28112026);
// a peak: a chevron with its shaded flank (three short hatches on the east side)
const peak = (x, y, s) => `<use href="#pk" transform="translate(${r1(x)} ${r1(y)}) scale(${r1(s * 10) / 10})"/>`;
function along(a, step, s, jitter) {
  const p = pts(a), out = [];
  for (let i = 0; i < p.length - 1; i++) {
    const [x0, y0] = p[i], [x1, y1] = p[i + 1], len = Math.hypot(x1 - x0, y1 - y0), n = Math.max(1, Math.round(len / step));
    for (let k = 0; k < n; k++) { const t = k / n; out.push(peak(x0 + (x1 - x0) * t + (rand() - .5) * jitter, y0 + (y1 - y0) * t + (rand() - .5) * jitter, s * (.8 + rand() * .45))); }
  }
  return out.join('');
}
const TELL = [[-1.6, 34.85], [-0.4, 35.25], [0.9, 35.85], [2.3, 36.25], [3.9, 36.45], [5.2, 36.4], [6.4, 36.55], [7.6, 36.4]];
const SAHARAN = [[-1.4, 32.55], [-0.2, 32.9], [1.0, 33.5], [2.2, 34.05], [3.3, 34.45], [4.6, 34.95], [5.8, 35.15], [6.7, 35.25], [7.7, 35.05]];
function cluster(lon, lat, rx, ry, n, s) {
  const [cx, cy] = P(lon, lat); const out = []; let tries = 0;
  while (out.length < n && tries++ < n * 40) {
    const a = rand() * Math.PI * 2, r = Math.sqrt(rand());
    const x = cx + Math.cos(a) * rx * r, y = cy + Math.sin(a) * ry * r;
    if (!inside([x, y], DZp)) continue;
    out.push([y, peak(x, y, s * (.75 + (1 - r) * .7))]);
  }
  return out.sort((a, b) => a[0] - b[0]).map((o) => o[1]).join('');   // back to front
}
// a dune field: crescents scattered inside a polygon, rows offset like a real erg
function erg(a, gap) {
  const ring = pts(a), xs = ring.map((p) => p[0]), ys = ring.map((p) => p[1]), out = [];
  let row = 0;
  for (let y = Math.min(...ys); y < Math.max(...ys); y += gap * .62, row++) {
    for (let x = Math.min(...xs) + (row % 2) * gap / 2; x < Math.max(...xs); x += gap) {
      const jx = x + (rand() - .5) * gap * .4, jy = y + (rand() - .5) * gap * .25;
      if (inside([jx, jy], ring) && inside([jx, jy], DZp)) out.push(`<use href="#dn" transform="translate(${r1(jx)} ${r1(jy)}) scale(${r1((.8 + rand() * .5) * 10) / 10})"/>`);
    }
  }
  return out.join('');
}
// a plateau: short parallel strokes in a band (Tassili, Tademaït)
function plateau(a, gap) {
  const ring = pts(a), xs = ring.map((p) => p[0]), ys = ring.map((p) => p[1]); let d = '';
  for (let y = Math.min(...ys); y < Math.max(...ys); y += gap) {
    for (let x = Math.min(...xs); x < Math.max(...xs); x += gap * 1.6) {
      const jx = x + (rand() - .5) * gap, jy = y + (rand() - .5) * gap * .4;
      if (inside([jx, jy], ring) && inside([jx, jy], DZp)) d += `M${r1(jx)} ${r1(jy)}h${r1(gap * (.7 + rand() * .5))}`;
    }
  }
  return `<path class="m-plat" d="${d}"/>`;
}
const ERG_OCC = [[-2.0, 31.2], [-0.6, 31.55], [0.9, 31.4], [1.9, 30.8], [2.0, 29.9], [0.4, 29.5], [-1.8, 29.95]];
const ERG_OR = [[5.8, 32.2], [7.2, 32.75], [8.2, 32.5], [9.2, 31.5], [9.35, 29.4], [7.6, 28.9], [6.1, 29.9]];
const CHECH = [[-6.2, 26.9], [-4.2, 26.75], [-2.3, 26.1], [-1.4, 24.6], [-3.3, 23.95], [-5.4, 24.9], [-6.6, 26.0]];
const TASSILI = [[5.9, 26.9], [7.6, 26.6], [9.6, 25.5], [10.2, 24.6], [9.2, 24.25], [7.6, 25.3], [6.0, 26.0]];
const TADEM = [[1.0, 28.9], [3.4, 29.0], [3.9, 28.1], [2.6, 27.6], [1.1, 27.9]];
const MZAB = [[3.67, 32.49], [3.82, 32.6], [3.5, 32.62], [3.92, 32.38], [3.45, 32.36], [5.73, 34.85], [5.9, 34.8], [6.07, 33.37], [6.24, 33.35], [-0.28, 31.62], [0.0, 29.25], [2.47, 27.2], [2.6, 27.15]];  // Ghardaïa and the M'zab, Biskra, El Oued, Béni Abbès-side, Timimoun, In Salah

/* ---------- the instruments ---------- */
// the graticule: every 2°, a dashed hairline; the ruler's labels every 4°
const LONS = [-8, -6, -4, -2, 0, 2, 4, 6, 8, 10, 12], LATS = [20, 22, 24, 26, 28, 30, 32, 34, 36];
const grat = LONS.map((lo) => `M${X(lo)} 0V${H}`).concat(LATS.map((la) => `M0 ${Y(la)}H${W}`)).join('');
// the ruler's ticks: one a degree on the four edges
const ticks = [];
for (let lo = -10; lo <= 13; lo++) ticks.push(`M${X(lo)} 18v${lo % 2 ? 5 : 9}M${X(lo)} ${H - 18}v-${lo % 2 ? 5 : 9}`);
for (let la = 18; la <= 37; la++) ticks.push(`M18 ${Y(la)}h${la % 2 ? 5 : 9}M${W - 18} ${Y(la)}h-${la % 2 ? 5 : 9}`);
const deg = (n, pos, neg) => `${Math.abs(n)}°${n === 0 ? '' : ' ' + (n > 0 ? pos : neg)}`;
const ticksTop = LONS.filter((lo) => lo % 4 === 0).map((lo) => `<text class="m-deg" x="${X(lo)}" y="13.5" text-anchor="middle">${deg(lo, 'E', 'O')}</text>`).join('');
const ticksSide = LATS.filter((la) => la % 4 === 0).map((la) => `<text class="m-deg" x="13.5" y="${Y(la)}" text-anchor="middle" transform="rotate(-90 13.5 ${Y(la)})">${deg(la, 'N', 'S')}</text>`).join('');
// the waves: short hand-ruled strokes in staggered rows over the sea
let waves = '';
for (let y = 46, row = 0; y < 290; y += 17, row++) for (let x = 40 + (row % 2) * 22; x < 970; x += 44) { const jx = x + (rand() - .5) * 10; waves += `M${r1(jx)} ${y}q6 -5 12 0t12 0`; }
// the fog: the diagonal hatch over the land, cut open around the four places and along the routes
const clear = Object.entries({ hq: 118, oran: 96, ghardaia: 96, tamanrasset: 112 }).map(([k, r]) => `<circle cx="${C[k][0]}" cy="${C[k][1]}" r="${r}"/>`).join('');

const svg = `<svg class="m" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="m-t" focusable="false">
<title id="m-t" data-t="mapTitle">Carte de l’Algérie : le QG à Bordj Bou Arréridj, le Vestiaire à Oran, la Logithèque à Ghardaïa, l’Arcade à Tamanrasset</title>
<defs>
<pattern id="m-hatch" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)"><path d="M0 0V9" class="m-hatchl"/></pattern>
<pattern id="m-dots" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1.1" class="m-dot"/></pattern>
<g id="pk"><path class="m-pk" d="M-9 5L0-8L9 5"/><path class="m-pks" d="M1-5l3 4M3-2l3 4M5 1l2.5 3.5"/></g>
<path id="dn" class="m-dn" d="M-9 3q9-11 18 0q-7-4-12 0z"/>
<g id="pl"><path class="m-pl" d="M0 6V-4M0-4q-5-2-8 2M0-4q5-2 8 2M0-4q-2-5-6-6M0-4q2-5 6-6"/></g>
<clipPath id="m-dz"><path d="${poly(DZ)}"/></clipPath>
<mask id="m-fogm" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="#fff"/><g fill="#000">${clear}</g><g fill="none" stroke="#000" stroke-width="46" stroke-linecap="round">${Object.values(ROUTES).map((r) => `<path d="${smooth(r)}"/>`).join('')}</g></mask>
${Object.keys(ROUTES).map((k) => `<mask id="m-draw-${k}" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><path class="m-drawl" pathLength="1" fill="none" stroke="#fff" stroke-width="16" stroke-linecap="round" d="${smooth(ROUTES[k])}"/></mask>`).join('\n')}
</defs>
<rect class="m-sea" width="${W}" height="${H}"/>
<path class="m-wave" d="${waves}"/>
<path class="m-grat" d="${grat}"/>
<path class="m-nb" d="${poly(NEIGH)}"/>
<path class="m-nbd" d="${poly(NEIGH)}"/>
<path class="m-echo" d="${poly(DZ)}"/>
<path class="m-land" d="${poly(DZ)}"/>
<g clip-path="url(#m-dz)">
<path class="m-grat m-grat--in" d="${grat}"/>
${erg(ERG_OCC, 24)}${erg(ERG_OR, 24)}${erg(CHECH, 28)}
${plateau(TASSILI, 13)}${plateau(TADEM, 15)}
${along(TELL, 24, 1.05, 8)}${along(SAHARAN, 26, 1.15, 9)}
${cluster(6.6, 35.35, 34, 14, 9, 1.25)}
${cluster(5.6, 23.35, 82, 64, 34, 1.5)}
${MZAB.map(([lo, la]) => `<use href="#pl" transform="translate(${X(lo) + (rand() - .5) * 8} ${Y(la) + (rand() - .5) * 6})"/>`).join('')}
<rect class="m-fog" width="${W}" height="${H}" mask="url(#m-fogm)"/>
</g>
<path class="m-coast" d="${poly(DZ)}"/>
<g class="m-names" aria-hidden="true">
<text class="m-sea-t" x="560" y="98" text-anchor="middle" data-t="sea">MER MÉDITERRANÉE</text>
<text class="m-big" x="${X(1.2)}" y="${Y(24.6)}" text-anchor="middle" data-t="sahara">SAHARA</text>
<text class="m-geo" x="${X(-0.2)}" y="${Y(30.55)}" text-anchor="middle" data-t="ergW">Grand Erg Occidental</text>
<text class="m-geo" x="${X(7.6)}" y="${Y(30.75)}" text-anchor="middle" data-t="ergE">Grand Erg Oriental</text>
<text class="m-geo" x="${X(7.9)}" y="${Y(25.95) - 26}" text-anchor="middle" data-t="tassili">Tassili n’Ajjer</text>
<text class="m-geo" x="${X(5.6)}" y="${Y(23.35) + 92}" text-anchor="middle" data-t="hoggar">Hoggar</text>
<text class="m-geo m-geo--tilt" x="${X(1.3)}" y="${Y(33.6) + 22}" text-anchor="middle" transform="rotate(-24 ${X(1.3)} ${Y(33.6) + 22})" data-t="atlasS">Atlas saharien</text>
<text class="m-fog-t" x="${X(-5.2)}" y="${Y(28.3)}" text-anchor="middle" data-t="fogA">TERRES À VENIR</text>
<text class="m-fog-t" x="${X(8.3)}" y="${Y(27.9)}" text-anchor="middle" data-t="fogB">TERRES À VENIR</text>
<text class="m-nb-t" x="${X(-6.4)}" y="${Y(32.6)}" text-anchor="middle" data-t="nbMa">MAROC</text>
<text class="m-nb-t" x="${X(10.9)}" y="${Y(33.9)}" text-anchor="middle" data-t="nbTn">TUNISIE</text>
<text class="m-nb-t" x="${X(12.2)}" y="${Y(28.0)}" text-anchor="middle" data-t="nbLy">LIBYE</text>
<text class="m-nb-t" x="${X(-3.8)}" y="${Y(20.4)}" text-anchor="middle" data-t="nbMl">MALI</text>
<text class="m-nb-t" x="${X(9.4)}" y="${Y(19.7)}" text-anchor="middle" data-t="nbNe">NIGER</text>
</g>
<g class="m-routes">${Object.keys(ROUTES).map((k) => `<path class="m-route" data-route="${k}" d="${smooth(ROUTES[k])}" mask="url(#m-draw-${k})"/>`).join('')}</g>
<g class="m-stops" aria-hidden="true">
<circle class="m-stop" cx="${X(3.06)}" cy="${Y(36.77)}" r="5"/><text class="m-stop-t" x="${X(3.06)}" y="${Y(36.77) - 12}" text-anchor="middle" data-t="alger">Alger</text>
<circle class="m-stop" cx="${X(2.47)}" cy="${Y(27.2)}" r="4"/><text class="m-stop-t" x="${X(2.47) - 12}" y="${Y(27.2) + 5}" text-anchor="end" data-t="inSalah">In Salah</text>
<circle class="m-stop" cx="${X(2.88)}" cy="${Y(30.57)}" r="4"/><text class="m-stop-t" x="${X(2.88) + 12}" y="${Y(30.57) + 5}" data-t="meniaa">El Meniaa</text>
</g>
<g class="m-ship" transform="translate(${X(1.6) - 20} 128)" aria-hidden="true"><path d="M-26 0h52l-8 9h-36zM-14 0v-8h24v8M-6-8v-5h10v5M-36 13q9-4 18 0t18 0t18 0t18 0"/></g>
<g class="m-rose" transform="translate(${X(-6.9)} ${Y(21.6)})" aria-hidden="true">
<circle r="60" class="m-rose-r"/><circle r="47" class="m-rose-r m-rose-r--in"/>
<path class="m-rose-s" d="M0-56L7 0L0 56L-7 0ZM-56 0L0-7L56 0L0 7Z"/><path class="m-rose-d" d="M0-34L4 0L0 34L-4 0ZM-34 0L0-4L34 0L0 4Z" transform="rotate(45)"/>
<path class="m-rose-n" d="M0-56L7 0H-7Z"/>
<circle r="17" class="m-rose-seal"/><text class="m-rose-k" y="6.5" text-anchor="middle">道</text>
<text class="m-rose-l" y="-68" text-anchor="middle">N</text>
</g>
<g class="m-cart" transform="translate(${W - 262} ${H - 132})" aria-hidden="true">
<rect width="236" height="104" class="m-cart-b"/><rect x="5" y="5" width="226" height="94" class="m-cart-i"/>
<text class="m-cart-k" x="18" y="32" data-t="cartK">ATLAS DU STUDIO</text>
<text class="m-cart-s" x="18" y="52" data-t="cartS">Numidea · feuille 1</text>
<path class="m-scale" d="M18 76h217M18 70v12M72.3 72v8M126.5 70v12M180.8 72v8M235 70v12"/>
<path class="m-scale-f" d="M18 74h54.3v4H18zM126.5 74h54.3v4h-54.3z"/>
<text class="m-cart-s" x="18" y="96">0</text><text class="m-cart-s" x="126.5" y="96" text-anchor="middle">250</text><text class="m-cart-s" x="224" y="96" text-anchor="end">500 km</text>
</g>
<g class="m-ruler" aria-hidden="true"><path class="m-ruler-b" d="M0 0H${W}V${H}H0Z"/><path class="m-tick" d="${ticks.join('')}"/>${ticksTop}${ticksSide}</g>
</svg>`.replace(/\n{2,}/g, '\n');

const FILE = join(ROOT, 'carte/index.html');
const START = '<!-- MAP:start (scripts/build-carte.mjs) -->', END = '<!-- MAP:end -->';
export function withMap(html) {
  const a = html.indexOf(START), b = html.indexOf(END);
  if (a < 0 || b < a) throw new Error('carte/index.html: the MAP markers are missing');
  return html.slice(0, a + START.length) + '\n' + svg + '\n' + html.slice(b);
}
export const pct = (k) => ({ x: +(C[k][0] / W * 100).toFixed(2), y: +(C[k][1] / H * 100).toFixed(2) });

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const html = readFileSync(FILE, 'utf8'), want = withMap(html);
  if (process.argv.includes('--check')) { console.log(want === html ? '✓ carte/index.html: the map matches its coordinates' : '✗ carte/index.html: the map is stale (run: node scripts/build-carte.mjs)'); process.exit(want === html ? 0 : 1); }
  if (want !== html) writeFileSync(FILE, want);
  console.log(`✓ carte/index.html: map drawn (${(svg.length / 1024).toFixed(1)} KB); seals at`, Object.keys(C).map((k) => `${k} ${pct(k).x}%/${pct(k).y}%`).join(', '));
}
