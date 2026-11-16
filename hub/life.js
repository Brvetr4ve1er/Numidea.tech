/* ============================================================
   Numidea Labs — Kūro lives on the manual (hub/manuel.html)
   vanilla, no deps; loaded after app.js, on that page only

   One sprite (hub/img/studio/life/kuro.webp: 47 cells cut from five short
   clips of the same drawing: a walk cycle, sitting down, a blink, a look,
   a paw, lying down, asleep, a jump) on a layer that takes no click and is
   hidden from assistive tech. His ground is the top edge of real things on
   the page (the scene, the radio, this strip, the lessons' plate, the line
   above the open lesson's question, the four cards, the kit, the last band,
   the footer): "perches", measured from the layout, never drawn.

   Two ways he moves, and both answer the visitor:
   · on his own, once per event and for a few seconds at most: when a scroll
     ends and he is out of sight he comes to a perch in view (through "the
     door": he sinks behind one edge and rises behind another; he is the
     gate, the bible says so), when a lesson is picked or answered, when the
     radio starts or stops, when a card is pointed at. Then he sits still.
   · in play ("Jouer avec Kūro"): the arrow keys or the pad walk him, Up
     leaps to the perch above, Down drops to the one below, Space hops.
     Seven seals wait on the perches; all seven open the night drawing.
     Seals are kept on this device only (localStorage 'numidea-seals').

   Nothing runs before a first idle moment, nothing runs while the tab is
   hidden, and with prefers-reduced-motion nothing here runs at all: the
   sleeping picture on the radio stays and the strip says the game is off.
   ============================================================ */
