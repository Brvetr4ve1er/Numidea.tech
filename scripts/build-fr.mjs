/**
 * Moved: the French bake is scripts/build-lang.mjs, the one generator of the
 * three language pages (index.html, en/, ar/). This re-export stays only
 * until check.mjs 8e imports bakeFr from build-lang.mjs; then it goes.
 */
export { bakeFr, ldText } from './build-lang.mjs';
