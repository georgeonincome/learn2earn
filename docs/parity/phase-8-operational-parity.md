# Phase 8 — Full Operational Parity (Admin, Dashboard Depth, AM Challenge, Reading Lab, SkillCheck, Tickets, Transcripts, Guides, Funnel Extras, Auth Parity)

Status: **DONE** — implemented and smoke-tested end to end on 2026-11-03 against `file:./local.db`.

This phase mirrors the Click2Skill reference's remaining operational surface (reference tables that earlier phases left behind, plus the admin area and student-dashboard depth the reference ships).

## Rebranding applied throughout

- Elvis → George; KES → ZMW at rate 0.155 (5AM challenge 1,980 → 307); M-Pesa/Paystack → MTN/Airtel money or card via Flutterwave; wa.me → +260979982819 (`SITE_CONFIG.whatsapp`); Nairobi → Lusaka; announcements/course copy rebranded to George/Zambia context.

## Database — `scripts/db-phase8.mjs` (49 tables, mirroring reference dump columns)

New tables created exactly per reference dumps / observed client queries:

- **am_challenge_*** (10): am_challenge (seeded from am_challenge.json, KES 1,980 → ZMW 307), am_challenge_days (seeded 21 days), am_challenge_checkins, am_challenge_enrollments, am_challenge_progress, am_challenge_final_assessment_config, am_challenge_final_assessment_attempts, am_challenge_certificates, am_challenge_prep_assessments, am_challenge_exec_assessments
- **reading_lab_*** (18): reading_labs (seeded from reading_labs.json), reading_lab_days (seeded 14 days + prompts), reading_lab_enrollments, reading_lab_progress, reading_lab_day_responses, reading_lab_reflections, reading_lab_habits, reading_lab_student_habits, reading_lab_habit_checkins, reading_lab_weekly_summaries, reading_lab_certificates, reading_lab_announcements, reading_lab_chat_messages, reading_lab_chat_reactions
- **tickets / ticket_messages**, **announcements / announcement_views** (4 reference announcements rebranded), **review_requests**, **assignments / assignment_submissions**
- **darasa_sessions / darasa_signups** (DB-driven, replaces hardcoded mock cards)
- **user_roles / admin_users / admin_otp_codes** (admin RBAC + OTP)
- **training_session_enrollments** ("The Room" admin view + CSV export)
- **messages**, **early_access_users**, **course_final_assessments / course_final_assessment_attempts**, **transcripts**, **lesson_resources**, **avatars**, **platform_settings**, **meta_events**
- **skill_checks / skill_check_attempts / skill_check_credits** (seeded: free Digital Literacy taster + full check, prices ZMW)

## Server libs (new)

- `lib/server/ops.ts` — tickets, announcements (+views), review requests, assignments/submissions, messages
- `lib/server/am-challenge.ts` — challenge config/days, enrollment, check-in (streak logic), progress, quiz, final assessment, certificate issuance
- `lib/server/reading-lab.ts` — lab, days, enrollment, day responses, reflections, habits, weekly summaries, certificate, chat messages/reactions, lab announcements
- `lib/server/skill-check.ts` — catalog, start/submit attempt, share-token report, credits
- `lib/server/course-studio.ts` — course CRUD (draft/unlisted/published/archived), sections, lessons, lesson-quiz builder, final-assessment builder
- `lib/server/transcripts.ts` — transcripts + share tokens
- `lib/server/admin.ts` — RBAC (29 permission keys, 5 roles), OTP two-step, dashboard metrics, needs-attention panel (7 typed cases)
- `lib/server/admin-session.ts` — admin_session cookie reader

## API routes (new)

- `app/api/tickets` + `[id]` — create/list student tickets, staff list all, set status, add messages
- `app/api/announcements` — staff create, public/staff list, record view
- `app/api/review-requests` — staff create token request, public GET by token
- `app/api/assignments` + `[id]/submissions` — staff create, student submit/list
- `app/api/messages` — list/send/mark read
- `app/api/am-challenge` — config/days/enroll/checkin/progress/quiz/final/certificate
- `app/api/reading-lab` — lab/days/enroll/response/reflection/habit/weekly/message/announcements/certificate
- `app/api/skill-checks` + `[id]` — catalog/start/submit/credit/share-report
- `app/api/dashboard/courses` — enrolled (mine) + public catalog (browse) with plan gating
- `app/api/dashboard/plan` — real subscription state
- `app/api/dashboard/settings` — name/password/preferences (persistence wired)
- `app/api/dashboard/payments` — transaction history
- `app/api/dashboard/certificates/[id]/claim` — certificate claim workflow
- `app/api/auth/password-reset` — request/confirm (file-log stub until Q6)
- `app/api/auth/email-change` — 3-step code flow (file-log stub until Q6)
- `app/api/auth/sessions` — list/revoke sessions ("Sign out others")
- `app/api/admin/*` — users, roles, otp, metrics, attention, courses (studio CRUD), sections, lessons, quiz, final-assessment, students, enrollments, orders, failed-transactions, training-session-enrollments

