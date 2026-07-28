/* ============================================================
   Numidea Labs — the work as an engineering drawing.
   Screenshots stay flat (razor sharp); depth is drawn, not faked.
   Sheets change with a hard wipe — never a cross-blend.
   Trilingual FR / EN / AR with RTL, synced to the main site.
   ============================================================ */
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  var $ = function (id) { return document.getElementById(id); };
  var P = '../assets/previews/';

  /* ---------------- content: all seven, honest statuses ---------------- */
  var SHEETS = [
    { id: 'bordjsteel', name: 'Bordj Steel', acc: '214,55,48', live: true,
      url: 'https://bordjsteelb2b.netlify.app', shot: P + 'bordjsteel.webp' },
    { id: 'almaflowclim', name: 'AlmaFlowClim', acc: '59,164,224', live: true,
      url: 'https://almaflowclim.netlify.app', shot: P + 'almaflowclim.webp' },
    { id: 'alliance', name: 'Alliance Travel', acc: '95,214,134', live: true,
      url: 'https://alliancetravel34.netlify.app', shot: P + 'alliancetravel.webp' },
    { id: 'nomara', name: 'Nomara Voyages', acc: '34,180,104', live: true,
      url: 'https://nomaravoyages.netlify.app', shot: P + 'nomara.webp' },
    { id: 'glaive', name: 'Glaive Store', acc: '255,90,31', live: true,
      url: 'https://glaivestore.netlify.app', shot: P + 'glaive.webp' },
    { id: 'cherfia', name: 'Doctor Cherfia Clinic', acc: '52,208,232', live: false, url: null, shot: null },
    { id: 'etoile', name: "Étoile de l'Est", acc: '167,139,250', live: false, url: null, shot: null }
  ];

  var I18N = {
    fr: {
      dir: 'ltr', tag: 'LE TRAVAIL — PLANCHE PAR PLANCHE',
      project: 'PROJET', sheet: 'PLANCHE', sector: 'SECTEUR', status: 'STATUT', drawn: 'DESSINÉ',
      live: 'EN LIGNE', soon: 'EN COURS', visit: 'voir le site ↗',
      cue: 'FAITES DÉFILER POUR CHANGER DE PLANCHE ↓',
      stamp: 'PLANCHE EN PRÉPARATION', stampSub: 'aucune capture — le statut reste honnête',
      s: {
        bordjsteel: { kick: 'ACIER · B2B · ALGÉRIE', sector: 'ACIER · B2B', copy: 'Une réputation bâtie hors ligne, invisible en ligne. On a dessiné toute la présence B2B : catalogue produits, références, espace recrutement.' },
        almaflowclim: { kick: 'CVC INDUSTRIEL · FRANCE', sector: 'CVC · FRANCE', copy: 'Chaque demande de devis arrivait par téléphone — ou pas du tout. Un site sans dépendances, conçu pour transformer les visites en devis.' },
        alliance: { kick: 'VOYAGE · BORDJ BOU ARRÉRIDJ', sector: 'VOYAGE · BBA', copy: 'Marque, tunnel de réservation et stratégie visas fondée sur 544 634 demandes analysées.' },
        nomara: { kick: 'VOYAGE · OMRA · CONSTANTINE', sector: 'OMRA · VOYAGE', copy: 'Une vitrine bilingue pour les voyages organisés et les départs Omra — nette, rapide, pensée SEO.' },
        glaive: { kick: 'COMMERCE · GAMING', sector: 'COMMERCE', copy: 'Une boutique de matériel gaming à l\'identité affûtée, conçue pour convertir.' },
        cherfia: { kick: 'SANTÉ · NEXT.JS', sector: 'SANTÉ', copy: 'Des rendez-vous sur papier. Une plateforme de clinique prête à la réservation, calme et rassurante.' },
        etoile: { kick: 'COMMERCE · PWA · SUPABASE', sector: 'PWA · RETAIL', copy: 'Une application web progressive offline-first : la boutique qui survit à une connexion coupée.' }
      }
    },
    en: {
      dir: 'ltr', tag: 'THE WORK — SHEET BY SHEET',
      project: 'PROJECT', sheet: 'SHEET', sector: 'SECTOR', status: 'STATUS', drawn: 'DRAWN',
      live: 'LIVE', soon: 'IN BUILD', visit: 'visit live ↗',
      cue: 'SCROLL TO ADVANCE SHEET ↓',
      stamp: 'SHEET IN PREPARATION', stampSub: 'no capture yet — the status stays honest',
      s: {
        bordjsteel: { kick: 'STEEL · B2B · ALGERIA', sector: 'STEEL · B2B', copy: 'A reputation built entirely offline, invisible online. We drew the whole B2B presence: catalogue, references, careers.' },
        almaflowclim: { kick: 'INDUSTRIAL HVAC · FRANCE', sector: 'HVAC · FRANCE', copy: 'Every quote request arrived by phone — or not at all. A zero-dependency site engineered to turn visits into quotes.' },
        alliance: { kick: 'TRAVEL · BORDJ BOU ARRÉRIDJ', sector: 'TRAVEL · BBA', copy: 'Brand, booking funnel and a visa-market strategy built on 544,634 analyzed requests.' },
        nomara: { kick: 'TRAVEL · OMRA · CONSTANTINE', sector: 'OMRA · TRAVEL', copy: 'A bilingual showcase for organised trips and Omra departures — clean, fast, SEO-built.' },
        glaive: { kick: 'COMMERCE · GAMING', sector: 'COMMERCE', copy: 'A gaming-gear storefront with a hard, gamer-first brand, engineered to convert.' },
        cherfia: { kick: 'HEALTHCARE · NEXT.JS', sector: 'HEALTHCARE', copy: 'Appointments on paper. A calm, booking-ready clinic platform that makes a small practice look established.' },
        etoile: { kick: 'COMMERCE · PWA · SUPABASE', sector: 'PWA · RETAIL', copy: 'An offline-first progressive web app — the shop that survives a dead connection.' }
      }
    },
    ar: {
      dir: 'rtl', tag: 'الأعمال — لوحةً بلوحة',
      project: 'المشروع', sheet: 'اللوحة', sector: 'القطاع', status: 'الحالة', drawn: 'رُسم',
      live: 'مباشر', soon: 'قيد الإنجاز', visit: 'زيارة الموقع ↗',
      cue: 'مرّر لتغيير اللوحة ↓',
      stamp: 'لوحة قيد التحضير', stampSub: 'لا لقطة بعد — الحالة تبقى صادقة',
      s: {
        bordjsteel: { kick: 'صلب · B2B · الجزائر', sector: 'صلب · B2B', copy: 'سمعة بُنيت خارج الإنترنت، وغياب تام عليه. رسمنا الحضور المؤسسي كاملاً: كتالوج، مراجع، وفضاء توظيف.' },
        almaflowclim: { kick: 'تكييف صناعي · فرنسا', sector: 'تكييف · فرنسا', copy: 'كل طلب عرض سعر كان يصل هاتفياً — أو لا يصل. موقع بلا تبعيات، مصمّم لتحويل الزيارات إلى طلبات.' },
        alliance: { kick: 'سفر · برج بوعريريج', sector: 'سفر · برج', copy: 'علامة، ومسار حجز، واستراتيجية تأشيرات مبنية على تحليل ٥٤٤٬٦٣٤ طلباً.' },
        nomara: { kick: 'سفر · عمرة · قسنطينة', sector: 'عمرة · سفر', copy: 'واجهة ثنائية اللغة للرحلات المنظمة ورحلات العمرة — نظيفة وسريعة ومهيّأة للسيو.' },
        glaive: { kick: 'تجارة · ألعاب', sector: 'تجارة', copy: 'متجر لعتاد الألعاب بهوية حادّة، مبنيٌّ للتحويل.' },
        cherfia: { kick: 'صحة · Next.js', sector: 'صحة', copy: 'مواعيد على الورق. منصّة عيادة جاهزة للحجز، هادئة وتمنح الثقة.' },
        etoile: { kick: 'تجارة · PWA · Supabase', sector: 'PWA · تجزئة', copy: 'تطبيق ويب تقدّمي يعمل دون اتصال — المتجر الذي ينجو من انقطاع الشبكة.' }
      }
    }
  };

  var N = SHEETS.length;
  $('runway').style.height = (N * 105 + 30) + 'vh';
  $('tbT').textContent = N;

  /* ---------------- axonometric scaffolding (drawn once) ---------------- */
  function boxPath(cx, cy, w, h, d) {
    var x = cx - w / 2, y = cy - h / 2, dx = d * .55, dy = -d * .32;
    return {
      front: 'M' + x + ' ' + y + 'h' + w + 'v' + h + 'h' + (-w) + 'Z',
      back: 'M' + (x + dx) + ' ' + (y + dy) + 'h' + w + 'v' + h + 'h' + (-w) + 'Z',
      edges: 'M' + x + ' ' + y + 'l' + dx + ' ' + dy +
             'M' + (x + w) + ' ' + y + 'l' + dx + ' ' + dy +
             'M' + (x + w) + ' ' + (y + h) + 'l' + dx + ' ' + dy +
             'M' + x + ' ' + (y + h) + 'l' + dx + ' ' + dy
    };
  }
  var svg = '', RINGS = 5;
  for (var s = RINGS; s >= 1; s--) {
    var b = boxPath(720, 420, 640 - s * 42, 400 - s * 26, 58);
    svg += '<path class="ax-box" data-ring="' + (RINGS - s) + '" d="' + b.front + '"/>' +
           '<path class="ax-hidden" d="' + b.back + '"/>' +
           '<path class="ax-box" data-ring="' + (RINGS - s) + '" d="' + b.edges + '"/>';
  }
  svg += '<path class="ax-hidden" d="M120 120h170M120 120v170M1320 780h-170M1320 780v-170"/>';
  svg += '<path class="ax-hidden" d="M120 780h170M120 780v-170M1320 120h-170M1320 120v170"/>';
  $('axGroup').innerHTML = svg;
  var axBoxes = $('axGroup').querySelectorAll('.ax-box');

  /* ---------------- elements ---------------- */
  var el = {
    shot: $('shot'), inprep: $('inprep'), stamp: $('stampTxt'), stampSub: $('stampSub'),
    wipe: $('wipe'), plate: $('platewrap'), callout: $('callout'),
    cNum: $('cNum'), cKick: $('cKick'), cName: $('cName'), cCopy: $('cCopy'), cLink: $('cLink'),
    tbName: $('tbName'), tbN: $('tbN'), tbSector: $('tbSector'), tbStatus: $('tbStatus'),
    lblProject: $('lblProject'), lblSheet: $('lblSheet'), lblSector: $('lblSector'),
    lblStatus: $('lblStatus'), lblDrawn: $('lblDrawn'),
    grid: $('gridCoarse'), ax: $('axGroup'), cue: $('cue'), hudTag: $('hudTag'),
    rail: $('rail'), root: document.documentElement
  };

  /* ---------------- language ---------------- */
  var lang = 'fr';
  try { lang = localStorage.getItem('numidea-lang') || 'fr'; } catch (e) {}
  if (!I18N[lang]) lang = 'fr';
  function D() { return I18N[lang]; }

  var railBtns = [];
  SHEETS.forEach(function (sh, k) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.innerHTML = '<span class="bar"></span><span class="n">' + pad(k + 1) + '</span>';
    btn.addEventListener('click', function () { goTo(k); });
    el.rail.appendChild(btn); railBtns.push(btn);
  });
  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function applyLang(l) {
    lang = I18N[l] ? l : 'fr';
    var d = D();
    el.root.setAttribute('lang', lang);
    el.root.setAttribute('dir', d.dir);
    try { localStorage.setItem('numidea-lang', lang); } catch (e) {}
    el.hudTag.textContent = d.tag;
    el.lblProject.textContent = d.project; el.lblSheet.textContent = d.sheet;
    el.lblSector.textContent = d.sector; el.lblStatus.textContent = d.status;
    el.lblDrawn.textContent = d.drawn;
    el.cue.textContent = d.cue;
    el.stamp.textContent = d.stamp; el.stampSub.textContent = d.stampSub;
    document.querySelectorAll('.lang button').forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-lang') === lang ? 'true' : 'false');
    });
    cur = -1; render();          // force the sheet copy to re-resolve
  }
  document.querySelectorAll('.lang button').forEach(function (b) {
    b.addEventListener('click', function () { applyLang(b.getAttribute('data-lang')); });
  });

  /* ---------------- state ---------------- */
  var p = 0, mx = 0, my = 0, cur = -1, dirty = true;

  function apply(k) {
    if (k === cur) return;
    cur = k;
    var it = SHEETS[k], d = D(), t = d.s[it.id];
    if (it.shot) {
      el.shot.src = it.shot; el.shot.alt = it.name; el.shot.hidden = false; el.inprep.hidden = true;
    } else {
      el.shot.hidden = true; el.inprep.hidden = false;
    }
    el.cNum.textContent = pad(k + 1);
    el.cKick.textContent = t.kick;
    el.cName.textContent = it.name;
    el.cCopy.textContent = t.copy;
    if (it.url) { el.cLink.href = it.url; el.cLink.textContent = d.visit; el.cLink.hidden = false; }
    else el.cLink.hidden = true;
    el.tbName.textContent = it.name.toUpperCase();
    el.tbN.textContent = pad(k + 1);
    el.tbSector.textContent = t.sector;
    el.tbStatus.textContent = it.live ? d.live : d.soon;
    el.tbStatus.className = it.live ? 'live' : 'soon';
    el.root.style.setProperty('--acc', it.acc);
    for (var i = 0; i < axBoxes.length; i++) {
      axBoxes[i].classList.toggle('on', +axBoxes[i].dataset.ring === (k % RINGS));
    }
    railBtns.forEach(function (b, i) { b.classList.toggle('on', i === k); });
  }

  function goTo(k) {
    var h = document.documentElement, max = h.scrollHeight - h.clientHeight;
    window.scrollTo({ top: max * ((k + .25) / N), behavior: reduce ? 'auto' : 'smooth' });
  }

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

    // hard wipe across the middle of a segment — no cross-blend at any point
    var w = 0, edge = 0;
    if (k < N - 1) {
      var a = Math.max(0, Math.min(1, (t - .42) / .08));
      var bb = Math.max(0, Math.min(1, (t - .50) / .08));
      w = a - bb; edge = w > .02 ? 1 : 0;
      apply(t >= .5 ? k + 1 : k);
    } else apply(k);
    el.wipe.style.setProperty('--wipe', w.toFixed(3));
    el.wipe.style.setProperty('--wipeEdge', edge);

    el.plate.style.setProperty('--pY', (Math.sin(seg * Math.PI) * -8 + (reduce ? 0 : my * -6)).toFixed(1) + 'px');
    el.callout.style.setProperty('--cY', (Math.sin(seg * Math.PI) * -5).toFixed(1) + 'px');
    if (!reduce) {
      el.grid.style.transform = 'translate(' + (mx * -16).toFixed(1) + 'px,' + (my * -10 - seg * 12).toFixed(1) + 'px)';
      el.ax.setAttribute('transform', 'translate(' + (mx * 18).toFixed(1) + ',' + (my * 11).toFixed(1) + ')');
    }
    el.cue.style.opacity = p > .02 ? 0 : 1;
  }

  addEventListener('scroll', onScroll, { passive: true });
  if (fine && !reduce) addEventListener('mousemove', onMove, { passive: true });
  addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { goTo(Math.min(N - 1, cur + 1)); }
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { goTo(Math.max(0, cur - 1)); }
  });

  (function loop() { if (dirty) { render(); dirty = false; } requestAnimationFrame(loop); })();
  applyLang(lang);
  onScroll(); render();
})();
