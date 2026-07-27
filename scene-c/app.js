/* Approach C — schematic. Screenshots stay flat and sharp; depth is drawn,
   not simulated. Sheets change with a hard wipe (never a blend).            */
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  var $ = function (id) { return document.getElementById(id); };

  var P = '../assets/previews/';
  var SHEETS = [
    { n: '01', sector: 'STEEL · B2B', kick: 'STEEL · B2B · ALGERIA', name: 'Bordj Steel', acc: '214,55,48', live: true,
      copy: 'Reputation built offline, invisible online — so we drew the whole B2B presence: catalogue, references, careers.',
      url: 'https://bordjsteelb2b.netlify.app', shot: P + 'bordjsteel.webp' },
    { n: '02', sector: 'HVAC · FRANCE', kick: 'INDUSTRIAL HVAC · FRANCE', name: 'AlmaFlowClim', acc: '59,164,224', live: true,
      copy: 'A zero-dependency site engineered around one job: turning visits into quote requests.',
      url: 'https://almaflowclim.netlify.app', shot: P + 'almaflowclim.webp' },
    { n: '03', sector: 'TRAVEL · BBA', kick: 'TRAVEL · BORDJ BOU ARRÉRIDJ', name: 'Alliance Travel', acc: '95,214,134', live: true,
      copy: 'Brand, booking funnel and a visa-market strategy built on 544,634 analyzed requests.',
      url: 'https://alliancetravel34.netlify.app', shot: P + 'alliancetravel.webp' },
    { n: '04', sector: 'OMRA · TRAVEL', kick: 'TRAVEL · OMRA · CONSTANTINE', name: 'Nomara Voyages', acc: '34,180,104', live: true,
      copy: 'A bilingual showcase for organised trips and Omra departures — clean, fast, SEO-built.',
      url: 'https://nomaravoyages.netlify.app', shot: P + 'nomara.webp' },
    { n: '05', sector: 'COMMERCE', kick: 'COMMERCE · GAMING', name: 'Glaive Store', acc: '255,90,31', live: true,
      copy: 'A gaming-gear storefront with a hard, gamer-first brand, engineered to convert.',
      url: 'https://glaivestore.netlify.app', shot: P + 'glaive.webp' }
  ];
  var N = SHEETS.length;
  $('runway').style.height = (N * 110 + 40) + 'vh';
  $('tbT').textContent = N;

  /* ---- axonometric wireframe scaffolding (drawn once) ---- */
  var ax = $('axGroup');
  function box(cx, cy, w, h, d, cls) {
    // an isometric-ish box: front face + offset back face + connecting edges
    var x = cx - w / 2, y = cy - h / 2, dx = d * .55, dy = -d * .32;
    var f = 'M' + x + ' ' + y + 'h' + w + 'v' + h + 'h' + (-w) + 'Z';
    var bk = 'M' + (x + dx) + ' ' + (y + dy) + 'h' + w + 'v' + h + 'h' + (-w) + 'Z';
    var e = 'M' + x + ' ' + y + 'l' + dx + ' ' + dy +
            'M' + (x + w) + ' ' + y + 'l' + dx + ' ' + dy +
            'M' + (x + w) + ' ' + (y + h) + 'l' + dx + ' ' + dy +
            'M' + x + ' ' + (y + h) + 'l' + dx + ' ' + dy;
    return '<path class="' + cls + '" d="' + f + '"/><path class="ax-hidden" d="' + bk + '"/><path class="' + cls + '" d="' + e + '"/>';
  }
  var svg = '';
  // a receding stack of sheet outlines behind the live plate
  for (var s = 4; s >= 1; s--) svg += box(720, 420, 620 - s * 46, 388 - s * 29, 60, 'ax-box');
  // corner construction marks
  svg += '<path class="ax-hidden" d="M120 120h180M120 120v180M1320 780h-180M1320 780v-180"/>';
  svg += '<path class="ax-hidden" d="M120 780h180M120 780v-180M1320 120h-180M1320 120v180"/>';
  ax.innerHTML = svg;
  var axBoxes = ax.querySelectorAll('.ax-box');

  var el = {
    shot: $('shot'), wipe: $('wipe'), plate: $('platewrap'), callout: $('callout'),
    cNum: $('cNum'), cKick: $('cKick'), cName: $('cName'), cCopy: $('cCopy'), cLink: $('cLink'),
    tbName: $('tbName'), tbN: $('tbN'), tbSector: $('tbSector'), tbStatus: $('tbStatus'),
    grid: $('gridCoarse'), ax: ax, cue: $('cue'), root: document.documentElement
  };

  var p = 0, mx = 0, my = 0, cur = -1, dirty = true;

  function apply(k) {
    if (k === cur) return;
    cur = k; var it = SHEETS[k];
    el.shot.src = it.shot;
    el.cNum.textContent = it.n;
    el.cKick.textContent = it.kick;
    el.cName.textContent = it.name;
    el.cCopy.textContent = it.copy;
    if (it.url) { el.cLink.href = it.url; el.cLink.hidden = false; } else el.cLink.hidden = true;
    el.tbName.textContent = it.name.toUpperCase();
    el.tbN.textContent = it.n;
    el.tbSector.textContent = it.sector;
    el.tbStatus.textContent = it.live ? 'LIVE' : 'IN BUILD';
    el.tbStatus.className = it.live ? 'ok' : '';
    el.root.style.setProperty('--acc', it.acc);
    // light the matching outline in the stack
    for (var i = 0; i < axBoxes.length; i++) axBoxes[i].classList.toggle('on', i === (k % axBoxes.length));
  }
  apply(0);

  function onScroll() {
    var h = document.documentElement, max = h.scrollHeight - h.clientHeight;
    p = max > 0 ? Math.min(1, Math.max(0, (h.scrollTop || pageYOffset) / max)) : 0;
    dirty = true;
  }
  var lastM = 0;
  function onMove(e) {
    var t = performance.now(); if (t - lastM < 40) return; lastM = t;
    mx = (e.clientX / innerWidth) * 2 - 1; my = (e.clientY / innerHeight) * 2 - 1; dirty = true;
  }

  function render() {
    var seg = p * N, k = Math.min(N - 1, Math.floor(seg)), t = seg - k;

    // hard wipe across the middle of the segment — no cross-blending at all
    var w = 0, edge = 0;
    if (k < N - 1) {
      var a = Math.max(0, Math.min(1, (t - .42) / .08));   // cover
      var b = Math.max(0, Math.min(1, (t - .50) / .08));   // uncover
      w = a - b; edge = w > .02 ? 1 : 0;
      if (t >= .5) apply(k + 1); else apply(k);
    } else apply(k);
    el.wipe.style.setProperty('--wipe', (w).toFixed(3));
    el.wipe.style.setProperty('--wipeEdge', edge);

    // gentle drift of the sheet + parallax on the drawing layers
    el.plate.style.setProperty('--pY', (Math.sin(seg * Math.PI) * -8 + my * (reduce ? 0 : -6)).toFixed(1) + 'px');
    el.callout.style.setProperty('--cY', (Math.sin(seg * Math.PI) * -5).toFixed(1) + 'px');
    if (!reduce) {
      el.grid.style.transform = 'translate(' + (mx * -16).toFixed(1) + 'px,' + (my * -10 - seg * 14).toFixed(1) + 'px)';
      el.ax.setAttribute('transform', 'translate(' + (mx * 18).toFixed(1) + ',' + (my * 11).toFixed(1) + ')');
    }
    el.cue.style.opacity = p > .02 ? 0 : 1;
  }

  addEventListener('scroll', onScroll, { passive: true });
  if (fine && !reduce) addEventListener('mousemove', onMove, { passive: true });
  (function loop() { if (dirty) { render(); dirty = false; } requestAnimationFrame(loop); })();
  onScroll(); render();
})();
