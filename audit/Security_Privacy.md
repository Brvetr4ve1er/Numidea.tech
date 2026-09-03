# Security & Privacy Report

## S-01 · The internal knowledge base is published on the public site — decision needed

`knowledge-base/` (18 files) is the studio's **institutional memory**: market
intelligence, customer knowledge, competitive intelligence, sales playbook,
decision history, and a failures/lessons log. Because `pages.yml` uploads
`path: "."`, all of it is served at
`…/Numidea.tech/knowledge-base/<file>.md` on the public site — and it is in a
public GitHub repo regardless.

This may be deliberate (radical transparency) — but *competitive intelligence
and failure logs* are exactly what a rival or a negotiating client would love to
read. Options, cheapest first:

1. **Exclude from the deploy artifact** (filter step in `pages.yml` before
   upload). Hides it from the site; still visible in the repo.
2. **Move `knowledge-base/` to a private repo** (its own README already frames it
   as an internal source of truth for RAG/agents — a private repo fits that).
3. **Accept publication knowingly** — then link it from the site instead of
   leaving it as an unlisted-but-crawlable directory.

No action was taken in this audit — this is an owner decision.

## S-02 · What's healthy (verified)

- **No secrets committed.** Supabase URL/key placeholders are empty strings; the
  design only ever ships the *publishable* anon key, and the planned RLS schema
  is insert-only with no SELECT policy (a leaked key cannot read leads back).
- **Form → Supabase fetch** is config-gated, `keepalive`, catch-all — it can
  neither block nor break the visitor path.
- All user-influenced rendering in the explorer goes through `esc()`
  (HTML-entity escaping); dictionary `innerHTML` writes use only static,
  first-party strings. No XSS surface found.
- External links consistently use `rel="noopener"`.
- `vercel.json` sets `nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy`,
  `Permissions-Policy`. (GitHub Pages cannot set custom headers — one more
  reason the Vercel import is worth finishing.)
- No analytics/trackers, no third-party JS. The only third-party requests are
  Google Fonts (see Performance P-02).

## S-03 · Residual notes

- The founder CV PDF and personal email are public by explicit choice — fine.
- `mailto:` form handoff exposes nothing that isn't already in the footer.
- Consider adding a `Content-Security-Policy` header in `vercel.json` once
  hosting moves to Vercel (`default-src 'self'; font-src fonts.gstatic.com;
  style-src 'self' 'unsafe-inline' fonts.googleapis.com` + the Supabase origin
  when live). Not possible on Pages.
