'use client'

/**
 * QuizAttempt — DB-backed quiz submission.
 * Replaces the old in-memory untrusted client-side scoring model.
 *
 * Props:
 *   lessonId: string
 *   questions: QuizQuestion[]
 *   passingScore: number (default 70% in reference)
 *   timeLimitMinutes?: number
 *   onSubmit: server-side submit function returning QuizAttemptResult
 *   onComplete: callback with attempt result (for CoursePlayer to mark complete on pass)
 */

import { useState, useEffect } from 'react'
import {
  Play,
  Lock,
  Check,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  X,
} from 'lucide-react'

export type QuizQuestion = {
  id: string
  question: string
  options: string[]
  correct: number
  explanation?: string
}

export type QuizAttemptResult = {
  score: number
  maxScore: number
  percentage: number
  passed: boolean
  attemptNumber: number
  attemptDate: string
}

export interface QuizAttemptProps {
  lessonId: string
  questions: QuizQuestion[]
  passingScore?: number
  timeLimitMinutes?: number
  onSubmit: (answers: Record<string, number>, opts?: { startedAt?: string; timeSpentSeconds?: number; courseId?: string; enrollmentId?: string }) => Promise<QuizAttemptResult | null>
  onComplete?: (result: QuizAttemptResult) => void
}

export function QuizAttempt({
  lessonId,
  questions,
  passingScore = 70,
  timeLimitMinutes,
  onSubmit,
  onComplete,
}: QuizAttemptProps) {
  const [step, setStep] = useState<'questions' | 'result'>('questions')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState<QuizAttemptResult | null>(null)
  const [startedAt] = useState(() => new Date().toISOString())
  const [startedTs] = useState(() => Date.now())

  const totalQuestions = questions.length
  const progressPercent = totalQuestions > 0 ? ((currentQuestion + 1) / totalQuestions) * 100 : 0
  const currentQuestionObj = questions[currentQuestion]
  const isLastQuestion = currentQuestion === totalQuestions - 1

  const handleAnswer = (questionId: string, selectedIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: selectedIndex }))
  }

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    const timeSpentSeconds = Math.round((Date.now() - startedTs) / 1000)
    const res = await onSubmit(answers, { startedAt, timeSpentSeconds })
    setSubmitting(false)
    setSubmitted(true)
    if (res) {
      setResult(res)
      if (onComplete) onComplete(res)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setSubmitted(false)
    setResult(null)
    setStep('questions')
  }

  const score = result?.percentage ?? 0
  const passed = result?.passed ?? false
  const correctCount = result?.score ?? 0

  if (submitted && result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] px-8">
        <div className={['flex items-center justify-center w-16 h-16 rounded-full mb-6', passed ? 'bg-[#1DB96B]/10 text-[#1DB96B]' : 'bg-[#FEE2E2]/10 text-[#DC2626]'].join(' ')}>
          {passed ? <Check className="w-8 h-8" /> : <Lock className="w-8 h-8" />}
        </div>
        <h2 className="text-2xl font-bold text-[#10201A]">{passed ? 'Quiz Complete!' : 'Quiz Results'}</h2>
        <p className="text-lg font-semibold text-[#10201A] mt-2">
          {passed ? 'Congratulations!' : 'Keep trying!'}
        </p>
        <div className="mt-4 flex items-center gap-2">
          <span className="text-4xl font-bold">{score}%</span>
          <span className="text-sm text-[#737373]">score</span>
        </div>
        <div className="mt-2 text-sm text-[#737373]">
          {correctCount} of {totalQuestions} correct (attempt {result.attemptNumber})
        </div>
        {passed ? (
          <div className="mt-4 text-sm text-[#1DB96B] font-medium">
            {'✓ Passed! You can now proceed to the next lesson.'}
          </div>
        ) : (
          <div className="mt-4 text-sm text-[#DC2626] font-medium">
            Keep studying! You need {passingScore}% to pass.
          </div>
        )}
        <div className="mt-8 flex gap-3">
          <button
            onClick={resetQuiz}
            className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-2 text-sm font-semibold transition-colors"
            style={{ minHeight: 44, borderRadius: 8, background: passed ? '#F3FBF6' : '#FFFFFF', color: passed ? '#1DB96B' : '#111111', border: '1px solid ' + (passed ? '#1DB96B' : '#E5E5E5'), padding: '0 18px' }}
          >
            <ArrowRight className="w-4 h-4" />
            Retake Quiz
          </button>
          {passed && (
            <button
              onClick={() => {}}
              className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-2 text-sm font-semibold transition-colors"
              style={{ minHeight: 44, borderRadius: 8, background: '#1DB96B', color: '#fff', border: '1px solid #1DB96B', padding: '0 18px' }}
            >
              Next Lesson
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-[500px]">
      <div className="w-full h-1 bg-[#E5E5E5] rounded-full mb-6">
        <div
          className="h-full bg-[#1DB96B] rounded-full transition-all duration-300"
          style={{ width: progressPercent + '%' }}
        />
      </div>
      <div className="flex flex-col gap-6">
        <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-6">
          <div className="flex justify-between items-start mb-4">
            <span className="text-sm font-semibold text-[#737373]">
              Question {currentQuestion + 1} of {totalQuestions}
            </span>
            {timeLimitMinutes && (
              <span className="text-xs text-[#737373]">
                Time limit: {timeLimitMinutes} min
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold text-[#10201A] mb-4">
            {currentQuestionObj.question}
          </h3>
          <div className="space-y-3">
            {currentQuestionObj.options.map((option, i) => {
              const isSelected = answers[currentQuestionObj.id] === i
              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(currentQuestionObj.id, i)}
                  className={
                    'flex items-center gap-3 w-full px-4 py-3 rounded-lg text-left transition-colors ' +
                    (isSelected
                      ? 'bg-[#1DB96B] text-white border border-[#1DB96B]'
                      : 'bg-[#F5F5F5] text-[#2E3D37] border border-[#E5E5E5] hover:bg-[#E8F6EF]')
                  }
                >
                  <span className={
                    'flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold border ' +
                    (isSelected
                      ? 'bg-[#1DB96B] text-white border-[#1DB96B]'
                      : 'bg-white text-[#737373] border-[#E5E5E5]')
                  }>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span>{option}</span>
                </button>
              )
            })}
          </div>
        </div>
        <div className="flex items-center justify-between">
          {currentQuestion > 0 && (
            <button
              onClick={() => setCurrentQuestion(currentQuestion - 1)}
              className="inline-flex items-center gap-2 rounded-lg px-6 py-2 text-sm font-semibold transition-colors"
              style={{ minHeight: 44, borderRadius: 8, background: '#FFFFFF', color: '#737373', border: '1px solid #E5E5E5', padding: '0 18px' }}
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
          )}
          <div className="flex-1" />
          <button
            onClick={isLastQuestion ? handleSubmit : handleNext}
            disabled={answers[currentQuestionObj.id] === undefined || submitting}
            className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-2 text-sm font-semibold transition-colors disabled:opacity-50"
            style={{ minHeight: 44, borderRadius: 8, background: '#1DB96B', color: '#fff', border: '1px solid #1DB96B', padding: '0 18px' }}
          >
            {submitting ? 'Submitting…' : isLastQuestion ? 'Submit Quiz' : 'Next'} <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
