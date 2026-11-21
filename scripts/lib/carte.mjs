/**
 * « La carte » (2026-11-21, services/SPEC.md revision 2): the Studio's services catalogue, written into
 * hub/src/page.html's {{carte}} hole by scripts/build-hub.mjs. It replaced the reel (whose clips moved to la
 * fabrique, #mouvement).
 *
 * Nothing here types a price. Every figure is read from assets/app.js: the estimator's own model (PRICE_MODEL,
 * PRICE_OPTS, quote()) for the LIVE services, and DESIGN, the owner's approved figures and lead times of the design
 * services (2026-11-21), for the rest. Each printed figure carries its hook, data-price="<kind>:<what>" with
 * data-lo/data-hi (pm:<type>:<n>:<opts>, opt:<k>, unit:<k>, base:<k>, design:<path>, calc:<rule>, several joined by
 * "|"), which scripts/check.mjs 8c re-reads from the model. The words are hub/src/carte.i18n.json (fr, en, ar, keys
 * carte.*); a line that holds a figure is a template there ({p}, {v}, {n}…) and is written here once per language,
 * with that language's figures (French and Arabic group with a narrow no-break space, English with commas and puts
 * € and $ first, as the console does), into the same key, so the page's ordinary dictionary switch carries it.
 * The market lines ("Ailleurs") quote MARKET_SVC below, each with its numbered source (all fetched 2026-11-21,
 * services/prices.md §2).
 */

import { statSync } from 'node:fs';
import { join } from 'node:path';

const LRI ='⁦', PDI = '⁩';   // a figure inside a sentence reads left to right in every language
const WA = 'https://wa.me/213672412578?text=';

// the sources the market lines cite, in services/prices.md §2's words (publisher, page, date read)
const SRC = {
  HEYS:   ['HeySimon, prix logo & identité visuelle 2026', 'https://www.heysimon.fr/articles/prix-logo-identite-visuelle-2026', 'fr'],
  MPILL:  ['ManyPixels, custom illustration cost 2026', 'https://www.manypixels.co/blog/illustrations/custom-illustration-cost', 'en'],
  DMNK:   ['DesignMonks, UI/UX design cost 2026', 'https://www.designmonks.co/blog/ui-ux-design-cost', 'en'],
  LEFR:   ['LeFreelance.fr, motion designer freelance 2026', 'https://lefreelance.fr/articles/devenir-motion-designer-freelance/', 'fr'],
  MPADS:  ['ManyPixels, 9 best ad design services 2026 (2026-09-09)', 'https://www.manypixels.co/blog/marketing-design/ad-design-services', 'en'],
  DRMAIL: ['Dribbble, Hardik D, Email Newsletter Designs (one freelancer’s listing)', 'https://dribbble.com/hardikd_/services', 'en'],
  ONYX:   ['Onyxlab, baromètre des tarifs freelance en Algérie 2026', 'https://barometre.onyxlab.dz/', 'fr'],
  GEAR:   ['GearLaunch, freelance t-shirt designers (2026-05)', 'https://www.gearlaunch.com/academy/an-easy-guide-to-hiring-the-best-freelance-t-shirt-designers', 'en'],
  WAVE:   ['Waveup, pitch deck cost 2026', 'https://waveup.com/blog/pitch-deck-cost/', 'en'],
  MPINFO: ['ManyPixels, 7 best infographic design services 2026 (2026-06)', 'https://www.manypixels.co/blog/illustrations/infographic-design-services', 'en'],
  DSUX:   ['Design Studio UI/UX, UX audit cost 2026', 'https://www.designstudiouiux.com/blog/ux-audit-cost/', 'en'],
};
export const CARTE_HOSTS = [...new Set(Object.values(SRC).map(([, u]) => new URL(u).host))];
// what the same work costs elsewhere: [low, high, currency] and its source (services/prices.md §2, read 2026-11-21)
const MARKET_SVC = {
  logo: [[600, 2500, 'EUR'], 'HEYS'], identite: [[1200, 4500, 'EUR'], 'HEYS'], charte: [[900, 2500, 'EUR'], 'HEYS'],
  mascotte: [[250, 800, 'USD'], 'MPILL'], landing: [[300, 1000, 'USD'], 'DMNK'], ui: [[2500, 8000, 'USD'], 'DMNK'],
  app: [[6000, 25000, 'USD'], 'DMNK'], social: [[1500, 4000, 'EUR'], 'LEFR'], ads: [[50, 500, 'USD'], 'MPADS'],
  motion: [[600, 1500, 'EUR'], 'LEFR'], email: [[1800, 3000, 'USD'], 'DRMAIL'], pack: [[50000, 50000, 'DZD'], 'ONYX'],
  papeterie: [[150, 500, 'EUR'], 'HEYS'], stick: [[100, 400, 'USD'], 'GEAR'], deck: [[1500, 5000, 'USD'], 'WAVE'],
  info: [[50, 149, 'USD'], 'MPINFO'], audit: [[3000, 6000, 'USD'], 'DSUX'], mois: [[990, 990, 'EUR'], 'HEYS'],
};
const GROUPS = ['marque', 'web', 'reseaux', 'print', 'pitch'];
const SEAL = { marque: '印', web: '築', reseaux: '動', print: '品', pitch: '知' };

