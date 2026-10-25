/**
 * Content-Security-Policy for every page — `withCsp(html, kind)`.
 *
 * GitHub Pages (the canonical host) cannot send headers, so the policy rides
 * in the page as <meta http-equiv="Content-Security-Policy">, written right
 * after the viewport meta: ahead of every script, style and stylesheet, which
 * a meta policy only governs when it comes first. The parts a meta tag cannot
 * carry (frame-ancestors, reporting) go in the mirrors' headers instead.
 *
 * script-src names every inline executable script by its sha256 hash, so no
 * 'unsafe-inline' is needed and an injected or edited script is refused.
 * "Executable" is decided as the HTML standard decides it: no type, an empty
 * type, a JavaScript MIME type (exactly, no parameters), "module", and the
 * other inline kinds CSP governs (importmap, speculationrules). JSON-LD,
 * application/json dictionaries, text/x-dc templates and any other type are
 * data blocks: the browser never runs them, so they are not hashed and their
 * content can change freely (the baked French FAQ, the scene dictionary).
 * Scripts with src= are external and covered by 'self'.
 *
 * The hash is taken over what the browser hashes: the element's text, with
 * the parser's newline normalisation (CR LF and lone CR become LF), so a
 * Windows checkout hashes the same as a Linux one.
 *
 * Two policies:
 *   page   index, 404, hub, scene, workspacehq, legal
 *   embed  workspacehq/embed/*.html — the Claude Design runtime (support.js)
 *          evaluates its component code with new Function ('unsafe-eval'; the
 *          console does not boot without it), and the stage inlines its
 *          @font-face files as data: URLs (font-src data:). img-src blob: is
 *          for the runtime's bundled-resource mode (window.__resourceBlobs),
 *          which these exports do not use today. The runtime also re-creates
 *          each helmet <script> in the head with the same text, so the hashes
 *          taken here match both runs.
 *
 * connect-src gains the Supabase origin only on the page that carries the
 * lead-store switch (index.html), and only when the switch is on. The switch
 * is read the way check.mjs reads it: the inline script that sets
 * window.NUMIDEA_SUPABASE_URL runs in a sandbox with a bare window. A switch
 * script that cannot run there, or a URL that is not https, is an error: the
 * policy cannot be computed, so the build stops rather than guess.
 *
 * withCsp is idempotent, and an existing CSP meta (stale or misplaced) is
 * replaced, so every generator and build-csp.mjs can apply it unconditionally.
 *
 * The most each directive may allow is stated apart from this file, in
 * csp-floor.mjs, and check.mjs 16 holds every page to it: a change here that
 * loosens the policy fails there until the floor is changed too.
 */
import { createHash } from 'node:crypto';
import { runInNewContext } from 'node:vm';

export const KINDS = ['page', 'embed'];

/* which policy a site file gets, by its path from the repository root */
export const cspKind = (file) => (/^workspacehq\/embed\/[^/]+\.html$/.test(String(file).replace(/\\/g, '/')) ? 'embed' : 'page');

const JS_MIME = new Set(['application/ecmascript', 'application/javascript', 'application/x-ecmascript', 'application/x-javascript',
  'text/ecmascript', 'text/javascript', 'text/javascript1.0', 'text/javascript1.1', 'text/javascript1.2', 'text/javascript1.3',
  'text/javascript1.4', 'text/javascript1.5', 'text/jscript', 'text/livescript', 'text/x-ecmascript', 'text/x-javascript']);
// inline kinds that are not classic or module scripts but that CSP still checks against script-src
const OTHER_INLINE = new Set(['importmap', 'speculationrules']);
// elements whose content is raw text: a "<script" inside one is not a tag
const RAW_TEXT = new Set(['style', 'textarea', 'title', 'xmp', 'iframe', 'noembed', 'noframes', 'noscript']);
// foreign content: inside these, nothing is raw text and a <script> is parsed
// as markup (character references and CDATA decoded) before it is hashed
const FOREIGN = new Set(['svg', 'math']);
const WS = /[\t\n\f\r ]/;

/** The script type the HTML standard derives from a script element's attributes. */
export function scriptType(attrs) {
  if (Object.hasOwn(attrs, 'type')) {
    const t = attrs.type.trim().toLowerCase();
    if (t === '') return 'classic';
    if (t === 'module') return 'module';
    if (JS_MIME.has(t)) return 'classic';
    if (OTHER_INLINE.has(t)) return t;
    return 'data';
  }
  if (Object.hasOwn(attrs, 'language') && attrs.language !== '') return JS_MIME.has('text/' + attrs.language.trim().toLowerCase()) ? 'classic' : 'data';
  return 'classic';
}

/* a start tag's attributes from `i` (just past the tag name) to its '>'.
   Quoted values may hold '>' and '<'; names are lower-cased as the parser does.
   selfClosing: the tag ends "/>" with that "/" outside any value (<svg a=b/>
   is not self-closing: the "/" belongs to the unquoted value). */
