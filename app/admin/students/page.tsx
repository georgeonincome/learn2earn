'use client'

/**
 * Admin Students — DB-backed student list with search (reference student management).
 */

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Search, ChevronRight } from 'lucide-react'

type Student = { id: string; full_name: string; email: string; created_at: string }

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const url = query ? `/api/admin/students?q=${encodeURIComponent(query)}` : '/api/admin/students'
    fetch(url)
      .then((r) => r.ok ? r.json() : [])
      .then((data: any) => { if (!cancelled) setStudents(data ?? []) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [query])

  if (loading) return <div className="text-center py-20 text-[#737373]">Loading students…</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Students</h1>
          <p className="text-[#737373] text-sm mt-1">Manage student accounts.</p>
        </div>
      </div>

      <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-4">
        <div className="flex gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -mt-2.5 h-4 w-4 text-[#737373]" />
            <input
              className="w-full rounded-md border border-[#E5E5E5] pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1DB96B]"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name or email…"
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#E5E5E5] bg-[#F9F9F9]">
              <th className="px-4 py-3 font-semibold text-[#737373]">Name</th>
              <th className="px-4 py-3 font-semibold text-[#737373]">Email</th>
              <th className="px-4 py-3 font-semibold text-[#737373] text-right">Joined</th>
              <th className="px-4 py-3 font-semibold text-[#737373] text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-12 text-center text-[#737373]">No students found.</td></tr>
            ) : (
              students.map((s) => (
                <tr key={s.id} className="border-b border-[#E5E5E5]">
                  <td className="px-4 py-3 font-semibold text-[#111111]">{s.full_name}</td>
                  <td className="px-4 py-3 text-[#737373]">{s.email}</td>
                  <td className="px-4 py-3 text-right text-[#737373]">
                    {s.created_at ? new Date(Number(s.created_at) * 1000).toLocaleDateString('en-GB') : '—'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/dashboard/courses`} className="text-xs text-[#737373] hover:underline">View profile</Link>
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
