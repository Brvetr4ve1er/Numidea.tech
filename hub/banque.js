/* hub/banque.js: the banking course's exercises, XP and ranks (hub/banque.html, 2026-11-21). Loaded after
   hub/app.js, which already runs the lessons' shell (tabs, the question, the stamps in localStorage
   'numidea-lessons-bank1|5|8') and the language switch. This file adds:
   - the exercises ([data-bq] blocks): the doors, the traps, the dashboard, the alerts, the quiz, the checklist
     and the emergency card, and module 5's step runs (ON.run: one step at a time, try first, then why;
     the steps are STEP.pick, sort, tap, pairs, build and call);
   - the logbook: 100 XP a stamp, 50 an exercise done, 10 a right answer in the quiz's best run; five ranks;
     a seal per module once its lessons are all stamped; a pill in the corner and a rank-up line.
   Every word on screen is the page's own (data-i18n, swapped by app.js); this script only shows, hides and
   counts. Progress is kept in this browser alone (localStorage 'numidea-bank', and 'numidea-bank-card' only
   while "keep on this device" is ticked) and sent nowhere. Nothing moves by itself; with reduced motion
   nothing moves at all. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var root = document.documentElement;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var KEY = 'numidea-bank', CARD = 'numidea-bank-card';
  var SETS = { m1: ['bank1', ['k11', 'k12', 'k13', 'k14']], m5: ['bank5', ['k51', 'k52', 'k53', 'k54']], m8: ['bank8', ['k81', 'k82', 'k83']] };
  var RANKS = [0, 300, 700, 1200, 1600];
  var BADGE = ['初', '注', '警', '守', '鉄'];

  var load = function (k, d) { try { var v = JSON.parse(localStorage.getItem(k) || 'null'); return v == null ? d : v; } catch (e) { return d; } };
  var save = function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  var st = load(KEY, null);
  if (!st || st.v !== 1 || typeof st !== 'object') st = { v: 1, w: {}, best: 0, ck: [], keep: false };
  if (!st.w || typeof st.w !== 'object') st.w = {};
  if (!Array.isArray(st.ck)) st.ck = [];
  var put = function () { save(KEY, st); };

  var lang = function () { return root.getAttribute('lang') || 'fr'; };
  var grp = function (n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, lang() === 'en' ? ',' : ' '); };
  var stamped = function (set) { var d = load('numidea-lessons-' + set, []); return Array.isArray(d) ? d : []; };

  /* ---------------- the logbook ---------------- */
  var xpOf = function () {
    var n = 0;
    Object.keys(SETS).forEach(function (m) { var d = stamped(SETS[m][0]); n += SETS[m][1].filter(function (id) { return d.indexOf(id) > -1; }).length; });
    var w = Object.keys(st.w).filter(function (k) { return st.w[k]; }).length;
    return { stamps: n, xp: n * 100 + w * 50 + Math.min(12, st.best | 0) * 10 };
  };
  var rankOf = function (xp) { var r = 0; RANKS.forEach(function (t, i) { if (xp >= t) r = i; }); return r; };
  var shownXp = null, shownRank = null;
  var showRank = function (r) { $$('.bq-rank').forEach(function (s) { s.hidden = s.getAttribute('data-rank') !== String(r); }); };
  var roll = function (from, to) {
    var els = $$('[data-bq-xp]');
    if (reduce || from == null || from === to) { els.forEach(function (e) { e.textContent = grp(to); }); return; }
    var t0 = performance.now(), dur = 667;
    var step = function (t) {
      var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3), v = from + (to - from) * e;
      els.forEach(function (el) { el.textContent = grp(v); });
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  var bump = function (el) { if (!el || reduce) return; el.classList.remove('is-bump'); void el.offsetWidth; el.classList.add('is-bump'); };
  var toast = function () {
    var t = $('[data-bq-toast-in]');
    if (!t) return;
    t.hidden = false; t.classList.remove('is-on'); void t.offsetWidth; t.classList.add('is-on');
    clearTimeout(t._h); t._h = setTimeout(function () { t.hidden = true; t.classList.remove('is-on'); }, reduce ? 4000 : 2700);
  };
  var paint = function () {
    var s = xpOf(), xp = s.xp, r = rankOf(xp);
    roll(shownXp, xp);
    if (shownRank != null && r > shownRank) { showRank(r); toast(); bump($('[data-bq-badge]')); }
    else showRank(r);
    if (shownXp != null && xp > shownXp) bump($('[data-bq-pill]'));
    shownXp = xp; shownRank = r;
    var badge = $('[data-bq-badge]'); if (badge) badge.textContent = BADGE[r];
    var lo = RANKS[r], hi = RANKS[r + 1];
    var bar = $('.bq-hud__bar'); if (bar) bar.style.setProperty('--p', hi ? String((xp - lo) / (hi - lo)) : '1');
    var nx = $('[data-bq-next]'); if (nx && hi) nx.textContent = grp(hi - xp);
    var nw = $('[data-bq-next-wrap]'), mx = $('[data-bq-max]');
    if (nw) nw.hidden = !hi; if (mx) mx.hidden = !!hi;
    // a module's seal: every one of its lessons stamped
    var all = true;
    Object.keys(SETS).forEach(function (m) {
      var d = stamped(SETS[m][0]), full = SETS[m][1].every(function (id) { return d.indexOf(id) > -1; });
      if (!full) all = false;
      $$('[data-bq-seal="' + m + '"]').forEach(function (x) { if (full && !x.classList.contains('is-earned')) x.classList.add('is-earned'); else if (!full) x.classList.remove('is-earned'); });
      $$('[data-bq-card="' + m + '"]').forEach(function (x) { x.classList.toggle('is-earned', full); });
      var sec = document.getElementById(m); if (sec) sec.classList.toggle('is-done', full);
    });
    var fin = $('[data-bq-fin]'); if (fin) fin.hidden = !all;
  };
  // "+50" rising from what earned it
  var float = function (el, n) {
    if (!el || reduce || !n) return;
    var r = el.getBoundingClientRect(), f = document.createElement('span');
    f.className = 'bq-float'; f.setAttribute('aria-hidden', 'true'); f.textContent = '+' + n;
    f.style.left = Math.round(r.left + r.width / 2 - 20) + 'px'; f.style.top = Math.round(Math.max(60, r.top)) + 'px';
    document.body.appendChild(f); void f.offsetWidth; f.classList.add('is-on');
    setTimeout(function () { f.remove(); }, 1100);
  };
  // an exercise done: its line shows, 50 XP, once
  var win = function (w) {
    var id = w.getAttribute('data-bq-id'), d = $('[data-bq-done]', w), first = !st.w[id];
    if (d) d.hidden = false;
    if (!first) return;
    st.w[id] = 1; put(); float(d || w, 50); paint();
  };
  var setP = function (el, p) { if (el) el.style.setProperty('--p', String(Math.max(0, Math.min(1, p)))); };

  document.addEventListener('numidea:lesson', function (e) {
    var dt = e.detail || {};
    if (!dt.first) return;
    var panel = document.getElementById('ls-p-' + dt.id);
    setTimeout(function () { float(panel && $('[data-ls-ok]', panel), 100); paint(); }, 0);
  });

  /* ---------------- the exercises ---------------- */
  var ON = {};
  // 1.1 the doors: all three opened
  ON.doors = function (w) {
    var seen = { 0: 1 };
    document.addEventListener('numidea:pick', function (e) {
      if (!e.detail || !w.contains(e.detail.el)) return;
      seen[e.detail.i] = 1;
      if (seen[0] && seen[1] && seen[2]) win(w);
    });
  };
  // 1.2 the six steps: find the two traps
  ON.traps = function (w) {
    var n = $('[data-bq-n]', w), found = 0;
    $$('.bq-step', w).forEach(function (b) {
      b.addEventListener('click', function () {
        if (b.getAttribute('aria-pressed') === 'true') return;
        var trap = b.getAttribute('data-trap') === '1';
        b.setAttribute('aria-pressed', 'true'); b.classList.add(trap ? 'is-trap' : 'is-safe');
        var why = b.parentNode.querySelector('.bq-step__why'); if (why) why.hidden = false;
        if (trap) { found++; n.textContent = String(found); if (found === 2) win(w); }
      });
    });
  };
  // 1.3 the dashboard: touch each part; the account view's four teach the lesson
  ON.dash = function (w) {
    var need = { bal: 0, avail: 0, pend: 0, inT: 0 }, tips = $$('[data-tip-p]', w);
    var count = function (pane) {
      if (reduce) return;
      $$('[data-count]', pane).forEach(function (c) {
        var to = +c.getAttribute('data-count'), t0 = performance.now();
        var step = function (t) { var k = Math.min(1, (t - t0) / 500); c.textContent = grp(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); };
        requestAnimationFrame(step);
      });
    };
    $$('[data-view]', w).forEach(function (b) {
      b.addEventListener('click', function () {
        var v = b.getAttribute('data-view');
        $$('[data-view]', w).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        $$('[data-pane]', w).forEach(function (p) { p.hidden = p.getAttribute('data-pane') !== v; if (!p.hidden) count(p); });
      });
    });
    $$('[data-tip]', w).forEach(function (b) {
      b.addEventListener('click', function () {
        var k = b.getAttribute('data-tip');
        $$('[data-tip]', w).forEach(function (x) { x.setAttribute('aria-pressed', String(x.getAttribute('data-tip') === k)); });
        tips.forEach(function (p) { p.hidden = p.getAttribute('data-tip-p') !== k; });
        if (k in need) { need[k] = 1; if (need.bal && need.avail && need.pend && need.inT) win(w); }
      });
    });
    var fmt = function () { $$('[data-count]', w).forEach(function (c) { c.textContent = grp(+c.getAttribute('data-count')); }); };
    onLang.push(fmt);
    if ('IntersectionObserver' in window && !reduce) {
      var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { count($('[data-pane]:not([hidden])', w)); io.disconnect(); } }); }, { threshold: .4 });
      io.observe(w);
    }
  };
  // 1.4 the alerts: switch them on and watch the phone
  ON.alerts = function (w) {
    var sws = $$('[data-al]', w), n = $('[data-bq-n]', w), gauge = $('.bq-gauge', w), empty = $('[data-al-empty]', w);
    var low = $('[data-al-low]', w), out = $('[data-al-out]', w);
    var sync = function () {
      var on = sws.filter(function (s) { return s.getAttribute('aria-checked') === 'true'; }).length;
      n.textContent = String(on); setP(gauge, on / sws.length); empty.hidden = on > 0;
      if (on === sws.length) win(w);
    };
    sws.forEach(function (s) {
      s.addEventListener('click', function () {
        var on = s.getAttribute('aria-checked') !== 'true', note = $('[data-note="' + s.getAttribute('data-al') + '"]', w);
        s.setAttribute('aria-checked', String(on));
        if (note) { note.hidden = !on; if (on && note.parentNode.firstElementChild !== note) note.parentNode.insertBefore(note, note.parentNode.firstElementChild); }
        sync();
      });
    });
    var lowOut = function () { out.textContent = grp(+low.value); };
    low.addEventListener('input', lowOut); onLang.push(lowOut);
    sync();
  };
  // one message to judge (5.1, 8.1): the answer, the verdict, why
  var judge = function (card, cb) {
    var want = $('[data-v]', card).getAttribute('data-v'), bs = $$('[data-vote]', card), vd = $('[data-verdict]', card);
    bs.forEach(function (b) {
      b.addEventListener('click', function () {
        var right = b.getAttribute('data-vote') === want;
        bs.forEach(function (x) { x.disabled = true; x.setAttribute('aria-pressed', String(x === b)); });
        b.classList.add(right ? 'is-right' : 'is-wrong');
        if (!right) bs.forEach(function (x) { if (x.getAttribute('data-vote') === want) x.classList.add('is-right'); });
        $('[data-vr-ok]', vd).hidden = !right; $('[data-vr-no]', vd).hidden = right; vd.hidden = false;
        card.classList.add(right ? 'is-ok' : 'is-miss');
        cb(right, b);
      });
    });
  };
  // a number that runs from where it is to where it goes (a balance, in the runs)
  var runTo = function (el, to, ms) {
    if (!el) return;
    var from = +el.getAttribute('data-now') || +el.getAttribute('data-bal'); el.setAttribute('data-now', String(to));
    if (reduce) { el.textContent = grp(to); return; }
    var t0 = performance.now(), dur = ms || 700;
    el.classList.toggle('is-down', to < from);
    var step = function (t) { var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3); el.textContent = grp(from + (to - from) * e); if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  };
  var balReset = function (el) { if (!el) return; el.removeAttribute('data-now'); el.classList.remove('is-down'); el.textContent = grp(+el.getAttribute('data-bal')); };
  var focusIn = function (el) { if (el) setTimeout(function () { try { el.focus({ preventScroll: true }); } catch (e) { el.focus(); } }, 30); };

  // the step handlers: each calls ok() once its step is done
  var STEP = {};
  // choose; a wrong answer says why (and may show what it costs), a right one says why and opens the way on
  STEP.pick = function (s, ok) {
    var os = $$('[data-o]', s), fbs = $$('[data-fb]', s), rule = $('[data-fb-ok]', s), bal = $('[data-bal]', s), timers = [];
    var lock = function (on) { os.forEach(function (o) { if (!o.classList.contains('is-wrong') && !o.classList.contains('is-right')) o.disabled = on; }); };
    os.forEach(function (o) {
      o.addEventListener('click', function () {
        var i = o.getAttribute('data-o'), right = o.hasAttribute('data-ok');
        fbs.forEach(function (f) { f.hidden = f.getAttribute('data-fb') !== i; });
        os.forEach(function (x) { x.setAttribute('aria-pressed', String(x === o)); });
        if (right) {
          o.classList.add('is-right'); os.forEach(function (x) { if (x !== o) x.disabled = true; });
          if (rule) rule.hidden = false;
          ok(); return;
        }
        o.classList.add('is-wrong'); o.disabled = true;
        var fx = o.getAttribute('data-fx'), el = fx && $('[data-fx-el="' + fx + '"]', s);
        if (!el) { var nx = os.filter(function (x) { return !x.disabled; })[0]; focusIn(nx); return; }
        el.hidden = false; lock(true);
        var lines = $$('[data-seq]', el);
        lines.forEach(function (l, k) {
          var go = function () { l.hidden = false; l.classList.add('is-in'); if (l.hasAttribute('data-to')) runTo(bal, +l.getAttribute('data-to')); };
          if (reduce) go(); else timers.push(setTimeout(go, 500 + k * 1100));
        });
        focusIn($('[data-rewind]', el));
      });
    });
    $$('[data-fx-el]', s).forEach(function (el) {
      $$('[data-seq]', el).forEach(function (l) { l.hidden = true; });
      var rw = $('[data-rewind]', el);
      if (rw) rw.addEventListener('click', function () {
        timers.forEach(clearTimeout); timers = [];
        el.hidden = true; $$('[data-seq]', el).forEach(function (l) { l.hidden = true; l.classList.remove('is-in'); });
        balReset(bal); lock(false);
        fbs.forEach(function (f) { f.hidden = true; });
        focusIn(os.filter(function (x) { return !x.disabled; })[0]);
      });
    });
  };
  // genuine or trap, each card once, the verdict and why
  STEP.sort = function (s, ok) {
    var cards = $$('[data-card]', s), n = 0, dn = $('[data-st-done]', s);
    cards.forEach(function (c) { judge(c, function () { n++; if (n === cards.length) { if (dn) dn.hidden = false; ok(); } }); });
  };
  // tap the levers in a message
  STEP.tap = function (s, ok) {
    var n = $('[data-bq-n]', s), gauge = $('.bq-gauge', s), calm = $('[data-press-calm]', s), dn = $('[data-press-done]', s);
    var flags = $$('[data-flag="1"]', s).length, hit = 0;
    $$('.bq-word', s).forEach(function (b) {
      b.addEventListener('click', function () {
        if (b.getAttribute('data-flag') === '1') {
          if (b.classList.contains('is-hit')) return;
          b.classList.add('is-hit'); b.setAttribute('aria-pressed', 'true'); hit++;
          n.textContent = String(hit); setP(gauge, hit / flags); calm.hidden = true;
          if (hit === flags) { dn.hidden = false; ok(); }
        } else {
          b.classList.remove('is-calm'); void b.offsetWidth; b.classList.add('is-calm');
          if (hit < flags) calm.hidden = false;
        }
      });
    });
  };
  // a scam, then what gives it away
  STEP.pairs = function (s, ok) {
    var n = $('[data-bq-n]', s), no = $('[data-pairs-no]', s), dn = $('[data-pairs-done]', s), a = null, got = 0;
    var as = $$('[data-pa]', s), bs = $$('[data-pb]', s);
    as.forEach(function (b) {
      b.addEventListener('click', function () {
        if (b.classList.contains('is-matched')) return;
        a = b; as.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); no.hidden = true;
      });
    });
    bs.forEach(function (b) {
      b.addEventListener('click', function () {
        if (b.classList.contains('is-matched')) return;
        if (!a) { (as.filter(function (x) { return !x.classList.contains('is-matched'); })[0] || b).focus(); return; }
        if (a.getAttribute('data-pa') === b.getAttribute('data-pb')) {
          [a, b].forEach(function (x) { x.classList.add('is-matched'); x.setAttribute('aria-pressed', 'false'); x.setAttribute('aria-disabled', 'true'); });
          a = null; got++; n.textContent = String(got); no.hidden = true;
          if (got === as.length) { dn.hidden = false; ok(); }
          else { var nx = as.filter(function (x) { return !x.classList.contains('is-matched'); })[0]; if (nx) nx.focus(); }
        } else {
          b.classList.remove('is-no'); void b.offsetWidth; b.classList.add('is-no'); no.hidden = false;
          setTimeout(function () { b.classList.remove('is-no'); }, 700);
        }
      });
    });
  };
  // play the scammer: one line per slot, the pressure adds up, five or more and the message "works"
  STEP.build = function (s, ok) {
    var slots = $$('[data-slot]', s), n = $('[data-bq-n]', s), gauge = $('.bq-gauge', s), more = $('[data-build-more]', s), dn = $('[data-build-done]', s), fin = false;
    var sync = function () {
      var sum = 0, all = true;
      slots.forEach(function (sl) {
        var on = $('[aria-pressed="true"]', sl), out = $('[data-out="' + sl.getAttribute('data-slot') + '"]', s);
        if (on) { sum += +on.getAttribute('data-w'); out.setAttribute('data-i18n', on.getAttribute('data-i18n')); out.textContent = on.textContent; out.classList.add('is-set'); }
        else all = false;
      });
      n.textContent = String(sum); setP(gauge, sum / 6);
      var win5 = all && sum >= 5;
      more.hidden = !all || win5; dn.hidden = !win5;
      if (win5 && !fin) { fin = true; ok(); }
    };
    slots.forEach(function (sl) {
      var os = $$('.bq-slot__o', sl);
      os.forEach(function (o) {
        o.addEventListener('click', function () { os.forEach(function (x) { x.setAttribute('aria-pressed', String(x === o)); }); sync(); });
      });
    });
  };
  // the call: each reply moves to another turn; the trap drains the account, the right path ends it
  STEP.call = function (s, ok) {
    var c = $('[data-call]', s), nodes = $$('[data-node]', s), bal = $('[data-bal]', s), timer = null;
    var node = function (id) { return $('[data-node="' + id + '"]', s); };
    var reset = function () {
      clearTimeout(timer);
      nodes.forEach(function (n) { n.hidden = n.getAttribute('data-node') !== 'n0'; var o = $('.bq-opts', n); if (o) o.hidden = false; });
      $$('[data-mine]', s).forEach(function (m) { m.remove(); });
      $$('.bq-opt', s).forEach(function (o) { o.classList.remove('is-wrong'); o.disabled = false; });
      $$('[data-w]', s).forEach(function (p) { p.hidden = true; });
      c.classList.remove('is-over', 'is-lost'); balReset(bal);
      focusIn($('.bq-opt', node('n0')));
    };
    $$('.bq-opt', s).forEach(function (o) {
      o.addEventListener('click', function () {
        var n = o.closest('[data-node]'), go = o.getAttribute('data-go'), j = o.getAttribute('data-j');
        $$('[data-w]', n).forEach(function (p) { p.hidden = p.getAttribute('data-w') !== j; });
        if (!go) { o.classList.add('is-wrong'); o.disabled = true; return; }
        $$('[data-w]', n).forEach(function (p) { p.hidden = true; });
        $('.bq-opts', n).hidden = true;
        var me = document.createElement('p'); me.className = 'bq-bub bq-bub--me'; me.setAttribute('data-mine', '');
        var sp = document.createElement('span'); sp.setAttribute('data-i18n', o.getAttribute('data-i18n')); sp.textContent = o.textContent; me.appendChild(sp);
        n.appendChild(me);
        var nx = node(go); nx.hidden = false;
        if (go === 'lose') { c.classList.add('is-over', 'is-lost'); timer = setTimeout(function () { runTo(bal, 10500, 1100); }, reduce ? 0 : 350); focusIn($('[data-call-again]', nx)); }
        else if (go === 'win') { c.classList.add('is-over'); ok(); focusIn($('[data-call-again]', nx)); }
        else focusIn($('.bq-opt', nx));
        if (!reduce && nx.scrollIntoView) { var r = nx.getBoundingClientRect(); if (r.bottom > innerHeight) nx.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
      });
    });
    $$('[data-call-again]', s).forEach(function (b) { b.addEventListener('click', reset); });
  };
  // a run: one step at a time; "Continue" opens once the step is done; reaching the question is the exercise done
  ON.run = function (w) {
    var steps = $$('[data-step]', w), dots = $$('.bq-run__dots li', w), next = $('[data-run-next]', w), ix = $('[data-run-i]', w);
    var last = steps.length - 1, cur = 0, done = {}, seen = {}, again = !!st.w[w.getAttribute('data-bq-id')];
    $$('[data-bal]', w).forEach(function (el) { onLang.push(function () { el.textContent = grp(+(el.getAttribute('data-now') || el.getAttribute('data-bal'))); }); });
    var show = function (i, move) {
      cur = i;
      steps.forEach(function (s, k) { s.hidden = k !== i; if (k === i && move && !reduce) { s.classList.remove('is-in'); void s.offsetWidth; s.classList.add('is-in'); } });
      seen[i] = 1;
      dots.forEach(function (d, k) { d.classList.toggle('is-on', k <= i); d.classList.toggle('is-done', !!done[k] && !!seen[k] && k !== i); });
      ix.textContent = String(i + 1);
      next.hidden = i === last; next.disabled = !done[i];
      if (i === last) win(w);
      if (move) {
        var a = $('.bq-st__ask, .bq-st__kick', steps[i]);
        if (a) { a.tabIndex = -1; focusIn(a); }
        var r = w.getBoundingClientRect(); if (r.top < 0) w.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' });
      }
    };
    steps.forEach(function (s, k) {
      var f = STEP[s.getAttribute('data-st')];
      var ok = function () {
        if (done[k]) return; done[k] = 1;
        if (k === cur) { next.disabled = false; dots[k] && dots[k].classList.add('is-done'); bump(next); }
      };
      if (f) f(s, ok); else ok();
      if (again) done[k] = 1;
    });
    next.addEventListener('click', function () { if (done[cur] && cur < last) show(cur + 1, true); });
    // the dots walk back to any step already seen (and forward, once the run was finished before)
    dots.forEach(function (d, k) {
      d.addEventListener('click', function () { if (k <= cur || again) show(k, true); });
    });
    show(0, false);
  };
  // 8.1 the quiz: twelve, one at a time, a streak, the best run kept
  ON.quiz = function (w) {
    var items = $$('[data-qi]', w), start = $('[data-qz-start]', w), run = $('[data-qz-run]', w), end = $('[data-qz-end]', w);
    var next = $('[data-qz-next]', w), gauge = $('.bq-gauge', w), at = 0, score = 0, streak = 0;
    var bests = function () { $$('[data-qz-best]', w).forEach(function (b) { b.textContent = String(st.best | 0); }); };
    var fresh = function (card) {
      $$('[data-vote]', card).forEach(function (x) { x.disabled = false; x.classList.remove('is-right', 'is-wrong'); x.setAttribute('aria-pressed', 'false'); });
      $('[data-verdict]', card).hidden = true; card.classList.remove('is-ok', 'is-miss');
    };
    var show = function (i) {
      items.forEach(function (c, j) { c.hidden = j !== i; });
      $('[data-qz-i]', w).textContent = String(i + 1); setP(gauge, i / items.length); next.hidden = true;
      var b = $('[data-vote]', items[i]); if (b) b.focus();
    };
    items.forEach(function (c) {
      judge(c, function (right) {
        if (right) { score++; streak++; } else streak = 0;
        $('[data-qz-score]', w).textContent = String(score); $('[data-qz-streak]', w).textContent = String(streak);
        $('.bq-quiz__streak', w).classList.toggle('is-hot', streak >= 3);
        setP(gauge, (at + 1) / items.length);
        next.hidden = false; next.focus();
      });
    });
    var go = function () {
      at = 0; score = 0; streak = 0; items.forEach(fresh);
      $('[data-qz-score]', w).textContent = '0'; $('[data-qz-streak]', w).textContent = '0';
      start.hidden = true; end.hidden = true; run.hidden = false; show(0);
    };
    next.addEventListener('click', function () {
      at++;
      if (at < items.length) { show(at); return; }
      run.hidden = true; end.hidden = false;
      $('[data-qz-final]', w).textContent = String(score);
      var tier = score === items.length ? 2 : score >= 8 ? 1 : 0;
      $$('[data-tier]', w).forEach(function (p) { p.hidden = p.getAttribute('data-tier') !== String(tier); });
      if (score > (st.best | 0)) { float($('[data-qz-final]', w), (score - (st.best | 0)) * 10); st.best = score; put(); paint(); }
      bests(); win(w); $('[data-qz-again]', w).focus();
    });
    $('[data-qz-go]', w).addEventListener('click', go);
    $('[data-qz-again]', w).addEventListener('click', go);
    bests();
  };
  // 8.2 the checklist: eight settings, kept on this device
  ON.check = function (w) {
    var cks = $$('[data-ck]', w), ring = $('.bq-ring', w), dn = $('[data-ck-done]', w);
    var sync = function () {
      var on = cks.filter(function (c) { return c.checked; }).length;
      $$('[data-bq-n]', w).forEach(function (x) { x.textContent = String(on); });
      setP(ring, on / cks.length); dn.hidden = on < cks.length;
      st.ck = cks.map(function (c) { return c.checked ? 1 : 0; }); put();
      if (on === cks.length) win(w);
    };
    cks.forEach(function (c, i) { c.checked = !!st.ck[i]; c.addEventListener('change', sync); });
    var on0 = cks.filter(function (c) { return c.checked; }).length;
    $$('[data-bq-n]', w).forEach(function (x) { x.textContent = String(on0); }); setP(ring, on0 / cks.length); dn.hidden = on0 < cks.length;
  };
  // 8.3 the emergency card: typed here, drawn beside, printed alone; kept only if asked
  ON.ecard = function (w) {
    var ins = $$('[data-ec]', w), keep = $('[data-ec-keep]', w);
    var draw = function () {
      var v = {};
      ins.forEach(function (i) { v[i.getAttribute('data-ec')] = i.value.trim(); });
      if (v.last4) v.last4 = v.last4.replace(/\D/g, '').slice(0, 4);
      $$('[data-out]', w).forEach(function (o) { var k = o.getAttribute('data-out'), s = v[k] || ''; o.textContent = s || '—'; o.classList.toggle('is-empty', !s); });
      if (keep.checked) save(CARD, v);
      if (v.bank1 && v.tel1) win(w);
    };
    var kept = keep.checked = !!st.keep;
    if (kept) { var c = load(CARD, {}); ins.forEach(function (i) { var k = i.getAttribute('data-ec'); if (typeof c[k] === 'string') i.value = c[k]; }); }
    $('[data-ec="last4"]', w).addEventListener('input', function (e) { var t = e.target, d = t.value.replace(/\D/g, '').slice(0, 4); if (t.value !== d) t.value = d; });
    ins.forEach(function (i) { i.addEventListener('input', draw); });
    keep.addEventListener('change', function () { st.keep = keep.checked; put(); if (keep.checked) draw(); else { try { localStorage.removeItem(CARD); } catch (e) {} } });
    $('[data-ec-clear]', w).addEventListener('click', function () { ins.forEach(function (i) { i.value = ''; }); try { localStorage.removeItem(CARD); } catch (e) {} draw(); ins[0].focus(); });
    $('[data-ec-print]', w).addEventListener('click', function () {
      var sec = w.closest('section');
      document.body.classList.add('is-print-card'); if (sec) sec.setAttribute('data-print-keep', '');
      var off = function () { document.body.classList.remove('is-print-card'); if (sec) sec.removeAttribute('data-print-keep'); window.removeEventListener('afterprint', off); };
      window.addEventListener('afterprint', off);
      window.print();
      setTimeout(off, 1000);
    });
    draw();
  };

  // a language switch re-reads what this script wrote in figures (app.js sets <html lang>)
  var onLang = [];
  new MutationObserver(function () { onLang.forEach(function (f) { f(); }); paint(); }).observe(root, { attributes: true, attributeFilter: ['lang'] });

  $$('[data-bq]').forEach(function (w) {
    var f = ON[w.getAttribute('data-bq')];
    if (f) f(w);
    if (st.w[w.getAttribute('data-bq-id')]) { var d = $('[data-bq-done]', w); if (d) d.hidden = false; }
  });

  /* ---------------- the hero's words, the arrivals, the pill ---------------- */
  // the title rises a word at a time (split again after each language swap, without the motion)
  var h = $('[data-bq-words]');
  if (h && !reduce) {
    var split = function () {
      var words = h.textContent.trim().split(/\s+/);
      h.setAttribute('aria-label', h.textContent.trim());
      h.textContent = '';
      words.forEach(function (wd, i) {
        var s = document.createElement('span'); s.className = 'bq-wd'; s.setAttribute('aria-hidden', 'true'); s.style.setProperty('--i', String(i));
        s.textContent = wd; h.appendChild(s); if (i < words.length - 1) h.appendChild(document.createTextNode(' '));
      });
      h.classList.add('is-split');
    };
    split();
    new MutationObserver(function () {
      if (h.querySelector('.bq-wd')) return;
      h.classList.remove('is-split'); split();
    }).observe(h, { childList: true });
  }
  if ('IntersectionObserver' in window && !reduce) {
    var arr = $$('.bq-map__m, .bq-mod__head, .bq-hud');
    arr.forEach(function (x) { x.classList.add('bq-io'); });
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }); }, { threshold: .15, rootMargin: '0px 0px -8% 0px' });
    arr.forEach(function (x) { io.observe(x); });
  }
  var pill = $('[data-bq-pill]'), hud = $('[data-bq-hud]');
  if (pill && hud && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { es.forEach(function (e) { pill.hidden = e.isIntersecting || e.boundingClientRect.top > 0; }); }).observe(hud);
  }
  // "jump to the quiz": the module 8 set opens on its first lesson
  $$('[data-bq-go]').forEach(function (a) {
    a.addEventListener('click', function () { var tab = document.getElementById('ls-t-' + a.getAttribute('data-bq-go')); if (tab) tab.click(); });
  });
  // erase: a second press says yes
  var reset = $('[data-bq-reset]'), sure = $('[data-bq-sure]');
  if (reset && sure) {
    reset.addEventListener('click', function () { sure.hidden = false; sure.focus(); });
    sure.addEventListener('click', function () {
      try { [KEY, CARD, 'numidea-lessons-bank1', 'numidea-lessons-bank5', 'numidea-lessons-bank8'].forEach(function (k) { localStorage.removeItem(k); }); } catch (e) {}
      location.reload();
    });
  }
  paint();
})();
