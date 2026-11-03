---
type: map
updated: 2026-11-03
sources: [git log, README.md, OWNER-CONTENT.md, IMPROVEMENTS.md, RELEASE.md, assets/styles.css]
---

# Timeline

The site's history as the git log tells it, from the first commit on 2025-06-28 to fix fleet 2 of 2026-11-03, cut down to the milestones and grouped by month, then by theme of work. Each line cites the commit it summarises; `git show <hash>` gives the full message. This is history: where an early commit and the current files disagree, the current files and the other maps win; start with October if you only need to know how the site got to its present shape.

## At a glance

| Month | Main work |
|---|---|
| 2025-06 | Initial commit (commit bfc8cad) |
| 2026-06 | First landing page (Neon Noir), services catalog, Arcanum identity, the June knowledge base (commits eafff7b, a09552e, ae6162f, c7c809a) |
| 2026-07 | Bordj Steel card, project explorer, hub/, layout prototypes, scene/ as an engineering drawing, first full audit (commits e4482e5, 3831985, d2c95c3, 5ead4c4, bb8451f, fc9555b) |
| 2026-08 | A/B/C variants, identity detours, Arcanum restored with Engineering as a sixth theme, mobile, self-hosted fonts (commits 9742267, 4a5aed0, 98e7d84, 127d323, cadd674, f5bf3ab) |
| 2026-09 | Stress test, second audit, anti-slop sweep, zero layout shift (commits 4d4555c, b1dc2d8, 1302144, 5fe7e22) |
| 2026-10 | Pricing, atlas, hub and WorkspaceHQ, token contract, one site, gates, currency, legal, Arabic, copy rewrite, round 3, knowledge base (commits 3b2375c, 6ec42b4, 0775f7a, a0b6689, f7ce370, d1e9219, c8801a3, eeca4f2, 9394ddc, 29805ac, 16d16e7, 250c133, 9afd9ba); then, from 2026-10-24, the release and monitoring work, the full audit and its backlog (commits 485bc0c, 82603b0, ecf48bb), the owner's decisions and the clear-cut fixes (0629770, 951d390, a44de7e), the hub rebuilt on the owner's illustrations (4099344) and the fix fleet of 2026-10-31 (590c258, 67e04ad, 10b90ff, ff2cec9, 2ad9e7d, 7ad7b67, 786ba8e). Nothing has deployed since 2026-10-25 (RELEASE.md › 9) |

## 2026-06 — the first site

- 2026-06-15: the Numidea Labs landing page is built, "v2 · Neon Noir" (commit eafff7b); the README is rewritten for Numidea Labs (commit 005fe4f).
- 2026-06-16: services become an animated capability catalog (commit a09552e); a filterable portfolio modal and a designed 404 page (commit 8ac6b83); a GitHub Pages auto-deploy workflow (commit dd00867).
- Type and themes, 2026-06-18: Space Grotesk + IBM Plex (commit 8975ba4), then the Geist type system and a multi-theme switcher (commit 7390c67), then the "Arcanum" arcane-deco identity as the primary theme (commit ae6162f).
- Voice: marquee copy in a Magician+Creator+Sage voice in FR/EN/AR (commit c46e2bd), extended into the service catalog (commit 7a68fab).
- Work: committed screenshots and Arcanum covers as project previews (commit 8a36820); live demos for Alliance Travel, Nomara and Glaive (commit bf281fe); live project cards with real Netlify previews (commit edcbb5e).
- Leads: the contact form delivers leads through a mailto handoff (commit 8d1fbc2).
- 2026-06-22: the institutional knowledge base, 15 domains (commit c7c809a); it now sits in `archive/2026-06-snapshot/` as history (commit 9afd9ba).
- 2026-06-28: a trilingual FAQ section (commit b9fd698).

