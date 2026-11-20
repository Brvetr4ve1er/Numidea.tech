/* ============================================================
   Numidea Labs — Kūro lives on the manual (hub/manuel.html)
   vanilla, no deps; loaded after app.js, on that page only

   One sprite (hub/img/studio/life/kuro.webp: 47 cells cut from five short
   clips of the same drawing: a walk cycle, sitting down, a blink, a look,
   a paw, lying down, asleep, a jump) on a layer that takes no click and is
   hidden from assistive tech. His ground is the top edge of real things on
   the page (the scene, the radio, this strip, the lessons' plate, the line
   above the open lesson's question, the frame of the open lesson's drawing,
   the four cards, the kit, the last band, the footer, the sill of the lit
   window in the town over the footer): "perches", measured from the layout,
   never drawn. He never stands over a lesson's drawing (the drawings show
   him: two of him side by side would read as a glitch).

   Two ways he moves, and both answer the visitor:
   · on his own, once per event and for a few seconds at most: when a scroll
     ends and he is out of sight he comes to a perch in view (through "the
     door": he sinks behind one edge and rises behind another; he is the
     gate, the bible says so; when nobody can see him leave, only the rise
     is played), when a lesson is picked or answered (an answer gets its
     reaction within a beat: where he stands if the trip is longer; a picked
     lesson's trip waits the third of a beat its panel takes to slide in), when
     the radio starts or stops, when a card is pointed at. Then he sits still.
     On the sill when the window lights, he looks up once.
   · in play ("Jouer avec Kūro"): the arrow keys or the pad walk him, Up
     leaps to the perch above, Down drops to the one below, Space hops.
     A leap is one honest parabola (one gravity, the landing exact); the
     page moves with him (a leap to another perch carries the camera to it
     over the leap's own time, a walk is chased gently, never by more than
     4% of the screen a frame), and a perch more than six tenths of a
     screen away is reached through the door, never by a long fall.
     Seven seals wait on the perches; all seven open the night drawing.
     Seals are kept on this device only (localStorage 'numidea-seals').

   Every time here is on the site's tempo, 90 BPM, the pulse of the radio's
   tracks: a beat of 667 ms, steps in whole eighths of it (83 ms), drawn
   cells in sixteenths; a step of the walk is measured in distance, so one
   cycle of thirteen cells covers one body length at any size.

   Nothing runs before a first idle moment, he wakes only once his sheet has
   decoded (the radio's sleeping picture crossfades into him), nothing runs
   while the tab is hidden, and with prefers-reduced-motion nothing here
   runs at all: the sleeping picture on the radio stays and the strip says
   the game is off.
   ============================================================ */
