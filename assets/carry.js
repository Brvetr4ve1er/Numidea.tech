/* ============================================================
   Numidea Labs — links between the site's pages carry the visitor's
   ad parameters (ref, utm_*, fbclid, gclid) and an explicit ?lang=.
   Loaded on every page that links to another (index, scene/, legal/,
   hub/, workspacehq/).

   They are read from the address at the moment a link is followed, so a
   language switch (which rewrites ?lang= in place) and links added after
   load are covered. The email "Source" line and the WhatsApp [ref] tag
   (assets/app.js) then still know which ad brought the visitor after a
   visit to the project sheets and back. Nothing is stored: the
   parameters stay in the URL, as they arrived.
   ============================================================ */
(function () {
  var KEEP = /^(ref|fbclid|gclid|lang|utm_[a-z0-9_]+)$/;
  function carry(e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) return;
    var keep = [];
    try { new URLSearchParams(location.search).forEach(function (v, k) { if (KEEP.test(k)) keep.push([k, v]); }); }
    catch (x) { return; }
    if (!keep.length) return;
    var u;
    try { u = new URL(a.getAttribute('href'), location.href); } catch (x) { return; }
    // same site, another page (not a #jump on this one), and a page rather than a file
    if (u.origin !== location.origin || u.pathname === location.pathname) return;
    if (!/(\/|\.html)$/.test(u.pathname)) return;
    keep.forEach(function (p) { if (!u.searchParams.has(p[0])) u.searchParams.set(p[0], p[1]); });
    a.href = u.href;
  }
  // capture phase, so the href is in place before the browser follows it
  document.addEventListener('click', carry, true);
  document.addEventListener('auxclick', carry, true);
})();
