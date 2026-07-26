/* Layout 2d — Atelier Split interactions */
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

  /* scrollspy — highlights the rail link for the section in view */
  var links = {}, targets = [];
  document.querySelectorAll('.d-nav a[data-spy]').forEach(function (a) {
    links[a.dataset.spy] = a;
    var t = document.getElementById(a.dataset.spy);
    if (t) targets.push(t);
  });
  function activate(id) {
    for (var k in links) links[k].classList.toggle('active', k === id);
  }
  if ('IntersectionObserver' in window && targets.length) {
    var visible = {};
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { visible[e.target.id] = e.isIntersecting; });
      // pick the first section (document order) currently in the band
      for (var i = 0; i < targets.length; i++) {
        if (visible[targets[i].id]) { activate(targets[i].id); return; }
      }
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
    targets.forEach(function (t) { io.observe(t); });
  }
  activate('opening');

  /* contact form → mailto handoff */
  document.getElementById('d-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var f = e.target.elements;
    var body = 'Name: ' + f.name.value + '\nContact: ' + f.contact.value + '\n\nIdea:\n' + f.idea.value;
    window.location.href = 'mailto:hello@numidealabs.com?subject='
      + encodeURIComponent('Numidea Preview — ' + f.name.value) + '&body=' + encodeURIComponent(body);
  });

  /* back to top */
  document.getElementById('toTop').addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  });

  /* opening-plate particles */
  if (!reduce) {
    var pw = document.querySelector('.l2-particles');
    [[14, 12, 20, 0], [37, 9, 25, -9], [61, 14, 27, -16], [78, 8, 17, -4], [92, 11, 22, -11]].forEach(function (c) {
      var s = document.createElement('span'); s.textContent = '◆';
      s.style.left = c[0] + '%'; s.style.fontSize = c[1] + 'px';
      s.style.animationDuration = c[2] + 's'; s.style.animationDelay = c[3] + 's';
      pw.appendChild(s);
    });
  }
})();
