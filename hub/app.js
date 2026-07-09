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

  /* ---------------- 1 · scramble identity cycler ---------------- */
  var IDENTITIES = [
    'b4vetrave1er.exe',
    'VOIDSPLUNKER.std',
    'HAMISSE M. YASSER',
    'POLYMATH DEVELOPER',
    'DESIGNER / DEVELOPER'
  ];
  var GLYPHS = '!<>-_\\/[]{}=+*^?#01xX%&$§▓▒░ﾊﾐｼﾅﾋｦﾂ';
  var cyText = document.getElementById('cyText');

  function scrambleTo(el, next, done) {
    var prev = el.getAttribute('data-cur') || '';
    var len = Math.max(prev.length, next.length);
    var q = [];
    for (var i = 0; i < len; i++) {
      var start = Math.floor(Math.random() * 24);
      q.push({ from: prev[i] || '', to: next[i] || '', start: start, end: start + 12 + Math.floor(Math.random() * 26), ch: null });
    }
    var frame = 0, raf;
    function tick() {
      var out = '', done_ = 0;
      for (var i = 0; i < q.length; i++) {
        var it = q[i];
        if (frame >= it.end) { done_++; out += it.to; }
        else if (frame >= it.start) {
          if (!it.ch || Math.random() < 0.3) it.ch = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          out += '<span class="rand">' + it.ch + '</span>';
        } else out += it.from;
      }
      el.innerHTML = out;
      if (done_ === q.length) { el.setAttribute('data-cur', next); if (done) done(); }
      else { frame++; raf = requestAnimationFrame(tick); }
    }
    tick();
  }

  if (cyText) {
    cyText.setAttribute('data-cur', IDENTITIES[0]);
    if (!reduce) {
      var idx = 0;
      var loop = function () {
        idx = (idx + 1) % IDENTITIES.length;
        scrambleTo(cyText, IDENTITIES[idx], function () { setTimeout(loop, 2200); });
      };
      setTimeout(loop, 2100);
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

  /* ---------------- 3 · mouse parallax + aberration ---------------- */
  var depthEls = [].slice.call(document.querySelectorAll('[data-depth]'));
  var ghost = document.querySelector('.ghost');
  var tx = 0, ty = 0, cx = 0, cy = 0, active = false;

  function onMove(e) {
    tx = (e.clientX / innerWidth - 0.5) * 2;
    ty = (e.clientY / innerHeight - 0.5) * 2;
    active = true;
    if (reticle) { reticle.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px)'; }
  }
  if (finePointer && !reduce) window.addEventListener('pointermove', onMove, { passive: true });

  // gentle device-tilt parallax on mobile
  if (!reduce && window.DeviceOrientationEvent && !finePointer) {
    window.addEventListener('deviceorientation', function (e) {
      if (e.gamma == null) return;
      tx = Math.max(-1, Math.min(1, e.gamma / 30));
      ty = Math.max(-1, Math.min(1, (e.beta - 45) / 30));
      active = true;
    }, true);
  }

  function frame() {
    cx += (tx - cx) * 0.08;
    cy += (ty - cy) * 0.08;
    for (var i = 0; i < depthEls.length; i++) {
      var el = depthEls[i], d = parseFloat(el.getAttribute('data-depth')) || 0;
      el.style.transform = 'translate3d(' + (-cx * d) + 'px,' + (-cy * d) + 'px,0)';
    }
    if (ghost) {
      ghost.style.setProperty('--gx', (-cx * 26) + 'px');
      ghost.style.setProperty('--gy', (-cy * 26) + 'px');
      var sp = ghost.querySelector('span');
      if (sp) sp.style.setProperty('--abx', (cx * 12 - 4) + 'px');
    }
    requestAnimationFrame(frame);
  }
  if (!reduce) requestAnimationFrame(frame);

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
})();
