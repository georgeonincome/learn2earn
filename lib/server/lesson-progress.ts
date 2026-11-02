// Lesson progress — reference contracts from CoursePlayer-2icA96ky.js.
// Upsert: {student_id, lesson_id, enrollment_id, last_position_seconds}
//   on conflict (student_id, lesson_id)
// Upsert completion: add {completed: true, completed_at}
// Reset: delete row for (enrollment_id, lesson_id).
import { one, all, run } from './sql'
import { nowIso } from './ids'
import type { Row } from './sql'

export async function getLessonProgress(studentId: string, lessonId: string) {
  return one<Row>(
    'SELECT * FROM lesson_progress WHERE student_id = ? AND lesson_id = ? LIMIT 1',
    [studentId, lessonId],
  )
}

export async function getAllLessonProgressForStudent(studentId: string, enrollmentId?: string): Promise<Row[]> {
  if (enrollmentId) {
    return all(
      'SELECT * FROM lesson_progress WHERE student_id = ? AND enrollment_id = ? ORDER BY updated_at DESC',
      [studentId, enrollmentId],
    )
  }
  return all(
    'SELECT * FROM lesson_progress WHERE student_id = ? ORDER BY updated_at DESC',
    [studentId],
  )
}

/** CoursePlayer calls this every ~10 seconds on progress tick (debounced). */
export async function saveLessonProgress({
  studentId,
  lessonId,
  enrollmentId,
  lastPositionSeconds,
}: {
  studentId: string
  lessonId: string
  enrollmentId?: string | null
  lastPositionSeconds?: number
}) {
  await run(
    `INSERT INTO lesson_progress
       (id, student_id, lesson_id, enrollment_id, last_position_seconds, updated_at)
     VALUES (?, ?, ?, ?, ?, unixepoch())
     ON CONFLICT(student_id, lesson_id) DO UPDATE SET
       last_position_seconds = excluded.last_position_seconds,
       enrollment_id = COALESCE(excluded.enrollment_id, lesson_progress.enrollment_id),
       updated_at = unixepoch()`,
    [
      crypto.randomUUID(),
      studentId,
      lessonId,
      enrollmentId ?? null,
      lastPositionSeconds ?? 0,
    ],
  )
}

/** Marks a lesson as completed (CoursePlayer `onComplete`). */
export async function saveLessonComplete({
  studentId,
  lessonId,
  enrollmentId,
}: {
  studentId: string
  lessonId: string
  enrollmentId?: string | null
}) {
  await run(
    `INSERT INTO lesson_progress
       (id, student_id, lesson_id, enrollment_id, completed, completed_at, updated_at)
     VALUES (?, ?, ?, ?, 1, ?, unixepoch())
     ON CONFLICT(student_id, lesson_id) DO UPDATE SET
       completed = 1,
       completed_at = excluded.completed_at,
       enrollment_id = COALESCE(excluded.enrollment_id, lesson_progress.enrollment_id),
       updated_at = unixepoch()`,
    [
      crypto.randomUUID(),
      studentId,
      lessonId,
      enrollmentId ?? null,
      nowIso(),
    ],
  )
}

/** Reset progress for a lesson (CoursePlayer "Retry" / admin action). */
export async function resetLessonProgress(studentId: string, lessonId: string) {
  await run(
    'DELETE FROM lesson_progress WHERE student_id = ? AND lesson_id = ?',
    [studentId, lessonId],
  )
}

/** Count completed lessons in a course (for progress calc). */
export async function countCompletedLessons(studentId: string, courseId: string): Promise<number> {
  const rows = await all<{ n: number }>(`
    SELECT COUNT(*) AS n FROM lesson_progress lp
    JOIN lessons l ON l.id = lp.lesson_id
    WHERE lp.student_id = ? AND l.course_id = ? AND lp.completed = 1
  `, [studentId, courseId])
  return Number(rows[0]?.n ?? 0)
}

/**
 * Full lesson listing with progress for a given enrollment.
 * Returns all lessons in (student_id, course_id) join with their
 * lesson_progress row so CoursePlayer can set states on first load.
 */
export async function getCourseLessonsWithProgress(
  studentId: string,
  courseId: string,
): Promise<Row[]> {
  return all(
    `SELECT l.*, lp.completed, lp.last_position_seconds
       FROM lessons l
       LEFT JOIN lesson_progress lp ON lp.lesson_id = l.id AND lp.student_id = ?
      WHERE l.course_id = ? AND l.deleted_at IS NULL
      ORDER BY l.lesson_order ASC`,
    [studentId, courseId],
  )
}
