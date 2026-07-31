# Design Audit — look & structure

*2026-07-31 · full-page captures at 1440×900 and 390×844, all reveals forced,
measured against landing-page structure and visual-hierarchy heuristics.*

## Measurements

| Metric | Value | Healthy range for a studio landing |
| --- | --- | --- |
| Page height, desktop | **15.6 viewports** (14,082 px) | 6–8 viewports |
| Page height, mobile | **24.2 viewports** (20,423 px) | 8–12 viewports |
| Top-level sections | 11 + footer | 6–8 |
| Distinct paths to the same 7 projects | 4 (grid, explorer modal, scene page, "voir tout") | 1–2 |
| Sections that are "kicker + heading + row of boxed cards" | 8 of 11 | — |

## Diagnosis — why it reads wrong

**D1 · The page is a brochure dump, not an argument.** Eleven sections at
maximum verbosity, nothing progressive. The services section alone (signature
offer + 3 families + 5-capability shelf + sticky rail) is ~4 viewports — a
catalog where a pitch should be. Length is the single biggest structural
problem, and it's worst on mobile (24 screens of thumb-scrolling).

**D2 · Card-box monotony.** Zoomed out, the page is one long column of
near-identical navy rounded-border boxes: service rows, project cards, team
cards, stack columns, FAQ items, founder card, form. Every section has the same
composition (label → big heading → boxes), so nothing creates rhythm, tension,
or a memorable moment. The alternating `band` tint is too subtle to register;
the honeycomb/grain/mesh layers add noise, not structure.

**D3 · The hero leans on a fiction.** Its only visual is a fake terminal
showing a domain that doesn't exist and metrics that were never measured —
on a site whose core positioning is "honest statuses, real proof." Meanwhile
the real proof (five live client sites with real screenshots) sits 7
viewports down. The strongest material is buried under the weakest.

**D4 · The anonymous team undercuts credibility.** Four cards with giant
single letters (N / D / S / T) read as unfinished placeholders. Directly below
them, the Founder section shows a real name, real CV, real photo slot — the
page says "real people" and "anonymous initials" within one scroll. Two
who-we-are sections where one strong one belongs.

**D5 · Proof is scattered and repetitive.** Count-up stats bar, a 6-item trust
strip, "voir les preuves", "les preuves sont plus bas", "la preuve en direct" —
five proof gestures before any actual proof. Each repetition weakens the next.

**D6 · Redundant exits.** Work grid → explorer modal → scene page → "voir tout
le portfolio" all present the same 7 projects. Choice paralysis instead of one
confident showcase.

## What is genuinely good (keep)

- The **work cards with real screenshots + per-brand accent colors** — the
  strongest element on the page; they deserve the top third, not the middle.
- The **token/theme system** — any restyle is a token swap, not a rewrite.
- The **trilingual engine, a11y patterns, honest-status idiom** — untouched.
- The **FAQ + contact** endgame — right content, right order.
- The **founder section's substance** (real CV, real links).

## Candidate directions

**A — Condense & focus (keep the Arcanum identity).** Same brand, half the
page: hero without the fake terminal (real proof strip instead), services as
one scannable grid with depth on demand, work promoted to the #2 slot, team
merged into founder, stack collapsed to a pill row, one portfolio path.
Target ≤8 viewports desktop. Lowest risk, addresses D1–D6 directly.

**B — Light-first editorial rebrand.** Flip the default to a paper-light
editorial look (big type, whitespace, thin rules; dark stays as a theme),
plus all of A's structural cuts. Bigger visual change, same structure work.

**C — Work-first restructure.** The projects open the page (near full-bleed,
hub-style confidence); pitch, method and founder trail the work. Most
dramatic; portfolio-site energy more than company-site.

## Outcome — Direction A applied

| Metric | Before | After |
| --- | --- | --- |
| Desktop height | 15.6 viewports | **~11 viewports** |
| Mobile height | 24.2 viewports | **~18 viewports** |
| Top-level sections | 11 | **8** |
| Page source | 52 KB | 43.5 KB |

What changed, mapped to the diagnosis:

- **D3** — the fake terminal is gone; the hero's visual is now a fanned deck of
  three *real* client-site screenshots linking to the work grid, and the
  headline was resized to keep the whole hero inside one viewport.
- **D1** — services collapsed from a 4-viewport catalog (rail + 3 families +
  outcome/proof/stat sub-blocks) to the signature offer + five compact cards +
  the existing collapsed capabilities shelf. Stack collapsed from five cards to
  one strip. Trust strip (pure repetition of the stats bar) removed.
- **D4** — the anonymous N/D/S/T team section removed; the Founder section
  (which already carries the team row) is the single who-we-are moment, and the
  "Équipe" nav entry points there.
- **D5** — one stats bar remains; the duplicate trust gestures are gone.
- **D2** — with the duplicates cut, the remaining sequence alternates
  composition: numbers → screenshot grid (now 3-column) → card grid → timeline
  → single card → pill strip → list → form.
- Section kickers renumbered 01–08 in all three languages; ~40 orphaned
  dictionary keys removed (still exactly ×3 per remaining key); the family-rail
  scrollspy JS and all orphaned CSS components deleted.

**Still open (mobile):** ~18 viewports is much better but not small; the next
lever is a compact mobile presentation for the 7 work cards (e.g. reduced media
height or a 2-up mobile grid). Deliberately left for a separate pass.
