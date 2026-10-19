# Graph Report - pub  (2026-10-19)

## Corpus Check
- 75 files · ~115,739 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 10 file(s) not represented in the graph (top: .css 7, (none) 2, .toml 1)

## Summary
- 1111 nodes · 2321 edges · 68 communities
- Extraction: 89% EXTRACTED · 11% INFERRED · 0% AMBIGUOUS · INFERRED: 252 edges (avg confidence: 0.84)
- Token cost: 89,000 input · 46,000 output

## Community Hubs (Navigation)
- check.mjs Repository Gate
- Home Page Runtime (app.js)
- Browser Audit and OG Build
- WorkspaceHQ Product
- Market Chart and Visuals
- Theme Token Contract
- Company Identity (2026-06)
- i18n and Contact Flow
- Design Audit Diagnoses
- Products and Operations (2026-06)
- Project Sheets Generator
- Themes and Stylesheets
- Clients and Segments (2026-06)
- Ad Creative Builder
- 404 Page and Hosting
- CI Check Workflow
- Anti-slop and Gates
- Market Intelligence (2026-06)
- Client Site Features
- Navigation and Language Switch
- Conventions Enforced by Tooling
- Hosting and Security
- Audit Findings (Daylight, Hub)
- Positioning and Competition (2026-06)
- Owner Items and Clients
- Sitemap and Site Scope
- Brand Identity History
- Lessons and AI Readiness (2026-06)
- Private Folders and Reviews
- Pricing Model and Estimator
- Hero Plate and Client Logos
- Build Scripts and Deploy Scope
- Ambient Motion and Reveal
- Founder Design Portfolio
- Pages Deploy Pipeline
- Founder Social Handles
- Other Services
- Legal Page Generator
- Client Logo Strip
- Studio Overview and Tooling
- Project Screenshot Capture
- L'Aperçu and Method
- Menu and Scene Accessibility
- Arabic RTL and Head Boot
- Founder Section and Atlas Plates
- Prices, FX and Typography
- Founder Poster Series
- Brand Promise and Voice
- Legal Data and Privacy
- Alliance Travel Site
- French Baking (build-fr)
- Generated Pages and Voices
- Client Logo Extraction
- Stack and Sites Service
- package.json
- Design System Summary
- Technical Debt Register
- Hub Page Script
- Studio Offers (README)
- Client Voices Builder
- Client Domain Verification
- Glaive Store Demo
- WorkspaceHQ Page Script
- Founder, Team and Contact Form
- Sheet Page i18n
- AI Services and Stack (2026-06)
- Screen Compositing (screen-quad)
- Dev Dependencies

## God Nodes (most connected - your core abstractions)
1. `Architecture & Repository Map (audit 2026-07-31)` - 30 edges
2. `Static landing page repository` - 29 edges
3. `Numidea Labs Institutional Knowledge Base (README)` - 25 edges
4. `WorkspaceHQ v3 launch site` - 22 edges
5. `KB Glossary — Internal Language` - 22 edges
6. `ROOT` - 19 edges
7. `Market Comparison (Algeria / France / US)` - 18 edges
8. `Executive Summary - full codebase audit (2026-07-31, commit a9fd6da)` - 18 edges
9. `KB 05 — Product Knowledge` - 18 edges
10. `WorkspaceHQ v3 (personal ops console)` - 17 edges

## Surprising Connections (you probably didn't know these)
- `applyLang()` --shares_data_with--> `I18N`  [INFERRED]
  assets/app.js → index.html
- `Theme switcher / theme set` --references--> `applyTheme()`  [INFERRED]
  audit/Architecture.md → assets/app.js
- `F-11 - Mobile overlay menu lacks a focus trap` --references--> `setMenu()`  [INFERRED]
  audit/Findings.md → assets/app.js
- `Contact form flow (validation -> optional Supabase insert -> mailto)` --references--> `leadSource()`  [INFERRED]
  audit/Architecture.md → assets/app.js
