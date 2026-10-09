/**
 * Legal notice (mentions légales) + privacy policy — the owner's facts.
 *
 * Every `null` is a fact only the owner can give, and it BLOCKS publication:
 * `npm run build` lists what is missing and writes nothing; check.mjs fails if
 * any page links to legal/ before the page exists. `false` means "does not
 * apply" and is allowed. When the last null is filled, `npm run build` writes
 * legal/index.html, adds the footer and contact-form links, and the page joins
 * the deploy set, the sitemap and every gate automatically.
 *
 * Preview the page with the gaps marked: node scripts/build-legal.mjs --preview
 * (writes legal-preview/, which is git-ignored and never deployed).
 */

export const LEGAL = {
  publisher: {
    name: null,          // legal name, or full personal name for a sole trader
    legalForm: null,     // e.g. 'Auto-entrepreneur', 'EURL', 'SARL', 'Personne physique'
    capital: null,       // share capital for a company, or false if not a company
    address: null,       // registered postal address
    email: null,         // contact email (ideally on the studio's own domain)
    phone: '+213 672 41 25 78',
  },
  registration: {
    label: null,         // e.g. 'Registre du commerce (CNRC)', 'Carte auto-entrepreneur', 'NIF'
    number: null,        // the number itself; false if not registered (explain in publisher.legalForm)
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
    retention: null,     // how long enquiry emails are kept, e.g. '3 ans après le dernier échange'
    rightsEmail: null,   // where to exercise rights; may be the same as publisher.email
    anpdp: null,         // Algerian ANPDP declaration status/number, or false
    supabaseRegion: false, // the form's database is OFF (empty keys in index.html); set a region when it is switched on
  },
  /* Copyright of the site's text, illustrations and the CV. LICENSE in the
     repository is CC0 (public domain); a "tous droits réservés" clause would
     contradict it. Pick one: 'cc0' (keep LICENSE) or 'reserved' (change
     LICENSE to cover code only, then this page states the reservation). */
  ip: { licence: null },
  lastUpdated: null,     // 'YYYY-MM-DD' of the last review
};

/* every required field still null, as dotted paths */
export function missing(data = LEGAL) {
  const out = [];
  const walk = (o, path) => {
    for (const [k, v] of Object.entries(o)) {
      const p = path ? path + '.' + k : k;
      if (v === null) out.push(p);
      else if (v && typeof v === 'object' && !Array.isArray(v)) walk(v, p);
    }
  };
  walk({ ...data, hostCatalogue: Object.fromEntries(data.hosts.map((h) => [h, data.hostCatalogue[h]])) }, '');
  return out;
}
