/* ============================================================
   « Les enquêtes de nuit » (hub/lanterne/enquetes.html, 2026-11-23).
   The Librairie's night stall as a game: one claim waits, the player
   bets, points at the proof on a mock screen six times, stamps the
   claim, and sticks the closed case on the chart.

   Two parts. The CORE is the rules and nothing else: tries, hints,
   the queue of items carried back, flames, XP, titles. It touches no
   page, so scripts/enquetes-lint.mjs walks it in Node. The VIEW draws
   the core's state: real buttons, textContent only, one polite live
   region, focus moved to the prompt on each step. The prompt comes before the evidence in the page, so
   the first Tab lands on an answer.

   Structure comes from the page's #enq-data block (hub/src/lanterne/
   enquetes.json), words from the page's dictionary (lant.enq.*).
   Progress is one localStorage key; nothing is sent, and no request
   is made after the page has loaded. Sound is eight short tones under
   the radio's switch: no audio context exists before the radio plays.
   One move per tap, 300 ms at most, none under reduced motion or the
   Mouvement toggle. No streak, no clock, no lock: flames light and
   never dim, XP is a count that buys nothing.
   ============================================================ */
(function (G) {
  'use strict';

  /* ======================= the core ======================= */
  function create(D, opt) {
    opt = opt || {};
    var rnd = opt.random || Math.random;
    var N = D.cases.length;
    var zeros = function (v) { var a = []; for (var i = 0; i < N; i++) a.push(v); return a; };
    var s = { screen: 'door', back: false, talk: null, sheet: '', crew: '', list: false,
      xpBy: zeros(0), flBy: zeros(0), closed: zeros(false), stuck: 0, toStick: 0, ring: false,
      depth: 1, bet: '', stamp: '', plan: [], si: 0, phase: 'ask', tries: 0, off: [], picked: '', hintN: 0,
      hints: 0, first: 0, end: 0, xpRun: 0, queue: [], lost: [], eye: false, open: '', sel: '', slots: [],
      order: [], ki: 0, gain: 0, kuro: '', flameNow: false, queuedNow: false, wrongSlot: false, last: null,
      prev: 0, moved: 0, badSlot: -1 };
    var XP = D.xp, FL = D.flamesAt;

    /* ---- progress: what a reload keeps ---- */
    function progress() { return { v: 1, xpBy: s.xpBy.slice(), flBy: s.flBy.slice(), closed: s.closed.slice(), stuck: s.stuck, toStick: s.toStick, back: s.back, list: s.list, ring: s.ring }; }
    function save() { if (opt.save) opt.save(progress()); }
    (function restore(p) {
      if (!p || p.v !== 1) return;
      var arr = function (a, ok) { return Array.isArray(a) && a.length === N && a.every(ok); };
      var num = function (max) { return function (x) { return typeof x === 'number' && x >= 0 && x <= max && x === Math.floor(x); }; };
      if (arr(p.xpBy, num(XP.max))) s.xpBy = p.xpBy.slice();
      if (arr(p.flBy, num(FL.length))) s.flBy = p.flBy.slice();
      if (arr(p.closed, function (x) { return typeof x === 'boolean'; })) s.closed = p.closed.slice();
      var count = s.closed.filter(Boolean).length;
      if (num(count)(p.stuck)) s.stuck = p.stuck;
      if (num(count)(p.toStick) && p.toStick > s.stuck) s.toStick = p.toStick;
      s.back = !!p.back; s.list = !!p.list; s.ring = !!p.ring;
    })(opt.saved);

    /* ---- reading the data ---- */
    function level(d) { return D.cases[Math.max(1, Math.min(N, d)) - 1]; }
    function scoredIds(d) { return level(d).steps.filter(function (x) { return x.kind !== 'bet' && x.kind !== 'stamp'; }).map(function (x) { return x.id; }); }
    function copy(a, b) { var o = {}, k; for (k in a) o[k] = a[k]; for (k in b) o[k] = b[k]; return o; }
    function stepAt(plan, si, d) {
      var it = plan[si]; if (!it) return null;
      var lv = level(d), base = lv.steps.filter(function (x) { return x.id === it.id; })[0];
      if (!base) return null;
      var k = 'c.' + lv.key + '.' + base.id;
      var scored = base.kind !== 'bet' && base.kind !== 'stamp';
      if (!it.ret) return copy(base, { ret: false, scored: scored, maxTries: base.tries || 2, k: k, hint: scored });
      return copy(base.return, { id: base.id, ret: true, scored: true, boss: false, maxTries: 1, hint: false, lawWith: null, ring: false, tag: 'back', k: k + '.r' });
    }
    function cur() { return stepAt(s.plan, s.si, s.depth); }
    function targets(st) {
      if (!st) return [];
      if (st.kind === 'diff') return st.b.map(function (t, i) { return { id: 'g' + i, lit: t, right: i === st.answer, k: st.k + '.g.' + i, say: true, after: true }; });
      if (!st.parts) return [];
      return st.parts.map(function (t) { return copy(t, { right: st.kind === 'build' ? st.answer.indexOf(t.id) !== -1 : t.id === st.answer, k: st.k + '.p.' + t.id }); });
    }
    function byId(st, id) { return targets(st).filter(function (t) { return t.id === id; })[0] || null; }
    function rightOf(st) { return targets(st).filter(function (t) { return t.right; })[0] || null; }
    function shuffle(ids) { var a = ids.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(rnd() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
    function fresh(plan, si, d) {
      var st = stepAt(plan, si, d), n = st && st.kind === 'build' ? st.answer.length : 0, slots = [];
      for (var i = 0; i < n; i++) slots.push('');
      return { phase: 'ask', tries: 0, off: [], picked: '', hintN: 0, open: '', sel: '', slots: slots,
        order: st && st.mix ? shuffle(targets(st).map(function (t) { return t.id; })) : [], gain: 0, kuro: '', flameNow: false, queuedNow: false, wrongSlot: false, moved: 0, badSlot: -1 };
    }
    function set(p) { for (var k in p) s[k] = p[k]; }
    function flamesFor(n) { return FL.filter(function (at) { return n >= at; }).length; }
    function live() { return s.screen === 'case' && (s.phase === 'ask' || s.phase === 'miss'); }

    /* ---- counts ---- */
    function closedCount() { return s.closed.filter(Boolean).length; }
    function recDepth() { for (var i = 0; i < N; i++) if (!s.closed[i]) return i + 1; return 0; }
    function totalXp() { return s.xpBy.reduce(function (a, b) { return a + b; }, 0); }
    function totalFlames() { return s.flBy.reduce(function (a, b) { return a + b; }, 0); }
    /* a title turns on XP and on the depths closed in order: depth 3 alone turns nothing */
    function titleIndex() {
      var xp = totalXp(), ti = 0;
      for (var i = 1; i < D.titles.length; i++) { var ok = xp >= D.titles[i].xp; for (var j = 0; j < D.titles[i].closed; j++) if (!s.closed[j]) ok = false; if (ok) ti = i; else break; }
      return ti;
    }
    /* the eye flower from the start; the ring once depth 1 is closed */
    function tools() { return s.closed[0] ? ['eye', 'ring'] : ['eye']; }

    /* ---- moving between screens ---- */
    function start() { var first = !s.back; set({ screen: 'stall', sheet: '', crew: '', talk: first ? { who: 'yasser', k: 'v.yasser.greet.0' } : null, back: true }); if (first) save(); }
    function toDoor() { set({ screen: 'door', sheet: '', crew: '', talk: null }); }
    function toStall() { set({ screen: 'stall', sheet: '', crew: '', talk: null }); }
    function toChart() { set({ screen: 'chart', sheet: '', crew: '' }); }
    function toCard() { set({ screen: 'card', sheet: '', crew: '' }); }
    function look(id) { set({ sheet: id, crew: '', talk: null }); }
    function closeSheet() { set({ sheet: '' }); }
    function tapCrew(who) {
      var c = D.crew.filter(function (x) { return x.id === who; })[0]; if (!c) return;
      var line = c.line;
      if (who === 'ratman' && tools().length > 1) line = 'idle.2';
      set({ crew: who, sheet: '', talk: { who: who, k: 'v.' + who + '.' + line, v: { tools: tools().length } } });
    }
    function setList(on) { s.list = !!on; save(); }
    function openSlip(d) {
      var dep = d || recDepth();
      if (!dep) { toCard(); return; }
      var plan = scoredIds(dep).map(function (id) { return { id: id, ret: false }; });
      set({ screen: 'slip', sheet: '', crew: '', talk: null, depth: dep, bet: '', stamp: '', plan: plan, si: 0,
        hints: 0, first: 0, end: 0, xpRun: 0, queue: [], lost: [], eye: false, ki: 0, prev: s.xpBy[dep - 1] });
      set(fresh(plan, 0, dep));
    }
    function placeBet(o) { if (s.screen !== 'slip' || level(s.depth).steps[0].options.indexOf(o) === -1) return; set({ bet: o, screen: 'case' }); }
    function tapEye() { s.eye = true; }

    /* ---- answering ---- */
    function askHint() {
      var st = cur();
      if (!live() || !st || !st.hint) return;
      if (s.hintN < 2) { set({ hintN: s.hintN + 1, hints: s.hints + 1 }); return; }
      set({ hintN: 3, hints: s.hints + 1 });
      reveal(st, '');
    }
    function pick(id) {
      var st = cur();
      if (!live() || !st || !st.scored || st.kind === 'build' || s.off.indexOf(id) !== -1) return;
      var tg = byId(st, id); if (!tg) return;
      if (st.ring) { var was = s.ring; set({ open: id, ring: true }); if (!was) save(); return; }
      judge(st, tg);
    }
    function choose(id) {
      var st = cur();
      if (!live() || !st || !st.ring || s.open !== id || s.off.indexOf(id) !== -1) return;
      var tg = byId(st, id); if (tg) judge(st, tg);
    }
    function judge(st, tg) {
      if (tg.right) hit(st, tg.id);
      else if (st.maxTries === 1 || s.tries >= 1) reveal(st, tg.id);
      else miss(tg.id);
    }
    function hit(st, id) {
      var firstTry = !st.ret && s.tries === 0, gain = firstTry ? XP.first : XP.retry;
      var first = s.first + (firstTry ? 1 : 0), xpRun = s.xpRun + gain;
      var xpBy = s.xpBy.slice(); xpBy[s.depth - 1] = Math.max(xpBy[s.depth - 1], xpRun);
      set({ phase: 'hit', picked: id, gain: gain, moved: Math.max(0, xpRun - Math.max(s.prev, s.xpRun)), first: first, end: s.end + 1, xpRun: xpRun, xpBy: xpBy, open: '', sel: '',
        flameNow: flamesFor(first) > flamesFor(s.first), kuro: firstTry ? st.k + '.kuro' : 'v.kuro.hit.' + (s.ki % 5), ki: s.ki + (firstTry ? 0 : 1) });
      save();
    }
    function miss(id) { set({ phase: 'miss', tries: 1, picked: id, off: s.off.concat([id]), open: '', sel: '', wrongSlot: false, kuro: 'v.kuro.miss.' + (s.ki % 5), ki: s.ki + 1 }); }
    /* the answer is shown: a second miss, the one miss of a one-try item, or the third hint. A first meeting is queued to
       come back once (the two earliest); an objection never returns, and nothing is promised about later */
    function reveal(st, id, slot) {
      var oneTry = st.maxTries === 1 && !!id, queue = s.queue, lost = s.lost, queuedNow = false;
      if (!st.ret) {
        if (st.boss) lost = lost.concat([st.id]);
        else { queue = queue.concat([st.id]); queuedNow = queue.length <= 2; if (!queuedNow) lost = lost.concat([st.id]); }
      } else lost = lost.concat([st.id]);
      var p = { phase: 'reveal', picked: id, gain: 0, queue: queue, lost: lost, queuedNow: queuedNow, open: '', sel: '',
        kuro: oneTry ? 'v.kuro.miss.' + (s.ki % 2 === 0 ? 0 : 3) : '', ki: s.ki + (oneTry ? 1 : 0), badSlot: typeof slot === 'number' ? slot : -1 };
      if (st.kind === 'build') p.slots = st.answer.slice();
      set(p);
    }
    function tapChip(id) {
      var st = cur();
      if (!live() || !st || st.kind !== 'build' || s.off.indexOf(id) !== -1 || s.slots.indexOf(id) !== -1 || !byId(st, id)) return;
      s.sel = s.sel === id ? '' : id;
    }
    function tapSlot(i) {
      var st = cur();
      if (!live() || !st || st.kind !== 'build' || !(i >= 0 && i < s.slots.length)) return;
      var slots = s.slots.slice();
      if (!s.sel) { if (slots[i]) { slots[i] = ''; s.slots = slots; } return; }
      slots[i] = s.sel; set({ slots: slots, sel: '' });
      if (slots.every(function (x) { return x !== ''; })) judgeBuild(st, slots);
    }
    function judgeBuild(st, slots) {
      var bad = [], badAt = -1;
      slots.forEach(function (id, i) { if (id !== st.answer[i]) { bad.push(id); if (badAt < 0) badAt = i; } });
      if (!bad.length) { hit(st, slots[0]); return; }
      if (st.maxTries === 1 || s.tries >= 1) { reveal(st, bad[0], badAt); return; }
      var wrongChips = bad.filter(function (id) { return !byId(st, id).right; });
      set({ phase: 'miss', tries: 1, picked: wrongChips.length ? wrongChips[0] : bad[0], slots: slots.map(function (id, i) { return id === st.answer[i] ? id : ''; }), off: s.off.concat(wrongChips),
        open: '', sel: '', wrongSlot: !wrongChips.length, kuro: 'v.kuro.miss.' + (s.ki % 5), ki: s.ki + 1 });
    }
    function bubbleFor(st) { if (!st || st.ret) return null; return level(s.depth).bubbles.filter(function (b) { return b.after === st.id; })[0] || null; }
    function next() {
      var st = cur();
      if (s.screen !== 'case' || !st) return;
      if (st.kind === 'stamp') { if (s.phase === 'stamped') finish(); return; }
      if (s.phase === 'hit' || s.phase === 'reveal') { if (bubbleFor(st)) { s.phase = 'bubble'; return; } advance(); }
      else if (s.phase === 'bubble') advance();
    }
    /* after the last scored step the two earliest queued items return, once each, then the stamp */
    function advance() {
      var lv = level(s.depth), n = scoredIds(s.depth).length, plan = s.plan;
      if (s.si === n - 1 && plan.length === n) {
        var stamp = lv.steps.filter(function (x) { return x.kind === 'stamp'; })[0];
        plan = plan.concat(s.queue.slice(0, 2).map(function (id) { return { id: id, ret: true }; }), [{ id: stamp.id, ret: false }]);
      }
      set({ plan: plan, si: s.si + 1 }); set(fresh(plan, s.si, s.depth));
    }
    function pickStamp(o) {
      var st = cur();
      if (s.screen !== 'case' || !st || st.kind !== 'stamp' || s.phase !== 'ask' || st.options.indexOf(o) === -1) return;
      set({ stamp: o, phase: 'stamped' });
    }
    function finish() {
      var i = s.depth - 1, closed = s.closed.slice(), again = closed[i]; closed[i] = true;
      var flBy = s.flBy.slice(), fl = flamesFor(s.first); flBy[i] = Math.max(flBy[i], fl);
      var xpBy = s.xpBy.slice(); xpBy[i] = Math.max(xpBy[i], s.xpRun);
      var count = closed.filter(Boolean).length;
      set({ screen: 'end', closed: closed, flBy: flBy, xpBy: xpBy, toStick: count > s.stuck ? count : s.toStick,
        last: { depth: s.depth, first: s.first, end: s.end, flames: fl, hints: s.hints, xp: s.xpRun, lost: s.lost.length, prev: s.prev, again: again, tool: !again && level(s.depth).tool ? level(s.depth).tool : '' } });
      save();
    }
    function stick() { if (s.toStick > s.stuck) { set({ stuck: s.toStick, toStick: 0 }); save(); return true; } return false; }
    function nextDepth() { var d = (s.last ? s.last.depth : s.depth) + 1; if (d <= N) openSlip(d); }

    /* ---- what the answer box says, as keys: the view only words it ---- */
    function feedback() {
      var st = cur(); if (!st || st.kind === 'stamp' || ['miss', 'hit', 'reveal'].indexOf(s.phase) === -1) return null;
      var build = st.kind === 'build', picked = s.picked ? byId(st, s.picked) : null, right = build ? null : rightOf(st);
      var slotWhy = function (i) { var t = byId(st, st.answer[i >= 0 && i < st.answer.length ? i : st.answer.length - 1]); return t ? t.k + '.why' : ''; };
      var f = { phase: s.phase, head: '', headV: null, why: '', extra: '', extraWho: '', kuro: s.kuro, seal: s.phase === 'hit', xp: '', xpV: null, lead: '', answer: null };
      if (s.phase === 'miss') { f.head = 'ui.notThis'; f.why = s.wrongSlot ? 'ui.wrongSlot' : (picked ? picked.k + '.why' : ''); f.extra = 'ui.tryAgain'; }
      else if (s.phase === 'hit') {
        f.head = 'ui.right'; f.why = build ? slotWhy(-1) : (picked ? picked.k + '.why' : ''); f.extra = s.flameNow ? 'ui.flame' : '';
        if (s.moved === s.gain) { f.xp = 'ui.xpGain'; f.xpV = { n: s.gain }; } else { f.xp = 'ui.xpRun'; f.xpV = { n: s.xpRun }; }
      } else {
        var shown3 = !!st.hint && s.hintN >= 3;
        if (shown3) { f.head = st.k + '.hint.2'; f.lead = 'v.ratman.hint.2'; }
        else { f.head = 'ui.answer'; f.answer = build ? st.answer.map(function (id) { return byId(st, id); }) : [right]; }
        f.why = build ? slotWhy(s.badSlot) : (st.kind === 'diff' ? st.k + '.why' : (right ? right.k + '.why' : ''));
        f.xp = 'ui.xp0';
        if (st.ret) f.extra = 'ui.noReturn';
        else if (st.boss) f.extra = 'ui.bossNoReturn';
        else if (s.queuedNow) { f.extra = 'v.pigeon.queued.0'; f.extraWho = 'pigeon'; }
        else f.extra = 'ui.thirdQueued';
      }
      return f;
    }
    function lawShown() {
      var st = cur(); if (!st) return false;
      return !!(st.law || (st.lawWith && s.picked && st.lawWith.indexOf(s.picked) !== -1 && (s.phase === 'miss' || s.phase === 'reveal')));
    }
    function captionsOn(st) { return !!st && !st.boss && (s.depth === 1 || (s.depth === 2 && s.eye)); }
    function position() {
      var st = cur(); if (!st) return null;
      var n = scoredIds(s.depth).length;
      if (st.kind === 'stamp') return { k: 'ui.posStamp' };
      if (st.ret) return { k: 'ui.posRet', v: { i: s.si - n + 1, n: s.plan.filter(function (p) { return p.ret; }).length } };
      return { k: 'ui.pos', v: { i: s.si + 1, n: n } };
    }

    return { state: s, data: D, progress: progress, level: level, scoredIds: scoredIds, cur: cur, targets: targets, byId: byId, rightOf: rightOf, flamesFor: flamesFor, live: live,
      closedCount: closedCount, recDepth: recDepth, totalXp: totalXp, totalFlames: totalFlames, titleIndex: titleIndex, tools: tools,
      start: start, toDoor: toDoor, toStall: toStall, toChart: toChart, toCard: toCard, look: look, closeSheet: closeSheet, tapCrew: tapCrew, setList: setList,
      openSlip: openSlip, placeBet: placeBet, tapEye: tapEye, askHint: askHint, pick: pick, choose: choose, tapChip: tapChip, tapSlot: tapSlot, next: next, pickStamp: pickStamp,
      stick: stick, nextDepth: nextDepth, bubbleFor: bubbleFor, feedback: feedback, lawShown: lawShown, captionsOn: captionsOn, position: position };
  }

  G.NightCases = { core: { create: create } };
  if (typeof document === 'undefined') return;

  /* ======================= the view ======================= */
  var d = document, root = d.documentElement;
  var $ = function (q, r) { return (r || d).querySelector(q); };
  var app = $('[data-enq]'), liveBox = $('#enq-live');
  var DATA = null, FR = {};
  /* the sheet puts the plain text away as soon as scripts run: if the engine cannot start, the page is marked and the text stays */
  try { DATA = JSON.parse($('#enq-data').textContent); } catch (e) {}
  if (!app || !DATA) { root.setAttribute('data-enq-off', ''); return; }
  try { FR = JSON.parse($('#hub-fr').textContent); } catch (e) {}
  var lang = 'fr', P = 'lant.enq.';
  var raw = function (k) { var L = G.HUB_I18N && G.HUB_I18N[lang]; return L && L[k] != null ? L[k] : (FR[k] != null ? FR[k] : ''); };
  var fill = function (str, v) { return v ? String(str).replace(/\{(\w+)\}/g, function (m, k) { return v[k] != null ? v[k] : m; }) : str; };
  var T = function (k, v) { return fill(raw(P + k), v); };
  var name = function (who) { return who === 'stall' ? T('ui.stallName') : raw('lant.cast.' + who); };
  var reduce = G.matchMedia ? G.matchMedia('(prefers-reduced-motion: reduce)') : { matches: true };
  var motionOn = function () { return !reduce.matches && !root.classList.contains('motion-off'); };
  var KEY = DATA.store, saved = null;
  try { saved = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) {}
  var game = create(DATA, { saved: saved, save: function (p) { try { localStorage.setItem(KEY, JSON.stringify(p)); } catch (e) {} } });
  var S = game.state;

  /* ---- sound: eight tones, and no audio context before the radio plays ---- */
  var radioOn = false, ac = null;
  var HZ = { yasser: 196, pigeon: 660, ratman: 494, raven: 262 };
  function tone(list, dur, type) {
    if (!radioOn) return;
    try {
      var AC = G.AudioContext || G.webkitAudioContext; if (!AC) return;
      if (!ac) ac = new AC();
      var at = ac.currentTime;
      list.forEach(function (f) {
        var o = ac.createOscillator(), g = ac.createGain();
        o.type = type; o.frequency.value = f;
        g.gain.setValueAtTime(0.05, at); g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
        o.connect(g); g.connect(ac.destination); o.start(at); o.stop(at + dur); at += dur * 0.8;
      });
    } catch (e) {}
  }
  function sfx(kind) {
    if (kind === 'tap') tone([440], 0.05, 'square');
    else if (kind === 'hit') tone([523, 659, 784], 0.08, 'square');
    else if (kind === 'miss') tone([196, 147], 0.12, 'sawtooth');
    else if (kind === 'end') tone([523, 659, 784, 1047], 0.11, 'square');
    else if (HZ[kind]) tone([HZ[kind], HZ[kind] * 1.26], 0.05, 'triangle');
  }

  /* ---- small builders ---- */
  /* in Arabic a chain of numbers with hyphens (« 25-10 », « 2026-11-22 ») is read right to left and shows as « 10-25 »,
     and an address piece (« /download ») loses its slash to the other side: each one is set in its own <bdi> (same text) */
  var PAIR = /\d+(?:-\d+)+|\/?[A-Za-z][A-Za-z0-9-]*(?:[.\/][A-Za-z0-9-]+)+|\/[A-Za-z][A-Za-z0-9-]*/g;
  function setText(n, text) {
    text = String(text);
    if (root.getAttribute('dir') !== 'rtl' || text.search(PAIR) === -1) { n.textContent = text; return; }
    var at = 0; text.replace(PAIR, function (m, i) { if (i > at) n.appendChild(d.createTextNode(text.slice(at, i))); var b = d.createElement('bdi'); b.textContent = m; n.appendChild(b); at = i + m.length; return m; });
    if (at < text.length) n.appendChild(d.createTextNode(text.slice(at)));
  }
  function el(tag, cls, text) { var n = d.createElement(tag); if (cls) n.className = cls; if (text != null && text !== '') setText(n, text); return n; }
  function add(p) { for (var i = 1; i < arguments.length; i++) if (arguments[i]) p.appendChild(arguments[i]); return p; }
  function btn(cls, label, fn, f) { var b = el('button', cls, label); b.type = 'button'; if (fn) b.addEventListener('click', fn); if (f) b.setAttribute('data-f', f); return b; }
  function ltr(text, cls) { var b = el('bdi', cls, text); b.setAttribute('dir', 'ltr'); return b; }
  function img(src, alt, cls) { var i = el('img', cls); i.src = '../' + src; i.alt = alt || ''; i.decoding = 'async'; return i; }
  var NS = 'http://www.w3.org/2000/svg';
  var GLYPH = { sound: 'M4 9h4l5-4v14l-5-4H4zM16.5 9a4.5 4.5 0 0 1 0 6', mute: 'M4 9h4l5-4v14l-5-4H4zM16.5 9.5l5 5M21.5 9.5l-5 5', wallet: 'M3 7h16v12H3zM3 7l11-3v3M15 13h4', star: 'M12 3l2.7 5.6 6.1.8-4.5 4.3 1.1 6.1L12 17l-5.4 2.8 1.1-6.1L3.2 9.4l6.1-.8z',
    bars: 'M4 7h16M4 12h16M4 17h16', reload: 'M20 12a8 8 0 1 1-2.6-5.9M20 4v5h-5', cross: 'M6 6l12 12M18 6L6 18', tabs: 'M4 4h16v16H4z', flame: 'M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-3 2-4 2-6 1 1 2 1 3-4z' };
  function svg(path, cls) {
    var s = d.createElementNS(NS, 'svg'), p = d.createElementNS(NS, 'path');
    s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('aria-hidden', 'true'); s.setAttribute('focusable', 'false'); s.setAttribute('class', cls || 'enq-ico');
    p.setAttribute('d', path); s.appendChild(p); return s;
  }
  function law(cls) { var p = el('p', 'enq-law' + (cls ? ' ' + cls : ''), raw(DATA.law)); return p; }
  function say(text) { if (!liveBox) return; liveBox.textContent = ''; setTimeout(function () { liveBox.textContent = text; }, 60); }
  function face(who, cls) {
    var f = el('span', 'enq-face enq-face--' + who + (cls ? ' ' + cls : '')); f.setAttribute('aria-hidden', 'true');
    if (DATA.art.faces[who]) f.appendChild(img(DATA.art.faces[who], ''));
    return f;
  }
  function once(n, cls) { if (n && motionOn()) n.classList.add(cls); }

  /* ---- the painting: one picture, the crop on a phone, the whole of it beside the game on a wide screen ---- */
  var art = el('div', 'enq-art'), pic = img(DATA.painting.src, '', 'enq-art__img'), ringBox = el('div', 'enq-art__rings'), glow = el('span', 'enq-art__glow');
  pic.srcset = '../' + DATA.painting.small + ' 800w, ../' + DATA.painting.src + ' 1600w'; pic.sizes = '(min-width:900px) 60vw, 100vw';
  pic.width = DATA.painting.size[0]; pic.height = DATA.painting.size[1];
  glow.setAttribute('aria-hidden', 'true');
  add(art, pic, glow, ringBox);
  var screen = el('div', 'enq-screen');
  add(app, art, screen);
  var cw = DATA.painting.crop[1] - DATA.painting.crop[0], full = DATA.painting.size[0];
  function place(n, at) {
    n.style.setProperty('--x', (at[0] * 100).toFixed(2) + '%'); n.style.setProperty('--y', (at[1] * 100).toFixed(2) + '%');
    n.style.setProperty('--xw', (((DATA.painting.crop[0] + at[0] * cw) / full) * 100).toFixed(2) + '%');
  }
  place(glow, DATA.rings.filter(function (r) { return r.id === 'lantern'; })[0].at);

  /* ---- the bar every screen but the door has ---- */
  /* the radio's switch, which is also the switch of the game's eight tones: worded on the door, an icon in the bar, and
     in a case (whose bar is full: position, flames, XP) an icon at the end of the action row */
  function soundBtn(cls, icon) {
    var play = $('[data-radio-play]');
    var b = btn(cls, icon ? '' : T(radioOn ? 'ui.sound.on' : 'ui.sound.off'), function () { if (play && !play.disabled) play.click(); }, 'sound');
    if (icon) b.appendChild(svg(GLYPH[radioOn ? 'sound' : 'mute']));
    b.setAttribute('aria-pressed', String(radioOn)); b.setAttribute('aria-label', T('ui.sound.aria'));
    if (!play) b.disabled = true;
    return b;
  }
  /* a case with an answer in it is not dropped by one tap on the arrow: the arrow asks once */
  var leaving = false;
  function answered() { return S.screen === 'case' && (S.si > 0 || S.phase !== 'ask' || S.hintN > 0); }
  function bar(back, mid, full) {
    var b = el('div', 'enq-bar');
    var bk = btn('enq-bar__back', '', back === 'door' ? function () { act(game.toDoor, 'go'); } : function () {
      if (answered() && !leaving) { leaving = true; sfx('tap'); render('top'); return; }
      leaving = false; act(game.toStall, 'goal');
    }, 'back');
    bk.setAttribute('aria-label', T(back === 'door' ? 'ui.toDoor' : 'ui.toStall'));
    add(b, bk);
    (mid || []).forEach(function (n) { add(b, n); });
    add(b, el('span', 'enq-bar__xp', T('ui.xp', { n: game.totalXp() })), full ? null : soundBtn('enq-bar__snd', true));
    var l = btn('enq-bar__list', T('ui.list.short'), function () { game.setList(!S.list); render('list'); }, 'list');
    l.setAttribute('aria-pressed', String(S.list)); l.setAttribute('aria-label', T(S.list ? 'ui.list.on' : 'ui.list.off'));
    return add(b, l);
  }
  function flames(n) {
    var f = el('span', 'enq-flames'); f.setAttribute('role', 'img'); f.setAttribute('aria-label', T('ui.flames', { n: n }));
    for (var i = 0; i < DATA.flamesAt.length; i++) f.appendChild(svg(GLYPH.flame, 'enq-flame' + (i < n ? ' is-lit' : '')));
    return f;
  }
  function heading(tag, cls, text) { var h = el(tag, cls, text); h.tabIndex = -1; h.setAttribute('data-f', 'top'); return h; }

  /* ---- A. the door ---- */
  function door() {
    var w = el('section', 'enq-door');
    add(w, el('p', 'enq-door__label', T('ui.door.label')), heading('h1', 'enq-door__h', T('ui.door.title')), el('p', 'enq-door__season', T('ui.door.season')), el('p', 'enq-door__line', T('ui.door.line')));
    add(w, btn('enq-go', T(S.back ? 'ui.door.open' : 'ui.door.start'), function () { game.start(); sfx('tap'); if (S.talk) sfx('yasser'); render('goal'); }, 'go'));
    add(w, law());
    var o = el('div', 'enq-door__opts');
    var snd = soundBtn('enq-opt', false);
    var lst = btn('enq-opt', T(S.list ? 'ui.list.on' : 'ui.list.off'), function () { game.setList(!S.list); render('list'); }, 'list');
    lst.setAttribute('aria-pressed', String(S.list));
    add(w, add(o, snd, lst));
    return w;
  }

  /* ---- B, C. the stall, its rings and its look sheet ---- */
  var RING_GO = { slip: function () { game.openSlip(0); }, card: game.toCard, chart: game.toChart };
  function rings() {
    ringBox.textContent = '';
    if (S.screen !== 'stall') return;
    DATA.rings.forEach(function (r) {
      var b = btn('enq-ring' + (r.id === 'lantern' && game.recDepth() ? ' enq-ring--slip' : '') + (S.sheet === r.id ? ' is-on' : ''), '', function () { game.look(r.id); sfx('tap'); render('sheet'); }, 'ring-' + r.id);
      b.setAttribute('aria-label', T('ring.' + r.id + '.label')); place(b, r.at);
      ringBox.appendChild(b);
    });
  }
  function stall() {
    var w = el('section', 'enq-stall'), rec = game.recDepth();
    add(w, bar('door', [el('span', 'enq-bar__rank', T('rank.' + game.titleIndex()))]));
    var h = heading('h2', 'sr', T('ui.stallName'));
    add(w, h, btn('enq-goal', T(rec ? 'ui.goal' : 'ui.goalNone'), function () { game.openSlip(0); sfx('tap'); render('top'); }, 'goal'));
    var box = el('div', 'enq-talk');
    var ring = DATA.rings.filter(function (r) { return r.id === S.sheet; })[0];
    if (ring) {
      box.className = 'enq-talk enq-talk--sheet';
      var hh = el('h3', 'enq-talk__name', T('ring.' + ring.id + '.name')); hh.tabIndex = -1; hh.setAttribute('data-f', 'sheet');
      var go = btn('enq-btn enq-btn--fill', T(ring.opens === 'slip' && !rec ? 'ui.btn.replay' : 'ring.' + ring.id + '.btn'), function () { RING_GO[ring.opens](); sfx('tap'); render('top'); }, 'sheet-go');
      add(box, hh, el('p', 'enq-talk__t', T('ring.' + ring.id + '.line')), add(el('div', 'enq-row'), go, btn('enq-btn', T('ui.close'), function () { game.closeSheet(); render('ring-' + ring.id); })));
    } else {
      var who = S.talk ? S.talk.who : 'stall';
      var tx = el('div', 'enq-talk__body');
      add(tx, el('p', 'enq-talk__name', name(who)), el('p', 'enq-talk__t', S.talk ? T(S.talk.k, S.talk.v) : T('ui.stallIdle')));
      once(tx, 'enq-in');
      add(box, who === 'stall' ? null : face(who, 'enq-face--lg'), tx);
      var c = DATA.crew.filter(function (x) { return x.id === S.crew; })[0];
      if (c) {
        var fact = c.fact === 'closed' ? T('ui.fact.closed', { n: game.closedCount() }) : c.fact === 'flames' ? T('ui.fact.flames', { n: game.totalFlames() })
          : c.fact === 'slip' ? (rec ? T('ui.fact.slip', { n: rec }) : T('ui.fact.noSlip')) : T('ui.fact.tools', { n: game.tools().length });
        var label = c.btn === 'slip' ? (rec ? 'ui.btn.slip' : 'ui.btn.card') : 'ui.btn.' + c.btn;
        add(tx, el('p', 'enq-talk__fact', fact), btn('enq-btn enq-btn--fill', T(label), function () { (c.btn === 'slip' ? RING_GO.slip : RING_GO[c.btn])(); sfx('tap'); render('top'); }, 'crew-go'));
      }
    }
    var strip = el('div', 'enq-crew'); strip.setAttribute('role', 'group'); strip.setAttribute('aria-label', T('ui.crew.h'));
    DATA.crew.forEach(function (c) {
      var b = btn('enq-crew__b' + (S.crew === c.id ? ' is-on' : ''), '', function () { game.tapCrew(c.id); sfx(c.id); render('crew-' + c.id); say(name(c.id) + '. ' + T(S.talk.k, S.talk.v)); }, 'crew-' + c.id);
      b.setAttribute('aria-label', T('ui.crew.aria', { name: name(c.id) })); b.setAttribute('aria-pressed', String(S.crew === c.id));
      add(b, face(c.id), el('span', 'enq-crew__n', name(c.id)));
      strip.appendChild(b);
    });
    /* the strip sits above the talk box: the box changes height with each line, the four faces do not move */
    add(w, strip, box);
    /* the list view has no painting: its three rings are three buttons here */
    var nav = el('div', 'enq-rings-list');
    DATA.rings.forEach(function (r) { nav.appendChild(btn('enq-btn', T(r.opens === 'slip' && !rec ? 'ui.btn.replay' : 'ring.' + r.id + '.btn'), function () { RING_GO[r.opens](); sfx('tap'); render('top'); })); });
    return add(w, nav);
  }

  /* ---- D. the slip and the open bet ---- */
  function slip() {
    var w = el('section', 'enq-slip'), lv = game.level(S.depth), c = 'c.' + lv.key, bet = lv.steps[0];
    add(w, bar('stall', [el('span', 'enq-bar__pos', T('ui.depth', { n: lv.level }))]));
    var card = el('div', 'enq-slipcard');
    add(card, el('p', 'enq-slipcard__tag', T(c + '.slipTag')), heading('h2', 'enq-slipcard__t', T(c + '.slip')));
    add(w, card);
    var pv = el('div', 'enq-pv'); pv.setAttribute('role', 'img'); pv.setAttribute('aria-label', T('ui.pvAria'));
    game.targets(copyStep(lv, 1)).forEach(function () { pv.appendChild(el('span', 'enq-pv__b')); });
    add(w, pv, el('p', 'enq-ask', T(c + '.' + bet.id + '.prompt')));
    var row = el('div', 'enq-verdicts');
    bet.options.forEach(function (o) { row.appendChild(btn('enq-verdict', T('ui.opt.' + o), function () { game.placeBet(o); sfx('tap'); render('top'); }, 'opt-' + o)); });
    return add(w, row);
  }
  function copyStep(lv, i) { var st = lv.steps[i]; return { kind: st.kind, parts: st.parts, b: st.b, answer: st.answer, k: '' }; }

  /* ---- E, F. a step and its feedback ---- */
  var TPL = { 'browser-bar': 'row', 'browser-bar-phone': 'row', 'four-tiles': 'grid', duo: 'grid' };
  function mode(st, t) {
    var hitDone = S.phase === 'hit' || (S.phase === 'bubble' && S.gain > 0);
    if (hitDone) return st.kind === 'build' ? 'dim' : (t.id === S.picked ? 'hit' : 'dim');
    if (S.phase === 'reveal' || S.phase === 'bubble') return t.right ? 'answer' : (t.id === S.picked ? 'wrong' : 'dim');
    if (S.off.indexOf(t.id) !== -1) return 'wrong';
    if (st.ring && S.open === t.id) return 'open';
    return 'base';
  }
  function partLabel(t) { return t.lit || (t.text ? T(t.k + '.text') : (t.caption ? T(t.k + '.cap') : '')); }
  function evidence(st) {
    var ev = el('div', 'enq-ev enq-ev--' + st.kind), tks = game.targets(st), isLive = game.live();
    var ordered = S.order.length === tks.length ? S.order.map(function (id) { return tks.filter(function (t) { return t.id === id; })[0]; }) : tks;
    if (st.kind === 'diff') {
      var a = el('p', 'enq-addr'); a.setAttribute('dir', 'ltr'); a.setAttribute('aria-label', T('ui.addrA') + ': ' + st.a.join(''));
      st.a.forEach(function (x) { a.appendChild(el('span', 'enq-addr__p', x)); });
      var b = el('div', 'enq-addr enq-addr--b'); b.setAttribute('dir', 'ltr'); b.setAttribute('role', 'group'); b.setAttribute('aria-label', T('ui.addrB'));
      var notes = el('div', 'enq-after');
      tks.forEach(function (t) {
        var m = mode(st, t), p = btn('enq-part enq-part--piece', '', function () { tap(function () { game.pick(t.id); }); }, 'p-' + t.id);
        p.appendChild(ltr(t.lit));
        p.setAttribute('data-mode', m); p.setAttribute('aria-label', T(t.k + '.say')); p.disabled = !isLive || m === 'wrong';
        b.appendChild(p);
        if (m === 'hit' || m === 'wrong' || m === 'answer') { var n = el('p', 'enq-after__l', T(t.k + '.after')); n.setAttribute('data-mode', m); notes.appendChild(n); }
      });
      return add(ev, el('p', 'enq-ev__k', T('ui.addrA')), a, el('p', 'enq-ev__k', T('ui.addrB')), b, notes);
    }
    if (st.kind === 'build') {
      var sent = el('p', 'enq-frame');
      /* a slot keeps what is written against it: the mark that follows (« {2}. ») and a letter joined before (« و{3} ») */
      var pcs = T(st.k + '.frame').split(/(\{\d\})/), glue = {};
      pcs.forEach(function (x, pi) {
        if (!/^\{\d\}$/.test(x)) return;
        var a = /\S+$/.exec(pcs[pi - 1] || ''), z = /^\S+/.exec(pcs[pi + 1] || '');
        glue[pi] = [a ? a[0] : '', z ? z[0] : ''];
        if (a) pcs[pi - 1] = pcs[pi - 1].slice(0, a.index);
        if (z) pcs[pi + 1] = pcs[pi + 1].slice(z[0].length);
      });
      pcs.forEach(function (piece, pi) {
        var mm = /^\{(\d)\}$/.exec(piece);
        if (!mm) { if (piece) sent.appendChild(d.createTextNode(piece)); return; }
        var i = +mm[1] - 1, cid = S.slots[i] || '', chip = cid ? game.byId(st, cid) : null;
        var md = S.phase === 'hit' || (S.phase === 'bubble' && S.gain > 0) ? 'hit' : (S.phase === 'reveal' || S.phase === 'bubble' ? 'answer' : (cid ? 'open' : 'empty'));
        var sb = btn('enq-slot', chip ? T(chip.k + '.text') : T('ui.slot', { n: i + 1 }), function () { tap(function () { game.tapSlot(i); }, 'slot-' + i); }, 'slot-' + i);
        sb.setAttribute('data-mode', md); sb.disabled = !isLive;
        sb.setAttribute('aria-label', chip ? T('ui.slotFull', { n: i + 1, t: T(chip.k + '.text') }) : T('ui.slotEmpty', { n: i + 1 }));
        sent.appendChild(add(el('span', 'enq-slotw'), glue[pi][0] ? el('span', 'enq-slotw__x', glue[pi][0]) : null, sb, glue[pi][1] ? el('span', 'enq-slotw__x', glue[pi][1]) : null));
      });
      add(ev, sent);
      if (isLive) {
        var chips = el('div', 'enq-chips');
        ordered.forEach(function (t) {
          var placed = S.slots.indexOf(t.id) !== -1, gone = S.off.indexOf(t.id) !== -1, tx = T(t.k + '.text');
          var cb = btn('enq-chip', tx, function () { tap(function () { game.tapChip(t.id); }, 'chip-' + t.id); }, 'chip-' + t.id);
          cb.setAttribute('data-mode', gone ? 'wrong' : (placed ? 'dim' : (S.sel === t.id ? 'sel' : 'base')));
          cb.setAttribute('aria-pressed', String(S.sel === t.id)); cb.disabled = gone || placed;
          if (placed || gone) cb.setAttribute('aria-label', T(placed ? 'ui.placed' : 'ui.gone', { t: tx }));
          chips.appendChild(cb);
        });
        add(ev, chips);
      }
      return ev;
    }
    /* a mock screen: every part a button, in its written order (notes are shuffled) */
    var tpl = st.template || st.kind, layout = TPL[tpl] || 'list', caps = game.captionsOn(st);
    var title = st.addr || (st.address ? T(st.k + '.address') : raw(P + 'tpl.' + tpl));
    var frame = el('div', 'enq-mock enq-mock--' + layout + ' enq-mock--' + tpl);
    if (title) add(frame, st.addr ? add(el('p', 'enq-mock__title'), ltr(title)) : el('p', 'enq-mock__title', title));
    var body = el('div', 'enq-mock__body'), after = el('div', 'enq-after');
    if (tpl === 'browser-bar') { var pill = el('span', 'enq-mock__pill'); pill.setAttribute('aria-hidden', 'true'); body.appendChild(pill); }
    ordered.forEach(function (t) {
      var m = mode(st, t), shown = m === 'hit' || m === 'wrong' || m === 'answer';
      var p = btn('enq-part', '', function () { tap(function () { game.pick(t.id); }, st.ring ? 'choose' : null); }, 'p-' + t.id);
      p.setAttribute('data-mode', m); p.disabled = !isLive || m === 'wrong';
      if (t.say) p.setAttribute('aria-label', T(t.k + '.say'));
      else if (!t.text && !t.lit && t.caption) p.setAttribute('aria-label', T(t.k + '.cap'));
      if (t.glyph && !t.text) p.appendChild(svg(GLYPH[t.glyph], 'enq-ico enq-part__g'));
      if (t.lit) p.appendChild(ltr(t.lit, 'enq-part__t')); else if (t.text) p.appendChild(el('span', 'enq-part__t', T(t.k + '.text')));
      if (t.mark) p.appendChild(el('span', 'enq-part__mark', T(t.k + '.mark')));
      if (caps && t.caption) p.appendChild(el('span', 'enq-part__cap', T(t.k + '.cap')));
      var wrap = add(el('div', 'enq-partw' + (t.glyph && !t.text ? ' enq-partw--g' : '')), p);
      if (shown && t.after) { var n = el('p', 'enq-after__l', T(t.k + '.after')); n.setAttribute('data-mode', m); (layout === 'row' ? after : wrap).appendChild(n); }
      if (st.ring ? (isLive && S.open === t.id && m !== 'wrong') : false) {
        var ad = add(el('p', 'enq-opens'), el('span', 'enq-opens__k', T('ui.addr')), ltr(t.opens, 'enq-opens__a'));
        add(wrap, ad, btn('enq-btn enq-btn--fill enq-choose', T('ui.choose'), function () { tap(function () { game.choose(t.id); }); }, 'choose'));
      } else if (shown && t.opens) add(wrap, add(el('p', 'enq-opens'), el('span', 'enq-opens__k', T('ui.addr')), ltr(t.opens, 'enq-opens__a')));
      body.appendChild(wrap);
    });
    if (tpl === 'browser-bar-phone') { var pl = el('span', 'enq-mock__pill'); pl.setAttribute('aria-hidden', 'true'); body.appendChild(pl); }
    return add(ev, add(frame, body), after);
  }
  function fbText(f, st) {
    var out = { head: '', why: f.why ? T(f.why) : '', extra: '' };
    if (f.answer) {
      /* an answer that is a whole sentence brings its own full stop: the line's is dropped */
      var ans = f.answer.map(function (t) { return t ? partLabel(t) : ''; }).join(' · ');
      out.head = T('ui.answer', { a: ans }); if (/[.!?…]$/.test(ans)) out.head = out.head.replace(/\.$/, '');
    }
    else out.head = T(f.head);
    if (f.extra) out.extra = f.extraWho ? T('ui.says', { who: name(f.extraWho), t: T(f.extra) }) : T(f.extra);
    return out;
  }
  function caseScreen() {
    var w = el('section', 'enq-case'), st = game.cur(), lv = game.level(S.depth), pos = game.position();
    var stampK = st.kind === 'stamp';
    add(w, bar('stall', [el('span', 'enq-bar__pos', T(pos.k, pos.v)), flames(game.flamesFor(S.first))], true));
    add(w, add(el('p', 'enq-meta'), el('span', 'enq-tag', T('ui.tag.' + st.tag)), el('span', 'enq-betchip', T('ui.betChip', { bet: S.bet ? T('ui.opt.' + S.bet) : T('ui.betOpen') }))));
    if (leaving) {
      var lb = el('div', 'enq-box enq-box--leave');
      add(lb, heading('h2', 'enq-prompt', T('ui.leave.h')), el('p', 'enq-fb__why', T('ui.leave.t')));
      add(lb, add(el('div', 'enq-row'), btn('enq-btn enq-btn--fill', T('ui.leave.stay'), function () { leaving = false; sfx('tap'); render('top'); }, 'stay'), btn('enq-btn', T('ui.leave.go'), function () { leaving = false; act(game.toStall, 'goal'); }, 'leave')));
      return add(w, lb);
    }
    if (stampK) {
      var box0 = el('div', 'enq-ev enq-ev--stamp');
      add(box0, heading('h2', 'enq-prompt', T(st.k + '.prompt')));
      var row = el('div', 'enq-verdicts');
      st.options.forEach(function (o) {
        var b = btn('enq-verdict' + (S.stamp === o ? ' is-stamped' : ''), T('ui.opt.' + o), function () { game.pickStamp(o); sfx('end'); render('next'); var s2 = game.cur(); say(T('ui.result', resultV(s2)) + ' ' + T(s2.k + '.reveal')); }, 'opt-' + o);
        b.disabled = S.phase === 'stamped'; b.setAttribute('aria-pressed', String(S.stamp === o));
        row.appendChild(b);
      });
      add(box0, row);
      if (S.phase === 'stamped') {
        var res = el('div', 'enq-result'); once(res, 'enq-in');
        add(box0, add(res, el('p', 'enq-result__l', T('ui.result', resultV(st))), el('p', 'enq-result__r', T(st.k + '.reveal')), el('p', 'enq-result__u', T('ui.under'))));
      }
      add(w, box0);
      if (st.law) add(w, law('enq-law--band'));
      return add(w, add(el('div', 'enq-actions'), S.phase === 'stamped' ? btn('enq-btn enq-btn--fill enq-next', T('ui.closeCase'), function () { game.next(); sfx('end'); render('top'); }, 'next') : null, soundBtn('enq-btn enq-snd', true)));
    }
    /* in the page's order: the question, the evidence (the answers), what the last tap brought, the hint, the law line,
       the actions. The reason of a miss sits against the evidence, so it is on screen with the part just tapped. */
    add(w, add(el('div', 'enq-q'), heading('h2', 'enq-prompt', T(st.k + '.prompt'))));
    add(w, evidence(st));
    var f = game.feedback(), bub = S.phase === 'bubble' ? game.bubbleFor(st) : null;
    var box = null;
    if (bub) {
      box = el('div', 'enq-box enq-box--bubble'); once(box, 'enq-in');
      var bt = el('div', 'enq-talk__body'); bt.tabIndex = -1; bt.setAttribute('data-f', 'fb');
      add(box, face(bub.who, 'enq-face--lg'), add(bt, el('p', 'enq-talk__name', name(bub.who)), el('p', 'enq-talk__t', T('c.' + lv.key + '.bub.' + bub.id))));
    } else if (f) {
      box = el('div', 'enq-box enq-fb enq-box--' + f.phase);
      addFeedback(box, f, st);
    }
    add(w, box);
    if (game.live() && st.hint && S.hintN > 0 && S.hintN < 3) add(w, add(el('p', 'enq-hint'), el('b', 'enq-hint__who', T('ui.says', { who: name('ratman'), t: T('v.ratman.hint.' + (S.hintN - 1)) })), d.createTextNode(' ' + T(st.k + '.hint.' + (S.hintN - 1)))));
    if (game.lawShown()) add(w, law('enq-law--band'));
    var actions = el('div', 'enq-actions');
    if (game.live()) {
      if (st.hint) add(actions, btn('enq-btn', T(S.hintN >= 2 ? 'ui.hint3' : 'ui.hint'), function () { var was = S.phase; game.askHint(); sfx('ratman'); render(S.phase === 'reveal' ? 'next' : 'hint'); if (S.phase === 'reveal' && was !== 'reveal') announce(); else say(T('v.ratman.hint.' + (S.hintN - 1)) + ' ' + T(game.cur().k + '.hint.' + (S.hintN - 1))); }, 'hint'));
      if (S.depth === 2 && !st.boss && !S.eye && game.targets(st).some(function (t) { return !!t.caption; })) {
        var eye = btn('enq-btn enq-btn--eye', T('ui.eye'), function () { game.tapEye(); sfx('tap'); render('top'); }, 'eye');
        add(actions, add(eye, img(DATA.art.tools.eye, '', 'enq-btn__i')));
      }
    } else add(actions, btn('enq-btn enq-btn--fill enq-next', T('ui.continue'), function () { game.next(); sfx('tap'); var b2 = S.phase === 'bubble' ? game.bubbleFor(game.cur()) : null; if (b2) sfx(b2.who); render(b2 ? 'next' : 'top'); if (b2) say(name(b2.who) + '. ' + T('c.' + game.level(S.depth).key + '.bub.' + b2.id)); }, 'next'));
    return add(w, add(actions, soundBtn('enq-btn enq-snd', true)));
  }
  function resultV(st) { return { bet: T('ui.opt.' + S.bet), stamp: T('ui.opt.' + S.stamp), checked: T('ui.opt.' + st.checked) }; }
  function addFeedback(box, f, st) {
    var tx = fbText(f, st);
    if (f.lead) add(box, el('p', 'enq-fb__lead', T('ui.says', { who: name('ratman'), t: T(f.lead) })));
    var head = el('p', 'enq-fb__head', tx.head); head.tabIndex = -1; head.setAttribute('data-f', 'fb');
    if (f.seal) { var sl = img(DATA.art.seal, T('ui.sealed'), 'enq-seal'); once(sl, 'enq-pop'); add(box, sl); }
    add(box, head, el('p', 'enq-fb__why', tx.why));
    var line = el('p', 'enq-fb__line');
    /* a pool line that already names him (« Kūro valide. ») is not given his name twice */
    var kw = f.kuro ? T(f.kuro) : '', kn = kw.indexOf(name('kuro')) === 0;
    if (f.kuro) add(line, add(el('span', 'enq-kuro'), el('b', '', name('kuro')), d.createTextNode(kn ? kw.slice(name('kuro').length) : ' ' + kw)));
    if (f.xp) add(line, el('span', 'enq-xp', T(f.xp, f.xpV)));
    if (line.firstChild) add(box, line);
    if (tx.extra) add(box, el('p', 'enq-fb__extra', tx.extra));
  }
  function announce() {
    var st = game.cur(), f = game.feedback(); if (!f) return;
    var tx = fbText(f, st);
    var kw = f.kuro ? T(f.kuro) : '', kn = kw.indexOf(name('kuro')) === 0;
    say([tx.head, tx.why, f.kuro ? (kn ? kw : name('kuro') + ': ' + kw) : '', f.xp ? T(f.xp, f.xpV) : '', tx.extra].filter(Boolean).join(' '));
  }
  /* one answer: the rules decide, the sound and the words follow the phase they left */
  function tap(fn, focus) {
    var was = S.phase, wasSi = S.si;
    fn();
    if (S.phase === was && S.si === wasSi) { sfx('tap'); render(focus || keep()); return; }
    sfx(S.phase === 'hit' ? 'hit' : 'miss');
    render(S.phase === 'miss' ? 'miss' : 'next');
    announce();
  }
  function keep() { var a = d.activeElement; return a && a.getAttribute ? a.getAttribute('data-f') : null; }

  /* ---- G. the end card ---- */
  function endCard() {
    var w = el('section', 'enq-end'), L = S.last, lv = game.level(L.depth), first = !L.again && !L.prev;
    add(w, bar('stall', []));
    var card = el('div', 'enq-endcard');
    add(card, heading('h2', 'enq-endcard__h', T('ui.end.closed')), el('p', 'enq-endcard__l', T('ui.end.score', { first: L.first, end: L.end })), el('p', 'enq-endcard__l', T('ui.end.flames', { flames: L.flames, hints: L.hints })));
    add(card, flames(L.flames), el('p', 'enq-endcard__xp', first ? T('ui.end.xpFirst', { n: L.xp }) : T('ui.end.xpRun', { n: L.xp, best: Math.max(L.prev, L.xp) })));
    add(card, el('p', 'enq-endcard__can', T('c.' + lv.key + '.can')));
    if (L.tool) {
      var tl = el('div', 'enq-endcard__tool');
      add(tl, img(DATA.art.tools[L.tool], ''), add(el('div', ''), el('p', 'enq-endcard__tk', T('ui.end.tool', { t: T('tool.' + L.tool) })), el('p', '', T('tool.' + L.tool + 'Does')), el('p', 'enq-endcard__q', T('ui.says', { who: name('ratman'), t: T('v.ratman.toolArrives.0') }))));
      add(card, tl);
    }
    if (!L.flames) add(card, el('p', 'enq-endcard__q', T('ui.says', { who: name('yasser'), t: T('v.yasser.noFlameLit.0') })));
    add(card, el('p', 'enq-endcard__st', T('sticker.name') + ' · ' + T('sticker.state.' + Math.max(1, S.toStick || S.stuck))));
    var row = el('div', 'enq-col');
    add(row, btn('enq-btn enq-btn--fill', T(S.toStick > S.stuck ? 'ui.end.stick' : 'ui.btn.chart'), function () { game.toChart(); sfx('tap'); render('top'); }, 'stick'));
    if (L.depth < DATA.cases.length) add(row, btn('enq-btn', T('ui.end.next', { n: L.depth + 1, name: T('depth.' + (L.depth + 1) + '.name') }), function () { game.nextDepth(); sfx('tap'); render('top'); }, 'deeper'));
    add(row, btn('enq-btn', T('ui.stop'), function () { game.toStall(); render('goal'); }, 'stop'));
    return add(w, add(card, row));
  }

  /* ---- H. the chart: thirteen rows as text, one of them written ---- */
  var backOpen = false;
  function chart() {
    var w = el('section', 'enq-chart'), count = game.closedCount(), pending = S.toStick > S.stuck;
    add(w, bar('stall', []), heading('h2', 'enq-h', T('chart.h')), el('p', 'enq-chart__premise', T('season.premise')), law());
    if (pending) add(w, el('p', 'enq-chart__cta', T('ui.says', { who: name('kuro'), t: T('v.kuro.sticker.0') })));
    var list = el('ol', 'enq-rows'), chap = 0;
    DATA.season.forEach(function (c) {
      if (c.chapter !== chap) { chap = c.chapter; var hd = el('li', 'enq-rows__ch'); add(hd, el('h3', 'enq-rows__chn', T('season.ch.' + chap + '.name')), el('p', 'enq-rows__chl', T('season.ch.' + chap + '.line'))); list.appendChild(hd); }
      var li = el('li', 'enq-row2' + (c.playable ? ' enq-row2--mine' : '')), mine = !!c.playable, closed = mine && count > 0;
      var inner = mine && pending ? btn('enq-row2__in enq-row2__btn', '', function () { if (game.stick()) { sfx('end'); render('landed'); say(T('sticker.name') + ', ' + T('sticker.state.' + S.stuck) + '. ' + T('sticker.line')); } }, 'row') : el('div', 'enq-row2__in');
      add(inner, el('span', 'enq-row2__n', (c.n < 10 ? '0' : '') + c.n), el('span', 'enq-row2__pair', T('season.' + c.id + '.pair')));
      add(inner, el('span', 'enq-row2__line', T('season.' + c.id + (mine && !closed ? '.open' : '.line'))));
      if (!mine) add(inner, el('span', 'enq-row2__soon', T('chart.notYet')));
      if (closed) add(inner, el('span', 'enq-row2__v', T('chart.verdict', { v: T('chart.' + c.verdict), n: count })));
      if (mine && pending) add(inner, el('span', 'enq-row2__cta', T('chart.cta', { state: T('sticker.state.' + S.toStick) })));
      if (mine && S.stuck > 0) {
        var stk = el('span', 'enq-sticker', T('sticker.name')); stk.setAttribute('data-state', String(S.stuck)); stk.setAttribute('role', 'img');
        stk.setAttribute('aria-label', T('chart.stickerAria', { name: T('sticker.name'), state: T('sticker.state.' + S.stuck) }));
        if (!pending) once(stk, 'enq-pop');
        add(inner, stk);
      }
      add(li, inner);
      if (mine && S.stuck > 0 && !pending) {
        var landed = el('p', 'enq-row2__landed', T('sticker.line')); landed.tabIndex = -1; landed.setAttribute('data-f', 'landed');
        var bb = btn('enq-btn', T('chart.back'), function () { backOpen = !backOpen; render('sback'); }, 'sback'); bb.setAttribute('aria-expanded', String(backOpen));
        add(li, landed, bb);
        if (backOpen) {
          var bk = el('div', 'enq-back');
          add(bk, el('p', '', T('sticker.back')));
          var ul = el('ul', 'enq-src');
          DATA.sources.filter(function (x) { return DATA.sticker.src.indexOf(x.id) !== -1; }).forEach(function (x) {
            var a = el('a', ''); a.href = x.url; a.target = '_blank'; a.rel = 'noopener'; a.appendChild(ltr(x.at)); a.appendChild(el('span', 'sr', raw('case.newTab')));
            add(ul, add(el('li', ''), a, d.createTextNode(' '), el('span', 'enq-src__d', T('chart.readOn', { date: x.read }))));
          });
          add(li, add(bk, el('p', 'enq-ev__k', T('chart.srcK')), ul, law()));
        }
      }
      list.appendChild(li);
    });
    /* thirteen rows are a long way from the bar: the chart ends on the way back */
    return add(w, list, btn('enq-btn', T('ui.toStall'), function () { act(game.toStall, 'goal'); }, 'back2'));
  }

  /* ---- I. the card ---- */
  function cardScreen() {
    var w = el('section', 'enq-card'), ti = game.titleIndex(), xp = game.totalXp(), max = DATA.xp.max * DATA.cases.length, tl = game.tools();
    add(w, bar('stall', []));
    var top = el('div', 'enq-pcard');
    var spr = el('span', 'enq-sprite'); spr.setAttribute('aria-hidden', 'true'); spr.style.setProperty('--cx', String(DATA.art.cells[ti] % 8)); spr.style.setProperty('--cy', String(Math.floor(DATA.art.cells[ti] / 8)));
    var info = el('div', 'enq-pcard__info');
    add(info, heading('h2', 'sr', T('card.h')), el('p', 'enq-pcard__k', T('card.titleK')), el('p', 'enq-pcard__title', T('rank.' + ti)));
    var meter = el('div', 'enq-meter'); meter.setAttribute('role', 'img'); meter.setAttribute('aria-label', T('card.xpAria') + ': ' + T('card.xp', { n: xp }));
    var fillBar = el('span', 'enq-meter__f'); fillBar.style.setProperty('--p', Math.min(100, Math.round((xp / max) * 100)) + '%');
    add(info, add(meter, fillBar), el('p', 'enq-pcard__xp', T('card.xp', { n: xp })));
    add(info, el('p', 'enq-pcard__l', ti < DATA.titles.length - 1 ? T('card.next', { t: T('rank.' + (ti + 1)), xp: DATA.titles[ti + 1].xp, d: DATA.titles[ti + 1].closed }) : T('card.top')));
    add(info, el('p', 'enq-pcard__l', T('card.flames', { n: game.totalFlames() })), el('p', 'enq-pcard__l', T('card.tools', { list: tl.map(function (x) { return T('tool.' + x); }).join(T('card.and')) })));
    var kit = el('span', 'enq-pcard__kit'); kit.setAttribute('aria-hidden', 'true'); tl.forEach(function (x) { kit.appendChild(img(DATA.art.tools[x], '')); });
    add(w, add(top, spr, add(info, kit)));
    var list = el('ol', 'enq-ladder');
    DATA.depths.filter(function (x) { return x.playable; }).forEach(function (x, i) {
      var li = el('li', 'enq-ladder__r'), nm = T('depth.' + x.n + '.name'), tx = el('div', 'enq-ladder__t');
      add(tx, el('h3', 'enq-ladder__n', T('card.depth', { n: x.n, name: nm })), el('p', 'enq-ladder__v', T('depth.' + x.n + '.verbs')));
      if (raw(P + 'depth.' + x.n + '.tool')) add(tx, el('p', 'enq-ladder__tool', T('depth.' + x.n + '.tool')));
      add(tx, el('p', 'enq-ladder__s', S.closed[i] ? T('card.closed', { n: S.xpBy[i] }) : T('card.open')));
      var b = btn('enq-btn' + (S.closed[i] ? '' : ' enq-btn--fill'), T(S.closed[i] ? 'card.replay' : 'card.play'), function () { game.openSlip(x.n); sfx('tap'); render('top'); }, 'play-' + x.n);
      b.setAttribute('aria-label', T('card.aria', { n: x.n, name: nm }));
      list.appendChild(add(li, img(x.icon, '', 'enq-ladder__i'), tx, b));
    });
    return add(w, list, btn('enq-btn', T('ui.toStall'), function () { act(game.toStall, 'goal'); }, 'back2'));
  }

  /* ---- drawing ---- */
  var SCREENS = { door: door, stall: stall, slip: slip, 'case': caseScreen, end: endCard, chart: chart, card: cardScreen };
  function render(focus) {
    if (S.screen !== 'case') leaving = false;
    app.setAttribute('data-screen', S.screen);
    app.classList.toggle('is-list', S.list);
    art.classList.toggle('is-lit', game.closedCount() > 0);
    pic.alt = S.screen === 'door' ? T('ui.door.alt') : (S.screen === 'stall' ? T('ui.stallAlt') : '');
    rings();
    screen.textContent = '';
    screen.appendChild(SCREENS[S.screen]());
    if (!focus) return;
    var near = function (q) { var x = $(q, app); if (x && x.scrollIntoView) x.scrollIntoView({ block: 'nearest', behavior: 'auto' }); };
    /* after a first miss the keyboard goes back to the question, so the next Tab is an answer; the page moves only as far
       as the reason needs, and the part just tapped stays on screen with it */
    if (focus === 'miss') { var q0 = $('[data-f="top"]', app) || app; try { q0.focus({ preventScroll: true }); } catch (e) {} near('.enq-fb'); return; }
    var n = $('[data-f="' + focus + '"]', app) || $('[data-f="top"]', app) || app;
    if (n.disabled) n = $('[data-f="next"]', app) || $('[data-f="top"]', app) || app;
    /* focus never throws the page about: it moves only as far as the thing just brought needs */
    try { n.focus({ preventScroll: focus !== 'top' }); } catch (e) {}
    if (focus === 'next' || focus === 'fb' || focus === 'stay') near('.enq-actions');
    if (focus === 'hint') near('.enq-actions');
    if (focus === 'sheet' || focus.indexOf('crew-') === 0) near('.enq-talk');
    if (focus === 'top' && n.scrollIntoView && n !== app) { var r = app.getBoundingClientRect(); if (r.top < 0 || r.top > G.innerHeight * 0.5) app.scrollIntoView({ block: 'start', behavior: 'auto' }); }
  }
  function act(fn, focus) { fn(); sfx('tap'); render(focus || 'top'); }

  function boot() {
    lang = G.NUMIDEA_LANG || root.getAttribute('lang') || 'fr';
    if (lang !== 'fr' && !(G.HUB_I18N && G.HUB_I18N[lang])) lang = 'fr';
    var clair = $('[data-enq-clair]'); if (clair) clair.hidden = true;
    app.hidden = false;
    render(null);
    /* every picture a later screen shows is asked for now, so nothing is requested once the page has loaded */
    var A = DATA.art, warm = [DATA.painting.small, A.seal, A.sprite];
    Object.keys(A.faces).forEach(function (k) { warm.push(A.faces[k]); }); Object.keys(A.tools).forEach(function (k) { warm.push(A.tools[k]); });
    DATA.depths.forEach(function (x) { if (x.playable) warm.push(x.icon); });
    boot.kept = warm.map(function (u) { return img(u, ''); });
    d.addEventListener('numidea:radio', function (e) {
      var on = !!(e.detail && e.detail.on); if (on === radioOn) return;
      radioOn = on; render(keep());
    });
    root.setAttribute('data-enq-ready', lang);
  }
  /* hub/lanterne.js loads first and marks the page once its words are in: the engine waits for that, or for two seconds */
  var done = false, go = function () { if (done) return; done = true; boot(); };
  if (root.hasAttribute('data-lt-ready')) go();
  else {
    try { new MutationObserver(function (m, ob) { if (root.hasAttribute('data-lt-ready')) { ob.disconnect(); go(); } }).observe(root, { attributes: true, attributeFilter: ['data-lt-ready'] }); } catch (e) {}
    setTimeout(go, 2000);
  }
})(typeof window !== 'undefined' ? window : globalThis);
