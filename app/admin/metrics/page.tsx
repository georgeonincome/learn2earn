'use client'

/**
 * Admin Dashboard metrics — real metric widgets + needs-attention panel
 * (reference dashboard metrics).
 */

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronRight, ArrowRight, RefreshCw, AlertTriangle, TrendingUp } from 'lucide-react'

type Metric = { label: string; value: string | number; sub?: string; color: string }
type Attention = { kind: string; label: string; count: number; route: string }

export default function AdminMetricsPage() {
  const [metrics, setMetrics] = useState<any>(null)
  const [attention, setAttention] = useState<Attention[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetch('/api/admin/metrics')
      .then((r) => r.ok ? r.json() : null)
      .then((d: any) => {
        if (!cancelled) { setMetrics(d.metrics); setAttention(d.attention) }
      })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  if (loading) return <div className="text-center py-20 text-[#737373]">Loading…</div>

  const m = metrics ?? { totalStudents: 0, activeStudents: 0, newStudentsToday: 0, totalEnrollments: 0, newEnrollmentsToday: 0, totalCourses: 0, activeCohorts: 0, openTickets: 0, certificatesIssued: 0, revenueToday: 0, paidOrdersToday: 0 }

  const metricCards: Metric[] = [
    { label: 'Total students', value: m.totalStudents, sub: `${m.newStudentsToday} today`, color: '#1DB96B' },
    { label: 'Total enrollments', value: m.totalEnrollments, sub: `${m.newEnrollmentsToday} today`, color: '#1DB96B' },
    { label: 'Total courses', value: m.totalCourses, color: '#F59E0B' },
    { label: 'Active cohorts', value: m.activeCohorts, color: '#F59E0B' },
    { label: 'Open tickets', value: m.openTickets, color: '#DC2626' },
    { label: 'Certificates issued', value: m.certificatesIssued, color: '#737373' },
    { label: 'Revenue today', value: `ZMW ${m.revenueToday.toFixed(0)}`, color: '#1DB96B' },
    { label: 'Paid orders today', value: m.paidOrdersToday, color: '#1DB96B' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Admin dashboard</h1>
          <p className="text-[#737373] text-sm mt-1">Operational overview.</p>
        </div>
        <button onClick={() => window.location.reload()} className="flex items-center gap-2 rounded-lg border border-[#E5E5E5] px-3 py-2 text-sm font-bold text-[#737373] hover:bg-[#F3FBF6]">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((c) => (
          <div key={c.label} className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[#737373]">{c.label}</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: c.color + '15', color: c.color }}>
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold">{c.value}</div>
            {c.sub && <div className="text-xs text-[#737373] mt-1">{c.sub}</div>}
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-6">
        <h2 className="font-bold text-lg mb-4">Needs your attention</h2>
        {attention.length === 0 ? (
          <p className="text-[#737373] text-sm">Nothing waiting for access right now.</p>
        ) : (
          <div className="space-y-2">
            {attention.map((a) => (
              <div key={a.kind} className="flex items-center justify-between px-4 py-3 border-b border-[#E5E5E5] last:border-0">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
                  <div>
                    <div className="font-semibold text-[#111111]">{a.label}</div>
                    <div className="text-xs text-[#737373]">{a.count} item{ a.count !== 1 ? 's' : '' }</div>
                  </div>
                </div>
                <Link href={a.route} className="rounded-md bg-[#F3FBF6] px-3 py-1 text-xs font-bold text-[#1DB96B] hover:bg-[#E0F5EC]">Go →</Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
