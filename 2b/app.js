/* Layout 2b — Story Scroll interactions */
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var html = document.documentElement;

  /* theme swatches (shared key) */
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

  /* progress bar */
  var fill = document.getElementById('progress'), ticking = false;
  function updateProgress() {
    var h = document.documentElement, max = h.scrollHeight - h.clientHeight;
    var pct = max > 0 ? (h.scrollTop || window.pageYOffset) / max : 0;
    fill.style.width = Math.min(100, Math.max(0, pct * 100)) + '%';
  }
  window.addEventListener('scroll', function () {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () { updateProgress(); ticking = false; });
  }, { passive: true });
  updateProgress();

  /* stack row */
  var STACK = ['React', 'Next.js', 'Node', 'Python', 'FastAPI', 'PostgreSQL', 'Playwright', 'Supabase', 'Vercel', 'Claude'];
  var stackEl = document.getElementById('stackRow');
  STACK.forEach(function (s, i) {
    if (i) { var sep = document.createElement('span'); sep.className = 'sep'; sep.textContent = '·'; stackEl.appendChild(sep); }
    var sp = document.createElement('span'); sp.textContent = s; stackEl.appendChild(sp);
  });

  /* proof film strip */
  var P = '../assets/previews/';
  var PROJECTS = [
    { name: 'AlmaFlowClim', live: true, shot: P + 'almaflowclim.webp', url: 'https://almaflowclim.netlify.app', line: 'Industrial HVAC site engineered to convert quote requests — in production, in France.' },
    { name: 'Bordj Steel', live: true, shot: P + 'bordjsteel.webp', url: 'https://bordjsteelb2b.netlify.app', line: 'A full B2B corporate site for a structural-steel manufacturer — catalogue, references, careers.' },
    { name: 'Alliance Travel', live: true, shot: P + 'alliancetravel.webp', url: 'https://alliancetravel34.netlify.app', line: 'Brand + funnel + a visa-market strategy built on 544,634 analyzed requests.' },
    { name: 'Nomara Voyages', live: true, shot: P + 'nomara.webp', url: 'https://nomaravoyages.netlify.app', line: 'A bilingual showcase for organised trips and Omra departures — clean, fast, SEO-built.' },
    { name: 'Glaive Store', live: true, shot: P + 'glaive.webp', url: 'https://glaivestore.netlify.app', line: 'A conversion-focused gaming-gear storefront with a hard, gamer-first brand.' },
    { name: 'Doctor Cherfia Clinic', live: false, shot: null, url: null, line: 'Booking-ready clinic platform on Next.js — healthcare patients can trust.' },
    { name: "Étoile de l'Est", live: false, shot: null, url: null, line: 'Offline-first PWA on Supabase — the shop that survives a dead connection.' }
  ];
  var strip = document.getElementById('strip');
  PROJECTS.forEach(function (p) {
    var card = document.createElement('div'); card.className = 'b-card';
    var shot = p.shot ? '<div class="b-card-shot"><img src="' + p.shot + '" alt="' + p.name + '" loading="lazy"></div>'
      : '<div class="b-card-shot art"><span>' + p.name + '</span></div>';
    var badge = p.live ? '<span class="b-badge live">LIVE</span>' : '<span class="b-badge">SOON</span>';
    var visit = p.url ? '<a class="b-card-visit" href="' + p.url + '" target="_blank" rel="noopener">visit ↗</a>' : '';
    card.innerHTML = shot + '<div class="b-card-body"><div class="b-card-h"><b>' + p.name + '</b>' + badge + visit + '</div><p>' + p.line + '</p></div>';
    strip.appendChild(card);
  });

  /* form → mailto */
  var form = document.getElementById('b-form');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = form.elements, body = 'Name: ' + f.name.value + '\nContact: ' + f.contact.value + '\n\nIdea: ' + f.idea.value;
    window.location.href = 'mailto:hello@numidealabs.com?subject=' + encodeURIComponent('Numidea Preview — ' + f.name.value) + '&body=' + encodeURIComponent(body);
  });

  /* back to top */
  document.getElementById('toTop').addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });

  /* particles */
  if (!reduce) {
    var pw = document.querySelector('.l2-particles');
    [[10, 13, 19, 0], [26, 9, 24, -8], [47, 15, 27, -15], [63, 8, 16, -4], [79, 12, 22, -12], [91, 10, 20, -2]].forEach(function (c) {
      var s = document.createElement('span'); s.textContent = '◆';
      s.style.left = c[0] + '%'; s.style.fontSize = c[1] + 'px'; s.style.animationDuration = c[2] + 's'; s.style.animationDelay = c[3] + 's';
      pw.appendChild(s);
    });
  }
})();
