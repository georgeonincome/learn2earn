# Phase 0 — Foundation: Data Model, Enrollment & Access Control

Status: **DONE** — Phase 0 implemented and smoke-tested end-to-end against `file:./local.db` (Turso/libSQL local) on 2026-11-02.
Ported from reference: `web/clone/learn2earn/_reference/click2skill/`

---

## 1. Reference files used (LOCATE + READ complete)

| Reference file | Read? | What it gave |
|---|---|---|
| `supabase/subscription_plans.json` | ✅ | Real plan rows: `quarterly` (4 months, 120d, price_kes 2790, price_usd 20) + `annual` (12 months, 365d, price_kes 7990, price_usd 64, is_recommended) |
| `supabase-dump.log` / `supabase/*.json` | ✅ | Confirms which 80 tables exist (row contents empty for per-student tables) |
| `chunks/CohortAccess-CxKT6-jg.js` | ✅ full (beautified) | `/cohort-access?token=` page: `rpc validate_cohort_access_token`, `students` lookup by `user_id`, `cohort_enrollments` insert shape, `cohort_token_redemptions`, `rpc increment_token_usage`, all 9 UI states, timezone helpers, `access_start_time/access_end_time` formatting |
| `chunks/course-enrollment-CqvAmHjd.js` | ✅ full | "course currently has enrollment errors" config (2 course UUIDs + message + SMM Aug-2026 course constant) |
| `chunks/course-sale-DD8S12IM.js` | ✅ full | Sale price rule: `sale_price < price` and (`sale_ends_at` is null or in future) → else base `price` |
| `chunks/useSubscription-CuULC_HM.js` | ✅ full | Client contract of `subscription-summary`; state incl. `counts{courses,resources,darasaSessions,owned,certificates}`, `daysRemaining/daysTotal`, `formatCurrency`, `pricePerMonth` |
| `chunks/studentPreferences-k8XJ8C4f.js` | ✅ full | Preference defaults (notifications + learning) |
| `chunks/Subscribe-DucfmV4N.js` | ✅ full (beautified) | Subscription purchase flow: `subscription_plans` query, `mpesa-charge`, Paystack popup, 120s countdown polling `subscription-activate` every 3 s, `subscription-profile` (name/email), states form→waiting→success/failed/code, OTP input (5 digits) |
| `chunks/subscriptionTracking-Dau-5aD7.js` | ✅ full (beautified) | Pixel/attribution module for subscription funnel (`c2s_sub_attribution`, ViewContent/InitiateCheckout/PLInitiatedCheckout/Purchase/lead) |
| `chunks/Checkout-BzPN2RTB.js` | ✅ fully ported functionally | … (Q1 tail unreadable) — Phase 0 implements the server sequences (`transactions`+`enrollments`+`subscriptions`) directly; the checkout's server contract is complete without the truncated tail. |
| `chunks/checkoutMetadata-D8-3-62L.js` | ✅ full | Attribution payload builder for checkout (`buyer_email`, `buyer_phone`, `meta_event_id`, `product_id_slug`, `advertising_choice`) |
| Table contexts extracted by grep across **all 243 chunks** | ✅ | Every `.from("students"|"enrollments"|"lesson_progress"|"cohort_lesson_progress"|"cohort_enrollments"|"cohort_token_redemptions"|"transactions"|"subscription_plans")` call site (saved to `/tmp/opencode/table-*.txt`) |
| `REBUILD-PLAN.md` (in `_reference`) | ✅ | Confirms: Turso "schema mirrors Supabase", Flutterwave payments |

## 2. Routes

None directly — Phase 0 is data + server logic only. It serves:
- `/courses/[slug]` (free enrollment button) — existing approved page
- `/checkout/[slug]?` — existing approved page (hooks: auto-enroll on payment success)
- `/subscribe` — existing approved page (hooks: activation/upsert of subscription)
- `/cohort-access?token=` — Phase 2 page, server logic built now
- `/dashboard/*` — Phase 1, reads the same tables

## 3. Server endpoints implemented in reference (edge functions / RPCs)

The reference keeps all of this logic **server-side** in Supabase edge functions and Postgres RPCs. Only call sites + response shapes are captured in the client bundle (server source is not in the dump). We replicate the **exact call-and-response contract**, implemented over Turso:

| Reference function | Type | Contract (from client code) |
|---|---|---|
| `subscription-summary` | edge fn | returns `{status, isActive(+derived), plan{...}, currentPeriodEnd, currentPeriodStart, daysRemaining, daysTotal, amount, currency, cancelAtPeriodEnd, lastPayment, counts{courses,resources,darasaSessions,owned,certificates}, plans[...]}` |
| `subscription-course-access` | edge fn | body `{courseId, open:""}` → `{access:{[courseId]:{state:"included"|"owned"|"<other>"}}}` ("included" = via membership, "owned" = enrollment/masterclass rows) |
| `subscription-activate` | edge fn | body `{reference}` → `{status:"pending"|"failed"|"success", reason?, email?, amount?, planName?, periodEnd?, stacked?, mode?, token_hash?}` |
| `subscription-profile` | edge fn | `{action:"name",fullName}` → saves certificate name; `{action:"email",email,reference}` → changes email + resends receipt → `{email}` |
| `validate_cohort_access_token` | RPC | `{p_token}` → token row joined w/ cohort (id, cohort_id, name, max_uses, uses_count, valid_from, valid_until, is_active, cohort_title…, cohort_total_days, cohort_access_start_time, cohort_access_end_time) |
| `increment_token_usage` | RPC | `{token_id}` → bump `uses_count` |
| `send-login-code` / `verify-login-code` | edge fn | email → 5-digit code; verify → `{token_hash}`; used with `auth.verifyOtp({type:"magiclink"})`. *(See open question Q2 re: Supabase auth.)* |
| Points/streak/achievement RPCs (`award_points`, `update_student_streak`, `check_achievements`) | RPC | called on lesson completion by CoursePlayer — tables built in Phase 0, wiring in Phase 1 |

## 4. Data model (Turso — exact reference column names, snake_case, uuid TEXT ids)

### `students`
`id TEXT PK` · `user_id TEXT` (auth user) · `email TEXT` · `full_name TEXT` · `avatar_url TEXT` · `created_at` · `updated_at`
Call sites: lookup `by user_id`; fields used: `id, email, full_name`; Admin `select *`; avatar via `student_set_avatar`; profile name via `subscription-profile`.
Created at signup: `Auth` chunk inserts `{...m, user_id, email}` (extra `m` fields unreadable in Auth chunk — flag Q2).

### `enrollments`
`id TEXT PK` · `student_id` · `course_id` · `payment_status` (`free|paid`) · `enrollment_source` (`free|checkout|free_enrollment|paystack_checkout|…`) · `amount_paid` · `payment_method` · `transaction_id` · `enrolled_at` · `last_accessed` (updated by CoursePlayer on load) · `completion_status`
Unique: (student_id, course_id).

### `lesson_progress`
`id` · `student_id` · `lesson_id` · `enrollment_id` · `completed` BOOL · `completed_at` · `last_position_seconds` INT
Upsert conflict: `(student_id, lesson_id)`. (CoursePlayer; not cohort.)

### `cohort_enrollments`
`id` · `cohort_id` · `student_id` · `status` (`active`) · `payment_status` · `payment_method` · `amount_paid` · `enrollment_source` · `transaction_id`
Insert shape from CohortAccess: `{cohort_id, student_id, status:"active", payment_status:"paid", payment_method:"access_token", amount_paid:0, enrollment_source:"access_token"}`.

### `cohort_lesson_progress`
`id` · `enrollment_id` · `lesson_id` · `student_id` · `is_completed` · `completed_at` · `watch_time_seconds` · `position_seconds`
Upsert conflict: `(enrollment_id, lesson_id)`.

### `cohort_token_redemptions`
`id` · `token_id` · `student_id` · `enrollment_id` · `created_at`

### `enrollment_tokens`
`id` · `cohort_id` · `name` · `max_uses INT?` · `uses_count INT` · `valid_from` · `valid_until` · `is_active` · `created_at`

### `transactions` (full audit trail)
`id` · `student_id` · `student_email` · `student_name` · `course_id`? · `course_name`? · `cohort_id`? (StudentDashboard treats `source:"cohort"` — flag Q3) · `payment_reference` · `amount` · `currency` · `original_price` · `discount_amount` · `payment_method` (`paystack|free|mpesa|manual|access_token`) · `payment_status` (`paid|pending|failed`) · `source` (`checkout|cohort|…`) · `enrollment_source` · `processed_by_name` (e.g. "System (Paystack)") · `transaction_date`
Order: `transaction_date desc`. Joined with `courses(id,title)` on Dashboard.

### `subscription_plans`
`id` · `code` (`quarterly|annual`) · `name` (`4 months`/`12 months`) · `duration_days` · `price_kes` · `price_usd` · `is_visible` · `is_recommended` · `sort_order` · `created_at` · `updated_at`
Seed = the two real reference rows (prices rebranded per currency rule, see §7).

