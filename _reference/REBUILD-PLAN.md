# Learn2Earn — Full Rebuild Plan (Click2Skill 1:1, Zambianized)

Source of truth: `_reference/click2skill/` (code chunks, CSS, Supabase data dumps).
Target: Next.js 16.4.3 App Router + Tailwind 3.4 + Turso (schema mirrors Supabase) + Flutterwave.
Owner data: George J Kasonso · Lusaka, Zambia · ZMW prices · mobile money + card.

## 0. Design-system parity (fix first)

Extracted from `assets/assets_index-Bm9z18eA.css` (:root / .dark / body):

| Token | Reference value | Our current | Action |
|---|---|---|---|
| `--secondary` (light) | `40 40% 96%` warm light gray | `.dark` values incorrectly used in light mode | fix |
| `--muted` (light) | `210 40% 96%` | `0 0% 15%` wrong | fix |
| `--destructive` (light) | `0 72% 51%` | `0 84% 60%` | fix |
| `--info` | `217 91% 60%` missing | missing | add |
| heading font | **Bricolage Grotesque** (`--head`), body Plus Jakarta Sans | all Plus Jakarta | add Bricolage for h1–h4 |
| H1 scale | 72px → 56 → 42, lh 1.02, weight 800, ls 0 | our sizes/weights differ | fix |
| H2 scale | 42 → 36 → 30, lh 1.12, weight 700 | differs | fix |
| gradients | `--gradient-primary`, `--gradient-accent`, `--gradient-dark-overlay` | missing | add |
| shadows | `--shadow-soft: 0 2px 8px -1px rgba(0,0,0,.06)`, `--shadow-medium: 0 4px 12px -2px rgba(0,0,0,.08)` | hardcoded different | add |
| `--transition-smooth` | `all .2s cubic-bezier(.4,0,.2,1)` | missing | add |
| dashboard sidebar tokens | `--dashboard-*` light+dark sets | missing | add |
| dark `.dark` tokens | full set incl. `0 0% 20%` borders, `--success 152 73% 42%` | part wrong (dark bg was green-tinted #10201A) | fix to neutral dark `0 0% 7%` |

Primary green family: `primary 152 73% 42%` (#… 42%), hover `152 72% 36%`, CTAs use `hover:bg-[#1BBF83]`, dark CTA text `#0D0D0D`. Footer bg `#0A0D14`.

## 1. Layout parity

Navbar (from main bundle `Vy=`):
- Mobile-first sticky top section + announcement bar (`bg-[#07140E]` theme color, live class banner)
- Links: Home / Courses / Blog / About / FAQs (+ Cohorts, Membership/Subscribe CTA "Get membership")
- Auth: Login button → `/auth`, "Explore courses" CTA with `bg-primary hover:bg-[#1BBF83] text-[#0D0D0D] font-bold`
- Command-palette search (cmdk) with course search — port as a simple search modal

Footer (exact structure extracted):
1. Top strip: "Stay Updated" + email form (bg `#0A0D14`, border-white/10)
2. 4 cols: logo+tagline "Run by George J Kasonso…" / Explore (Courses, Cohorts, Blog, About, FAQs, Contact) / "Talk to George" (phone, WhatsApp, email, socials) / payment & site info col + legal row (Terms, Privacy, Refunds, ©)
- Sister-project mention → Learn2Earn's own future campus note: "Physical campus planned for Lusaka"

## 2. Route map → rebuild order

| P | Route | Reference source | Status |
|---|---|---|---|
| 1 | `/` home | main bundle home sections + `HeroSection` style, checkout `ec-*` tokens | rebuild all sections |
| 1 | `/courses` | `CourseCatalog-CSQkCmX2.js` + `courses.json` (23 courses → Zambianized) | rebuild |
| 1 | `/courses/:slug` | `CourseDetail-C5tc84t_.js` (About/Outcomes/Sessions/Instructor/FAQ/Reviews/Membership tabs) | rebuild |
| 1 | `/cohorts` | `CohortsCatalog-B3iMLcaa.js` + `cohorts.json` (11 cohorts) | update |
| 1 | `/subscribe` | `Subscribe-DucfmV4N.js` — compact ec-checkout, plans (4mo ZMW, 12mo), Paystack→Flutterwave | rebuild |
| 1 | `/checkout/:slug?` | `Checkout-BzPN2RTB.js` + `Checkout-BB0ugmNX.css` | rebuild |
| 2 | `/auth` | `Auth-DhBBJHb7.js` + `AuthCallback` + OTP modal | update styling |
| 2 | `/dashboard/*` | `StudentDashboard-Dh-ypbFE.js` + sidebar tokens | update |
| 2 | `/blog` + `/blog/:slug` | `Blog-C9g0NBvI.js` + `BlogPost-BbEDsJvZ.js` (10 SEO posts) | localize to Zambia, resave subject Matter |
| 2 | `/faq` | `FAQ-C…` accordion categories pattern | already ok, verify vs chunks |
| 2 | `/about` | `About-D0g2GHRy.js` founder story structure | update |
| 2 | `/contact` | `Contact-CV1V_hvj.js` | verify |
| 2 | `/reviews` | `Reviews-m3j_a8u5.js` + review data | update |
| 3 | `/privacy`, `/terms`, `/refunds` | legal chunks | patch names/phones |
| 3 | `/verify/:certificateId` | `VerifyCertificate-CaPIuCye.js` (public cert verification) | add |
| 3 | funnels: `/50k`, `/5am-challenge`, `/ai-class`, `/va-class`, `/ads-oct-2026`, `/smm-meta-2027`, `/meta-ads`, `/google-ads`, `/vibe-coding`, `/claude`, `/cdl`, `/blp` | per-chunk landing pages | phase 3 (each has own landing + success page) |
| 4 | `/search`, `/welcome`, `/payment-success`, `/payment-failed`, `/course-player/*`, `/cohort-player`, skill-checks, admin | later phases | stub → working |

## 3. Data layer

- Replace `lib/data.ts` seed with data derived from `supabase/courses.json` etc., converted to ZMW (rate: 1 KES ≈ 0.36 ZMW target used earlier — define single `KES_TO_ZMW = 0.36` constant in `lib/config.ts`… actually keep our established 0.155? Use one documented rate: **1 KES = 0.155 ZMW** was previously applied; keep it for consistency and document it).
- `lib/db/schema.ts`: already mirrors tables; keep and extend to match `supabase-tables.txt` core set (courses, cohorts, lessons, bundles, subscription_plans, enrollments, certificates, reviews).
- Payments: `lib/payments/flutterwave.ts` wrapper with `/api/payments/initiate` + `/verify` (keep stub-safe when keys absent).

## 4. Verification loop

After each batch: `curl` all routes for 200, grep dev log for CSS/JS errors, fix, restart via `/tmp/start-learn2earn.sh` when needed.

## Execution order this session
1. Design tokens (globals.css + tailwind.config) — done first.
2. Navbar + Footer exact rebuild.
3. Home page sections 1:1.
4. Courses catalog + detail.
5. Cohorts, subscribe, checkout.
6. Blog/localization pass, legal, verify pages, auth/dashboard polish.
7. Final full-route verification.
