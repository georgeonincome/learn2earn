'use client'

/**
 * Dashboard Reading Lab — reference reading lab UI.
 * Commitment-based guided reading: daily reading, reflections, habits, weekly
 * check-ins, community chat, certificate on completion.
 */

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BookOpen, Check, Clock, RefreshCw, MessageCircle, ChevronRight } from 'lucide-react'

type LabDay = { id: string; day_number: number; title: string; reading_assignment: string; thinking_prompts: string }
type Habit = { id: string; title: string; description: string; active: number }

export default function ReadingLabPage() {
  const [lab, setLab] = useState<any>(null)
  const [days, setDays] = useState<LabDay[]>([])
  const [habits, setHabits] = useState<Habit[]>([])
  const [enrollment, setEnrollment] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    Promise.all([
      fetch('/api/reading-lab').then((r) => r.ok ? r.json() : null),
      fetch('/api/reading-lab?action=enrollment').then((r) => r.ok ? r.json() : null),
    ]).then(([labData, enrolData]: any) => {
      if (cancelled) return
      setLab(labData)
      setEnrollment(enrolData)
      if (labData) fetch(`/api/reading-lab?action=days&labId=${labData.id}`).then((r) => r.ok ? r.json() : []).then((d: any) => { if (!cancelled) setDays(d ?? []) })
      if (enrolData) {
        fetch('/api/reading-lab?action=habits').then((r) => r.ok ? r.json() : []).then((h: any) => { if (!cancelled) setHabits(h ?? []) })
      }
      setLoading(false)
    }).catch(() => setLoading(false))
    return () => { cancelled = true }
  }, [])

  if (loading) return <div className="text-center py-20 text-[#737373]">Loading reading lab…</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">{lab?.title ?? 'Reading Lab'}</h1>
          <p className="text-[#737373] text-sm mt-1">{lab?.description ?? 'A commitment-based reading experience.'}</p>
        </div>
      </div>

      {!enrollment && (
        <div className="rounded-xl border border-[#E5E5E5] bg-[#F3FBF6] p-6">
          <h2 className="font-bold text-lg mb-3">Join the reading lab</h2>
          <p className="text-[#737373] text-sm mb-4">Read daily, reflect, apply — and earn your certificate of consistent learning.</p>
          <button className="rounded-lg bg-[#1DB96B] px-6 py-3 text-sm font-bold text-white hover:bg-[#17A05D]" onClick={() => {
            const nick = window.confirm('Enter a nickname for the lab (or cancel to use your email).') ? window.prompt('Nickname:') : null
            if (nick !== null) {
              fetch('/api/reading-lab', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'enroll', nickname: nick || '' }),
              }).then(() => location.reload())
            }
          }}>
            Join the lab
          </button>
        </div>
      )}

      {enrollment && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
            <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-4">
              <div className="text-xs font-semibold text-[#737373]">Current day</div>
              <div className="text-2xl font-extrabold">{enrollment.current_day}</div>
            </div>
            <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-4">
              <div className="text-xs font-semibold text-[#737373]">Status</div>
              <div className="text-xs font-bold text-[#1DB96B]">{enrollment.status}</div>
            </div>
          </div>

          <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-6">
            <h2 className="font-bold text-lg mb-4">Daily readings</h2>
            <div className="space-y-3">
              {days.map((d) => (
                <div key={d.id} className="border border-[#E5E5E5] rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">{d.title}</span>
                    <span className="text-xs font-bold text-[#1DB96B]">Day {d.day_number}</span>
                  </div>
                  <p className="text-sm text-[#737373] mb-3">{d.reading_assignment}</p>
                  <button className="flex items-center gap-2 rounded-md border border-[#E5E5E5] px-3 py-2 text-sm text-[#1DB96B] hover:bg-[#F3FBF6]">
                    Open reading <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-6">
            <h2 className="font-bold text-lg mb-4">Habits</h2>
            <p className="text-[#737373] text-sm mb-4">Track the habits that make consistency stick.</p>
            <div className="space-y-2">
              {habits.map((h) => (
                <div key={h.id} className="flex items-center justify-between px-3 py-2 border-b border-[#E5E5E5] last:border-0">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked={h.active === 1} className="rounded border-[#E5E5E5] text-[#1DB96B] focus:ring-[#1DB96B]" />
                    <span className="text-sm">{h.title}</span>
                  </label>
                  <span className="text-xs text-[#737373]">{h.description}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
