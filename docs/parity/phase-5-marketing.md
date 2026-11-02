# Phase 5 — Marketing: Bundles, Landing Pages & Attribution

Status: **DONE** — Phase 5 implemented and smoke-tested against `file:./local.db` on 2026-11-03.

Note: reference BundleLanding embeds the purchase form directly on the landing page
(no separate `/bundle/[slug]/checkout` route), so checkout lives in the landing
component; success is `/bundle-success?ref=`.

Ported from reference: `web/clone/learn2earn/_reference/click2skill/`

## 1. Reference chunks extracted

| Chunk | Purpose |
|-------|---------|
| `BundleLanding-Dzk1kmnS.js` | Bundle landing page — multiple courses for one price, countdown timer, stats grid, FAQs |
| `BundleSuccess-Cc7dTlqs.js` | Bundle success page after payment |
| `checkoutMetadata-D8-3-62L.js` | Attribution payload builder (meta_event_id, buyer_email, buyer_phone, product_id_slug, advertising_choice) |
| `metaPixel-Dy9nrdR3.js` | Meta pixel events (ViewContent, InitiateCheckout, Purchase) |
| `Funnel-uaRVZWa5.js` | Course funnel page — live enrollment counts, upsell modal, countdown, pricing tiers |
| `checkoutMetadata` call sites | Every checkout initiation attaches attribution metadata |

## 2. Data model additions

### New tables
- `bundles` — id, slug, name, tagline, description, price, anchor_price, is_active, cover_image_url, created_at
- `bundle_courses` — id, bundle_id, course_id, position

## 3. API routes

| Route | Methods | Purpose |
|-------|---------|---------|
| `/api/bundles` | GET | List active bundles |
| `/api/bundles/[slug]` | GET | Single bundle with its courses |
| `/api/bundles/purchase/[reference]` | GET | Bundle purchase summary for the success page |
| `/api/payments/initiate` | POST | Extended with `type:"bundle"` (pending transactions row with bundle_id) |
| `/api/payments/verify` | POST/GET | Extended — `autoEnrollOnPaymentSuccess` expands bundle_id into per-course enrollments |

## 4. Pages (new)

| Route | Purpose |
|-------|---------|
| `/bundle/[slug]` | Bundle landing page (BundleLanding-Dzk1kmnS.js style) with inline purchase form |
| `/bundle-success` | Bundle success page (`?ref=` — confirming / paid / not-confirmed states) |

## 5. Components (new)

| Component | Purpose |
|-----------|---------|
| `BundleLanding` | Landing page with stats, course grid, FAQs |
| `BundleCheckout` | Checkout form with attribution metadata |
| `BundleSuccess` | Success confirmation page |

## 6. Marketing attribution

Every checkout/page view attaches `meta_event_id` + advertising attribution so the attribution pipeline knows where buyers came from. Meta pixel fires `ViewContent`, `InitiateCheckout`, `Purchase` events.

## 7. Parity checklist (filled after smoke test 2026-11-03)

- [x] `bundles` table matches Supabase `bundles.json` columns
- [x] `bundle_courses` table matches Supabase `bundle_courses.json` columns
- [x] `/api/bundles` returns bundles from DB (2 seeded, ZMW rebranded: 727 / anchor 3226 & 834)
- [x] `/api/bundles/[slug]` returns bundle with courses (ordered by position)
- [x] Bundle landing page renders with anchor-strike price, tick features, earnings grid, FAQ accordion
- [x] Bundle purchase creates enrollments for each course (demo: initiate → verify → 2 enrollments "paid")
- [x] Checkout metadata (attribution) attached to checkout initiation (`lib/marketing.ts` buildCheckoutMetadata + meta_event_id session storage)
- [x] Meta pixel events fire (ViewContent on mount, InitiateCheckout on submit, Purchase on success — window.fbq-safe like reference)
- [x] Bundle success page renders (confirming → paid states; unknown ref → "No payment reference found")