(function () {
  'use strict';
  var d = document, root = d.documentElement, body = d.body;
  var layer = d.querySelector('[data-life]'), strip = d.querySelector('[data-game]');
  if (!layer || !strip || !window.requestAnimationFrame) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  /* ---------------- the sheet ---------------- */
  var COLS = 8, ROWS = 6, AX = 0.5385, BASE = 3;
  var SEQ = { walk: [0, 13], stand: [13, 1], sitdown: [14, 6], sit: [20, 1], blink: [21, 1], look: [22, 1], tail: [23, 1], paw: [24, 5], lie: [29, 8], asleep: [37, 1], jump: [38, 9] };
  var el = layer.querySelector('[data-life-kuro]'), spr = el.firstElementChild;
  var say = layer.querySelector('[data-life-say]'), sayY = layer.querySelector('[data-life-say-y]');
  var playBtn = strip.querySelector('[data-game-play]'), prizeBtn = strip.querySelector('[data-game-prize]');
  var pad = d.querySelector('[data-pad]'), prize = d.getElementById('prize');
  var counts = [].slice.call(d.querySelectorAll('[data-game-count]'));
  var now = function () { return performance.now(); };

  /* ---------------- words ---------------- */
  var FR = {};
  try { FR = JSON.parse(d.getElementById('hub-fr').textContent); } catch (e) {}
  var t = function (k) { var l = root.getAttribute('lang') || 'fr', D = (window.HUB_I18N && window.HUB_I18N[l]) || FR; return D[k] != null ? D[k] : (FR[k] != null ? FR[k] : ''); };
  var pick = function (key) { var a = t(key).split('|'); return a[Math.floor(Math.random() * a.length)]; };

  /* ---------------- the perches ---------------- */
  // id, selector, where he likes to sit along it (0..1); the cards are four of one selector
  var DEF = [['scene', '.st-mny__scene', 0.5], ['radio', '.st-radio__set', 0.74], ['game', '.st-game__in', 0.94], ['plate', '.st-ls', 0.9], ['ask', '.st-ls__panel:not([hidden]) .st-ls__q', 0.94],
    ['card', '.st-mny__card', 0.8], ['kit', '.st-mny__kit', 0.94], ['back', '.st-back', 0.56], ['foot', '.st-foot', 0.5]];
  var perches = [], W = 0, H = 0, docW = 0;
  var K = { p: null, x: 0, lift: 0, sink: 0, face: 1, cell: -1, pose: 'asleep' };   // Kūro: his perch, where along it, how high above it, how far sunk behind it, which way he faces
  var measure = function () {
    W = el.offsetWidth; H = el.offsetHeight; docW = root.clientWidth;
    var sx = window.pageXOffset, sy = window.pageYOffset, inset = Math.round(W * 0.2), out = [];
    DEF.forEach(function (df) {
      [].forEach.call(d.querySelectorAll(df[1]), function (node, i) {
        var r = node.getBoundingClientRect();
        if (r.width < W * 0.9 || !r.height) return;
        out.push({ id: df[0] === 'card' || df[0] === 'plate' || df[0] === 'ask' ? df[0] + i : df[0], el: node, x0: r.left + sx + inset, x1: r.right + sx - inset, y: Math.round(r.top + sy), at: df[2] });
      });
    });
    out.sort(function (a, b) { return a.y - b.y || a.x0 - b.x0; });
    perches = out;
    // the perch under him is the same thing, measured again
    if (K.p) for (var i = 0; i < out.length; i++) if (out[i].id === K.p.id) { K.p = out[i]; break; }
  };
  var perch = function (id) { for (var i = 0; i < perches.length; i++) if (perches[i].id === id) return perches[i]; return null; };
  // of several perches of one kind (two sets of lessons: two plates, two question lines), the one nearest the middle of the screen
  var nearestOf = function (kind) {
    var mid = window.pageYOffset + window.innerHeight * 0.5, best = null;
    perches.forEach(function (p) { if (p.id.indexOf(kind) === 0 && (!best || Math.abs(p.y - mid) < Math.abs(best.y - mid))) best = p; });
    return best;
  };
  var clampX = function (p, x) { return Math.max(p.x0, Math.min(p.x1, x)); };
  // is the air above this spot free of words and controls? (the layer takes no hit, so the page answers for itself)
  var LEAF = 'h1,h2,h3,p,a,button,img,input,label,li,output,figcaption,svg,video';
  var free = function (p, x) {
    var cx = x - window.pageXOffset, top = p.y - window.pageYOffset - H * 0.7;
    if (top < 60 || p.y - window.pageYOffset > window.innerHeight) return false;
    var pts = [[cx - W * 0.22, top + 6], [cx + W * 0.22, top + 6], [cx, top + H * 0.36], [cx - W * 0.3, p.y - window.pageYOffset - 12], [cx + W * 0.25, p.y - window.pageYOffset - 12]];
    for (var i = 0; i < pts.length; i++) {
      var hit = d.elementFromPoint(pts[i][0], pts[i][1]);
      if (!hit || hit.closest(LEAF) || hit.closest('.st-nav,.st-pad,.st-rchip,dialog')) return false;
    }
    return true;
  };
  // the nearest free spot to the one he likes, or null
  var seat = function (p, want) {
    var x = clampX(p, want == null ? p.x0 + (p.x1 - p.x0) * p.at : want), step = Math.max(28, W * 0.3);
    for (var k = 0; k * step <= p.x1 - p.x0; k++) {
      var a = x + k * step, b = x - k * step;
      if (a <= p.x1 && free(p, a)) return a;
      if (k && b >= p.x0 && free(p, b)) return b;
    }
    return null;
  };

  /* ---------------- Kūro ---------------- */
  var cell = function (i) {
    if (i === K.cell) return; K.cell = i;
    spr.style.backgroundPosition = ((i % COLS) * 100 / (COLS - 1)).toFixed(3) + '% ' + (Math.floor(i / COLS) * 100 / (ROWS - 1)).toFixed(3) + '%';
  };
  var pose = function (name) { K.pose = name; cell(SEQ[name][0]); };
  var place = function () {
    if (!K.p) return;
    var x = Math.max(W * AX + 4, Math.min(docW - W * (1 - AX) - 4, K.x));
    el.style.transform = 'translate3d(' + (x - W * AX).toFixed(1) + 'px,' + (K.p.y + K.lift - H + BASE).toFixed(1) + 'px,0)';
    spr.style.transform = 'translateY(' + (K.sink * 100).toFixed(1) + '%) scaleX(' + K.face + ')';
  };
  var onScreen = function () {
    if (!K.p) return false;
    var y = K.p.y - window.pageYOffset;
    return y > 96 && y < window.innerHeight - 6;
  };

  /* ---------------- bubbles ---------------- */
  var sayT = 0, sayYT = 0;
  var speak = function (text) {
    if (!text || !K.p) return;
    say.textContent = text;
    var w = say.offsetWidth, x = Math.max(w / 2 + 8, Math.min(docW - w / 2 - 8, K.x + K.face * 8));
    say.style.transform = 'translate3d(' + x.toFixed(0) + 'px,' + (K.p.y + K.lift - H * 0.78).toFixed(0) + 'px,0) translate(-50%,-100%)';
    say.classList.add('is-on');
    clearTimeout(sayT); sayT = setTimeout(function () { say.classList.remove('is-on'); }, 2600);
  };
  var yasser = function () {
    var img = d.querySelector('.st-back__img');
    if (!sayY || !img || !img.offsetWidth) return;
    var n = 0;
    try { n = (JSON.parse(localStorage.getItem('numidea-lessons') || '[]') || []).length; } catch (e) {}
    sayY.textContent = (n >= 6 ? t('life.y.all') : n ? t('life.y.some') : t('life.y.none')).replace('{n}', String(n));
    var r = img.getBoundingClientRect(), w = sayY.offsetWidth;
    sayY.style.transform = 'translate3d(' + Math.max(8, Math.min(docW - w - 8, r.left + window.pageXOffset + r.width * 0.5 - w * 0.5)).toFixed(0) + 'px,' + (r.top + window.pageYOffset + r.height * 0.1).toFixed(0) + 'px,0) translateY(-100%)';
    sayY.classList.add('is-on');
    clearTimeout(sayYT); sayYT = setTimeout(function () { sayY.classList.remove('is-on'); }, 3600);
  };

  /* ---------------- the runner: a queue of small steps, one rAF loop that stops when it is empty ---------------- */
  var queue = [], cur = null, raf = 0, last = 0, playing = false, hidden = false;
  var ease = function (p) { return p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; };
  var go = function () { if (!raf && !hidden) { last = now(); raf = requestAnimationFrame(tick); } };
  var push = function (steps) { queue = queue.concat(steps); go(); };
  var clear = function () { queue = []; cur = null; K.sink = 0; K.lift = 0; };
  // steps
  var frames = function (name, fps, rev) { return { k: 'frames', name: name, fps: fps || 14, rev: !!rev }; };
  var walkTo = function (x, speed) { return { k: 'walk', to: x, speed: speed || 190 }; };
  var arcTo = function (p, x, peak) { return { k: 'arc', p: p, x: x, peak: peak == null ? 46 : peak }; };
  var call = function (fn) { return { k: 'call', fn: fn }; };
  var wait = function (ms) { return { k: 'wait', ms: ms }; };
  var rise = function () {
    // whatever he was doing, he is on his feet first
    if (K.pose === 'asleep') return [frames('lie', 15, true), frames('sitdown', 18, true)];
    if (K.pose === 'sit' || K.pose === 'look' || K.pose === 'blink' || K.pose === 'tail') return [frames('sitdown', 18, true)];
    return [];
  };
  var settle = function (how) { return how === 'sleep' ? [frames('sitdown'), frames('lie', 12), call(function () { pose('asleep'); })] : [frames('sitdown'), call(function () { pose(how === 'look' ? 'look' : 'sit'); })]; };
  var step = function (s, dt, t0) {
    var n, p, i;
    if (s.k === 'call') { s.fn(); return true; }
    if (s.k === 'wait') { return t0 >= s.ms; }
    if (s.k === 'frames') {
      n = SEQ[s.name][1]; i = Math.floor(t0 * s.fps / 1000);
      if (i >= n) { cell(SEQ[s.name][0] + (s.rev ? 0 : n - 1)); return true; }
      cell(SEQ[s.name][0] + (s.rev ? n - 1 - i : i)); return false;
    }
    if (s.k === 'walk') {
      var dir = s.to > K.x ? 1 : -1, dx = s.speed * dt / 1000;
      K.face = dir;
      if (Math.abs(s.to - K.x) <= dx) { K.x = s.to; cell(SEQ.stand[0]); return true; }
      K.x += dir * dx; cell(SEQ.walk[0] + Math.floor(t0 * 20 / 1000) % SEQ.walk[1]); return false;
    }
    if (s.k === 'sink' || s.k === 'rise') {
      p = Math.min(1, t0 / s.ms); K.sink = s.k === 'sink' ? p * p : 1 - (1 - (1 - p) * (1 - p));
      return p >= 1;
    }
    if (s.k === 'tele') { K.p = s.p; K.x = s.x; K.lift = 0; if (s.face) K.face = s.face; return true; }
    if (s.k === 'arc') {
      // a leap: crouch on the spot, then one parabola from here to there, the flight's cells by progress, a landing cell
      if (!s.t) { s.t = 1; s.x0 = K.x; s.y0 = K.p.y; s.dy = s.p.y - K.p.y; s.dx = s.x - K.x; s.ms = Math.max(420, Math.min(950, 380 + Math.abs(s.dy) * 0.3 + Math.abs(s.dx) * 0.25)); if (Math.abs(s.dx) > 6) K.face = s.dx > 0 ? 1 : -1; }
      if (t0 < 110) { cell(SEQ.jump[0] + (t0 < 55 ? 0 : 1)); return false; }
      p = Math.min(1, (t0 - 110) / s.ms);
      var top = Math.min(0, s.dy) - s.peak;                       // the arc's highest point, from the start's ground
      var yy = p < 0.5 ? top * (1 - Math.pow(1 - p * 2, 2)) : top + (s.dy - top) * Math.pow((p - 0.5) * 2, 2);
      K.x = s.x0 + s.dx * ease(p); K.lift = yy;
      cell(SEQ.jump[0] + (p < 0.12 ? 2 : p < 0.34 ? 3 : p < 0.56 ? 4 : p < 0.74 ? 5 : p < 0.9 ? 6 : 7));
      if (p >= 1) { K.p = s.p; K.x = s.x; K.lift = 0; cell(SEQ.jump[0] + 8); return true; }
      return false;
    }
    return true;
  };
  function tick(ts) {
    raf = 0;
    var dt = Math.min(48, ts - last); last = ts;
    if (!cur && queue.length) { cur = queue.shift(); cur.at = ts; }
    if (cur) { if (step(cur, dt, ts - cur.at)) cur = null; }
    else if (playing) drive(dt, ts);
    place();
    if (playing) { follow(dt); seals.touch(); }
    if (cur || queue.length || playing) raf = requestAnimationFrame(tick);
  }
  d.addEventListener('visibilitychange', function () { hidden = d.hidden; if (hidden) { cancelAnimationFrame(raf); raf = 0; } else if (cur || queue.length || playing) go(); });

  /* ---------------- on his own: one short trip per event ---------------- */
  var busyUntil = 0;
  // through the door: down behind this edge, up behind that one
  var door = function (p, x, how, after) {
    var steps = rise().concat([{ k: 'sink', ms: 240 }, { k: 'tele', p: p, x: x, face: x > docW / 2 ? -1 : 1 }, call(function () { pose('look'); }), { k: 'rise', ms: 320 }, wait(260)]);
    if (how === 'sleep') steps = steps.concat([frames('lie', 12), call(function () { pose('asleep'); })]);
    else if (how !== 'look') steps.push(call(function () { pose('sit'); }));
    if (after) steps.push(call(after));
    push(steps);
  };
  var arrive = function (p, want, how, after) {
    if (playing || !p) return false;
    var x = seat(p, want);
    if (x == null) return false;
    clear(); busyUntil = now() + 1400;
    if (K.p === p && Math.abs(x - K.x) < 520) {
      if (Math.abs(x - K.x) < 12) { if (after) push([call(after)]); return true; }
      push(rise().concat([walkTo(x)], settle(how), after ? [call(after)] : []));
    } else if (K.p && onScreen() && Math.abs(p.y - K.p.y) < 560 && Math.abs(x - K.x) < 620) {
      push(rise().concat([arcTo(p, x)], settle(how), after ? [call(after)] : []));
    } else door(p, x, how, after);
    return true;
  };
  // when a scroll ends and he is out of sight, he comes to the perch nearest the middle of the screen
  var scrollT = 0;
  var come = function () {
    if (playing || cur || queue.length || now() < busyUntil || onScreen()) return;
    measure();
    var mid = window.pageYOffset + window.innerHeight * 0.5, best = null, bx = null;
    perches.forEach(function (p) {
      var y = p.y - window.pageYOffset;
      if (y < 140 || y > window.innerHeight * 0.86) return;
      var x = seat(p);
      if (x != null && (!best || Math.abs(p.y - mid) < Math.abs(best.y - mid))) { best = p; bx = x; }
    });
    if (best) arrive(best, bx, 'sit', best.id === 'back' || best.id === 'foot' ? yasser : null);
  };
  window.addEventListener('scroll', function () { clearTimeout(scrollT); if (!playing) scrollT = setTimeout(come, 420); }, { passive: true });

  // the page tells what happened (hub/app.js 13 and 15)
  var tabX = function (id) { var b = d.querySelector('[data-ls-tab="' + id + '"]'); if (!b) return null; var r = b.getBoundingClientRect(); return r.left + window.pageXOffset + r.width / 2; };
  var saidTab = false;
  // by the lesson: on the plate's edge over the picked tab when that edge is in view, else on the line above the question
  var byLesson = function (id, how, after) { return arrive(nearestOf('plate'), tabX(id), how, after) || arrive(nearestOf('ask'), null, how, after); };
  d.addEventListener('numidea:tab', function (e) {
    measure();
    byLesson(e.detail.id, 'look', saidTab ? null : function () { saidTab = true; speak(t('life.k.tab')); });
  });
  d.addEventListener('numidea:lesson', function (e) {
    measure();
    var right = e.detail.right;
    var react = function () {
      if (right) push([arcTo(K.p, K.x, 54), call(function () { pose('sit'); speak(pick(e.detail.first ? 'life.k.right' : 'life.k.again')); })]);
      else push([call(function () { pose('sit'); }), frames('paw', 12), frames('paw', 12, true), call(function () { pose('sit'); speak(pick('life.k.wrong')); })]);
    };
    if (playing) { if (right) speak(pick('life.k.right')); return; }
    if (!(arrive(nearestOf('ask'), null, 'sit', react) || arrive(nearestOf('plate'), tabX(e.detail.id), 'sit', react)) && onScreen()) { clear(); react(); }
  });
  d.addEventListener('numidea:radio', function (e) {
    if (playing) return;
    measure();
    var p = perch('radio');
    if (e.detail.on) arrive(p, null, 'sit', function () { speak(t('life.k.radio')); });
    else if (K.p === p && !cur && !queue.length && K.pose !== 'asleep') push([frames('lie', 12), call(function () { pose('asleep'); })]);
  });
  // a card pointed at for half a second: he goes and sits on it (a mouse only)
  if (matchMedia('(hover:hover)').matches) [].forEach.call(d.querySelectorAll('.st-mny__card'), function (c, i) {
    var tm = 0;
    c.addEventListener('pointerenter', function () { tm = setTimeout(function () { if (cur || queue.length || now() < busyUntil) return; measure(); var first = !c.hasAttribute('data-life-seen'); c.setAttribute('data-life-seen', ''); arrive(perch('card' + i), null, 'look', first && i === 0 ? function () { speak(t('life.k.card')); } : null); }, 520); });
    c.addEventListener('pointerleave', function () { clearTimeout(tm); });
  });

  /* ---------------- play ---------------- */
  var held = { left: false, right: false }, idleAt = 0, sat = false;
  var below = function (x, y) { var b = null; perches.forEach(function (p) { if (p.y > y + 6 && x >= p.x0 - 16 && x <= p.x1 + 16 && (!b || p.y < b.y)) b = p; }); return b; };
  var gapOf = function (p, x) { return x < p.x0 ? p.x0 - x : x > p.x1 ? x - p.x1 : 0; };
  var nearest = function (up) {
    var best = null, cost = 1e9;
    perches.forEach(function (p) {
      if (p === K.p || (up ? p.y > K.p.y - 6 : p.y < K.p.y + 6)) return;
      var c = Math.abs(p.y - K.p.y) + 2 * gapOf(p, K.x);
      if (c < cost) { cost = c; best = p; }
    });
    return best;
  };
  var act = function (what) {
    if (!playing) return;
    // a leap in flight finishes first; sitting down from idleness does not hold a key back
    if (cur || queue.length) { if (!sat) return; clear(); }
    sat = false; idleAt = now();
    var p;
    if (what === 'jump') push([arcTo(K.p, clampX(K.p, K.x + (held.right ? 96 : held.left ? -96 : 0)), 118)]);
    else if ((p = nearest(what === 'up'))) push([arcTo(p, clampX(p, K.x), what === 'up' ? 46 : 22), call(function () { if (p.id === 'back' || p.id === 'foot') yasser(); })]);
    else push([arcTo(K.p, K.x, 40)]);
  };
  function drive(dt, ts) {
    var dir = held.right ? 1 : held.left ? -1 : 0, p = K.p;
    if (!dir) {
      if (!sat && ts - idleAt > 1500) { sat = true; push([frames('sitdown'), call(function () { pose('sit'); })]); }
      else if (!sat) cell(SEQ.stand[0]);
      return;
    }
    if (sat) { sat = false; push([frames('sitdown', 20, true)]); idleAt = ts; return; }
    idleAt = ts; K.face = dir;
    var x = K.x + dir * 270 * dt / 1000;
    if (x < p.x0 || x > p.x1) {
      // the edge: a neighbour at the same height is one hop away; else the perch under his feet catches him; else he stops
      var next = null;
      perches.forEach(function (q) { if (q !== p && Math.abs(q.y - p.y) < 10 && (dir > 0 ? q.x0 > p.x1 && q.x0 - p.x1 < 130 : q.x1 < p.x0 && p.x0 - q.x1 < 130)) next = q; });
      var land = next || below(x + dir * 22, p.y);
      if (land) { push([arcTo(land, next ? (dir > 0 ? land.x0 + 6 : land.x1 - 6) : clampX(land, x + dir * 22), next ? 30 : 14)]); return; }
      x = clampX(p, x);
    }
    K.x = x; cell(SEQ.walk[0] + Math.floor(ts * 24 / 1000) % SEQ.walk[1]);
  }
  // the page follows him: he stays in the middle band of the screen
  function follow(dt) {
    if (!K.p) return;
    // a hop on the spot does not move the page: only a change of perch (or a walk off an edge) does
    var lift = cur && cur.k === 'arc' && cur.p === K.p ? 0 : K.lift;
    var y = K.p.y + lift - window.pageYOffset, lo = window.innerHeight * 0.3, hi = window.innerHeight * 0.64;
    var off = y < lo ? y - lo : y > hi ? y - hi : 0;
    if (off) window.scrollBy(0, off * Math.min(1, dt * 0.009));
  }

  /* ---------------- the seven seals ---------------- */
  var seals = (function () {
    // id, perch, where along it, how far above the edge (two of them want a hop: they hang where the page leaves air, above the plate and above the last band)
    var DEFS = [['s1', 'radio', 0.2, 0], ['s2', 'game', 0.9, 0], ['s3', 'plate0', 0.12, 92], ['s4', 'ask0', 0.84, 0], ['s5', 'card1', 0.5, 0], ['s6', 'kit', 0.42, 0], ['s7', 'back', 0.3, 92]];
    var got = [], nodes = {};
    try { got = JSON.parse(localStorage.getItem('numidea-seals') || '[]'); } catch (e) { got = []; }
    if (!Array.isArray(got)) got = [];
    got = got.filter(function (id) { return DEFS.some(function (s) { return s[0] === id; }); });
    var paint = function () {
      counts.forEach(function (c) { c.textContent = String(got.length); });
      if (prizeBtn) prizeBtn.hidden = got.length < DEFS.length;
    };
    var lay = function () {
      DEFS.forEach(function (s) {
        var p = perch(s[1]), n = nodes[s[0]];
        if (!n) return;
        n.hidden = !p || got.indexOf(s[0]) > -1;
        if (!p) return;
        n._x = p.x0 + (p.x1 - p.x0) * s[2]; n._y = p.y - 34 - s[3];
        n.style.transform = 'translate3d(' + (n._x - 17).toFixed(0) + 'px,' + (n._y - 17).toFixed(0) + 'px,0)';
      });
    };
    return {
      all: function () { return got.length >= DEFS.length; },
      show: function () {
        DEFS.forEach(function (s) { if (nodes[s[0]]) return; var n = d.createElement('i'); n.className = 'st-sealt'; n.setAttribute('lang', 'ja'); n.textContent = '印'; layer.appendChild(n); nodes[s[0]] = n; });
        lay();
      },
      hide: function () { Object.keys(nodes).forEach(function (k) { nodes[k].remove(); }); nodes = {}; },
      lay: lay, paint: paint,
      touch: function () {
        if (!K.p) return;
        var kx = K.x + K.face * 10, ky = K.p.y + K.lift - H * 0.36;
        Object.keys(nodes).forEach(function (id) {
          var n = nodes[id];
          if (n.hidden || n._got || Math.abs(n._x - kx) > 42 || Math.abs(n._y - ky) > 46) return;
          n._got = true; n.classList.add('is-got'); got.push(id);
          try { localStorage.setItem('numidea-seals', JSON.stringify(got)); } catch (e) {}
          paint();
          setTimeout(function () { n.hidden = true; }, 420);
          if (got.length >= DEFS.length) { speak(t('life.k.all')); setTimeout(function () { stop(); openPrize(); }, 1100); }
          else speak(t('life.k.seal').replace('{n}', String(got.length)));
        });
      }
    };
  })();
  var openPrize = function () { if (prize && typeof prize.showModal === 'function' && !prize.open) prize.showModal(); };
  if (prize) prize.addEventListener('click', function (e) { if (e.target === prize || e.target.closest('[data-prize-close]')) prize.close(); });
  if (prizeBtn) prizeBtn.addEventListener('click', openPrize);

  var start = function () {
    if (playing) return;
    measure(); clear();
    playing = true; held.left = held.right = false; sat = false; idleAt = now();
    root.classList.add('is-playing'); pad.hidden = false;
    playBtn.setAttribute('aria-pressed', 'true');
    // he comes to the strip's own edge, where the game starts
    var p = perch('game') || perches[0];
    push(rise().concat([{ k: 'sink', ms: 200 }, { k: 'tele', p: p, x: p.x0 + (p.x1 - p.x0) * 0.3, face: 1 }, call(function () { pose('look'); seals.show(); }), { k: 'rise', ms: 300 }, call(function () { pose('stand'); speak(t(seals.all() ? 'life.k.done' : 'life.k.play')); })]));
    try { pad.focus({ preventScroll: true }); } catch (e) { pad.focus(); }
  };
  function stop() {
    if (!playing) return;
    playing = false; held.left = held.right = false;
    root.classList.remove('is-playing'); pad.hidden = true; seals.hide();
    playBtn.setAttribute('aria-pressed', 'false');
    clear(); push([frames('sitdown'), call(function () { pose('sit'); })]);
    busyUntil = now() + 1500;
    try { playBtn.focus({ preventScroll: true }); } catch (e) {}
  }
  playBtn.addEventListener('click', function () { if (playing) stop(); else start(); });
  // the keys: only in play, never while a field is being typed in
  var KEY = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down', ' ': 'jump', Spacebar: 'jump' };
  var typing = function (e) { return e.target && e.target.closest && e.target.closest('input,textarea,select,[contenteditable],dialog[open]'); };
  window.addEventListener('keydown', function (e) {
    if (!playing || e.altKey || e.ctrlKey || e.metaKey || typing(e)) return;
    if (e.key === 'Escape') { stop(); return; }
    var k = KEY[e.key];
    if (!k) return;
    // Space on one of the pad's own buttons is that button's press (its click follows)
    if (k === 'jump' && e.target.closest && e.target.closest('[data-pad] button')) return;
    e.preventDefault();
    if (k === 'left' || k === 'right') { held[k] = true; held[k === 'left' ? 'right' : 'left'] = false; go(); }
    else if (!e.repeat) act(k);
  });
  window.addEventListener('keyup', function (e) {
    var k = KEY[e.key];
    if (!playing || !k) return;
    if (k === 'left' || k === 'right') held[k] = false;
    // and Space is never a press on whatever else holds the focus while he is being played
    if (k === 'jump' && !(e.target.closest && e.target.closest('[data-pad] button'))) e.preventDefault();
  });
  window.addEventListener('blur', function () { held.left = held.right = false; });
  // the pad: hold left or right, press the others
  [].forEach.call(pad.querySelectorAll('[data-pad-k]'), function (b) {
    var k = b.getAttribute('data-pad-k');
    if (k === 'left' || k === 'right') {
      var off = function () { held[k] = false; };
      b.addEventListener('pointerdown', function (e) { e.preventDefault(); held[k] = true; held[k === 'left' ? 'right' : 'left'] = false; go(); });
      b.addEventListener('pointerup', off); b.addEventListener('pointercancel', off); b.addEventListener('pointerleave', off);
      // from the keyboard (no pointer): one short walk per press
      b.addEventListener('click', function (e) { if (e.detail || !playing || cur || queue.length) return; sat = false; push([walkTo(clampX(K.p, K.x + (k === 'right' ? 110 : -110)), 270)]); });
    } else b.addEventListener('click', function () { act(k); });
  });
  pad.querySelector('[data-pad-exit]').addEventListener('click', stop);

  /* ---------------- start: after a first idle moment, asleep where the picture sleeps ---------------- */
  var init = function () {
    layer.hidden = false;
    measure();
    var p = perch('radio') || perches[0], still = d.querySelector('.st-radio__kuro');
    if (!p) { layer.hidden = true; return; }
    var x = p.x0 + (p.x1 - p.x0) * p.at;
    if (still && still.offsetWidth) { var r = still.getBoundingClientRect(); x = r.left + window.pageXOffset + r.width / 2; }
    K.p = p; K.x = clampX(p, x); K.face = root.getAttribute('dir') === 'rtl' ? 1 : -1;
    pose('asleep'); place();
    root.classList.add('has-life');
    seals.paint();
    playBtn.disabled = false;
    // the layout moves under him (a lesson opens, a language changes, the window turns): he stays on his perch
    var again = 0, relay = function () { cancelAnimationFrame(again); again = requestAnimationFrame(function () { var id = K.p && K.p.id, frac = K.p ? (K.x - K.p.x0) / Math.max(1, K.p.x1 - K.p.x0) : 0; measure(); var q = perch(id) || perches[0]; if (q) { K.p = q; if (!cur) K.x = clampX(q, q.x0 + (q.x1 - q.x0) * frac); place(); } if (playing) seals.lay(); }); };
    window.addEventListener('resize', relay);
    if ('ResizeObserver' in window) new ResizeObserver(relay).observe(d.querySelector('main'));
  };
  if ('requestIdleCallback' in window) requestIdleCallback(init, { timeout: 2500 }); else setTimeout(init, 900);
})();
