---
type: map
updated: 2026-10-26
sources: [OWNER-CONTENT.md, README.md, index.html, assets/app.js, hub/index.html, scripts/legal-data.mjs, scripts/voices-data.mjs, scripts/verify-domains.mjs, scripts/site.mjs, scripts/check.mjs]
---

# Open owner items

Some things on the site can only come from the owner: legal facts, consent, photos, confirmations. `OWNER-CONTENT.md` is the register; the site leaves a place for each item and shows nothing until the real thing exists, with no placeholders and no invented content (OWNER-CONTENT.md › intro). Start with the register table, then the eight claims, then "How an item closes".

The register's own status line reads "as of 2026-10-12 (updated after the review round)" (OWNER-CONTENT.md › intro). Nothing below is resolved unless a cited file says so.

## The register

| # | Item | Status in the register | What closes it | Where it goes |
|---|---|---|---|---|
| 1 | [[Legal notice + privacy page]] | Missing: 14 fields, 5 of them in three languages | The owner fills every `null`, then `npm run build` | `scripts/legal-data.mjs` |
| 2 | [[Client quotes (voices), with consent\|Client quotes, with consent]] | None yet | Written agreement to the exact text, entered in `VOICES` | `scripts/voices-data.mjs` |
| 3 | [[Founder photo (assetsfounder.webp)\|Founder photo]] | None; the monogram "Y" shows | A real photo, never generated, square, at least 400 px | `assets/founder.webp` |
| 4 | [[Team photos and 'four specialists' claim\|Team names, photos and team size]] | Initials D, S, T; "four specialists" claimed | Photos, and a confirmation of the team-size claim | `index.html` #founder, `assets/app.js` |
| 5 | [[Studio email on its own domain]] | Personal Gmail in use | A mailbox on the studio's domain, replaced everywhere | every place the address appears |
| 6 | [[Clients' permission for paid ads]] | Not asked yet | Each client's written permission (an email or WhatsApp is enough) | campaign kit, outside this repo |
| 7 | [[Nomara Voyages (unconfirmed client)\|Nomara Voyages: client or not]] | Unconfirmed | Confirmation and permission, or removal | `index.html` work grid, logo strip |
| 8 | [[Arabic native review]] | Pending | A native speaker's pass over the Arabic copy | `assets/app.js`, `scripts/scene-data.mjs`, `404.html` |
| 9 | [[Clients' own domains]] | None verifies | A client points a domain at the build; `verify-domains.mjs` confirms | `scripts/verify-domains.mjs` |
| 10 | [[Hub fan art rights]] | Open question | Confirm the rights, or take the art down | `hub/` |
| 11 | [[Supabase lead store (off on purpose)]] | Off on purpose | Legal page published, region set, new form note | `index.html`, `scripts/legal-data.mjs` |
| 12 | [[Campaign kit in public git history\|Campaign kit and git history]] | Kit with the owner | Owner's call on a history rewrite | outside this repo |
| 13 | [[WorkspaceHQ open-source claim\|WorkspaceHQ: open source or not]] | Claim removed (no licence, no README) | A LICENSE and root README in the product repo, then restore the wording | `Brvetr4ve1er/workspace-HQ`, `workspacehq/`, `scripts/scene-data.mjs` |
| 14 | [[Claims only the owner can confirm (8 open)\|Claims only the owner can confirm]] | 8 open | Confirm each, or say what is true | see below |

Source: OWNER-CONTENT.md › table and sections 1–14. The README points to the same file for "what only the owner can supply" (README.md › What only the owner can supply).

## Item notes

- **1, legal page.** Fields: legal name, legal form, capital (or `false`), postal address, contact email, registration label and number, publication director, GitHub's postal address, retention period, privacy-request email, ANPDP declaration status (or `false`), licence for the site's text and images, review date (OWNER-CONTENT.md › 1). In code all of these are still `null`; the phone number is filled, `hosts` is `['github']` and `supabaseRegion` is `false` (scripts/legal-data.mjs › LEGAL). The licence choice is `cc0` (keep the CC0 LICENSE) or `reserved` (change the LICENSE first), and the footer shows only "© 2026 Numidea Labs" (OWNER-CONTENT.md › 1; [[ip.licence (cc0 vs reserved)]]). Preview with the gaps marked: `node scripts/build-legal.mjs --preview` (OWNER-CONTENT.md › 1).
- **2, voices.** `VOICES` is an empty list; only Bordj Steel, Alliance Travel, AlmaFlowClim and Nomara Voyages can be quoted (scripts/voices-data.mjs › VOICES, VOICE_CLIENTS).
- **4, team.** The site says "four specialists" in several places; FAQ 6 now says one team scopes, codes and ships, because the team card gives first contact to S (OWNER-CONTENT.md › 4). The hero presents a founder and three specialists (index.html › .hero; assets/app.js › hero.lede); the proof band's "4 personnes dans l'équipe" counter went on 2026-10-26.
- **5, email.** The address to replace sits in `index.html` (links, text, JSON-LD), the form's mailto in `assets/app.js` and `hub/index.html`; `npm run check` fails until all match (OWNER-CONTENT.md › 5).
- **6, paid ads.** The Bordj Steel and Alliance Travel ad cards need each client's written permission before they run (OWNER-CONTENT.md › 6). The same message can cover the use of each client's logo on the site (OWNER-CONTENT.md › 7).
- **8, Arabic.** Points to recheck include the services title punctuation, "Shopify بواجهة مستقلة (headless)", the tag pills and the estimator's counted nouns; conventions to keep are Western digits, forward arrows `←`, singular "you" (OWNER-CONTENT.md › 8). See [[Languages and RTL]].
- **9, domains.** `bordj-steel.com`, `alliance-travel.dz` and `nomaravoyages.com` do not resolve; `almaflowclim.fr` serves a different Hostinger site (OWNER-CONTENT.md › 9). See [[Clients and projects]].
- **11, Supabase.** The keys in `index.html` are empty strings today (index.html › NUMIDEA_SUPABASE_URL, NUMIDEA_SUPABASE_KEY). `check.mjs` refuses the store being on without the published legal page, `privacy.supabaseRegion` and a rewritten form note in three languages (scripts/check.mjs › block 8b, Supabase guard).
- **12, git history.** The kit was removed from the repository on 2026-10-12 but is still in the history of earlier commits; removing it means a force-push rewrite of every later commit, best done when no pull request is open (OWNER-CONTENT.md › 12). `knowledge-base/` and `audit/` are readable on GitHub but never on the site (OWNER-CONTENT.md › 12; scripts/site.mjs › NOT_DEPLOYED).
- **13, WorkspaceHQ.** On 2026-10-13 the product repository had no licence file and no README, and its `dashboard/package.json` is marked `"private": true` and starts Electron; the pages now say the code is public on GitHub and describe a desktop console (OWNER-CONTENT.md › 13). See [[WorkspaceHQ and hub]].

## Item 14: claims only the owner can confirm

None is proven false and none could be verified (OWNER-CONTENT.md › 14).

| Claim | Why it is open | On the site now |
|---|---|---|
| "6 ans" of experience | Freelance work "2019 — aujourd'hui" is about 7 years in October 2026 | Founder card still shows "6 ans" (assets/app.js › founder.years; index.html › #founder) |
| "des clients en France" (plural) | The portfolio shows one French client, AlmaFlowClim | FAQ 5 still says it (index.html › #faq, faq5.a) |
| "nous livrons avec … React, Next.js, Vercel" | Every delivered build linked from the site is served by Netlify; only Bordj Steel shows Next.js | Market note still says it (index.html › #market, mk.note) |
| Essentiel: "domaine et certificat configurés" | No delivered client site is served from its own domain yet | Tier card still lists it (index.html › #pricing, price.t1d) |
| AlmaFlowClim labelled "Industrie" | Its own site presents a residential heating, air-conditioning and plumbing business | The card now reads "Artisan · Île-de-France" (assets/app.js › proj3.cat); the register still counts the item |
| "Si c'est oui, on est déjà à mi-chemin" (method step 4) | Said after a one-page Aperçu, for projects of up to 16 weeks | Step 4 now reads "Si c'est oui, la page d'accueil est déjà faite : on enchaîne sur le reste." (index.html › #how, price.ob4p); the register still counts the item |
| hub/: "VOIDSPLUNKER.std is an agency of one" | The home page presents a studio of four specialists | Still in the hub footer (hub/index.html › .foot-bio) |

Claim sources: OWNER-CONTENT.md › 14. Two rows (AlmaFlowClim, method step 4) differ between the register and the current copy; whether the owner considers them closed is not recorded in the repository. The stack section's React Native, Expo, Docker and Cloudflare left the register when the section left the page on 2026-10-26, an owner decision (BRAND.md › Page structure and design system (home page)).

## What the code holds back meanwhile

| Guard | Effect | Source |
|---|---|---|
| Legal gating | Until the last legal field is filled nothing is published, and no page may link to `legal/` | OWNER-CONTENT.md › 1; scripts/site.mjs › LEGAL_PUBLISHED |
| Supabase guard | The form store cannot be switched on while the form note promises the site keeps nothing | scripts/check.mjs › block 8b, Supabase guard |
| Voices validation | A quote without a past consent date, a consent note, or from a non-delivered client is refused | scripts/voices-data.mjs › validate |
| One contact address | Every mailto and the JSON-LD email must be the same string | scripts/check.mjs › block 8g, "One contact address everywhere" |
| Photo slots | Founder and team photos are commented-out `<img>` slots; the monogram and initials stay until real photos exist | index.html › #founder, .team |

## How an item closes

1. The owner supplies the fact, the file or the decision named in the register (OWNER-CONTENT.md › table).
2. It goes in the file the register names, then `npm run build` and `npm run check` (OWNER-CONTENT.md › 1, 2, 5).
3. Update the register row in `OWNER-CONTENT.md`, then this map.

## Graph entry points

- Communities: [[_COMMUNITY_Owner Items and Clients]], [[_COMMUNITY_Legal Data and Privacy]], [[_COMMUNITY_Legal Page Generator]], [[_COMMUNITY_Client Voices Builder]], [[_COMMUNITY_Client Domain Verification]].
- Wiki articles: [[Owner_Items_and_Clients]], [[Legal_Data_and_Privacy]], [[Legal_Page_Generator]].
- Nodes: [[Owner-supplied content register]], [[Legal data fields (14; 5 translated)]], [[LEGAL]], [[LEGAL_PUBLISHED]], [[legal-data.mjs]], [[VOICES]], [[verify-domains.mjs]].

## Related maps

[[Clients and projects]] · [[Studio and offer]] · [[Pricing and market]] · [[Languages and RTL]] · [[WorkspaceHQ and hub]] · [[Deploy]]
