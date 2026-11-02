// Cohort completion — reference contracts from cohortCompletionUtils-ClngNIo2.js.
// `syncEnrollmentCompletionState({enrollment_id, cohort_id, student_id})`
//   → checks all lessons done OR cohort ended OR final assessment passed
//   → marks enrollment completed + issues certificate
// `markEnrollmentCompleted({enrollmentId, cohortId, studentId, final_score})`
import { all, one, run } from './sql'
import { nowIso } from './ids'
import type { Row } from './sql'
import { sendNotificationEmail } from './notifications'
import { markEnrollmentCompleted, countCohortLessons as countLessons, countCompletedLessons } from './cohort-player'

/** Is the cohort itself completed (by status or end_date)? */
export async function isCohortCompleted(cohortId: string): Promise<boolean> {
  const row = await one<Row>(
    'SELECT status, end_date FROM cohorts WHERE id = ? LIMIT 1',
    [cohortId],
  )
  if (!row) return false
  if ((row.status as string) === 'completed') return true
  const endStr = (row.end_date as string) ?? ''
  if (endStr) {
    const end = new Date(endStr)
    end.setHours(23, 59, 59, 999)
    return new Date() > end
  }
  return false
}

/** Does the enrollment have a final assessment result? */
export async function hasFinalAssessmentResult(
  enrollmentId: string,
  cohortId: string,
): Promise<{ hasResult: boolean; percentage?: number | null }> {
  const assess = await one<Row>(
    `SELECT id FROM cohort_final_assessments WHERE cohort_id = ? AND is_published = 1 LIMIT 1`,
    [cohortId],
  )
  if (!assess) return { hasResult: false }
  const attempt = await one<Row>(
    `SELECT score, percentage, passed, status, submitted_at FROM cohort_final_assessment_attempts
     WHERE assessment_id = ? AND enrollment_id = ? LIMIT 1`,
    [String(assess.id), enrollmentId],
  )
  if (!attempt) return { hasResult: false }
  const result =
    (attempt.score ?? null) !== null ||
    (attempt.percentage ?? null) !== null ||
    (attempt.status as string) === 'submitted' ||
    (attempt.status as string) === 'completed'
  return {
    hasResult: result,
    percentage: attempt.percentage != null ? Number(attempt.percentage) : null,
  }
}

/**
 * Sync enrollment completion state — public RPC equivalent.
 * Checks lessons done → cohort ended → final assessment passed.
 */
export async function syncEnrollmentCompletionState({
  enrollmentId,
  cohortId,
  studentId,
}: {
  enrollmentId: string
  cohortId: string
  studentId: string
}): Promise<{ isCompleted: boolean; needsSync: boolean }> {
  const enrollment = await one<Row>(
    'SELECT status FROM cohort_enrollments WHERE id = ? LIMIT 1',
    [enrollmentId],
  )
  if (!enrollment) return { isCompleted: false, needsSync: false }
  if ((enrollment.status as string) === 'completed')
    return { isCompleted: true, needsSync: false }

  // 1. All lessons completed?
  const total = await countLessons(cohortId)
  const done = await countCompletedLessons(enrollmentId)
  if (total > 0 && done === total) {
    await markEnrollmentCompleted(enrollmentId, cohortId, studentId, null)
    return { isCompleted: true, needsSync: true }
  }

  // 2. Cohort ended (participation-based completion)?
  if (await isCohortCompleted(cohortId)) {
    const { hasResult, percentage } = await hasFinalAssessmentResult(
      enrollmentId,
      cohortId,
    )
    await markEnrollmentCompleted(enrollmentId, cohortId, studentId, percentage ?? null)
    return { isCompleted: true, needsSync: true }
  }

  // 3. Final assessment completed?
  const { hasResult } = await hasFinalAssessmentResult(enrollmentId, cohortId)
  if (hasResult) {
    await markEnrollmentCompleted(enrollmentId, cohortId, studentId, null)
    return { isCompleted: true, needsSync: true }
  }

  return { isCompleted: false, needsSync: false }
}
