---
type: home
updated: 2026-10-25
sources: [scripts/build-kb.mjs, .graphifyignore, scripts/check.mjs, scripts/site.mjs, package.json, knowledge-base/.obsidian/app.json, knowledge-base/graphify/GRAPH_REPORT.md, knowledge-base/wiki/index.md, OWNER-CONTENT.md]
---

# Numidea Labs knowledge base

This vault is the studio's memory of its own repository: a knowledge graph built by graphify over the code and documents, with a short layer of hand-written maps on top (scripts/build-kb.mjs › header). It lives in `knowledge-base/` of the public repository and is never deployed to the site (scripts/site.mjs › NOT_DEPLOYED). Start with the maps table below; each map is a way into the graph.

## Open it

- In Obsidian: Open folder as vault, then pick this `knowledge-base` folder (scripts/build-kb.mjs › header).
- New notes created in Obsidian land in `Maps/`, and `graphify/graph.json` is on Obsidian's excluded-files list (`userIgnoreFilters`) (knowledge-base/.obsidian/app.json).
- Without Obsidian, the notes are Markdown files, and the graph is also exported as an HTML page, `graphify/graph.html` (scripts/build-kb.mjs › export).

## How it is built

| Layer | What it holds | Made by | Edit by hand? |
|---|---|---|---|
| `Home.md`, `Maps/` | This page and the 17 maps; every fact cites its source file | People (and Claude) | Yes |
| `graph/` | One note per node of the graph, a `_COMMUNITY_` note per community, and a canvas | graphify export | No |
| `wiki/` | One article per community and one per god node, entry `wiki/index.md` | graphify export | No |
| `graphify/` | `graph.json`, `GRAPH_REPORT.md`, `graph.html` | graphify export | No |
| `archive/2026-06-snapshot/` | The June 2026 knowledge base, kept as history | June 2026 snapshot | No |

Sources: scripts/build-kb.mjs › header and export steps; knowledge-base/wiki/index.md (Communities, God Nodes); knowledge-base/graphify/GRAPH_REPORT.md › Summary.

- The export deletes and rebuilds `graph/`, `wiki/` and `graphify/` on every run and leaves `Maps/` and `archive/` alone (scripts/build-kb.mjs › "generated layers are rebuilt from scratch"). Its machine-path scrub also reads `Home.md` and rewrites it only if it holds a checkout path (scripts/build-kb.mjs › scrub).
- Any edit made by hand in a generated folder is lost at the next export (scripts/build-kb.mjs › rmSync of graph, wiki, graphify).
- The export removes machine paths from what it writes, because the graph is built from a checkout (scripts/build-kb.mjs › scrub).
- The 2026-10-19 build has 1111 nodes, 2321 edges and 68 communities (knowledge-base/graphify/GRAPH_REPORT.md › Summary).
- Where `archive/` disagrees with README.md, BRAND.md, OWNER-CONTENT.md or the code, the current files win; the maps never cite `archive/` for a current fact.

## Regenerate it

1. Install graphify: `uv tool install graphifyy` (scripts/build-kb.mjs › header).
2. Build the graph. In Claude Code, `/graphify . --update` reads code and docs and writes `graphify-out/`, which is git-ignored; or run the offline, code-only `graphify update .` through the `--code` flag below (scripts/build-kb.mjs › header).
3. Export into the vault: `npm run kb`, or `npm run kb -- --code` to refresh the code graph first (package.json › scripts; scripts/build-kb.mjs › header).
4. The export also merges graphify's community colours into `.obsidian/graph.json` (scripts/build-kb.mjs › "one vault, one .obsidian/"). Commit `graph/`, `wiki/`, `graphify/` and that file: the committed `graphify/graph.json` is what lets `graphify query` work on a fresh clone (scripts/build-kb.mjs › header).

- What graphify reads is set by `.gitignore` first and then `.graphifyignore`, which leaves out images, fonts, audio, 3D files and PDFs, vendor bundles such as `workspacehq/embed/`, the lock file, sitemap, robots and licence files, and the vault's own generated layers plus `Maps/` and `Home.md` (.graphifyignore).
- `npm run check` fails if `knowledge-base/` holds a temporary machine path, an artifact link, a campaign-kit file name, a private note type, or an e-mail address other than the site's contact and the archive's old placeholder (scripts/check.mjs › block 15).

## Query the graph from a terminal

The committed `graph.json` works on a fresh clone, from the repository root (scripts/build-kb.mjs › header):