Graph: [[Neon Noir theme (now 'noir')]], [[Decision full rebrand to Arcanum]], [[Company story  history timeline]], [[_COMMUNITY_Brand Identity History]], [[Brand_Identity_History]]. The June knowledge base itself: [[June 2026 archive]].

## 2026-07 — portfolio, hub and scene

- Clients: Bordj Steel replaces Hamma Sat as the live flagship B2B card (commit e4482e5).
- A data-driven Project Explorer with deep-linkable case-study views (commit 3831985); it was removed on 2026-10-09 (commit 0132765).
- hub/: the VOIDSPLUNKER hub, a cyber-Y2K identity landing (commit d2c95c3); light and dark themes (commit b483b66); real, verifiable links wired in (commits bdfd36e, 0ee4049, 7448ec8).
- Founder section rebuilt from the real CV (commit 48b9df8).
- Layout experiments: four selectable layouts, 2a to 2d (commits 5ead4c4, d893ff0, 02a9133, b855133); a 3D scene in the projects section (commit 73b0229); 2d "Atelier Split" promoted to the homepage, then removed (commits 3e13396, a9fd6da); the 2a–2d prototypes retired (commit 673de57).
- scene/: two rendering prototypes, B and C, built in scene-b/ and scene-c/ (commit 117e0af); approach C, "the work as an engineering drawing", ships as scene/ and both prototype folders are removed (commit bb8451f).
- Deploy and leads: cache-bust stamps on every asset reference (commit 565d63b); a Vercel config and Supabase-ready lead capture, mailto preserved (commit 0d470d9).
- 2026-07-31: full codebase audit, invariant tooling and `/audit` (commit fc9555b); `audit/` is now a dated snapshot that is never deployed, superseded by IMPROVEMENTS.md since 2026-10-26 (README.md › This repository — the landing page; audit/Executive_Summary.md › banner). The homepage is restructured to half its length, proof up front (commit 55084b0).

Graph: [[Project-explorer modal (workslug hash router)]], [[hub (VOIDSPLUNKER.std founder page)]], [[Executive Summary - full codebase audit (2026-07-31, commit a9fd6da)]], [[Executive_Summary_-_full_codebase_audit_2026-07-31,_commit_a9fd6da]]. The audit's reports and what became of each finding: [[Code audit (2026-07)]].

## 2026-08 — identity detours and mobile

- Variants: A/B/C variants across the three deployments, plus `netlify.toml` (commit 9742267), then made distinct in design and offer (commit a0be329); they were removed on 2026-10-09 (commit d1e9219).
- Identity, 2026-08-03 and 04: an industrial signage identity replaces Arcanum (commit 4a5aed0), with copy in the "Fabricator" voice (commit dca55be); an editorial system replaces it (commit ea7ac21); a rebuild "as an engineering surface" follows (commit 98e7d84); the next commit restores Arcanum and ships Engineering as a sixth theme (commit 127d323).
- Motion: ambient parallax and staggered reveals on the hub and the main site (commits 760d66f, 5173e53).
- Mobile: the hero deck rendered 0x0 on every phone, fixed (commit 3bdc93f); dead space and touch targets (commit a3da0f2); "native across every size" (commit cadd674).
- Hero: the drafting title block (commit 1a0aa31) with the real work in it (commit 1253e9d); a custom icon set (commit 191a39b).
- Fonts and first paint: webfonts self-hosted (commit f5bf3ab); the page holds still when they arrive (commit de1d0c5); the language is resolved before first paint (commit e424179; the paint-hold it introduced left with the static language pages on 2026-10-31, below).
- Contact: one email address everywhere (commit 02fd356).

Graph: [[theme-engineering.css (removed alternate stylesheet)]], [[Hero as drafting-sheet title block]], [[_COMMUNITY_Ambient Motion and Reveal]]. The motion system as it stands: [[Motion and illustration]].

## 2026-09 — audits and sweeps

