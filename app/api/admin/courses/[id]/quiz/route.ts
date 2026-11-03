/**
 * Course studio — lesson quiz builder (upsert).
 */
import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession, requireAdminRole } from '@/lib/server/admin-session'
import { upsertLessonQuiz, deleteLessonQuiz } from '@/lib/server/course-studio'

export const runtime = 'nodejs'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session || !requireAdminRole(session, 'edit_courses').allowed) {
    return NextResponse.json({ error: 'Admin required' }, { status: 403 })
  }
  const { id } = await params
  const body = await req.json().catch(() => ({}))
  if (body.action === 'delete') {
    await deleteLessonQuiz(id)
    return NextResponse.json({ ok: true })
  }
  const quiz = await upsertLessonQuiz({
    lessonId: id, title: body.title, type: body.type, difficulty: body.difficulty,
    passMark: body.passMark, timeLimit: body.timeLimit,
    shuffleQuestions: body.shuffleQuestions, shuffleOptions: body.shuffleOptions,
    showResults: body.showResults, points: body.points, explanation: body.explanation,
    questions: body.questions, isPublished: body.isPublished,
  })
  return NextResponse.json(quiz, { status: 201 })
}
