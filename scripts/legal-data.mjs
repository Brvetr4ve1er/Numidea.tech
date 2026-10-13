/**
 * Legal notice (mentions légales) + privacy policy — the owner's facts.
 *
 * Every `null` is a fact only the owner can give, and it BLOCKS publication:
 * `npm run build` lists what is missing and writes nothing; check.mjs fails if
 * any page links to legal/ before the page exists. `false` means "does not
 * apply" and is allowed where a comment says so. When the last null is filled,
 * `npm run build` writes legal/index.html, adds the footer and contact-form
 * links, and the page joins the deploy set, the sitemap and every gate
 * automatically.
 *
 * The page is in French, English and Arabic. Names, addresses, emails,
 * numbers and dates read the same in every language and take one value.
 * Free text (the fields listed in TRANSLATED) takes one value per language,
 * { fr, en, ar }, and each language left null is a separate gap: a single
 * French string would print French in the English and Arabic sections.
 *
 * Preview the page with the gaps marked: node scripts/build-legal.mjs --preview
 * (writes legal-preview/, which is git-ignored and never deployed).
 */
import { LANGS } from './site.mjs';

export const LEGAL = {
  publisher: {
    name: null,          // legal name, or full personal name for a sole trader
    // e.g. { fr: 'Auto-entrepreneur', en: 'Sole trader (auto-entrepreneur)', ar: 'مقاول ذاتي' }
    legalForm: { fr: null, en: null, ar: null },
    // share capital as each language writes the amount, or false if not a company
    capital: { fr: null, en: null, ar: null },
    address: null,       // registered postal address
    email: null,         // contact email (ideally on the studio's own domain)
    phone: '+213 672 41 25 78',
  },
  registration: {
    // e.g. { fr: 'Registre du commerce (CNRC)', en: 'Trade register (CNRC)', ar: 'السجل التجاري (CNRC)' }
    label: { fr: null, en: null, ar: null },
    number: null,        // the number itself; false if not registered (explain in publisher.legalForm; label is then unused)
  },
  director: null,        // directeur de la publication (a person)
  /* Where the site is served from. After the A/B/C variants were removed the
     canonical site is GitHub Pages; add 'netlify' / 'vercel' only if those
     mirrors are live. Host details are public (each provider's terms); confirm
     them before publishing. */
  hosts: ['github'],
  hostCatalogue: {
    github: { name: 'GitHub, Inc.', address: null, site: 'https://github.com' },
    netlify: { name: 'Netlify, Inc.', address: null, site: 'https://www.netlify.com' },
    vercel: { name: 'Vercel Inc.', address: null, site: 'https://vercel.com' },
  },
  privacy: {
    // how long enquiries are kept, e.g. { fr: '3 ans après le dernier échange', en: '3 years after the last exchange', ar: '3 سنوات بعد آخر تواصل' }
    retention: { fr: null, en: null, ar: null },
    rightsEmail: null,   // where to exercise rights; may be the same as publisher.email
    // Algerian ANPDP declaration status/number in each language, or false
    anpdp: { fr: null, en: null, ar: null },
    supabaseRegion: false, // the form's database is OFF (empty keys in index.html); set a region (e.g. 'eu-central-1') when it is switched on
  },
  /* Copyright of the site's text, illustrations and the CV. LICENSE in the
     repository is CC0 (public domain); a "tous droits réservés" clause would
     contradict it. Pick one: 'cc0' (keep LICENSE) or 'reserved' (change
     LICENSE to cover code only, then this page states the reservation). */
  ip: { licence: null },
  lastUpdated: null,     // 'YYYY-MM-DD' of the last review
};

/* Free-text fields: { fr, en, ar }, every language filled. */
export const TRANSLATED = ['publisher.legalForm', 'publisher.capital', 'registration.label', 'privacy.retention', 'privacy.anpdp'];
/* of those, the ones that may be `false` (does not apply) */
const MAY_NOT_APPLY = ['publisher.capital', 'privacy.anpdp'];

/* the languages a translated field still lacks, as dotted paths (field.fr …);
   a plain string is one value for three languages, so it lacks all three */
function langGaps(path, v, data) {
  if (v === false && MAY_NOT_APPLY.includes(path)) return [];
  if (path === 'registration.label' && data.registration.number === false) return [];
  const has = (l) => v !== null && typeof v === 'object' && typeof v[l] === 'string' && v[l].trim() !== '';
  return LANGS.filter((l) => !has(l)).map((l) => path + '.' + l);
}

/* every required field still null (or a language still missing), as dotted paths */
export function missing(data = LEGAL) {
  const out = [];
  const walk = (o, path) => {
    for (const [k, v] of Object.entries(o)) {
      const p = path ? path + '.' + k : k;
      if (TRANSLATED.includes(p)) out.push(...langGaps(p, v, data));
      else if (v === null) out.push(p);
      else if (v && typeof v === 'object' && !Array.isArray(v)) walk(v, p);
    }
  };
  walk({ ...data, hostCatalogue: Object.fromEntries(data.hosts.map((h) => [h, data.hostCatalogue[h]])) }, '');
  return out;
}
