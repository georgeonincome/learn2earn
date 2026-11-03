'use client'

/**
 * Admin Training-Session Enrollments — "The Room — Enrollments" (reference
 * `training_session_enrollments`) with CSV export.
 */

import { useEffect, useState } from 'react'

type Enrollment = {
  id: string; student_name: string; student_email: string; phone?: string
  payment_reference?: string; amount: number; currency: string
  status: string; enrolled_at: string
}

export default function AdminTrainingSessionEnrollmentsPage() {
  const [rows, setRows] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetch('/api/admin/training-session-enrollments')
      .then((r) => r.ok ? r.json() : [])
      .then((data: any) => { if (!cancelled) setRows(data ?? []) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const exportCsv = () => {
    window.location.href = '/api/admin/training-session-enrollments?export=csv'
  }

  if (loading) return <div className="text-center py-20 text-[#737373]">Loading…</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">The Room — Enrollments</h1>
          <p className="text-[#737373] text-sm mt-1">Live-class training session enrollments.</p>
        </div>
        <button onClick={exportCsv} className="inline-flex items-center gap-2 rounded-lg border border-[#E5E5E5] px-4 py-2 text-sm font-bold text-[#737373] hover:bg-[#F3FBF6]">
          ↓ Export CSV
        </button>
      </div>

      <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#E5E5E5] bg-[#F9F9F9]">
              <th className="px-4 py-3 font-semibold text-[#737373]">Name</th>
              <th className="px-4 py-3 font-semibold text-[#737373]">Email</th>
              <th className="px-4 py-3 font-semibold text-[#737373] text-right">Amount</th>
              <th className="px-4 py-3 font-semibold text-[#737373] text-center">Status</th>
              <th className="px-4 py-3 font-semibold text-[#737373] text-right">Date</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-12 text-center text-[#737373]">No enrollments yet.</td></tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="border-b border-[#E5E5E5]">
                  <td className="px-4 py-3">{r.student_name}</td>
                  <td className="px-4 py-3 text-[#737373]">{r.student_email}</td>
                  <td className="px-4 py-3 text-right text-[#737373]">
                    ZMW {(r.amount * 0.155).toFixed(0)}
                  </td>
                  <td className="px-4 py-3 text-center text-[#737373]">{r.status}</td>
                  <td className="px-4 py-3 text-right text-[#737373]">
                    {r.enrolled_at ? new Date(Number(r.enrolled_at) * 1000).toLocaleDateString('en-GB') : '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
