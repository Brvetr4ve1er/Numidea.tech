/* ============================================================
   Numidea Labs — the Studio (hub/index.html) and the manual beside it
   (hub/manuel.html: the lessons, the coaching services, the radio; no rig,
   no console, no cases there, and every block below looks for its own
   markup before it starts), vanilla, no deps
   0 · the dictionaries and the language switch
   1 · the sting (00): a first visit's 2.2 s intro, once per session
   2 · the rig (01): Yasser and Kūro, twenty frames
   3 · the pose actors: two-frame figures beside four headings
   4 · reveals, the wedge's cut (02), the speed bar (08)
   5 · process (05): the step at mid-screen
   6 · the estimator (06), on the home's own price model
   7 · brand layers (07) and the FAQ (12)
   8 · the cases' shell (09): tracks, badges, the viewer, and the small
       controls a case may use (see the list there)
   9 · a link to #id lands on its target (the cases below the fold lay out
       late, so the first jump is short)
  10 · the sheet behind the Menu button and the dock (a phone's foot bar)
  11 · the rows that swipe on a phone: their place and their bar
  12 · each case's own faces, as it nears the screen
   The rule of the page: nothing moves for longer than five seconds on its
   own, and nothing loops. Each motion answers an input or plays once when
   its section is first on screen; with prefers-reduced-motion: reduce
   there is no sting, the figures stay on their first frame, the reveals
   are not hidden and every change is a cut. Without this script the page
   is whole: French, every FAQ answer open, every brand layer listed, the
   estimator showing its starting figure.
   ============================================================ */
