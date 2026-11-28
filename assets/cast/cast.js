/* ============================================================
   Numidea Labs — the dock cast: Yasser and Kūro live in the corner of every page.
   vanilla, no deps. Loaded by assets/carry.js once the page is idle (so no page pays for it before it paints);
   it fetches its own sheet (cast.css) and lines (lines.json) from this folder.

   What they do:
   · idle life: Yasser breathes, blinks (now and then twice), follows the pointer with his eyes, sips, yawns after
     a long quiet, goes heavy-lidded late at night. Kūro blinks on his own clock, flicks an ear, looks around.
   · reactions: the page talks to them. A WhatsApp link, a price link or the preview button under the pointer or the
     focus, the bottom of a long page, a copy, a tab coming back, Encre earned in the game (numidea:gain): each plays
     a face, a Kūro reaction and one written line (lines.json), once per page and never more than one bubble every
     22 s, five a page. "Fewer bubbles" turns the unasked ones off on this device.
   · talk: the card opens a dialogue box. Chips are written answers and cost nothing. A typed question goes to
     /api/yasser (the server holds the key; the reply is one short line plus a face, a gesture and Kūro's reaction,
     each from a fixed list). If the route is off or busy, a written line answers instead.
   · Kūro never speaks. He reacts. Pet him (his own button) and he answers; pet him five times fast and he hisses.

   Where they stay out of the way: the home's menu (the big Yasser is there), the bible's talk section (same voice,
   same route) and Kūro's play mode on the Librairie; above the Studio's bottom bar, the play pad and the rank chip.
   Not on the WorkspaceHQ product page, the legal page or Kūro's episode (his own story). Reduced motion: no
   breathing, no typing effect, no slides; the faces still change, at once.
   ============================================================ */