function readAttrs(html, i) {
  const attrs = {};
  for (;;) {
    const from = i;
    while (i < html.length && (WS.test(html[i]) || html[i] === '/')) i++;
    if (i >= html.length) return { attrs, end: html.length, selfClosing: false };
    if (html[i] === '>') return { attrs, end: i + 1, selfClosing: i > from && html[i - 1] === '/' };
    let n = i;
    while (n < html.length && !WS.test(html[n]) && !'/>='.includes(html[n])) n++;
    const name = html.slice(i, n).toLowerCase();
    i = n;
    while (i < html.length && WS.test(html[i])) i++;
    let value = '';
    if (html[i] === '=') {
      i++;
      while (i < html.length && WS.test(html[i])) i++;
      const q = html[i];
      if (q === '"' || q === "'") {
        const close = html.indexOf(q, i + 1);
        const to = close < 0 ? html.length : close;
        value = html.slice(i + 1, to);
        i = to + 1;
      } else {
        let v = i;
        while (v < html.length && !WS.test(html[v]) && html[v] !== '>') v++;
        value = html.slice(i, v);
        i = v;
      }
    }
    if (name && !Object.hasOwn(attrs, name)) attrs[name] = value;   // the first of a duplicated attribute wins
  }
}

/* where a raw-text or script element's content ends: the first "</name"
   followed by white space, "/" or ">" (ASCII case-insensitive) */
function contentEnd(html, from, name) {
  const re = new RegExp(`</${name}[\\t\\n\\f\\r />]`, 'ig');
  re.lastIndex = from;
  const m = re.exec(html);
  return m ? m.index : html.length;
}

/**
 * Every <script> element in document order, as the HTML tokenizer sees it:
 * comments, doctype and raw-text elements (style, textarea, title…) are
 * skipped, quoted attribute values are honoured.
 * A <script> inside <svg> or <math> (foreign content) is refused: there the
 * parser decodes character references ("&lt;") and CDATA in the script's
 * text, and the browser hashes the decoded text, which the raw text taken
 * here is not. Such a script goes in a file, loaded from the page.
 * Returns [{ attrs, type, src, text, executable, start, end }].
 */
export function scripts(html) {
  const out = [];
  let i = 0, foreign = 0;                                        // how many <svg>/<math> are open
  while (i < html.length) {
    const lt = html.indexOf('<', i);
    if (lt < 0) break;
    if (foreign && html.startsWith('<![CDATA[', lt)) {           // a CDATA section, in foreign content only
      const c = html.indexOf(']]>', lt + 9);
      i = c < 0 ? html.length : c + 3;
      continue;
    }
    if (html.startsWith('<!--', lt)) {
      // <!--> and <!---> close at once; otherwise at the first --> (or --!>)
      if (html.startsWith('<!-->', lt)) { i = lt + 5; continue; }
      if (html.startsWith('<!--->', lt)) { i = lt + 6; continue; }
      const m = /--!?>/g; m.lastIndex = lt + 4;
      const c = m.exec(html);
      i = c ? c.index + c[0].length : html.length;
      continue;
    }
    if (html[lt + 1] === '!' || html[lt + 1] === '?') {          // doctype, CDATA-ish, processing instruction
      const gt = html.indexOf('>', lt);
      i = gt < 0 ? html.length : gt + 1;
      continue;
    }
    if (html[lt + 1] === '/') {                                  // an end tag
      const en = /^<\/([A-Za-z][^\t\n\f\r />]*)/.exec(html.slice(lt, lt + 64));
      if (en && foreign && FOREIGN.has(en[1].toLowerCase())) foreign--;
      const gt = html.indexOf('>', lt);
      i = gt < 0 ? html.length : gt + 1;
      continue;
    }
    const nm = /^<([A-Za-z][^\t\n\f\r />]*)/.exec(html.slice(lt, lt + 64));
    if (!nm) { i = lt + 1; continue; }                           // a bare "<" in text
    const name = nm[1].toLowerCase();
    const { attrs, end, selfClosing } = readAttrs(html, lt + nm[0].length);
    if (name === 'script' && foreign) {
      throw new Error('a <script> inside <svg> or <math>: there the browser decodes "&…;" and CDATA in its text before hashing it, so its hash cannot be taken from the source (move the code to a script file loaded from the page)');
    }
    if (FOREIGN.has(name)) {
      if (!selfClosing) foreign++;
      i = end;
    } else if (name === 'script') {
      const close = contentEnd(html, end, 'script');
      const text = html.slice(end, close);
      // "<!--" then "<script" inside a script switches the tokenizer into its
      // double-escaped state, where "</script>" no longer ends the element:
      // the text found here would not be what the browser runs.
      if (/<!--[\s\S]*<script[\t\n\f\r />]/i.test(text)) {
        throw new Error('a <script> holds "<!--" followed by "<script": the browser would not end it where this parser does; split the string (e.g. "<\\!--")');
      }
      const type = scriptType(attrs);
      const src = Object.hasOwn(attrs, 'src');
      out.push({ attrs, type, src, text, executable: !src && type !== 'data' && text !== '', start: lt, end: close });
      const gt = html.indexOf('>', close);
      i = gt < 0 ? html.length : gt + 1;
    } else if (RAW_TEXT.has(name) && !foreign) {
      i = contentEnd(html, end, name);
    } else if (name === 'plaintext' && !foreign) {
      break;
    } else {
      i = end;
    }
  }
  return out;
}

