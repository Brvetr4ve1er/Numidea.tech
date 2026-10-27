---
type: map
updated: 2026-10-26
sources: [index.html, assets/app.js, scripts/scene-data.mjs, scripts/voices-data.mjs, scripts/check.mjs, scripts/shots.mjs, scripts/verify-domains.mjs, OWNER-CONTENT.md, README.md, BRAND.md]
---

# Clients and projects

The work grid shows four live client sites and one portfolio demo, and only those four clients appear in the logo strip or can carry a quote (index.html › #work, work.lead, .titleblock; scripts/voices-data.mjs › VOICE_CLIENTS; scripts/check.mjs › block 5b). One of the four, Nomara Voyages, is shown as delivered but the owner has not confirmed it is a client (OWNER-CONTENT.md › 7). The studio's own product, WorkspaceHQ v3, has a project sheet (04) and a link from hub/, but no card in the grid; its footer cartridge on the home page went on 2026-10-26, an owner decision (scripts/scene-data.mjs › workspacehq; hub/index.html › .whq-cart; BRAND.md › workspacehq/ — the WorkspaceHQ v3 launch page). Two projects in progress, Doctor Cherfia Clinic and Étoile de l'Est, have no card until each site is live, an owner decision of 2026-10-26 (BRAND.md › Bento, loading states and wayfinding; OWNER-CONTENT.md › 9). Start with the roster, then the rules the code enforces, then the owner flags in [[Open owner items]].

## Roster

| Project | Status on the site | Card category | What it is | Linked build | Project sheet |
|---|---|---|---|---|---|
| [[Bordj Steel]] | Delivered client, live | Industrie · B2B | B2B corporate site for Bordj Steel SPA: product catalogue, references, recruitment | bordjsteelb2b.netlify.app | Yes: 12 pages, FR |
| [[Alliance Travel_1\|Alliance Travel]] | Delivered client, live | Voyage · Croissance | Brand identity, trilingual site and visa-appointment booking for a travel agency in Bordj Bou Arréridj | alliancetravel34.netlify.app | Yes: 9 pages, FR · EN · AR |
| [[AlmaFlowClim]] | Delivered client, live | Artisan · Île-de-France | Site of an air-conditioning, heating and plumbing firm in Gennevilliers: one page per trade, past jobs, one-form quote | almaflowclim.netlify.app | Yes: 7 pages, FR |
| [[Nomara Voyages]] | Shown as delivered, client status unconfirmed | Voyage · Omra | Bilingual storefront for package tours and Umrah trips from Constantine | nomaravoyages.netlify.app | No |
| [[Glaive Store]] | Portfolio demo, not a client | Commerce · Gaming | Fictional gaming-gear brand and online store, labelled as a demo on every page | glaivestore.netlify.app | Yes: portfolio demo, EN |
| WorkspaceHQ v3 | The studio's own product (no work card) | — | Desktop console (Electron) that shows the state of every git repository on a developer's machine in one scan; launch page in `workspacehq/` | `workspacehq/` | Yes: own product, EN |
| [[Doctor Cherfia Clinic_1\|Doctor Cherfia Clinic]] | In progress; no card until the site is live | — | Site with online booking for a small practice | none | No |
| Étoile de l'Est | In progress; no card until the site is live | — | Progressive web app built to work offline | none | No |

Sources: index.html › #work (cards, categories, links); assets/app.js › proj*.desc (English descriptions); BRAND.md › Bento, loading states and wayfinding (the two projects in progress, whose cards and keys went on 2026-10-26); scripts/scene-data.mjs › PROJECTS (pageCount, langs, status, context, gains); README.md › This repository (workspacehq/); OWNER-CONTENT.md › 7 (Nomara).

- The proof band's trust line says "4 sites livrés · réponse < 24 h ouvrées · FR · EN · AR"; the title block says "4 sites clients" (index.html › .proof, .titleblock; assets/app.js › proof.line). Its four counters went on 2026-10-26, an owner decision (BRAND.md › Page structure and design system (home page)).
- The hero plate cycles the four client sites and the Glaive demo, one at a time, labelled `01/05` (index.html › .plate).
- It is an owner decision that Glaive is a portfolio demo and that there are 4 live client sites, not 5; `check.mjs` keeps retired wording such as "5 / 7" and "Démo →" from coming back (scripts/check.mjs › RETIRED).
- A project in progress gets a card only once its site is live, and then comes with its own screenshot, link and browser bar; the two "En cours" cards had no screenshot and nothing to open (BRAND.md › Bento, loading states and wayfinding; OWNER-CONTENT.md › 9).

## Per client

### Bordj Steel
- A Bordj Bou Arréridj manufacturer with four production units, working for factories, farm projects and industrial developers across Algeria (scripts/scene-data.mjs › bordjsteel.context).
- Delivered: corporate site of 12 pages, a product catalogue of 4 business-line pages, references and key figures, a media centre (blog), contact and careers, legal pages (scripts/scene-data.mjs › bordjsteel.t.en.deliverables).
- Benefit line on the card: a buyer finds the right product line and its technical data without calling (assets/app.js › proj4.gain).
- The founder's CV on the page lists SPA Bordj Steel, August 2025 to February 2026: identity redesign (logo, charter), print, then a responsive site (index.html › #cv-panel, fx4).
- Graph: [[Bordj Steel B2B corporate site (sheet 01, 12 pages, FR)]].

### Alliance Travel
- A package-tour agency from Bordj Bou Arréridj, also in M'Sila, where people book by phone, on WhatsApp or at the desk (scripts/scene-data.mjs › alliance.context).
- Delivered: brand identity, trilingual site with right-to-left Arabic, 7 destination pages, a WhatsApp quote calculator, a visa-appointment service, light and dark modes (scripts/scene-data.mjs › alliance.t.en.deliverables).
- The founder's CV lists Alliance Travel, February to May 2026, as web developer and social media: the full site, the brand's visual redesign and its social-media strategy (index.html › #cv-panel, fx3).
- Graph: [[Alliance Travel agency site (sheet 02, 9 pages, FRENAR)]].

### AlmaFlowClim
- A Gennevilliers firm that installs, services and repairs air conditioning, heating and plumbing for homes and businesses across Île-de-France (scripts/scene-data.mjs › almaflow.context).
- Delivered: showcase site of 7 pages, 3 trade pages, a past-jobs page, a quote form, local SEO by town served, legal notice (scripts/scene-data.mjs › almaflow.t.en.deliverables).
- It is the one French client the portfolio shows (OWNER-CONTENT.md › 14).
- Graph: [[AlmaFlowClim HVAC and plumbing showcase site (sheet 05, 7 pages, FR)]].

### Nomara Voyages
- Shown as delivered work, but the owner has not confirmed it is a real client with permission to show the site (OWNER-CONTENT.md › 7).
- If it is not, it comes off the work grid, the hero plate, the counts, the logo strip, `client-logos.mjs`, `proj6.gain` and `VOICE_CLIENTS` (OWNER-CONTENT.md › 7).
- It has no project sheet (BRAND.md › Client voices and photo slots), so its benefit line on the card links nowhere (scripts/check.mjs › block 5c).
- Graph: [[Nomara Voyages (unconfirmed client)]].

### Glaive Store and WorkspaceHQ
- Glaive Store has no client: a brand the studio invented to show a complete online store (scripts/scene-data.mjs › glaive.context; [[Glaive Store gaming-gear shop (sheet 03, portfolio demo)]]).
- WorkspaceHQ v3 is the studio's own product, for developers who keep many git repositories on one machine; its code is public on GitHub (scripts/scene-data.mjs › workspacehq; [[WorkspaceHQ v3 sheet (sheet 04, in-house product)]]). The details are in [[WorkspaceHQ and hub]].

## Rules the code enforces

| Rule | Where |
|---|---|
| The logo strip "Ils nous ont confié leur site" shows exactly the four delivered clients, each logo the client's own file, linked to its own work card; never Glaive or WorkspaceHQ | scripts/check.mjs › block 5b; BRAND.md › Client logo strip |
| Client logos are taken from the live sites' headers by `npm run logos`, which checks each is still the header logo | README.md › Commands |
| Each project sheet carries the client's context and 3 to 5 benefits in three languages, each with the live page that shows it; no figures, %, or result words | scripts/check.mjs › block 5c; scripts/scene-data.mjs › header |
| Each delivered client's card carries one benefit line, linked to its sheet when it has one | scripts/check.mjs › block 5c |
| Client quotes: only the four delivered clients, at most 280 characters, a past consent date and a note of where the consent is kept; the list is empty today | scripts/voices-data.mjs › VOICES, validate |
| Plate, card, browser bar, screenshots and showcase links agree per client; the hub lists no client sites | scripts/check.mjs › block 5 |
| Card screenshots are committed 1280×800 WebP captures of the live builds (`npm run shots`) | scripts/shots.mjs; README.md › Project previews |

- Graph: [[VOICE_CLIENTS]], [[VOICES]], [[Delivered clients (quotable)]], [[Client logo strip ('Ils nous ont confié leur site')]], [[What the site brings the client (benefits) section]], [[Committed client-site preview screenshots (assetspreviews.webp)]].

## Client domains

- The cards link the Netlify builds because none of the clients' own domains serves the delivered site (OWNER-CONTENT.md › 9; [[Netlify (client site hosting)]]).
- `bordj-steel.com`, `alliance-travel.dz` and `nomaravoyages.com` do not resolve; `almaflowclim.fr` serves a different Hostinger site (OWNER-CONTENT.md › 9).
- `node scripts/verify-domains.mjs` reports a domain as switchable only when it resolves and serves the same site; it never edits anything (scripts/verify-domains.mjs › header; [[verify-domains.mjs]]).
- Graph: [[Clients' own domains]].

## Where the work is shown

- Home page: the hero plate, the proof band with its logo strip, and the work grid (index.html › .plate, .proof, #work; [[Hero Plate (live client site rotator)]], [[Proof Section (Chiffres clés)]], [[Selected Work Section (Projets)]]).
- Project sheets in `scene/`, generated from `scripts/scene-data.mjs` (README.md › This repository); see [[Project sheets]].

## Graph entry points

- Communities: [[_COMMUNITY_Owner Items and Clients]], [[_COMMUNITY_Client Site Features]], [[_COMMUNITY_Alliance Travel Site]], [[_COMMUNITY_Glaive Store Demo]], [[_COMMUNITY_Hero Plate and Client Logos]], [[_COMMUNITY_Client Logo Strip]], [[_COMMUNITY_Client Domain Verification]], [[_COMMUNITY_Client Voices Builder]].
- Wiki articles: [[Client_Site_Features]], [[Alliance_Travel_Site]], [[Glaive_Store_Demo]], [[Hero_Plate_and_Client_Logos]], [[Client_Logo_Strip]], [[Client_Domain_Verification]], [[Client_Voices_Builder]].
- In-progress projects: [[Not-yet-live projects Doctor Cherfia, Etoile de l'Est]].

## Related maps

[[Project sheets]] · [[Open owner items]] · [[Studio and offer]] · [[WorkspaceHQ and hub]] · [[Timeline]]

## History

The June 2026 customer notes are in `archive/2026-06-snapshot/04-customer-knowledge.md` ([[Clients_and_Segments_2026-06]]); the roster above, from index.html and scene-data.mjs, supersedes them. The whole archive is mapped in [[June 2026 archive]]; how the client screenshots and logos are taken is in [[Captures and image tools]].