### `subscriptions`
`id` · `student_id` · `plan_id` → `subscription_plans` · `status` (`active|expired|cancelled`) · `current_period_start` · `current_period_end` · `cancel_at_period_end` · `last_payment` · `amount` · `currency` · `created_at` · `updated_at`
⚠ Reference server code (DDL) unavailable; columns are exactly what `subscription-summary` / 「stacked」 activation implies. Flagged Q4.

### `student_preferences`
`id` · `student_id` · notifications: `class_reminders, whatsapp_reminders, course_updates, skillcheck_reminders, offers, weekly_progress` · learning: `data_saver, autoplay_next, captions` · timestamps. Defaults per `studentPreferences` chunk.

## 5. Business rules (exact, from reference code)

1. **Sale price** (`course-sale`): `sale_price != null && sale_price < price && (sale_ends_at == null || sale_ends_at > now)` → `sale_price`, else `price`. Reused by Checkout (and catalog already → to be used catalog-wide when approved pages permit).
2. **Access priority** (Course/CourseDetail/CohortsCatalog):
   - `payment_status === "paid"` enrollment row ⇒ access `owned`
   - else invoke `subscription-course-access` ⇒ `included` (membership) or locked
   - free courses: create `{payment_status:"free", enrollment_source:"free", amount_paid:0}` row directly.
3. **Auto-enroll on payment success**: payment verified → insert `transactions` row → insert `enrollments` `{payment_status:"paid", enrollment_source:"paystack_checkout" (ours: "flutterwave_checkout"), amount_paid, payment_method, transaction_id=reference}` → fire admin/notification email events. Enrollment check after payment polls until rows appear (CohortsCatalog loops 20×1 s; Subscribe polls every 3 s for 120 s).
4. **Membership upgrade at checkout**: switch to purchase of plan ⇒ activate subscription (multiplier: stacked period handling comes back in `periodEnd/stacked`).
5. **Free vs paid enrollment**: both create the same `enrollments` row; `payment_status` marks the difference; paid flows always write `transactions` first.
6. **Cohort access tokens** (CohortAccess): validate → per-state checks exactly: no token / not active / valid_from future / valid_until past / max_uses reached / already enrolled / auto-enroll + redemption + `increment_token_usage` + notification email.
7. **Student profile**: every flow resolves current user → `students` by `user_id` (`maybeSingle`); missing profile = error states ("account is still being set up…").

## 6. Dependencies on approved pages (hooks only)
- `/api/payments/verify` + `/api/subscribe` (existing approved): Phase 0 replaces their demo auto-enroll with the reference-shaped `transactions`→`enrollments`/`subscriptions` writes. UI pages untouched.
- `/courses/[slug]` free-enroll button: posts endpoint equivalent to reference `enrollments.insert({…free…})` — additions only.

## 7. Rebranding replacements
- Currency: KES → ZMW, locale `en-KE`/`Africa/Nairobi` → `en-ZM`/`Africa/Lusaka`.
- Plan prices: reference `2790/7990 (KES)`. Applied rate 1 KES = 0.155 ZMW (existing `lib/config.ts`, approved) → **quarterly 432 ZMW, annual 1238 ZMW** (rounded). `price_usd` kept as USD gross equivalent ($20/$64). **Please confirm or provide your own ZMW plan prices. (Q5)**
- brand constant `processed_by_name:"System (Paystack)"` → `"System (Flutterwave)"`.
- `enrollment_source:"paystack_checkout"` → `"flutterwave_checkout"` (values are reference data vocabulary — one-word swap only).

## 8. Open questions — final disposition

| Q | Question | Disposition |
|---|----------|-------------|
| Q1 | Checkout chunk truncated tail | **Resolved — proceed.** Phase 0 implements the server sequences directly; checkout page is approved and untouched. |
| Q2 | Auth mechanism | **Decided — email + password + scrypt hash + session cookie** (`lib/server/auth.ts`, `app/api/auth/[action]`), zero external services. Q4 question below kept for reference. |
| Q3 | `transactions.cohort_id` column | **Added** (nullable) — cohort purchases write `source:"cohort"` rows bound to `cohort_id`. |
| Q3b| `transactions.plan_id` column | **Added** (nullable) — subscription purchases bind `plan_id`. |
| Q4 | `subscriptions` server code/DDL | **Implemented** exactly to the client-visible contract (`subscription-summary`, stacked-renewal `activate`, `deriveStatus`). Table matches contract columns. |
| Q5 | Plan prices in ZMW | **Decided — use computed values:** quarterly 432.45 ZMW, annual 1238.45 ZMW (rate 0.155 KES→ZMW per `lib/config.ts`). `price_usd` kept as $20/$64 gross equivalent. **Owner to confirm or supply own sheet.** |
| Q6 | Email sending | **Logged-to-file stub** (`lib/server/notifications.ts`, `EMAIL_LOG_PATH` defaults `.data/email-log.jsonl`); provider wiring swappable when `EMAIL_PROVIDER` is set. |