(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = matchMedia('(hover:hover) and (pointer:fine)').matches;
  var IO = 'IntersectionObserver' in window;
  var rnd = function (a, b) { return a + Math.random() * (b - a); };
  var now = function () { return performance.now(); };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  // what happened, for whoever listens (hub/life.js: Kūro answers a lesson picked or answered, the radio turned on or off)
  var emit = function (name, detail) { try { document.dispatchEvent(new CustomEvent(name, { detail: detail })); } catch (e) {} };
  var once = function (el, threshold, fn, opts) {
    if (!el) return;
    if (!IO) { fn(); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { io.disconnect(); fn(); } });
    }, { threshold: threshold, root: (opts && opts.root) || null });
    io.observe(el);
  };

  /* ---------------- 0 · dictionaries and the language switch ----------------
     French is baked in the markup; the few French strings this script
     writes itself (the rig's lines and moods, the estimator's labels, the
     cases' badges) come in the page's #hub-fr block. hub/i18n.<lang>.js
     holds one language each (hub/i18n.js all three, for the gates) and is
     fetched only for a visitor who wants that language (the head script, or
     the first switch to it). */
  var FR = {};
  try { FR = JSON.parse($('#hub-fr').textContent); } catch (e) {}
  var lang = root.getAttribute('lang') || 'fr';
  var LOCALE = { fr: 'fr_FR', en: 'en_US', ar: 'ar_DZ' };
  var dict = function () { return (window.HUB_I18N && window.HUB_I18N[lang]) || FR; };
  var t = function (k) { var d = dict(); return d[k] != null ? d[k] : (FR[k] != null ? FR[k] : ''); };
  var onLang = [];

  function apply(l) {
    var d = window.HUB_I18N && window.HUB_I18N[l];
    if (!d) return;
    lang = l;
    root.lang = l; root.dir = l === 'ar' ? 'rtl' : 'ltr';
    $$('[data-i18n]').forEach(function (n) { var v = d[n.getAttribute('data-i18n')]; if (v != null) n.textContent = v; });
    $$('[data-i18n-html]').forEach(function (n) { var v = d[n.getAttribute('data-i18n-html')]; if (v != null) n.innerHTML = v; });
    $$('[data-i18n-alt]').forEach(function (n) { var v = d[n.getAttribute('data-i18n-alt')]; if (v != null) n.alt = v; });
    $$('[data-i18n-aria]').forEach(function (n) { var v = d[n.getAttribute('data-i18n-aria')]; if (v != null) n.setAttribute('aria-label', v); });
    $$('[data-i18n-title]').forEach(function (n) { var v = d[n.getAttribute('data-i18n-title')]; if (v != null) n.title = v; });
    // the title and the description are the page's own: the manual names its keys on <html data-ui="manual.ui">
    var ui = root.getAttribute('data-ui') || 'ui';
    if (d[ui + '.title']) document.title = d[ui + '.title'];
    var md = $('meta[name="description"]'); if (md && d[ui + '.desc']) md.setAttribute('content', d[ui + '.desc']);
    var ol = $('meta[property="og:locale"]'); if (ol) ol.setAttribute('content', LOCALE[l]);
    $$('.st-lang button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === l)); });
    onLang.forEach(function (fn) { fn(l); });
  }
  // a shared ?lang= link stays truthful after a switch, and the canonical with it
  function syncUrl(l) {
    try {
      var u = new URL(location.href);
      if (!u.searchParams.has('lang')) return;
      if (l === 'fr') u.searchParams.delete('lang'); else u.searchParams.set('lang', l);
      history.replaceState(history.state, '', u);
      var c = $('link[rel="canonical"]'), og = $('meta[property="og:url"]');
      if (c) { var cu = new URL(c.href); if (l === 'fr') cu.searchParams.delete('lang'); else cu.searchParams.set('lang', l); c.href = cu.href; if (og) og.setAttribute('content', cu.href); }
    } catch (e) {}
  }
  var loading = null;
  function withDicts(l, fn) {
    if (window.HUB_I18N && window.HUB_I18N[l]) { fn(); return; }
    if (loading && loading.l === l) { loading.push(fn); return; }
    loading = [fn]; loading.l = l;
    var busy = $$('.st-lang button');
    busy.forEach(function (b) { b.setAttribute('aria-busy', 'true'); });
    var s = document.createElement('script');
    var me = $('script[src*="app.js"]');
    s.src = 'i18n.' + l + '.js' + ((me && /\?v=\d+/.exec(me.getAttribute('src'))) || [''])[0];
    s.onload = s.onerror = function () { busy.forEach(function (b) { b.removeAttribute('aria-busy'); }); var q = loading; loading = null; if (window.HUB_I18N && window.HUB_I18N[l]) q.forEach(function (f) { f(); }); };
    document.head.appendChild(s);
  }
  $$('.st-lang button').forEach(function (b) {
    b.addEventListener('click', function () {
      var l = b.getAttribute('data-lang');
      try { localStorage.setItem('numidea-lang', l); } catch (e) {}
      withDicts(l, function () { apply(l); syncUrl(l); });
    });
  });
  // the head script chose EN or AR and fetched the dictionary: apply it, release the paint
  var start = window.NUMIDEA_LANG || 'fr';
  var have = function () { return window.HUB_I18N && window.HUB_I18N[start]; };
  if (start === 'fr' || have()) { if (start !== 'fr') apply(start); root.removeAttribute('data-i18n-pending'); }
  else if (window.NUMIDEA_DICT) {
    // the dictionary is on its way (async): the page stays unpainted until it lands, or the head's 1.5 s backstop
    var landed = function () {
      if (have()) apply(start); else { root.lang = 'fr'; root.dir = 'ltr'; lang = 'fr'; }
      root.removeAttribute('data-i18n-pending');
    };
    window.NUMIDEA_DICT.addEventListener('load', landed); window.NUMIDEA_DICT.addEventListener('error', landed);
  } else { root.lang = 'fr'; root.dir = 'ltr'; lang = 'fr'; root.removeAttribute('data-i18n-pending'); }
  // back from the browser's cache after a switch elsewhere: take the stored choice again
  window.addEventListener('pageshow', function (e) {
    if (!e.persisted) return;
    var l = null;
    try { l = localStorage.getItem('numidea-lang'); } catch (x) {}
    if (l && /^(fr|en|ar)$/.test(l) && l !== lang) withDicts(l, function () { apply(l); });
  });

  /* ---------------- 1 · the sting ----------------
     Shown once per session (sessionStorage 'numidea-sting'), only with
     scripts on and without reduced motion; never in the HTML, so a reader
     without scripts and every crawler get the page as it is. Rebuilt around
     the characters (2026-11-15): Yasser in three rig frames on the red
     block (base, up, smirk: the hero's own files, already in the page),
     Kuro's eyes in a night cut, the red stamp, then the paper wipes up from
     1.667 s. Its timeline is CSS (style.css, 00). A click anywhere, Esc or
     any key jumps to the wipe; whatever happens it is gone by 2.6 s. The
     rig waits for it. The old still ('sting-169.webp' and 'sting-916.webp' in
     img/motion) is no longer loaded here; it stays as the source of the
     social card (scripts/build-og.mjs), and naming it keeps the build's
     unreferenced-file check quiet. */
  var stingDone = [];
  var stinging = false;
  (function () {
    var seen = null;
    try { seen = sessionStorage.getItem('numidea-sting'); } catch (e) { seen = '1'; }
    // a slow or saving connection goes straight to the page: the frames (about 75 kB) would arrive after the wipe
    var cn = navigator.connection;
    // (and only where the rig is: the manual page opens without it)
    if (!$('#rig') || reduce || seen || (cn && (cn.saveData || /(^|-)[23]g$/.test(cn.effectiveType || '')))) return;
    try { sessionStorage.setItem('numidea-sting', '1'); } catch (e) {}
    stinging = true;
    var el = document.createElement('div');
    el.className = 'st-sting';
    el.setAttribute('role', 'presentation');
    var letters = function (w, from) { return w.split('').map(function (c, i) { return '<span class="st-sting__g" style="--i:' + (from + i) + '">' + c + '</span>'; }).join(''); };
    var yf = function (k, f) { return '<img class="st-sting__y st-sting__y--' + k + '" alt="" width="501" height="565" decoding="async" src="bible/art/rig-y-' + f + '.webp">'; };
    el.innerHTML = '<span class="st-sting__bar st-sting__bar--t" aria-hidden="true"></span>'
      + '<span class="st-sting__bar st-sting__bar--b" aria-hidden="true"><span class="st-sting__hud"></span></span>'
      + '<span class="st-sting__block" aria-hidden="true">' + yf('a', 'base') + yf('b', 'up') + yf('c', 'smirk') + '</span>'
      + '<span class="st-sting__word" aria-hidden="true" dir="ltr"><span>' + letters('NUMIDEA', 0) + '</span><span class="st-sting__labs"><span>' + letters('LABS', 0) + '</span></span></span>'
      + '<span class="st-sting__eyes" aria-hidden="true"><img alt="" width="360" height="294" decoding="async" src="bible/art/rig-k-wide.webp"></span>'
      + '<span class="st-sting__stamp" aria-hidden="true" lang="ja">夜</span>'
      + '<span class="st-sting__wipe" aria-hidden="true"></span>'
      + '<button type="button" class="st-sting__skip"><b aria-hidden="true">跳</b><span aria-hidden="true"></span></button>';
    $('.st-sting__hud', el).textContent = t('sting.hud');
    $('.st-sting__skip span', el).textContent = t('sting.skip');
    $('.st-sting__skip', el).setAttribute('aria-label', t('sting.skipL'));
    root.classList.add('st-stinging');
    document.body.appendChild(el);
    var t0 = now(), ended = false;
    var end = function () {
      if (ended) return; ended = true; stinging = false;
      el.remove(); root.classList.remove('st-stinging');
      document.removeEventListener('keydown', skip, true);
      stingDone.forEach(function (fn) { fn(); });
    };
    var skip = function (e) {
      if (e && e.type === 'keydown' && (e.key === 'Tab' || e.key === 'Shift')) return;
      if (now() - t0 < 1667) el.classList.add('is-skip');
    };
    el.addEventListener('click', skip);
    document.addEventListener('keydown', skip, true);
    $('.st-sting__wipe', el).addEventListener('animationend', end);
    setTimeout(end, 2600);
    // (no focus is moved onto it: the page's own skip link stays the first Tab stop; any key skips the sting)
  })();

  /* ---------------- 1b · the paper wipe between pages ----------------
     0.4 s, the sting's paper and rule, on a same-origin navigation (a link
     to another page of the site, the main buttons included). Never with a
     modifier key, a middle or right click, target="_blank", a download, a
     hash-only link (same page), a file that is not a page, or with reduced
     motion (nothing is built). The overlay is taken away on pageshow, so a
     page restored from the back/forward cache never sticks under it; a 2 s
     backstop does the same if the navigation never leaves. */
  var pgwipe = null;
  var wipeOff = function () { if (pgwipe) { pgwipe.classList.remove('is-on'); pgwipe.remove(); pgwipe = null; } };
  window.addEventListener('pageshow', wipeOff);
  if (!reduce) document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return;
    var u;
    try { u = new URL(a.href, location.href); } catch (x) { return; }
    if (u.origin !== location.origin || !/^https?:$/.test(u.protocol)) return;
    if (u.pathname === location.pathname && u.search === location.search) return;
    if (!/(\/|\.html?)$/.test(u.pathname)) return;
    if (pgwipe) return;
    e.preventDefault();
    pgwipe = document.createElement('div');
    pgwipe.className = 'st-pgwipe';
    pgwipe.setAttribute('aria-hidden', 'true');
    pgwipe.innerHTML = '<span class="st-pgwipe__seal" lang="ja">夜</span>';
    document.body.appendChild(pgwipe);
    void pgwipe.offsetWidth;
    pgwipe.classList.add('is-on');
    setTimeout(function () { location.href = a.href; }, 400);
    setTimeout(wipeOff, 2000);
  });
  var afterSting = function (fn) { if (stinging) stingDone.push(fn); else fn(); };

  /* ---------------- 2 · the rig ----------------
     The character bible's rig (hub/bible/app.js 1), with the Studio's
     lines and moods. Frames: <img data-yf> and <img data-kf>, stacked; only
     opacity flips (hard cuts). The two base frames are in the page; the
     eighteen others wait in <template id="rigFrames"> and come in once the
     hero is on screen. The loop (tick) runs while now < S.until; every
     interaction extends S.until by at most WINDOW ms, and in its last EASE
     ms the breath, the lean and the gaze settle and he rests on his base
     frame. Then no frame is requested. Inside a window, and only there: the
     steam over the cup, one glasses push before a line (35 % of lines) or,
     when the pointer alone opened the window, one sip; Kūro's wide eyes on a
     fast scroll. One yawn per visit, in a window the pointer opened and
     after it has been still for 2.3 s (both of them, 1.5 s, done before the
     window's last 700 ms). Nothing is scheduled outside a window (no idle
     loop); reduced motion keeps none of them. A line is typed at 38 ms a
     character in the bubble and written whole in the live region. */
  var WINDOW = 5000, EASE = 700;
  var panel = $('#rig');
  if (panel) (function () {
    var yRoot = $('.st-rig__y', panel), kRoot = $('.st-rig__k', panel);
    var yBody = $('[data-ybody]', panel), kBody = $('[data-kbody]', panel);
    var bubble = $('[data-ybubble]', panel), btext = $('[data-ytext]', panel);
    var wisps = $$('[data-wisp]', panel);
    var moodEl = $('[data-mood]', panel), liveEl = $('[data-live]', panel), saidEl = $('[data-rig-said]', panel);
    var tpl = $('#rigFrames');
    var Y = {}, K = {};
    var collect = function () {
      $$('[data-yf]', yRoot).forEach(function (el) { Y[el.getAttribute('data-yf')] = el; });
      $$('[data-kf]', kRoot).forEach(function (el) { K[el.getAttribute('data-kf')] = el; });
    };
    collect();
    var framesIn = false;
    // a screen without a hover brings the eighteen frames (about 470 kB) in on the first touch, key or focus, not on view
    var touched = finePointer;
    var loadFrames = function () {
      if (framesIn || !touched || !tpl || !('content' in tpl)) return;
      framesIn = true;
      var frag = tpl.content.cloneNode(true);
      $$('[data-yf]', frag).forEach(function (el) { el.setAttribute('decoding', 'async'); yBody.insertBefore(el, yBody.firstChild); });
      $$('[data-kf]', frag).forEach(function (el) { el.setAttribute('decoding', 'async'); kBody.insertBefore(el, kBody.firstChild); });
      collect();
      // decoded before the first flip to it: a frame that is complete but not decoded showed a blank figure once
      [Y, K].forEach(function (m) { Object.keys(m).forEach(function (k) { var el = m[k]; if (el.decode) el.decode().catch(function () {}); }); });
    };
    var ready = function (img) { return img && img.complete && img.naturalWidth > 0; };
    var lines = function () { var a = []; for (var i = 0; t('rig.lines.' + i); i++) a.push(t('rig.lines.' + i)); return a; };
    if (reduce && liveEl) { liveEl.setAttribute('data-i18n', 'hero.still'); liveEl.textContent = t('hero.still'); }

    var t0 = now();
    var S = {
      cur: 'base', kcur: 'base', hold: null, khold: null, blinkAt: null, kBlinkAt: null,
      nextBlink: t0 + 1600, kNext: t0 + rnd(2500, 5000), kEar: t0 + rnd(2500, 4500),
      mx: .6, my: .5, gaze: 'base', gazeCand: 'base', gazeSince: t0, kgaze: 'base', kgazeAt: 0,
      squash: 0, ksquash: 0, mood: 'base', raf: 0, until: 0, lastClick: -1e9, lean: 0, say: null, lineIx: 0,
      next: null, nextSip: 0, lastY: 0, lastYt: 0, lastMove: 0, yawned: false
    };
    var flip = function (map, key, n) {
      if (!map[n] || !ready(map[n])) n = 'base';
      if (S[key] === n) return;
      map[S[key]].style.opacity = 0; map[n].style.opacity = 1; S[key] = n;
    };
    var emit = function (m) {
      if (m === S.mood || !moodEl) return;
      S.mood = m; moodEl.setAttribute('data-i18n', 'rig.mood.' + m); moodEl.textContent = t('rig.mood.' + m) || t('rig.mood.base');
    };
    var gazeTarget = function () { if (S.my < .16) return 'up'; if (S.mx < .33) return 'glance'; if (S.mx > .82) return 'glance-r'; return 'base'; };
    var keep = function (ms) {
      loadFrames();
      S.until = Math.max(S.until, now() + Math.min(ms || WINDOW, WINDOW));
      if (!S.raf) S.raf = requestAnimationFrame(tick);
    };
    var said = function (text) {
      if (!saidEl) return;
      saidEl.textContent = t('rig.said') + ' ' + text;
    };
    /* a line, at t1 (default now). With glass, he pushes his glasses up for
       750 ms from t1 and the line starts after it: the one extra a window
       may hold (sip is the other, and only when no line is coming) */
    var startSay = function (text, at, glass) {
      if (!bubble || !text) return;
      var n = now(), t1 = at || n, t0 = t1;
      S.next = null;
      if (glass && !reduce) { t0 = t1 + 750; S.next = { name: 'glasses', at: t1, until: t0 }; }
      S.say = { text: text, t0: t0, shown: 0, done: 0, flapAt: 0, flap: 'base' };
      btext.textContent = reduce ? text : ''; bubble.classList.add('on');
      if (reduce) { said(text); S.say.done = n; }
      keep(t0 - n + (reduce ? 0 : text.length * 38) + 2200);
    };
    var endSay = function () { S.say = null; if (bubble) bubble.classList.remove('on'); };

    function tick(n) {
      var left = S.until - n;
      if (left <= 0) { settle(); return; }
      var fade = Math.min(1, left / EASE), live = !reduce;
      if (S.hold && n >= S.hold.until) S.hold = null;
      if (S.khold && n >= S.khold.until) S.khold = null;
      if (S.next && n >= S.next.at) { if (n < S.next.until) S.hold = S.next; S.next = null; }
      if (fade < 1) { S.mx += (.6 - S.mx) * .12; S.my += (.5 - S.my) * .12; }
      var gt = gazeTarget();
      if (gt !== S.gazeCand) { S.gazeCand = gt; S.gazeSince = n; }
      if (n - S.gazeSince > 110) S.gaze = S.gazeCand;
      var mouth = null;
      if (S.say && n >= S.say.t0) {
        var sy = S.say, len = sy.text.length, k = reduce ? len : Math.min(len, Math.floor((n - sy.t0) / 38));
        if (k !== sy.shown) { sy.shown = k; btext.textContent = sy.text.slice(0, k); }
        if (k < len) {
          var ch = sy.text[k - 1] || '';
          if (/[.,?!…،؟]/.test(ch)) mouth = 'base';
          else { if (n > sy.flapAt) { sy.flap = ['talk-a', 'talk-b', 'talk-a', 'base'][Math.floor(Math.random() * 4)]; sy.flapAt = n + rnd(70, 120); } mouth = sy.flap; }
        } else { if (!sy.done) { sy.done = n; said(sy.text); } if (n - sy.done > 2000) endSay(); }
      }
      // still for 2.3 s inside a window the pointer opened: one yawn, once, for both (never while a line or another pose is on)
      if (live && !S.yawned && S.lastMove && !S.say && !S.hold && !S.khold && !S.next && fade === 1 && n - S.lastMove > 2300 && left > 2400) {
        S.yawned = true; S.hold = { name: 'yawn', until: n + 1500 }; S.khold = { name: 'yawn', until: n + 1500 };
      }
      var mood = S.hold ? S.hold.name : mouth || (S.say ? 'base' : S.gaze);
      emit(S.say ? 'talk' : (mood === 'talk-a' || mood === 'talk-b') ? 'talk' : mood);
      if (live && !S.hold && !mouth && n > S.nextBlink && fade === 1) { S.blinkAt = n; S.nextBlink = n + (Math.random() < .2 ? 260 : rnd(2600, 6000)); }
      var f = mood, blinkable = ['sip', 'yawn', 'laugh', 'glasses'].indexOf(mood) < 0;
      if (S.blinkAt != null && blinkable) { var bt = n - S.blinkAt; f = bt < 45 ? 'half' : bt < 135 ? 'blink' : bt < 180 ? 'half' : (S.blinkAt = null, mood); }
      else if (!blinkable) S.blinkAt = null;
      flip(Y, 'cur', f);
      var kt = S.say ? 'right' : S.mx < .33 ? 'left' : S.mx > .82 ? 'right' : 'base';
      if (kt !== S.kgaze && n - S.kgazeAt > 320) { S.kgaze = kt; S.kgazeAt = n; }
      if (live && !S.khold && n > S.kNext && fade === 1) { S.kBlinkAt = n; S.kNext = n + rnd(3500, 7500); }
      if (live && !S.khold && n > S.kEar && fade === 1) { S.khold = { name: 'ear', until: n + 200 }; S.kEar = n + rnd(2500, 4500); }
      var kf = S.khold ? S.khold.name : S.kgaze;
      if (S.kBlinkAt != null && !S.khold) { if (n - S.kBlinkAt < 170) kf = 'blink'; else S.kBlinkAt = null; }
      flip(K, 'kcur', kf);
      var br = live ? Math.sin(n / 4200 * Math.PI * 2) * fade : 0;
      var leanT = live ? (S.mx - .6) * 1.6 * fade : 0;
      S.lean += (leanT - S.lean) * .06;
      if (yBody) yBody.style.transform = n < S.squash ? 'scale(1.05,.95)' : 'rotate(' + (S.lean * .6).toFixed(3) + 'deg) translateX(' + (S.lean * 3).toFixed(2) + 'px) scale(' + (1 - br * .003).toFixed(4) + ',' + (1 + br * .009).toFixed(4) + ')';
      if (kBody) kBody.style.transform = n < S.ksquash ? 'scale(1.08,.92)' : 'translateY(' + (br * -1.5).toFixed(2) + 'px) rotate(' + (S.lean * -.8).toFixed(3) + 'deg)';
      // the steam drifts while the window is open, is hidden while he sips or pushes his glasses, and is gone with the window's last 700 ms
      var steamOn = live && ['sip', 'yawn', 'glasses'].indexOf(S.cur) < 0;
      for (var i = 0; i < wisps.length; i++) {
        var p = ((n / 2600) + i / wisps.length) % 1, w = wisps[i];
        w.style.opacity = steamOn ? (Math.sin(p * Math.PI) * .7 * fade).toFixed(3) : 0;
        w.style.transform = 'translate(' + (Math.sin(p * 6 + i) * 7 + S.lean * -4 * p).toFixed(1) + 'px,' + (-p * 70).toFixed(1) + 'px) scale(' + (.7 + p * .9).toFixed(2) + ')';
      }
      S.raf = requestAnimationFrame(tick);
    }
    function settle() {
      S.raf = 0; S.hold = null; S.khold = null; S.next = null; S.blinkAt = null; S.kBlinkAt = null; S.lean = 0;
      S.mx = .6; S.my = .5; S.gaze = S.gazeCand = 'base'; S.kgaze = 'base';
      if (S.say) { if (!S.say.done) said(S.say.text); endSay(); }
      flip(Y, 'cur', 'base'); flip(K, 'kcur', 'base');
      if (yBody) yBody.style.transform = ''; if (kBody) kBody.style.transform = '';
      for (var i = 0; i < wisps.length; i++) { wisps[i].style.opacity = 0; wisps[i].style.transform = ''; }
      emit('base');
    }
    var wake = function () { touched = true; loadFrames(); };
    ['pointerdown', 'keydown', 'focusin'].forEach(function (ev) { panel.addEventListener(ev, wake, { once: true, passive: true }); });
    var poke = function () {
      wake();
      var n = now(); keep(WINDOW);
      S.squash = n + 110; S.ksquash = n + 110;
      if (reduce) { S.hold = { name: 'smirk', until: n + 1200 }; if (!S.say) startSay(lines()[S.lineIx++ % lines().length]); return; }
      if (n - S.lastClick < 2500) { S.hold = { name: 'laugh', until: n + 950 }; S.khold = { name: 'wide', until: n + 800 }; }
      else if (!S.say) { S.hold = { name: 'smirk', until: n + 400 }; startSay(lines()[S.lineIx++ % lines().length], n + 400, Math.random() < .35); }
      else { S.hold = { name: 'smirk', until: n + 1300 }; S.khold = { name: 'wide', until: n + 700 }; }
      S.lastClick = n;
    };
    var pokeKuro = function () { wake(); var n = now(); keep(WINDOW); S.ksquash = n + 110; S.khold = { name: Math.random() < .5 ? 'wide' : 'ear', until: n + 800 }; };
    yRoot.addEventListener('click', poke);
    kRoot.addEventListener('click', pokeKuro);
    // on screen, once the sting is gone: the frames come in, he wakes for five seconds and says his first line
    once(panel, .15, function () {
      loadFrames();
      if (reduce) return;
      afterSting(function () { keep(WINDOW); var n = now(); startSay(lines()[S.lineIx++ % lines().length], n + 900, Math.random() < .35); });
    });
    if (!reduce && finePointer) {
      panel.closest('.st-hero').addEventListener('pointermove', function (e) {
        S.mx = e.clientX / innerWidth; S.my = e.clientY / innerHeight; S.lastMove = now();
        if (framesIn && !S.raf) {
          // a window opened by the pointer alone, no line coming: once in a while he takes one sip (1.7 s), once the visit's yawn is done
          var n = now();
          if (!S.say && S.yawned && n > S.nextSip) { var at = n + rnd(900, 1700); S.next = { name: 'sip', at: at, until: at + 1700 }; S.nextSip = n + rnd(12000, 18000); }
          keep(WINDOW);
        }
      }, { passive: true });
    }
    // Kūro goes wide-eyed for half a second when the page is scrolled fast past the hero (faster than 3 px/ms); never with reduced motion
    if (!reduce) {
      var hero = panel.closest('.st-hero');
      S.lastY = scrollY; S.lastYt = now();
      addEventListener('scroll', function () {
        var n = now(), v = Math.abs(scrollY - S.lastY) / Math.max(16, n - S.lastYt);
        S.lastY = scrollY; S.lastYt = n;
        if (v > 3 && framesIn && !S.khold && hero.getBoundingClientRect().bottom > 0) { keep(1200); S.khold = { name: 'wide', until: n + 500 }; }
      }, { passive: true });
    }
    onLang.push(function () { if (S.say) endSay(); if (saidEl) saidEl.textContent = ''; });
  })();

  /* ---------------- 3 · the pose actors ----------------
     <button class="st-actor" data-seq="holdA,holdB"> with <img data-pf="a">
     and <img data-pf="b">: the class b shows the second frame. Once, when
     the figure is first on screen, for 250 + holdB ms (never with reduced
     motion; never more than five seconds); on hover while the pointer is
     over it; on a click or Enter for 1.6 × holdB. A hard cut each way. */
  $$('.st-actor[data-seq]').forEach(function (el) {
    var hb = Math.min(4000, Number((el.getAttribute('data-seq') || '3200,700').split(',')[1]) || 700), timer = 0, hover = false;
    var show = function (ms) { el.classList.add('b'); clearTimeout(timer); timer = setTimeout(function () { if (!hover) el.classList.remove('b'); }, ms); };
    el.addEventListener('click', function () { show(hb * 1.6); });
    if (!reduce && finePointer) {
      el.addEventListener('pointerenter', function () { hover = true; el.classList.add('b'); });
      el.addEventListener('pointerleave', function () { hover = false; clearTimeout(timer); el.classList.remove('b'); });
    }
    if (!reduce) once(el, .3, function () { show(250 + hb); });
  });

  // the WorkspaceHQ ticket plays its game animation (a second or three) on hover; with no hover it plays once, when it is first on screen
  var cart = $('.whq-cart');
  if (cart && !reduce && !finePointer) once(cart, .8, function () { cart.classList.add('is-play'); });

  /* ---------------- 4 · reveals, the wedge, the speed bar ----------------
     A [data-reveal] block below the first screen starts 18px low and
     transparent and comes up once 12% of it is on screen, 70 ms after the
     sibling before it (490 ms at most). Above the fold nothing is hidden. */
  if (!reduce && IO) {
    var rio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); rio.unobserve(e.target); } });
    }, { threshold: .12 });
    $$('[data-reveal]').forEach(function (el) {
      if (el.getBoundingClientRect().top < innerHeight) return;
      // a card inside a row that swipes is revealed by the swipe itself, as it comes into the row: not hidden behind a scroll the visitor may never make
      var rowEl = el.closest('[data-row]');
      if (rowEl && rowEl.scrollWidth > rowEl.clientWidth + 2) return;
      var sib = [].filter.call(el.parentElement.children, function (c) { return c.hasAttribute('data-reveal'); });
      el.style.setProperty('--d', Math.min(490, Math.max(0, sib.indexOf(el)) * 70) + 'ms');
      el.classList.add('st-rv');
      rio.observe(el);
    });
  }
  /* the first drawing (the founder section's plate): three layers of one
     drawing. Once, when 35% of it is on screen, Kūro slides in, then Yasser
     (CSS: 0.9 s and 1.0 s, the second 0.45 s later: done in 1.5 s). Without
     this script, or with reduced motion, the layers are simply in place. */
  var plate = $('[data-plate]');
  if (plate && !reduce && IO) {
    plate.classList.add('is-pre');
    once(plate, .35, function () { plate.classList.add('is-in'); });
  }
  /* the short animations (a footer sleep, a wave in the contact card): each
     <img> holds its still and names its animated file in data-anim. Once
     a third of it is on screen (not on a data-saving or 2G/3G connection: it keeps the still) the src becomes the animation, once: it plays
     for less than five seconds (scripts/check.mjs 17b) and rests on the
     frame it started from. With reduced motion nothing is observed and the
     <picture>'s <source> keeps the still. */
  var loops = $$('img[data-anim]');
  // a connection that says it is saving data, or is slow, keeps the stills: two decorations at the page's end are not worth 176 kB of it
  var thin = navigator.connection && (navigator.connection.saveData || /(^|-)[23]g$/.test(navigator.connection.effectiveType || ''));
  if (loops.length && !reduce && IO && !thin) {
    var lio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        lio.unobserve(e.target);
        e.target.src = e.target.getAttribute('data-anim');
      });
    }, { threshold: .3 });
    loops.forEach(function (im) { lio.observe(im); });
  }
  var board = $('[data-wedge]');
  once(board, .12, function () { setTimeout(function () { board.classList.add('is-cut'); }, reduce ? 0 : 350); });
  var speed = $('[data-speed]');
  once($('#tech'), .12, function () { if (speed) speed.classList.add('is-on'); });

  /* ---------------- 5 · process ----------------
     The active step is the last one whose top has crossed 55% of the
     screen (an observer with that margin; no scroll loop). The card's
     picture, number, mood and bar follow it. */
  var steps = $$('.st-proc li'), card = $('[data-proc-card]');
  if (steps.length && card) (function () {
    var frames = $$('[data-frame]', card), bar = $$('.st-proc-card__bar i', card);
    var nEl = $('[data-proc-n]', card), mEl = $('[data-proc-m]', card);
    var active = -1, inView = {};
    var set = function (i) {
      if (i === active) return;
      active = i;
      steps.forEach(function (s, j) { s.classList.toggle('is-active', j === i); });
      frames.forEach(function (f) { f.classList.toggle('is-active', Number(f.getAttribute('data-frame')) === i); });
      bar.forEach(function (b, j) { b.classList.toggle('is-on', j <= i); });
      if (nEl) nEl.textContent = '0' + (i + 1);
      if (mEl) { mEl.setAttribute('data-i18n', 'process.steps.' + i + '.m'); mEl.textContent = t('process.steps.' + i + '.m'); }
    };
    set(0);
    // on a phone the five steps are a row that swipes: the step at the row's left edge is the one the card shows
    var row = steps[0].parentNode, swipes = function () { return row.scrollWidth > row.clientWidth + 2; };
    row.addEventListener('scroll', function () {
      if (!swipes()) return;
      var rr = row.getBoundingClientRect(), rtl = root.dir === 'rtl', cs0 = getComputedStyle(row), pad = parseFloat(rtl ? cs0.paddingRight : cs0.paddingLeft) || 0, best = 0, bd = 1e9;
      steps.forEach(function (s, j) { var r = s.getBoundingClientRect(), d = Math.abs((rtl ? rr.right - r.right : r.left - rr.left) - pad); if (d < bd) { bd = d; best = j; } });
      set(best);
    }, { passive: true });
    if (!IO) return;
    var pio = new IntersectionObserver(function (es) {
      if (swipes()) return;
      es.forEach(function (e) { inView[e.target.getAttribute('data-step')] = e.isIntersecting; });
      // the last step whose top has crossed the 55% line, read when one enters
      // or leaves (not on scroll): a tall window that shows all five does not
      // jump to the last picture
      var line = window.innerHeight * 0.55, last = -1, any = false;
      steps.forEach(function (s, j) { if (inView[j]) any = true; });
      if (!any) return;
      steps.forEach(function (s, j) { if (s.getBoundingClientRect().top <= line) last = j; });
      set(Math.max(0, last));
    }, { rootMargin: '0px 0px -45% 0px' });
    steps.forEach(function (s) { pio.observe(s); });
  })();

  /* ---------------- 6 · the console (the estimator) ----------------
     The home's model, as the build copied it from assets/app.js into
     #hub-prices (types, units, options, rush, exchange rates, maintenance,
     the three markets). quote() is the home's, line for line (scripts/
     check.mjs runs both over every combination): the tier up to its base
     size, each unit over it, each option it does not already include; a
     Vitrine never above the Studio tier for the same pages, the difference
     a line of its own; rush a line too, a quarter of the subtotal. The
     total is the exact sum of the lines: nothing is rounded after the sum.
     The screen shows the total and a face, the pad steps the type and the
     size, the receipt lists every line. Figures are written as the home
     writes them in each language. */
  var est = $('[data-est]');
  var P = null;
  try { P = JSON.parse($('#hub-prices').textContent); } catch (e) {}
  if (P) (function () {
    var M = P.model, O = P.opts;
    var kilo = function (n) { return Math.round(n / 1000) * 1000; };
    var sizeWeeks = function (m, n) { return m.per ? Math.floor(Math.max(0, n - m.base_u) / m.per) : 0; };
    var rushWeeks = function (w) { return Math.max(Math.ceil(w * 2 / 3), Math.round(w * P.rush[1])); };
    // does option o apply to type key? Its own list (only) decides, else the type's (opts)
    var applies = function (o, key) { var p = O[o], m = M[key]; return p.only ? p.only.indexOf(key) > -1 : !m.opts || m.opts.indexOf(o) > -1; };
    var tally = function (key, n, opts) {
      var m = M[key], over = Math.max(0, n - m.base_u), incl = m.incl || [], sw = sizeWeeks(m, n);
      var q = { lo: m.base[0], hi: m.base[1], wLo: m.weeks[0] + sw, wHi: m.weeks[1] + sw, lines: [{ k: 'base', n: m.base_u, lo: m.base[0], hi: m.base[1] }] };
      if (over) { q.lines.push({ k: 'extra', n: over, unit: m.unit, lo: over * m.unit[0], hi: over * m.unit[1] }); q.lo += over * m.unit[0]; q.hi += over * m.unit[1]; }
      opts.forEach(function (o) {
        var p = O[o];
        if (!p || !applies(o, key)) return;
        if (incl.indexOf(o) > -1) { q.lines.push({ k: 'opt', o: o, incl: true, lo: 0, hi: 0 }); return; }
        q.lines.push({ k: 'opt', o: o, lo: p.add[0], hi: p.add[1] });
        q.lo += p.add[0]; q.hi += p.add[1]; q.wLo += p.weeks[0]; q.wHi += p.weeks[1];
      });
      return q;
    };
    var quote = function (key, n, opts, rush) {
      var q = tally(key, n, opts);
      if (key === 'vitrine') {
        var s = tally('surmesure', n, opts), dLo = Math.min(0, s.lo - q.lo), dHi = Math.min(0, s.hi - q.hi);
        if (dLo < 0 || dHi < 0) { q.lines.push({ k: 'studio', lo: dLo, hi: dHi }); q.lo += dLo; q.hi += dHi; }
        q.wLo = Math.min(q.wLo, s.wLo); q.wHi = Math.min(q.wHi, s.wHi);
      }
      var kit = M[key].kit;
      if (kit && n >= kit.n && kit.needs.every(function (o) { return opts.indexOf(o) > -1; })) { q.lines.push({ k: 'kit', lo: -kit.off, hi: -kit.off }); q.lo -= kit.off; q.hi -= kit.off; }
      if (rush && !M[key].noRush) {
        var rLo = kilo(q.lo * (P.rush[0] - 1)), rHi = kilo(q.hi * (P.rush[0] - 1));
        q.lines.push({ k: 'rush', lo: rLo, hi: rHi }); q.lo += rLo; q.hi += rHi;
        q.wLo = rushWeeks(q.wLo); q.wHi = rushWeeks(q.wHi);
      }
      return q;
    };
    // figures: French and Arabic group with a narrow no-break space and put the currency after; English uses commas and puts € and $ first
    var grp = function (n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, lang === 'en' ? ',' : ' '); };
    var amt = function (n) { return (n < 0 ? '−' : '') + grp(Math.abs(n)); };
    var dash = function () { return lang === 'en' ? '⁠–⁠' : ' –⁠ '; };
    var sym = function (c) { return c === 'DZD' ? t('pricing.cur') : c === 'EUR' ? '€' : '$'; };
    // a range, or one figure when both bounds are the same (the money services are fixed prices)
    var pair = function (a, b, c) { var v = a === b ? grp(a) : grp(a) + dash() + grp(b); return lang === 'en' && c !== 'DZD' ? sym(c) + v : v + ' ' + sym(c); };
    var tidy = function (n, c) { var g = c === 'DZD' ? (n >= 1e6 ? 50000 : n >= 150000 ? 10000 : 5000) : (n >= 10000 ? 500 : n >= 1000 ? 100 : 10); return Math.max(g, Math.round(n / g) * g); };
    // a dinar range as shown in currency c (dinars pass through as they are)
    var range = function (lo, hi, c) { return c === 'DZD' ? pair(lo, hi, c) : pair(tidy(lo / P.fx[c], c), tidy(hi / P.fx[c], c), c); };
    // a counted unit: "1 page", "3 pages"; Arabic has five forms and its dual stands without the numeral
    var plural = function (n) {
      try { return new Intl.PluralRules(lang).select(n); } catch (e) {}
      if (n === 1) return 'one';
      if (lang === 'ar') { var h = n % 100; return n === 2 ? 'two' : h >= 3 && h <= 10 ? 'few' : h >= 11 ? 'many' : 'other'; }
      return 'other';
    };
    var unitN = function (u, n) {
      var f = t('pricing.unitsN.' + u).split('|'), i = (f.length === 5 ? ['one', 'two', 'few', 'many', 'other'] : ['one', 'other']).indexOf(plural(n));
      return f[i > -1 ? i : f.length - 1];
    };
    var wkN = function (n) { var f = t('pricing.wkN').split('|'), i = (f.length === 5 ? ['one', 'two', 'few', 'many', 'other'] : ['one', 'other']).indexOf(plural(n)); return f[i > -1 ? i : f.length - 1]; };
    var counted = function (u, n) { return lang === 'ar' && plural(n) === 'two' ? unitN(u, n) : n + ' ' + unitN(u, n); };

    /* The figures printed outside the console read this same model, so a
       card and the console cannot disagree: [data-money-price] is a figure
       of the coaching services (the manual page), [data-motion-price] one of
       the motion line (the Studio), each written in the page's language;
       [data-money-wa] is a WhatsApp line naming the service and its price
       (0 to 3: the four services; "kit": the bundle). The manual page has
       no console: there this is all section 6 does. */
    var MA = M.argent;
    var moneyPrice = function (k) {
      var kitQ = quote('argent', MA.kit.at, MA.kit.needs, false);
      var v = k === 'call' ? MA.base[0] : k === 'guideOne' ? O.guides.one : k === 'kit' ? kitQ.lo : k === 'kitWas' ? kitQ.lo + MA.kit.off : O[k].add[0];
      return pair(v, v, 'DZD');
    };
    var money = function () {
      $$('[data-money-price]').forEach(function (n) { var v = moneyPrice(n.getAttribute('data-money-price')); if (n.textContent !== v) n.textContent = v; });
      // the motion line's figures: the logo package, a second, the site option
      var MT = M.motion;
      var motionPrice = { logo: range(MT.base[0], MT.base[1], 'DZD'), sec: '+\u00a0' + range(MT.unit[0], MT.unit[1], 'DZD'), anim: '+\u00a0' + range(O.anim.add[0], O.anim.add[1], 'DZD') };
      $$('[data-motion-price]').forEach(function (n) { var v = motionPrice[n.getAttribute('data-motion-price')]; if (v && n.textContent !== v) n.textContent = v; });
      $$('[data-money-wa]').forEach(function (a) {
        var w = a.getAttribute('data-money-wa'), kit = w === 'kit', i = Number(w), key = kit ? 'kit' : ['call', 'setup', 'pack', 'guides'][i];
        a.href = 'https://wa.me/213672412578?text=' + encodeURIComponent(t('money.svc.waMsg').replace('{s}', t(kit ? 'money.kit.k' : 'money.svc.items.' + i + '.name') + ' (' + moneyPrice(key) + ')'));
      });
    };
    money();
    if (!est) { onLang.push(money); return; }

    var st = { type: 'vitrine', n: M.vitrine.def, opts: [], rush: false, care: false };
    var order = $$('[data-type]', est).map(function (b) { return b.getAttribute('data-type'); });
    var size = $('#est-size'), nOut = $('[data-est-n]'), unit = $('[data-est-unit]');
    var dz = $('[data-est-dz]'), eu = $('[data-est-eu]'), us = $('[data-est-us]'), w = $('[data-est-w]');
    var what = $('[data-est-what]', est), inclEl = $('[data-est-incl]', est), zone = $('[data-est-zone]', est), face = $('[data-est-face]', est);
    var rowsEl = $('[data-est-lines]', est), loEl = $('[data-est-lo]', est), hiEl = $('[data-est-hi]', est), mk = $('[data-est-mk]', est);
    var careBox = $('[data-est-care]'), careV = $('[data-est-care-v]');
    var noteEl = $('.st-est__note', est), midEl = $('[data-est-mid]', est), paceBox = $('[data-est-pace]', est), care = $('[data-care]', est);
    var kuro = $('[data-est-kuro]'), kImgs = $$('img', kuro), kLine = $('[data-est-line]');
    var seal = $('[data-est-seal]', est);
    var live = $('[data-est-live]', est), liveW = $('[data-est-live-w]', est);
    var shown = null, tw = 0, tier = 0;
    var paint = function (lo, hi) {
      dz.textContent = range(lo, hi, 'DZD');
      if (live) live.textContent = dz.textContent;
    };
    // the receipt: one row per line of the quote, then the two totals, which are their sums
    var receipt = function (q, m, animate) {
      var frag = document.createDocumentFragment();
      q.lines.forEach(function (ln) {
        var tr = document.createElement('tr'), th = document.createElement('th'), td;
        th.scope = 'row';
        th.textContent = ln.k === 'base' ? (m.fam === 'argent' ? t('pricing.rc.call') : t('pricing.rc.base') + ' ' + counted(m.u, ln.n))
          : ln.k === 'extra' ? '+ ' + counted(m.u, ln.n)
          : ln.k === 'opt' ? t('pricing.o.' + ln.o)
          : ln.k === 'studio' ? t('pricing.rc.studio') : ln.k === 'kit' ? t('pricing.rc.kit') : t('pricing.rc.rush');
        tr.appendChild(th);
        if (ln.incl) { td = document.createElement('td'); td.colSpan = 2; td.textContent = t('pricing.included'); tr.appendChild(td); }
        else ['lo', 'hi'].forEach(function (f) { td = document.createElement('td'); td.dir = 'ltr'; td.textContent = amt(ln[f]); tr.appendChild(td); });
        frag.appendChild(tr);
      });
      rowsEl.textContent = ''; rowsEl.appendChild(frag);
      loEl.textContent = amt(q.lo); hiEl.textContent = amt(q.hi);
      eu.textContent = range(q.lo, q.hi, 'EUR'); us.textContent = range(q.lo, q.hi, 'USD');
      if (animate && !reduce) { rowsEl.classList.remove('is-print'); void rowsEl.offsetWidth; rowsEl.classList.add('is-print'); }
    };
    /* The same project on three markets (the price guide's sourced ranges),
       each in its own currency, drawn on one logarithmic dinar scale with the
       estimate laid across as a band. A type the guide has no row for
       (an automation) shows no market. */
    var NATIVE = { dz: 'DZD', fr: 'EUR', us: 'USD' };
    var market = function (q) {
      var row = P.market && P.market[st.type];
      if (!mk) return;
      mk.hidden = !row;
      if (!row) return;
      var toDz = function (k, v) { return k === 'dz' ? v : v * P.fx[NATIVE[k]]; };
      var lo = q.lo, hi = q.hi;
      Object.keys(NATIVE).forEach(function (k) { lo = Math.min(lo, toDz(k, row[k][0])); hi = Math.max(hi, toDz(k, row[k][1])); });
      var L0 = Math.log(lo * 0.8), L1 = Math.log(hi * 1.25);
      var pos = function (v) { return ((Math.log(v) - L0) / (L1 - L0) * 100).toFixed(1) + '%'; };
      mk.style.setProperty('--q0', pos(q.lo)); mk.style.setProperty('--q1', pos(q.hi));
      $$('[data-mk]', mk).forEach(function (r) {
        var k = r.getAttribute('data-mk'), v = row[k];
        $('[data-mk-v]', r).textContent = pair(v[0], v[1], NATIVE[k]) + (v[2] ? '+' : '');
        r.style.setProperty('--a', pos(toDz(k, v[0]))); r.style.setProperty('--b', pos(toDz(k, v[1])));
      });
    };
    var render = function (animate) {
      var m = M[st.type], q = quote(st.type, st.n, picked(), st.rush);
      nOut.textContent = st.n;
      size.setAttribute('aria-valuetext', counted(m.u, st.n));
      unit.setAttribute('data-i18n', 'pricing.units.' + m.u); unit.textContent = t('pricing.units.' + m.u);
      what.textContent = t('pricing.types.' + st.type) + ' · ' + counted(m.u, st.n);
      inclEl.textContent = (m.fam === 'argent' ? t('pricing.rc.call') : t('pricing.rc.base') + ' ' + counted(m.u, m.base_u)) + '. ' + t('pricing.beyond') + ' + ' + range(m.unit[0], m.unit[1], 'DZD') + ' / ' + unitN(m.u, 1);
      // a studio project whose range meets the mid band carries the mid-range note; the money services do not
      if (midEl) { midEl.hidden = !!m.fam || q.lo > P.mid[1] || q.hi < P.mid[0]; midEl.textContent = t('pricing.rc.mid').replace('{r}', pair(P.mid[0], P.mid[1], 'DZD')); }
      // pace and maintenance are a project's, not a call's
      if (paceBox) paceBox.hidden = !!m.noRush;
      care.hidden = !!m.fam;
      if (zone) zone.style.setProperty('--incl', ((m.base_u - m.min) / (m.max - m.min) * 100).toFixed(1) + '%');
      // "2–4 semaines", or "1 semaine" when both ends are the same week
      w.textContent = q.wLo === q.wHi ? String(q.wHi) : q.wLo + '–' + q.wHi;
      if (liveW) liveW.textContent = w.textContent;
      $$('[data-est-wk]', est).forEach(function (n) { n.textContent = wkN(q.wHi); });
      if (noteEl) noteEl.hidden = !!m.fam;
      careBox.hidden = !st.care || !!m.fam; careV.textContent = range(P.retainer[0], P.retainer[1], 'DZD');
      receipt(q, m, animate);
      market(q);
      var nt = q.hi < 200000 ? 0 : q.hi < 600000 ? 1 : 2;
      if (nt !== tier) { tier = nt; kImgs.forEach(function (im) { im.classList.toggle('is-active', Number(im.getAttribute('data-tier')) === tier); }); }
      face.setAttribute('data-mood', tier);
      kLine.setAttribute('data-i18n', 'pricing.kuro.' + tier); kLine.textContent = t('pricing.kuro.' + tier);
      kImgs[0].alt = ''; kImgs[tier].alt = t('pricing.kuroAlt');
      // the seal stamps the receipt once the visitor has changed something (never on the first paint)
      if (animate && seal) { seal.hidden = false; seal.classList.remove('is-stamp'); if (!reduce) { void seal.offsetWidth; seal.classList.add('is-stamp'); } }
      cancelAnimationFrame(tw);
      var from = shown || { lo: q.lo, hi: q.hi };
      shown = { lo: q.lo, hi: q.hi };
      if (!animate || reduce) { paint(q.lo, q.hi); return; }
      kuro.classList.add('is-squash'); setTimeout(function () { kuro.classList.remove('is-squash'); }, 110);
      face.classList.add('is-blink'); setTimeout(function () { face.classList.remove('is-blink'); }, 140);
      var t1 = now(), D = 420;
      var step = function (n) {
        var p = Math.min(1, (n - t1) / D), e = 1 - Math.pow(1 - p, 4);
        var r = function (a, b) { return Math.round((a + (b - a) * e) / 1000) * 1000; };
        if (p < 1) { paint(r(from.lo, q.lo), r(from.hi, q.hi)); tw = requestAnimationFrame(step); } else paint(q.lo, q.hi);
      };
      tw = requestAnimationFrame(step);
    };
    // which options apply to the type (opts), which it already includes (incl)
    var optBtns = $$('[data-opt]', est), optGrp = $('[data-est-optgrp]', est);
    var setType = function (k) {
      st.type = k; var m = M[k];
      st.n = m.def; size.min = m.min; size.max = m.max; size.step = m.step; size.value = m.def;
      st.opts = st.opts.filter(function (o) { return applies(o, k); });
      if (m.noRush && st.rush) { st.rush = false; $$('[data-pace]', est).forEach(function (x) { x.setAttribute('aria-pressed', String(x.getAttribute('data-pace') === 'std')); }); }
      $$('[data-type]', est).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-type') === k)); });
      optBtns.forEach(function (b) {
        var o = b.getAttribute('data-opt'), incl = (m.incl || []).indexOf(o) > -1, off = !applies(o, k);
        // an option of another family is not shown at all; one the type has no use for stays, locked
        b.hidden = !!(O[o].only || m.fam) && off;
        b.disabled = incl || !!off;
        b.setAttribute('aria-pressed', String(incl || st.opts.indexOf(o) > -1));
        var tag = $('[data-incl]', b);
        if (incl && !tag) { tag = document.createElement('span'); tag.setAttribute('data-incl', ''); b.appendChild(tag); }
        if (tag) { tag.hidden = !incl; tag.textContent = ' (' + t('pricing.included') + ')'; }
      });
      if (optGrp) optGrp.hidden = !optBtns.some(function (b) { return !b.hidden; });
    };
    // an option the tier includes is on the receipt as "included"
    var picked = function () { var m = M[st.type]; return (m.incl || []).concat(st.opts.filter(function (o) { return (m.incl || []).indexOf(o) < 0; })); };
    $$('button', est).forEach(function (b) { b.disabled = false; });
    size.disabled = false;
    $$('[data-type]', est).forEach(function (b) { b.addEventListener('click', function () { setType(b.getAttribute('data-type')); render(true); }); });
    size.addEventListener('input', function () { st.n = Number(size.value); render(true); });
    optBtns.forEach(function (b) {
      b.addEventListener('click', function () {
        var o = b.getAttribute('data-opt'), i = st.opts.indexOf(o);
        if (i > -1) st.opts.splice(i, 1); else st.opts.push(o);
        b.setAttribute('aria-pressed', String(i < 0)); render(true);
      });
    });
    $$('[data-pace]', est).forEach(function (b) {
      b.addEventListener('click', function () {
        st.rush = b.getAttribute('data-pace') === 'rush';
        $$('[data-pace]', est).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        render(true);
      });
    });
    // the pad: up and down walk the types, minus and plus step the size
    $$('[data-pad]', est).forEach(function (b) {
      b.addEventListener('click', function () {
        var d = b.getAttribute('data-pad'), m = M[st.type];
        if (d === 'up' || d === 'down') {
          var i = order.indexOf(st.type) + (d === 'up' ? -1 : 1);
          setType(order[(i + order.length) % order.length]);
        } else {
          var v = Math.min(m.max, Math.max(m.min, st.n + (d === 'more' ? m.step : -m.step)));
          if (v === st.n) return;
          st.n = v; size.value = v;
        }
        render(true);
      });
    });
    care.addEventListener('click', function () { st.care = !st.care; care.setAttribute('aria-pressed', String(st.care)); render(false); });
    setType('vitrine'); render(false);
    $$('[data-est-go]').forEach(function (a) {
      a.addEventListener('click', function () {
        var k = a.getAttribute('data-est-go'), pick = a.getAttribute('data-est-pick'), m = M[k];
        if (!m) return;
        st.opts = pick === 'kit' ? m.kit.needs.slice() : pick && O[pick] ? [pick] : [];
        setType(k);
        if (pick === 'kit') { st.n = m.kit.at; size.value = st.n; }
        var wantN = Number(a.getAttribute('data-est-size'));
        if (wantN >= m.min && wantN <= m.max) { st.n = wantN; size.value = st.n; }   // [data-est-size]: the size a card stands for
        render(true);
      });
    });
    onLang.push(function () { var n = st.n; setType(st.type); st.n = n; size.value = n; render(false); money(); });
  })();

  /* ---------------- 7 · brand layers and the FAQ ---------------- */
  var layers = $$('[data-layer]'), lcards = $$('[data-layer-card]');
  if (layers.length) {
    var pick = function (i) {
      layers.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-layer') === i)); });
      lcards.forEach(function (c) { c.classList.toggle('is-active', c.getAttribute('data-layer-card') === i); });
    };
    layers.forEach(function (b) { b.addEventListener('click', function () { pick(b.getAttribute('data-layer')); }); });
    pick('3');
  }
  var qas = $$('.st-qa button[aria-controls]');
  var openQa = function (btn, on) { btn.setAttribute('aria-expanded', String(on)); document.getElementById(btn.getAttribute('aria-controls')).hidden = !on; };
  qas.forEach(function (b, i) {
    openQa(b, i === 0);
    b.addEventListener('click', function () {
      var was = b.getAttribute('aria-expanded') === 'true';
      qas.forEach(function (x) { openQa(x, false); });
      if (!was) openQa(b, true);
    });
  });
  // the Aperçu card's WhatsApp message, in the page's language
  var wa = $('[data-wa-preview]');
  if (wa) onLang.push(function () { wa.href = 'https://wa.me/213672412578?text=' + encodeURIComponent(t('contact.previewMsg')); });

  /* ---------------- 8 · the cases' shell ----------------
     Every case is a <section class="st-case case-<slug>">; this wires what
     its markup declares, so a case needs no script of its own:
       [data-track]                 the horizontal track (tabindex="0", a
                                    region with a name); drag to scroll with
                                    a mouse, the arrow keys and a swipe as
                                    the browser does it
       [data-track-prev|next]       buttons that move it by most of a screen
       [data-track-bar]             a bar whose --p follows the scroll (0-1)
       [data-kind="k"]              a tile of one kind of deliverable: seen
                                    once 55% of it is inside the track; its
                                    [data-badge] then reads case.seen, the
                                    case's [data-pip="k"] and [data-scope="k"]
                                    get .is-seen, [data-seen-count] the count
       [data-zoom="<file>"]         a button that opens <file> in the viewer
                                    (its <img>'s alt is the viewer's name)
       [data-stepper] + data-values="a,b,c" (+ data-index): [data-step="-1"]
                                    and [data-step="1"] walk the list;
                                    [data-out] shows the value, the stepper
                                    gets --v (0-1) and data-value
       input[type=range][data-range] its closest [data-range-scope] gets --v
                                    (0-1); [data-out] in it shows the value
       [data-tabs]                  buttons [data-tab="id"] (role tab) show
                                    [data-panel="id"]; arrows move along
       [data-cycle]                 one [data-cycle-item] at a time, with
                                    [data-cycle-prev|next|random] and
                                    [data-cycle-n] ("2 / 4")
       [data-type-once]             its [data-type-line] lines typed once on
                                    first view, 30 ms a character, 2.5 s at
                                    most (whole with reduced motion)
       form[data-demo]              a demonstration: a submit sends nothing
                                    and shows its [data-demo-msg]
     State is in classes and custom properties, never in style rules. */
  $$('.st-case').forEach(function (cs) {
    var track = $('[data-track]', cs);
    if (track) {
      var bar = $('[data-track-bar]', cs), foot = $('.st-case__foot', cs);
      var prevB = $$('[data-track-prev]', cs), nextB = $$('[data-track-next]', cs);
      var tiles = [].slice.call(track.children);
      // the position, "k / n" tiles seen so far, in the foot beside the bar
      var nEl = null;
      if (foot) { nEl = document.createElement('span'); nEl.className = 'st-case__n'; nEl.setAttribute('aria-hidden', 'true'); nEl.setAttribute('dir', 'ltr'); foot.insertBefore(nEl, foot.firstChild); }
      var padL = function () { return parseFloat(getComputedStyle(track).scrollPaddingLeft) || 0; };
      // each tile's left edge in scroll coordinates, once per distinct value
      var starts = function () {
        var tr = track.getBoundingClientRect(), sl = track.scrollLeft, out = [];
        tiles.forEach(function (el) { var x = Math.round(el.getBoundingClientRect().left - tr.left + sl - padL()); if (out.indexOf(x) < 0) out.push(x); });
        return out.sort(function (a, b) { return a - b; });
      };
      var prog = function () {
        var max = track.scrollWidth - track.clientWidth, sl = Math.abs(track.scrollLeft);
        if (bar) bar.style.setProperty('--p', max > 0 ? sl / max : 0);
        prevB.forEach(function (b) { b.setAttribute('aria-disabled', String(sl <= 2)); });
        nextB.forEach(function (b) { b.setAttribute('aria-disabled', String(max - sl <= 2)); });
        if (nEl) {
          var tr = track.getBoundingClientRect(), k = 0;
          tiles.forEach(function (el) { if (el.getBoundingClientRect().right <= tr.right + 4) k++; });
          nEl.textContent = Math.max(1, k) + ' / ' + tiles.length;
        }
      };
      track.addEventListener('scroll', prog, { passive: true }); prog();
      if ('ResizeObserver' in window) new ResizeObserver(prog).observe(track);
      // an arrow moves to the next tile's edge (a page of tiles on a wide track), not by a width that stops mid-tile
      var by = function (d) {
        var max = track.scrollWidth - track.clientWidth, cur = track.scrollLeft, xs = starts(), min = track.clientWidth >= 900 ? track.clientWidth * .7 : 8, to;
        if (d > 0) { to = xs.filter(function (x) { return x > cur + min; })[0]; if (to == null) to = max; }
        else { to = xs.filter(function (x) { return x < cur - min; }).pop(); if (to == null) to = 0; }
        track.scrollTo({ left: Math.max(0, Math.min(max, to)), behavior: reduce ? 'auto' : 'smooth' });
      };
      // a control reached by the keyboard (or a screen reader) in a tile that is only peeking in: the track brings the tile to its snap point, whole (the browser's own scroll-into-view stopped at the edge, and the snap took it back)
      track.addEventListener('focusin', function (e) {
        var tile = tiles.filter(function (t) { return t.contains(e.target); })[0];
        if (!tile) return;
        var tr = track.getBoundingClientRect(), r = tile.getBoundingClientRect();
        if (r.left >= tr.left + 8 && r.right <= tr.right - 8) return;
        track.scrollTo({ left: Math.max(0, Math.min(track.scrollWidth - track.clientWidth, Math.round(r.left - tr.left + track.scrollLeft - padL()))), behavior: 'auto' });
      });
      prevB.forEach(function (b) { b.addEventListener('click', function () { by(-1); }); });
      nextB.forEach(function (b) { b.addEventListener('click', function () { by(1); }); });
      // the foot's bar is a scrubber: a touch or a click on it takes the track there, and it settles on a tile
      var barP = $('.st-case__bar-p', cs), scrub = false;
      var scrubTo = function (e) { var r = barP.getBoundingClientRect(), f = Math.max(0, Math.min(1, (e.clientX - r.left) / (r.width || 1))); track.scrollLeft = f * (track.scrollWidth - track.clientWidth); };
      if (barP) {
        barP.addEventListener('pointerdown', function (e) { scrub = true; barP.setPointerCapture(e.pointerId); track.classList.add('is-drag'); scrubTo(e); });
        barP.addEventListener('pointermove', function (e) { if (scrub) scrubTo(e); });
        var endScrub = function () { if (!scrub) return; scrub = false; track.classList.remove('is-drag'); };
        barP.addEventListener('pointerup', endScrub); barP.addEventListener('pointercancel', endScrub);
      }
      var drag = null;
      track.addEventListener('pointerdown', function (e) {
        if (e.pointerType !== 'mouse' || e.button !== 0 || e.target.closest('button,a,input,select,textarea,label')) return;
        drag = { x: e.clientX, left: track.scrollLeft, moved: false };
      });
      window.addEventListener('pointermove', function (e) {
        if (!drag) return;
        var dx = e.clientX - drag.x;
        if (!drag.moved && Math.abs(dx) > 4) { drag.moved = true; track.classList.add('is-drag'); }
        if (drag.moved) track.scrollLeft = drag.left - dx;
      });
      window.addEventListener('pointerup', function () { if (drag) { track.classList.remove('is-drag'); drag = null; } });
      // the kinds of deliverable seen so far
      var kinds = {}, seen = {};
      $$('[data-kind]', track).forEach(function (el) { kinds[el.getAttribute('data-kind')] = 1; });
      var count = $('[data-seen-count]', cs), total = Object.keys(kinds).length;
      var mark = function (k) {
        if (seen[k]) return; seen[k] = 1;
        $$('[data-kind="' + k + '"] [data-badge]', track).forEach(function (b) { b.classList.add('is-seen'); b.setAttribute('data-i18n', 'case.seen'); b.textContent = t('case.seen'); });
        $$('[data-pip="' + k + '"],[data-scope="' + k + '"]', cs).forEach(function (p) { p.classList.add('is-seen'); });
        if (count) count.textContent = Object.keys(seen).length + '/' + total;
      };
      if (count) count.textContent = '0/' + total;
      if (IO) {
        var kio = new IntersectionObserver(function (es) {
          es.forEach(function (e) { if (e.isIntersecting) { mark(e.target.getAttribute('data-kind')); kio.unobserve(e.target); } });
        }, { root: track, threshold: .55 });
        $$('[data-kind]', track).forEach(function (el) { kio.observe(el); });
      } else Object.keys(kinds).forEach(mark);
    }
    $$('[data-stepper]', cs).forEach(function (sp) {
      var vals = (sp.getAttribute('data-values') || '').split(','), i = Number(sp.getAttribute('data-index')) || 0;
      var out = $$('[data-out]', sp);
      var set = function (j) {
        i = Math.max(0, Math.min(vals.length - 1, j));
        sp.setAttribute('data-value', vals[i]); sp.setAttribute('data-index', i);
        sp.style.setProperty('--v', vals.length > 1 ? i / (vals.length - 1) : 1);
        out.forEach(function (o) { o.textContent = vals[i]; });
        $$('[data-step]', sp).forEach(function (b) { var d = Number(b.getAttribute('data-step')); b.disabled = (d < 0 && i === 0) || (d > 0 && i === vals.length - 1); });
        $$('[data-step-pip]', sp).forEach(function (p, k) { p.classList.toggle('is-on', k <= i); });
      };
      $$('[data-step]', sp).forEach(function (b) { b.addEventListener('click', function () { set(i + Number(b.getAttribute('data-step'))); }); });
      set(i);
    });
    $$('input[type="range"][data-range]', cs).forEach(function (r) {
      var scope = r.closest('[data-range-scope]') || r.parentElement;
      var set = function () {
        var v = Number(r.value), lo = Number(r.min) || 0, hi = Number(r.max) || 100;
        scope.style.setProperty('--v', (v - lo) / (hi - lo || 1));
        $$('[data-out]', scope).forEach(function (o) { o.textContent = r.value; });
      };
      r.addEventListener('input', set); set();
    });
    $$('[data-tabs]', cs).forEach(function (tb) {
      var tabs = $$('[data-tab]', tb);
      var sel = function (tab, focus) {
        tabs.forEach(function (x) { var on = x === tab; x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1; var p = $('[data-panel="' + x.getAttribute('data-tab') + '"]', tb); if (p) p.hidden = !on; });
        if (focus) tab.focus();
      };
      tabs.forEach(function (x, j) {
        x.addEventListener('click', function () { sel(x); });
        x.addEventListener('keydown', function (e) {
          var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
          if (!d) return; if (root.dir === 'rtl') d = -d;
          e.preventDefault(); sel(tabs[(j + d + tabs.length) % tabs.length], true);
        });
      });
      sel(tabs.filter(function (x) { return x.getAttribute('aria-selected') === 'true'; })[0] || tabs[0]);
    });
    $$('[data-cycle]', cs).forEach(function (cy) {
      var items = $$('[data-cycle-item]', cy), i = 0, n = $('[data-cycle-n]', cy);
      var set = function (j) { i = (j + items.length) % items.length; items.forEach(function (it, k) { it.hidden = k !== i; it.classList.toggle('is-active', k === i); }); if (n) n.textContent = (i + 1) + ' / ' + items.length; };
      $$('[data-cycle-prev]', cy).forEach(function (b) { b.addEventListener('click', function () { set(i - 1); }); });
      $$('[data-cycle-next]', cy).forEach(function (b) { b.addEventListener('click', function () { set(i + 1); }); });
      $$('[data-cycle-random]', cy).forEach(function (b) { b.addEventListener('click', function () { if (items.length > 1) { var j = i; while (j === i) j = Math.floor(Math.random() * items.length); set(j); } }); });
      set(0);
    });
    $$('[data-type-once]', cs).forEach(function (box) {
      var lns = $$('[data-type-line]', box);
      if (reduce || !lns.length) return;
      var full = lns.map(function (l) { return l.textContent; }), total = full.join('').length;
      var per = Math.min(30, 2500 / Math.max(1, total));
      box.setAttribute('aria-label', full.join(' '));
      lns.forEach(function (l) { l.setAttribute('aria-hidden', 'true'); });
      once(box, .3, function () {
        lns.forEach(function (l) { l.textContent = ''; });
        var t1 = now();
        var step = function (n) {
          var k = Math.floor((n - t1) / per), left = k;
          lns.forEach(function (l, j) { var s = full[j]; l.textContent = s.slice(0, Math.max(0, Math.min(s.length, left))); left -= s.length; });
          if (k < total) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    });
    $$('form[data-demo]', cs).forEach(function (f) {
      f.addEventListener('submit', function (e) { e.preventDefault(); var m = $('[data-demo-msg]', f); if (m) m.hidden = false; });
    });
  });

  // the viewer: one <dialog> for every case's posters and the Lab's diary; Esc, a click or the button
  // close it. A picture with data-set joins the pictures of its set: previous, next, the arrow keys
  // and a caption (the figcaption's text) appear, and the dialog widens.
  var lb = $('#lightbox');
  if (lb && typeof lb.showModal === 'function') {
    var lbImg = document.createElement('img'), opener = null, setList = [], setAt = 0;
    var lbPrev = $('[data-lb-prev]', lb), lbNext = $('[data-lb-next]', lb), lbCap = $('.st-lb__cap', lb);
    lbImg.alt = '';
    lb.insertBefore(lbImg, lb.firstChild);
    var show = function (z) {
      var im = $('img', z), fc = $('figcaption', z), cap = fc ? fc.textContent.replace(/\s+/g, ' ').trim() : '';
      opener = z;
      lbImg.src = z.getAttribute('data-zoom');
      lbImg.alt = im ? im.alt : '';
      lb.setAttribute('aria-label', cap || lbImg.alt || t('case.zoom'));
      if (lbCap) { lbCap.textContent = cap + (setList.length > 1 ? (cap ? '  ·  ' : '') + (setAt + 1) + ' / ' + setList.length : ''); lbCap.hidden = !setList.length || !cap; }
    };
    var go = function (d) {
      if (setList.length < 2) return;
      setAt = (setAt + d + setList.length) % setList.length;
      show(setList[setAt]);
      [1, -1].forEach(function (k) { new Image().src = setList[(setAt + k + setList.length) % setList.length].getAttribute('data-zoom'); });
    };
    document.addEventListener('click', function (e) {
      var z = e.target.closest && e.target.closest('[data-zoom]');
      if (!z) return;
      e.preventDefault();
      var set = z.getAttribute('data-set');
      setList = set ? $$('[data-zoom][data-set="' + set + '"]') : [];
      setAt = Math.max(0, setList.indexOf(z));
      lb.classList.toggle('st-lb--set', setList.length > 1);
      [lbPrev, lbNext].forEach(function (b) { if (b) b.hidden = setList.length < 2; });
      show(z);
      lb.showModal();
    });
    if (lbPrev) lbPrev.addEventListener('click', function () { go(-1); });
    if (lbNext) lbNext.addEventListener('click', function () { go(1); });
    lb.addEventListener('keydown', function (e) {
      if (setList.length < 2 || (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight')) return;
      e.preventDefault();
      var rtl = getComputedStyle(lb).direction === 'rtl';
      go((e.key === 'ArrowRight') !== rtl ? 1 : -1);
    });
    lb.addEventListener('click', function (e) { if (e.target === lb || e.target === lbImg || e.target.closest('[data-lb-close]')) lb.close(); });
    lb.addEventListener('close', function () { if (opener) opener.focus(); opener = null; setList = []; });
    // a touch swipes the viewer: sideways moves one picture (as the page reads: the other way in Arabic), a pull down closes it
    var sw = null;
    lb.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' || e.target.closest('button')) return;
      sw = { x: e.clientX, y: e.clientY, id: e.pointerId };
    });
    lb.addEventListener('pointermove', function (e) {
      if (!sw || e.pointerId !== sw.id) return;
      var dx = e.clientX - sw.x, dy = e.clientY - sw.y;
      if (!reduce && dy > 12 && dy > Math.abs(dx)) { lb.style.transform = 'translateY(' + dy + 'px)'; lb.style.opacity = String(Math.max(.4, 1 - dy / 500)); }
    });
    var endSwipe = function (e) {
      if (!sw || e.pointerId !== sw.id) return;
      var dx = e.clientX - sw.x, dy = e.clientY - sw.y;
      sw = null; lb.style.transform = ''; lb.style.opacity = '';
      if (e.type === 'pointercancel') return;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.3) go((dx < 0) !== (getComputedStyle(lb).direction === 'rtl') ? 1 : -1);
      else if (dy > 80 && dy > Math.abs(dx) * 1.3) lb.close();
    };
    lb.addEventListener('pointerup', endSwipe);
    lb.addEventListener('pointercancel', endSwipe);
  }

  /* ---------------- 9 · landing on an anchor ----------------
     A case below the fold skips its layout (content-visibility) and counts
     for a guessed height until it is near the screen, so a jump to
     #voidsplunker (the bible's back link) or any #id after the cases first
     lands short or long. On arrival (not on an in-page click: the smooth
     scroll of those is left alone) three corrections, 150, 600 and 1400 ms after the
     jump, put the target at its scroll-margin; none runs once the visitor
     has scrolled, pressed a key or touched the page. */
  (function () {
    var touched = false;
    ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach(function (ev) { addEventListener(ev, function () { touched = true; }, { passive: true }); });
    var settle = function () {
      var id = location.hash.slice(1), el;
      try { el = id && document.getElementById(decodeURIComponent(id)); } catch (e) { el = null; }
      if (!el) return;
      touched = false;
      [150, 600, 1400].forEach(function (ms) {
        setTimeout(function () {
          if (touched) return;
          var d = el.getBoundingClientRect().top - (parseFloat(getComputedStyle(el).scrollMarginTop) || 0);
          if (Math.abs(d) > 24) scrollBy({ top: d, behavior: 'instant' });
        }, ms);
      });
    };
    addEventListener('load', settle);
  })();

  /* ---------------- 10 · the sheet and the dock ----------------
     Below 1160px the bar has no room for the six sections: the Menu button
     opens them in #menu, a <dialog> (Esc closes it, focus stays inside and
     comes back to the button); a link in it closes it and the page goes
     there. On a phone (under 680px, where the bar has no button) the dock
     carries the Aperçu and WhatsApp along the screen's foot once the hero is
     behind, and steps aside over the three blocks that carry their own: the
     Aperçu band, the estimator and the contact card (and the footer). */
  (function () {
    var menu = $('#menu'), openBtn = $('[data-menu-open]');
    if (menu && openBtn && typeof menu.showModal === 'function') {
      var shut = function () { if (menu.open) menu.close(); };
      openBtn.addEventListener('click', function () { menu.showModal(); openBtn.setAttribute('aria-expanded', 'true'); });
      menu.addEventListener('close', function () { openBtn.setAttribute('aria-expanded', 'false'); openBtn.focus(); });
      menu.addEventListener('click', function (e) { if (e.target === menu || e.target.closest('[data-menu-close]') || e.target.closest('.st-menu__nav a') || e.target.closest('.st-menu__foot .st-btn')) shut(); });
      // a language switch inside the sheet changes the page behind it, which stays in view
      matchMedia('(min-width:1160px)').addEventListener('change', function (m) { if (m.matches) shut(); });
    } else if (openBtn) openBtn.hidden = true;

    var dock = $('[data-dock]');
    if (dock && IO) {
      var hero = $('#top'), over = {}, heroGone = false;
      var paint = function () {
        var cover = over.preview || over.pricing || over.contact || over.foot;
        dock.classList.toggle('is-on', heroGone && !cover);
      };
      var dio = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.target === hero) heroGone = !e.isIntersecting && e.boundingClientRect.bottom < 0;
          else over[e.target.getAttribute('data-dock-for')] = e.isIntersecting;
        });
        paint();
      });
      dio.observe(hero);
      [['#preview', 'preview'], ['#pricing', 'pricing'], ['#contact', 'contact'], ['.st-foot', 'foot']].forEach(function (p) {
        var el = $(p[0]); if (!el) return; el.setAttribute('data-dock-for', p[1]); dio.observe(el);
      });
    }
  })();

  /* ---------------- 11 · rows ----------------
     What is a grid on a desktop is a row that swipes on a phone (style.css,
     the phone block): [data-row]. Here each row gets its place, "3 / 8"
     and a bar under it, and, while it does scroll, a tab stop and the name
     of its section so the keyboard can move it too. Nothing is added to a
     row that does not scroll. */
  $$('[data-row]').forEach(function (row) {
    var items = [].slice.call(row.children);
    var bar = document.createElement('div');
    bar.className = 'st-rowbar'; bar.setAttribute('aria-hidden', 'true');
    bar.innerHTML = '<span class="st-rowbar__n" dir="ltr"></span><span class="st-rowbar__p"><i></i></span>';
    row.parentNode.insertBefore(bar, row.nextSibling);
    var nEl = bar.firstChild, pEl = bar.lastChild.firstChild, sec = row.closest('section[aria-labelledby]');
    var swipes = function () { return row.scrollWidth > row.clientWidth + 2; };
    var paint = function () {
      if (!swipes()) return;
      var rr = row.getBoundingClientRect(), rtl = root.dir === 'rtl', max = row.scrollWidth - row.clientWidth, k = 0;
      items.forEach(function (it) { var r = it.getBoundingClientRect(); if ((rtl ? r.left >= rr.left - 4 : r.right <= rr.right + 4)) k++; });
      nEl.textContent = Math.max(1, k) + ' / ' + items.length;
      bar.style.setProperty('--p', max > 0 ? Math.abs(row.scrollLeft) / max : 0);
      pEl.parentNode.style.setProperty('--p', max > 0 ? Math.abs(row.scrollLeft) / max : 0);
    };
    var fit = function () {
      if (swipes()) {
        row.tabIndex = 0;
        if (sec && !row.hasAttribute('aria-label') && !row.hasAttribute('aria-labelledby')) { row.setAttribute('aria-labelledby', sec.getAttribute('aria-labelledby')); row.setAttribute('data-named', ''); }
      } else {
        row.removeAttribute('tabindex');
        if (row.hasAttribute('data-named')) { row.removeAttribute('aria-labelledby'); row.removeAttribute('data-named'); }
      }
      paint();
    };
    row.addEventListener('scroll', paint, { passive: true });
    if ('ResizeObserver' in window) new ResizeObserver(fit).observe(row); else { addEventListener('resize', fit); fit(); }
  });

  /* ---------------- 13 · the lessons ----------------
     The money manual: six lessons as tabs ([data-ls-tab] shows
     [data-ls-panel]; the arrow keys, Home and End walk the tabs, as a
     tablist does). In a lesson: [data-pick] shows one explanation at a time
     ([data-pick-b] picks [data-pick-p]); [data-calc] works a figure out of
     the visitor's own numbers (rate: what to keep plus costs, grossed up for
     the tax share, over the days billed; treso: savings over what a month
     costs beyond what it brings); [data-ls-a] are the answers, the one
     marked "ok" stamps the lesson. Stamps are kept on this device only
     (localStorage 'numidea-lessons', an array of lesson ids; a second set
     of lessons names itself, data-ls="jeu", and keeps 'numidea-lessons-jeu')
     and sent nowhere. A set may also show what each stamp earned
     ([data-ls-earn="<id>"] gets is-earned), how far it is (--n on the set,
     for a bar) and something for the whole set ([data-ls-all]). Without scripts every panel is laid out and no question shows
     (style.css). Nothing here moves on its own; everything answers a press. */
  $$('[data-ls]').forEach(function (ls) {
    var tabs = $$('[data-ls-tab]', ls), panels = $$('[data-ls-panel]', ls), count = $('[data-ls-count]', ls);
    var KEY = 'numidea-lessons' + (ls.getAttribute('data-ls') ? '-' + ls.getAttribute('data-ls') : ''), done = [];
    try { done = JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { done = []; }
    if (!Array.isArray(done)) done = [];
    var show = function (id, focus) {
      tabs.forEach(function (b) { var on = b.getAttribute('data-ls-tab') === id; b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1; if (on && focus) b.focus(); });
      panels.forEach(function (p) { p.hidden = p.getAttribute('data-ls-panel') !== id; });
    };
    var stamps = function () {
      tabs.forEach(function (b) {
        var on = done.indexOf(b.getAttribute('data-ls-tab')) > -1;
        $('[data-ls-stamp]', b).hidden = !on; $('[data-ls-done]', b).hidden = !on;
      });
      var n = tabs.filter(function (b) { return done.indexOf(b.getAttribute('data-ls-tab')) > -1; }).length;
      if (count) count.textContent = String(n);
      $$('[data-ls-earn]', ls).forEach(function (x) { x.classList.toggle('is-earned', done.indexOf(x.getAttribute('data-ls-earn')) > -1); });
      $$('[data-ls-all]', ls).forEach(function (x) { x.hidden = n < tabs.length; });
      if (ls.hasAttribute('data-ls-bar')) ls.style.setProperty('--n', String(n));
    };
    tabs.forEach(function (b, i) {
      b.addEventListener('click', function () { show(b.getAttribute('data-ls-tab')); emit('numidea:tab', { id: b.getAttribute('data-ls-tab') }); });
      b.addEventListener('keydown', function (e) {
        var rtl = root.getAttribute('dir') === 'rtl', n = tabs.length;
        var to = e.key === 'Home' ? 0 : e.key === 'End' ? n - 1
          : e.key === 'ArrowRight' ? i + (rtl ? -1 : 1) : e.key === 'ArrowLeft' ? i + (rtl ? 1 : -1) : null;
        if (to === null) return;
        e.preventDefault(); show(tabs[(to + n) % n].getAttribute('data-ls-tab'), true); emit('numidea:tab', { id: tabs[(to + n) % n].getAttribute('data-ls-tab') });
      });
    });
    panels.forEach(function (p) {
      var id = p.getAttribute('data-ls-panel');
      // one explanation at a time
      $$('[data-pick]', p).forEach(function (pk) {
        var bs = $$('[data-pick-b]', pk), ps = $$('[data-pick-p]', pk);
        var pick = function (k) {
          bs.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-pick-b') === k)); });
          ps.forEach(function (x) { x.hidden = x.getAttribute('data-pick-p') !== k; });
        };
        bs.forEach(function (b) { b.addEventListener('click', function () { pick(b.getAttribute('data-pick-b')); }); });
        pick('0');
      });
      // a figure from the visitor's own numbers
      $$('[data-calc]', p).forEach(function (c) {
        var kind = c.getAttribute('data-calc');
        var val = function (f) { var v = Number($('[data-f="' + f + '"]', c).value); return isFinite(v) && v > 0 ? v : 0; };
        var out = function (k, v) { var o = $('[data-o="' + k + '"]', c); if (o && o.textContent !== v) o.textContent = v; };
        var grp = function (n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, lang === 'en' ? ',' : ' '); };
        var work = function () {
          if (kind === 'rate') {
            var days = Math.max(1, val('days')), tax = Math.min(90, val('tax')) / 100;
            var day = (val('net') + val('costs')) / (1 - tax) / days;
            out('days', String(days)); out('tax', String(Math.round(tax * 100))); out('day', grp(day)); out('hour', grp(day / 7));
          } else {
            var gap = val('spend') - val('inc'), fine = gap <= 0;
            $('[data-o-wrap="months"]', c).hidden = fine; $('[data-o-wrap="fine"]', c).hidden = !fine;
            if (!fine) { var mth = val('save') / gap; out('months', mth >= 100 ? '99+' : (Math.round(mth * 10) / 10).toString().replace('.', lang === 'en' ? '.' : ',')); }
          }
        };
        $$('[data-f]', c).forEach(function (i) { i.addEventListener('input', work); });
        work(); onLang.push(work);
      });
      // the question
      var ok = $('[data-ls-ok]', p), no = $('[data-ls-no]', p), as = $$('[data-ls-a]', p);
      as.forEach(function (a) {
        a.addEventListener('click', function () {
          var right = a.getAttribute('data-ls-a') === 'ok';
          as.forEach(function (x) { x.classList.remove('is-right', 'is-wrong'); x.setAttribute('aria-pressed', String(x === a)); });
          a.classList.add(right ? 'is-right' : 'is-wrong');
          ok.hidden = !right; no.hidden = right;
          emit('numidea:lesson', { id: id, right: right, first: right && done.indexOf(id) < 0 });
          if (right && done.indexOf(id) < 0) {
            done.push(id);
            try { localStorage.setItem(KEY, JSON.stringify(done)); } catch (e) {}
            stamps();
            var sp = $('[data-ls-tab="' + id + '"] [data-ls-stamp]', ls);
            if (sp && !reduce) { sp.classList.remove('is-stamp'); void sp.offsetWidth; sp.classList.add('is-stamp'); }
          }
        });
      });
    });
    show(tabs[0].getAttribute('data-ls-tab')); stamps();
  });
  // a level's reference ([3]) opens the list of sources it points into (not every browser opens a closed <details> for a link to something inside it)
  $$('.st-jeu__refs a').forEach(function (a) { a.addEventListener('click', function () { var d = $('.st-jeu__src'); if (d) d.open = true; }); });

  /* ---------------- 14 · the reel ----------------
     The motion section's clips ([data-reel], a button around a muted
     <video preload="none">): a poster until asked. With a mouse, resting on
     a tile plays it and leaving stops it; a press (a tap, Enter, Space)
     plays it too and a second press stops it. While the pointer stays or
     the tile was pressed, a clip that ends starts again; nothing has the
     loop attribute and nothing plays that was not asked for. One clip at a
     time. With reduced motion the pointer alone starts nothing: only a
     press does. Stopping puts the poster back (load()). */
  (function () {
    var tiles = $$('[data-reel]');
    if (!tiles.length) return;
    var live = null;
    var stop = function (b) {
      var v = $('video', b);
      b._on = false; b._hover = false;
      b.setAttribute('aria-pressed', 'false'); b.classList.remove('is-on');
      if (!v.paused) v.pause();
      if (v.currentTime > 0 || v.readyState > 0) { try { v.load(); } catch (e) {} }
      if (live === b) live = null;
    };
    var play = function (b) {
      var v = $('video', b);
      if (live && live !== b) stop(live);
      live = b; b.classList.add('is-on');
      var p = v.play();
      if (p && p.catch) p.catch(function () { b.classList.remove('is-on'); });
    };
    tiles.forEach(function (b) {
      var v = $('video', b);
      if (finePointer && !reduce) {
        b.addEventListener('pointerenter', function () { b._hover = true; if (!b._on) play(b); });
        b.addEventListener('pointerleave', function () { b._hover = false; if (!b._on) stop(b); });
      }
      b.addEventListener('click', function () {
        if (b._on) { stop(b); return; }
        b._on = true; b.setAttribute('aria-pressed', 'true'); play(b);
      });
      b.addEventListener('blur', function () { if (b._on && !b._hover) stop(b); });
      v.addEventListener('ended', function () {
        if (b._hover && finePointer) { v.currentTime = 0; v.play(); return; }
        stop(b);
      });
    });
    addEventListener('pagehide', function () { if (live) stop(live); });
  })();

  /* ---------------- 15 · the radio ----------------
     The workshop radio ([data-radio], its tracks in #hub-radio). Nothing is
     fetched and nothing sounds until a press: the <audio> element is made
     on the first one. Play and pause, previous and next, a track picked by
     name, the volume; a track that ends hands over to the next. The track,
     the place in it and the volume are kept on this device ('numidea-radio')
     so the next visit takes up where this one stopped, once play is pressed.
     While it is on and its shelf is out of sight, a small control follows at
     the foot of the screen ([data-radio-chip]); its last key turns the radio
     off. Lock-screen keys where the browser has them (Media Session). The
     only writes without a press are the clock and the bar while it plays. */
  (function () {
    var box = $('[data-radio]'), list = null;
    try { list = JSON.parse($('#hub-radio').textContent); } catch (e) {}
    if (!box || !list || !list.length) return;
    var chip = $('[data-radio-chip]');
    var KEY = 'numidea-radio', st = { i: 0, t: 0, v: 0.6 };
    try { var kept = JSON.parse(localStorage.getItem(KEY) || '{}'); if (kept && typeof kept === 'object') { if (kept.i >= 0 && kept.i < list.length) st.i = kept.i; if (kept.t >= 0) st.t = kept.t; if (kept.v >= 0 && kept.v <= 1) st.v = kept.v; } } catch (e) {}
    var me = $('script[src*="app.js"]'), ver = ((me && /\?v=\d+/.exec(me.getAttribute('src'))) || [''])[0];
    var audio = null, started = false, seen = true, saved = 0;
    var plays = $$('[data-radio-play]'), titles = $$('[data-radio-title]'), picks = $$('[data-radio-pick]', box), vol = $('[data-radio-vol]', box);
    var stateEl = $('[data-radio-state]', box), timeEl = $('[data-radio-time]', box), durEl = $('[data-radio-dur]', box), bar = $('[data-radio-bar]', box);
    var mmss = function (s) { s = Math.max(0, Math.floor(s)); return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); };
    var set = function (el, v) { if (el && el.textContent !== v) el.textContent = v; };
    var on = function () { return !!audio && !audio.paused; };
    var keep = function () { try { localStorage.setItem(KEY, JSON.stringify({ i: st.i, t: audio ? Math.floor(audio.currentTime) : st.t, v: st.v })); } catch (e) {} };
    var paint = function () {
      var name = t('radio.tracks.' + list[st.i].id + '.name'), playing = on();
      titles.forEach(function (n) { set(n, name); });
      set(durEl, mmss(list[st.i].dur));
      picks.forEach(function (b, i) { b.setAttribute('aria-pressed', String(i === st.i)); });
      plays.forEach(function (b) {
        b.setAttribute('aria-pressed', String(playing)); b.setAttribute('aria-label', t(playing ? 'radio.pause' : 'radio.play'));
        $('[data-radio-ico-play]', b).toggleAttribute('hidden', playing); $('[data-radio-ico-pause]', b).toggleAttribute('hidden', !playing);
      });
      var key = playing ? 'radio.onair' : started ? 'radio.paused' : 'radio.idle';
      stateEl.setAttribute('data-i18n', key); set(stateEl, t(key));
      if (box.classList.contains('is-on') !== playing) emit('numidea:radio', { on: playing });
      box.classList.toggle('is-on', playing);
      if (chip) chip.hidden = !(started && !seen);
    };
    var tick = function () {
      var c = audio.currentTime || 0, d = audio.duration || list[st.i].dur;
      set(timeEl, mmss(c)); bar.style.setProperty('--p', Math.min(100, c / d * 100).toFixed(1) + '%');
      if (c - saved > 5 || c < saved) { saved = c; keep(); }
    };
    var session = function () {
      if (!('mediaSession' in navigator) || !window.MediaMetadata) return;
      try {
        navigator.mediaSession.metadata = new MediaMetadata({ title: t('radio.tracks.' + list[st.i].id + '.name'), artist: 'Numidea Labs', album: t('radio.title') });
        navigator.mediaSession.setActionHandler('play', function () { audio.play(); });
        navigator.mediaSession.setActionHandler('pause', function () { audio.pause(); });
        navigator.mediaSession.setActionHandler('nexttrack', function () { go(1, true); });
        navigator.mediaSession.setActionHandler('previoustrack', function () { go(-1, true); });
      } catch (e) {}
    };
    var load = function (i, at) {
      st.i = (i + list.length) % list.length; saved = at || 0;
      audio.src = list[st.i].src + ver;
      if (at > 0) audio.addEventListener('loadedmetadata', function once() { audio.removeEventListener('loadedmetadata', once); if (at < (audio.duration || 1e9) - 3) audio.currentTime = at; });
      set(timeEl, mmss(at || 0)); bar.style.setProperty('--p', '0%');
      session(); paint();
    };
    var ensure = function () {
      if (audio) return;
      audio = new Audio(); audio.preload = 'none'; audio.volume = st.v;
      audio.addEventListener('timeupdate', tick);
      audio.addEventListener('play', paint); audio.addEventListener('pause', function () { keep(); paint(); });
      audio.addEventListener('ended', function () { load(st.i + 1, 0); audio.play().catch(function () {}); });
      audio.addEventListener('error', function () { paint(); });
    };
    var play = function () { var p = audio.play(); if (p && p.catch) p.catch(function () { paint(); }); };
    var toggle = function () {
      ensure();
      if (!started) { started = true; load(st.i, st.t); play(); return; }
      if (audio.paused) play(); else audio.pause();
    };
    var go = function (d, keepPlaying) {
      ensure();
      var was = started && !audio.paused;
      started = true; load(st.i + d, 0);
      if (was || keepPlaying) play(); else keep();
    };
    plays.forEach(function (b) { b.disabled = false; b.addEventListener('click', toggle); });
    $$('[data-radio-next]').forEach(function (b) { b.disabled = false; b.addEventListener('click', function () { go(1, true); }); });
    $$('[data-radio-prev]').forEach(function (b) { b.disabled = false; b.addEventListener('click', function () { go(-1, true); }); });
    picks.forEach(function (b, i) { b.disabled = false; b.addEventListener('click', function () { ensure(); started = true; load(i, 0); play(); }); });
    vol.disabled = false; vol.value = String(Math.round(st.v * 100));
    vol.addEventListener('input', function () { st.v = Math.min(1, Math.max(0, Number(vol.value) / 100)); if (audio) audio.volume = st.v; keep(); });
    $$('[data-radio-off]').forEach(function (b) {
      b.addEventListener('click', function () { if (audio) { audio.pause(); keep(); } started = false; paint(); });
    });
    if (chip && IO) new IntersectionObserver(function (es) { seen = es[0].isIntersecting; if (started) paint(); }).observe(box);
    addEventListener('pagehide', function () { if (audio && started) keep(); });
    // the kept track's name and length, without a write when they are the baked ones
    paint();
    onLang.push(function () { paint(); if (started) session(); });
  })();

  /* ---------------- 12 · each case's faces, as it nears ----------------
     hub/fonts/lazy-<slug>.css holds a case's own faces (the WorkspaceHQ
     ticket's arcade face is lazy-whq.css): a link to it is added once the
     block is within a screen and a half, so a phone at the top of the page
     fetches none of them (21 font files, 364 kB, were asked for at first
     paint). Until it lands the case sets its fallback stack; font-display
     swap does the rest. */
  (function () {
    var me = $('script[src*="app.js"]'), v = ((me && /\?v=\d+/.exec(me.getAttribute('src'))) || [''])[0], done = {};
    var load = function (n) {
      if (done[n]) return; done[n] = 1;
      var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = 'fonts/lazy-' + n + '.css' + v; document.head.appendChild(l);
    };
    var targets = $$('.st-case').map(function (el) { return [el, el.id.replace(/^case-/, '')]; });
    var own = $('.st-own'); if (own) targets.push([own, 'whq']);
    var con = $('.st-est'); if (con) targets.push([con, 'console']);
    var jeu = $('.st-ls--jeu'); if (jeu) targets.push([jeu, 'whq']);   // the course's HUD face, the arcade one
    if (!IO) { targets.forEach(function (t) { load(t[1]); }); return; }
    var fio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { load(e.target.getAttribute('data-fonts')); fio.unobserve(e.target); } });
    }, { rootMargin: '150% 0px' });
    targets.forEach(function (t) { t[0].setAttribute('data-fonts', t[1]); fio.observe(t[0]); });
  })();
})();
