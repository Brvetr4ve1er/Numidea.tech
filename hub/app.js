/* ============================================================
   Numidea Labs — the Studio (hub/index.html), vanilla, no deps
   0 · the dictionaries and the language switch
   1 · the sting (00): a first visit's 2.2 s intro, once per session
   2 · the rig (01): Yasser and Kūro, twenty drawn frames
   3 · the pose actors: two-frame figures beside four headings
   4 · reveals, the wedge's cut (02), the speed bar (08)
   5 · process (05): the step at mid-screen
   6 · the estimator (06), on the home's own price model
   7 · brand layers (07) and the FAQ (12)
   8 · the cases' shell (09): tracks, badges, the viewer, and the small
       controls a case may use (see the list there)
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
     cases' badges) come in the page's #hub-fr block. hub/i18n.js holds all
     three languages and is fetched only for a visitor who wants English or
     Arabic (the head script, or the first switch). */
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
    if (d['ui.title']) document.title = d['ui.title'];
    var md = $('meta[name="description"]'); if (md && d['ui.desc']) md.setAttribute('content', d['ui.desc']);
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
  function withDicts(fn) {
    if (window.HUB_I18N) { fn(); return; }
    if (loading) { loading.push(fn); return; }
    loading = [fn];
    var busy = $$('.st-lang button');
    busy.forEach(function (b) { b.setAttribute('aria-busy', 'true'); });
    var s = document.createElement('script');
    var me = $('script[src*="app.js"]');
    s.src = 'i18n.js' + ((me && /\?v=\d+/.exec(me.getAttribute('src'))) || [''])[0];
    s.onload = s.onerror = function () { busy.forEach(function (b) { b.removeAttribute('aria-busy'); }); var q = loading; loading = null; if (window.HUB_I18N) q.forEach(function (f) { f(); }); };
    document.head.appendChild(s);
  }
  $$('.st-lang button').forEach(function (b) {
    b.addEventListener('click', function () {
      var l = b.getAttribute('data-lang');
      try { localStorage.setItem('numidea-lang', l); } catch (e) {}
      withDicts(function () { apply(l); syncUrl(l); });
    });
  });
  // the head script chose EN or AR and fetched the dictionary: apply it, release the paint
  var start = window.NUMIDEA_LANG || 'fr';
  if (start !== 'fr' && window.HUB_I18N) apply(start);
  else if (start !== 'fr') { root.lang = 'fr'; root.dir = 'ltr'; lang = 'fr'; }
  root.removeAttribute('data-i18n-pending');
  // back from the browser's cache after a switch elsewhere: take the stored choice again
  window.addEventListener('pageshow', function (e) {
    if (!e.persisted) return;
    var l = null;
    try { l = localStorage.getItem('numidea-lang'); } catch (x) {}
    if (l && /^(fr|en|ar)$/.test(l) && l !== lang) withDicts(function () { apply(l); });
  });

  /* ---------------- 1 · the sting ----------------
     Shown once per session (sessionStorage 'numidea-sting'), only with
     scripts on and without reduced motion; never in the HTML, so a reader
     without scripts and every crawler get the page as it is. Its timeline
     is CSS (style.css, 00): the rooftop eases in over 2.2 s, the HUD line
     opens, the letters land, the seal stamps, the paper wipes up from
     1.667 s. A click anywhere, Esc or any key jumps to the wipe; whatever
     happens it is gone by 2.6 s. The rig waits for it. */
  var stingDone = [];
  var stinging = false;
  (function () {
    var seen = null;
    try { seen = sessionStorage.getItem('numidea-sting'); } catch (e) { seen = '1'; }
    if (reduce || seen) return;
    try { sessionStorage.setItem('numidea-sting', '1'); } catch (e) {}
    stinging = true;
    var portrait = innerHeight > innerWidth;
    var el = document.createElement('div');
    el.className = 'st-sting';
    el.setAttribute('role', 'presentation');
    var letters = function (w, from) { return w.split('').map(function (c, i) { return '<span class="st-sting__g" style="--i:' + (from + i) + '">' + c + '</span>'; }).join(''); };
    el.innerHTML = '<img class="st-sting__img" alt="" src="img/motion/' + (portrait ? 'sting-916.webp" width="900" height="1600"' : 'sting-169.webp" width="1920" height="1080"') + '>'
      + '<span class="st-sting__bar st-sting__bar--t" aria-hidden="true"></span>'
      + '<span class="st-sting__bar st-sting__bar--b" aria-hidden="true"><span class="st-sting__hud"></span></span>'
      + '<span class="st-sting__word" aria-hidden="true" dir="ltr"><span>' + letters('NUMIDEA', 0) + '</span><span class="st-sting__labs"><span>' + letters('LABS', 0) + '</span><span class="st-sting__seal">夜</span></span></span>'
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
  var afterSting = function (fn) { if (stinging) stingDone.push(fn); else fn(); };

  /* ---------------- 2 · the rig ----------------
     The character bible's rig (hub/bible/app.js 1), with the Studio's
     lines and moods. Frames: <img data-yf> and <img data-kf>, stacked; only
     opacity flips (hard cuts). The two base frames are in the page; the
     eighteen others wait in <template id="rigFrames"> and come in once the
     hero is on screen. The loop (tick) runs while now < S.until; every
     interaction extends S.until by at most WINDOW ms, and in its last EASE
     ms the breath, the lean and the gaze settle and he rests on his base
     frame. Then no frame is requested. A line is typed at 38 ms a
     character in the bubble and written whole in the live region. */
  var WINDOW = 5000, EASE = 700;
  var panel = $('#rig');
  if (panel) (function () {
    var yRoot = $('.st-rig__y', panel), kRoot = $('.st-rig__k', panel);
    var yBody = $('[data-ybody]', panel), kBody = $('[data-kbody]', panel);
    var bubble = $('[data-ybubble]', panel), btext = $('[data-ytext]', panel);
    var moodEl = $('[data-mood]', panel), liveEl = $('[data-live]', panel), saidEl = $('[data-rig-said]', panel);
    var tpl = $('#rigFrames');
    var Y = {}, K = {};
    var collect = function () {
      $$('[data-yf]', yRoot).forEach(function (el) { Y[el.getAttribute('data-yf')] = el; });
      $$('[data-kf]', kRoot).forEach(function (el) { K[el.getAttribute('data-kf')] = el; });
    };
    collect();
    var framesIn = false;
    var loadFrames = function () {
      if (framesIn || !tpl || !('content' in tpl)) return;
      framesIn = true;
      var frag = tpl.content.cloneNode(true);
      $$('[data-yf]', frag).forEach(function (el) { el.setAttribute('decoding', 'async'); yBody.insertBefore(el, yBody.firstChild); });
      $$('[data-kf]', frag).forEach(function (el) { el.setAttribute('decoding', 'async'); kBody.insertBefore(el, kBody.firstChild); });
      collect();
    };
    var ready = function (img) { return img && img.complete && img.naturalWidth > 0; };
    var lines = function () { var a = []; for (var i = 0; t('rig.lines.' + i); i++) a.push(t('rig.lines.' + i)); return a; };
    if (reduce && liveEl) { liveEl.setAttribute('data-i18n', 'hero.still'); liveEl.textContent = t('hero.still'); }

    var t0 = now();
    var S = {
      cur: 'base', kcur: 'base', hold: null, khold: null, blinkAt: null, kBlinkAt: null,
      nextBlink: t0 + 1600, kNext: t0 + rnd(2500, 5000), kEar: t0 + rnd(2500, 4500),
      mx: .6, my: .5, gaze: 'base', gazeCand: 'base', gazeSince: t0, kgaze: 'base', kgazeAt: 0,
      squash: 0, ksquash: 0, mood: 'base', raf: 0, until: 0, lastClick: -1e9, lean: 0, say: null, lineIx: 0
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
    var startSay = function (text, at) {
      if (!bubble || !text) return;
      var n = now(), t1 = at || n;
      S.say = { text: text, t0: t1, shown: 0, done: 0, flapAt: 0, flap: 'base' };
      btext.textContent = reduce ? text : ''; bubble.classList.add('on');
      if (reduce) { said(text); S.say.done = n; }
      keep(t1 - n + (reduce ? 0 : text.length * 38) + 2200);
    };
    var endSay = function () { S.say = null; if (bubble) bubble.classList.remove('on'); };

    function tick(n) {
      var left = S.until - n;
      if (left <= 0) { settle(); return; }
      var fade = Math.min(1, left / EASE), live = !reduce;
      if (S.hold && n >= S.hold.until) S.hold = null;
      if (S.khold && n >= S.khold.until) S.khold = null;
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
      S.raf = requestAnimationFrame(tick);
    }
    function settle() {
      S.raf = 0; S.hold = null; S.khold = null; S.blinkAt = null; S.kBlinkAt = null; S.lean = 0;
      S.mx = .6; S.my = .5; S.gaze = S.gazeCand = 'base'; S.kgaze = 'base';
      if (S.say) { if (!S.say.done) said(S.say.text); endSay(); }
      flip(Y, 'cur', 'base'); flip(K, 'kcur', 'base');
      if (yBody) yBody.style.transform = ''; if (kBody) kBody.style.transform = '';
      emit('base');
    }
    var poke = function () {
      var n = now(); keep(WINDOW);
      S.squash = n + 110; S.ksquash = n + 110;
      if (reduce) { S.hold = { name: 'smirk', until: n + 1200 }; if (!S.say) startSay(lines()[S.lineIx++ % lines().length]); return; }
      if (n - S.lastClick < 2500) { S.hold = { name: 'laugh', until: n + 950 }; S.khold = { name: 'wide', until: n + 800 }; }
      else if (!S.say) { S.hold = { name: 'smirk', until: n + 400 }; startSay(lines()[S.lineIx++ % lines().length], n + 400); }
      else { S.hold = { name: 'smirk', until: n + 1300 }; S.khold = { name: 'wide', until: n + 700 }; }
      S.lastClick = n;
    };
    var pokeKuro = function () { var n = now(); keep(WINDOW); S.ksquash = n + 110; S.khold = { name: Math.random() < .5 ? 'wide' : 'ear', until: n + 800 }; };
    yRoot.addEventListener('click', poke);
    kRoot.addEventListener('click', pokeKuro);
    // on screen, once the sting is gone: the frames come in, he wakes for five seconds and says his first line
    once(panel, .15, function () {
      loadFrames();
      if (reduce) return;
      afterSting(function () { keep(WINDOW); var n = now(); startSay(lines()[S.lineIx++ % lines().length], n + 900); });
    });
    if (!reduce && finePointer) {
      panel.closest('.st-hero').addEventListener('pointermove', function (e) {
        S.mx = e.clientX / innerWidth; S.my = e.clientY / innerHeight;
        if (framesIn && !S.raf) keep(WINDOW);
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
      var sib = [].filter.call(el.parentElement.children, function (c) { return c.hasAttribute('data-reveal'); });
      el.style.setProperty('--d', Math.min(490, Math.max(0, sib.indexOf(el)) * 70) + 'ms');
      el.classList.add('st-rv');
      rio.observe(el);
    });
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
    if (!IO) return;
    var pio = new IntersectionObserver(function (es) {
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

  /* ---------------- 6 · the estimator ----------------
     The home's model, as the build copied it from assets/app.js into
     #hub-prices (types, units, options, rush, exchange rates, maintenance).
     quote() is the home's: the tier's base, each unit over its base size,
     the options it does not already include; a Vitrine never above the
     Studio tier for the same pages; rush ×1.25 and weeks ×0.7, never
     under two thirds; rounded as a person would say it. Figures are
     written as the home writes them in each language. */
  var est = $('[data-est]');
  var P = null;
  try { P = JSON.parse($('#hub-prices').textContent); } catch (e) {}
  if (est && P) (function () {
    var M = P.model, O = P.opts;
    var roundTo = function (n) { var g = n >= 500000 ? 50000 : n >= 150000 ? 10000 : 5000; return Math.round(n / g) * g; };
    var rushWeeks = function (w) { return Math.max(Math.ceil(w * 2 / 3), Math.round(w * P.rush[1])); };
    var tally = function (key, n, opts) {
      var m = M[key], over = Math.max(0, n - m.base_u), incl = m.incl || [];
      var q = { lo: m.base[0] + over * m.unit[0], hi: m.base[1] + over * m.unit[1], wLo: m.weeks[0], wHi: m.weeks[1] };
      opts.forEach(function (o) { var p = O[o]; if (!p || incl.indexOf(o) > -1) return; q.lo += p.add[0]; q.hi += p.add[1]; q.wLo += p.weeks[0]; q.wHi += p.weeks[1]; });
      return q;
    };
    var quote = function (key, n, opts, rush) {
      var q = tally(key, n, opts);
      if (key === 'vitrine') { var s = tally('surmesure', n, opts); q.lo = Math.min(q.lo, s.lo); q.hi = Math.min(q.hi, s.hi); q.wLo = Math.min(q.wLo, s.wLo); q.wHi = Math.min(q.wHi, s.wHi); }
      if (rush) { q.lo *= P.rush[0]; q.hi *= P.rush[0]; q.wLo = rushWeeks(q.wLo); q.wHi = rushWeeks(q.wHi); }
      q.lo = roundTo(q.lo); q.hi = roundTo(q.hi);
      return q;
    };
    var range = function (lo, hi, c) {
      var en = lang === 'en', grp = function (n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, en ? ',' : ' '); };
      var dash = en ? '⁠–⁠' : ' –⁠ ';
      var tidy = function (n) { var g = c === 'DZD' ? (n >= 1e6 ? 50000 : n >= 150000 ? 10000 : 5000) : (n >= 10000 ? 500 : n >= 1000 ? 100 : 10); return Math.max(g, Math.round(n / g) * g); };
      var a = c === 'DZD' ? lo : tidy(lo / P.fx[c]), b = c === 'DZD' ? hi : tidy(hi / P.fx[c]);
      var sym = c === 'DZD' ? t('pricing.cur') : c === 'EUR' ? '€' : '$';
      return en && c !== 'DZD' ? sym + grp(a) + dash + grp(b) : grp(a) + dash + grp(b) + ' ' + sym;
    };
    var st = { type: 'vitrine', n: M.vitrine.def, opts: [], rush: false, care: false };
    var size = $('#est-size'), nOut = $('[data-est-n]'), unit = $('[data-est-unit]');
    var dz = $('[data-est-dz]'), eu = $('[data-est-eu]'), us = $('[data-est-us]'), w = $('[data-est-w]');
    var careBox = $('[data-est-care]'), careV = $('[data-est-care-v]');
    var kuro = $('[data-est-kuro]'), kImgs = $$('img', kuro), kLine = $('[data-est-line]');
    var shown = null, tw = 0, tier = 0;
    var paint = function (lo, hi) {
      dz.textContent = range(lo, hi, 'DZD'); eu.textContent = range(lo, hi, 'EUR'); us.textContent = range(lo, hi, 'USD');
    };
    var render = function (animate) {
      var m = M[st.type], q = quote(st.type, st.n, st.opts, st.rush);
      nOut.textContent = st.n;
      size.setAttribute('aria-valuetext', st.n + ' ' + t('pricing.units.' + m.u));
      unit.setAttribute('data-i18n', 'pricing.units.' + m.u); unit.textContent = t('pricing.units.' + m.u);
      w.textContent = q.wLo + '–' + q.wHi;
      careBox.hidden = !st.care; careV.textContent = range(P.retainer[0], P.retainer[1], 'DZD');
      var nt = q.hi < 200000 ? 0 : q.hi < 600000 ? 1 : 2;
      if (nt !== tier) { tier = nt; kImgs.forEach(function (im) { im.classList.toggle('is-active', Number(im.getAttribute('data-tier')) === tier); }); }
      kLine.setAttribute('data-i18n', 'pricing.kuro.' + tier); kLine.textContent = t('pricing.kuro.' + tier);
      kImgs[0].alt = ''; kImgs[tier].alt = t('pricing.kuroAlt');
      cancelAnimationFrame(tw);
      var from = shown || { lo: q.lo, hi: q.hi };
      shown = { lo: q.lo, hi: q.hi };
      if (!animate || reduce) { paint(q.lo, q.hi); return; }
      kuro.classList.add('is-squash'); setTimeout(function () { kuro.classList.remove('is-squash'); }, 110);
      var t1 = now(), D = 520;
      var step = function (n) {
        var p = Math.min(1, (n - t1) / D), e = 1 - Math.pow(1 - p, 4);
        var r = function (a, b) { return Math.round((a + (b - a) * e) / 1000) * 1000; };
        if (p < 1) { paint(r(from.lo, q.lo), r(from.hi, q.hi)); tw = requestAnimationFrame(step); } else paint(q.lo, q.hi);
      };
      tw = requestAnimationFrame(step);
    };
    // which options apply to the type (opts), which it already includes (incl)
    var optBtns = $$('[data-opt]', est);
    var setType = function (k) {
      st.type = k; var m = M[k];
      st.n = m.def; size.min = m.min; size.max = m.max; size.step = m.step; size.value = m.def;
      st.opts = st.opts.filter(function (o) { return !m.opts || m.opts.indexOf(o) > -1; });
      $$('[data-type]', est).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-type') === k)); });
      optBtns.forEach(function (b) {
        var o = b.getAttribute('data-opt'), incl = (m.incl || []).indexOf(o) > -1, off = m.opts && m.opts.indexOf(o) < 0;
        b.disabled = incl || !!off;
        b.setAttribute('aria-pressed', String(incl || st.opts.indexOf(o) > -1));
        var tag = $('[data-incl]', b);
        if (incl && !tag) { tag = document.createElement('span'); tag.setAttribute('data-incl', ''); b.appendChild(tag); }
        if (tag) { tag.hidden = !incl; tag.textContent = ' (' + t('pricing.included') + ')'; }
      });
    };
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
    var care = $('[data-care]', est);
    care.addEventListener('click', function () { st.care = !st.care; care.setAttribute('aria-pressed', String(st.care)); render(false); });
    setType('vitrine'); render(false);
    onLang.push(function () { var n = st.n; setType(st.type); st.n = n; size.value = n; render(false); });
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
      var bar = $('[data-track-bar]', cs);
      var prog = function () { var max = track.scrollWidth - track.clientWidth; if (bar) bar.style.setProperty('--p', max > 0 ? Math.abs(track.scrollLeft) / max : 0); };
      track.addEventListener('scroll', prog, { passive: true }); prog();
      var by = function (d) { track.scrollBy({ left: d * track.clientWidth * .8, behavior: reduce ? 'auto' : 'smooth' }); };
      $$('[data-track-prev]', cs).forEach(function (b) { b.addEventListener('click', function () { by(-1); }); });
      $$('[data-track-next]', cs).forEach(function (b) { b.addEventListener('click', function () { by(1); }); });
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

  // the viewer: one <dialog> for every case's posters; Esc, a click or the button close it
  var lb = $('#lightbox');
  if (lb && typeof lb.showModal === 'function') {
    var lbImg = document.createElement('img'), opener = null;
    lbImg.alt = '';
    lb.insertBefore(lbImg, lb.firstChild);
    document.addEventListener('click', function (e) {
      var z = e.target.closest && e.target.closest('[data-zoom]');
      if (!z) return;
      e.preventDefault();
      var im = $('img', z);
      opener = z; lbImg.src = z.getAttribute('data-zoom'); lbImg.alt = im ? im.alt : '';
      lb.setAttribute('aria-label', lbImg.alt || t('case.zoom'));
      lb.showModal();
    });
    lb.addEventListener('click', function (e) { if (e.target === lb || e.target === lbImg || e.target.closest('[data-lb-close]')) lb.close(); });
    lb.addEventListener('close', function () { if (opener) opener.focus(); opener = null; });
  }
})();
