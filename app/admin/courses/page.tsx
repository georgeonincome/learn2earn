'use client'

/**
 * Admin Courses — DB-backed course studio list (reference `admin_courses_overview`).
 * Publish / unpublish / archive / restore per course.
 */

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Play, Lock, Archive, RefreshCw, Plus, ChevronRight, Trash2 } from 'lucide-react'

type Course = {
  id: string; slug: string; title: string; description?: string
  status: string; sort_order: number; regular_price: number; sale_price?: number
  include_in_plan: number; created_at: string
}

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  draft: { label: 'Draft', color: '#737373' },
  published: { label: 'Published', color: '#1DB96B' },
  unlisted: { label: 'Unlisted', color: '#F59E0B' },
  archived: { label: 'Archived', color: '#DC2626' },
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetch('/api/admin/courses')
      .then((r) => r.ok ? r.json() : [])
      .then((data: any) => { if (!cancelled) setCourses(data ?? []) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const setStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/courses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: status }),
    })
    setCourses(courses.map((c) => c.id === id ? { ...c, status } : c))
  }

  if (loading) return <div className="text-center py-20 text-[#737373]">Loading courses…</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Courses</h1>
          <p className="text-[#737373] text-sm mt-1">Create, publish and manage courses.</p>
        </div>
        <Link
          href="/admin/courses/new"
          className="inline-flex items-center gap-2 rounded-lg bg-[#1DB96B] px-4 py-2 text-sm font-bold text-white hover:bg-[#17A05D]"
        >
          <Plus className="w-4 h-4" /> New course
        </Link>
      </div>

      <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#E5E5E5] bg-[#F9F9F9]">
              <th className="px-4 py-3 font-semibold text-[#737373]">Title</th>
              <th className="px-4 py-3 font-semibold text-[#737373]">Slug</th>
              <th className="px-4 py-3 font-semibold text-[#737373]">Status</th>
              <th className="px-4 py-3 font-semibold text-[#737373] text-right">Price</th>
              <th className="px-4 py-3 font-semibold text-[#737373] text-center">Plan</th>
              <th className="px-4 py-3 font-semibold text-[#737373] text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-[#737373]">No courses yet.</td></tr>
            ) : (
              courses.map((c) => {
                const st = STATUS_LABEL[c.status] ?? STATUS_LABEL.draft
                return (
                  <tr key={c.id} className="border-b border-[#E5E5E5] hover:bg-[#F3FBF6] transition-colors group">
                    <td className="px-4 py-3">
                      <Link href={`/admin/courses/${c.id}`} className="font-semibold text-[#111111] hover:underline">{c.title}</Link>
                    </td>
                    <td className="px-4 py-3 text-[#737373]">{c.slug}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${st.color === '#1DB96B' ? 'bg-[#F3FBF6] text-[#0B854C]' : st.color === '#DC2626' ? 'bg-[#FEE2E2] text-[#DC2626]' : 'bg-[#F5F5F5] text-[#737373]'}`}>
                        {st.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-[#737373]">
                      ZMW {((c.sale_price ?? c.regular_price) * 0.155).toFixed(0)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {c.include_in_plan === 1 ? <span className="text-xs font-bold text-[#0B854C]">In plan</span> : <span className="text-xs text-[#737373]">—</span>}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {c.status === 'published' && (
                        <button onClick={() => setStatus(c.id, 'unlisted')} className="text-xs text-[#DC2626] hover:underline mr-2">Unpublish</button>
                      )}
                      {c.status === 'unlisted' && (
                        <button onClick={() => setStatus(c.id, 'published')} className="text-xs text-[#0B854C] hover:underline mr-2">Publish</button>
                      )}
                      {c.status === 'archived' && (
                        <button onClick={() => setStatus(c.id, 'draft')} className="text-xs text-[#0B854C] hover:underline mr-2">Restore</button>
                      )}
                      {c.status !== 'archived' && (
                        <button onClick={() => setStatus(c.id, 'archived')} className="text-xs text-[#DC2626] hover:underline">Archive</button>
                      )}
                      <Link href={`/admin/courses/${c.id}`} className="ml-2 text-xs text-[#737373] hover:underline">Edit</Link>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
