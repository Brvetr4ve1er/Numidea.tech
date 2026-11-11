/* ============================================================
   VOIDSPLUNKER.std — hub interactions (vanilla, no deps)
   1 · the rig: Yasser and Kūro, twenty drawn frames, one loop that ends
   2 · the pose actors: six two-frame figures (section 04b)
   3 · loops: a still swapped for its animation once, on screen
   4 · year
   The rule of the page: nothing moves for longer than five seconds on its
   own. The rig's loop runs for five seconds after the panel is first on
   screen and after every move, click or button, eases out and stops;
   document.getAnimations() is empty once it has. With
   prefers-reduced-motion: reduce the cursor is never followed, nothing
   breathes or drifts, and only a click or a button changes a face (a hard
   cut, no typing in the bubble). Every line he says is written in full in
   #rigSaid (aria-live) as well as typed in the bubble.
   ============================================================ */
(function () {
  'use strict';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = matchMedia('(hover:hover) and (pointer:fine)').matches;
  var rnd = function (a, b) { return a + Math.random() * (b - a); };
  var now = function () { return performance.now(); };

  /* ---------------- 1 · the rig ----------------
     Frames: <img data-yf> and <img data-kf>, stacked; only opacity flips
     (hard cuts). The two base frames are in the page; the eighteen others
     wait in <template id="rigFrames"> and are added once the panel is on
     screen (IntersectionObserver), so a visitor who never scrolls to him
     never fetches them. A frame is shown only once it has loaded: until
     then the one on screen stays.
     The loop (tick) runs while now < S.until; every interaction extends
     S.until by at most WINDOW ms, and in its last EASE ms the breath, the
     lean and the steam fade to nothing, the gaze returns to the middle and
     he settles on his rest frame (base; heavy-eyed when drowsy or at
     night; the held face when one is pinned). Then the frame request stops. */
  var WINDOW = 5000, EASE = 700;
  var panel = document.getElementById('rig');
  if (panel) {
    var yRoot = panel.querySelector('.rig-y'), kRoot = panel.querySelector('.rig-k');
    var yBody = panel.querySelector('[data-ybody]'), kBody = panel.querySelector('[data-kbody]');
    var wisps = [].slice.call(panel.querySelectorAll('[data-wisp]'));
    var bubble = panel.querySelector('[data-ybubble]'), btext = panel.querySelector('[data-ytext]');
    var stateEl = document.getElementById('rigState'), saidEl = document.getElementById('rigSaid');
    var tpl = document.getElementById('rigFrames');
    var Y = {}, K = {};
    var collect = function () {
      [].forEach.call(yRoot.querySelectorAll('[data-yf]'), function (el) { Y[el.getAttribute('data-yf')] = el; });
      [].forEach.call(kRoot.querySelectorAll('[data-kf]'), function (el) { K[el.getAttribute('data-kf')] = el; });
    };
    collect();
    var framesIn = false;
    var loadFrames = function () {
      if (framesIn || !tpl || !('content' in tpl)) return;
      framesIn = true;
      var frag = tpl.content.cloneNode(true);
      [].forEach.call(frag.querySelectorAll('[data-yf]'), function (el) { el.setAttribute('decoding', 'async'); yBody.insertBefore(el, yBody.firstChild); });
      [].forEach.call(frag.querySelectorAll('[data-kf]'), function (el) { el.setAttribute('decoding', 'async'); kBody.insertBefore(el, kBody.firstChild); });
      collect();
    };
    var ready = function (img) { return img && img.complete && img.naturalWidth > 0; };

    var LINES = ['Tu parles à celui qui code.', 'Démo d’abord. Le prix après.', 'Prix fixe. Écrit avant.', 'Il est 2 h. Oui, je réponds.', 'Kūro valide. Ou pas.', 'Ok. On le construit ?'];
    var LBL = { base: 'Idle · coffee no.1', glance: 'Glance ← reading you', 'glance-r': 'Glance → following', up: 'Look up · thinking', smirk: 'Smirk · it works', sip: 'Sip', half: 'Night · tired', talk: 'Talking', drowsy: 'Drowsy', yawn: 'Yawn', laugh: 'Laugh', glasses: 'Glasses up · "ok, watch this"', blink: 'Blink' };

    var t0 = now();
    var S = {
      cur: 'base', kcur: 'base', hold: null, khold: null, blinkAt: null, kBlinkAt: null,
      nextBlink: t0 + 1600, kNext: t0 + rnd(2500, 5000), kEar: t0 + rnd(2500, 4500), kYawnAt: 0,
      mx: .6, my: .5, gaze: 'base', gazeCand: 'base', gazeSince: t0, kgaze: 'base', kgazeAt: 0,
      squash: 0, ksquash: 0, forced: null, night: false, mood: '', raf: 0, until: 0,
      drowsy: false, lastClick: -1e9, lean: 0, say: null, lineIx: 0, lastY: window.scrollY, lastYt: t0
    };
    var flip = function (map, key, n) {
      if (!map[n] || !ready(map[n])) n = 'base';
      if (S[key] === n) return;
      map[S[key]].style.opacity = 0; map[n].style.opacity = 1; S[key] = n;
    };
    var emit = function (m) { if (m !== S.mood) { S.mood = m; if (stateEl) stateEl.textContent = LBL[m] || LBL.base; } };
    var restFrame = function () { return S.forced || (S.drowsy || S.night ? 'half' : 'base'); };
    var gazeTarget = function () { if (S.my < .16) return 'up'; if (S.mx < .33) return 'glance'; if (S.mx > .82) return 'glance-r'; return 'base'; };

    // the loop: start or extend its window (ms at most), never past WINDOW
    var keep = function (ms) {
      loadFrames();
      var n = now();
      S.until = Math.max(S.until, n + Math.min(ms || WINDOW, WINDOW));
      if (!S.raf) S.raf = requestAnimationFrame(tick);
    };

    var startSay = function (text, at) {
      if (!bubble || !text) return;
      var n = now(), t = at || n;
      S.say = { text: text, t0: reduce ? t : t + (Math.random() < .35 ? 750 : 0), shown: 0, done: 0, flapAt: 0, flap: 'base' };
      if (S.say.t0 > n) S.hold = { name: 'glasses', until: S.say.t0 };
      btext.textContent = ''; bubble.classList.add('on');
      if (saidEl) saidEl.innerHTML = '';
      keep(S.say.t0 - n + (reduce ? 0 : text.length * 38) + 2600);
    };
    var endSay = function () { S.say = null; if (bubble) { bubble.classList.remove('on'); } };
    var said = function (text) {
      if (!saidEl || saidEl.textContent === text) return;
      saidEl.textContent = '';
      var q = document.createElement('q'); q.setAttribute('lang', 'fr'); q.textContent = text;
      saidEl.appendChild(document.createTextNode('He said: ')); saidEl.appendChild(q);
    };

    function tick(n) {
      var left = S.until - n;
      if (left <= 0) { settle(); return; }
      var fade = Math.min(1, left / EASE);           // 1 while live, 0 as the window closes
      var live = !reduce;
      if (S.hold && n >= S.hold.until) S.hold = null;
      if (S.khold && n >= S.khold.until) S.khold = null;
      if (S.kYawnAt && n > S.kYawnAt) { S.khold = { name: 'yawn', until: n + 1300 }; S.kYawnAt = 0; }
      // gaze, with a dwell so he never flickers on a threshold; back to the middle as the window closes
      if (fade < 1) { S.mx += (.6 - S.mx) * .12; S.my += (.5 - S.my) * .12; }
      var gt = gazeTarget();
      if (gt !== S.gazeCand) { S.gazeCand = gt; S.gazeSince = n; }
      if (n - S.gazeSince > 110) S.gaze = S.gazeCand;
      // speech: typed at 38 ms a character, the mouth between three frames, shut on punctuation
      var mouth = null;
      if (S.say && n >= S.say.t0) {
        var sy = S.say, len = sy.text.length, k = reduce ? len : Math.min(len, Math.floor((n - sy.t0) / 38));
        if (k !== sy.shown) { sy.shown = k; btext.textContent = sy.text.slice(0, k); }
        if (k < len) {
          var ch = sy.text[k - 1] || '';
          if (/[.,?!…]/.test(ch)) mouth = 'base';
          else { if (n > sy.flapAt) { sy.flap = ['talk-a', 'talk-b', 'talk-a', 'base'][Math.floor(Math.random() * 4)]; sy.flapAt = n + rnd(70, 120); } mouth = sy.flap; }
        } else { if (!sy.done) { sy.done = n; said(sy.text); } if (n - sy.done > 2400) endSay(); }
      }
      // the face
      var mood;
      if (S.hold) mood = S.hold.name;
      else if (S.forced) mood = S.forced;
      else if (mouth) mood = mouth;
      else if (S.say) mood = 'base';
      else if (S.drowsy || S.night) mood = 'half';
      else mood = S.gaze;
      emit(S.say ? 'talk' : S.drowsy ? 'drowsy' : (mood === 'talk-a' || mood === 'talk-b') ? 'talk' : mood);
      if (live && !S.hold && !mouth && n > S.nextBlink && fade === 1) { S.blinkAt = n; S.nextBlink = n + (Math.random() < .2 ? 260 : rnd(2600, 6000)); }
      var f = mood;
      var blinkable = ['sip', 'yawn', 'laugh', 'glasses'].indexOf(mood) < 0;
      if (S.blinkAt != null && blinkable) { var bt = n - S.blinkAt; f = bt < 45 ? 'half' : bt < 135 ? 'blink' : bt < 180 ? 'half' : (S.blinkAt = null, mood); }
      else if (!blinkable) S.blinkAt = null;
      flip(Y, 'cur', f);
      // Kūro: looks where you look, 320 ms late, and at Yasser while he talks
      var kt = S.say ? 'right' : S.mx < .33 ? 'left' : S.mx > .82 ? 'right' : 'base';
      if (kt !== S.kgaze && n - S.kgazeAt > 320) { S.kgaze = kt; S.kgazeAt = n; }
      if (live && !S.khold && n > S.kNext && fade === 1) { S.kBlinkAt = n; S.kNext = n + rnd(3500, 7500); }
      if (live && !S.khold && n > S.kEar && fade === 1) { S.khold = { name: 'ear', until: n + 200 }; S.kEar = n + rnd(2500, 4500); }
      var kf = S.khold ? S.khold.name : S.kgaze;
      if (S.kBlinkAt != null && !S.khold) { if (n - S.kBlinkAt < 170) kf = 'blink'; else S.kBlinkAt = null; }
      flip(K, 'kcur', kf);
      // the body: breath, the lean toward the cursor, the click's squash; all fade with the window
      var br = live ? Math.sin(n / 4200 * Math.PI * 2) * fade : 0;
      var leanT = live ? (S.mx - .6) * 1.6 * fade : 0;
      S.lean += (leanT - S.lean) * .06;
      if (yBody) yBody.style.transform = n < S.squash ? 'scale(1.05,.95)' : 'rotate(' + (S.lean * .6).toFixed(3) + 'deg) translateX(' + (S.lean * 3).toFixed(2) + 'px) scale(' + (1 - br * .003).toFixed(4) + ',' + (1 + br * .009).toFixed(4) + ')';
      if (kBody) kBody.style.transform = n < S.ksquash ? 'scale(1.08,.92)' : 'translateY(' + (br * -1.5).toFixed(2) + 'px) rotate(' + (S.lean * -.8).toFixed(3) + 'deg)';
      var steamOn = live && ['sip', 'yawn', 'glasses'].indexOf(S.cur) < 0;
      for (var i = 0; i < wisps.length; i++) {
        var p = ((n / 2600) + i / wisps.length) % 1, w = wisps[i];
        w.style.opacity = steamOn ? (Math.sin(p * Math.PI) * .7 * fade).toFixed(3) : 0;
        w.style.transform = 'translate(' + (Math.sin(p * 6 + i) * 7 + S.lean * -4 * p).toFixed(1) + 'px,' + (-p * 70).toFixed(1) + 'px) scale(' + (.7 + p * .9).toFixed(2) + ')';
      }
      S.raf = requestAnimationFrame(tick);
    }
    // the window closed: everything at rest, no frame requested
    function settle() {
      S.raf = 0; S.hold = null; S.khold = null; S.blinkAt = null; S.kBlinkAt = null; S.kYawnAt = 0; S.lean = 0;
      S.mx = .6; S.my = .5; S.gaze = S.gazeCand = 'base'; S.kgaze = 'base';
      if (S.say) { if (!S.say.done) said(S.say.text); endSay(); }
      flip(Y, 'cur', restFrame()); flip(K, 'kcur', 'base');
      if (yBody) yBody.style.transform = ''; if (kBody) kBody.style.transform = '';
      for (var i = 0; i < wisps.length; i++) { wisps[i].style.opacity = 0; wisps[i].style.transform = ''; }
      emit(S.drowsy ? 'drowsy' : restFrame());
    }

    var wake = function () {
      var n = now();
      if (S.drowsy) { S.drowsy = false; S.blinkAt = n; S.hold = { name: 'smirk', until: n + 600 }; }
      keep(WINDOW);
    };
    var rig = {
      poke: function () {
        var n = now(); wake();
        S.squash = n + 110; S.ksquash = n + 110;
        if (n - S.lastClick < 2500) { S.hold = { name: 'laugh', until: n + 950 }; S.khold = { name: 'wide', until: n + 800 }; }
        else if (!S.say) { S.hold = { name: 'smirk', until: n + 400 }; startSay(LINES[S.lineIx++ % LINES.length], reduce ? n : n + 400); }
        else { S.hold = { name: 'smirk', until: n + 1300 }; S.khold = { name: 'wide', until: n + 700 }; }
        S.lastClick = n;
      },
      pokeKuro: function () { var n = now(); wake(); S.ksquash = n + 110; S.khold = { name: Math.random() < .5 ? 'wide' : 'ear', until: n + 800 }; },
      say: function () { wake(); if (S.say) endSay(); startSay(LINES[S.lineIx++ % LINES.length]); },
      hold: function (name, ms) { wake(); S.hold = { name: name, until: now() + (ms || 1400) }; },
      kHold: function (name, ms) { keep(WINDOW); S.khold = { name: name, until: now() + (ms || 900) }; },
      blink: function () { keep(1000); S.hold = null; S.blinkAt = now(); },
      sleepy: function () { var n = now(); keep(WINDOW); if (S.drowsy) return; S.drowsy = true; S.hold = { name: 'yawn', until: n + 1200 }; S.kYawnAt = n + 3000; },
      force: function (name) { S.forced = name || null; keep(600); },
      setNight: function (v) { S.night = !!v; keep(600); }
    };

    // the panel on screen: the frames come in and he wakes for five seconds
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { io.disconnect(); loadFrames(); if (!reduce) keep(WINDOW); } });
      }, { threshold: .15 });
      io.observe(panel);
    } else loadFrames();

    yRoot.addEventListener('click', rig.poke);
    kRoot.addEventListener('click', rig.pokeKuro);
    if (!reduce && finePointer) {
      window.addEventListener('pointermove', function (e) {
        S.mx = e.clientX / window.innerWidth; S.my = e.clientY / window.innerHeight;
        if (framesIn) wake();
      }, { passive: true });
      document.addEventListener('pointerleave', function () { S.mx = .6; S.my = .5; });
    }
    // a fast scroll past him: Kūro goes wide for a moment (never with reduced motion)
    if (!reduce) window.addEventListener('scroll', function () {
      var n = now(), v = Math.abs(window.scrollY - S.lastY) / Math.max(16, n - S.lastYt);
      S.lastY = window.scrollY; S.lastYt = n;
      if (v > 3 && framesIn && !S.khold && S.raf) { S.khold = { name: 'wide', until: n + 500 }; keep(900); }
    }, { passive: true });

    // the controls: each button one act; Smirk, Look up and Night are toggles (aria-pressed)
    var ctrls = document.querySelectorAll('.ctrl[data-act]');
    var pressed = function (act, on) {
      [].forEach.call(ctrls, function (b) { if (b.getAttribute('data-act') === act) b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
    };
    [].forEach.call(ctrls, function (b) {
      b.addEventListener('click', function () {
        var act = b.getAttribute('data-act');
        switch (act) {
          case 'say': rig.say(); break;
          case 'glasses': rig.hold('glasses', 750); break;
          case 'sip': rig.hold('sip', 1700); break;
          case 'laugh': rig.hold('laugh', 950); break;
          case 'yawn': rig.hold('yawn', 1200); break;
          case 'blink': rig.blink(); break;
          case 'smirk': case 'up': {
            var nf = S.forced === act ? null : act;
            pressed('smirk', nf === 'smirk'); pressed('up', nf === 'up');
            rig.force(nf); break;
          }
          case 'night': {
            var on = !S.night; rig.setNight(on); pressed('night', on);
            var s = b.querySelector('small'); if (s) s.textContent = on ? 'on' : 'off'; break;
          }
          case 'idle': rig.sleepy(); break;
          case 'kyawn': rig.kHold('yawn', 1300); break;
          case 'kear': rig.kHold('ear', 220); break;
          case 'kwide': rig.kHold('wide', 900); break;
          case 'release': pressed('smirk', false); pressed('up', false); rig.force(null); break;
        }
      });
    });
  }

  /* ---------------- 2 · the pose actors ----------------
     <button class="actor" data-seq="holdA,holdB"> with <img data-pf="a">
     and <img data-pf="b">: the class b shows the second frame. Once, when
     the figure comes on screen, for holdB ms (never with reduced motion);
     on hover while the pointer is over it; on click or Enter for 1.6 ×
     holdB. A hard cut each way, no breath, no schedule. */
  var actors = [].slice.call(document.querySelectorAll('.actor[data-seq]'));
  if (actors.length) {
    actors.forEach(function (el) {
      var hb = Number((el.getAttribute('data-seq') || '3200,700').split(',')[1]) || 700, timer = 0, hover = false;
      var show = function (ms) { el.classList.add('b'); clearTimeout(timer); timer = setTimeout(function () { if (!hover) el.classList.remove('b'); }, ms); };
      el.addEventListener('click', function () { show(hb * 1.6); });
      if (!reduce && finePointer) {
        el.addEventListener('pointerenter', function () { hover = true; el.classList.add('b'); });
        el.addEventListener('pointerleave', function () { hover = false; clearTimeout(timer); el.classList.remove('b'); });
      }
      el.__seen = function () { show(250 + hb); };
    });
    if (!reduce && 'IntersectionObserver' in window) {
      var aio = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { aio.unobserve(e.target); e.target.__seen(); } });
      }, { threshold: .35 });
      actors.forEach(function (el) { aio.observe(el); });
    }
  }

  /* ---------------- 3 · loops ----------------
     Each loop's <img> holds its still (the poster frame) and names its
     animated file in data-anim. Once half of it is on screen the src becomes
     the animation, once: the file plays one time (4 s, under the page's
     five-second rule, scripts/check.mjs 17b) and stops on the frame it
     started from, so it settles back into the still. With reduced motion this
     never observes and never writes; the <picture>'s <source> keeps the still. */
  var loops = [].slice.call(document.querySelectorAll('img[data-anim]'));
  if (loops.length && !reduce && 'IntersectionObserver' in window) {
    var lio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        lio.unobserve(en.target);
        en.target.src = en.target.getAttribute('data-anim');
      });
    }, { threshold: 0.5 });
    loops.forEach(function (im) { lio.observe(im); });
  }

  /* ---------------- 4 · year ---------------- */
  var y = document.getElementById('year');
  if (y) y.textContent = String(new Date().getFullYear());
})();
