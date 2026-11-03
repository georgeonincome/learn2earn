'use client'

import Link from 'next/link'

/**
 * Admin Orders — DB-backed transaction list + refund issuance
 * (reference `issue_refunds` permission).
 */

import { useEffect, useState } from 'react'
import { ChevronRight } from 'lucide-react'

type Order = {
  id: string; full_name: string; email: string; course_name?: string
  amount: number; currency: string; payment_method: string
  payment_status: string; transaction_id?: string; transaction_date: string
}

const STATUS_COLOR: Record<string, string> = {
  paid: '#1DB96B', pending: '#F59E0B', failed: '#DC2626', refunded: '#737373',
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetch('/api/admin/orders')
      .then((r) => r.ok ? r.json() : [])
      .then((data: any) => { if (!cancelled) setOrders(data ?? []) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const refund = async (id: string) => {
    if (!window.confirm('Issue refund for this order?')) return
    await fetch('/api/admin/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setOrders(orders.map((o) => o.id === id ? { ...o, payment_status: 'refunded' } : o))
  }

  if (loading) return <div className="text-center py-20 text-[#737373]">Loading orders…</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Orders</h1>
          <p className="text-[#737373] text-sm mt-1">View and manage transactions.</p>
        </div>
      </div>

      <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#E5E5E5] bg-[#F9F9F9]">
              <th className="px-4 py-3 font-semibold text-[#737373]">Customer</th>
              <th className="px-4 py-3 font-semibold text-[#737373]">Course</th>
              <th className="px-4 py-3 font-semibold text-[#737373] text-right">Amount</th>
              <th className="px-4 py-3 font-semibold text-[#737373] text-center">Method</th>
              <th className="px-4 py-3 font-semibold text-[#737373] text-center">Status</th>
              <th className="px-4 py-3 font-semibold text-[#737373] text-right">Date</th>
              <th className="px-4 py-3 font-semibold text-[#737373] text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-12 text-center text-[#737373]">No orders yet.</td></tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id} className="border-b border-[#E5E5E5]">
                  <td className="px-4 py-3">{o.full_name}</td>
                  <td className="px-4 py-3 text-[#737373]">{o.course_name ?? '—'}</td>
                  <td className="px-4 py-3 text-right text-[#737373]">
                    ZMW {(o.amount * 0.155).toFixed(0)}
                  </td>
                  <td className="px-4 py-3 text-center text-[#737373]">{o.payment_method}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      STATUS_COLOR[o.payment_status] ? `bg-[#F3FBF6] text-[#1DB96B]` : 'bg-[#F5F5F5] text-[#737373]'
                    }`}>{o.payment_status}</span>
                  </td>
                  <td className="px-4 py-3 text-right text-[#737373]">
                    {o.transaction_date ? new Date(Number(o.transaction_date) * 1000).toLocaleDateString('en-GB') : '—'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {o.payment_status === 'paid' && (
                      <button onClick={() => refund(o.id)} className="text-xs text-[#DC2626] hover:underline">Refund</button>
                    )}
                    <Link href={`/courses/${o.id}`} className="ml-2 text-xs text-[#737373] hover:underline">View</Link>
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
