# Numidea Labs — Brand System

> **Industrial signage, poured soft.**
> Three colours, one diagonal, everything in a rounded box, and say less than you want to.

This is the identity **as built into the site**. Every rule here is enforced by
`assets/styles.css`; the token block at the top of that file is the only place
colour, radius, spacing and motion are defined.

---

## 1 · Style DNA — the immutable traits

| # | Trait | How the site enforces it |
| --- | --- | --- |
| 01 | **Container-first** | Nothing floats. Every mark, label, stat and control sits inside a bordered box or pill. |
| 02 | **Negative space is the letterform** | Display type is set at `0.82` leading and `-0.045em` tracking — the counters carry the read. |
| 03 | **Stacked verticality** | The hero stacks three statements, not one line. `ON CONSTRUIT. / ON LIVRE. / ON RÉPOND.` |
| 04 | **Soft-serve terminals** | Radius is a four-value set: `4 / 12 / 28 / 999`. Nothing between, no sharp miters. |
| 05 | **Optical keyline** | Every surface is ringed by a 2px contour in `--ink`. |
| 06 | **Three-tone max per surface** | Enforced by the semantic token set: `ground / ink / counter` + one `field`. |
| 07 | **Bone, not white** | `#FFFFFF` appears nowhere. `--bone #F5E6E0` is the light surface. |
| 08 | **Extreme ink density** | Display type runs to the container edge; the hero fills its field. |
| 09 | **Diagonal shear** | One 38° band crosses the hero field. Exactly one, exactly once. |
| 10 | **Spec-sheet numerals** | Every project card carries a mono index — `01/07` … `07/07`. |

**Banned and absent from the codebase:** pure white, pure black, gradients,
drop shadows, bevels, 1px borders, parallax, fade-in-up, floating idle states.

---

## 2 · Colour — the five approved pairings

Primitives are fixed. Semantic tokens remap per `[data-theme]`; the theme
switcher exposes exactly these five and nothing else.

```
PRIMITIVES
  --flare    #F93E06   --graphite #2A2D2C   --bone     #F5E6E0
  --espresso #2A1E18   --sand     #DFD5BC   --fog      #E9E9E7   --void-c #121312
  --acid     #DFF205   --marigold #E9A20B   --cobalt   #16224E
  --signal   #E31E24   --moss     #3A4A2A   --coral    #E2724F

SEMANTIC (per theme)
  --ground   page surface        --ink      type + every 2px border
  --counter  card / panel        --field    the dominant colour block
  --on-field type on that block  --band     alternate section block
  --on-band  type on the band    --accent   the 2% event colour
```

| Theme | Pairing | Field | Ink | Ground |
| --- | --- | --- | --- | --- |
| **flare** *(default)* | Flare + Graphite + Bone | Flare | Graphite | Bone |
| **espresso** | Espresso + Sand + Coral | Espresso | Espresso | Sand |
| **marigold** | Marigold + Cobalt + Bone | Marigold | Cobalt | Bone |
| **void** | Void + Acid + Graphite | Graphite | Fog | Void |
| **signal** | Signal + Fog + Graphite | Signal | Graphite | Fog |

**Ratio law — 60/30/8/2.** The page holds it structurally: full-bleed field and
band blocks carry the 60, bone ground the 30, keylines and type the 8, accent
the 2.

**Contrast is verified, not assumed.** All five pairings were measured in a
headless browser: display type ≥ 3:1 (WCAG large text), body copy ≥ 4.5:1.
The lowest body reading is 4.72:1; the lowest display reading is 3.79:1.
The rule that keeps this true: **body-size copy never sits loose on a field** —
it goes in a bone counter plate (see `.lede`) or on a dark band.

---

## 3 · Typography

| Tier | Face | Use |
| --- | --- | --- |
| 1 — Display | **BLOKFORM** *(pending — see below)* | 1–3 words, stacked, uppercase, `-0.045em`, `0.82` leading |
| 2 — UI | **Space Grotesk** 500/700 | headings, body, controls |
| 3 — Spec | **JetBrains Mono** 500/700 | index labels, kickers, captions, all numerals, `+0.14em` upper |
| RTL | **IBM Plex Sans Arabic** 500/700 | the whole Arabic experience — no uppercase, no negative tracking |

**BLOKFORM is not drawn yet.** Space Grotesk 700 stands in. When the face
exists, change **one line** — `--font-display` in `:root`. Every display rule
reads through that token, so the swap is total and instant.

