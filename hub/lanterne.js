/* Numidea Labs — La Librairie Lanterne (hub/lanterne/, SPEC §2, §3): the shelf, the atlas shell and the kit of « Le cours
   du soir ». The page is whole without it (French baked). Data: #lant-data; words: hub/lanterne/i18n/<page>.<lang>.js and
   #hub-fr; textContent only. Progress on this device only ('numidea-lanterne-<slug>', every access in try/catch). Motion:
   transform and opacity, nothing loops or starts alone; reduced motion or the Mouvement toggle cuts it all. */
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

  /* ---------- progress: one key per atlas, old stamps migrated once (§3.5) ---------- */
  function progress(b) {
    var S = store.get(b.store);
    if (!S || S.v !== 1 || typeof S.d !== 'object' || !S.d) {
      S = { v: 1, d: {}, last: null };
      [].concat(b.migrate || []).forEach(function (k) {
        var old = store.get(k);
        if (Array.isArray(old)) old.forEach(function (id) { if (b.ids.indexOf(id) > -1) S.d[id] = { a: 1, x: 1, m: 1 }; });
      });
      if (Object.keys(S.d).length) store.set(b.store, S);
    }
    return S;
  }
  var isDone = function (S, id) { var r = S && S.d && S.d[id]; return !!(r && r.a && r.x); };
  /* resume: nothing stored -> null; else the last district acted in if not done; else the first unfinished (main, then side) */
  function resumeOf(S, acts) {
    if (!S || !S.last || !S.d) return null;
    var all = [], side = [];
    acts.forEach(function (a) { a.districts.forEach(function (id) { all.push(id); if (a.side) side.push(id); }); });
    var main = all.filter(function (id) { return side.indexOf(id) < 0; });
    if (all.indexOf(S.last) > -1 && !isDone(S, S.last)) return S.last;
    return main.filter(function (id) { return !isDone(S, id); })[0] || side.filter(function (id) { return !isDone(S, id); })[0] || null;
  }

  /* ---------- words: without hub/app.js, applied here ---------- */
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
    tpls();
  }
  var tpls = function () { $$('[data-lt-tpl]').forEach(function (n) { if (has(n.getAttribute('data-lt-tpl'))) n.textContent = t(n.getAttribute('data-lt-tpl'), { n: n.getAttribute('data-lt-n'), host: n.getAttribute('data-lt-host') }); }); };
  /* a keepsake's picture, or its act's seal (web3 vol. 2: the module's seal, a glyph) */
  var ksNode = function (x, alt) {
    if (x.seal) { var g = el('span', 'ks__seal', x.seal); g.setAttribute('lang', 'ja'); g.setAttribute('aria-hidden', 'true'); return g; }
    var im = el('img'); im.src = x.ks; im.alt = alt || ''; return im;
  };
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
  /* the switch is a link (?lang=): the choice is kept, a district stays open */
  function langLinks() {
    var q = null; try { q = new URLSearchParams(location.search).get('lang'); } catch (e) {}
    if (q === 'fr' || q === 'en' || q === 'ar') { try { localStorage.setItem('numidea-lang', q); } catch (e) {} }
    $$('[data-lt-lang]').forEach(function (a) {
      a.setAttribute('aria-current', String(a.getAttribute('data-lt-lang') === lang));
      a.addEventListener('click', function () {
        var l = a.getAttribute('data-lt-lang');
        try { localStorage.setItem('numidea-lang', l); } catch (e) {}
        a.setAttribute('href', '?lang=' + l + location.hash);
        /* the reader's place (L-24): the last block with an id above the top, and how far into it */
        var at = null, y = scrollY;
        $$('main [id]').forEach(function (n) { if (!/^(SECTION|DIV|LI|ASIDE|NAV)$/.test(n.tagName) || !n.offsetParent) return; var top = n.getBoundingClientRect().top + y; if (top <= y + 80 && (!at || top >= at.top)) at = { id: n.id, top: top }; });
        try { sessionStorage.setItem(PLACE, JSON.stringify({ p: location.pathname, id: at && at.id, d: at ? Math.round(y - at.top) : 0, y: Math.round(y), t: Date.now() })); } catch (e) {}
      });
    });
  }
  var PLACE = 'numidea-lt-place';
  function place() {
    var P = null; try { P = JSON.parse(sessionStorage.getItem(PLACE) || 'null'); sessionStorage.removeItem(PLACE); } catch (e) {}
    if (!P || P.p !== location.pathname || Date.now() - P.t > 30000) return;
    var moved = false, go = function () {
      if (moved) return;
      var n = P.id && d.getElementById(P.id), y = n && n.offsetParent ? n.getBoundingClientRect().top + scrollY + Math.min(P.d, Math.max(0, n.offsetHeight - 80)) : P.y;
      window.scrollTo({ top: y, behavior: 'instant' });
    };
    go();
    ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach(function (ev) { addEventListener(ev, function () { moved = true; }, { once: true, passive: true }); });
    if (d.fonts && d.fonts.ready) d.fonts.ready.then(go);
    addEventListener('load', go); setTimeout(go, 700);
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
    /* the mast's toggle, and the Menu's on phones (L-15) */
    var btns = $$('[data-lt-motion]');
    try { if (sessionStorage.getItem('numidea-motion') === 'off') root.classList.add('motion-off'); } catch (e) {}
    var reset = function (n) { n.classList.remove('is-tracking'); n.style.setProperty('--px', '0px'); n.style.setProperty('--py', '0px'); };
    var sync = function () {
      btns.forEach(function (btn) { btn.hidden = reduce.matches; btn.setAttribute('aria-pressed', String(!root.classList.contains('motion-off'))); });
      if (!motionOn()) $$('[data-lt-parallax]').forEach(reset);
    };
    btns.forEach(function (btn) { btn.addEventListener('click', function () {
      var off = !root.classList.contains('motion-off');
      root.classList.toggle('motion-off', off);
      try { sessionStorage.setItem('numidea-motion', off ? 'off' : 'on'); } catch (e) {}
      sync();
    }); });
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
    d.addEventListener('click', function (e) {
      if (e.target.closest('[data-lt-print]')) { window.print(); return; }
      var pa = e.target.closest('[data-lt-print-act]'), ps = e.target.closest('[data-lt-print-sac]');
      if (!pa && !ps) return;
      /* one act or the carnet alone, then the page as it was */
      root.setAttribute('data-lt-printing', pa ? 'act' : 'sac');
      if (pa) $$('[data-act="' + pa.getAttribute('data-lt-print-act') + '"],[data-lt-acthead="' + pa.getAttribute('data-lt-print-act') + '"]').forEach(function (n) { n.classList.add('is-print'); });
      var undo = function () { root.removeAttribute('data-lt-printing'); $$('.is-print').forEach(function (n) { n.classList.remove('is-print'); }); removeEventListener('afterprint', undo); };
      addEventListener('afterprint', undo); window.print(); setTimeout(undo, 1000);
    });
    /* a reference inside a closed list opens it first */
    d.addEventListener('click', function (e) {
      var a = e.target.closest('a[href^="#"]'); if (!a || a.hasAttribute('data-lt-go')) return;
      var tg = null; try { tg = d.getElementById(decodeURIComponent(a.getAttribute('href').slice(1))); } catch (x) {}
      var dt = tg && (tg.tagName === 'DETAILS' ? tg : tg.closest('details')); if (dt) dt.open = true;
    }, true);
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
    var actDone = function (a) { return a.districts.every(done); };
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
      var sel = $('[data-lt-jump]'); if (sel) { $$('option', sel).forEach(function (o) { var k = K(o.value); o.textContent = t(k.name) + (k.sub ? ' · ' + t(k.sub) : ''); }); sel.value = cur; }
      var pos = $('[data-lt-mini-pos]'); if (pos) pos.textContent = (ids.indexOf(cur) + 1) + ' / ' + ids.length;
    }
    function counts() { return { n: mainIds.filter(done).length, N: mainIds.length, m: sideIds.filter(done).length, M: sideIds.length }; }
    function renderHud(roll) {
      var c = counts(), hm = $('[data-lt-hud]'), hs = $('[data-lt-hud-side]');
      hm.textContent = tp('lant.ui.hud', c.n, { n: c.n, N: c.N });
      if (hs) hs.textContent = t('lant.ui.hudSide', { m: c.m, M: c.M });
      if (roll) once(hm, 'is-rolling');
      $('[data-lt-journal-count]').textContent = tp(sideIds.length ? 'lant.ui.journalCount' : 'lant.ui.journalCountMain', c.n, c);
      var all = c.n + c.m, sealed = A.acts.filter(actDone).length;
      if (A.carnet) $('[data-lt-sac-count]').textContent = tp('lant.ui.sacCount', sealed, { n: sealed, N: A.acts.length });
      else $('[data-lt-sac-count]').textContent = tp('lant.ui.sacCount', all, { n: all, N: ids.length });
    }
    function renderCase() {
      $('[data-lt-case]').hidden = !ids.some(done);
      $('[data-lt-case-act]').textContent = t(A.k.act[actOf(cur).id]);
      $('[data-lt-case-scene]').textContent = t(K(cur).scene);
      $('[data-lt-case-hand]').textContent = t(K(cur).handoff);
      /* « Reprendre » to the resume target elsewhere; else the next district */
      var r = resumeOf(S, A.acts), rb = $('[data-lt-resume]'), nx = ids[ids.indexOf(cur) + 1];
      var go = r && r !== cur ? r : nx;
      rb.hidden = !go;
      if (go) { rb.textContent = go === r ? t('lant.ui.resume', { q: name(r) }) : t('lant.ui.next', { q: name(nx) }); rb.onclick = function () { show(go, { focus: true, push: true }); }; }
      /* the hero's call opens that district */
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
        // a skipped exercise says so
        if (dec) dec.textContent = t(dec.getAttribute('data-i18n')) + (sk ? ' (' + t(typeof sk === 'string' ? sk : 'lant.ui.skipNote') + ')' : '');
      });
      A.acts.forEach(function (a) { var any = a.districts.some(done); $$('[data-lt-jgrp="' + a.id + '"]').forEach(function (n) { n.hidden = !any; }); });
      var left = ids.filter(function (id) { return !done(id); }).length, jl = $('[data-lt-journal-left]');
      if (jl) jl.textContent = left ? tp('lant.ui.journalLeft', left, { n: left }) : '';
      var pr = $('#journal [data-lt-print]'); if (pr) pr.parentNode.hidden = !ids.some(done);
      var c = counts(), con = $('[data-lt-conclusion]'), fin = c.n === c.N;
      con.textContent = fin ? t(A.k.conclusion) : t('lant.ui.journalIdle');
      con.setAttribute('data-lt-v', fin ? 'done' : '');
    }
    function renderSac() {
      ids.forEach(function (id) { var n = $('[data-lt-ks="' + id + '"]'); if (n) n.setAttribute('data-earned', String(done(id))); });
      A.acts.forEach(function (a) { var n = $('[data-lt-sac-left="' + a.id + '"]'), m = a.districts.filter(function (id) { return !done(id); }).length; if (n) n.textContent = m ? tp('lant.ui.sacLeft', m, { n: m }) : ''; });
      /* the carnet: a seal inked once its act is done; the counts */
      if (A.carnet) {
        var left = 0;
        A.acts.forEach(function (a) {
          var n = a.districts.filter(done).length, all = n === a.districts.length, c = $('[data-lt-seal="' + a.id + '"]'), f = $('[data-lt-actfoot="' + a.id + '"] [data-lt-act-done]');
          if (!all) left++;
          if (c) { c.setAttribute('data-earned', String(all)); $('[data-lt-seal-n]', c).textContent = t('web3c.chap.count', { a: n, b: a.districts.length }); }
          if (f) f.hidden = !all;
        });
        var lf = $('[data-lt-carnet-left]'); if (lf) lf.textContent = left ? t('web3c.carnet.left', { n: left }) : '';
      }
      /* the set's reward, once every district is done */
      $$('[data-lt-all]').forEach(function (x) { x.hidden = !ids.every(done); });
    }

    /* once right, the right answer keeps its mark; another press shows its reason « pour voir » (L-21) */
    var peekL = function () { return t('lant.ui.peek') + (lang === 'fr' ? '\u202f: ' : ': '); };
    function markAnswer(s, j, right, locked) {
      $$('.ans', s).forEach(function (b) {
        var i = +b.getAttribute('data-lt-ans'), on = i === j, m = $('.ans__m', b), v = locked ? (i === right ? 'right' : on ? 'peek' : '') : on ? (j === right ? 'right' : 'wrong') : '';
        b.setAttribute('aria-pressed', String(on || (locked && i === right))); m.textContent = '';
        if (v) { b.setAttribute('data-lt-v', v); var g = el('span', null, v === 'right' ? '✓ ' : v === 'wrong' ? '✕ ' : '· '); g.setAttribute('aria-hidden', 'true'); m.append(g, d.createTextNode(t(v === 'right' ? 'lant.ui.right' : v === 'wrong' ? 'lant.ui.wrong' : 'lant.ui.peek'))); }
        else b.removeAttribute('data-lt-v');
      });
    }
    /* after a right answer, until the exercise is cleared: one line says what still counts */
    /* after a right answer (L-08): exercise done, no link; else a link to it, up when it stands above */
    function nextStep(id) {
      var s = sec(id), r = S.d[id] || {}, on = !!(r.a && !r.x), skip = $('[data-lt-skip]', s), nx = $('.sit__next', s);
      var up = !!$('.terrain .sit', s), a = $('a', nx), ok = $('.sit__ok', nx);
      nx.hidden = !r.a; a.hidden = !on; ok.hidden = on;
      a.textContent = t(up ? 'lant.ui.rightUp' : 'lant.ui.rightNext'); a.toggleAttribute('data-up', up);
      ok.textContent = t('lant.ui.rightDone');
      if (on) s.setAttribute('data-next-step', ''); else s.removeAttribute('data-next-step');
      if (skip) skip.hidden = !on;
    }
    function renderDossier(id) {
      var s = sec(id), dd = A.districts[id], act = actOf(id);
      $('[data-lt-dossier-k]', s).textContent = t('lant.ui.dossierK', { act: t(A.k.actShort[act.id]), i: ids.indexOf(id) + 1, N: ids.length });
      $('figure.dio', s).setAttribute('aria-label', t(K(id).alt) + frontList(dd));
      /* a long rule: its first sentence bold (L-05) */
      var rl = $('.rule__t--long', s), rv = rl && !$('b', rl) && rl.textContent, rm = rv && /^.*?[.!?؟](?=\s|$)/.exec(rv);
      if (rm) { rl.textContent = ' ' + rv.slice(rm[0].length).trim(); rl.prepend(el('b', 'rule__lead', rm[0])); }
      $$('[data-lt-with]', s).forEach(function (n) { n.textContent = t('lant.ui.with', { g: t('lant.cast.' + n.getAttribute('data-lt-with')) }); });
      var fb = $('.sit__fb', s), pick = chosen[id];
      if (pick != null) { var lk = !!(S.d[id] && S.d[id].a) && pick !== dd.right; markAnswer(s, pick, dd.right, lk); fb.textContent = (lk ? peekL() : '') + t(K(id).fs[pick]); fb.setAttribute('data-lt-v', lk ? 'peek' : pick === dd.right ? 'right' : 'wrong'); }
      else if (S.d[id] && S.d[id].a) { markAnswer(s, dd.right, dd.right); fb.textContent = t(K(id).fs[dd.right]); fb.setAttribute('data-lt-v', 'right'); }
      else { markAnswer(s, -1, dd.right); fb.textContent = t('lant.ui.idle'); fb.removeAttribute('data-lt-v'); }
      var keep = $('.keep', s);
      keep.hidden = !done(id);
      $('[data-lt-keep]', keep).textContent = t('lant.ui.keep', { s: t(K(id).keep) });
      nextStep(id);
      var badge = $('[data-lt-badge]', s), x = S.d[id] && S.d[id].x;
      if (badge) { badge.textContent = t(x ? 'lant.ui.badgeDone' : 'lant.ui.badgeOpen'); badge.setAttribute('data-lt-v', x ? 'done' : ''); }
      var nx = ids[ids.indexOf(id) + 1], nb = $('[data-lt-next]', s);
      nb.textContent = nx ? t('lant.ui.next', { q: name(nx) }) : t('lant.ui.first');
      nb.onclick = function () { show(nx || ids[0], { focus: true, push: true }); };
    }
    function answer(id, j) {
      var dd = A.districts[id], s = sec(id), right = j === dd.right, first = !(S.d[id] && S.d[id].a), lk = !first && !right;
      chosen[id] = j; try { sessionStorage.setItem(A.store + '-session', JSON.stringify(chosen)); } catch (e) {}
      markAnswer(s, j, dd.right, lk);
      var fb = $('.sit__fb', s); fb.textContent = (lk ? peekL() : '') + t(K(id).fs[j]); fb.setAttribute('data-lt-v', lk ? 'peek' : right ? 'right' : 'wrong');
      /* a reading (« À lire ») is not an exercise: the right answer finishes the district (L-07) */
      if (right) { rec(id).a = 1; if (dd.read) rec(id).x = 1; }
      touch(id); nextStep(id);
      emit('numidea:lesson', { id: id, right: right, first: first });
      step(id);
    }
    /* an exercise reports here (the kit, hub/app.js's binders, « Je passe l'exercice ») */
    function tell(id, msg, ok, skipped) {
      var s = sec(id); if (!s) return;
      if (msg) $('[data-lt-result]', s).textContent = msg;
      touch(id);
      if (!ok) return;
      var r = rec(id), was = r.x; if (was && skipped && !r.s) return;   // an exercise done stays done, not skipped
      r.x = 1; if (skipped) r.s = typeof skipped === 'string' ? skipped : 1; else delete r.s; save(); nextStep(id);
      var badge = $('[data-lt-badge]', s); if (badge) { badge.textContent = t('lant.ui.badgeDone'); badge.setAttribute('data-lt-v', 'done'); }
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
      var aid = actOf(id).id;
      $$('[data-lt-acthead],[data-lt-actfoot]').forEach(function (n) { n.classList.toggle('is-current', (n.getAttribute('data-lt-acthead') || n.getAttribute('data-lt-actfoot')) === aid); });
      // the folded acts: the one on show open
      $$('[data-lt-jmod]').forEach(function (n) { n.open = n.getAttribute('data-lt-jmod') === aid; });
      var s = sec(id);
      $$('img[loading=lazy]', s).forEach(function (im) { im.loading = 'eager'; });
      renderDossier(id); renderList(); renderCase(); buildBoard(id);
      if (prev && prev !== id) once(s, 'is-arriving', 800);
      /* the next plate is fetched on hover or focus of « Quartier suivant » only */
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
      /* done = the four controls visited with focus visible */
      focus: function (board, x, say, k) {
        /* a form: the Tab walk follows the page's direction */
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
      /* Kūro's crossing: by transform, 333 ms */
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
    /* for others' exercises: window.lanterne.tell(atlas, id, message, done) */
    window.lanterne = { tell: function (atlasSlug, id, msg, ok) { if (atlasSlug === A.slug && ids.indexOf(id) > -1) tell(id, msg, ok); },
      open: function (id) { if (ids.indexOf(id) > -1) show(id, { focus: true, push: true }); } };
    /* hub/app.js 13: a [data-pick] reading reports its progress, never the district's end (L-07); a [data-calc] board
       is done once a figure changes */
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
          var c = Object.keys(seen).length;
          tell(id, c >= total ? t('lant.ui.ex.pickDone') : t('lant.ui.ex.pickLeft', { n: c, N: total }), false);
        });
      } else if (/^calc:/.test(dd.ex)) {
        board.addEventListener('input', function (e) { if (e.target.closest('[data-calc] [data-f]') && !cleared()) tell(id, t('lant.ui.ex.calcDone'), true); });
      } else if (dd.done) {
        /* a client course's control (hub/app.js 13b): its condition, after each input */
        var seenR = {}, conds = dd.done.split('|'), ok = function (c, e) {
          var m = /^(\w+):?(.*)$/.exec(c), k = m[1], v = m[2], q = v && k !== 'range' && $(v, board);
          if (k === 'touch') return !!(e && (e.type === 'click' ? e.target.closest('button,[role=radio]') : String(e.target.value || '').trim()));
          if (k === 'seen') { var rs = $$(v, board); rs.forEach(function (r, n) { if (r.classList.contains('is-on')) seenR[n] = 1; }); return rs.length && Object.keys(seenR).length >= rs.length; }
          /* match: every row in its place, not merely placed (« Le jeu juste », Q-10) */
          if (k === 'match') { var ms = $$(v, board); return ms.length > 0 && ms.every(function (r) { return r.classList.contains('is-match'); }); }
          if (k === 'range') return !!(e && e.target.type === 'range' && Number(e.target.value) === Number(v));
          return !!q && (k === 'sel' || (k === 'text' ? !!q.textContent.trim() : !q.closest('[hidden]')));
        };
        var doneL = conds.some(function (c) { return /^match:/.test(c); }) ? 'lant.ui.ex.sort.done' : 'lant.ui.ex.ficheDone';
        var chk = function (e) { setTimeout(function () { if (!cleared() && conds.some(function (c) { return ok(c, e); })) tell(id, t(doneL), true); }, 0); };
        // a row already on counts as seen
        conds.forEach(function (c) { var m = /^seen:(.+)$/.exec(c); if (m) $$(m[1], board).forEach(function (r, n) { if (r.classList.contains('is-on')) seenR[n] = 1; }); });
        ['click', 'input', 'change'].forEach(function (ev) { board.addEventListener(ev, chk); });
      }
    });
    /* a sorting board of the Librairie's own, outside any brief (« Le jeu juste », Q-10, 2026-11-24): [data-bins] without
       data-bf (app.js 13b binds those, web3x.js its [data-bins-x]); the answers are kept for this visit only; a press marks
       the row and says the lesson's reason; the district's condition (done "match:") wants every row in its place */
    $$('.board [data-bins]:not([data-bf])').forEach(function (ol) {
      if (ol.closest('[data-x]')) return;
      var rows = $$('[data-bin-row]', ol), score = $('[data-bin-score]', ol.parentNode), a = rows.map(function () { return -1; });
      var paint = function () {
        var n = 0, any = false;
        rows.forEach(function (row, r) {
          var okB = Number(row.getAttribute('data-bin-ok')), b = a[r], why = $('[data-bin-why]', row);
          $$('[data-bin]', row).forEach(function (x) { x.setAttribute('aria-pressed', String(Number(x.getAttribute('data-bin')) === b)); });
          row.classList.toggle('is-on', b > -1); row.classList.toggle('is-match', b === okB); row.classList.toggle('is-off', b > -1 && b !== okB);
          if (b > -1) { any = true; if (b === okB) n++; }
          var okLab = (($('[data-bin="' + okB + '"]', row) || {}).textContent || '').trim();
          why.textContent = b < 0 ? '' : (b === okB ? t('lant.ui.ex.sort.match') : t('lant.ui.ex.sort.other', { b: okLab })) + ' ' + t(why.getAttribute('data-why-k'));
        });
        if (score) { var sv = any ? t(score.getAttribute('data-score-k'), { n: n, N: rows.length }) : ''; if (score.textContent !== sv) score.textContent = sv; }
      };
      rows.forEach(function (row, r) {
        $$('[data-bin]', row).forEach(function (x) {
          x.disabled = false;
          x.addEventListener('click', function () { a[r] = Number(x.getAttribute('data-bin')); paint(); });
        });
      });
      d.addEventListener('numidea:lang', paint);
    });
    $$('.board [data-bin-score]').forEach(function (sc) {
      var s = sc.closest('.district'), out = $('[data-lt-score]', s), redo = $('[data-lt-redo]', s); if (!out) return;
      var sync = function () { out.textContent = sc.textContent; out.hidden = !sc.textContent.trim(); redo.hidden = !$('[data-bin-row].is-off', s); };
      new MutationObserver(sync).observe(sc, { childList: true, characterData: true, subtree: true });
      s.addEventListener('click', function () { setTimeout(sync, 0); });
      redo.addEventListener('click', function () { var r = $('[data-bin-row].is-off', s); if (!r) return; r.scrollIntoView({ block: 'center' }); var c = $('[data-bin]', r); if (c) c.focus({ preventScroll: true }); });
      sync();
    });
    var heard = function (x) { if (x && x.via !== 'lanterne' && x.atlas === A.slug && ids.indexOf(x.id) > -1) { tell(x.id, x.msg || '', x.done !== false, x.skip || false); if (x.skip) renderJournal(); } };
    d.addEventListener('numidea:exercise', function (e) { heard(e.detail); });

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
    var actHash = function (h) { var m = /^act-(.+?)(-head)?$/.exec(h), a = m && A.acts.filter(function (x) { return x.id === m[1]; })[0]; return a ? a.districts[0] : null; };
    window.addEventListener('popstate', function () { var id = location.hash.slice(1); id = actHash(id) || id; if (ids.indexOf(id) > -1 && id !== cur) show(id, {}); });
    /* hidden districts: once in the page's language */
    var renderAll = function () { ids.forEach(function (id) { if (id !== cur) renderDossier(id); }); };
    d.addEventListener('numidea:lang', function (e) { lang = (e.detail && e.detail.lang) || lang; rules = new Intl.PluralRules(lang); applyDict(); renderHud(false); renderJournal(); show(cur, {}); renderAll(); });

    var h0 = location.hash.slice(1); h0 = actHash(h0) || h0;
    /* a line inside a district opens that district */
    var inD = null;
    if (h0 && ids.indexOf(h0) < 0) { try { var e0 = d.getElementById(decodeURIComponent(h0)), s0 = e0 && e0.closest('.district'); if (s0 && ids.indexOf(s0.id) > -1) inD = s0.id; } catch (e) {} }
    var start = ids.indexOf(h0) > -1 ? h0 : (inD || resumeOf(S, A.acts) || ids[0]);
    renderHud(false); renderJournal(); renderSac();
    show(start, { replace: ids.indexOf(h0) > -1 });
    renderAll();
    /* a district in the address opens and comes into view */
    if (ids.indexOf(h0) > -1) sec(h0).scrollIntoView({ block: 'start' });
    /* any other line in the address comes into view at once (a closed list opens), again once fonts and labs settle,
       unless the visitor has moved */
    else if (h0) {
      var tg = null; try { tg = d.getElementById(decodeURIComponent(h0)); } catch (e) {}
      if (tg && (inD || !tg.closest('.district'))) {
        var dt = tg.closest('details'), moved = false;
        if (dt) dt.open = true;
        var land = function () { if (!moved) tg.scrollIntoView({ block: 'center', behavior: 'instant' }); };
        land();
        ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach(function (ev) { window.addEventListener(ev, function () { moved = true; }, { once: true, passive: true }); });
        if (d.fonts && d.fonts.ready) d.fonts.ready.then(land);
        window.addEventListener('load', land); setTimeout(land, 900); setTimeout(land, 2400);
        d.addEventListener('numidea:labs-live', land);
      }
    }
    chips(); labs();
    // what hub/app.js reported before this script bound
    (window.lanternePending || []).forEach(heard); window.lanternePending = [];
  }

  /* the vendor questions go to the vol. 1 fiche's store, read before each write (where hub/app.js is absent) */
  function chips() {
    var m = $('[data-lt-brief]'); if (!m || app) return;
    var KEY = 'numidea-brief-' + m.getAttribute('data-lt-brief');
    var get = function () { var x = store.get(KEY); return x && x.v === 1 && x.f && typeof x.f === 'object' ? x : { v: 1, f: {} }; };
    $$('[data-bf][data-chips]', m).forEach(function (g) {
      var f = g.getAttribute('data-bf'), bs = $$('[data-v]', g);
      var paint = function () { var a = get().f[f] || []; bs.forEach(function (b) { b.setAttribute('aria-pressed', String(a.indexOf(Number(b.getAttribute('data-v'))) > -1)); }); };
      bs.forEach(function (b) {
        b.disabled = false;
        b.addEventListener('click', function () {
          var st = get(), v = Number(b.getAttribute('data-v')), a = (st.f[f] || []).slice(), i = a.indexOf(v);
          if (i > -1) a.splice(i, 1); else a.push(v);
          a.sort(function (x, y) { return x - y; });
          if (a.length) st.f[f] = a; else delete st.f[f];
          store.set(KEY, st); paint();
        });
      });
      paint();
    });
  }
  /* the labs (hub/web3x.js) load when an exercise comes near or is touched */
  function labs() {
    var L = DATA.labs; if (!L) return;
    var me = $('script[src*="lanterne.js"]'), ver = ((me && /\?v=\d+/.exec(me.getAttribute('src'))) || [''])[0], on = false, io = null;
    var add = function (src, cb) { var x = d.createElement('script'); x.src = src + ver; x.onload = x.onerror = cb || null; d.head.appendChild(x); };
    var go = function () {
      if (on) return; on = true; if (io) io.disconnect();
      var hooks = [];
      d.addEventListener('numidea:lang', function () { hooks.forEach(function (fn) { try { fn(); } catch (e) {} }); });
      var run = function () {
        var X = window.LANT_XFR || {}; for (var k in X) if (FR[k] == null) FR[k] = X[k];
        window.NUMIDEA_W3X = { t: function (k) { return t(k); }, lang: function () { return lang; }, onLang: function (fn) { hooks.push(fn); },
          reduce: function () { return !motionOn(); }, emit: emit, root: $('main'), atlas: DATA.slug, said: function () { return t('lant.ui.ex.labDone'); } };
        add(L.script, function () { setTimeout(function () { emit('numidea:labs-live', {}); }, 60); });
      };
      if (L.fr && !(window.HUB_I18N && window.HUB_I18N[lang] && lang !== 'fr')) add(L.fr, run); else run();
    };
    var near = $$('.terrain');
    if ('IntersectionObserver' in window) { io = new IntersectionObserver(function (es) { if (es.some(function (e) { return e.isIntersecting; })) go(); }, { rootMargin: '300px 0px' }); near.forEach(function (n) { io.observe(n); }); }
    else go();
    ['pointerdown', 'focusin'].forEach(function (ev) { d.addEventListener(ev, function (e) { if (e.target.closest && e.target.closest('.terrain')) go(); }, true); });
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
        // two volumes: the vol. 1 link takes the resume address
        var v1 = $('[data-lt-path="0"]', card); if (r && v1 && !ga) v1.setAttribute('href', b.slug + '.html#' + r);
        var ks = $('[data-lt-keeps]', card);
        if (got.length && ks) { ks.hidden = false; got.slice(-3).forEach(function (id) { var im = ksNode(b.d[id], t(b.d[id].keep)); im.width = 32; im.height = 32; ks.appendChild(im); }); }
      }
      /* a second volume on its first's card: its count, the same resume rule */
      var vl = b.in && b.live && $('[data-lt-vol="' + b.slug + '"]');
      if (vl) {
        var vn = $('[data-lt-count]', vl); if (vn) vn.textContent = tp('lant.shelf.count', b.ids.length, { n: got.length, N: b.ids.length });
        var r2 = resumeOf(S, b.acts); if (r2) vl.setAttribute('href', b.slug + '.html#' + r2);
      }
      var row = $('[data-lt-pass="' + b.slug + '"]'); if (!row) return;
      $('[data-lt-pass-n]', row).textContent = t('lant.shelf.passRow', { n: got.length, N: b.ids.length });
      /* an atlas with nothing won is one row, without its grid or its « Effacer » (L-02) */
      row.toggleAttribute('data-empty', !got.length);
      var pb = $('[data-lt-bar]', row); if (pb) pb.style.setProperty('--p', String(got.length / b.ids.length));
      got.forEach(function (id) {
        var f = $('[data-lt-pass-ks="' + id + '"]', row); if (!f) return;
        f.setAttribute('data-earned', 'true'); f.textContent = '';
        f.appendChild(ksNode(b.d[id], ''));
        var nm = t(b.d[id].keep); f.title = nm; f.appendChild(el('span', 'sr', nm));
      });
    });
    var tot = $('[data-lt-pass-total]'); if (tot) tot.textContent = earned ? tp('lant.shelf.passTotal', earned, { n: earned, N: total }) : t('lant.shelf.passZero', { N: total, A: tot.getAttribute('data-lt-books') });
    /* nothing won: one line; the rows and the print come with the first keepsake */
    $$('[data-lt-pass-list],[data-lt-pass-print]').forEach(function (n) { n.hidden = !earned; });
    /* « Vous venez pour quoi ? » kept in numidea-web3-path */
    d.addEventListener('click', function (e) {
      var w = e.target.closest('[data-lt-path]'); if (!w) return;
      var ps = store.get('numidea-web3-path'); if (!ps || ps.v !== 1) ps = { v: 1 };
      ps.p = Number(w.getAttribute('data-lt-path')); store.set('numidea-web3-path', ps);
    });
    d.addEventListener('click', function (e) {
      var c = e.target.closest('[data-lt-clear]'); if (!c) return;
      var b = DATA.books.filter(function (x) { return x.slug === c.getAttribute('data-lt-clear'); })[0], p = c.parentNode;
      var keep = [].slice.call(p.childNodes), ask = el('span', null, t('lant.shelf.clearAsk') + ' ');
      var yes = el('button', 'lnk lnk--btn', t('lant.shelf.clearYes')), no = el('button', 'lnk lnk--btn', t('lant.shelf.clearNo'));
      yes.type = no.type = 'button';
      p.textContent = ''; p.append(ask, yes, d.createTextNode(' '), no); yes.focus();
      /* this atlas's key only: never a fiche or the seals */
      yes.onclick = function () { store.set(b.store, { v: 1, d: {}, last: null }); location.reload(); };
      no.onclick = function () { p.textContent = ''; keep.forEach(function (n) { p.appendChild(n); }); $('[data-lt-clear]', p).focus(); };
    });
  }

  /* ================= la boîte à outils (2026-11-22) =================
     A partner link (DATA.tools) goes on an app's logo and button (rel="sponsored noopener", the tag, its host) unless the
     France gate is closed (DATA.p2) or the device's time zone (never sent) is excluded or unreadable; the disclosure
     swaps only once one is on. */
  function tools() {
    var tz = '', on = 0;
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) {}
    var inZone = function (list) { return list.some(function (z) { return z.slice(-1) === '/' ? tz.indexOf(z) === 0 : tz === z; }); };
    var gate = !!DATA.p2 && (DATA.p2.lang.indexOf(lang) > -1 || inZone(DATA.p2.tz));
    DATA.tools.forEach(function (a) {
      var card = $('[data-tl-app="' + a.id + '"]');
      if (gate || !card || a.ref.indexOf('https://') !== 0) return;
      if (a.hide.length && (!tz || inZone(a.hide))) { $('[data-tl-note]', card).hidden = false; return; }
      var u = a.ref, x = null;
      try { x = new URL(u); if (a.sub) { x.searchParams.set(a.sub, 'outils-' + a.id + '-' + lang); u = x.href; } } catch (e) {}
      $$('[data-tl-go]', card).forEach(function (l) { l.href = u; l.rel = 'sponsored noopener'; });
      $$('[data-tl-tag]', card).forEach(function (n) { n.hidden = false; });
      if (x) $$('.tl-host', card).forEach(function (n) { n.textContent = x.host.replace(/^www\./, ''); });
      $$('.tl-act__k', card).forEach(function (n) { n.hidden = true; });   /* « Site officiel : » no longer says where it goes */
      on++;
    });
    $$('[data-tl-none]').forEach(function (n) { n.hidden = on > 0; });
    $$('[data-tl-some]').forEach(function (n) { n.hidden = on === 0; });
  }

  ready(function () {
    rules = new Intl.PluralRules(lang);
    langLinks(); chrome();
    if (DATA.tools) tools(); else if (DATA.books) shelf(); else atlas();
    root.setAttribute('data-lt-ready', lang);
    place();
  });
})();
