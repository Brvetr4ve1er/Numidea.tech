/* Layout 2a — interactions (vanilla, self-contained) */
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var html = document.documentElement;

  /* ---- theme swatches (shared key with the main site) ---- */
  var THEMES = [
    { id: 'arcanum', c: '#E6B450' }, { id: 'noir', c: '#BD0927' },
    { id: 'daylight', c: '#C20A26' }, { id: 'mono', c: '#E5533D' }, { id: 'altneon', c: '#F59E0B' }
  ];
  var themesEl = document.getElementById('themes');
  function setTheme(id) {
    html.setAttribute('data-theme', id);
    try { localStorage.setItem('numidea-theme', id); } catch (e) {}
    themesEl.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.t === id ? 'true' : 'false'); });
  }
  THEMES.forEach(function (t) {
    var b = document.createElement('button');
    b.className = 'l2-sw-theme'; b.dataset.t = t.id; b.style.background = t.c;
    b.setAttribute('aria-label', t.id); b.title = t.id;
    b.addEventListener('click', function () { setTheme(t.id); });
    themesEl.appendChild(b);
  });
  setTheme(html.getAttribute('data-theme') || 'arcanum');

  /* ---- data ---- */
  var P = '../assets/previews/';
  var FEATURED = [
    { name: 'AlmaFlowClim', status: 'LIVE', shot: P + 'almaflowclim.webp' },
    { name: 'Bordj Steel', status: 'LIVE', shot: P + 'bordjsteel.webp' },
    { name: 'Alliance Travel', status: 'LIVE', shot: P + 'alliancetravel.webp' }
  ];
  var CASES = [
    { name: 'Alliance Travel', badge: 'LIVE', meta: 'travel · Bordj Bou Arréridj', shot: P + 'alliancetravel.webp',
      problem: 'A travel agency running on WhatsApp chaos — no brand, no funnel, no way to know which offers the market actually wanted.',
      built: 'Brand, booking funnel, and a Schengen-visa market strategy grounded in data — 544,634 visa requests analyzed to find where the demand really is.',
      result: 'A complete growth system, live — strategy the agency could never have guessed from the counter.', stack: 'brand + funnel · market intelligence · FR / AR' },
    { name: 'Nomara Voyages', badge: 'LIVE', meta: 'travel · Omra · Constantine', shot: P + 'nomara.webp',
      problem: 'A bilingual travel & Omra agency with no credible, bookable presence online.',
      built: 'A bilingual showcase site for organised trips and Omra departures — clean, fast, and SEO-built.',
      result: 'Live and representing the agency to a bilingual audience.', stack: 'Bilingual · SEO · Static' },
    { name: 'Glaive Store', badge: 'LIVE', meta: 'commerce · gaming', shot: P + 'glaive.webp',
      problem: 'A gaming-gear store needed a sharp brand and a storefront built to convert.',
      built: 'A conversion-focused e-commerce brand and storefront with a hard, gamer-first identity.',
      result: 'Live storefront carrying the brand.', stack: 'Commerce · Brand' },
    { name: 'Doctor Cherfia Clinic', badge: 'SOON', meta: 'healthcare · doctorcherfia.dz', shot: null,
      problem: 'A clinic running appointments on paper — no way to book online.',
      built: 'A calm, booking-ready Next.js clinic platform that makes a small practice look established.',
      result: 'In build — booking-ready.', stack: 'Next.js · Booking' },
    { name: "Étoile de l'Est", badge: 'SOON', meta: 'retail · PWA', shot: null,
      problem: 'A retailer needing a resilient, offline-first shopping experience.',
      built: 'An offline-first progressive web app on Supabase — real engineering underneath.',
      result: 'In build — offline-first.', stack: 'PWA · Supabase · Offline' }
  ];
  var FAMILIES = [
    { num: 'I — THE BUILD', title: 'Sites & web apps', tag: 'What you open, click, and buy through.', cta: 'see the catalogue ↓',
      items: [['★', 'Sites & web apps', 'the obvious choice'], ['', 'Identity & visual systems', 'trust before the first word'], ['', 'Store & booking', 'from visit to checkout'], ['', 'Graphic & social design', 'you scroll, you stop']] },
    { num: 'II — THE ENGINE', title: 'Automation & intelligence', tag: 'Your moat — machinery almost no local studio builds.', cta: 'see the catalogue ↓',
      items: [['★', 'Automation & pipelines', 'kill the grind'], ['★', 'Market & product intelligence', 'see the market clearly'], ['', 'Data science & analytics', 'signal in the noise']] },
    { num: 'III — THE MIND', title: 'Strategy & systems', tag: 'Strategy, systems and tools that compound.', cta: 'see the catalogue ↓',
      items: [['★', 'Strategy & growth', 'data, not vibes'], ['', 'Knowledge systems', 'a company that remembers'], ['', 'Custom AI tools & skills', 'software that builds your software']] }
  ];

  /* ---- hero featured rotator ---- */
  var frame = document.querySelector('.l2-frame'), chipsEl = document.getElementById('chips');
  var featName = document.getElementById('featName'), featBadge = document.getElementById('featBadge');
  var imgs = [], feat = 0, timer = null, circled = ['①', '②', '③', '④', '⑤'];
  FEATURED.forEach(function (f, i) {
    var im = document.createElement('img'); im.src = f.shot; im.alt = f.name; im.loading = 'lazy';
    if (i === 0) im.className = 'on'; frame.appendChild(im); imgs.push(im);
    var c = document.createElement('button'); c.className = 'l2-chip' + (i === 0 ? ' active' : '');
    c.innerHTML = circled[i] + ' ' + f.name;
    c.addEventListener('click', function () { stopRotate(); showFeat(i); });
    chipsEl.appendChild(c);
  });
  function showFeat(i) {
    feat = i;
    imgs.forEach(function (im, k) { im.classList.toggle('on', k === i); });
    chipsEl.querySelectorAll('.l2-chip').forEach(function (c, k) { c.classList.toggle('active', k === i); });
    featName.textContent = FEATURED[i].name;
    featBadge.textContent = FEATURED[i].status;
    featBadge.className = 'l2-badge' + (FEATURED[i].status === 'LIVE' ? ' live' : '');
  }
  function stopRotate() { if (timer) { clearInterval(timer); timer = null; } }
  if (!reduce) timer = setInterval(function () {
    if (!modal.hidden) return;
    showFeat((feat + 1) % FEATURED.length);
  }, 6000);
  showFeat(0);

  /* ---- small cards + modal ---- */
  var cardsEl = document.getElementById('cards'), modal = document.getElementById('modal');
  var mName = document.getElementById('mName'), mBadge = document.getElementById('mBadge'), mMeta = document.getElementById('mMeta');
  var mShot = document.getElementById('mShot'), mProblem = document.getElementById('mProblem'), mBuilt = document.getElementById('mBuilt');
  var mResult = document.getElementById('mResult'), mStack = document.getElementById('mStack'), mNext = document.getElementById('mNext');
  var curCase = 0, lastFocus = null;
  CASES.forEach(function (c, i) {
    var el = document.createElement('div'); el.className = 'l2-card'; el.tabIndex = 0; el.setAttribute('role', 'button');
    var thumb = c.shot ? '<div class="l2-card-thumb"><img src="' + c.shot + '" alt="" loading="lazy"></div>'
      : '<div class="l2-card-thumb art"><span>' + c.name + '</span></div>';
    el.innerHTML = thumb + '<div class="l2-card-h"><b>' + c.name + '</b><span class="l2-badge' + (c.badge === 'LIVE' ? ' live' : '') + '">' + c.badge + '</span></div>'
      + '<div class="l2-card-sector">' + c.meta + '</div><div class="l2-card-cta">open case →</div>';
    function open() { openModal(i); }
    el.addEventListener('click', open);
    el.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
    cardsEl.appendChild(el);
  });
  function openModal(i) {
    curCase = i; var c = CASES[i];
    mName.textContent = c.name; mMeta.textContent = c.meta;
    mBadge.textContent = c.badge; mBadge.className = 'l2-badge' + (c.badge === 'LIVE' ? ' live' : '');
    mShot.innerHTML = c.shot ? '<img src="' + c.shot + '" alt="' + c.name + '">' : '<span>' + c.name + '</span>';
    mShot.className = 'l2-modal-shot' + (c.shot ? '' : ' art');
    mProblem.textContent = c.problem; mBuilt.textContent = c.built; mResult.textContent = c.result; mStack.textContent = c.stack;
    if (modal.hidden) { lastFocus = document.activeElement; modal.hidden = false; document.body.style.overflow = 'hidden'; }
    mNext.focus();
  }
  function closeModal() { modal.hidden = true; document.body.style.overflow = ''; if (lastFocus && lastFocus.focus) lastFocus.focus(); }
  modal.querySelectorAll('[data-close]').forEach(function (el) { el.addEventListener('click', closeModal); });
  mNext.addEventListener('click', function () { openModal((curCase + 1) % CASES.length); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.hidden) closeModal(); });

  /* ---- services accordion ---- */
  var famEl = document.getElementById('families'), openFam = -1;
  FAMILIES.forEach(function (f, i) {
    var el = document.createElement('div'); el.className = 'l2-fam';
    var items = f.items.map(function (s) {
      return '<div><span class="s">' + (s[0] || '·') + '</span><b>' + s[1] + '</b><span> — ' + s[2] + '</span></div>';
    }).join('');
    el.innerHTML = '<div class="l2-fam-num">' + f.num + '</div><h3>' + f.title + '</h3><p class="l2-fam-tag">' + f.tag + '</p>'
      + '<div class="l2-fam-body"><div class="l2-fam-items">' + items + '</div></div><div class="l2-fam-cta">' + f.cta + '</div>';
    el.addEventListener('click', function () {
      var isOpen = el.classList.contains('open');
      famEl.querySelectorAll('.l2-fam').forEach(function (x) { x.classList.remove('open'); x.querySelector('.l2-fam-cta').textContent = 'see the catalogue ↓'; });
      if (!isOpen) { el.classList.add('open'); el.querySelector('.l2-fam-cta').textContent = 'close ↑'; }
    });
    famEl.appendChild(el);
  });

  /* ---- founder cv accordion ---- */
  var cvBtn = document.getElementById('cvBtn'), cv = document.getElementById('cv');
  cvBtn.addEventListener('click', function () {
    var open = cv.classList.toggle('open');
    cvBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    cvBtn.textContent = open ? 'Hide résumé ↑' : 'View résumé ↴';
  });

  /* ---- contact form → mailto handoff ---- */
  var form = document.getElementById('l2form');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = form.elements;
    var body = 'Name: ' + f.name.value + '\nContact: ' + f.contact.value + '\n\nIdea:\n' + f.idea.value;
    window.location.href = 'mailto:hello@numidealabs.com?subject=' + encodeURIComponent('Numidea Preview — ' + f.name.value) + '&body=' + encodeURIComponent(body);
  });

  /* ---- back to top ---- */
  document.getElementById('toTop').addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });

  /* ---- hero particles ---- */
  if (!reduce) {
    var pw = document.querySelector('.l2-particles');
    var conf = [[7, 13, 19, 0], [21, 9, 24, -8], [38, 15, 27, -15], [55, 8, 16, -4], [72, 12, 22, -12], [88, 10, 20, -2]];
    conf.forEach(function (c) {
      var s = document.createElement('span');
      s.textContent = '◆'; s.style.left = c[0] + '%'; s.style.fontSize = c[1] + 'px';
      s.style.animationDuration = c[2] + 's'; s.style.animationDelay = c[3] + 's';
      pw.appendChild(s);
    });
  }
})();
