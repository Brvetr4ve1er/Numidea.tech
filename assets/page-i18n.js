/* ============================================================
   Numidea Labs — language switch for the generated pages (scene/, legal/).
   Each page is static HTML with French baked in and its dictionary inline
   in <script type="application/json" id="i18n">. The head resolver of the
   page has already chosen the language (?lang=, then the shared
   'numidea-lang' storage key, validated), set lang/dir on <html> and, for a
   non-French visitor, held paint with data-i18n-pending. This applies the
   text and releases the hold; the .lang buttons switch afterwards.
   ============================================================ */
(function () {
  var root = document.documentElement;
  var el = document.getElementById('i18n');
  var DICT = null;
  try { DICT = el ? JSON.parse(el.textContent) : null; } catch (e) { DICT = null; }
  var LOCALE = { fr: 'fr_FR', en: 'en_US', ar: 'ar_DZ' };

  function each(attr, fn) {
    document.querySelectorAll('[' + attr + ']').forEach(function (n) { fn(n, n.getAttribute(attr)); });
  }

  /* The page's head names its language version (canonical, og:url,
     og:locale) from the ?lang= it arrived with. After a switch rewrites
     ?lang=, they name the version the address bar now shows. */
  function syncCanon(l) {
    var c = document.querySelector('link[rel="canonical"]');
    if (!c) return;
    try {
      var u = new URL(c.href);
      if (l === 'fr') u.searchParams.delete('lang'); else u.searchParams.set('lang', l);
      c.href = u.href;
      var ogu = document.querySelector('meta[property="og:url"]');
      var ogl = document.querySelector('meta[property="og:locale"]');
      if (ogu) ogu.setAttribute('content', u.href);
      if (ogl && LOCALE[l]) ogl.setAttribute('content', LOCALE[l]);
    } catch (e) {}
  }

  /* The search snippet and the structured data speak the page's language
     too: the description (ui.desc) and the breadcrumb's last name
     (ui.crumb, the page's own entry). */
  function applyMeta(d) {
    var md = document.querySelector('meta[name="description"]');
    if (md && d['ui.desc'] != null) md.setAttribute('content', d['ui.desc']);
    if (d['ui.crumb'] == null) return;
    document.querySelectorAll('script[type="application/ld+json"]').forEach(function (s) {
      try {
        var o = JSON.parse(s.textContent), list = o && o['@type'] === 'BreadcrumbList' && o.itemListElement;
        if (!list || !list.length || list[list.length - 1].name === d['ui.crumb']) return;
        list[list.length - 1].name = d['ui.crumb'];
        s.textContent = JSON.stringify(o);
      } catch (e) {}
    });
  }

  /* Some pages hold one section per language and show only the current
     one (legal/: html[lang] hides the others). A #hash naming a section of
     another language — a shared link, or the hash left after a switch —
     would land on nothing; it is moved to the visible section that carries
     the same data-sec, and the page goes there. */
  function followHash() {
    var id = location.hash.slice(1), target = null;
    if (!id) return;
    try { target = document.getElementById(decodeURIComponent(id)); } catch (e) {}
    if (!target || target.getClientRects().length) return;          // unknown, or visible
    var sec = target.closest('[data-sec]');
    if (!sec) return;
    var twins = document.querySelectorAll('[data-sec="' + sec.getAttribute('data-sec') + '"]');
    for (var i = 0; i < twins.length; i++) {
      if (twins[i] === sec || !twins[i].id || !twins[i].getClientRects().length) continue;
      try { history.replaceState(history.state, '', '#' + twins[i].id); } catch (e) {}
      twins[i].scrollIntoView();
      return;
    }
  }

  function setLang(l, persist) {
    if (!DICT || !DICT[l]) l = 'fr';
    var d = (DICT && DICT[l]) || {};
    root.lang = l;
    root.dir = l === 'ar' ? 'rtl' : 'ltr';
    each('data-i18n', function (n, k) { if (d[k] != null) n.textContent = d[k]; });
    each('data-i18n-html', function (n, k) { if (d[k] != null) n.innerHTML = d[k]; });
    each('data-i18n-alt', function (n, k) { if (d[k] != null) n.alt = d[k]; });
    each('data-i18n-aria', function (n, k) { if (d[k] != null) n.setAttribute('aria-label', d[k]); });
    if (d['ui.title']) document.title = d['ui.title'];
    applyMeta(d);
    document.querySelectorAll('.lang button').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === l));
    });
    if (persist !== false) { try { localStorage.setItem('numidea-lang', l); } catch (e) {} }
    // keep a shared ?lang= link truthful after a switch, and the canonical with it
    try {
      var u = new URL(location.href);
      if (u.searchParams.has('lang')) {
        u.searchParams.set('lang', l);
        history.replaceState(history.state, '', u);
        syncCanon(l);
      }
    } catch (e) {}
  }

  // Applied and kept, as app.js does: a visitor who arrives on
  // scene/?lang=ar and follows a link home stays in Arabic. The head script
  // keeps the chosen language in NUMIDEA_LANG: if its paint backstop fired
  // first, <html> was put back to the baked French (lang and dir) meanwhile.
  var start = window.NUMIDEA_LANG || root.getAttribute('lang') || 'fr';
  if (start !== 'fr') setLang(start);
  else if (/[?&]lang=fr(?:&|#|$)/i.test(location.search)) { try { localStorage.setItem('numidea-lang', 'fr'); } catch (e) {} }
  root.removeAttribute('data-i18n-pending');
  followHash();

  document.querySelectorAll('.lang button').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); followHash(); });
  });

  /* Back/Forward can bring this page back from the browser's cache exactly
     as it was left, after the visitor chose another language elsewhere:
     take up the stored choice again, as a fresh load would. */
  window.addEventListener('pageshow', function (e) {
    if (!e.persisted) return;
    var l = null;
    try { l = localStorage.getItem('numidea-lang'); } catch (x) {}
    if (l && DICT && DICT[l] && l !== root.getAttribute('lang')) { setLang(l, false); followHash(); }
  });
})();
