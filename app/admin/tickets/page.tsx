'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  Ticket,
  User,
  Clock,
  Mail,
  ChevronRight,
  ArrowRight,
  RefreshCw,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type TicketItem = {
  id: string
  student_id: string
  student_name: string
  student_email: string
  subject: string
  category: string
  message: string
  status: string
  created_at: string
  updated_at: string
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  open: { label: 'Open', color: '#0B854C', bg: '#E8F6EF' },
  in_progress: { label: 'In Progress', color: '#8A5300', bg: '#FFF4DE' },
  resolved: { label: 'Resolved', color: '#17A05D', bg: '#E8F6EF' },
  closed: { label: 'Closed', color: '#737373', bg: '#F3F4F6' },
}

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<TicketItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    fetch('/api/tickets')
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load tickets')
        return r.json()
      })
      .then((data: any) => {
        if (!cancelled) setTickets(data ?? [])
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const handleRefresh = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/tickets')
      if (!res.ok) throw new Error('Failed to refresh tickets')
      const data = await res.json()
      setTickets(data ?? [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <RefreshCw className="w-8 h-8 animate-spin text-[#1DB96B]" />
        <p className="mt-4 text-[#737373]">Loading tickets...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <p className="text-[#B42318]">{error}</p>
        <button
          onClick={handleRefresh}
          className="mt-4 px-4 py-2 rounded-xl bg-[#1DB96B] text-[#111111] font-semibold hover:bg-[#17A05D]"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#111111]">Support Tickets</h1>
          <p className="text-[#737373]">Manage and respond to student support tickets.</p>
        </div>
        <button
          onClick={handleRefresh}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-xl border border-[#E5E5E5] bg-white text-[#737373] text-sm font-medium hover:bg-[#F3FBF6] hover:text-[#111111] transition-colors',
            loading && 'opacity-60 cursor-not-allowed'
          )}
        >
          {loading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          Refresh
        </button>
      </div>

      <div className="rounded-xl border border-[#E5E5E5] bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E5E5E5] bg-[#F3FBF6]">
              <th className="px-4 py-3 text-left text-[#737373] font-semibold">Ticket</th>
              <th className="px-4 py-3 text-left text-[#737373] font-semibold">Student</th>
              <th className="px-4 py-3 text-left text-[#737373] font-semibold">Subject</th>
              <th className="px-4 py-3 text-left text-[#737373] font-semibold">Category</th>
              <th className="px-4 py-3 text-left text-[#737373] font-semibold">Status</th>
              <th className="px-4 py-3 text-left text-[#737373] font-semibold">Created</th>
              <th className="px-4 py-3 text-right text-[#737373] font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E5E5]">
            {tickets.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-[#737373]">
                  No tickets found.
                </td>
              </tr>
            ) : (
              tickets.map((ticket) => {
                const status = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.open
                return (
                  <tr key={ticket.id} className="hover:bg-[#F3FBF6] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Ticket className="w-4 h-4 text-[#1DB96B]" />
                        <span className="font-medium text-[#111111]">#{ticket.id.slice(-6)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-[#737373]" />
                        <div>
                          <p className="text-[#111111] font-medium">{ticket.student_name}</p>
                          <p className="text-xs text-[#737373]">{ticket.student_email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#111111]">{ticket.subject}</td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        'px-2 py-1 rounded-full text-xs font-medium',
                        ticket.category === 'general' ? 'bg-[#E8F6EF] text-[#0B854C]' : 'bg-[#F3F4F6] text-[#737373]'
                      )}>
                        {ticket.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        'px-2 py-1 rounded-full text-xs font-medium',
                        `bg-${status.bg.replace('#', 'bg-[').replace(']', ']')} text-${status.color.replace('#', 'text-[')}]`
                      )}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#737373]">
                      {new Date(ticket.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/tickets/${ticket.id}`}
                        className="text-[#1DB96B] text-sm font-medium hover:underline"
                      >
                        View <ArrowRight className="w-3 h-3 ml-1" />
                      </Link>
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