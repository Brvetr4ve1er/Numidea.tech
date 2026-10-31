# Notice — what LICENSE covers, and what it does not

`LICENSE` is the CC0 1.0 Universal public-domain dedication. It is the
studio's own dedication, so it reaches only what the studio made and may give
away: the markup of the pages, the stylesheets and scripts under `assets/`,
the generators and gates in `scripts/`, the workflows, the documentation and
the knowledge base. The material below sits in the same repository but is not
the studio's to dedicate, or has no licence chosen yet. Each item keeps its own
terms; CC0 grants nothing over it.

## Fonts — SIL Open Font License 1.1

Self-hosted, served from this site, never from a third party. The OFL lets the
files be bundled, embedded and redistributed as long as they are not sold by
themselves; a Reserved Font Name may not be used for a modified font.

| Folder | Families | Licence text |
|---|---|---|
| `assets/fonts/` | Cinzel, Cinzel Decorative, Geist, Geist Mono, IBM Plex Sans Arabic, Syne (woff2 subsets) | `assets/fonts/OFL.txt` — its copyright line names the Cinzel Project Authors; the other five families' copyright lines are not reproduced in it |
| `workspacehq/fonts/` | Press Start 2P (Reserved Font Name "Press Start 2P"), VT323 | `workspacehq/fonts/OFL.txt`, both copyright lines copied from the files' name tables |
| `workspacehq/embed/fonts/` | IBM Plex Mono Regular, Medium, SemiBold (Copyright 2017 IBM Corp.) | `workspacehq/embed/fonts/OFL.txt` |

## React 18.3.1 — MIT

`workspacehq/embed/vendor/react.production.min.js` and
`react-dom.production.min.js` are the React 18.3.1 UMD production builds,
Copyright (c) Facebook, Inc. and its affiliates, under the MIT licence. Each
file's header says so and refers to the LICENSE file of the React source tree,
which is not copied here (`react-dom` also embeds a Modernizr 3.0.0pre custom
build, MIT, per its own header).

## `workspacehq/embed/support.js` — licence unknown

Its header says it was generated from `dc-runtime/src/*.ts`; that source is
not in this repository and the file states no licence. Its origin and terms
are not established, so it must be treated as not licensed for reuse. CC0 does
not apply to it.

## Client logos and captures — their owners'

`assets/clients/` holds the four clients' own logos (alliance, almaflow,
bordjsteel, nomara). `assets/previews/*.webp` and `assets/work/<client>/` are
captures of the clients' live sites: the sites, their content and their brands
remain the clients' property, shown here as references, as the legal page
states. The `glaive` and `workspacehq` captures show the studio's own demo and
product.

## The owner's illustrations — no licence chosen yet

`hub/art/` and `hub/loops/` are the founder's own drawings and design pieces
(the hub's art, the diary and band illustrations, his Behance covers, the
animated loops). He has not chosen a licence for them: `ip.licence` in
`scripts/legal-data.mjs` is still null, and the same choice covers the site's
own text, its illustrations and the CV (`assets/cv_yasser_hamisse_2026.pdf`).
As written, `LICENSE` would cover them; the owner may instead narrow it to the
code, as `scripts/legal-data.mjs` explains. Until he decides, nothing here
grants a right to reuse them, and the legal page will state his choice when it
is published.

## Third-party skills — `.claude/skills/`

Tooling for the studio's creative work, never deployed (`NOT_DEPLOYED` in
`scripts/site.mjs`) but in the public repository. Each skill keeps the licence
of its author, read from the licence file in its folder:

| Skill | Licence file | Licence |
|---|---|---|
| `animate` | `LICENSE` | MIT, Copyright (c) 2026 Emil Kowalski |
| `brandkit` | `LICENSE` | MIT, Copyright (c) 2026 Leonxlnx |
| `design-motion-principles` | `LICENSE` | MIT, Copyright (c) 2026 Kyle Zantos |
| `design-taste-frontend` | `LICENSE` | MIT, Copyright (c) 2026 Leonxlnx |
| `emil-design-eng` | `LICENSE` | MIT, Copyright (c) 2026 Matt Pocock |
| `frontend-design` | `LICENSE.txt` | Apache License 2.0 (the file names no copyright holder) |
| `gsap-core` | `LICENSE` | MIT, Copyright (c) 2026 GreenSock |
| `gsap-timeline` | `LICENSE` | MIT, Copyright (c) 2026 GreenSock |
| `redesign-existing-projects` | `LICENSE` | MIT, Copyright (c) 2026 Leonxlnx |
| `review-animations` | `LICENSE` | MIT, Copyright (c) 2026 Matt Pocock |

The other twelve (`brand-extract`, `design-brief`, `frame-light-leak-cinema`,
`frame-liquid-bg-hero`, `frame-logo-outro`, `impeccable-design-polish`,
`mockup-device-3d`, `motion-design`, `poster-hero`,
`reference-design-contract`, `vfx-text-cursor`, `video-hyperframes`) carry no
licence file of their own. They were copied from the open-design repository,
whose licence is `.claude/skills/LICENSE-open-design` (Apache License 2.0,
Copyright 2026 Open Design contributors), as `.claude/skills/README.md`
records.