- `D-03 - Manual cache-bust stamps` --references--> `stamp`  [INFERRED]
  audit/Technical_Debt.md → scripts/bump.mjs

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Six token themes on one 47-token contract** — brand_arcanum, brand_noir, brand_daylight, brand_mono, brand_altneon, brand_engineering, brand_theme_contract, brand_assets_themes_css [EXTRACTED 1.00]
- **Pre-push verification gates (npm run verify)** — brand_scripts_check_mjs, brand_npm_run_validate, brand_npm_run_audit, brand_npm_run_sweep, brand_scripts_vbugs_mjs, brand_npm_run_verify [EXTRACTED 1.00]
- **Four delivered clients (never the Glaive demo or WorkspaceHQ)** — brand_bordj_steel, brand_alliance_travel, brand_nomara_voyages, brand_almaflowclim, brand_client_logo_strip, brand_client_voices [EXTRACTED 1.00]
- **PRICE_MODEL as the single source of every price** — assets_app_price_model, index_tier_essentiel, index_tier_studio, index_tier_moteur, index_maintenance_retainer, index_estimator, index_market, index_market_viz [EXTRACTED 1.00]
- **Baked-French markup with runtime translation** — index_boot_script, index_i18n_pending_hold, assets_app_applylang, assets_app_switchlang, assets_app_i18n, scripts_build_fr, index_ld_faq, index_numidea_canon [EXTRACTED 1.00]
- **Aperçu conversion path (hero to contact)** — index_hero, index_apercu, index_how, index_faq, index_contact, index_contact_form, index_whatsapp_channel [INFERRED 0.85]
- **Five project sheets on the Planches page** — scene_index_bordj_steel, scene_index_alliance_travel, scene_index_glaive_store, scene_index_workspacehq_sheet, scene_index_almaflowclim, scene_index_sheet_template [EXTRACTED 1.00]
- **Direct-contact and quote conversion flows across client sites** — scene_index_alliance_quote_calculator, scene_index_alliance_traveler_dossier, scene_index_almaflow_quote_form, scene_index_almaflow_click_to_call, scene_index_bordj_steel_direct_contacts [INFERRED 0.75]
- **Bordj Steel client body of work (branding, billboard, panel assets, website)** — scene_index_bordj_steel_spa, scene_index_bordj_steel, hub_index_bordj_steel_branding, hub_index_bordj_steel_billboard, hub_index_sandwich_panels_assets [INFERRED 0.85]
- **npm run verify gate suite** — readme_verify_gates, readme_repo_invariants, readme_themes_check_gate, readme_html_validation, readme_browser_audit, readme_contrast_sweep, readme_visual_bug_scan [EXTRACTED 1.00]
- **Delivered client set (quotable, logo strip, domains)** — owner_content_delivered_clients, owner_content_bordj_steel, owner_content_alliance_travel, owner_content_almaflowclim, owner_content_nomara_voyages [EXTRACTED 1.00]
- **Gated Pages deploy pipeline (check, stage, publish)** — _github_workflows_pages_check_step, _github_workflows_pages_stage_step, _github_workflows_pages_upload_deploy, scripts_check, scripts_themes_check, scripts_stage_site [EXTRACTED 1.00]
- **Daylight theme contrast failures (F-01/02/03 = A-01)** — audit_findings_f01_daylight_hero_lede_contrast, audit_findings_f02_founder_bio_missing_body_token, audit_findings_f03_soon_covers_white_on_white, audit_findings_daylight_theme, audit_performance_a11y_a01_daylight_contrast [EXTRACTED 1.00]
- **Silent-break conventions moved from discipline to npm run check / bump** — audit_executive_summary_tooling_enforcement, audit_technical_debt_d01_conventions_by_discipline, audit_technical_debt_d03_manual_cache_bust_stamps, audit_architecture_convention_i18n_key_x3, audit_architecture_convention_no_orphan_i18n, audit_architecture_convention_cache_bust_stamp [INFERRED 0.85]
- **Vercel import as the lever for caching, security headers and CSP** — audit_improvement_roadmap_vercel_import, audit_performance_a11y_p02_hosting_headers, audit_security_privacy_vercel_security_headers, audit_security_privacy_csp_recommendation, audit_architecture_vercel_hosting_config, audit_architecture_hosting_topology [INFERRED 0.85]
- **Mission ↔ Brand promise ↔ The Preview (one idea as purpose, brand and product)** — knowledge_base_01_company_identity_mission, knowledge_base_02_brand_system_brand_promise, knowledge_base_05_product_knowledge_the_preview [EXTRACTED 1.00]
- **Contact-form defect blocks marketing, sales and analytics** — knowledge_base_14_failures_and_lessons_contact_form_lead_loss, knowledge_base_08_marketing, knowledge_base_09_sales_partnerships_sales_motion, knowledge_base_10_data_analytics_no_web_analytics [EXTRACTED 1.00]
- **Delivered client sites (2026-10 correction)** — knowledge_base_05_product_knowledge_bordj_steel, knowledge_base_05_product_knowledge_alliance_travel, knowledge_base_05_product_knowledge_almaflowclim, knowledge_base_05_product_knowledge_nomara_voyages [EXTRACTED 1.00]

