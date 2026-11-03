/**
 * Course studio — lesson quiz builder (upsert, AI generation, CSV import).
 */

import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession, requireAdminRole } from '@/lib/server/admin-session'
import { upsertLessonQuiz, deleteLessonQuiz } from '@/lib/server/course-studio'

export const runtime = 'nodejs'

/**
 * Generate AI quiz questions for a lesson topic.
 * Stubbed until an AI provider is configured; returns plausible questions
 * so the admin can review/edit before publishing.
 */
function generateAILessonQuestions({
  topic, type = 'single', difficulty = 'medium', count = 5, passMark = 70,
}: { topic: string; type?: string; difficulty?: string; count?: number; passMark?: number }) {
  const questions = []
  for (let i = 0; i < count; i++) {
    questions.push({
      id: `ai-q-${i + 1}`,
      topic,
      question: `What is a key consideration for ${topic} (question ${i + 1})?`,
      options: [
        `Option A for ${topic}`,
        `Option B for ${topic}`,
        `Option C for ${topic}`,
        `Option D for ${topic}`,
      ],
      correct: i % 4,
      type,
      explanation: `This answer relates to ${topic} best practices (difficulty: ${difficulty}).`,
    })
  }
  return {
    title: `${topic} Quiz`,
    type,
    difficulty,
    pass_mark: passMark,
    questions,
  }
}

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
  if (body.action === 'generate_ai') {
    const generated = generateAILessonQuestions({
      topic: body.topic,
      type: body.type ?? 'single',
      difficulty: body.difficulty ?? 'medium',
      count: body.count ?? 5,
      passMark: body.passMark ?? 70,
    })
    return NextResponse.json(generated, { status: 200 })
  }
  if (body.action === 'import_csv') {
    const csvText = String(body.csv_text ?? '')
    const lines = csvText.trim().split('\n').filter((l: string) => l.trim().length > 0)
    if (lines.length < 2) {
      return NextResponse.json({ error: 'CSV must have a header row and at least one question row' }, { status: 400 })
    }
    const header: string[] = lines[0].split(',').map((h: string) => h.trim().toLowerCase())
    const questions = lines.slice(1).map((line: string, idx: number) => {
      const cols: string[] = line.split(',')
      const get = (name: string) => {
        const idx2: number = header.indexOf(name)
        return idx2 >= 0 ? (cols[idx2] ?? '').trim() : ''
      }
      return {
        id: `csv-q-${idx + 1}`,
        topic: get('topic') || 'Imported',
        question: get('question') || 'Imported question',
        options: [
          get('option_a') || 'Option A',
          get('option_b') || 'Option B',
          get('option_c') || 'Option C',
          get('option_d') || 'Option D',
        ],
        correct: parseInt(get('correct') || '0', 10) || 0,
        type: (get('type') || 'single') as 'single' | 'multiple' | 'true_false',
        explanation: get('explanation') || '',
      }
    })
    return NextResponse.json({
      title: 'Imported Quiz',
      type: 'single',
      difficulty: 'medium',
      pass_mark: 70,
      questions,
    }, { status: 200 })
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
