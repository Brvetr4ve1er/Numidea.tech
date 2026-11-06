---
type: map
updated: 2026-11-06
sources: [OWNER-CONTENT.md, README.md, IMPROVEMENTS.md, NOTICE.md, index.html, assets/i18n/fr.js, assets/i18n/ar.js, hub/index.html, scripts/legal-data.mjs, scripts/build-legal.mjs, scripts/voices-data.mjs, scripts/verify-domains.mjs, scripts/site.mjs, scripts/check.mjs]
---

# Open owner items

Some things on the site can only come from the owner: legal facts, consent, photos, confirmations. `OWNER-CONTENT.md` is the register; the site leaves a place for each item and shows nothing until the real thing exists, with no placeholders and no invented content (OWNER-CONTENT.md › intro). Start with the register table, then the claims, then "How an item closes".

The register's own status line reads "as of 2026-10-31 (after the owner's answers of 2026-10-30 and the fix fleet of 2026-10-31; sections 16 and 17 record those answers)" (OWNER-CONTENT.md › intro). Nothing below is resolved unless a cited file says so.

## The register

| # | Item | Status in the register | What closes it | Where it goes |
|---|---|---|---|---|
| 1 | [[Legal notice + privacy page]] | Missing: 16 fields, 5 of them in three languages; "later" (owner, 2026-10-30) | The owner fills every `null`, then `npm run build` | `scripts/legal-data.mjs` |
| 2 | [[Client quotes (voices), with consent\|Client quotes, with consent]] | None yet | Written agreement to the exact text, entered in `VOICES` | `scripts/voices-data.mjs` |
| 3 | [[Founder photo (assetsfounder.webp)\|Founder photo]] | None; the monogram "Y" shows | A real photo, never generated, square, at least 400 px | `assets/founder.webp` |
| 4 | [[Team photos and 'four specialists' claim\|Team names, photos and team size]] | Answered 2026-10-30: one founder, with freelancers when needed; the page still says "four specialists" until the copy change | The copy change (the next change); no photos to add, there being no team | `index.html` #founder, `assets/i18n/*.js` |
| 5 | [[Studio email on its own domain]] | Personal Gmail in use; it stays for now (owner, 2026-10-30) | A mailbox on the studio's domain, replaced everywhere | every place the address appears |
| 6 | [[Clients' permission for paid ads]] | Not asked yet | Each client's written permission (an email or WhatsApp is enough) | campaign kit, outside this repo |
| 7 | [[Nomara Voyages (unconfirmed client)\|Nomara Voyages: client or not]] | Unconfirmed | Confirmation and permission, or removal | `index.html` work grid, logo strip |
| 8 | [[Arabic native review]] | Pending; every Arabic string added on 2026-10-31 listed in §8 | A native speaker's pass over the Arabic copy | `assets/i18n/ar.js`, `scripts/scene-data.mjs`, `scripts/build-og.mjs`, `404.html` |
| 9 | [[Clients' own domains]] | None verifies | A client points a domain at the build; `verify-domains.mjs` confirms | `scripts/verify-domains.mjs` |
| 10 | [[Hub fan art rights]] | No fan art on the site since 2026-10-28 (still in git history; not live: nothing has deployed since 2026-10-25) | Closed for the site by the hub's rebuild; the history is the owner's call, as for 12 | git history of `hub/` |
| 11 | [[Supabase lead store (off on purpose)]] | Off on purpose | Legal page published, region set, new form note | `index.html`, `scripts/legal-data.mjs` |
| 12 | [[Campaign kit in public git history\|Campaign kit and git history]] | Kit with the owner | Owner's call on a history rewrite | outside this repo |
| 13 | [[WorkspaceHQ open-source claim\|WorkspaceHQ: open source or not]] | Claim removed (no licence, no README) | A LICENSE and root README in the product repo, then restore the wording | `Brvetr4ve1er/workspace-HQ`, `workspacehq/`, `scripts/scene-data.mjs` |
| 14 | [[Claims only the owner can confirm (8 open)\|Claims only the owner can confirm]] | 8 listed: 5 open, 3 answered on 2026-10-30 (one applied, two waiting for the copy change) | Confirm each, or say what is true | see below |
| 15 | Hub illustrations (the owner's: himself and Kūro) | 3 points for review (the diary titles approved 2026-10-28), written for the art of 2026-10-28; the diary and that print left the page with the character bible on 2026-11-05 | Say what is true of Kūro (the page says only "Kūro, the black cat"); confirm the hexagon "N" badge as a costume detail; keep or paint out the glyph-like symbols on one print | `hub/` |
| 16 | Commercial terms (payment, ownership, hosting, revisions, support, contract, the Aperçu rules) | Drafted on the owner's instruction of 2026-10-31 ("make them up"), his to change at any time | Nothing to supply; a change of any term is his call | OWNER-CONTENT.md › 16; the FAQ, from the next change on |
| 17 | Team and contact facts | Answered 2026-10-30: one founder with freelancers; WhatsApp only, Sunday to Thursday 9h–18h, the Gmail address stays | The copy change (the next change) | OWNER-CONTENT.md › 17 |

Source: OWNER-CONTENT.md › table and sections 1–17. The README points to the same file for "what only the owner can supply" (README.md › What only the owner can supply).

Facts the owner has not been asked for since, kept as open: the DA tax regime and the € reverse-charge clause (IMPROVEMENTS.md › A1), the toolchain confirmation (F11), whether the studio runs Meta ads and whether the number is on WhatsApp Business (F12: `privacy.metaAds` and `privacy.whatsappBusiness`, null since 2026-10-31, gate the privacy page's sentences; a "no" on the ads drops the only paragraph describing the campaign codes, so a neutral replacement is written then), the Gulf payment and tax facts (A7), and where `workspacehq/embed/support.js` comes from and under what licence (NOTICE.md › support.js; IMPROVEMENTS.md › Owner facts).

## Item notes

- **1, legal page.** Fields: legal name, legal form, capital (or `false`), postal address, contact email, registration label and number, publication director, GitHub's postal address, retention period, privacy-request email, ANPDP declaration status (or `false`), licence for the site's text and images, review date, and since 2026-10-31 `privacy.metaAds` and `privacy.whatsappBusiness` (`true` prints the ad and WhatsApp Business sentences, `false` drops them, `null` blocks publication) (OWNER-CONTENT.md › 1; scripts/legal-data.mjs › privacy). In code all of these are still `null`; the phone number is filled, `hosts` is `['github']` and `supabaseRegion` is `false` (scripts/legal-data.mjs › LEGAL). The licence choice is `cc0` (keep the CC0 LICENSE) or `reserved` (change the LICENSE first), and the footer shows only "© 2026 Numidea Labs" (OWNER-CONTENT.md › 1; [[ip.licence (cc0 vs reserved)]]); `NOTICE.md` says meanwhile what the CC0 does not reach (NOTICE.md). Preview with the gaps marked: `node scripts/build-legal.mjs --preview`, 26 gaps on 2026-10-31 (OWNER-CONTENT.md › 1; IMPROVEMENTS.md › F12).
- **2, voices.** `VOICES` is an empty list; only Bordj Steel, Alliance Travel, AlmaFlowClim and Nomara Voyages can be quoted (scripts/voices-data.mjs › VOICES, VOICE_CLIENTS).
- **4, team.** The owner answered on 2026-10-30: one founder, with freelancers when needed; the hero lede, the founder block and its team card, FAQ 5 and 6 and the brand-identity service's "four-person studio" change with the next change, in the three languages, and the lede names Yasser Hamisse (OWNER-CONTENT.md › 4, 17; IMPROVEMENTS.md › decision 21). Until then the site still says "four specialists" and FAQ 6 says one team scopes, codes and ships (index.html › .hero; assets/i18n/fr.js › hero.lede, faq6.a); the proof band's "4 personnes dans l'équipe" counter went on 2026-10-26.
- **5, email.** The address to replace sits in `index.html` (five times: links, text, JSON-LD; the same in `en/` and `ar/`, baked from it), the form's mailto in `assets/app.js` and `hub/index.html`; `npm run check` fails until all match (OWNER-CONTENT.md › 5; IMPROVEMENTS.md › Owner facts, A2).
- **6, paid ads.** The Bordj Steel and Alliance Travel ad cards need each client's written permission before they run (OWNER-CONTENT.md › 6). The same message can cover the use of each client's logo on the site (OWNER-CONTENT.md › 7).
- **8, Arabic.** Points to recheck include the services title punctuation, "Shopify بواجهة مستقلة (headless)", the tag pills and the estimator's counted nouns; conventions to keep are Western digits, forward arrows `←`, singular "you" (OWNER-CONTENT.md › 8). See [[Languages and RTL]].
- **9, domains.** `bordj-steel.com`, `alliance-travel.dz` and `nomaravoyages.com` do not resolve; `almaflowclim.fr` serves a different Hostinger site (OWNER-CONTENT.md › 9). See [[Clients and projects]].
- **11, Supabase.** The keys in `index.html` are empty strings today (index.html › NUMIDEA_SUPABASE_URL, NUMIDEA_SUPABASE_KEY). `check.mjs` refuses the store being on without the published legal page, `privacy.supabaseRegion` and a rewritten form note in three languages (scripts/check.mjs › block 8b, Supabase guard).
- **12, git history.** The kit was removed from the repository on 2026-10-12 but is still in the history of earlier commits; removing it means a force-push rewrite of every later commit, best done when no pull request is open (OWNER-CONTENT.md › 12). `knowledge-base/` and `audit/` are readable on GitHub but never on the site (OWNER-CONTENT.md › 12; scripts/site.mjs › NOT_DEPLOYED).
- **13, WorkspaceHQ.** On 2026-10-13 the product repository had no licence file and no README, and its `dashboard/package.json` is marked `"private": true` and starts Electron; the pages now say the code is public on GitHub and describe a desktop console (OWNER-CONTENT.md › 13). See [[WorkspaceHQ and hub]].

## Item 14: claims only the owner can confirm

None is proven false and none could be verified; three were answered on 2026-10-30 (OWNER-CONTENT.md › 14).

| Claim | Why it is open | On the site now |
|---|---|---|
| "6 ans" of experience | Freelance work "2019 — aujourd'hui" is about 7 years in October 2026 | Founder card still shows "6 ans" (assets/i18n/fr.js › founder.years; index.html › #founder) |
| "des clients en France" (plural) | The portfolio shows one French client, AlmaFlowClim | FAQ 5 still says it (index.html › #faq, faq5.a) |
| "nous livrons avec … React, Next.js, Vercel" | Every delivered build linked from the site is served by Netlify; only Bordj Steel shows Next.js | The market note says it, on the price guide since 2026-10-31 (tarifs/index.html › #market, mk.note); the next change keeps React and Next.js and drops Vite and Vercel from the pills, F11 staying the owner's to confirm |
| Essentiel: "domaine et certificat configurés" | No delivered client site is served from its own domain yet | Tier card still lists it, on the home and the guide (index.html › #pricing, price.t1d) |
| "Si c'est oui, la page d'accueil est déjà faite : on enchaîne sur le reste." (the Aperçu path's last step) | Said after a one-page Aperçu, for projects of up to 16 weeks; the drafted Aperçu rules say what a yes includes | Still the last step of the path in the L'Aperçu card (index.html › #apercu, prev.tl5p) |
| "Leader de la construction métallique en Algérie" (Bordj Steel's card) | The client's own tagline, stated as fact in the studio's voice | Answered 2026-10-30 (decision 19): the sheet's checkable description, with the next change (assets/i18n/fr.js › proj4.desc; IMPROVEMENTS.md › F13) |
| "avec du café noir et du TypeScript" | This site contains no TypeScript | Answered 2026-10-30 (decision 10) and applied: the README says JavaScript since 2026-10-31; the footer signoff had left on 2026-10-26 (README.md › the signature; IMPROVEMENTS.md › F14) |
| hub/: "VOIDSPLUNKER.std is an agency of one" | The home page presents a studio of four specialists | Answered 2026-10-30: one founder with freelancers; the line stays on the hub (decision 22) and the home page's wording follows with the next change (hub/index.html › .foot-bio; OWNER-CONTENT.md › 17) |

Claim sources: OWNER-CONTENT.md › 14. The AlmaFlowClim "Industrie" row left the register on 2026-10-31: the card has read "Artisan · Île-de-France" since the copy rewrite of 2026-10-14 (OWNER-CONTENT.md › 14, the dropped line; assets/i18n/fr.js › proj3.cat). The stack section's React Native, Expo, Docker and Cloudflare left the register when the section left the page on 2026-10-26, an owner decision (BRAND.md › Page structure and design system (home page)).

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
