/**
 * Comment stripping for the staged copies of the stylesheets and scripts
 * (scripts/stage-site.mjs runs it over _site/ after the copy; the repository
 * keeps its comments). styles.css was 30% comments and app.js 22%: 6.6 and
 * 7.3 KB gzipped that every visitor downloaded and no browser read. A
 * minifier would take more, but it rewrites code, and this site's rule is
 * that what is served is what is reviewed; a comment is the one thing that
 * can go without changing a token. Pages are never touched: their inline
 * scripts are hashed in the CSP meta (scripts/lib/csp.mjs), and external
 * files are not.
 *
 * Not a regular expression over the text: the source is walked token by
 * token, so a "//" in a URL string, a "/*" in a template literal or a
 * regex, and a CSS url(...) holding "//" are kept as they are.
 *   stripJs   strings, template literals (with ${ } nesting), regex
 *             literals (told from division by the token before the slash)
 *   stripCss  strings and unquoted url(...) arguments
 * A block comment that spans lines becomes one newline, since in JavaScript
 * it counts as a line terminator (automatic semicolon insertion after
 * `return`, say); one on a line becomes a space, so `a/**\/b` stays two
 * tokens in CSS. Licence headers stay: a comment opening with "/*!" or
 * naming @license or @preserve is what a minifier keeps too, and
 * workspacehq/embed/vendor ships React under its MIT header.
 * scripts/stage-check.mjs proves the result on every staged file: each
 * stylesheet parses to the same rules as its source and each script compiles.
 */

const KEEP = (c) => c.startsWith('/*!') || /@(?:license|preserve)\b/.test(c);
const gap = (c) => (KEEP(c) ? c : c.includes('\n') ? '\n' : ' ');
// the token before a "/" that makes it a division, not a regex: a value
// (identifier, number, closing bracket, postfix ++/--), unless the
// identifier is a keyword a regex may follow
const REGEX_AFTER = new Set(['return', 'typeof', 'instanceof', 'in', 'of', 'new', 'delete', 'void', 'throw', 'case', 'do', 'else', 'yield', 'await']);

/* JavaScript without its comments */
export function stripJs(src) {
  let out = '', i = 0, last = '';            // last significant token's text
  const n = src.length;
  const tpl = [];                            // template literal nesting: brace depth inside each ${ }
  const isIdent = (ch) => /[A-Za-z0-9_$À-￿]/.test(ch);
  const regexAllowed = () => {
    if (last === '') return true;
    if (last === ')' || last === ']' || last === '++' || last === '--' || last === "'" || last === '"' || last === '`') return false;
    if (/^[0-9.]/.test(last)) return false;
    if (isIdent(last[0])) return REGEX_AFTER.has(last);
    return true;                             // a punctuator
  };
  const readString = (q) => {
    let j = i + 1;
    while (j < n && src[j] !== q) { if (src[j] === '\\') j++; if (src[j] === '\n' && q !== '`') break; j++; }
    return j + 1;
  };
  while (i < n) {
    const ch = src[i], nx = src[i + 1];
    // inside a template literal's text
    if (tpl.length && tpl[tpl.length - 1] === -1) {
      if (ch === '\\') { out += src.slice(i, i + 2); i += 2; continue; }
      if (ch === '`') { out += ch; i++; tpl.pop(); last = '`'; continue; }
      if (ch === '$' && nx === '{') { out += '${'; i += 2; tpl[tpl.length - 1] = 0; last = '{'; continue; }
      out += ch; i++; continue;
    }
    if (ch === '/' && nx === '/') {          // a line comment: the line break stays
      const e = src.indexOf('\n', i);
      i = e < 0 ? n : e; continue;
    }
    if (ch === '/' && nx === '*') {
      const e = src.indexOf('*/', i + 2);
      const c = src.slice(i, e < 0 ? n : e + 2);
      out += gap(c); i += c.length; continue;
    }
    if (ch === '"' || ch === "'") { const e = readString(ch); out += src.slice(i, e); last = ch; i = e; continue; }
    if (ch === '`') { out += ch; i++; tpl.push(-1); last = '`'; continue; }
    if (ch === '/' && regexAllowed()) {      // a regex literal: to the closing slash, classes and escapes honoured
      let j = i + 1, cls = false;
      for (; j < n && src[j] !== '\n'; j++) {
        const c = src[j];
        if (c === '\\') { j++; continue; }
        if (cls) { if (c === ']') cls = false; continue; }
        if (c === '[') cls = true; else if (c === '/') break;
      }
      if (src[j] === '/') { j++; while (j < n && /[a-z]/i.test(src[j])) j++; out += src.slice(i, j); last = '/re/'; i = j; continue; }
      // no closing slash on the line: it was a division after all
    }
    if (/\s/.test(ch)) { out += ch; i++; continue; }
    if (isIdent(ch)) {
      let j = i + 1; while (j < n && isIdent(src[j])) j++;
      last = src.slice(i, j); out += last; i = j; continue;
    }
    if (tpl.length) {                        // braces inside a ${ } count, so its end is found
      if (ch === '{') tpl[tpl.length - 1]++;
      else if (ch === '}') { if (tpl[tpl.length - 1] === 0) { tpl[tpl.length - 1] = -1; out += ch; i++; last = '}'; continue; } tpl[tpl.length - 1]--; }
    }
    if ((ch === '+' || ch === '-') && nx === ch) { out += ch + ch; last = ch + ch; i += 2; continue; }
    out += ch; last = ch; i++;
  }
  return tidy(out);
}

/* CSS without its comments */
export function stripCss(src) {
  let out = '', i = 0;
  const n = src.length;
  while (i < n) {
    const ch = src[i];
    if (ch === '/' && src[i + 1] === '*') {
      const e = src.indexOf('*/', i + 2);
      const c = src.slice(i, e < 0 ? n : e + 2);
      out += gap(c); i += c.length; continue;
    }
    if (ch === '"' || ch === "'") {
      let j = i + 1;
      while (j < n && src[j] !== ch) { if (src[j] === '\\') j++; j++; }
      out += src.slice(i, j + 1); i = j + 1; continue;
    }
    // url( with an unquoted argument: everything to the closing paren is the URL
    if (/^url\(\s*[^'")\s]/i.test(src.slice(i, i + 6))) {
      const e = src.indexOf(')', i);
      const u = src.slice(i, e < 0 ? n : e + 1);
      out += u; i += u.length; continue;
    }
    out += ch; i++;
  }
  return tidy(out);
}

/* the lines the comments left behind: no trailing spaces, no run of blank lines */
const tidy = (s) => s.replace(/[ \t]+$/gm, '').replace(/\n{3,}/g, '\n\n');

/* by file name; anything else is returned as it is */
export function stripComments(text, file) {
  if (/\.css$/i.test(file)) return stripCss(text);
  if (/\.m?js$/i.test(file)) return stripJs(text);
  return text;
}
