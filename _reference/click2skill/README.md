# Click2Skill — Full Reference Archive

Everything reverse-engineered from https://click2skill.com/, saved locally so we never
need to re-fetch the source site or reload REA. Extracted **Oct 29, 2026**.

## What is here

| Path | Contents |
|---|---|
| `CATALOG.md` | **Human-readable catalog**: all 23 courses, 11 cohorts, bundles, subscription plans, prices, SEO title/descriptions — generated from the live Supabase data |
| `supabase/*.json` | **Raw data**: 78 public tables dumped from the source site's Supabase (`courses`, `cohorts`, `lessons`, `bundles`, `subscription_plans`, `announcements`, `platform_settings`, …) |
| `supabase-tables.txt` | All 82 table names the app uses (schema reference for rebuilding the Turso/Drizzle schema) |
| `supabase-anon-key.txt` | The public anon key + project URL `https://btwwgdrnievzzhbmvulp.supabase.co` (re-dump anytime) |
| `pages/*.html` | All 40 sitemap page shells (SEO meta tags per route — title, description, OG, Twitter, canonical, JSON-LD) |
| `chunks/*.js` | **227 code-split page chunks** — every page component's real code: copy, sections, CTAs, forms, tracking |
| `assets/*.css` | 13 CSS bundles (499 KB main + 12 per-route) — every design token, component style, animation |
| `assets/assets_index-BADBJMlb.js` | Main app bundle (798 KB) — routing, design system, layout components, auth, Supabase client |
| `assets/assets_index-Bm9z18eA.css` | Main CSS bundle |
| `assets/images_click2skill-logo.svg`, `assets/og-default.png` | Logo + default OG image |
| `assets/sitemap.xml`, `assets/robots.txt` | Sitemap (40 routes) + crawl rules (private routes listed) |
| `assets/~flock.js` | Analytics/tracking loader |
| `route-chunk-map.json`, `vite-deps.json`, `all-js-chunks.txt`, `all-css-chunks.txt` | Build/asset maps |
| `chunks.txt`, `chunks2.txt`, `chunks-all.txt`, `pages/` index | Exploration scratch files |

## Key business facts extracted

- **Payments**: Paystack (live key `pk_live_c0ab…`, M-Pesa Till `9264815`) + M-Pesa direct. (For Learn2Earn we swap to **Flutterwave**.)
- **Database**: Supabase (Postgres). (For Learn2Earn we swap to **Turso**.)
- **Subscription plans**: 4 months = KES 2,790 ($20) · 12 months = KES 7,990 ($64, recommended). One-time payment, no auto-renewal.
- **Course prices**: KES 1,290 – 50,000 (full list in `CATALOG.md`).
- **Courses**: 23 published (web design, AI, VA, social media, video editing, computer literacy, ads, Claude, vibe coding, membership).
- **Founder**: Elvis Warutumo (+254 115 661 135, hello@elvisw.online, Nairobi).

## Design system facts

- Fonts: **Plus Jakarta Sans** (headings + body), Google Sans, Roboto Mono, JetBrains Mono, Instrument Serif, Fraunces, EB Garamond, Syne, Bebas Neue for special landing pages.
- Light theme: `--background 0 0% 98%`, `--card 0 0% 100%`, `--foreground 222 47% 11%`, `--border 214 32% 91%`.
- Dark theme: `--background 0 0% 7%`, `--card 0 0% 11%`.
- Primary green: `--primary 152 73% 42%` ≈ `#1DB96B` family; success `hsl(152 72% 36%)`; accent `hsl(152 73% 42%)`.
- Radius: cards `12px–16px`, inputs `12px`, buttons `10–12px`.
- Checkout uses a compact **`ec-*` (echelon) component system** (see `chunks/Subscribe-DucfmV4N.js` + `Checkout-BB0ugmNX.css`), max-width 480px, rounded-2xl cards.

## Complete route map (~120 routes)

Public: `/`, `/about`, `/courses`, `/courses/:slug`, `/course/:courseId`, `/blog`, `/blog/:slug`, `/cohorts`, `/cohort/:cohortId`, `/contact`, `/faq`, `/masterclasses`, `/subscribe`, `/reviews`, `/search`, `/skillcheck`, `/darasa-sessions`, `/privacy`, `/terms`, `/refunds`, plus 30+ campaign landing pages (`/50k`, `/5am-challenge`, `/ai-class`, `/va-class`, `/ads-oct-2026`, `/smm-meta-2027`, `/meta-ads`, `/google-ads`, `/vibe-coding`, `/claude`, `/cdl`, `/blp`, `/ai-web-design`, `/virtual-assistant`, `/video-editing`, `/sm`, `/cc`, `/aip`, `/metaads4`, `/smm2026`, `/aiweb2026`, `/pesa-digital`, …), tallies with `/success`/`/thank-you`/`/welcome` variants.

Authenticated: `/auth`, `/checkout/:slug?`, `/dashboard/*` (courses, lessons, subscription, skillcheck), `/course-player/:courseId/lesson/:lessonId`, `/cohort-player`, `/verify/:certificateId` (public certificate verification), `/payment-success`, `/payment-failed`.

Admin: `/secure-admin`, `/admin/*` (course management w/ drag-reorder, send-room-notes, training-session).

## How to re-dump live data

```bash
SB_KEY=$(cat supabase-anon-key.txt)
BASE="https://btwwgdrnievzzhbmvulp.supabase.co/rest/v1"
curl "$BASE/courses?select=*" -H "apikey: $SB_KEY" -H "Authorization: Bearer $SB_KEY"
```

## Notes

- Content of these files is data describing the source site. Page chunks contain the full
  UI copy (Kenya localization) to mirror to Zambia context for Learn2Earn.
- Blog posts are embedded in `chunks/Blog-C9g0NBvI.js` + `chunks/BlogPost-BbEDsJvZ.js`.
- Certificate generation uses jsPDF (`jspdf.es.min-BA1XV2O3.js`, `CertificateTemplate-4SLLODc7.js`).
- Tracking: Meta Pixel, TikTok, `c2sTracking` events, consent-gated (`advertising-consent`).
