# Phase 1 — Course Player, Lesson Progress, Quizzes & Gamification

Status: **DONE** — Phase 1 implemented and smoke-tested against `file:./local.db` (Turso/libSQL local) on 2026-11-02.

Ported from reference: `web/clone/learn2earn/_reference/click2skill/`

## 1. Reference contracts extracted

### CoursePlayer chunk (CoursePlayer-2icA96ky.js)
- `lesson_progress.upsert`: `{student_id, lesson_id, enrollment_id, last_position_seconds}` conflict `(student_id, lesson_id)`
- `lesson_progress.upsert` complete: add `{completed: true, completed_at}`
- `onProgress(lessonId, seconds)` — writes every ~10s threshold (debounced)
- `onComplete(lessonId, true, "watch")` — marks complete, triggers gamification
- Side effects on completion: `awardPoints(10, "lesson_complete", lessonId)`, `updateStreak()`, `checkAchievements()`
- `reset_my_lesson_progress({p_enrollment_id, p_lesson_id})` — delete row

### StudentDashboard chunk
- Queries `quiz_attempts`, `lessons`, `cohort_lesson_progress`, `cohort_final_assessments`
- Lesson list with progress state per lesson

### QuickQuizDialog chunk
- RPC `student_quick_quiz({p_kind, p_lesson})` — fetch quiz data
- RPC `submit_course_lesson_quiz_attempt({p_quiz_id, p_lesson_id, p_course_id, p_enrollment_id, p_answers, p_started_at, p_time_spent_seconds})`

### Supabase data shapes
- `lessons`: id, course_id, title, lesson_order, video_url, notes, document_url, duration_minutes, section_id, lesson_type, content, is_preview, description
- `public_course_lessons`: id, course_id, section_id, title, lesson_order, duration_minutes, lesson_type, is_preview
- `public_course_sections`: id, course_id, title, description, section_order
- `course_lesson_quizzes`: id, lesson_id, title, passing_score, time_limit_minutes, questions (json array), is_published, course_id
- `course_lesson_quiz_attempts`: id, quiz_id, lesson_id, course_id, student_id, enrollment_id, score, max_score, percentage, passed, answers, started_at, time_spent_seconds, attempt_date, attempt_number

## 2. Data model additions

### New tables
- `public_course_sections` — sections within a course
- `public_course_lessons` — lessons (public view, slimmer than full lessons)
- `course_lesson_quizzes` — quiz definitions per lesson
- `course_lesson_quiz_attempts` — student quiz submissions
- `student_points` — gamification points per student
- `student_streaks` — daily activity streaks
- `student_achievements` — many-to-many achievements earned
- `achievement_definitions` — achievement catalog

## 3. API routes

| Route | Methods | Purpose |
|-------|---------|---------|
| `/api/lessons/[id]` | GET | Fetch lesson by id (from DB) |
| `/api/lessons/[id]/progress` | GET/POST | Read/write lesson progress |
| `/api/quizzes/[lessonId]` | GET | Get quiz for a lesson |
| `/api/quizzes/[lessonId]/attempt` | POST | Submit quiz attempt |
| `/api/gamification/points` | GET/POST | Read/total points |
| `/api/gamification/streak` | GET/POST | Read/update streak |
| `/api/gamification/achievements` | GET | List earned achievements |

## 4. Component updates

- `CoursePlayer` — DB-backed progress, resume from `last_position_seconds`, quiz integration, gamification triggers
- `QuizAttempt` — DB-backed quiz fetching and submission
- `Dashboard page` — Real data from DB (enrollments, progress, streaks, achievements)
- `app/courses/[slug]/lessons/[lessonId]/page.tsx` — DB-backed lesson resolution, access checks via `subscription-course-access`

## 5. Parity checklist

- [ ] Lesson progress upsert behaves identically (student_id, lesson_id conflict)
- [ ] Video resume from last_position_seconds
- [ ] Completion triggers gamification (points + streak + achievements)
- [ ] Quiz fetch from DB (course_lesson_quizzes)
- [ ] Quiz submission via RPC contract
- [ ] Dashboard shows real enrollment/progress data
- [ ] Streak updates on daily activity
- [ ] Points awarded on lesson completion
