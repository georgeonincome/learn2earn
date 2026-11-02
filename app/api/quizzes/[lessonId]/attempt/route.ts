import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/server/auth'
import { getStudentByUserId } from '@/lib/server/students'
import { getQuizForLesson, submitQuizAttempt } from '@/lib/server/quizzes'
import { getEnrollment } from '@/lib/server/enroll'
import type { Row } from '@/lib/server/sql'

export const runtime = 'nodejs'

export async function POST(request: NextRequest, ctx: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await ctx.params
  const body = await request.json().catch(() => ({}))

  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
  const student = await getStudentByUserId(user.id)
  if (!student) return NextResponse.json({ error: 'Student profile not found' }, { status: 404 })

  const studentId = student.id
  const quiz = await getQuizForLesson(lessonId)
  if (!quiz) return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })

  // Resolve enrollment (optional — attempt works unbound if there's a quiz without enrollment)
  let enrollmentId = body.enrollmentId ?? null
  if (!enrollmentId && body.courseId) {
    const enrollment = await getEnrollment(studentId, String(body.courseId))
    if (enrollment) enrollmentId = enrollment.id
  }

  const result = await submitQuizAttempt({
    quizId: String(quiz.id),
    lessonId,
    courseId: quiz.course_id,
    studentId,
    enrollmentId,
    answers: body.answers ?? {},
    startedAt: body.startedAt,
    timeSpentSeconds: body.timeSpentSeconds,
  })

  return NextResponse.json(result)
}
