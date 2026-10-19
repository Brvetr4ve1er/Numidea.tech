---
type: map
updated: 2026-10-19
sources: [BRAND.md, OWNER-CONTENT.md, index.html, assets/app.js, scene/app.js, scene/style.css, scripts/scene-data.mjs, scripts/build-scene.mjs, scripts/work-capture.mjs, scripts/voices-data.mjs, scripts/check.mjs, package.json]
---

# Project sheets

`scene/` ("Planches", "Project sheets") is a generated page that lays out each project as a drawing sheet: what it gives the client, the key pages, the mobile version and the visual system, with screenshots taken from the live sites (scripts/scene-data.mjs › UI). Its single source of truth is `scripts/scene-data.mjs`; `scripts/build-scene.mjs` turns it into `scene/index.html`, which is never edited by hand (BRAND.md › Project sheets (scene/)). Start with the sheet table below, then the anatomy of one sheet; the clients themselves are covered in [[Clients and projects]].

## Pipeline

| Step | File or command | What happens |
|---|---|---|
| 1. Data | `scripts/scene-data.mjs` | `PROJECTS` (one entry per sheet) and `UI` (interface copy in fr, en, ar) (scripts/scene-data.mjs › PROJECTS, UI) |
| 2. Captures | `npm run work:capture [slug]` | Four desktop pages at 1440×900 and two phone screens at 390×844 @2x per project, from the live sites, into `assets/work/<slug>/{d1..d4,m1,m2}.webp`; WorkspaceHQ needs the local server (scripts/work-capture.mjs › 1) |
| 3. Build | `npm run scene` (or `npm run build`) | Writes `scene/index.html` with French baked in and the dictionary inline (scripts/build-scene.mjs › 1; package.json › scripts) |
| 4. Gate | `check.mjs` | Fails when `scene/index.html` differs from the generator's output, and checks the benefit blocks (scripts/check.mjs › header, 5c, 7) |

- `build-scene.mjs --check` reports whether the page matches its generator (scripts/build-scene.mjs › 312).
- A missing capture stops the build with "missing capture" (scripts/build-scene.mjs › shot()).
- The page lists in `work-capture.mjs` must match `scene-data.mjs` (scripts/work-capture.mjs › 1).

Graph: [[scene-data.mjs]], [[build-scene.mjs]], [[PROJECTS]], [[sheet()]], [[shot()]], [[work-capture.mjs]], [[_COMMUNITY_Project Sheets Generator]], [[_COMMUNITY_Project Screenshot Capture]], wiki [[Project_Sheets_Generator]], [[Project_Screenshot_Capture]].

## The five sheets

Sheet numbers follow the order of `PROJECTS` (scripts/build-scene.mjs › sheet(), pad).

| Pl. | Slug | Name | Status | Live URL | Pages | Languages | Typefaces | Benefits |
|---|---|---|---|---|---|---|---|---|
| 01 | `bordjsteel` | Bordj Steel | live | bordjsteelb2b.netlify.app | 12 | FR | Montserrat | 5 |
| 02 | `alliance` | Alliance Travel | live | alliancetravel34.netlify.app | 9 | FR · EN · AR | DM Sans, Tajawal | 5 |
| 03 | `glaive` | Glaive Store | concept | glaivestore.netlify.app | not given | EN | Archivo, Inter | 4 |
| 04 | `workspacehq` | WorkspaceHQ v3 | product | `../workspacehq/` | not given | EN | Press Start 2P, VT323 | 5 |
| 05 | `almaflow` | AlmaFlowClim | live | almaflowclim.netlify.app | 7 | FR | Roboto | 5 |

Source for every row: scripts/scene-data.mjs › PROJECTS. The sheets' own scopes (English text):

