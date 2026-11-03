'use client'

/**
 * Dashboard Assignments — reference assignments UI.
 * List assignments for your courses, submit work.
 */

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FileText, Clock, ChevronRight } from 'lucide-react'

type Assignment = { id: string; course_id: string; title: string; description?: string; due_date?: string; weight: number; is_active: number }

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetch('/api/assignments')
      .then((r) => r.ok ? r.json() : [])
      .then((data: any) => { if (!cancelled) setAssignments(data ?? []) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  if (loading) return <div className="text-center py-20 text-[#737373]">Loading…</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Assignments</h1>
          <p className="text-[#737373] text-sm mt-1">Submit your coursework and track your assignments.</p>
        </div>
      </div>

      <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#E5E5E5] bg-[#F9F9F9]">
              <th className="px-4 py-3 font-semibold text-[#737373]">Title</th>
              <th className="px-4 py-3 font-semibold text-[#737373] text-right">Due</th>
              <th className="px-4 py-3 font-semibold text-[#737373] text-center">Weight</th>
              <th className="px-4 py-3 font-semibold text-[#737373] text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {assignments.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-12 text-center text-[#737373]">No assignments yet.</td></tr>
            ) : (
              assignments.map((a) => (
                <tr key={a.id} className="border-b border-[#E5E5E5]">
                  <td className="px-4 py-3">{a.title}</td>
                  <td className="px-4 py-3 text-right text-[#737373]">{a.due_date ? new Date(a.due_date).toLocaleDateString('en-GB') : '—'}</td>
                  <td className="px-4 py-3 text-center text-[#737373]">{a.weight}%</td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/courses/${a.course_id}`} className="text-xs text-[#1DB96B] hover:underline">Go to course <ChevronRight className="w-3 h-3" /></Link>
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
