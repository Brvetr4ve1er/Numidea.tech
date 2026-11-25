/* ============================================================
   VOIDSPLUNKER.std — hub interactions (vanilla, no deps)
   1 · the rig: Yasser and Kūro, twenty drawn frames, one loop that ends
   1b · talk to him: a reply is a face, a beat of acting, an emote, a cut-in and Kūro's card
   2 · the pose actors: six two-frame figures (section 04b)
   2b · the turn: five drawn views, dragged or picked (section 02)
   3 · loops: a still swapped for its animation once, on screen
   4 · year
   The rule of the page: nothing moves for longer than five seconds on its
   own. The rig's loop runs for seven beats (4.7 s) after the panel is first
   on screen and after every move, click or button, eases out and stops;
   document.getAnimations() is empty once it has. With
   prefers-reduced-motion: reduce the cursor is never followed, nothing
   breathes or drifts, and only a click or a button changes a face (a hard
   cut, no typing in the bubble). Every line he says is written in full in
   #rigSaid (aria-live) as well as typed in the bubble. Every time here
   sits on the site's 90 BPM grid (eighths of a beat, sixteenths for the
   drawn acting: typing, blinks), and the loop stops the moment the panel
   leaves the screen.
   ============================================================ */
(function () {
  'use strict';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = matchMedia('(hover:hover) and (pointer:fine)').matches;
  var rnd = function (a, b) { return a + Math.random() * (b - a); };
  var now = function () { return performance.now(); };
  // the site's tempo (the stylesheets' --m-* tokens): 90 BPM, a beat of 667 ms;
  // M(n) is n eighths of a beat, Q() rounds a drawn time to the nearest sixteenth
  var BEAT = 2000 / 3;
  var M = function (n) { return Math.round(n * BEAT / 8); };
  var Q = function (ms) { var s = BEAT / 16; return Math.round(Math.round(ms / s) * s); };

  /* ---------------- 1 · the rig ----------------
     Frames: <img data-yf> and <img data-kf>, stacked; only opacity flips
     (hard cuts). The two base frames are in the page; the eighteen others
     wait in <template id="rigFrames"> and are added once the panel is on
     screen (IntersectionObserver), so a visitor who never scrolls to him
     never fetches them. A frame is shown only once it has loaded and been
     decoded (img.decode()), so its first cut never paints half a picture:
     until then the one on screen stays.
     The loop (tick) runs while now < S.until; every interaction extends
     S.until by at most WINDOW ms, and in its last EASE ms the breath, the
     lean and the steam fade to nothing, the gaze returns to the middle and
     he settles on his rest frame (base; heavy-eyed when drowsy or at
     night; the held face when one is pinned). Then the frame request stops.
     WINDOW is seven beats (4667 ms), EASE one (667 ms). */
  var WINDOW = M(56), EASE = M(8);
  var TYPE = Q(42);   // one character typed per sixteenth of a beat
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
    // the two base frames are in the page from the start: they are the fallback, always ready
    if (Y.base) Y.base.__ok = true; if (K.base) K.base.__ok = true;
    var framesIn = false;
    var decoded = function (el) {
      var ok = function () { el.__ok = true; };
      if (el.decode) el.decode().then(ok, function () { if (el.complete && el.naturalWidth > 0) ok(); });
      else if (el.complete && el.naturalWidth > 0) ok(); else el.addEventListener('load', ok);
    };
    var loadFrames = function () {
      if (framesIn || !tpl || !('content' in tpl)) return;
      framesIn = true;
      var frag = tpl.content.cloneNode(true), added = [];
      [].forEach.call(frag.querySelectorAll('[data-yf]'), function (el) { el.setAttribute('decoding', 'async'); yBody.insertBefore(el, yBody.firstChild); added.push(el); });
      [].forEach.call(frag.querySelectorAll('[data-kf]'), function (el) { el.setAttribute('decoding', 'async'); kBody.insertBefore(el, kBody.firstChild); added.push(el); });
      collect();
      added.forEach(decoded);
    };
    var ready = function (img) { return !!(img && img.__ok); };

    var LINES = ['Tu parles à celui qui code.', 'Démo d’abord. Le prix après.', 'Prix fixe. Écrit avant.', 'Il est 2 h. Oui, je réponds.', 'Kūro valide. Ou pas.', 'Ok. On le construit ?'];
    var LBL = { base: 'Idle · coffee no.1', glance: 'Glance ← reading you', 'glance-r': 'Glance → following', up: 'Look up · thinking', smirk: 'Smirk · it works', sip: 'Sip', half: 'Night · tired', talk: 'Talking', drowsy: 'Drowsy', yawn: 'Yawn', laugh: 'Laugh', glasses: 'Glasses up · "ok, watch this"', blink: 'Blink' };

    var t0 = now();
    var S = {
      cur: 'base', kcur: 'base', hold: null, khold: null, blinkAt: null, kBlinkAt: null,
      nextBlink: t0 + M(20), kNext: t0 + Q(rnd(2667, 5000)), kEar: t0 + Q(rnd(2667, 4667)), kYawnAt: 0,
      mx: .6, my: .5, gaze: 'base', gazeCand: 'base', gazeSince: t0, kgaze: 'base', kgazeAt: 0,
      squash: 0, ksquash: 0, forced: null, night: false, mood: '', raf: 0, until: 0,
      drowsy: false, lastClick: -1e9, lean: 0, say: null, lineIx: 0, lastY: window.scrollY, lastYt: t0
    };
    var flip = function (map, key, n) {
      if (!map[n] || !ready(map[n])) n = 'base';
      if (S[key] === n) return;
      map[S[key]].style.opacity = 0; map[n].style.opacity = 1; S[key] = n;
    };
    // the state label: its box holds its width (style.css), and a new label
    // comes in at the bottom of a short dip in its opacity, a quarter beat
    // after the change; a change inside that dip only replaces the text due
    var label = { text: '', timer: 0 };
    var emit = function (m) {
      if (m === S.mood) return;
      S.mood = m;
      if (!stateEl) return;
      label.text = LBL[m] || LBL.base;
      if (reduce) { stateEl.textContent = label.text; return; }
      if (label.timer) return;
      stateEl.classList.add('swap');
      label.timer = setTimeout(function () { label.timer = 0; stateEl.textContent = label.text; stateEl.classList.remove('swap'); }, M(2));
    };
    var restFrame = function () { return S.forced || (S.drowsy || S.night ? 'half' : 'base'); };
    var gazeTarget = function () { if (S.my < .16) return 'up'; if (S.mx < .33) return 'glance'; if (S.mx > .82) return 'glance-r'; return 'base'; };

    // the loop: start or extend its window (ms at most), never past WINDOW
    var keep = function (ms) {
      loadFrames();
      var n = now();
      S.until = Math.max(S.until, n + Math.min(ms || WINDOW, WINDOW));
      if (!S.raf) S.raf = requestAnimationFrame(tick);
    };

    // the bubble holds the whole line from the start: the typed part, then
    // the rest in a hidden span (.ghost), so its box takes its final size and
    // wraps once; typing moves the characters from one span to the other.
    // Its width is read once, with the line whole, and held: the moving
    // boundary between the spans breaks a kerning pair, which would
    // otherwise nudge the box by a pixel. It shows with the first character,
    // not with the click.
    var typed = null, ghost = null;
    var writeLine = function (text, k) {
      if (!typed) {
        btext.textContent = '';
        typed = document.createElement('span'); ghost = document.createElement('span'); ghost.className = 'ghost';
        btext.appendChild(typed); btext.appendChild(ghost);
      }
      typed.textContent = text.slice(0, k); ghost.textContent = text.slice(k);
    };
    var startSay = function (text, at) {
      if (!bubble || !text) return;
      var n = now(), t = at || n;
      S.say = { text: text, t0: reduce ? t : t + (Math.random() < .35 ? M(9) : 0), shown: 0, done: 0, flapAt: 0, flap: 'base', on: false };
      if (S.say.t0 > n) S.hold = { name: 'glasses', until: S.say.t0 };
      bubble.classList.remove('on');
      bubble.style.width = '';
      writeLine(text, 0);
      bubble.style.width = Math.ceil(parseFloat(getComputedStyle(bubble).width)) + 'px';
      if (saidEl) saidEl.innerHTML = '';
      keep(S.say.t0 - n + (reduce ? 0 : text.length * TYPE) + M(32));
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
      if (S.kYawnAt && n > S.kYawnAt) { S.khold = { name: 'yawn', until: n + M(16) }; S.kYawnAt = 0; }
      // gaze, with a dwell so he never flickers on a threshold; back to the middle as the window closes
      if (fade < 1) { S.mx += (.6 - S.mx) * .12; S.my += (.5 - S.my) * .12; }
      var gt = gazeTarget();
      if (gt !== S.gazeCand) { S.gazeCand = gt; S.gazeSince = n; }
      if (n - S.gazeSince > Q(125)) S.gaze = S.gazeCand;
      // speech: typed at a sixteenth of a beat (42 ms) a character, the first
      // one with the bubble; the mouth between three frames, each held two or
      // three sixteenths (83 or 125 ms), shut on punctuation
      var mouth = null;
      if (S.say && n >= S.say.t0) {
        var sy = S.say, len = sy.text.length, k = reduce ? len : Math.min(len, 1 + Math.floor((n - sy.t0) / TYPE));
        if (k !== sy.shown) { sy.shown = k; writeLine(sy.text, k); }
        if (!sy.on) { sy.on = true; bubble.classList.add('on'); }
        if (k < len) {
          var ch = sy.text[k - 1] || '';
          if (/[.,?!…]/.test(ch)) mouth = 'base';
          else { if (n > sy.flapAt) { sy.flap = ['talk-a', 'talk-b', 'talk-a', 'base'][Math.floor(Math.random() * 4)]; sy.flapAt = n + (Math.random() < .5 ? M(1) : Q(125)); } mouth = sy.flap; }
        } else { if (!sy.done) { sy.done = n; said(sy.text); } if (n - sy.done > M(28)) endSay(); }
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
      // a blink every four to nine beats, now and then a double (the second three eighths later)
      if (live && !S.hold && !mouth && n > S.nextBlink && fade === 1) { S.blinkAt = n; S.nextBlink = n + (Math.random() < .2 ? M(3) : Q(rnd(2667, 6000))); }
      var f = mood;
      var blinkable = ['sip', 'yawn', 'laugh', 'glasses'].indexOf(mood) < 0;
      if (S.blinkAt != null && blinkable) { var bt = n - S.blinkAt; f = bt < Q(42) ? 'half' : bt < Q(125) ? 'blink' : bt < M(2) ? 'half' : (S.blinkAt = null, mood); }
      else if (!blinkable) S.blinkAt = null;
      flip(Y, 'cur', f);
      // Kūro: looks where you look, half a beat (333 ms) late, and at Yasser while he talks
      var kt = S.say ? 'right' : S.mx < .33 ? 'left' : S.mx > .82 ? 'right' : 'base';
      if (kt !== S.kgaze && n - S.kgazeAt > M(4)) { S.kgaze = kt; S.kgazeAt = n; }
      if (live && !S.khold && n > S.kNext && fade === 1) { S.kBlinkAt = n; S.kNext = n + Q(rnd(3333, 7333)); }
      if (live && !S.khold && n > S.kEar && fade === 1) { S.khold = { name: 'ear', until: n + M(3) }; S.kEar = n + Q(rnd(2667, 4667)); }
      var kf = S.khold ? S.khold.name : S.kgaze;
      if (S.kBlinkAt != null && !S.khold) { if (n - S.kBlinkAt < M(2)) kf = 'blink'; else S.kBlinkAt = null; }
      flip(K, 'kcur', kf);
      // the body: breath (six beats a breath), the lean toward the cursor, the click's squash; all fade with the window
      var br = live ? Math.sin(n / M(48) * Math.PI * 2) * fade : 0;
      var leanT = live ? (S.mx - .6) * 1.6 * fade : 0;
      S.lean += (leanT - S.lean) * .06;
      if (yBody) yBody.style.transform = n < S.squash ? 'scale(1.05,.95)' : 'rotate(' + (S.lean * .6).toFixed(3) + 'deg) translateX(' + (S.lean * 3).toFixed(2) + 'px) scale(' + (1 - br * .003).toFixed(4) + ',' + (1 + br * .009).toFixed(4) + ')';
      if (kBody) kBody.style.transform = n < S.ksquash ? 'scale(1.08,.92)' : 'translateY(' + (br * -1.5).toFixed(2) + 'px) rotate(' + (S.lean * -.8).toFixed(3) + 'deg)';
      var steamOn = live && ['sip', 'yawn', 'glasses'].indexOf(S.cur) < 0;
      for (var i = 0; i < wisps.length; i++) {
        var p = ((n / M(32)) + i / wisps.length) % 1, w = wisps[i];
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

    // the pointer or the page wakes him only while he is on screen (visible,
    // kept by the panel's observer below); a click or a button always does
    var visible = !('IntersectionObserver' in window);
    var wake = function () {
      var n = now();
      if (S.drowsy) { S.drowsy = false; S.blinkAt = n; S.hold = { name: 'smirk', until: n + M(7) }; }
      keep(WINDOW);
    };
    // the holds, in eighths of a beat: a press squashes for one (83 ms),
    // the smirk before a line lasts five (417), the laugh a beat and a half
    var rig = {
      poke: function () {
        var n = now(); wake();
        S.squash = n + M(1); S.ksquash = n + M(1);
        if (n - S.lastClick < M(30)) { S.hold = { name: 'laugh', until: n + M(12) }; S.khold = { name: 'wide', until: n + M(10) }; }
        else if (!S.say) { S.hold = { name: 'smirk', until: n + M(5) }; startSay(LINES[S.lineIx++ % LINES.length], reduce ? n : n + M(4)); }
        else { S.hold = { name: 'smirk', until: n + M(16) }; S.khold = { name: 'wide', until: n + M(8) }; }
        S.lastClick = n;
      },
      pokeKuro: function () { var n = now(); wake(); S.ksquash = n + M(1); S.khold = { name: Math.random() < .5 ? 'wide' : 'ear', until: n + M(10) }; },
      say: function () { wake(); if (S.say) endSay(); startSay(LINES[S.lineIx++ % LINES.length]); },
      speak: function (text, delay) { wake(); if (S.say) endSay(); startSay(text, now() + (delay || 0)); },
      squash: function () { wake(); S.squash = now() + M(1); },
      hold: function (name, ms) { wake(); S.hold = { name: name, until: now() + (ms || M(16)) }; },
      kHold: function (name, ms) { keep(WINDOW); S.khold = { name: name, until: now() + (ms || M(11)) }; },
      blink: function () { keep(M(12)); S.hold = null; S.blinkAt = now(); },
      sleepy: function () { var n = now(); keep(WINDOW); if (S.drowsy) return; S.drowsy = true; S.hold = { name: 'yawn', until: n + M(14) }; S.kYawnAt = n + M(36); },
      force: function (name) { S.forced = name || null; keep(M(7)); },
      setNight: function (v) { S.night = !!v; keep(M(7)); }
    };

    // the panel on screen: the first time, the frames come in and he wakes
    // for one window; the observer stays, so the moment he leaves the screen
    // the window closes (tick settles him on its next frame) and nothing is
    // drawn for a rig nobody sees
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          visible = e.isIntersecting;
          if (visible) { if (!framesIn) { loadFrames(); if (!reduce) keep(WINDOW); } }
          else if (S.raf) S.until = now();
        });
      }, { threshold: .15 });
      io.observe(panel);
    } else loadFrames();

    yRoot.addEventListener('click', rig.poke);
    kRoot.addEventListener('click', rig.pokeKuro);
    if (!reduce && finePointer) {
      window.addEventListener('pointermove', function (e) {
        S.mx = e.clientX / window.innerWidth; S.my = e.clientY / window.innerHeight;
        if (framesIn && visible) wake();
      }, { passive: true });
      document.addEventListener('pointerleave', function () { S.mx = .6; S.my = .5; });
    }
    // a fast scroll past him: Kūro goes wide for a moment (never with reduced motion, never off screen)
    if (!reduce) window.addEventListener('scroll', function () {
      var n = now(), v = Math.abs(window.scrollY - S.lastY) / Math.max(16, n - S.lastYt);
      S.lastY = window.scrollY; S.lastYt = n;
      if (v > 3 && framesIn && visible && !S.khold && S.raf) { S.khold = { name: 'wide', until: n + M(6) }; keep(M(11)); }
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
          case 'glasses': rig.hold('glasses', M(9)); break;
          case 'sip': rig.hold('sip', M(20)); break;
          case 'laugh': rig.hold('laugh', M(12)); break;
          case 'yawn': rig.hold('yawn', M(14)); break;
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
          case 'kyawn': rig.kHold('yawn', M(16)); break;
          case 'kear': rig.kHold('ear', M(3)); break;
          case 'kwide': rig.kHold('wide', M(10)); break;
          case 'release': pressed('smirk', false); pressed('up', false); rig.force(null); break;
        }
      });
    });

    /* ---------------- 1b · talk to him (the game layer) ----------------
       A reply is four things, and each has its picture already on this page:
       · emotion: one of twelve, each with its face (section 03's twelve, the
         portrait in the talk box), a beat of acting on the rig before he
         speaks (laugh, look up, glasses, sip, yawn, a squash…) and an emote
         over his head (! ? ♪ … z, the sweat drop, the anger mark);
       · act: a gesture, played as a cut-in band for two beats (section 04's
         poses and actors, two-frame actors cut on the eighth; "turn" plays
         section 02's five views once round);
       · kuro: Kūro's answer, his card in the talk box (section 05's ten)
         while the rig's Kūro goes wide, flicks an ear or yawns;
       · line: typed in the bubble, the mouth on the existing flaps.
       The three choices are written here and never leave the page. Free text
       goes to /api/yasser (an AI voice, model named in that file; one short JSON reply,
       the last six turns at most); if it cannot answer he says so in
       character. Nothing loops: a cut-in is two beats, an emote three. */
    var chat = document.getElementById('chat');
    if (chat) {
      var cFace = chat.querySelector('[data-cface]'), cMood = chat.querySelector('[data-cmood]');
      var cKuro = chat.querySelector('[data-ckuro]'), cKimg = chat.querySelector('[data-ckimg]');
      var cChoices = chat.querySelector('[data-cchoices]'), cIn = document.getElementById('chatIn');
      var emoteEl = panel.querySelector('[data-emote]'), cutEl = panel.querySelector('[data-cutin]');
      var SWEAT = '<svg viewBox="0 0 20 20"><path d="M10 2C7 7 5 10 5 13a5 5 0 0 0 10 0c0-3-2-6-5-11z" fill="#9fd3e8" stroke="#211E1B" stroke-width="1.6"/></svg>';
      var VEIN = '<svg viewBox="0 0 20 20" fill="none" stroke="#A34135" stroke-width="2.6" stroke-linecap="round"><path d="M3 8c3 0 4-1 4-5M12 3c0 4 1 5 5 5M17 12c-4 0-5 1-5 5M7 17c0-4-1-5-4-5"/></svg>';
      // emotion -> face file and size, the rig's beat of acting, the emote
      var EMO = {
        neutral:     { face: ['deadpan', 427, 368], act: null,     emote: '…',   label: 'listening' },
        joy:         { face: ['laugh', 427, 354],   act: 'laugh',  emote: '♪',   label: 'laughing' },
        smug:        { face: ['smirk', 460, 358],   act: 'smirk',  emote: '✦',   label: 'pleased' },
        thinking:    { face: ['think', 410, 363],   act: 'up',     emote: '?',   label: 'thinking' },
        focus:       { face: ['focus', 464, 369],   act: 'glasses', emote: '!',  label: 'ok, watch this' },
        surprised:   { face: ['shocked', 439, 369], act: 'squash', emote: '!!',  label: 'surprised' },
        annoyed:     { face: ['sideeye', 430, 377], act: 'glance', emote: VEIN,  label: 'side-eye' },
        angry:       { face: ['angry', 415, 371],   act: 'squash', emote: VEIN,  label: 'not having it' },
        tired:       { face: ['tired', 436, 376],   act: 'sip',    emote: SWEAT, label: 'tired' },
        sleepy:      { face: ['sleep', 417, 372],   act: 'yawn',   emote: 'z',   label: 'half asleep' },
        embarrassed: { face: ['facepalm', 434, 361], act: 'half',  emote: SWEAT, label: 'facepalm' },
        decisive:    { face: ['pointyou', 432, 368], act: 'glasses', emote: '!', label: 'pointing at you' }
      };
      var RIGMS = { laugh: M(12), smirk: M(10), up: M(8), glasses: M(9), glance: M(8), sip: M(16), yawn: M(14), half: M(10) };
      // act -> the cut-in's frames (a list plays once, a frame an eighth; pairs are the actors' two frames)
      var A = function (n, w, h) { return ['art/' + n + '.webp', w, h]; };
      var ACT = {
        wave: [[A('actor-wave-a', 238, 540), A('actor-wave-b', 238, 540)]],
        build: [[A('pose-laptop', 495, 440)]],
        sketch: [[A('actor-sketch-a', 257, 540), A('actor-sketch-b', 257, 540)]],
        price: [[A('pose-invoice', 520, 440)], [A('pose-receipt', 412, 440)]],
        deliver: [[A('pose-handover', 560, 435)]],
        show: [[A('pose-sign', 519, 440)]],
        inspect: [[A('pose-inspect', 560, 416)]],
        celebrate: [[A('actor-win-a', 252, 540), A('actor-win-b', 252, 540)], [A('pose-flagstack', 560, 427)]],
        shrug: [[A('pose-shrug', 560, 422)], [A('yasser-lost-still', 480, 442)]],
        phone: [[A('actor-phone-a', 241, 540), A('actor-phone-b', 241, 540)]],
        coffee: [[A('pose-coffee', 385, 440)]],
        nap: [[A('pose-nap', 560, 233)]],
        turn: [[A('turn-front', 172, 402), A('turn-34', 172, 402), A('turn-side', 172, 402), A('turn-back', 172, 402), A('turn-34back', 172, 402), A('turn-front', 172, 402)]],
        // no gesture asked, but the emotion has one of its own
        _focus: [[A('actor-pointup-a', 249, 540), A('actor-pointup-b', 249, 540)]],
        _decisive: [[A('pose-point', 498, 440)]],
        _embarrassed: [[A('pose-facepalm', 509, 440)]],
        _love: [[A('actor-duo-a', 673, 520), A('actor-duo-b', 673, 520)]]
      };
      var KCARD = { judge: [194, 'ear'], loaf: [111, 'yawn'], smug: [172, 'right'], stamp: [185, 'ear'], peek: [165, 'left'], shook: [175, 'wide'], hiss: [189, 'wide'], love: [242, 'blink'], leave: [209, 'left'], mug: [192, 'yawn'] };
      // the written choices: free, instant, and the same four parts as an AI reply
      var CHOICES = [
        ['Salut !', 'Salut. Kūro t’a vu arriver avant moi.', 'joy', 'wave', 'peek'],
        ['Tu fais quoi, exactement ?', 'Des sites, des marques, des mascottes. Du début jusqu’à la mise en ligne.', 'focus', 'build', 'none'],
        ['C’est combien ?', 'Prix fixe, écrit avant. Le menu est dans le Studio.', 'decisive', 'price', 'stamp'],
        ['Tourne-toi.', 'D’accord, un tour. Pas deux.', 'smug', 'turn', 'judge'],
        ['Tu dors quand ?', 'Après la mise en ligne. Donc rarement.', 'sleepy', 'coffee', 'mug'],
        ['Kūro est gentil ?', 'Gentil, non. Juste. Il valide, ou il s’en va.', 'smug', 'none', 'smug'],
        ['On travaille ensemble ?', 'Écris-moi sur WhatsApp. Je réponds, même à 2 h.', 'decisive', 'phone', 'stamp'],
        ['Un intermédiaire m’a dit…', 'Pas d’intermédiaire ici. Tu parles à celui qui code.', 'angry', 'none', 'hiss'],
        ['Montre-moi un truc.', 'Ok, regarde. Une démo d’abord, le prix après.', 'focus', 'show', 'peek'],
        ['Tu as raté quelque chose ?', 'Une fois. On n’en parle pas.', 'embarrassed', 'none', 'judge']
      ];
      var OFFLINE = ['Le réseau dort. Écris-moi sur WhatsApp, c’est plus sûr.', 'tired', 'phone', 'loaf'];
      var SLOW = ['Doucement. Kūro compte les messages.', 'annoyed', 'none', 'judge'];
      var history = [], busy = false, chipAt = 0, cutT = [], emoteT = 0;
      var preload = function (src) { var im = new Image(); im.src = src; return im; };
      var warmed = false;
      var warm = function () {
        if (warmed) return; warmed = true;
        Object.keys(EMO).forEach(function (k) { preload('art/face-' + EMO[k].face[0] + '.webp'); });
      };
      var setFace = function (emo) {
        var f = EMO[emo].face;
        cFace.src = 'art/face-' + f[0] + '.webp'; cFace.width = f[1]; cFace.height = f[2];
        cMood.textContent = EMO[emo].label;
      };
      var setKuro = function (k) {
        if (!k || k === 'none' || !KCARD[k]) { cKuro.classList.remove('on'); return; }
        cKimg.src = 'art/kuro-' + k + '.webp'; cKimg.height = KCARD[k][0];
        cKuro.classList.add('on');
        rig.kHold(KCARD[k][1], k === 'shook' || k === 'hiss' ? M(10) : M(6));
      };
      var showEmote = function (e) {
        clearTimeout(emoteT);
        emoteEl.innerHTML = e.charAt(0) === '<' ? e : '';
        if (e.charAt(0) !== '<') emoteEl.textContent = e;
        emoteEl.classList.remove('on'); void emoteEl.offsetWidth; emoteEl.classList.add('on');
        emoteT = setTimeout(function () { emoteEl.classList.remove('on'); }, M(24));
      };
      // the cut-in: in on half a beat, the frames an eighth each (a still holds), out after two beats
      var cutIn = function (frames) {
        cutT.forEach(clearTimeout); cutT = [];
        cutEl.classList.remove('on', 'out'); cutEl.textContent = '';
        var ims = frames.map(function (f) { var im = document.createElement('img'); im.alt = ''; im.width = f[1]; im.height = f[2]; im.src = f[0]; im.decoding = 'async'; return im; });
        var all = ims.map(function (im) { return im.decode ? im.decode().catch(function () {}) : null; });
        Promise.all(all).then(function () {
          cutEl.appendChild(ims[0]); void cutEl.offsetWidth; cutEl.classList.add('on');
          var step = ims.length > 2 ? M(2) : M(1), last = 0;
          for (var i = 1; i < ims.length * (ims.length === 2 ? 4 : 1); i++) {
            (function (k) { cutT.push(setTimeout(function () { cutEl.replaceChild(ims[k % ims.length], cutEl.firstChild); }, M(4) + k * step)); })(i);
            last = M(4) + i * step;
          }
          var hold = Math.max(M(16), last + M(4));
          cutT.push(setTimeout(function () { cutEl.classList.add('out'); }, hold));
          cutT.push(setTimeout(function () { cutEl.classList.remove('on', 'out'); cutEl.textContent = ''; }, hold + M(4)));
        });
      };
      // a reply, staged: the face and the emote at once, the beat of acting, then the line
      var play = function (line, emo, act, kuro) {
        if (!EMO[emo]) emo = 'neutral';
        warm(); setFace(emo); showEmote(EMO[emo].emote); setKuro(kuro);
        var e = EMO[emo], lead = 0;
        if (e.act === 'squash') { rig.squash(); lead = M(3); }
        else if (e.act) { rig.hold(e.act, RIGMS[e.act]); lead = Math.min(RIGMS[e.act], M(8)); }
        var key = act && act !== 'none' ? act : kuro === 'love' ? '_love' : '_' + emo;
        if (ACT[key]) { var opts = ACT[key]; cutIn(opts[Math.floor(Math.random() * opts.length)]); }
        rig.speak(line, lead);
        history.push({ role: 'assistant', content: line });
      };
      var dealChoices = function () {
        cChoices.textContent = '';
        var pool = CHOICES.slice(), picks = [];
        for (var i = chipAt; picks.length < 3; i++) picks.push(pool[i % pool.length]);
        chipAt = (chipAt + 3) % pool.length;
        picks.forEach(function (c) {
          var b = document.createElement('button'); b.type = 'button';
          var sp = document.createElement('span'); sp.textContent = c[0]; b.appendChild(sp);
          b.addEventListener('click', function () {
            if (busy) return;
            history.push({ role: 'user', content: c[0] });
            play(c[1], c[2], c[3], c[4]); dealChoices();
          });
          cChoices.appendChild(b);
        });
      };
      dealChoices();
      chat.addEventListener('submit', function (e) {
        e.preventDefault();
        var q = cIn.value.replace(/\s+/g, ' ').trim().slice(0, 280);
        if (!q || busy) return;
        busy = true; chat.setAttribute('aria-busy', 'true'); cIn.value = '';
        history.push({ role: 'user', content: q });
        warm(); setFace('thinking'); showEmote('…'); rig.hold('up', M(24));
        fetch('/api/yasser', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ history: history.slice(-12) }) })
          .then(function (r) {
            if (r.status === 429) return { line: SLOW[0], emotion: SLOW[1], act: SLOW[2], kuro: SLOW[3] };
            if (!r.ok) throw new Error(r.status);
            return r.json();
          })
          .catch(function () { return { line: OFFLINE[0], emotion: OFFLINE[1], act: OFFLINE[2], kuro: OFFLINE[3] }; })
          .then(function (d) {
            busy = false; chat.removeAttribute('aria-busy');
            play(String(d.line || '…'), d.emotion, d.act, d.kuro);
          });
      });
    }
  }

  /* ---------------- 2 · the pose actors ----------------
     <button class="actor" data-seq="holdA,holdB"> with <img data-pf="a">
     and <img data-pf="b">: the class b shows the second frame. Once, when
     the figure comes on screen, for holdB ms (never with reduced motion);
     on hover while the pointer is over it; on click or Enter for 1.5 ×
     holdB. A hard cut each way, no breath, no schedule. The holds in the
     markup are rounded to the nearest sixteenth of a beat here.
     The cut waits for the second frame to be decoded, so the box never
     shows an empty frame: both frames are asked for once the grid is a
     screen away; the swap on view is dropped if the frame is not there
     within a beat (667 ms), and the figures that come on screen together
     swap an eighth of a beat (83 ms) apart, in the order they appear. */
  var actors = [].slice.call(document.querySelectorAll('.actor[data-seq]'));
  if (actors.length) {
    actors.forEach(function (el) {
      var hb = Math.min(4000, Number((el.getAttribute('data-seq') || '3208,708').split(',')[1]) || 708), timer = 0, hover = false;
      var bImg = el.querySelector('img[data-pf="b"]'), bOk = false, bWait = null;
      // run fn once the second frame can be painted whole (loaded and decoded)
      var withB = function (fn) {
        if (bOk || !bImg) { fn(); return; }
        if (!bWait) bWait = (bImg.decode ? bImg.decode() : new Promise(function (res, rej) { bImg.addEventListener('load', res); bImg.addEventListener('error', rej); }))
          .then(function () { bOk = true; });
        bWait.then(fn, function () {});
      };
      var cut = function (ms) { el.classList.add('b'); clearTimeout(timer); timer = setTimeout(function () { if (!hover) el.classList.remove('b'); }, ms); };
      var show = function (ms) { withB(function () { cut(ms); }); };
      el.addEventListener('click', function () { show(Q(hb * 1.5)); });
      if (!reduce && finePointer) {
        el.addEventListener('pointerenter', function () { hover = true; withB(function () { if (hover) el.classList.add('b'); }); });
        el.addEventListener('pointerleave', function () { hover = false; clearTimeout(timer); el.classList.remove('b'); });
      }
      // the swap on view: once the second frame is there, at most a beat
      // after the figure came on screen (t), or never; resolves when the
      // next figure in line may swap, an eighth later
      el.__seen = function (t) {
        return new Promise(function (next) {
          var over = false, give = setTimeout(function () { over = true; next(); }, Math.max(0, t + M(8) - now()));
          withB(function () { if (over) return; clearTimeout(give); cut(M(3) + Q(hb)); setTimeout(next, M(1)); });
        });
      };
    });
    if (!reduce && 'IntersectionObserver' in window) {
      // the figures swap one after another, in the order they came on
      // screen, an eighth of a beat apart (six over five eighths, 417 ms)
      var line = Promise.resolve();
      var aio = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (!e.isIntersecting) return;
          aio.unobserve(e.target);
          var el = e.target, t = now();
          line = line.then(function () { return el.__seen(t); });
        });
      }, { threshold: .35 });
      actors.forEach(function (el) { aio.observe(el); });
    }
    // both frames are fetched once the grid is within a screen of the view
    // (they are lazy in the markup, so a visitor who never gets there never
    // loads them)
    var grid = document.querySelector('.actors');
    if (grid && 'IntersectionObserver' in window) {
      var eio = new IntersectionObserver(function (es) {
        if (!es.some(function (e) { return e.isIntersecting; })) return;
        eio.disconnect();
        [].forEach.call(grid.querySelectorAll('.actor img'), function (im) { im.loading = 'eager'; });
      }, { rootMargin: '100% 0px' });
      eio.observe(grid);
    }
  }

  /* ---------------- 2b · the turn (section 02) ----------------
     Five drawn views of one session, stacked (.turn-f, one .is-on): a view
     change is a hard cut, never a tween, because the drawings are not in
     between each other. The order is the order he turns in (front,
     three-quarter, profile, back, three-quarter back, and round to the front
     again), so dragging the stage reads as one way round: a view every 28 px.
     The five ink figures under him are a radio group (arrows, Home, End);
     each mark's number shows him from the side that mark is seen best.
     Once, the first time half the stage is on screen, he turns round one
     time, a view every quarter beat (167 ms, 5 cuts, under a second), and
     stops on his front; any touch of the controls stops it. With reduced
     motion he never turns by himself; every control still cuts. */
  var turn = document.getElementById('turn');
  if (turn) {
    var tStage = turn.querySelector('[data-turn-stage]');
    var tViews = [].slice.call(turn.querySelectorAll('.turn-f'));
    var tRadios = [].slice.call(turn.querySelectorAll('.turn-r'));
    var tName = turn.querySelector('[data-turn-name]');
    var tInk = turn.querySelector('.turn-ink');
    var tMarks = [].slice.call(document.querySelectorAll('.marks li[data-v]'));
    var tN = tViews.length, tCur = 0, tTimer = 0;
    var tSet = function (v, fromKey) {
      v = ((v % tN) + tN) % tN;
      if (v === tCur) return;
      tCur = v;
      tViews.forEach(function (im, i) { im.classList.toggle('is-on', i === v); });
      tRadios.forEach(function (r, i) {
        r.setAttribute('aria-checked', i === v ? 'true' : 'false');
        r.tabIndex = i === v ? 0 : -1;
      });
      if (fromKey) tRadios[v].focus();
      tName.textContent = tRadios[v].getAttribute('aria-label');
      tMarks.forEach(function (li) { li.classList.toggle('is-shown', +li.getAttribute('data-v') === v); });
    };
    var tStop = function () { if (tTimer) { clearTimeout(tTimer); tTimer = 0; } };
    tRadios.forEach(function (r, i) {
      r.addEventListener('click', function () { tStop(); tSet(i); });
      r.addEventListener('keydown', function (e) {
        var k = e.key, to = k === 'ArrowRight' || k === 'ArrowDown' ? tCur + 1 : k === 'ArrowLeft' || k === 'ArrowUp' ? tCur - 1
          : k === 'Home' ? 0 : k === 'End' ? tN - 1 : null;
        if (to === null) return;
        e.preventDefault(); tStop(); tSet(to, true);
      });
    });
    tMarks.forEach(function (li) {
      var v = +li.getAttribute('data-v');
      li.querySelector('.n').addEventListener('click', function () { tStop(); tSet(v); });
      if (finePointer) li.addEventListener('pointerenter', function () { tStop(); tSet(v); });
    });
    tInk.addEventListener('click', function () {
      var on = tInk.getAttribute('aria-pressed') !== 'true';
      tInk.setAttribute('aria-pressed', on ? 'true' : 'false');
      tStage.classList.toggle('is-ink', on);
    });
    // drag: a view every 28 px, the way the pointer goes
    var tX = null, tFrom = 0, tPid = null;
    tStage.addEventListener('pointerdown', function (e) {
      if (e.button) return;
      tStop(); tX = e.clientX; tFrom = tCur; tPid = e.pointerId;
      tStage.setPointerCapture(tPid); tStage.classList.add('is-drag');
    });
    tStage.addEventListener('pointermove', function (e) {
      if (tX === null || e.pointerId !== tPid) return;
      tSet(tFrom + Math.round((e.clientX - tX) / 28));
    });
    var tUp = function () { tX = null; tStage.classList.remove('is-drag'); };
    tStage.addEventListener('pointerup', tUp);
    tStage.addEventListener('pointercancel', tUp);
    // once, on arrival: one turn round, then still
    if (!reduce && 'IntersectionObserver' in window) {
      var tio = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        tio.disconnect();
        var dec = tViews.map(function (im) { return im.decode ? im.decode().catch(function () {}) : null; });
        Promise.all(dec).then(function () {
          if (tCur !== 0) return;            // he was already turned by hand
          var step = 1;
          var next = function () {
            tSet(step % tN);
            tTimer = ++step <= tN ? setTimeout(next, M(2)) : 0;
          };
          tTimer = setTimeout(next, M(2));
        });
      }, { threshold: 0.5 });
      tio.observe(tStage);
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
