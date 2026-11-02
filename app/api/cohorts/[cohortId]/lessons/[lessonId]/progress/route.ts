// Upsert cohort lesson progress — conflict (enrollment_id, lesson_id).
// Body: { enrollmentId, lessonId, isCompleted?, completedAt?, watchTimeSeconds?, positionSeconds? }
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/server/auth'
import { getStudentByUserId } from '@/lib/server/students'
import { saveCohortLessonProgress, getCohortLessonProgress } from '@/lib/server/cohort-player'
import { syncEnrollmentCompletionState } from '@/lib/server/cohort-completion'
import { one } from '@/lib/server/sql'
import type { Row } from '@/lib/server/sql'

export const runtime = 'nodejs'

export async function POST(
  request: NextRequest,
  ctx: { params: Promise<{ cohortId: string; lessonId: string }> },
) {
  const { cohortId, lessonId } = await ctx.params
  const body = await request.json().catch(() => ({}))
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
  const student = await getStudentByUserId(user.id)
  if (!student) return NextResponse.json({ error: 'Student profile not found' }, { status: 404 })

  const studentId = student.id
  const enrollmentId = body.enrollmentId

  if (!enrollmentId) {
    // Resolve enrollment for this student + cohort
    const existing = await one<Row>(
      'SELECT id FROM cohort_enrollments WHERE cohort_id = ? AND student_id = ? LIMIT 1',
      [cohortId, studentId],
    )
    if (!existing) return NextResponse.json({ error: 'Not enrolled in this cohort' }, { status: 403 })
    const eid = String(existing.id)
    await saveCohortLessonProgress({
      enrollmentId: eid,
      lessonId,
      studentId,
      isCompleted: body.isCompleted ?? false,
      completedAt: body.completedAt,
      watchTimeSeconds: body.watchTimeSeconds,
      positionSeconds: body.positionSeconds,
    })
    // Check cohort completion after saving
    const state = await syncEnrollmentCompletionState({
      enrollmentId: eid,
      cohortId,
      studentId,
    })
    return NextResponse.json({ ok: true, enrollmentId: eid, ...state })
  }

  await saveCohortLessonProgress({
    enrollmentId,
    lessonId,
    studentId,
    isCompleted: body.isCompleted ?? false,
    completedAt: body.completedAt,
    watchTimeSeconds: body.watchTimeSeconds,
    positionSeconds: body.positionSeconds,
  })
  const state = await syncEnrollmentCompletionState({
    enrollmentId,
    cohortId,
    studentId,
  })
  return NextResponse.json({ ok: true, enrollmentId, ...state })
}