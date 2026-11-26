/* ============================================================
   Kūro episodes · the player (2026-11-26).
   One engine, many episodes: an episode is a JSON file
   (episodes/<id>.json, format in ../EPISODE-FORMAT.md), this file only
   draws it. No inline script and no inline handlers, so it fits the
   site's CSP (script-src 'self' + hashes). Text goes in with
   textContent only. Nothing is sent anywhere: progress lives in
   localStorage, completion goes through store.done() (the one place
   that talks to the game loop's `numidea-save`).
   Motion: one class per reaction, finite, none under reduced motion.
   ============================================================ */
(function () {
  'use strict';

  var UI = {
    fr: { back: 'Retour à l’atelier', lessons: 'Carnet', kept: 'Leçon gardée', pick: 'Choisis un objet dans la scène.',
          what: 'Que faire ?', replay: 'Rejouer l’épisode', encre: '+{n} Encre', of: '{a} leçons sur {b}',
          locked: 'Leçon manquée : rejoue pour la trouver.', tarifs: 'Voir les tarifs', contact: 'Écrire à Yasser',
          scene: 'La scène', lang: 'Langue', empty: 'Aucune leçon pour l’instant.', resumed: 'Reprise là où tu t’étais arrêté.' },
    en: { back: 'Back to the studio', lessons: 'Notebook', kept: 'Lesson kept', pick: 'Pick an object in the scene.',
          what: 'What now?', replay: 'Play it again', encre: '+{n} Ink', of: '{a} of {b} lessons',
          locked: 'Missed lesson: play again to find it.', tarifs: 'See the prices', contact: 'Write to Yasser',
          scene: 'The scene', lang: 'Language', empty: 'No lessons yet.', resumed: 'Picked up where you left off.' },
    ar: { back: 'العودة إلى الورشة', lessons: 'الدفتر', kept: 'درس محفوظ', pick: 'اختر شيئاً من المشهد.',
          what: 'ماذا تفعل؟', replay: 'أعد الحلقة', encre: '+{n} حبر', of: '{a} من {b} دروس',
          locked: 'درس فائت: أعد اللعب لتجده.', tarifs: 'اطّلع على الأسعار', contact: 'راسل ياسر',
          scene: 'المشهد', lang: 'اللغة', empty: 'لا دروس بعد.', resumed: 'تابعت من حيث توقّفت.' }
  };
  var LINKS = { back: '/hub/lanterne/', tarifs: '/tarifs/', contact: '/#contact' };

  var root = document.getElementById('ep');
  if (!root) return;
  var ART = root.getAttribute('data-art') || 'art/';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var lang = pickLang();
  var ep, st, sel = null;

  /* ---------- storage: the only code that touches localStorage ---------- */
  var store = {
    key: function (id) { return 'numidea-ep-' + id; },
    load: function (id) {
      try { var s = JSON.parse(localStorage.getItem(this.key(id)) || 'null'); if (s && s.v === 1) return s; } catch (e) {}
      return null;
    },
    save: function (id, s) { try { localStorage.setItem(this.key(id), JSON.stringify(s)); } catch (e) {} },
    clear: function (id) { try { localStorage.removeItem(this.key(id)); } catch (e) {} },
    /* completion: the game loop's API when it is there, the shared key otherwise (same shape it reads) */
    done: function (id, reward) {
      var g = window.NUMIDEA_GAME, viaApi = false;
      if (g && typeof g.episodeDone === 'function') { try { g.episodeDone(id, reward && reward.world); viaApi = true; } catch (e) {} }
      /* then make sure `ep` and the world flags are in the shared key, whatever the API did (read-modify-write, idempotent) */
      try {
        var s = JSON.parse(localStorage.getItem('numidea-save') || '{}') || {};
        s.v = s.v || 1; s.ep = s.ep || {}; s.world = s.world || {};
        if (!viaApi && !s.ep[id]) s.ep[id] = { done: true, t: Date.now() };
        var w = (reward && reward.world) || {};
        for (var k in w) if (Object.prototype.hasOwnProperty.call(w, k)) s.world[k] = w[k];
        localStorage.setItem('numidea-save', JSON.stringify(s));
      } catch (e) {}
      try { window.dispatchEvent(new CustomEvent('numidea:gain', { detail: { source: 'episode', id: id, encre: reward && reward.encre } })); } catch (e) {}
    },
    wasDone: function (id) {
      try { var s = JSON.parse(localStorage.getItem('numidea-save') || '{}'); return !!(s && s.ep && s.ep[id] && s.ep[id].done); } catch (e) { return false; }
    }
  };

  /* ---------- measurement: virtual page views, only if the site's tag is on the page ---------- */
  function track(step) {
    var path = '/hub/lanterne/kuro/' + ep.id + '/' + step;
    if (window.dataLayer && typeof window.dataLayer.push === 'function') {
      window.dataLayer.push({ event: 'virtual_page_view', page_path: path, page_title: t(ep.title) + ' · ' + step });
    }
    (window.__epTrack = window.__epTrack || []).push(path); /* for the play-through test */
  }

  /* ---------- helpers ---------- */
  function pickLang() {
    var q = /[?&]lang=(fr|en|ar)\b/.exec(location.search);
    if (q) return q[1];
    try { var l = localStorage.getItem('numidea-lang'); if (l === 'fr' || l === 'en' || l === 'ar') return l; } catch (e) {}
    var h = (document.documentElement.lang || 'fr').slice(0, 2);
    return UI[h] ? h : 'fr';
  }
  function t(o) { return o ? (o[lang] || o.fr || '') : ''; }
  function u(k, vars) { var s = (UI[lang] || UI.fr)[k] || UI.fr[k]; for (var v in vars) s = s.replace('{' + v + '}', vars[v]); return s; }
  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  function $(s) { return root.querySelector(s); }
  /* *word* → <em>word</em>, built with nodes, never innerHTML */
  function rich(node, s) {
    node.textContent = '';
    s.split('*').forEach(function (part, i) { if (!part) return; node.appendChild(i % 2 ? el('em', null, part) : document.createTextNode(part)); });
  }
  function has(f) { return st.flags.indexOf(f) !== -1; }
  function ok(a) {
    return (a.when || []).every(has) && !(a.unless || []).some(has);
  }
  function anim(node, cls) {
    if (reduce || !node) return;
    node.classList.remove(cls); void node.offsetWidth; node.classList.add(cls);
  }
  function src(name) { return ART + name + '.webp'; }

  /* ---------- draw ---------- */
  function build() {
    root.textContent = '';
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.title = t(ep.title) + ' · Numidea';

    var top = el('header', 'ep-top');
    var back = el('a', 'ep-back', u('back')); back.href = LINKS.back; back.setAttribute('data-track', 'exit-back');
    var h = el('div', 'ep-h');
    h.appendChild(el('p', 'ep-kicker', t(ep.kicker)));
    var h1 = el('h1', 'ep-title', t(ep.title)); h1.tabIndex = -1; h.appendChild(h1);
    var langs = el('nav', 'ep-lang'); langs.setAttribute('aria-label', u('lang'));
    [['fr', 'FR'], ['en', 'EN'], ['ar', 'ع']].forEach(function (p) {
      var b = el('button', 'ep-lang__b', p[1]); b.type = 'button'; b.lang = p[0];
      b.setAttribute('aria-pressed', String(p[0] === lang)); b.setAttribute('data-lang', p[0]);
      langs.appendChild(b);
    });
    var book = el('details', 'ep-book');
    var sum = el('summary', 'ep-book__s'); sum.appendChild(el('span', null, u('lessons') + ' '));
    sum.appendChild(el('span', 'ep-book__n', '')); book.appendChild(sum);
    book.appendChild(el('ol', 'ep-book__l'));
    top.appendChild(back); top.appendChild(h); top.appendChild(langs); top.appendChild(book);
    root.appendChild(top);

    var stage = el('section', 'ep-stage'); stage.setAttribute('aria-label', u('scene'));
    var room = el('div', 'ep-room');
    ep.hotspots.forEach(function (hs) {
      if (!hs.art) return;
      var b = el('button', 'ep-hs'); b.type = 'button'; b.setAttribute('data-hs', hs.id);
      b.setAttribute('aria-pressed', 'false');
      var a = hs.at || {}, n = hs.atNarrow || a;
      b.style.setProperty('--x', a.x); b.style.setProperty('--y', a.y); b.style.setProperty('--w', a.w);
      b.style.setProperty('--nx', n.x); b.style.setProperty('--ny', n.y); b.style.setProperty('--nw', n.w);
      var img = el('img'); img.alt = ''; img.src = src(hs.art); img.setAttribute('data-art', '');
      img.decoding = 'async';
      b.appendChild(img);
      b.appendChild(el('span', 'ep-hs__name', t(hs.name)));
      if (hs.id === 'bag') { var k = el('img', 'ep-kuro'); k.alt = ''; k.src = src('kuro-loaf'); k.hidden = true; b.appendChild(k); }
      room.appendChild(b);
    });
    var y = el('button', 'ep-yasser'); y.type = 'button'; y.setAttribute('data-hs', 'yasser'); y.setAttribute('aria-pressed', 'false');
    var yi = el('img', 'ep-yasser__img'); yi.alt = ''; y.appendChild(yi);
    y.appendChild(el('span', 'ep-hs__name', t(hsById('yasser').name)));
    room.appendChild(y);
    stage.appendChild(room);
    root.appendChild(stage);

    var talk = el('section', 'ep-talk');
    var face = el('div', 'ep-face'); var fi = el('img'); fi.alt = ''; face.appendChild(fi);
    var mark = el('span', 'ep-mark'); mark.setAttribute('aria-hidden', 'true'); face.appendChild(mark);
    var kp = el('img', 'ep-face__kuro'); kp.alt = ''; kp.hidden = true; face.appendChild(kp);
    var box = el('div', 'ep-box');
    box.appendChild(el('p', 'ep-who', 'Yasser'));
    var line = el('p', 'ep-line'); line.setAttribute('aria-live', 'polite'); box.appendChild(line);
    var toast = el('p', 'ep-toast'); toast.setAttribute('role', 'status'); box.appendChild(toast);
    talk.appendChild(face); talk.appendChild(box);
    root.appendChild(talk);

    var verbs = el('section', 'ep-verbs'); verbs.setAttribute('aria-labelledby', 'ep-verbs-h');
    var vh = el('h2', 'ep-verbs__h', u('pick')); vh.id = 'ep-verbs-h'; verbs.appendChild(vh);
    verbs.appendChild(el('div', 'ep-verbs__l'));
    root.appendChild(verbs);
  }

  function hsById(id) { for (var i = 0; i < ep.hotspots.length; i++) if (ep.hotspots[i].id === id) return ep.hotspots[i]; return null; }

  function paintBook() {
    var l = $('.ep-book__l'); l.textContent = '';
    $('.ep-book__n').textContent = st.lessons.length + '/' + ep.lessons.length;
    if (!st.lessons.length) { l.appendChild(el('li', 'ep-book__e', u('empty'))); return; }
    ep.lessons.forEach(function (ls) {
      if (st.lessons.indexOf(ls.id) === -1) return;
      var li = el('li'); li.appendChild(el('strong', null, t(ls.tag))); li.appendChild(el('span', null, t(ls.text))); l.appendChild(li);
    });
  }

  function paintScene() {
    root.querySelectorAll('.ep-hs[data-hs]').forEach(function (b) {
      var hs = hsById(b.getAttribute('data-hs'));
      var img = b.querySelector('[data-art]');
      var art = (st.swap[hs.id]) || hs.art;
      if (img.getAttribute('src') !== src(art)) img.src = src(art);
      var k = b.querySelector('.ep-kuro'); if (k) k.hidden = !has('freed');
      b.setAttribute('aria-pressed', String(sel === hs.id));
    });
    $('.ep-yasser').setAttribute('aria-pressed', String(sel === 'yasser'));
  }

  function paintVerbs(focusFirst) {
    var box = $('.ep-verbs__l'); box.textContent = '';
    var vh = $('.ep-verbs__h');
    if (!sel) { vh.textContent = u('pick'); return; }
    var hs = hsById(sel);
    vh.textContent = t(hs.name) + ' · ' + u('what');
    var first = null;
    hs.actions.forEach(function (a) {
      if (!ok(a)) return;
      var b = el('button', 'ep-verb', t(a.label)); b.type = 'button'; b.setAttribute('data-act', a.id);
      if (st.tried.indexOf(hs.id + '.' + a.id) !== -1) b.classList.add('is-tried');
      box.appendChild(b); first = first || b;
    });
    if (focusFirst && first) first.focus();
  }

  function react(r, lineObj) {
    var yi = $('.ep-yasser__img');
    if (r.pose && yi.getAttribute('src') !== src(r.pose)) { yi.src = src(r.pose); anim($('.ep-yasser'), 'kit-slam'); }
    var fi = $('.ep-face img');
    if (r.face) { fi.src = src(r.face); anim($('.ep-face'), 'kit-pop'); }
    var kp = $('.ep-face__kuro');
    if (r.kuro) { kp.src = src('kuro-' + r.kuro); kp.hidden = false; anim(kp, 'kit-pop'); } else kp.hidden = true;
    var m = $('.ep-mark'); m.textContent = r.mark || ''; anim(m, 'kit-stamp');
    rich($('.ep-line'), t(lineObj));
  }

  function act(hsId, actId) {
    var hs = hsById(hsId), a = null;
    hs.actions.forEach(function (x) { if (x.id === actId && ok(x)) a = x; });
    if (!a) return;
    var key = hs.id + '.' + a.id;
    if (st.tried.indexOf(key) === -1) st.tried.push(key);
    (a.set || []).forEach(function (f) { if (!has(f)) { st.flags.push(f); track(f); } });
    if (a.swap) st.swap[hs.id] = a.swap;
    if (a.wrong) track('wrong-' + hs.id + '-' + a.id);
    react(a, a.line);
    var toast = $('.ep-toast'); toast.textContent = '';
    if (a.lesson && st.lessons.indexOf(a.lesson) === -1) {
      st.lessons.push(a.lesson);
      var ls = ep.lessons.filter(function (x) { return x.id === a.lesson; })[0];
      toast.textContent = u('kept') + ' · ' + t(ls.tag);
      anim(toast, 'kit-pop');
      track('lesson-' + a.lesson);
    }
    st.last = { pose: a.pose || st.last.pose, face: a.face, kuro: a.kuro, mark: a.mark, line: a.line };
    paintBook(); paintScene();
    if (a.end) { finish(); return; }
    store.save(ep.id, st);
    paintVerbs(true);
  }

  function finish() {
    var first = !store.wasDone(ep.id);
    store.done(ep.id, ep.reward);
    store.clear(ep.id);
    track('end');
    var dlg = el('section', 'ep-end'); dlg.setAttribute('role', 'dialog'); dlg.setAttribute('aria-modal', 'false');
    dlg.setAttribute('aria-labelledby', 'ep-end-h');
    var h = el('h2', 'ep-end__h', t(ep.end.title)); h.id = 'ep-end-h'; h.tabIndex = -1; dlg.appendChild(h);
    dlg.appendChild(el('p', 'ep-end__line', t(ep.end.line)));
    if (first) dlg.appendChild(el('p', 'ep-end__encre', u('encre', { n: ep.reward.encre })));
    dlg.appendChild(el('p', 'ep-end__of', u('of', { a: st.lessons.length, b: ep.lessons.length })));
    var ol = el('ol', 'ep-end__l');
    ep.lessons.forEach(function (ls) {
      var got = st.lessons.indexOf(ls.id) !== -1;
      var li = el('li', got ? 'is-got' : 'is-miss');
      li.appendChild(el('strong', null, t(ls.tag)));
      li.appendChild(el('span', null, got ? t(ls.text) : u('locked')));
      ol.appendChild(li);
    });
    dlg.appendChild(ol);
    dlg.appendChild(el('p', 'ep-end__hub', t(ep.end.hub)));
    var row = el('div', 'ep-end__row');
    var back = el('a', 'ep-btn ep-btn--main', u('back')); back.href = LINKS.back; back.setAttribute('data-track', 'exit-back');
    var again = el('button', 'ep-btn', u('replay')); again.type = 'button'; again.setAttribute('data-replay', '');
    row.appendChild(back); row.appendChild(again); dlg.appendChild(row);
    var biz = el('p', 'ep-end__biz');
    var a1 = el('a', null, u('tarifs')); a1.href = LINKS.tarifs; a1.setAttribute('data-track', 'exit-tarifs');
    var a2 = el('a', null, u('contact')); a2.href = LINKS.contact; a2.setAttribute('data-track', 'exit-contact');
    biz.appendChild(a1); biz.appendChild(document.createTextNode(' · ')); biz.appendChild(a2);
    dlg.appendChild(biz);
    $('.ep-verbs').hidden = true;
    root.appendChild(dlg);
    anim(dlg, 'kit-pop');
    h.focus();
  }

  function fresh() { return { v: 1, flags: [], lessons: [], tried: [], swap: {}, last: null }; }

  function start(resumed) {
    build();
    var s = ep.start;
    if (!st.last) st.last = { pose: s.pose, face: s.face, mark: s.mark, line: s.line };
    $('.ep-yasser__img').src = src(st.last.pose || s.pose);
    react({ face: st.last.face, kuro: st.last.kuro, mark: st.last.mark }, st.last.line);
    if (resumed) $('.ep-toast').textContent = u('resumed');
    paintBook(); paintScene(); paintVerbs(false);
  }

  /* ---------- events: one delegated listener, no inline handlers ---------- */
  root.addEventListener('click', function (e) {
    var b = e.target.closest('button, a'); if (!b || !root.contains(b)) return;
    if (b.hasAttribute('data-track')) { track(b.getAttribute('data-track')); return; }
    if (b.hasAttribute('data-lang')) {
      lang = b.getAttribute('data-lang');
      try { localStorage.setItem('numidea-lang', lang); } catch (x) {}
      var keepSel = sel; start(false); sel = keepSel; paintScene(); paintVerbs(false);
      root.querySelector('[data-lang="' + lang + '"]').focus();
      return;
    }
    if (b.hasAttribute('data-replay')) { store.clear(ep.id); st = fresh(); sel = null; track('replay'); start(false); $('.ep-title').focus(); return; }
    if (b.hasAttribute('data-act')) { act(sel, b.getAttribute('data-act')); return; }
    if (b.hasAttribute('data-hs')) { sel = b.getAttribute('data-hs'); paintScene(); paintVerbs(true); return; }
  });
  root.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && sel) { var hs = root.querySelector('[data-hs="' + sel + '"]'); sel = null; paintScene(); paintVerbs(false); if (hs) hs.focus(); }
  });

  /* ---------- load ---------- */
  fetch(root.getAttribute('data-src'), { credentials: 'same-origin' })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (data) {
      ep = data;
      var saved = store.load(ep.id);
      st = saved || fresh();
      track(saved ? 'resume' : 'start');
      start(!!saved);
    })
    .catch(function () { root.textContent = 'Episode unavailable.'; });
})();
