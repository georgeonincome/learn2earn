'use client'

/**
 * Dashboard Support — reference support tickets UI.
 * Create tickets, view your tickets, staff replies.
 */

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Mail, ChevronRight, Clock } from 'lucide-react'

type Ticket = { id: string; subject: string; category: string; status: string; message: string; created_at: string }

export default function SupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [subject, setSubject] = useState('')
  const [category, setCategory] = useState('general')
  const [message, setMessage] = useState('')

  useEffect(() => {
    let cancelled = false
    fetch('/api/tickets')
      .then((r) => r.ok ? r.json() : [])
      .then((data: any) => { if (!cancelled) setTickets(data ?? []) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const createTicket = async () => {
    if (!subject || !message) return
    const res = await fetch('/api/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, category, message }),
    })
    if (res.ok) {
      setSubject(''); setMessage('')
      setTickets((prev) => [...prev, { id: 'new', subject, category, status: 'open', message, created_at: new Date().toISOString() }])
    }
  }

  if (loading) return <div className="text-center py-20 text-[#737373]">Loading…</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Support tickets</h1>
          <p className="text-[#737373] text-sm mt-1">Open a help ticket or contact George directly on WhatsApp.</p>
        </div>
        <Link href="https://wa.me/260979982819?text=Hi%20George,%20I%20need%20support" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-6 py-3 text-sm font-bold text-white hover:bg-[#1eb855]">
          <Mail className="w-4 h-4" /> Chat on WhatsApp
        </Link>
      </div>

      <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-6 space-y-4">
        <h2 className="font-bold text-lg">New ticket</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#737373]">Subject</label>
            <input className="w-full rounded-md border border-[#E5E5E5] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1DB96B]" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. How do I access my course?" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#737373]">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-md border border-[#E5E5E5] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1DB96B]">
              <option value="general">General</option>
              <option value="billing">Billing & payments</option>
              <option value="technical">Technical issue</option>
              <option value="certificate">Certificate</option>
            </select>
          </div>
          <div className="sm:col-span-2 space-y-2">
            <label className="text-xs font-semibold text-[#737373]">Message</label>
            <textarea className="w-full rounded-md border border-[#E5E5E5] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1DB96B]" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="What can we help you with?" />
          </div>
          <button onClick={createTicket} disabled={!subject || !message} className="w-full sm:w-auto rounded-lg bg-[#1DB96B] px-6 py-2.5 text-sm font-bold text-white disabled:opacity-60 hover:bg-[#17A05D] disabled:cursor-not-allowed">Create ticket</button>
        </div>
      </div>

      <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF]">
        <h2 className="font-bold text-lg mb-4 px-4">Your tickets</h2>
        <div className="divide-y divide-[#E5E5E5]">
          {tickets.length === 0 ? (
            <div className="px-4 py-12 text-center text-[#737373]">No support tickets yet.</div>
          ) : (
            tickets.map((t) => (
              <div key={t.id} className="px-4 py-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{t.subject}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${t.status === 'open' ? 'bg-[#FEE2E2] text-[#DC2626]' : 'bg-[#F3FBF6] text-[#1DB96B]'}`}>{t.status}</span>
                </div>
                <p className="text-sm text-[#737373]">{t.message}</p>
                <div className="flex items-center gap-2 text-xs text-[#737373] mt-2">
                  <Clock className="w-3 h-3" /> {t.category}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
