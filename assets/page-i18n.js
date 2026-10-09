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

  function each(attr, fn) {
    document.querySelectorAll('[' + attr + ']').forEach(function (n) { fn(n, n.getAttribute(attr)); });
  }

  function setLang(l, persist) {
    if (!DICT || !DICT[l]) l = 'fr';
    var d = DICT[l];
    root.lang = l;
    root.dir = l === 'ar' ? 'rtl' : 'ltr';
    each('data-i18n', function (n, k) { if (d[k] != null) n.textContent = d[k]; });
    each('data-i18n-html', function (n, k) { if (d[k] != null) n.innerHTML = d[k]; });
    each('data-i18n-alt', function (n, k) { if (d[k] != null) n.alt = d[k]; });
    each('data-i18n-aria', function (n, k) { if (d[k] != null) n.setAttribute('aria-label', d[k]); });
    if (d['ui.title']) document.title = d['ui.title'];
    document.querySelectorAll('.lang button').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === l));
    });
    if (persist !== false) { try { localStorage.setItem('numidea-lang', l); } catch (e) {} }
    // keep a shared ?lang= link truthful after a switch
    try {
      var u = new URL(location.href);
      if (u.searchParams.has('lang')) { u.searchParams.set('lang', l); history.replaceState(null, '', u); }
    } catch (e) {}
  }

  var start = root.getAttribute('lang') || 'fr';
  if (start !== 'fr') setLang(start, false);
  root.removeAttribute('data-i18n-pending');
  document.querySelectorAll('.lang button').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });
})();
