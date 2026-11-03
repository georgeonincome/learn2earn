'use client'

/**
 * Admin New Course — create a course then redirect to its editor.
 */

import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default function AdminNewCoursePage() {
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [creating, setCreating] = useState(false)

  const slugify = (t: string) => t.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')

  const create = async () => {
    if (!title.trim() || !slug.trim()) return
    setCreating(true)
    const res = await fetch('/api/admin/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, title, status: 'draft' }),
    })
    if (res.ok) {
      const c = await res.json()
      window.location.href = `/admin/courses/${c.id}`
    } else {
      alert('Failed to create course')
      setCreating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/admin/courses" className="text-sm text-[#737373] hover:underline flex items-center gap-2">
          <ChevronLeft className="w-4 h-4" /> Back to courses
        </Link>
      </div>
      <h1 className="text-2xl font-extrabold">New course</h1>
      <p className="text-[#737373] text-sm mt-1">Create a draft course, then build its sections and lessons in the editor.</p>

      <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-6 space-y-5 max-w-2xl">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#737373]">Course title</label>
          <input
            className="w-full rounded-md border border-[#E5E5E5] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1DB96B]"
            value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. How to Make Your First ZMW 50,000 Online"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#737373]">Slug</label>
          <div className="flex gap-2">
            <span className="flex h-9 items-center rounded-l-md border border-[#E5E5E5] border-r-0 px-3 text-[#737373] text-sm">/admin/courses/</span>
            <input
              className="flex-1 rounded-r-md border border-[#E5E5E5] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1DB96B]"
              value={slug} onChange={(e) => setSlug(e.target.value)}
              placeholder={slugify(title)}
            />
          </div>
          {slug && <p className="text-xs text-[#737373]">{slug}</p>}
        </div>
        <button
          onClick={create}
          disabled={creating || !title.trim() || !slug.trim()}
          className="w-full rounded-lg bg-[#1DB96B] px-6 py-3 text-sm font-bold text-white disabled:opacity-60 hover:bg-[#17A05D] disabled:cursor-not-allowed transition-colors"
        >
          {creating ? 'Creating…' : 'Create course'}
        </button>
      </div>
    </div>
  )
}
