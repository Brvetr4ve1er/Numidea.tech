/**
 * The published copy of 404.html, with its links from the site root.
 *
 * Every host answers a missing URL at ANY depth with 404.html, so a relative
 * link in it resolves against the missing folder. With JavaScript on, its
 * first head script writes the stylesheet and font links from the site root,
 * and its second points the home links there. With JavaScript off only the
 * markup is left: the <noscript> copy of the links and the two
 * href="index.html" home links in <body>, which in the repository stay
 * relative so the file still previews from disk (file://). The site root is
 * known when the site is staged, so scripts/stage-site.mjs rewrites them in
 * _site/404.html with this:
 *
 *   stage404(html, '/Numidea.tech/')   GitHub Pages (the repository subpath,
 *                                      from scripts/site.mjs BASE)
 *   stage404(html, '/')                Netlify, Vercel: the domain root
 *
 * Only the <noscript> block and <body> change, never a <script>, so the CSP
 * hashes still match. A 404.html that no longer has what is rewritten throws,
 * so staging (and check.mjs block 6, which runs this on every check) fails
 * instead of publishing a page that is unstyled one folder down.
 */
export function stage404(html, base) {
  if (!/^\/(?:[^/?#\s]+\/)*$/.test(base)) throw new Error(`stage404: the site root "${base}" must start and end with "/"`);
  const ns = /<noscript>[\s\S]*?<\/noscript>/.exec(html);
  if (!ns || !ns[0].includes('href="assets/')) throw new Error('stage404: 404.html has no <noscript> block with assets/ links to rewrite');
  const at = html.indexOf('<body');
  if (at < 0 || ns.index > at) throw new Error('stage404: 404.html has no <body> after its head <noscript>');
  const body = html.slice(at);
  if (!body.includes('href="index.html"')) throw new Error('stage404: 404.html has no href="index.html" home link in <body>');
  return html.slice(0, ns.index)
    + ns[0].replaceAll('href="assets/', `href="${base}assets/`)
    + html.slice(ns.index + ns[0].length, at)
    + body.replaceAll('href="index.html"', `href="${base}"`);
}
