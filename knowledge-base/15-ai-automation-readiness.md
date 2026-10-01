---
domain: 15 — AI & Automation Readiness
status: rich
owner: Data Specialist (D)
last_updated: 2026-06-22
sources: [this knowledge base, repo structure]
tags: [ai, rag, retrieval, metadata, semantic-search, agents]
---

# Domain 15 — AI & Automation Readiness

This KB is built to be consumed by **RAG systems, chatbots, semantic search, and
internal AI agents**, not only humans.

## KB-15-001 · Retrieval design
- **Chunking:** one knowledge object = one retrievable unit. Objects are bounded by
  `## KB-<domain>-<n>` headings — chunk on these. Each carries enough context to
  stand alone.
- **Stable IDs:** every object has a `KB-DD-NNN` id. Cite these in answers so humans
  can trace provenance. Never reuse a retired id.
- **Front-matter as metadata:** each file's YAML (`domain, owner, confidence,
  sources, last_updated, tags`) should be indexed as document-level metadata; per-
  object `confidence` is stated inline.
- **Confidence-aware answers:** an agent MUST surface confidence. Never present an
  `assumed`/`unknown` object as fact. Prefer `verified` objects; if only low-
  confidence data exists, say so and point to the GAP/owner question.

## KB-15-002 · Tag taxonomy (controlled vocabulary)
`identity, mission, vision, values, culture, positioning, history,
brand, visual-identity, verbal-identity, voice, color, typography, assets, archetype,
market, geography, regulation, opportunity, threat,
customers, segments, personas, journey, pain-points, faq,
services, products, projects, tech-stack, architecture,
competitors, differentiation,
operations, delivery, sop, deploy, support, incident, risk,
marketing, acquisition, channels, campaigns,
sales, partnerships, business-development,
kpi, metrics, analytics, instrumentation,
legal, compliance, ip, privacy,
org, roles, onboarding, decision-making,
decisions, reasoning, failures, lessons, never-again,
ai, rag, retrieval, metadata.`

## KB-15-003 · Relationship graph (high-value links)
- **Mission (KB-01-002)** ↔ **Brand promise (KB-02-001)** ↔ **The Preview (KB-05-002)**
  — the same idea expressed as purpose, brand, and product.
- **Automation moat (KB-05-001 Family II)** powers **The Preview (KB-05-002)** and is
  the basis of **differentiation (KB-06-001)** and **market opportunity (KB-03-004)**.
- **Honesty value (KB-01-004)** → **"Live"-label fix (KB-13-006 / KB-14-002)**.
- **Contact-form defect (KB-14-001)** blocks **marketing (KB-08-003)**, **sales
  (KB-09-001)**, and **analytics (KB-10-002)** — a single fix unblocks three domains.

## KB-15-004 · Example agent guardrails
- For "who are the founders / what's revenue / what do you charge?" → answer
  **"not documented (confidence: unknown)"** and cite the relevant GAP — do **not**
  guess.
- For brand/voice/IP questions → enforce **KB-02-009** (never use protected
  third-party names/assets).
- Always prefer the most recent `last_updated` object on conflict.

## KB-15-005 · Automation opportunities for the KB itself
- Auto-extract new decisions from git commit messages into Domain 13.
- Nightly link-check + "stale object" report (objects with old `last_updated`).
- A retrieval bot answering new-hire questions from this folder, citing `KB-` ids.

> 🔴 GAP: No vector index / embeddings pipeline is set up yet. When built, index the
> `knowledge-base/` folder, store `KB-` id + tags + confidence as metadata, and filter
> low-confidence chunks out of authoritative answers.