| Sheet | Sector | Scope |
|---|---|---|
| [[Bordj Steel B2B corporate site (sheet 01, 12 pages, FR)\|Bordj Steel]] | Structural steel · B2B · Algeria | B2B corporate site |
| [[Alliance Travel agency site (sheet 02, 9 pages, FRENAR)\|Alliance Travel]] | Travel agency · Bordj Bou Arréridj | Identity, site and booking journey |
| [[Glaive Store gaming-gear shop (sheet 03, portfolio demo)\|Glaive Store]] | E-commerce · Gaming gear | Fictional brand and full store |
| [[WorkspaceHQ v3 sheet (sheet 04, in-house product)\|WorkspaceHQ v3]] | Developer tool | Product, launch site and character |
| [[AlmaFlowClim HVAC and plumbing showcase site (sheet 05, 7 pages, FR)\|AlmaFlowClim]] | Air conditioning, heating, plumbing · Île-de-France | Showcase site and quote request |

Source: scripts/scene-data.mjs › PROJECTS (each project's `t.en`).

## Status labels

| Key | French chip | English chip | Heading of the benefits block |
|---|---|---|---|
| `live` | En ligne | Live | What the site gives the client |
| `concept` | Démo de portfolio | Portfolio demo | What the demo shows |
| `product` | Produit maison | Our product | What the tool gives its users |

Source: scripts/scene-data.mjs › UI (status, gain). Glaive is labelled a portfolio demo because its own site says so; it was never a client (BRAND.md › Project sheets (scene/)).

## Anatomy of one sheet

In the order `sheet()` writes it (scripts/build-scene.mjs › sheet()):

1. **Header**: "Pl. NN" ("Sh." in English) (scripts/scene-data.mjs › UI), the project name (always left to right), the status chip, and a "Visit the site" link (↗ and a new tab for an external site, → for our own page).
2. **Spec**: a one-paragraph summary, a title block (sector, scope, page count when known, languages) and the deliverables list.
3. **Main capture**: the first page at 1440×900 inside a browser bar that shows the real host; for WorkspaceHQ the host is derived from the published base URL, never invented (scripts/build-scene.mjs › shownHost()).
4. **What it gives** (`#gv-<slug>`): the client's context in one sentence, then 3 to 5 things a visitor can do on the live site today, each printed with the page that shows it (`at`).
5. **Pages delivered**: the other three captures, each with its path.
6. **On mobile** (two phone captures) beside the **visual system**: palette swatches with their role and hex, and the typefaces.
7. Optional blocks, rendered only when material exists: **before / after** pairs, **brand assets delivered**, and **the client's words**.

Graph: [[Project sheet (planche) structure]], [[What the site brings the client (benefits) section]], [[Project benefits (context  gains  at)]], [[_COMMUNITY_Client Site Features]], wiki [[Client_Site_Features]].

## Rules for what a sheet may say

- Every fact in `scene-data.mjs` was read off the live site or the repository on 2026-10-06: page lists from navigation, colours from CSS custom properties and pixels, typefaces from computed styles; nothing is estimated (scripts/scene-data.mjs › 1).
- `context` and `gains` were read off the live sites on 2026-10-17 by clicking through what each one claims (BRAND.md › Project sheets (scene/)).
- A benefit says what the client or their customers can now do, never a result: `check.mjs` (5c) refuses any digit, `%`, or words such as increased, boosted or conversion, in all three languages, and requires 3 to 5 benefits per sheet, each with an `at` page starting with `/` (scripts/check.mjs › 5c).
- Two claims were removed this way: AlmaFlowClim's `/realisations` is nine text cards whose filter buttons do nothing on the live site, so it is no longer called filterable or a gallery (BRAND.md › Project sheets (scene/)).

## Links into the sheets

- Each delivered client's card that has a sheet (Bordj Steel, Alliance Travel, AlmaFlowClim) links its benefit line to `scene/#gv-<slug>`, and a visually hidden "— le détail sur la planche" (`work.gainMore`) ends the link's name so a screen reader hears where it goes (BRAND.md › Project sheets (scene/); index.html › SELECTED WORK; scripts/check.mjs › 5c).
- Cards with a sheet also carry "Voir la planche →" to `scene/#<slug>`; Nomara Voyages has no sheet, so its benefit line is plain text (index.html › SELECTED WORK; BRAND.md › Project sheets (scene/)).
- The work section ends on the planches banner, "Ouvrir les planches →" (index.html › 515). See [[Project Plates Banner (Planches)]].
- Old `#/work/<slug>` links from the retired project explorer are redirected to the matching sheet through the `SHEET` map: `bordj-steel` → `bordjsteel`, `alliance-travel` → `alliance`, `almaflowclim` → `almaflow`, `glaive-store` → `glaive`, keeping the query string (assets/app.js › DOM ready, legacy deep links).
- The sheet page's footer links back to `../#contact` and `../#work` (scripts/build-scene.mjs › 292).

## The page itself

- Static HTML with French baked in, so it reads fully with JavaScript off (scripts/build-scene.mjs › 1). `scene/app.js` only adds the image viewer, and language is handled by `assets/page-i18n.js` (scene/app.js › 1); the header comment of `build-scene.mjs` still says `scene/app.js` swaps the language, which the current file does not do.
- The viewer is a `<dialog>`; a click with Cmd, Ctrl or Shift still opens the image file itself, and without JavaScript every capture is a plain link (scene/app.js › 8).
- The page has its own stylesheet and tokens, "a drawing office, not a light show": a static drafting grid, hairline frames, and nothing that moves on its own (scene/style.css › 1). It is dark only and does not use the six site themes: it declares a dark colour scheme and loads only `fonts.css` and its own `style.css`, not `themes.css` (scripts/build-scene.mjs › 217, 260–261).
- Languages: FR, EN and AR from an inline dictionary; Arabic flips the layout (scripts/build-scene.mjs › 249, 303); details in [[Languages and RTL]].

Graph: [[sceneapp.js]], [[Enlarged screenshot viewer dialog]], [[Planches project sheets page (work, deliverable by deliverable)]], [[_COMMUNITY_Menu and Scene Accessibility]].

## Adding client material

No code change is needed; drop files and rebuild (BRAND.md › Project sheets (scene/); scripts/build-scene.mjs › 1):

| Put this | Get this |
|---|---|
| `assets/work/<slug>/before/<name>.webp` and `after/<name>.webp` with the same name | A before / after pair |
| `assets/work/<slug>/brand/<name>.webp\|png\|jpg\|svg` | A delivered brand asset |

The file name becomes the caption ("logo-primary.webp" reads "logo primary"), then run `npm run scene` (scripts/scene-data.mjs › 1).

- A client quote appears on a sheet only when a consented voice exists in `scripts/voices-data.mjs`; only delivered clients can be quoted, never the Glaive demo or WorkspaceHQ (scripts/voices-data.mjs › 1; BRAND.md › Project sheets (scene/)).
- No voices exist yet (OWNER-CONTENT.md › 2). See [[VOICES]], [[_COMMUNITY_Generated Pages and Voices]], wiki [[Client_Voices_Builder]], [[Generated_Pages_and_Voices]].

## Open items

- The cards and sheets link the Netlify builds, because none of the clients' own domains serves the delivered site yet (OWNER-CONTENT.md › 9).
- WorkspaceHQ's sheet says the code is public on GitHub, not "open source"; the wording can change back only after a licence and a README are added to that repository (OWNER-CONTENT.md › 13).
- The Arabic interface and project texts in `scene-data.mjs` are pending a native speaker's review (OWNER-CONTENT.md › 8).

See [[Open owner items]].

## Related

- Maps: [[Clients and projects]], [[Site architecture]], [[Languages and RTL]], [[WorkspaceHQ and hub]], [[Build and gates]].
- Communities: [[_COMMUNITY_Alliance Travel Site]], [[_COMMUNITY_Glaive Store Demo]].
- Wiki: [[Alliance_Travel_Site]], [[Glaive_Store_Demo]].
