/* ============================================================
   VOIDSPLUNKER.std — hub interactions (vanilla, no deps)
   1 · parallax: the hero's three layers, by scroll and by pointer
   2 · entrance: the hero's layers rise once, when Yasser has arrived
   3 · reveal: blocks rise and fade in as they come on screen
   4 · loops: a still swapped for its animation once, on screen
   5 · theme pill
   6 · year
   7 · the studio diary's viewer
   8 · pictures fade in once decoded
   9 · the motion preference changing mid-visit; printing
   With prefers-reduced-motion: reduce, 1, 2, 4 and 8 never run and 3
   shows everything at once: nothing moves and nothing is written after
   load (keys.mjs watches for it). Turned on mid-visit, it stops 1, 3 and 4
   at once (§9).
   ============================================================ */
(function () {
  var motionPref = matchMedia('(prefers-reduced-motion: reduce)');
  var reduce = motionPref.matches;
  var finePointer = matchMedia('(hover:hover) and (pointer:fine)').matches;
  var root = document.documentElement;

  /* ---------------- 1 · parallax engine (pointer + scroll) ----------------
     One list of moving elements: each can carry data-depth (pointer offset,
     px) and data-parallax (scroll lag), and gets ONE inline transform.
     Positions are cached (on load and resize, never while scrolling), the
     loop runs only while something is still easing, and only on-screen
     elements are written; everything is lerped toward its target, so the
     art settles instead of tracking, and once settled nothing is written.
     The pointer only counts on a fine pointer: a phone's touches are not a
     gaze, and the old device-tilt source (a write on every sensor event
     while the phone moved in a hand) is gone. The entrance (§2) uses the
     `translate` property, which composes with this transform. */
  var movers = [].slice.call(document.querySelectorAll('[data-depth],[data-parallax]')).map(function (el) {
    return { el: el, d: parseFloat(el.getAttribute('data-depth')) || 0,
             k: parseFloat(el.getAttribute('data-parallax')) || 0, sy: 0, target: 0, top: 0, h: 0, last: '' };
  });
  var tx = 0, ty = 0, cx = 0, cy = 0, vh = innerHeight, sy0 = scrollY || pageYOffset || 0, running = false;

  function kick() { if (!running && !reduce && movers.length) { running = true; requestAnimationFrame(frame); } }
  function onMove(e) {
    tx = (e.clientX / innerWidth - 0.5) * 2;
    ty = (e.clientY / innerHeight - 0.5) * 2;
    kick();
  }
  function cache() {
    var y = scrollY || pageYOffset || 0;
    vh = innerHeight;
    movers.forEach(function (m) { m.el.style.transform = ''; m.last = ''; });
    movers.forEach(function (m) { var r = m.el.getBoundingClientRect(); m.top = r.top + y; m.h = r.height; });
    aim();
  }
  function aim() {
    for (var i = 0; i < movers.length; i++) {
      var m = movers[i];
      m.target = m.k ? (m.top + m.h / 2 - (sy0 + vh / 2)) * m.k : 0;
    }
    kick();
  }
  function frame() {
    if (reduce) { running = false; return; }
    cx += (tx - cx) * 0.045;          // slow follow: the calm comes from here
    cy += (ty - cy) * 0.045;
    var settled = Math.abs(tx - cx) < 0.002 && Math.abs(ty - cy) < 0.002;
    for (var i = 0; i < movers.length; i++) {
      var m = movers[i];
      m.sy += (m.target - m.sy) * 0.075;
      if (Math.abs(m.target - m.sy) < 0.05) m.sy = m.target; else settled = false;
      if (m.top + m.h < sy0 - 300 || m.top > sy0 + vh + 300) continue;
      var v = 'translate3d(' + (-cx * m.d).toFixed(1) + 'px,' + (-cy * m.d + m.sy).toFixed(1) + 'px,0)';
      if (v !== m.last) { m.el.style.transform = v; m.last = v; }
    }
    if (settled) running = false; else requestAnimationFrame(frame);
  }
  if (!reduce && movers.length) {
    if (finePointer) addEventListener('pointermove', onMove, { passive: true });
    cache();
    addEventListener('scroll', function () { sy0 = scrollY || pageYOffset || 0; aim(); }, { passive: true });
    addEventListener('resize', cache);
    addEventListener('load', function () { setTimeout(cache, 300); });
  }

  /* ---------------- 2 · entrance, once ----------------
     The head script sets html.js, and the stylesheet then holds the three
     layers a few px low (only with no reduced-motion preference). Once
     Yasser's picture is decoded, .in lets them rise into register, the paper
     first. Transforms only: the picture is never faded, and it is the first
     screen's largest paint. If this script never runs the layers simply
     rest a few px low, in register, inside the stage's bleed. */
  var stage = document.querySelector('.stage');
  var lead = stage && stage.querySelector('.layer--yasser img');
  if (stage && lead && !reduce) {
    var entered = false;
    var go = function () {
      if (entered) return; entered = true;
      requestAnimationFrame(function () { requestAnimationFrame(function () { stage.classList.add('in'); }); });
    };
    var ready = function () { if (lead.decode) lead.decode().then(go, go); else go(); };
    if (lead.complete && lead.naturalWidth) ready();
    else { lead.addEventListener('load', ready); lead.addEventListener('error', go); }
    setTimeout(go, 4000);              // a stalled picture does not hold the art low
  }

  /* ---------------- 3 · staggered scroll reveal ----------------
     Progressive enhancement: the stylesheet only hides [data-reveal] under
     html.reveal-armed, and this is the one place that sets it, so with
     scripts off, blocked or failing before this point, everything is simply
     visible. Anything already painted on screen is revealed in the same pass
     that arms the gate, so nothing visible blinks off. The observer line is
     a fixed 40px above the bottom edge, and focus reveals its block outright
     whatever the observer thinks, so Tab never lands on something hidden. */
  var revealEls = [].slice.call(document.querySelectorAll('[data-reveal]'));
  var revealAll = function () { revealEls.forEach(function (el) { el.classList.add('seen'); }); };
  if (revealEls.length && !reduce && 'IntersectionObserver' in window) {
    try {
      var batch = [], flushTimer = null;
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          io.unobserve(en.target);
          batch.push(en.target);
          clearTimeout(flushTimer);
          flushTimer = setTimeout(function () {
            batch.filter(function (el) { return !el.classList.contains('seen'); }).forEach(function (el, i) {
              el.style.setProperty('--rd', Math.min(i * 70, 420) + 'ms');
              el.classList.add('seen');
            });
            batch = [];
          }, 40);
        });
      }, { rootMargin: '0px 0px -40px 0px', threshold: 0 });
      var painted = false;
      try { painted = performance.getEntriesByType('paint').length > 0; } catch (e) {}
      if (painted) {
        revealEls.forEach(function (el) {
          var r = el.getBoundingClientRect();
          if (r.top < innerHeight && r.bottom > 0) el.classList.add('seen');
        });
      }
      revealEls.forEach(function (el) { if (!el.classList.contains('seen')) io.observe(el); });
      document.addEventListener('focusin', function (e) {
        var r = e.target.closest && e.target.closest('[data-reveal]');
        if (!r || r.classList.contains('seen')) return;
        io.unobserve(r);
        r.style.setProperty('--rd', '0ms');
        r.classList.add('seen');
      });
      root.classList.add('reveal-armed');
      // safety net: anything already on screen should never stay hidden
      addEventListener('load', function () {
        revealEls.forEach(function (el) {
          var r = el.getBoundingClientRect();
          if (r.top < innerHeight && r.bottom > 0) el.classList.add('seen');
        });
      });
    } catch (e) {
      root.classList.remove('reveal-armed');
      revealAll();
    }
  } else {
    revealAll();
  }

  /* ---------------- 4 · loops ----------------
     Each loop's <img> holds its still (the poster frame) and names its
     animated file in data-anim. Once half of it is on screen the src becomes
     the animation, once: the file plays its own number of times (at most
     5 s in all, scripts/hub-art-data.mjs MOTION_MS) and stops on the frame
     it started from, so it settles back into the still. With reduced motion
     this never observes and never writes; the <source> keeps the still. */
  var loops = [].slice.call(document.querySelectorAll('img[data-anim]'));
  if (loops.length && !reduce && 'IntersectionObserver' in window) {
    var lio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting || reduce) return;
        lio.unobserve(en.target);
        en.target.src = en.target.getAttribute('data-anim');
      });
    }, { threshold: 0.5 });
    loops.forEach(function (im) { lio.observe(im); });
  }

  /* ---------------- 5 · theme toggle (footer pill) ----------------
     aria-pressed on both buttons is the state a screen reader hears (and
     what forced-colours mode draws); it follows data-theme at load and on
     every switch. Paper is the default: only "dark" is stored as dark. */
  var sun = document.getElementById('tpSun'), moon = document.getElementById('tpMoon'), toTop = document.getElementById('tpTop');
  var tint = document.querySelector('meta[name="theme-color"]');
  function showTheme(t) {
    if (sun) sun.setAttribute('aria-pressed', String(t !== 'dark'));
    if (moon) moon.setAttribute('aria-pressed', String(t === 'dark'));
  }
  function setTheme(t) {
    root.setAttribute('data-theme', t);
    showTheme(t);
    if (tint) tint.setAttribute('content', t === 'dark' ? '#0f1420' : '#fcecdc');
    try { localStorage.setItem('void-theme', t); } catch (e) {}
  }
  showTheme(root.getAttribute('data-theme'));
  if (tint && root.getAttribute('data-theme') === 'dark') tint.setAttribute('content', '#0f1420');
  if (sun) sun.addEventListener('click', function () { setTheme('light'); });
  if (moon) moon.addEventListener('click', function () { setTheme('dark'); });
  if (toTop) toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });

  /* ---------------- 6 · year ---------------- */
  var yEl = document.getElementById('year'); if (yEl) yEl.textContent = new Date().getFullYear();

  /* ---------------- 7 · the studio diary's viewer ----------------
     A native <dialog>, so focus trapping and Esc come from the browser.
     Without scripts every print is a plain link to its large file; the
     viewer only intercepts a plain click (no modifier keys), so cmd/ctrl-
     click still opens a tab. The picture's description is the print's own
     alt text; #lbLink shows only for a print with a data-link. */
  var grid = document.getElementById('collection');
  var lb = document.getElementById('lb');
  if (grid && lb && typeof lb.showModal === 'function') {
    var pieces = [].slice.call(grid.querySelectorAll('.tile--img'));
    var img = document.getElementById('lbImg'), ttl = document.getElementById('lbTitle'),
        meta = document.getElementById('lbMeta'), link = document.getElementById('lbLink'),
        live = document.getElementById('lbLive'), cur = -1, opener = null;
    // Previous/Next: the dialog's name changes silently, so the new piece is
    // also written to the polite status line (not on open: opening a dialog
    // already announces its name).
    var step = function (d) {
      show(cur + d);
      if (live) live.textContent = ttl.textContent + ', ' + (cur + 1) + ' of ' + pieces.length;
    };
    var show = function (i) {
      if (!pieces.length) return;
      cur = (i + pieces.length) % pieces.length;
      var a = pieces[cur], thumb = a.querySelector('img');
      img.classList.remove('ld');
      img.onload = function () { img.classList.add('ld'); };
      img.width = +a.getAttribute('data-w'); img.height = +a.getAttribute('data-h');
      img.src = a.getAttribute('data-full');
      if (img.complete) img.classList.add('ld');
      img.alt = thumb ? thumb.alt : a.getAttribute('data-title');
      ttl.textContent = a.getAttribute('data-title');
      meta.textContent = a.getAttribute('data-meta') || '';
      var out = a.getAttribute('data-link');
      link.hidden = !out;
      if (out) {
        link.href = out;
        link.firstChild.nodeValue = (a.getAttribute('data-link-label') || 'the original') + ' ';
      }
    };
    grid.addEventListener('click', function (e) {
      var a = e.target.closest('.tile--img');
      if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      e.preventDefault();
      opener = a;
      if (live) live.textContent = '';
      show(pieces.indexOf(a));
      lb.showModal();
    });
    document.getElementById('lbPrev').addEventListener('click', function () { step(-1); });
    document.getElementById('lbNext').addEventListener('click', function () { step(1); });
    document.getElementById('lbClose').addEventListener('click', function () { lb.close(); });
    lb.addEventListener('keydown', function (e) {
      var rtl = getComputedStyle(lb).direction === 'rtl';
      if (e.key === 'ArrowLeft') step(rtl ? 1 : -1);
      else if (e.key === 'ArrowRight') step(rtl ? -1 : 1);
    });
    // a click on the backdrop (the dialog box itself, outside the figure) closes
    lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
    // focus returns to the print on screen when the viewer closes, not the one
    // it was opened on: after paging through, the visitor keeps their place
    lb.addEventListener('close', function () {
      var back = pieces[cur] || opener;
      if (back) back.focus();
    });
  }

  /* ---------------- 8 · pictures arrive, they don't pop ----------------
     Every picture holds its exact box from the first paint (width/height on
     each <img>), so nothing moves; an img.fade just fades in once decoded.
     body.fi gates it, so with scripts off (or reduced motion) pictures are
     simply visible. The hero's layers are not .fade: Yasser is never faded. */
  if (!reduce) {
    document.body.classList.add('fi');
    [].forEach.call(document.querySelectorAll('img.fade'), function (im) {
      var done = function () { im.classList.add('ld'); };
      if (im.complete && im.naturalWidth) done();
      else { im.addEventListener('load', done); im.addEventListener('error', done); }
    });
  }

  /* ---------------- 9 · the preference changes; printing ----------------
     Reduced motion turned on mid-visit: the parallax stops and drops its
     transforms, everything still hidden by the reveal shows, and no loop
     is swapped in any more (the <source> already shows the stills). Turned
     off again, the parallax picks up where the page is. Printing: the lazy
     pictures load first, so a page printed straight after it opens has its
     pictures (a write only when the visitor prints). */
  var onPref = function (e) {
    reduce = e.matches;
    if (reduce) {
      running = false;
      movers.forEach(function (m) { m.el.style.transform = ''; m.last = ''; });
      if (io) io.disconnect();
      if (lio) lio.disconnect();
      revealAll();
    } else if (movers.length) cache();
  };
  if (motionPref.addEventListener) motionPref.addEventListener('change', onPref);
  else if (motionPref.addListener) motionPref.addListener(onPref);
  addEventListener('beforeprint', function () {
    [].forEach.call(document.querySelectorAll('img[loading="lazy"]'), function (im) { im.loading = 'eager'; });
  });
})();
