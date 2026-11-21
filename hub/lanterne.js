/* ============================================================
   Numidea Labs — La Librairie Lanterne (hub/lanterne/, 2026-11-21): the
   shelf and the atlas shell, with the field-exercise kit of « Le cours du
   soir » (scratchpad lantern/SPEC.md §2, §3). The page is whole without
   it: French baked, every district laid out in order. Its data is the
   page's #lant-data block (scripts/lib/lanterne.mjs); its words are the
   page's dictionary (hub/lanterne/i18n/<page>.<lang>.js, fetched by the
   head script) and #hub-fr. Built with textContent only. Progress lives on
   this device only, one key per atlas ('numidea-lanterne-<slug>', every
   read and write in try/catch: the page works with no storage at all).
   Motion: transform and opacity, nothing loops, nothing starts alone;
   reduced motion or the Mouvement toggle cuts it all, the pointer
   parallax included (a fine pointer, only while it moves).
   ============================================================ */
(function () {
  'use strict';
  var d = document, root = d.documentElement, body = d.body;
  var $ = function (s, r) { return (r || d).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || d).querySelectorAll(s)); };
  var el = function (tag, cls, text) { var n = d.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
  var DATA = {}, FR = {};
  try { DATA = JSON.parse($('#lant-data').textContent); } catch (e) { return; }
  try { FR = JSON.parse($('#hub-fr').textContent); } catch (e) {}
  var app = !!$('script[src*="app.js"]');
  var lang = window.NUMIDEA_LANG || root.getAttribute('lang') || 'fr';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)');
  var dict = function () { return (window.HUB_I18N && window.HUB_I18N[lang]) || FR; };
  var has = function (k) { return dict()[k] != null || FR[k] != null; };
  var fills = function (s, v) { return v ? String(s).replace(/\{(\w+)\}/g, function (m, k) { return v[k] != null ? v[k] : m; }) : s; };
  var t = function (k, v) { var D = dict(); return fills(D[k] != null ? D[k] : (FR[k] != null ? FR[k] : ''), v); };
  var rules = null;
  var tp = function (base, n, v) { var c = rules.select(n); return t(has(base + '.' + c) ? base + '.' + c : base + '.other', v); };
  var store = {
    get: function (k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
    del: function (k) { try { localStorage.removeItem(k); } catch (e) {} }
  };
  var emit = function (name, detail) { try { d.dispatchEvent(new CustomEvent(name, { detail: detail })); } catch (e) {} };
  var motionOn = function () { return !reduce.matches && !root.classList.contains('motion-off'); };
  var once = function (n, cls, ms) { if (!n || !motionOn()) return; n.classList.remove(cls); void n.offsetWidth; n.classList.add(cls); setTimeout(function () { n.classList.remove(cls); }, ms || 700); };

  /* ---------- progress: one key per atlas, the old manual's stamps migrated once (§3.5) ---------- */
  function progress(b) {
    var S = store.get(b.store);
    if (!S || S.v !== 1 || typeof S.d !== 'object' || !S.d) {
      S = { v: 1, d: {}, last: null };
      var old = b.migrate ? store.get(b.migrate) : null;
      if (Array.isArray(old)) {
        old.forEach(function (id) { if (b.ids.indexOf(id) > -1) S.d[id] = { a: 1, x: 1, m: 1 }; });
        if (Object.keys(S.d).length) store.set(b.store, S);
      }
    }
    return S;
  }
  var isDone = function (S, id) { var r = S && S.d && S.d[id]; return !!(r && r.a && r.x); };
  /* the one resume rule: nothing stored (no answer, no exercise action) -> null; else the last district acted in,
     if it is not done; else the first unfinished (main route first, then the side route); null when all is done */
  function resumeOf(S, acts) {
    if (!S || !S.last || !S.d) return null;
    var all = [], side = [];
    acts.forEach(function (a) { a.districts.forEach(function (id) { all.push(id); if (a.side) side.push(id); }); });
    var main = all.filter(function (id) { return side.indexOf(id) < 0; });
    if (all.indexOf(S.last) > -1 && !isDone(S, S.last)) return S.last;
    return main.filter(function (id) { return !isDone(S, id); })[0] || side.filter(function (id) { return !isDone(S, id); })[0] || null;
  }

  /* ---------- words: without hub/app.js this file applies the dictionary itself ---------- */
  function applyDict() {
    var D = window.HUB_I18N && window.HUB_I18N[lang];
    if (!D) return;
    root.lang = lang; root.dir = lang === 'ar' ? 'rtl' : 'ltr';
    if (!app) {
      $$('[data-i18n]').forEach(function (n) { var v = D[n.getAttribute('data-i18n')]; if (v != null) n.textContent = v; });
      $$('[data-i18n-html]').forEach(function (n) { var v = D[n.getAttribute('data-i18n-html')]; if (v != null) n.innerHTML = v; });
      [['data-i18n-alt', 'alt'], ['data-i18n-aria', 'aria-label'], ['data-i18n-title', 'title'], ['data-i18n-ph', 'placeholder']].forEach(function (p) {
        $$('[' + p[0] + ']').forEach(function (n) { var v = D[n.getAttribute(p[0])]; if (v != null) n.setAttribute(p[1], v); });
      });
      var ui = root.getAttribute('data-ui');
      if (ui && D[ui + '.title']) d.title = D[ui + '.title'];
      var md = $('meta[name="description"]'); if (ui && md && D[ui + '.desc']) md.setAttribute('content', D[ui + '.desc']);
    }
    $$('[data-i18n-label]').forEach(function (n) { var v = D[n.getAttribute('data-i18n-label')]; if (v != null) n.setAttribute('label', v); });
  }
  function ready(cb) {
    var have = function () { return lang === 'fr' || !!(window.HUB_I18N && window.HUB_I18N[lang]); };
    var go = function () {
      if (go.done) return; go.done = true;
      if (!have()) { lang = 'fr'; root.lang = 'fr'; root.dir = 'ltr'; }
      applyDict();
      if (!app) root.removeAttribute('data-i18n-pending');
      cb();
    };
    if (have() || !window.NUMIDEA_DICT) return go();
    window.NUMIDEA_DICT.addEventListener('load', go); window.NUMIDEA_DICT.addEventListener('error', go); setTimeout(go, 1600);
  }
  /* the switch is a link (?lang=): the choice is kept for the next page, and a district stays open across it */
  function langLinks() {
    var q = null; try { q = new URLSearchParams(location.search).get('lang'); } catch (e) {}
    if (q === 'fr' || q === 'en' || q === 'ar') { try { localStorage.setItem('numidea-lang', q); } catch (e) {} }
    $$('[data-lt-lang]').forEach(function (a) {
      a.setAttribute('aria-current', String(a.getAttribute('data-lt-lang') === lang));
      a.addEventListener('click', function () {
        var l = a.getAttribute('data-lt-lang');
        try { localStorage.setItem('numidea-lang', l); } catch (e) {}
        a.setAttribute('href', '?lang=' + l + location.hash);
      });
    });
  }

  /* ---------- the Menu, the Mouvement toggle and the pointer parallax ---------- */
  function chrome() {
    var dlg = $('[data-lt-menu]'), open = $('[data-lt-menu-open]');
    if (dlg && open && dlg.showModal) {
      open.addEventListener('click', function () { dlg.showModal(); var f = $('a', dlg); if (f) f.focus(); });
      $('[data-lt-menu-close]', dlg).addEventListener('click', function () { dlg.close(); });
      dlg.addEventListener('click', function (e) { if (e.target === dlg || e.target.closest('a[href^="#"]')) dlg.close(); });
      dlg.addEventListener('close', function () { open.focus({ preventScroll: true }); });
    }
    var btn = $('[data-lt-motion]');
    try { if (sessionStorage.getItem('numidea-motion') === 'off') root.classList.add('motion-off'); } catch (e) {}
    var reset = function (n) { n.classList.remove('is-tracking'); n.style.setProperty('--px', '0px'); n.style.setProperty('--py', '0px'); };
    var sync = function () {
      if (btn) { btn.hidden = reduce.matches; btn.setAttribute('aria-pressed', String(!root.classList.contains('motion-off'))); }
      if (!motionOn()) $$('[data-lt-parallax]').forEach(reset);
    };
    if (btn) btn.addEventListener('click', function () {
      var off = !root.classList.contains('motion-off');
      root.classList.toggle('motion-off', off);
      try { sessionStorage.setItem('numidea-motion', off ? 'off' : 'on'); } catch (e) {}
      sync();
    });
    if (reduce.addEventListener) reduce.addEventListener('change', sync);
    sync();
    $$('[data-lt-parallax]').forEach(function (n) {
      n.addEventListener('pointermove', function (e) {
        if (!motionOn() || (e.pointerType !== 'mouse' && e.pointerType !== 'pen')) return;
        var r = n.getBoundingClientRect();
        n.classList.add('is-tracking');
        n.style.setProperty('--px', Math.round((e.clientX - r.left - r.width / 2) * 0.07) + 'px');
        n.style.setProperty('--py', Math.round((e.clientY - r.top - r.height / 2) * 0.06) + 'px');
      });
      n.addEventListener('pointerleave', function () { reset(n); });
    });
    d.addEventListener('click', function (e) { if (e.target.closest('[data-lt-print]')) window.print(); });
  }

  /* ================= an atlas ================= */
  function atlas() {
    var A = DATA, S = progress({ store: A.store, migrate: A.migrate, ids: [].concat.apply([], A.acts.map(function (a) { return a.districts; })) });
    var ids = [].concat.apply([], A.acts.map(function (a) { return a.districts; }));
    var cm = $('[data-lt-course]'), course = cm && cm.getAttribute('data-lt-course');
    var sideIds = [].concat.apply([], A.acts.filter(function (a) { return a.side; }).map(function (a) { return a.districts; }));
    var mainIds = ids.filter(function (id) { return sideIds.indexOf(id) < 0; });
    var actOf = function (id) { return A.acts.filter(function (a) { return a.districts.indexOf(id) > -1; })[0]; };
    var K = function (id) { return A.districts[id].k; };
    var name = function (id) { return t(K(id).name); };
    var save = function () { store.set(A.store, S); };
    var rec = function (id) { return S.d[id] || (S.d[id] = {}); };
    var done = function (id) { return isDone(S, id); };
    /* last is written only by an answer or an exercise action, never by a look */
    var touch = function (id) { S.last = id; save(); };
    var chosen = {}; try { chosen = JSON.parse(sessionStorage.getItem(A.store + '-session') || '{}') || {}; } catch (e) {}
    var doneBefore = {}; ids.forEach(function (id) { doneBefore[id] = done(id); });
    var cur = null, live = $('[data-lt-live]');
    var sec = function (id) { return d.getElementById(id); };

    function frontList(dd) {
      var items = [dd.lead, dd.companion].filter(Boolean).map(function (c) { return t('lant.cast.' + c); });
      if (dd.prop) items.push(t('lant.cast.' + dd.prop));
      if (!items.length) return '';
      var list = items.length > 1 ? items.slice(0, -1).join(', ') + t('lant.cast.and') + items[items.length - 1] : items[0];
      return (lang === 'fr' ? ' ; ' : lang === 'ar' ? '؛ ' : '; ') + t('lant.cast.front', { list: list });
    }
    function renderList() {
      ids.forEach(function (id) {
        var b = $('.list__btn[data-lt-go="' + id + '"]'); if (!b) return;
        var r = S.d[id] || {}, st = done(id) ? 'done' : r.a ? 'answered' : '';
        b.setAttribute('data-lt-state', st);
        if (id === cur) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current');
        $('.list__st', b).textContent = st ? ', ' + t('lant.ui.state.' + st) : '';
      });
      $$('[data-lt-act-go]').forEach(function (c) { c.setAttribute('aria-pressed', String(actOf(cur).id === c.getAttribute('data-lt-act-go'))); });
      var sel = $('[data-lt-jump]'); if (sel) sel.value = cur;
      var pos = $('[data-lt-mini-pos]'); if (pos) pos.textContent = (ids.indexOf(cur) + 1) + ' / ' + ids.length;
    }
    function counts() { return { n: mainIds.filter(done).length, N: mainIds.length, m: sideIds.filter(done).length, M: sideIds.length }; }
    function renderHud(roll) {
      var c = counts(), hm = $('[data-lt-hud]'), hs = $('[data-lt-hud-side]');
      hm.textContent = tp('lant.ui.hud', c.n, { n: c.n, N: c.N });
      if (hs) hs.textContent = t('lant.ui.hudSide', { m: c.m, M: c.M });
      if (roll) once(hm, 'is-rolling');
      $('[data-lt-journal-count]').textContent = tp(sideIds.length ? 'lant.ui.journalCount' : 'lant.ui.journalCountMain', c.n, c);
      var all = c.n + c.m;
      $('[data-lt-sac-count]').textContent = tp('lant.ui.sacCount', all, { n: all, N: ids.length });
    }
    function renderCase() {
      $('[data-lt-case-act]').textContent = t(A.k.act[actOf(cur).id]);
      $('[data-lt-case-scene]').textContent = t(K(cur).scene);
      $('[data-lt-case-hand]').textContent = t(K(cur).handoff);
      /* the case strip: « Reprendre » when the resume target is elsewhere; on the target itself, the next district; nothing at the end */
      var r = resumeOf(S, A.acts), rb = $('[data-lt-resume]'), nx = ids[ids.indexOf(cur) + 1];
      var go = r && r !== cur ? r : nx;
      rb.hidden = !go;
      if (go) { rb.textContent = go === r ? t('lant.ui.resume', { q: name(r) }) : t('lant.ui.next', { q: name(nx) }); rb.onclick = function () { show(go, { focus: true, push: true }); }; }
      /* the hero's call opens that same district (its fragment and data-lt-go), not just the list */
      var cta = $('[data-lt-hero-cta]');
      if (cta) {
        cta.firstElementChild.textContent = r ? t('lant.ui.resume', { q: name(r) }) : t('lant.ui.open');
        cta.setAttribute('href', r ? '#' + r : '#quartiers');
        if (r) cta.setAttribute('data-lt-go', r); else cta.removeAttribute('data-lt-go');
      }
    }
    function renderJournal() {
      ids.forEach(function (id) {
        var n = $('[data-lt-note="' + id + '"]'); if (!n) return;
        n.setAttribute('data-done', String(done(id)));
        var dec = $('.note__dec', n), sk = S.d[id] && S.d[id].s;
        if (dec) dec.textContent = t(dec.getAttribute('data-i18n')) + (sk ? ' (' + t('lant.ui.skipNote') + ')' : '');
      });
      var c = counts(), con = $('[data-lt-conclusion]'), fin = c.n === c.N;
      con.textContent = fin ? t(A.k.conclusion) : t('lant.ui.journalIdle');
      con.setAttribute('data-lt-v', fin ? 'done' : '');
    }
    function renderSac() {
      ids.forEach(function (id) { var n = $('[data-lt-ks="' + id + '"]'); if (n) n.setAttribute('data-earned', String(done(id))); });
      /* the set's own reward (the wallpaper, the sticker sheet…) shows once every district is done */
      $$('[data-lt-all]').forEach(function (x) { x.hidden = !ids.every(done); });
    }

    function markAnswer(s, j, right) {
      $$('.ans', s).forEach(function (b) {
        var on = +b.getAttribute('data-lt-ans') === j, m = $('.ans__m', b);
        b.setAttribute('aria-pressed', String(on)); m.textContent = '';
        if (on) { b.setAttribute('data-lt-v', j === right ? 'right' : 'wrong'); var g = el('span', null, j === right ? '✓ ' : '✕ '); g.setAttribute('aria-hidden', 'true'); m.append(g, d.createTextNode(t(j === right ? 'lant.ui.right' : 'lant.ui.wrong'))); }
        else b.removeAttribute('data-lt-v');
      });
    }
    /* after a right answer, until the exercise is cleared: one line says what still counts */
    function nextStep(id) {
      var s = sec(id), r = S.d[id] || {}, on = !!(r.a && !r.x), skip = $('[data-lt-skip]', s);
      $('.sit__next', s).hidden = !on;
      if (on) s.setAttribute('data-next-step', ''); else s.removeAttribute('data-next-step');
      if (skip) skip.hidden = !on;
    }
    function renderDossier(id) {
      var s = sec(id), dd = A.districts[id], act = actOf(id);
      $('[data-lt-dossier-k]', s).textContent = t('lant.ui.dossierK', { act: t(A.k.actShort[act.id]), i: ids.indexOf(id) + 1, N: ids.length });
      $('figure.dio', s).setAttribute('aria-label', t(K(id).alt) + frontList(dd));
      $$('[data-lt-with]', s).forEach(function (n) { n.textContent = t('lant.ui.with', { g: t('lant.cast.' + n.getAttribute('data-lt-with')) }); });
      var fb = $('.sit__fb', s), pick = chosen[id];
      if (pick != null) { markAnswer(s, pick, dd.right); fb.textContent = t(K(id).fs[pick]); fb.setAttribute('data-lt-v', pick === dd.right ? 'right' : 'wrong'); }
      else if (S.d[id] && S.d[id].a) { markAnswer(s, dd.right, dd.right); fb.textContent = t(K(id).fs[dd.right]); fb.setAttribute('data-lt-v', 'right'); }
      else { markAnswer(s, -1, dd.right); fb.textContent = t('lant.ui.idle'); fb.removeAttribute('data-lt-v'); }
      var keep = $('.keep', s);
      keep.hidden = !done(id);
      $('[data-lt-keep]', keep).textContent = t('lant.ui.keep', { s: t(K(id).keep) });
      nextStep(id);
      var badge = $('[data-lt-badge]', s), x = S.d[id] && S.d[id].x;
      badge.textContent = t(x ? 'lant.ui.badgeDone' : 'lant.ui.badgeOpen'); badge.setAttribute('data-lt-v', x ? 'done' : '');
      var nx = ids[ids.indexOf(id) + 1], nb = $('[data-lt-next]', s);
      nb.textContent = nx ? t('lant.ui.next', { q: name(nx) }) : t('lant.ui.first');
      nb.onclick = function () { show(nx || ids[0], { focus: true, push: true }); };
    }
    function answer(id, j) {
      var dd = A.districts[id], s = sec(id), right = j === dd.right, first = !(S.d[id] && S.d[id].a);
      chosen[id] = j; try { sessionStorage.setItem(A.store + '-session', JSON.stringify(chosen)); } catch (e) {}
      markAnswer(s, j, dd.right);
      var fb = $('.sit__fb', s); fb.textContent = t(K(id).fs[j]); fb.setAttribute('data-lt-v', right ? 'right' : 'wrong');
      if (right) rec(id).a = 1;
      touch(id); nextStep(id);
      emit('numidea:lesson', { id: id, right: right, first: first });
      step(id);
    }
    /* an exercise reports here: the kit below, hub/app.js's binders (numidea:exercise), or « Je passe l'exercice » */
    function tell(id, msg, ok, skipped) {
      var s = sec(id); if (!s) return;
      if (msg) $('[data-lt-result]', s).textContent = msg;
      touch(id);
      if (!ok) return;
      var r = rec(id), was = r.x; r.x = 1; if (skipped) r.s = 1; else delete r.s; save(); nextStep(id);
      var badge = $('[data-lt-badge]', s); badge.textContent = t('lant.ui.badgeDone'); badge.setAttribute('data-lt-v', 'done');
      if (!was) emit('numidea:exercise', { atlas: A.slug, id: id, done: true, via: 'lanterne' });
      step(id);
    }
    function step(id) {
      renderList(); renderCase();
      if (done(id) && !doneBefore[id]) {
        doneBefore[id] = true;
        var keep = $('.keep', sec(id));
        keep.hidden = false; once(keep, 'is-stamped');
        once($('.list__btn[data-lt-go="' + id + '"]'), 'is-stamped');
        live.textContent = t('lant.ui.done', { s: t(K(id).keep) });
        renderHud(true); renderJournal(); renderSac();
      }
    }
    function show(id, o) {
      o = o || {};
      if (ids.indexOf(id) < 0) id = ids[0];
      var prev = cur; cur = id;
      $$('.district').forEach(function (s) { s.classList.toggle('is-current', s.id === id); });
      var s = sec(id);
      $$('img[loading=lazy]', s).forEach(function (im) { im.loading = 'eager'; });
      renderDossier(id); renderList(); renderCase(); buildBoard(id);
      if (prev && prev !== id) once(s, 'is-arriving', 800);
      /* the next plate is fetched only on hover or focus of « Quartier suivant » (no idle prefetch) */
      var nb = $('[data-lt-next]', s);
      if (nb && !nb.hasAttribute('data-pf')) {
        nb.setAttribute('data-pf', '');
        var pf = function () { var nx = ids[ids.indexOf(cur) + 1], s2 = nx && sec(nx); if (s2) $$('.dio img[loading=lazy]', s2).forEach(function (im) { im.loading = 'eager'; }); };
        nb.addEventListener('pointerenter', pf); nb.addEventListener('focus', pf);
      }
      var url = location.pathname + location.search + '#' + id;
      if (o.push) history.pushState({ id: id }, '', url); else if (o.replace) history.replaceState({ id: id }, '', url);
      if (o.focus) {
        (matchMedia('(max-width:1010px)').matches ? s : $('#quartiers')).scrollIntoView({ block: 'start', behavior: 'auto' });
        $('.dossier__h', s).focus({ preventScroll: true });
        live.textContent = t('lant.ui.live', { i: ids.indexOf(id) + 1, N: ids.length, q: name(id) });
      }
      emit('numidea:district', { atlas: A.slug, id: id });
      if (course) emit('numidea:stop', { set: course, id: id });
    }

    /* --- the kit: one builder per kind (« Le cours du soir »); each reports through tell() --- */
    function buildBoard(id) {
      var s = sec(id), board = $('.board', s), kind = board.getAttribute('data-lt-ex');
      var res = $('[data-lt-result]', s);
      if (!KIT[kind]) { if (S.d[id] && S.d[id].x && !res.textContent) res.textContent = t('lant.ui.badgeDone') + ' ✓'; return; }
      board.textContent = ''; res.textContent = (S.d[id] && S.d[id].x) ? t('lant.ui.badgeDone') + ' ✓' : t('lant.ui.exIdle');
      var x = function (k, v) { return t(K(id).ex + '.' + k, v); };
      var say = function (msg, ok) { tell(id, msg, ok); };
      var row = function () { var r = el('div', 'krow'); board.appendChild(r); return r; };
      var btn = function (label, fn) { var b = el('button', 'kbtn', label); b.type = 'button'; if (fn) b.addEventListener('click', fn); return b; };
      KIT[kind](board, x, say, { row: row, btn: btn });
    }
    var KIT = {
      compose: function (board, x, say, k) {
        var order = [2, 0, 1], wrap = el('div', 'kfields'); board.appendChild(wrap);
        var sels = [0, 1, 2].map(function (i) {
          var lab = el('label', null, x('slots.' + i)), s = el('select'), o0 = el('option', null, x('pick'));
          o0.value = ''; s.appendChild(o0);
          order.forEach(function (c) { var o = el('option', null, x('choices.' + c)); o.value = String(c); s.appendChild(o); });
          lab.appendChild(s); wrap.appendChild(lab); return s;
        });
        k.row().appendChild(k.btn(x('check'), function () {
          if (sels.some(function (s) { return s.value === ''; })) say(x('empty'));
          else if (sels.every(function (s, i) { return +s.value === i; })) say(x('ok'), true);
          else say(x('bad'));
        }));
      },
      observe: function (board, x, say, k) {
        var list = el('ul', 'kjournal'), got = {};
        var watch = function (key, b) { return function () { if (got[key]) return; got[key] = 1; b.setAttribute('aria-pressed', 'true'); list.appendChild(el('li', null, x(key))); if (Object.keys(got).length === 2) say(x('ok'), true); else say(x('one')); }; };
        var r = k.row(), b1 = k.btn(x('phone')), b2 = k.btn(x('desk'));
        b1.setAttribute('aria-pressed', 'false'); b2.setAttribute('aria-pressed', 'false');
        b1.addEventListener('click', watch('obsPhone', b1)); b2.addEventListener('click', watch('obsDesk', b2));
        r.append(b1, b2); board.appendChild(list);
      },
      /* done = the four controls visited while focus is visible; turning focus on restarts the walk (a blind walk never counts) */
      focus: function (board, x, say, k) {
        /* a form, not a drawing: its fields follow the page's direction, so the Tab walk reads in order in Arabic too */
        var lanes = el('div', 'klanes'), vis = false, pos = -1, ok = false, last = 3;
        var parts = [0, 1, 2, 3].map(function (i) { var p = el('div', 'kland'); p.appendChild(el('span', null, x('fields.' + i))); p.appendChild(el('small')); lanes.appendChild(p); return p; });
        board.appendChild(lanes);
        var paint = function () { parts.forEach(function (p, i) { var on = vis && i === pos; p.setAttribute('data-on', String(on)); $('small', p).textContent = on ? x('here') : ''; }); };
        var r = k.row(), en = k.btn(x('enable'), function () { if (vis) return; vis = true; pos = -1; en.setAttribute('aria-pressed', 'true'); paint(); if (!ok) say(x('enabled')); });
        en.setAttribute('aria-pressed', 'false');
        r.append(en, k.btn(x('step'), function () {
          if (ok) return;
          if (pos < last) pos++;
          paint();
          if (!vis) say(x('hidden'));
          else if (pos === last) { ok = true; say(x('ok'), true); }
          else say(x('at', { f: x('fields.' + pos) }));
        }));
      },
      scrub: function (board, x, say) {
        var tiles = el('div', 'ktiles');
        [['detailed', 'kmark kmark--detailed'], ['compact', 'kmark']].forEach(function (m) { var s = el('div', 'ksample'), mk = el('span', m[1]); mk.setAttribute('aria-hidden', 'true'); s.append(mk, el('strong', null, x(m[0]))); tiles.appendChild(s); });
        board.appendChild(tiles);
        var wrap = el('div', 'krange'), inp = el('input'), lab = el('label', null, x('size') + ' '), out = el('output', null, '120 px');
        inp.type = 'range'; inp.min = 16; inp.max = 120; inp.value = 120; inp.id = 'scrub-' + Math.random().toString(36).slice(2, 7); lab.htmlFor = inp.id;
        wrap.append(lab, inp, out); board.appendChild(wrap);
        inp.addEventListener('input', function () { tiles.style.setProperty('--icon', inp.value + 'px'); out.textContent = inp.value + ' px'; if (+inp.value <= 16) say(x('ok'), true); else say(x('hint')); });
      },
      ab: function (board, x, say, k) {
        var mk = function (who) { var s = el('div', 'ksample'), st = el('span', 'kstate', x('wait')); s.append(el('strong', null, x(who)), st); return { s: s, st: st }; };
        var a = mk('va'), b = mk('vb'), tiles = el('div', 'ktiles'); tiles.append(a.s, b.s); board.appendChild(tiles);
        var ran = {}, r = k.row();
        var fin = function (m) { var both = ran.both && ran.one; say(both ? m : m + ' ' + x('more'), both); };
        var b1 = k.btn(x('both'), function () { ran.both = 1; b1.setAttribute('aria-pressed', 'true'); a.st.textContent = x('conf'); b.st.textContent = x('conf'); fin(x('bothMsg')); });
        var b2 = k.btn(x('one'), function () { ran.one = 1; b2.setAttribute('aria-pressed', 'true'); a.st.textContent = x('conf'); b.st.textContent = x('full'); fin(x('oneMsg')); });
        b1.setAttribute('aria-pressed', 'false'); b2.setAttribute('aria-pressed', 'false');
        r.append(b1, b2);
      },
      machineLaunch: function (board, x, say, k) {
        var rd = el('div', 'kread', x('r0')), waiting = true; board.appendChild(rd);
        k.row().append(
          k.btn(x('stage'), function () { waiting = false; rd.textContent = x('r1'); say(x('stageMsg')); }),
          k.btn(x('promote'), function () { rd.textContent = waiting ? x('r2a') : x('r2b'); say(x('promoteMsg')); }),
          k.btn(x('keepB'), function () { rd.textContent = x('r3'); say(waiting ? x('keepEarly') : x('ok'), !waiting); }));
      },
      funnel: function (board, x, say, k) {
        board.appendChild(el('p', 'ktag', x('fiction')));
        var f = el('div', 'kfunnel'), vals = [100, 40, 32], bs = [];
        vals.forEach(function (v, i) {
          var b = k.btn('', function () { bs.forEach(function (o) { o.setAttribute('aria-pressed', 'false'); }); b.setAttribute('aria-pressed', 'true'); say(x('tips.' + i), i === 1); });
          b.append(el('span', null, x('rows.' + i)), el('span', 'kstate', String(v)));
          b.style.setProperty('--fill', v + '%'); b.setAttribute('aria-pressed', 'false'); bs.push(b); f.appendChild(b);
        });
        board.appendChild(f);
      },
      toggles: function (board, x, say, k) {
        board.appendChild(el('p', 'ktag', x('fiction')));
        var pub = {}, r = k.row(); r.setAttribute('role', 'group'); r.setAttribute('aria-label', x('group'));
        [0, 1, 2, 3].forEach(function (i) {
          var b = k.btn('', function () { pub[i] = !pub[i]; paint(); say(x('pickMsg')); });
          var paint = function () { b.textContent = x('recs.' + i) + ' · ' + x(pub[i] ? 'pub' : 'priv'); b.setAttribute('aria-pressed', String(!!pub[i])); };
          paint(); r.appendChild(b);
        });
        k.row().appendChild(k.btn(x('run'), function () {
          var on = Object.keys(pub).filter(function (i) { return pub[i]; });
          if (!on.length) say(x('none')); else if (on.length === 1 && on[0] === '0') say(x('ok'), true); else say(x('over'));
        }));
      },
      /* Kūro's crossing: the sprite moves by transform over 333 ms (the move curve), never by left */
      path: function (board, x, say, k) {
        var track = el('div', 'kcross'), cat = el('div', 'kcross__cat'), im = el('img');
        track.setAttribute('dir', 'ltr'); track.setAttribute('aria-hidden', 'true');
        im.src = A.cut.kuro; im.alt = ''; cat.appendChild(im); track.appendChild(cat);
        var lanes = el('div', 'klanes'), pos = 0; lanes.setAttribute('dir', 'ltr');
        var parts = [0, 1, 2, 3].map(function (i) { var p = el('div', 'kland'); p.appendChild(el('span', null, x('landings.' + i))); p.appendChild(el('small')); lanes.appendChild(p); return p; });
        var paint = function () { cat.style.setProperty('--step', pos); parts.forEach(function (p, i) { p.setAttribute('data-on', String(i === pos)); $('small', p).textContent = i === pos ? x('here') : ''; }); };
        board.append(track, lanes); paint();
        k.row().append(
          k.btn(x('step'), function () { if (pos >= 3) return; pos++; paint(); say(x('msgs.' + pos), pos === 3); }),
          k.btn(x('jump'), function () { say(x('jumpMsg')); }));
      },
      machineAsh: function (board, x, say, k) {
        var tiles = el('div', 'ktiles'), bk = el('div', 'kread', x('bookOk')), pf = el('div', 'kread', x('proofOk')), off = false;
        tiles.append(bk, pf); board.appendChild(tiles);
        k.row().append(
          k.btn(x('cut'), function () { off = true; pf.textContent = x('proofOff'); say(x('cutMsg')); }),
          k.btn(x('book'), function () { if (off) { bk.textContent = x('bookDone'); say(x('okMsg'), true); } else say(x('normal')); }),
          k.btn(x('plug'), function () { off = false; pf.textContent = x('proofOk'); bk.textContent = x('bookOk'); say(x('plugMsg')); }));
      }
    };
    /* for the exercises others bind (hub/app.js 13, 13b): window.lanterne.tell(atlas, id, message, done) */
    window.lanterne = { tell: function (atlasSlug, id, msg, ok) { if (atlasSlug === A.slug && ids.indexOf(id) > -1) tell(id, msg, ok); },
      open: function (id) { if (ids.indexOf(id) > -1) show(id, { focus: true, push: true }); } };
    /* the courses' own exercises, bound by hub/app.js 13: a [data-pick] board is done once every explanation has been
       opened (the first is open from the start), a [data-calc] board once one of its figures has been changed */
    ids.forEach(function (id) {
      var dd = A.districts[id], board = $('.board', sec(id)), cleared = function () { return !!(S.d[id] && S.d[id].x); };
      if (!board || KIT[dd.ex]) return;
      if (dd.ex === 'pick') {
        var pks = $$('[data-pick]', board), seen = {}, total = 0;
        if (!pks.length) return;
        pks.forEach(function (pk, n) { $$('[data-pick-b]', pk).forEach(function (b, j) { total++; if (!j) seen[n + ':' + b.getAttribute('data-pick-b')] = 1; }); });
        d.addEventListener('numidea:pick', function (e) {
          var n = pks.indexOf(e.detail && e.detail.el); if (n < 0) return;
          seen[n + ':' + e.detail.i] = 1;
          if (cleared()) return;
          var c = Object.keys(seen).length;
          tell(id, c >= total ? t('lant.ui.ex.pickDone') : t('lant.ui.ex.pickLeft', { n: c, N: total }), c >= total);
        });
      } else if (/^calc:/.test(dd.ex)) {
        board.addEventListener('input', function (e) { if (e.target.closest('[data-calc] [data-f]') && !cleared()) tell(id, t('lant.ui.ex.calcDone'), true); });
      } else if (dd.done) {
        /* a client course's control (hub/app.js 13b): the district's condition, read after each press or keystroke:
           touch (an answer given), seen:<rows> (each row on once), sel:/text:/vis:<css>, range:<n> (the slider there) */
        var seenR = {}, conds = dd.done.split('|'), ok = function (c, e) {
          var m = /^(\w+):?(.*)$/.exec(c), k = m[1], v = m[2], q = v && k !== 'range' && $(v, board);
          if (k === 'touch') return !!(e && (e.type === 'click' ? e.target.closest('button,[role=radio]') : String(e.target.value || '').trim()));
          if (k === 'seen') { var rs = $$(v, board); rs.forEach(function (r, n) { if (r.classList.contains('is-on')) seenR[n] = 1; }); return rs.length && Object.keys(seenR).length >= rs.length; }
          if (k === 'range') return !!(e && e.target.type === 'range' && Number(e.target.value) === Number(v));
          return !!q && (k === 'sel' || (k === 'text' ? !!q.textContent.trim() : !q.closest('[hidden]')));
        };
        var chk = function (e) { setTimeout(function () { if (!cleared() && conds.some(function (c) { return ok(c, e); })) tell(id, t('lant.ui.ex.ficheDone'), true); }, 0); };
        ['click', 'input', 'change'].forEach(function (ev) { board.addEventListener(ev, chk); });
      }
    });
    d.addEventListener('numidea:exercise', function (e) { var x = e.detail || {}; if (x.via !== 'lanterne' && x.atlas === A.slug && ids.indexOf(x.id) > -1) tell(x.id, x.msg || '', x.done !== false); });

    d.addEventListener('click', function (e) {
      var go = e.target.closest('[data-lt-go]');
      if (go) { e.preventDefault(); show(go.getAttribute('data-lt-go'), { focus: true, push: true }); return; }
      var an = e.target.closest('[data-lt-ans]');
      if (an) { answer(an.closest('.district').id, +an.getAttribute('data-lt-ans')); return; }
      var st = e.target.closest('[data-lt-step]');
      if (st) { var i = ids.indexOf(cur) + +st.getAttribute('data-lt-step'); if (i >= 0 && i < ids.length) show(ids[i], { focus: true, push: true }); return; }
      var ag = e.target.closest('[data-lt-act-go]');
      if (ag) { var a = A.acts.filter(function (x) { return x.id === ag.getAttribute('data-lt-act-go'); })[0]; show(a.districts[0], { focus: true, push: true }); return; }
      var sk = e.target.closest('[data-lt-skip]');
      if (sk) { var sid = sk.closest('.district').id; tell(sid, t('lant.ui.skipNote'), true, true); renderJournal(); return; }
      var z = e.target.closest('[data-lt-zoom]');
      if (z) { var dlg = $('[data-lt-zoom-dialog]'), im = $('[data-lt-zoom-img]', dlg); im.src = z.getAttribute('data-lt-zoom'); im.alt = $('figure.dio', z.closest('.district')).getAttribute('aria-label'); if (dlg.showModal) dlg.showModal(); }
    });
    var sel = $('[data-lt-jump]'); if (sel) sel.addEventListener('change', function () { show(sel.value, { focus: true, push: true }); });
    window.addEventListener('popstate', function () { var id = location.hash.slice(1); if (ids.indexOf(id) > -1 && id !== cur) show(id, {}); });
    /* the districts not on show still hold the build's French lines (their dossier kicker, guide, next call): each is
       written in the page's language once, so nothing French waits in a hidden district of an English or Arabic page */
    var renderAll = function () { ids.forEach(function (id) { if (id !== cur) renderDossier(id); }); };
    d.addEventListener('numidea:lang', function (e) { lang = (e.detail && e.detail.lang) || lang; rules = new Intl.PluralRules(lang); applyDict(); renderHud(false); renderJournal(); show(cur, {}); renderAll(); });

    var h0 = location.hash.slice(1), start = ids.indexOf(h0) > -1 ? h0 : (resumeOf(S, A.acts) || ids[0]);
    renderHud(false); renderJournal(); renderSac();
    show(start, { replace: ids.indexOf(h0) > -1 });
    renderAll();
    /* a district asked for in the address opens and comes into view, without taking the focus from the page start */
    if (ids.indexOf(h0) > -1) sec(h0).scrollIntoView({ block: 'start' });
  }

  /* ================= the shelf ================= */
  function shelf() {
    var total = 0, earned = 0;
    DATA.books.forEach(function (b) {
      var S = b.live ? progress(b) : null, got = S ? b.ids.filter(function (id) { return isDone(S, id); }) : [];
      total += b.ids.length; earned += got.length;
      var card = $('[data-lt-book="' + b.slug + '"]');
      if (card && b.live) {
        var cnt = $('[data-lt-count]', card); if (cnt) cnt.textContent = tp('lant.shelf.count', b.ids.length, { n: got.length, N: b.ids.length });
        $$('[data-lt-with]', card).forEach(function (n) { n.textContent = t('lant.shelf.with', { g: t('lant.cast.' + n.getAttribute('data-lt-with')) }); });
        var bar = $('[data-lt-bar]', card); if (bar) bar.style.setProperty('--p', String(got.length / b.ids.length));
        var r = resumeOf(S, b.acts), ga = $('[data-lt-book-go]', card);
        if (r && ga) { ga.firstElementChild.textContent = t('lant.shelf.resume', { q: t(b.d[r].name) }); ga.setAttribute('href', b.slug + '.html#' + r); }
        var ks = $('[data-lt-keeps]', card);
        if (got.length && ks) { ks.hidden = false; got.slice(-3).forEach(function (id) { var im = el('img'); im.src = b.d[id].ks; im.alt = t(b.d[id].keep); im.width = 32; im.height = 32; ks.appendChild(im); }); }
      }
      var row = $('[data-lt-pass="' + b.slug + '"]'); if (!row) return;
      $('[data-lt-pass-n]', row).textContent = t('lant.shelf.passRow', { n: got.length, N: b.ids.length });
      got.forEach(function (id) {
        var f = $('[data-lt-pass-ks="' + id + '"]', row); if (!f) return;
        f.setAttribute('data-earned', 'true'); f.textContent = '';
        var im = el('img'); im.src = b.d[id].ks; im.alt = ''; f.appendChild(im);
        var nm = t(b.d[id].keep); f.title = nm; f.appendChild(el('span', 'sr', nm));
      });
    });
    var tot = $('[data-lt-pass-total]'); if (tot) tot.textContent = tp('lant.shelf.passTotal', earned, { n: earned, N: total });
    d.addEventListener('click', function (e) {
      var c = e.target.closest('[data-lt-clear]'); if (!c) return;
      var b = DATA.books.filter(function (x) { return x.slug === c.getAttribute('data-lt-clear'); })[0], p = c.parentNode;
      var keep = [].slice.call(p.childNodes), ask = el('span', null, t('lant.shelf.clearAsk') + ' ');
      var yes = el('button', 'lnk lnk--btn', t('lant.shelf.clearYes')), no = el('button', 'lnk lnk--btn', t('lant.shelf.clearNo'));
      yes.type = no.type = 'button';
      p.textContent = ''; p.append(ask, yes, d.createTextNode(' '), no); yes.focus();
      /* it clears this atlas's key only: never a fiche, never the seals; the old stamps are not read again */
      yes.onclick = function () { store.set(b.store, { v: 1, d: {}, last: null }); location.reload(); };
      no.onclick = function () { p.textContent = ''; keep.forEach(function (n) { p.appendChild(n); }); $('[data-lt-clear]', p).focus(); };
    });
  }

  ready(function () {
    rules = new Intl.PluralRules(lang);
    langLinks(); chrome();
    if (DATA.books) shelf(); else atlas();
    root.setAttribute('data-lt-ready', lang);
  });
})();
