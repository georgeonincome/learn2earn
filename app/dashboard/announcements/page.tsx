'use client'

/**
 * Dashboard Announcements — reference announcements UI.
 * Site-wide announcements with read/unread state.
 */

import { useEffect, useState } from 'react'
import { Megaphone, ChevronRight, Clock } from 'lucide-react'

type Announcement = { id: string; title: string; message: string; created_at: string; is_published: number }

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetch('/api/announcements')
      .then((r) => r.ok ? r.json() : [])
      .then((data: any) => { if (!cancelled) setAnnouncements(data ?? []) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  if (loading) return <div className="text-center py-20 text-[#737373]">Loading…</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Announcements</h1>
          <p className="text-[#737373] text-sm mt-1">Site-wide announcements from George.</p>
        </div>
      </div>

      <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF]">
        <div className="divide-y divide-[#E5E5E5]">
          {announcements.length === 0 ? (
            <div className="px-4 py-12 text-center text-[#737373]">No announcements right now.</div>
          ) : (
            announcements.map((a) => (
              <div key={a.id} className="px-4 py-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{a.title}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${a.is_published === 1 ? 'bg-[#F3FBF6] text-[#0B854C]' : 'bg-[#F5F5F5] text-[#737373]'}`}>{a.is_published === 1 ? 'Published' : 'Draft'}</span>
                </div>
                <p className="text-sm text-[#737373]">{a.message}</p>
                <div className="mt-2 flex items-center gap-2 text-xs text-[#737373]">
                  <Clock className="w-3 h-3" /> {new Date(a.created_at).toLocaleDateString('en-GB')}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
