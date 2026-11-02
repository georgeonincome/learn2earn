// Fetch quiz for a lesson (student_quick_quiz contract equivalent).
import { NextRequest, NextResponse } from 'next/server'
import { getQuizForLesson } from '@/lib/server/quizzes'

function parseQuestions(raw: string): unknown[] {
  try {
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw
    return Array.isArray(parsed) ? parsed : []
  } catch { return [] }
}

export const runtime = 'nodejs'

export async function GET(request: NextRequest, ctx: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await ctx.params
  const quiz = await getQuizForLesson(lessonId)
  if (!quiz) return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
  return NextResponse.json({
    quiz: {
      ...quiz,
      questions: parseQuestions(quiz.questions),
    },
  })
}