/** 'sha256-…' source expression for one script text, as the browser computes it. */
export const hashSource = (text) =>
  `'sha256-${createHash('sha256').update(text.replace(/\r\n?/g, '\n'), 'utf8').digest('base64')}'`;

/** The hash sources of every inline executable script, in document order, without repeats. */
export const scriptHashes = (html) => [...new Set(scripts(html).filter((s) => s.executable).map((s) => hashSource(s.text)))];

/**
 * The Supabase origin the page's lead-store switch points at, or null when the
 * switch is off (or the page has none). Throws when it cannot be decided.
 */
export function supabaseOrigin(html) {
  const cfg = scripts(html).filter((s) => s.executable && /NUMIDEA_SUPABASE_(URL|KEY)/.test(s.text));
  let url = '';
  for (const s of cfg) {
    // the sandbox's global is its window, as in the browser: `var X` and
    // `window.X` both land on it
    const win = {}; win.window = win;
    try { runInNewContext(s.text, win, { timeout: 200 }); }
    catch (e) { throw new Error(`the Supabase switch script does not run in a bare sandbox (${e.message}); set window.NUMIDEA_SUPABASE_URL to a literal`); }
    if (win.NUMIDEA_SUPABASE_URL) url = win.NUMIDEA_SUPABASE_URL;
  }
  if (!url) return null;               // off (a key alone does nothing: app.js posts only with both)
  let u;
  try { u = new URL(String(url)); } catch (e) { throw new Error(`NUMIDEA_SUPABASE_URL is not a URL: ${url}`); }
  if (u.protocol !== 'https:') throw new Error(`NUMIDEA_SUPABASE_URL must be https: ${url}`);
  return u.origin;
}

/** The policy string for a page, from its own markup. */
export function cspPolicy(html, kind = 'page') {
  if (!KINDS.includes(kind)) throw new Error(`unknown CSP kind "${kind}" (want ${KINDS.join(' or ')})`);
  const embed = kind === 'embed';
  const supa = supabaseOrigin(html);
  const d = [
    ['default-src', "'self'"],
    ['script-src', "'self'", ...(embed ? ["'unsafe-eval'"] : []), ...scriptHashes(html)],
    // style="" custom properties, CSSOM writes and the pages' own <style> blocks
    ['style-src', "'self'", "'unsafe-inline'"],
    ['img-src', "'self'", 'data:', ...(embed ? ['blob:'] : [])],
    ['font-src', "'self'", ...(embed ? ['data:'] : [])],
    ['connect-src', "'self'", ...(supa ? [supa] : [])],
    ['media-src', "'self'"],
    ['frame-src', "'self'"],
    ['worker-src', "'none'"],
    ['object-src', "'none'"],
    ['base-uri', "'self'"],
    // the contact form posts to a mailto: when scripts are off. Kept last, so
    // the meta reads `mailto:">`: check.mjs takes every "mailto:<address>" in
    // a page for a contact address, and "mailto:; …" would read as one
    ['form-action', 'mailto:'],
  ];
  return d.map((x) => x.join(' ')).join('; ');
}

// an existing policy meta, wherever it is, with its own line
const META_RE = /[ \t]*<meta\b[^>]*\bhttp-equiv\s*=\s*(["']?)content-security-policy\1(?=[\s/>])[^>]*>[ \t]*(?:\r?\n)?/gi;
const VIEWPORT_RE = /<meta\b[^>]*\bname\s*=\s*["']?viewport\b["']?[^>]*>/i;

/** The page with its policy meta written (or rewritten) right after the viewport meta. */
export function withCsp(html, kind = 'page') {
  const bare = html.replace(META_RE, '');
  const vp = VIEWPORT_RE.exec(bare);
  if (!vp) throw new Error('no <meta name="viewport"> to anchor the CSP meta after');
  const at = vp.index + vp[0].length;
  // a meta policy governs only what follows it: nothing it covers may come first
  const early = /<(script|style|link|base)\b/i.exec(bare.slice(0, vp.index));
  if (early) throw new Error(`a <${early[1].toLowerCase()}> comes before the viewport meta, so the CSP meta would not govern it`);
  const eol = (/^\r?\n/.exec(bare.slice(at)) || ['\n'])[0];
  const meta = `<meta http-equiv="Content-Security-Policy" content="${cspPolicy(bare, kind)}">`;
  return bare.slice(0, at) + eol + meta + bare.slice(at);
}

/** The policy a page's CSP meta carries now, or null (for checks and probes). */
export function cspOf(html) {
  const metas = [...html.matchAll(META_RE)];
  if (metas.length !== 1) return null;
  return (/\bcontent\s*=\s*"([^"]*)"/i.exec(metas[0][0]) || [])[1] ?? null;
}
