#!/usr/bin/env node
/**
 * The price guide — `node scripts/build-tarifs.mjs` writes tarifs/index.html
 * (French) and, through bakeLang, en/tarifs/ and ar/tarifs/ (`--check`
 * exits 1 when a page differs; part of `npm run build`, after build-lang,
 * which may rewrite index.html).
 *
 * The page exists so that the studio's prices have an address of their own
 * (no studio publishes prices for "prix site web Algérie": the CMO audit of
 * 2026-10-31, decision 13) and so that the home page stops carrying what
 * most visitors never opened: the market comparison and the pricing models
 * (about 17 KB gzip and 9 outbound links behind two folded panels) moved
 * here on 2026-10-31. What the two pages share is written once:
 *   - the tiers (the currency switch, the three cards, the maintenance
 *     line) and the estimator are read from index.html between its SLOT
 *     markers, so the home and the guide cannot quote different figures
 *     (check.mjs 8c reads both against PRICE_MODEL); the estimator is open
 *     here, where the page is about prices, and folded on the home;
 *   - the chrome (the navbar, the menu, the footer, the phone bar, the
 *     hero's WhatsApp button) is the home page's, with its links turned
 *     towards the home (chrome() below): a change to the home's markup
 *     reaches this page at the next build;
 *   - the FAQ entries about money (FAQ_ON_TARIFS) are copied from the
 *     home's FAQ, answers and icons included;
 *   - the theme boot script is the home's, with its French-only block
 *     replaced: a stored language preference goes to this page's version in
 *     that language (there was never a ?lang= address here, so the
 *     canonical is static).
 * The market comparison and the pricing models (MARKET below) are this
 * generator's own markup now: their text is the dictionaries' mk.* and
 * md.* keys, their figures are the static JS-off values app.js §14 converts
 * (BRAND.md, "Market comparison"). The three pages are one language each,
 * like the home's (build-lang.mjs: head, hreflang set, static canonical,
 * paths, CSP), with their own title, description and share texts
 * (tarifs.* keys) and a BreadcrumbList. The estimator's "Obtenir le prix
 * ferme" leads to the home page's form; app.js carries the scope across in
 * sessionStorage.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { pathToFileURL } from 'node:url';
import { ROOT, BASE, LANGS } from './site.mjs';
import { loadDicts, toMarkup, esc, I18N_FILES } from './lib/i18n.mjs';
import { bakeLang } from './build-lang.mjs';
import { TARIFS_LANG, versions } from './build-sitemap.mjs';
import { scripts, withCsp } from './lib/csp.mjs';

export const TARIFS_PAGES = Object.fromEntries(Object.entries(TARIFS_LANG).map(([p, l]) => [l, p]));
const NAME = { fr: 'French', en: 'English', ar: 'Arabic' };
// the home's FAQ entries copied here: the ones about money. Fleet 2's
// payment (faq3) and ownership/hosting (faq7) entries join them once they exist.
const FAQ_ON_TARIFS = ['faq2', 'faq4'];

const read = (p) => readFileSync(join(ROOT, p), 'utf8');
const stamp = (html) => (html.match(/\?v=(\d+)/) || [, '1'])[1];

/* exactly one occurrence of `needle` in index.html, at its index */
function one(html, needle, what) {
  const at = html.indexOf(needle), again = at < 0 ? -1 : html.indexOf(needle, at + 1);
  if (at < 0 || again > -1) throw new Error(`index.html: ${what} found ${at < 0 ? 0 : 'more than one'} time(s) (want one)`);
  return at;
}
/* the element whose start tag begins at `start`, closing tag included; the
   tag is matched by depth, so a menu holding other divs is one element */
function outer(html, start, tag) {
  const re = new RegExp(`<(/?)${tag}\\b[^>]*>`, 'gi');
  re.lastIndex = start;
  let depth = 0, m;
  while ((m = re.exec(html))) {
    if (m[1]) { if (--depth === 0) return html.slice(start, m.index + m[0].length); }
    else if (!m[0].endsWith('/>')) depth++;
  }
  throw new Error(`index.html: the <${tag}> at ${start} is never closed`);
}
const element = (html, opening, tag) => outer(html, one(html, opening, opening), tag);
/* the markup between <!-- SLOT:name --> and <!-- /SLOT:name -->, once,
   without the line breaks around the markers (the closing one's indentation
   would be a line of white space) */