- A stress test (commit 4d4555c) and a second full audit: focus rings, a token collision, Arabic preloads (commit b1dc2d8); an error scan of the three pages never audited (commit 58b65de).
- An anti-slop sweep across all four pages (commit 1302144); residual layout shift taken to zero (commit 5fe7e22).
- Syne and Space Mono self-hosted (commit ab9bda3); a "fleet audit" fixes what six agents found (commit 35de504); generated line art for the method, FAQ and archive sections (commit 35f3772).

Graph: [[Anti-slop sweep]], [[_COMMUNITY_Anti-slop and Gates]].

## 2026-10 — the site as it is now

Pull requests #1 to #10 were merged between 2026-10-01 and 2026-10-07 (commits 9bf9b6c, 446938a); the log has no merge commit after #10.

### Pricing and currency

- 2026-10-01: pricing, estimator and onboarding added; the "Flagship" label dropped (commit 3b2375c).
- 2026-10-03: the market comparison, local against international, and how projects are priced (commit e684fdf); it moved to the price guide on 2026-10-31 (below).
- 2026-10-10: prices in € and $ for foreign visitors (commit eeca4f2).
- 2026-10-14: the estimator caps a Vitrine at the Studio figure, bound by bound, and `check.mjs` tests every size, option set and pace (commit ded7fce).

### Themes, design system and the atlas

- 2026-10-01: anti-slop sweep across all six themes, contrast failures to zero (commit 6a03ec6).
- 2026-10-04: the atlas, engraved plates of Numidia and animated icons (commit 6ec42b4).
- 2026-10-05: bento grids, skeletons and scroll-spy (commit d4ec3a9); the home page gets one structure and one design system (commit f9bac97).
- 2026-10-06: the themes move onto one token contract; Noir, Daylight, Mono, Alt-neon and Engineering redesigned (commit f7ce370).
- 2026-10-09: every contract token must be read, which leaves 47 (commit 3ad6381; 44 since 2026-11-03, scripts/themes-check.mjs › CONTRACT); a validated theme boot (commit 11b7af6).

### hub/ and WorkspaceHQ

- 2026-10-04: hub/ becomes the artist's page, with no client sites (commit 0775f7a), and its gallery becomes the 33-poster BR4VETR4VELER series (commit 6a22443); the series left with the rebuild of 2026-10-28 (below).
- 2026-10-05: hub/ bento layout (commit 72a5655); the WorkspaceHQ v3 launch page and a cartridge link to it (commit a0b6689).
- 2026-10-13: workspacehq/ is honest about its repository (commit 542ad1a); OWNER-CONTENT gains the WorkspaceHQ licence item and eight claims to confirm (commit ceee523).

### Project sheets (scene/)

- 2026-10-06: scene/ rebuilt as a blueprint showcase of each project's deliverables, read from the live sites (commit 84155af).
- 2026-10-09: no French flash, `?lang=` links, share cards and a generator drift check (commit 5548179); work cards link their project sheets (commit 2ac7956).

### One site, deploy and gates

- 2026-10-09: only the site is deployed, from one shared site list (commit c5ea7cf); the A/B/C variants go (commit d1e9219); the gates get a shared harness, one verify command and CI (commit c8801a3).
- 2026-10-12: CI moves to Node 22 for html-validate 11 (commit ba5d2f3).
- 2026-10-13: a literal French bake, mirror CLI state and new checks (commit e9107fe); sharp 0.35.5 (commit c71f5f6).
- 2026-10-14: vbugs tells clipped text from clipped decoration; docs for carry.js and the new gates (commit 0ddf69e).

### Languages and Arabic

- 2026-10-09: every label translated; the hero plate gets a pause button (commit fae8ad1); the process rail works in Arabic (commit 2b2e6ee).
- 2026-10-10: Arabic stops letter-spacing (commit eeca4f2); share previews in French, hreflang, structured data and a sitemap generator (commit 25da1c6).
- 2026-10-12: the Arabic pass: arrows, terms, labels, Western digits, RTL layout (commit 29805ac).
- 2026-10-13: languages that follow the visitor (commit a93f2fe); Arabic faces in the main site CSS (commit 58080ad).

