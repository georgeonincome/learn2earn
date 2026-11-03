# Phase 6 — DB-Backed Funnels

Status: **DONE** — implemented and smoke-tested against `file:./local.db` on 2026-11-03.

Ported from reference: `web/clone/learn2earn/_reference/click2skill/supabase/course_funnels.json`
(one live row: `virtual-assistant`) and `Funnel-uaRVZWa5.js` client render contract.

## Reference table: `course_funnels`

Columns: `id, course_id, slug, headline, subheadline, description, cta_text,
hero_image_url, benefits, testimonials, is_active, created_at, updated_at`.
The description is rich HTML (`h2/h3/p/ul/li/strong/br` with emoji headers);
benefits is a JSON string array; testimonials is a JSON array of
`{name, role, text}`.

The dump contains only the `virtual-assistant` funnel. The reference's other
funnel pages (50k, 5AM, AI web design, bundle upsells) are hardcoded chunks, so
those keep rendering from the static `FUNNELS` map — DB has no rows for them.

## Decisions

- `course_funnels` table created with the **exact dump columns** (snake_case).
- Seed = reference `virtual-assistant` row, rebranded (Elvis → George,
  @Elviswarutumo → @George, KES → ZMW in text). `course_id` keeps the reference
  value; the CTA resolver falls back to the static funnel's ctaHref when the
  linked course isn't in our DB (reference courses aren't seeded here).
- Rich `description` HTML is rendered through a small server-side allowlist
  sanitizer (`lib/server/html.ts`) — the reference ships DOMPurify; the site
  content is trusted-dump HTML, but the sanitizer guards before
  `dangerouslySetInnerHTML`.
- `FunnelPageComponent` becomes DB-first: `getFunnelBySlug()` returns the live
  row for `virtual-assistant` (and any future rows); all other slugs keep the
  static fallback. Wrapper pages under `/va`, `/virtual-assistant`, etc. are
  untouched.

## Deliverables

- `lib/db/schema.ts` — `courseFunnels` table
- `scripts/db-phase6-funnels.mjs` — DDL + reference seed (rebranded)
- `lib/server/funnels.ts` — `getFunnelBySlug` (+ course link resolution)
- `lib/server/html.ts` — allowlist sanitizer
- `components/funnel-page.tsx` — DB-first rendering, static fallback
- `app/api/funnels/[slug]/route.ts` — JSON endpoint for tooling/parity
- Smoke test — `/virtual-assistant` renders DB headline; `/50k` unchanged

## Parity checklist (filled after smoke test 2026-11-03)

- [x] `course_funnels` table matches reference dump columns
- [x] Reference `virtual-assistant` row seeded (rebranded Elvis→George, active)
- [x] `/virtual-assistant` renders DB funnel (headline/subheadline/benefits ×8/testimonials ×6/description HTML — zero "Elvis" mentions)
- [x] Static funnels unaffected (`/50k` unchanged; unknown slugs → "Page Not Found" fallback)
- [x] Description HTML sanitized before render (allowlist: script stripped, on* handlers stripped, javascript: hrefs neutralized, h2/h3/p/ul/li/strong/em kept)
- [x] CTA resolves from linked course when present; DB course not in our catalog → static fallback href
- [x] `/api/funnels/[slug]` returns DB funnel data (404 for static-only slugs)
