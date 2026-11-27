/**
 * The floor of every Content-Security-Policy the site sends — check.mjs 16.
 *
 * Kept apart from csp.mjs on purpose. csp.mjs builds each page's policy, and
 * check.mjs 16 requires every page to equal what it builds: an edit there
 * that loosens the policy rebuilds every page the same way and still passes
 * that comparison. This file states, on its own, the most each directive may
 * allow. Loosening the policy therefore takes an edit here too, and that edit
 * reads as what it is.
 *
 * A policy is read the way the browser reads one (CSP3, "parse a serialized
 * CSP"): split on ";", the directive's name is its first token (ASCII
 * case-insensitive) and its values are the rest, split on ASCII white space.
 * A repeated directive is ignored by the browser, which enforces the first
 * one, so a repeat is refused here rather than guessed at.
 *
 * Every directive must be one this file knows, and each of its values must be
 * on that directive's list. That refuses, among others:
 *   - script-src-elem and script-src-attr, which override script-src for
 *     <script> elements and for inline handlers, so the hashes would no
 *     longer be the whole rule;
 *   - 'unsafe-inline', 'unsafe-hashes', 'strict-dynamic', nonces, wildcards,
 *     schemes (https:, data:) and hosts in script-src (but the Tag Manager
 *     host, on the pages) or default-src;
 *   - 'unsafe-eval' anywhere but script-src on a WorkspaceHQ embed;
 *   - any source added next to 'none' (the browser then ignores 'none').
 */

const HASH = /^'sha256-[A-Za-z0-9+/]{43}='$/;
// one https origin, no path, port or wildcard: the Supabase lead store
const ORIGIN = /^https:\/\/[a-z0-9-]+(?:\.[a-z0-9-]+)+$/;

/* The Google tag (scripts/lib/gtag.mjs; owner decision 2026-11-14), exactly what
   Google documents for Tag Manager + GA4 and nothing broader, on the pages
   and not on the WorkspaceHQ embeds. Stated here on its own, not imported
   from csp.mjs, so that widening it takes an edit in this file. */
const GOOGLE_SCRIPT = ['https://www.googletagmanager.com'];
const GOOGLE_IMG = ['https://*.google-analytics.com', 'https://*.googletagmanager.com'];
const GOOGLE_CONNECT = ['https://*.google-analytics.com', 'https://*.analytics.google.com', 'https://*.googletagmanager.com'];

/* the most each directive may allow, by policy kind ('page' or 'embed') and
   whether the page may connect to its lead store (index.html, switch on) */
const CEILING = {
  'default-src': () => ["'self'"],
  'script-src': ({ kind }) => ["'self'", HASH, ...(kind === 'embed' ? ["'unsafe-eval'"] : GOOGLE_SCRIPT)],
  'style-src': () => ["'self'", "'unsafe-inline'"],
  'img-src': ({ kind }) => ["'self'", 'data:', ...(kind === 'embed' ? ['blob:'] : GOOGLE_IMG)],
  'font-src': ({ kind }) => ["'self'", ...(kind === 'embed' ? ['data:'] : [])],
  'connect-src': ({ kind, connect }) => ["'self'", ...(kind === 'embed' ? [] : GOOGLE_CONNECT), ...(connect ? [ORIGIN] : [])],
  'media-src': () => ["'self'"],
  'frame-src': () => ["'self'"],
  'worker-src': () => ["'none'"],
  'object-src': () => ["'none'"],
  'base-uri': () => ["'self'"],
  'form-action': () => ['mailto:'],
};
// directives that must be there, with exactly this value ('' = any allowed one)
const REQUIRED = { 'default-src': "'self'", 'script-src': '', 'object-src': "'none'", 'base-uri': "'self'" };

// the policy the hosts send in a header (scripts/lib/csp-header.mjs): the
// union of the metas of its kind, so its fetch directives stand on the same
// floor as a meta's, plus the directives only a header can carry
const HEADER = { 'frame-ancestors': "'self'" };
const HEADER_OPTIONAL = { 'upgrade-insecure-requests': /^$/, 'report-uri': /^\/[a-z0-9/_-]+$/ };

/** [{ name, values }] in order, as the browser parses them, repeats kept (so they can be refused). */
export function parsePolicy(policy) {
  return String(policy).split(';').map((d) => d.trim().split(/[\t\n\f\r ]+/)).filter((d) => d[0])
    .map(([name, ...values]) => ({ name: name.toLowerCase(), values }));
}