(function () {
  'use strict';
  var d = document, root = d.documentElement, body = d.body;
  var layer = d.querySelector('[data-life]'), strip = d.querySelector('[data-game]');
  if (!layer || !strip || !window.requestAnimationFrame) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // the site's tempo (the stylesheets' --m-* tokens): 90 BPM, a beat of 667 ms;
  // M(n) is n eighths of a beat, Q() rounds a drawn time to the nearest sixteenth
  var BEAT = 2000 / 3;
  var M = function (n) { return Math.round(n * BEAT / 8); };
  var Q = function (ms) { var s = BEAT / 16; return Math.round(Math.round(ms / s) * s); };
  var easeEnter = function (p) { return 1 - Math.pow(1 - p, 4); };
  var easeExit = function (p) { return p * p * p; };
  var easeMove = function (p) { return p < .5 ? 16 * p * p * p * p * p : 1 - Math.pow(-2 * p + 2, 5) / 2; };

  /* ---------------- the sheet ---------------- */
  var COLS = 8, ROWS = 6, AX = 0.5385, BASE = 3;
  var SEQ = { walk: [0, 13], stand: [13, 1], sitdown: [14, 6], sit: [20, 1], blink: [21, 1], look: [22, 1], tail: [23, 1], paw: [24, 5], lie: [29, 8], asleep: [37, 1], jump: [38, 9] };
  // the pose each clip leaves him in, played forward and backward (sitting down backward is standing up)
  var END = { sitdown: ['sit', 'stand'], lie: ['asleep', 'sit'], paw: ['sit', 'sit'] };
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
    ['fig', '.st-ls__panel:not([hidden]) .st-ls__fig', 0.5], ['card', '.st-mny__card', 0.8], ['kit', '.st-mny__kit', 0.94], ['back', '.st-back', 0.56], ['foot', '.st-foot', 0.5], ['sill', '[data-sky] .st-foot__win', 0.5]];
  // the sill's top line in the painted strip, as a share of its height (the art's measured geometry: the lit
  // glass ends a little above it); narrower than he is, it is one spot under the window's middle
  var SILL = 0.712, MANY = ['scene', 'plate', 'ask', 'fig', 'card'];
  var perches = [], W = 0, H = 0, docW = 0;
  var K = { p: null, x: 0, lift: 0, sink: 0, face: 1, cell: -1, pose: 'asleep' };   // Kūro: his perch, where along it, how high above it, how far sunk behind it, which way he faces
  var measure = function () {
    W = el.offsetWidth; H = el.offsetHeight; docW = root.clientWidth;
    var sx = window.pageXOffset, sy = window.pageYOffset, inset = Math.round(W * 0.2), out = [];
    DEF.forEach(function (df) {
      [].forEach.call(d.querySelectorAll(df[1]), function (node, i) {
        var r = node.getBoundingClientRect();
        if (df[0] === 'sill') {
          var sk = node.parentNode.getBoundingClientRect(), cx = Math.round(r.left + sx + r.width / 2);
          if (r.width && sk.height) out.push({ id: 'sill', el: node, x0: cx, x1: cx, y: Math.round(sk.top + sy + sk.height * SILL), at: 0.5 });
          return;
        }
        if (r.width < W * 0.9 || !r.height) return;
        // the kinds the page holds more than one of are numbered (three sets of lessons, three scenes, four cards):
        // a perch is found again by its id, and two of one name sent him to the first of them, up the page
        out.push({ id: MANY.indexOf(df[0]) > -1 ? df[0] + i : df[0], el: node, x0: r.left + sx + inset, x1: r.right + sx - inset, y: Math.round(r.top + sy), at: df[2] });
      });
    });
    out.sort(function (a, b) { return a.y - b.y || a.x0 - b.x0; });
    perches = out;
    // the perch under him is the same thing, measured again
    if (K.p) for (var i = 0; i < out.length; i++) if (out[i].id === K.p.id) { K.p = out[i]; break; }
  };
  var perch = function (id) { for (var i = 0; i < perches.length; i++) if (perches[i].id === id) return perches[i]; return null; };
  // a perch that is gone (a lesson closed under him): the one nearest the height he was at, not the top of the page
  var nearY = function (y) { var b = null; perches.forEach(function (p) { if (!b || Math.abs(p.y - y) < Math.abs(b.y - y)) b = p; }); return b; };
  // the same thing as a queued step knew it, measured again since
  var fresh = function (p) { return (p && perch(p.id)) || p; };
  // of several perches of one kind (two sets of lessons: two plates, two question lines), the one nearest the middle of the screen
  var nearestOf = function (kind) {
    var mid = window.pageYOffset + window.innerHeight * 0.5, best = null;
    perches.forEach(function (p) { if (p.id.indexOf(kind) === 0 && (!best || Math.abs(p.y - mid) < Math.abs(best.y - mid))) best = p; });
    return best;
  };
  var clampX = function (p, x) { return Math.max(p.x0, Math.min(p.x1, x)); };
  // is the air above this spot free of words and controls? (the layer takes no hit, so the page answers for itself;
  // the town's painted strip over the footer has no words in it, he may sit in front of it)
  var LEAF = 'h1,h2,h3,p,a,button,img,input,label,li,output,figcaption,svg,video';
  var free = function (p, x) {
    var cx = x - window.pageXOffset, top = p.y - window.pageYOffset - H * 0.7;
    if (top < 60 || p.y - window.pageYOffset > window.innerHeight) return false;
    // never in front of the open lesson's drawing: his whole cell, above his feet, stays off every figure shown
    var l = cx - W * AX, rr = cx + W * (1 - AX), tp = p.y - window.pageYOffset - H + BASE, bt = p.y - window.pageYOffset - 1, figs = d.querySelectorAll('.st-ls__fig');
    for (var f = 0; f < figs.length; f++) {
      var fr = figs[f].getBoundingClientRect();
      if (fr.height && rr > fr.left && l < fr.right && bt > fr.top && tp < fr.bottom) return false;
    }
    var pts = [[cx - W * 0.22, top + 6], [cx + W * 0.22, top + 6], [cx, top + H * 0.36], [cx - W * 0.3, p.y - window.pageYOffset - 12], [cx + W * 0.25, p.y - window.pageYOffset - 12]];
    for (var i = 0; i < pts.length; i++) {
      var hit = d.elementFromPoint(pts[i][0], pts[i][1]);
      if (!hit || (hit.closest(LEAF) && !hit.closest('.st-foot__sky')) || hit.closest('.st-nav,.st-pad,.st-rchip,dialog')) return false;
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
  // the page's scroll that puts a perch a little above the middle of the screen
  var scrollFor = function (p) { return Math.max(0, Math.min(root.scrollHeight - window.innerHeight, p.y - window.innerHeight * 0.47)); };
  // the script moves the page itself, frame by frame: never through the page's smooth scrolling
  var scrollNow = function (y) { try { window.scrollTo({ top: y, behavior: 'instant' }); } catch (e) { window.scrollTo(0, y); } };

  /* ---------------- Kūro ---------------- */
  var cell = function (i) {
    if (i === K.cell) return; K.cell = i;
    spr.style.backgroundPosition = ((i % COLS) * 100 / (COLS - 1)).toFixed(3) + '% ' + (Math.floor(i / COLS) * 100 / (ROWS - 1)).toFixed(3) + '%';
  };
  var pose = function (name) { K.pose = name; cell(SEQ[name][0]); };
  var sayOn = false, sayW = 0, sayAt = '';
  var place = function () {
    if (!K.p) return;
    var x = Math.max(W * AX + 4, Math.min(docW - W * (1 - AX) - 4, K.x));
    el.style.transform = 'translate3d(' + (x - W * AX).toFixed(1) + 'px,' + (K.p.y + K.lift - H + BASE).toFixed(1) + 'px,0)';
    spr.style.transform = 'translateY(' + (K.sink * 100).toFixed(1) + '%) scaleX(' + K.face + ')';
    // played, his bubble goes where he goes, in the same frame
    if (sayOn && playing) placeSay();
  };
  var onScreen = function () {
    if (!K.p) return false;
    var y = K.p.y - window.pageYOffset;
    return y > 96 && y < window.innerHeight - 6;
  };

  /* ---------------- bubbles ---------------- */
  var sayT = 0, sayYT = 0;
  var placeSay = function () {
    var x = Math.max(sayW / 2 + 8, Math.min(docW - sayW / 2 - 8, K.x + K.face * 8));
    var tr = 'translate3d(' + x.toFixed(0) + 'px,' + (K.p.y + K.lift - H * 0.78).toFixed(0) + 'px,0) translate(-50%,-100%)';
    if (tr !== sayAt) { sayAt = tr; say.style.transform = tr; }
  };
  var unsay = function () { clearTimeout(sayT); sayOn = false; say.classList.remove('is-on'); };
  var speak = function (text) {
    if (!text || !K.p) return;
    var show = function () {
      say.textContent = text; sayW = say.offsetWidth; sayAt = '';
      placeSay(); sayOn = true; say.classList.add('is-on');
      clearTimeout(sayT); sayT = setTimeout(unsay, M(32));
    };
    // a bubble already up leaves first (the sheet takes a quarter beat), then the new words arrive
    if (sayOn) { unsay(); sayT = setTimeout(show, M(2)); } else { clearTimeout(sayT); show(); }
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
    clearTimeout(sayYT); sayYT = setTimeout(function () { sayY.classList.remove('is-on'); }, M(48));
  };

  /* ---------------- the runner: a queue of small steps, one rAF loop that stops when it is empty ---------------- */
  var queue = [], cur = null, raf = 0, last = 0, playing = false, hidden = false, hiddenAt = 0, walked = 0;
  var go = function () { if (!raf && !hidden) { last = 0; raf = requestAnimationFrame(tick); } };
  var push = function (steps) { queue = queue.concat(steps); go(); };
  // where a clip cut short leaves him: the pose nearer to the cell he was on
  var poseAt = function (s) { var e = END[s.name], late = now() - s.at > s.ms / 2; return e ? (late !== s.rev ? e[0] : e[1]) : K.pose; };
  // a new request never cuts him: a leap in the air lands first, and half behind an edge he comes back up from where he is
  var clear = function () {
    queue = [];
    if (cur && cur.k === 'arc' && !cur.down) return;
    if (cur && cur.k === 'frames') K.pose = poseAt(cur);
    // a walk cut short hands its place in the cycle to the next one, so his feet do not skip
    if (cur && cur.k === 'walk') walked = cur.d || 0;
    cur = null;
    if (K.sink > 0) queue.push({ k: 'rise', rev: true });
  };
  // steps
  var frames = function (name, ms, rev) { return { k: 'frames', name: name, ms: ms, rev: !!rev }; };
  var walkTo = function (x, speed) { return { k: 'walk', to: x, speed: speed }; };
  var arcTo = function (p, x, peak) { return { k: 'arc', p: p, x: x, peak: peak == null ? 46 : peak }; };
  var call = function (fn) { return { k: 'call', fn: fn }; };
  var wait = function (ms) { return { k: 'wait', ms: ms }; };
  // on his own one stride (a body length) per beat; played, one per three quarters of a beat
  var ownSpeed = function () { return W * 1000 / BEAT; };
  var playSpeed = function () { return W * 1000 / M(6); };
  var rise = function () {
    // whatever he was doing, he is on his feet first; already up, nothing
    if (K.pose === 'asleep') return [frames('lie', M(6), true), frames('sitdown', M(3), true)];
    if (K.pose === 'sit' || K.pose === 'look' || K.pose === 'blink' || K.pose === 'tail') return [frames('sitdown', M(3), true)];
    return [];
  };
  var riseMs = function () { return K.pose === 'asleep' ? M(9) : K.pose === 'stand' ? 0 : M(3); };
  var settle = function (how) { return how === 'sleep' ? [frames('sitdown', M(6)), frames('lie', M(8)), call(function () { pose('asleep'); })] : [frames('sitdown', M(6)), call(function () { pose(how === 'look' ? 'look' : 'sit'); })]; };
  // a leap under one gravity: up to `peak` above the higher end, down onto the other, in whole eighths of a beat
  var G = 2400;
  var flight = function (dy, peak) {
    var h = peak + Math.max(0, -dy), a = Math.sqrt(h), b = Math.sqrt(Math.max(0, h + dy));
    var T = M(Math.max(4, Math.min(12, Math.round(Math.sqrt(2 / G) * (a + b) * 8000 / BEAT))));
    // the gravity that makes that time land exactly where he is going
    var g = 2 * (a + b) * (a + b) / Math.pow(T / 1000, 2);
    return { T: T, g: g, v0: -Math.sqrt(2 * g * h) };
  };
  var step = function (s, dt, t0) {
    var n, p, i, c = M(1);
    if (s.k === 'call') { s.fn(); return true; }
    if (s.k === 'wait') { return t0 >= s.ms; }
    if (s.k === 'frames') {
      // the clip's cells spread over its length, so a clip lasts the same at any frame rate
      n = SEQ[s.name][1];
      if (t0 >= s.ms) { cell(SEQ[s.name][0] + (s.rev ? 0 : n - 1)); if (END[s.name]) K.pose = END[s.name][s.rev ? 1 : 0]; return true; }
      i = Math.min(n - 1, Math.floor(t0 / s.ms * n));
      cell(SEQ[s.name][0] + (s.rev ? n - 1 - i : i)); return false;
    }
    if (s.k === 'walk') {
      if (s.d == null) { s.d = walked; walked = 0; s.v = s.speed || ownSpeed(); }
      // an eighth of a beat to get going and to stop; the cell follows the ground covered, so his feet never slide
      var rem = Math.abs(s.to - K.x), dir = s.to > K.x ? 1 : -1;
      var dx = s.v * Math.max(0.2, Math.min(1, t0 / c, rem / (s.v * c / 1000))) * dt / 1000;
      if (rem <= Math.max(dx, 0.5)) { K.x = s.to; cell(SEQ.stand[0]); K.pose = 'stand'; walked = 0; return true; }
      K.face = dir; K.x += dir * dx; s.d += dx;
      cell(SEQ.walk[0] + Math.floor(s.d / (W / 13)) % SEQ.walk[1]); return false;
    }
    if (s.k === 'sink' || s.k === 'rise') {
      // behind the edge on the leaving curve, back up on the arriving one, from wherever he is
      if (s.from == null) { s.from = K.sink; if (s.ms == null) s.ms = M(3) * (s.k === 'sink' ? 1 - s.from : s.from); }
      p = s.ms > 0 ? Math.min(1, t0 / s.ms) : 1;
      K.sink = s.k === 'sink' ? s.from + (1 - s.from) * easeExit(p) : s.from * (1 - easeEnter(p));
      if (p >= 1 && s.then) s.then();
      return p >= 1;
    }
    if (s.k === 'pan') {
      /* the door, played: while he is behind his edge the page is carried to
         the far perch on the move curve (the page lift's), half a beat or
         more as the distance asks, a two-beat cap: one cut of most of a
         screen in a single frame made everything else on the page jump */
      if (s.from == null) { s.from = window.pageYOffset; s.ms = M(Math.max(6, Math.min(16, Math.round(Math.abs(s.top - s.from) / Math.max(1, window.innerHeight) * 8)))); }
      p = Math.min(1, t0 / s.ms);
      scrollNow(s.from + (s.top - s.from) * easeMove(p));
      return p >= 1;
    }
    if (s.k === 'tele') {
      // only while he is out of sight; played, his bubble does not travel with him
      K.p = fresh(s.p); K.x = clampX(K.p, s.x); K.lift = 0; if (s.face) K.face = s.face; if (s.sink != null) K.sink = s.sink;
      if (s.top != null) scrollNow(s.top);
      if (sayOn && playing) unsay();
      return true;
    }
    if (s.k === 'arc') {
      // a leap: crouch on the spot, then one parabola from here to there (x even in time, y under one gravity),
      // the flight's cells by progress, a landing cell held for an eighth of a beat
      if (!s.T) {
        s.p = fresh(s.p) || K.p; if (s.x == null) s.x = K.x;
        s.x0 = K.x; s.dy = s.p.y - K.p.y; s.dx = s.x - K.x;
        var f = flight(s.dy, s.peak); s.T = f.T; s.g = f.g; s.v0 = f.v0;
        if (Math.abs(s.dx) > 6) K.face = s.dx > 0 ? 1 : -1;
        K.pose = 'stand'; walked = 0;
        // played, a leap to another perch carries the page to it over the leap's own time, from the crouch
        if (playing && s.p.id !== K.p.id) s.cam = [window.pageYOffset, scrollFor(s.p)];
      }
      var tf = t0 - c;
      if (tf < 0) cell(SEQ.jump[0] + (t0 < c / 2 ? 0 : 1));
      else if (tf < s.T) {
        p = tf / s.T; var ts = tf / 1000;
        K.x = s.x0 + s.dx * p; K.lift = s.v0 * ts + s.g * ts * ts / 2;
        cell(SEQ.jump[0] + (p < 0.12 ? 2 : p < 0.34 ? 3 : p < 0.56 ? 4 : p < 0.74 ? 5 : p < 0.9 ? 6 : 7));
      } else if (!s.down) { s.down = 1; K.p = s.p; K.x = s.x; K.lift = 0; cell(SEQ.jump[0] + 8); }
      // up, the page leads him there on the arriving curve, as he slows towards the top; down, it goes with his fall
      // (a fall starts slowly and ends fast: a page that led would leave him above the screen), and never back up
      if (s.cam) scrollNow(s.cam[0] + (s.cam[1] - s.cam[0]) * (s.dy > 0 ? (s.down ? 1 : Math.max(0, Math.min(1, K.lift / s.dy))) : easeEnter(Math.min(1, t0 / s.T))));
      if (tf < s.T + c) return false;
      K.pose = 'stand'; return true;
    }
    return true;
  };
  var backT = 0;
  function tick(ts) {
    var dt = last ? Math.min(48, Math.max(0, ts - last)) : 16; last = ts;
    // steps that end hand over to the next in the same frame, so a trip has no still frame between its parts
    for (var guard = 0; guard < 8; guard++) {
      if (!cur && queue.length) { cur = queue.shift(); cur.at = ts; }
      if (!cur || !step(cur, guard ? 0 : dt, ts - cur.at)) break;
      cur = null;
      // a trip that ends out of sight (the page scrolled away meanwhile): he comes back once more
      if (!queue.length && !playing && !onScreen()) { clearTimeout(backT); backT = setTimeout(function () { come(true); }, M(3)); }
    }
    if (!cur && !queue.length && playing) drive(dt, ts);
    place();
    if (playing) { if (!cur || (cur.k !== 'arc' && cur.k !== 'pan')) follow(dt); seals.touch(); }
    // the id of this frame's request is kept until here, so a step that queues more does not start a second loop
    raf = cur || queue.length || playing ? requestAnimationFrame(tick) : 0;
  }
  d.addEventListener('visibilitychange', function () {
    hidden = d.hidden;
    // a hidden tab stops him where he is, and he goes on from there (not from where the clock got to)
    if (hidden) { cancelAnimationFrame(raf); raf = 0; hiddenAt = now(); }
    else { if (cur) cur.at += now() - hiddenAt; if (cur || queue.length || playing) go(); }
  });

  /* ---------------- on his own: one short trip per event ---------------- */
  var busyUntil = 0;
  // through the door: down behind this edge, up behind that one, three eighths of a beat each way and as long a hold;
  // out of sight he does not need to leave: he is already behind the new edge and only rises
  var door = function (p, x, how, tail, opt) {
    opt = opt || {};
    var steps, face = opt.face || (x > docW / 2 ? -1 : 1);
    if (queue[0] && queue[0].rev) queue.shift();
    if (!onScreen()) steps = [{ k: 'tele', p: p, x: x, face: face, sink: 1 }];
    else steps = (K.sink > 0 ? [] : rise()).concat([{ k: 'sink' }, { k: 'tele', p: p, x: x, face: face }]);
    steps.push(call(function () { pose('look'); }), { k: 'rise', ms: M(3), from: 1, then: opt.up });
    if (how !== 'none') {
      steps.push(wait(M(3)));
      if (how === 'sleep') steps.push(frames('lie', M(8)), call(function () { pose('asleep'); }));
      else if (how !== 'look') steps.push(call(function () { pose('sit'); }));
    }
    return steps.concat(tail);
  };
  // what a trip to this perch would be: none, a walk along his own, a leap in view, or the door
  var plan = function (p, want) {
    if (playing || !p) return null;
    var x = seat(p, want);
    if (x == null) return null;
    var kind = K.p === p && Math.abs(x - K.x) < 520 ? (Math.abs(x - K.x) < 12 ? 'here' : 'walk')
      : K.p && onScreen() && Math.abs(p.y - K.p.y) < 560 && Math.abs(x - K.x) < 620 ? 'arc' : 'door';
    return { p: p, x: x, kind: kind };
  };
  // how long before he is there, near enough
  var tripMs = function (g) {
    if (g.kind === 'here') return 0;
    if (g.kind === 'door') return Infinity;
    if (g.kind === 'walk') return riseMs() + Math.abs(g.x - K.x) * 1000 / ownSpeed() + M(1);
    return riseMs() + M(2) + flight(g.p.y - K.p.y, 46).T;
  };
  var trip = function (g, how, tail) {
    if (g.kind === 'door') return door(g.p, g.x, how, tail);
    var steps = g.kind === 'here' ? [] : rise().concat([g.kind === 'walk' ? walkTo(g.x) : arcTo(g.p, g.x)]);
    if (g.kind !== 'here' && how !== 'none') steps = steps.concat(settle(how));
    return steps.concat(tail);
  };
  var tailOf = function (after) { return typeof after === 'function' ? [call(after)] : after || []; };
  var inAir = function () { return cur && cur.k === 'arc' && !cur.down; };
  var arrive = function (p, want, how, after) {
    if (playing || !p) return false;
    // a leap in the air lands first (it takes at most a beat and a half), then the trip is planned from where he landed
    if (inAir()) { clear(); busyUntil = now() + M(16); push([call(function () { arrive(fresh(p), want, how, after); })]); return true; }
    var g = plan(p, want);
    if (!g) return false;
    clear(); busyUntil = now() + M(16);
    push(trip(g, how, tailOf(after)));
    return true;
  };
  // when a scroll ends and he is out of sight, he comes to the perch nearest the middle of the screen
  var scrollT = 0;
  var come = function (again) {
    if (playing || cur || queue.length || (!again && now() < busyUntil) || onScreen()) return;
    measure();
    var mid = window.pageYOffset + window.innerHeight * 0.5, best = null, bx = null, sill = null, sx = null;
    perches.forEach(function (p) {
      var y = p.y - window.pageYOffset;
      if (y < 140 || y > window.innerHeight * 0.86) return;
      var x = seat(p);
      if (x != null && p.id === 'sill') { sill = p; sx = x; }
      if (x != null && (!best || Math.abs(p.y - mid) < Math.abs(best.y - mid))) { best = p; bx = x; }
    });
    // the strip's top edge and the sill under its window are one place: there, he sits on the sill
    if (best && best.id === 'foot' && sill) { best = sill; bx = sx; }
    if (best) arrive(best, bx, 'sit', best.id === 'back' || best.id === 'foot' || best.id === 'sill' ? yasser : null);
  };
  window.addEventListener('scroll', function () { clearTimeout(scrollT); if (!playing) scrollT = setTimeout(come, M(4)); }, { passive: true });

  // the page tells what happened (hub/app.js 13 and 15)
  var tabX = function (id) { var b = d.querySelector('[data-ls-tab="' + id + '"]'); if (!b) return null; var r = b.getBoundingClientRect(); return r.left + window.pageXOffset + r.width / 2; };
  var saidTab = false;
  // by the lesson: on the plate's edge over the picked tab when that edge is in view, else on the line above the question
  var byLesson = function (id, how, after) { return arrive(nearestOf('plate'), tabX(id), how, after) || arrive(nearestOf('ask'), null, how, after); };
  // the picked lesson's panel slides in first (a third of a beat, hub/style.css m-slide), then he goes: the two moves
  // never overlap, and the plate is measured where it has come to rest; a second pick in that time replaces the first
  var tabT = 0;
  d.addEventListener('numidea:tab', function (e) {
    var id = e.detail.id;
    clearTimeout(tabT);
    tabT = setTimeout(function () {
      measure();
      byLesson(id, 'look', saidTab ? null : function () { saidTab = true; speak(t('life.k.tab')); });
    }, M(4));
  });
  var answered = function (detail) {
    measure();
    var right = detail.right;
    // a hop for a right answer, a paw for a wrong one, wherever he is when it starts
    var react = function (going) {
      if (right) return [arcTo(null, null, 54), call(function () { if (!going) pose('sit'); speak(pick(detail.first ? 'life.k.right' : 'life.k.again')); })];
      return [call(function () { if (K.pose === 'stand') queue.unshift(frames('sitdown', M(3))); }), frames('paw', M(6)), frames('paw', M(6), true), call(function () { pose('sit'); speak(pick('life.k.wrong')); })];
    };
    if (playing) { if (right) speak(pick('life.k.right')); return; }
    // in the air, he lands first (a beat and a half at most) and answers from there
    if (inAir()) { clear(); push([call(function () { answered(detail); })]); return; }
    var g = plan(nearestOf('ask'), null) || plan(nearestOf('plate'), tabX(detail.id));
    if (!g) { if (onScreen()) { clear(); push(react()); } return; }
    clear(); busyUntil = now() + M(16);
    // the answer is answered within a beat: a longer trip in view waits until he has reacted where he stands;
    // out of sight the door brings him (only its rise) and the reaction follows it at once
    if (onScreen() && tripMs(g) > BEAT) push(react(true).concat([call(function () { arrive(fresh(g.p), g.x, 'sit'); })]));
    else push(trip(g, 'none', react()));
  };
  d.addEventListener('numidea:lesson', function (e) { answered(e.detail); });
  // a client course's brief sent, copied or printed (hub/app.js 13b): if he is in view, the stamp's word (the first of life.k.right), nothing new
  d.addEventListener('numidea:brief', function () { if (!playing && onScreen()) speak(t('life.k.right').split('|')[0]); });
  d.addEventListener('numidea:radio', function (e) {
    if (playing) return;
    measure();
    var p = perch('radio');
    if (e.detail.on) arrive(p, null, 'sit', function () { speak(t('life.k.radio')); });
    else if (K.p === p && !cur && !queue.length && K.pose !== 'asleep') push((K.pose === 'stand' ? [frames('sitdown', M(6))] : []).concat([frames('lie', M(8)), call(function () { pose('asleep'); })]));
  });
  // the town's window lights once (hub/app.js 4 says so as the strip shows; the cover is cut half a beat later, at the
  // end of an eighth): on the sill and still, he looks up as it lights, once, for a beat, then sits again
  d.addEventListener('numidea:window-lit', function () {
    setTimeout(function () {
      if (playing || !K.p || K.p.id !== 'sill' || cur || queue.length || (K.pose !== 'sit' && K.pose !== 'look')) return;
      push([call(function () { pose('look'); }), wait(BEAT), call(function () { pose('sit'); })]);
    }, M(7));
  });
  // a card pointed at for half a second (three quarters of a beat): he goes and sits on it (a mouse only)
  if (matchMedia('(hover:hover)').matches) [].forEach.call(d.querySelectorAll('.st-mny__card'), function (c, i) {
    var tm = 0;
    c.addEventListener('pointerenter', function () { tm = setTimeout(function () { if (cur || queue.length || now() < busyUntil) return; measure(); var first = !c.hasAttribute('data-life-seen'); c.setAttribute('data-life-seen', ''); arrive(perch('card' + i), null, 'look', first && i === 0 ? function () { speak(t('life.k.card')); } : null); }, M(6)); });
    c.addEventListener('pointerleave', function () { clearTimeout(tm); });
  });

  /* ---------------- play ---------------- */
  var held = { left: false, right: false }, idleAt = 0, sat = false;
  // the perch that catches him when he walks off an edge: never further down than six tenths of the screen
  var below = function (x, y) { var b = null, deep = window.innerHeight * 0.6; perches.forEach(function (p) { if (p.y > y + 6 && p.y - y <= deep && x >= p.x0 - 16 && x <= p.x1 + 16 && (!b || p.y < b.y)) b = p; }); return b; };
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
    else if ((p = nearest(what === 'up'))) {
      var x = clampX(p, K.x), then = call(function () { if (p.id === 'back' || p.id === 'foot' || p.id === 'sill') yasser(); });
      // too far for a leap that stays on screen: the door, and the page travels there while he is behind the edge
      if (Math.abs(p.y - K.p.y) > window.innerHeight * 0.6) push([{ k: 'sink' }, { k: 'pan', top: scrollFor(p) }, { k: 'tele', p: p, x: x }, { k: 'rise' }, then]);
      else push([arcTo(p, x, what === 'up' ? 46 : 22), then]);
    }
    else push([arcTo(K.p, K.x, 40)]);
  };
  function drive(dt, ts) {
    var dir = held.right ? 1 : held.left ? -1 : 0, p = K.p;
    if (!dir) {
      walked = 0;
      if (!sat && ts - idleAt > M(16)) { sat = true; push([frames('sitdown', M(6)), call(function () { pose('sit'); })]); }
      else if (!sat) cell(SEQ.stand[0]);
      return;
    }
    if (sat) { sat = false; push([frames('sitdown', M(3), true)]); idleAt = ts; return; }
    idleAt = ts;
    if (dir !== K.face) walked = 0;
    K.face = dir; K.pose = 'stand';
    var x = K.x + dir * playSpeed() * dt / 1000;
    if (x < p.x0 || x > p.x1) {
      // the edge: a neighbour at the same height is one hop away; else a perch not too far under his feet catches him;
      // else he stops there and looks down
      var next = null;
      perches.forEach(function (q) { if (q !== p && Math.abs(q.y - p.y) < 10 && (dir > 0 ? q.x0 > p.x1 && q.x0 - p.x1 < 130 : q.x1 < p.x0 && p.x0 - q.x1 < 130)) next = q; });
      var land = next || below(x + dir * 22, p.y);
      if (land) { push([arcTo(land, next ? (dir > 0 ? land.x0 + 6 : land.x1 - 6) : clampX(land, x + dir * 22), next ? 30 : 14)]); return; }
      x = clampX(p, x);
      if (Math.abs(x - K.x) < 0.01) { K.x = x; cell(SEQ.look[0]); return; }
    }
    walked += Math.abs(x - K.x); K.x = x;
    cell(SEQ.walk[0] + Math.floor(walked / (W / 13)) % SEQ.walk[1]);
  }
  // the page follows him outside a leap: he stays in the middle band of the screen, chased over about an eighth of a beat,
  // never more than 4% of the screen in one frame; his height in a hop never moves it
  function follow(dt) {
    if (!K.p) return;
    var y = K.p.y - window.pageYOffset, lo = window.innerHeight * 0.3, hi = window.innerHeight * 0.64;
    var off = y < lo ? y - lo : y > hi ? y - hi : 0, cap = window.innerHeight * 0.04;
    var mv = Math.max(-cap, Math.min(cap, off * (1 - Math.exp(-dt / M(1)))));
    if (Math.abs(mv) >= 0.5) scrollNow(window.pageYOffset + mv);
  }

  /* ---------------- the seven seals ---------------- */
  var seals = (function () {
    // id, perch, where along it, how far above the edge (two of them want a hop: they hang where the page leaves air, above the plate and above the last band)
    var DEFS = [['s1', 'radio', 0.2, 0], ['s2', 'game', 0.9, 0], ['s3', 'plate0', 0.12, 92], ['s4', 'ask0', 0.84, 0], ['s5', 'card1', 0.5, 0], ['s6', 'kit', 0.42, 0], ['s7', 'back', 0.3, 92]];
    var got = [], nodes = {}, on = false;
    try { got = JSON.parse(localStorage.getItem('numidea-seals') || '[]'); } catch (e) { got = []; }
    if (!Array.isArray(got)) got = [];
    got = got.filter(function (id) { return DEFS.some(function (s) { return s[0] === id; }); });
    var paint = function () {
      counts.forEach(function (c) { c.textContent = String(got.length); });
      if (prizeBtn) prizeBtn.hidden = got.length < DEFS.length;
    };
    // made once, then only shown and hidden: the sheet animates both ways, a sixteenth of a beat apart
    var make = function () {
      if (Object.keys(nodes).length) return;
      DEFS.forEach(function (s) { var n = d.createElement('i'); n.className = 'st-sealt'; n.setAttribute('lang', 'ja'); n.textContent = '印'; n.hidden = true; layer.appendChild(n); nodes[s[0]] = n; });
    };
    var lay = function () {
      var k = 0;
      DEFS.forEach(function (s) {
        var p = perch(s[1]), n = nodes[s[0]];
        if (!n) return;
        var want = on && !!p && got.indexOf(s[0]) < 0;
        if (p) {
          n._x = p.x0 + (p.x1 - p.x0) * s[2]; n._y = p.y - 34 - s[3];
          // never over the open lesson's drawing or its caption: on its nearer side, in the gap between the columns
          [].forEach.call(d.querySelectorAll('.st-ls__fig'), function (f) {
            var r = f.getBoundingClientRect(), L = r.left + window.pageXOffset, R = r.right + window.pageXOffset, T = r.top + window.pageYOffset;
            if (r.height && n._x + 17 > L && n._x - 17 < R && n._y + 17 > T && n._y - 17 < T + r.height) n._x = n._x - L < R - n._x ? L - 23 : R + 23;
          });
          n.style.transform = 'translate3d(' + (n._x - 17).toFixed(0) + 'px,' + (n._y - 17).toFixed(0) + 'px,0)';
        }
        if (want && n.hidden) n.style.setProperty('--i', k++);
        n.hidden = !want;
      });
    };
    return {
      all: function () { return got.length >= DEFS.length; },
      make: make,
      show: function () { on = true; lay(); },
      hide: function () { on = false; Object.keys(nodes).forEach(function (k) { nodes[k].hidden = true; }); },
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
          // gone when its stamp has played (the sheet's three quarters of a beat), or after that time if no stamp plays
          var gone = function () { clearTimeout(n._t); n.removeEventListener('animationend', gone); n.hidden = true; };
          n.addEventListener('animationend', gone); n._t = setTimeout(gone, M(6));
          if (got.length >= DEFS.length) { speak(t('life.k.all')); setTimeout(function () { stop(); openPrize(); }, M(12)); }
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
    measure(); clear(); seals.make();
    playing = true; held.left = held.right = false; sat = false; idleAt = now();
    root.classList.add('is-playing'); pad.hidden = false;
    playBtn.setAttribute('aria-pressed', 'true');
    // he comes to the strip's own edge, where the game starts, through the same door as on his own; the seals
    // arrive as his head clears the edge, and he stands up in the time the door holds
    var p = perch('game') || perches[0];
    push(door(p, p.x0 + (p.x1 - p.x0) * 0.3, 'none', [frames('sitdown', M(3), true), call(function () { speak(t(seals.all() ? 'life.k.done' : 'life.k.play')); })], { face: 1, up: seals.show }));
    try { pad.focus({ preventScroll: true }); } catch (e) { pad.focus(); }
  };
  function stop() {
    if (!playing) return;
    playing = false; held.left = held.right = false;
    root.classList.remove('is-playing'); pad.hidden = true; seals.hide();
    playBtn.setAttribute('aria-pressed', 'false');
    // a leap in the air lands, then he sits
    clear(); if (cur || queue.length || K.pose !== 'sit') push([frames('sitdown', M(6)), call(function () { pose('sit'); })]);
    busyUntil = now() + M(16);
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
      // from the keyboard (no pointer): one stride per press, a body length
      b.addEventListener('click', function (e) { if (e.detail || !playing || cur || queue.length) return; sat = false; push([walkTo(clampX(K.p, K.x + (k === 'right' ? W : -W)), playSpeed())]); });
    } else b.addEventListener('click', function () { act(k); });
  });
  pad.querySelector('[data-pad-exit]').addEventListener('click', stop);

  /* ---------------- start: after a first idle moment, asleep where the picture sleeps, once his sheet is ready ---------------- */
  var woke = false;
  var wake = function () {
    if (woke) return; woke = true;
    layer.hidden = false;
    measure();
    var p = perch('radio') || perches[0], still = d.querySelector('.st-radio__kuro');
    if (!p) { layer.hidden = true; return; }
    var x = p.x0 + (p.x1 - p.x0) * p.at;
    if (still && still.offsetWidth) { var r = still.getBoundingClientRect(); x = r.left + window.pageXOffset + r.width / 2; }
    K.p = p; K.x = clampX(p, x); K.face = root.getAttribute('dir') === 'rtl' ? 1 : -1;
    pose('asleep'); place();
    // in the same frame: the sheet crossfades the radio's sleeping picture out and him in
    root.classList.add('has-life'); el.classList.add('is-ready');
    seals.paint();
    playBtn.disabled = false;
    // the layout moves under him (a lesson opens, a language changes, the window turns): he stays on his perch, and a leap keeps its landing
    var again = 0, relay = function () { cancelAnimationFrame(again); again = requestAnimationFrame(function () {
      var id = K.p && K.p.id, y = K.p ? K.p.y : 0, frac = K.p ? (K.x - K.p.x0) / Math.max(1, K.p.x1 - K.p.x0) : 0;
      var arc = cur && cur.k === 'arc' && cur.p ? cur : null, aid = arc && arc.p.id, ay = arc && arc.p.y;
      measure();
      var q = perch(id) || nearY(y);
      if (q) { K.p = q; if (!cur) K.x = clampX(q, q.x0 + (q.x1 - q.x0) * frac); }
      if (arc) arc.p = perch(aid) || nearY(ay) || arc.p;
      place();
      if (playing) seals.lay();
    }); };
    window.addEventListener('resize', relay);
    if ('ResizeObserver' in window) new ResizeObserver(relay).observe(d.querySelector('main'));
  };
  var init = function () {
    // the sheet the sprite paints, fetched and decoded before he shows: until then the radio's picture sleeps on
    var m = /url\((['"]?)(.*?)\1\)/.exec(getComputedStyle(spr).backgroundImage || '');
    if (!m) { wake(); return; }
    var im = new Image(); im.src = m[2];
    // a sheet that failed to arrive leaves the picture where it is, rather than an empty radio
    (im.decode ? im.decode() : new Promise(function (r, no) { im.onload = r; im.onerror = no; })).then(wake, function () { if (im.naturalWidth) wake(); });
  };
  if ('requestIdleCallback' in window) requestIdleCallback(init, { timeout: M(30) }); else setTimeout(init, M(30));
})();