function slot(html, name) {
  const m = [...html.matchAll(new RegExp(`<!-- SLOT:${name} -->([\\s\\S]*?)<!-- /SLOT:${name} -->`, 'g'))];
  if (m.length !== 1) throw new Error(`index.html must hold <!-- SLOT:${name} --> … <!-- /SLOT:${name} --> exactly once (found ${m.length})`);
  return m[0][1].replace(/^\r?\n/, '').replace(/\r?\n[ \t]*$/, '');
}
/* one FAQ entry of the home page, by its key, at this page's indentation
   (its lines lose the home's, where the entry sits two levels deeper) */
function faqItem(html, key, indent) {
  const q = one(html, `data-i18n="${key}.q"`, `the FAQ entry ${key}`);
  const start = html.lastIndexOf('<details class="faq-item', q);
  const end = html.indexOf('</details>', q);
  if (start < 0 || end < 0) throw new Error(`index.html: the FAQ entry ${key} is not a <details class="faq-item">`);
  const had = start - html.lastIndexOf('\n', start) - 1;
  return html.slice(start, end + '</details>'.length).split('\n').map((l, i) => indent + (i ? l.slice(had) : l)).join('\n');
}
/* `s` with every match of `re` replaced, at least `min` of them */
function swap(s, re, to, min, what) {
  const n = (s.match(re) || []).length;
  if (n < min) throw new Error(`index.html: ${what} found ${n} time(s) (want ${min} at least)`);
  return s.replace(re, to);
}
const ids = (html) => new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));

/* The home page's chrome as this page carries it: the logo leads home,
   "Tarifs" is this page (aria-current), the language switch's links are
   this page's three, and the home's own link to this page goes (it would
   point at itself). The other #section links are turned towards the home
   page once the page is baked (homeLinks). The paths are root-relative, as
   in index.html: bakeLang moves them for each page. */
function chrome(s, { logo = 0, pricing = 0, guide = 0, lang = 0 } = {}) {
  s = swap(s, /(\sclass="logo") href="#top"/g, '$1 href="./"', logo, 'the logo link');
  s = swap(s, /href="#pricing"( data-i18n="nav\.pricing")/g, 'href="tarifs/"$1 aria-current="page"', pricing, 'the Tarifs link');
  s = swap(s, /[ \t]*<a href="tarifs\/" data-i18n="tarifs\.navLink">[^<]*<\/a>\r?\n/g, '', guide, 'the link to the price guide');
  for (const l of LANGS) s = swap(s, new RegExp(`href="${l === 'fr' ? '\\./' : l + '/'}" hreflang="${l}"`, 'g'), `href="${versions('index.html')[l].replace(/index\.html$/, '')}tarifs/" hreflang="${l}"`, lang, `the ${l} switch link`);
  return s;
}
/* a #fragment link to a section this page has not got lands on the home
   page's: the chrome's section links, the estimator's #contact, the FAQ
   answers' "l'Aperçu". Every version of this page sits one folder under
   its language's home page, so the path is the same in the three. */
function homeLinks(page, home) {
  const own = ids(page), theirs = ids(home);
  return page.replace(/\bhref="#([^"]+)"/g, (m, id) => (own.has(id) || !theirs.has(id) ? m : `href="../#${id}"`));
}

/* the home's theme boot script, with its French-only block (the shared
   ?lang= link and stored preference sent to the language's page, the
   scripted canonical) replaced by this page's: the stored preference alone */
function boot(home) {
  const s = scripts(home).find((x) => x.executable && x.text.includes("BAKED = 'fr'"));
  if (!s) throw new Error("index.html: no head script with BAKED = 'fr'");
  const block = `    /* LANG:fr-only — the French page alone (build-lang.mjs leaves this block
       out of en/tarifs/ and ar/tarifs/). A preference stored by a language
       switch names another language: go to this page's version in it now,
       before the stylesheets, with the rest of the address kept. The home
       page also honours a shared language link in its address; this page
       never had one, so its canonical is static (check.mjs 6). */
    var LANGS = ['fr', 'en', 'ar'], want = null;
    try { want = localStorage.getItem('numidea-lang'); } catch (e) {}
    if (want && want !== BAKED && LANGS.indexOf(want) !== -1) {
      location.replace('../' + want + '/tarifs/' + location.search + location.hash);
      return;
    }
    /* /LANG:fr-only */
`;
  const re = /[ \t]*\/\* LANG:fr-only[\s\S]*?\/\* \/LANG:fr-only \*\/\r?\n/;
  if (!re.test(s.text)) throw new Error('index.html: the head script has no LANG:fr-only block');
  return s.text.replace(re, block);
}

