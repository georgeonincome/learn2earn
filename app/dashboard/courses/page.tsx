'use client'

/**
 * Dashboard /courses — reference "My courses" + "Browse courses" tabs.
 * Enrolled courses with progress/state chips; public catalog for browsing
 * with Free/Paid filter, newest/price sorts and topic filters.
 */

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronRight, Play, Lock, RefreshCw, CreditCard, Check } from 'lucide-react'

type Course = {
  id: string; slug: string; title: string; description?: string
  status: string; enrolledAt?: string; progress: number
  inPlan: boolean; owned: boolean; price: number
}

export default function DashboardCoursesPage() {
  const [tab, setTab] = useState<'mine' | 'browse'>('mine')
  const [courses, setCourses] = useState<Course[]>([])
  const [planActive, setPlanActive] = useState(false)
  const [planEnded, setPlanEnded] = useState(false)
  const [planName, setPlanName] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetch('/api/dashboard/courses?tab=mine')
      .then((r) => r.json())
      .then((data: any) => {
        if (cancelled) return
        setCourses(data.courses ?? [])
        setPlanActive(Boolean(data.planActive))
        setPlanEnded(Boolean(data.planEnded))
        setPlanName(data.planName ?? null)
        setLoading(false)
      })
      .catch(() => setLoading(false))
    return () => { cancelled = true }
  }, [])

  const inProgress = courses.filter((c) => c.progress > 0).length
  const finished = courses.filter((c) => c.progress >= 100).length
  const header = tab === 'mine'
    ? { title: 'My courses', sub: courses.length + ' courses. ' + inProgress + ' in progress, ' + finished + ' finished.' }
    : { title: 'Browse courses', sub: 'All self-paced courses, with a certificate when you finish.' }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#10201A]">
      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-3 flex gap-1">
          <button
            key="mine"
            onClick={() => setTab('mine')}
            className={`px-4 py-2 text-sm font-medium rounded-t-xl transition ${tab === 'mine' ? 'bg-[#1DB96B] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            My courses
          </button>
          <button
            key="browse"
            onClick={() => setTab('browse')}
            className={`px-4 py-2 text-sm font-medium rounded-t-xl transition ${tab === 'browse' ? 'bg-[#1DB96B] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Browse courses
          </button>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">{header.title}</h1>
          <p className="text-gray-600">{header.sub}</p>
        </div>

        {tab === 'mine' && (
          <>
            {planEnded && (
              <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 flex items-center gap-3">
                <Lock className="h-5 w-5 text-amber-600" />
                <div>
                  <p className="text-sm font-semibold text-amber-800">Your plan has ended</p>
                  <p className="text-xs text-amber-700">Courses from your plan are locked until you renew. Your progress and certificates are safe.</p>
                </div>
                <Link href="/dashboard/plan" className="ml-auto inline-flex items-center gap-1 rounded-md bg-amber-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-700">
                  Renew plan <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            )}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {courses.length === 0 ? (
                <div className="col-span-3 rounded-xl border border-gray-200 bg-white p-8 text-center">
                  <p className="text-gray-400">You have not started a course yet.</p>
                  <Link href="/courses" className="mt-4 text-[#1DB96B] font-semibold hover:underline">Browse all courses →</Link>
                </div>
              ) : (
                courses.map((c) => (
                  <div key={c.id} className="rounded-xl border border-gray-200 bg-white p-4 flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Play className="h-5 w-5 shrink-0 text-[#1DB96B]" />
                        <h2 className="font-semibold">{c.title}</h2>
                      </div>
                      {c.progress >= 100 ? (
                        <span className="rounded-md bg-[#1DB96B]/10 px-2 py-0.5 text-xs font-bold text-[#1DB96B]">Finished</span>
                      ) : c.progress > 0 ? (
                        <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-600">{Math.round(c.progress)}% done</span>
                      ) : (
                        <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-600">Not started</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{c.description ?? ''}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <Link
                        href={c.owned || c.inPlan ? `/courses/${c.slug}` : '/dashboard/plan'}
                        className="inline-flex items-center gap-1 rounded-md bg-[#1DB96B] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#17A05D]"
                      >
                        {c.status === 'paid' ? 'Continue' : 'Start'} <ChevronRight className="h-3 w-3" />
                      </Link>
                      {(!c.owned && !c.inPlan && !planActive) && (
                        <Link href="/dashboard/plan" className="text-xs text-[#1DB96B] hover:underline">Subscribe to open</Link>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {tab === 'browse' && (
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-700">
                <CreditCard className="h-3.5 w-3.5" /> {planActive ? 'Plan active — everything unlocked' : 'Buy a course or get the plan'}
              </span>
              {planName && <span className="text-xs text-gray-500">{planName}</span>}
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {courses.length === 0 ? (
                <p className="col-span-3 text-gray-400 text-center py-8">No courses available right now.</p>
              ) : (
                courses.map((c) => (
                  <div key={c.id} className="rounded-xl border border-gray-200 bg-white p-4 flex flex-col gap-3">
                    <h2 className="font-semibold">{c.title}</h2>
                    <p className="text-xs text-gray-500">{c.description ?? ''}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <span className="text-xs font-bold">
                        {c.inPlan ? 'Included in plan' : c.owned ? 'Owned' : `ZMW ${c.price}`}
                      </span>
                      <Link
                        href={c.inPlan || c.owned ? `/courses/${c.slug}` : `/checkout?course=${c.slug}`}
                        className="inline-flex items-center gap-1 rounded-md bg-[#1DB96B] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#17A05D]"
                      >
                        {c.inPlan || c.owned ? 'Open' : 'Enroll'} <ChevronRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
