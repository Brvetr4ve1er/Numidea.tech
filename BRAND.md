# Numidea Labs — Editorial System

> **Quiet ground. Loud type. One accent, used once.**

---

## 1 · Creative direction

The studio's product is judgement, not volume. So the site behaves like a
well-set magazine rather than a signage system: the page is calm, the
typography does the shouting, and colour is rationed to almost nothing.

Three decisions carry the whole thing:

1. **The serif is the brand.** Instrument Serif at 150px, sentence case, tight
   leading. An editorial serif in a software studio's mouth reads as
   confidence — it is the opposite of the template.
2. **Flare is a highlight, not a field.** The orange survives from the previous
   system but appears on roughly 2% of any screen: one italic phrase per
   heading, the hairline in a kicker, a caption, a link underline.
3. **Hairlines, not boxes.** Nothing is boxed. Sections are separated by
   whitespace and 1px rules. Depth comes from scale contrast.

**Emotion target:** composed, unhurried, expensive. The viewer should feel the
studio has nothing to prove.

## 2 · Visual mood

Swiss grid discipline · Kinfolk/Monocle pacing · Aesop restraint ·
gallery-catalogue image treatment. Warm paper rather than white, warm
near-black rather than pure black — the whole surface sits slightly toward
the yellow end so it reads as printed matter, not as screen.

## 3 · Layout blueprint

```
Grid        max 1240 · gutter clamp(20 → 64) · 8px baseline
Section     clamp(88 → 140) vertical
Rhythm      statement → numbers → alternating spreads → index →
            steps → portrait → list → questions → closing spread → dark coda
Radius      3px. one value. barely present.
Rules       1px. never 2px. never a box.
Elevation   none, except floating hero mockups
```

**Pacing** — the page alternates deliberately: a full-width statement, a
four-numeral band, seven image spreads with the image side flipping each
row, a typographic services index, a numbered method list, a founder
portrait block, a quiet stack list, an FAQ table of contents, a two-column
closing spread, then a dark footer as the final chord.

## 4 · Typography

| Role | Face | Treatment |
| --- | --- | --- |
| Display | **Instrument Serif** 400 + italic | 42–150px, leading .94–1.05, tracking −.015 to −.025em, sentence case |
| UI / body | **Instrument Sans** 400/500 | 15–19px, leading 1.6 |
| Spec | **JetBrains Mono** 400/500 | 10–11px, tracking .14–.16em, uppercase — kickers, figure numbers, labels |
| RTL | **IBM Plex Sans Arabic** | never inherits italic or negative tracking; leading opens to 1.3+ |

Scale contrast is the point: a 150px headline sitting above an 11px mono
label, with nothing in between, is what makes the page feel edited.

## 5 · Colour

```
paper   #F7F4EF  ground        ink     #16130F  type
tint    #EFEAE2  pacing band   ink-70  #4A453D  secondary
rule    #DDD6CB  hairline      ink-45  #7A736A  captions
FLARE   #F93E06  the accent — display size only
```

Two accent values, deliberately. **`--accent`** (#F93E06) is used at display
sizes where 3:1 is the WCAG bar. **`--accent-ink`** (#B0300A) carries every
accent string below 24px, where the bar is 4.5:1 — measured, not assumed.

**Three palettes only:** Paper (default), Ink (dark), Sand (warm). No rainbow.

Measured contrast: body 16.9:1 (paper), 15.7:1 (ink), 13.6:1 (sand);
accent captions 5.9 / 7.5 / 6.2:1; secondary copy 8.7 / 8.5 / 6.5:1.

## 6 · Image treatment

Client screenshots are the only photography, so they are treated as plates:
4:3 crops, top-anchored, 3px radius, no border, no browser chrome. Each
spread carries a mono figure number — `FIG. 03/07` — set above the row.
The image column stays the wide one on both alternations; the columns swap
with the order so the picture never lands in the narrow half.

The hero deck is the one licensed exception to the no-shadow rule: three
floating mockups with a long soft shadow, because floating objects need
ground shadow to be legible as objects.

## 7 · Motion

Slow and quiet: a 14px rise and a fade over 700ms on
`cubic-bezier(.22,1,.36,1)`. Numerals ease to their value and stop.
Nav underlines wipe from the left. Nothing bounces, nothing parallaxes.
`prefers-reduced-motion` removes all of it.

## 8 · The logo

The delivered mark drops into one place, marked in `index.html`:

```html
<a class="logo" href="#top">
  <!-- SWAP POINT: replace .brick with the delivered mark -->
  Num<i>idea</i> Labs<span class="brick">DZ</span>
</a>
```

Currently the wordmark is set in Instrument Serif with *idea* italic and a
small mono `DZ` tag. Replace `.brick` with an inline `<svg>`; the lockup,
spacing and dark-footer inversion are already handled. One edit propagates
to navbar, footer and 404.

## 9 · Quality audit

| Check | Result |
| --- | --- |
| Body contrast, all three palettes | 13.6–16.9:1 |
| Accent-as-small-text | 5.9–7.5:1 after introducing `--accent-ink` |
| Horizontal overflow, 1440 / 1024 / 390 | none |
| RTL (Arabic) | mirrors; serif italic and negative tracking suppressed |
| JS errors | none |
| Reduced motion | all transforms and transitions removed |

## 10 · Open

- **The logo** — you're drawing it. Swap point above.
- **Photography** — there is none. Real founder portrait and any
  environmental/product shots would lift this further than any CSS change.
- **Case-study depth** — the explorer supports per-project
  problem/approach/outcome in three languages; only scaffolding exists.
- **Page length** — ~16 desktop screens. Air is deliberate, but if it reads
  as slow, the lever is the work-spread gap (`--s6`) and `--section`.