### Contact, leads and owner content

- 2026-10-01: WhatsApp activated (commit ec210dc).
- 2026-10-09: contact-form errors tied to their fields (commit c492ca5); a phone contact bar that stays in reach past the hero (commit 21c3e54).
- 2026-10-10: L'Aperçu gets its terms and a way in, and leads carry their source (commit f3fb9a6).
- 2026-10-12: content slots for client voices and real photos, and one contact address (commit 3727ab7); the README describes the site as it is and OWNER-CONTENT lists what only the owner can supply (commit 0e5ab20).
- 2026-10-13: one carry-over script for every page, read at click time (commit b54f464).

### Legal

- 2026-10-10: the privacy text covers leads from ads and the currency setting (commit 8d87358).
- 2026-10-12: the legal page is wired into the build and the gates and publishes only when complete (commit 9394ddc).
- 2026-10-13: the legal generator gets per-language owner text and Supabase-aware privacy (commit bc2bb1c). The page is still unpublished while owner fields are missing (OWNER-CONTENT.md › 1).

### Campaign kit

- 2026-10-10: a campaign kit and an ad creative pipeline are added (commits 394faa1, 09adb12).
- 2026-10-12: the kit is taken out of the public repository (commit 08efea7); it stays in the history of earlier commits, and rewriting that history is the owner's call (OWNER-CONTENT.md › 12).

### Copy rewrite

- 2026-10-14: the box under the hero states facts (commit 9bd53d2); a copy rewrite from the audit, in FR, EN and AR (commit 16d16e7); fixes from the native re-read after it (commit 881be86).

### Round 3: FAQ, scroll, mobile; logos, benefits; charts

The code labels the three strands r3/a (FAQ columns, scroll comfort, mobile), r3/b (client logos and benefit lines) and r3/c (visualisations and motion) (assets/styles.css › the r3 banners).

- 2026-10-17: FAQ drawers open one at a time, calmer scrolling, mobile fixes (commit 250c133).
- 2026-10-17: the client logo strip, and what each project gives the client (commit 717a8c2).
- 2026-10-17: charts and motion: market ranges, the Preview's five days, the method rail (commit d4b023b).
- Follow-ups, all 2026-10-17: the plate's pause/play button overrides a rail pick (commit 0f5c9f0); a fragment arrival in the folded pricing panel builds the market chart first (commit d7626a6); an open-ended range fades only past its stated top (commit f96f3f7); market bars and package bands stand at least 3:1 off the ground in every theme (commit a308b16); the contrast sweep counts text inside `aria-hidden` pictures (commit 8285cf0); logos light on hover only where a pointer can hover (commit 09bcd12); the Bordj Steel and WorkspaceHQ sheets claim only what their pages show (commits 2a507c8, 2ca4d38).

### Knowledge base

- 2026-10-09: the knowledge base stops being served on the site when the deploy is narrowed to the site list (commit c5ea7cf).
- 2026-10-19: graphify ignore list, vault export script and a public-safety check (commit d845495); the June snapshot moves to `archive/` and the graphify graph is exported (commit 9afd9ba).

### Round 4: release, fonts and the live site (2026-10-24 and 25)

- 2026-10-25: the fallback faces hold the hero still when a webfont lands late, one per weight (commit 485bc0c); the gates lay text out without hinting (commit 79716a2); the audit's emulated-Pages 404 runs and `AUDIT_BASE` (commit 6a225f2); every check.mjs block gets one label, cited by the maps (commits 5bb8b89, 370e074). RELEASE.md is written (release checklist, rollback, monitoring, owner-only settings).
- 2026-10-25, 16:42 UTC: the last successful GitHub Actions run; since then every run fails within seconds, the account's billing being blocked, so nothing after stamp 202610251516 is live (RELEASE.md › 9; IMPROVEMENTS.md › Log 2026-10-26).