(function () {
  var d = document, W = window, html = d.documentElement, P = location.pathname;
  if (W.__numideaCast) return; W.__numideaCast = 1;
  if (/^\/(workspacehq|legal)\//.test(P) || /\/embed\//.test(P) || /\/hub\/lanterne\/kuro(\.html)?$/.test(P)) return;
  if (!W.fetch || !W.IntersectionObserver || !d.body) return;

  var me = d.currentScript || d.querySelector('script[src*="cast/cast.js"]');
  var src = me ? me.src : '/assets/cast/cast.js';
  var BASE = src.replace(/cast\.js(\?.*)?$/, ''), Q = (src.split('?')[1] ? '?' + src.split('?')[1] : '');
  var RM = W.matchMedia && W.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var BEAT = 2000 / 3, M = function (n) { return Math.round(n * BEAT / 8); };   // n eighths of a beat
  var now = function () { return Date.now(); };
  var rnd = function (a, b) { return a + Math.random() * (b - a); };
  var any = function (a) { return a[Math.floor(Math.random() * a.length)]; };
  var lang = function () { var l = (html.getAttribute('lang') || 'fr').slice(0, 2).toLowerCase(); return l === 'en' || l === 'ar' ? l : 'fr'; };

  // the frames, in the order scripts/cast-art.py cut them
  var Y = ['base', 'blink', 'talk-a', 'talk-b', 'glance', 'glance-r', 'smirk', 'laugh', 'yawn', 'half', 'up', 'sip', 'glasses'];
  var KF = ['base', 'blink', 'ear', 'left', 'right', 'wide', 'yawn'];
  var KR = ['judge', 'loaf', 'smug', 'stamp', 'peek', 'shook', 'hiss', 'love', 'leave', 'mug'];
  // the talk route's words -> a face; its gestures that change the face
  var EMO = { neutral: 'base', joy: 'laugh', smug: 'smirk', thinking: 'glasses', focus: 'up', surprised: 'up', annoyed: 'glance', angry: 'glance-r', tired: 'half', sleepy: 'yawn', embarrassed: 'glasses', decisive: 'smirk' };
  var ACT = { coffee: 'sip', nap: 'yawn', celebrate: 'laugh', inspect: 'glasses', shrug: 'glance' };

  // this device's memory: muted bubbles, visits; this visit's: minimized, the talk so far
  var store = function (k, v, sess) { try { var s = sess ? W.sessionStorage : W.localStorage; if (v === undefined) return JSON.parse(s.getItem(k) || 'null'); s.setItem(k, JSON.stringify(v)); } catch (e) { return null; } };
  var mem = store('numidea-cast') || { m: 0, v: 0, t: 0 };
  var firstToday = now() - (mem.t || 0) > 6 * 3600 * 1000;
  if (firstToday) { mem.v = (mem.v || 0) + 1; mem.t = now(); store('numidea-cast', mem); }
  var talk = store('numidea-cast-talk', undefined, true) || [];   // [{role, content}], the last 12 turns

  // which page this is, for the first line and for the talk route's context
  var page = (function () {
    var p = P.replace(/^\/(en|ar)\//, '/');
    if (d.querySelector('meta[name="robots"][content*="noindex"]') && !/^\/(hub|comptoir)\//.test(p)) return 'lost';
    if (p === '/' || p === '/index.html') return 'home';
    if (/^\/tarifs\//.test(p)) return 'tarifs';
    if (/^\/hub\/lanterne\//.test(p)) return 'lanterne';
    if (/^\/hub\/bible\//.test(p)) return 'bible';
    if (/^\/hub\//.test(p)) return 'studio';
    if (/^\/scene\//.test(p)) return 'work';
    if (/^\/comptoir\//.test(p)) return 'comptoir';
    return 'other';
  })();

  var L = null, el = {}, ready = false;

  /* ---------- load the sheet and the lines, then build ---------- */
  var css = d.createElement('link'); css.rel = 'stylesheet'; css.href = BASE + 'cast.css' + Q;
  var cssOk = new Promise(function (r) { css.onload = r; css.onerror = r; });
  d.head.appendChild(css);
  Promise.all([fetch(BASE + 'lines.json' + Q).then(function (r) { return r.json(); }), cssOk])
    .then(function (a) { L = a[0]; build(); })
    .catch(function () {});

  var t = function (k) { var l = L[lang()] || L.fr; return l[k]; };
  var ui = function (k) { return (L[lang()] || L.fr).ui[k]; };
  var mk = function (tag, cls, parent) { var n = d.createElement(tag); if (cls) n.className = cls; if (parent) parent.appendChild(n); return n; };

  function build() {
    var root = el.root = mk('div', 'cast is-away');
    root.setAttribute('data-nosnippet', '');
    root.setAttribute('dir', html.getAttribute('dir') === 'rtl' ? 'rtl' : 'ltr');

    // the talk panel
    var pan = el.panel = mk('div', 'cast-panel', root);
    pan.id = 'cast-panel'; pan.hidden = true; pan.setAttribute('role', 'dialog'); pan.setAttribute('aria-labelledby', 'cast-h');
    var head = mk('div', 'cast-head', pan);
    var h = mk('b', '', head); h.id = 'cast-h'; h.appendChild(d.createTextNode('Yasser ')); mk('span', '', h).textContent = '· 夜';
    el.mute = mk('button', 'cast-hb', head); el.mute.type = 'button';
    el.close = mk('button', 'cast-hb', head); el.close.type = 'button'; el.close.textContent = '×';
    el.log = mk('div', 'cast-log', pan); el.log.setAttribute('aria-live', 'polite');
    el.chips = mk('div', 'cast-chips', pan);
    var form = el.form = mk('form', 'cast-form', pan);
    el.input = mk('input', 'cast-in', form); el.input.type = 'text'; el.input.maxLength = 280; el.input.autocomplete = 'off'; el.input.name = 'q';
    el.send = mk('button', 'cast-send', form); el.send.type = 'submit';
    el.note = mk('p', 'cast-note', pan);

    // the bubble
    var say = el.say = mk('div', 'cast-say', root);
    say.hidden = true; say.setAttribute('role', 'status');
    el.sayName = mk('span', 'cast-say-n', say); el.sayName.textContent = 'Yasser';
    el.sayT = mk('p', 'cast-say-t', say);
    el.sayX = mk('button', 'cast-x', say); el.sayX.type = 'button'; el.sayX.textContent = '×';

    // the figure
    var stage = el.stage = mk('div', 'cast-stage', root);
    var btn = el.btn = mk('button', 'cast-btn', stage); btn.type = 'button';
    btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-controls', 'cast-panel');
    var card = mk('span', 'cast-card', btn); el.y = mk('span', 'cast-y', card);
    mk('span', 'cast-tag', stage).textContent = 'Yasser';
    el.kr = mk('span', 'cast-kr', stage); el.kr.setAttribute('aria-hidden', 'true');
    el.kb = mk('button', 'cast-kb', stage); el.kb.type = 'button';
    el.k = mk('span', 'cast-k', el.kb);
    el.min = mk('button', 'cast-min', stage); el.min.type = 'button'; el.min.textContent = '–';

    labels();
    if (!RM) root.classList.add('cast-breathe');
    if (store('numidea-cast-min', undefined, true)) root.classList.add('is-min');
    d.body.appendChild(root);
    ready = true;
    face('base'); kface('base');
    wire();
    life();
    watchStages();
    lift(); setInterval(lift, 1500);
    // in after a short wait, or as soon as the visitor moves
    var go = function () { if (el.shown) return; el.shown = 1; show(); setTimeout(opening, M(10)); };
    setTimeout(go, 3500);
    W.addEventListener('scroll', function once() { W.removeEventListener('scroll', once); setTimeout(go, 600); }, { passive: true });
  }

  function labels() {
    el.btn.setAttribute('aria-label', ui('talk'));
    el.kb.setAttribute('aria-label', ui('kuro'));
    el.min.setAttribute('aria-label', ui('later')); el.min.title = ui('later');
    el.close.setAttribute('aria-label', ui('close'));
    el.sayX.setAttribute('aria-label', ui('close'));
    el.mute.textContent = mem.m ? '🔕' : '💬';
    el.mute.setAttribute('aria-label', mem.m ? ui('unmute') : ui('mute')); el.mute.title = el.mute.getAttribute('aria-label');
    el.mute.setAttribute('aria-pressed', mem.m ? 'true' : 'false');
    el.input.placeholder = ui('ask'); el.input.setAttribute('aria-label', ui('ask'));
    el.send.textContent = ui('send');
    el.note.textContent = ui('note');
    el.root.setAttribute('dir', html.getAttribute('dir') === 'rtl' ? 'rtl' : 'ltr');
  }

  /* ---------- faces ---------- */
  var cur = 'base', mood = 'base', holdTo = 0, talking = false;
  function face(n) { var i = Y.indexOf(n); if (i < 0) i = 0; cur = Y[i]; el.y.style.backgroundPosition = (-i * 84) + 'px 0'; }
  function hold(n, ms) { holdTo = now() + ms; face(n); setTimeout(function () { if (now() >= holdTo && !talking) face(mood); }, ms + 20); }
  function setMood(n) { mood = n; if (!talking && now() >= holdTo) face(n); }
  var kcur = 'base', kTo = 0;
  function kface(n) { var i = KF.indexOf(n); if (i < 0) i = 0; kcur = KF[i]; el.k.style.backgroundPosition = (-i * 60) + 'px 0'; }
  function khold(n, ms) { kTo = now() + ms; kface(n); setTimeout(function () { if (now() >= kTo) kface('base'); }, ms + 20); }
  var krT = 0;
  function kreact(n) {
    var i = KR.indexOf(n); if (i < 0) return;
    clearTimeout(krT);
    el.kr.className = 'cast-kr'; el.kr.style.backgroundPosition = (-i * 60) + 'px 0';
    el.kb.classList.add('is-out');
    void el.kr.offsetWidth;
    el.kr.classList.add('is-on');
    if (n === 'leave') {
      krT = setTimeout(function () { el.kr.classList.add('is-leave'); krT = setTimeout(back, 6000); }, M(16));
    } else krT = setTimeout(back, M(28));
    function back() { el.kr.className = 'cast-kr'; el.kb.classList.remove('is-out'); khold('wide', M(4)); }
  }

  /* ---------- idle life ---------- */
  var lastAct = now(), slept = false, idleSaid = false;
  function life() {
    (function blink() {
      setTimeout(function () {
        if (!talking && now() >= holdTo && cur === mood && mood !== 'yawn') {
          face('blink'); setTimeout(function () { if (cur === 'blink') face(mood); }, M(1.3));
          if (Math.random() < .22) setTimeout(function () { if (cur === mood) { face('blink'); setTimeout(function () { if (cur === 'blink') face(mood); }, M(1.3)); } }, M(3));
        }
        blink();
      }, rnd(2600, 6200));
    })();
    (function kloop() {
      setTimeout(function () {
        if (now() >= kTo && !el.kb.classList.contains('is-out')) {
          var r = Math.random();
          if (r < .5) khold('blink', M(1.4));
          else if (r < .72) khold('ear', M(3));
          else if (r < .86) khold(Math.random() < .5 ? 'left' : 'right', M(10));
          else if (slept) khold('yawn', M(8));
          else khold('blink', M(1.4));
        }
        kloop();
      }, rnd(2200, 5600));
    })();
    var night = (function () { var h = new Date().getHours(); return h >= 23 || h < 5; })();
    if (night) setMood('half');
    setInterval(function () {
      var q = now() - lastAct;
      if (q > 28000 && !idleSaid && !talking) { idleSaid = true; speak('idle'); }
      if (q > 60000 && !slept && !talking) { slept = true; hold('yawn', M(10)); setTimeout(function () { setMood('half'); }, M(10)); }
      else if (q > 12000 && q < 60000 && !talking && cur === mood && Math.random() < .25) hold('sip', M(10));
    }, 4000);
    var wake = function () {
      lastAct = now();
      if (slept) { slept = false; setMood(night ? 'half' : 'base'); hold('up', M(5)); khold('wide', M(4)); }
    };
    ['pointerdown', 'keydown', 'scroll', 'touchstart'].forEach(function (e) { W.addEventListener(e, wake, { passive: true }); });
    // eyes follow the pointer: right of him, above him, left of him
    var lastLook = 0, side = '';
    W.addEventListener('pointermove', function (e) {
      lastAct = now(); if (slept) wake();
      if (e.pointerType !== 'mouse' || talking || now() < holdTo || now() - lastLook < 120) return;
      lastLook = now();
      var r = el.y.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 3;
      var dx = e.clientX - cx, dy = e.clientY - cy, s;
      if (Math.abs(dx) < 70 && Math.abs(dy) < 70) s = '';
      else if (dy < -Math.abs(dx) * 1.6) s = 'up';
      else s = dx > 0 ? 'glance' : 'glance-r';
      if (s === side) return; side = s;
      face(s || mood);
      if (now() >= kTo) kface(s === 'glance' ? 'right' : s === 'glance-r' ? 'left' : 'base');
      clearTimeout(el.lookT); el.lookT = setTimeout(function () { side = ''; if (!talking && now() >= holdTo) face(mood); if (now() >= kTo) kface('base'); }, 2400);
    }, { passive: true });
  }

  /* ---------- the bubble ---------- */
  var said = 0, lastSay = 0, sayT = 0, typeT = 0, onceKeys = {};
  function canAsk() { return ready && el.shown && !mem.m && !isOpen() && !el.root.classList.contains('is-away') && !el.root.classList.contains('is-min') && said < 5 && now() - lastSay > 22000; }
  function speak(key, force) {
    if (!L) return;
    if (!force && !canAsk()) return;
    var pool = t(key); if (!pool || !pool.length) return;
    var l = any(pool); said++; lastSay = now();
    perform(l[0], l[1], l[2], el.sayT, function () {
      el.say.hidden = false; el.say.classList.remove('is-in'); void el.say.offsetWidth; el.say.classList.add('is-in');
    });
    clearTimeout(sayT); sayT = setTimeout(hideSay, Math.max(4200, l[0].length * 70));
  }
  function once(key) { if (onceKeys[key]) return; if (!canAsk()) return; onceKeys[key] = 1; speak(key); }
  function hideSay() { if (el.say) el.say.hidden = true; }
  // types a line into `into`, the mouth flapping, then holds the face; Kūro reacts at the start
  function perform(text, fc, kr, into, before) {
    clearInterval(typeT); before && before();
    if (kr && kr !== 'none') setTimeout(function () { kreact(kr); }, M(2));
    if (RM) { into.textContent = text; hold(fc || 'base', M(20)); return; }
    talking = true; into.textContent = '';
    var chars = Array.from ? Array.from(text) : text.split(''), i = 0, flap = 0, step = lang() === 'ar' ? 34 : 26;
    typeT = setInterval(function () {
      i += 1; into.textContent = chars.slice(0, i).join('');
      if (i % 4 === 0) { flap ^= 1; face(flap ? 'talk-a' : 'talk-b'); }
      if (i >= chars.length) { clearInterval(typeT); talking = false; hold(fc || 'base', M(22)); }
    }, step);
  }

  /* ---------- the panel ---------- */
  function isOpen() { return el.panel && !el.panel.hidden; }
  function open() {
    hideSay(); el.panel.hidden = false; el.panel.classList.remove('is-in'); void el.panel.offsetWidth; el.panel.classList.add('is-in');
    el.root.classList.add('is-open'); el.btn.setAttribute('aria-expanded', 'true');
    if (!el.log.childNodes.length) {
      talk.forEach(function (m) { line(m.role === 'user' ? 'u' : 'y', m.content); });
      if (!talk.length) { var l = any(t(mem.v > 1 ? 'back' : 'hello')); var n = line('y', ''); perform(l[0], l[1], l[2], n); }
    }
    chips();
    if (W.matchMedia && W.matchMedia('(hover:hover)').matches) el.input.focus();
    else el.close.focus();
    hold('up', M(6));
  }
  function close(back) { el.panel.hidden = true; el.root.classList.remove('is-open'); el.btn.setAttribute('aria-expanded', 'false'); if (back) el.btn.focus(); }
  function line(who, text) { var p = mk('p', 'cast-m ' + who, el.log); p.textContent = text; el.log.scrollTop = el.log.scrollHeight; return p; }
  function remember(role, content) { talk.push({ role: role, content: content }); talk = talk.slice(-12); store('numidea-cast-talk', talk, true); }
  function chips() {
    el.chips.textContent = '';
    var pool = t('chips').slice(), picks = [];
    while (picks.length < 3 && pool.length) picks.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
    picks.forEach(function (c) {
      var b = mk('button', 'cast-chip', el.chips); b.type = 'button'; b.textContent = c[0];
      b.addEventListener('click', function () {
        if (busy) return;
        line('u', c[0]); remember('user', c[0]);
        var n = line('y', ''); perform(c[1], c[2], c[3], n); remember('assistant', c[1]);
        if (c[3] && c[3] !== 'none') line('k', ui('kuro') + ' ' + (ui('kr')[c[3]] || ''));
        chips();
      });
    });
  }
  var busy = false;
  function ask(q) {
    busy = true; el.form.setAttribute('aria-busy', 'true');
    line('u', q); remember('user', q);
    setMood('glasses'); face('glasses'); kface('wide');
    var dots = line('y', ui('think'));
    fetch('/api/yasser', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ history: talk.slice(-12), page: page, lang: lang() }) })
      .then(function (r) {
        if (r.status === 429) { var s = any(t('slow')); return { line: s[0], emotion: '', face: s[1], kuro: s[2], local: 1 }; }
        if (!r.ok) throw new Error(r.status);
        return r.json();
      })
      .catch(function () { var o = any(t('offline')); return { line: o[0], face: o[1], kuro: o[2], local: 1 }; })
      .then(function (res) {
        busy = false; el.form.removeAttribute('aria-busy'); setMood('base');
        var text = String(res.line || '…').slice(0, 220);
        var fc = res.face || ACT[res.act] || EMO[res.emotion] || 'base';
        perform(text, fc, res.kuro, dots);
        if (!res.local) remember('assistant', text);
        else talk.pop(), store('numidea-cast-talk', talk, true);
        if (res.kuro && res.kuro !== 'none') line('k', ui('kuro') + ' ' + (ui('kr')[res.kuro] || ''));
      });
  }

  /* ---------- wiring ---------- */
  var pets = [];
  function wire() {
    el.btn.addEventListener('click', function () { lastAct = now(); isOpen() ? close(false) : open(); });
    el.close.addEventListener('click', function () { close(true); });
    el.sayX.addEventListener('click', function () { clearTimeout(sayT); hideSay(); });
    el.min.addEventListener('click', function () {
      var m = !el.root.classList.contains('is-min');
      el.root.classList.toggle('is-min', m); store('numidea-cast-min', m ? 1 : 0, true); if (m) { close(false); hideSay(); }
    });
    el.mute.addEventListener('click', function () { mem.m = mem.m ? 0 : 1; store('numidea-cast', mem); labels(); });
    el.kb.addEventListener('click', function () {
      lastAct = now();
      if (el.root.classList.contains('is-min')) { el.root.classList.remove('is-min'); store('numidea-cast-min', 0, true); return; }
      pets = pets.filter(function (x) { return now() - x < 2500; }); pets.push(now());
      if (pets.length >= 5) { pets = []; kreact('hiss'); hold('glance-r', M(12)); onceKeys.poke5 || (onceKeys.poke5 = 1, speak('poke5', true)); return; }
      kreact(any(['love', 'smug', 'judge', 'loaf', 'peek', 'love']));
      hold('smirk', M(8));
    });
    el.form.addEventListener('submit', function (e) {
      e.preventDefault();
      var q = el.input.value.replace(/\s+/g, ' ').trim().slice(0, 280);
      if (!q || busy) return;
      el.input.value = ''; ask(q);
    });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && isOpen()) close(true); });

    // the page talks to them
    var react = function (e) {
      var a = e.target && e.target.closest ? e.target.closest('a[href],button') : null; if (!a || el.root.contains(a)) return;
      var href = a.getAttribute('href') || '';
      if (/wa\.me|whatsapp/i.test(href)) { hold('smirk', M(8)); once('wa'); }
      else if (/tarifs/.test(href)) { hold('glasses', M(8)); once('price'); }
      else if (/#apercu|apercu|preview/i.test(href)) { hold('up', M(8)); once('cta'); }
    };
    d.addEventListener('pointerover', react, { passive: true });
    d.addEventListener('focusin', react);
    d.addEventListener('copy', function () { hold('smirk', M(8)); once('copy'); });
    var hiddenAt = 0;
    d.addEventListener('visibilitychange', function () {
      if (d.hidden) hiddenAt = now();
      else if (hiddenAt && now() - hiddenAt > 20000) { hold('up', M(6)); khold('wide', M(4)); once('tabback'); }
    });
    d.addEventListener('numidea:gain', function () { lastSay = Math.min(lastSay, now() - 16000); hold('laugh', M(12)); speak('gain'); });
    var sT = 0;
    W.addEventListener('scroll', function () {
      if (sT) return; sT = setTimeout(function () {
        sT = 0; lift();
        var h = d.documentElement.scrollHeight;
        if (h > innerHeight * 2.5 && scrollY + innerHeight >= h - 60) once('bottom');
      }, 200);
    }, { passive: true });
    W.addEventListener('resize', lift, { passive: true });
    new MutationObserver(function () { labels(); if (el.panel && !el.panel.hidden) chips(); }).observe(html, { attributes: true, attributeFilter: ['lang', 'dir'] });
  }
  function opening() {
    var night = (function () { var h = new Date().getHours(); return h >= 23 || h < 5; })();
    var first = page === 'lost' ? 'lost' : night ? 'night' : (mem.v > 1 ? 'back' : 'hello');
    if (page !== 'lost' && !firstToday && sessionStorage && (function () { try { return sessionStorage.getItem('numidea-cast-hi'); } catch (e) { return 1; } })()) first = '';
    try { sessionStorage.setItem('numidea-cast-hi', '1'); } catch (e) {}
    if (first) speak(first);
    var pk = page;
    if (pk !== 'lost' && pk !== 'other' && t(pk)) setTimeout(function () { lastSay = Math.min(lastSay, now() - 22001); if (!onceKeys.page) { onceKeys.page = 1; speak(pk); } }, first ? 26000 : 1500);
  }

  /* ---------- staying out of the way ---------- */
  var away = {}, shownOnce = false;
  function show() { shownOnce = true; apply(); }
  function apply() { if (!el.root) return; var hide = !shownOnce || Object.keys(away).some(function (k) { return away[k]; }); el.root.classList.toggle('is-away', hide); if (hide) { hideSay(); } }
  function watchStages() {
    // the big stagings of the same characters: while one is on screen, the dock steps out
    var sel = ['.nl-menu', '#talks', '.st-pad', '.st-hero'];
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { away[e.target.__castId] = e.isIntersecting && e.intersectionRatio > .25; });
      apply();
    }, { threshold: [0, .25, .5] });
    var n = 0;
    var scan = function () { sel.forEach(function (s) { [].forEach.call(d.querySelectorAll(s), function (x) { if (!x.__castId) { x.__castId = 's' + (++n); io.observe(x); } }); }); };
    scan(); setInterval(scan, 3000);
    // Kūro already walks the Librairie's shelf (hub/life.js): one Kūro per page
    if (d.querySelector('script[src*="life.js"]')) el.kb.hidden = true;
  }
  // above any bar fixed to the bottom of the screen that sits under the dock
  function lift() {
    if (!el.root) return;
    var up = 0, vw = innerWidth, rtl = el.root.getAttribute('dir') === 'rtl';
    var x0 = rtl ? 0 : vw - 150, x1 = rtl ? 150 : vw;
    ['.st-dock.is-on', '.st-pad', '.st-rchip', '.cookie-card', '.consent'].forEach(function (s) {
      [].forEach.call(d.querySelectorAll(s), function (b) {
        var r = b.getBoundingClientRect(); if (!r.width || !r.height) return;
        if (r.bottom >= innerHeight - 4 - 40 && r.top < innerHeight && r.right > x0 && r.left < x1) up = Math.max(up, innerHeight - r.top + 6);
      });
    });
    el.root.style.setProperty('--cast-lift', Math.round(up) + 'px');
  }
})();
