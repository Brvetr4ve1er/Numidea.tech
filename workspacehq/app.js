/* WorkspaceHQ v3 launch site — the design's component logic, without React.
   Ported from the DCLogic class in "WorkspaceHQ v3 Launch Site.dc.html":
   Bit's sprite and moods, feeding / level-ups / achievements, the install
   copy button, chapter seeking in the walkthrough, booting the live demo,
   the scroll progress, the sticky nav and the scroll reveal. */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };

  /* ---------------- Bit ---------------- */
  var BITPAL = { o: '#d97757', h: '#f2a27e', d: '#a5543a', e: '#1b1430', y: '#ffd23f', s: '#9fd0e8', c: '#ff2bd6', k: '#a01d8a' };
  var PB = ['...oooooo...', '..ohoooooo..', '.ohoooooooo.', '.ooeooooeoo.', '.ooeooooeoo.', 'oooooooooooo', '.oooooooooo.', '.dddddddddd.', '..d.d..d.d..'];
  var withRows = function (map) { return PB.map(function (r, j) { return map[j] != null ? map[j] : r; }); };
  var FR = {
    idle: PB,
    blink: withRows({ 3: '.oooooooooo.' }),
    happy: withRows({ 4: '.oeoeooeoeo.' }),
    nervous: withRows({ 3: '.oeooooeooo.', 4: '.oeooooeooo.' }),
    busy: withRows({ 3: '.oooeooooeo.', 4: '.oooeooooeo.' }),
    sleepy: withRows({ 3: '.oooooooooo.', 4: '.oddooooddo.' })
  };
  var CROWN = ['..y..yy..y..', '..yyyyyyyy..', '..yyhyyhyy..'];
  var CAPE = [[-1, 4], [-1, 5], [-1, 6], [-1, 7], [-2, 7], [-1, 8], [-2, 8], [12, 4], [12, 5], [12, 6], [12, 7], [13, 7], [12, 8], [13, 8]];
  var MOODS = [
    ['idle', 'CALM', 'All clear. Bit is just vibing on the Next card.'],
    ['busy', 'SCANNING', 'Scanning 12 repos. His eyes follow the progress bar.'],
    ['nervous', 'SECRET', 'Live key in atlas-api. Bit sweats until it’s vaulted.'],
    ['happy', 'CLEAN', 'Clean commit. Bit throws coins.'],
    ['sleepy', 'ALL DONE', 'Every quest cleared. Bit naps until tomorrow’s scan.']
  ];
  var st = { mood: 'idle', blink: false, lv: 4, xp: 1240, coins: 0, seen: { idle: 1 } };
  var NS = 'http://www.w3.org/2000/svg';

  function bitSvg(px) {
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('width', 16 * px); svg.setAttribute('height', 13 * px);
    svg.setAttribute('viewBox', '-2 -4 16 13'); svg.setAttribute('aria-hidden', 'true');
    var add = function (x, y, c) {
      var r = document.createElementNS(NS, 'rect');
      r.setAttribute('x', x); r.setAttribute('y', y); r.setAttribute('width', 1.02); r.setAttribute('height', 1.02); r.setAttribute('fill', c);
      svg.appendChild(r);
    };
    if (st.lv >= 7) CAPE.forEach(function (p) { add(p[0], p[1], p[1] > 6 ? BITPAL.k : BITPAL.c); });
    var fr = FR[st.mood === 'idle' && st.blink ? 'blink' : st.mood] || PB;
    fr.forEach(function (row, y) { row.split('').forEach(function (ch, x) { if (BITPAL[ch]) add(x, y, BITPAL[ch]); }); });
    if (st.lv >= 5) CROWN.forEach(function (row, y) { row.split('').forEach(function (ch, x) { if (BITPAL[ch]) add(x, y - 3, BITPAL[ch]); }); });
    if (st.mood === 'nervous') { var sw = document.createElementNS(NS, 'rect'); sw.setAttribute('x', 11.3); sw.setAttribute('y', 1.2); sw.setAttribute('width', .8); sw.setAttribute('height', 1.5); sw.setAttribute('fill', BITPAL.s); svg.appendChild(sw); }
    return svg;
  }
  var bits = $$('[data-bit]');
  function drawBits() { bits.forEach(function (b) { b.replaceChildren(bitSvg(+b.getAttribute('data-bit'))); }); }

  var moodsEl = $('#moods'), moodLine = $('#moodLine'), bitCard = $('.bit-card');
  MOODS.forEach(function (m) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'btn btn--ghost btn--sm'; b.textContent = m[1];
    b.setAttribute('data-mood', m[0]);
    b.addEventListener('click', function () { st.mood = m[0]; st.seen[m[0]] = 1; render(); });
    moodsEl.appendChild(b);
  });

  function render() {
    drawBits();
    var mood = MOODS.filter(function (m) { return m[0] === st.mood; })[0] || MOODS[0];
    moodLine.textContent = mood[2];
    $$('[data-mood]', moodsEl).forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-mood') === st.mood ? 'true' : 'false'); });
    bitCard.classList.toggle('sleepy', st.mood === 'sleepy');
    $$('[data-lv]').forEach(function (e) { e.textContent = st.lv; });
    $('#coins').textContent = st.coins;
    $('#xpLabel').textContent = st.xp.toLocaleString('en-US');
    var xb = $('#xpBar'); xb.classList.remove('w-83'); xb.style.width = Math.round(st.xp / 15) + '%';
    $('#nextUnlock').textContent = st.lv < 5 ? 'next: crown at LV 5' : st.lv < 7 ? 'next: cape at LV 7' : 'fully dressed';
    var ach = { coin: st.coins > 0, crown: st.lv >= 5, cape: st.lv >= 7, moods: Object.keys(st.seen).length >= MOODS.length };
    $$('[data-ach]').forEach(function (a) { a.classList.toggle('on', !!ach[a.getAttribute('data-ach')]); });
  }

  function pop(text) {
    $$('.pops').forEach(function (p) {
      var s = document.createElement('span'); s.textContent = text; p.appendChild(s);
      setTimeout(function () { s.remove(); }, 1050);
    });
  }
  function feed() {
    st.xp += 130; var up = false;
    if (st.xp >= 1500) { st.xp -= 1500; st.lv += 1; up = true; }
    st.coins += 1;
    st.mood = up ? 'happy' : st.mood === 'sleepy' ? 'idle' : st.mood;
    pop(up ? 'LEVEL UP!' : '+130 XP');
    $$('[data-feed]').forEach(function (b) { b.classList.add('hop'); setTimeout(function () { b.classList.remove('hop'); }, 170); });
    render();
  }
  $$('[data-feed]').forEach(function (b) { b.addEventListener('click', feed); });
  render();

  // Bit blinks every few seconds while calm — only while he can be seen
  var bitVisible = false;
  setInterval(function () {
    if (!bitVisible || document.hidden || reduce || st.mood !== 'idle') return;
    st.blink = true; drawBits();
    setTimeout(function () { st.blink = false; drawBits(); }, 140);
  }, 3200);

  /* ---------------- install: copy ---------------- */
  $$('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var cmd = btn.parentNode.querySelector('[data-cmd]').textContent.trim();
      var done = function () {
        $$('[data-copy]').forEach(function (b) { b.textContent = 'COPIED ✓'; });
        clearTimeout(btn._t);
        btn._t = setTimeout(function () { $$('[data-copy]').forEach(function (b) { b.textContent = 'COPY'; }); }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(cmd).then(done, done); else done();
    });
  });

  /* ---------------- walkthrough chapters ---------------- */
  var CHAPTERS = [['00', 'Every repo, one console', 0], ['01', 'Scan', 4], ['02', 'Since last visit', 11], ['03', 'Next move', 17], ['04', 'Secret guard', 23], ['05', 'Commit diffs', 30], ['06', 'Ask Claude', 36], ['07', 'Living map', 44], ['08', 'Bit levels up', 50]];
  var fmt = function (s) { return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
  var chapEl = $('#chapters'), walk = $('#walkFrame');
  CHAPTERS.forEach(function (c, i) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'chap'; b.setAttribute('aria-pressed', 'false');
    b.innerHTML = '<span class="n"></span><span class="l"></span><span class="ts"></span>';
    b.children[0].textContent = c[0]; b.children[1].textContent = c[1]; b.children[2].textContent = fmt(c[2]);
    b.setAttribute('aria-label', 'Jump to ' + c[1] + ', ' + fmt(c[2]));
    b.addEventListener('click', function () {
      $$('.chap', chapEl).forEach(function (o) { o.setAttribute('aria-pressed', o === b ? 'true' : 'false'); });
      // same-origin: seek the walkthrough's stage, then press play
      try {
        var w = walk.contentWindow; if (!w) return;
        var stage = w.document.querySelector('[data-om-exportable-video-with-duration-secs]'); if (!stage) return;
        stage.dispatchEvent(new w.CustomEvent('data-om-seek-to-time-frame', { detail: { time: c[2] + .01 } }));
        setTimeout(function () { w.dispatchEvent(new w.KeyboardEvent('keydown', { key: ' ', code: 'Space', bubbles: true })); }, 80);
      } catch (e) { /* the frame has not booted yet */ }
    });
    chapEl.appendChild(b);
  });

  /* ---------------- live demo ---------------- */
  $('#bootDemo').addEventListener('click', function () {
    var f = document.createElement('iframe');
    f.src = 'embed/console.html'; f.title = 'WorkspaceHQ v3 live console';
    var stage = $('#demoStage'); stage.replaceChildren(f);
    var s = $('#demoStatus'); s.textContent = '● LIVE'; s.classList.add('live');
    f.focus();
  });

  /* ---------------- nav, progress, cursor glow ---------------- */
  var nav = $('#nav'), prog = $('#prog'), max = 1, stuck = null;
  var measure = function () { max = Math.max(1, document.documentElement.scrollHeight - innerHeight); };
  var onScroll = function () {
    var y = scrollY || pageYOffset || 0;
    prog.style.transform = 'scaleX(' + Math.min(1, y / max).toFixed(4) + ')';
    var s = y > 40; if (s !== stuck) { nav.classList.toggle('stuck', s); stuck = s; }
  };
  measure(); onScroll();
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', measure);
  if ('ResizeObserver' in window) new ResizeObserver(measure).observe(document.body);

  // the glow eases after the pointer and STOPS once it has caught up
  var glow = $('#cursorGlow');
  if (glow && !reduce && matchMedia('(hover:hover) and (pointer:fine)').matches) {
    var mx = innerWidth / 2, my = innerHeight / 3, cx = mx, cy = my, running = false;
    var step = function () {
      cx += (mx - cx) * .1; cy += (my - cy) * .1;
      glow.style.transform = 'translate(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px)';
      if (Math.abs(mx - cx) + Math.abs(my - cy) > .5) requestAnimationFrame(step); else running = false;
    };
    addEventListener('pointermove', function (e) {
      mx = e.clientX; my = e.clientY; glow.classList.add('on');
      if (!running) { running = true; requestAnimationFrame(step); }
    }, { passive: true });
  }

  /* ---------------- reveal + pause what is off screen ---------------- */
  if ('IntersectionObserver' in window) {
    if (!reduce) {
      var rio = new IntersectionObserver(function (es) {
        es.forEach(function (en) {
          if (!en.isIntersecting) return;
          var el = en.target;
          el.style.transitionDelay = (Number(el.getAttribute('data-reveal')) || 0) * 90 + 'ms';
          el.classList.add('in'); rio.unobserve(el);
          setTimeout(function () { el.style.transitionDelay = ''; }, 1400);
        });
      }, { threshold: .12, rootMargin: '0px 0px -6% 0px' });
      $$('[data-reveal]').forEach(function (el) {
        if (el.getBoundingClientRect().top < innerHeight * .9) return;   // above the fold: never hidden
        el.classList.add('rv'); rio.observe(el);
      });
    }
    // loops (blink, glitch, float, marquee, aurora drift) pause when their
    // block leaves the screen; Bit's blink timer follows the Bit section
    var vio = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        en.target.classList.toggle('off', !en.isIntersecting);
        if (en.target.id === 'bit') bitVisible = en.isIntersecting;
        if (en.target.classList.contains('hero')) bitVisible = bitVisible || en.isIntersecting;
      });
    });
    $$('main > section, .marquee').forEach(function (s) { vio.observe(s); });
  } else {
    bitVisible = true;
  }
})();
