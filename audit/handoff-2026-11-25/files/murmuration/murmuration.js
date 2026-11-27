/*
 * Alliance Travel · Murmuration
 * Vanilla port (no React, no build step) of the MurmurationWordmark component.
 * Thousands of birds fold through a curl-noise current, then converge into a
 * word, hold it, scatter, and form the NEXT word in the list. The pointer is a
 * hawk: the flock tears open around it.
 *
 * Usage:
 *   <div class="mmw" style="height:80svh"></div>
 *   <script src="murmuration.js"></script>
 *   <script>AllianceMurmuration.mount(document.querySelector('.mmw'), {
 *     words: ['Bali', 'Vietnam', 'Istanbul'], preset: 'navy' })</script>
 *
 * Returns { destroy() }. Respects prefers-reduced-motion (draws a still flock),
 * pauses off-screen, caps DPR at 2, scales bird count to the element's area.
 */
(function (global) {
  'use strict';

  var PRESETS = {
    // Alliance charter: navy #002C51, mint #9CE8B2, sand #EFE8DF.
    navy:  { skyTop: '#001A31', skyLow: '#0B4A7A', sun: '#9CE8B2', ink: '#EFE8DF', route: '#9CE8B2' },
    sand:  { skyTop: '#F6F1EA', skyLow: '#E6DCCD', sun: '#FFFFFF', ink: '#002C51', route: '#2F9E6A' },
    mint:  { skyTop: '#BFF2CE', skyLow: '#9CE8B2', sun: '#FFFFFF', ink: '#002C51', route: '#002C51' },
    dusk:  { skyTop: '#002C51', skyLow: '#E89A6A', sun: '#FFD2A0', ink: '#0A1420', route: '#9CE8B2' }
  };

  function rng(seed) {
    var a = (seed >>> 0) || 1;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0; var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function curl(x, y, t) {
    var a = 1.7 * x + t, b = 1.3 * y - 0.6 * t, c = 2.9 * y + 1.1 * x - 0.8 * t, d = 4.3 * x - 3.7 * y + 1.3 * t;
    var dx = 1.7 * Math.cos(a) * Math.cos(b) + 0.66 * Math.cos(c) - 1.505 * Math.sin(d);
    var dy = -1.3 * Math.sin(a) * Math.sin(b) + 1.74 * Math.cos(c) + 1.295 * Math.sin(d);
    return [dy, -dx];
  }
  function centre(t) {
    return [0.42 * Math.sin(t * 0.21) + 0.12 * Math.sin(t * 0.53 + 1), 0.16 * Math.sin(t * 0.33 + 2) - 0.08];
  }
  function ease(k) { var x = k < 0 ? 0 : k > 1 ? 1 : k; return x * x * (3 - 2 * x); }
  function assign(n, p, seed) {
    var out = new Int32Array(n); if (p <= 0) return out.fill(-1);
    var o = new Int32Array(p), r = rng(seed), i, j, tmp;
    for (i = 0; i < p; i++) o[i] = i;
    for (i = p - 1; i > 0; i--) { j = Math.floor(r() * (i + 1)); tmp = o[i]; o[i] = o[j]; o[j] = tmp; }
    for (i = 0; i < n; i++) out[i] = o[i % p];
    return out;
  }
  function alpha(hex, a) {
    var m = /^#?([0-9a-f]{6})$/i.exec(hex || ''); if (!m) return hex;
    var h = m[1]; return 'rgba(' + parseInt(h.slice(0, 2), 16) + ',' + parseInt(h.slice(2, 4), 16) + ',' + parseInt(h.slice(4, 6), 16) + ',' + a + ')';
  }

  function mount(root, opts) {
    opts = opts || {};
    var words = opts.words && opts.words.length ? opts.words : ['Alliance'];
    var col = Object.assign({}, PRESETS[opts.preset] || PRESETS.navy, opts.palette || {});
    var birdsWanted = opts.birds || 4200;
    var flyFor = opts.flyFor != null ? opts.flyFor : 6;
    var holdFor = opts.holdFor != null ? opts.holdFor : 3.2;
    var interactive = opts.interactive !== false;
    var route = opts.route !== false;           // dashed flight path + pins instead of reeds
    var font = opts.fontFamily || 'Sora, "DM Sans", system-ui, sans-serif';
    var weight = opts.fontWeight || 800;
    var wordY = opts.wordY != null ? opts.wordY : 0.44;
    var onWord = opts.onWord || null;

    var cs = getComputedStyle(root);
    if (cs.position === 'static') root.style.position = 'relative';
    root.style.overflow = 'hidden';
    root.style.background = col.skyTop;
    var canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block';
    root.insertBefore(canvas, root.firstChild);
    var sr = document.createElement('span');
    sr.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap';
    sr.setAttribute('aria-live', 'polite');
    sr.textContent = words[0];
    root.appendChild(sr);
    var ctx = canvas.getContext('2d');
    var reduced = global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var w = 1, h = 1, dpr = 1, n = 0, raf = 0, visible = true, sky = null;
    var px, py, vx, vy, depth, phase;
    var targets = [];          // per word: {tx, ty, map}
    var hx = -1e5, hy = -1e5, last = performance.now(), clock = 0, wordIx = 0, lastCycle = -1;
    var R = rng(11);

    function sample(word) {
      var m = document.createElement('canvas'); m.width = w; m.height = h;
      var mc = m.getContext('2d', { willReadFrequently: true });
      mc.font = weight + ' 100px ' + font;
      var ww = mc.measureText(word).width || 1;
      var size = Math.min((w * 0.78 / ww) * 100, (h * 0.42) / 0.72);
      mc.font = weight + ' ' + size + 'px ' + font;
      mc.textAlign = 'center'; mc.textBaseline = 'middle';
      mc.fillText(word, w / 2, h * wordY);
      var img = mc.getImageData(0, 0, w, h).data, pts = [];
      var step = Math.max(2, Math.round(Math.sqrt((w * h) / 90000)));
      for (var y = 0; y < h; y += step) for (var x = 0; x < w; x += step)
        if (img[(y * w + x) * 4 + 3] > 128) pts.push(x + (R() - 0.5) * step, y + (R() - 0.5) * step);
      var tx = new Float32Array(pts.length / 2), ty = new Float32Array(pts.length / 2);
      for (var i = 0; i < tx.length; i++) { tx[i] = pts[2 * i]; ty[i] = pts[2 * i + 1]; }
      return { tx: tx, ty: ty };
    }

    function paintSky() {
      sky = document.createElement('canvas'); sky.width = canvas.width; sky.height = canvas.height;
      var s = sky.getContext('2d'); s.setTransform(dpr, 0, 0, dpr, 0, 0);
      var g = s.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, col.skyTop); g.addColorStop(0.8, col.skyLow); g.addColorStop(1, col.skyLow);
      s.fillStyle = g; s.fillRect(0, 0, w, h);
      var sun = s.createRadialGradient(w * 0.66, h * 0.9, 0, w * 0.66, h * 0.9, Math.max(w, h) * 0.55);
      sun.addColorStop(0, alpha(col.sun, 0.55)); sun.addColorStop(0.3, alpha(col.sun, 0.18)); sun.addColorStop(1, alpha(col.sun, 0));
      s.fillStyle = sun; s.fillRect(0, 0, w, h);
      var gr = rng(5);
      for (var i = 0; i < (w * h) / 10; i++) {
        s.fillStyle = gr() < 0.5 ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.035)';
        s.fillRect(gr() * w, gr() * h, 1, 1);
      }
      if (route && w >= 640) {   // phones: the overlay copy fills the low band, so no route
        // The charter's dashed flight path, left pin to right arrow, low in the frame.
        var y0 = h * 0.75, x0 = w * 0.06, x1 = w * 0.94, y1 = h * 0.63;
        s.strokeStyle = col.route; s.lineWidth = Math.max(2, u() * 0.004); s.lineCap = 'round';
        s.setLineDash([1, Math.max(10, u() * 0.018)]);
        s.beginPath(); s.moveTo(x0, y0);
        s.bezierCurveTo(w * 0.3, h * 0.81, w * 0.46, h * 0.63, w * 0.62, h * 0.67);
        s.bezierCurveTo(w * 0.78, h * 0.71, w * 0.86, h * 0.65, x1, y1); s.stroke();
        s.setLineDash([]); s.fillStyle = col.route;
        s.beginPath(); s.arc(x0, y0, Math.max(4, u() * 0.009), 0, Math.PI * 2); s.fill();
        s.beginPath(); s.arc(x1, y1, Math.max(4, u() * 0.009), 0, Math.PI * 2); s.fill();
      }
    }
    function u() { return Math.min(w, h); }

    function layout() {
      var r = root.getBoundingClientRect();
      w = Math.max(1, Math.round(r.width)); h = Math.max(1, Math.round(r.height));
      dpr = Math.min(global.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      paintSky();
      targets = words.map(function (wd, k) { var t = sample(wd); return t; });
      var want = Math.round(Math.max(600, Math.min(9000, birdsWanted)) * Math.min(1, (w * h) / (1440 * 860)));
      if (want !== n) {
        n = Math.max(500, want);
        px = new Float32Array(n); py = new Float32Array(n); vx = new Float32Array(n); vy = new Float32Array(n);
        depth = new Float32Array(n); phase = new Float32Array(n);
        for (var i = 0; i < n; i++) {
          var a = R() * Math.PI * 2, rr = Math.sqrt(R());
          px[i] = w * 0.5 + Math.cos(a) * rr * w * 0.22; py[i] = h * 0.4 + Math.sin(a) * rr * h * 0.16;
          depth[i] = 0.55 + R() * 0.45; phase[i] = R() * Math.PI * 2;
        }
      }
      targets.forEach(function (t, k) { t.map = assign(n, t.tx.length, 23 + k); });
    }

    function frame(now) {
      raf = requestAnimationFrame(frame);
      if (!visible) { last = now; return; }
      var dt = reduced ? 0 : Math.min(0.05, (now - last) / 1000); last = now; clock += dt;
      var form = 2.4, rel = 0.6, cycle = Math.max(1, flyFor) + form + Math.max(0.5, holdFor) + rel;
      var cyc = Math.floor(clock / cycle);
      if (cyc !== lastCycle) {
        lastCycle = cyc; wordIx = cyc % words.length; sr.textContent = words[wordIx];
        if (onWord) onWord(words[wordIx], wordIx);
      }
      var tc = clock % cycle, fly = Math.max(1, flyFor), pull = 0;
      if (tc > fly && tc <= fly + form) pull = ease((tc - fly) / form);
      else if (tc > fly + form && tc <= fly + form + holdFor) pull = 1;
      else if (tc > fly + form + holdFor) pull = 1 - ease((tc - fly - form - holdFor) / rel);
      if (reduced) pull = 1;   // reduced motion: the word, still

      var T = targets[wordIx], tx = T.tx, ty = T.ty, map = T.map;
      var U = u(), c = centre(clock), cxp = w / 2 + c[0] * w * 0.5, cyp = h * 0.42 + c[1] * h, t = clock * 0.35;
      var hawk = interactive && hx > -1e4, hawkR = U * 0.16, free = 1 - pull;
      for (var i = 0; i < n; i++) {
        var x = px[i], y = py[i], ax = 0, ay = 0;
        var cv = curl((x - w / 2) / U * 2.2 + depth[i] * 0.25, (y - h / 2) / U * 2.2, t);
        ax += cv[0] * 420 * free; ay += cv[1] * 420 * free;
        var dxC = cxp - x, dyC = (cyp - y) * 1.6, dC = Math.hypot(dxC, dyC) / U;
        var hold = dC < 0.14 ? 0.15 : 0.15 + (dC - 0.14) * 6;
        ax += dxC * hold * 2.2 * free; ay += dyC * hold * 1.6 * free;
        var ti = map[i];
        if (pull > 0 && ti >= 0) {
          ax += (tx[ti] - x) * 9 * pull - vx[i] * 3.2 * pull;
          ay += (ty[ti] - y) * 9 * pull - vy[i] * 3.2 * pull;
        }
        if (hawk) {
          var dx = x - hx, dy = y - hy, d2 = dx * dx + dy * dy;
          if (d2 < hawkR * hawkR) { var d = Math.sqrt(d2) + 0.01, f = (1 - d / hawkR) * 5200; ax += dx / d * f; ay += dy / d * f; }
        }
        var nvx = (vx[i] + ax * dt) * (1 - 1.1 * dt), nvy = (vy[i] + ay * dt) * (1 - 1.1 * dt);
        var sp = Math.hypot(nvx, nvy), cap = 520 + 380 * pull;
        if (sp > cap) { nvx = nvx / sp * cap; nvy = nvy / sp * cap; }
        vx[i] = nvx; vy[i] = nvy;
        if (reduced && ti >= 0) { px[i] = tx[ti]; py[i] = ty[ti]; } else { px[i] = x + nvx * dt; py[i] = y + nvy * dt; }
        phase[i] += dt * (9 + sp * 0.02);
      }

      ctx.setTransform(1, 0, 0, 1, 0, 0); if (sky) ctx.drawImage(sky, 0, 0);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      for (var pass = 0; pass < 2; pass++) {
        ctx.beginPath();
        for (i = 0; i < n; i++) {
          var near = depth[i] > 0.78; if ((pass === 1) !== near) continue;
          var s = (1.6 + depth[i] * 2.2) * (1 - 0.35 * pull);
          var v = Math.hypot(vx[i], vy[i]) + 0.001, ux = vx[i] / v, uy = vy[i] / v;
          if (v < 1) { ux = 1; uy = 0; }
          var flap = 0.55 + 0.45 * Math.sin(phase[i]);
          var bx = px[i], by = py[i], wx = -ux * s, wy = -uy * s, nx = -uy * s * flap, ny = ux * s * flap;
          ctx.moveTo(bx + wx + nx, by + wy + ny); ctx.lineTo(bx, by); ctx.lineTo(bx + wx - nx, by + wy - ny);
        }
        ctx.strokeStyle = col.ink; ctx.globalAlpha = pass === 0 ? 0.55 : 0.92;
        ctx.lineWidth = pass === 0 ? 0.9 : 1.25; ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    function onMove(e) { var b = canvas.getBoundingClientRect(); hx = e.clientX - b.left; hy = e.clientY - b.top; }
    function onLeave() { hx = -1e5; hy = -1e5; }
    layout();
    raf = requestAnimationFrame(frame);
    root.addEventListener('pointermove', onMove);
    root.addEventListener('pointerleave', onLeave);
    var ro = new ResizeObserver(layout); ro.observe(root);
    var io = new IntersectionObserver(function (en) { visible = en[0] ? en[0].isIntersecting : true; }); io.observe(root);
    var alive = true;
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (alive) layout(); });

    return {
      destroy: function () {
        alive = false; cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
        root.removeEventListener('pointermove', onMove); root.removeEventListener('pointerleave', onLeave);
        canvas.remove(); sr.remove();
      },
      // For screenshots/tests: jump the clock to a moment in the cycle.
      seek: function (seconds) { clock = seconds; }
    };
  }

  global.AllianceMurmuration = { mount: mount, presets: PRESETS };
})(window);
