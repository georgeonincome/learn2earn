'use client'

/**
 * Admin Meta Events — reference admin meta-events page.
 * Lists Meta Pixel / conversion tracking events for attribution debugging.
 */

import { useEffect, useState } from 'react'

type MetaEvent = { event_name: string; event_id: string; course_id?: string; student_email?: string; tracked: number; created_at: string }

export default function AdminMetaEventsPage() {
  const [events, setEvents] = useState<MetaEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetch('/api/admin/meta-events')
      .then((r) => r.ok ? r.json() : [])
      .then((data: any) => { if (!cancelled) setEvents(data ?? []) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  if (loading) return <div className="text-center py-20 text-[#737373]">Loading…</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Meta events</h1>
          <p className="text-[#737373] text-sm mt-1">Meta Pixel conversion tracking events for ads attribution debugging.</p>
        </div>
      </div>

      <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#E5E5E5] bg-[#F9F9F9]">
              <th className="px-4 py-3 font-semibold text-[#737373]">Event</th>
              <th className="px-4 py-3 font-semibold text-[#737373] text-center">Event ID</th>
              <th className="px-4 py-3 font-semibold text-[#737373]">Course</th>
              <th className="px-4 py-3 font-semibold text-[#737373]">Student</th>
              <th className="px-4 py-3 font-semibold text-[#737373] text-center">Tracked</th>
              <th className="px-4 py-3 font-semibold text-[#737373] text-right">Time</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-[#737373]">No meta events logged yet.</td></tr>
            ) : (
              events.map((e) => (
                <tr key={e.event_id} className="border-b border-[#E5E5E5]">
                  <td className="px-4 py-3 font-mono text-xs">{e.event_name}</td>
                  <td className="px-4 py-3 text-center text-[#737373] font-mono text-xs">{e.event_id}</td>
                  <td className="px-4 py-3 text-[#737373]">{e.course_id ?? '—'}</td>
                  <td className="px-4 py-3 text-[#737373]">{e.student_email ?? '—'}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${e.tracked === 1 ? 'bg-[#F3FBF6] text-[#0B854C]' : 'bg-[#FEE2E2] text-[#DC2626]'}`}>
                      {e.tracked === 1 ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-[#737373] text-xs">{e.created_at}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