/* The market comparison and the pricing models, moved off the home page on
   2026-10-31. Each cell runs from the low end of an experienced freelancer's
   range to the high end of an agency's, per the sources listed below. Static
   values are the native currency, so the table reads correctly with JS off;
   app.js (section 14) converts on request and computes the Numidea column
   from PRICE_MODEL. The price-more and pm-body wrappers are the home's
   folded panel's: styles.css draws the table's phone layout through them. */
const MARKET = `    <details class="capabilities price-more" open>
      <summary>
        <span data-i18n="price.moreSum">Comment on chiffre</span>
        <span class="hint" data-i18n="price.moreHint">Le marché, les modèles de facturation, ce qui fait bouger un devis.</span>
        <span class="chev" aria-hidden="true">›</span>
      </summary>
      <div class="pm-body">
      <!-- ---------------- market comparison ----------------
           Each cell runs from the low end of an experienced freelancer's range
           to the high end of an agency's, per the sources listed below. Static
           values are the native currency, so the table reads correctly with
           JS off; app.js (section 14) converts on request and computes the
           Numidea column from PRICE_MODEL. -->
      <div class="market" id="market">
        <div class="mk-head">
          <svg class="ai ai-corner" viewBox="0 0 24 24" aria-hidden="true"><path class="p" pathLength="1" d="M12 4v16.5M8 20.5h8"/><g class="a-tilt" style="--o:12px 6px"><path class="p" pathLength="1" d="M4.5 6h15M4.5 6 2.5 12h4ZM19.5 6l-2 6h4Z"/></g></svg>
          <h3 data-i18n="mk.h">Algérie, France, États-Unis : un projet, trois marchés</h3>
          <p data-i18n="mk.p">Le même projet, chiffré sur trois marchés. Fourchettes courantes 2026, du freelance confirmé à l'agence — hors taxes.</p>
        </div>

        <fieldset class="mk-cur est-field">
          <legend data-i18n="mk.curL">Afficher en</legend>
          <div class="est-chips">
            <label class="echip"><input type="radio" name="mk-cur" value="native" checked><span data-i18n="mk.curNative">Devise d'origine</span></label>
            <label class="echip"><input type="radio" name="mk-cur" value="DZD"><span data-i18n="price.cur">DA</span></label>
            <label class="echip"><input type="radio" name="mk-cur" value="EUR"><span>€</span></label>
            <label class="echip"><input type="radio" name="mk-cur" value="USD"><span>$</span></label>
          </div>
        </fieldset>

        <!-- The table, drawn: each range as a bar on one price scale, so the
             gap between the markets reads before any figure does. Built by
             app.js 13b from MARKET and PRICE_MODEL (the same numbers as the
             table, which stays the exact and accessible version, so the
             picture and its reading note are aria-hidden); hidden until
             then, so it never shows half-built or with scripts off. -->
        <figure class="mkv" aria-hidden="true" hidden>
          <div class="mkv-plot"></div>
          <figcaption class="mkv-cap" data-i18n="mk.vizCap">Échelle logarithmique : chaque grande graduation vaut dix fois la précédente. Entre les deux lignes en tirets, la fourchette de Numidea, prolongée sur les trois marchés ; une barre qui s'estompe n'a pas de plafond. Montants convertis au taux officiel, chiffres exacts dans le tableau ci-dessous.</figcaption>
        </figure>

        <section class="mk-scroll" tabindex="0" aria-labelledby="mk-cap">
          <table class="mk-table">
            <caption id="mk-cap" data-i18n="mk.cap">Fourchettes de prix courantes par type de projet</caption>
            <thead>
              <tr>
                <th scope="col" data-i18n="mk.colType">Projet</th>
                <th scope="col" class="mk-nl" data-i18n="mk.colNl">Numidea</th>
                <th scope="col" data-i18n="mk.colDz">Algérie</th>
                <th scope="col" data-i18n="mk.colFr">France</th>
                <th scope="col" data-i18n="mk.colUs">États-Unis</th>
              </tr>
            </thead>
            <tbody>
              <tr data-row="vitrine"><th scope="row" data-i18n="price.tyVitrine">Vitrine</th>
                <td data-l="@@mk.colNl@@" data-mk="nl" class="mk-nl">90 000 –⁠ 160 000 <span class="cur">DA</span></td><td data-l="@@mk.colDz@@" data-mk="dz">50 000 –⁠ 100 000 <span class="cur">DA</span></td><td data-l="@@mk.colFr@@" data-mk="fr">1 500 –⁠ 6 000 <span class="cur">€</span></td><td data-l="@@mk.colUs@@" data-mk="us">1 500 –⁠ 12 000 <span class="cur">$</span></td></tr>
              <tr data-row="surmesure"><th scope="row" data-i18n="price.tyCustom">Site sur mesure</th>
                <td data-l="@@mk.colNl@@" data-mk="nl" class="mk-nl">180 000 –⁠ 420 000 <span class="cur">DA</span></td><td data-l="@@mk.colDz@@" data-mk="dz">180 000 –⁠ 400 000 <span class="cur">DA</span></td><td data-l="@@mk.colFr@@" data-mk="fr">6 000 –⁠ 10 000+ <span class="cur">€</span></td><td data-l="@@mk.colUs@@" data-mk="us">6 000 –⁠ 20 000 <span class="cur">$</span></td></tr>
              <tr data-row="ecommerce"><th scope="row" data-i18n="price.tyShop">E-commerce</th>
                <td data-l="@@mk.colNl@@" data-mk="nl" class="mk-nl">220 000 –⁠ 550 000 <span class="cur">DA</span></td><td data-l="@@mk.colDz@@" data-mk="dz">150 000 –⁠ 1 000 000 <span class="cur">DA</span></td><td data-l="@@mk.colFr@@" data-mk="fr">2 000 –⁠ 20 000 <span class="cur">€</span></td><td data-l="@@mk.colUs@@" data-mk="us">5 000 –⁠ 30 000 <span class="cur">$</span></td></tr>
              <tr data-row="app"><th scope="row" data-i18n="price.tyApp">Application web</th>
                <td data-l="@@mk.colNl@@" data-mk="nl" class="mk-nl">450 000 –⁠ 1 200 000 <span class="cur">DA</span></td><td data-l="@@mk.colDz@@" data-mk="dz">200 000 –⁠ 2 000 000 <span class="cur">DA</span></td><td data-l="@@mk.colFr@@" data-mk="fr">10 000 –⁠ 50 000 <span class="cur">€</span></td><td data-l="@@mk.colUs@@" data-mk="us">20 000 –⁠ 60 000+ <span class="cur">$</span></td></tr>
              <tr data-row="identite"><th scope="row" data-i18n="price.tyBrand">Identité visuelle</th>
                <td data-l="@@mk.colNl@@" data-mk="nl" class="mk-nl">90 000 –⁠ 180 000 <span class="cur">DA</span></td><td data-l="@@mk.colDz@@" data-mk="dz">80 000 –⁠ 150 000 <span class="cur">DA</span></td><td data-l="@@mk.colFr@@" data-mk="fr">1 200 –⁠ 5 000+ <span class="cur">€</span></td><td data-l="@@mk.colUs@@" data-mk="us">500 –⁠ 30 000 <span class="cur">$</span></td></tr>
            </tbody>
          </table>
        </section>

        <p class="mk-day">
          <span data-i18n="mk.day1">Une journée de développeur confirmé en France coûte</span>
          <b class="mk-num" id="mk-day-eur">480 –⁠ 650 €</b> ≈ <b class="mk-num" id="mk-day-dz">70 000 –⁠ 100 000 DA</b>
          <span data-i18n="mk.day2">au taux officiel, soit à peu près le prix d'un site vitrine complet sur le marché algérien.</span>
        </p>
        <p class="mk-note" data-i18n="mk.note">Conversions au taux officiel de la Banque d'Algérie, début octobre 2026 : 1 € ≈ 151 DA, 1 $ ≈ 134 DA. L'écart tient au coût de la vie et au change, pas aux outils — nous livrons avec les mêmes outils que les studios européens et américains : React, Next.js, Vercel.</p>

        <details class="mk-src">
          <summary data-i18n="mk.srcSum">Sources et méthode</summary>
          <p data-i18n="mk.method">Chaque case va du bas de la fourchette d'un freelance confirmé au haut de celle d'une agence ; « + » signale une borne haute ouverte. Les extrêmes — sites à 300 € ou à 250 000 $ — sont exclus. La colonne Numidea est calculée par l'estimateur ci-dessus, au périmètre type de chaque projet.</p>
          <ul>
            <li><b data-i18n="mk.srcDz">Algérie</b> — <a href="https://barometre.onyxlab.dz/" target="_blank" rel="noopener" lang="fr">Onyxlab, Baromètre des tarifs freelance 2026</a> <span data-i18n="mk.srcRange">(Confirmé → Agence)</span></li>
            <li><b data-i18n="mk.srcFr">France</b> — <a href="https://www.tandem-studio.fr/prix-creation-site-internet/" target="_blank" rel="noopener" lang="fr">Tandem Studio, prix création site 2026</a> · <a href="https://lescreavores.fr/prix-creation-site-internet/" target="_blank" rel="noopener" lang="fr">Les Créavores, baromètre de 103 prix (juin 2026)</a> · <a href="https://www.heysimon.fr/articles/prix-logo-identite-visuelle-2026" target="_blank" rel="noopener" lang="fr">HeySimon, identité visuelle 2026</a> · <a href="https://lefreelance.fr/articles/tjm-developpeur-freelance/" target="_blank" rel="noopener" lang="fr">TJM d'après Malt (LeFreelance)</a></li>
            <li><b data-i18n="mk.srcUs">États-Unis</b> — <a href="https://pitchsite.io/guides/web-design-pricing" target="_blank" rel="noopener" lang="en">Pitchsite, Web Design Pricing Guide 2026</a> · <a href="https://8gnc.io/blog/how-much-does-branding-cost" target="_blank" rel="noopener" lang="en">8GNC, branding cost 2026</a> · <a href="https://clutch.co/web-developers/pricing" target="_blank" rel="noopener" lang="en">Clutch, web development pricing (Sept. 2026)</a></li>
            <li><b data-i18n="mk.srcFx">Change</b> — <a href="https://www.bank-of-algeria.dz/taux-de-change-journalier/" target="_blank" rel="noopener" lang="fr">Banque d'Algérie, taux de change journalier</a></li>
          </ul>
        </details>
      </div>

      <!-- ---------------- pricing models ---------------- -->
      <div class="models" id="models">
        <div class="mk-head">
          <h3 data-i18n="md.h">Comment un projet est chiffré</h3>
          <p data-i18n="md.p">Il y a quatre façons de facturer un projet. Chacune est la norme quelque part.</p>
        </div>
        <div class="md-grid">
          <article class="md-card md-ours">
            <span class="md-tag" data-i18n="md.ours">Notre modèle</span>
            <svg class="ai ai-corner" viewBox="0 0 24 24" aria-hidden="true"><path class="p" pathLength="1" d="M7.5 10V7.5a4.5 4.5 0 0 1 9 0V10"/><rect class="p" pathLength="1" x="5" y="10" width="14" height="10.5" rx="1.6"/><path class="p a-bob" pathLength="1" d="M12 13.8v3"/></svg><h4 data-i18n="md.fH">Au forfait</h4>
            <p data-i18n="md.fP">Un prix fixe pour un périmètre écrit. Si le travail déborde, c'est le prestataire qui absorbe l'écart.</p>
            <p class="md-where" data-i18n="md.fW">La norme en Algérie : le baromètre Onyxlab chiffre tout le développement au forfait. C'est ainsi que nous chiffrons chaque projet.</p>
          </article>
          <article class="md-card">
            <svg class="ai ai-corner" viewBox="0 0 24 24" aria-hidden="true"><circle class="p" pathLength="1" cx="12" cy="12" r="8.5"/><path class="p a-hand" style="--o:12px 12px;--t:2.4s" pathLength="1" d="M12 12V6.8"/><path class="p a-hand" style="--o:12px 12px;--t:28.8s" pathLength="1" d="M12 12h3.4"/></svg><h4 data-i18n="md.tH">Au temps passé</h4>
            <p data-i18n="md.tP">Facturé au jour ou à l'heure. Souple quand le périmètre bouge, difficile à budgéter d'avance.</p>
            <p class="md-where" data-i18n="md.tW">La norme en France (480 –⁠ 650 € par jour pour un développeur confirmé) et aux États-Unis (100 –⁠ 149 $ de l'heure en agence).</p>
          </article>
          <article class="md-card md-ours">
            <span class="md-tag" data-i18n="md.ours">Notre modèle</span>
            <svg class="ai ai-corner" viewBox="0 0 24 24" aria-hidden="true"><g class="a-spin" style="--t:7s"><path class="p" pathLength="1" d="M19.5 12a7.5 7.5 0 0 1-12.8 5.3M4.5 12a7.5 7.5 0 0 1 12.8-5.3"/><path class="p" pathLength="1" d="M17.3 3.4v3.3H14M6.7 20.6v-3.3H10"/></g></svg><h4 data-i18n="md.aH">À l'abonnement</h4>
            <p data-i18n="md.aP">Un montant mensuel pour un service continu : maintenance, évolutions, contenu.</p>
            <p class="md-where" data-i18n="md.aW">Courant partout après le lancement. C'est le modèle de notre maintenance : 18 000 –⁠ 60 000 DA par mois.</p>
          </article>
          <article class="md-card">
            <svg class="ai ai-corner" viewBox="0 0 24 24" aria-hidden="true"><path class="p" pathLength="1" d="M6 4h12l3.5 5L12 20.5 2.5 9Z"/><path class="p" pathLength="1" d="M2.5 9h19M9.5 4 8 9l4 11.5L16 9l-1.5-5"/><path class="a-twinkle" d="M20.6 1.4v2.6M19.3 2.7h2.6"/></svg><h4 data-i18n="md.vH">À la valeur</h4>
            <p data-i18n="md.vP">Le prix suit ce que le projet rapporte, pas le temps qu'il demande.</p>
            <p class="md-where" data-i18n="md.vW">Plus rare, surtout en conseil et en stratégie, là où l'enjeu se mesure.</p>
          </article>
        </div>

        <h4 class="md-sub" data-i18n="md.drH">Ce qui fait bouger un devis</h4>
        <ul class="md-drivers">
          <li><b data-i18n="md.d1h">Le périmètre</b><span data-i18n="md.d1p">Le nombre de pages, de produits ou d'écrans.</span></li>
          <li><b data-i18n="md.d2h">Le design</b><span data-i18n="md.d2p">Entièrement sur mesure, ou à partir de votre charte et de vos maquettes existantes.</span></li>
          <li><b data-i18n="md.d3h">Les langues</b><span data-i18n="md.d3p">Chaque langue ajoute du contenu ; l'arabe ajoute une mise en page de droite à gauche.</span></li>
          <li><b data-i18n="md.d4h">Les intégrations</b><span data-i18n="md.d4p">Paiement, comptes utilisateurs, outils et API tiers.</span></li>
          <li><b data-i18n="md.d5h">Le contenu</b><span data-i18n="md.d5p">Textes, photos et vidéos : fournis par vous, ou à produire.</span></li>
          <li><b data-i18n="md.d6h">Le délai</b><span data-i18n="md.d6p">Un calendrier compressé coûte plus cher : +25 % dans notre estimateur.</span></li>
        </ul>
      </div>

      </div>
    </details>
`;

