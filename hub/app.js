/* ============================================================
   VOIDSPLUNKER.std — hub interactions (vanilla, no deps)
   - scramble/cycling identity title
   - mouse-reactive parallax + chromatic aberration
   - rotating philosophy line
   - reticle cursor
   - avatar pose hook (ready for real frames)
   ============================================================ */
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = matchMedia('(hover:hover) and (pointer:fine)').matches;

  /* ---------------- 1 · identity cycler ----------------
     Was a per-character glyph scramble. Two problems, both measured: the line's
     width changed on every animation frame, so the page's own <h1> emitted a
     layout shift continuously for the life of the tab (14 shifts >0.01 in six
     seconds, CLS 1.16 over a longer run) — and for roughly a third of the cycle
     the heading read as random glyphs where a name should be, including in the
     accessible name a screen reader announces.

     Now it crossfades. The box is reserved from the longest identity, so the
     swap cannot move anything, and the text is only ever a real identity. */
  var IDENTITIES = [
    'b4vetrave1er.exe',
    'VOIDSPLUNKER.std',
    'HAMISSE M. YASSER',
    'POLYMATH DEVELOPER',
    'DESIGNER / DEVELOPER'
  ];
  var cyText = document.getElementById('cyText');

  if (cyText) {
    cyText.textContent = IDENTITIES[0];
    if (!reduce) {
      var idx = 0;
      setInterval(function () {
        idx = (idx + 1) % IDENTITIES.length;
        cyText.classList.add('swapping');
        setTimeout(function () {
          cyText.textContent = IDENTITIES[idx];
          cyText.classList.remove('swapping');
        }, 260);
      }, 3400);
    }
  }

  /* ---------------- 2 · philosophy line ---------------- */
  var PHILO = [
    'form is a function of obsession.',
    'i live in the seam between the code and the canvas.',
    'a polymath is someone who refused to choose.',
    'build the void — then splunk it.',
    'every system is a drawing waiting to be redrawn.',
    'i make machines dream and pixels think.'
  ];
  var philoEl = document.getElementById('philo');
  if (philoEl && !reduce) {
    var pi = 0;
    setInterval(function () {
      philoEl.style.opacity = '0';
      setTimeout(function () {
        pi = (pi + 1) % PHILO.length;
        philoEl.textContent = PHILO[pi];
        philoEl.style.opacity = '1';
      }, 420);
    }, 5400);
  }

  /* ---------------- 3 · parallax engine (pointer + scroll) ----------------
     Both sources write CSS variables; the stylesheet composes them into one
     transform, so neither can clobber the other. Everything is lerped toward
     its target, which is what makes the motion feel unhurried rather than
     twitchy — the page settles instead of tracking. */
  var depthEls = [].slice.call(document.querySelectorAll('[data-depth]'));
  var paraEls = [].slice.call(document.querySelectorAll('[data-parallax]')).map(function (el) {
    return { el: el, k: parseFloat(el.getAttribute('data-parallax')) || 0, sy: 0, target: 0 };
  });
  var ghost = document.querySelector('.ghost');
  var tx = 0, ty = 0, cx = 0, cy = 0;

  function onMove(e) {
    tx = (e.clientX / innerWidth - 0.5) * 2;
    ty = (e.clientY / innerHeight - 0.5) * 2;
    if (reticle) reticle.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px)';
  }
  if (finePointer && !reduce) window.addEventListener('pointermove', onMove, { passive: true });

  // gentle device-tilt parallax on mobile
  if (!reduce && window.DeviceOrientationEvent && !finePointer) {
    window.addEventListener('deviceorientation', function (e) {
      if (e.gamma == null) return;
      tx = Math.max(-1, Math.min(1, e.gamma / 30));
      ty = Math.max(-1, Math.min(1, (e.beta - 45) / 30));
    }, true);
  }

  function measureScroll() {
    var vh = innerHeight, y = window.scrollY || pageYOffset || 0;
    for (var i = 0; i < paraEls.length; i++) {
      var p = paraEls[i], r = p.el.getBoundingClientRect();
      // distance of the element's centre from the viewport centre, in px
      var centre = r.top + y + r.height / 2 - (y + vh / 2);
      p.target = centre * p.k;
    }
  }

  function frame() {
    cx += (tx - cx) * 0.045;          // slow follow — the calm comes from here
    cy += (ty - cy) * 0.045;
    for (var i = 0; i < depthEls.length; i++) {
      var el = depthEls[i], d = parseFloat(el.getAttribute('data-depth')) || 0;
      el.style.setProperty('--px', (-cx * d) + 'px');
      el.style.setProperty('--py', (-cy * d) + 'px');
    }
    for (var j = 0; j < paraEls.length; j++) {
      var p = paraEls[j];
      p.sy += (p.target - p.sy) * 0.075;
      if (Math.abs(p.target - p.sy) < 0.05) p.sy = p.target;
      p.el.style.setProperty('--sy', p.sy.toFixed(2) + 'px');
    }
    if (ghost) {
      ghost.style.setProperty('--gx', (-cx * 26) + 'px');
      ghost.style.setProperty('--gy', (-cy * 26) + 'px');
      var sp = ghost.querySelector('span');
      if (sp) sp.style.setProperty('--abx', (cx * 12 - 4) + 'px');
    }
    requestAnimationFrame(frame);
  }
  if (!reduce) {
    measureScroll();
    addEventListener('scroll', measureScroll, { passive: true });
    addEventListener('resize', measureScroll);
    requestAnimationFrame(frame);
  }

  /* ---------------- 3b · staggered scroll reveal ----------------
     Siblings entering together are delayed in sequence so the archive
     assembles itself in a wave rather than all at once. */
  var revealEls = [].slice.call(document.querySelectorAll('[data-reveal]'));
  if (revealEls.length) {
    if (reduce || !('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('seen'); });
    } else {
      var batch = [], flushTimer = null;
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          io.unobserve(en.target);
          batch.push(en.target);
          clearTimeout(flushTimer);
          flushTimer = setTimeout(function () {
            batch.forEach(function (el, i) {
              el.style.setProperty('--rd', Math.min(i * 70, 560) + 'ms');
              el.classList.add('seen');
            });
            batch = [];
          }, 40);
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0 });
      revealEls.forEach(function (el) { io.observe(el); });
      // safety net: anything already on screen should never stay hidden
      addEventListener('load', function () {
        revealEls.forEach(function (el) {
          var r = el.getBoundingClientRect();
          if (r.top < innerHeight && r.bottom > 0) el.classList.add('seen');
        });
      });
    }
  }

  /* ---------------- 4 · reticle cursor ---------------- */
  var reticle = document.getElementById('reticle');
  if (reticle && finePointer) {
    document.addEventListener('pointerover', function (e) {
      var hot = e.target.closest && e.target.closest('a,button,.chip,.link,.scrollcue');
      reticle.classList.toggle('hot', !!hot);
    });
  }

  /* ---------------- 5 · avatar pose system (ready for real frames) ----------------
     When bg-removed PNG frames are dropped into #portrait as
     <img class="pose" data-pose="0"> … , setPose(n) cross-fades between them.
     Until then #portrait holds the designed placeholder. */
  var portrait = document.getElementById('portrait');
  window.VOID = window.VOID || {};
  window.VOID.setPose = function (n) {
    if (!portrait) return;
    portrait.setAttribute('data-pose', String(n));
    var poses = portrait.querySelectorAll('.pose');
    for (var i = 0; i < poses.length; i++) poses[i].classList.toggle('on', i === n);
  };

  /* ---------------- 6 · theme toggle (footer pill) ---------------- */
  var htmlEl = document.documentElement;
  function setTheme(t) { htmlEl.setAttribute('data-theme', t); try { localStorage.setItem('void-theme', t); } catch (e) {} }
  var sun = document.getElementById('tpSun'), moon = document.getElementById('tpMoon'), toTop = document.getElementById('tpTop');
  if (sun) sun.addEventListener('click', function () { setTheme('light'); });
  if (moon) moon.addEventListener('click', function () { setTheme('dark'); });
  if (toTop) toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });

  /* ---------------- 7 · scroll-driven pose shift ---------------- */
  var POSES = Math.max(1, (document.querySelectorAll('#portrait .pose').length || 4));
  var heroEl = document.getElementById('hero'), curPose = -1, ticking = false;
  function poseFromScroll() {
    var h = (heroEl ? heroEl.offsetHeight : innerHeight) * 0.82;
    var prog = Math.min(1, Math.max(0, (window.scrollY || window.pageYOffset || 0) / h));
    var idx = Math.min(POSES - 1, Math.floor(prog * POSES));
    if (idx !== curPose) { curPose = idx; if (window.VOID.setPose) window.VOID.setPose(idx); }
  }
  window.addEventListener('scroll', function () {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () { poseFromScroll(); ticking = false; });
  }, { passive: true });
  poseFromScroll();

  /* ---------------- 8 · year ---------------- */
  var yEl = document.getElementById('year'); if (yEl) yEl.textContent = new Date().getFullYear();

  /* ---------------- 8 · the collection: filter + viewer ----------------
     Filters hide pieces with [hidden]; the viewer is a native <dialog>, so
     focus trapping and Esc come from the browser. Without scripts every piece
     is a plain link to its DeviantArt page — the viewer only intercepts a
     plain click (no modifier keys), so cmd/ctrl-click still opens a tab. */
  var grid = document.getElementById('collGrid');
  if (grid) {
    var pieces = [].slice.call(grid.querySelectorAll('.piece'));
    var fbtns = [].slice.call(document.querySelectorAll('.coll-filter button'));
    fbtns.forEach(function (b) {
      b.addEventListener('click', function () {
        var f = b.getAttribute('data-f');
        fbtns.forEach(function (o) { o.setAttribute('aria-pressed', o === b ? 'true' : 'false'); });
        pieces.forEach(function (p) {
          var show = f === 'all' || p.getAttribute('data-cat') === f;
          p.hidden = !show;
          if (show) p.classList.add('seen');
        });
      });
    });

    var lb = document.getElementById('lb');
    if (lb && typeof lb.showModal === 'function') {
      var img = document.getElementById('lbImg'), ttl = document.getElementById('lbTitle'),
          meta = document.getElementById('lbMeta'), link = document.getElementById('lbLink'), cur = -1, opener = null;
      var visible = function () { return pieces.filter(function (p) { return !p.hidden; }); };
      var show = function (i) {
        var list = visible(); if (!list.length) return;
        cur = (i + list.length) % list.length;
        var a = list[cur].querySelector('a');
        img.src = a.getAttribute('data-full');
        img.width = +a.getAttribute('data-w'); img.height = +a.getAttribute('data-h');
        img.alt = a.getAttribute('data-title');
        ttl.textContent = a.getAttribute('data-title');
        meta.textContent = a.getAttribute('data-meta');
        link.href = a.href;
      };
      grid.addEventListener('click', function (e) {
        var a = e.target.closest('.piece a');
        if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        opener = a;
        show(visible().indexOf(a.parentNode));
        lb.showModal();
      });
      document.getElementById('lbPrev').addEventListener('click', function () { show(cur - 1); });
      document.getElementById('lbNext').addEventListener('click', function () { show(cur + 1); });
      document.getElementById('lbClose').addEventListener('click', function () { lb.close(); });
      lb.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') show(cur - 1);
        else if (e.key === 'ArrowRight') show(cur + 1);
      });
      // a click on the backdrop (the dialog box itself, outside the figure) closes
      lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
      lb.addEventListener('close', function () { if (opener) opener.focus(); });
    }
  }
})();
