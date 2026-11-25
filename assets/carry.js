/* ============================================================
   Numidea Labs — links between the site's pages carry the visitor's
   ad parameters (ref, utm_*, fbclid, gclid) and an explicit ?lang=, and
   the page a visitor is about to open is fetched while they reach for it.
   Loaded on every page that links to another (index and tarifs/ in each
   language, scene/, legal-preview/, hub/ and its manual, world, bible and
   brand books, workspacehq/).

   The parameters are read from the address at the moment a link is
   followed, so a language switch (which rewrites ?lang= in place) and links
   added after load are covered. The email "Source" line and the WhatsApp
   [ref] tag (assets/app.js) then still know which ad brought the visitor
   after a visit to the project sheets and back. Nothing is stored: the
   parameters stay in the URL, as they arrived.
   ============================================================ */
(function () {
  // the site's tempo (the stylesheets' --m-* tokens): 90 BPM, a beat of 667 ms;
  // M(n) is n eighths of a beat
  var BEAT = 2000 / 3;
  var M = function (n) { return Math.round(n * BEAT / 8); };
  var KEEP = /^(ref|fbclid|gclid|lang|utm_[a-z0-9_]+)$/;
  var PAGE = /(\/|\.html?)$/;   // a page, not a PDF or an image

  /* The URL a click on `a` would follow: its own, with the visitor's
     parameters added when it leads to another page of the site. null when
     the href cannot be read. */
  function carried(a) {
    var u;
    try { u = new URL(a.getAttribute('href'), location.href); } catch (x) { return null; }
    // same site, another page (not a #jump on this one), and a page rather than a file
    if (u.origin !== location.origin || u.pathname === location.pathname || !PAGE.test(u.pathname)) return u;
    try {
      new URLSearchParams(location.search).forEach(function (v, k) {
        if (KEEP.test(k) && !u.searchParams.has(k)) u.searchParams.set(k, v);
      });
    } catch (x) {}
    return u;
  }
  function carry(e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) return;
    var u = carried(a);
    if (u && u.href !== a.href) a.href = u.href;
  }
  // capture phase, so the href is in place before the browser follows it
  document.addEventListener('click', carry, true);
  document.addEventListener('auxclick', carry, true);

  /* Audience measurement: Vercel Web Analytics, cookieless (no banner
     needed, nothing stored on the visitor's device), first-party: the
     script and its beacons are same-origin, so the Content-Security-Policy
     ('self') needs nothing new. Loaded on the canonical host only, so the
     Pages mirror, previews and a local server neither 404 on it nor count.
     A contact click (WhatsApp, email, phone) is counted as a view of
     /go/<channel>/<page it came from>, e.g. /go/whatsapp/tarifs/: Web
     Analytics' custom events need a paid plan, a virtual view does not.
     window.numideaGo(channel) lets assets/app.js count a contact form
     that hands off by script rather than by a link. */
  var LIVE = location.hostname === 'www.numedialab.dev';
  window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
  if (LIVE && !document.querySelector('script[src="/_vercel/insights/script.js"]')) {
    var vs = document.createElement('script');
    vs.defer = true;
    vs.src = '/_vercel/insights/script.js';
    document.head.appendChild(vs);
  }
  var went = 0;
  window.numideaGo = function (channel) {
    if (!LIVE || Date.now() - went < 1000) return;   // one count per gesture
    went = Date.now();
    window.va('pageview', { route: '/go/' + channel, path: '/go/' + channel + location.pathname });
  };
  var CHANNEL = [[/^https:\/\/(wa\.me|api\.whatsapp\.com)\//, 'whatsapp'], [/^mailto:/i, 'email'], [/^tel:/i, 'phone']];
  function contact(e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) return;
    for (var i = 0; i < CHANNEL.length; i++) if (CHANNEL[i][0].test(a.href)) { window.numideaGo(CHANNEL[i][1]); return; }
  }
  document.addEventListener('click', contact, true);
  document.addEventListener('auxclick', contact, true);

  /* Prefetch on intent. A page change lifts the leaving page off over the
     arriving one (the stylesheets' view transition); fetched while a mouse
     or pen rests on the link (one eighth of a beat, 83 ms), as the button
     goes down, or as the link takes the keyboard's focus, the next page is
     already here when the lift starts, so it begins at the click. A finger
     is not asked for: a tap is a click a few milliseconds later, and on a
     slow link the prefetch was still on its way when the page itself was
     requested, a second copy that was then cancelled. It asks for the
     very URL the click will follow (the carried parameters included), so
     the cache matches. A <link rel="prefetch"> needs nothing from the
     Content-Security-Policy (default-src 'self'); an injected
     speculation-rules script would need its own hash in script-src. At
     most eight a page, each once, and none when the visitor has asked to
     save data. */
  var conn = navigator.connection;
  if (conn && conn.saveData) return;
  var asked = {}, count = 0, wait = 0;
  function target(e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return null;
    var u = carried(a);
    if (!u || u.origin !== location.origin || (u.protocol !== 'http:' && u.protocol !== 'https:')) return null;
    if (!PAGE.test(u.pathname) || (u.pathname === location.pathname && u.search === location.search)) return null;
    u.hash = '';
    return u.href;
  }
  function fetchPage(href) {
    if (!href || asked[href] || count >= 8) return;
    asked[href] = true; count++;
    var l = document.createElement('link');
    l.rel = 'prefetch';
    l.href = href;
    document.head.appendChild(l);
  }
  var pressed = false;   // a focus that comes with a press is the press's, not the keyboard's
  var mouse = function (e) { return e.pointerType === 'mouse' || e.pointerType === 'pen'; };
  document.addEventListener('pointerover', function (e) {
    var href = mouse(e) && target(e);
    if (!href) return;
    clearTimeout(wait);
    wait = setTimeout(function () { fetchPage(href); }, M(1));   // an eighth of a beat
  }, { passive: true });
  document.addEventListener('pointerout', function () { clearTimeout(wait); }, { passive: true });
  document.addEventListener('pointerdown', function (e) {
    pressed = true;
    if (mouse(e)) { clearTimeout(wait); fetchPage(target(e)); }
  }, { passive: true });
  // a finger's tap focuses the link after it lifts, just before the click,
  // so the press is over at the click (or at a key), not at pointerup
  var up = function () { pressed = false; };
  document.addEventListener('click', up, true);
  document.addEventListener('keydown', up, true);
  document.addEventListener('pointercancel', up, { passive: true });
  document.addEventListener('focusin', function (e) { if (!pressed) fetchPage(target(e)); });
})();
