---
type: map
updated: 2026-10-19
sources: [audit/Executive_Summary.md, audit/Architecture.md, audit/Findings.md, audit/Design_Audit.md, audit/Technical_Debt.md, audit/Improvement_Roadmap.md, audit/Performance_A11y.md, audit/Security_Privacy.md, README.md, BRAND.md, OWNER-CONTENT.md, package.json, package-lock.json, index.html, hub/index.html, 404.html, assets/app.js, scripts/site.mjs, scripts/check.mjs, scripts/verify.mjs, scripts/bump.mjs, scripts/build-og.mjs, .github/workflows/pages.yml, netlify.toml, vercel.json, git log]
---

# Code audit (2026-07)

`audit/` holds the full codebase audit of 2026-07-31, taken at commit `a9fd6da`: eight reports on architecture, defects, design, technical debt, performance and accessibility, and security (audit/Executive_Summary.md › header, Reports; audit/Design_Audit.md › header). It is a dated snapshot that is never deployed, and each report opens by saying that where it disagrees with README.md, BRAND.md or the code, those win (README.md › This repository — the landing page; audit/Executive_Summary.md › 1). Start with the reports table and the verdict, then the findings table, whose last column says what became of each item; today's checks are in [[Build and gates]].

## The eight reports

| File | Covers | Graph note |
|---|---|---|
| `Executive_Summary.md` | Verdict, what was found, what changed, index of the reports | [[Executive Summary - full codebase audit (2026-07-31, commit a9fd6da)]] |
| `Architecture.md` | System overview, repository map, data flow, conventions, risks | [[Architecture & Repository Map (audit 2026-07-31)]] |
| `Findings.md` | All 12 verified defects with locations and fixes | [[Findings - bugs, defects & inconsistencies (12 verified)]] |
| `Design_Audit.md` | Page length and structure, six diagnoses, three directions, the outcome | [[Design Audit - look & structure (2026-07-31)]] |
| `Technical_Debt.md` | Ranked register, including accepted debt with its rationale | [[Technical Debt Register (ranked)]] |
| `Improvement_Roadmap.md` | Applied fixes, decisions needed, later, not recommended | [[Improvement Roadmap (audit 2026-07-31)]] |
| `Performance_A11y.md` | Measured results, font and hosting levers, accessibility gaps | [[Performance & Accessibility Report (audit 2026-07-31)]] |
| `Security_Privacy.md` | The knowledge-base exposure (S-01), the verified-healthy list, CSP notes | [[Security & Privacy Report (audit 2026-07-31)]] |

Sources: audit/Executive_Summary.md › Reports, which indexes six of the files; audit/Design_Audit.md › header for the design audit, which that index does not list.

- Every report carries a 2026-10 note in brackets where the site has since changed; read those before acting on a finding (audit/Findings.md › F-08, F-09, F-11; audit/Architecture.md › 44–49).

## Verdict

- Every file was read, and every claim verified by static analysis or headless-browser measurement (audit/Executive_Summary.md › header).
- The verdict is "fundamentally healthy": a disciplined zero-dependency static site, a real token-based design system, a trilingual i18n engine whose invariants held, honest content states, strong baseline accessibility, and no security exposure in code (audit/Executive_Summary.md › Verdict). Graph: [[Verdict codebase fundamentally healthy]].
- It measured zero JS errors and zero layout overflow across 14 page, viewport, theme and language combinations (audit/Executive_Summary.md › Verdict); the measured table is in audit/Performance_A11y.md › Verified by measurement.
- The architecture report calls the site a "zero-dependency trilingual static marketing site" whose two dev dependencies, Playwright and sharp, existed only for the offline screenshot pipeline (audit/Architecture.md › What this system is): [[Zero-dependency trilingual static marketing site]]. Today there are four: axe-core, html-validate, Playwright and sharp (package.json › devDependencies).

## Findings and what became of them

Severity in the audit: P1 breaks a user-visible promise, P2 is a visible flaw in a real path, P3 is cosmetic or latent (audit/Findings.md › header).