export function carte({ ESTIMATE, PRICES, DICT, LANGS, fail, esc, attr, HUB }) {
  const DESIGN = ESTIMATE.DESIGN, PM = ESTIMATE.PRICE_MODEL, PO = ESTIMATE.PRICE_OPTS, MID = ESTIMATE.MID_RANGE, FX = PRICES.fx;
  if (!DESIGN) { fail('assets/app.js: ESTIMATE.DESIGN (the carte\'s approved figures) not found'); return { html: '' }; }
  const dget = (p) => p.split('.').reduce((o, k) => (o == null ? undefined : o[k]), DESIGN);
  /* ---- figures, each with its hook ---- */
  const fig = (lo, hi, src) => ({ lo, hi, src });
  const Q = (k, n, o = []) => { const r = ESTIMATE.quote(k, n, o, false); return { ...fig(r.lo, r.hi, `pm:${k}:${n}:${o.join('+')}`), w: [r.wLo, r.wHi] }; };
  const OPT = (k) => ({ ...fig(PO[k].add[0], PO[k].add[1], `opt:${k}`), w: PO[k].weeks });
  const BASE = (k) => fig(PM[k].base[0], PM[k].base[1], `base:${k}`);
  const D = (p) => { const v = dget(p); if (v == null) { fail(`carte: DESIGN.${p} is not in assets/app.js`); return fig(0, 0, `design:${p}`); } const [lo, hi] = Array.isArray(v) ? v : [v, v]; return fig(lo, hi, `design:${p}`); };
  const CALC = {
    'identite-minus-signature': () => PM.identite.base[0] - DESIGN.logo.signature,
    'mois-saving': () => 3 * DESIGN.mois.mois - DESIGN.mois.trimestre,
  };
  const C = (k) => { const d = CALC[k](); return fig(d, d, `calc:${k}`); };
  const idt2 = Q('identite', 2), idt5 = Q('identite', 5), idtDs = Q('identite', 2, ['ds']);
  const mot5 = Q('motion', 5), mot30 = Q('motion', 30), vit5 = Q('vitrine', 5);
  const DS = OPT('ds'), ANIM = OPT('anim');
  const T = (f, more = {}) => ({ ...f, ...more });
  // a lead time: weeks or days from the model or DESIGN ([low, high], with the path it was read from), or "ask"
  const W = (w, src) => ({ w, src }), Dd = (d, src) => ({ d, src });

  /* ---- the cards (structure only; the words are carte.items.<id>.* ) ---- */
  const CARDS = [
    { id: 'logo', g: 'marque', n: 'A1', tiers: [T(D('logo.essentiel')), T(D('logo.signature'), { lead: 1 })], next: C('identite-minus-signature'),
      lt: W(DESIGN.logo.weeks, 'design:logo.weeks'), cta: 'wa', proof: '#case-bordjsteel', mock: 'logo' },
    { id: 'identite', g: 'marque', n: 'A2', tiers: [T(idt2), T(idt5), T(idtDs, { lead: 1 })], lt: W(idtDs.w, idtDs.src), cta: 'est', est: ['identite', 2], leadPick: 'ds', proof: 'brand/almaflow/', mock: 'identite' },
    { id: 'charte', g: 'marque', n: 'A3', tiers: [T(DS, { lead: 1 })], also: [D('icons.set12')], lt: W(DS.w, DS.src), cta: 'wa', proof: '#case-alliance', mock: 'charte' },
    { id: 'mascotte', g: 'marque', n: 'A4', tiers: [T(D('illu.spot')), T(D('illu.mascotte'), { lead: 1 })], lt: W(DESIGN.illu.weeks, 'design:illu.weeks'), cta: 'wa', proof: 'bible/', proofK: 'carte.kuro', mock: 'mascotte' },
    { id: 'landing', g: 'web', n: 'B1', tiers: [T(D('ui.landing'), { lead: 1 }), T(D('ui.ecranWeb'), { plus: 1 })], rule: 1, lt: W(DESIGN.ui.weeksLanding, 'design:ui.weeksLanding'), cta: 'wa', proof: '#case-alliance', mock: 'landing' },
    { id: 'ui', g: 'web', n: 'B2', tiers: [T(D('ui.site5'), { lead: 1 }), T(D('ui.ecranWeb'), { plus: 1 })], rule: 1, lt: W(DESIGN.ui.weeksSite, 'design:ui.weeksSite'), cta: 'wa', proof: '#case-bordjsteel', mock: 'site5' },
    { id: 'app', g: 'web', n: 'B3', tiers: [T(D('ui.app10'), { lead: 1 }), T(D('ui.ecranApp'), { plus: 1 })], rule: 1, lt: W(DESIGN.ui.weeksApp, 'design:ui.weeksApp'), cta: 'wa', mock: 'app' },
    { id: 'construire', g: 'web', build: true },
    { id: 'social', g: 'reseaux', n: 'C1', tiers: [T(D('social.kit')), T(D('social.anime'), { lead: 1 }), T(D('social.mois'), { month: 1 })], lt: W(DESIGN.social.weeks, 'design:social.weeks'), cta: 'wa', proof: '#case-bordjsteel', mock: 'social' },
    { id: 'ads', g: 'reseaux', n: 'C2', tiers: [T(D('ads.set'), { lead: 1 }), T(D('ads.concept'), { plus: 1 })], lt: Dd(DESIGN.ads.days, 'design:ads.days'), cta: 'wa', proof: '#case-alliance', mock: 'ads' },
    { id: 'motion', g: 'reseaux', n: 'C3', tiers: [T(mot5, { lead: 1 }), T(mot30), T(ANIM, { plus: 1 })], lt: W(mot5.w, mot5.src), cta: 'est', est: ['motion', 5], proof: 'fabrique.html#mouvement', proofK: 'carte.items.motion.proof', mock: 'motion', anchors: ['motion', 'reel'] },
    { id: 'email', g: 'reseaux', n: 'C4', tiers: [T(D('email.master'), { lead: 1 }), T(D('email.layout'), { plus: 1 })], lt: W(DESIGN.email.weeks, 'design:email.weeks'), cta: 'wa', mock: 'email' },
    { id: 'pack', g: 'print', n: 'D1', tiers: [T(D('pack.ref1'), { lead: 1 }), T(D('pack.ref3')), T(D('pack.ref'), { plus: 1 })], note: 1, lt: W(DESIGN.pack.weeks, 'design:pack.weeks'), cta: 'wa', mock: 'pack' },
    { id: 'papeterie', g: 'print', n: 'D2', tiers: [T(D('print.carte')), T(D('print.flyer')), T(D('print.papeterie'), { lead: 1 })], also: [D('print.menu'), D('print.plaquette')], lt: Dd(DESIGN.print.days, 'design:print.days'), cta: 'wa', proof: '#case-alliance', mock: 'print' },
    { id: 'stick', g: 'print', n: 'D3', tiers: [T(D('stick.planche6'), { lead: 1 }), T(D('stick.tshirt'))], lt: W(DESIGN.stick.weeks, 'design:stick.weeks'), cta: 'wa', proof: 'bible/', proofK: 'carte.kuro', mock: 'stick' },
    { id: 'blanche', g: 'print', blanche: true },
    { id: 'deck', g: 'pitch', n: 'E1', tiers: [T(D('deck.slide'), { per: 1 }), T(D('deck.deck12'), { lead: 1 }), T(D('deck.master'))], lt: W(DESIGN.deck.weeks, 'design:deck.weeks'), cta: 'wa', mock: 'deck' },
    { id: 'info', g: 'pitch', n: 'E2', tiers: [T(D('info.one'), { lead: 1 })], lt: W(DESIGN.info.weeks, 'design:info.weeks'), cta: 'wa', mock: 'info' },
    { id: 'audit', g: 'pitch', n: 'E3', tiers: [T(D('audit.express')), T(D('audit.parcours'), { lead: 1 })], rule: 1, lt: W(DESIGN.audit.weeks, 'design:audit.weeks'), cta: 'wa', mock: 'audit' },
    { id: 'mois', g: 'pitch', n: 'E4', tiers: [T(D('mois.mois'), { month: 1, lead: 1 }), T(D('mois.trimestre'))], save: C('mois-saving'), lt: { ask: 1 }, cta: 'wa', mock: 'mois' },
  ];
  const BUILD = { tiers: [T(BASE('vitrine'), { lead: 1 }), T(BASE('surmesure')), T(BASE('ecommerce'))], lt: W(vit5.w, vit5.src) };
  const FORMULES = [
    { id: 'marque', price: D('f_marque.price'), lines: [idtDs, D('social.kit'), D('print.papeterie')], strip: ['img/clients/almaflow/logo.webp', 'img/clients/bordj/p-tower.webp', 'img/clients/alliance/c-egypt-flyer.webp'] },
    { id: 'produit', price: D('f_produit.price'), lines: [D('logo.signature'), D('pack.ref3'), D('social.anime')], strip: ['img/clients/bordj/logo.svg', 'label', 'bible/art/kuro-stamp.webp'] },
  ];
  for (const f of FORMULES) {
    const sLo = f.lines.reduce((s, x) => s + x.lo, 0), sHi = f.lines.reduce((s, x) => s + x.hi, 0);
    if (!(f.price.lo < sLo && f.price.hi < sHi)) fail(`carte: the ${f.id} bundle (${f.price.lo}–${f.price.hi}) is not below its lines' sum (${sLo}–${sHi})`);
    f.sum = { lo: sLo, hi: sHi, src: f.lines.map((x) => x.src).join('+') };
    f.saving = sLo - f.price.lo;
  }
  const services = CARDS.filter((c) => !c.build && !c.blanche);
  if (CALC['identite-minus-signature']() <= 0) fail('carte: the identity no longer costs more than the Signature logo (A1\'s next-step line)');

  /* ---- each language's words, figures written in ---- */
  const tmpl = new Set();   // template keys (read here, then dropped from the dictionaries)
  const get = (l, k) => { const v = DICT[l][k]; if (v == null) { fail(`carte: key ${k} missing in ${l}`); return ''; } return v; };
  const take = (l, k) => { tmpl.add(k); return get(l, k); };
  const set = (k, vals) => { for (const l of LANGS) DICT[l][k] = vals(l); };
  const F = (l) => {
    const en = l === 'en', sp = en ? ',' : ' ';
    const grp = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, sp);
    const dash = en ? '⁠–⁠' : ' –⁠ ';
    const sym = (c) => (c === 'DZD' ? DICT[l]['pricing.cur'] : c === 'EUR' ? '€' : '$');
    const tidy = (n) => { const g = n >= 10000 ? 500 : n >= 1000 ? 100 : 10; return Math.max(g, Math.round(n / g) * g); };
    const pair = (a, b, c) => { const v = a === b ? grp(a) : grp(a) + dash + grp(b); return en && c !== 'DZD' ? sym(c) + v : v + '\u00a0' + sym(c); };   // (the currency never wraps away from its figure)
    const fill = (s, o) => s.replace(/\{(\w+)\}/g, (all, k) => (o[k] != null ? o[k] : all));
    const da = (f) => pair(f.lo, f.hi, 'DZD');
    const iso = (s) => LRI + s.replace(/ /g, '\u00a0') + PDI;   // and in one piece: the line never breaks inside a figure
    return { grp, pair, tidy, fill, da, iso, conv: (n) => `≈ ${pair(tidy(n / FX.EUR), tidy(n / FX.EUR), 'EUR')} · ${pair(tidy(n / FX.USD), tidy(n / FX.USD), 'USD')}` };
  };
  const leadText = (l, lt) => {
    const f = F(l);
    if (lt.ask) return take(l, 'carte.lt.ask');
    if (lt.d) return f.fill(take(l, 'carte.lt.d'), { a: lt.d[0], b: lt.d[1] });
    return lt.w[0] === lt.w[1] ? f.fill(take(l, 'carte.lt.w1'), { a: lt.w[0] }) : f.fill(take(l, 'carte.lt.w'), { a: lt.w[0], b: lt.w[1] });
  };
  const tierFig = (l, x) => { const f = F(l); return (x.plus ? '+ ' : '') + f.da(x) + (x.month ? ' ' + take(l, 'carte.month') : '') + (x.per ? ' ' + take(l, 'carte.perSlide') : ''); };
  const leadOf = (c) => c.tiers.find((x) => x.lead) || c.tiers[0];
  const tagKeys = (k, tier, lt, nameKey) => {
    set(`${k}.tag.l`, (l) => '★ ' + (nameKey ? get(l, nameKey) : '').split(' · ')[0]);
    set(`${k}.tag.f`, (l) => F(l).grp(tier.lo));
    if (tier.lo !== tier.hi || tier.month) set(`${k}.tag.u`, (l) => tier.lo !== tier.hi ? F(l).fill(take(l, 'carte.upTo'), { p: F(l).grp(tier.hi) }) : take(l, 'carte.month'));
    set(`${k}.tag.c`, (l) => F(l).conv(tier.lo));
    set(`${k}.lead`, (l) => leadText(l, lt));
  };
  for (const c of services) {
    const k = `carte.items.${c.id}`, lead = leadOf(c), li = c.tiers.indexOf(lead);
    c.tiers.forEach((x, i) => set(`${k}.t.${i}.fig`, (l) => tierFig(l, x)));
    tagKeys(k, lead, c.lt, `${k}.t.${li}`);
    const [mv, ms] = MARKET_SVC[c.id] || (fail(`carte: no market line for ${c.id}`), [[0, 0, 'EUR'], 'HEYS']);
    c.mkv = mv; c.mks = ms;
    set(`${k}.mk`, (l) => F(l).fill(take(l, 'carte.elsewhere'), { w: F(l).fill(get(l, `${k}.mk`), { v: F(l).iso(F(l).pair(mv[0], mv[1], mv[2])) }) }));
    if (c.next) set(`${k}.next`, (l) => F(l).fill(get(l, `${k}.next`), { p: F(l).iso(F(l).da(c.next)) }));
    if (c.save) set(`${k}.save`, (l) => F(l).fill(get(l, `${k}.save`), { p: F(l).iso(F(l).da(c.save)) }));
    if (c.also) set(`${k}.also`, (l) => F(l).fill(take(l, 'carte.also'), { x: F(l).fill(get(l, `${k}.also`), { p: F(l).iso(F(l).da(c.also[0])), q: c.also[1] ? F(l).iso(F(l).da(c.also[1])) : '' }) }));
    if (c.rule) set(`${k}.rule`, (l) => F(l).fill(take(l, 'carte.credit'), { d: DESIGN.ui.creditDays }));
    set(`${k}.wa`, (l) => F(l).fill(take(l, 'carte.waMsg'), { s: get(l, `${k}.name`) === get(l, `${k}.t.${li}`) ? get(l, `${k}.name`) : `${get(l, `${k}.name`)}, ${get(l, `${k}.t.${li}`)}`, p: tierFig(l, lead) }));
  }
  BUILD.tiers.forEach((x, i) => set(`carte.build.t.${i}.fig`, (l) => `${take(l, 'carte.from')} ${F(l).da(fig(x.lo, x.lo))}`));
  tagKeys('carte.build', BUILD.tiers[0], BUILD.lt, 'carte.build.tagL');
  set('carte.build.tag.l', (l) => get(l, 'carte.build.tagL').split(' · ')[0]);
  tmpl.add('carte.build.tagL');
  set('carte.k', (l) => F(l).fill(get(l, 'carte.k'), { n: services.length }));
  set('carte.src.fx', (l) => F(l).fill(get(l, 'carte.src.fx'), { e: F(l).pair(FX.EUR, FX.EUR, 'DZD'), u: F(l).pair(FX.USD, FX.USD, 'DZD') }));
  set('carte.mock.sldH', (l) => F(l).fill(get(l, 'carte.mock.sldH'), { p: F(l).iso(F(l).da(fig(PM.vitrine.base[0], PM.vitrine.base[0]))) }));
  // the motion card's opening, its size as the file has it
  const stingKb = Math.round(statSync(join(HUB, 'img/studio/reel/sting.mp4')).size / 1000);
  set('carte.playSr', (l) => F(l).fill(get(l, 'carte.playSr'), { kb: stingKb }));
  for (const f of FORMULES) {
    const k = `carte.form.${f.id}`;
    f.lines.forEach((x, i) => set(`${k}.l.${i}.fig`, (l) => F(l).da(x)));
    set(`${k}.sum`, (l) => F(l).da(f.sum));
    set(`${k}.fig`, (l) => F(l).da(f.price));
    set(`${k}.from`, (l) => F(l).grp(f.price.lo));
    set(`${k}.save`, (l) => F(l).fill(take(l, 'carte.form.save'), { p: F(l).iso(F(l).da(fig(f.saving, f.saving))) }));
    set(`${k}.wa`, (l) => F(l).fill(take(l, 'carte.waMsg'), { s: get(l, `${k}.name`), p: `${take(l, 'carte.from')} ${F(l).da(fig(f.price.lo, f.price.lo))}` }));
  }
  tmpl.add('carte.waMsg'); tmpl.add('carte.from');

  /* ---- markup (French is baked by build-hub's fill(): an element with data-i18n is written empty) ---- */
  const hook = (f) => `data-price="${f.src}" data-lo="${f.lo}" data-hi="${f.hi}"`;
  const hooks = (fs) => `data-price="${fs.map((f) => f.src).join('|')}" data-lo="${fs.map((f) => f.lo).join('|')}" data-hi="${fs.map((f) => f.hi).join('|')}"`;
  const t = (k, tag = 'span', a = '') => `<${tag}${a ? ' ' + a : ''} data-i18n="${k}"></${tag}>`;
  const waHref = (k) => attr(WA + encodeURIComponent(DICT.fr[k]));
  const waBtn = (k, cls = 'st-btn st-btn--primary', label = 'carte.wa') => `<a class="${cls}" href="${waHref(k)}" data-carte-wa="${k}" target="_blank" rel="noopener"><span data-i18n="${label}"></span> <span class="st-sr" data-i18n="case.newTab"></span></a>`;
  const img = (src, cls = '', extra = '') => `<img src="${src}" alt="" loading="lazy" decoding="async"${cls ? ` class="${cls}"` : ''}${extra}>`;
  const o = (cls, vars, inner, tag = 'div') => `<${tag} class="o ${cls}" style="${vars}">${inner}</${tag}>`;
  const lap = (vars, inner) => o('lap', vars, `<div class="lap__scr">${inner}</div><div class="lap__base"></div>`);
  const phone = (vars, inner) => o('ph', vars, `<div class="ph__scr">${inner}</div>`);
  const win = (vars, inner) => o('win', vars, `<div class="win__bar"><i></i><i></i><i></i><span class="win__url"></span></div><div class="win__body">${inner}</div>`);
  const lbl = (vars, k, opt) => `<span class="o mlbl${opt ? ' mlbl--opt' : ''}" style="${vars}" data-i18n="${k}"></span>`;
  const P = (x, y, w) => `--x:${x}%;--y:${y}%${w != null ? `;--w:${w}%` : ''}`;
  const BL = 'img/clients/bordj/logo.svg';
  // D1: one label on the printer's dieline (cut line, bleed, crop marks), FR/AR mandatory mentions, drawn in SVG
  const label = () => `<svg class="lbl" viewBox="0 0 320 210" aria-hidden="true" focusable="false">
  <rect x="0" y="0" width="320" height="210" fill="#F3ECE1"/>
  <g stroke="#211E1B" stroke-width="1"><path d="M20 4v10M4 20h10M300 4v10M306 20h10M20 206v-10M4 190h10M300 206v-10M306 190h10"/></g>
  <rect x="20" y="20" width="280" height="170" fill="#E6D9C6"/>
  <rect x="26" y="26" width="268" height="158" fill="#F7F1E7" stroke="#A34135" stroke-width="1.4" stroke-dasharray="5 3"/>
  <rect x="114" y="26" width="92" height="158" fill="#236660"/>
  <circle cx="160" cy="66" r="20" fill="none" stroke="#F3ECE1" stroke-width="2"/>
  <path d="M160 50c-7 7-7 25 0 32c7-7 7-25 0-32z" fill="#F3ECE1"/>
  <text lang="fr" x="160" y="106" text-anchor="middle" font-family="Archivo" font-weight="900" font-size="9.6" fill="#F3ECE1">VOTRE MARQUE</text>
  <text x="160" y="121" text-anchor="middle" font-family="IBM Plex Sans Arabic" font-weight="700" font-size="10" fill="#F3ECE1">علامتك</text>
  <line x1="128" y1="130" x2="192" y2="130" stroke="#F3ECE1" stroke-width="1"/>
  <text lang="fr" x="160" y="143" text-anchor="middle" font-family="Geist" font-weight="700" font-size="7" fill="#F3ECE1">Huile d’olive</text>
  <text lang="fr" x="160" y="152" text-anchor="middle" font-family="Geist" font-weight="700" font-size="7" fill="#F3ECE1">vierge extra</text>
  <text x="160" y="164" text-anchor="middle" font-family="IBM Plex Sans Arabic" font-weight="600" font-size="7.4" fill="#F3ECE1">زيت زيتون بكر ممتاز</text>
  <text x="160" y="177" text-anchor="middle" font-family="Archivo" font-weight="900" font-size="9" fill="#F3ECE1">75 cl</text>
  <g lang="fr" font-family="Geist" font-size="5.9" fill="#211E1B">
    <text x="33" y="42" font-weight="700" font-size="6.4">INGRÉDIENTS</text>
    <text x="33" y="51">100 % olives, 1re</text><text x="33" y="58.5">pression à froid.</text>
    <text x="33" y="71">Volume net : 75 cl</text>
    <text x="33" y="83">À consommer de</text><text x="33" y="90.5">préférence avant :</text><text x="33" y="98">voir bouchon.</text>
    <text x="33" y="109">Lot : voir bouchon.</text>
    <text x="33" y="121">Conserver à l’abri</text><text x="33" y="128.5">de la lumière.</text>
    <text x="33" y="140" font-weight="700">Fabriqué en Algérie</text>
  </g>
  <g lang="ar" font-family="IBM Plex Sans Arabic" font-size="6.2" fill="#211E1B" text-anchor="end">
    <text x="287" y="42" font-weight="700" font-size="6.8">المكوّنات</text>
    <text x="287" y="52">زيتون 100 %،</text><text x="287" y="60">عصرة أولى على البارد.</text>
    <text x="287" y="73">الحجم الصافي: 75 سل</text>
    <text x="287" y="86">يُستهلك قبل:</text><text x="287" y="94">انظر السدادة.</text>
    <text x="287" y="107">الحصة: انظر السدادة.</text>
    <text x="287" y="120">يُحفظ بعيدًا عن الضوء.</text>
    <text x="287" y="134" font-weight="700">صُنع في الجزائر</text>
  </g>
  <g fill="#211E1B">${[0, 2, 3, 5, 8, 9, 11, 13, 14, 17, 19, 20, 22, 25, 26, 28, 30, 31, 33, 35].map((x) => `<rect x="${(33 + x * 1.9).toFixed(1)}" y="150" width="${x % 3 ? 1.1 : 1.8}" height="22"/>`).join('')}</g>
  <text x="33" y="180" font-family="Geist Mono" font-size="5.2" fill="#211E1B">6 130000 000000</text>
  <g font-family="Geist Mono" font-size="5.6" fill="#A34135"><text x="27" y="15" data-i18n="carte.mock.cut"></text><text x="293" y="15" text-anchor="end" data-i18n="carte.mock.bleed"></text></g>
  <text x="300" y="202" text-anchor="end" font-family="Geist Mono" font-size="5.6" fill="#4F4238" data-i18n="carte.mock.tpl"></text>
</svg>`;
  const mock = (c) => {
    switch (c.mock) {
      case 'logo': return `
        <div class="o sh plate" style="${P(6, 8, 50)}">${img(BL, 'crop-bordj')}</div>
        <div class="o appicon" style="${P(63, 9, 17)}">${img(BL, 'crop-bordj')}</div>
        ${lbl(P(63, 34), 'carte.mock.px48')}
        <div class="o tab" style="${P(63, 46, 32)}"><span class="tab__fav">${img(BL, 'crop-bordj')}</span><span class="tab__t" dir="ltr">Bordj Steel</span></div>
        ${lbl(P(63, 59), 'carte.mock.px16')}`;
      case 'identite': {
        // the palette sampled from the AlmaFlowClim logo file (services/SPEC.md §6.2)
        const pal = ['#303048', '#3078D8', '#3090D8', '#30C0F0', '#6048D8'];
        return `
        <div class="o bcard t-a" style="${P(6, 9, 52)}">${img('img/clients/almaflow/logo.webp')}</div>
        <div class="o pal" style="${P(63, 9)}">${pal.map((p) => `<i style="--c:${p}"></i>`).join('')}</div>
        ${lbl(P(63, 21), 'carte.mock.fromLogo', 1)}
        <div class="o bcard bcard--dark t-b" style="${P(38, 38, 50)}"><span class="bcard__l"></span><span class="bcard__l bcard__l--s"></span><span class="bcard__dots">${pal.slice(1, 4).map((p) => `<i style="--c:${p}"></i>`).join('')}</span></div>`;
      }
      case 'charte': return `
        <div class="o sh page page--big" style="${P(4, 5, 92)};--h:70%">${img('img/clients/alliance/charte/0010.webp', '', ' style="--op:18% 0"')}</div>
        ${lbl(P(4, 79), 'carte.mock.page')}`;
      case 'mascotte': return `
        <div class="o sh lineup" style="${P(4, 4, 92)};--h:74%">
          <div class="lineup__h"><span data-i18n="carte.mock.sheet"></span><span data-i18n="carte.mock.poses"></span></div>
          <div class="lineup__row">${['sil-0', 'sil-2', 'sil-3', 'sil-5'].map((k) => img(`bible/art/${k}.webp`)).join('')}</div>
        </div>
        <div class="o" style="${P(5, 66, 22)}">${img('bible/art/kuro-smug.webp', 'die')}</div>`;
      case 'landing': return `
        ${lap(P(24, 6, 68), img('../assets/work/alliance/d1-720.webp'))}
        ${phone(P(6, 14, 20), img('../assets/work/alliance/m1-416.webp'))}`;
      case 'site5': return `
        ${win(P(36, 3, 58), img('../assets/previews/bordjsteel-references-720.webp'))}
        ${win(P(29, 15, 58), img('../assets/work/bordjsteel/d2-720.webp'))}
        ${win(P(22, 27, 58), img('../assets/work/bordjsteel/d1-720.webp'))}
        ${phone(P(5, 9, 20), img('../assets/work/bordjsteel/m1-416.webp'))}`;
      case 'app': return `
        ${lap(P(24, 6, 68), img('../assets/work/workspacehq/d2-720.webp'))}
        ${phone(P(6, 14, 20), img('../assets/work/workspacehq/m1-416.webp'))}`;
      case 'social': {
        const posts = ['tower', 'galva', 'cuves', 'site', 'chaudfroid', 'conception', 'mains', 'resist'];
        const cells = posts.slice(0, 4).map((p) => img(`img/clients/bordj/p-${p}.webp`)).concat([img('img/studio/be/minimal-industrial.webp')]).concat(posts.slice(4).map((p) => img(`img/clients/bordj/p-${p}.webp`)));
        return `
        ${phone(P(6, 9, 21), img('img/clients/bordj/p-tower.webp', 'story'))}
        <div class="o sh feed" style="${P(33, 5, 52)}">
          <div class="feed__h"><span class="feed__av">${img(BL, 'crop-bordj')}</span><span class="feed__n"></span></div>
          <div class="feed__g">${cells.join('')}</div>
        </div>`;
      }
      case 'ads': return `
        ${phone(P(5, 10, 20), img('img/clients/alliance/m-story.webp'))}
        <div class="o pic pic--fr" style="${P(29, 8, 30)}">${img('img/clients/alliance/c-aze-1.webp')}</div>
        <div class="o pic pic--ar" style="${P(63, 8, 30)}">${img('img/clients/alliance/c-aze-3.webp')}</div>
        <span class="o mlbl" style="${P(5, 2)}" dir="ltr">9:16</span>${lbl(P(29, 1), 'carte.mock.fr')}${lbl(P(63, 1), 'carte.mock.arf')}`;
      case 'motion': return `
        <div class="o film" style="${P(6, 6, 88)}">
          <div class="film__frame">${img('img/studio/reel/sting.webp')}<video muted playsinline preload="none" hidden></video>
            <a class="film__play" href="img/studio/reel/sting.mp4" data-play data-i18n-aria="carte.playSr"><span data-i18n="carte.play"></span></a></div>
        </div>
        <div class="o tl" style="${P(6, 79, 40)}" dir="ltr"><span class="tl__bar"><i style="--k:0%"></i><i style="--k:48%"></i><i style="--k:100%"></i></span><span class="tl__t">0 · 1,3 · 2,7 s</span></div>`;
      case 'email': {
        const mail = (cls) => `<div class="mail${cls}"><div class="mail__h" dir="ltr">NUMIDEA <b>LABS</b></div>${img('img/studio/night/skyline-kuro-1320.webp', 'mail__hero')}<span class="mail__t" data-i18n="carte.mock.mailT"></span><span class="mail__p" data-i18n="carte.mock.mailP"></span><span class="mail__b" data-i18n="carte.mock.mailB"></span></div>`;
        return `
        ${win(P(28, 5, 66), `<div class="inbox"><div class="inbox__side"><span data-i18n="carte.mock.inbox"></span><i class="on"></i><i></i><i></i></div>${mail('')}</div>`)}
        ${phone(P(5, 12, 21), mail(' mail--ph'))}`;
      }
      case 'pack': return `
        <div class="o sh dieline" style="${P(4, 5, 92)}">${label()}</div>`;
      case 'print': return `
        <div class="o pic t-b" style="${P(44, 5, 32)}">${img('img/clients/alliance/c-istanbul.webp')}</div>
        <div class="o pic t-a" style="${P(16, 4, 28)}">${img('img/clients/alliance/c-egypt-flyer.webp')}</div>`;
      case 'stick': return `
        <div class="o kraft" style="${P(6, 6, 62)}">${['kuro-stamp', 'kuro-mug', 'kuro-love', 'kuro-smug', 'kuro-judge', 'kuro-loaf'].map((k) => `<span class="kraft__s">${img(`bible/art/${k}.webp`, 'die')}</span>`).join('')}</div>
        <div class="o peel t-b" style="${P(72, 10, 22)}">${img('bible/art/kuro-peek.webp', 'die')}</div>`;
      case 'deck': {
        // a slide charting the studio's own start prices, read from PRICE_MODEL
        const ks = ['vitrine', 'surmesure', 'ecommerce', 'app'], max = Math.max(...ks.map((k) => PM[k].base[0]));
        return `
        <div class="o sh slide slide--cover t-a" style="${P(4, 4, 34)}"><span class="cover__bar"></span><span class="cover__t" dir="ltr">NUMIDEA<br>LABS</span><span class="cover__seal">印</span></div>
        ${lap(P(22, 12, 73), `<div class="sld"><span class="sld__k" data-i18n="carte.mock.sldK"></span><span class="sld__h" ${hook(BASE('vitrine'))} data-i18n="carte.mock.sldH"></span><span class="sld__c" dir="ltr">${ks.map((k, i) => `<span class="sld__b"><b ${hook(BASE(k))}>${Math.round(PM[k].base[0] / 1000)}k</b><i style="--h:${(PM[k].base[0] / max * 100).toFixed(1)}%"${i === 0 ? ' class="on"' : ''}></i><em data-i18n="carte.mock.bars.${i}"></em></span>`).join('')}</span><span class="sld__s" data-i18n="carte.mock.sldS"></span><span class="sld__seal">印</span></div>`)}`;
      }
      case 'info': {
        // the price guide's market row for a visual identity (assets/app.js MARKET.identite), on the console's log scale
        const M = PRICES.market.identite, toDA = { dz: 1, fr: FX.EUR, us: FX.USD };
        const lg = Math.log10, lo = lg(50000), hi = lg(5000000);
        const k1 = (n) => (n >= 1000 ? `${String(n / 1000).replace('.', ',')}k` : String(n));
        const bar = (k, lab, txt) => { const a0 = (lg(M[k][0] * toDA[k]) - lo) / (hi - lo) * 100, a1 = (lg(M[k][1] * toDA[k]) - lo) / (hi - lo) * 100; return `<div class="ig__r"><span class="ig__k" data-i18n="${lab}"></span><span class="ig__t"><i style="--s:${a0.toFixed(1)}%;--w:${(a1 - a0).toFixed(1)}%"></i></span><span class="ig__v" dir="ltr">${txt}</span></div>`; };
        return `
        <div class="o sh ig" style="${P(5, 5, 58)}">
          <div class="ig__h" data-i18n="carte.mock.igH"></div>
          ${bar('dz', 'carte.mock.dz', `${k1(M.dz[0])} – ${k1(M.dz[1])} DA`)}${bar('fr', 'carte.mock.frk', `${k1(M.fr[0])} – ${k1(M.fr[1])}${M.fr[2] ? '+' : ''} €`)}${bar('us', 'carte.mock.us', `${k1(M.us[0])} – ${k1(M.us[1])}${M.us[2] ? '+' : ''} $`)}
          <div class="ig__f" data-i18n="carte.mock.igF"></div>
        </div>
        <div class="o sh ig2 t-b" style="${P(67, 7, 28)}" dir="ltr"><b>${k1(M.dz[0])}</b><span>DA</span><b>${k1(M.fr[0])}</b><span>€</span><b>${k1(M.us[0])}</b><span>$</span></div>`;
      }
      case 'audit': return `
        ${win(P(28, 5, 66), `${img('../assets/work/glaive/d1-720.webp')}<span class="ring" style="${P(8, 30)}">1</span><span class="ring" style="${P(74, 44)}">2</span><span class="ring" style="${P(16, 72)}">3</span>`)}
        <div class="o sh report t-a" style="${P(5, 12, 26)}"><span class="report__h" data-i18n="carte.mock.report"></span>${[1, 2, 3].map((n) => `<span class="report__r"><b>${n}</b><i></i></span>`).join('')}<i class="report__l"></i><i class="report__l report__l--s"></i></div>`;
      case 'mois': {
        const ic = ['ic--sq', 'ic--a5', 'ic--ban', 'ic--menu'];
        return `
        <div class="o sh cal" style="${P(4, 5, 92)}">
          <div class="cal__h"><span data-i18n="carte.mock.calH"></span><span class="cal__ex" data-i18n="carte.mock.calEx"></span></div>
          <div class="cal__row">${ic.map((c, i) => `<span class="cal__c"><b data-i18n="carte.mock.wk.${i}"></b><i class="ic ${c}"></i><em data-i18n="carte.mock.wkW.${i}"></em></span>`).join('')}</div>
          <div class="cal__f" data-i18n="carte.mock.calF"></div>
        </div>
        <div class="o" style="${P(6, 64, 19)}">${img('bible/art/kuro-mug.webp', 'die')}</div>`;
      }
    }
    fail(`carte: no mockup "${c.mock}"`);
    return '';
  };
  // how far the tag hangs into the card body (the caption beside it keeps clear): the longest language decides
  const tagDrop = (k) => Math.max(...LANGS.map((l) => {
    const lab = DICT[l][`${k}.tag.l`] || '', u = DICT[l][`${k}.tag.u`] || '', d = DICT[l][`${k}.lead`] || '';
    return 88 + (u ? 16 : 0) + (lab.length > 15 ? 16 : 0) + Math.max(0, Math.ceil(d.length / 15) - 1) * 16;
  }));
  const tag = (k, tier) => `<div class="tag" aria-hidden="true">
        <span class="tag__sh"></span>
        <span class="tag__face"><span class="tag__in">
          ${t(`${k}.tag.l`, 'span', 'class="tag__l"')}
          <span class="tag__f"><bdi dir="ltr" ${hook(tier)} data-i18n="${k}.tag.f"></bdi> <small data-i18n="pricing.cur"></small></span>
          ${tier.lo !== tier.hi || tier.month ? t(`${k}.tag.u`, 'span', 'class="tag__u"') : ''}
          <span class="tag__c" dir="ltr" data-fx="${tier.lo}" data-i18n="${k}.tag.c"></span>
          ${t(`${k}.lead`, 'span', 'class="tag__d"')}
        </span></span>
        <span class="tag__eye"></span>
        <span class="tag__stamp">印</span>
      </div>`;
  const cap = (kind, who, link = '') => `<div class="cc__cap"><span class="cc__capk" data-i18n="${kind}"></span><b class="cc__capw" data-i18n="${who}"></b>${link}</div>`;
  const rowsOf = (k, tiers, c = {}) => tiers.map((x, i) => `<tr${x.lead ? ' class="is-lead"' : ''}><td>${x.lead ? '<span aria-hidden="true">★ </span>' : ''}${x.lead && c.leadPick ? `<a class="tt__go" href="#pricing" data-est-go="${c.est[0]}" data-est-size="${c.est[1]}" data-est-pick="${c.leadPick}"><span data-i18n="${k}.t.${i}"></span></a>` : `<span data-i18n="${k}.t.${i}"></span>`}${x.lead ? ' <span class="st-sr" data-i18n="carte.leadSr"></span>' : ''}</td><td><bdi dir="ltr" ${hook(x)} data-i18n="${k}.t.${i}.fig"></bdi></td></tr>`).join('');
  const card = (c, i) => {
    const st = `--i:${Math.min(i, 3)}`;
    if (c.blanche) return `<article class="cc cc--blanche" style="${st}" aria-labelledby="cc-blanche-h">
      <div class="cc__bar"><span>/ ☐ · <span data-i18n="carte.blanche.bar"></span></span><span class="cc__k" aria-hidden="true" data-decorative>?</span></div>
      <div class="cc__mock"><div class="stage stage--blanche"><span class="blanche__q" data-i18n="carte.blanche.q"></span>${img('bible/art/kuro-peek.webp', 'blanche__k')}</div>
        <div class="tag tag--open" aria-hidden="true"><span class="tag__sh"></span><span class="tag__face"><span class="tag__in">${t('carte.blanche.tag', 'span', 'class="tag__l"')}${t('carte.blanche.fig', 'span', 'class="tag__f tag__f--s"')}${t('carte.blanche.reply', 'span', 'class="tag__d"')}</span></span><span class="tag__eye"></span></div>
      </div>
      ${cap('carte.blanche.capK', 'carte.blanche.capW')}
      <div class="cc__head"><h5 class="cc__n" id="cc-blanche-h" data-i18n="carte.blanche.name"></h5><p class="cc__p" data-i18n="carte.blanche.pr"></p></div>
      <ul class="cc__gets">${[0, 1, 2].map((j) => `<li data-i18n="carte.blanche.gets.${j}"></li>`).join('')}</ul>
      <div class="cc__tiers"></div>
      <div class="cc__foot">${waBtn('carte.blanche.wa')}</div>
    </article>`;
    if (c.build) return `<article class="cc cc--build" style="${st};--tag-drop:${tagDrop('carte.build')}px" aria-labelledby="cc-build-h">
      <div class="cc__bar"><span>/ <span class="cc__arw" aria-hidden="true">→</span> · <span data-i18n="carte.build.bar"></span></span><span class="cc__k" aria-hidden="true" data-decorative>築</span></div>
      <div class="cc__mock"><div class="stage stage--build" role="img" data-decorative data-i18n-aria="carte.build.alt">
        <div class="o rcpt" style="${P(8, 7, 60)}"><span class="rcpt__h" data-i18n="carte.build.rcH"></span>${BUILD.tiers.map((x, j) => `<span class="rcpt__r"><em data-i18n="carte.build.t.${j}"></em><b dir="ltr" ${hook(x)}>${Math.round(x.lo / 1000)}k</b></span>`).join('')}<span class="rcpt__f" data-i18n="carte.build.rcF"></span></div>
      </div>
        <span class="cc__pin" aria-hidden="true"></span>
        ${tag('carte.build', BUILD.tiers[0])}
      </div>
      ${cap('carte.build.capK', 'carte.build.capW')}
      <div class="cc__head"><h5 class="cc__n" id="cc-build-h" data-i18n="carte.build.name"></h5><p class="cc__p" data-i18n="carte.build.pr"></p></div>
      <ul class="cc__gets"></ul>
      <div class="cc__tiers"><table class="tt"><caption class="st-sr" data-i18n="carte.tiersCap"></caption><tbody>${BUILD.tiers.map((x, j) => `<tr${x.lead ? ' class="is-lead"' : ''}><td data-i18n="carte.build.t.${j}"></td><td><bdi dir="ltr" ${hook(x)} data-i18n="carte.build.t.${j}.fig"></bdi></td></tr>`).join('')}</tbody></table></div>
      <div class="cc__foot"><a class="st-btn st-btn--primary" href="#pricing" data-est-go="vitrine" data-est-size="5" data-i18n="carte.est"></a></div>
    </article>`;
    const k = `carte.items.${c.id}`, lead = leadOf(c);
    const lines = [
      c.save ? `<p class="cc__save" ${hook(c.save)} data-i18n="${k}.save"></p>` : '',
      c.also ? `<p class="cc__x" ${hooks(c.also)} data-i18n="${k}.also"></p>` : '',
      c.note ? `<p class="cc__x" data-i18n="${k}.note"></p>` : '',
      c.rule ? `<p class="cc__rule" data-price="design:ui.creditDays" data-lo="${DESIGN.ui.creditDays}" data-hi="${DESIGN.ui.creditDays}" data-i18n="${k}.rule"></p>` : '',
      c.tiers.some((x) => x.lead && x.lo >= MID[0] && x.lo <= MID[1]) ? '<p class="cc__mid" data-i18n="carte.mid"></p>' : '',
      c.next ? `<p class="cc__next"><a href="#carte-identite" data-goto="identite" ${hook(c.next)} data-i18n="${k}.next"></a></p>` : '',
      `<p class="cc__mk"><span data-i18n="${k}.mk"></span> <a href="#carte-src-${c.srcN}" class="cc__ref" data-i18n-aria="carte.items.${c.id}.refA" dir="ltr">${c.srcN}</a></p>`,
    ].join('');
    const primary = c.cta === 'est'
      ? `<a class="st-btn st-btn--primary" href="#pricing" data-est-go="${c.est[0]}" data-est-size="${c.est[1]}" data-i18n="carte.est"></a>`
      : waBtn(`${k}.wa`);
    const sec = c.proof ? `<a class="cc__sec" href="${c.proof}" data-i18n="${c.proofK || 'carte.work'}"></a>` : '';
    const anchors = (c.anchors || []).map((a) => `<span id="${a}" class="cc__anchor"></span>`).join('');
    return `<article class="cc" id="carte-${c.id}" aria-labelledby="cc-${c.id}-h" style="${st};--tag-drop:${tagDrop(k)}px">${anchors}
      <div class="cc__bar"><span>/ ${c.n} · <span data-i18n="carte.g.${c.g}.n"></span></span><span class="cc__k" aria-hidden="true" data-decorative>${SEAL[c.g]}</span></div>
      <div class="cc__mock">
        <div class="stage" role="img" data-decorative data-i18n-aria="${k}.alt">${mock(c)}</div>
        <span class="cc__pin" aria-hidden="true"></span>
        ${tag(k, lead)}
      </div>
      ${cap(`${k}.cap.k`, `${k}.cap.w`, sec)}
      <div class="cc__head"><h5 class="cc__n" id="cc-${c.id}-h" data-i18n="${k}.name"></h5><p class="cc__p" data-i18n="${k}.pr"></p></div>
      <ul class="cc__gets">${c.tiers && DICT.fr[`${k}.gets.0`] != null ? [0, 1, 2].filter((j) => DICT.fr[`${k}.gets.${j}`] != null).map((j) => `<li data-i18n="${k}.gets.${j}"></li>`).join('') : ''}</ul>
      <div class="cc__tiers"><table class="tt"><caption class="st-sr" data-i18n="carte.tiersCap"></caption><tbody>${rowsOf(k, c.tiers, c)}</tbody></table>${lines}</div>
      <div class="cc__foot">${primary}</div>
    </article>`;
  };
  // the sources, numbered in order of first use
  const srcOrder = [];
  for (const g of GROUPS) for (const c of services.filter((x) => x.g === g)) { if (!srcOrder.includes(c.mks)) srcOrder.push(c.mks); c.srcN = srcOrder.indexOf(c.mks) + 1; }
  for (const c of services) set(`carte.items.${c.id}.refA`, (l) => F(l).fill(take(l, 'carte.ref'), { n: c.srcN }));
  const panels = GROUPS.map((g) => {
    const cs = CARDS.filter((c) => c.g === g);
    return `<section class="crt__panel" id="carte-${g}" role="tabpanel" aria-labelledby="tab-${g}" data-g="${g}">
      <h4 class="crt__gh"><span class="cc__k" aria-hidden="true" data-decorative>${SEAL[g]}</span><span data-i18n="carte.g.${g}.n"></span></h4>
      <div class="crt__grid">${cs.map((c, i) => card(c, i)).join('\n')}</div>
      <p class="crt__count" aria-hidden="true" dir="ltr"><span>1</span> / ${cs.length}</p>
    </section>`;
  }).join('\n');
  const tabs = GROUPS.map((g, i) => `<button type="button" role="tab" class="crt__tab" id="tab-${g}" aria-controls="carte-${g}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-g="${g}"><span class="cc__k" aria-hidden="true" data-decorative>${SEAL[g]}</span><span data-i18n="carte.g.${g}.n"></span><span class="crt__cnt">${CARDS.filter((c) => c.g === g && !c.blanche && !c.build).length}</span></button>`).join('');
  const strip = (s) => s === 'label' ? `<span class="fm__th fm__th--lbl" data-decorative>${label()}</span>` : `<span class="fm__th">${img(s, s.endsWith('.svg') ? 'crop-bordj' : s.includes('almaflow') ? 'fm__logo' : '')}</span>`;
  const formule = (f) => {
    const k = `carte.form.${f.id}`;
    return `<article class="fm" aria-labelledby="fm-${f.id}-h">
      <span class="fm__stamp" aria-hidden="true">印</span>
      <h5 class="fm__n" id="fm-${f.id}-h" data-i18n="${k}.name"></h5>
      <div class="fm__strip" aria-hidden="true">${f.strip.map(strip).join('')}</div>
      <div class="fm__p"><span data-i18n="carte.form.price"></span><b><span class="fm__from" data-i18n="carte.from"></span> <bdi dir="ltr" ${hook(f.price)} data-i18n="${k}.from"></bdi> <small data-i18n="pricing.cur"></small></b></div>
      <p class="fm__save" data-price="calc:${f.id}-saving" data-lo="${f.saving}" data-hi="${f.saving}" data-i18n="${k}.save"></p>
      <table class="tt fm__t"><caption class="st-sr" data-i18n="carte.tiersCap"></caption><tbody>${f.lines.map((x, i) => `<tr><td data-i18n="${k}.l.${i}"></td><td><bdi dir="ltr" ${hook(x)} data-i18n="${k}.l.${i}.fig"></bdi></td></tr>`).join('')}
        <tr class="fm__sum"><td data-i18n="carte.form.alc"></td><td><s><bdi dir="ltr" data-sum="${f.sum.src}" data-lo="${f.sum.lo}" data-hi="${f.sum.hi}" data-i18n="${k}.sum"></bdi></s></td></tr>
        <tr class="fm__sum fm__sum--f"><td data-i18n="carte.form.price"></td><td><bdi dir="ltr" ${hook(f.price)} data-i18n="${k}.fig"></bdi></td></tr></tbody></table>
      ${f.price.lo >= MID[0] && f.price.lo <= MID[1] ? '<p class="cc__mid" data-i18n="carte.mid"></p>' : ''}
      ${waBtn(`${k}.wa`, 'st-btn st-btn--ghost', 'carte.form.cta')}
    </article>`;
  };
  // "from" is printed by the formules (carte.from stays a key of its own)
  tmpl.delete('carte.from');
  const html = `<!-- « La carte » (2026-11-21, scripts/lib/carte.mjs): ${services.length} services in five families, written by the build from
         assets/app.js (PRICE_MODEL and DESIGN) and hub/src/carte.i18n.json; hub/app.js 14b runs the tabs, the print of the
         tags and the motion card's opening. Without scripts the five families read as one long menu. -->
    <section class="st-carte crt" id="carte" aria-labelledby="carte-h">
      <div class="crt__head">
        <div><p class="crt__kick" data-i18n="carte.k"></p><h3 class="crt__h" id="carte-h" data-i18n="carte.h"></h3></div>
        <p class="crt__lead" data-i18n="carte.lead"></p>
      </div>
      <div class="crt__strip" hidden><div class="crt__tabs" role="tablist" data-i18n-aria="carte.tabs">${tabs}</div><div class="crt__lines" aria-live="polite">${GROUPS.map((g, i) => `<p class="crt__line" data-g="${g}"${i ? ' hidden' : ''} data-i18n="carte.g.${g}.line"></p>`).join('')}</div></div>
      ${panels}
      <div class="crt__form">
        <div class="crt__formh"><p class="crt__kick" data-i18n="carte.form.k"></p><h4 class="crt__fh" data-i18n="carte.form.h"></h4></div>
        ${FORMULES.map(formule).join('\n')}
      </div>
      <p class="crt__foot"><span data-i18n="carte.foot"></span> <a href="#contact" data-i18n="carte.footA"></a></p>
      <div class="crt__src"><p><span data-i18n="carte.src.h"></span> <span data-i18n="carte.src.fx"></span></p><ol>${srcOrder.map((s, i) => `<li id="carte-src-${i + 1}"><a data-ref href="${SRC[s][1]}" target="_blank" rel="noopener" lang="${SRC[s][2]}" dir="ltr">${esc(SRC[s][0])} ↗<span class="st-sr" data-i18n="case.newTab"></span></a></li>`).join('')}</ol></div>
    </section>`;
  // the templates' own keys leave the dictionaries once every line is written
  for (const k of tmpl) for (const l of LANGS) delete DICT[l][k];
  for (const l of LANGS) for (const k of Object.keys(DICT[l])) if (/^carte\./.test(k) && /\{[a-z]+\}/.test(DICT[l][k])) fail(`carte: ${l} ${k} still holds a placeholder: ${DICT[l][k]}`);
  return { html, services: services.length, hosts: CARTE_HOSTS };
}
