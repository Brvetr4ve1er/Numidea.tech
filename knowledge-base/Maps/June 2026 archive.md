---
type: map
updated: 2026-10-26
sources: [knowledge-base/archive/2026-06-snapshot/README.md, knowledge-base/archive/2026-06-snapshot/CHANGELOG.md, knowledge-base/archive/2026-06-snapshot/02-brand-system.md, knowledge-base/archive/2026-06-snapshot/05-product-knowledge.md, knowledge-base/archive/2026-06-snapshot/07-operations.md, knowledge-base/archive/2026-06-snapshot/12-organization.md, knowledge-base/archive/2026-06-snapshot/13-decision-history.md, knowledge-base/archive/2026-06-snapshot/14-failures-and-lessons.md, knowledge-base/archive/2026-06-snapshot/15-ai-automation-readiness.md, knowledge-base/Home.md, README.md, BRAND.md, OWNER-CONTENT.md, index.html, assets/app.js, scripts/site.mjs, scripts/build-kb.mjs, scripts/client-logos.mjs, audit/Security_Privacy.md, knowledge-base/graphify/GRAPH_REPORT.md, git log]
---

# June 2026 archive

`knowledge-base/archive/2026-06-snapshot/` is the first edition of the studio's knowledge base, written on 2026-06-22 and last revised on 2026-06-28: fifteen domain files, a glossary and a changelog (knowledge-base/archive/2026-06-snapshot/README.md › How the KB is organized, Provenance of this edition; knowledge-base/archive/2026-06-snapshot/CHANGELOG.md › v0.3). It is history only: every file carries a banner saying that where it disagrees with README.md, BRAND.md or the code, those win, and that current owner to-dos live in OWNER-CONTENT.md (each archive file's banner). Start with the file table to see what each domain held and which current map replaced it; no map in this vault uses the archive for a current fact.

## The files

| File | Domain | Maturity in June | Graph note | Current map |
|---|---|---|---|---|
| `01-company-identity.md` | Identity, mission, values, story | Rich | [[KB 01 — Company Identity]] | [[Studio and offer]] |
| `02-brand-system.md` | Visual and verbal identity, assets | Rich | [[KB 02 — Brand System]] | [[Themes and tokens]], [[Motion and illustration]] |
| `03-market-intelligence.md` | Markets, geography, regulation | Partial | [[KB 03 — Market Intelligence]] | [[Pricing and market]] |
| `04-customer-knowledge.md` | Segments, personas, journey | Partial | [[KB 04 — Customer Knowledge]] | [[Clients and projects]] |
| `05-product-knowledge.md` | Services, projects, architecture | Rich | [[KB 05 — Product Knowledge]] | [[Studio and offer]], [[Clients and projects]] |
| `06-competitive-intelligence.md` | Competitors | Scaffold | [[KB 06 — Competitive Intelligence]] | — |
| `07-operations.md` | Delivery, support, SOPs | Partial | [[KB 07 — Operations]] | [[Deploy]], [[Build and gates]] |
| `08-marketing.md` | Acquisition, channels, campaigns | Scaffold | [[KB 08 — Marketing]] | — |
| `09-sales-partnerships.md` | Sales motion, partnerships | Scaffold | [[KB 09 — Sales & Partnerships]] | — |
| `10-data-analytics.md` | KPIs, metrics, instrumentation | Partial | [[KB 10 — Data & Analytics]] | — |
| `11-legal-compliance.md` | Terms, privacy, IP, regulation | Scaffold | [[KB 11 — Legal & Compliance]] | [[Open owner items]] |
| `12-organization.md` | Org structure, roles, onboarding | Partial | [[Knowledge Base 12 — Organization]] | [[Studio and offer]] |
| `13-decision-history.md` | Major decisions and their reasoning | Rich (session) | [[KB 13 — Decision History]] | [[Timeline]] |
| `14-failures-and-lessons.md` | Mistakes, never-again list | Partial | [[KB 14 — Failures & Lessons]] | — |
| `15-ai-automation-readiness.md` | Guidance for retrieval systems and agents | Rich | [[KB 15 — AI & Automation Readiness]] | — |
| `glossary.md` | Internal language, terms, acronyms | Rich | [[KB Glossary — Internal Language]] | [[Maps/Glossary|Glossary]] |
| `CHANGELOG.md` | The knowledge base's version history | Rich | [[KB Changelog]] | [[Timeline]] |

