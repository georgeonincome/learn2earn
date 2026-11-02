'use client'

/**
 * CoursePlayer — DB-backed, mirrors reference CoursePlayer-2icA96ky.js
 * Props:
 *   course: Row from DB
 *   lesson: Current lesson Row from DB
 *   allLessons: Array of all lesson rows in this course (from server)
 *   isPreview: boolean
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import {
  Play,
  Lock,
  Check,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Star,
  MessageCircle,
  Share2,
  X,
  BookOpen,
} from 'lucide-react'
import { EnhancedVideoPlayer } from './EnhancedVideoPlayer'
import { QuizAttempt } from './QuizAttempt'
import { useLessonProgress } from '@/lib/hooks/useLessonProgress'
import { useQuiz } from '@/lib/hooks/useQuiz'
import { formatPrice } from '@/lib/utils'

type CoursePlayerProps = {
  course: Record<string, unknown>
  lesson: Record<string, unknown>
  allLessons: Record<string, unknown>[]
  isPreview: boolean
}

export default function CoursePlayer({ course, lesson, allLessons, isPreview }: CoursePlayerProps) {
  const [lessons, setLessons] = useState<Record<string, unknown>[]>([])
  const [currentLessonId, setCurrentLessonId] = useState(String(lesson.id))
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set())
  const [showCertificate, setShowCertificate] = useState(false)
  const [showQuiz, setShowQuiz] = useState(false)
  const [hasAccess, setHasAccess] = useState(isPreview)
  const [loading, setLoading] = useState(true)

  const courseId = String(course.id ?? '')
  const currentLesson = lessons.find((l) => String(l.id) === currentLessonId) ?? lesson
  const currentIndex = lessons.findIndex((l) => String(l.id) === currentLessonId)
  const totalLessons = lessons.length
  const isLastLesson = currentIndex === totalLessons - 1
  const isFirstLesson = currentIndex === 0

  const { progress, savePosition, saveComplete } = useLessonProgress(currentLessonId)
  const { quiz, submit: submitQuiz } = useQuiz(currentLessonId)

  // Progress tracking refs (debounced every 10s to avoid db spam)
  const lastSavedRef = useRef(0)
  const lastPositionRef = useRef(0)

  // Load lessons + progress + access
  useEffect(() => {
    async function init() {
      setLoading(true)
      try {
        // Fetch full lesson list with progress from DB
        const res = await fetch(`/api/courses/${String(course.slug)}/lessons`)
        if (res.ok) {
          const data = await res.json()
          const list = data.sections
            .flatMap((s: { lessons: Record<string, unknown>[] }) => s.lessons)
          setLessons(list)
          // Mark all completed lessons from server data
          const done = new Set<string>()
          for (const l of list) {
            if (l.progress?.completed) done.add(String(l.id))
          }
          setCompletedLessons(done)
        }

        // Check course access
        const accessRes = await fetch('/api/subscription-course-access', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ courseId }),
        })
        if (accessRes.ok) {
          const a = await accessRes.json()
          const state = a.access?.[courseId]?.state
          setHasAccess(isPreview || state === 'owned' || state === 'included')
        }
      } catch (err) {
        console.error('[CoursePlayer] init error', err)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [course.slug, courseId, isPreview])

  const completedCount = completedLessons.size
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0
  const isCourseComplete = completedCount === totalLessons && totalLessons > 0

  const markLessonComplete = useCallback(
    async (lessonId: string) => {
      setCompletedLessons((prev) => {
        const next = new Set(prev)
        next.add(lessonId)
        return next
      })
      const result = await saveComplete()
      if (result?.gamification?.newlyEarned > 0) {
        // TODO: toast notification for achievements (Phase 1.1)
      }
    },
    [saveComplete],
  )

  // Video progress callback (debounced 10s save)
  const handleVideoProgress = useCallback(
    (seconds: number) => {
      lastPositionRef.current = seconds
      const now = Date.now()
      if (now - lastSavedRef.current >= 10000) {
        lastSavedRef.current = now
        savePosition(seconds)
      }
    },
    [savePosition],
  )

  // Video ended / 80% watched → mark complete
  const handleVideoEnded = useCallback(
    async () => {
      const lessonId = String(currentLesson.id)
      if (!completedLessons.has(lessonId)) {
        await markLessonComplete(lessonId)
      }
    },
    [currentLesson, completedLessons, markLessonComplete],
  )

  const nextLesson = () => {
    if (currentIndex < totalLessons - 1) {
      const nextId = String(lessons[currentIndex + 1].id)
      window.history.replaceState(null, '', `/courses/${String(course.slug)}/lessons/${nextId}`)
      setCurrentLessonId(nextId)
    }
  }

  const prevLesson = () => {
    if (currentIndex > 0) {
      const prevId = String(lessons[currentIndex - 1].id)
      window.history.replaceState(null, '', `/courses/${String(course.slug)}/lessons/${prevId}`)
      setCurrentLessonId(prevId)
    }
  }

  const canAccess = hasAccess || isPreview
  const lessonIsCompleted = completedLessons.has(String(currentLesson.id))

  const currentLessonDuration = Number(currentLesson.duration_minutes ?? 0)
  const currentLessonVideoUrl = String(currentLesson.video_url ?? '')
  const currentLessonVideoProvider = String(currentLesson.video_provider ?? 'external')
  const currentLessonContent = String(currentLesson.content ?? '')
  const currentLessonDescription = String(currentLesson.description ?? '')

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="text-center">
          <BookOpen className="w-12 h-12 mx-auto mb-4 text-[#1DB96B] animate-pulse" />
          <p className="text-sm text-[#737373]">Loading lesson…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111111]">
      {/* Header */}
      <header className="border-b border-[#E5E5E5] bg-[#FFFFFF]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href={`/courses/${String(course.slug)}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#1DB96B] hover:underline mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back to {String(course.title)}
          </Link>
          <h1 className="text-2xl font-extrabold leading-[1.08] tracking-normal sm:text-3xl mt-4">
            {String(currentLesson.title)}
          </h1>
          <div className="flex items-center gap-4 mt-3 text-sm text-[#737373]">
            {currentLessonDuration > 0 && <span>{currentLessonDuration} min</span>}
            <span>Lesson {currentIndex + 1} of {totalLessons}</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        {!canAccess ? (
          <div className="text-center py-20">
            <Lock className="w-12 h-12 mx-auto mb-4 text-[#737373]" />
            <h2 className="text-xl font-bold">Lesson Locked</h2>
            <p className="mt-2 text-[#737373]">
              {isPreview
                ? 'This lesson is a free preview. Enroll in the course to continue.'
                : 'You need to enroll in this course to view this lesson.'}
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href={`/courses/${String(course.slug)}`}
                className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-2 text-sm font-semibold transition-colors"
                style={{ minHeight: 44, borderRadius: 8, background: '#1DB96B', color: '#fff', border: '1px solid #1DB96B', padding: '0 18px' }}
              >
                Enroll in Course
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Video Player */}
            <section className="mb-8">
              <div className="rounded-xl border border-[#E5E5E5] overflow-hidden bg-[#EEF1EE]">
                <EnhancedVideoPlayer
                  videoUrl={currentLessonVideoUrl}
                  videoProvider={currentLessonVideoProvider}
                  title={String(currentLesson.title)}
                  lessonId={String(currentLesson.id)}
                  onProgress={handleVideoProgress}
                  onEnded={handleVideoEnded}
                  startAt={progress?.last_position_seconds ?? 0}
                />
              </div>
              {currentLessonContent && (
                <div className="mt-4 whitespace-pre-line text-[#2E3D37] leading-relaxed">
                  {currentLessonContent}
                </div>
              )}
            </section>

            {/* Lesson Progress */}
            <section className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-extrabold">Lesson Progress</h2>
                <span className="text-sm font-semibold text-[#1DB96B]">
                  {completedCount} / {totalLessons}
                </span>
              </div>
              <div className="w-full bg-[#E5E5E5] rounded-full h-4">
                <div
                  className="h-full bg-[#1DB96B] rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-[#737373] mt-1">
                <span>{progressPercent}% Complete</span>
                <span>{isCourseComplete ? 'Course Complete!' : 'Keep going!'}</span>
              </div>
            </section>

            {/* Quiz Toggle */}
            {quiz && (
              <section className="mb-8">
                <button
                  onClick={() => setShowQuiz(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-2 text-sm font-semibold transition-colors"
                  style={{ minHeight: 44, borderRadius: 8, background: '#F3FBF6', color: '#1DB96B', border: '1px solid #1DB96B', padding: '0 18px' }}
                >
                  <Star className="w-4 h-4" /> Take Quiz
                </button>
              </section>
            )}

            {/* Lesson Navigation */}
            <section className="mb-8">
              <div className="flex items-center justify-between">
                {isFirstLesson ? <div className="w-48" /> : (
                  <button onClick={prevLesson} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#1DB96B] hover:underline">
                    <ChevronLeft className="w-4 h-4" /> Previous Lesson
                  </button>
                )}
                {isLastLesson ? <div className="w-48" /> : (
                  <button onClick={nextLesson} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#1DB96B] hover:underline">
                    Next Lesson <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
              {isLastLesson && isCourseComplete && (
                <div className="mt-6 p-6 bg-[#F3FBF6] border border-[#C7EEDA] rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <Check className="w-8 h-8 text-[#1DB96B]" />
                    <span className="text-lg font-bold">Course Complete!</span>
                  </div>
                  <p className="text-[#737373]">
                    Congratulations! You've completed all lessons in <strong>{String(course.title)}</strong>.
                  </p>
                  <button
                    onClick={() => setShowCertificate(true)}
                    className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg px-6 py-2 text-sm font-semibold transition-colors"
                    style={{ minHeight: 44, borderRadius: 8, background: '#1DB96B', color: '#fff', border: '1px solid #1DB96B', padding: '0 18px' }}
                  >
                    View Certificate
                  </button>
                </div>
              )}
            </section>
          </>
        )}
      </main>

      {/* Certificate Modal */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowCertificate(false)} aria-hidden="true" />
          <div className="relative w-full max-w-2xl mx-auto rounded-2xl border border-[#E5E5E5] bg-[#FFFFFF] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Certificate of Completion</h2>
              <button onClick={() => setShowCertificate(false)} className="p-2 text-[#737373] hover:text-[#111111]" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="border border-[#E5E5E5] rounded-lg p-4 bg-[#F3FBF6]">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1DB96B] text-white">
                  <Star className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">{String(course.title)}</h3>
                  <p className="text-sm text-[#737373]">Certificate of Completion</p>
                </div>
              </div>
              <p className="text-sm text-[#737373]">
                This certifies that you have successfully completed all lessons in <strong>{String(course.title)}</strong>.
              </p>
              <div className="mt-6 flex gap-3">
                <button onClick={() => {}} className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-2 text-sm font-semibold transition-colors" style={{ minHeight: 44, borderRadius: 8, background: '#1DB96B', color: '#fff', border: '1px solid #1DB96B', padding: '0 18px' }}>
                  Download PDF
                </button>
                <button onClick={() => setShowCertificate(false)} className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-2 text-sm font-semibold transition-colors" style={{ minHeight: 44, borderRadius: 8, background: '#FFFFFF', color: '#111111', border: '1px solid #E5E5E5', padding: '0 18px' }}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quiz Modal */}
      {showQuiz && quiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowQuiz(false)} aria-hidden="true" />
          <div className="relative w-full max-w-2xl mx-auto rounded-2xl border border-[#E5E5E5] bg-[#FFFFFF] p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">{quiz.title ?? 'Quiz'}</h2>
              <button onClick={() => setShowQuiz(false)} className="p-2 text-[#737373] hover:text-[#111111]" aria-label="Close quiz">
                <X className="w-5 h-5" />
              </button>
            </div>
            <QuizAttempt
              lessonId={String(currentLesson.id)}
              questions={quiz.questions}
              passingScore={quiz.passing_score}
              timeLimitMinutes={quiz.time_limit_minutes}
              onSubmit={submitQuiz}
              onComplete={(result) => {
                if (result?.passed) {
                  setCompletedLessons((prev) => {
                    const next = new Set(prev)
                    next.add(String(currentLesson.id))
                    return next
                  })
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
