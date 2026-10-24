#!/usr/bin/env node
/**
 * Fixture checks for scripts/lib/csp.mjs — `node scripts/csp-test.mjs`
 * (exits 1 on any failure; fixtureErrors() returns the same list for a gate).
 *
 * The fixture holds every kind of <script> the HTML standard distinguishes:
 * classic, module, JavaScript MIME types in any case, a MIME type with
 * parameters (a data block), language="…", importmap, JSON-LD, JSON, x-dc,
 * external, empty, commented out, inside raw-text elements, with quoted ">"
 * in an attribute, duplicated. The hashes are recomputed here with
 * node:crypto, independently of hashSource(). The browser side (that Chrome
 * hashes the same text) is proven in the browser: every page loaded under its
 * policy fires no securitypolicyviolation event.
 */
import { createHash } from 'node:crypto';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { ROOT, PAGES, EXTRA_PAGES } from './site.mjs';
import { withCsp, cspPolicy, cspKind, cspOf, scriptHashes, supabaseOrigin } from './lib/csp.mjs';

const sha = (t) => `'sha256-${createHash('sha256').update(t).digest('base64')}'`;
const head = (extra = '') => `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width">
${extra}<title>has <script>title()</script> as text</title>
<script>boot()</script>
<script type="module">mod()</script>
<script type="text/javascript">js()</script>
<script type=" TEXT/JAVASCRIPT ">upper()</script>
<script type="text/javascript; charset=utf-8">withParams()</script>
<script language="vbscript">vb()</script>
<script language="JavaScript">lang()</script>
<script type="">emptyType()</script>
<script type="application/ld+json">{"@type":"Thing","name":"one"}</script>
<script type="application/json" id="i18n">{"fr":{"a":"b"}}</script>
<script type="text/x-dc" data-dc-script>class Component {}</script>
<script type="importmap">{"imports":{}}</script>
<script src="a.js"></script>
<script src="b.js">ignored()</script>
<script></script>
<!-- <script>commented()</script> -->
<style>.a::before{content:"<script>styled()</script>"}</style>
<script data-x="a>b" data-y='<script>'>quoted()</script>
<SCRIPT>caps()</SCRIPT>
<script>dup()</script>
</head>
<body>
<textarea><script>textarea()</script></textarea>
<noscript><script>noscript()</script></noscript>
<script>dup()</script>
<script>
  multi();
  line();
</script >
</body>
</html>
`;
const FIX = head();
// what the browser runs, in document order, once each
const RUNS = ['boot()', 'mod()', 'js()', 'upper()', 'lang()', 'emptyType()', '{"imports":{}}', 'quoted()', 'caps()', 'dup()', '\n  multi();\n  line();\n'];
const SWITCH = (url, decl = 'window.NUMIDEA_SUPABASE_URL') => FIX.replace('</body>', `<script>\n  ${decl} = ${JSON.stringify(url)};\n  window.NUMIDEA_SUPABASE_KEY = "";\n</script>\n</body>`);
const directive = (policy, name) => (policy.split(/;\s*/).find((d) => d.split(' ')[0] === name) || '').split(' ').slice(1);
const throws = (fn) => { try { fn(); return false; } catch (e) { return true; } };

