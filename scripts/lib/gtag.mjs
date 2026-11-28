/**
 * The Google tag — one source of truth: `withGtag(html)`.
 *
 * Container GTM-PMF7RWVK (GA4 G-KBXP8LQJ5K). Owner decision 2026-11-14 was
 * Consent Mode denied for good with no cookie bar; since 2026-11-27 the
 * consent card (assets/consent.js) may grant analytics_storage, and only
 * that (see BRAND.md "Google tag"). The consent default is pushed to
 * dataLayer by the inline script, which therefore comes FIRST; the async
 * loader follows. The default is denied on every signal but
 * security_storage, except analytics_storage when the visitor accepted on
 * the card earlier (localStorage "numidea.consent" = "granted"). No page
 * updates consent itself (check.mjs refuses an 'update' in any page): only
 * assets/consent.js does, and only analytics_storage.
 *
 * The two scripts sit immediately after the opening <head> tag, once per
 * page, on every page of scripts/site.mjs PAGES. Not on the WorkspaceHQ
 * embeds (EXTRA_PAGES: iframes inside workspacehq/, a tag there would count a
 * visit twice) and not on shop/ (another project).
 *
 * withGtag is idempotent: any copy already on the page is removed and the
 * snippet written again right after <head>, so every generator, bump.mjs and
 * build-csp.mjs can apply it unconditionally. The snippet comes before the
 * CSP meta (the meta must follow the viewport meta, and the tag comes first by
 * design): csp.mjs and check.mjs 16 let exactly these two scripts through
 * that rule; GTM's own requests are made after the meta and are governed.
 */
export const GTAG_ID = 'GTM-PMF7RWVK';
export const GTAG_SRC = `https://www.googletagmanager.com/gtm.js?id=${GTAG_ID}`;
export const GTAG_INLINE = "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}var nc;try{nc=localStorage.getItem('numidea.consent')}catch(e){}gtag('consent','default',{ad_storage:'denied',analytics_storage:nc==='granted'?'granted':'denied',ad_user_data:'denied',ad_personalization:'denied',functionality_storage:'denied',personalization_storage:'denied',security_storage:'granted'});gtag('js',new Date());";
export const GTAG_INLINE_TAG = `<script>${GTAG_INLINE}</script>`;
export const GTAG_LOADER_TAG = `<script async src="${GTAG_SRC}"></script>`;
export const GTAG_SNIPPET = `${GTAG_INLINE_TAG}\n${GTAG_LOADER_TAG}`;

const HEAD_RE = /<head(?=[\s>])[^>]*>/i;
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// a copy of the snippet, with the line break that follows it
const COPY_RE = new RegExp(`${esc(GTAG_INLINE_TAG)}\\r?\\n?${esc(GTAG_LOADER_TAG)}\\r?\\n?`, 'g');

/** The page with the Google tag right after its opening <head> tag, once. */
export function withGtag(html) {
  const bare = html.replace(COPY_RE, '');
  const m = HEAD_RE.exec(bare);
  if (!m) throw new Error('no <head> to put the Google tag after');
  const at = m.index + m[0].length;
  const eol = /^\r?\n/.test(bare.slice(at)) ? '' : '\n';
  const nl = bare.slice(at, at + 2) === '\r\n' ? '\r\n' : '\n';
  return bare.slice(0, at) + nl + GTAG_SNIPPET.replace(/\n/g, nl) + (eol ? nl : '') + bare.slice(at);
}
