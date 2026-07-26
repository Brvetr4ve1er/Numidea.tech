/* ============================================================
   Scene 3D — scroll choreography engine (vanilla, no deps)
   Positions ease smooth; rotations overshoot; velocity drives
   glow/grid reaction. Everything is transform/opacity only.
   ============================================================ */
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  var N = 6, SECTION_VH = 120;
  var M = reduce ? 0 : 1.15, PAR = reduce ? 0 : 1;

  var $ = function (id) { return document.getElementById(id); };
  var runway = $('runway');
  runway.style.height = (SECTION_VH * N) + 'vh';

  /* ---------------- per-scene data (real portfolio) ---------------- */
  var SCENES = [
    { acc: '230,180,80', label: 'numidea — boot',      status: 'READY', live: false, num: '◆',
      chips: ['HTML/CSS/JS', 'ZERO DEPS', 'SCROLL-BUILT'] },
    { acc: '59,164,224',  label: 'almaflowclim',        status: 'LIVE',  live: true,  num: '01',
      chips: ['HTML/CSS/JS', 'ZERO DEPS', 'SEO'] },
    { acc: '214,55,48',   label: 'bordjsteelb2b',       status: 'LIVE',  live: true,  num: '02',
      chips: ['B2B', 'CORPORATE', 'MULTI-SECTION'] },
    { acc: '95,214,134',  label: 'alliancetravel34',    status: 'LIVE',  live: true,  num: '03',
      chips: ['BRAND + FUNNEL', '544,634 ROWS', 'FR / AR'] },
    { acc: '34,180,104',  label: 'nomara · glaive',     status: 'LIVE',  live: true,  num: '04',
      chips: ['BILINGUAL', 'COMMERCE', 'SEO'] },
    { acc: '230,180,80',  label: 'numidea — idle',      status: '—',     live: false, num: '◆',
      chips: ['REACT', 'PYTHON', 'CLAUDE'] }
  ];

  /* ---------------- device keyframes (one value per scene) ---------------- */
  var lap = {
    x: [150, 0, -230, 130, -260, 0], y: [40, 10, 0, 0, 30, -60], z: [-500, 40, -120, -60, -380, -700],
    ry: [-38, -10, 26, -24, 38, 0], rz: [0, -2, 3, -3, 4, 0], rx: [12, 6, 8, 7, 10, 24],
    lid: [-72, 0, 0, 0, 0, -20], s: [1, 1, .92, .96, .8, .7]
  };
  var ph = {
    x: [-360, 330, 210, -300, 0, 40], y: [90, 60, 10, 20, 0, -40], z: [-450, -160, 120, 60, 230, -600],
    ry: [30, 18, -16, 20, -10, 0], rz: [-10, -6, 6, -7, 0, 14], s: [.9, .9, 1, 1, 1.08, .8]
  };
  var hexX = [0, -320, 300, -280, 320, 0], hexZ = [-350, -520, -420, -480, -400, -260], hexS = [1.15, .8, .9, .85, .9, 1.3];
  var hexO = [.9, .5, .6, .55, .6, 1];
  var gtX = [0, 60, -140, 80, -120, 0], gtY = [0, 40, -30, 60, -50, -80], gtO = [.55, .85, .3, .7, .35, .6];
  var ggX = [0, -70, 120, -90, 130, 0], ggY = [0, -30, 50, -40, 60, 40], ggO = [.5, .3, .85, .35, .8, .95];

  /* ---------------- ornaments + per-scene icons ---------------- */
  var SLOTS = [[-470, -175], [445, -150], [-425, 150], [470, 115]];
  var IC = {
    term: '<path d="M4 5h16v14H4z"/><path d="m8 10 2.5 2L8 14M13 15h4"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5M3 16.5l9 5 9-5"/>',
    cpu: '<rect x="7" y="7" width="10" height="10" rx="1.5"/><path d="M4 10h3M4 14h3M17 10h3M17 14h3M10 4v3M14 4v3M10 17v3M14 17v3"/>',
    cloud: '<path d="M7 18a4 4 0 0 1-.6-7.95A5.5 5.5 0 0 1 17.4 9.2 3.9 3.9 0 0 1 17 18Z"/>',
    code: '<path d="m8 8-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14"/>',
    globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5a13 13 0 0 1 0 17 13 13 0 0 1 0-17Z"/>',
    factory: '<path d="M3 20V10l6 4V10l6 4V6h6v14Z"/><path d="M7 20v-3M12 20v-3M17 20v-3"/>',
    link: '<path d="M10 13.5a4 4 0 0 0 5.7.3l2.5-2.5a4 4 0 0 0-5.7-5.7l-1.4 1.4"/><path d="M14 10.5a4 4 0 0 0-5.7-.3L5.8 12.7a4 4 0 0 0 5.7 5.7l1.4-1.4"/>',
    plane: '<path d="M2.5 13.5 21 4l-4 17-4.5-6-6 3Z"/>',
    chat: '<path d="M20.5 11.5a8 8 0 0 1-11.7 7.1L4 20l1.4-4.6A8 8 0 1 1 20.5 11.5Z"/>',
    db: '<ellipse cx="12" cy="6" rx="7.5" ry="3"/><path d="M4.5 6v12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3V6M4.5 12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3"/>',
    cart: '<path d="M3 4h2l2.2 10h10L19 7H6"/><circle cx="9" cy="19" r="1.6"/><circle cx="17" cy="19" r="1.6"/>',
    zap: '<path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12Z"/>',
    atom: '<circle cx="12" cy="12" r="2.2"/><ellipse cx="12" cy="12" rx="10" ry="4.3"/><ellipse cx="12" cy="12" rx="10" ry="4.3" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4.3" transform="rotate(120 12 12)"/>',
    py: '<path d="M12 3c-3 0-4.5 1-4.5 3v2H12v1H6c-2 0-3 1.5-3 4s1 4 3 4h1.5v-2.5c0-2 1.5-3.5 3.5-3.5h3c1.7 0 3-1.3 3-3V6c0-2-1.5-3-4-3Z"/><path d="M12 21c3 0 4.5-1 4.5-3v-2H12v-1h6c2 0 3-1.5 3-4s-1-4-3-4h-1.5v2.5c0 2-1.5 3.5-3.5 3.5h-3c-1.7 0-3 1.3-3 3V18c0 2 1.5 3 4 3Z"/>',
    stethoscope: '<path d="M6 3v5a4 4 0 0 0 8 0V3"/><path d="M10 12v3a5 5 0 0 0 9 3"/><circle cx="19" cy="16" r="2.2"/>'
  };
  var SCENE_ICONS = [
    [['term', 0], ['layers', 1], ['cpu', 2]],
    [['cloud', 1], ['code', 3], ['globe', 2]],
    [['factory', 0], ['layers', 1], ['link', 3]],
    [['plane', 0], ['chat', 2], ['db', 3]],
    [['cart', 1], ['globe', 3], ['zap', 0]],
    [['atom', 0], ['py', 1], ['zap', 3]]
  ];
  var ORN =
    '<svg width="70" height="70" viewBox="0 0 70 70" style="left:410px;top:170px;animation:ndspinr 26s linear infinite"><rect x="14" y="14" width="42" height="42" fill="none" stroke="rgba(var(--acc),.4)" stroke-width="1.3" transform="rotate(45 35 35)"/><rect x="24" y="24" width="22" height="22" fill="rgba(var(--acc),.12)" stroke="rgba(var(--acc),.5)" stroke-width="1" transform="rotate(45 35 35)"/></svg>' +
    '<svg width="34" height="34" viewBox="0 0 34 34" style="left:-640px;top:-280px;opacity:.5"><path d="M17 4v26M4 17h26" stroke="rgba(var(--acc),.55)" stroke-width="1.6"/></svg>' +
    '<svg width="26" height="26" viewBox="0 0 26 26" style="left:585px;top:255px;opacity:.5"><path d="M13 2v22M2 13h22" class="s-teal" stroke-width="1.4"/></svg>' +
    '<svg width="90" height="80" viewBox="0 0 90 80" style="left:545px;top:-315px;animation:ndspin 60s linear infinite;opacity:.6"><path d="M45 6 84 72H6Z" fill="none" class="s-teal" stroke-width="1.3"/><path d="M45 26 66 62H24Z" fill="none" stroke="rgba(var(--acc),.3)" stroke-width="1"/></svg>' +
    '<svg width="120" height="120" viewBox="0 0 120 120" style="left:-655px;top:250px;animation:ndspinr 44s linear infinite;opacity:.55"><circle cx="60" cy="60" r="52" fill="none" stroke="color-mix(in srgb,var(--muted) 40%,transparent)" stroke-width="1.2" stroke-dasharray="7 9"/><circle cx="60" cy="60" r="30" fill="none" stroke="rgba(var(--acc),.35)" stroke-width="1" stroke-dasharray="3 7"/><circle cx="60" cy="60" r="4" fill="rgba(var(--acc),.4)"/></svg>' +
    '<svg width="46" height="46" viewBox="0 0 46 46" style="left:620px;top:50px;animation:ndspin 34s linear infinite;opacity:.55"><path d="M23 3v40M3 23h40M9 9l28 28M37 9 9 37" stroke="rgba(var(--acc),.45)" stroke-width="1.4"/></svg>' +
    '<svg width="40" height="40" viewBox="0 0 40 40" style="left:-585px;top:-345px;opacity:.55"><path d="M6 6l28 28M34 6 6 34" stroke="color-mix(in srgb,var(--muted) 50%,transparent)" stroke-width="1.6"/></svg>';

  $('orn').innerHTML = ORN;
  var iconsEl = $('icons'), iconGroups = [];
  SCENE_ICONS.forEach(function (group) {
    var wrap = document.createElement('div');
    wrap.className = 'ico-group';
    group.forEach(function (g) {
      var slot = SLOTS[g[1]];
      var d = document.createElement('div');
      d.className = 'ico';
      d.style.cssText = 'left:' + slot[0] + 'px;top:' + slot[1] + 'px;width:36px;height:36px;color:rgba(var(--acc),.85)';
      d.innerHTML = '<svg viewBox="0 0 24 24" stroke="currentColor">' + IC[g[0]] + '</svg>';
      wrap.appendChild(d);
    });
    iconsEl.appendChild(wrap);
    iconGroups.push(wrap.querySelectorAll('.ico'));
  });

  /* ---------------- element refs ---------------- */
  var el = {
    lap: $('lap'), ph: $('ph'), lapLid: $('lapLid'), lapSh: $('lapSh'), phSh: $('phSh'),
    floor: $('floor'), hexring: $('hexring'), numeral: $('numeral'),
    glowT: $('glowT'), glowG: $('glowG'),
    pxGrid: $('pxGrid'), pxDeep: $('pxDeep'), pxDev: $('pxDev'), pxNear: $('pxNear'),
    scrBoot: $('scrBoot'), scr1: $('scr1'), scr2: $('scr2'), scr3: $('scr3'), scr4: $('scr4'),
    pscr0: $('pscr0'), pscr1: $('pscr1'), pscr2: $('pscr2'), pscr3: $('pscr3'), pscr4: $('pscr4'),
    led: $('led'), lapLabel: $('lapLabel'), lapStatus: $('lapStatus'),
    chipA: $('chipA'), chipB: $('chipB'), chipC: $('chipC'),
    hudFill: $('hudFill'), hudScene: $('hudScene'), hudPct: $('hudPct'), hudTel: $('hudTel'),
    caps: [$('cap0'), $('cap1'), $('cap2'), $('cap3'), $('cap4'), $('cap5')],
    root: document.documentElement, orn: $('orn'), icons: iconsEl
  };

  /* ---------------- state ---------------- */
  var p = 0, vRaw = 0, dir = 1, mx = 0, my = 0, lastP = 0, lastScene = -1, dirty = true;
  var S = 1, icoS = 1, chipL = -420, chipR = 400;

  function metrics() {
    var w = innerWidth;
    S = Math.max(.34, Math.min(1, w / 1440));
    icoS = Math.max(.4, Math.min(1, (w / 2 - 110) / 560));
    chipL = -Math.min(420, Math.max(120, w / 2 - 190));
    chipR = Math.min(400, Math.max(110, w / 2 - 190));
    el.chipA.style.left = chipL + 'px'; el.chipC.style.left = chipL + 'px';
    el.chipB.style.left = chipR + 'px';
    el.orn.style.transform = 'scale(' + icoS.toFixed(3) + ')';
    el.icons.style.transform = 'scale(' + icoS.toFixed(3) + ')';
    dirty = true;
  }

  function onScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var np = max > 0 ? Math.min(1, Math.max(0, (h.scrollTop || window.pageYOffset) / max)) : 0;
    var dp = np - lastP; lastP = np;
    if (dp !== 0) dir = dp >= 0 ? 1 : -1;
    vRaw = Math.min(1, Math.abs(dp) * 240);
    p = np; dirty = true;
  }

  var lastMs = 0;
  function onMouse(e) {
    var now = performance.now();
    if (now - lastMs < 40) return;
    lastMs = now;
    mx = (e.clientX / innerWidth) * 2 - 1;
    my = (e.clientY / innerHeight) * 2 - 1;
    dirty = true;
  }

  /* ---------------- render ---------------- */
  function clamp01(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function px(n) { return n.toFixed(1) + 'px'; }

  function render() {
    var v = vRaw;
    var seg = p * (N - 1);
    var i = Math.min(N - 2, Math.floor(seg));
    var tr = seg - i;
    var tS = tr * tr * (3 - 2 * tr), tB, bump;
    if (reduce) { tB = tS; bump = 0; }
    else {
      var c2 = 1.70158 * (.55 * M) * 1.525;
      tB = tr < .5 ? (Math.pow(2 * tr, 2) * ((c2 + 1) * 2 * tr - c2)) / 2
                   : (Math.pow(2 * tr - 2, 2) * ((c2 + 1) * (tr * 2 - 2) + c2) + 2) / 2;
      bump = Math.sin(Math.PI * tr) * M;
    }
    function P(k) { return k[i] + (k[i + 1] - k[i]) * tS; }
    function R(k) { return k[i] + (k[i + 1] - k[i]) * tB; }

    /* devices */
    var lx = P(lap.x) * S, ly = (P(lap.y) - bump * 42) * S, lz = (P(lap.z) - bump * 150) * S, ls = P(lap.s) * S;
    el.lap.style.transform = 'translate(-50%,-50%) translateX(' + px(lx) + ') translateY(' + px(ly) + ') translateZ(' + px(lz) +
      ') rotateY(' + R(lap.ry).toFixed(2) + 'deg) rotateX(' + P(lap.rx).toFixed(2) + 'deg) rotateZ(' + R(lap.rz).toFixed(2) + 'deg) scale(' + ls.toFixed(3) + ')';
    el.lapLid.style.transform = 'rotateX(' + P(lap.lid).toFixed(2) + 'deg)';

    var hx = P(ph.x) * S, hy = (P(ph.y) - bump * 70) * S, hz = (P(ph.z) + bump * 130) * S, hs = P(ph.s) * S;
    el.ph.style.transform = 'translate(-50%,-50%) translateX(' + px(hx) + ') translateY(' + px(hy) + ') translateZ(' + px(hz) +
      ') rotateY(' + R(ph.ry).toFixed(2) + 'deg) rotateZ(' + (R(ph.rz) + bump * 5).toFixed(2) + 'deg) scale(' + hs.toFixed(3) + ')';

    /* shadows */
    el.lapSh.style.transform = 'translateX(' + px(lx) + ') translateZ(' + px(lz - 60 * S) + ') rotateX(76deg) scale(' +
      (P(lap.s) * 1.08 * S).toFixed(3) + ',' + (P(lap.s) * .85 * S).toFixed(3) + ')';
    el.lapSh.style.opacity = Math.max(.12, Math.min(.42, (P(lap.z) + 780) / 1700)).toFixed(3);
    el.phSh.style.transform = 'translateX(' + px(hx) + ') translateZ(' + px(hz - 60 * S) + ') rotateX(76deg) scale(' + (P(ph.s) * S).toFixed(3) + ')';
    el.phSh.style.opacity = Math.max(.12, Math.min(.42, (P(ph.z) + 780) / 1700)).toFixed(3);

    /* deep layer */
    el.hexring.style.transform = 'translateX(' + px(P(hexX) * S) + ') translateZ(' + px(P(hexZ) * S) + ') scale(' + (P(hexS) * (1 + v * .06)).toFixed(3) + ')';
    el.hexring.style.opacity = P(hexO).toFixed(3);
    el.numeral.style.transform = 'translate(-50%,-52%) translateZ(-420px) rotate(' + (v * dir * 3 * M).toFixed(2) + 'deg) scale(' + (1 + bump * .09).toFixed(3) + ')';

    /* floor */
    el.floor.style.transform = 'translate(-50%,-50%) rotateX(76deg) translateZ(' + (-160 - seg * 30) + 'px) skewX(' + (v * dir * -3).toFixed(2) + 'deg)';
    el.floor.style.backgroundPosition = '0 ' + (seg * -140) + 'px';
    el.floor.style.opacity = Math.min(1, .6 + v * .4).toFixed(3);

    /* glows */
    el.glowT.style.transform = 'translate(' + px(P(gtX)) + ',' + px(P(gtY)) + ') scale(' + (1 + v * .22).toFixed(3) + ')';
    el.glowT.style.opacity = Math.min(1, P(gtO) + v * .3).toFixed(3);
    el.glowG.style.transform = 'translate(' + px(P(ggX)) + ',' + px(P(ggY)) + ') scale(' + (1 + v * .22).toFixed(3) + ')';
    el.glowG.style.opacity = Math.min(1, P(ggO) + v * .3).toFixed(3);

    /* mouse parallax */
    el.pxGrid.style.transform = 'translate(' + px(mx * -26 * PAR) + ',' + px(my * -14 * PAR) + ')';
    el.pxDeep.style.transform = 'translate(' + px(mx * -42 * PAR) + ',' + px(my * -24 * PAR) + ') rotateY(' + (mx * -2.5 * PAR).toFixed(2) + 'deg)';
    el.pxDev.style.transform = 'translate(' + px(mx * 14 * PAR) + ',' + px(my * 8 * PAR) + ') rotateY(' + (mx * 1.6 * PAR).toFixed(2) + 'deg)';
    el.pxNear.style.transform = 'translate(' + px(mx * 32 * PAR) + ',' + px(my * 20 * PAR) + ')';

    /* screens */
    function fade(n) { return clamp01(1 - Math.abs(seg - n) * 1.5); }
    var idle = Math.max(fade(0), fade(5));
    el.scrBoot.style.opacity = idle;
    el.scr1.style.opacity = fade(1); el.scr2.style.opacity = fade(2);
    el.scr3.style.opacity = fade(3); el.scr4.style.opacity = fade(4);
    el.pscr0.style.opacity = idle;
    el.pscr1.style.opacity = fade(1); el.pscr2.style.opacity = fade(2);
    el.pscr3.style.opacity = fade(3); el.pscr4.style.opacity = fade(4);

    /* captions */
    for (var c = 0; c < 6; c++) {
      var o = Math.max(0, 1 - Math.abs(seg - c) * 2.1);
      var cap = el.caps[c];
      cap.style.opacity = o.toFixed(3);
      cap.style.setProperty('--y', ((seg - c) * -46).toFixed(1) + 'px');
      cap.style.visibility = o < .02 ? 'hidden' : 'visible';
    }

    /* icon groups */
    var scene = Math.round(seg);
    for (var g = 0; g < iconGroups.length; g++) {
      var go = fade(g) * .9;
      var nodes = iconGroups[g];
      for (var k = 0; k < nodes.length; k++) nodes[k].style.opacity = go.toFixed(3);
    }

    /* HUD */
    el.hudFill.style.width = (p * 100).toFixed(2) + '%';
    el.hudPct.textContent = Math.round(p * 100) + '%';
    el.hudScene.textContent = '0' + (scene + 1);
    el.hudTel.textContent = 'LAP [ ' + R(lap.ry).toFixed(0) + '° / ' + P(lap.z).toFixed(0) + 'z ] · PH [ ' +
      R(ph.ry).toFixed(0) + '° / ' + P(ph.z).toFixed(0) + 'z ] · VEL [ ' + v.toFixed(2) + ' ]';

    /* scene-scoped content (only on change) */
    if (scene !== lastScene) {
      lastScene = scene;
      var s = SCENES[scene];
      el.root.style.setProperty('--acc', s.acc);
      el.lapLabel.textContent = s.label;
      el.lapStatus.textContent = s.status;
      el.lapStatus.style.color = s.live ? 'var(--teal)' : 'var(--crimson-hi)';
      el.led.style.background = s.live ? 'var(--teal)' : 'var(--crimson-hi)';
      el.numeral.textContent = s.num;
      el.numeral.style.webkitTextStrokeColor = 'rgba(' + s.acc + ',' + (scene === 0 || scene === 5 ? .12 : .2) + ')';
      el.chipA.textContent = s.chips[0]; el.chipB.textContent = s.chips[1]; el.chipC.textContent = s.chips[2];
    }
  }

  /* ---------------- loop ---------------- */
  function frame() {
    if (dirty || vRaw > .002) {
      if (!reduce) vRaw *= .88; else vRaw = 0;
      if (vRaw < .002) vRaw = 0;
      render();
      dirty = false;
    }
    requestAnimationFrame(frame);
  }

  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', metrics);
  if (fine && !reduce) addEventListener('mousemove', onMouse, { passive: true });

  metrics();
  onScroll();
  render();
  requestAnimationFrame(frame);
})();