| ID | Sev. | What the audit found | What became of it |
|---|---|---|---|
| F-01, F-02, F-03 | P1 | Daylight theme: hero lede, founder bio and the "soon" project covers near-invisible (hard-coded light greys, one fallback for a token that did not exist) | Tokenized in the audit pass (audit/Improvement_Roadmap.md › Applied, 1); the themes now sit on one 47-token contract (README.md › Design system — see BRAND.md) |
| F-04 | P1 | The services proof line still cited `almaflowclim.fr` in all three languages | Replaced with `almaflowclim.netlify.app` (audit/Improvement_Roadmap.md › Applied, 2) |
| F-05 | P2 | 20 dead `href="#"` links in the hub footer, and a dead service still listed | Wired to the verified URLs (audit/Improvement_Roadmap.md › Applied, 3); the footer link columns were later removed (BRAND.md › hub/ — the artist's page, not the studio's) |
| F-06 | P2 | The mobile menu's entrance stagger skipped the sixth link | Fixed (audit/Improvement_Roadmap.md › Applied, 4) |
| F-07 | P2 | `404.html` broke for nested paths on GitHub Pages | Host-aware paths (audit/Improvement_Roadmap.md › Applied, 5); the head script still recomputes the site root before first paint (404.html › 102–114) |
| F-08 | P2 | The `og:image` was a relative SVG, which share previews do not render | Fixed in the audit; the share image is now `assets/og.jpg`, rendered by `scripts/build-og.mjs` (audit/Findings.md › F-08; scripts/build-og.mjs › header) |
| F-09 | P3 | A decorative hero terminal showed an unregistered domain and unmeasured metrics | Left to the owner then (audit/Improvement_Roadmap.md › Needs your decision, 2); the terminal has since been removed (audit/Findings.md › F-09) |
| F-10 | P3 | `scene/` arrow keys ignored RTL | Fixed (audit/Improvement_Roadmap.md › Applied, 7); `scene/` was later rebuilt as a blueprint showcase (git log, commit 84155af) |
| F-11 | P3 | The mobile overlay menu did not trap focus | Listed as "later" (audit/Improvement_Roadmap.md › Later); today the menu is a modal dialog: everything behind it is inert and Tab stays inside (assets/app.js › mobile menu) |
| F-12 | P3 | `hub/` had no `og:image` | Listed as a decision, not an oversight (audit/Findings.md › F-12); today `hub/` declares `hub/og.jpg` (hub/index.html › 17) |

- The audit's applied list has nine items: the fixes above plus the new `npm run check` and `npm run bump`, and the lockfile and README fixes (audit/Improvement_Roadmap.md › Applied in this audit pass). Graph: [[Fixes applied in the audit pass (9 items)]].
- The Daylight failures were the only WCAG-level defects found (audit/Performance_A11y.md › A-01).
- Graph: [[_COMMUNITY_Audit Findings (Daylight, Hub)]], wiki [[Audit_Findings_Daylight,_Hub]]; the menu and scene items are in [[_COMMUNITY_Menu and Scene Accessibility]], wiki [[Menu_and_Scene_Accessibility]].

## Design audit

Captures at 1440×900 and 390×844 with every reveal forced, measured against landing-page structure heuristics (audit/Design_Audit.md › header).

| Measure | Before | Healthy range given | After Direction A |
|---|---|---|---|
| Desktop height | 15.6 viewports | 6–8 | about 11 |
| Mobile height | 24.2 viewports | 8–12 | about 18, then 15.1 after a mobile pass |
| Top-level sections | 11 + footer | 6–8 | 8 |
| Paths to the same 7 projects | 4 | 1–2 | — |

Sources: audit/Design_Audit.md › Measurements, Outcome — Direction A applied.