Sources: knowledge-base/archive/2026-06-snapshot/README.md › How the KB is organized, for the domains and the maturity; "Scaffold" there means structure and owner questions with little data yet (same section, legend). The last column is this vault's pointer, not the archive's.

- The overview note [[Numidea Labs Institutional Knowledge Base (README)]] is a god node with 25 edges, and [[KB 05 — Product Knowledge]] has 18 (knowledge-base/graphify/GRAPH_REPORT.md › God Nodes).

## How it was built

- An honesty contract: nothing fabricated, and where data did not exist, a scaffold marked `UNKNOWN` or `confidence: low` with the questions an owner must answer (knowledge-base/archive/2026-06-snapshot/README.md › Honesty contract (read this first)). Graph: [[KB honesty contract (nothing fabricated; GAP scaffolds)]].
- A confidence value on every object, `verified`, `inferred`, `assumed` or `unknown`, called the most important field (knowledge-base/archive/2026-06-snapshot/README.md › Confidence scale). Graph: [[Confidence scale (verified  inferred  assumed  unknown)]].
- Stable `KB-<domain>-<n>` ids and YAML front matter, so that each object could be retrieved on its own (knowledge-base/archive/2026-06-snapshot/README.md › Metadata schema; knowledge-base/archive/2026-06-snapshot/15-ai-automation-readiness.md › KB-15-001).
- It was assembled from public-facing and code artifacts only and had not been reviewed by the founders (knowledge-base/archive/2026-06-snapshot/README.md › Provenance of this edition).
- The maps in this vault keep the honesty rule in a stricter form: every factual sentence cites a repository file (knowledge-base/Home.md › The honesty rule).

## What it recorded that still explains the site

