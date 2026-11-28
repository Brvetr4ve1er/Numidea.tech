/* Numidea Labs · the home menu's big Yasser as a talking NPC (2026-11-28).
   cast.js loads this file, only on a page with the home menu (.nl-menu). It reads the "npc" tree in lines.json.

   - His body is alive: he breathes, and he hops, flinches or shakes with an emote over his head
     (! ? … sweat, anger vein, sparkles, note, zZ, heart). Hovering a menu card gives that card's emote.
   - Clicking him (or Enter on the "Parler" button over him) turns the menu's text box into a game dialogue box:
     his face as a portrait that talks, typewriter lines, then written choices, Disco Elysium style.
     Choices already read are greyed. Clicking him again mid-talk is a poke, and the pokes escalate.
   - Kūro answers in the tarot card (a reaction frame and its name), never in words.
   - Only "ask your own question" reaches the talk route (/api/yasser), with the same caps as the dock.
   Reduced motion: no breathing, no hops, no typing; the faces still change.
   Keys inside the box: 1-9 pick a choice, Enter or Space shows the rest of a line, Escape closes. */
(function () {
  'use strict';
  var d = document, W = window, html = d.documentElement;
  var root = d.querySelector('.nl-menu');
  if (!root || W.__numideaNpc) return; W.__numideaNpc = 1;
  var stage = root.querySelector('.nl-stage'), fig = root.querySelector('.nl-fig'), sayBox = root.querySelector('.nl-say');
  if (!stage || !fig || !sayBox) return;

  var me = d.currentScript || d.querySelector('script[src*="cast/npc.js"]');
  var src = me ? me.src : '/assets/cast/npc.js';
  var BASE = src.replace(/npc\.js(\?.*)?$/, ''), Q = src.split('?')[1] ? '?' + src.split('?')[1] : '';
  var RM = W.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var BEAT = 2000 / 3, M = function (n) { return Math.round(n * BEAT / 8); };
  var lang = function () { var l = (html.getAttribute('lang') || 'fr').slice(0, 2).toLowerCase(); return l === 'en' || l === 'ar' ? l : 'fr'; };
  var Y = ['base', 'blink', 'talk-a', 'talk-b', 'glance', 'glance-r', 'smirk', 'laugh', 'yawn', 'half', 'up', 'sip', 'glasses'];
  var EMO = { neutral: 'base', joy: 'laugh', smug: 'smirk', thinking: 'glasses', focus: 'up', surprised: 'up', annoyed: 'glance', angry: 'glance-r', tired: 'half', sleepy: 'yawn', embarrassed: 'glasses', decisive: 'smirk' };
  var ACT = { coffee: 'sip', nap: 'yawn', celebrate: 'laugh', inspect: 'glasses', shrug: 'glance' };
  var MOOD = { neutral: '', joy: 'spark', smug: 'note', thinking: 'dots', focus: '!', surprised: '!', annoyed: 'sweat', angry: 'vein', tired: 'zz', sleepy: 'zz', embarrassed: 'sweat', decisive: '!' };
  var MOVE = { '!': 'hop', spark: 'hop', heart: 'hop', sweat: 'flinch', vein: 'shake', '?': 'tilt' };
  var store = function (k, v) { try { if (v === undefined) return JSON.parse(sessionStorage.getItem(k) || 'null'); sessionStorage.setItem(k, JSON.stringify(v)); } catch (e) { return null; } };
  var mk = function (tag, cls, parent) { var n = d.createElement(tag); if (cls) n.className = cls; if (parent) parent.appendChild(n); return n; };
  var now = Date.now;

  var N = null, el = {}, seen = store('numidea-npc-seen') || {}, pokes = 0, typeT = 0, flapT = 0, queue = [], line = null, busy = false;
  fetch(BASE + 'lines.json' + Q).then(function (r) { return r.json(); }).then(function (L) {
    N = function () { return (L[lang()] || L.fr).npc; };
    if (N()) build();
  }).catch(function () {});

  /* ---------- the parts: a button over him, an emote, a portrait box inside the menu's text box ---------- */
  function build() {
    var ui = N().ui;
    el.hit = mk('button', 'npc-hit', stage); el.hit.type = 'button';
    el.hit.setAttribute('aria-expanded', 'false'); el.hit.setAttribute('aria-controls', 'npc-dlg');
    el.cue = mk('span', 'npc-cue', el.hit); el.cue.setAttribute('aria-hidden', 'true');
    el.emote = mk('span', 'npc-emote', stage); el.emote.setAttribute('aria-hidden', 'true');

    var dlg = el.dlg = mk('div', 'npc-dlg', sayBox); dlg.id = 'npc-dlg'; dlg.hidden = true;
    dlg.setAttribute('role', 'dialog'); dlg.setAttribute('aria-labelledby', 'npc-name'); dlg.tabIndex = -1;
    el.por = mk('span', 'npc-por', dlg); el.por.setAttribute('aria-hidden', 'true');
    el.face = mk('span', 'npc-face', el.por);
    var body = mk('div', 'npc-body', dlg);
    var head = mk('div', 'npc-head', body);
    var nm = mk('b', 'npc-name', head); nm.id = 'npc-name'; nm.textContent = 'Yasser';
    el.x = mk('button', 'npc-x', head); el.x.type = 'button'; el.x.textContent = '×';
    el.text = mk('p', 'npc-text', body); el.text.setAttribute('aria-live', 'polite');
    el.more = mk('button', 'npc-more', body); el.more.type = 'button'; el.more.hidden = true; el.more.textContent = '▼';
    el.opts = mk('ol', 'npc-opts', body);
    el.form = mk('form', 'npc-form', body); el.form.hidden = true;
    el.input = mk('input', 'npc-in', el.form); el.input.type = 'text'; el.input.name = 'q'; el.input.maxLength = 280; el.input.autocomplete = 'off';
    el.send = mk('button', 'npc-send', el.form); el.send.type = 'submit'; el.send.textContent = '↵';
    labels();
    new MutationObserver(labels).observe(html, { attributes: true, attributeFilter: ['lang'] });

    place(); addEventListener('resize', place, { passive: true });
    if (W.ResizeObserver) new ResizeObserver(place).observe(stage);
    face('base');
    wire();
    arcana();
    if (!RM) {
      fig.classList.add('npc-live');
      // the "talk" cue shows once, a moment after the menu settles, so people learn he answers
      var cueOnce = function () { if (root.classList.contains('p4')) { el.hit.classList.add('cue'); setTimeout(function () { el.hit.classList.remove('cue'); }, M(40)); } else setTimeout(cueOnce, 800); };
      setTimeout(cueOnce, 2600);
      idle();
    }
  }
  function labels() {
    var ui = N().ui;
    el.hit.setAttribute('aria-label', ui.aria); el.cue.textContent = ui.prompt;
    el.x.setAttribute('aria-label', ui.close); el.more.setAttribute('aria-label', ui.next);
    el.input.placeholder = ui.ph; el.input.setAttribute('aria-label', ui.ask);
    el.send.setAttribute('aria-label', ui.ask);
    el.dlg.setAttribute('dir', html.getAttribute('dir') === 'rtl' ? 'rtl' : 'ltr');
    el.dlg.querySelector('.npc-name').textContent = lang() === 'ar' ? 'ياسر' : 'Yasser';
  }

  /* The button and the emote follow the drawing on every layout: read its box, in the stage's own units. */
  function place() {
    var s = stage.getBoundingClientRect(), f = fig.getBoundingClientRect();
    if (!s.width || !f.width) return;
    var k = s.width / stage.offsetWidth || 1;
    var x = (f.left - s.left) / k, y = (f.top - s.top) / k, w = f.width / k, h = f.height / k;
    var hit = el.hit.style, em = el.emote.style, desk = innerWidth >= 760 && innerWidth / innerHeight >= .8;
    hit.left = Math.round(x + w * .3) + 'px'; hit.top = Math.round(y + h * (desk ? .035 : .05)) + 'px';
    // stacked layout: the menu's cards come up over his chest, so the button stops above them
    var hh = h * (desk ? .34 : .4), nav = root.querySelector('nav');
    if (!desk && nav) { var n = nav.getBoundingClientRect(); hh = Math.max(56, Math.min(hh, (n.top - s.top) / k - (y + h * .05) - 4)); }
    hit.width = Math.round(w * .42) + 'px'; hit.height = Math.round(hh) + 'px';
    em.left = Math.round(x + w * .64) + 'px'; em.top = Math.round(y + h * (desk ? .07 : .09)) + 'px';
  }

  /* ---------- the body: emotes and moves ---------- */
  var emT = 0;
  function emote(kind, ms) {
    if (!kind) return;
    clearTimeout(emT);
    el.emote.className = 'npc-emote'; void el.emote.offsetWidth;
    el.emote.className = 'npc-emote on e-' + (kind === '!' ? 'bang' : kind === '?' ? 'q' : kind);
    emT = setTimeout(function () { el.emote.className = 'npc-emote'; }, ms || M(20));
    move(MOVE[kind]);
  }
  function move(m) {
    if (!m || RM) return;
    fig.classList.remove('npc-hop', 'npc-flinch', 'npc-shake', 'npc-tilt'); void fig.offsetWidth;
    fig.classList.add('npc-' + m);
  }
  fig.addEventListener('animationend', function (e) { if (/^npc(Hop|Flinch|Shake|Tilt)$/.test(e.animationName)) fig.classList.remove('npc-hop', 'npc-flinch', 'npc-shake', 'npc-tilt'); });

  /* ---------- Kūro, in the tarot card ---------- */
  function kuro(k) {
    var cat = root.querySelector('.nl-cat'), say = root.querySelector('.nl-kuro-say');
    if (!k || !cat) return;
    cat.src = cat.src.replace(/kuro\/react\/[^\/]*$/, 'kuro/react/' + k + '.webp');
    var L = W.__castKr && W.__castKr();
    if (say && L && L[k]) say.textContent = L[k];
    var card = root.querySelector('.nl-tarot');
    if (card && !RM) { card.classList.remove('npc-kr'); void card.offsetWidth; card.classList.add('npc-kr'); }
  }

  /* The card's numeral and ribbon follow whichever reaction Kūro shows (menu picks, the dialogue, the ear turn). */
  function arcana() {
    var cat = root.querySelector('.nl-cat'), num = root.querySelector('.nl-t-num'), ttl = root.querySelector('.nl-t-title');
    if (!cat || !num || !ttl) return;
    var sync = function () {
      var m = /kuro\/react\/([a-z]+)/.exec(cat.getAttribute('src') || ''), a = m && (N().arcana || {})[m[1]];
      if (!a) return;
      num.textContent = a[0]; ttl.textContent = a[1];
    };
    new MutationObserver(sync).observe(cat, { attributes: true, attributeFilter: ['src'] });
    new MutationObserver(sync).observe(html, { attributes: true, attributeFilter: ['lang'] });
    sync();
  }

  /* ---------- the portrait ---------- */
  var cur = 'base';
  function face(n) { var i = Y.indexOf(n); if (i < 0) i = 0; cur = Y[i]; el.face.style.setProperty('--i', i); }   // cast.css: 13 frames across
  (function blink() {
    setTimeout(function () {
      if (el.dlg && !el.dlg.hidden && !typeT && cur !== 'yawn' && cur !== 'laugh') { var was = cur; face('blink'); setTimeout(function () { if (cur === 'blink') face(was); }, M(1.3)); }
      blink();
    }, 2600 + Math.random() * 3600);
  })();

  /* ---------- talking ---------- */
  function isOpen() { return el.dlg && !el.dlg.hidden; }
  function open() {
    el.dlg.hidden = false; sayBox.classList.add('npc-on'); root.classList.add('npc-talking');
    el.hit.setAttribute('aria-expanded', 'true');
    el.dlg.focus({ preventScroll: true });
    // stacked layout: the box sits under the cards, so bring it into view
    if (innerWidth < 760 || innerWidth / innerHeight < .8) el.dlg.scrollIntoView({ block: 'nearest', behavior: RM ? 'auto' : 'smooth' });
  }
  function close(back) {
    stop(); el.dlg.hidden = true; sayBox.classList.remove('npc-on'); root.classList.remove('npc-talking');
    el.hit.setAttribute('aria-expanded', 'false'); queue = []; line = null;
    if (back) el.hit.focus({ preventScroll: true });
  }
  function stop() { clearInterval(typeT); clearInterval(flapT); typeT = flapT = 0; }

  // play a list of lines, then call done (which shows the choices)
  function play(lines, done) {
    queue = lines.slice(); el.opts.textContent = ''; el.form.hidden = true;
    next(done);
  }
  function next(done) {
    var l = queue.shift();
    if (!l) { el.more.hidden = true; done && done(); return; }
    line = { l: l, done: done };
    var txt = l[0], fc = l[1] || 'base';
    emote(l[2]); if (l[3]) setTimeout(function () { kuro(l[3]); }, M(3));
    stop(); el.more.hidden = true;
    if (RM) { el.text.textContent = txt; face(fc); fin(); return; }
    var n = 0; el.text.textContent = '';
    flapT = setInterval(function () { face(cur === 'talk-a' ? 'talk-b' : 'talk-a'); }, M(1.5));
    typeT = setInterval(function () {
      n += 2; el.text.textContent = txt.slice(0, n);
      if (n >= txt.length) { stop(); face(fc); fin(); }
    }, 28);
    function fin() { if (queue.length) el.more.hidden = false; else next(done); }
  }
  // Enter, Space or a click on the text: finish the line at once, or go on to the next one
  function advance() {
    if (!line) return;
    if (typeT) { stop(); el.text.textContent = line.l[0]; face(line.l[1] || 'base'); if (queue.length) el.more.hidden = false; else next(line.done); return; }
    if (queue.length) next(line.done);
  }

  function choices(ids) {
    var nd = N().nodes, ui = N().ui, gate = N().gate || {}, read = Object.keys(seen).length;
    el.opts.textContent = '';
    var list = ids.filter(function (id) { return nd[id] && !(gate[id] && read < gate[id]); });
    var n = 0;
    list.forEach(function (id) { opt(++n, nd[id].q, function () { say(id); }, seen[id]); });
    opt(++n, ui.ask, askMode, false, 'npc-o-ask');
    opt(++n, ui.bye, function () { play(N().bye, function () { setTimeout(function () { close(true); }, M(14)); }); }, false, 'npc-o-bye');
    var first = el.opts.querySelector('button'); if (first && d.activeElement && el.dlg.contains(d.activeElement)) first.focus({ preventScroll: true });
  }
  function opt(n, label, fn, read, cls, href) {
    var li = mk('li', 'npc-o' + (read ? ' read' : '') + (cls ? ' ' + cls : ''), el.opts);
    var b = mk(href ? 'a' : 'button', '', li);
    if (href) { b.href = href.href; if (href.target) { b.target = href.target; b.rel = 'noopener'; } } else b.type = 'button';
    mk('span', 'npc-n', b).textContent = n + '.';
    mk('span', 'npc-l', b).textContent = label;
    if (fn) b.addEventListener('click', fn);
  }
  function say(id) {
    var nd = N().nodes[id]; if (!nd) return;
    seen[id] = 1; store('numidea-npc-seen', seen);
    play(nd.l, function () {
      var card = nd.a && root.querySelector('.nl-item[data-id="' + nd.a + '"]');
      choices(nd.o || N().hub);
      if (card) {   // the real way there, as the first choice
        var li = el.opts.firstChild;
        opt(0, N().ui.go[nd.a], null, false, 'npc-o-go', card);
        var go = el.opts.lastChild; el.opts.insertBefore(go, li);
        [].forEach.call(el.opts.querySelectorAll('.npc-n'), function (s, i) { s.textContent = (i + 1) + '.'; });
      }
    });
  }
  function start() {
    var o = N().open, h = new Date().getHours();
    var first = (h >= 23 || h < 5) ? o.night : store('numidea-npc-met') ? o.back : o.first;
    store('numidea-npc-met', 1); pokes = 0;
    open(); play(first, function () { choices(N().hub); });
  }
  function poke() {
    var p = N().poke; var l = p[Math.min(pokes, p.length - 1)]; pokes++;
    var back = el.opts.children.length ? 'opts' : '';
    var keep = [].map.call(el.opts.children, function (x) { return x; });
    play([l], function () { if (back) keep.forEach(function (x) { el.opts.appendChild(x); }); else choices(N().hub); });
  }

  /* ---------- ask your own: the one part that reaches the model ---------- */
  function askMode() {
    el.opts.textContent = ''; el.form.hidden = false; el.text.textContent = N().ui.ask; face('glasses');
    el.input.focus({ preventScroll: true });
  }
  function ask(q) {
    if (busy) return; busy = true; el.form.setAttribute('aria-busy', 'true');
    var talk = store('numidea-cast-talk') || [];
    talk.push({ role: 'user', content: q }); talk = talk.slice(-12);
    el.form.hidden = true; el.text.textContent = '…'; face('glasses'); emote('dots', M(40));
    var T = W.__castLine || function () { return null; };
    fetch('/api/yasser', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ history: talk, page: 'home', lang: lang() }) })
      .then(function (r) {
        if (r.status === 429) { var s = T('slow'); return s ? { line: s[0], face: s[1], kuro: s[2], local: 1 } : null; }
        if (!r.ok) throw new Error(r.status);
        return r.json();
      })
      .catch(function () { return null; })
      .then(function (res) {
        busy = false; el.form.removeAttribute('aria-busy');
        if (!res) { var o = T('offline'); res = o ? { line: o[0], face: o[1], kuro: o[2], local: 1 } : { line: '…', local: 1 }; }
        var text = String(res.line || '…').slice(0, 220);
        var fc = res.face || ACT[res.act] || EMO[res.emotion] || 'base';
        if (!res.local) { talk.push({ role: 'assistant', content: text }); store('numidea-cast-talk', talk.slice(-12)); }
        play([[text, fc, MOOD[res.emotion] || '', res.kuro && res.kuro !== 'none' ? res.kuro : '']], function () { choices(N().hub); });
      });
  }

  /* ---------- wiring ---------- */
  var lastAct = now();
  function wire() {
    el.hit.addEventListener('click', function () {
      lastAct = now();
      if (!root.classList.contains('p4')) return;
      if (!isOpen()) { start(); return; }
      poke();
    });
    el.hit.addEventListener('pointerenter', function () { if (!isOpen()) el.hit.classList.add('cue'); });
    el.hit.addEventListener('pointerleave', function () { el.hit.classList.remove('cue'); });
    el.x.addEventListener('click', function () { close(true); });
    el.more.addEventListener('click', advance);
    el.text.addEventListener('click', advance);
    el.form.addEventListener('submit', function (e) {
      e.preventDefault(); var q = el.input.value.trim(); if (!q) return; el.input.value = ''; ask(q.slice(0, 280));
    });
    // the menu's own keys (arrows, 1-6 pick a card) stay outside the box
    el.dlg.addEventListener('keydown', function (e) {
      e.stopPropagation();
      if (e.key === 'Escape') { e.preventDefault(); close(true); return; }
      if (e.target === el.input) return;
      if ((e.key === 'Enter' || e.key === ' ') && (e.target === el.dlg || e.target === el.more) && line && (typeT || queue.length)) { e.preventDefault(); advance(); return; }
      if (/^[1-9]$/.test(e.key) && !e.metaKey && !e.ctrlKey && !e.altKey) {
        var b = el.opts.querySelectorAll('button, a')[Number(e.key) - 1];
        if (b) { e.preventDefault(); b.focus({ preventScroll: true }); b.click(); }
      }
    });
    // hovering or focusing a card: his emote for it (only while he is not talking)
    var H = N().hover || {};
    [].forEach.call(root.querySelectorAll('.nl-item'), function (a) {
      var go = function () { lastAct = now(); if (!isOpen() && root.classList.contains('p4')) emote(H[a.getAttribute('data-id')], M(12)); };
      a.addEventListener('pointerenter', go); a.addEventListener('focus', go);
    });
  }
  // after a quiet minute he dozes (zZ), until something moves
  function idle() {
    setInterval(function () {
      if (isOpen() || root.classList.contains('paused') || d.hidden || !root.classList.contains('p4')) return;
      if (now() - lastAct > 45000) { emote('zz', M(30)); lastAct = now() - 20000; }
    }, 5000);
    ['pointermove', 'keydown', 'scroll'].forEach(function (t) { addEventListener(t, function () { lastAct = now(); }, { passive: true }); });
  }
})();
