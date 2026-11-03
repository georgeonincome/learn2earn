'use client'

/**
 * Admin Enrollments — DB-backed enrollment list + manual grant
 * (reference `/admin/enrollments` access-fix flow).
 */

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronRight, CreditCard, Play } from 'lucide-react'

type Enrollment = {
  id: string; student_id: string; course_id: string; full_name: string
  email: string; payment_status: string; enrollment_source: string
  amount_paid: number; enrolled_at: string
}

export default function AdminEnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [newStudentId, setNewStudentId] = useState('')
  const [newCourseId, setNewCourseId] = useState('')

  useEffect(() => {
    let cancelled = false
    fetch('/api/admin/enrollments')
      .then((r) => r.ok ? r.json() : [])
      .then((data: any) => { if (!cancelled) setEnrollments(data ?? []) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const grant = async () => {
    await fetch('/api/admin/enrollments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId: newStudentId, courseId: newCourseId }),
    })
    setNewStudentId('')
    setNewCourseId('')
    location.reload()
  }

  if (loading) return <div className="text-center py-20 text-[#737373]">Loading enrollments…</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Enrollments</h1>
          <p className="text-[#737373] text-sm mt-1">Manage course enrollments and grant access manually.</p>
        </div>
      </div>

      {/* Manual grant */}
      <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-6 space-y-4">
        <h2 className="font-bold text-lg">Manual enrollment</h2>
        <p className="text-[#737373] text-sm">Give a student access to a course directly (reference access-fix flow).</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#737373]">Student ID</label>
            <input
              className="w-full rounded-md border border-[#E5E5E5] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1DB96B]"
              value={newStudentId} onChange={(e) => setNewStudentId(e.target.value)}
              placeholder="e.g. 59fb9c08-…"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#737373]">Course ID</label>
            <input
              className="w-full rounded-md border border-[#E5E5E5] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1DB96B]"
              value={newCourseId} onChange={(e) => setNewCourseId(e.target.value)}
              placeholder="e.g. cutpro-video-editing-capcut"
            />
          </div>
          <div className="space-y-2">
            <button onClick={grant} className="w-full rounded-lg bg-[#1DB96B] px-4 py-2 text-sm font-bold text-white hover:bg-[#17A05D]">Grant access</button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#E5E5E5] bg-[#F9F9F9]">
              <th className="px-4 py-3 font-semibold text-[#737373]">Student</th>
              <th className="px-4 py-3 font-semibold text-[#737373]">Course</th>
              <th className="px-4 py-3 font-semibold text-[#737373]">Status</th>
              <th className="px-4 py-3 font-semibold text-[#737373] text-right">Source</th>
              <th className="px-4 py-3 font-semibold text-[#737373] text-right">Joined</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-12 text-center text-[#737373]">No enrollments yet.</td></tr>
            ) : (
              enrollments.map((e) => (
                <tr key={e.id} className="border-b border-[#E5E5E5]">
                  <td className="px-4 py-3">{e.full_name}</td>
                  <td className="px-4 py-3 text-[#737373]">{e.course_id}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      e.payment_status === 'paid' ? 'bg-[#F3FBF6] text-[#0B854C]' : 'bg-[#F5F5F5] text-[#737373]'
                    }`}>{e.payment_status}</span>
                  </td>
                  <td className="px-4 py-3 text-right text-[#737373]">{e.enrollment_source}</td>
                  <td className="px-4 py-3 text-right text-[#737373]">
                    {e.enrolled_at ? new Date(Number(e.enrolled_at) * 1000).toLocaleDateString('en-GB') : '—'}
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
