#!/usr/bin/env node
/**
 * Fixture checks for scripts/lib/csp.mjs — `node scripts/csp-test.mjs`
 * (exits 1 on any failure; fixtureErrors() returns the same list for a gate).
 *
 * The fixture holds every kind of <script> the HTML standard distinguishes:
 * classic, module, JavaScript MIME types in any case, a MIME type with
 * parameters (a data block), language="…", importmap, JSON-LD, JSON, x-dc,
 * external, empty, commented out, inside raw-text elements, with quoted ">"
 * in an attribute, duplicated. Then the floor of scripts/lib/csp-floor.mjs:
 * both policies stand on it, and each way of loosening them (script-src-elem,
 * script-src-attr, 'unsafe-inline', 'unsafe-hashes', 'strict-dynamic',
 * wildcards, schemes, hosts, a repeated or unknown directive…) is refused.
 * Last, a <script> inside <svg> or <math> is refused (the browser decodes its
 * text before hashing it), while scripts around inline SVG are hashed as usual.
 * The hashes are recomputed here with
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
import { policyErrors, headerPolicyErrors, directiveMap } from './lib/csp-floor.mjs';

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

  // the floor (scripts/lib/csp-floor.mjs, which check.mjs 16 applies to every
  // page): both policies csp.mjs builds stand on it…
  const onSwitch = cspPolicy(SWITCH('https://abcd.supabase.co'), 'page');
  for (const [name, p, ctx] of [['a page', page, { kind: 'page' }], ['an embed', embed, { kind: 'embed' }], ['index with the switch on', onSwitch, { kind: 'page', connect: true }]]) {
    const e = policyErrors(p, ctx);
    expect(!e.length, `the policy csp.mjs builds for ${name} is below the floor (scripts/lib/csp-floor.mjs): ${e.join('; ')}`);
  }
  // …and each way of loosening it is refused. A case is [what, policy, ctx].
  const H = `'sha256-${'A'.repeat(43)}='`;
  const swap = (p, name, value) => p.split('; ').map((d) => (d.split(' ')[0] === name ? `${name} ${value}` : d)).join('; ');
  const LOOSE = [
    ["script-src-elem 'unsafe-inline'", `${page}; script-src-elem 'unsafe-inline'`],
    ["script-src-attr 'unsafe-inline'", `${page}; script-src-attr 'unsafe-inline'`],
    ['script-src-elem that only repeats script-src', `${page}; script-src-elem 'self' ${H}`],
    ["script-src 'unsafe-inline'", swap(page, 'script-src', `'self' 'unsafe-inline' ${H}`)],
    ["script-src 'UNSAFE-INLINE' (keywords match in any case)", swap(page, 'script-src', `'self' 'UNSAFE-INLINE'`)],
    ["script-src 'unsafe-hashes'", swap(page, 'script-src', `'self' 'unsafe-hashes' ${H}`)],
    ["script-src 'strict-dynamic'", swap(page, 'script-src', `'self' 'strict-dynamic' ${H}`)],
    ['script-src a nonce', swap(page, 'script-src', `'self' 'nonce-abc'`)],
    ['script-src *', swap(page, 'script-src', `'self' *`)],
    ['script-src https:', swap(page, 'script-src', `'self' https:`)],
    ['script-src data:', swap(page, 'script-src', `'self' data:`)],
    ['script-src a host', swap(page, 'script-src', `'self' cdn.example.com`)],
    ['script-src an https origin', swap(page, 'script-src', `'self' https://cdn.example.com`)],
    ['script-src a sha384 hash', swap(page, 'script-src', `'self' 'sha384-${'A'.repeat(64)}'`)],
    ["'unsafe-eval' on a page", swap(page, 'script-src', `'self' 'unsafe-eval'`)],
    ["'unsafe-eval' in an embed's default-src", swap(embed, 'default-src', `'self' 'unsafe-eval'`), { kind: 'embed' }],
    ['default-src *', swap(page, 'default-src', '*')],
    ["default-src 'unsafe-inline'", swap(page, 'default-src', `'self' 'unsafe-inline'`)],
    ['default-src https:', swap(page, 'default-src', `'self' https:`)],
    ['default-src a host', swap(page, 'default-src', `'self' cdn.example.com`)],
    ['no default-src', page.split('; ').filter((d) => !d.startsWith('default-src ')).join('; ')],
    ['no script-src', page.split('; ').filter((d) => !d.startsWith('script-src ')).join('; ')],
    ['a loose script-src before the real one', `script-src 'self' 'unsafe-inline'; ${page}`],
    ['a repeated directive, even with the same value', `${page}; base-uri 'self'`],
    ['a repeat in another case', `SCRIPT-SRC 'self'; ${page}`],
    ['an unknown directive', `${page}; child-src *`],
    ['a directive the floor does not list', `${page}; manifest-src 'self'`],
    ["object-src 'none' with a source beside it", swap(page, 'object-src', `'none' https:`)],
    ["base-uri *", swap(page, 'base-uri', '*')],
    ['connect-src *', swap(page, 'connect-src', `'self' *`)],
    ['connect-src an origin with the switch off', swap(page, 'connect-src', `'self' https://abcd.supabase.co`)],
    ['connect-src two origins', swap(onSwitch, 'connect-src', `'self' https://abcd.supabase.co https://evil.example`), { kind: 'page', connect: true }],
    ['connect-src an origin with a path', swap(onSwitch, 'connect-src', `'self' https://abcd.supabase.co/rest`), { kind: 'page', connect: true }],
    ['img-src blob: on a page', swap(page, 'img-src', `'self' data: blob:`)],
    ['font-src data: on a page', swap(page, 'font-src', `'self' data:`)],
    ['frame-src *', swap(page, 'frame-src', `'self' *`)],
    ['form-action https:', swap(page, 'form-action', 'mailto: https:')],
  ];
  for (const [what, p, ctx = { kind: 'page' }] of LOOSE) {
    expect(p !== page && p !== embed && p !== onSwitch, `floor fixture "${what}" did not change the policy`);
    expect(policyErrors(p, ctx).length > 0, `the floor lets through ${what}`);
  }
  // a repeated directive is read as the browser reads it: the first one counts
  expect(directiveMap(`script-src 'self' 'unsafe-inline'; script-src 'self'`)['script-src'].join(' ') === "'self' 'unsafe-inline'", 'a repeated directive must read as its first');
  // the mirrors' header policy
  const HDR = "frame-ancestors 'self'; base-uri 'self'; object-src 'none'";
  expect(!headerPolicyErrors(HDR).length, `the header policy is below its floor: ${headerPolicyErrors(HDR).join('; ')}`);
  for (const [what, p] of [['frame-ancestors * before the real one', `frame-ancestors *; ${HDR}`], ['a fetch directive', `${HDR}; script-src 'self'`],
    ['frame-ancestors *', HDR.replace("frame-ancestors 'self'", 'frame-ancestors *')], ['no object-src', "frame-ancestors 'self'; base-uri 'self'"]]) {
    expect(headerPolicyErrors(p).length > 0, `the header floor lets through ${what}`);
  }

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
  // a script in foreign content (<svg>, <math>) is hashed by the browser after
  // "&…;" and CDATA are decoded, so it is refused; markup around it is not
  const inBody = (m) => FIX.replace('</body>', `${m}\n</body>`);
  for (const [what, m] of [['in <svg>', '<svg><script>window.__r = (1 &lt; 2) ? "ran" : "no"</script></svg>'],
    ['in <svg>, upper case', '<SVG viewBox="0 0 1 1"><g><SCRIPT>x()</SCRIPT></g></SVG>'],
    ['in an <svg> <style> (not raw text there)', '<svg><style>.a{}</style><style><script>x()</script></style></svg>'],
    ['in an <svg> <title>', '<svg><title><script>x()</script></title></svg>'],
    ['in <math>', '<math><mi>x</mi><script>x()</script></math>'],
    ['in a nested <svg>, after the inner one closes', '<svg><svg></svg><script>x()</script></svg>'],
    ['after <svg a=b/> (the "/" is the value\'s, so it is not self-closing)', '<svg a=b/><script>x()</script></svg>'],
    ['external, in <svg>', '<svg><script href="a.js"/></svg>']]) {
    expect(throws(() => scriptHashes(inBody(m))), `a <script> ${what} must throw`);
  }
  for (const [what, m] of [['after a closed <svg>', '<svg><path d="M0 0"/></svg><script>after()</script>'],
    ['after a self-closing <svg/>', '<svg/><script>after()</script>'],
    ['after a <math>', '<math><mi>x</mi></math><script>after()</script>']]) {
    let h = null;
    try { h = scriptHashes(inBody(m)); } catch (e) { /* h stays null */ }
    expect(h && h.at(-1) === sha('after()'), `a <script> ${what} is an ordinary script and must be hashed`);
  }
  expect(JSON.stringify(scriptHashes(inBody('<svg><![CDATA[ a > b <script>x()</script> ]]></svg>'))) === JSON.stringify(want), 'CDATA in <svg> is text: the "<script>" in it is no script');
  expect(JSON.stringify(scriptHashes(inBody('<svg><title>a &lt;script&gt;</title><desc>d</desc></svg>'))) === JSON.stringify(want), 'an <svg> <title> without a script must pass');

  // every real page: withCsp is a fixed point of what is committed or generated
  for (const f of [...PAGES, ...EXTRA_PAGES]) {
    if (!existsSync(join(ROOT, f))) continue;
    const html = readFileSync(join(ROOT, f), 'utf8');
    try {
      const once = withCsp(html, cspKind(f));
      expect(withCsp(once, cspKind(f)) === once, `${f}: withCsp is not idempotent`);
    } catch (e) { errs.push(`${f}: ${e.message}`); }   // reported, not thrown: check.mjs 16 lists it with the rest
  }
  return errs;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const errs = fixtureErrors();
  if (errs.length) { for (const e of errs) console.error('✗ ' + e); process.exit(1); }
  console.log('✓ withCsp fixtures: script kinds, placement, idempotence, data blocks ignored, one-byte edits, CR LF, both policies, the floor (and each way of loosening it), the Supabase switch, refusals (scripts in <svg>/<math> among them)');
}
