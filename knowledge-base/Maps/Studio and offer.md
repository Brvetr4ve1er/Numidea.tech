---
type: map
updated: 2026-10-25
sources: [README.md, index.html, assets/app.js, OWNER-CONTENT.md, scripts/check.mjs, BRAND.md]
---

# Studio and offer

Numidea Labs is a development studio in Bordj Bou Arréridj, Algeria, that designs, builds, ships and maintains digital products, with no middleman between the client and the people writing the code (README.md › Numidea Labs). This map covers who the studio is, what it sells and how a project starts. Start with the offer table, then L'Aperçu, then go to [[Pricing and market]] for the figures and [[Open owner items]] for the claims still waiting on the owner.

## Identity in one glance

| Field | Value | Source |
|---|---|---|
| Name and tagline | Numidea Labs, "Rooted in Numidia, built on ideas." | README.md › Numidea Labs |
| What it is | "Studio web & logiciel", Bordj Bou Arréridj, Algérie | index.html › .hero (hero.eyebrow) |
| Languages | French (default), English, Arabic with a mirrored right-to-left layout | README.md › Features |
| Reply time | Within 24 working hours, in French, English or Arabic | README.md › Contact |
| Time zone | UTC+1 (Paris time in winter, one hour less in summer) | index.html › #contact (contact.vTz) |
| Contact | hamissemohamedyasser@gmail.com, WhatsApp +213 672 41 25 78 | README.md › Contact |

- The contact address is a personal Gmail; a mailbox on the studio's own domain is an open owner item (OWNER-CONTENT.md › 5).
- `check.mjs` fails if any mailto or JSON-LD email on the site differs from the one contact address (README.md › Commands; scripts/check.mjs › block 8g, "One contact address everywhere").

## What the studio sells

The README names four offers plus a signature one (README.md › What we build):

| Offer | Promise (README) |
|---|---|
| [[Sites & applications offer\|Sites & applications]] | Bespoke websites and web apps, front-end to cloud |
| [[Automation & data offer\|Automation & data]] | Scrapers, lead pipelines, market-intelligence systems, internal tools, integrations |
| [[Brand & design systems offer\|Brand & design systems]] | Logos, visual identity, design systems, motion |
| [[Strategy & consulting offer\|Strategy & consulting]] | Market audits, funnel analysis, competitive intelligence, growth roadmaps |
| [[L'Aperçu  The Preview (signature offer)\|L'Aperçu / The Preview]] | Homepage of the new site before any payment (below) |

