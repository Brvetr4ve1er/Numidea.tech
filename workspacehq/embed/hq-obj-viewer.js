// <hq-obj-viewer> — dependency-free, CSP-safe OBJ renderer (canvas 2D, flat shading,
// low-res pixel buffer upscaled). Attributes: src, color, accent, accent-z, res, spin, beat.
(function () {
  if (customElements.get('hq-obj-viewer')) return;
  const cache = {};
  function load(src) {
    if (src.startsWith('model:')) { if (!cache[src]) cache[src] = Promise.resolve(proc(src.slice(6))); return cache[src]; }
    if (!cache[src]) cache[src] = fetch(src).then(r => r.text()).then(parse);
    return cache[src];
  }
  // ---- procedural models (meters, y-up) ----
  function proc(name) {
    const v = [], f = [];
    const add = (pts, faces) => { const o = v.length / 3; pts.forEach(p => v.push(p[0], p[1], p[2])); faces.forEach(q => f.push(q.map(i => i + o))); };
    const rotY = (p, a) => [p[0] * Math.cos(a) + p[2] * Math.sin(a), p[1], -p[0] * Math.sin(a) + p[2] * Math.cos(a)];
    const box = (cx, cy, cz, w, h, d, ry = 0) => { const x = w / 2, y = h / 2, z = d / 2; const P = [[-x, -y, -z], [x, -y, -z], [x, y, -z], [-x, y, -z], [-x, -y, z], [x, -y, z], [x, y, z], [-x, y, z]].map(p => { const r = rotY(p, ry); return [r[0] + cx, r[1] + cy, r[2] + cz]; }); add(P, [[0, 3, 2, 1], [4, 5, 6, 7], [0, 1, 5, 4], [2, 3, 7, 6], [1, 2, 6, 5], [0, 4, 7, 3]]); };
    const lathe = (prof, seg = 32, cx = 0, cy = 0, cz = 0) => { const P = []; prof.forEach(([r, y]) => { for (let s = 0; s < seg; s++) { const a = s / seg * Math.PI * 2; P.push([cx + Math.cos(a) * r, cy + y, cz + Math.sin(a) * r]); } }); const F = []; for (let i = 0; i < prof.length - 1; i++) for (let s = 0; s < seg; s++) { const a = i * seg + s, b = i * seg + (s + 1) % seg; F.push([a, b, b + seg, a + seg]); } add(P, F); };
    const torus = (R, r, cx, cy, cz, seg = 24, tube = 10, arc = Math.PI * 2, rotZ = 0) => { const P = [], F = []; for (let i = 0; i <= seg; i++) { const u = i / seg * arc; for (let j = 0; j < tube; j++) { const w = j / tube * Math.PI * 2; let x = (R + r * Math.cos(w)) * Math.cos(u), y = (R + r * Math.cos(w)) * Math.sin(u), z = r * Math.sin(w); const xr = x * Math.cos(rotZ) - y * Math.sin(rotZ), yr = x * Math.sin(rotZ) + y * Math.cos(rotZ); P.push([cx + xr, cy + yr, cz + z]); } } for (let i = 0; i < seg; i++) for (let j = 0; j < tube; j++) { const a = i * tube + j, b = i * tube + (j + 1) % tube; F.push([a, a + tube, b + tube, b]); } add(P, F); };
    if (name === 'folder') { box(0, .14, -.01, .9, .62, .06); box(-.25, .48, -.01, .34, .1, .06); box(0, .1, .04, .92, .56, .04); box(.05, .2, .0, .74, .5, .01); }
    if (name === 'rocket') { lathe([[0, -.02], [.16, .02], [.2, .25], [.2, .55], [.16, .75], [.08, .9], [0, .98]], 32); lathe([[0, .55], [.1, .55], [.1, .64], [0, .64]], 24, 0, 0, .19); [0, 2.09, 4.19].forEach(a => box(Math.sin(a) * .2, .1, Math.cos(a) * .2, .04, .26, .2, a)); lathe([[.12, -.02], [.08, -.14], [0, -.2]], 20); }
    if (name === 'trophy') { lathe([[.0, 0], [.32, 0], [.32, .08], [.24, .1], [.22, .16], [.06, .2], [.05, .42], [.09, .48], [.32, .62], [.36, .95], [.34, .97], [.0, .78]], 40); torus(.13, .025, -.38, .76, 0, 18, 8, Math.PI, Math.PI / 2); torus(.13, .025, .38, .76, 0, 18, 8, Math.PI, -Math.PI / 2); }
    if (name === 'gear') { lathe([[0, -.09], [.62, -.09], [.62, .09], [0, .09]], 48); for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; box(Math.cos(a) * .7, 0, Math.sin(a) * .7, .2, .18, .16, -a); } lathe([[.2, -.1], [.2, .1], [.12, .12], [.12, -.12]], 32); }
    return normalize(v, f);
  }
  function normalize(v, faces) {
    let minx = 1e9, maxx = -1e9, miny = 1e9, maxy = -1e9, minz = 1e9, maxz = -1e9;
    for (let i = 0; i < v.length; i += 3) { minx = Math.min(minx, v[i]); maxx = Math.max(maxx, v[i]); miny = Math.min(miny, v[i + 1]); maxy = Math.max(maxy, v[i + 1]); minz = Math.min(minz, v[i + 2]); maxz = Math.max(maxz, v[i + 2]); }
    const cx = (minx + maxx) / 2, cy = (miny + maxy) / 2, cz = (minz + maxz) / 2, s = 2 / Math.max(maxx - minx, maxy - miny, maxz - minz);
    const P = new Float32Array(v.length); for (let i = 0; i < v.length; i += 3) { P[i] = (v[i] - cx) * s; P[i + 1] = (v[i + 1] - cy) * s; P[i + 2] = (v[i + 2] - cz) * s; }
    return { P, F: faces.map(q => { let z = 0; q.forEach(i => { z += P[i * 3 + 2]; }); return { i: q, cz: z / q.length }; }), zTop: (maxz - cz) * s };
  }
  function parse(txt) {
    const v = [], faces = [];
    const lines = txt.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const l = lines[i];
      if (l.charCodeAt(0) === 118 && l.charCodeAt(1) === 32) {
        const p = l.split(/\s+/); v.push(+p[1], +p[2], +p[3]);
      } else if (l.charCodeAt(0) === 102 && l.charCodeAt(1) === 32) {
        const p = l.trim().split(/\s+/); const idx = [];
        for (let k = 1; k < p.length; k++) idx.push(parseInt(p[k], 10) - 1);
        faces.push(idx);
      }
    }
    let minx = 1e9, maxx = -1e9, miny = 1e9, maxy = -1e9, minz = 1e9, maxz = -1e9;
    for (let i = 0; i < v.length; i += 3) {
      minx = Math.min(minx, v[i]); maxx = Math.max(maxx, v[i]);
      miny = Math.min(miny, v[i + 1]); maxy = Math.max(maxy, v[i + 1]);
      minz = Math.min(minz, v[i + 2]); maxz = Math.max(maxz, v[i + 2]);
    }
    const cx = (minx + maxx) / 2, cy = (miny + maxy) / 2, cz = (minz + maxz) / 2;
    const s = 2 / Math.max(maxx - minx, maxy - miny, maxz - minz);
    const n = v.length / 3, P = new Float32Array(v.length);
    for (let i = 0; i < n; i++) { P[i * 3] = (v[i * 3] - cx) * s; P[i * 3 + 1] = (v[i * 3 + 1] - cy) * s; P[i * 3 + 2] = (v[i * 3 + 2] - cz) * s; }
    const zTop = (maxz - cz) * s;
    const F = faces.map(f => {
      let zx = 0; f.forEach(i => { zx += P[i * 3 + 2]; }); return { i: f, cz: zx / f.length };
    });
    return { P, F, zTop };
  }
  function hexToRgb(h) {
    h = (h || '').trim();
    if (h.startsWith('rgb')) { const m = h.match(/[\d.]+/g); return [+m[0], +m[1], +m[2]]; }
    h = h.replace('#', ''); if (h.length === 3) h = h.split('').map(c => c + c).join('');
    const n = parseInt(h || '888888', 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  class HQObjViewer extends HTMLElement {
    static get observedAttributes() { return ['src']; }
    attributeChangedCallback(n, o, v) { if (o && o !== v && this.cv) { this.model = null; load(v).then(m => { this.model = m; }); } }
    connectedCallback() {
      this.style.display = this.style.display || 'block';
      this.style.position = 'relative';
      this.style.touchAction = 'none';
      this.cv = document.createElement('canvas');
      this.cv.style.cssText = 'width:100%;height:100%;display:block;image-rendering:pixelated;cursor:grab';
      this.appendChild(this.cv);
      this.ry = 0.6; this.rx = -0.18; this.drag = null; this.t0 = performance.now();
      this.addEventListener('pointerdown', e => { this.drag = { x: e.clientX, y: e.clientY, ry: this.ry, rx: this.rx }; try { this.setPointerCapture(e.pointerId); } catch (_) {} });
      this.addEventListener('pointermove', e => { if (!this.drag) return; this.ry = this.drag.ry + (e.clientX - this.drag.x) * 0.012; this.rx = Math.max(-0.9, Math.min(0.9, this.drag.rx + (e.clientY - this.drag.y) * 0.01)); });
      const up = () => { this.drag = null; this.lastDrag = performance.now(); };
      this.addEventListener('pointerup', up); this.addEventListener('pointercancel', up);
      load(this.getAttribute('src') || 'assets/computer-icon.obj').then(m => { this.model = m; this.loop(); }).catch(() => { this.textContent = 'Model failed to load'; });
    }
    disconnectedCallback() { cancelAnimationFrame(this.raf); }
    loop() {
      const tick = (t) => {
        if (!this.isConnected) return;
        const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches || this.getAttribute('spin') === 'off';
        if (!this.drag && !reduce && (!this.lastDrag || t - this.lastDrag > 1500)) this.ry += 0.008;
        this.draw(t);
        this.raf = requestAnimationFrame(tick);
      };
      this.raf = requestAnimationFrame(tick);
    }
    draw(t) {
      const m = this.model; if (!m) return;
      const res = +(this.getAttribute('res') || 150);
      if (this.getAttribute('mode') === 'ascii' && !this.cv2) { this.cv.style.display = 'none'; this.cv2 = document.createElement('canvas'); this.cv2.style.cssText = 'width:100%;height:100%;display:block;cursor:grab'; this.appendChild(this.cv2); }
      const rect = this.getBoundingClientRect();
      const W = res, H = Math.max(40, Math.round(res * (rect.height / Math.max(1, rect.width)) || res));
      if (this.cv.width !== W || this.cv.height !== H) { this.cv.width = W; this.cv.height = H; }
      const ctx = this.cv.getContext('2d');
      ctx.clearRect(0, 0, W, H);
      const cs = getComputedStyle(this);
      const base = hexToRgb(this.getAttribute('color') || cs.getPropertyValue('--muted') || '#9a93c9');
      const acc = hexToRgb(this.getAttribute('accent') || cs.getPropertyValue('--red') || '#ff4757');
      const rim = hexToRgb(cs.getPropertyValue('--gold') || '#ffd23f');
      const accZ = m.zTop * +(this.getAttribute('accent-z') || 0.9);
      const beat = this.getAttribute('beat') !== 'off' ? 1 + 0.06 * Math.max(0, Math.sin(t / 180)) * (Math.sin(t / 900) > 0 ? 1 : 0) : 1;
      const cy = Math.cos(this.ry), sy = Math.sin(this.ry), cx = Math.cos(this.rx), sx = Math.sin(this.rx);
      const P = m.P, n = P.length / 3, X = new Float32Array(n), Y = new Float32Array(n), Z = new Float32Array(n);
      const scale = Math.min(W, H) * 0.42, ox = W / 2, oy = H / 2;
      for (let i = 0; i < n; i++) {
        const x = P[i * 3], y = P[i * 3 + 1], z = P[i * 3 + 2];
        const x1 = x * cy + z * sy, z1 = -x * sy + z * cy;
        const y2 = y * cx - z1 * sx, z2 = y * sx + z1 * cx;
        const d = 3.2 / (3.2 - z2);
        X[i] = ox + x1 * scale * d; Y[i] = oy - y2 * scale * d; Z[i] = z2;
      }
      const L = [-0.4, 0.6, 0.7]; const ll = Math.hypot(...L); L[0] /= ll; L[1] /= ll; L[2] /= ll;
      const vis = [];
      const twoSided = this.hasAttribute('two-sided') || (this.getAttribute('src') || '').startsWith('model:');
      for (const f of m.F) {
        const a = f.i[0], b = f.i[1], c = f.i[2];
        const ax = X[b] - X[a], ay = Y[b] - Y[a], bx = X[c] - X[a], by = Y[c] - Y[a];
        if (!twoSided && ax * by - ay * bx > 0) continue; // backface (screen space)
        // world-space normal for lighting (rotated)
        const ux = P[b * 3] - P[a * 3], uy = P[b * 3 + 1] - P[a * 3 + 1], uz = P[b * 3 + 2] - P[a * 3 + 2];
        const vx = P[c * 3] - P[a * 3], vy = P[c * 3 + 1] - P[a * 3 + 1], vz = P[c * 3 + 2] - P[a * 3 + 2];
        let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
        const nl = Math.hypot(nx, ny, nz) || 1; nx /= nl; ny /= nl; nz /= nl;
        const rnx = nx * cy + nz * sy, rnz0 = -nx * sy + nz * cy;
        const rny = ny * cx - rnz0 * sx, rnz = ny * sx + rnz0 * cx;
        let zs = 0; for (const k of f.i) zs += Z[k];
        vis.push({ f, z: zs / f.i.length, l: Math.abs(rnx * L[0] + rny * L[1] + rnz * L[2]) * (twoSided ? 1 : (rnx * L[0] + rny * L[1] + rnz * L[2] > 0 ? 1 : 0)), r: Math.max(0, -rnx * 0.7 + rnz * 0.2) });
      }
      vis.sort((p, q) => p.z - q.z);
      for (const o of vis) {
        const isAcc = o.f.cz > accZ;
        const c = isAcc ? acc : base;
        const k = 0.28 + 0.72 * o.l;
        const r = Math.min(255, c[0] * k + rim[0] * o.r * 0.35), g = Math.min(255, c[1] * k + rim[1] * o.r * 0.35), b = Math.min(255, c[2] * k + rim[2] * o.r * 0.35);
        ctx.fillStyle = `rgb(${r | 0},${g | 0},${b | 0})`;
        ctx.beginPath();
        const fi = o.f.i;
        if (isAcc && beat !== 1) {
          // pulse accent faces around model centre
          ctx.moveTo(ox + (X[fi[0]] - ox) * beat, oy + (Y[fi[0]] - oy) * beat);
          for (let k2 = 1; k2 < fi.length; k2++) ctx.lineTo(ox + (X[fi[k2]] - ox) * beat, oy + (Y[fi[k2]] - oy) * beat);
        } else {
          ctx.moveTo(X[fi[0]], Y[fi[0]]);
          for (let k2 = 1; k2 < fi.length; k2++) ctx.lineTo(X[fi[k2]], Y[fi[k2]]);
        }
        ctx.closePath(); ctx.fill();
      }
      if (this.getAttribute('mode') === 'ascii') this.asciify(ctx, W, H, acc, base);
    }
    asciify(ctx, W, H, acc, base) {
      const img = ctx.getImageData(0, 0, W, H).data, ramp = ' .:-=+*#%@', cw = 4, ch = 6;
      const out = this.out || (this.out = document.createElement('canvas'));
      const S = 3; if (out.width !== W * S) { out.width = W * S; out.height = H * S; }
      const o = out.getContext('2d'); o.clearRect(0, 0, out.width, out.height);
      o.font = `${ch * S}px ${getComputedStyle(this).getPropertyValue('--term') || 'monospace'}`; o.textBaseline = 'top';
      const fg = getComputedStyle(this).getPropertyValue('--text').trim() || '#e8e4dc';
      for (let y = 0; y < H; y += ch) for (let x = 0; x < W; x += cw) {
        let r = 0, g = 0, b = 0, a = 0, n = 0;
        for (let yy = y; yy < Math.min(H, y + ch); yy += 2) for (let xx = x; xx < Math.min(W, x + cw); xx += 2) { const k = (yy * W + xx) * 4; r += img[k]; g += img[k + 1]; b += img[k + 2]; a += img[k + 3]; n++; }
        if (!n || a / n < 30) continue;
        const lum = (r + g + b) / (3 * n * 255) * (a / n / 255), ci = Math.min(ramp.length - 1, Math.max(1, Math.round(lum * (ramp.length - 1) * 1.35)));
        o.fillStyle = `rgb(${r / n | 0},${g / n | 0},${b / n | 0})`;
        o.fillText(ramp[ci], x * S, y * S);
      }
      const d = this.cv2; if (d.width !== out.width) { d.width = out.width; d.height = out.height; }
      const c2 = d.getContext('2d'); c2.clearRect(0, 0, d.width, d.height); c2.drawImage(out, 0, 0);
    }
  }
  customElements.define('hq-obj-viewer', HQObjViewer);
})();
