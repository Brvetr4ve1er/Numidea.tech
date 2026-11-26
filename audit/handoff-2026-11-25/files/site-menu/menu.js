/* Numidea Labs · intro + navigation menu (no framework, no dependencies).
   Works on the markup in index.html. Without this file the menu still shows
   in its resting state and every card is a normal link. */
(function () {
  'use strict';
  var root = document.querySelector('.nl-menu');
  if (!root) return;

  var BEAT = 2000 / 3, E8 = Math.round(BEAT / 8);           // 90 BPM: 667 ms / 83 ms
  var SEEN = 'nl-intro-seen';                               // intro plays once per tab session
  var mqReduce = matchMedia('(prefers-reduced-motion: reduce)');
  var mqFine = matchMedia('(hover: hover) and (pointer: fine)');
  var mqDesk = matchMedia('(min-width: 760px)');

  var stage = root.querySelector('.nl-stage');
  var items = [].slice.call(root.querySelectorAll('.nl-item'));
  var line = root.querySelector('.nl-line');
  var sayIn = root.querySelector('.nl-say-in');
  var sayDest = root.querySelector('.nl-say-dest');
  var sayText = root.querySelector('.nl-say-box');
  var moods = [].slice.call(root.querySelectorAll('.nl-mood'));
  var cat = root.querySelector('.nl-cat');
  var catTag = root.querySelector('.nl-kuro .nl-tag');
  var goLab = root.querySelector('.nl-golab');
  var goDest = root.querySelector('.nl-godest');
  var INTRO = line ? line.getAttribute('data-text') || '' : '';

  var timers = [], on = 0, beat = 0;
  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
  function clear() { timers.forEach(clearTimeout); timers = []; }
  function phase(n) { root.classList.remove('p0', 'p1', 'p2', 'p3', 'p4'); root.classList.add('p' + n); }

  /* ---- fit the 1280×800 stage to the viewport (desktop only) ---- */
  function fit() {
    if (!mqDesk.matches) { root.style.removeProperty('--k'); return; }
    root.style.setProperty('--k', (root.clientHeight / 800).toFixed(4));   // height comes from CSS, so no layout shift
  }
  fit(); addEventListener('resize', fit, { passive: true });

  /* ---- intro: five beats, then the menu ---- */
  function skip() { clear(); line && (line.textContent = INTRO); phase(4); root.classList.remove('played'); }
  function intro() {
    clear();
    if (mqReduce.matches) { skip(); return; }
    root.classList.add('played'); phase(0);
    var n = 0;
    if (line) { line.textContent = ''; (function type() { if (n > INTRO.length) return; line.textContent = INTRO.slice(0, n++); later(type, E8 / 2); })(); }
    later(function () { phase(1); }, BEAT * 1.5);
    later(function () { phase(2); }, BEAT * 2);
    later(function () { phase(3); }, BEAT * 3);
    later(function () { phase(4); }, BEAT * 4.5);
  }
  var seen = false;
  try { seen = sessionStorage.getItem(SEEN) === '1'; sessionStorage.setItem(SEEN, '1'); } catch (e) {}
  if (seen || mqReduce.matches) skip(); else intro();

  function ours(e) { var t = e.target; return t === document.body || root.contains(t); }   // keys work when nothing else has focus
  var skipBtn = root.querySelector('.nl-skip');
  skipBtn && skipBtn.addEventListener('click', skip);
  var replay = root.querySelector('.nl-replay');
  replay && replay.addEventListener('click', intro);
  document.addEventListener('keydown', function (e) { if (ours(e) && !root.classList.contains('p4') && (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter')) { e.preventDefault(); skip(); } });

  /* ---- picking a card: HUD follows ---- */
  function pick(i) {
    if (i === on || !root.classList.contains('p4')) return;
    items[on].classList.remove('on'); on = i; items[on].classList.add('on');
    var d = items[on].dataset;
    if (sayText) sayText.textContent = d.say;
    if (sayDest) sayDest.textContent = d.label + ' → ' + d.dest;
    if (sayIn) { beat++; sayIn.classList.remove('a', 'b'); sayIn.classList.add(beat % 2 ? 'a' : 'b'); }
    moods.forEach(function (m) { m.classList.toggle('on', m.dataset.face === d.face); });
    if (cat) cat.src = cat.src.replace(/kuro-[a-z]+\.webp/, 'kuro-' + d.kuro + '.webp');
    if (catTag) catTag.textContent = 'Kūro : ' + d.kuroSay;
  }
  items.forEach(function (a, i) {
    a.addEventListener('pointerenter', function () { pick(i); });
    a.addEventListener('focus', function () { pick(i); });
    a.addEventListener('click', function (e) { go(e, i); });
  });
  document.addEventListener('keydown', function (e) {
    if (!ours(e) || e.metaKey || e.ctrlKey || e.altKey || !root.classList.contains('p4')) return;
    var n = items.length, k = e.key, t = -1;
    if (k === 'ArrowDown' || k === 'ArrowRight') t = (on + 1) % n;
    else if (k === 'ArrowUp' || k === 'ArrowLeft') t = (on + n - 1) % n;
    else if (k >= '1' && k <= String(n)) t = Number(k) - 1;
    if (t < 0) return;
    e.preventDefault(); items[t].focus(); pick(t);
  });

  /* ---- confirm: wipe, then navigate ---- */
  function go(e, i) {
    var a = items[i];
    if (e.defaultPrevented || e.button > 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    pick(i);
    if (mqReduce.matches || a.target === '_blank' || root.classList.contains('going')) return; // external links open normally
    e.preventDefault();
    if (goLab) goLab.textContent = a.dataset.label;
    if (goDest) goDest.textContent = '→ ' + a.dataset.dest;
    root.classList.add('going');
    later(function () { location.href = a.href; }, E8 * 7);
  }
  addEventListener('pageshow', function (e) { if (e.persisted) { root.classList.remove('going'); clear(); skip(); } });

  /* ---- background mesh: points on springs, the cursor pushes them ----
     Each point only links to its right and lower neighbour (O(n), not O(n²)).
     Off when: reduced motion (drawn once), touch screens, mobile layout,
     the tab is hidden, or the menu is scrolled out of view. */
  var cv = root.querySelector('.nl-mesh');
  if (cv && cv.getContext) {
    var ctx = cv.getContext('2d'), W = 1280, H = 800, SP = 55, R = 180;
    var m = { x: -1000, y: -1000, px: -1000, py: -1000 }, ns = [], raf = 0, last = 0, visible = true;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var cols = Math.ceil(W / SP) + 1, rows = Math.ceil(H / SP) + 1;
    for (var i = 0; i < cols; i++) for (var j = 0; j < rows; j++)
      ns.push({ x: i * SP, y: j * SP, bx: i * SP, by: j * SP, vx: 0, vy: 0, d: 1e9, r: 1.2 + ((i * 7 + j * 13) % 10) / 9, p: (i * 3 + j * 5) % 7,
        l: (i * 7).toString(16).toUpperCase() + ':' + (j * 11).toString(16).toUpperCase() });
    var INK = '243,236,225', RED = '201,96,80';
    var live = function () { return mqFine.matches && mqDesk.matches && !mqReduce.matches && visible && !document.hidden; };
    var frame = function (now) {
      raf = 0;
      var dt = last ? Math.min((now - last) / 1000, 0.05) : 0.016; last = now;
      var sp = m.px < -500 || m.x < -500 ? 0 : Math.hypot(m.x - m.px, m.y - m.py) / (dt * 1000 || 1);
      m.px = m.x; m.py = m.y;
      ctx.clearRect(0, 0, W, H);
      var k, n, dx, dy, d, settled = true;
      for (k = 0; k < ns.length; k++) {
        n = ns[k]; n.p += dt * 3; dx = m.x - n.x; dy = m.y - n.y; d = Math.sqrt(dx * dx + dy * dy); n.d = d;
        if (d < R && d > 0) { var f = (1 - d / R) * (1500 + sp * 150) * dt; n.vx -= dx / d * f; n.vy -= dy / d * f; }
        n.vx = (n.vx + (n.bx - n.x) * 18 * dt) * 0.82; n.vy = (n.vy + (n.by - n.y) * 18 * dt) * 0.82;
        n.x += n.vx * dt * 60; n.y += n.vy * dt * 60;
        if (Math.abs(n.vx) > .01 || Math.abs(n.vy) > .01) settled = false;
      }
      ctx.lineWidth = 0.7;
      for (k = 0; k < ns.length; k++) {
        n = ns[k];
        var nb = [(k + 1) % rows ? ns[k + 1] : null, ns[k + rows]];
        for (var q = 0; q < 2; q++) { var o = nb[q]; if (!o) continue; d = Math.hypot(n.x - o.x, n.y - o.y); if (d > 110) continue;
          ctx.strokeStyle = 'rgba(' + INK + ',' + (0.07 + (n.d < R ? 0.3 * (1 - n.d / R) : 0)) + ')';
          ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(o.x, o.y); ctx.stroke(); }
      }
      ctx.font = "8px 'Geist Mono', ui-monospace, monospace";
      for (k = 0; k < ns.length; k++) {
        n = ns[k]; var near = n.d < R;
        ctx.fillStyle = 'rgba(' + INK + ',' + (near ? 0.95 : 0.3 + Math.sin(n.p) * 0.1) + ')';
        ctx.beginPath(); ctx.arc(n.x, n.y, Math.max(0.5, near ? n.r * 2.4 : n.r + Math.sin(n.p) * 0.3), 0, 6.2832); ctx.fill();
        if (n.d < 90) { var ring = ((n.p * 20) % 30) + 4;
          ctx.strokeStyle = 'rgba(' + RED + ',' + (1 - ring / 34) * 0.7 + ')'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(n.x, n.y, ring, 0, 6.2832); ctx.stroke(); ctx.lineWidth = 0.7;
          ctx.fillStyle = 'rgba(' + INK + ',.75)'; ctx.fillText(n.l, n.x + 10, n.y - 10); }
      }
      if (live()) raf = requestAnimationFrame(frame); else last = 0;
    };
    var wake = function () { if (!raf && live()) { last = 0; raf = requestAnimationFrame(frame); } };
    requestAnimationFrame(frame);                       // first paint, also the only one under reduced motion
    root.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      var r = cv.getBoundingClientRect(); if (!r.width) return;
      m.x = (e.clientX - r.left) * W / r.width; m.y = (e.clientY - r.top) * H / r.height; wake();
    }, { passive: true });
    root.addEventListener('pointerleave', function () { m.x = m.y = -1000; });
    document.addEventListener('visibilitychange', wake);
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; root.classList.toggle('paused', !visible); wake(); }).observe(root);
    [mqFine, mqDesk, mqReduce].forEach(function (q) { q.addEventListener && q.addEventListener('change', wake); });
  }
})();
