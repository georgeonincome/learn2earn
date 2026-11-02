import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/server/auth'
import { getStudentByUserId } from '@/lib/server/students'
import {
  getLessonProgress,
  saveLessonProgress,
  saveLessonComplete,
  resetLessonProgress,
} from '@/lib/server/lesson-progress'
import { awardPoints, updateStreak, checkAchievements } from '@/lib/server/gamification'
export const runtime = 'nodejs'

export async function GET(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
  const student = await getStudentByUserId(user.id)
  if (!student) return NextResponse.json({ error: 'Student profile not found' }, { status: 404 })
  const progress = await getLessonProgress(student.id, id)
  return NextResponse.json({ progress })
}

export async function POST(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id: lessonId } = await ctx.params
  const body = await request.json().catch(() => ({}))
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
  const student = await getStudentByUserId(user.id)
  if (!student) return NextResponse.json({ error: 'Student profile not found' }, { status: 404 })
  const studentId = student.id

  const action = String(body.action ?? 'progress')
  const enrollmentId = body.enrollmentId ?? null

  if (action === 'reset') {
    await resetLessonProgress(studentId, lessonId)
    return NextResponse.json({ ok: true })
  }

  const lastPositionSeconds =
    typeof body.lastPositionSeconds === 'number' ? body.lastPositionSeconds : undefined

  if (lastPositionSeconds != null) {
    await saveLessonProgress({ studentId, lessonId, enrollmentId, lastPositionSeconds })
  }

  if (body.completed === true) {
    await saveLessonComplete({ studentId, lessonId, enrollmentId })
    // Trigger gamification side effects (CoursePlayer onComplete behavior)
    await awardPoints({ studentId, points: 10, reason: 'lesson_complete', referenceId: lessonId })
    await updateStreak(studentId)
    const newlyEarned = await checkAchievements(studentId)
    return NextResponse.json({
      progress: await getLessonProgress(studentId, lessonId),
      gamification: { points: 10, newlyEarned: newlyEarned.length },
    })
  }

  return NextResponse.json({ progress: await getLessonProgress(studentId, lessonId) })
}