/**
 * The page's template in one language, before the bake: the French markup
 * (bakeLang writes the dictionary's text into every data-i18n node and
 * attribute), with root-relative paths like index.html (bakeLang moves them
 * for the page's depth), and this language's BreadcrumbList, the one piece
 * the bake does not write.
 */
export function renderTemplate(lang, home = read('index.html'), dicts = loadDicts()) {
  const fr = dicts.fr, st = stamp(home);
  const u = versions('tarifs/index.html');
  const crumbs = JSON.stringify({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Numidea Labs', item: BASE + u[lang].replace(/tarifs\/index\.html$/, '') },
    { '@type': 'ListItem', position: 2, name: dicts[lang]['nav.pricing'], item: BASE + u[lang].replace(/index\.html$/, '') },
  ] }).replace(/</g, '\\u003c');
  const estimator = swap(slot(home, 'estimator'), /<details class="capabilities price-more price-est">/g, '<details class="capabilities price-more price-est" open>', 1, 'the estimator panel');
  const faq = FAQ_ON_TARIFS.map((k) => faqItem(home, k, '        '));
  // two columns, as the home's FAQ (styles.css .faq-col): the first half, the rest
  const half = Math.ceil(faq.length / 2);
  const faqCols = [faq.slice(0, half), faq.slice(half)].filter((c) => c.length)
    .map((c) => `      <div class="faq-col">\n${c.join('\n\n')}\n      </div>`).join('\n');
  return `<!DOCTYPE html>
<html lang="fr" dir="ltr" data-theme="arcanum">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<title data-i18n="tarifs.title">${toMarkup(fr['tarifs.title'])}</title>
<meta name="description" content="${esc(fr['tarifs.desc'])}" data-i18n-content="tarifs.desc">
<meta name="theme-color" content="#0A1420">
<meta name="author" content="Numidea Labs">

<!-- Open Graph / social — absolute URLs, no scripts run: this page's language.
     Its texts name their own keys (tarifs.*: data-i18n-content; the share card
     is the home page's, with its alt), so bakeLang writes them from each
     dictionary as it writes the page. og:url, og:locale, the canonical and
     the card follow the language (scripts/build-lang.mjs). -->
<meta property="og:type" content="website">
<meta property="og:site_name" content="Numidea Labs">
<meta property="og:url" content="${BASE}tarifs/">
<link rel="alternate" hreflang="fr" href="${BASE}tarifs/">
<link rel="alternate" hreflang="en" href="${BASE}en/tarifs/">
<link rel="alternate" hreflang="ar" href="${BASE}ar/tarifs/">
<link rel="alternate" hreflang="x-default" href="${BASE}tarifs/">
<link rel="canonical" href="${BASE}tarifs/">
<meta property="og:locale" content="fr_FR">
<meta property="og:locale:alternate" content="en_US">
<meta property="og:locale:alternate" content="ar_DZ">
<meta property="og:title" content="${esc(fr['tarifs.title'])}" data-i18n-content="tarifs.title">
<meta property="og:description" content="${esc(fr['tarifs.desc'])}" data-i18n-content="tarifs.desc">
<meta property="og:image" content="${BASE}assets/og.jpg">
<meta property="og:image:alt" content="${esc(fr['meta.ogAlt'])}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(fr['tarifs.title'])}" data-i18n-content="tarifs.title">
<meta name="twitter:description" content="${esc(fr['tarifs.desc'])}" data-i18n-content="tarifs.desc">
<meta name="twitter:image" content="${BASE}assets/og.jpg">
<!-- Where the page sits: the home, then this guide (the visible breadcrumb
     says the same). -->
<script type="application/ld+json" id="ld-crumbs">${crumbs}</script>

<link rel="icon" type="image/svg+xml" href="assets/favicon.svg">
<link rel="apple-touch-icon" href="assets/apple-touch-icon.png">
<!-- Resolve theme and fonts BEFORE first paint: the home page's script
     (index.html says why each line is there), with its French-only block
     replaced by this page's. Generated: the comment above the doctype says
     where to edit. -->
<script>${boot(home)}</script>
<!-- Self-hosted. themes first: theme blocks are :root[data-theme] (0,2,0);
     styles.css only reads them; this page's own rules come last. -->
<link rel="stylesheet" href="assets/fonts.css?v=${st}">
<link rel="stylesheet" href="assets/themes.css?v=${st}">
<link rel="stylesheet" href="assets/styles.css?v=${st}">
<link rel="stylesheet" href="tarifs/style.css?v=${st}">
<noscript><style>
  /* JS disabled: never hide content behind scroll-reveal, draw all glyphs */
  .reveal{opacity:1!important;transform:none!important}
  .glyph svg :is(path,circle,line,polyline,polygon,rect){stroke-dashoffset:0!important}
</style></noscript>
</head>
<body>

<a class="skip" href="#main" data-i18n="ui.skip">${toMarkup(fr['ui.skip'])}</a>
<div class="progress" aria-hidden="true"></div>


<!-- ================= NAV (the home page's: see index.html) ================= -->
${chrome(element(home, '<header class="navbar">', 'header'), { logo: 1, pricing: 1, lang: 1 })}

<!-- mobile overlay menu (the home page's) -->
${chrome(element(home, '<div class="mobile-menu"', 'div'), { pricing: 1, guide: 1, lang: 1 })}


<span id="top"></span>
<main id="main" class="wrap tarifs" tabindex="-1">

  <!-- ================= THE GUIDE ================= -->
  <section id="pricing" aria-labelledby="pricing-h">
    <nav class="crumbs" aria-label="${esc(fr['tarifs.crumbAria'])}" data-i18n-aria="tarifs.crumbAria"><ol>
      <li><a href="./">Numidea Labs</a></li>
      <li aria-current="page" data-i18n="nav.pricing">${toMarkup(fr['nav.pricing'])}</li>
    </ol></nav>
    <!-- the guide's parts, one tap each (it runs twelve phone screens) -->
    <nav class="t-jump" aria-label="${esc(dicts[lang]['nav.pricing'])}">
      <a href="#pricing-tiers" data-i18n="tarifs.jTiers">${toMarkup(fr['tarifs.jTiers'])}</a>
      <a href="#estimator" data-i18n="tarifs.jEst">${toMarkup(fr['tarifs.jEst'])}</a>
      <a href="#market" data-i18n="tarifs.jMk">${toMarkup(fr['tarifs.jMk'])}</a>
      <a href="#models" data-i18n="tarifs.jMd">${toMarkup(fr['tarifs.jMd'])}</a>
      <a href="#faq-t" data-i18n="tarifs.jFaq">${toMarkup(fr['tarifs.jFaq'])}</a>
    </nav>
    <span class="kicker" data-i18n="tarifs.kicker">${toMarkup(fr['tarifs.kicker'])}</span>
    <h1 class="sec font-swap-display" id="pricing-h" data-i18n="tarifs.h1">${toMarkup(fr['tarifs.h1'])}</h1>
    <p class="sec-lead" data-i18n="tarifs.lead">${toMarkup(fr['tarifs.lead'])}</p>
    <p class="tarifs-next tarifs-top">
      <a class="btn btn-primary" href="./#apercu" data-i18n="hero.cta1">${toMarkup(fr['hero.cta1'])}</a>
      ${element(home, '<a class="btn btn-teal wa-link"', 'a').split('\n').map((l, i) => (i ? '    ' + l : l)).join('\n')}
    </p>

    <!-- Numidea's own prices, in dinars: the home page's tiers and estimator,
         read from index.html between its SLOT markers at build time. The
         estimator applies the same numbers the tiers quote — PRICE_MODEL in
         app.js (ESTIMATE) is the single source. -->
    <h2 class="t-sub" id="pricing-tiers" data-i18n="price.title">${toMarkup(fr['price.title'])}</h2>
${slot(home, 'tiers')}

${estimator}

    <!-- Reference material: market comparison, billing models, cost drivers.
         Open: this page is where whoever wants to check the numbers comes. -->
${MARKET.replace(/\n$/, '').replace(/@@([\w.]+)@@/g, (m, k) => esc(dicts[lang][k]))}

    <!-- The home page's FAQ entries about money (scripts/build-tarifs.mjs
         FAQ_ON_TARIFS), answers and icons included. -->
    <h2 class="t-sub" id="faq-t" data-i18n="faq.title">${toMarkup(fr['faq.title'])}</h2>
    <div class="faq-list">
${faqCols}
    </div>

    <!-- the way on: the Aperçu and WhatsApp, as the hero offers them -->
    <p class="tarifs-next">
      <a class="btn btn-primary" href="./#apercu" data-i18n="hero.cta1">${toMarkup(fr['hero.cta1'])}</a>
      ${element(home, '<a class="btn btn-teal wa-link"', 'a').split('\n').map((l, i) => (i ? '    ' + l : l)).join('\n')}
    </p>
  </section>

</main>

${element(home, '<button type="button" class="to-top"', 'button')}

<!-- ================= FOOTER (the home page's) ================= -->
${chrome(element(home, '<footer class="footer wrap">', 'footer'), { logo: 1, pricing: 1, guide: 1, lang: 1 })}

<!-- phones: the two ways to start, kept in reach past the first screen (the
     home page's bar; both lead to the home page's #contact and WhatsApp) -->
${chrome(element(home, '<nav class="m-contact"', 'nav'))}

<!-- this page's dictionary (one language), then the script that reads it;
     both deferred, so they run in this order -->
<script src="${I18N_FILES.fr}?v=${st}" defer></script>
<script src="assets/app.js?v=${st}" defer></script>
<script src="assets/carry.js?v=${st}" defer></script>
</body>
</html>
`;
}

