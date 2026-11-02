// Quiz system — reference contracts from QuickQuizDialog-BjT2FQ0Z.js
// and StudentDashboard-Dh-ypbFE.js.
//
// Fetch: `student_quick_quiz({p_kind, p_lesson})` → quiz row from `course_lesson_quizzes`
// Submit: `submit_course_lesson_quiz_attempt`
//   body: {p_quiz_id, p_lesson_id, p_course_id, p_enrollment_id,
//          p_answers, p_started_at, p_time_spent_seconds}
//
// Tables: course_lesson_quizzes, course_lesson_quiz_attempts
import { one, all, run } from './sql'
import { nowIso, uuid } from './ids'
import type { Row } from './sql'

export type QuizQuestion = {
  id: string
  question: string
  options: string[]
  correct: number // index of correct answer
  explanation?: string
}

export type QuizRow = {
  id: string
  lesson_id: string
  course_id: string | null
  title: string | null
  passing_score: number
  time_limit_minutes: number | null
  questions: string // JSON stored in DB
  is_published: number | null
}

function parseQuestions(row: Row): QuizQuestion[] {
  const raw = row.questions ?? '[]'
  try {
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

/** Fetch the published quiz for a lesson (student_quick_quiz behavior). */
export async function getQuizForLesson(lessonId: string): Promise<QuizRow | null> {
  const row = await one<Row>(
    'SELECT * FROM course_lesson_quizzes WHERE lesson_id = ? AND is_published = 1 LIMIT 1',
    [lessonId],
  )
  if (!row) return null
  return {
    id: String(row.id),
    lesson_id: String(row.lesson_id),
    course_id: (row.course_id as string) ?? null,
    title: (row.title as string) ?? null,
    passing_score: Number(row.passing_score ?? 70),
    time_limit_minutes: row.time_limit_minutes != null ? Number(row.time_limit_minutes) : null,
    questions: String(row.questions ?? '[]'),
    is_published: Number(row.is_published),
  }
}

/** All attempts by a student for a lesson (Dashboard listing). */
export async function getQuizAttemptsForStudent(studentId: string): Promise<Row[]> {
  return all(
    `SELECT qa.*, q.title AS quiz_title, q.passing_score, l.title AS lesson_title, c.title AS course_title, l.course_id
       FROM course_lesson_quiz_attempts qa
       JOIN course_lesson_quizzes q ON q.id = qa.quiz_id
       JOIN lessons l ON l.id = qa.lesson_id
       LEFT JOIN courses c ON c.id = qa.course_id
      WHERE qa.student_id = ?
      ORDER BY qa.attempt_date DESC`,
    [studentId],
  )
}

export async function getQuizAttemptsForLesson(studentId: string, lessonId: string): Promise<Row[]> {
  return all(
    'SELECT * FROM course_lesson_quiz_attempts WHERE student_id = ? AND lesson_id = ? ORDER BY attempt_date DESC',
    [studentId, lessonId],
  )
}

export async function hasPassedQuiz(studentId: string, lessonId: string): Promise<boolean> {
  const row = await one(
    'SELECT id FROM course_lesson_quiz_attempts WHERE student_id = ? AND lesson_id = ? AND passed = 1 LIMIT 1',
    [studentId, lessonId],
  )
  return Boolean(row)
}

/**
 * Submit a quiz attempt — server-side scoring (the reference's
 * `submit_course_lesson_quiz_attempt` RPC does scoring server-side;
//  StudentDashboard called `submit_lesson_quiz_attempt` with {p_lesson_id, p_answers}).
 */
export async function submitQuizAttempt({
  quizId,
  lessonId,
  courseId,
  studentId,
  enrollmentId,
  answers,
  startedAt,
  timeSpentSeconds,
}: {
  quizId: string
  lessonId: string
  courseId: string | null
  studentId: string
  enrollmentId?: string | null
  answers: Record<string, number>
  startedAt?: string
  timeSpentSeconds?: number
}) {
  const quiz = await one<Row>(
    'SELECT * FROM course_lesson_quizzes WHERE id = ? LIMIT 1',
    [quizId],
  )
  if (!quiz) throw new Error('Quiz not found')

  const questions: QuizQuestion[] = parseQuestions(quiz)
  if (questions.length === 0) throw new Error('Quiz has no questions')

  let correctCount = 0
  const maxScore = questions.length
  for (const q of questions) {
    const submitted = Number(answers[String(q.id)])
    if (submitted === Number(q.correct)) correctCount++
  }

  const percentage = Math.round((correctCount / maxScore) * 100)
  const passingScore = Number(quiz.passing_score ?? 70)
  const passed = percentage >= passingScore
  const now = nowIso()

  // Determine attempt number
  const prev = await all<{ n: number }>(
    'SELECT COUNT(*) AS n FROM course_lesson_quiz_attempts WHERE student_id = ? AND quiz_id = ?',
    [studentId, quizId],
  )
  const attemptNumber = Number(prev[0]?.n ?? 0) + 1

  const id = uuid()
  await run(
    `INSERT INTO course_lesson_quiz_attempts
       (id, quiz_id, lesson_id, course_id, student_id, enrollment_id, score, max_score,
        percentage, passed, answers, started_at, time_spent_seconds, attempt_date, attempt_number, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, unixepoch())`,
    [
      id, quizId, lessonId, courseId ?? null, studentId, enrollmentId ?? null,
      correctCount, maxScore, percentage, passed ? 1 : 0,
      JSON.stringify(answers),
      startedAt ?? now, timeSpentSeconds ?? 0, now, attemptNumber,
    ],
  )

  return {
    id,
    score: correctCount,
    maxScore,
    percentage,
    passed,
    attemptNumber,
    attemptDate: now,
  }
}
