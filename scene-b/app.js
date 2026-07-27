/* Approach B — baked mockup. Scroll swaps the panel (hard cut behind a blink);
   the device only floats. No wild rotation, so the texture never smears.      */
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  var $ = function (id) { return document.getElementById(id); };

  var P = '../assets/previews/';
  var ITEMS = [
    { n: '01', kick: 'STEEL · B2B · ALGERIA', name: 'Bordj Steel', acc: '214,55,48',
      copy: 'Reputation built offline, invisible online. We built the full B2B corporate site — catalogue, references, careers.',
      url: 'https://bordjsteelb2b.netlify.app', shot: P + 'bordjsteel.webp' },
    { n: '02', kick: 'INDUSTRIAL HVAC · FRANCE', name: 'AlmaFlowClim', acc: '59,164,224',
      copy: 'Every quote request arrived by phone, or not at all. A zero-dependency site engineered to convert visits into quotes.',
      url: 'https://almaflowclim.netlify.app', shot: P + 'almaflowclim.webp' },
    { n: '03', kick: 'TRAVEL · BORDJ BOU ARRÉRIDJ', name: 'Alliance Travel', acc: '95,214,134',
      copy: 'WhatsApp chaos → brand, booking funnel and a visa-market strategy built on 544,634 analyzed requests.',
      url: 'https://alliancetravel34.netlify.app', shot: P + 'alliancetravel.webp' },
    { n: '04', kick: 'TRAVEL · OMRA · CONSTANTINE', name: 'Nomara Voyages', acc: '34,180,104',
      copy: 'A bilingual showcase for organised trips and Omra departures — clean, fast, SEO-built.',
      url: 'https://nomaravoyages.netlify.app', shot: P + 'nomara.webp' },
    { n: '05', kick: 'COMMERCE · GAMING', name: 'Glaive Store', acc: '255,90,31',
      copy: 'A gaming-gear storefront with a hard, gamer-first brand, engineered to convert.',
      url: 'https://glaivestore.netlify.app', shot: P + 'glaive.webp' }
  ];

  var N = ITEMS.length;
  $('runway').style.height = (N * 110 + 40) + 'vh';
  $('hudT').textContent = N;

  var el = {
    rig: $('rig'), shot: $('shot'), reflShot: $('reflShot'), dim: $('scrDim'), bloom: $('bloom'),
    key: $('keylight'), cap: $('cap'), kick: $('capKick'), name: $('capName'),
    copy: $('capCopy'), link: $('capLink'), fill: $('hudFill'), hudN: $('hudN'),
    dots: $('dots'), cue: $('cue'), device: $('device'), root: document.documentElement
  };

  // progress dots
  var dotEls = [];
  ITEMS.forEach(function (_, k) {
    var d = document.createElement('span'); d.className = 'dot' + (k === 0 ? ' on' : '');
    el.dots.appendChild(d); dotEls.push(d);
  });

  var p = 0, mx = 0, my = 0, cur = -1, dirty = true;

  function apply(k) {
    if (k === cur) return;
    cur = k; var it = ITEMS[k];
    el.shot.src = it.shot; el.reflShot.src = it.shot;
    el.kick.textContent = it.n + ' · ' + it.kick;
    el.name.textContent = it.name;
    el.copy.textContent = it.copy;
    if (it.url) { el.link.href = it.url; el.link.hidden = false; } else el.link.hidden = true;
    el.hudN.textContent = it.n;
    el.root.style.setProperty('--acc', it.acc);
    dotEls.forEach(function (d, i) { d.classList.toggle('on', i === k); });
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
    var seg = p * N;                       // 0..N
    var k = Math.min(N - 1, Math.floor(seg));
    var t = seg - k;                       // 0..1 inside this item

    // hard cut at the midpoint, hidden behind a brief screen blank
    var swapAt = .5;
    var showIdx = (k < N - 1 && t >= swapAt) ? k + 1 : k;
    var dim = Math.max(0, 1 - Math.abs(t - swapAt) / .1);
    if (k >= N - 1) dim = 0;
    el.dim.style.opacity = dim.toFixed(3);
    apply(showIdx);

    // the device only breathes: a slow rise + a whisper of scale
    var rise = Math.sin(seg * Math.PI) * -10;
    el.rig.style.setProperty('--riseY', (rise + (t - .5) * 12).toFixed(1) + 'px');
    el.rig.style.setProperty('--rigS', (1 + Math.sin(seg * Math.PI / N) * .015).toFixed(4));

    // pointer parallax kept small — the angle stays honest
    if (!reduce) {
      el.device.style.setProperty('--ry', (-13 + mx * 3.2).toFixed(2) + 'deg');
      el.device.style.setProperty('--rx', (5 + my * -1.8).toFixed(2) + 'deg');
      el.device.style.setProperty('--rz', (mx * .5).toFixed(2) + 'deg');
      el.key.style.transform = 'translateX(-50%) translate(' + (mx * -22).toFixed(1) + 'px,' + (my * -10).toFixed(1) + 'px)';
    }

    el.fill.style.width = (p * 100).toFixed(2) + '%';
    el.cue.style.opacity = p > .02 ? 0 : 1;
  }

  addEventListener('scroll', onScroll, { passive: true });
  if (fine && !reduce) addEventListener('mousemove', onMove, { passive: true });
  (function loop() { if (dirty) { render(); dirty = false; } requestAnimationFrame(loop); })();
  onScroll(); render();
})();
