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
   Progress is one localStorage key; nothing is sent, and after the page
   has loaded the only requests are an opened case's two files and a
   font subset its text may need (a small capital ɴ is outside the base
   Latin one), all from the site itself. Sound is eight short tones under
   the radio's switch: no audio context exists before the radio plays.
   One move per tap, 300 ms at most, none under reduced motion or the
   Mouvement toggle. No streak, no clock, no lock: flames light and
   never dim, XP is a count that buys nothing.
   ============================================================ */
(function (G) {
  'use strict';

  /* ======================= the core ======================= */
  /* D is the page's shell (#enq-data): the chart's rows, the titles, and case 1 while its depths live there. Every other
     open case brings its depths when it is opened (register). Progress is kept per case, by the chart row's file id. */
  function create(D, opt) {
    opt = opt || {};
    var rnd = opt.random || Math.random;
    var ROWS = D.season.filter(function (r) { return r.open; }), C = {};
    var XP = D.xp, FL = D.flamesAt, TI = D.titles;
    var s = { screen: 'door', back: false, talk: null, sheet: '', crew: '', list: false,
      by: {}, st: {}, ts: {}, ti: 0, lc: null, ring: false, cid: '', other: {},
      depth: 1, bet: '', stamp: '', plan: [], si: 0, phase: 'ask', tries: 0, off: [], picked: '', hintN: 0,
      hints: 0, first: 0, end: 0, xpRun: 0, queue: [], lost: [], eye: false, open: '', sel: '', slots: [],
      order: [], ki: 0, gain: 0, kuro: '', flameNow: false, queuedNow: false, wrongSlot: false, last: null,
      prev: 0, moved: 0, badSlot: -1 };
    function blank(n) { var o = { x: [], f: [], k: [] }; for (var i = 0; i < n; i++) { o.x.push(0); o.f.push(0); o.k.push(false); } return o; }
    ROWS.forEach(function (r) { s.by[r.file] = blank(r.depths); s.st[r.file] = 0; s.ts[r.file] = 0; });
    function register(id, data) { if (row(id) && data && data.depths && data.depths.length === row(id).depths) C[id] = data; }
    if (D.cases && D.cases.length) register('c01', { id: 'c01', slug: 'brave', depths: D.cases });
    function row(id) { return ROWS.filter(function (r) { return r.file === id; })[0] || null; }

    /* ---- progress: what a reload keeps. v1 was case 1 alone (three arrays); it becomes c01's, and the title it had
       earned under the prototype's numbers is kept, since an earned title is never taken back ---- */
    function progress() {
      var by = {}, k; for (k in s.other) by[k] = s.other[k];
      for (k in s.by) by[k] = { x: s.by[k].x.slice(), f: s.by[k].f.slice(), k: s.by[k].k.slice() };
      return { v: 2, by: by, st: copy(s.st, {}), ts: copy(s.ts, {}), ti: s.ti, lc: s.lc, back: s.back, list: s.list, ring: s.ring };
    }
    function save() { if (opt.save) opt.save(progress()); }
    var num = function (max) { return function (x) { return typeof x === 'number' && x >= 0 && x <= max && x === Math.floor(x); }; };
    (function restore(p) {
      if (!p || typeof p !== 'object') return;
      var arr = function (a, n, ok) { return Array.isArray(a) && a.length === n && a.every(ok); };
      var isB = function (x) { return typeof x === 'boolean'; };
      if (p.v === 1) {
        var old = { x: p.xpBy, f: p.flBy, k: p.closed }, ok = arr(old.x, 3, num(XP.max)) && arr(old.f, 3, num(FL.length)) && arr(old.k, 3, isB);
        if (!ok || !s.by.c01) return;
        var oxp = old.x.reduce(function (a, b) { return a + b; }, 0), oti = 0;
        (D.oldTitles || []).forEach(function (t, i) { var all = oxp >= t.xp; for (var j = 0; j < t.closed; j++) if (!old.k[j]) all = false; if (all && i === oti + 1) oti = i; });
        p = { v: 2, by: { c01: old }, st: { c01: p.stuck }, ts: { c01: p.toStick }, ti: oti, back: p.back, list: p.list, ring: p.ring };
      }
      if (p.v !== 2 || !p.by || typeof p.by !== 'object') return;
      for (var id in p.by) {
        var e = p.by[id]; if (!/^c\d\d$/.test(id) || !e || typeof e !== 'object') continue;
        var n = s.by[id] ? s.by[id].k.length : (Array.isArray(e.k) ? e.k.length : 0);
        if (!(n > 0 && n <= 5) || !arr(e.x, n, num(XP.max)) || !arr(e.f, n, num(FL.length)) || !arr(e.k, n, isB)) continue;
        if (!s.by[id]) { s.other[id] = e; continue; }
        s.by[id] = { x: e.x.slice(), f: e.f.slice(), k: e.k.slice() };
        var count = e.k.filter(Boolean).length, st = (p.st || {})[id], ts = (p.ts || {})[id];
        if (num(count)(st)) s.st[id] = st;
        if (num(count)(ts) && ts > s.st[id]) s.ts[id] = ts;
      }
      if (num(TI.length - 1)(p.ti)) s.ti = p.ti;
      if (Array.isArray(p.lc) && s.by[p.lc[0]] && num(5)(p.lc[1]) && isB(p.lc[2])) s.lc = p.lc.slice();
      s.back = !!p.back; s.list = !!p.list; s.ring = !!p.ring;
    })(opt.saved);

    /* ---- reading the data ---- */
    function has(id) { return !!C[id]; }
    function level(d, id) { var c = C[id || s.cid]; return c ? c.depths[Math.max(1, Math.min(c.depths.length, d)) - 1] : null; }
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
    function cur() { return s.cid && C[s.cid] ? stepAt(s.plan, s.si, s.depth) : null; }
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
    function each(fn) { ROWS.forEach(function (r) { fn(s.by[r.file], r); }); }
    function sum(f) { var n = 0; each(function (e) { e[f].forEach(function (v) { n += +v; }); }); return n; }
    function closedCount() { return sum('k'); }
    function closedIn(id) { return s.by[id] ? s.by[id].k.filter(Boolean).length : 0; }
    function depthsTotal() { var n = 0; each(function (e) { n += e.k.length; }); return n; }
    function totalXp() { return sum('x'); }
    function totalFlames() { return sum('f'); }
    function pending(id) { return !!s.by[id] && s.ts[id] > s.st[id]; }
    /* tonight's slip (the season plan, section 5), open cases only, in the chart's order: nothing closed, case 1 at depth
       1; just after a case's first depth 1, the earliest other case with a deeper depth open; else the next case not
       played, at depth 1; else the earliest depth not closed; else none */
    function rec() {
      var i, r, k, first = function (k, from) { for (var j = from; j < k.length; j++) if (!k[j]) return j + 1; return 0; };
      if (!closedCount()) return ROWS.length ? { c: ROWS[0].file, d: 1 } : null;
      if (s.lc && s.lc[1] === 1 && s.lc[2]) for (i = 0; i < ROWS.length; i++) { r = ROWS[i]; k = s.by[r.file].k; if (r.file !== s.lc[0] && k[0] && first(k, 1)) return { c: r.file, d: first(k, 1) }; }
      for (i = 0; i < ROWS.length; i++) if (!closedIn(ROWS[i].file)) return { c: ROWS[i].file, d: 1 };
      for (i = 0; i < ROWS.length; i++) { k = first(s.by[ROWS[i].file].k, 0); if (k) return { c: ROWS[i].file, d: k }; }
      return null;
    }
    /* a title turns on XP and on a number of cases closed at its depth; once turned it stays */
    function keptAt(d) { var n = 0; each(function (e) { if (e.k[d - 1]) n++; }); return n; }
    function titleIndex() { var xp = totalXp(), ti = 0; for (var i = 1; i < TI.length; i++) if (xp >= TI[i].xp && keptAt(TI[i].at) >= TI[i].cases) ti = i; return Math.max(ti, s.ti); }
    /* can what is open reach that title at all? */
    function reach(i) { var t = TI[i], n = 0; if (!t) return false; each(function (e) { if (e.k.length >= t.at) n++; }); return depthsTotal() * XP.max >= t.xp && n >= t.cases; }
    /* the eye flower from the start; the ring once a first depth is closed */
    function tools() { var r = false; each(function (e) { if (e.k[0]) r = true; }); return r ? ['eye', 'ring'] : ['eye']; }

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
    /* a case opens on its slip once its depths are in (the page adds them); no case and no slip left: the chart */
    function openSlip(id, d) {
      if (!id) { var r = rec(); if (!r) { toChart(); return true; } id = r.c; d = r.d; }
      if (!C[id]) return false;
      var dep = Math.max(1, Math.min(C[id].depths.length, d || 1));
      s.cid = id;
      var plan = scoredIds(dep).map(function (x) { return { id: x, ret: false }; });
      set({ screen: 'slip', sheet: '', crew: '', talk: null, depth: dep, bet: '', stamp: '', plan: plan, si: 0,
        hints: 0, first: 0, end: 0, xpRun: 0, queue: [], lost: [], eye: false, ki: 0, prev: s.by[id].x[dep - 1] });
      set(fresh(plan, 0, dep));
      return true;
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
      var first = s.first + (firstTry ? 1 : 0), xpRun = s.xpRun + gain, e = s.by[s.cid];
      e.x[s.depth - 1] = Math.max(e.x[s.depth - 1], xpRun);
      set({ phase: 'hit', picked: id, gain: gain, moved: Math.max(0, xpRun - Math.max(s.prev, s.xpRun)), first: first, end: s.end + 1, xpRun: xpRun, open: '', sel: '',
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
      var e = s.by[s.cid], i = s.depth - 1, again = e.k[i], had = tools().length, fl = flamesFor(s.first);
      e.k[i] = true; e.f[i] = Math.max(e.f[i], fl); e.x[i] = Math.max(e.x[i], s.xpRun);
      var n = closedIn(s.cid);
      if (n > s.st[s.cid]) s.ts[s.cid] = n;
      s.lc = [s.cid, s.depth, !again]; s.ti = titleIndex();
      set({ screen: 'end', last: { cid: s.cid, depth: s.depth, first: s.first, end: s.end, flames: fl, hints: s.hints, xp: s.xpRun, lost: s.lost.length, prev: s.prev, again: again, tool: tools().length > had ? 'ring' : '' } });
      save();
    }
    function stick(id) { id = id || (s.last && s.last.cid) || s.cid; if (pending(id)) { s.st[id] = s.ts[id]; s.ts[id] = 0; save(); return true; } return false; }
    function nextDepth() { var L = s.last; if (L && L.depth < C[L.cid].depths.length) openSlip(L.cid, L.depth + 1); }

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
      /* lawWith: with the reason of a marked part, whether that reason comes with a miss, a hit or the shown answer */
      var w = st.lawWith || [], r = rightOf(st), why = ['miss', 'hit', 'reveal'].indexOf(s.phase) !== -1;
      return !!(st.law || (why && w.indexOf(s.picked) !== -1) || (s.phase === 'reveal' && r && w.indexOf(r.id) !== -1));
    }
    function captionsOn(st) { return !!st && !st.boss && (s.depth === 1 || (s.depth === 2 && s.eye)); }
    function position() {
      var st = cur(); if (!st) return null;
      var n = scoredIds(s.depth).length;
      if (st.kind === 'stamp') return { k: 'ui.posStamp' };
      if (st.ret) return { k: 'ui.posRet', v: { i: s.si - n + 1, n: s.plan.filter(function (p) { return p.ret; }).length } };
      return { k: 'ui.pos', v: { i: s.si + 1, n: n } };
    }

    return { state: s, data: D, rows: ROWS, row: row, register: register, has: has, progress: progress, level: level, scoredIds: scoredIds, cur: cur, targets: targets, byId: byId, rightOf: rightOf, flamesFor: flamesFor, live: live,
      closedCount: closedCount, closedIn: closedIn, depthsTotal: depthsTotal, rec: rec, pending: pending, keptAt: keptAt, reach: reach, totalXp: totalXp, totalFlames: totalFlames, titleIndex: titleIndex, tools: tools,
      start: start, toDoor: toDoor, toStall: toStall, toChart: toChart, toCard: toCard, look: look, closeSheet: closeSheet, tapCrew: tapCrew, setList: setList,
      openSlip: openSlip, placeBet: placeBet, tapEye: tapEye, askHint: askHint, pick: pick, choose: choose, tapChip: tapChip, tapSlot: tapSlot, next: next, pickStamp: pickStamp,
      stick: stick, nextDepth: nextDepth, bubbleFor: bubbleFor, feedback: feedback, lawShown: lawShown, captionsOn: captionsOn, position: position };
  }

  /* the open cases' files call NightCases.add({ id, data }) and NightCases.add({ id, lang, strings }); the page's view
     takes them (before it runs, they wait here) */
  var waiting = [];
  /* in Arabic, a Latin run that holds a hyphen, a dot, a slash, an @, a colon or an ellipsis (an invented address, a
     handle, a file, a shortened hex or content address, a date « 2026-11-22 », the law's « 25-10 ») is read right to left
     in pieces: « 25-10 » shows as « 10-25 », « /download » loses its slash to the other side, and an address broken at
     its hyphen shows the hyphen on the wrong side. split() marks each such run (with the Latin words around it, so that
     « Sign-In with Ethereum » stays one piece); the view sets each in its own left-to-right <bdi>, which breaks only
     after a dot, a slash or a space. scripts/enquetes-lint.mjs reads every Arabic string with it. */
  var LW = 'A-Za-z0-9_À-ɏɐ-ʯᴀ-ᶿ', LTOK = '[@/.]?[' + LW + ']+(?:[-./@:…]+[' + LW + ']+)*/?';
  var LRUN = new RegExp(LTOK + '(?: ' + LTOK + ')*', 'g'), LJOIN = /[-.\/@:…]/;
  function split(text) {
    text = String(text); var out = [], at = 0;
    text.replace(LRUN, function (m, i) { if (!LJOIN.test(m)) return m; if (i > at) out.push({ t: text.slice(at, i) }); out.push({ t: m, iso: true }); at = i + m.length; return m; });
    if (at < text.length) out.push({ t: text.slice(at) });
    return out;
  }
  G.NightCases = { core: { create: create }, split: split, add: function (o) { waiting.push(o); } };
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
  /* the open cases' strings, by language and full key (lant.enq.c.<slug>.…), as their files bring them */
  var CS = {}, GOT = {};
  var raw = function (k) { var L = G.HUB_I18N && G.HUB_I18N[lang], c = CS[lang] || {}, f = CS.fr || {}; return L && L[k] != null ? L[k] : (c[k] != null ? c[k] : (FR[k] != null ? FR[k] : (f[k] != null ? f[k] : ''))); };
  var fill = function (str, v) { return v ? String(str).replace(/\{(\w+)\}/g, function (m, k) { return v[k] != null ? v[k] : m; }) : str; };
  var T = function (k, v) { return fill(raw(P + k), v); };
  var name = function (who) { return who === 'stall' ? T('ui.stallName') : raw('lant.cast.' + who); };
  var reduce = G.matchMedia ? G.matchMedia('(prefers-reduced-motion: reduce)') : { matches: true };
  var motionOn = function () { return !reduce.matches && !root.classList.contains('motion-off'); };
  var KEY = DATA.store, saved = null;
  try { saved = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) {}
  var game = create(DATA, { saved: saved, save: function (p) { try { localStorage.setItem(KEY, JSON.stringify(p)); } catch (e) {} } });
  var S = game.state;
  /* a case's files, once in: its depths go to the rules, its strings to CS */
  function take(o) {
    var r = o && game.row(o.id); if (!r) return;
    if (o.data) game.register(o.id, o.data);
    if (o.lang && o.strings) { var L = CS[o.lang] = CS[o.lang] || {}, pre = P + 'c.' + r.id + '.'; for (var k in o.strings) L[pre + k] = o.strings[k]; GOT[o.id + '.' + o.lang] = true; }
  }
  waiting.forEach(take); waiting = []; G.NightCases.add = take;
  /* case 1 lives in the page until it moves to its own files */
  var legacy = function (id) { return id === 'c01' && !!(DATA.cases && DATA.cases.length); };
  var ready = function (id) { return game.has(id) && (legacy(id) || !!GOT[id + '.' + lang]); };
  var me = $('script[src*="enquetes.js"]'), VER = ((me && /\?v=[^&#]*/.exec(me.getAttribute('src'))) || [''])[0];
  /* the two files of a case, added as script elements (no fetch); one that fails is taken out, so « Try again » asks again */
  function fetchCase(id, cb) {
    var want = [];
    if (!game.has(id)) want.push(id);
    if (!legacy(id) && !GOT[id + '.' + lang]) want.push(id + '.' + lang);
    var left = want.length, ok = true;
    if (!left) { cb(ready(id)); return; }
    want.forEach(function (f) {
      var x = d.createElement('script'); x.src = 'enq/' + f + '.js' + VER; x.async = false;
      x.onload = x.onerror = function (e) { if (e.type === 'error') { ok = false; if (x.parentNode) x.parentNode.removeChild(x); } if (!--left) cb(ok && ready(id)); };
      d.head.appendChild(x);
    });
  }
  /* open a case at a depth (none named: tonight's slip), once its files are in */
  var wait = null;
  function openCase(id, dep) {
    if (!id) { var r = game.rec(); if (!r) { act(game.openSlip); return; } id = r.c; dep = r.d; }
    if (ready(id)) { act(function () { game.openSlip(id, dep); }); return; }
    wait = { id: id, d: dep, fail: false }; render('top');
    fetchCase(id, function (ok) { if (!wait || wait.id !== id) return; if (ok) act(function () { game.openSlip(id, dep); }); else { wait.fail = true; render('retry'); } });
  }
  function waitScreen() {
    var w = el('section', 'enq-wait');
    add(w, bar('stall', []), heading('h2', 'enq-h', T(wait.fail ? 'ui.loadFail' : 'ui.load')));
    if (wait.fail) add(w, add(el('div', 'enq-row'), btn('enq-btn enq-btn--fill', T('ui.retry'), function () { openCase(wait.id, wait.d); }, 'retry'), btn('enq-btn', T('ui.toStall'), function () { act(game.toStall, 'goal'); })));
    return w;
  }
  var stickerK = function (id) { return legacy(id) ? 'sticker' : 'c.' + game.row(id).id + '.sticker'; };

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
  /* in Arabic each Latin run split() marks goes in its own <bdi dir="ltr"> (same text) that does not break (.enq-tok__s):
     an address of more than 30 characters may wrap after a dot or a slash (a <wbr> there), and a space still breaks */
  function setText(n, text) {
    text = String(text);
    var parts = root.getAttribute('dir') === 'rtl' ? split(text) : null;
    if (!parts || !parts.some(function (p) { return p.iso; })) { n.textContent = text; return; }
    n.textContent = '';
    parts.forEach(function (p) {
      if (!p.iso) { n.appendChild(d.createTextNode(p.t)); return; }
      var b = d.createElement('bdi'); b.dir = 'ltr'; b.className = 'enq-tok';
      p.t.split(/( +)/).forEach(function (w) {
        if (!w) return;
        if (w.charAt(0) === ' ') { b.appendChild(d.createTextNode(w)); return; }
        (w.length > 30 ? w.match(/[.\/]*[^.\/]+[.\/]*|[.\/]+/g) || [w] : [w]).forEach(function (x, i, all) { var s = d.createElement('span'); s.className = 'enq-tok__s'; s.textContent = x; b.appendChild(s); if (i < all.length - 1) b.appendChild(d.createElement('wbr')); });
      });
      n.appendChild(b);
    });
  }
  /* a line set beside other nodes (a hint after Ratman's name, Kūro's word, the words around a slot) goes the same way */
  function txt(text) { var f = d.createDocumentFragment(); setText(f, text); return f; }
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
  var art = el('div', 'enq-art'), pic = img(DATA.painting.src, '', 'enq-art__img'), ringBox = el('div', 'enq-art__rings'), glow = el('span', 'enq-art__glow'), plane = el('div', 'enq-art__plane');
  pic.srcset = '../' + DATA.painting.small + ' 800w, ../' + DATA.painting.src + ' 1600w'; pic.sizes = '(min-width:900px) 60vw, 100vw';
  pic.width = DATA.painting.size[0]; pic.height = DATA.painting.size[1];
  glow.setAttribute('aria-hidden', 'true');
  /* the rings and the glow sit on a plane the size of the whole picture as it is drawn (on a wide screen it may be
     taller than the picture's own shape, and the picture is then cut at its sides; the plane follows it) */
  add(art, pic, add(plane, glow, ringBox));
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
    /* a reload keeps closed depths, XP and a waiting sticker, not the place inside an open case: the door says so */
    if (S.back) add(w, el('p', 'enq-door__kept', T('ui.door.kept')));
    add(w, law());
    var o = el('div', 'enq-door__opts');
    var snd = soundBtn('enq-opt', false);
    var lst = btn('enq-opt', T(S.list ? 'ui.list.on' : 'ui.list.off'), function () { game.setList(!S.list); render('list'); }, 'list');
    lst.setAttribute('aria-pressed', String(S.list));
    add(w, add(o, snd, lst));
    return w;
  }

  /* ---- B, C. the stall, its rings and its look sheet ---- */
  /* three fixed rings; tonight's slip on the awning, the shelves or the headphones draws a fourth there */
  var RING_GO = { slip: function () { openCase(); }, card: function () { act(game.toCard); }, chart: function () { act(game.toChart); } };
  function slipAt() { var r = game.rec(), w = r && game.row(r.c); return w ? w.slip : ''; }
  function ringList() {
    var p = slipAt(), pl = DATA.places.filter(function (x) { return x.id === p; })[0];
    return pl ? DATA.rings.concat([{ id: pl.id, at: pl.at, opens: 'slip', place: true }]) : DATA.rings;
  }
  function ringBtn(r, rec) { return r.opens === 'slip' ? (rec ? 'ring.lantern.btn' : 'ui.btn.replay2') : 'ring.' + r.id + '.btn'; }
  function rings() {
    ringBox.textContent = '';
    if (S.screen !== 'stall' || wait) return;
    var rec = game.rec();
    ringList().forEach(function (r) {
      var b = btn('enq-ring' + ((r.id === 'lantern' || r.place) && rec ? ' enq-ring--slip' : '') + (S.sheet === r.id ? ' is-on' : '') + (r.at[1] > 0.85 ? ' enq-ring--up' : '') + (r.at[0] < 0.2 ? ' enq-ring--s' : ''), '', function () { game.look(r.id); sfx('tap'); render('sheet'); }, 'ring-' + r.id);
      b.setAttribute('aria-label', T('ring.' + r.id + '.label')); place(b, r.at);
      /* one word under each ring says what it is (its name holds the word); near the foot of the crop it sits above */
      b.appendChild(el('span', 'enq-ring__w', T('ring.' + r.id + '.word')));
      ringBox.appendChild(b);
    });
  }
  function stall() {
    var w = el('section', 'enq-stall'), rec = game.rec(), list = ringList(), at = slipAt();
    add(w, bar('door', [el('span', 'enq-bar__rank', T('rank.' + game.titleIndex()))]));
    var h = heading('h2', 'sr', T('ui.stallName'));
    add(w, h, btn('enq-goal', T(rec ? 'ui.goalAt.' + at : 'ui.goalNone2'), function () { openCase(); }, 'goal'));
    var box = el('div', 'enq-talk');
    var ring = list.filter(function (r) { return r.id === S.sheet; })[0];
    if (ring) {
      box.className = 'enq-talk enq-talk--sheet';
      var hh = el('h3', 'enq-talk__name', T('ring.' + ring.id + '.name')); hh.tabIndex = -1; hh.setAttribute('data-f', 'sheet');
      var go1 = btn('enq-btn enq-btn--fill', T(ringBtn(ring, rec)), function () { RING_GO[ring.opens](); }, 'sheet-go');
      /* a slip in the book or under Kūro adds no ring: that ring's sheet opens it */
      var go2 = (ring.id === 'book' || ring.id === 'kuro') && rec && at === ring.id ? btn('enq-btn enq-btn--fill', T('ring.book.slip'), function () { openCase(); }, 'sheet-slip') : null;
      add(box, hh, el('p', 'enq-talk__t', T('ring.' + ring.id + '.line')), add(el('div', 'enq-row'), go2, go1, btn('enq-btn', T('ui.close'), function () { game.closeSheet(); render('ring-' + ring.id); })));
    } else {
      var who = S.talk ? S.talk.who : 'stall';
      var tx = el('div', 'enq-talk__body');
      add(tx, el('p', 'enq-talk__name', name(who)), el('p', 'enq-talk__t', S.talk ? T(S.talk.k, S.talk.v) : T(list.length > 3 ? 'ui.stallIdle4' : 'ui.stallIdle')));
      once(tx, 'enq-in');
      add(box, who === 'stall' ? null : face(who, 'enq-face--lg'), tx);
      var c = DATA.crew.filter(function (x) { return x.id === S.crew; })[0];
      if (c) {
        var m = game.depthsTotal();
        var fact = c.fact === 'closed' ? T('ui.fact.closedN', { n: game.closedCount(), m: m }) : c.fact === 'flames' ? T('ui.fact.flamesN', { n: game.totalFlames(), m: m * DATA.flamesAt.length })
          : c.fact === 'slip' ? (rec ? T('ui.fact.slipAt', { c: game.row(rec.c).n, n: rec.d }) : T('ui.fact.noSlip')) : T('ui.fact.tools', { n: game.tools().length });
        var to = c.btn === 'slip' && !rec ? 'chart' : c.btn;
        add(tx, el('p', 'enq-talk__fact', fact), btn('enq-btn enq-btn--fill', T(to === 'slip' ? 'ui.btn.slip' : 'ui.btn.' + to), function () { RING_GO[to](); }, 'crew-go'));
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
    DATA.rings.forEach(function (r) { nav.appendChild(btn('enq-btn', T(ringBtn(r, rec)), function () { RING_GO[r.opens](); })); });
    return add(w, nav);
  }

  /* ---- D. the slip and the open bet ---- */
  function slip() {
    var w = el('section', 'enq-slip'), lv = game.level(S.depth), c = 'c.' + lv.key, bet = lv.steps[0];
    add(w, bar('stall', [el('span', 'enq-bar__pos', T('ui.depth', { n: lv.level }))]));
    var card = el('div', 'enq-slipcard');
    add(card, el('p', 'enq-slipcard__tag', T(c + '.slipTag')), heading('h2', 'enq-slipcard__t', T(c + '.slip')));
    add(w, card);
    /* the evidence waits as a sealed slip, folded under the paw seal, with its caption in words */
    var pv = el('figure', 'enq-pv'), seal = el('div', 'enq-pv__slip');
    seal.setAttribute('aria-hidden', 'true');
    add(seal, el('span', 'enq-pv__fold'), img(DATA.art.seal, '', 'enq-pv__seal'));
    add(pv, el('figcaption', 'enq-pv__cap', T('ui.pvAria')), seal);
    add(w, pv, el('p', 'enq-ask', T(c + '.' + bet.id + '.prompt')));
    var row = el('div', 'enq-verdicts');
    bet.options.forEach(function (o) { row.appendChild(btn('enq-verdict', T('ui.opt.' + o), function () { game.placeBet(o); sfx('tap'); render('top'); }, 'opt-' + o)); });
    /* what a reload keeps, said where a run starts (the door says it too): a slip is kept once stamped, its XP at once */
    return add(w, row, bet.law ? law('enq-law--band') : null, el('p', 'enq-slip__kept', T('ui.slipKept')));
  }

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
      /* three slots and their chips: set tighter, so the last chip stays in the phone's decide zone (SPEC section 3) */
      if (st.answer.length > 2) ev.classList.add('enq-ev--long');
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
        if (!mm) { if (piece) sent.appendChild(txt(piece)); return; }
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
    /* the mock's title: a step's own line (address), else the case's own title for its template, else the shell's */
    var title = st.addr || (st.address ? T(st.k + '.address') : raw(P + 'c.' + game.row(S.cid).id + '.tpl.' + tpl) || raw(P + 'tpl.' + tpl));
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
    if (game.live() && st.hint && S.hintN > 0 && S.hintN < 3) add(w, add(el('p', 'enq-hint'), el('b', 'enq-hint__who', T('ui.says', { who: name('ratman'), t: T('v.ratman.hint.' + (S.hintN - 1)) })), txt(' ' + T(st.k + '.hint.' + (S.hintN - 1)))));
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
    if (f.kuro) add(line, add(el('span', 'enq-kuro'), el('b', '', name('kuro')), txt(kn ? kw.slice(name('kuro').length) : ' ' + kw)));
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
    var w = el('section', 'enq-end'), L = S.last, lv = game.level(L.depth, L.cid), first = !L.again && !L.prev, sk = stickerK(L.cid), nd = game.row(L.cid).depths;
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
    add(card, el('p', 'enq-endcard__st', T(sk + '.name') + ' · ' + T('sticker.state.' + Math.max(1, S.ts[L.cid] || S.st[L.cid]))));
    var row = el('div', 'enq-col');
    add(row, btn('enq-btn enq-btn--fill', T(game.pending(L.cid) ? 'ui.end.stick' : 'ui.btn.chart'), function () { act(game.toChart); }, 'stick'));
    if (L.depth < nd) add(row, btn('enq-btn', T('ui.end.next', { n: L.depth + 1, name: T('depth.' + (L.depth + 1) + '.name') }), function () { act(game.nextDepth); }, 'deeper'));
    add(row, btn('enq-btn', T('ui.stop'), function () { game.toStall(); render('goal'); }, 'stop'));
    return add(w, add(card, row));
  }

  /* ---- H. the chart: thirteen rows as text; an open row is a button, its sheet one button a written depth ---- */
  var backOpen = '', rowOpen = '';
  function chart() {
    var w = el('section', 'enq-chart'), any = game.rows.some(function (r) { return game.pending(r.file); });
    add(w, bar('stall', []), heading('h2', 'enq-h', T('chart.h')), el('p', 'enq-chart__premise', T('season.premise')), law());
    if (any) add(w, el('p', 'enq-chart__cta', T('ui.says', { who: name('kuro'), t: T('v.kuro.sticker.0') })));
    var list = el('ol', 'enq-rows'), chap = 0;
    DATA.season.forEach(function (c) {
      if (c.chapter !== chap) { chap = c.chapter; var hd = el('li', 'enq-rows__ch'); add(hd, el('h3', 'enq-rows__chn', T('season.ch.' + chap + '.name')), el('p', 'enq-rows__chl', T('season.ch.' + chap + '.line'))); list.appendChild(hd); }
      var mine = !!game.row(c.file), id = c.file, n = mine ? game.closedIn(id) : 0, pend = mine && game.pending(id), stuck = mine ? S.st[id] : 0, sk = mine ? stickerK(id) : '';
      var li = el('li', 'enq-row2' + (mine ? ' enq-row2--mine' : ''));
      var inner = mine ? btn('enq-row2__in enq-row2__btn', '', function () {
        if (pend) { if (game.stick(id)) { rowOpen = ''; sfx('end'); render('landed-' + id); say(T(sk + '.name') + ', ' + T('sticker.state.' + S.st[id]) + '. ' + T(sk + '.line')); } return; }
        rowOpen = rowOpen === id ? '' : id; sfx('tap'); render('row-' + id);
      }, 'row-' + id) : el('div', 'enq-row2__in');
      if (mine && !pend) { inner.setAttribute('aria-expanded', String(rowOpen === id)); inner.setAttribute('aria-label', T('chart.rowAria', { pair: T('season.' + c.id + '.pair') })); }
      add(inner, el('span', 'enq-row2__n', (c.n < 10 ? '0' : '') + c.n), el('span', 'enq-row2__pair', T('season.' + c.id + '.pair')));
      add(inner, el('span', 'enq-row2__line', T(!mine ? 'season.' + c.id + '.line' : legacy(id) ? 'season.' + c.id + (n ? '.line' : '.open') : 'c.' + c.id + '.row')));
      if (!mine) add(inner, el('span', 'enq-row2__soon', T('chart.notYet')));
      if (n) add(inner, el('span', 'enq-row2__v', T('chart.verdictN', { v: T('chart.' + c.verdict), n: n, m: c.depths })));
      if (pend) add(inner, el('span', 'enq-row2__cta', T('chart.cta', { state: T('sticker.state.' + S.ts[id]) })));
      if (stuck > 0) {
        var stk = el('span', 'enq-sticker', T(sk + '.name')); stk.setAttribute('data-state', String(stuck)); stk.setAttribute('role', 'img');
        stk.setAttribute('aria-label', T('chart.stickerAria', { name: T(sk + '.name'), state: T('sticker.state.' + stuck) }));
        if (!pend) once(stk, 'enq-pop');
        add(inner, stk);
      }
      add(li, inner);
      if (mine && rowOpen === id && !pend) {
        var sh = el('div', 'enq-rowsheet');
        add(sh, el('p', 'enq-ev__k', T('chart.depths', { n: c.depths })));
        for (var i = 1; i <= c.depths; i++) (function (dp) {
          var done = S.by[id].k[dp - 1];
          add(sh, btn('enq-btn' + (done ? '' : ' enq-btn--fill'), T('ui.end.next', { n: dp, name: T('depth.' + dp + '.name') }) + (done ? ' · ' + T('chart.played') : ''), function () { openCase(id, dp); }, 'play-' + id + '-' + dp));
        })(i);
        add(li, sh);
      }
      if (stuck > 0 && !pend) {
        var landed = el('p', 'enq-row2__landed', T(sk + '.line')); landed.tabIndex = -1; landed.setAttribute('data-f', 'landed-' + id);
        var bb = btn('enq-btn', T('chart.back'), function () { backOpen = backOpen === id ? '' : id; render('sback-' + id); }, 'sback-' + id); bb.setAttribute('aria-expanded', String(backOpen === id));
        add(li, landed, bb);
        if (backOpen === id) {
          var bk = el('div', 'enq-back');
          add(bk, el('p', '', T(sk + '.back')));
          var ul = el('ul', 'enq-src');
          (c.src || []).forEach(function (x) {
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

  /* ---- I. the card: the title, the season's numbers for the next one, the five depths kept across the open cases ---- */
  function cardScreen() {
    var w = el('section', 'enq-card'), ti = game.titleIndex(), xp = game.totalXp(), tl = game.tools(), nx = DATA.titles[ti + 1], open = game.rows.length;
    add(w, bar('stall', []));
    var top = el('div', 'enq-pcard');
    var spr = el('span', 'enq-sprite'); spr.setAttribute('aria-hidden', 'true'); spr.style.setProperty('--cx', String(DATA.art.cells[ti] % 8)); spr.style.setProperty('--cy', String(Math.floor(DATA.art.cells[ti] / 8)));
    var info = el('div', 'enq-pcard__info');
    add(info, heading('h2', 'sr', T('card.h')), el('p', 'enq-pcard__k', T('card.titleK')), el('p', 'enq-pcard__title', T('rank.' + ti)));
    var meter = el('div', 'enq-meter'); meter.setAttribute('role', 'img'); meter.setAttribute('aria-label', T('card.xpAria') + ': ' + T('card.xp', { n: xp }));
    var fillBar = el('span', 'enq-meter__f'); fillBar.style.setProperty('--p', (nx ? Math.min(100, Math.round((xp / nx.xp) * 100)) : 100) + '%');
    add(info, add(meter, fillBar), el('p', 'enq-pcard__xp', T('card.xp', { n: xp })));
    add(info, el('p', 'enq-pcard__l', nx ? T('card.nextS', { t: T('rank.' + (ti + 1)), xp: nx.xp, c: nx.cases, d: nx.at }) : T('card.top')));
    if (nx && !game.reach(ti + 1)) add(info, el('p', 'enq-pcard__l', T('card.cannot')));
    add(info, el('p', 'enq-pcard__l', T('card.flamesN', { n: game.totalFlames(), m: game.depthsTotal() * DATA.flamesAt.length })), el('p', 'enq-pcard__l', T('card.tools', { list: tl.map(function (x) { return T('tool.' + x); }).join(T('card.and')) })));
    var kit = el('span', 'enq-pcard__kit'); kit.setAttribute('aria-hidden', 'true'); tl.forEach(function (x) { kit.appendChild(img(DATA.art.tools[x], '')); });
    add(w, add(top, spr, add(info, kit)));
    var list = el('ol', 'enq-ladder');
    DATA.depths.filter(function (x) { return x.playable; }).forEach(function (x) {
      var li = el('li', 'enq-ladder__r'), nm = T('depth.' + x.n + '.name'), tx = el('div', 'enq-ladder__t');
      add(tx, el('h3', 'enq-ladder__n', T('card.depth', { n: x.n, name: nm })), el('p', 'enq-ladder__v', T('depth.' + x.n + '.verbs')));
      if (raw(P + 'depth.' + x.n + '.tool')) add(tx, el('p', 'enq-ladder__tool', T('depth.' + x.n + '.tool')));
      add(tx, el('p', 'enq-ladder__s', T('card.closedIn', { n: game.keptAt(x.n), m: open })));
      list.appendChild(add(li, img(x.icon, '', 'enq-ladder__i'), tx));
    });
    var rec = game.rec();
    return add(w, list, add(el('div', 'enq-row'), btn('enq-btn enq-btn--fill', T(rec ? 'ui.btn.slip' : 'ui.btn.chart'), function () { rec ? openCase() : act(game.toChart); }, 'card-go'), btn('enq-btn', T('ui.toStall'), function () { act(game.toStall, 'goal'); }, 'back2')));
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
    screen.appendChild(wait ? waitScreen() : SCREENS[S.screen]());
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
  function act(fn, focus) { wait = null; fn(); sfx('tap'); render(focus || 'top'); }

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
    /* the language changes in place: the open case's strings in that language are added first */
    d.addEventListener('numidea:lang', function (e) {
      var l = (e.detail && e.detail.lang) || lang; if (l !== 'fr' && !(G.HUB_I18N && G.HUB_I18N[l])) return;
      lang = l; var id = S.cid;
      if (id && game.has(id) && !ready(id)) fetchCase(id, function () { render(keep()); });
      render(keep());
    });
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
