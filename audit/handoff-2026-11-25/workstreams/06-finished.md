# 06 · Finished workstreams (nothing left to publish)

- **Publish wave 2 site fixes:** live. Tagline "web et logiciel", "Commencer ici" in the Librairie, etc. Open nit [R]: the "CAPED" badge contrast on the French WorkspaceHQ page was flagged once and did not reproduce later.
- **Point client links to real domains:** Alliance → https://alliancetravel.app/ live via wave 3 (7aeb98b). PR #17 closed as duplicate. Others stay on netlify by owner's choice.
- **Fix WorkspaceHQ demo test failures:** PR #23 merged and live; verify 11/11 on its head. Rule it left: in `workspacehq/embed/console.html` write `sc-camel-on-click="{{ x }}"`, never a plain `onClick=` (breaks the CSP gate).
- **Weekly site health check:** scheduled in the Claude project, Mondays 08:00 Europe/Paris, report-only.
