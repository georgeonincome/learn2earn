'use client'

import { useState } from 'react'
import {
  Play,
  Lock,
  Check,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  X,
} from 'lucide-react'
import { QUIZ_ATTEMPTS, recordQuizAttempt } from '@/lib/lessons-data'
import type { QuizQuestion, QuizAttempt } from '@/lib/types'

export interface QuizAttemptProps {
  lessonId: string
  questions: QuizQuestion[]
  onComplete?: (score: number, passed: boolean) => void
  initialAttempts?: QuizAttempt[]
}

export function QuizAttempt({
  lessonId,
  questions,
  onComplete,
  initialAttempts = [],
}: QuizAttemptProps) {
  const [step, setStep] = useState<'questions' | 'result'>('questions')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const totalQuestions = questions.length
  // Progress bar for the question carousel (identifier lost in the truncated
  // source file; restored from its single usage site)
  const progressPercent = totalQuestions > 0 ? ((currentQuestion + 1) / totalQuestions) * 100 : 0
  const currentQuestionObj = questions[currentQuestion]
  const isLastQuestion = currentQuestion === totalQuestions - 1

  const handleAnswer = (questionId: string, selectedIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: selectedIndex }))
  }

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setSubmitting(true)
    }
  }

  const handleSubmit = async () => {
    let correctCount = 0
    for (const q of questions) {
      if (answers[q.id] === q.correct) {
        correctCount++
      }
    }

    const score = Math.round((correctCount * 100) / totalQuestions)
    const passed = score >= 70

    const attempt: QuizAttempt = {
      id: 'qa-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8),
      lessonId,
      userId: 1,
      score,
      total: totalQuestions,
      passed,
      attemptedAt: new Date().toISOString(),
    }

    recordQuizAttempt(attempt)

    setSubmitting(false)
    setSubmitted(true)

    if (onComplete) {
      onComplete(score, passed)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setSubmitted(false)
    setStep('questions')
  }

  if (submitted) {
    const correctCount = questions.filter((q) => answers[q.id] === q.correct).length
    const score = Math.round((correctCount * 100) / totalQuestions)
    const passed = score >= 70

    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] px-8">
        <div className={['flex items-center justify-center w-16 h-12 rounded-full mb-6', passed ? 'bg-[#1DB96B]/10 text-[#1DB96B]' : 'bg-[#FEE2E2]/10 text-[#DC2626]'].join(' ')}>
          {passed ? (
            <Check className="w-6 h-6" />
          ) : (
            <Lock className="w-6 h-6" />
          )}
        </div>
        <h2 className="text-2xl font-bold text-[#10201A]">
          {passed ? 'Quiz Complete!' : 'Quiz Complete'}
        </h2>
        <p className="text-lg font-semibold text-[#10201A] mt-2">
          {passed ? 'Congratulations!' : 'Keep trying!'}
        </p>
        <div className="mt-4 flex items-center gap-2">
          <span className="text-4xl font-bold">{score}%</span>
          <span className="text-sm text-[#737373]">score</span>
        </div>
        <div className="mt-2 text-sm text-[#737373]">
          {correctCount} of {totalQuestions} correct
        </div>
        {passed ? (
          <div className="mt-4 text-sm text-[#1DB96B] font-medium">
            {'✓ Passed! You can now proceed to the next lesson.'}
          </div>
        ) : (
          <div className="mt-4 text-sm text-[#DC2626] font-medium">
            Keep studying! You need 70% to pass.
          </div>
        )}
        <div className="mt-8 flex gap-3">
          <button
            onClick={() => setCurrentQuestion(0)}
            className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-2 text-sm font-semibold transition-colors" style={{ minHeight: 44, borderRadius: 8, background: '#F3FBF6', color: '#1DB96B', border: '1px solid #1DB96B', padding: '0 18px' }}
          >
            <ArrowRight className="w-4 h-4" />
            Retake Quiz
          </button>
          <button
            onClick={resetQuiz}
            className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-2 text-sm font-semibold transition-colors" style={{ minHeight: 44, borderRadius: 8, background: '#FFFFFF', color: '#111111', border: '1px solid #E5E5E5', padding: '0 18px' }}
          >
            Back to Lesson
          </button>
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
                      ? 'bg-[#1DB96B] text-white border-[#1DB96B]'
                      : 'bg-[#F5F5F5] text-[#C4C4C4] border-[#C4C4C4]')
                  }
                >
                  <span className={
                    'flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ' +
                    (isSelected
                      ? 'bg-[#1DB96B] text-white border-[#1DB96B]'
                      : 'bg-[#F5F5F5] text-[#C4C4C4] border-[#C4C4C4]')
                  }>
                    {isSelected ? <Play className="h-3 w-3" fill="#fff" /> : i + 1}
                  </span>
                  <span>{option}</span>
                </button>
              )
            })}
            </div>
          </div>
          <div className="mt-8 flex items-center justify-between">
            {currentQuestion > 0 && (
              <button
                onClick={() => setCurrentQuestion(currentQuestion - 1)}
                className="inline-flex items-center gap-2 rounded-lg px-6 py-2 text-sm font-semibold transition-colors" style={{ minHeight: 44, borderRadius: 8, background: '#FFFFFF', color: '#737373', border: '1px solid #E5E5E5', padding: '0 18px' }}
              >
                <ChevronLeft className="w-4 h-4" /> Previous Lesson
              </button>
            )}
            <div className="flex-1"></div>
            <button
              onClick={handleNext}
              disabled={answers[currentQuestionObj.id] === undefined}
              className={
                'inline-flex items-center justify-center gap-2 rounded-lg px-6 py-2 text-sm font-semibold transition-colors' +
                (answers[currentQuestionObj.id] === undefined
                  ? ' bg-[#E5E5E5] text-[#C4C4C4] border-[#E5E5E5]'
                  : ' bg-[#1DB96B] text-white border-[#1DB96B]')
              }
            >
              {isLastQuestion ? 'Submit Quiz' : 'Next Question'} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
  )
}