## Communities (68 total, 0 thin omitted)

### Community 0 - "check.mjs Repository Gate"
Cohesion: 0.03
Nodes (54): markerRegions(), absent, app, back, badDepth, canonErr, captureHosts, clientHref (+46 more)

### Community 1 - "Home Page Runtime (app.js)"
Cohesion: 0.07
Nodes (42): aim(), applyTheme(), arm(), bind(), cache(), clear(), counted(), countUp() (+34 more)

### Community 2 - "Browser Audit and OG Build"
Cohesion: 0.12
Nodes (21): t(), AXE, rows, run(), warnings, CARD, launch(), serve() (+13 more)

### Community 3 - "WorkspaceHQ Product"
Cohesion: 0.15
Nodes (27): WorkspaceHQ Now Playing cartridge link, WorkspaceHQ v3 sheet (sheet 04, in-house product), workspacehq/app.js (page logic), Ask Claude prompt bar, Bit (pixel sidekick), WorkspaceHQ v3.0 changelog, Claude, Claude Code (+19 more)

### Community 4 - "Market Chart and Visuals"
Cohesion: 0.10
Nodes (21): MARKET, app.js Section 13b (drawn figures), app.js Section 14 (market conversion), .js-only Rule, Theme Token Blocks, 8GNC, branding cost 2026, Aperçu Timeline Drawing, Banque d'Algérie, taux de change journalier (+13 more)

### Community 5 - "Theme Token Contract"
Cohesion: 0.09
Nodes (19): Design-token system (every rule reads var(--token)), absent, blocks, CONTRACT, css, faceDrift, headMap, idx (+11 more)

### Community 6 - "Company Identity (2026-06)"
Cohesion: 0.14
Nodes (24): KB 01 — Company Identity, Bordj Bou Arréridj (BBA), Algeria, Culture (inferred, no handbook), Mission: We build the software your business has been waiting for, Numidea Labs, Numidia heritage (ancient Berber kingdom), Positioning: boutique full-stack development & automation studio, Tagline: Rooted in Numidia · built on ideas (+16 more)

### Community 7 - "i18n and Contact Flow"
Cohesion: 0.13
Nodes (22): applyLang(), I18N, leadSource(), Designed not-found page (404.html), Architecture & Repository Map (audit 2026-07-31), Contact form flow (validation -> optional Supabase insert -> mailto), Convention: new features no-op gracefully when config is absent (Supabase pattern), Fail-open init (try/catch reveals all content) (+14 more)

