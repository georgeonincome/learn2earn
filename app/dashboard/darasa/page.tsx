'use client'

/**
 * Dashboard Darasa — reference darasa live-session UI.
 * DB-driven live sessions with sign-up flow.
 */

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Calendar, Users, Clock, Mail } from 'lucide-react'

type Session = { id: string; title: string; description: string; session_type: string; host: string; scheduled_text: string; starts_at: string; seconds: number; seats: number; is_active: number }

export default function DarasaPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetch('/api/darasa-sessions')
      .then((r) => r.ok ? r.json() : [])
      .then((data: any) => { if (!cancelled) setSessions(data ?? []) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  if (loading) return <div className="text-center py-20 text-[#737373]">Loading sessions…</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Darasa live sessions</h1>
          <p className="text-[#737373] text-sm mt-1">Live, group-based programs with deadlines. Recordings stay in your dashboard.</p>
        </div>
        <Link href="https://wa.me/260979982819?text=Hi%20George,%20I%20want%20to%20join%20a%20darasa%20session" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-6 py-3 text-sm font-bold text-white hover:bg-[#1eb855]">
          <Mail className="w-4 h-4" /> Ask on WhatsApp
        </Link>
      </div>

      <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF]">
        <div className="divide-y divide-[#E5E5E5]">
          {sessions.length === 0 ? (
            <div className="px-4 py-12 text-center text-[#737373]">No live sessions scheduled right now.</div>
          ) : (
            sessions.map((s) => (
              <div key={s.id} className="px-4 py-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{s.title}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${s.is_active === 1 ? 'bg-[#F3FBF6] text-[#1DB96B]' : 'bg-[#F5F5F5] text-[#737373]'}`}>{s.is_active === 1 ? 'Active' : 'Scheduled'}</span>
                </div>
                <p className="text-sm text-[#737373] mb-2">{s.description}</p>
                <div className="flex items-center gap-3 text-xs text-[#737373]">
                  <Calendar className="w-3 h-3" /> {s.scheduled_text}
                  <Users className="w-3 h-3" /> {s.seats} seats
                  <Clock className="w-3 h-3" /> {Math.round(s.seconds / 60)} min
                </div>
                <div className="mt-3 flex gap-2">
                  <button className="rounded-lg bg-[#1DB96B] px-4 py-2 text-sm font-bold text-white hover:bg-[#17A05D] flex-1 sm:w-auto">Join session</button>
                  <Link href="/courses" className="rounded-lg border border-[#E5E5E5] px-4 py-2 text-sm text-[#737373] text-center hover:bg-[#F3FBF6] flex-1 sm:w-auto">Browse courses</Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