- Six diagnoses: D1 a brochure dump, not an argument; D2 card-box monotony; D3 a hero leaning on a fake terminal; D4 an anonymous team undercutting a real founder section; D5 proof scattered and repeated; D6 four exits to the same seven projects (audit/Design_Audit.md › Diagnosis).
- Kept: the work cards with real screenshots, the token and theme system, the trilingual engine and accessibility patterns, the FAQ and contact endgame, the founder section's substance (audit/Design_Audit.md › What is genuinely good (keep)).
- Three directions were offered; Direction A, "Condense & focus", kept the Arcanum identity and was applied (audit/Design_Audit.md › Candidate directions, Outcome). Graph: [[Direction A - Condense & focus (keep the Arcanum identity)]]. The homepage restructure is commit 55084b0, "half the length, real proof up front" (git log).
- No A/B/C variants remain on the site (audit/Design_Audit.md › Candidate directions, 2026-10 note).
- Graph: [[_COMMUNITY_Design Audit Diagnoses]], wiki [[Design_Audit_Diagnoses]].

## Technical debt register

| Item | Rank | The audit's call | Today |
|---|---|---|---|
| D-01 Conventions kept by discipline, not tooling | High | Cured: `npm run check` | `check` still holds them (scripts/check.mjs › 1–28) |
| D-02 Project data in four places | High | Accepted for now | The explorer is gone; sheets are generated from `scripts/scene-data.mjs` (audit/Technical_Debt.md › D-02 note), and `check` keeps client links in step (scripts/check.mjs › 1–28, block 5) |
| D-03 Manual cache-bust stamps | Medium | Cured: `npm run bump` | `npm run bump` still rewrites every stamp (package.json › scripts; scripts/bump.mjs › header); see [[Build and gates]] |
| D-04 `package-lock.json` was git-ignored | Medium | Fixed: lockfile committed | Tracked today (package-lock.json) |
| D-05 README structure drift | Medium | Fixed | README lists the current layout (README.md › This repository — the landing page) |
| D-06 Intentional CSS layering | Low, accepted | Leave | — |
| D-07 Decorative hero terminal metrics | Low, accepted | Owner call | Terminal removed (audit/Technical_Debt.md › D-07 note) |
| D-08 No test suite | Low, accepted | The browser audit plus `check` are the right-sized substitute | The gates are now six steps run by `npm run verify` (scripts/verify.mjs › STEPS) |

Sources: audit/Technical_Debt.md, each item. Graph: [[Conventions enforced by tooling (npm run check  npm run bump)]], [[D-02 - Project data is quadruplicated]], [[D-08 - No test suite]], [[_COMMUNITY_Technical Debt Register]], wiki [[Technical_Debt_Register]]; the D-01 and D-03 cures in [[_COMMUNITY_Conventions Enforced by Tooling]], wiki [[Conventions_Enforced_by_Tooling]].

- Explicitly not recommended: a framework or bundler, minification, a test suite, splitting the stylesheets, because each costs the zero-build property and buys nothing measurable at this scale (audit/Improvement_Roadmap.md › Explicitly not recommended). Graph: [[Explicitly not recommended frameworkbundler, minification, test suite, stylesheet split]].

## Performance and accessibility

| Item | The audit | Today |
|---|---|---|
| P-01 Five font families, Arabic loaded for every visitor | Accept, or load Arabic on first switch | Fonts are self-hosted (README.md › This repository — the landing page), and the preloads are written by an early script from the saved language (BRAND.md › Second full audit — what it still found) |
| P-02 GitHub Pages cannot set `Cache-Control` | Finish the Vercel import | Pages stays canonical; the Netlify and Vercel mirrors cache assets for a day (netlify.toml › 19–25) |
| P-03 CSS 68 KB and JS 72 KB uncompressed | A non-issue; minification not recommended | — |
| A-02 Mobile menu without a focus trap (= F-11) | Later | Inert background, Tab kept inside (assets/app.js › mobile menu) |
| A-03 Theme menu `role="menu"` without arrow keys | Add arrow keys or downgrade the role | Arrow Up and Down, Home, End and Escape are handled (assets/app.js › 954–970) |
| A-04 `scene/` arrows not mirrored in RTL (= F-10) | Fixed in the pass | See F-10 above |

Sources: audit/Performance_A11y.md, each item. Graph: [[P-01 - Font payload is 5 families (IBM Plex Sans Arabic for every visitor)]], [[A-03 - Theme menu role=menu lacks arrow-key navigation]], [[F-11 - Mobile overlay menu lacks a focus trap]].