### Community 8 - "Design Audit Diagnoses"
Cohesion: 0.19
Nodes (22): Convention: honest statuses (no fake screenshots; explicit soon/pending states), Committed client-site preview screenshots (assets/previews/*.webp), Contact title clipping bug (overflow:hidden slicing display-face swash), D1 - The page is a brochure dump, not an argument, D2 - Card-box monotony, D3 - The hero leans on a fiction (fake terminal), D4 - The anonymous team undercuts credibility, D5 - Proof is scattered and repetitive (+14 more)

### Community 9 - "Products and Operations (2026-06)"
Cohesion: 0.13
Nodes (22): Founders & people (real names unknown), KB 05 — Product Knowledge, Bordj Steel, Site feature history (i18n → a11y → Neon Noir → Geist → themes → Arcanum → voice → previews → glyphs), Glaive Store, Landing page (zero-dependency static build), Nomara Voyages, WorkspaceHQ (+14 more)

### Community 10 - "Project Sheets Generator"
Cohesion: 0.16
Nodes (20): AR_LANG, caption(), DICT, esc(), files(), index, LANGS, OUT (+12 more)

### Community 11 - "Themes and Stylesheets"
Cohesion: 0.11
Nodes (10): Altneon theme, Arcanum theme (default), assets/styles.css, assets/themes.css, Daylight theme, --ice foreground token, Mono theme, Noir theme (+2 more)

### Community 12 - "Clients and Segments (2026-06)"
Cohesion: 0.14
Nodes (20): Value: Honesty (Soon, never fake Live), Algeria ↔ Europe (France) cross-border opportunity, Customer segments (four, inferred from portfolio), Alliance Travel, AlmaFlowClim (almaflowclim.fr), Doctor Cherfia Clinic, Étoile de l'Est (offline-first PWA), c2 Graphic & social design (+12 more)

### Community 13 - "Ad Creative Builder"
Cohesion: 0.13
Nodes (17): adHtml(), ads, app, esc(), fill(), flatHtml(), floor, FX (+9 more)

### Community 14 - "404 Page and Hosting"
Cohesion: 0.15
Nodes (16): 404 page: This page hit the road, GitHub Pages hosting, Six-theme system (arcanum, noir, daylight, mono, altneon, engineering), Hamisse Mohamed Yasser (br4vetr4veler), br4vetr4veler hub (b4vetrave1er.exe // VOIDSPLUNKER.std), scripts/og-capture.mjs (renders first-screen OG images), Light/dark theme pill (void-theme key), VOIDSPLUNKER.std (agency of one) (+8 more)

### Community 15 - "CI Check Workflow"
Cohesion: 0.16
Nodes (18): Browser gates step (on demand), Check workflow (CI), HTML validation step, Invariants step (check + theme contract), npm ci without browser download, scripts, audit, logos (+10 more)

### Community 16 - "Anti-slop and Gates"
Cohesion: 0.15
Nodes (10): axe accessibility engine, Claude Design runtime (embed/support.js), The gates (pre-push commands), WorkspaceHQ NES cartridge link, npm run audit (browser audit), npm run sweep (painted-contrast sweep), npm run verify, scripts/vbugs.mjs (npm run vbugs) (+2 more)

### Community 17 - "Market Intelligence (2026-06)"
Cohesion: 0.15
Nodes (19): KB 03 — Market Intelligence, Jumia (e-commerce platform), Market sizing & regulatory deep-dive (gap), Market opportunities (inferred), Ouedkniss (Algerian classifieds), Primary market: BBA / Algeria, Francophone + Arabic, Market threats (inferred), c3 Data science & analytics (+11 more)

### Community 18 - "Client Site Features"
Cohesion: 0.12
Nodes (17): Click-to-call number at the top of each trade page, AlmaFlowClim projects page (realisations), AlmaFlowClim trade pages (air conditioning, heating, plumbing), AlmaFlowClim HVAC and plumbing showcase site (sheet 05, 7 pages, FR), Bordj Steel B2B corporate site (sheet 01, 12 pages, FR), Per-department direct lines with one-click copy, Bordj Steel media center (blog), Interactive sandwich-panel cross-section and PDF catalogue (+9 more)

### Community 19 - "Navigation and Language Switch"
Cohesion: 0.16
Nodes (16): switchLang(), Artiland.Studio, Footer, Grafil Studio · tr4veler.designs, Heetch, FR/EN/AR Language Switch, Mobile Overlay Menu, Navbar (+8 more)

### Community 20 - "Conventions Enforced by Tooling"
Cohesion: 0.17
Nodes (16): Convention: every asset reference carries ?v=<stamp>; bump all pages on change, Convention: every i18n key appears exactly 3x in app.js (fr/en/ar), Convention: every data-i18n* attribute resolves to a dictionary key, Conventions enforced by tooling (npm run check / npm run bump), Verdict: codebase fundamentally healthy, Headless-Chromium measured results, D-01 - Conventions enforced by discipline, not tooling, D-03 - Manual cache-bust stamps (+8 more)

### Community 21 - "Hosting and Security"
Cohesion: 0.21
Nodes (17): GitHub Pages deploy workflow (pages.yml), Hosting topology: GitHub Pages canonical, Netlify/Vercel mirrors, knowledge-base/ internal institutional memory (18 md), Vercel-ready hosting config (vercel.json), Decision: finish the Vercel import, P-02 - Hosting headers (GitHub Pages cannot set Cache-Control), Content-Security-Policy header recommendation, esc() HTML-entity escaping of explorer rendering (+9 more)

### Community 22 - "Audit Findings (Daylight, Hub)"
Cohesion: 0.29
Nodes (18): hub/ - VOIDSPLUNKER.std personal portfolio subsite, Executive Summary - full codebase audit (2026-07-31, commit a9fd6da), Daylight theme (light theme, --void:#F4F6F9), F-01 - Daylight theme: hero lede near-invisible, F-02 - Daylight theme: founder bio references nonexistent --body token, F-03 - Daylight theme: 'soon' project covers white-on-white, F-04 - Services proof line still cites almaflowclim.fr, F-05 - Hub footer: 20 dead href='#' links + removed Read.cv listing (+10 more)

### Community 23 - "Positioning and Competition (2026-06)"
Cohesion: 0.17
Nodes (18): Value: One team owns the whole chain (design → code → deploy), The Preview (L'Aperçu) — working demo before payment, KB 06 — Competitive Intelligence, Competitor class: data/automation specialists, Differentiation hypothesis, Competitor class: local web agencies (DZ/BBA), Competitor class: regional/offshore dev shops, Competitor class: template/DIY platforms (Wix/Shopify/Webflow) (+10 more)

### Community 24 - "Owner Items and Clients"
Cohesion: 0.23
Nodes (17): Alliance Travel (client), AlmaFlowClim (client), Bordj Steel (client), Clients' own domains, Client logo strip ('Ils nous ont confié leur site'), Delivered clients (quotable), Founder photo (assets/founder.webp), Hub fan art rights (+9 more)

### Community 25 - "Sitemap and Site Scope"
Cohesion: 0.17
Nodes (11): MULTILINGUAL, renderSitemap(), url(), BASE, LANGS, PAGES, bin, files (+3 more)

### Community 26 - "Brand Identity History"
Cohesion: 0.21
Nodes (17): Company story / history timeline, Arcanum brand identity (default theme), Cinzel (display typeface), Design tokens (CSS custom properties), Geist / Geist Mono (body and data typefaces), Hexagon/honeycomb atmosphere motif + gem accents, IBM Plex Sans Arabic (RTL typeface), Neon Noir theme (now 'noir') (+9 more)

### Community 27 - "Lessons and AI Readiness (2026-06)"
Cohesion: 0.20
Nodes (17): IP / trademark guardrail (binding), KB 14 — Failures & Lessons, Single-source-of-truth gaps (tribal knowledge), KB 15 — AI & Automation Readiness, Agent guardrails (answer unknown, enforce IP, prefer newest), KB automation opportunities (commit → decision log, stale report, retrieval bot), KB retrieval design (chunk on KB-DD-NNN, stable ids, confidence-aware), Tag taxonomy (controlled vocabulary) (+9 more)

### Community 28 - "Private Folders and Reviews"
Cohesion: 0.16
Nodes (12): Arabic native review, og, work:capture, 404.html (not-found page), audit/ (2026-07 code audit snapshot), Marketing campaign kit (CAMPAIGN_DIR), assets/fonts/ (self-hosted faces), knowledge-base/ (internal memory snapshot) (+4 more)

### Community 29 - "Pricing Model and Estimator"
Cohesion: 0.28
Nodes (15): ESTIMATE, PRICE_MODEL, Quote Cost Drivers, Project Estimator, FAQ Section, Maintenance Retainer, Fixed-price Billing (au forfait), Subscription Billing (à l'abonnement) (+7 more)

### Community 30 - "Hero Plate and Client Logos"
Cohesion: 0.15
Nodes (8): Alliance Travel (client), Animated icons (.ai), applyLang(), Bordj Steel (client), Hero floaters (hand-drawn SVG geometry), Geometric service marks (hexagonal motif), Nomara Voyages (client), Service icon set (11 hand-authored SVGs)

### Community 31 - "Build Scripts and Deploy Scope"
Cohesion: 0.20
Nodes (13): AlmaFlowClim (client), .github/workflows/check.yml, Glaive Store (portfolio demo), index.html (home page), scripts/build-legal.mjs (legal notice and privacy), npm run build (page generators), npm run validate (html-validate), Numidea Labs - Themes (BRAND.md) (+5 more)

### Community 32 - "Ambient Motion and Reveal"
Cohesion: 0.17
Nodes (4): Ambient layer (parallax, aurora, reveal), applyTheme(), Aurora colour fields (removed), Stress test harness

### Community 33 - "Founder Design Portfolio"
Cohesion: 0.16
Nodes (16): Alan Is Awake Manga Concept (Behance), Amanatcom Brand Guidelines (Behance), Billboard Urbain Bordj Steel SPA (Behance), Bordj Steel Branding Project (Behance), Design section: identity, posters, print (Behance work), First Month at Heetch DZ (Behance), Heetch (Heetch DZ), Heetch Entry Test (Behance) (+8 more)

### Community 34 - "Pages Deploy Pipeline"
Cohesion: 0.20
Nodes (12): Check repository invariants step, Deploy to GitHub Pages workflow, Stage publishable files into _site/, Configure, upload and deploy Pages artifact, Working branch claude/numidea-labs-landing-c4jokc, stage, Netlify and Vercel mirrors, _site/ (staged deploy folder) (+4 more)

### Community 35 - "Founder Social Handles"
Cohesion: 0.15
Nodes (15): The Archive: one handle, every world (link hub), Behance @br4vetr4aveler1, DeviantArt br4vetr4veler5, Etsy shop Bl7nksStudio, GitHub @Brvetr4ve1er, Instagram @stick_itty, Artwork lightbox dialog, LinkedIn (Mohamed Yasser Hamisse) (+7 more)

### Community 36 - "Other Services"
Cohesion: 0.19
Nodes (15): Custom AI Tools & Assistants, Data Science & Analytics, Graphic Design & Social Media, Knowledge Systems, Shop & Booking, Five Other Services (capabilities), Claude, Playwright (+7 more)

### Community 37 - "Legal Page Generator"
Cohesion: 0.26
Nodes (14): body(), esc(), fontList(), frTypo(), LANG_BUTTONS, MARKERS, OFL_FONTS, renderLegal() (+6 more)

### Community 38 - "Client Logo Strip"
Cohesion: 0.32
Nodes (13): Client Logos Styling (r3/b), Alliance Travel, AlmaFlowClim, Bordj Steel, Client Logos Strip, Glaive Store, Hero Section, Hero Plate (live client site rotator) (+5 more)

### Community 39 - "Studio Overview and Tooling"
Cohesion: 0.19
Nodes (8): Numidea Labs (software studio, Bordj Bou Arreridj, DZ), Zero-dependency trilingual static marketing site, playwright, sharp, lv(), out(), meta, P

### Community 40 - "Project Screenshot Capture"
Cohesion: 0.21
Nodes (11): Offline screenshot-capture pipeline (Playwright + sharp), Delivered client sites roster (2026-10), Onboard Doctor Cherfia / Etoile de l'Est when they ship, D-02 - Project data is quadruplicated, shots, assets/previews/*.webp (live client site screenshots), Project preview screenshots, shotDrift (+3 more)

### Community 41 - "L'Aperçu and Method"
Cohesion: 0.24
Nodes (9): L'Aperçu (signature offer), Bordj Bou Arréridj, Contact Section, Plate VI — Le Grand Erg, Method Section (four steps), Mobile Quick-contact Bar, Open Graph & Social Preview Meta, Plate I — Les Bibans Vista (+1 more)

### Community 42 - "Menu and Scene Accessibility"
Cohesion: 0.21
Nodes (11): setMenu(), localStorage coupling (numidea-lang / numidea-theme shared by / and /scene/), Project-explorer modal (#/work/<slug> hash router), scene/ - engineering-drawing project showcase, F-11 - Mobile overlay menu lacks a focus trap, Case-study story content (problem/approach/outcome x3 languages), A-02 - Mobile overlay menu does not trap focus (= F-11), A-04 - Scene arrow keys don't mirror in RTL (= F-10) (+3 more)

### Community 43 - "Arabic RTL and Head Boot"
Cohesion: 0.18
Nodes (4): Engineering theme, Head bootstrap / pre-paint resolver, Logo wordmark (.logo / .cursor), theme-engineering.css (removed alternate stylesheet)

### Community 44 - "Founder Section and Atlas Plates"
Cohesion: 0.23
Nodes (6): BR4VETR4VELER poster series (33 posters), assets/cv_yasser_hamisse_2026.pdf, Generated illustrations (assets/illus), hub/ (Yasser's artist page), Magnific (generation service), Yasser Hamisse (founder; b4vetrave1er / VOIDSPLUNKER.std)

### Community 45 - "Prices, FX and Typography"
Cohesion: 0.27
Nodes (7): Bank of Algeria official FX rate, Price estimator, FX display-currency table (app.js section 12a), MARKET (app.js section 14), Mobile audit (round 3), 404.html, PRICE_MODEL

### Community 46 - "Founder Poster Series"
Cohesion: 0.20
Nodes (9): Chapter III: The Ink (12 posters), Chapter II: The Noise (8 posters), Chapter I: The Sky (8 posters), Epilogue: The Power of Imagination, Neville Goddard, Prologue: The Traveler (violet, cobalt, vermilion, acid), BR4VETR4VELER poster series (a story in 33 posters), The Traveler avatar (four weathers, pose slots) (+1 more)

### Community 47 - "Brand Promise and Voice"
Cohesion: 0.21
Nodes (12): Value: Proof over promises, KB 02 — Brand System, Brand essence: Prestige engineering with conscience, Brand promise: powerful, almost-magical technology made accessible, safe and real, Hero line: Engineering that feels like magic. Discipline that ships it., One flourish per screen, then discipline, Service glyph set (arcane line-art, motion-ready), Trilingual FR/EN/AR i18n with mirrored RTL (+4 more)

### Community 48 - "Legal Data and Privacy"
Cohesion: 0.23
Nodes (10): Privacy page hosts list, Legal data fields (14; 5 translated), legal/ (generated legal page), Legal notice + privacy page, legal-preview/ (build-legal --preview), langGaps(), LEGAL, MAY_NOT_APPLY (+2 more)

### Community 49 - "Alliance Travel Site"
Cohesion: 0.20
Nodes (12): Alliance Travel brand identity, 7 destination pages (Istanbul, Bali and others), Alliance Travel light and dark mode, Trip quote calculator sent to WhatsApp, Alliance Travel agency site (sheet 02, 9 pages, FR/EN/AR), Online traveller dossier with passport validation, Visa appointment service (/rendez-vous-visa/), Quote request form with service type (+4 more)

### Community 50 - "French Baking (build-fr)"
Cohesion: 0.33
Nodes (10): ATTR, attrEsc(), bakeFr(), between(), ldText(), ENT, faqLd(), i18nNodes() (+2 more)

### Community 51 - "Generated Pages and Voices"
Cohesion: 0.22
Nodes (9): Client quotes (voices), with consent, Brvetr4ve1er/workspace-HQ repository, build, scene, npm run build (generated pages), scene/ (generated project sheets), sitemap.xml (hreflang alternates), workspacehq/ (WorkspaceHQ v3 product page) (+1 more)

### Community 52 - "Client Logo Extraction"
Cohesion: 0.22
Nodes (8): al, alOut, get(), nmCss, OUT, raster(), tidyPaths(), two()

### Community 53 - "Stack and Sites Service"
Cohesion: 0.24
Nodes (9): Doctor Cherfia Clinic, Étoile de l'Est, Next.js, React, Sites & Web Applications Service, Stack Section (Outils), Supabase, Supabase Lead-capture Config (+1 more)

### Community 54 - "package.json"
Cohesion: 0.20
Nodes (9): description, engines, node, name, private, type, version, axe-core (+1 more)

### Community 55 - "Design System Summary"
Cohesion: 0.24
Nodes (7): Arcanum brand identity, BRAND.md (design system), Price estimator, Six themes (Arcanum, Noir, Daylight, Mono, Alt-neon, Engineering), assets/styles.css (layout and components), themes-check gate, assets/themes.css (six theme blocks)

### Community 56 - "Technical Debt Register"
Cohesion: 0.25
Nodes (9): package.json / package-lock.json (screenshot pipeline deps only), Risk: single-file JS/CSS growth (~900 lines each), Explicitly not recommended: framework/bundler, minification, test suite, stylesheet split, P-03 - Non-issues: CSS 68 KB / JS 72 KB uncompressed, D-04 - package-lock.json was gitignored (non-reproducible installs), D-05 - README structure drift, D-06 - Intentional CSS layering (hub RTL rule, premium-pass overrides), D-08 - No test suite (+1 more)

### Community 57 - "Hub Page Script"
Cohesion: 0.36
Nodes (7): aim(), cache(), frame(), kick(), onMove(), setTheme(), showTheme()

### Community 58 - "Studio Offers (README)"
Cohesion: 0.25
Nodes (8): Bordj Bou Arréridj, Algeria, Studio contact (Gmail, WhatsApp), L'Aperçu / The Preview (signature offer), Numidea Labs, Automation & data offer, Brand & design systems offer, Sites & applications offer, Strategy & consulting offer

### Community 59 - "Client Voices Builder"
Cohesion: 0.36
Nodes (7): applyVoices(), esc(), renderVoices(), literal(), loadDicts(), validate(), VOICE_CLIENTS

### Community 60 - "Client Domain Verification"
Cohesion: 0.22
Nodes (3): clients, html, rows

### Community 61 - "Glaive Store Demo"
Cohesion: 0.25
Nodes (7): Archivo typeface, Side-by-side product comparison, Filterable shop (category, max price, sort), Product pages with spec table, Find your gear recommendation quiz, Glaive Store gaming-gear shop (sheet 03, portfolio demo), Inter typeface

### Community 62 - "WorkspaceHQ Page Script"
Cohesion: 0.43
Nodes (7): bitSvg(), drawBits(), feed(), frameMotion(), pop(), render(), setMotion()

### Community 63 - "Founder, Team and Contact Form"
Cohesion: 0.38
Nodes (6): Founder CV PDF, Client Voices Slot, Contact Form (mailto handoff), Founder CV Panel, Form Success & Fallback Panel, Founder & Team Section

### Community 64 - "Sheet Page i18n"
Cohesion: 0.53
Nodes (4): applyMeta(), each(), setLang(), syncCanon()

### Community 65 - "AI Services and Stack (2026-06)"
Cohesion: 0.33
Nodes (6): Persona: Operator drowning in manual work, f3 Automation & pipelines (flagship), Claude (Anthropic), c5 Custom AI tools & skills, Playwright → Claude Preview pipeline, Declared technical stack

### Community 66 - "Screen Compositing (screen-quad)"
Cohesion: 0.40
Nodes (5): despill(), findScreen(), isGreen(), maskPng(), matrix3d()

### Community 67 - "Dev Dependencies"
Cohesion: 0.40
Nodes (5): devDependencies, axe-core, html-validate, playwright, sharp

## Ambiguous Edges - Review These
- `Geometric service marks (hexagonal motif)` → `Construction-grid background`  [AMBIGUOUS]
  BRAND.md · relation: conceptually_related_to
- `Geometric service marks (hexagonal motif)` → `No-perpetual-motion rule`  [AMBIGUOUS]
  BRAND.md · relation: conceptually_related_to
- `Bordj Steel SPA (metal framing and sandwich panel manufacturer)` → `Minimal Industrial Social Media Creatives (Behance)`  [AMBIGUOUS]
  hub/index.html · relation: conceptually_related_to
- `Open Graph share image (og.svg -> og.jpg)` → `F-09 - Hero terminal claims deploy -> numidealabs.com and unverified metrics`  [AMBIGUOUS]
  audit/Architecture.md · relation: references
- `P-02 - Hosting headers (GitHub Pages cannot set Cache-Control)` → `S-02 - Verified-healthy security posture`  [AMBIGUOUS]
  audit/Security_Privacy.md · relation: references

## Knowledge Gaps
- **93 isolated node(s):** `axe-core`, `html-validate`, `Mono theme`, `Altneon theme`, `--ice foreground token` (+88 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 274 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Numidea Labs Institutional Knowledge Base (README)` connect `Lessons and AI Readiness (2026-06)` to `Home Page Runtime (app.js)`, `Company Identity (2026-06)`, `Project Screenshot Capture`, `Products and Operations (2026-06)`, `Brand Promise and Voice`, `Market Intelligence (2026-06)`, `Positioning and Competition (2026-06)`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **What connects `axe-core`, `html-validate`, `Mono theme` to the rest of the system?**
  _93 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `check.mjs Repository Gate` be split into smaller, more focused modules?**
  _Cohesion score 0.033315705975674244 - nodes in this community are weakly interconnected._
- **Why does `Static landing page repository` connect `Private Folders and Reviews` to `Sheet Page i18n`, `Home Page Runtime (app.js)`, `Pages Deploy Pipeline`, `Project Screenshot Capture`, `CI Check Workflow`, `Generated Pages and Voices`, `Design System Summary`, `Owner Items and Clients`, `Sitemap and Site Scope`, `Studio Offers (README)`?**
  _High betweenness centrality (0.077) - this node is a cross-community bridge._
- **Should `Home Page Runtime (app.js)` be split into smaller, more focused modules?**
  _Cohesion score 0.07102040816326531 - nodes in this community are weakly interconnected._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `Geometric service marks (hexagonal motif)` and `Construction-grid background`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Geometric service marks (hexagonal motif)` and `No-perpetual-motion rule`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._