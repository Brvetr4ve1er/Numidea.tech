/* ============================================================
   NUMIDEA LABS — interactions
   i18n (the page's one language, assets/i18n/<lang>.js), nav, scroll
   progress, reveal-on-scroll, mobile menu, contact form states.
   No dependencies. Respects prefers-reduced-motion.
   ============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // the site's tempo (the stylesheets' --m-* tokens): 90 BPM, a beat of 667 ms;
  // M(n) is n eighths of a beat, Q() rounds a drawn time to the nearest sixteenth
  var BEAT = 2000 / 3;
  var M = function (n) { return Math.round(n * BEAT / 8); };
  var Q = function (ms) { var s = BEAT / 16; return Math.round(Math.round(ms / s) * s); };
  var EASE_ENTER = 'cubic-bezier(.16,1,.3,1)', EASE_EXIT = 'cubic-bezier(.5,0,.75,0)';
  /* Work the first screen does not need (measuring, arming the pictures,
     fitting the header's action) waits until the browser is idle, a second
     at most, so it never runs inside the hero's entrance. */
  var idle = function (fn) {
    if (window.requestIdleCallback) requestIdleCallback(fn, { timeout: M(12) });
    else setTimeout(fn, M(12));
  };

  /* ---------------- i18n dictionary ----------------
     One language per page. The page's text is baked in its language by
     scripts/build-lang.mjs (index.html in French; en/ and ar/ from it in
     English and Arabic) and that language's dictionary, assets/i18n/<lang>.js
     (var I18N: the page's strings, the services catalog and trust strip
     included), is loaded just before this script. It serves what is built
     here at runtime (the estimator's labels, the WhatsApp opening line, the
     form's messages), and applyLang() re-applies it once on load, so any
     drift between the baked markup and the dictionary shows as text
     changing after paint (check.mjs 8e compares them). */
  var DICT = window.I18N || {};

  /* ---------------- estimator model ----------------
     Pure: figures and arithmetic only, no DOM and no dictionary, so a script
     can evaluate this block on its own and test it: everything from the
     ESTIMATE declaration below to the first line that is two spaces and
     the closing of that function call.

     Numidea's own prices, set in dinars. The market table (section 14) puts
     the Algerian market beside them (Onyxlab Baromètre 2026 grid and the
     2026 DZ agency surveys, from freelance confirmé to agency): some tiers
     sit inside that range and some above its top, and the page says so.

     The tier cards quote exactly what this model returns across each tier's
     stated scope: Essentiel = vitrine at 1-5 pages (base_u 5), Studio =
     surmesure at 6-15 pages (base_u 15), Moteur = app at its default. What a
     card lists as part of the tier is in its base price (incl): the
     estimator shows those options as included and adds nothing for them. An
     earlier version claimed this and was wrong — the defaults sat 30-60k
     below the cards. The market table reads its Numidea column from here
     too, so if a tier moves, move it here and nowhere else.

     opts, where a type sets it, names the options that apply to it: an
     identity has no CMS, languages or payment to add, an automation no
     design kit; the estimator (section 12) locks the others, unticked, while
     that type is chosen. A type without opts takes every option. */
  var ESTIMATE = (function () {
    var PRICE_MODEL = {
      vitrine:   { base: [90000, 160000],   unit: [6000, 12000],  min: 1,  max: 10,  def: 3,  step: 1,  u: 'price.uPages',    base_u: 5,  weeks: [2, 4],  per: 5 },
      surmesure: { base: [180000, 420000],  unit: [9000, 18000],  min: 3,  max: 25,  def: 8,  step: 1,  u: 'price.uPages',    base_u: 15, weeks: [3, 7],  per: 5,   incl: ['i18n', 'cms', 'ds', 'seo'] },
      ecommerce: { base: [220000, 550000],  unit: [900, 2200],    min: 10, max: 400, def: 60, step: 10, u: 'price.uProducts', base_u: 60, weeks: [5, 10], per: 100 },
      app:       { base: [450000, 1200000], unit: [18000, 45000], min: 3,  max: 20,  def: 6,  step: 1,  u: 'price.uScreens',  base_u: 6,  weeks: [8, 16], per: 2,   incl: ['pay', 'api'] },
      auto:      { base: [140000, 420000],  unit: [15000, 40000], min: 1,  max: 12,  def: 3,  step: 1,  u: 'price.uFlows',    base_u: 3,  weeks: [2, 6],  per: 3,   opts: ['api', 'cms'] },
      identite:  { base: [90000, 180000],   unit: [8000, 16000],  min: 1,  max: 8,   def: 2,  step: 1,  u: 'price.uSupports', base_u: 2,  weeks: [2, 5],  per: 3,   opts: ['ds'] },
      /* The money services (the Studio's "L'argent, sans jargon", 2026-11-16):
         fixed prices, so both bounds are the same figure. The base is one
         60-minute call; each further call is a unit. fam marks a family the
         home and the price guide do not list (their estimator has no radio
         for it, their scale and market table skip it); noRush: a call is
         not rushed. kit: with these options together (and at least n
         calls) the order is cheaper by `off`, shown as a line of its own;
         `at` is the size the bundle is advertised at (the pack, the setup
         and two calls). n is 1 on purpose: were the saving to start at two
         calls, a second call would make the order cheaper than one. */
      /* Motion design (the Studio's "Le mouvement", 2026-11-16), sold by
         the second: the base is an animated logo of up to 5 seconds, in
         three formats; each further second is a unit. It takes no option. */
      motion:    { base: [25000, 45000],    unit: [1800, 4000],   min: 5,  max: 90,  def: 5,  step: 5,  u: 'price.uSecs',     base_u: 5,  weeks: [1, 2],  per: 15,  opts: [], fam: 'motion' },
      argent:    { base: [3000, 3000],      unit: [3000, 3000],   min: 1,  max: 6,   def: 1,  step: 1,  u: 'price.uCalls',    base_u: 1,  weeks: [1, 1],  opts: ['setup', 'pack', 'guides'], fam: 'argent', noRush: true, kit: { needs: ['setup', 'pack'], n: 1, at: 2, off: 5000 } }
    };
    var PRICE_OPTS = {
      i18n: { add: [22000, 55000],  weeks: [1, 2], k: 'price.oI18n' },
      cms:  { add: [35000, 90000],  weeks: [1, 2], k: 'price.oCms' },
      pay:  { add: [45000, 110000], weeks: [1, 2], k: 'price.oPay' },
      ds:   { add: [60000, 140000], weeks: [1, 3], k: 'price.oDs' },
      seo:  { add: [20000, 45000],  weeks: [0, 1], k: 'price.oSeo' },
      api:  { add: [30000, 80000],  weeks: [1, 2], k: 'price.oApi' },
      // the site's own motion (an opening, the characters, micro-interactions): a web project's option
      anim: { add: [35000, 90000],  weeks: [1, 2], k: 'price.oAnim' },
      // only: the types an option is for, and no other type may take it
      setup:  { add: [6000, 6000],   weeks: [0, 0], k: 'price.oSetup',  only: ['argent'] },
      pack:   { add: [15000, 15000], weeks: [0, 0], k: 'price.oPack',   only: ['argent'] },
      guides: { add: [4000, 4000],   weeks: [0, 0], k: 'price.oGuides', only: ['argent'], one: 1500 }   // one: a single guide, outside the estimator
    };
    /* A studio project whose firm price lands in this band includes one
       coaching call and may be paid in three parts (drafted 2026-11-16 on the
       owner's "rules that favour the mid range"; OWNER-CONTENT.md). */
    var MID_RANGE = [180000, 450000];
    /* The design services of the Studio's « La carte » (hub/index.html #carte, 2026-11-21): fixed figures in dinars
       (a pair is a low–high range) and their lead times (weeks or days, [low, high]), approved by the owner on
       2026-11-21 (OWNER-CONTENT.md: B2 « Site · 5 écrans » is the model's own sum, 35 000 + 4 × 8 000). Not types of
       the estimator: scripts/build-hub.mjs reads them (through #hub-prices too) and writes every card's tag, tier and
       WhatsApp line from them; nothing is typed in the markup, and check.mjs 8c re-reads each figure from here.
       creditDays: the mockup or audit fee is refunded on a build ordered within that many days. The monthly plan has
       no lead time: one per request, agreed when it is scoped (the owner's default, 2026-11-21). */
    var DESIGN = {
      logo:   { essentiel: 45000, signature: 70000, weeks: [1, 2] },
      illu:   { spot: 12000, mascotte: 55000, weeks: [1, 3] },
      icons:  { set12: 30000 },
      ui:     { landing: 35000, site5: 67000, app10: 120000, ecranWeb: 8000, ecranApp: 12000,
                weeksLanding: [1, 1], weeksSite: [1, 2], weeksApp: [2, 3], creditDays: 60 },
      social: { kit: 40000, anime: 65000, mois: 30000, weeks: [1, 2] },
      ads:    { set: [12000, 25000], concept: [8000, 15000], days: [3, 5] },
      email:  { master: [30000, 60000], layout: [10000, 20000], weeks: [1, 1] },
      pack:   { ref1: 45000, ref3: 75000, ref: 15000, weeks: [1, 3] },
      print:  { carte: 8000, flyer: 12000, menu: 20000, plaquette: 28000, papeterie: 30000, days: [3, 5] },
      stick:  { planche6: 25000, tshirt: [12000, 30000], weeks: [1, 1] },
      deck:   { slide: 4000, deck12: 48000, master: 75000, weeks: [1, 2] },
      info:   { one: [15000, 35000], weeks: [1, 1] },
      audit:  { express: 25000, parcours: 60000, weeks: [1, 1] },
      mois:   { mois: 65000, trimestre: 180000 },
      // the two bundles (formules): each below the sum of its three lines at the carte's own prices
      f_marque:  { price: [190000, 360000] },
      f_produit: { price: [185000, 185000] }
    };
    // does option o apply to type key? Its own list (only) decides, else the type's (opts); a type without a list takes every option that has none
    var applies = function (o, key) {
      var p = PRICE_OPTS[o], m = PRICE_MODEL[key];
      return p.only ? p.only.indexOf(key) > -1 : !m.opts || m.opts.indexOf(o) > -1;
    };
    /* Rushing does not make the work smaller, it makes it more expensive and
       compresses the calendar — never below two thirds, which is the floor
       where review still happens (a 2-week minimum stays 2 weeks). */
    var RUSH_PRICE = 1.25, RUSH_WEEKS = 0.7;
    var rushWeeks = function (w) { return Math.max(Math.ceil(w * 2 / 3), Math.round(w * RUSH_WEEKS)); };

    /* A rounder figure for a display that states one number alone (a share
       card, a caption). A quote is never rounded after it is summed: until
       2026-11-16 it was, and the parts no longer added up to the total
       (90 000 + 22 000 read 110 000). */
    var roundTo = function (n) {
      var g = n >= 500000 ? 50000 : n >= 150000 ? 10000 : 5000;
      return Math.round(n / g) * g;
    };
    // to the thousand: used once, on the rush line
    var kilo = function (n) { return Math.round(n / 1000) * 1000; };
    // a bigger job takes longer: one more week for every `per` units over the base size
    var sizeWeeks = function (m, n) { return m.per ? Math.floor(Math.max(0, n - m.base_u) / m.per) : 0; };

    /* One tier, n units, the ticked options: every line of the receipt and
       what they add up to. lines: { k: 'base' } the tier up to its base size
       (n: that size), { k: 'extra', n, unit } the units over it, { k: 'opt',
       o } an option ({ incl: true } and nothing charged when the tier
       already includes it). lo and hi are the sums of the lines' lo and hi. */
    var tally = function (key, n, opts) {
      var m = PRICE_MODEL[key], over = Math.max(0, n - m.base_u), incl = m.incl || [], sw = sizeWeeks(m, n);
      var q = { lo: m.base[0], hi: m.base[1], wLo: m.weeks[0] + sw, wHi: m.weeks[1] + sw, incl: [],
                lines: [{ k: 'base', n: m.base_u, lo: m.base[0], hi: m.base[1] }] };
      if (over) {
        q.lines.push({ k: 'extra', n: over, unit: m.unit, lo: over * m.unit[0], hi: over * m.unit[1] });
        q.lo += over * m.unit[0]; q.hi += over * m.unit[1];
      }
      opts.forEach(function (o) {
        var p = PRICE_OPTS[o];
        if (!p || !applies(o, key)) return;   // an option the type has no use for is never charged
        if (incl.indexOf(o) > -1) { q.incl.push(o); q.lines.push({ k: 'opt', o: o, incl: true, lo: 0, hi: 0 }); return; }   // in the tier's base price
        q.lines.push({ k: 'opt', o: o, lo: p.add[0], hi: p.add[1] });
        q.lo += p.add[0]; q.hi += p.add[1];
        q.wLo += p.weeks[0]; q.wHi += p.weeks[1];
      });
      return q;
    };

    /* The estimate for a tier (key), a size (n), the ticked option keys and
       the pace. Returns { lo, hi } in dinars, rounded, { wLo, wHi } in weeks,
       incl (ticked options already in the quoted tier's price), rush, and
       studio: true when a Vitrine was quoted as the Studio tier.

       A Vitrine is never quoted above the Studio tier for the same pages:
       Studio includes multilingual, CMS, design system and SEO at no extra
       cost, so each bound (price and weeks) is the lower of the Vitrine's own
       sum and the Studio figure. Bound by bound, never the whole Studio
       range: taking it whole when only the low end was cheaper would raise
       the top above what the Vitrine itself adds up to. studio: true when
       the Studio figure set either price bound; the difference is then a
       line of its own ({ k: 'studio' }, zero or below), so the receipt still
       adds up. Rushing is a line too ({ k: 'rush' }): a quarter of the
       subtotal, to the thousand. lo and hi are the exact sums of the lines.
       check.mjs tests every size, option set and pace. */
    function quote(key, n, opts, rush) {
      var q = tally(key, n, opts || []);
      q.studio = false;
      if (key === 'vitrine') {
        var s = tally('surmesure', n, opts || []);
        var dLo = Math.min(0, s.lo - q.lo), dHi = Math.min(0, s.hi - q.hi);
        q.studio = dLo < 0 || dHi < 0;
        if (q.studio) { q.lines.push({ k: 'studio', lo: dLo, hi: dHi }); q.lo += dLo; q.hi += dHi; }
        q.wLo = Math.min(q.wLo, s.wLo); q.wHi = Math.min(q.wHi, s.wHi);
      }
      // a bundle: every option it needs is ticked and the size reaches n
      var kit = PRICE_MODEL[key].kit;
      if (kit && n >= kit.n && kit.needs.every(function (o) { return (opts || []).indexOf(o) > -1; })) {
        q.lines.push({ k: 'kit', lo: -kit.off, hi: -kit.off }); q.lo -= kit.off; q.hi -= kit.off;
      }
      q.rush = !!rush && !PRICE_MODEL[key].noRush;
      if (q.rush) {
        var rLo = kilo(q.lo * (RUSH_PRICE - 1)), rHi = kilo(q.hi * (RUSH_PRICE - 1));
        q.lines.push({ k: 'rush', lo: rLo, hi: rHi }); q.lo += rLo; q.hi += rHi;
        q.wLo = rushWeeks(q.wLo); q.wHi = rushWeeks(q.wHi);
      }
      return q;
    }

    return { PRICE_MODEL: PRICE_MODEL, PRICE_OPTS: PRICE_OPTS, quote: quote, tally: tally, roundTo: roundTo, RUSH_PRICE: RUSH_PRICE, MID_RANGE: MID_RANGE, applies: applies, DESIGN: DESIGN };
  })();

  var DEFAULT_LANG = 'fr';

  /* The page's language (html[lang], baked) applied from its dictionary:
     the same strings the markup already holds, written again, so the baked
     page and the dictionary cannot drift apart unseen. With the dictionary
     missing (its script refused or lost) the page stands as baked. */
  function applyLang(lang) {
    var dict = DICT;
    var html = document.documentElement;
    html.setAttribute('lang', lang);
    if (dict.dir) html.setAttribute('dir', dict.dir);
    /* The title and the description are the home page's keys (title,
       meta.desc) unless the page names its own there (the price guide:
       data-i18n on <title>, data-i18n-content on the meta), which the
       passes below write with its other nodes. */
    var titleEl = document.querySelector('title');
    if (dict.title && !(titleEl && titleEl.hasAttribute('data-i18n'))) document.title = dict.title;
    var meta = document.querySelector('meta[name="description"]');
    if (meta && dict['meta.desc'] && !meta.hasAttribute('data-i18n-content')) meta.setAttribute('content', dict['meta.desc']);

    /* The studio's own structured data describes it in the page's language
       too: its description is the meta description (the one baked into the
       page is the dictionary's). */
    document.querySelectorAll('script[type="application/ld+json"]:not([id])').forEach(function (s) {
      try {
        var o = JSON.parse(s.textContent);
        if (o['@type'] !== 'ProfessionalService' || o.description === dict['meta.desc']) return;
        o.description = dict['meta.desc'];
        s.textContent = JSON.stringify(o, null, 1);
      } catch (e) {}
    });

    /* The FAQ structured data says what the visible FAQ says, in the same
       language (scripts/lib/i18n.mjs faqLd builds the one baked into the
       page the same way). */
    var ld = document.getElementById('ld-faq');
    if (ld) {
      var plain = function (s) {
        var d = document.createElement('div');
        d.innerHTML = s;
        return d.textContent.replace(/[ \t\r\n]+/g, ' ').trim();
      };
      var qs = [];
      for (var qi = 1; dict['faq' + qi + '.q'] != null; qi++) {
        qs.push({ '@type': 'Question', name: plain(dict['faq' + qi + '.q']),
                  acceptedAnswer: { '@type': 'Answer', text: plain(dict['faq' + qi + '.a']) } });
      }
      ld.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: qs });
    }

    // text / inline-html content
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (dict[key] != null) el.innerHTML = dict[key];
    });
    // placeholders
    document.querySelectorAll('[data-i18n-ph]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-ph');
      if (dict[key] != null) el.setAttribute('placeholder', dict[key]);
    });
    // aria-labels
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-aria');
      if (dict[key] != null) el.setAttribute('aria-label', dict[key]);
    });
    // image alternatives
    document.querySelectorAll('[data-i18n-alt]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-alt');
      if (dict[key] != null) el.alt = dict[key];
    });
    // a meta's content (a sub-page's description and share texts)
    document.querySelectorAll('[data-i18n-content]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-content');
      if (dict[key] != null) el.setAttribute('content', dict[key]);
    });

    // the choice every page shares (the home address sends a stored en/ar
    // preference to that language's page; scene/ and legal/ switch to it)
    try { localStorage.setItem('numidea-lang', lang); } catch (e) {}
    // Anything that builds translated strings in JS (the estimator's unit and
    // option labels) has no data-i18n node to re-read and must rebuild itself.
    document.dispatchEvent(new CustomEvent('numidea:lang', { detail: { lang: lang } }));
  }

  /* ---------------- DOM ready ---------------- */
  document.addEventListener('DOMContentLoaded', function () {
   try {
    applyLang(document.documentElement.getAttribute('lang') || DEFAULT_LANG);

    /* (declared first: the start's two tasks below both use them)
       dictionary lookup for strings built in JS (estimator, WhatsApp text),
       as plain text. Every one of them lands in textContent, an attribute, the
       message field, a mailto body or a wa.me link, none of which reads
       markup, and a value may carry some: the Arabic isolates its Latin runs
       (<bdi>SEO</bdi>, ccc4b42), so ticking "SEO" in the Arabic estimator
       printed the tags in its summary and sent them on in the visitor's
       message. The tags go; their words stay. A key that is markup on
       purpose (the CV button) is read from DICT itself. */
    function t(k, fb) {
      return plain(DICT[k] != null ? DICT[k] : (fb || k));
    }
    function plain(s) {
      s = String(s);
      if (!/[<&]/.test(s)) return s;
      var tpl = document.createElement('template');   // inert: nothing in it loads or runs
      tpl.innerHTML = s;
      return tpl.content.textContent;
    }

    /* The language switch is three links: the French page (the site root),
       en/ and ar/. The choice is stored as the link is followed, before the
       page it leads to stores it itself, because the root's head script
       sends a stored en/ar preference to that language's page before paint:
       a visitor who picks French on en/ must land on the French page, not
       back on the one they just left. */
    /* The switch keeps the visitor's place. The three pages share their
       ids, so the section being read goes on each link as its #fragment:
       the scroll-spy (below) names it as it changes, and the click writes
       it once more in case the spy has not run. Before any section is
       read, the links stay the plain address of the page. The header's,
       the menu's and the footer's switches alike. */
    var langLinks = [].slice.call(document.querySelectorAll('.lang a[hreflang]')), langId = '';
    var langAt = function (id) {
      langId = id || '';
      langLinks.forEach(function (a) {
        var base = a.getAttribute('href').replace(/#.*$/, '');
        a.setAttribute('href', langId ? base + '#' + langId : base);
      });
    };
    langLinks.forEach(function (a) {
      a.addEventListener('click', function () {
        langAt(langId);
        try { localStorage.setItem('numidea-lang', a.getAttribute('hreflang')); } catch (e) {}
      });
    });

    /* theme toggle — two themes, each a token block in themes.css, so a switch
       is one attribute; nothing loads, nothing re-lays out. The head script
       already resolved the theme before first paint (the stored choice, else
       the OS preference); this mirrors it and wires the button(s). Only a
       press of the button stores a choice: a visitor who made none keeps the
       OS preference. */
    var THEMES = ['arcanum', 'daylight'];
    function applyTheme(th, store, later) {
      if (THEMES.indexOf(th) === -1) th = 'arcanum';
      document.documentElement.setAttribute('data-theme', th);
      // the browser's own bar takes the page colour (Daylight is light): read
      // from the theme's tokens, so it cannot drift from themes.css (a style
      // read only, which the swap's new picture needs anyway)
      var bar = document.querySelector('meta[name="theme-color"]');
      var bg = getComputedStyle(document.documentElement).getPropertyValue('--void').trim();
      if (bar && bg) bar.setAttribute('content', bg);
      labelTheme(th);
      if (store) { try { localStorage.setItem('numidea-theme', th); } catch (e) {} }
      // type tokens change line lengths, so cached section tops are re-measured;
      // inside a swap's update the page is held as a picture, and what lays the
      // page out to measure it waits for the crossfade (later)
      var measure = function () { document.dispatchEvent(new CustomEvent('numidea:relayout')); };
      if (later) later(measure); else measure();
    }
    /* The button names the theme it switches to ("Passer en Daylight
       (clair)"), as its label and its tooltip, and draws that theme's icon
       (data-to, styles.css); in the phone menu the label is the button's
       visible name too (::after). The key goes on data-i18n-aria, so the
       language apply writes the same words back. */
    function labelTheme(th) {
      var to = th === 'daylight' ? 'arcanum' : 'daylight';
      var key = 'theme.to' + (to === 'daylight' ? 'Daylight' : 'Arcanum');
      var label = t(key);
      document.querySelectorAll('.theme-btn').forEach(function (b) {
        b.setAttribute('data-to', to);
        b.setAttribute('data-i18n-aria', key);
        b.setAttribute('aria-label', label);
        b.setAttribute('title', label);
      });
    }
    document.addEventListener('numidea:lang', function () { labelTheme(document.documentElement.getAttribute('data-theme') || 'arcanum'); });
    /* At the start the head script has set the theme and the browser bar's
       colour already, and nothing has been measured yet: only the buttons are
       named. (Applying it whole here read the theme's tokens and sent the
       page's re-measure, two forced layouts inside the first task, which
       froze the hero's first frames on a phone.) */
    var th0 = document.documentElement.getAttribute('data-theme');
    if (THEMES.indexOf(th0) > -1) labelTheme(th0); else applyTheme(th0 || 'arcanum', false);
    // two buttons: the header's, and the phone menu's (the header's goes
    // below 960px, styles.css, to make room for the language switch)
    /* The switch is one crossfade of the whole page (a same-document view
       transition of type "swap", styles.css: 167 out, 250 in): every
       element changes in the same frame under it. A transition list on a
       few kinds of element eased those and left the rest to snap, so the
       page tore. Without the browser's support, or with reduced motion, it
       is a clean cut. */
    var swap = function (fn, after) {
      after = after || function () {};
      if (!reduceMotion && document.startViewTransition && window.ViewTransition && 'types' in ViewTransition.prototype) {
        var h = document.documentElement;
        try {
          // the elements' own colour transitions are held for the swap
          // (html.m-swap, styles.css): under the crossfade they would still
          // be easing in the new picture, a quarter beat behind the rest
          var vt = swapping = document.startViewTransition({ update: function () { h.classList.add('m-swap'); fn(); }, types: ['swap'] });
          vt.ready.then(null, function () {});   // a swap skipped by the next one is not an error
          vt.finished.then(null, function () {}).then(function () { if (swapping === vt) { swapping = null; h.classList.remove('m-swap'); } after(); });
          return;
        } catch (e) { h.classList.remove('m-swap'); }
      }
      fn(); after();
    };
    document.querySelectorAll('.theme-btn').forEach(function (b) {
      b.addEventListener('click', function () {
        var to = document.documentElement.getAttribute('data-theme') === 'daylight' ? 'arcanum' : 'daylight';
        var waits = [], run = function () { waits.forEach(function (f) { f(); }); waits = []; };
        swap(function () { applyTheme(to, true, function (f) { waits.push(f); }); }, run);
      });
    });
    /* While a crossfade runs the page is its picture, and a pointer lands on
       the document, not on what it shows: a second press of the toggle
       inside those 250 ms was lost. It is handed on to the toggle under it
       (the new swap takes over from the running one). */
    var swapping = null;
    document.addEventListener('click', function (e) {
      if (!swapping || e.target !== document.documentElement) return;
      [].some.call(document.querySelectorAll('.theme-btn'), function (b) {
        var r = b.getBoundingClientRect();
        if (!r.width || e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) return false;
        b.focus({ preventScroll: true }); b.click();
        return true;
      });
    }, true);

    /* The start is two tasks. What the first screen needs is above (the
       language, the theme, its buttons); everything below measures the page
       (the scroll, the reveals, the header's room, the sections), wires the
       blocks further down and arms what is drawn on the way. Run in one task
       after the first paint it held the main thread for a third of a second
       on a phone (CPU 4x), the hero's entrance frozen under it; given its own
       task, the browser paints in between. */
    setTimeout(function () {
     try {
    /* One read of the scroll position per scroll event, shared by everything
       scroll-linked below (navbar, progress, parallax, phone bar, scroll-spy,
       back to top). Reading scrollY forces a style recalculation whenever a
       style is dirty, and the handlers used to read it one after another
       around their own writes: traced on a phone (CPU 4x), over two thousand
       forced recalculations in one scroll of the page (the measured figures
       are in BRAND.md, "Scroll comfort (round 3)"). This listener is
       registered first, reads once, writes nothing; the others read
       `scrollPos`/`viewH` and only write. */
    /* At the start the page has not been scrolled by anyone but the browser
       (a restored position, an anchor): its first read waits for the first
       frame, where the layout is due anyway (read here, inside the start's
       task, it laid the whole page out again on the spot). */
    var scrollPos = 0, viewH = window.innerHeight;
    window.addEventListener('scroll', function () { scrollPos = window.scrollY || window.pageYOffset || 0; }, { passive: true });
    requestAnimationFrame(function () { var y = window.scrollY || window.pageYOffset || 0; if (y !== scrollPos) { scrollPos = y; window.dispatchEvent(new Event('scroll')); } });
    window.addEventListener('resize', function () { viewH = window.innerHeight; scrollPos = window.scrollY || window.pageYOffset || 0; });

    // navbar scroll state + progress bar
    var navbar = document.querySelector('.navbar');
    var progress = document.querySelector('.progress');
    /* The bar scales instead of changing width (a width change is a layout),
       and the scrollable height is cached rather than read on every scroll
       event: reading scrollHeight there forced a layout per event. Where the
       browser runs scroll-driven animations (styles.css, .progress), the bar
       follows the scroll on the compositor and this writes nothing; under
       reduced motion that animation is switched off, so the script draws it. */
    var scrollTimelines = !!(window.CSS && CSS.supports && CSS.supports('animation-timeline', 'scroll()'));
    var cssProgress = !reduceMotion && scrollTimelines;
    var scrollMax = 1, wasScrolled = null, maxWired = false;
    function measureMax() { scrollMax = Math.max(1, document.documentElement.scrollHeight - window.innerHeight); }
    function wireMax() {
      if (maxWired) return;
      maxWired = true;
      measureMax();
      window.addEventListener('resize', measureMax);
      window.addEventListener('load', measureMax);
      if ('ResizeObserver' in window) new ResizeObserver(measureMax).observe(document.body);
    }
    function onScroll() {
      var y = scrollPos;
      var sc = y > 24;
      if (navbar && sc !== wasScrolled) { navbar.classList.toggle('scrolled', sc); wasScrolled = sc; }
      if (progress && !cssProgress) progress.style.transform = 'scaleX(' + Math.min(1, y / scrollMax).toFixed(4) + ')';
    }
    if (!cssProgress) wireMax();
    /* The CSS animation runs only under no-preference, so a visitor who turns
       reduced motion on (or off) during the visit hands the bar over: without
       this it fell back to scaleX(0) and stayed empty for the rest of the visit. */
    var rmq = scrollTimelines && window.matchMedia('(prefers-reduced-motion: reduce)');
    if (rmq) {
      var onMotionPref = function () {
        cssProgress = !rmq.matches;
        if (cssProgress) { if (progress) progress.style.transform = ''; }
        else wireMax();
        onScroll();
      };
      if (rmq.addEventListener) rmq.addEventListener('change', onMotionPref);
      else if (rmq.addListener) rmq.addListener(onMotionPref);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // reveal-on-scroll
    function revealNow(el) {
      if (el.classList.contains('in')) return;
      el.classList.add('in');
    }
    var revealEls = document.querySelectorAll('.reveal');
    /* A block taller than 60% of the screen fades instead of rising
       (styles.css, .rv-tall): its height is read from the observer's entry
       or the pass that already measured it, never on its own. */
    var tall = function (el, h) { if (h > viewH * 0.6) el.classList.add('rv-tall'); };
    // Progressive enhancement: CSS only hides .reveal under html.js-ready, so a
    // visitor whose app.js never arrives sees everything. If the page has
    // ALREADY painted by the time this runs (slow network, deferred script
    // landing late), reveal what is on screen in the same style pass that
    // arms the gate, so nothing that was visible blinks off.
    var painted = false;
    try { painted = performance.getEntriesByType('paint').length > 0; } catch (e) {}
    if (painted) {
      var vh0 = window.innerHeight || document.documentElement.clientHeight;
      // every box read first, then the classes written: one layout, not one per block
      var r0s = [].map.call(revealEls, function (el) { return el.getBoundingClientRect(); });
      revealEls.forEach(function (el, i) {
        var r0 = r0s[i];
        if (r0.top < vh0 * 0.92 && r0.bottom > 0) { tall(el, r0.height); revealNow(el); }
      });
    }
    document.documentElement.classList.add('js-ready');
    if ('IntersectionObserver' in window) {
      // Entries that cross together are revealed as one batch, delayed in
      // sequence, so a row of cards assembles as a wave rather than a
      // flashbulb. The flush is scheduled on the next animation frame, not
      // on a resettable timer: a fast scroll fires the observer faster than
      // any debounce window, so a re-armed timeout can be starved
      // indefinitely and strand cards invisible. A frame always arrives.
      var batch = [], flushQueued = false;
      function queue(el) {
        if (el.classList.contains('in') || batch.indexOf(el) >= 0) return;
        batch.push(el);
        if (flushQueued) return;
        flushQueued = true;
        requestAnimationFrame(flush);
      }
      function flush() {
        var items = batch;
        batch = [];
        flushQueued = false;
        items.forEach(function (el, i) {
          // stagger the wave an eighth of a beat a card, but never make the
          // last card wait too long: a fling lands on a dozen at once, and at
          // 490ms the last of them was still blank while the reader was
          // already looking at it (three steps at most, 250)
          el.style.setProperty('--rd', M(Math.min(i, 3)) + 'ms');
          try { revealNow(el); } catch (e) { el.classList.add('in'); }
        });
      }
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          io.unobserve(en.target);
          tall(en.target, en.boundingClientRect.height);
          queue(en.target);
        });
      // Starts a fifth of a screen BELOW the fold, not inside it: content
      // used to enter blank and only begin to appear once well on screen,
      // up to 600ms after entering on a phone (before/after figures in
      // BRAND.md, "Scroll comfort (round 3)"). At 8% a block was still
      // rising as it came into view; 20% ahead, the 500ms rise is mostly
      // done by the time it is read.
      }, { threshold: 0, rootMargin: '0px 0px 20% 0px' });
      revealEls.forEach(function (el) { io.observe(el); });
      // Safety net: never leave on-screen content stuck invisible if the
      // observer is slow/janky — reveal anything in (or near) the viewport.
      // `direct` skips the stagger queue: on `load` correctness beats grace.
      function revealInView(direct) {
        var h = window.innerHeight || document.documentElement.clientHeight;
        var rs = [].map.call(revealEls, function (el) { return el.getBoundingClientRect(); });   // reads, then writes
        revealEls.forEach(function (el, i) {
          var r = rs[i];
          if (r.top >= h * 0.92 || r.bottom <= 0) return;
          tall(el, r.height);
          if (direct) return revealNow(el);
          io.unobserve(el);
          queue(el);
        });
      }
      // the observer brings in the first screen as a wave on its own; this
      // net waits until the browser is idle, out of the hero's entrance
      idle(function () { revealInView(false); });
      window.addEventListener('load', function () { idle(function () { revealInView(true); }); });
    } else {
      revealEls.forEach(revealNow);
    }

    /* The planche heads arrive as one phrase (T03), and Kūro's window in the
       FAQ unrolls (T07), once each, when they come into view: a head below
       the fold at load is marked hd-pre (its number, rule, title and lead
       held; styles.css), then hd-in as it crosses 10% into the screen. A
       head on screen at load, or the one the address names, is never
       hidden. Nothing with reduced motion or without an observer. */
    if (!reduceMotion && 'IntersectionObserver' in window) {
      var vhH = window.innerHeight || document.documentElement.clientHeight;
      var heads = [].slice.call(document.querySelectorAll('main.wrap>section:not(.offer):not(.proof)'))
        .filter(function (sec) { return sec.querySelector(':scope>.kicker'); });
      var win = document.querySelector('#faq>.faq-win');
      var holds = heads.concat(win ? [win] : []);
      var rH = holds.map(function (el) { return el.getBoundingClientRect(); });   // reads, then writes
      var hio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          hio.unobserve(en.target);
          var t = en.target;
          if (t === win) { t.classList.remove('is-pre'); t.classList.add('is-in'); }
          else { t.classList.remove('hd-pre'); t.classList.add('hd-in'); }
        });
      }, { threshold: 0, rootMargin: '0px 0px -10% 0px' });
      holds.forEach(function (el, i) {
        if (rH[i].top < vhH * 0.9 || (location.hash && el.id && location.hash === '#' + el.id)) return;
        el.classList.add(el === win ? 'is-pre' : 'hd-pre');
        hio.observe(el);
      });
    }

    /* The case picture flies from its card to its planche (T04): when the
       page leaves for scene/#<case> with the card's capture on screen, the
       capture is named case-shot for the page lift, and scene/ (its head
       script) names its frame the same, so the browser moves one into the
       other in 500 ms. Any other change is the plain lift. */
    window.addEventListener('pageswap', function (e) {
      if (!e.viewTransition || reduceMotion || !e.activation || !e.activation.entry) return;
      var u;
      try { u = new URL(e.activation.entry.url); } catch (x) { return; }
      var m = /\/scene\/$/.test(u.pathname) && /^#(bordjsteel|almaflow)$/.exec(u.hash);
      var img = m && document.querySelector('#w-' + m[1] + ' .thumb .shot');
      if (!img) return;
      var r = img.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight || !r.width) return;
      img.style.viewTransitionName = 'case-shot';
      try { sessionStorage.setItem('vt-case', m[1]); } catch (x) {}
    });


    // mobile menu
    var toggle = document.querySelector('.menu-toggle');
    var menu = document.querySelector('.mobile-menu');
    var closeBtn = menu ? menu.querySelector('.close') : null;
    // A modal dialog: while open, everything behind it is inert (aria-modal is
    // not honoured everywhere; inert is), Tab stays inside, and closing returns
    // focus to the toggle unless a link click is taking the reader elsewhere.
    function setMenu(open, keepFocus) {
      if (!menu || open === menu.classList.contains('open')) return;
      menu.classList.toggle('open', open);
      document.documentElement.classList.toggle('menu-open', open);
      if (toggle) toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
      document.documentElement.style.overflow = open ? 'hidden' : '';   // older iOS rubber-bands the page behind a body-only lock
      Array.prototype.forEach.call(document.body.children, function (el) {
        if (el !== menu && !el.contains(menu) && el.tagName !== 'SCRIPT') el.inert = open;
      });
      // the menu itself leaves the Tab order the moment it starts to close:
      // it stays painted for its slide-out (styles.css), and a Tab pressed
      // then landed inside it, on a link about to vanish under the focus
      menu.inert = !open;
      document.dispatchEvent(new CustomEvent('numidea:menu', { detail: open }));
      // focus lands on the close button: first on screen, first in the
      // dialog, so Tab reads the menu in its order (it used to start on
      // the first link and reach "Fermer" last). It moves in the frame that
      // starts the slide, not inside the press: focus() lays the page out on
      // the spot, and the press held the main thread for it. The way back
      // to the toggle on a close is the same, in the frame that starts the
      // menu's exit.
      if (open) { var first = menu.querySelector('.close') || menu.querySelector('a'); if (first) requestAnimationFrame(function () { if (menu.classList.contains('open')) first.focus(); }); }
      else if (!keepFocus && toggle) requestAnimationFrame(function () { if (!menu.classList.contains('open')) toggle.focus(); });
    }
    if (menu) menu.inert = true;
    // a viewport grown past the phone layout (a rotation, a window widened)
    // closes the menu: it stayed open there, invisible, the page's scroll locked
    var wideMq = window.matchMedia('(min-width: 961px)');
    var onWide = function (e) { if (e.matches) setMenu(false, true); };
    if (wideMq.addEventListener) wideMq.addEventListener('change', onWide); else if (wideMq.addListener) wideMq.addListener(onWide);

    /* The header's own action (.nav-cta, "Mon Aperçu gratuit") shows from
       700px up, where the bar has room for it; below, the phone bar carries
       it. The width rule is styles.css's; until it lands this keeps the
       button off narrow screens (it ships hidden, so a phone never paints
       it before this runs). Room is measured, not assumed: at its full
       button size beside the seven section links the bar overflowed at
       1024 and squeezed the language pill at 1280 (the pill shrinks first,
       it clips its overflow), so the button is shown only while nothing in
       the bar is clipped by it. Measured again on a resize, a language or
       theme apply (type tokens change widths).
       Its slot is kept from the first paint (styles.css: the button's
       geometry, unseen), so showing it moves nothing: it fades in (.fit)
       once measured, when the browser is idle. Only a bar too narrow for
       it takes it out of the row (display), which the measure decides. */
    (function () {
      var cta = document.querySelector('.nav-cta'), bar = document.querySelector('.navbar .bar'), pill = document.querySelector('.nav-right .lang');
      if (!cta || !bar) return;
      var from = window.matchMedia('(min-width: 700px)'), t0 = 0;
      var clipped = function (el) { return !!el && el.scrollWidth > el.clientWidth + 1; };
      var fit = function () {
        var show = from.matches;
        // the button classes come here, not in the markup: with them the
        // link was painted before this ran (the .btn display rule outranks
        // the hidden attribute)
        cta.classList.add('btn', 'btn-primary');
        cta.hidden = !show;
        if (cta.style.display) cta.style.display = '';   // back in the row to be measured
        // both reads first, then the writes
        var over = show && (clipped(bar) || clipped(pill));
        cta.classList.toggle('fit', show && !over);
        if (over) cta.style.display = 'none';
      };
      var later = function () { clearTimeout(t0); t0 = setTimeout(fit, M(1)); };
      if (from.addEventListener) from.addEventListener('change', fit); else if (from.addListener) from.addListener(fit);
      window.addEventListener('resize', later);
      document.addEventListener('numidea:lang', later);
      document.addEventListener('numidea:relayout', later);
      window.addEventListener('load', later);
      idle(fit);
    })();

    /* A FAQ answer opened below the fold, its last lines under the phone
       bar: once open, the answer is brought to the nearest edge, clear of
       the bar (70px while it is on). scrollIntoView follows scroll-padding
       (the fixed nav, the bar's own scroll-padding-bottom) and the page's
       scroll-behavior, so reduced motion stays instant. */
    (function () {
      var bar = document.querySelector('.m-contact');
      document.querySelectorAll('.faq-item').forEach(function (d) {
        d.addEventListener('toggle', function () {
          if (!d.open) return;
          var a = d.querySelector('.faq-a');
          if (!a) return;
          var room = window.innerHeight - (bar && bar.classList.contains('on') ? 70 : 0);
          if (a.getBoundingClientRect().bottom > room) a.scrollIntoView({ block: 'nearest' });
        });
      });
    })();
    if (toggle) toggle.addEventListener('click', function () { setMenu(!menu.classList.contains('open')); });
    if (closeBtn) closeBtn.addEventListener('click', function () { setMenu(false); });
    if (menu) menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false, true); }); });
    document.addEventListener('keydown', function (e) {
      if (!menu || !menu.classList.contains('open')) return;
      if (e.key === 'Escape') { setMenu(false); return; }
      if (e.key !== 'Tab') return;
      var f = Array.prototype.filter.call(menu.querySelectorAll('a[href],button:not([disabled])'),
        function (el) { return el.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    // Legacy deep links from the retired project explorer (#/work, #/work/<slug>)
    // land on the project sheets instead of a dead hash.
    (function () {
      var m = /^#\/work(?:\/([\w-]+))?/.exec(location.hash);
      if (!m) return;
      var SHEET = { 'bordj-steel': 'bordjsteel', 'alliance-travel': 'alliance', 'almaflowclim': 'almaflow', 'glaive-store': 'glaive' };
      // the query (?lang=, ?ref=, utm_*) goes along, as it does on every link
      if (m[1] && SHEET[m[1]]) location.replace('scene/' + location.search + '#' + SHEET[m[1]]);
      else history.replaceState(null, '', location.pathname + location.search + '#work');
    })();

    // founder — résumé accordion (max-height expand + label swap)
    var cvBtn = document.querySelector('#cv-toggle'), cvPanel = document.querySelector('#cv-panel');
    if (cvBtn && cvPanel) {
      // The panel ships closed, so it starts inert too — setting this only on
      // toggle left the initial (closed) state still holding a focusable link.
      cvPanel.inert = !cvPanel.classList.contains('open');
      // The label is derived from the state, so a language switch with the
      // panel open does not reset it to "view" (applyLang writes data-i18n).
      var cvLabel = function () {
        var k = ['founder.cvBtn', 'founder.cvClose'][cvPanel.classList.contains('open') ? 1 : 0];
        cvBtn.setAttribute('data-i18n', k);
        cvBtn.innerHTML = DICT[k] != null ? DICT[k] : k;
      };
      cvBtn.addEventListener('click', function () {
        var open = cvPanel.classList.toggle('open');
        // Closed, the panel is only collapsed by max-height:0 — it still held a
        // focusable download link, so a keyboard user tabbed into an invisible
        // panel with nothing on screen to explain where focus had gone.
        cvPanel.inert = !open;
        cvBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
        cvLabel();
      });
    }

    /* Text the page writes into the message field for the visitor: the
       Aperçu request (prev) or the estimator's scope (est). It is written
       only while the field is empty or still holds exactly what the page
       last wrote there, so the visitor's own words are never overwritten,
       but an untouched prefill follows a later CTA click, a language or
       currency switch and a re-configured estimate instead of going stale. */
    var msgBox = document.getElementById('f-message');
    var prefill = { kind: '', text: '' };
    /* The price guide (tarifs/) has the estimator but not the form: its
       "Obtenir le prix ferme" leads to the home page's #contact, and the
       scope travels in sessionStorage (one tab, one visit; a copied link
       carries nothing), which the home page reads and clears below. */
    var HANDOFF = 'numidea-prefill';
    function untouched() { return !msgBox.value.trim() || msgBox.value === prefill.text; }
    function prefillWith(kind, text) {
      if (!text) return;
      if (!msgBox) { try { sessionStorage.setItem(HANDOFF, text); } catch (e) {} return; }
      if (!untouched()) return;
      msgBox.value = text;
      prefill.kind = kind; prefill.text = msgBox.value;
    }
    // follow the page, but only a prefill of that kind still untouched
    function refill(kind, text) {
      if (msgBox && prefill.kind === kind && prefill.text && msgBox.value === prefill.text) prefillWith(kind, text);
    }
    document.addEventListener('numidea:lang', function () { refill('prev', t('prev.msg')); });

    /* Where the prefill lands. Stacked (.contact-grid is one column at
       ≤960px, styles.css), the five contact rows come before the form, so the
       #contact jump stopped about a screen above the message just written
       (390x844: the form 898px down, under an 844px screen). There, the frame
       after the link's own jump, the form is brought to the top. The jump is
       kept, so the URL, Back and where Tab continues from stay as on desktop
       and without this script; with preventDefault, Tab went back up to the
       button's own section. scrollIntoView() follows scroll-padding and
       scroll-behavior, so reduced motion stays instant. Nothing is focused:
       a phone's keyboard would cover the message. */
    var stacked = window.matchMedia('(max-width: 960px)');
    function toForm() {
      var f = document.getElementById('contact-form');
      if (f && stacked.matches) requestAnimationFrame(function () { f.scrollIntoView(); });
    }

    /* A scope handed over by the price guide, taken up as its own kind:
       this page's estimator must not read it as one of its own and rewrite
       it on a currency switch (refill follows 'est' alone). The visitor
       arrives on #contact; stacked, the form is brought up as after a
       click here — once the browser's own jump to #contact is over. That
       jump comes after this script and is animated (html's
       scroll-behavior), 1.5 s on a phone: a scrollIntoView now was run
       over by it. The jump is over when no scroll event has come for 200
       ms after load; within 3 s of load, or the page is the visitor's. */
    if (msgBox) {
      var carried = null;
      // a course's fiche (hub/manuel.html) says what it is and whose: 'numidea-prefill-kind' ("brief:brandc" or
      // "brief:web3c") and 'numidea-prefill-name' (the fiche's first name), read and cleared with the text (rev1, 2026-11-21)
      var carriedKind = '', carriedName = '';
      try {
        carried = sessionStorage.getItem(HANDOFF); if (carried !== null) sessionStorage.removeItem(HANDOFF);
        carriedKind = sessionStorage.getItem(HANDOFF + '-kind') || ''; carriedName = sessionStorage.getItem(HANDOFF + '-name') || '';
        sessionStorage.removeItem(HANDOFF + '-kind'); sessionStorage.removeItem(HANDOFF + '-name');
      } catch (e) {}
      /* The guide's scope arrives as a bare line ("Site sur mesure · 8 pages
         — 180 000 – 420 000 DA"): a greeting (price.estHello) goes above it,
         so the message opens as a message and the visitor's lines follow
         naturally; the subject logic reads the first line (way 'carried').
         Until the dictionaries carry the key, the scope stands alone. */
      var hello = DICT['price.estHello'] != null ? plain(DICT['price.estHello']) : '';   // t() would hand back the key
      // a fiche opens with its own greeting and names its course on its first line: no second greeting above it
      var brief = /^brief:(brandc|web3c)$/.exec(carriedKind);
      if (carried && brief) {
        prefillWith('brief-' + brief[1], carried);
        var nameIn = document.getElementById('f-name');
        if (nameIn && carriedName && !nameIn.value.trim()) nameIn.value = carriedName.slice(0, 80);
      } else if (carried && carriedKind === 'prev') prefillWith('prev', carried);   // the guide's Aperçu button: the request as the home's own buttons write it
      else if (carried) prefillWith('carried', (hello ? hello + '\n' : '') + carried);
      if (carried && location.hash === '#contact') {
        var settled = null, landed = false;
        var land = function () {
          if (landed) return;
          landed = true; window.removeEventListener('scroll', jumping);
          toForm();
        };
        var jumping = function () { clearTimeout(settled); settled = setTimeout(land, M(3)); };
        window.addEventListener('scroll', jumping, { passive: true });
        window.addEventListener('load', function () { jumping(); setTimeout(function () { landed = true; window.removeEventListener('scroll', jumping); }, M(36)); });
      }
    }

    /* L'Aperçu: every link to it (data-apercu: the offer's, the Aperçu
       card's, the FAQ's and each tier's) hands its request to the message
       field, then the normal #contact jump happens (carried on to the form
       where it stacks). A tier's names the tier as its card shows it, name
       and range in the shown currency, after "what I need", the request's
       last line; from the price guide, which has no form, that line alone is
       carried to the home page's (prefillWith), as the estimator's scope is. */
    function tierLine(a) {
      var card = a.closest('.tier');
      var name = card && card.querySelector('h3'), range = card && card.querySelector('.t-range');
      return name ? plain(name.innerHTML) + (range ? ' · ' + range.textContent.replace(/\u2060/g, '').replace(/\s+/g, ' ').trim() : '') : '';
    }
    [].forEach.call(document.querySelectorAll('a[data-apercu]'), function (a) {
      a.addEventListener('click', function () {
        var tier = a.getAttribute('data-apercu') ? tierLine(a) : '';
        /* from the price guide (no form): a tier's line, or the Aperçu's
           request itself for the guide's own two Aperçu buttons, marked as
           such so the home writes no greeting above its own (walk-phone-07) */
        if (!msgBox) {
          try { if (tier) sessionStorage.removeItem(HANDOFF + '-kind'); else sessionStorage.setItem(HANDOFF + '-kind', 'prev'); } catch (e) {}
          prefillWith(tier ? 'tier' : 'prev', tier || t('prev.msg'));
          return;
        }
        prefillWith(tier ? 'tier' : 'prev', t('prev.msg') + tier);
        toForm();
      });
    });

    // contact form — designed validation + success
    var form = document.querySelector('#contact-form');
    if (form) {
      // Without this script the form posts to a mailto: (its action) and the
      // browser checks the required fields; with it, the designed messages
      // below take over and the submit is handled here.
      form.noValidate = true;
      var success = document.querySelector('.form-success');
      function field(id) { return form.querySelector('[name="' + id + '"]').closest('.field'); }
      function err(id, key) {
        var f = field(id);
        var dict = DICT;
        f.classList.add('invalid');
        var e = f.querySelector('.err');
        e.classList.remove('hint');
        e.textContent = key ? dict[key] : '';
        if (key) e.setAttribute('data-err-key', key); else e.removeAttribute('data-err-key');
        f.querySelector('input,textarea').setAttribute('aria-invalid', 'true');
      }
      // A language switch re-translates the labels; the messages follow.
      document.addEventListener('numidea:lang', function () {
        form.querySelectorAll('.err[data-err-key]').forEach(function (e) { e.textContent = t(e.getAttribute('data-err-key')); });
      });
      function clear(id) {
        var f = field(id);
        f.classList.remove('invalid');
        f.querySelector('.err').textContent = '';
        f.querySelector('.err').removeAttribute('data-err-key');
        f.querySelector('.err').classList.remove('hint');
        f.querySelector('input,textarea').removeAttribute('aria-invalid');
      }
      ['name', 'email', 'message'].forEach(function (id) {
        form.querySelector('[name="' + id + '"]').addEventListener('input', function () { clear(id); });
      });
      // What the copy button puts on the clipboard: the subject and body the
      // last valid submit handed to the mail app (not the address, which the
      // panel shows as text)
      var handoff = '';
      var msgErr = form.querySelector('#f-message-err');
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        // a "copy it yourself" hint left under the message goes; errors are
        // decided afresh below
        if (msgErr && msgErr.getAttribute('data-err-key') === 'form.copyFail') clear('message');
        var ok = true;
        var name = form.querySelector('[name="name"]').value.trim();
        var email = form.querySelector('[name="email"]').value.trim();
        var msg = form.querySelector('[name="message"]').value.trim();
        if (!name) { err('name', 'form.errName'); ok = false; }
        if (!email) { err('email', 'form.errEmail'); ok = false; }
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { err('email', 'form.errEmailValid'); ok = false; }
        // the Aperçu's template sent back as written says nothing (its blanks
        // are the message): the visitor is asked for a line, as for an empty field
        if (!msg || ((prefill.kind === 'prev' || prefill.kind === 'tier') && msg === prefill.text.trim())) { err('message', 'form.errMsg'); ok = false; }
        // focus the first field to fix; its error is read through aria-describedby
        if (!ok) { var bad = form.querySelector('[aria-invalid="true"]'); if (bad) bad.focus(); return; }

        // Static site, no backend: hand the lead off to the visitor's mail client,
        // pre-filled to hamissemohamedyasser@gmail.com. Only show success after the handoff.
        /* The subject names the way in — the Aperçu button, the estimator
           (this page's, or the price guide's scope carried over), or a plain
           contact — while the text that way wrote still opens the message:
           the Aperçu's template is filled in below its greeting, the
           estimator's scope gets the visitor's lines under it, but a message
           rewritten from the first line is the visitor's own. */
        var way = prefill.text && msg.indexOf(prefill.text.split('\n')[0].trim()) === 0 ? prefill.kind : '';
        var subject = t(way === 'prev' || way === 'tier' ? 'form.subjPrev' : way === 'est' || way === 'carried' ? 'form.subjEst' : way === 'brief-brandc' ? 'form.subjBriefB' : way === 'brief-web3c' ? 'form.subjBriefW' : 'form.subj') + name;
        var src = leadSource();
        var body = name + ' <' + email + '>\n\n' + msg
          + '\n\n--\nnumidealabs · ' + (document.documentElement.getAttribute('lang') || 'fr')
          // French sets a narrow no-break space before the colon; English and Arabic none
          + (src ? '\n' + t('form.source') + (document.documentElement.getAttribute('lang') === 'fr' ? ' : ' : ': ') + src : '');
        handoff = subject + '\n\n' + body;
        /* The same message on WhatsApp (#form-wa in the panel), for a visitor
           whose mail app never opens. The body as composed, no [ref] added:
           its Source line already carries the ad's code. Kept on the link, so
           wireWA (§13) leaves it in place. */
        var waAlt = document.getElementById('form-wa');
        if (waAlt && WA) { waAlt.waText = body; waAlt.href = waUrl(body); }
        // counted as a contact (assets/carry.js), like a click on a mail link
        if (window.numideaGo) window.numideaGo('form');
        window.location.href = 'mailto:hamissemohamedyasser@gmail.com'
          + '?subject=' + encodeURIComponent(subject)
          + '&body=' + encodeURIComponent(body);
        form.style.display = 'none';
        note('');
        // the form just vanished from under the focus; land it on the outcome
        if (success) { success.classList.add('show'); success.focus(); }
      });
      /* When no mail app opened (webmail only, no mailto handler), the
         visitor's text is not lost. "Copier mon message" puts the subject
         and body on the clipboard, to paste into a webmail, and says so in
         the panel's own role=status; "Revoir mon message" brings the form
         back, still filled in, to copy from or to send again. Without a
         clipboard (or when it refuses), the form comes back with the message
         selected and a line under it saying so. */
      var copyNote = document.getElementById('form-copied');
      // The line under the buttons. Emptied first and written a moment later,
      // so a second copy is announced again; data-i18n lets a language switch
      // re-translate it.
      function note(key) {
        if (!copyNote) return;
        copyNote.textContent = '';
        if (!key) { copyNote.removeAttribute('data-i18n'); return; }
        copyNote.setAttribute('data-i18n', key);
        setTimeout(function () { if (copyNote.getAttribute('data-i18n') === key) copyNote.textContent = t(key); }, M(1));   // an eighth after the clear, so the live region announces it again
      }
      function backToForm(select) {
        note('');
        success.classList.remove('show');
        form.style.display = '';
        if (msgBox) { msgBox.focus(); if (select) msgBox.setSelectionRange(0, msgBox.value.length); }
      }
      /* The message on WhatsApp instead of the mail app (#form-wa-send,
         beside the submit): the fields as they stand at the click, composed
         as the mail body opens (name <address>, then the message), set on
         the link before the browser follows it. Empty fields leave the
         baked opening line; wireWA (§13) keeps a text set here. */
      var waSend = document.getElementById('form-wa-send');
      if (waSend) waSend.addEventListener('click', function () {
        if (!WA) return;
        var n = form.querySelector('[name="name"]').value.trim();
        var m = form.querySelector('[name="email"]').value.trim();
        var txt = form.querySelector('[name="message"]').value.trim();
        if (!n && !m && !txt) return;
        var who = n + (m ? (n ? ' ' : '') + '<' + m + '>' : '');
        var text = (who ? who + '\n\n' : '') + txt;
        waSend.waText = text; waSend.href = waUrl(text);
      });
      var editBtn = document.getElementById('form-edit');
      if (editBtn && success) editBtn.addEventListener('click', function () { backToForm(false); });
      var copyBtn = document.getElementById('form-copy');
      if (copyBtn && success) copyBtn.addEventListener('click', function () {
        function fail() {
          // a hint, not an error: the field stays valid and the line takes the
          // neutral colour (.hint); typing clears it
          if (msgErr) { msgErr.textContent = t('form.copyFail'); msgErr.setAttribute('data-err-key', 'form.copyFail'); msgErr.classList.add('hint'); }
          backToForm(true);
        }
        var cb = navigator.clipboard;
        if (!cb || !cb.writeText) return fail();
        try { cb.writeText(handoff).then(function () { note('form.copied'); }, fail); } catch (e3) { fail(); }
      });
    }

    /* ---------------- 12 · project estimator ----------------
       The figures and the arithmetic are ESTIMATE (top of this file, pure);
       this section only reads the controls and writes the result. */
    var PRICE_MODEL = ESTIMATE.PRICE_MODEL, PRICE_OPTS = ESTIMATE.PRICE_OPTS;

    /* The plural category of n in the page's language. Without
       Intl.PluralRules, 1 is still "one" (and 2 the Arabic dual). */
    function plural(lang, n) {
      try { return new Intl.PluralRules(lang).select(n); } catch (e) {}
      if (n === 1) return 'one';
      if (lang === 'ar') {
        var h = n % 100;
        return n === 2 ? 'two' : h >= 3 && h <= 10 ? 'few' : h >= 11 ? 'many' : 'other';
      }
      return 'other';
    }
    /* A counted unit in the page's language: "1 page", "3 pages"; in Arabic
       the noun follows the number (one|two|few|many|other, e.g. 16 أسبوعاً).
       Forms live in the dictionary as '<key>.n', split on '|'. */
    function unit(k, n) {
      var lang = document.documentElement.getAttribute('lang') || DEFAULT_LANG;
      var d = DICT, forms = d[k + '.n'];
      if (!forms) return plain(d[k] || k);
      var f = forms.split('|');
      var i = (f.length === 5 ? ['one', 'two', 'few', 'many', 'other'] : ['one', 'other']).indexOf(plural(lang, n));
      return plain(f[i > -1 ? i : f.length - 1]);
    }
    /* The Arabic dual already says "two" (صفحتان is "two pages"): it stands
       without the numeral, which would read "2 two-pages". */
    function dual(n) {
      var lang = document.documentElement.getAttribute('lang');
      return lang === 'ar' && plural(lang, n) === 'two';
    }
    // "8 pages", "60 منتجاً", "صفحتان"
    function counted(k, n) { return dual(n) ? unit(k, n) : n + ' ' + unit(k, n); }


    /* ---------------- 12a · display currency ----------------
       Every price is set in dinars (PRICE_MODEL, RETAINER) and only converted
       for display, at the Bank of Algeria official rate of 10 November 2026
       (1 € = 152.37 DA, 1 $ = 136.13 DA, as the Algerian press printed the
       bank's daily table), rounded to what a person would actually quote. The tier
       cards, the maintenance line, the estimator and the market table all go
       through this one place, so no two figures on the page can disagree.
       ?cur= (an ad or a shared link) wins over the stored choice; dinars
       otherwise, which is also what the markup says with scripts off. */
    var FX = { DZD: 1, EUR: 152, USD: 136 };
    var CURS = ['DZD', 'EUR', 'USD'];
    var RETAINER = [18000, 60000];   // per month
    // narrow no-break space between groups: a normal space lets a figure wrap,
    // and a comma reads as a decimal point in DZ
    /* Numbers as each language writes them. French and Arabic group thousands
       with a narrow no-break space and put the currency after the figure
       (90 000 – 160 000 DA, 1 500 – 6 000 €); English groups with commas,
       closes up the range dash and puts € or $ before the figure
       (€1,500–6,000; 90,000–160,000 DZD). A range never breaks across lines:
       the dash is held by no-break spaces or word joiners. */
    var isEn = function () { return document.documentElement.getAttribute('lang') === 'en'; };
    var grp = function (n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, isEn() ? ',' : ' '); };
    var dash = function () { return isEn() ? '\u2060–\u2060' : '\u00a0–\u2060\u00a0'; };
    var tidy = function (n, c) {
      var g = c === 'DZD' ? (n >= 1e6 ? 50000 : n >= 150000 ? 10000 : 5000)
                          : (n >= 10000 ? 500 : n >= 1000 ? 100 : 10);
      return Math.max(g, Math.round(n / g) * g);
    };
    var sym = function (c) { return c === 'DZD' ? t('price.cur') : c === 'EUR' ? '€' : '$'; };
    var pre = function (c) { return isEn() && c !== 'DZD' ? sym(c) : ''; };   // sign before the figure
    var post = function (c) { return pre(c) ? '' : sym(c); };                 // or after it
    // a dinar figure as shown in currency c (dinars pass through unrounded)
    var shown = function (dzd, c) { return c === 'DZD' ? dzd : tidy(dzd / FX[c], c); };
    var rangeText = function (lo, hi, c) {
      return (c === 'DZD' ? '' : '≈ ') + pre(c) + grp(shown(lo, c)) + dash() + grp(shown(hi, c));
    };
    var CUR = (function () {
      var q = '', s = '';
      try { q = (new URLSearchParams(location.search).get('cur') || '').toUpperCase(); } catch (e) {}
      try { s = localStorage.getItem('numidea-cur') || ''; } catch (e) {}
      // An ad's ?cur= is kept like ?lang= is, so the visitor's choice of
      // currency survives a visit to another page and the way back.
      if (CURS.indexOf(q) !== -1) { try { localStorage.setItem('numidea-cur', q); } catch (e) {} return q; }
      return CURS.indexOf(s) !== -1 ? s : 'DZD';
    })();
    var renderPrices = function () {
      document.querySelectorAll('.t-range[data-tier]').forEach(function (p) {
        var m = PRICE_MODEL[p.getAttribute('data-tier')];
        p.querySelector('b').textContent = rangeText(m.base[0], m.base[1], CUR);
        p.querySelector('.cur').textContent = post(CUR);
      });
      var ret = document.getElementById('pr-ret');
      if (ret) {
        ret.textContent = rangeText(RETAINER[0], RETAINER[1], CUR);
        ret.parentNode.querySelector('.cur').textContent = post(CUR);
      }
      var note = document.getElementById('pr-cur-note');
      if (note) { note.hidden = CUR === 'DZD'; note.textContent = CUR === 'DZD' ? '' : t('price.curNote' + CUR); }
      document.querySelectorAll('input[name="pr-cur"]').forEach(function (r) { r.checked = r.value === CUR; });
    };
    var setCur = function (c) {
      if (CURS.indexOf(c) === -1) return;
      CUR = c;
      try { localStorage.setItem('numidea-cur', c); } catch (e) {}
      // keep a shared ?cur= link truthful after a switch, as ?lang= is
      try {
        var u = new URL(location.href);
        if (u.searchParams.has('cur')) { u.searchParams.set('cur', c.toLowerCase()); history.replaceState(null, '', u); }
      } catch (e) {}
      renderPrices();
      document.dispatchEvent(new CustomEvent('numidea:cur', { detail: { cur: c } }));
    };
    document.querySelectorAll('input[name="pr-cur"]').forEach(function (r) {
      r.addEventListener('change', function () { if (r.checked) setCur(r.value); });
    });
    document.addEventListener('numidea:lang', renderPrices);
    renderPrices();

    var est = document.getElementById('estimator');
    if (est) {
      var eSize   = document.getElementById('est-size'),
          eSizeV  = document.getElementById('est-size-v'),
          eSizeH  = document.getElementById('est-size-h'),
          eLo     = document.getElementById('est-lo'),
          eHi     = document.getElementById('est-hi'),
          eWeeks  = document.getElementById('est-weeks'),
          eSum    = document.getElementById('est-summary'),
          eCta    = document.getElementById('est-cta');

      var typeOf = function () {
        var r = est.querySelector('input[name="est-type"]:checked');
        return r ? r.value : 'surmesure';
      };

      /* What the visitor ticked is theirs. A tier that includes an option
         shows it ticked and locked; leaving that tier gives the box back as
         the visitor had left it (data-user), not unticked: a paid option
         chosen on Vitrine survives a look at Studio and back. */
      est.querySelectorAll('input[data-opt]').forEach(function (c) {
        c.addEventListener('change', function () { if (!c.disabled) c.dataset.user = c.checked ? '1' : ''; });
      });

      var syncSize = function (keepValue) {
        var m = PRICE_MODEL[typeOf()];
        var prev = parseInt(eSize.value, 10);
        eSize.min = m.min; eSize.max = m.max; eSize.step = m.step;
        eSize.value = keepValue && prev >= m.min && prev <= m.max ? prev : m.def;
        if (eSizeH) eSizeH.textContent = t(m.u);
        /* Options the tier already includes are shown ticked and locked,
           labelled as included; leaving that type frees them again. */
        est.querySelectorAll('input[data-opt]').forEach(function (c) {
          var opt = c.getAttribute('data-opt');
          var inc = (m.incl || []).indexOf(opt) > -1;
          /* An option the type has no use for (PRICE_MODEL opts: a CMS on
             an identity, a design kit on an automation) is unticked and
             locked, greyed by its label (.eopt-na); a type that takes it
             gives it back as the visitor had left it. */
          var na = !!m.opts && m.opts.indexOf(opt) === -1;
          var lab = c.closest('label'), tag = lab && lab.querySelector('.eo-incl');
          if (inc || na) {
            if (!c.disabled) c.dataset.user = c.checked ? '1' : '';
            c.checked = inc; c.disabled = true;
          } else if (c.disabled) {
            c.checked = c.dataset.user === '1'; c.disabled = false;
          }
          if (lab) lab.classList.toggle('eopt-na', na);
          if (inc && lab && !tag) {
            tag = document.createElement('small');
            tag.className = 'eo-incl';
            lab.appendChild(tag);
          }
          if (tag) {
            if (inc) tag.textContent = t('price.incl');
            else tag.remove();
          }
        });
      };

      var compute = function () {
        var key = typeOf(), m = PRICE_MODEL[key];
        var n = parseInt(eSize.value, 10) || m.def;
        var opts = [].map.call(est.querySelectorAll('input[data-opt]:checked'), function (c) { return c.getAttribute('data-opt'); });
        var rush = est.querySelector('input[name="est-pace"]:checked');
        var q = ESTIMATE.quote(key, n, opts, !!(rush && rush.value === 'rush'));
        var picked = opts.filter(function (o) { return PRICE_OPTS[o]; }).map(function (o) {
          return q.incl.indexOf(o) > -1 ? t(PRICE_OPTS[o].k) + ' (' + t('price.incl') + ')' : t(PRICE_OPTS[o].k);
        });
        if (q.rush) picked.push(t('price.paceRush'));
        // a Vitrine that would cost more than the Studio tier is quoted as Studio
        if (q.studio) picked.push(t('price.studioBetter'));

        eLo.textContent = (CUR === 'DZD' ? '' : '≈ ') + pre(CUR) + grp(shown(q.lo, CUR));
        eHi.textContent = grp(shown(q.hi, CUR));
        var eCur = eLo.parentNode.querySelector('.cur');
        if (eCur) eCur.textContent = post(CUR);
        // .eo-time is a status region: write only what changed, or every
        // slider step re-announces an unchanged delivery time
        var setText = function (el, v) { if (el && el.textContent !== v) el.textContent = v; };
        setText(eWeeks, q.wLo + dash() + q.wHi);
        setText(eWeeks.parentNode.querySelector('[data-i18n="price.weeks"]'), unit('price.weeks', q.wHi));

        // the size readout and the slider's spoken value carry the unit, which
        // changes meaning with the type (pages, products, screens…)
        var two = dual(n);
        if (eSizeV) { eSizeV.textContent = n; eSizeV.hidden = two; }
        // the track's filled part, for the segmented bar styles.css draws (2026-11-27): the share of the range, a number, nothing else
        eSize.style.setProperty('--fill', ((n - eSize.min) / ((eSize.max - eSize.min) || 1) * 100).toFixed(1) + '%');
        if (eSizeH) eSizeH.textContent = unit(m.u, n);
        eSize.setAttribute('aria-valuetext', counted(m.u, n));
        var headText = t('price.ty' + ({ vitrine: 'Vitrine', surmesure: 'Custom', ecommerce: 'Shop',
                                         app: 'App', auto: 'Auto', identite: 'Brand' }[key]))
                     + ' · ' + counted(m.u, n);
        if (eSum) {
          eSum.textContent = '';
          var head = document.createElement('li');
          head.className = 'eo-head';
          head.textContent = headText;
          eSum.appendChild(head);
          /* The receipt: every line of the quote with its amount, then the
             total, which is their exact sum. Lines are in dinars whatever the
             display currency, because that is the currency the prices are set
             in; the figure above converts the total. */
          var amt = function (n) { return (n < 0 ? '\u2212' : '') + grp(Math.abs(n)); };
          var row = function (label, value, cls) {
            var li = document.createElement('li'), l = document.createElement('span'), v = document.createElement('span');
            if (cls) li.className = cls;
            l.className = 'eo-l'; l.textContent = label; v.className = 'eo-v'; v.textContent = value;
            li.appendChild(l); li.appendChild(v); eSum.appendChild(li);
          };
          q.lines.forEach(function (ln) {
            var label = ln.k === 'base' ? t('price.lnUpTo') + ' ' + counted(m.u, ln.n)
                      : ln.k === 'extra' ? '+ ' + counted(m.u, ln.n)
                      : ln.k === 'opt' ? t(PRICE_OPTS[ln.o].k)
                      : ln.k === 'studio' ? t('price.lnStudio') : ln.k === 'kit' ? t('price.lnKit') : t('price.lnRush');
            row(label, ln.incl ? t('price.incl') : amt(ln.lo) + dash() + amt(ln.hi) + ' ' + t('price.cur'));
          });
          row(t('price.lnTotal'), amt(q.lo) + dash() + amt(q.hi) + ' ' + t('price.cur'), 'eo-total');
        }

        /* Carry the configured scope into the contact form, so the visitor
           does not have to retype what they just clicked. Built from the
           same strings as the list, not read back from it: the estimator is
           folded in a <details> (M4), and while it is closed the list is not
           rendered, so its innerText is empty and the scope came out as the
           range alone (at start-up, and on a currency or language switch
           made with the panel closed). */
        if (eCta) {
          eCta.dataset.scope = [headText].concat(picked).join(' · ')
            + ' — ' + rangeText(q.lo, q.hi, CUR) + (post(CUR) ? ' ' + post(CUR) : '') + (CUR === 'DZD' ? '' : ' ' + t('price.exTax'));
          // a scope already handed to the message, untouched, follows this one
          refill('est', eCta.dataset.scope);
        }
      };

      est.addEventListener('change', function (ev) {
        if (ev.target.name === 'est-type') syncSize(false);
        compute();
      });
      eSize.addEventListener('input', compute);
      /* A finger that lands on the slider to scroll the page past it must
         not change the estimate. Chrome on Android moves the thumb to the
         touch point on pointerdown, then hands a vertical gesture to the
         page (pointercancel): measured at 320-844px, a swipe up from the
         track set 22 pages to 9 while the page scrolled 176px. When the
         browser takes the gesture as a scroll the value is put back; a
         sideways drag stays the slider's (no pointercancel). It is put back
         through the 'input' event, not a direct compute(): setting .value
         fires nothing, and every view of the estimate (the figures here, the
         range bar in 13b) listens to 'input', so all of them follow. */
      var touchFrom = null;
      eSize.addEventListener('pointerdown', function (e) { touchFrom = e.pointerType === 'touch' ? eSize.value : null; });
      eSize.addEventListener('pointerup', function () { touchFrom = null; });
      eSize.addEventListener('pointercancel', function () {
        if (touchFrom !== null && eSize.value !== touchFrom) { eSize.value = touchFrom; eSize.dispatchEvent(new Event('input')); }
        touchFrom = null;
      });

      /* Hand the scope to the message field rather than losing it on the jump. */
      if (eCta) {
        eCta.addEventListener('click', function () { prefillWith('est', eCta.dataset.scope); toForm(); });
      }

      /* Units and option labels are translated, so rebuild on language change. */
      document.addEventListener('numidea:lang', function () { syncSize(true); compute(); });
      document.addEventListener('numidea:cur', compute);
      syncSize(true);
      compute();
    }

    /* ---------------- 13 · WhatsApp ----------------
       NUMIDEA_WA is the studio's number in full international form, digits
       only (e.g. '213XXXXXXXXX'). Should it ever be empty, every WhatsApp
       control loses its href and is marked disabled rather than linking
       somewhere wrong. scripts/build-lang.mjs bakes the same link, in the
       page's language (or that guard), into the page, so the offer's button
       works before this deferred script runs; wireWA() rewrites it with the
       ad's [ref]. */
    var WA = (window.NUMIDEA_WA || '').replace(/[^0-9]/g, '');
    /* Where a lead came from, read at the moment it is sent: ?ref= (each ad
       and email carries its own code), utm_* and whether Meta or Google added
       a click id. Nothing is stored or sent anywhere else: it rides in the
       mailto body and the WhatsApp text the visitor sends themselves. The
       query string survives every #anchor jump, and links to the site's
       other pages carry these parameters along (assets/carry.js).
       Declarations, not expressions: the form's submit handler (above) calls
       leadSource(), and a hoisted declaration exists even if something
       between there and here threw during start-up. */
    function leadSource() {
      var q; try { q = new URLSearchParams(location.search); } catch (e) { return ''; }
      var clean = function (v) { return (v || '').replace(/[^\w .:\/-]/g, '').slice(0, 40); };
      // the four usual utm_* first, as values; any other utm_* (term, id…)
      // named, so no campaign parameter is lost; then the ad's own ?ref=
      var MAIN = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'];
      var utm = {}, extra = [];    // first value of each utm_* key, any case
      q.forEach(function (v, k) {
        k = k.toLowerCase();
        if (k.indexOf('utm_') !== 0 || Object.prototype.hasOwnProperty.call(utm, k)) return;
        utm[k] = v;
        if (MAIN.indexOf(k) === -1) extra.push(k);
      });
      var parts = MAIN.map(function (k) { return clean(utm[k]); });
      extra.forEach(function (k) { if (clean(utm[k])) parts.push(clean(k.slice(4)) + ':' + clean(utm[k])); });
      parts.push(clean(q.get('ref')));
      parts = parts.filter(Boolean);
      if (q.has('fbclid')) parts.push('fbclid');
      if (q.has('gclid')) parts.push('gclid');
      return parts.join(' · ');
    }
    function refTag() {
      var r = ''; try { r = new URLSearchParams(location.search).get('ref') || ''; } catch (e) {}
      r = r.replace(/[^\w-]/g, '').slice(0, 20);
      return r ? ' [' + r + ']' : '';
    }
    // the conversation opened on this text (the form's submit handler, above, uses it too)
    function waUrl(text) { return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(text); }
    // Rebuilt on a language swap, so the pre-filled greeting follows the page.
    var wireWA = function () { document.querySelectorAll('.wa-link').forEach(function (a) {
      if (WA) {
        // a link may carry its own opening line (the Aperçu one does), or the
        // message the visitor just typed (the success panel's, set on submit)
        a.href = waUrl(a.waText || t(a.getAttribute('data-wa-text') || 'wa.hello') + refTag());
        a.target = '_blank';
        a.rel = 'noopener';
        a.removeAttribute('aria-disabled');
      } else {
        a.removeAttribute('href');
        a.setAttribute('aria-disabled', 'true');
      }
    }); };
    wireWA();
    document.addEventListener('numidea:lang', wireWA);


    /* ---------------- phone contact bar ----------------
       Phones only (the CSS hides it above 720px). On from one screen down,
       hidden again while the offer's buttons, the estimator's figure (it
       carries the estimate then, see below), #contact or the footer is on
       screen, and while the menu is open: #contact already offers the same
       two actions, and the footer comes straight after it and is shorter
       than a phone screen. On the price guide it shows once its first block
       (which offers the same two ways) has gone, not from load. Its main button
       goes to the form with the Aperçu's request written in (data-apercu), as
       the offer's does: it used to jump back up to the explainer card.
       It steps aside on a long downward run (600px without a pause) and is
       back at the first upward move or 220ms after the last scroll event: a
       flick's momentum is one run, and the bar no longer slides in and out
       under it (it left on any step over 40px and came back 150ms later).
       It stays while focus is inside it. A same-page jump (a client logo to
       its card, a menu link) is not a run: the bar shows where it lands.
       While #estimator's controls are on screen the bar swaps its buttons
       for the figure (.m-price, copied from #est-range) and the estimator's
       own action: the panel that used to stick under the navbar for it took
       51% of a phone screen, and a tick is answered where the thumb is. */
    (function () {
      var bar = document.querySelector('.m-contact');
      if (!bar) return;
      document.documentElement.classList.add('mbar');
      // as in styles.css: phones, but not a phone on its side (short and at
      // least 480px wide), where the bar would cover a third of the screen
      var mq = window.matchMedia('(max-width: 720px) and (min-height: 561px), (max-width: 479px)');
      var guide = !!document.querySelector('main.tarifs');
      var inView = { contact: false, footer: false, offer: false, est: false }, menuOpen = false;
      var lastY = scrollPos, run = 0, up = 0, away = false, restT = 0, jumpT = 0, jumping = false;
      var price = bar.querySelector('.m-price'), go = bar.querySelector('.m-estgo');
      var rng = document.getElementById('est-range'), wks = document.getElementById('est-weeks');
      function fill() {
        if (!price || !rng) return;
        var clean = function (x) { return (x || '').replace(/[\u2060\u00a0\s]+/g, ' ').trim(); };
        price.querySelector('.mp-n').textContent = clean(rng.textContent);
        price.querySelector('.mp-w').textContent = wks && wks.parentNode ? clean(wks.parentNode.textContent) : '';
      }
      function update() {
        var on = mq.matches && !menuOpen && !inView.contact && !inView.footer && !inView.offer
          && (guide ? scrollPos > 0 : scrollPos > viewH) && (!away || bar.contains(document.activeElement));
        bar.classList.toggle('on', on);
        document.documentElement.classList.toggle('mbar-on', on);   // what the toast above the bar reads (styles.css)
        bar.classList.toggle('est', on && inView.est && !!price);
      }
      function onBarScroll() {
        var dy = scrollPos - lastY;
        lastY = scrollPos;
        // no run under reduced motion: the page jumps there, and a bar
        // written back after a jump is motion of its own (keys.mjs).
        /* It goes after a screen and a half read downward (600px went in two
           flicks of a thumb), and comes back on a deliberate move up (48px
           of it, not the twitch at the end of a flick) or after a second at
           rest (it came back in 220ms, so a flick-and-pause read flipped it
           twenty times in six seconds). */
        if (!reduceMotion && !jumping) {
          if (dy < 0) { run = 0; up += dy; if (up < -48) away = false; }
          else if (dy > 0) { up = 0; run += dy; if (run > viewH * 1.5) away = true; }
          clearTimeout(restT);
          restT = setTimeout(function () { run = 0; up = 0; away = false; update(); }, M(12));
        }
        update();
      }
      if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (es) {
          es.forEach(function (e) {
            var c = e.target.classList;
            inView[c.contains('footer') ? 'footer' : c.contains('tarifs-top') || c.contains('offer-cta') ? 'offer' : c.contains('est-grid') ? 'est' : 'contact'] = e.isIntersecting;
          });
          update();
        });
        /* the guide's first block and the home's offer band (.offer-cta, under
           the menu since 2026-11-27) offer the same two ways: while they are
           on screen the bar would show them twice, one half under it */
        ['#contact', '.footer', '.tarifs-top', '.offer-cta', '#estimator .est-grid'].forEach(function (s) { var el = document.querySelector(s); if (el) io.observe(el); });
      }
      if (price && rng && 'MutationObserver' in window) {
        var fr = 0;
        new MutationObserver(function () { cancelAnimationFrame(fr); fr = requestAnimationFrame(fill); })
          .observe(rng.parentNode, { subtree: true, childList: true, characterData: true });
        fill();
      }
      if (go) go.addEventListener('click', function (e) {
        var c = document.getElementById('est-cta');
        if (c) { e.preventDefault(); c.click(); }
      });
      document.addEventListener('numidea:menu', function (e) { menuOpen = !!e.detail; update(); });
      // keyboard focus is never left under the bar: a control it reaches below the bar's top edge is brought clear of it
      document.addEventListener('focusin', function (e) {
        var el = e.target;
        if (!bar.classList.contains('on') || !el || !el.getBoundingClientRect || bar.contains(el)) return;
        if (el.getBoundingClientRect().bottom > bar.getBoundingClientRect().top) el.scrollIntoView({ block: 'nearest' });
      });
      document.addEventListener('numidea:lang', function () { setTimeout(fill, 0); });
      // a same-page jump: not a run, and the bar shows where it lands
      document.addEventListener('click', function (e) {
        var a = e.target.closest && e.target.closest('a[href^="#"]');
        if (!a || a.getAttribute('href').length < 2) return;
        jumping = true; away = false; run = 0; up = 0; clearTimeout(restT);
        clearTimeout(jumpT); jumpT = setTimeout(function () { jumping = false; lastY = scrollPos; }, reduceMotion ? M(1) : M(20));
        update();
      });
      window.addEventListener('scroll', onBarScroll, { passive: true });
      if (mq.addEventListener) mq.addEventListener('change', update); else if (mq.addListener) mq.addListener(update);
      update();
    })();

    /* ---------------- phone and tablet furniture ----------------
       What the phone layout (styles.css, "THE PHONE AND THE TABLET") needs a
       script for. Each piece is its own try: with scripts off the page is the
       plain stack, every list open, the three tiers one under the other. */
    // the header's language switch is one button on a phone (the current
    // language: it opens the other two); the menu keeps the whole switch
    try {
      (function () {
        var lg = document.querySelector('.navbar .lang');
        var cur = lg && lg.querySelector('a[aria-current]');
        if (!cur) return;
        var one = window.matchMedia('(max-width: 720px)');
        var set = function (open) { lg.classList.toggle('open', open); cur.setAttribute('aria-expanded', open ? 'true' : 'false'); };
        var sync = function () {
          if (one.matches) { cur.setAttribute('role', 'button'); cur.setAttribute('aria-haspopup', 'true'); cur.setAttribute('aria-expanded', 'false'); }
          else { cur.removeAttribute('role'); cur.removeAttribute('aria-haspopup'); cur.removeAttribute('aria-expanded'); lg.classList.remove('open'); }
        };
        cur.addEventListener('click', function (e) { if (!one.matches) return; e.preventDefault(); set(!lg.classList.contains('open')); });
        cur.addEventListener('keydown', function (e) { if (one.matches && e.key === ' ') { e.preventDefault(); cur.click(); } });
        document.addEventListener('click', function (e) { if (lg.classList.contains('open') && !lg.contains(e.target)) set(false); });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && lg.classList.contains('open')) { set(false); cur.focus(); } });
        if (one.addEventListener) one.addEventListener('change', sync); else if (one.addListener) one.addListener(sync);
        sync();
      })();
    } catch (e) { if (window.console && console.error) console.error(e); }

    // the Aperçu's path: three lines on a phone, the other two and the
    // sentences behind one button
    try {
      (function () {
        var more = document.querySelector('.ptl-more'), w = more && more.closest('.ptl-w');
        if (!w) return;
        more.addEventListener('click', function () {
          /* the button sits under the list: opening it pushed the button a
             screen down from under the finger. The page scrolls by what it
             moved, so it stays where it was tapped (the change is instant) */
          var top = more.getBoundingClientRect().top;
          var on = w.classList.toggle('full');
          more.setAttribute('aria-expanded', on ? 'true' : 'false');
          var d = more.getBoundingClientRect().top - top;
          if (Math.abs(d) > 1) window.scrollBy({ top: d, left: 0, behavior: 'instant' });
        });
      })();
    } catch (e) { if (window.console && console.error) console.error(e); }

    // the work as a rail on a phone: its place in dots, and a logo in the
    // proof row brings its card into the rail
    try {
      (function () {
        var grid = document.querySelector('#work .work-grid');
        if (!grid) return;
        var cards = [].slice.call(grid.querySelectorAll('.proj'));
        if (cards.length < 2) return;
        var dots = document.createElement('div');
        dots.className = 'rail-dots'; dots.setAttribute('aria-hidden', 'true');
        cards.forEach(function () { dots.appendChild(document.createElement('i')); });
        grid.parentNode.insertBefore(dots, grid.nextSibling);
        var step = function () { return Math.abs(cards[1].offsetLeft - cards[0].offsetLeft) || 1; };
        var raf = 0;
        var mark = function () {
          raf = 0;
          var i = Math.max(0, Math.min(cards.length - 1, Math.round(Math.abs(grid.scrollLeft) / step())));
          [].forEach.call(dots.children, function (d, k) { d.classList.toggle('on', k === i); });
        };
        grid.addEventListener('scroll', function () { if (!raf) raf = requestAnimationFrame(mark); }, { passive: true });
        raf = requestAnimationFrame(mark);   // (in the first frame, not in the start's task: it measures the cards)
        document.addEventListener('click', function (e) {
          var a = e.target.closest && e.target.closest('a[href^="#w-"]');
          if (!a || grid.scrollWidth <= grid.clientWidth + 2) return;
          var i = cards.indexOf(document.getElementById(a.getAttribute('href').slice(1)));
          if (i < 0) return;
          var rtl = document.documentElement.getAttribute('dir') === 'rtl';
          grid.scrollTo({ left: (rtl ? -1 : 1) * i * step(), behavior: reduceMotion ? 'auto' : 'smooth' });
        });
      })();
    } catch (e) { if (window.console && console.error) console.error(e); }

    // the three tiers as one at a time on a phone (Studio first, as the
    // card recommended), the lists folded; the price guide keeps its stack
    try {
      (function () {
        var tiers = document.querySelector('#pricing .tiers');
        if (!tiers || document.querySelector('main.tarifs')) return;
        var cards = [].slice.call(tiers.querySelectorAll(':scope > .tier'));
        if (cards.length < 2) return;
        var sw = document.createElement('div');
        sw.className = 'tier-tabs'; sw.setAttribute('role', 'group'); sw.setAttribute('aria-labelledby', 'pricing-h');
        var btns = cards.map(function (c, i) {
          var b = document.createElement('button');
          b.type = 'button';
          b.addEventListener('click', function () { pick(i, true); });
          sw.appendChild(b);
          return b;
        });
        var names = function () { cards.forEach(function (c, i) { var h = c.querySelector('h3'); btns[i].textContent = h ? h.textContent : ''; }); };
        var at = -1;
        var pick = function (i, user) {
          cards.forEach(function (c, k) { c.classList.toggle('on', k === i); btns[k].setAttribute('aria-pressed', k === i ? 'true' : 'false'); });
          /* the chosen card comes in from the side of its tab, 16px in 333:
             from the right for a tab after the last one, from the left for
             one before it, mirrored in Arabic where the tabs read the other way */
          if (user && at > -1 && at !== i && !reduceMotion && cards[i].animate) {
            var dir = (i > at ? 1 : -1) * (document.documentElement.getAttribute('dir') === 'rtl' ? -1 : 1);
            cards[i].animate([{ opacity: 0, transform: 'translateX(' + dir * 16 + 'px)' }, { opacity: 1, transform: 'none' }], { duration: M(4), easing: EASE_ENTER });
          }
          at = i;
        };
        /* Studio opens, so the lowest price on the page sat behind a tab: one
           line above the tabs says where the tiers start ("dès 90 000 DA
           (Essentiel)"), from the cheapest card's own PRICE_MODEL floor and
           name, in the shown currency. It goes with the tabs: from 961px the
           three cards stand side by side and it is hidden (styles.css). */
        var from = document.createElement('p');
        from.className = 'tier-from';
        var floor = function () {
          var low = null, nm = '';
          cards.forEach(function (c) {
            var r = c.querySelector('.t-range[data-tier]'), m = r && PRICE_MODEL[r.getAttribute('data-tier')], h = c.querySelector('h3');
            if (m && (low === null || m.base[0] < low)) { low = m.base[0]; nm = h ? h.textContent : ''; }
          });
          from.hidden = low === null;
          if (low === null) return;
          var parts = t('price.from').split('{p}'), b = document.createElement('b');
          b.textContent = (CUR === 'DZD' ? '' : '≈ ') + pre(CUR) + grp(shown(low, CUR)) + (post(CUR) ? ' ' + post(CUR) : '');
          from.textContent = parts[0];
          from.appendChild(b);
          from.appendChild(document.createTextNode((parts[1] || '').replace('{n}', nm)));
        };
        var first = cards.findIndex(function (c) { return c.classList.contains('tier-pop'); });
        names(); pick(first < 0 ? 0 : first); floor();
        tiers.parentNode.insertBefore(sw, tiers);
        tiers.parentNode.insertBefore(from, sw);
        document.addEventListener('numidea:cur', floor);
        document.addEventListener('numidea:lang', floor);
        tiers.classList.add('tt');
        document.addEventListener('numidea:lang', names);
        if (window.matchMedia('(max-width: 720px)').matches) cards.forEach(function (c) { var d = c.querySelector('.t-incl'); if (d) d.open = false; });
      })();
    } catch (e) { if (window.console && console.error) console.error(e); }

    // the ten services as rows that open on a tap on a phone (all ten are
    // listed: the five others stand open there, with no fold of their own)
    try {
      (function () {
        var sec = document.getElementById('services');
        if (!sec) return;
        var rows = [].slice.call(sec.querySelectorAll('.svc-row, .cap'));
        rows.forEach(function (row, n) {
          var h = row.querySelector('h3, h4');
          if (!h) return;
          if (!h.id) h.id = 'svc-h' + n;
          var b = document.createElement('button');
          b.type = 'button'; b.className = 'svc-tog'; b.setAttribute('aria-expanded', 'false'); b.setAttribute('aria-labelledby', h.id);
          row.insertBefore(b, row.firstChild);
          var flip = function () { var on = row.classList.toggle('open'); b.setAttribute('aria-expanded', on ? 'true' : 'false'); };
          b.addEventListener('click', function (e) { e.stopPropagation(); flip(); });
          // a tap on the title or the tagline does the same (a pointer's reach; the button is the keyboard's)
          row.addEventListener('click', function (e) {
            if (e.target.closest('a, button, .brief, .fam')) return;
            if (window.matchMedia('(max-width: 960px)').matches) flip();
          });
        });
        sec.classList.add('svc-fold');
        var fold = sec.querySelector('details.capabilities');
        var openFold = function () { if (fold && window.matchMedia('(max-width: 960px)').matches) { fold.open = true; fold.classList.add('svc-flat'); } };
        openFold();
      })();
    } catch (e) { if (window.console && console.error) console.error(e); }

    /* ---------------- 13b · visualisations (r3/c) ----------------
       Pictures of numbers the page already states, drawn from the same
       sources and never from new ones: PRICE_MODEL (each tier's weeks; the
       estimate against the three packages) and MARKET (section 14). Each one
       sits beside its text equivalent — the tier's own line, the estimator's
       status line, the market table — so the pictures themselves are
       aria-hidden. The Aperçu's path is the exception: it is the text (the
       one place the page tells it), and only its marks are drawn in.
       Motion is entrance only, started by IntersectionObserver (never a
       scroll handler), on transform and opacity. The drawn state is the
       default: the script adds .vz-arm to hold a picture back and .vz-go
       to play it, so with scripts off, with reduced motion, or for a
       picture already on screen when this runs, nothing waits. Pictures
       whose marks this places keep their room from the first paint and are
       shown (.vz-on) once placed. Printing, or reduced motion turned on
       during the visit, finishes whatever is still held back.
       Its own try: a fault here must not stop the sections after it. */
    try {
      var vzMove = !reduceMotion && 'IntersectionObserver' in window;
      var vzPainted = false;
      try { vzPainted = performance.getEntriesByType('paint').length > 0; } catch (e) {}
      var vzRtl = function () { return document.documentElement.getAttribute('dir') === 'rtl'; };
      var vzPrint = [];   // how to finish each picture still held back, for print
      /* Hold el back for its entrance, unless motion is off or the visitor
         is already looking at it (a page opened on #pricing): a picture that
         blinked out and redrew itself in front of them would read as a fault. */
      var vzRect = null;   // the pictures' boxes, read in one pass before any is armed
      var vzArm = function (el, finish) {
        if (!vzMove) return false;
        var r = vzRect && vzRect.get(el);
        if (!r && vzPainted) r = el.getBoundingClientRect();
        if (r && r.width && r.bottom > 0 && r.top < (window.innerHeight || 0)) return false;
        el.classList.add('vz-arm');
        vzPrint.push(finish || function () { el.classList.remove('vz-arm'); });
        return true;
      };
      var vzFinish = function () { vzPrint.forEach(function (f) { f(); }); vzPrint = []; };
      window.addEventListener('beforeprint', vzFinish);
      /* Reduced motion turned on during the visit: every picture still held
         back is finished at once, as it would have been from the start, and
         none is held back after (vzMove). */
      var vzRmq = window.matchMedia('(prefers-reduced-motion: reduce)');
      var vzOnRm = function () { if (vzRmq.matches) { vzMove = false; vzFinish(); } };
      if (vzRmq.addEventListener) vzRmq.addEventListener('change', vzOnRm);
      else if (vzRmq.addListener) vzRmq.addListener(vzOnRm);
      // fn(el) the first time el is `share` on screen (only ever called on armed pictures)
      var vzOnce = function (els, share, fn) {
        if (!els.length) return;
        var io = new IntersectionObserver(function (es) {
          es.forEach(function (e) { if (e.isIntersecting) { io.unobserve(e.target); fn(e.target); } });
        }, { threshold: share, rootMargin: '0px 0px -8% 0px' });
        els.forEach(function (el) { io.observe(el); });
      };
      // a share of a scale as a CSS percentage
      var pc = function (x) { return (x * 100).toFixed(3) + '%'; };
      // where v sits on a logarithmic scale from v0 to v1, clamped to 0..1
      var logAt = function (v, v0, v1) {
        return Math.max(0, Math.min(1, (Math.log(v) - Math.log(v0)) / (Math.log(v1) - Math.log(v0))));
      };

      /* The three pictures below are placed and armed when the browser is
         idle, out of the hero's entrance: they are below the first screen
         on arrival, and a picture already on screen by then is drawn at
         once (vzArm). Their boxes are read together first, then written. */
      idle(function () {
       try {
      vzPainted = true;
      vzRect = typeof Map === 'function' ? new Map() : null;
      if (vzRect) [].forEach.call(document.querySelectorAll('#apercu .ptl, .t-weeks, #estimator .esc'), function (el) { vzRect.set(el, el.getBoundingClientRect()); });

      /* -- the Aperçu's path: you describe, we reply within 24 working
         hours, five working days, the call, you decide. Its words are the
         page's only statement of the path, so they are never held back:
         only the marks (the markers, the five days, the line between them)
         draw in. The amount paid at the decision is the one figure in it;
         it follows the currency switch like every price on the page. The
         list can be taller than a phone screen, so it plays once a quarter
         of it is on screen (a share it can always reach). */
      (function () {
        var tl = document.querySelector('#apercu .ptl');
        if (!tl) return;
        var zero = document.querySelector('#apercu .ptl-zero');
        var paint = function () {
          if (!zero || !zero.firstChild) return;
          zero.firstChild.nodeValue = pre(CUR) + '0' + (post(CUR) ? ' ' : '');
          var c = zero.querySelector('.cur');
          if (c) c.textContent = post(CUR);
        };
        document.addEventListener('numidea:cur', paint);
        document.addEventListener('numidea:lang', paint);
        paint();
        if (vzArm(tl, function () { tl.classList.add('vz-go'); })) {
          vzOnce([tl], 0.25, function (el) { el.classList.add('vz-go'); });
        }
      })();

      /* -- tiers: each tier's delivery window, shortest to longest, on one
         ruler shared by the three cards (0 to the longest tier's top, 16
         weeks), its ends labelled, so the windows compare at a glance. The
         line of text above stays the statement. */
      (function () {
        var cards = [].slice.call(document.querySelectorAll('.tier')).map(function (card) {
          var r = card.querySelector('.t-range[data-tier]'), w = card.querySelector('.t-weeks');
          var m = r && PRICE_MODEL[r.getAttribute('data-tier')];
          return m && w ? { w: w, m: m } : null;
        }).filter(Boolean);
        if (!cards.length) return;
        var n = Math.max.apply(null, cards.map(function (c) { return c.m.weeks[1]; }));
        var armed = [];
        // the ruler's far end, "16 semaines" / "16 weeks" / "16 أسبوعاً"
        var ends = function () {
          var far = n + '\u00a0' + unit('price.weeks', n);
          cards.forEach(function (c) { var e = c.w.querySelector('.t-wk-n span:last-child'); if (e) e.textContent = far; });
        };
        cards.forEach(function (c) {
          var b = c.w.querySelector('.t-wk b');
          c.w.style.setProperty('--wn', n);
          b.style.insetInlineStart = pc(c.m.weeks[0] / n);
          b.style.inlineSize = pc((c.m.weeks[1] - c.m.weeks[0]) / n);
        });
        ends();
        document.addEventListener('numidea:lang', ends);
        cards.forEach(function (c) {
          c.w.classList.add('vz-on');
          if (vzArm(c.w, function () { c.w.classList.add('vz-go'); })) armed.push(c.w);
        });
        vzOnce(armed, 0.9, function (el) { el.classList.add('vz-go'); });
      })();

      /* -- estimator: the live estimate as a dimension line over the three
         packages' price bands, on a logarithmic scale that holds every quote
         the estimator can give (worked out from PRICE_MODEL below: today
         90 000 to 2 700 000 DA, drawn from 72 000 to 2 970 000). It moves
         with the controls (transform transitions). The band of the package
         the chosen type belongs to is picked out — Studio's for a Vitrine the
         estimator quotes as Studio. The figures above are the statement and
         the status line. */
      (function () {
        var box = document.querySelector('#estimator .esc');
        if (!box || !est) return;
        /* The extremes: every type at its smallest size with nothing added,
           and at its largest with every option and the rush pace (a quote
           only grows with size, options and pace). */
        // every option this page's estimator offers (the model holds more: the Studio's own)
        var all = [].map.call(document.querySelectorAll('#estimator input[data-opt]'), function (c) { return c.getAttribute('data-opt'); }), qLo = Infinity, qHi = 0;
        Object.keys(PRICE_MODEL).forEach(function (k) {
          var m = PRICE_MODEL[k];
          if (m.fam) return;   // a family this page's estimator does not list (the Studio's money services)
          qLo = Math.min(qLo, ESTIMATE.quote(k, m.min, [], false).lo);
          qHi = Math.max(qHi, ESTIMATE.quote(k, m.max, all, true).hi);
        });
        var V0 = qLo / 1.25, V1 = qHi * 1.1;
        var at = function (v) { return logAt(v, V0, V1); };
        var bar = box.querySelector('.esc-bar'), caps = box.querySelectorAll('.esc-cap');
        var bands = [].slice.call(box.querySelectorAll('.esc-band'));
        var names = [].slice.call(box.querySelectorAll('.esc-nm [data-tier]'));
        var span = {};
        bands.forEach(function (b) {
          var k = b.getAttribute('data-tier'), m = PRICE_MODEL[k];
          span[k] = [at(m.base[0]), at(m.base[1])];
          b.style.insetInlineStart = pc(span[k][0]);
          b.style.inlineSize = pc(span[k][1] - span[k][0]);
        });
        names.forEach(function (el) {
          var s = span[el.getAttribute('data-tier')];
          if (s) el.style.insetInlineStart = pc((s[0] + s[1]) / 2);
        });
        // held back, the line is a point at the estimate's middle; shown, it opens out
        var shown = true;
        var size = document.getElementById('est-size');
        var place = function () {
          var r = est.querySelector('input[name="est-type"]:checked');
          var key = r ? r.value : 'surmesure', m = PRICE_MODEL[key];
          var n = parseInt(size && size.value, 10) || m.def;
          var opts = [].map.call(est.querySelectorAll('input[data-opt]:checked'), function (c) { return c.getAttribute('data-opt'); });
          var pace = est.querySelector('input[name="est-pace"]:checked');
          var q = ESTIMATE.quote(key, n, opts, !!(pace && pace.value === 'rush'));
          var a = at(q.lo), z = at(q.hi), s = vzRtl() ? -1 : 1;
          if (!shown) a = z = (a + z) / 2;
          // a translate in % is a share of the element's own width, which is the track's
          bar.style.transform = 'translateX(' + (s * a * 100).toFixed(3) + '%) scaleX(' + Math.max(z - a, 0.002).toFixed(4) + ')';
          caps[0].style.transform = 'translateX(' + (s * a * 100).toFixed(3) + '%)';
          caps[1].style.transform = 'translateX(' + (s * z * 100).toFixed(3) + '%)';
          var tier = key === 'vitrine' && q.studio ? 'surmesure' : key;
          bands.forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-tier') === tier); });
          names.forEach(function (el) { el.classList.toggle('on', el.getAttribute('data-tier') === tier); });
        };
        var go = function () { shown = true; box.classList.add('vz-go'); place(); };
        shown = !vzArm(box, go);
        est.addEventListener('change', place);
        if (size) size.addEventListener('input', place);
        // Arabic mirrors the scale, and with it the sign of the move
        document.addEventListener('numidea:lang', place);
        place();
        box.classList.add('vz-on');
        if (!shown) vzOnce([box], 0.9, go);
      })();

      vzRect = null;
       } catch (e1) { if (window.console && console.error) console.error(e1); }
      });

      /* -- market: every range in the table as a bar on one logarithmic price
         scale (from 40 000 to 10 000 000 DA, widened if a figure ever falls
         outside; a € or $ range sits where it converts to at the official
         rate, FX), Numidea first and in the accent, the three markets in one
         neutral, and Numidea's range carried down through each group as a
         band: the point is where Numidea sits among them, for every kind of
         project. The bars never move with the currency (converting
         multiplies by a constant, which on a log scale only slides the
         labels); the gridlines and their labels do.
         It is built the first time the visitor opens the folded panel that
         holds it ("Comment on chiffre"): most visitors never do, so the
         page load pays nothing for it. The summary's click comes before the
         panel opens, so the chart is there in the first frame of the open
         panel; 'toggle' covers a panel opened another way (find in page),
         and an arrival on a fragment inside the panel builds it at once.
         MARKET and nlRange are declared in section 14 below, so even an
         open panel waits until the handler is done. */
      var drawMarket = function () {
        try {
          var fig = mkt && mkt.querySelector('.mkv'), plot = fig && fig.querySelector('.mkv-plot');
          if (!plot || !MARKET || typeof nlRange !== 'function') return;
          var TY = { vitrine: 'price.tyVitrine', surmesure: 'price.tyCustom', ecommerce: 'price.tyShop', app: 'price.tyApp', identite: 'price.tyBrand' };
          var LANES = [['nl', 'mk.colNl'], ['dz', 'mk.colDz'], ['fr', 'mk.colFr'], ['us', 'mk.colUs']];
          var rangeOf = function (row, lane) { return lane === 'nl' ? nlRange(row) : MARKET[row][lane]; };
          /* An open range ("+", no ceiling) is solid up to its stated top,
             like any other, then fades out over the next half of its value
             (top x OPEN): the fade says "and up", and eats nothing of the
             range the table states. */
          var V0 = 40000, V1 = 10000000, OPEN = 1.5;
          Object.keys(TY).forEach(function (row) {
            if (!MARKET[row]) return;
            LANES.forEach(function (ln) {
              var r = rangeOf(row, ln[0]), f = FX[NATIVE[ln[0]]];
              V0 = Math.min(V0, r[0] * f / 1.2);
              // an open range ("+") fades out past its top: room for the fade
              V1 = Math.max(V1, r[1] * f * (r[2] ? OPEN : 1.1));
            });
          });
          var at = function (dzd) { return logAt(dzd, V0, V1); };
          var el = function (tag, cls, key) {
            var e = document.createElement(tag);
            if (cls) e.className = cls;
            if (key) { e.setAttribute('data-i18n', key); e.textContent = t(key); }
            return e;
          };
          // the scale's labels, above the first group and again under the last
          var axes = ['', ' bot'].map(function (pos) {
            var ax = el('div', 'mkv-ax' + pos), u = el('span', 'mkv-unit'), tk = el('span', 'mkv-tk');
            ax.appendChild(u); ax.appendChild(tk);
            return { ax: ax, unit: u, tk: tk };
          });
          plot.appendChild(axes[0].ax);
          var grids = [], vals = [], lanes = [];
          Object.keys(TY).forEach(function (row, g) {
            if (!MARKET[row]) return;
            var box = el('div', 'mkv-g'), head = el('div', 'mkv-hd'), gl = el('span', 'mkv-gl');
            var nv = el('span', 'mkv-nv'), nr = nlRange(row);
            head.appendChild(el('span', 'mkv-ty', TY[row]));
            head.appendChild(nv);
            box.appendChild(head);
            box.appendChild(gl);
            // Numidea's range, carried down through the group's lanes
            var nb = el('b', 'mkv-nb');
            nb.style.insetInlineStart = pc(at(nr[0]));
            nb.style.inlineSize = pc(at(nr[1]) - at(nr[0]));
            grids.push({ gl: gl, nb: nb });
            LANES.forEach(function (ln, i) {
              var nl = ln[0] === 'nl', r = rangeOf(row, ln[0]);
              var from = NATIVE[ln[0]], lo = at(r[0] * FX[from]), hi = at(r[1] * FX[from]);
              var lane = el('div', 'mkv-ln' + (nl ? ' nl' : ''));
              var trk = el('span', 'mkv-trk'), bar = el('i', 'mkv-bar' + (r[2] ? ' open' : ''));
              lane.style.gridRow = String(i + 2);
              lane.appendChild(el('span', 'mkv-lab', ln[1]));
              bar.style.insetInlineStart = pc(lo);
              if (r[2]) {
                var tail = at(r[1] * FX[from] * OPEN);
                bar.style.inlineSize = pc(tail - lo);
                bar.style.setProperty('--solid', ((hi - lo) / (tail - lo) * 100).toFixed(2) + '%');
              } else bar.style.inlineSize = pc(Math.max(hi - lo, 0.008));
              bar.style.setProperty('--d', Q((2 * g + i) * BEAT / 16) + 'ms');   // an eighth a group, a sixteenth a lane
              trk.appendChild(bar);
              lane.appendChild(trk);
              box.appendChild(lane);
              lanes.push(lane);
              vals.push({ r: r, from: from, row: row, lane: ln[1], head: nl ? nv : null, bar: bar });
            });
            plot.appendChild(box);
          });
          plot.appendChild(axes[1].ax);
          /* Tick labels in the chart's currency: 1, 2 and 5 times a power of
             ten, shortened the way each language shortens them (100 k with a
             no-break space, 100k, 100 ألف; the Arabic dual stands without
             its numeral). */
          var KM = [[1e6, 'mk.M'], [1e3, 'mk.k']];
          var label = function (v) {
            var lang = document.documentElement.getAttribute('lang') || DEFAULT_LANG;
            for (var i = 0; i < KM.length; i++) {
              if (v < KM[i][0]) continue;
              var n = v / KM[i][0], k = KM[i][1];
              if (lang === 'ar') return dual(n) ? unit(k, n) : n + ' ' + unit(k, n);
              return n + (lang === 'en' ? '' : ' ') + t(k);
            }
            return grp(v);
          };
          // the table's currency choice, or the page's when it shows each market's own
          var chartCur = function () {
            var sel = mkt.querySelector('input[name="mk-cur"]:checked');
            return sel && sel.value !== 'native' ? sel.value : CUR;
          };
          var text = function (o, c) {
            var lo = o.r[0], hi = o.r[1], ap = '';
            if (c !== o.from) { lo = tidy(lo * FX[o.from] / FX[c], c); hi = tidy(hi * FX[o.from] / FX[c], c); ap = '≈\u00a0'; }
            // a range is one unit, never split over two lines: no-break spaces throughout
            return ap + pre(c) + grp(lo) + dash() + grp(hi) + (o.r[2] ? '+' : '') + (post(c) ? ' ' + post(c) : '');
          };
          var render = function () {
            var c = chartCur(), ticks = [];
            for (var e = 1; e <= 8; e++) [1, 2, 5].forEach(function (m) {
              var v = m * Math.pow(10, e), p = (Math.log(v * FX[c]) - Math.log(V0)) / (Math.log(V1) - Math.log(V0));
              if (p > 0.015 && p < 0.985) ticks.push({ v: v, p: p, major: m === 1 });
            });
            // a minor label at the end of the scale (past 93%) with a major
            // within 6% of it printed over that major on a phone: dropped
            ticks = ticks.filter(function (tk) {
              return tk.major || tk.p <= 0.93 || !ticks.some(function (o) { return o.major && Math.abs(o.p - tk.p) < 0.06; });
            });
            /* The unit is written once per axis, in its heading cell before
               the ticks (styles.css lays it out; it used to sit at the end
               of the row, over the last label on a phone). The first and
               the last label are marked, so the ends can be pinned inside
               the plot. */
            axes.forEach(function (a) {
              a.unit.textContent = sym(c);
              a.tk.textContent = '';
              ticks.forEach(function (tk, i) {
                var s = el('span', tk.major ? 'mj' : 'mn');
                if (i === 0) s.classList.add('first');
                if (i === ticks.length - 1) s.classList.add('last');
                s.textContent = label(tk.v);
                s.style.insetInlineStart = pc(tk.p);
                a.tk.appendChild(s);
              });
            });
            grids.forEach(function (g) {
              g.gl.textContent = '';
              ticks.forEach(function (tk) {
                var s = el('i', tk.major ? 'mj' : 'mn');
                s.style.insetInlineStart = pc(tk.p);
                g.gl.appendChild(s);
              });
              g.gl.appendChild(g.nb);
            });
            // Numidea's own range is written out in each group's heading; the
            // markets' are one hover away, and all of them are in the table
            vals.forEach(function (o) { if (o.head) o.head.textContent = text(o, c); });
          };
          /* Hover (a mouse only; touch and keyboard read the table): the
             lane's range in its own currency and, converted, in the chart's.
             One floating label, pinned on its inline-start side and moved
             with a transform, so it never shifts the layout. */
          var tip = el('div', 'mkv-tip');
          plot.appendChild(tip);
          var show = function (i) {
            var o = vals[i], c = chartCur();
            tip.textContent = '';
            tip.appendChild(el('b', '')).textContent = t(TY[o.row]) + ' · ' + t(o.lane);
            tip.appendChild(el('span', '')).textContent = text(o, o.from);
            if (c !== o.from) tip.appendChild(el('span', '')).textContent = text(o, c);
            /* Centred over the bar, kept inside the plot: where its left edge
               should be, less where it already is. The label is pinned on its
               inline-start side (the plot's right edge in Arabic) so a new
               width never moves its start corner; offsetLeft reads that pinned
               place in either direction, untouched by the transform. */
            var pr = plot.getBoundingClientRect(), br = o.bar.getBoundingClientRect();
            var w = tip.offsetWidth, x = br.left + br.width / 2 - pr.left - w / 2;
            x = Math.max(0, Math.min(pr.width - w, x)) - tip.offsetLeft;
            tip.style.transform = 'translate(' + Math.round(x) + 'px,' + Math.round(br.top - pr.top - tip.offsetHeight - 10) + 'px)';
            lanes.forEach(function (ln, k) { ln.classList.toggle('hl', k === i); });
            plot.classList.add('hov');
            tip.classList.add('on');
          };
          var hide = function () {
            tip.classList.remove('on');
            plot.classList.remove('hov');
            lanes.forEach(function (ln) { ln.classList.remove('hl'); });
          };
          lanes.forEach(function (ln, i) {
            ln.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') show(i); });
          });
          plot.addEventListener('pointerleave', hide);
          document.addEventListener('numidea:cur', render);
          document.addEventListener('numidea:lang', function () { hide(); render(); });
          mkt.addEventListener('change', function () { hide(); render(); });
          render();
          fig.hidden = false;
          if (vzArm(fig, function () { fig.classList.add('vz-go'); })) {
            vzOnce([plot], 0.15, function () { fig.classList.add('vz-go'); });
          }
        } catch (e2) { if (window.console && console.error) console.error(e2); }
      };
      Promise.resolve().then(function () {
        var fig = mkt && mkt.querySelector('.mkv'), shut = fig && fig.closest('details');
        if (!fig) return;
        /* The chart is 700-1000px tall and goes in above the table. Built in
           a panel that is already open on screen, it would push the table
           (and whatever the browser just scrolled to in it) down by that
           much: the table is held where it was. */
        var keep = function () {
          var below = mkt.querySelector('.mk-scroll'), t0 = below ? below.getBoundingClientRect().top : 0;
          drawMarket();
          var d = below ? below.getBoundingClientRect().top - t0 : 0;
          if (d > 0 && t0 < innerHeight) window.scrollBy({ top: d, behavior: 'instant' });
        };
        if (!shut || shut.open) { keep(); return; }
        /* Arriving on a fragment inside the folded panel (#mk-cap, or a
           #:~:text= link from a search result): the browser opens the panel
           itself and fixes where it will scroll at load, which can come
           before 'toggle' reaches this script; the chart, built then, landed
           between the start and the target and left the target a chart's
           height below the screen. So it is built now, before load. The text
           directive is not in location.hash; the navigation entry keeps it. */
        var arrival = '', tgt = null;
        try { arrival = performance.getEntriesByType('navigation')[0].name || ''; } catch (e3) {}
        try { tgt = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1))); } catch (e4) {}
        if ((tgt && shut.contains(tgt)) || arrival.indexOf(':~:') > -1) { drawMarket(); return; }
        // a summary click comes before the panel opens: the chart is simply
        // there in its first frame; any other opening (find in page) holds
        // the table in place
        var done = false;
        var once = function (ev) { if (!done) { done = true; if (ev && ev.type === 'toggle') keep(); else drawMarket(); } };
        var sum = shut.querySelector('summary');
        if (sum) sum.addEventListener('click', once);
        shut.addEventListener('toggle', once);
      });
    } catch (e) { if (window.console && console.error) console.error(e); }

    /* ---------------- 14 · market comparison ----------------
       Native figures live in the markup, so the table reads correctly with JS
       off. This converts them on request and computes the Numidea column from
       PRICE_MODEL — the table cannot quote a Numidea price the tier cards and
       the estimator disagree with.
       FX: Bank of Algeria official rate, 10 November 2026 (1 € = 152.37,
       1 $ = 136.13, as the Algerian press printed the bank's table). Rounded,
       because the comparison is about orders of magnitude, not centimes. */
    var MARKET = {   // [low, high, openEnded] — freelance confirmé low → agency high
      vitrine:   { dz: [50000, 100000],   fr: [1500, 6000],     us: [1500, 12000] },
      surmesure: { dz: [180000, 400000],  fr: [6000, 10000, 1], us: [6000, 20000] },
      ecommerce: { dz: [150000, 1000000], fr: [2000, 20000],    us: [5000, 30000] },
      app:       { dz: [200000, 2000000], fr: [10000, 50000],   us: [20000, 60000, 1] },
      identite:  { dz: [80000, 150000],   fr: [1200, 5000, 1],  us: [500, 30000] }
    };
    var NATIVE = { dz: 'DZD', nl: 'DZD', fr: 'EUR', us: 'USD' };
    var mkt = document.getElementById('market');
    if (mkt) {
      var nlRange = function (key) {
        var m = PRICE_MODEL[key], over = Math.max(0, m.def - m.base_u);
        return [m.base[0] + over * m.unit[0], m.base[1] + over * m.unit[1]];
      };
      var fill = function (td, range, from, to) {
        var lo = range[0], hi = range[1], approx = '';
        if (to !== from) {
          lo = tidy(lo * FX[from] / FX[to], to); hi = tidy(hi * FX[from] / FX[to], to);
          approx = '≈ ';
        }
        td.textContent = '';
        td.appendChild(document.createTextNode(approx + pre(to) + grp(lo) + dash() + grp(hi) + (range[2] ? '+' : '') + (post(to) ? ' ' : '')));
        var c = document.createElement('span'); c.className = 'cur'; c.textContent = post(to);
        td.appendChild(c);
      };
      var renderMarket = function () {
        var sel = mkt.querySelector('input[name="mk-cur"]:checked');
        var want = sel ? sel.value : 'native';
        mkt.querySelectorAll('tbody tr[data-row]').forEach(function (tr) {
          var key = tr.getAttribute('data-row');
          tr.querySelectorAll('td[data-mk]').forEach(function (td) {
            var col = td.getAttribute('data-mk'), from = NATIVE[col];
            fill(td, col === 'nl' ? nlRange(key) : MARKET[key][col], from, want === 'native' ? from : want);
          });
        });
        var day = document.getElementById('mk-day-dz');
        // the French day rate, written as the page's language writes euros
        var dayEur = document.getElementById('mk-day-eur');
        if (dayEur) dayEur.textContent = pre('EUR') + grp(480) + dash() + grp(650) + (post('EUR') ? ' ' + post('EUR') : '');
        if (day) day.textContent = grp(tidy(480 * FX.EUR, 'DZD')) + dash() + grp(tidy(650 * FX.EUR, 'DZD')) + ' ' + t('price.cur');
      };
      // a visitor who chose € or $ for the prices sees the comparison in it too
      // and back: a switch to DA undoes what this set (the table and the
      // chart, which reads the same radio, would otherwise stay in € or $
      // under DA prices); a currency the visitor picked in the table stays.
      // Setting .checked from script fires no 'change', so the flag holds.
      var followed = false;
      var follow = function () {
        var r;
        if (CUR === 'DZD') {
          if (!followed) return;
          r = mkt.querySelector('input[name="mk-cur"][value="native"]');
          if (r) r.checked = true;
          followed = false;
          return;
        }
        r = mkt.querySelector('input[name="mk-cur"][value="' + CUR + '"]');
        if (r) { r.checked = true; followed = true; }
      };
      follow();
      document.addEventListener('numidea:cur', function () { follow(); renderMarket(); });
      mkt.addEventListener('change', function (e) {
        if (e.target && e.target.name === 'mk-cur') followed = false;
        renderMarket();
      });
      document.addEventListener('numidea:lang', renderMarket);
      renderMarket();
    }

    /* ---------- 15. illustrations and animated icons ----------
       Plates (.lz) only fetch their mask images once they come within 300px
       of the viewport — about 1MB of engraving would otherwise load with the
       first paint. It was 900px: on a phone that is a screen and more of
       lead, and the masks of sections a visitor never reached were fetched
       behind the first screen's own files. Icons (.ai) draw themselves in once, the
       first time they are seen, and run their idle loop (.live) only while
       on screen, so off-screen icons cost nothing. */
    (function () {
      var lz = [].slice.call(document.querySelectorAll('.lz'));
      var ai = [].slice.call(document.querySelectorAll('.ai'));
      if (!('IntersectionObserver' in window)) {
        lz.forEach(function (el) { el.classList.add('lz-on'); });
        ai.forEach(function (el) { el.classList.add('on', 'live'); });
        [].forEach.call(document.querySelectorAll('.lv'), function (el) { el.classList.add('live'); });
        return;
      }
      var lio = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('lz-on'); lio.unobserve(e.target); }
        });
      }, { rootMargin: '300px 0px' });
      /* the landscape plate under the offer is 227 KB of masks on a phone, and
         it sits one screen under the first: it is asked for when it enters
         the screen, not 300px before (its 104px box is kept, so nothing moves) */
      var vio = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('lz-on'); vio.unobserve(e.target); }
        });
      }, { rootMargin: '0px' });
      var phoneMq = window.matchMedia('(max-width: 720px)');
      lz.forEach(function (el) { (phoneMq.matches && el.classList.contains('vista') ? vio : lio).observe(el); });
      var aio = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) e.target.classList.add('on');
          e.target.classList.toggle('live', e.isIntersecting);
        });
      }, { threshold: 0.35 });
      ai.forEach(function (el) { aio.observe(el); });
      // plates with motion (.lv) likewise only move while they are on screen
      var vio = new IntersectionObserver(function (es) {
        es.forEach(function (e) { e.target.classList.toggle('live', e.isIntersecting); });
      }, { threshold: 0.15 });
      [].forEach.call(document.querySelectorAll('.lv'), function (el) { vio.observe(el); });
    })();


    /* ---------- 16. skeletons, wayfinding, back to top ---------- */
    // Skeleton: a picture's box shimmers until the picture has decoded. Only
    // images not yet complete get one, so cached loads never flash it.
    // The shimmer runs only while its box is on screen (.sk-run) and stops
    // for good once the picture is in. It used to animate a background,
    // which the compositor cannot take over, so every running copy cost a
    // style recalculation and a repaint per frame: traced on a phone (CPU
    // 4x), ~1,900 recalcs in fourteen swipes, nearly all for boxes off
    // screen whose 8 cycles had started with the page. It moves by
    // transform and clip now (styles.css), and still only on screen.
    var skio = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        e.target.classList.toggle('sk-run', e.isIntersecting && !e.target.classList.contains('sk-done'));
        /* 2026-11-27: a lazy capture whose box is on screen is asked for now.
           From 721px its unroll held it fully clipped until it loaded, and
           Chromium does not fetch a lazy image it cannot see: Alliance,
           AlmaFlow and Nomara stayed white frames at 1440 (the hold is gone
           from styles.css too; this keeps any clip from starving the fetch). */
        if (e.isIntersecting) { var i = e.target.querySelector('img.shot'); if (i && i.loading === 'lazy') i.loading = 'eager'; }
      });
    }) : null;
    [].forEach.call(document.querySelectorAll('.proj .thumb img.shot'), function (img) {
      var box = img.closest('.thumb'); if (!box || (img.complete && img.naturalWidth)) return;
      box.classList.add('sk');
      if (skio) skio.observe(box); else box.classList.add('sk-run');
      var done = function () {
        box.classList.add('sk-done'); box.classList.remove('sk-run'); if (skio) skio.unobserve(box);
        // the cover fades in 250 (styles.css), then leaves with its clip
        setTimeout(function () { box.classList.add('sk-gone'); }, M(3));
      };
      img.addEventListener('load', done, { once: true }); img.addEventListener('error', done, { once: true });
    });

    // Scroll-spy: the nav marks the section you are in (aria-current), and on
    // phones — where the links are folded into the menu — a breadcrumb names it.
    (function () {
      var links = [].slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));
      var crumb = document.getElementById('crumb'), now = document.getElementById('crumbNow');
      var secs = links.map(function (a) { return document.querySelector(a.getAttribute('href')); });
      /* On the price guide the nav's links lead to the home page, so the
         spy has no section of its own there: the guide's blocks (the tiers,
         the estimator, the comparison: main [id]) are followed for the
         language switch alone, which keeps the visitor's place (langAt). */
      var own = links.length > 0;
      if (!own) secs = [].slice.call(document.querySelectorAll('main.tarifs :is(section,div,details)[id]'));
      /* The guide's jump row (.t-jump) is its own nav: the part being read
         is marked there (aria-current), its links' targets followed apart
         from the blocks above, since a target may be a heading (#pricing-tiers). */
      var jump = own ? [] : [].slice.call(document.querySelectorAll('.t-jump a[href^="#"]'));
      var jsecs = jump.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); });
      /* the row stuck under the navbar is marked (.stuck): tarifs/style.css
         gives it its full-width backing then, and none in the flow. Stuck,
         its top sits on the navbar's foot, one pixel inside the observed
         root's cut, so it is no longer whole there. */
      var jrow = document.querySelector('#pricing>.t-jump');
      if (jrow && 'IntersectionObserver' in window) {
        var navH = (document.querySelector('.navbar') || { offsetHeight: 73 }).offsetHeight;
        new IntersectionObserver(function (es) {
          es.forEach(function (e) { jrow.classList.toggle('stuck', e.intersectionRatio < 1 && e.boundingClientRect.top <= navH + 1); });
        }, { rootMargin: '-' + (navH + 1) + 'px 0px 0px 0px', threshold: [1] }).observe(jrow);
      }
      var jtops = [], jcur = -1;
      /* A link may point into another link's section ("Méthode" lands on the
         Aperçu card, the path's one telling, inside Services): that link is
         current only while its own box is being read, and after it the
         section around it is current again. */
      var inner = secs.map(function (el) {
        return !!el && secs.some(function (o) { return o && o !== el && o.contains(el); });
      });
      var cur = -1, tops = [], ends = [];
      // section tops are measured once (and on resize/reflow), never per
      // scroll frame: the scroll handler only compares numbers
      var measure = function () {
        var y = window.scrollY || window.pageYOffset || 0;
        var boxes = secs.map(function (el) { return el ? el.getBoundingClientRect() : null; });
        tops = boxes.map(function (r) { return r ? r.top + y : Infinity; });
        ends = boxes.map(function (r, k) { return r && inner[k] ? r.bottom + y : Infinity; });
        jtops = jsecs.map(function (el) { return el ? el.getBoundingClientRect().top + y : Infinity; });
      };
      // runs in a frame after the parallax has written its translates, so it
      // reads the cached position: reading scrollY here forced a style recalc
      var pick = function () {
        var line = scrollPos + viewH * 0.35, i = -1, j = -1;
        for (var q = 0; q < jtops.length; q++) { if (jtops[q] <= line) j = q; }
        if (j !== jcur) {
          jcur = j;
          jump.forEach(function (a, k) { if (k === j) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
        }
        for (var k = 0; k < tops.length; k++) { if (tops[k] <= line && ends[k] > line) i = k; }
        // the order of the links is the order of the page, so the last section
        // whose top has passed the reading line is the one being read
        if (i === cur) return; cur = i;
        // the language switch follows the section being read
        langAt(i >= 0 && secs[i] ? secs[i].id : '');
        if (!own) return;
        links.forEach(function (a, k) { if (k === i) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
        if (crumb && now) {
          var said = i >= 0 ? links[i].textContent : '';
          crumb.classList.toggle('on', i >= 0);
          /* a new section's name crossfades in (167 out, 250 in) rather
             than flipping in one frame; with reduced motion it is written */
          if (reduceMotion || !now.animate || !now.textContent || !said) now.textContent = said;
          else {
            var out = now.animate([{ opacity: 1 }, { opacity: 0 }], { duration: M(2), easing: EASE_EXIT });
            out.onfinish = function () { now.textContent = said; now.animate([{ opacity: 0 }, { opacity: 1 }], { duration: M(3), easing: EASE_ENTER }); };
          }
        }
      };
      var tick = false;
      addEventListener('scroll', function () { if (tick) return; tick = true; requestAnimationFrame(function () { pick(); tick = false; }); }, { passive: true });
      var re = function () { scrollPos = window.scrollY || window.pageYOffset || 0; measure(); cur = -2; jcur = -2; pick(); };
      document.addEventListener('numidea:lang', function () { setTimeout(re, M(1)); });
      addEventListener('resize', re); addEventListener('load', re);
      if ('ResizeObserver' in window) new ResizeObserver(re).observe(document.body);
      // the sections are measured once the first screen is up, not inside the start's task (the observer above reports at once anyway)
      idle(re);
    })();

    // Back to top: appears after a screen and a half of reading.
    (function () {
      var b = document.getElementById('toTop'); if (!b) return;
      var on = false;
      addEventListener('scroll', function () {
        var v = scrollPos > viewH * 1.5;
        if (v !== on) { on = v; b.classList.toggle('on', v); }
      }, { passive: true });
      b.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
        var logo = document.querySelector('.navbar .logo'); if (logo) logo.focus({ preventScroll: true });
      });
    })();

    // The market table's frame is a keyboard stop (tabindex=0 in the markup,
    // so it can be scrolled from the keyboard) only while it actually
    // scrolls: where the whole table fits, it would be a Tab for nothing.
    (function () {
      var box = document.querySelector('.mk-scroll');
      if (!box || !('ResizeObserver' in window)) return;
      var fit = function () {
        if (!box.clientWidth) return;            // folded away: decide when shown
        if (box.scrollWidth > box.clientWidth + 1) box.setAttribute('tabindex', '0');
        else box.removeAttribute('tabindex');
      };
      var ro = new ResizeObserver(fit);
      ro.observe(box);
      if (box.firstElementChild) ro.observe(box.firstElementChild);
    })();

    /* Back/Forward can bring this page back from the browser's cache exactly
       as it was left, after the visitor chose another theme or currency on
       another page. Take up the stored choice again, as a fresh load would.
       Not the language: this page is one language, and Back means this
       page; the choice made elsewhere waits for the next visit to the root. */
    window.addEventListener('pageshow', function (e) {
      // A plain Back (no cache) restores form controls after this script
      // ran: the currency radio could come back unchecked from what the
      // prices show. The prices are right; put the radio back in step.
      document.querySelectorAll('input[name="pr-cur"]').forEach(function (r) { r.checked = r.value === CUR; });
      if (!e.persisted) return;
      var th = null, c = null;
      try {
        th = localStorage.getItem('numidea-theme');
        c = localStorage.getItem('numidea-cur');
      } catch (x) {}
      if (THEMES.indexOf(th) > -1 && th !== document.documentElement.getAttribute('data-theme')) applyTheme(th);
      if (CURS.indexOf(c) > -1 && c !== CUR) setCur(c);
    });

    /* ---------- seal stamp (Night Shift Poster) ----------
       Page changes are the stylesheets' own now: a cross-document view
       transition lifts the leaving page off over the arriving one
       (styles.css, "the page change"), and assets/carry.js fetches the next
       page while the visitor reaches for its link. The script's paper wipe
       (a cream sheet that held the click for 400 ms before the request)
       is gone, so the two can never double up. */
    (function () {
      /* the red seal on the estimator's result: stamped again once the visitor
         stops moving the controls (the result then holds still) */
      var estBox = document.getElementById('estimator');
      var seal = estBox && estBox.querySelector('.seal');
      if (seal) {
        var sealTimer = 0;
        var stamp = function () {
          seal.classList.remove('stamped');
          void seal.offsetWidth;
          seal.classList.add('stamped');
        };
        var arm = function () { clearTimeout(sealTimer); sealTimer = setTimeout(stamp, M(6)); };
        estBox.addEventListener('input', arm);
        estBox.addEventListener('change', arm);
      }
    })();

     } catch (e) { stuck(e); }
    }, 0);
   } catch (e) { stuck(e); }
  });
  // Never let an init error leave content stuck behind scroll-reveal.
  function stuck(e) {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
    document.querySelectorAll('.lz').forEach(function (el) { el.classList.add('lz-on'); });
    document.querySelectorAll('.ai').forEach(function (el) { el.classList.add('on'); });
    if (window.console && console.error) console.error(e);
  }
})();