/** { name: values } with the first of a repeated directive, as the browser enforces it. */
export function directiveMap(policy) {
  const out = {};
  for (const { name, values } of parsePolicy(policy)) if (!Object.hasOwn(out, name)) out[name] = values;
  return out;
}

const repeats = (list) => [...new Set(list.map((d) => d.name).filter((n, i, all) => all.indexOf(n) !== i))];

// why a value is refused, in words a reader of the gate can act on
function why(v) {
  const k = v.toLowerCase();
  if (k === "'unsafe-inline'") return 'it runs any inline script, so the hashes stop mattering';
  if (k === "'unsafe-hashes'") return 'it lets hashes allow inline handlers and javascript: URLs';
  if (k === "'strict-dynamic'") return 'it trusts whatever an allowed script loads';
  if (k === "'unsafe-eval'") return 'eval is allowed on the WorkspaceHQ embeds alone';
  if (/^'nonce-/.test(k)) return 'a static host cannot mint a nonce per response';
  if (k.includes('*')) return 'a wildcard';
  if (/^[a-z][a-z0-9+.-]*:$/.test(k)) return 'a whole scheme';
  if (!k.startsWith("'")) return 'a host';
  return 'not on its list in scripts/lib/csp-floor.mjs';
}

/**
 * Why a page's meta policy falls below the floor ([] when it holds).
 * ctx: { kind: 'page' | 'embed', connect: whether connect-src may add one https origin }
 */
export function policyErrors(policy, { kind = 'page', connect = false } = {}) {
  const errs = [], list = parsePolicy(policy), map = directiveMap(policy);
  for (const n of repeats(list)) errs.push(`${n} is given more than once (the browser enforces the first and ignores the rest)`);
  for (const { name, values } of list) {
    if (!Object.hasOwn(CEILING, name)) {
      errs.push(/^script-src-(elem|attr)$/.test(name)
        ? `the policy holds ${name}, which overrides script-src for ${name.endsWith('attr') ? 'inline handlers' : '<script> elements'}: the hashes would no longer be the whole rule`
        : `the policy holds ${name}, a directive scripts/lib/csp-floor.mjs does not know (add it there, with what it may allow, only after checking what it changes)`);
      continue;
    }
    const allowed = CEILING[name]({ kind, connect });
    for (const v of values) {
      if (!allowed.some((a) => (a instanceof RegExp ? a.test(v) : a === v))) errs.push(`${name} allows ${v} (${why(v)})`);
    }
    if (name === 'connect-src' && values.filter((v) => ORIGIN.test(v)).length > 1) errs.push('connect-src names more than one outside origin (the lead store is one)');
  }
  for (const [n, want] of Object.entries(REQUIRED)) {
    const got = map[n];
    if (!got || !got.length) errs.push(`the policy has no ${n}`);
    else if (want && got.join(' ') !== want) errs.push(`${n} is "${got.join(' ')}" (want ${want})`);
  }
  return errs;
}

/**
 * Why a host's header policy is wrong ([] when it holds).
 * kind: 'page', 'embed', or 'any' (Netlify, which sends one policy for both:
 * each value must be allowed on one kind or the other).
 */
export function headerPolicyErrors(policy, { kind = 'page' } = {}) {
  const errs = [], list = parsePolicy(policy), map = directiveMap(policy);
  for (const n of repeats(list)) errs.push(`${n} is given more than once (the browser enforces the first and ignores the rest)`);
  for (const [n, v] of Object.entries(HEADER)) if ((map[n] || []).join(' ') !== v) errs.push(`its ${n} is "${(map[n] || []).join(' ')}" (want ${v})`);
  for (const { name, values } of list) {
    if (Object.hasOwn(HEADER_OPTIONAL, name) && !HEADER_OPTIONAL[name].test(values.join(' '))) errs.push(`its ${name} is "${values.join(' ')}" (want a same-site path or a group name; nothing for upgrade-insecure-requests)`);
  }
  const fetch = list.filter((d) => !Object.hasOwn(HEADER, d.name) && !Object.hasOwn(HEADER_OPTIONAL, d.name)).map((d) => [d.name, ...d.values].join(' ')).join('; ');
  const floor = (k) => policyErrors(fetch, { kind: k, connect: true });
  if (kind === 'any') { const embed = new Set(floor('embed')); errs.push(...floor('page').filter((e) => embed.has(e))); }
  else errs.push(...floor(kind));
  return errs;
}
