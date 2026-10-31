/**
 * The Arabic language switch's glyph, drawn: an isolated ʿayn (ع) as one
 * stroked path, the way the pages' other icons are drawn. Typed, the one
 * letter took the Arabic face through styles.css's [lang="ar"] rule, 42 KB
 * of IBM Plex Sans Arabic on every French and English visit for a 12px
 * glyph. The control keeps its aria-label naming the language; the drawing
 * is hidden from assistive technology. Sized by the stylesheets' .lang .ayn
 * rule (.95em, on the text's baseline); the width and height attributes are
 * the no-stylesheet size. Used by scripts/build-scene.mjs and
 * scripts/build-legal.mjs; index.html carries the same markup three times.
 */
export const AYN = '<svg class="ayn" viewBox="0 0 24 24" width="12" height="12" aria-hidden="true"><path d="M16.2 6.2C14.4 4.2 9.8 4.4 9.2 7.8C8.7 10.6 11.6 12 15.2 11.3C9.4 12.4 4.8 15 5.6 18.6C6.4 22.2 13.6 22.6 18.6 18.6"/></svg>';