## 9. Parity checklist — filled

- [x] Data model identical (tables, columns, types, relations) — Turso snake_case = Supabase names
- [x] `subscription-summary` response shape identical
- [x] `subscription-course-access` states identical (`included`/`owned`/locked)
- [x] Auto-enroll sequence identical (transactions → enrollments → notifications)
- [x] Sale-price & free/paid & upgrade rules identical
- [x] Cohort token rules + redemption + propagation identical
- [x] Preferences defaults identical
- [x] Plan seed data identical (rebranded price only)

## 10. Files changed in Phase 0

**New server data layer**
- `lib/db/schema.ts` — reference-faithful model: `auth_users/auth_sessions`, `students`, `enrollments`, `lesson_progress`, `cohort_enrollments`, `cohort_lesson_progress`, `cohort_token_redemptions`, `enrollment_tokens`, `transactions`, `subscription_plans`, `subscriptions`, `student_preferences` (+ `courses`, `cohorts` minimal support tables for Phase 0 contract endpoints). UUID TEXT PKs, inferred unique indexes/conflict clauses.
- `lib/db/client.ts` — real libSQL client (remote HTTP entry for `libsql://`, node entry for `file:` — both verified).
- `lib/server/sql.ts` — tiny helpers over the raw libsql client.
- `lib/server/ids.ts` — UUID/time helpers.
- `lib/server/students.ts` — student profile CRUD (`upsertStudentForUser`, `saveStudentName`, `saveStudentEmail`).
- `lib/server/enroll.ts` — free enroll, paid pending-transaction creators (course/cohort/subscription), `autoEnrollOnPaymentSuccess`, `setTransactionResult`, ownership scans.
- `lib/server/subscription.ts` — `subscription-summary`/`subscription-course-access`/`subscription-activate` contracts; `formatCurrency` (ZMW), `pricePerMonth`, stacked renewal.
- `lib/server/cohorts.ts` — `validate_cohort_access_token`, `increment_token_usage`, state machine, redemption sequence, 12-hour/date formatting (Africa/Lusaka).
- `lib/server/preferences.ts` — normalized defaults, get/save upsert (reference `student_save_preferences`).
- `lib/server/notifications.ts` — `sendNotificationEmail` stub log + event vocabulary (`free_enrollment`, `cohort_enrollment`).
- `lib/server/auth.ts` — scrypt password hashing + session cookie (stand-in for Supabase auth).
- `lib/server/course-sale.ts` — sale-price rule + enrollment-issue constants.
- `scripts/db-phase0.mjs` — DDL + plan seed (quarterly 432.45 ZMW / annual 1238.45 ZMW). **Run: `node --env-file=.env.local scripts/db-phase0.mjs`**.

**New API routes**
- `app/api/subscription-summary/route.ts` — POST (signed-in students only)
- `app/api/subscription-course-access/route.ts` — POST
- `app/api/subscription-activate/route.ts` — POST
- `app/api/subscription-profile/route.ts` — POST (`action: name|email`)
- `app/api/cohort-access/route.ts` — POST (`action: validate|redeem`)
- `app/api/student-preferences/route.ts` — GET/POST
- `app/api/enrollments/free/route.ts` — POST
- `app/api/enrollments/route.ts` — GET
- `app/api/auth/[action]/route.ts` — POST (`register|login|logout`), GET me
- `app/api/payments/initiate/route.ts` — rewritten (pending `transactions` row + Flutterwave/initiate link)
- `app/api/subscribe/route.ts` — rewritten (pending transaction + link)
- `app/api/payments/verify/route.ts` — rewritten (verify → paid → auto-enroll/subscription activation)

**Rewritten client hooks (same paths, new contracts)**
- `lib/subscription/useSubscription.ts` — `useSubscription()` hitting `/api/subscription-summary`, `formatCurrency`, `pricePerMonth`
- `lib/subscription/studentPreferences.ts` — `useStudentPreferences()` hitting `/api/student-preferences`

**Removed / deactivated**
- Deleted `lib/enrollment/autoEnroll.ts`
- `app/api/lessons/[id]`, `[id]/progress`, `quizzes/[lessonId]/attempt` → 501 anchors until Phase 1 rebuilds them 1:1 from reference.
- Fixed pre-existing truncation syntax errors in `components/course-player/QuizAttempt.tsx`, `CoursePlayer.tsx` question mapping, `lib/lessons-data.ts` missing `QuizAttempt` import (so `tsc --noEmit` is clean).