## Security and privacy

- **S-01.** The internal knowledge base was served on the public site, because `pages.yml` uploaded the whole repository; the audit left it to the owner (audit/Security_Privacy.md › S-01). Resolved: only the `DEPLOY` paths are staged into `_site/` and published (.github/workflows/pages.yml › 44–55; scripts/site.mjs › DEPLOY). `knowledge-base/` and `audit/` stay readable on GitHub, never on the site (OWNER-CONTENT.md › 12). Graph: [[S-01 - Internal knowledge base published on the public site]].
- **S-02, verified healthy.** No secrets committed (the Supabase values are empty strings), the form's Supabase call config-gated and unable to block the visitor, `rel="noopener"` on external links, no analytics or third-party JS (audit/Security_Privacy.md › S-02). The Supabase values are still empty today (index.html › 1294). Graph: [[S-02 - Verified-healthy security posture]].
- **CSP.** The audit suggested a `Content-Security-Policy` header once hosting moved to Vercel (audit/Security_Privacy.md › S-03). Neither mirror sets one today; their headers are listed in [[Deploy]] (netlify.toml › 22–33; vercel.json › headers). Graph: [[Content-Security-Policy header recommendation]].
- Graph: [[_COMMUNITY_Hosting and Security]], wiki [[Hosting_and_Security]].

## Decisions the audit left to the owner

| # | Decision | Status in the audit's own 2026-10 note |
|---|---|---|
| 1 | S-01, the public knowledge base | Resolved: never deployed |
| 2 | F-09, the decorative terminal claims | Terminal removed |
| 3 | Finish the Vercel import | GitHub Pages is canonical; Netlify and Vercel are mirrors that build `_site/` |
| 4 | A Supabase lead store | The form hands off by `mailto:` with the lead source; nothing is stored |

Source: audit/Improvement_Roadmap.md › Needs your decision (nothing done). Graph: [[Decision finish the Vercel import]]. The Supabase store is still off on purpose (OWNER-CONTENT.md › 11); see [[Open owner items]].

- The "later" list also proposed renaming the `claude/` working branch to `main` (audit/Improvement_Roadmap.md › Later); the deploy workflow still triggers on the `claude/` branch (.github/workflows/pages.yml › 11). It also proposed an `Organization` or `LocalBusiness` JSON-LD (audit/Improvement_Roadmap.md › Later); the page today carries a `ProfessionalService` block (index.html › 40).

## Later audits

- BRAND.md records the passes that followed: a stress test, a second full audit, an error scan of the other three pages, the anti-slop sweep and a visual pass (BRAND.md › Stress test, Second full audit — what it still found, The other three pages, The anti-slop sweep, Visual pass — what the automated checks could not see). Their lessons are in [[Motion and illustration]] and [[Build and gates]].
- The audit itself is commit fc9555b, "Full codebase audit: fix verified defects, add invariant tooling, ship /audit" (git log). Dates are in [[Timeline]].

## Related

- Maps: [[Build and gates]], [[Deploy]], [[Site architecture]], [[Themes and tokens]], [[Open owner items]], [[Timeline]], [[June 2026 archive]].
- Communities: [[_COMMUNITY_Audit Findings (Daylight, Hub)]], [[_COMMUNITY_Design Audit Diagnoses]], [[_COMMUNITY_Technical Debt Register]], [[_COMMUNITY_Menu and Scene Accessibility]], [[_COMMUNITY_Conventions Enforced by Tooling]], [[_COMMUNITY_Hosting and Security]].
- Wiki: [[Executive_Summary_-_full_codebase_audit_2026-07-31,_commit_a9fd6da]], [[Architecture_&_Repository_Map_audit_2026-07-31]], [[Audit_Findings_Daylight,_Hub]], [[Design_Audit_Diagnoses]], [[Technical_Debt_Register]], [[Menu_and_Scene_Accessibility]], [[Conventions_Enforced_by_Tooling]], [[Hosting_and_Security]].
