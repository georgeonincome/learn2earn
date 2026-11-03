'use client'

/**
 * Dashboard AM Challenge — reference 5AM challenge UI.
 * Enroll, check in daily, track streak, take quizzes, earn certificate.
 */

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Play, Clock, ChevronRight, RefreshCw, Award } from 'lucide-react'

export default function AMChallengePage() {
  const [challenge, setChallenge] = useState<any>(null)
  const [days, setDays] = useState<any[]>([])
  const [enrollment, setEnrollment] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetch('/api/am-challenge?section=days')
      .then((r) => r.ok ? r.json() : null)
      .then((d: any) => {
        if (cancelled) return
        setChallenge(d?.challenge)
        setDays(d?.days ?? [])
        if (d?.challenge) {
          fetch('/api/am-challenge').then((r) => r.ok ? r.json() : null).then((e: any) => { if (!cancelled) setEnrollment(e) })
        }
        setLoading(false)
      }).catch(() => setLoading(false))
    return () => { cancelled = true }
  }, [])

  if (loading) return <div className="text-center py-20 text-[#737373]">Loading challenge…</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">{challenge?.title ?? '5AM Challenge'}</h1>
          <p className="text-[#737373] text-sm mt-1">{challenge?.subtitle ?? 'Wake up at 5AM, watch the lesson, check in, and build the streak.'}</p>
        </div>
      </div>

      {!enrollment && (
        <div className="rounded-xl border border-[#E5E5E5] bg-[#F3FBF6] p-6">
          <h2 className="font-bold text-lg mb-3">Join the 5AM Challenge</h2>
          <p className="text-[#737373] text-sm mb-4">{challenge?.description ?? 'A 21-day commitment challenge. Every morning 05:00–09:00 you open the lesson, take the quick quiz, and check in.'}</p>
          <div className="flex gap-3">
            <button className="rounded-lg bg-[#1DB96B] px-6 py-3 text-sm font-bold text-white hover:bg-[#17A05D]" onClick={() => {
              fetch('/api/am-challenge', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'enroll' }) }).then(() => location.reload())
            }}>
              Join challenge
            </button>
            <Link href="/courses" className="rounded-lg border border-[#E5E5E5] px-6 py-3 text-sm font-bold text-[#737373] hover:bg-[#F3FBF6]">Browse courses</Link>
          </div>
        </div>
      )}

      {enrollment && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-4">
              <div className="text-xs font-semibold text-[#737373]">Streak</div>
              <div className="text-3xl font-extrabold text-[#0B854C]">{enrollment.current_streak} days</div>
            </div>
            <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-4">
              <div className="text-xs font-semibold text-[#737373]">Days completed</div>
              <div className="text-3xl font-extrabold">{enrollment.days_completed} / 21</div>
            </div>
            <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-4">
              <div className="text-xs font-semibold text-[#737373]">Best streak</div>
              <div className="text-3xl font-extrabold">{enrollment.best_streak} days</div>
            </div>
          </div>

          <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-6">
            <h2 className="font-bold text-lg mb-4">Daily check-in</h2>
            <p className="text-[#737373] text-sm mb-4">Check in each morning after watching the lesson. Miss two days in a row and you're out.</p>
            <div className="space-y-3">
              {days.slice(0, 7).map((d) => (
                <div key={d.id} className="flex items-center justify-between px-4 py-3 border-b border-[#E5E5E5] last:border-0">
                  <div>
                    <div className="font-semibold">{d.title}</div>
                    <div className="text-xs text-[#737373]">{d.duration_minutes} min · {d.day_number}</div>
                  </div>
                  <button
                    onClick={() => {
                      fetch('/api/am-challenge', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'checkin', dayNumber: d.day_number }),
                      }).then(() => location.reload())
                    }}
                    className="rounded-md border border-[#E5E5E5] px-3 py-1.5 text-xs font-bold text-[#0B854C] hover:bg-[#F3FBF6]"
                  >
                    Check in
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