export function fixtureErrors() {
  const errs = [];
  const expect = (cond, msg) => { if (!cond) errs.push(msg); };

  // hashes: exactly the executable inline scripts, in order, without repeats
  const got = scriptHashes(FIX), want = RUNS.map(sha);
  expect(JSON.stringify(got) === JSON.stringify(want), `hashes ${got.length} ≠ the ${want.length} scripts the browser runs`);

  // the meta: once, on the line after the viewport meta, before every script
  const out = withCsp(FIX, 'page');
  const lines = out.split('\n'), vp = lines.findIndex((l) => l.startsWith('<meta name="viewport"'));
  expect(lines[vp + 1] === `<meta http-equiv="Content-Security-Policy" content="${cspPolicy(FIX, 'page')}">`, 'CSP meta is not the line after the viewport meta');
  expect((out.match(/http-equiv="Content-Security-Policy"/g) || []).length === 1, 'not exactly one CSP meta');
  expect(out.indexOf('Content-Security-Policy') < out.search(/<script\b/i), 'CSP meta does not precede the first script');
  expect(out.replace(lines[vp + 1] + '\n', '') === FIX, 'withCsp changed something besides adding its meta');
  expect(cspOf(out) === cspPolicy(FIX, 'page'), 'cspOf does not read the policy back');

  // idempotent, and an existing meta (stale, misplaced) is replaced
  for (const kind of ['page', 'embed']) expect(withCsp(withCsp(FIX, kind), kind) === withCsp(FIX, kind), `withCsp is not idempotent (${kind})`);
  const stale = head('').replace('<meta charset="utf-8">', `<meta charset="utf-8">\n<meta http-equiv="content-security-policy" content="script-src 'none'">`);
  expect(withCsp(stale, 'page') === out, 'a stale, misplaced CSP meta is not replaced');
  expect(withCsp(withCsp(FIX, 'embed'), 'page') === out, 'switching kind does not rewrite the meta');

  // data blocks are not hashed: changing them leaves the policy alone
  const data = FIX.replace('"name":"one"', '"name":"two"').replace('"a":"b"', '"a":"c"').replace('class Component {}', 'class Component { x = 1 }').replace('withParams()', 'other()').replace('vb()', 'vb2()');
  expect(data !== FIX && cspPolicy(data) === cspPolicy(FIX), 'changing a data block (JSON-LD, JSON, x-dc, typed with parameters, vbscript) changed the policy');
  // …and neither are commented-out, raw-text or external scripts
  const inert = FIX.replace('commented()', 'c2()').replace('styled()', 's2()').replace('textarea()', 't2()').replace('noscript()', 'n2()').replace('title()', 'ti2()').replace('ignored()', 'i2()');
  expect(cspPolicy(inert) === cspPolicy(FIX), 'a commented-out, raw-text or external script changed the policy');

  // one byte of one executable script changes exactly that hash
  const edited = FIX.replace('<script>boot()</script>', '<script>boot( )</script>');
  const h0 = scriptHashes(FIX), h1 = scriptHashes(edited);
  expect(h1[0] === sha('boot( )') && !h1.includes(sha('boot()')) && JSON.stringify(h1.slice(1)) === JSON.stringify(h0.slice(1)), 'a one-byte script edit does not change exactly its hash');
  expect(withCsp(edited) !== withCsp(FIX), 'a one-byte script edit leaves the page unchanged');

  // CR LF checkouts hash what the browser hashes (the parser turns CR LF and CR into LF)
  const crlf = FIX.replace(/\n/g, '\r\n');
  expect(JSON.stringify(scriptHashes(crlf)) === JSON.stringify(want), 'CR LF text hashes differently from LF');
  expect(withCsp(crlf).includes('<meta name="viewport" content="width=device-width">\r\n<meta http-equiv'), 'CR LF page gets a mixed line ending');
  expect(withCsp(withCsp(crlf)) === withCsp(crlf), 'withCsp is not idempotent on CR LF');

  // the two policies
  const page = cspPolicy(FIX, 'page'), embed = cspPolicy(FIX, 'embed');
  expect(!directive(page, 'script-src').includes("'unsafe-eval'") && directive(embed, 'script-src').includes("'unsafe-eval'"), "'unsafe-eval' must be on embeds only");
  expect(![page, embed].some((p) => directive(p, 'script-src').includes("'unsafe-inline'")), "script-src must never allow 'unsafe-inline'");
  expect(directive(embed, 'font-src').includes('data:') && !directive(page, 'font-src').includes('data:'), 'font-src data: must be on embeds only');
  expect(directive(embed, 'img-src').includes('blob:') && !directive(page, 'img-src').includes('blob:'), 'img-src blob: must be on embeds only');
  for (const [n, v] of [['default-src', "'self'"], ['object-src', "'none'"], ['base-uri', "'self'"], ['worker-src', "'none'"], ['frame-src', "'self'"], ['form-action', 'mailto:']]) {
    expect(directive(page, n).join(' ') === v && directive(embed, n).join(' ') === v, `${n} must be ${v}`);
  }
  expect(!/frame-ancestors|report-uri|report-to|sandbox/.test(page + embed), 'a directive a meta policy ignores is in the meta (it belongs in a header)');
  expect(page.endsWith('form-action mailto:'), 'form-action mailto: must stay last (check.mjs reads "mailto:;" as a contact address)');
  expect(cspKind('workspacehq/embed/console.html') === 'embed' && cspKind('workspacehq/index.html') === 'page' && cspKind('index.html') === 'page', 'cspKind maps the wrong files to embed');

  // the Supabase switch, read in a sandbox
  expect(directive(cspPolicy(SWITCH('')), 'connect-src').join(' ') === "'self'", 'switch off: connect-src must be self only');
  expect(directive(cspPolicy(SWITCH('https://abcd.supabase.co/')), 'connect-src').join(' ') === "'self' https://abcd.supabase.co", 'switch on: connect-src must add the origin');
  expect(supabaseOrigin(SWITCH('https://abcd.supabase.co', 'var NUMIDEA_SUPABASE_URL')) === 'https://abcd.supabase.co', 'a top-level var is window.X in the browser too');
  expect(throws(() => cspPolicy(SWITCH('http://abcd.supabase.co'))), 'a non-https Supabase URL must stop the build');
  expect(throws(() => cspPolicy(FIX.replace('</body>', '<script>window.NUMIDEA_SUPABASE_URL = location.origin;</script></body>'))), 'a switch that cannot run in the sandbox must stop the build');

  // what cannot be done right is refused
  expect(throws(() => withCsp(FIX.replace(/<meta name="viewport"[^>]*>\n/, ''))), 'no viewport meta must throw');
  expect(throws(() => withCsp(FIX, 'strict')), 'an unknown kind must throw');
  expect(throws(() => withCsp(FIX.replace('<meta name="viewport"', '<script>early()</script>\n<meta name="viewport"'))), 'a script before the viewport meta must throw');
  expect(throws(() => scriptHashes(FIX.replace('boot()', 'var s = "<!--<script>"; boot()'))), '"<!--" then "<script" inside a script must throw');

  // every real page: withCsp is a fixed point of what is committed or generated
  for (const f of [...PAGES, ...EXTRA_PAGES]) {
    if (!existsSync(join(ROOT, f))) continue;
    const html = readFileSync(join(ROOT, f), 'utf8'), once = withCsp(html, cspKind(f));
    expect(withCsp(once, cspKind(f)) === once, `${f}: withCsp is not idempotent`);
  }
  return errs;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const errs = fixtureErrors();
  if (errs.length) { for (const e of errs) console.error('✗ ' + e); process.exit(1); }
  console.log('✓ withCsp fixtures: script kinds, placement, idempotence, data blocks ignored, one-byte edits, CR LF, both policies, the Supabase switch, refusals');
}
