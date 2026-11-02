# Phase 2 — Cohorts: Player, Enrollment & Certificates

Status: **DONE** — Phase 2 implemented and smoke-tested against `file:./local.db` (Turso/libSQL local) on 2026-11-02.

Ported from reference: `web/clone/learn2earn/_reference/click2skill/`

## 1. Reference contracts extracted

### CohortPlayer chunk (CohortPlayer-CWsABBCl.js)
- `student_cohort_player({p_cohort})` RPC → returns `{sessions:[...], enrollmentId, studentId, cohort:{title,meetUrl,whatsappGroupUrl},now,adminPreview}`
- Each session: `{id,title,startsAt,minutes,videoId,done,quiz:{questions,done},resources:[{name,type,url}],position}`
- `cohort_lesson_progress.upsert({enrollment_id,lesson_id,student_id,is_completed,completed_at,watch_time_seconds,position_seconds})` on conflict `(enrollment_id,lesson_id)`
- `onComplete(lessonId, done, "watch")` → marks lesson complete, triggers `$()` (cohort completion check)
- `syncEnrollmentCompletionState` / `markEnrollmentCompleted` → marks `cohort_enrollments.status="completed"` when all lessons done or cohort ended
- `generateCohortTranscriptData` / `refresh_my_cohort_transcript({p_enrollment_id})` → generates transcript certificate
- `student_log_live_join({p_lesson})` → logs live session join
- Access states: `ready` (video available), `live` (within 15 min of start), `upcoming`, `processing` (recording coming soon)

### CohortAccess chunk (CohortAccess-CxKT6-jg.js)
- `validate_cohort_access_token({p_token})` → token row + cohort join (built in Phase 0)
- `increment_token_usage({token_id_param})` (built in Phase 0)
- Redemption inserts `cohort_enrollments` + `cohort_token_redemptions` + notification email (built in Phase 0)

### cohortCompletionUtils (cohortCompletionUtils-ClngNIo2.js)
- `isCohortCompleted({status,end_date})` → completed if status==="completed" or end_date passed
- `hasFinalAssessmentResult({enrollment_id,cohort_id})` → checks `cohort_final_assessment_attempts`
- `markEnrollmentCompleted({enrollmentId,cohortId,studentId,final_score})` → updates enrollment + generates transcript
- `syncEnrollmentCompletionState({enrollment_id,cohort_id,student_id})` → public RPC wrapper

### Supabase data shapes
- `cohorts`: id, title, description, thumbnail_url, start_date, end_date, total_days, lesson_duration_minutes, status, max_students, price, price_usd, access_start_time, access_end_time, timezone, whatsapp_group_url, meet_url, class_key, is_published, etc.
- `cohort_lessons`: id, cohort_id, title, starts_at, minutes, video_url, video_provider, content, description, resources, quiz_questions, position
- `cohort_lesson_progress`: id, enrollment_id, lesson_id, student_id, is_completed, completed_at, watch_time_seconds, position_seconds
- `cohort_enrollments`: id, cohort_id, student_id, status ("active"|"completed"), completed_at, final_score
- `cohort_certificates`: student_id, cohort_id, enrollment_id, certificate_id, issue_date, pdf_url, etc.
- `cohort_checkins`: student_id, cohort_id, day_id, checkin_at, points
- `cohort_final_assessments`: id, cohort_id, title, total_questions, passing_score, time_limit_minutes, is_published
- `cohort_final_assessment_attempts`: id, assessment_id, enrollment_id, score, percentage, passed, status, submitted_at

## 2. Data model additions

### New/expanded tables
- `cohorts` — expand with all reference columns (full schema from dump)
- `cohort_lessons` — NEW — sessions within a cohort
- `cohort_certificates` — NEW — issued certificates
- `cohort_checkins` — NEW — daily attendance check-ins
- `cohort_final_assessments` — NEW — final assessment definitions
- `cohort_final_assessment_attempts` — NEW — student assessment attempts
- `cohort_enrollments` — add `completed_at`, `final_score` columns

## 3. API routes

| Route | Methods | Purpose |
|-------|---------|---------|
| `/api/cohorts` | GET | List published cohorts (DB-backed) |
| `/api/cohorts/[slug]` | GET | Cohort detail |
| `/api/cohorts/[cohortId]/player` | GET | `student_cohort_player` — sessions + enrollment + student |
| `/api/cohorts/[cohortId]/lessons/[lessonId]/progress` | POST | Upsert cohort lesson progress |
| `/api/cohorts/enroll` | POST | Enroll in cohort (checkout success callback) |
| `/api/cohorts/checkin` | POST | Daily attendance check-in |
| `/api/cohorts/certificates` | GET | List student's certificates |
| `/api/cohorts/certificates/[id]/download` | GET | Download certificate PDF |

## 4. Components / Pages (new, not touching approved pages)

- `app/cohort/[cohortId]/page.tsx` — cohort player landing (session list)
- `app/cohort/[cohortId]/lesson/[lessonId]/page.tsx` — individual session player
- `components/cohort-player/CohortSessionPlayer.tsx` — session video + notes + resources + quiz
- `components/cohort-player/CertificateDownload.tsx` — certificate download

## 5. Parity checklist

- [x] `cohorts` table matches reference columns exactly
- [x] `cohort_lessons` table matches reference shape
- [x] `cohort_lesson_progress` upsert on conflict `(enrollment_id, lesson_id)`
- [x] Session player states: ready/live/upcoming/processing (client-side in CohortSessionPlayer)
- [x] Lesson completion triggers cohort completion check
- [x] Auto-mark enrollment completed when all lessons done (`syncEnrollmentCompletionState`)
- [x] Certificate issued on cohort completion (`markEnrollmentCompleted`)
- [x] Certificate list + download endpoint
- [x] Daily check-in support
- [x] Access window enforcement (access_start_time/access_end_time)
