/**
 * The hub's loops in a Playwright page: what each img[data-anim] shows.
 *
 * Each loop's <img> holds its still (the poster frame) in src and names its
 * animated WebP in data-anim; hub/app.js swaps the animation in once, when
 * half of the picture is on screen, and never with reduced motion, where
 * the <picture>'s (prefers-reduced-motion: reduce) <source> keeps the still
 * (check.mjs block 17b holds the markup and the files to that). So once the
 * whole page has been scrolled through, each loop shows its animation, or,
 * with reduced motion, its still, decoded (complete, with a size).
 *
 * Shared by audit.mjs (no preference: the animations), sweep.mjs and
 * keys.mjs (reduced motion: the stills). Pass it to page.evaluate after the
 * scroll; it runs in the page, so it uses nothing from this module:
 *
 *   const loops = await page.evaluate(loopState);
 *   const wrong = loops.filter((l) => !l.ok);   // [{ name, want, shows, ok }]
 */
export function loopState() {
  const rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const file = (u) => (u || '').split(/[?#]/)[0].split('/').pop();
  return [...document.querySelectorAll('img[data-anim]')].map((i) => {
    const src = i.closest('picture') && i.closest('picture').querySelector('source[media*="prefers-reduced-motion"]');
    const still = (src && (src.getAttribute('srcset') || '').trim().split(/\s+/)[0]) || i.getAttribute('src');
    const want = new URL(rm ? still : i.getAttribute('data-anim'), document.baseURI).href;
    return { name: file(i.getAttribute('data-anim')), want: file(want), shows: file(i.currentSrc) || '(nothing)',
      ok: i.currentSrc === want && i.complete && i.naturalWidth > 0 };
  });
}