### The full audit and the owner's decisions (2026-10-26 and 27)

- 2026-10-26: `npm run metrics` (commit 82603b0) and the full audit's backlog, decisions and metrics history in IMPROVEMENTS.md (commit ecf48bb); the clear-cut fixes F1–F9, C6 and C7 shipped the same day (one font file per family and subset 0629770; the scene-banner plate and the decomposed Behance badge 47dc522; FAQ 2's starting price 95b70d1; the copy-my-message fallback 8f1206b; the pre-fill buttons scrolling to the form adb4352; check 17's duplicate-font guard 4a4ae04); the share card becomes the site's own engraving, by owner decision (commit 89c7fb3).
- 2026-10-26: the owner's decisions recorded (commit 076c991) and applied through 2026-10-27: the vista hidden on phones (c32c737), one trust line instead of the four counters (6ae9d95), the "En cours" cards hidden (403d10b), the tools section cut (d7485ce), the footer trimmed (737f414), the hero's second button on WhatsApp (06940fe), the estimator folded (951d390), the Aperçu's path told once (a44de7e); the price in the hero and three service cards declined (IMPROVEMENTS.md › Decisions 1, 2).
- 2026-10-27: the review of that branch (the folded estimator's scope, the hero WhatsApp link baked, metrics not counting a closed `<details>`: commits a842b53, b8db7fb, 5d1b4ad); F15 opened (commit 894e7ac).

### The hub rebuilt on the owner's illustrations (2026-10-28)

- 2026-10-28: the art export script and the illustrations (commit 7726814); the page rebuilt (commit 4099344), its gates (e6361f7), the share card (ae00039), the review fixes (9fb2c49); Space Mono leaves (57864b0, F16); the docs (9b20620); the owner approves the diary titles (c75c1a7); stamps bumped (1185f08). Pushed, not deployed (IMPROVEMENTS.md › Log 2026-10-28).

### The second full audit and fix fleet 1 (2026-10-30 and 31)

- 2026-10-30: the owner answers the open decisions 10, 11, 13, 14, 15, 16, 17, 19, 20 and 21 (the recommended options), the team (one founder, with freelancers when needed), the contact facts (WhatsApp only, Sunday–Thursday 9h–18h, the Gmail address stays), the legal notice ("later") and the push policy (push anyway, deploy later) (IMPROVEMENTS.md › Decisions, Log 2026-10-31; OWNER-CONTENT.md › 17).
- 2026-10-31: the CTO, CMO and design audits; the commercial terms drafted on the owner's instruction (OWNER-CONTENT.md › 16). Fleet 1, "Build and trust", in one checkout, local commits: the hygiene pass (commit 590c258: one deploy-skip rule, one esc(), one browser launcher, the WhatsApp pending path out, engines and .nvmrc, NPM_FLAGS, cache headers, paths-ignore); the legal code for the ad and WhatsApp Business facts and NOTICE.md (commit 67e04ad); check 17's ceilings and site-wide duplicate check, the embeds validated (commit 10b90ff); the static `/en/` and `/ar/` pages and the dictionaries in `assets/i18n/` (commit ff2cec9, gates 6827ce3); the performance pass: comments stripped at staging with stage-check, two sizes per capture, the deck's slides on demand, fonts by weight range, the ع drawn (commit 2ad9e7d); the price guide `/tarifs/` in three languages, the market comparison off the home page (commit 7ad7b67); every gate reading the new pages, check 3 reading srcset, stage-check in verify (commit 786ba8e); then the docs (BRAND, README, RELEASE › 9, OWNER-CONTENT › 16–17, IMPROVEMENTS › Log, these maps). Measured and recorded in IMPROVEMENTS.md › F17 and the Log. Fleet 2, the copy and design pass, followed (below).

### Fleet 2: the copy and the design (2026-11-02 and 3)

- 2026-11-02: the owner's answers and the drafted terms into the three dictionaries, French first (commit cac515f: hero in benefit-first words, a founder who is one person with freelancers, the Aperçu's rules, FAQ entries on payment and on ownership and hosting); the English and Arabic follow (commit 60bfc8f; the Arabic awaits native review, OWNER-CONTENT.md › 8); the home's markup and runtime behind them, the retired team keys and the founder's portfolio link out (commit 023f792); `scene/`, the hub and WorkspaceHQ: delivered sheets first, each ending on the offer's call, one spelling of the handle (commit 7bb84bb).
- 2026-11-03: the design pass (commits 1bcdd4a, e8a2ea2): the wordmark drawn once from the font and worn by every page, `--field-border`, Cinzel on Daylight's headings, every ambient loop under 5 s, the phone header with the theme picker in the menu, tiers three abreast from 961px, no lift on cards that are not links, `scene/` following the visitor's theme, every share card drawn by `build-og.mjs` (`og-capture.mjs` retired). The gates followed (commit 2be10fc): contract of 44 tokens, the Arabic-font rule, the picker driven where it is shown. Measured: 92 audit runs, 69 keys runs, sweep and vbugs clean. Local commits, not pushed.