The home page shows five main services in three families and folds five more under "Voir les 5 autres services" (index.html › #services; English labels from assets/app.js › EXTRA, f*.name and c*.name):

| Service (EN label) | Family | Shown as |
|---|---|---|
| [[Sites & Web Applications Service\|Sites & web applications]] | Sites & design | main |
| [[Identity & Visual Systems Service\|Branding & visual systems]] | Sites & design | main |
| [[Automation & Pipelines Service\|Automation & pipelines]] | Data & automation | main |
| [[Market & Product Intelligence Service\|Market & product intelligence]] | Data & automation | main |
| [[Strategy & Growth Consulting Service\|Strategy & growth consulting]] | Advisory & AI | main |
| E-commerce & booking | Sites & design | folded |
| Graphic & social design | Sites & design | folded |
| Data science & analytics | Data & automation | folded |
| Knowledge systems | Advisory & AI | folded |
| Custom AI tools & skills | Advisory & AI | folded |

- The folded five sit in [[Five Other Services (capabilities)]] inside the [[Services Section]] (index.html › #services .capabilities).
- The web service brief names React, Next.js, Vite and Tailwind on Vercel and promises a design drawn from zero, not a bought template (index.html › #services, f1.brief).

## L'Aperçu, the signature offer

- Before any payment, the studio builds the homepage of the client's new site with the client's own content in 5 working days and presents it on a 30-minute video call (index.html › #apercu, prev.brief).
- Free and without obligation, for registered businesses only, and at most 4 Aperçus a month across all clients (index.html › #apercu, prev.terms; README.md › What we build).
- If the client says no, nothing is owed (index.html › #apercu, prev.brief).
- The registered-business and four-a-month conditions are repeated in the hero, method step 3 and FAQ 2 and 6 (index.html › .hero, #how, #faq).
- Graph: [[L'Aperçu (signature offer)]], [[Try Before You Pay (zero-risk proof)]].

## How a project starts

The [[Method Section (four steps)]] is the only process on the page (index.html › #how):

1. The client describes the project in two minutes, in writing or by voice, in French, English or Arabic (index.html › #how, price.ob1p).
2. The studio replies within 24 working hours with questions, then a written scope and a firm price once the scope is agreed (index.html › #how, price.ob2p).
3. The studio builds the Aperçu for free, under the conditions above (index.html › #how, price.ob3p).
4. The client decides; on a yes, the homepage is already done and the rest follows (index.html › #how, price.ob4p).

Principles stated in the README (README.md › How we work; [[How we work (no middleman, one team, we answer)]]):
- No middleman: one team scopes, builds and ships.
- One team owns the whole chain, design to code to deploy.
- "We answer when it breaks": deadlines kept, replies within 24 working hours.

After launch, each package includes 1, 3 or 6 months of support, and maintenance is then optional, monthly, with no fixed term (index.html › #faq, faq4.a; [[Post-launch Support Commitment]]). The figures are in [[Pricing and market]].

## People

- Founder: Yasser Hamisse, "Designer graphique & développeur web · Fondateur", French C2, English C1, Arabic native (index.html › #founder).
- The founder card's dates, titles and one-liners are taken from the CV PDF in `assets/cv_yasser_hamisse_2026.pdf`, which the page names as the source of truth (index.html › #founder, comment).
- Three specialists are shown by initial only (index.html › .team; [[Studio Team (D, S, T)]]):
  - D, data specialist: pipelines, scraping and the intelligence layer.
  - S, sales and partnerships: first contact, turns the idea into scope.
  - T, technical lead: quality of what ships, keeps the client informed.
- The page counts 4 people on the team and a founder with three specialists (index.html › .proof, .hero). That claim, the team photos and the founder photo are owner items (OWNER-CONTENT.md › 3, 4).
- The founder's personal page is `hub/` (VOIDSPLUNKER.std), with its own CSS and JS (README.md › This repository); see [[WorkspaceHQ and hub]].
- The team is anonymized by design: initials only, no names or genders documented, so the copy uses no pronouns for D, S and T (BRAND.md › Founder section — the CV is the source of truth).
- How the founder card is built (the CV as source of truth, the timeline order, the workbench plate behind it) is in [[Motion and illustration]].
- Graph: [[Founder & Team Section]], [[Founder section]], [[_COMMUNITY_Founder Section and Atlas Plates]], wiki [[Founder_Section_and_Atlas_Plates]].

## Declared tools

The [[Stack Section (Outils)]] lists (index.html › #stack):

| Group | Tools |
|---|---|
| Front | React, Next.js, Vite, TypeScript, Tailwind |
| Back | Node, Python, FastAPI, PostgreSQL |
| Cloud | Vercel, Docker, Cloudflare, GitHub Actions |
| Data | Playwright, Pandas, Supabase, REST APIs |
| Mobile | PWA, React Native, Expo |

- No delivered project shows React Native, Expo, Docker or Cloudflare; the owner has to confirm or correct this list (OWNER-CONTENT.md › 14).
- The studio site itself is hand-written HTML, CSS and vanilla JavaScript with no framework (README.md › This repository); see [[Site architecture]].

## How a lead reaches the studio

- The contact form opens the visitor's mail app with the message ready, and the page says the site does not keep the message (index.html › #contact, form.note; [[Contact Form (mailto handoff)]]).
- Where a lead came from (`?ref=`, `utm_*`, presence of a Meta or Google click id) rides inside the email the visitor sends; no cookies, no analytics (README.md › Features; [[Lead source without tracking]]).
- WhatsApp is the second channel, in the contact section and a phone bar (index.html › #contact, .m-contact; [[Studio contact (Gmail, WhatsApp)]]).
- The Supabase lead store is off on purpose (OWNER-CONTENT.md › 11).

## Graph entry points

- Communities: [[_COMMUNITY_Studio Offers (README)]], [[_COMMUNITY_L'Aperçu and Method]], [[_COMMUNITY_Other Services]], [[_COMMUNITY_Stack and Sites Service]], [[_COMMUNITY_Founder, Team and Contact Form]], [[_COMMUNITY_i18n and Contact Flow]], [[_COMMUNITY_Brand Promise and Voice]].
- Wiki articles: [[Studio_Offers_README]], [[L'Aperçu_and_Method]], [[Other_Services]], [[Stack_and_Sites_Service]], [[Founder,_Team_and_Contact_Form]], [[Brand_Promise_and_Voice]].
- Studio node from the README: [[Numidea Labs_1|Numidea Labs (README)]]; FAQ: [[FAQ Section]].

## Related maps

[[Pricing and market]] · [[Clients and projects]] · [[Open owner items]] · [[Languages and RTL]] · [[Themes and tokens]] · [[WorkspaceHQ and hub]] · [[Maps/Glossary|Glossary]]

## History

The June 2026 identity notes are in `archive/2026-06-snapshot/01-company-identity.md` ([[Company_Identity_2026-06]]); where they disagree with README.md, BRAND.md, OWNER-CONTENT.md or the code, the current files win. The whole archive is mapped in [[June 2026 archive]].