Arabic never inherits the Latin display treatment: `text-transform` and negative
tracking are explicitly reset for `[dir="rtl"]`, and leading opens to `1.22–1.25`.

---

## 4 · Logo

The delivered mark drops into **one place**, marked in `index.html`:

```html
<a class="logo" href="#top">
  <!-- SWAP POINT: replace .brick with the delivered mark -->
  <span class="brick" aria-hidden="true">NL</span>Num<i>idea</i> Labs
</a>
```

Replace `.brick` with an inline `<svg>` or `<img>`. The plate around it —
keyline, radius, padding, hover inversion — is already built and needs no change.
The same lockup is used in the navbar, the footer and the 404 page, so one edit
propagates everywhere.

Interim mark: a stacked `NL` monogram in a Flare brick, mirrored in
`assets/favicon.svg`. The wordmark is forced `direction: ltr` so it never
reorders inside the Arabic layout.

**Clearspace** 25% of container width · **minimum** 32px digital / 12mm print ·
**forbidden**: rotation, third-colour outlines, gradients, stretching, placing
on photography without a solid container behind it.

---

## 5 · Layout

```
Grid          max 1200, gutter 40 (mobile 20)
Baseline      8px — every space token is a multiple
Space         8 / 16 / 24 / 40 / 64 / 104 / 168
Radius        4 / 12 / 28 / 999
Border        2px solid var(--ink). always. never 1px.
Elevation     NONE — depth is colour offset + keyline
```

**Full bleed:** field and band blocks run to the frame edge via
`margin-inline: calc(50% - 50vw)` while their padding keeps type on the 1200
grid. Verified: at 1440 / 1024 / 390 the hero, proof, work and contact type all
start on the same line.

Signature layouts in use — **the brick wall** (hero), **the spec sheet** (proof
band, project index labels), **the plate** (navbar, stack strip), **the shear**
(38° hero band).

---

## 6 · Voice — The Fabricator

Blunt 8 · Warm 6 · Playful 5 · Technical 7 · Formal 2.

1. Lead with the object.
2. Sentences under nine words. Fragments preferred.
3. Specify, don't adjectify. `2px keyline` beats `bold outline`.
4. Dry, never zany. No exclamation marks. No emoji.
5. Never: premium, curated, elevated, seamless, journey, unlock, crafted.

**Live on the site** (all three languages):

```
Hero      ON CONSTRUIT. ON LIVRE. ON RÉPOND.
          WE BUILD. WE SHIP. WE ANSWER.
          نبني. نُطلق. ونردّ.
Lede      Sites, applications, pipelines de données. Conçus et codés ici,
          à Bordj Bou Arréridj. Cinq sont en ligne. Réponse sous 24 heures.
Proof     Cinq sites en ligne. Cliquables. Vérifiez.
404       Rien ici. Ça arrive.
Sign-off  Construit en lots. Jamais en série.
```

Sections still in the previous voice: services briefs, FAQ answers, founder bio.
They are accurate but wordy — a full copy pass is the next content job.

---

## 7 · Motion — mechanical, not organic

```
EASING    primary   cubic-bezier(.83,0,.17,1)     heavy in, hard out
          entrance  cubic-bezier(.16,1,.3,1)      arrives and stops dead
          overshoot cubic-bezier(.34,1.56,.64,1)  8% max
DURATION  instant 90 · quick 180 · base 280 · slow 460 · epic 820
```

Implemented:

- **THE PRESS** — controls compress on tap: `scale(.96)` + radius `28 → 12` in
  90ms. They never lift.
- **INDEX ROLL** — every counter advances in 14 discrete steps like an odometer,
  then locks. No smooth tween.
- **COUNTER FILL** — cards arrive by a hard horizontal clip wipe (mirrored in
  RTL), not a fade-up.
- `prefers-reduced-motion` kills all of it and leaves the colour states intact.

Not yet built: the **shear wipe** page transition and **container morph** —
both need a page-transition layer this static site doesn't have.

---

## 8 · What is still open

| Item | Status |
| --- | --- |
| **The logo** | You're drawing it. Swap point is live and documented above. |
| **BLOKFORM** | Not drawn. Space Grotesk stands in; one-token swap when ready. |
| Photography | No art-directed product/portrait shots exist yet — the site uses real client screenshots, which suit the specimen rule. |
| Copy pass | Hero, proof, 404 and sign-off are in voice. Services, FAQ and founder are not yet. |
| Shear-wipe transitions | Needs a page-transition layer. |
