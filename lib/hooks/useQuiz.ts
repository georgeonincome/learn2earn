'use client'
import { useState, useEffect, useCallback } from 'react'

export type QuizQuestion = {
  id: string
  question: string
  options: string[]
  correct: number
  explanation?: string
}

export type QuizData = {
  id: string
  lesson_id: string
  title: string
  passing_score: number
  time_limit_minutes?: number
  questions: QuizQuestion[]
}

export type QuizAttemptResult = {
  score: number
  maxScore: number
  percentage: number
  passed: boolean
  attemptNumber: number
  attemptDate: string
}

export function useQuiz(lessonId: string) {
  const [quiz, setQuiz] = useState<QuizData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!lessonId) return
    fetch(`/api/quizzes/${lessonId}`)
      .then((r) => { if (r.ok) return r.json(); else return null })
      .then((data) => { setQuiz(data?.quiz ?? null) })
      .catch((e) => console.error('[useQuiz] fetch error', e))
      .finally(() => setLoading(false))
  }, [lessonId])

  const submit = useCallback(async (answers: Record<string, number>, opts?: { startedAt?: string; timeSpentSeconds?: number; courseId?: string; enrollmentId?: string }) => {
    if (!quiz || !lessonId) return null
    const res = await fetch(`/api/quizzes/${lessonId}/attempt`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        answers,
        courseId: opts?.courseId ?? quiz.lesson_id,
        enrollmentId: opts?.enrollmentId,
        startedAt: opts?.startedAt,
        timeSpentSeconds: opts?.timeSpentSeconds,
      }),
    })
    if (!res.ok) return null
    return (await res.json()) as QuizAttemptResult
  }, [quiz, lessonId])

  return { quiz, loading, submit }
}