/* the page in one language, as published */
export function renderTarifs(lang, home = read('index.html'), dicts = loadDicts()) {
  if (!TARIFS_PAGES[lang]) throw new Error(`no such language: ${lang}`);
  const depth = TARIFS_PAGES[lang].split('/').length - 1;
  let page = bakeLang(renderTemplate(lang, home, dicts), lang, dicts[lang], { depth, path: TARIFS_PAGES[lang].replace(/index\.html$/, ''), ld: false, generated: null });
  page = homeLinks(page, home);
  page = page.replace(/^<!DOCTYPE html>\n/i, (m) => m + `<!-- Generated: the ${NAME[lang]} price guide, written by scripts/build-tarifs.mjs from its\n     template, index.html (the tiers and the estimator, between the SLOT markers;\n     the chrome) and ${I18N_FILES[lang]}. Do not edit it here: change the generator,\n     index.html or the dictionary, then npm run build. -->\n`);
  return withCsp(page, 'page');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const check = process.argv.includes('--check');
  const home = read('index.html'), dicts = loadDicts();
  let stale = 0;
  for (const l of LANGS) {
    const file = TARIFS_PAGES[l], p = join(ROOT, file);
    const want = renderTarifs(l, home, dicts);
    const have = existsSync(p) ? readFileSync(p, 'utf8') : null;
    if (check) {
      console.log(have === want ? `✓ ${file} equals its generator` : `✗ ${file} differs from scripts/build-tarifs.mjs (run: npm run build)`);
      if (have !== want) stale++;
      continue;
    }
    mkdirSync(dirname(p), { recursive: true });
    if (have !== want) writeFileSync(p, want);
    console.log(`✓ ${file} written (${FAQ_ON_TARIFS.length} FAQ entries, I18N.${l})`);
  }
  if (check) process.exit(stale ? 1 : 0);
}
