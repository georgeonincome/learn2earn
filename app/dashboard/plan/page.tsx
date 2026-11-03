'use client'

/**
 * Dashboard /plan — real plan status from /api/dashboard/plan:
 * status pills, days left, plan time used bar, and the renew/subscribe flow.
 */
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronRight, RefreshCw, Lock, CreditCard, Calendar } from 'lucide-react'

type Plan = { id: string; code: string; name: string; duration_days: number; price_kes: number; is_visible: boolean; is_recommended: boolean; sort_order: number }

export default function DashboardPlanPage() {
  const [summary, setSummary] = useState<any>(null)
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    Promise.all([
      fetch('/api/dashboard/plan').then((r) => r.json()),
      fetch('/api/dashboard/courses?tab=browse').then((r) => r.json()),
    ]).then(([s, b]: any) => {
      if (cancelled) return
      setSummary(s)
      setPlans(b?.plans ?? [])
      setLoading(false)
    }).catch(() => setLoading(false))
    return () => { cancelled = true }
  }, [])

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading…</div>

  const ended = summary.state === 'expired' || summary.state === 'cancelled'
  const active = summary.state === 'active'

  return (
    <>
      <div className="min-h-screen bg-[#FAFAFA] text-[#10201A]">
        <nav className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-5xl px-4 py-3 flex items-center gap-4">
            <Link href="/dashboard" className="text-[#0B854C] font-semibold hover:underline">← Dashboard</Link>
            <div className="h-6 w-px bg-gray-200 mx-2" />
            <h1 className="text-xl font-bold">My plan</h1>
          </div>
        </nav>

        <main className="mx-auto max-w-5xl px-4 py-8">
        <p className="text-gray-600 mb-8">All {summary.plans?.length} courses, your member number and your payments.</p>

        {/* status card */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="font-bold">My plan</h2>
            <span className={`px-2 py-0.5 rounded text-xs font-bold ${
              active ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
            }`}>
              {active ? 'Active' : ended ? 'Ended' : 'None'}
            </span>
            {active && summary.daysRemaining != null && (
              <span className="text-xs text-gray-500">{summary.daysRemaining} days left</span>
            )}
          </div>
          <div className="mb-4">
            <p className="text-xs text-gray-400">Plan time used</p>
            <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
              <div className="h-full bg-[#1DB96B]" style={{ width: active ? Math.min(100, 100 - (summary.daysRemaining ?? 0)) : 0 }} />
            </div>
            <p className="text-xs text-gray-500 mt-1">Started {summary.startedAt ?? '—'} · {summary.daysTotal != null ? `${summary.daysTotal - (summary.daysRemaining ?? 0)} of ${summary.daysTotal} days left` : ''}</p>
          </div>
        </div>

        {/* plans */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 mb-8">
          <h2 className="font-bold mb-4">{ended ? 'Renew your plan' : 'Choose a plan'}</h2>
          <p className="text-sm text-gray-500 mb-6">Pay once with MTN/Airtel money or card. We never charge you automatically.</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((p) => {
              const recommended = p.is_recommended
              return (
                <div key={p.code} className={`rounded-xl border p-5 flex flex-col gap-3 ${recommended ? 'border-[#1DB96B] bg-[#1DB96B]/05' : 'border-gray-200 bg-white'}`}>
                  {recommended && <span className="text-[10px] font-bold text-[#0B854C] uppercase tracking-wider">Best value</span>}
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold">ZMW {(p.price_kes * 0.155).toFixed(0)}</span>
                    <span className="text-xs text-gray-500">{p.duration_days} days</span>
                  </div>
                  <p className="text-xs text-gray-500">{p.name}</p>
                  <button
                    onClick={() => {
                      const url = new URL('/subscribe', window.location.origin)
                      url.searchParams.set('plan', p.code)
                      window.location.href = url.toString()
                    }}
                    className={`w-full rounded-md px-4 py-2 text-xs font-bold transition ${
                      recommended ? 'bg-[#1DB96B] text-white hover:bg-[#17A05D]' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {ended ? 'Renew plan' : 'Subscribe'}
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="font-bold mb-4">Payments</h2>
          <p className="text-sm text-gray-500 mb-4">Manage your purchases with full transparency.</p>
          <p className="text-sm text-gray-400">Receipts and payment history appear here as you purchase courses and plans.</p>
        </div>
      </main>
      </div>
      </>
  )
}
