# Numidea Labs — Institutional Knowledge Base

> **Rooted in Numidia, built on ideas.**
> The definitive, versioned source of truth for Numidea Labs: who we are, what we
> do, how we work, what we've decided, and what we've learned.

This knowledge base (KB) is a **living organizational memory**. It is designed to be
read by future employees, executives, partners, investors — and by AI agents
(RAG systems, chatbots, semantic search). Every claim is sourced and scored so the
reader knows what is *fact* versus *placeholder*.

---

## ⚠️ Honesty contract (read this first)

A source of truth that invents facts is worse than no source of truth. Therefore:

- **Nothing in this KB is fabricated.** Where real data exists (the product, the
  brand, this codebase, decisions made on the record), it is documented as
  **Verified**.
- **Where data does not yet exist** (financials, legal contracts, real customer
  data, competitor pricing, headcount names), the KB contains a **scaffold** marked
  `UNKNOWN` / `confidence: low`, with the *specific questions* an owner must answer.
- Do not "promote" a placeholder to fact without a source. Update the metadata when
  you do.

As of the last update, large parts of Domains 3, 6, 8–11, 13 (pre-session) are
**scaffolds awaiting owner input** — this is expected for an early-stage studio and
is itself useful institutional knowledge (it tells you what hasn't been captured).

---

## How the KB is organized

| File | Domain | Maturity |
| --- | --- | --- |
| [`01-company-identity.md`](01-company-identity.md) | Identity, mission, values, story | 🟢 Rich |
| [`02-brand-system.md`](02-brand-system.md) | Visual + verbal identity, assets | 🟢 Rich |
| [`03-market-intelligence.md`](03-market-intelligence.md) | Markets, geography, regulation | 🟡 Partial |
| [`04-customer-knowledge.md`](04-customer-knowledge.md) | Segments, personas, journey | 🟡 Partial |
| [`05-product-knowledge.md`](05-product-knowledge.md) | Services, projects, architecture | 🟢 Rich |
| [`06-competitive-intelligence.md`](06-competitive-intelligence.md) | Competitors | 🟠 Scaffold |
| [`07-operations.md`](07-operations.md) | Delivery, support, SOPs | 🟡 Partial |
| [`08-marketing.md`](08-marketing.md) | Acquisition, channels, campaigns | 🟠 Scaffold |
| [`09-sales-partnerships.md`](09-sales-partnerships.md) | Sales motion, partnerships | 🟠 Scaffold |
| [`10-data-analytics.md`](10-data-analytics.md) | KPIs, metrics, instrumentation | 🟡 Partial |
| [`11-legal-compliance.md`](11-legal-compliance.md) | ToS, privacy, IP, regulation | 🟠 Scaffold |
| [`12-organization.md`](12-organization.md) | Org structure, roles, onboarding | 🟡 Partial |
| [`13-decision-history.md`](13-decision-history.md) | Major decisions + reasoning | 🟢 Rich (session) |
| [`14-failures-and-lessons.md`](14-failures-and-lessons.md) | Mistakes, never-again list | 🟡 Partial |
| [`15-ai-automation-readiness.md`](15-ai-automation-readiness.md) | RAG/agent retrieval guidance | 🟢 Rich |
| [`glossary.md`](glossary.md) | Internal language, terms, acronyms | 🟢 Rich |
| [`CHANGELOG.md`](CHANGELOG.md) | KB version history | 🟢 Rich |

🟢 Rich = substantial verified content · 🟡 Partial = some facts + gaps ·
🟠 Scaffold = structure + questions, little data yet.

---

## Metadata schema (every knowledge object)

Each domain file opens with YAML front-matter, and individual knowledge objects use
this header so they can be retrieved independently by an AI system:

```yaml
---
id: KB-01-002                 # stable unique id: KB-<domain>-<n>
title: Mission
domain: 01-company-identity
tags: [identity, mission, purpose]
owner: TBD                    # role accountable for accuracy
confidence: verified          # verified | inferred | assumed | unknown
sources:
  - index.html (og:title, hero)
  - README.md
last_updated: 2026-06-22
related: [KB-01-001, KB-02-001]
---
```

### Confidence scale (the most important field)

| Value | Meaning |
| --- | --- |
| `verified` | Taken directly from the codebase, the live site, README, or an on-the-record decision. Trust it. |
| `inferred` | A reasonable deduction from verified facts. Plausible, not confirmed. |
| `assumed` | A placeholder/best-guess to make the structure usable. **Confirm before relying.** |
| `unknown` | No data exists yet. The object is a question, not an answer. |

### The 9-point extraction frame

Where it adds value, objects are documented against the master frame:
**Description · Context · Importance · Ownership · Dependencies · Related Systems ·
Risks · Opportunities · Sources.**

---

## Conventions

- **One file per domain**, Markdown, plain text → diff-able, versionable in git,
  chunk-friendly for RAG.
- **IDs are stable.** Never reuse a retired id; mark it `deprecated` instead.
- **Dates are ISO** (`YYYY-MM-DD`).
- **GAP markers**: `> 🔴 GAP:` flags missing knowledge and names the owner question.
- **Update the [`CHANGELOG.md`](CHANGELOG.md)** and the object's `last_updated`
  whenever you change a fact.
- This KB currently lives inside the company's landing-page repository. If the
  company grows, lift `knowledge-base/` into its own repo or a wiki without changing
  the structure.

---

## Provenance of this edition

- **Primary sources:** the Numidea Labs landing page (`index.html`, `assets/app.js`
  i18n dictionary, `assets/styles.css`), `README.md`, `scripts/shots.mjs`, and the
  GitHub Pages deployment.
- **Decision history (Domain 13)** is drawn from the on-the-record design/build
  session of **2026-06-22** (type system, theme switcher, Arcanum rebrand, brand
  voice, project-preview strategy, glyph/animation work).
- **Author:** Knowledge-architecture pass, 2026-06-22. First edition (v0.1).

> 🔴 GAP: This KB was assembled from public-facing and code artifacts only. It has
> **not** yet been reviewed by the founders. First action for an owner: read each
> domain, correct every `assumed`/`unknown`, and add the private knowledge (finance,
> legal, real names, real customer data) that does not appear in code.
