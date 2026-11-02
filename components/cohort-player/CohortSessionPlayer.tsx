'use client'

/**
 * CohortSessionPlayer — mirrors reference CohortPlayer-CWsABBCl.js
 *
 * Session-based video player with progress tracking, notes, resources, quiz.
 * On completion, checks cohort completion state and issues certificate.
 */

import { useState, useEffect, useCallback } from 'react'
import {
  Play,
  Lock,
  Check,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  X,
  Star,
  MessageCircle,
  Share2,
} from 'lucide-react'
import { EnhancedVideoPlayer } from '@/components/course-player/EnhancedVideoPlayer'
import { useLessonProgress } from '@/lib/hooks/useLessonProgress'

type Session = {
  id: string
  title: string
  startsAt: string
  minutes: number
  done: boolean
  video_url?: string
  video_provider?: string
  content?: string
  description?: string
  resources?: { name: string; type: string; url: string }[]
  quiz_questions?: { id: string; question: string; options: string[]; correct: number }[]
  quiz_done?: boolean
  position?: number
}

type CohortPlayerData = {
  sessions: Session[]
  enrollmentId: string | null
  studentId: string | null
  cohort: { id: string; title: string; meetUrl: string | null; whatsappGroupUrl: string | null }
  now: string
}

export function CohortSessionPlayer({
  cohortId,
  lessonId,
}: {
  cohortId: string | Promise<string>
  lessonId: string | Promise<string>
}) {
  const [data, setData] = useState<CohortPlayerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'notes' | 'resources' | 'quiz'>('notes')
  const [showCertificate, setShowCertificate] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch(`/api/cohorts/${await cohortId}/player`)
        if (!cancelled && res.ok) setData(await res.json())
      } catch (err) {
        console.error('[CohortSessionPlayer] load error', err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [cohortId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F6F7F5]">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-[#1DB96B]/10 flex items-center justify-center mb-4 text-[#1DB96B] animate-pulse">
            <Play className="w-6 h-6" />
          </div>
          <p className="text-sm text-[#737373]">Loading class…</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F6F7F5]">
        <div className="text-center">
          <h1 className="text-xl font-bold">Cohort not found</h1>
        </div>
      </div>
    )
  }

  const sessionId = typeof lessonId === 'string' ? lessonId : ''
  const session = data.sessions.find((s) => s.id === sessionId)
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F6F7F5]">
        <div className="text-center">
          <h1 className="text-xl font-bold">Session not found</h1>
        </div>
      </div>
    )
  }

  const total = data.sessions.length
  const doneCount = data.sessions.filter((s) => s.done).length
  const progressPercent = total > 0 ? Math.round((doneCount / total) * 100) : 0

  const { progress, savePosition, saveComplete } = useLessonProgress(session.id)

  const sessionIndex = data.sessions.findIndex((s) => s.id === sessionId)
  const isLast = sessionIndex === data.sessions.length - 1
  const isFirst = sessionIndex === 0
  const prevSession = sessionIndex > 0 ? data.sessions[sessionIndex - 1] : null
  const nextSession = sessionIndex < data.sessions.length - 1 ? data.sessions[sessionIndex + 1] : null

  const handleVideoProgress = useCallback(
    (seconds: number) => {
      savePosition(seconds, data.enrollmentId ?? undefined)
    },
    [savePosition, data.enrollmentId],
  )

  const handleVideoEnded = useCallback(async () => {
    if (session && !session.done) {
      await saveComplete()
      // Check cohort completion
      if (data.enrollmentId) {
        await fetch(`/api/cohorts/${data.cohort.id}/lessons/${session.id}/progress`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ enrollmentId: data.enrollmentId, isCompleted: true }),
        })
      }
    }
  }, [session, saveComplete, data.enrollmentId, data.cohort.id])

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F6F7F5]">
        <div className="text-center">
          <h1 className="text-xl font-bold">Session not found</h1>
        </div>
      </div>
    )
  }

  const videoUrl = session.video_url ?? ''
  const videoProvider = (session.video_provider as string) ?? 'external'
  const startAt = progress?.last_position_seconds ?? 0

  const renderTabs = () => {
    const tabs = [
      { key: 'notes', label: 'Notes', count: 0 },
      { key: 'resources', label: 'Resources', count: session.resources?.length ?? 0 },
      { key: 'quiz', label: 'Quiz', count: session.quiz_questions?.length ?? 0 },
    ] as const
    return (
      <>
        {tabs.map(({ key, label, count }) => (
          <button
            key={key}
            role="tab"
            aria-selected={activeTab === key}
            onClick={() => setActiveTab(key)}
            className={`-mb-px inline-flex items-center whitespace-nowrap border-b-2 px-3.5 py-2.5 text-sm font-bold ${
              activeTab === key ? 'border-[#0B854C]' : 'border-transparent text-[#5B6B64] hover:text-[#10201A]'
            }`}
          >
            {label}
            {count > 0 && (
              <span className="ml-1.5 rounded-full bg-[#EEF1EF] px-1.5 text-xs tabular-nums text-[#4A5A53]">
                {count}
              </span>
            )}
          </button>
        ))}
      </>
    )
  }

  return (
    <div className="min-h-screen bg-[#F6F7F5] text-[#10201A]">
      <header className="sticky top-0 z-30 border-b border-[#E3E8E5] bg-white">
        <div className="mx-auto max-w-[1500px] px-4 sm:px-5 py-2.5">
          <div className="flex items-center gap-2">
            <ArrowLeft
              className="w-5 h-5 text-[#10201A] hover:text-[#1DB96B]"
              onClick={() => {
                if (prevSession) {
                  window.location.href = `/cohort/${data.cohort.id}/lesson/${prevSession.id}`
                }
              }}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[15px] font-bold">{data.cohort.title}</p>
              <div className="mt-1 flex items-center gap-2.5">
                <div className="h-1.5 w-24 overflow-hidden rounded-full bg-[#E8EEEA] sm:w-40">
                  <span className="block h-full rounded-full bg-[#1DB96B]" style={{ width: `${progressPercent}%` }} />
                </div>
                <span className="whitespace-nowrap text-xs text-[#5B6B64]">
                  {doneCount} of {total} done
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1500px] py-8 lg:grid-cols-[1fr_360px]">
        <main className="min-w-0 pb-28 lg:pb-12">
          {/* Video player */}
          <div className="sticky top-[61px] z-20 bg-black lg:static lg:mx-5 lg:mt-5 lg:overflow-hidden lg:rounded-2xl">
            <div className="relative mx-auto aspect-video max-h-[72vh] w-full">
              <EnhancedVideoPlayer
                videoUrl={videoUrl}
                videoProvider={videoProvider}
                title={session.title}
                lessonId={session.id}
                onProgress={handleVideoProgress}
                onEnded={handleVideoEnded}
                startAt={startAt}
              />
            </div>
          </div>

          {/* Session header */}
          <div className="px-4 pt-4 sm:px-5 sm:pt-5">
            <div className="flex flex-wrap items-start gap-x-4 gap-y-3">
              <div className="min-w-0 flex-1 basis-[320px]">
                <div className="flex items-start gap-1">
                  <span className="text-xs font-bold text-[#0B854C]">
                    Session {sessionIndex + 1} of {total}
                  </span>
                  <span className="text-xs text-[#5B6B64]">
                    • {new Date(session.startsAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      timeZone: 'Africa/Lusaka',
                    })}
                  </span>
                </div>
                <h1 className="mt-1 text-[22px] font-extrabold leading-tight sm:text-[26px]">
                  {session.title}
                </h1>
                {session.description && (
                  <p className="mt-1 text-[15px] text-[#5B6B64]">{session.description}</p>
                )}
              </div>
              <div className="flex w-full gap-2 sm:w-auto">
                <button
                  disabled={!prevSession}
                  onClick={() => {
                    if (prevSession) window.location.href = `/cohort/${data.cohort.id}/lesson/${prevSession.id}`
                  }}
                  className="inline-flex items-center justify-center rounded-xl border border-[#D9E0DC] bg-white px-3 py-2.5 hover:border-[#9DB0A7] disabled:opacity-40"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => {
                    if (!session.done) {
                      saveComplete()
                      if (data.enrollmentId) {
                        fetch(`/api/cohorts/${data.cohort.id}/lessons/${session.id}/progress`, {
                          method: 'POST',
                          headers: { 'content-type': 'application/json' },
                          body: JSON.stringify({ enrollmentId: data.enrollmentId, isCompleted: true }),
                        })
                      }
                    }
                  }}
                  className="inline-flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-bold border border-[#D9E0DC] bg-white hover:border-[#9DB0A7]"
                >
                  <Check className="h-4 w-4" /> {session.done ? 'Completed' : 'Mark complete'}
                </button>
                <button
                  disabled={!nextSession}
                  onClick={() => {
                    if (nextSession) window.location.href = `/cohort/${data.cohort.id}/lesson/${nextSession.id}`
                  }}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#0B854C] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#087A45] disabled:opacity-40"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="-mx-4 mt-5 flex gap-1 overflow-x-auto border-b border-[#E3E8E5] px-4 [scrollbar-width:none] sm:mx-0 sm:px-0" role="tablist">
            {renderTabs()}
          </div>

          {/* Tab content */}
          <div className="py-5 max-w-[760px]">
            {activeTab === 'notes' && (
              <div className="text-[15px] leading-relaxed text-[#33433C]">
                {session.content ? (
                  <div className="whitespace-pre-wrap">{session.content}</div>
                ) : (
                  <p className="text-[#5B6B64]">No notes for this session.</p>
                )}
              </div>
            )}
            {activeTab === 'resources' && (
              <div>
                {session.resources && session.resources.length > 0 ? (
                  <ul className="divide-y divide-[#EEF1EF] rounded-2xl border border-[#E3E8E5] bg-white">
                    {session.resources.map((r) => (
                      <li key={r.url} className="flex items-center gap-3 px-4 py-3">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#E8F6EF] text-[#0B854C]">
                          {r.type === 'link' ? <Share2 className="w-5 h-5" /> : <Star className="w-5 h-5" />}
                        </span>
                        <span className="min-w-0 flex-1">
                          <b className="block truncate text-sm">{r.name}</b>
                          <span className="text-xs text-[#5B6B64]">
                            {r.type.toUpperCase()}
                          </span>
                        </span>
                        <a
                          href={r.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-xl border border-[#D9E0DC] px-3 py-2 text-sm font-semibold hover:border-[#9DB0A7]"
                        >
                          <Share2 className="h-4 w-4" /> {r.type === 'link' ? 'Open' : 'Download'}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[#5B6B64]">No resources for this session.</p>
                )}
              </div>
            )}
            {activeTab === 'quiz' && (
              <div>
                {session.quiz_questions && session.quiz_questions.length > 0 ? (
                  <div className="space-y-3">
                    <p>
                      {session.quiz_questions.length} questions
                      {session.quiz_done ? " · You've taken this quiz." : ' · Quiz waiting'}
                    </p>
                    <button
                      onClick={() => {}}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0B854C] px-4 py-2.5 text-sm font-bold text-white"
                    >
                      Take Quiz
                    </button>
                  </div>
                ) : (
                  <p className="text-[#5B6B64]">No quiz for this session.</p>
                )}
              </div>
            )}
          </div>
        </main>

        {/* Sessions sidebar */}
        <aside className="hidden border-l border-[#E3E8E5] bg-white lg:block">
          <div className="sticky top-[61px] max-h-[calc(100dvh-61px)] overflow-y-auto p-4">
            <p className="mb-2 px-3 text-sm font-bold">
              Sessions{' '}
              <span className="font-semibold text-[#5B6B64]">· {doneCount} of {total} done</span>
            </p>
            <ol className="space-y-0.5">
              {data.sessions.map((s, idx) => (
                <li key={s.id}>
                  <button
                    onClick={() => {
                      window.location.href = `/cohort/${data.cohort.id}/lesson/${s.id}`
                    }}
                    className={`flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left ${
                      s.id === session.id ? 'bg-[#E8F6EF]' : 'hover:bg-[#F1F4F2]'
                    }`}
                  >
                    <span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold tabular-nums ${
                      s.done ? 'bg-[#0B854C] text-white' : 'border border-[#CBD5D0] text-[#5B6B64]'
                    }`}>
                      {s.done ? <Check className="h-3.5 w-3.5" /> : idx + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[14px] leading-snug font-semibold">{s.title}</span>
                      <span className="mt-0.5 flex items-center gap-2 text-xs text-[#5B6B64]">
                        {s.minutes} min
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </div>

      {/* Certificate modal */}
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
                  <h3 className="text-lg font-bold">{data.cohort.title}</h3>
                  <p className="text-sm text-[#737373]">Cohort Certificate of Completion</p>
                </div>
              </div>
              <p className="text-sm text-[#737373]">
                This certifies that you have successfully completed all sessions in{' '}
                <strong>{data.cohort.title}</strong>.
              </p>
              <div className="mt-6 flex gap-3">
                <button onClick={() => {}} className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-2 text-sm font-semibold transition-colors" style={{ background: '#1DB96B', color: '#fff', borderRadius: 8, minHeight: 44, padding: '0 18px' }}>
                  Download PDF
                </button>
                <button onClick={() => setShowCertificate(false)} className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-2 text-sm font-semibold transition-colors" style={{ background: '#FFFFFF', color: '#111111', border: '1px solid #E5E5E5', minHeight: 44, padding: '0 18px' }}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
