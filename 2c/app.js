/* Layout 2c — Gallery-First interactions */
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var html = document.documentElement;

  /* theme swatches */
  var THEMES = [{ id: 'arcanum', c: '#E6B450' }, { id: 'noir', c: '#BD0927' }, { id: 'daylight', c: '#C20A26' }, { id: 'mono', c: '#E5533D' }, { id: 'altneon', c: '#F59E0B' }];
  var themesEl = document.getElementById('themes');
  function setTheme(id) {
    html.setAttribute('data-theme', id);
    try { localStorage.setItem('numidea-theme', id); } catch (e) {}
    themesEl.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.t === id ? 'true' : 'false'); });
  }
  THEMES.forEach(function (t) {
    var b = document.createElement('button'); b.className = 'l2-sw-theme'; b.dataset.t = t.id;
    b.style.background = t.c; b.setAttribute('aria-label', t.id); b.title = t.id;
    b.addEventListener('click', function () { setTheme(t.id); }); themesEl.appendChild(b);
  });
  setTheme(html.getAttribute('data-theme') || 'arcanum');

  /* ---- projects (real, honest statuses) ---- */
  var P = '../assets/previews/';
  var PROJECTS = [
    { slug: 'bordjsteel', name: 'Bordj Steel', cat: 'industrial', live: true, shot: P + 'bordjsteel.webp',
      url: 'https://bordjsteelb2b.netlify.app', meta: 'steel · B2B · Algeria', size: 'hero',
      challenge: 'A structural-steel manufacturer with a reputation built entirely offline — and no credible presence online.',
      solution: 'A full B2B corporate site: product catalogue, references, media centre and a careers space, engineered to look as solid as the steel.',
      outcome: 'Live, and carrying the company\'s B2B presence.', stack: 'B2B · Corporate · Multi-section' },
    { slug: 'almaflowclim', name: 'AlmaFlowClim', cat: 'industrial', live: true, shot: P + 'almaflowclim.webp',
      url: 'https://almaflowclim.netlify.app', meta: 'industrial HVAC · France', size: 'small',
      challenge: 'An HVAC contractor invisible online — every quote request arriving by phone, or not at all.',
      solution: 'A fast, zero-dependency site engineered around one job: turning visits into quote requests. SEO, responsive, deployed.',
      outcome: 'In production — inbound quote requests now arrive on their own.', stack: 'HTML/CSS/JS · SEO · conversion funnel' },
    { slug: 'alliance', name: 'Alliance Travel', cat: 'travel', live: true, shot: P + 'alliancetravel.webp',
      url: 'https://alliancetravel34.netlify.app', meta: 'travel · Bordj Bou Arréridj', size: 'small',
      challenge: 'A travel agency running on WhatsApp chaos — no brand, no funnel, no idea which offers the market actually wanted.',
      solution: 'Brand, booking funnel, and a Schengen-visa market strategy grounded in data — 544,634 visa requests analyzed.',
      outcome: 'A complete growth system, live — strategy the agency could never have guessed from the counter.', stack: 'brand + funnel · market intelligence · FR / AR' },
    { slug: 'nomara', name: 'Nomara Voyages', cat: 'travel', live: true, shot: P + 'nomara.webp',
      url: 'https://nomaravoyages.netlify.app', meta: 'travel · Omra · Constantine', size: 'small',
      challenge: 'A bilingual travel and Omra agency with no bookable, credible presence online.',
      solution: 'A bilingual showcase for organised trips and Omra departures — clean, fast, SEO-built.',
      outcome: 'Live, representing the agency to a bilingual audience.', stack: 'Bilingual · SEO · Static' },
    { slug: 'glaive', name: 'Glaive Store', cat: 'commerce', live: true, shot: P + 'glaive.webp',
      url: 'https://glaivestore.netlify.app', meta: 'commerce · gaming', size: 'small',
      challenge: 'A gaming-gear store needing a brand sharp enough to stand out and a storefront built to convert.',
      solution: 'A conversion-focused e-commerce brand and storefront with a hard, gamer-first identity.',
      outcome: 'Live storefront carrying the brand.', stack: 'Commerce · Brand' },
    { slug: 'cherfia', name: 'Doctor Cherfia Clinic', cat: 'inbuild', live: false, shot: null,
      url: null, meta: 'healthcare · Next.js', size: 'hero',
      challenge: 'A clinic running appointments on paper, with no way for patients to book online.',
      solution: 'A calm, booking-ready Next.js clinic platform that makes a small practice look established.',
      outcome: 'In build — booking-ready.', stack: 'Next.js · Booking' },
    { slug: 'etoile', name: "Étoile de l'Est", cat: 'inbuild', live: false, shot: null,
      url: null, meta: 'retail · PWA · Supabase', size: 'small',
      challenge: 'A retailer needing a shopping experience that survives a dead connection.',
      solution: 'An offline-first progressive web app on Supabase — real engineering underneath.',
      outcome: 'In build — offline-first.', stack: 'PWA · Supabase · Offline' }
  ];
  var FILTERS = [
    { key: 'all', label: 'All' }, { key: 'industrial', label: 'Industrial' },
    { key: 'travel', label: 'Travel' }, { key: 'commerce', label: 'Commerce' }, { key: 'inbuild', label: 'In build' }
  ];

  /* ---- bento grid ---- */
  var bento = document.getElementById('bento'), emptyEl = document.getElementById('empty');
  var filtersEl = document.getElementById('filters');
  var curFilter = 'all';

  function cellHTML(p) {
    // no-screenshot cells get a mark + sector, never a duplicate of the name in the scrim
    var media = p.shot
      ? '<img src="' + p.shot + '" alt="" loading="lazy">'
      : '<span class="art"><span class="art-mark">◆</span><span class="art-sector">' + p.meta + '</span></span>';
    return '<button class="c-cell ' + p.size + '" data-slug="' + p.slug + '" data-cat="' + p.cat + '" type="button">'
      + media
      + '<span class="c-scrim"><b>' + p.name + '</b>'
      + '<span class="c-badge' + (p.live ? ' live' : '') + '">' + (p.live ? 'LIVE' : 'SOON') + '</span>'
      + '<span class="c-open">open case →</span></span></button>';
  }

  function buildGrid() {
    var list = PROJECTS.filter(function (p) { return curFilter === 'all' || p.cat === curFilter; });
    emptyEl.hidden = list.length !== 0;
    if (!list.length) { bento.innerHTML = ''; return; }
    // split into two mirrored bands: [hero + column] then [column + hero]
    var heroes = list.filter(function (p) { return p.size === 'hero'; });
    var smalls = list.filter(function (p) { return p.size !== 'hero'; });
    var html = '';
    function col(items) { return '<div class="c-col">' + items.map(cellHTML).join('') + '</div>'; }
    if (heroes.length && smalls.length) {
      var half = Math.ceil(smalls.length / 2);
      html += '<div class="c-band">' + cellHTML(heroes[0]) + col(smalls.slice(0, half)) + '</div>';
      if (heroes[1] || smalls.slice(half).length) {
        html += '<div class="c-band rev">' + col(smalls.slice(half))
              + (heroes[1] ? cellHTML(heroes[1]) : '') + '</div>';
      }
    } else {
      html += '<div class="c-band" style="grid-template-columns:repeat(auto-fill,minmax(240px,1fr))">' + list.map(cellHTML).join('') + '</div>';
    }
    bento.innerHTML = html;
    bento.querySelectorAll('.c-cell').forEach(function (c) {
      c.addEventListener('click', function () { openCase(c.dataset.slug, true); });
    });
  }

  FILTERS.forEach(function (f) {
    var n = f.key === 'all' ? PROJECTS.length : PROJECTS.filter(function (p) { return p.cat === f.key; }).length;
    if (!n) return;
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'c-filter'; b.dataset.k = f.key;
    b.setAttribute('aria-pressed', f.key === 'all' ? 'true' : 'false');
    b.innerHTML = f.label + '<span class="n">' + n + '</span>';
    b.addEventListener('click', function () {
      curFilter = f.key;
      filtersEl.querySelectorAll('.c-filter').forEach(function (x) { x.setAttribute('aria-pressed', x.dataset.k === curFilter ? 'true' : 'false'); });
      buildGrid();
    });
    filtersEl.appendChild(b);
  });
  buildGrid();

  /* ---- case panel ---- */
  var cur = 0;
  var el = {
    name: document.getElementById('cName'), badge: document.getElementById('cBadge'), meta: document.getElementById('cMeta'),
    ch: document.getElementById('cChallenge'), so: document.getElementById('cSolution'), ou: document.getElementById('cOutcome'),
    st: document.getElementById('cStack'), next: document.getElementById('cNext'), visit: document.getElementById('cVisit')
  };
  function openCase(slug, scroll) {
    var i = PROJECTS.findIndex(function (p) { return p.slug === slug; });
    if (i < 0) i = 0;
    cur = i; var p = PROJECTS[i];
    el.name.textContent = p.name;
    el.badge.textContent = p.live ? 'LIVE' : 'SOON';
    el.badge.className = 'c-badge' + (p.live ? ' live' : '');
    el.meta.textContent = p.meta;
    el.ch.textContent = p.challenge; el.so.textContent = p.solution; el.ou.textContent = p.outcome;
    el.st.textContent = p.stack;
    if (p.url) { el.visit.href = p.url; el.visit.hidden = false; } else { el.visit.hidden = true; }
    var nx = PROJECTS[(cur + 1) % PROJECTS.length];
    el.next.textContent = 'next case: ' + nx.name + ' →';
    if (scroll) {
      var top = document.getElementById('case').getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top: top, behavior: reduce ? 'auto' : 'smooth' });
    }
  }
  el.next.addEventListener('click', function () { openCase(PROJECTS[(cur + 1) % PROJECTS.length].slug, true); });
  openCase(PROJECTS[0].slug, false);

  /* ---- résumé accordion ---- */
  var cvBtn = document.getElementById('cvBtn'), cv = document.getElementById('cv');
  cvBtn.addEventListener('click', function () {
    var open = cv.classList.toggle('open');
    cvBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    cvBtn.textContent = open ? 'Close ↑' : 'Résumé ↴';
  });

  /* ---- form + top ---- */
  document.getElementById('c-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var f = e.target.elements;
    window.location.href = 'mailto:hello@numidealabs.com?subject=' + encodeURIComponent('Numidea Preview')
      + '&body=' + encodeURIComponent('Contact: ' + f.contact.value + '\n\nIdea: ' + f.idea.value);
  });
  document.getElementById('toTop').addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });

  /* ---- particles ---- */
  if (!reduce) {
    var pw = document.querySelector('.l2-particles');
    [[12, 12, 20, 0], [34, 9, 25, -9], [58, 14, 27, -16], [81, 10, 18, -5]].forEach(function (c) {
      var s = document.createElement('span'); s.textContent = '◆';
      s.style.left = c[0] + '%'; s.style.fontSize = c[1] + 'px'; s.style.animationDuration = c[2] + 's'; s.style.animationDelay = c[3] + 's';
      pw.appendChild(s);
    });
  }
})();