```bash
graphify query   "what must the owner still supply?" --graph knowledge-base/graphify/graph.json
graphify path    "Nomara Voyages (unconfirmed client)" "VOICE_CLIENTS" --graph knowledge-base/graphify/graph.json
graphify explain "Owner-supplied content register" --graph knowledge-base/graphify/graph.json
```

- `query` walks the graph from the nodes that best match the question; `path` gives the shortest path between two nodes; `explain` describes one node and its neighbours (`graphify --help`).
- Put `--graph` after the question or the node names: with graphify 0.9.92, a `--graph` placed first is ignored and the command reads `graphify-out/graph.json` instead (tested 2026-10-19).
- A label shared by two nodes, such as `PRICE_MODEL`, is reported as ambiguous (exit code 3); name it as `index.html::PRICE_MODEL` or by its node id (`graphify --help`).
- `path` follows edge direction; add `--undirected` when it finds no directed path (`graphify --help`).
- The most connected nodes and the surprising links are listed in `graphify/GRAPH_REPORT.md`; the community articles start at [[wiki/index|the wiki index]].

## The honesty rule

- Every factual sentence in `Maps/` ends with its source: a repository path and a locator, such as `(assets/app.js › PRICE_MODEL)` or `(OWNER-CONTENT.md › 7)`.
- Nothing is added that the cited file does not state: no invented clients, figures, dates or claims.
- Where a source says something is pending, unconfirmed, an owner decision or a placeholder, the map says so; the register of those items is `OWNER-CONTENT.md` (OWNER-CONTENT.md › intro) and its map is [[Open owner items]].
- Only tracked, public files are used: the vault sits in a public repository (OWNER-CONTENT.md › 12).
- When a source changes, the map that cites it is updated by hand and its `updated:` date moves.
- Cite `scripts/check.mjs` by its block label (1 to 8, 3b, 5b, 5c, 8b to 8h, 15, 15b, 15c, 16, 17, 18) or a named check (`RETIRED`), never by line number: blocks merged from other work move the lines (scripts/check.mjs › header). For a page, prefer a stable locator (an id, a variable such as `HEAD`, a marker comment such as `SLOT:voices`) where one exists, since every insert into a `<head>` moves the lines below it.

## The maps

| Map | What it covers |
|---|---|
| [[Studio and offer]] | Who the studio is, the services, L'Aperçu, the method, the team and the contact paths |
| [[Pricing and market]] | `PRICE_MODEL`, the three packages, the estimator, display currencies and the three-market comparison |
| [[Clients and projects]] | The four clients the site shows as delivered (one, Nomara Voyages, still unconfirmed), the demo, the own product, the projects in progress and the rules around them |
| [[Open owner items]] | Everything only the owner can supply or confirm, and what the code holds back meanwhile |
| [[Site architecture]] | How the static site, its pages, generated files and scripts fit together |
| [[Languages and RTL]] | French, English and Arabic, the dictionaries and the mirrored right-to-left layout |
| [[Project sheets]] | The `scene/` sheets generated from `scripts/scene-data.mjs` |
| [[WorkspaceHQ and hub]] | The studio's own product page and the founder's personal page |
| [[Themes and tokens]] | The six themes and the shared token contract |
| [[Motion and illustration]] | Parallax, reveal, icons, generated illustrations, the atlas plates, the founder section and the scrolling rules |
| [[Build and gates]] | The build scripts, the shared config in `scripts/site.mjs` and the checks that must pass before a push |
| [[Captures and image tools]] | The offline Playwright and sharp scripts: client screenshots, sheet captures, logos, share images, atlas masks, ad creatives |
| [[Deploy]] | GitHub Pages, the mirrors and what is never published |
| [[Code audit (2026-07)]] | The July 2026 audit's eight reports and what became of each finding |
| [[Timeline]] | Dated events across the repository |
| [[June 2026 archive]] | The first knowledge base, kept as history, and where each of its domains now lives |
| [[Maps/Glossary|Glossary]] | The studio's internal words and code names |

## Other ways in

- Archive overview: [[Numidea_Labs_Institutional_Knowledge_Base_README]] (history, June 2026), a god node drawn from `archive/2026-06-snapshot/README.md` (knowledge-base/graphify/GRAPH_REPORT.md › God Nodes); the map is [[June 2026 archive]].
- Repository overview, the most connected node from README.md: [[Static_landing_page_repository]] (knowledge-base/graphify/GRAPH_REPORT.md › God Nodes).
- Gates overview: [[check.mjs_Repository_Gate]], the largest community (knowledge-base/wiki/index.md › Communities).