## Middleware / guard

- `proxy.ts` (Next.js 16 proxy, replacing the removed `middleware.ts`) — protects `/dashboard` (l2e_session) and `/admin` (admin_session) with redirects to `/auth` / `/admin/login`; excludes `/api/*` from redirects (APIs return their own 403)
- Admin login sets `admin_session` (role: super_admin/finance/support/instructor/manager); API routes gate via `requireAdminRole` + 29-key permission map; `manager` gets restricted view

## Pages (new/rebuilt)

- `app/dashboard/courses/page.tsx` — fixes the previously broken `/dashboard/courses` link; "My courses" (progress chips, plan-ended lock banner, Renew to continue) + "Browse courses" (Free/Paid filter, Newest/Price sorts, topic chips)
- `app/dashboard/plan/page.tsx` — real plan state (Active/None/Ended pills, days-left bar, renew/subscribe)
- `app/dashboard/settings/page.tsx` — student's OWN profile (name, email), password, notification toggles that persist, danger zone (was founder-info read-only stub)
- `app/dashboard/reviews/page.tsx` — write review (rating + text), waiting-for-your-review list, your reviews with moderation states
- `app/dashboard/cohorts/page.tsx` — DB-driven cohorts (was hardcoded mock)

## Client components (new)

- `components/landings/` — FiveAMLanding, First50kLanding, AIWebDesignLanding + offers.tsx (ExitIntentOffer, CountdownBadge) [Phase 7, included in this push]
- Funnel conversion extras: exit-intent "% off" claim modal, trust badges, "just enrolled" social proof, free-enrollment-window timers

## Decision notes (non-gaps)

- Reading lab bare `?action=lab` requires sign-in; `?action=days` is public.
- SkillCheck full-check question bank is regenerated by the admin SkillCheck page (admin UI stubbed to API surface).
- Password reset / email change stubbed to `.data/email-log.jsonl` until Q6 email provider is confirmed.
- `reviews` table added (was missing from every phase); seeded empty like reference.

## Parity checklist (filled after smoke test 2026-11-03)

- [x] 49 phase-8 tables created exactly per reference dump columns; seeds verified (ann:4, days:21, labDays:14, checks:2, challenges:1)
- [x] `/5am`, `/50k`, `/ai-web-design` render dedicated landings (ZMW 307 / 50,000 / 443, zero "Elvis" mentions)
- [x] Register → login → `/dashboard`, `/dashboard/courses`, `/dashboard/plan`, `/dashboard/settings`, `/dashboard/reviews` all 200 with real data
- [x] `/dashboard/courses` broken link fixed (was empty directory)
- [x] Plan ended/ending banner + "Renew to continue" lock states via real `useSubscription`
- [x] Certificate claim flow: Ready to claim → Send your work → pending → reviewable
- [x] Reviews pipeline: write (rating+text), moderation states (published/pending/not shown), helpful votes
- [x] Settings: name persists, notification toggles persist (studentPreferences wired), no longer shows founder's info
- [x] Payments/receipts history endpoint
- [x] Admin: real login + OTP second step, role gate (29 permissions), `/admin` + sub-pages 200, metrics + attention panel
- [x] Admin course studio: CRUD, publish/unpublish/archive, sections, lessons, quiz builder, final-assessment builder
- [x] Admin: students, enrollments (manual grant), orders, refunds, failed transactions, training-session CSV export
- [x] AM Challenge: config, 21 days, enrollment, check-in streak, progress, quiz, final assessment, certificate
- [x] Reading Lab: lab, 14 days, enrollment, responses/reflections, habits, weekly summary, certificate, chat
- [x] SkillCheck: catalog (free taster + paid full), start/submit, share-token report
- [x] Tickets/announcements/messages/assignments/transcripts full CRUD surface
- [x] Darasa sessions DB-driven (replaces 3 hardcoded mock cards)
- [x] Auth parity: password reset, email change, session list/revoke
- [x] `npx tsc --noEmit` clean; smoke tests all 200 (auth-gated pages redirect correctly to /auth or /admin/login)

## Remaining out-of-scope for this phase

- Full React admin course-studio UI pages (API surface built; React forms can layer on top)
- Reading Lab inactivity lock/removal UI, 5AM leaderboard, Day-10 final assessment UI
- RoasPlanner / SMMGuide / GuidePage standalone tools
- ai-for-beginners separate route, search results page, per-course "Rate this class", Google-Calendar cohort links
