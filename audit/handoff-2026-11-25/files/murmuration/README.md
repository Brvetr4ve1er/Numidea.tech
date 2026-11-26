# Alliance Travel · Murmuration (vanilla port)

A flock of a few thousand birds folds through the sky, then spells a word,
holds it, scatters, and spells the next one. The pointer scares the flock
open. Ported from the React `MurmurationWordmark` the owner pasted, with no
React and no build step, so it drops into the plain-HTML sites.

## Files
- `murmuration.js`: the module, about 9 KB unminified. It exposes `window.AllianceMurmuration.mount(el, opts)` and returns `{ destroy, seek }`.
- `demo.html`: two ready-made elements in the charter colours: a navy hero that cycles through Bali, Vietnam, Istanbul and Tunisie, and a sand closing band that spells "Partez.".
- `previews/`: PNGs at 2x. They show the hero in free flight, forming Bali and forming Vietnam, plus the sand band.

## Options
| option | default | notes |
|---|---|---|
| `words` | `['Alliance']` | One word per formation, in order. Keep each word short. |
| `preset` | `navy` | Also `sand`, `mint` and `dusk`. All use navy #002C51, mint #9CE8B2 and sand #EFE8DF. |
| `palette` | n/a | Overrides `{skyTop, skyLow, sun, ink, route}`. |
| `birds` | 4200 | Scales with the element's area, from 500 to 9000. |
| `flyFor` / `holdFor` | 6 / 3.2 s | Free flight, then the hold. Forming takes 2.4 s and the release 0.6 s. |
| `route` | true | Draws the charter's dashed flight path with a pin at each end. It switches off automatically below 640 px wide. |
| `interactive` | true | Makes the pointer act as a hawk. |
| `fontFamily` / `fontWeight` | Sora 800 | Load the font before mounting. The module re-samples on `document.fonts.ready`. |
| `wordY` | 0.44 | Vertical centre of the word, as a fraction of the height. |
| `onWord(word, i)` | n/a | Fires on each new word. The demo uses it to update a "now showing" label. |

## Behaviour and accessibility
- **Reduced motion:** with `prefers-reduced-motion`, the first word is drawn still and nothing moves.
- **Screen readers:** the canvas is `aria-hidden`. The current word sits in a visually hidden `aria-live` span.
- **Performance:** the flock pauses off-screen (IntersectionObserver), DPR is capped at 2, and it re-lays out on resize.
- **Errors:** none in the console (checked in headless Chromium).

## Where it could go (publishing session decides)
- **Hero:** the alliancetravel.app home hero, or the Studio case page `hub/src/cases/alliance.html` as a live chapter opener.
- **Closing band:** the sand "Partez." band works as a closing CTA band on any destination page.

## Not done
- **Planes:** tiny plane-shaped birds would cost more per frame. The current birds are simple V shapes.
- **Site integration:** it is not wired into any site. The alliancetravel.app repo isn't in this project's GitHub scope, and the Numidea site has a 0-infinite-animation rule in check.mjs. A permanent loop like this would need an exemption or a "plays N cycles then rests" mode.
