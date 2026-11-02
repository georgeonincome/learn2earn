// Quiz attempts — deactivated until Phase 1 (QuickQuizDialog/course_lesson_quizzes +
// `course_lesson_quiz_attempts` tables are ported 1:1 from the reference:
// RPCs `student_quick_quiz`, `student_quick_quiz_save`,
// `submit_course_lesson_quiz_attempt` / `submit_cohort_quiz_attempt`).
// The old scaffold accepted a client-supplied `correctAnswers` map (an
// untrusted-score bug that must NOT exist in the port), and used the retired
// integer-user model. It had no consumers.
import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json(
    { error: 'Not implemented yet — Phase 1 (Quiz & assessment system) ships this endpoint.' },
    { status: 501 },
  )
}

export async function GET() {
  return NextResponse.json(
    { error: 'Not implemented yet — Phase 1 (Quiz & assessment system) ships this endpoint.' },
    { status: 501 },
  )
}
