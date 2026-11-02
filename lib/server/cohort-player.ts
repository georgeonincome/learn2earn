// Cohort player — reference contracts from CohortPlayer-CWsABBCl.js.
// `student_cohort_player({p_cohort})` → sessions + enrollment + student.
// Lesson progress upsert on conflict (enrollment_id, lesson_id).
// Completion triggers cohort completion check + certificate issuance.
import { all, one, run } from './sql'
import { nowIso, uuid } from './ids'
import type { Row } from './sql'

export type CohortSession = {
  id: string
  title: string
  startsAt: string
  minutes: number
  videoId: string | null
  done: boolean
  quiz: { questions: number; done: boolean } | null
  resources: { name: string; type: string; url: string }[]
  position: number
}

export type CohortPlayerData = {
  sessions: CohortSession[]
  enrollmentId: string | null
  studentId: string | null
  cohort: { id: string; title: string; meetUrl: string | null; whatsappGroupUrl: string | null }
  now: string
}

/** Fetch cohort player data — equivalent to `student_cohort_player` RPC. */
export async function getCohortPlayer(cohortId: string, studentId?: string | null): Promise<CohortPlayerData | null> {
  // Resolve by slug or id
  const cohort = await one<Row>(
    'SELECT id, title, meet_url, whatsapp_group_url FROM cohorts WHERE (id = ? OR slug = ?) AND deleted_at IS NULL LIMIT 1',
    [cohortId, cohortId],
  )
  if (!cohort) return null

  const sessions = await all<Row>(
    'SELECT * FROM cohort_lessons WHERE cohort_id = ? ORDER BY starts_at ASC',
    [cohortId],
  )

  let enrollmentId: string | null = null
  if (studentId) {
    const existing = await one<Row>(
      'SELECT id FROM cohort_enrollments WHERE cohort_id = ? AND student_id = ? LIMIT 1',
      [cohortId, studentId],
    )
    enrollmentId = existing ? String(existing.id) : null
  }

  const now = nowIso()
  return {
    sessions: sessions.map((s) => ({
      id: String(s.id),
      title: String(s.title),
      startsAt: String(s.starts_at),
      minutes: Number(s.minutes ?? 25),
      videoId: null, // resolved from video_url client-side
      done: Boolean(s.is_completed),
      quiz: null, // resolved from quiz_questions client-side
      resources: [],
      position: Number(s.position ?? 0),
    })),
    enrollmentId,
    studentId: studentId ?? null,
    cohort: {
      id: String(cohort.id),
      title: String(cohort.title),
      meetUrl: (cohort.meet_url as string) ?? null,
      whatsappGroupUrl: (cohort.whatsapp_group_url as string) ?? null,
    },
    now,
  }
}

/** Upsert cohort lesson progress — conflict (enrollment_id, lesson_id). */
export async function saveCohortLessonProgress({
  enrollmentId,
  lessonId,
  studentId,
  isCompleted,
  completedAt,
  watchTimeSeconds,
  positionSeconds,
}: {
  enrollmentId: string
  lessonId: string
  studentId: string
  isCompleted?: boolean
  completedAt?: string
  watchTimeSeconds?: number
  positionSeconds?: number
}) {
  await run(
    `INSERT INTO cohort_lesson_progress
       (id, enrollment_id, lesson_id, student_id, is_completed, completed_at,
        watch_time_seconds, position_seconds, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, unixepoch())
     ON CONFLICT(enrollment_id, lesson_id) DO UPDATE SET
       is_completed = excluded.is_completed,
       completed_at = excluded.completed_at,
       watch_time_seconds = excluded.watch_time_seconds,
       position_seconds = excluded.position_seconds,
       updated_at = unixepoch()`,
    [
      uuid(),
      enrollmentId,
      lessonId,
      studentId,
      isCompleted ? 1 : 0,
      completedAt ?? null,
      watchTimeSeconds ?? 0,
      positionSeconds ?? 0,
    ],
  )
}

/** Get all lesson progress for an enrollment. */
export async function getCohortLessonProgress(enrollmentId: string): Promise<Row[]> {
  return all(
    'SELECT * FROM cohort_lesson_progress WHERE enrollment_id = ? ORDER BY updated_at DESC',
    [enrollmentId],
  )
}

/** Count completed lessons in a cohort enrollment. */
export async function countCompletedLessons(enrollmentId: string): Promise<number> {
  const rows = await all<{ n: number }>(
    'SELECT COUNT(*) AS n FROM cohort_lesson_progress WHERE enrollment_id = ? AND is_completed = 1',
    [enrollmentId],
  )
  return Number(rows[0]?.n ?? 0)
}

/** Total lessons in a cohort. */
export async function countCohortLessons(cohortId: string): Promise<number> {
  const rows = await all<{ n: number }>(
    'SELECT COUNT(*) AS n FROM cohort_lessons WHERE cohort_id = ?',
    [cohortId],
  )
  return Number(rows[0]?.n ?? 0)
}

/** Mark enrollment completed (used by syncEnrollmentCompletionState). */
export async function markEnrollmentCompleted(
  enrollmentId: string,
  cohortId: string,
  studentId: string,
  finalScore?: number | null,
) {
  await run(
    'UPDATE cohort_enrollments SET status = ?, completed_at = ?, final_score = ? WHERE id = ?',
    ['completed', nowIso(), finalScore ?? null, enrollmentId],
  )
  // Issue certificate
  const student = await one<Row>(
    'SELECT full_name FROM students WHERE id = ? LIMIT 1',
    [studentId],
  )
  const cohort = await one<Row>(
    'SELECT title FROM cohorts WHERE id = ? LIMIT 1',
    [cohortId],
  )
  if (student && cohort) {
    const certId = `L2E-${Date.now().toString(36).toUpperCase()}`
    await run(
      `INSERT INTO cohort_certificates
         (id, certificate_id, student_id, cohort_id, enrollment_id, student_name,
          cohort_title, issue_date, is_verified, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, unixepoch())`,
      [uuid(), certId, studentId, cohortId, enrollmentId,
        String(student.full_name ?? ''), String(cohort.title), nowIso()],
    )
  }
}
