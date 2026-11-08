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
| `assets/fonts/` | Cinzel, Cinzel Decorative, Geist, Geist Mono, IBM Plex Sans Arabic (woff2 subsets, among them `plex-arabic-404.woff2`, the 4 KB subset of the Arabic line the French and English 404 sets), Syne (woff2 subsets) | `assets/fonts/OFL.txt` — since 2026-11-03 it names each family's file glob and the copyright line read from that font's own name table (until then only the Cinzel Project's line was in it) |
| `workspacehq/fonts/` | Press Start 2P (Reserved Font Name "Press Start 2P"), VT323 | `workspacehq/fonts/OFL.txt`, both copyright lines copied from the files' name tables |
| `workspacehq/embed/fonts/` | IBM Plex Mono Regular, Medium, SemiBold (Copyright 2017 IBM Corp.) | `workspacehq/embed/fonts/OFL.txt` |
| `hub/fonts/` | The Studio page (2026-11-07): Archivo (weights 800 to 900, latin and latin-ext, plus the Condensed and Expanded instances; Copyright 2020 The Archivo Project Authors), Montserrat (2011 The Montserrat Project Authors), Sora (2019 The Sora Project Authors), DM Sans (2014 The DM Sans Project Authors), Manrope (2019 The Manrope Project Authors), Space Mono (2016 The Space Mono Project Authors), Reem Kufi (2015-2022 The Reem Kufi Project Authors), Aref Ruqaa (2015-2021 The Aref Ruqaa Project Authors, Reserved Font Name EURM10), Noto Sans JP (weights 700 to 900, cut to the glyphs the Studio and the bible set; (c) 2014-2021 Adobe, with Reserved Font Name "Source") and Noto Serif JP (cut to the Traveler case's glyphs; (c) 2017-2024 Adobe). Geist, Geist Mono and IBM Plex Sans Arabic are the site's own files in `assets/fonts/`, named from `hub/fonts/fonts.css`, not copied | `hub/fonts/OFL.txt`, each family's files and the copyright line read from its name table (the character bible's faces since 2026-11-06, the rest since 2026-11-07) |

## Permanent Marker — Apache License 2.0

`hub/fonts/permanent-marker-latin.woff2` (regular, latin subset) sets the
Studio's and the bible's handwritten notes and the rig's speech bubble. Its name table reads
"Copyright (c) 2010 by Font Diner, Inc. All rights reserved. Licensed under
the Apache License, Version 2.0"; that line and the full licence text are in
`hub/fonts/LICENSE-permanent-marker.txt`, beside the file. It is the one
face in the repository that is not under the OFL, and the legal page's
fonts sentence names it apart (`scripts/build-legal.mjs`, in the three
languages).

## React 18.3.1 — MIT

`workspacehq/embed/vendor/react.production.min.js` and
`react-dom.production.min.js` are the React 18.3.1 UMD production builds,
under the MIT licence. Each file's header says so and refers to the LICENSE
file of the React source tree; since 2026-11-03 that text is beside them,
`workspacehq/embed/vendor/LICENSE` (the standard MIT text with the React
tree's copyright line, "Meta Platforms, Inc. and affiliates"; the builds'
own headers still name the company as "Facebook, Inc. and its affiliates",
its earlier name). `react-dom` also embeds a Modernizr 3.0.0pre custom
build, MIT, per its own header.

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

## Client work shown on the Studio page, and its images — their owners'

`hub/img/clients/` (`bordj`, `alliance`, `almaflow`, `heetch`, `traveler`)
and the logos in it hold pictures of the work in the five cases of the Studio
page (`/hub/`, 09 Proof): sites, brand sheets, posters, social posts and
mockups, exported to WebP by `scripts/build-hub-img.mjs` from the owner's
design project. The clients' names, logos, brand identities and the content of
their sites remain theirs (Bordj Steel, Alliance Travel, AlmaFlowClim, Heetch),
shown as references. Bordj Steel's figures and logo wall are captioned as
Bordj Steel's own; the Alliance flyers and stories carry the client's own
artwork, prices included; mockups carry a MAQUETTE or CONCEPT tag. The
Heetch pieces (also in `hub/img/studio/`) are campaign work the founder
made at Heetch; the Traveler series is shown as his own project. Written consent to show the clients' work and logos is an owner item
(OWNER-CONTENT §21). The two logo SVGs (`bordj/logo.svg`,
`alliance/logo-cream.svg`) had a 40 kB content-credential metadata block
stripped; the drawing is unchanged.

## The owner's illustrations — no licence chosen yet

`hub/bible/art/` (until 2026-11-07 `hub/art/`) holds the founder's own
drawings of himself and Kūro, as his character bible shows them since
2026-11-06 and as the Studio page's rig, lab and founder screens use them: the live rig's frames
(`rig-y-*`, `rig-k-*`), the twelve faces, the poses, the head-to-toe pairs,
Kūro's cards and the silhouettes, cut from his private masters by
`npm run hub:rig` (`scripts/build-hub-rig.mjs`); `hub/bible/og.jpg`, the
bible's share card, is drawn from its cover. `hub/img/mascot/` and
`hub/img/motion/` (the Studio's sting pictures, the grain tile and the
cleaned pose) are the same owner's art, cut by `scripts/build-hub-img.mjs`. (Until 2026-11-06 the folder also held
the diary and band illustrations and his Behance covers, and `hub/loops/`
the animated loops; they left with the rebuild and stay only in the git
history.) He has not chosen a licence for them: `ip.licence` in
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