Graph for October: [[PRICE_MODEL]], [[Market comparison ('Ici et ailleurs')]], [[The atlas - six engraved plates]], [[Theme contract (47 tokens)]], [[BR4VETR4VELER poster series (33 posters)]], [[WorkspaceHQ v3 launch site]], [[Planches project sheets page (work, deliverable by deliverable)]], [[Deploy scope (DEPLOY, stage-site.mjs, NOT_DEPLOYED)]], [[The gates (pre-push commands)]], [[Legal notice + privacy page (generated, unpublished)]], [[Campaign kit in public git history]], [[Client logo strip ('Ils nous ont confié leur site')]], [[Visualisations (r3c)]], [[Scroll comfort (round 3)]], [[S-01 - Internal knowledge base published on the public site]]. The generated graph is the export of 2026-10-19: its nodes "Theme contract (47 tokens)" (46 today), "The atlas - six engraved plates" (five since the tools section left on 2026-10-26), "BR4VETR4VELER poster series" and "Hub poster viewer" (gone with the rebuild of 2026-10-28), "Market comparison" (on the price guide since 2026-10-31), "data-i18n-pending Paint Hold", "switchLang()" and "build-fr.mjs" (gone on 2026-10-31) describe the site before these changes. Refresh it with `/graphify . --update` and `npm run kb` (knowledge-base/Home.md); graphify was not installed on the fleet's machine, so the maps were updated by hand on 2026-10-31.

Communities: [[_COMMUNITY_Pricing Model and Estimator]], [[_COMMUNITY_Theme Token Contract]], [[_COMMUNITY_Founder Poster Series]], [[_COMMUNITY_WorkspaceHQ Product]], [[_COMMUNITY_Project Sheets Generator]], [[_COMMUNITY_Build Scripts and Deploy Scope]], [[_COMMUNITY_Arabic RTL and Head Boot]], [[_COMMUNITY_Legal Page Generator]], [[_COMMUNITY_Market Chart and Visuals]], [[_COMMUNITY_Client Logo Strip]].

## Where to go next

- What the words mean: [[Maps/Glossary|Glossary]].
- The present state of each area: [[Site architecture]], [[Themes and tokens]], [[Motion and illustration]], [[Pricing and market]], [[Project sheets]], [[Build and gates]], [[Captures and image tools]], [[Deploy]], [[Languages and RTL]], [[WorkspaceHQ and hub]].
- The two dated snapshots: [[Code audit (2026-07)]] and [[June 2026 archive]].
- What is still waiting on the owner: [[Open owner items]].