- **The lead leak.** The contact form validated and showed success but sent nothing; on 2026-06-22 it became a `mailto:` handoff, with the lesson "never show a success state unless a real handoff occurred" (knowledge-base/archive/2026-06-snapshot/14-failures-and-lessons.md › KB-14-001). The form still opens the visitor's mail app, now with the lead source in the message (assets/app.js › contact form). Graph: [[Contact form silently dropped leads → mailto handoff fix]]; today's flow is in [[Site architecture]].
- **Honest labels.** Three of five project cards said "Live" while only one site resolved; the others became "Soon" (knowledge-base/archive/2026-06-snapshot/14-failures-and-lessons.md › KB-14-002; knowledge-base/archive/2026-06-snapshot/13-decision-history.md › KB-13-006).
- **Docs in the same change.** The README still described the previous design system after the Arcanum rebrand; the lesson was to update docs in the same change as the thing they describe (knowledge-base/archive/2026-06-snapshot/14-failures-and-lessons.md › KB-14-003).
- **The Preview.** In June the signature offer was "a real, working demo of the client's project, built up front, before payment" (knowledge-base/archive/2026-06-snapshot/05-product-knowledge.md › KB-05-002). Today L'Aperçu is the homepage of the client's new site in 5 working days, free, for registered businesses only, at most 4 a month (index.html › #apercu); see [[Studio and offer]]. Graph: [[The Preview (L'Aperçu) — working demo before payment]].
- **The June decisions.** A multi-theme token architecture, Geist type, the Arcanum rebrand, the Magician + Creator + Sage voice, committed screenshots with honest fallbacks, the "Live" honesty pass and motion-ready service glyphs (knowledge-base/archive/2026-06-snapshot/13-decision-history.md › KB-13-001 to KB-13-007). See [[Themes and tokens]] and [[Motion and illustration]] for what they became.
- **The IP guardrail.** The Arcanum look evokes a genre and never uses protected third-party names, logos or characters; the file calls the rule binding (knowledge-base/archive/2026-06-snapshot/02-brand-system.md › KB-02-009). Graph: [[IP  trademark guardrail (binding)]].
- **The anonymous team.** Roles by initial only, real names undocumented (knowledge-base/archive/2026-06-snapshot/12-organization.md › KB-12-001). BRAND.md still cites this file for the team on the home page: initials only, the responsibilities it verified, no names or genders (BRAND.md › Founder section — the CV is the source of truth).

## Where it is out of date

The archive's own bracketed 2026-10 notes mark most of these.

| Topic | June snapshot | Now |
|---|---|---|
| Projects | Five projects, one confirmed live (knowledge-base/archive/2026-06-snapshot/05-product-knowledge.md › KB-05-003) | Four delivered client sites, Glaive Store a portfolio demo, WorkspaceHQ the studio's own product (README.md › This repository — the landing page; scripts/client-logos.mjs › header); Nomara Voyages is still unconfirmed as a client (OWNER-CONTENT.md › 7). See [[Clients and projects]] |
| Deploy | `pages.yml` auto-deployed on every push (knowledge-base/archive/2026-06-snapshot/07-operations.md › KB-07-002), uploading the whole repository (audit/Security_Privacy.md › S-01) | Only the `DEPLOY` paths are staged and published (scripts/site.mjs › DEPLOY); see [[Deploy]] |
| Themes | Five themes, Arcanum the default (knowledge-base/archive/2026-06-snapshot/13-decision-history.md › KB-13-001, KB-13-003) | Six themes, each one block of the same 46 tokens (README.md › Design system — see BRAND.md) |
| Fonts | A Google Fonts request, trimmed to the weights in use (knowledge-base/archive/2026-06-snapshot/CHANGELOG.md › v0.3) | Self-hosted faces, no third-party requests (README.md › This repository — the landing page) |
| Contact | The June form fix used an earlier address (knowledge-base/archive/2026-06-snapshot/CHANGELOG.md › v0.2) | One address across the pages, which `npm run check` enforces (README.md › Contact, Commands) |

## How it left the site

- The July 2026 code audit found these files served on the public site and left the call to the owner (audit/Security_Privacy.md › S-01); see [[Code audit (2026-07)]].
- On 2026-10-09 the deploy was narrowed to the site list (git log, commit c5ea7cf); `knowledge-base` is in `NOT_DEPLOYED` (scripts/site.mjs › NOT_DEPLOYED), and it stays readable on GitHub (OWNER-CONTENT.md › 12).
- On 2026-10-19 the snapshot moved to `archive/` and the graphify graph was exported beside it (git log, commit 9afd9ba). The export rebuilds `graph/`, `wiki/` and `graphify/` and leaves `archive/` alone (scripts/build-kb.mjs › "generated layers are rebuilt from scratch").

## Graph entry points

- Communities drawn mostly from the archive: [[_COMMUNITY_Company Identity (2026-06)]], [[_COMMUNITY_Clients and Segments (2026-06)]], [[_COMMUNITY_Market Intelligence (2026-06)]], [[_COMMUNITY_Products and Operations (2026-06)]], [[_COMMUNITY_Positioning and Competition (2026-06)]], [[_COMMUNITY_Lessons and AI Readiness (2026-06)]], [[_COMMUNITY_AI Services and Stack (2026-06)]], [[_COMMUNITY_Brand Identity History]], [[_COMMUNITY_Brand Promise and Voice]].
- Wiki: [[Numidea_Labs_Institutional_Knowledge_Base_README]], [[KB_05_—_Product_Knowledge]], [[KB_Glossary_—_Internal_Language]], [[Company_Identity_2026-06]], [[Clients_and_Segments_2026-06]], [[Market_Intelligence_2026-06]], [[Products_and_Operations_2026-06]], [[Positioning_and_Competition_2026-06]], [[Lessons_and_AI_Readiness_2026-06]], [[AI_Services_and_Stack_2026-06]], [[Brand_Identity_History]], [[Brand_Promise_and_Voice]].

## Related

- Maps: [[Timeline]], [[Code audit (2026-07)]], [[Studio and offer]], [[Clients and projects]], [[Pricing and market]], [[Maps/Glossary|Glossary]].
