'use client'

/**
 * Admin Failed Transactions — reference `failed_transactions` surface.
 */

import { useEffect, useState } from 'react'

type Txn = {
  id: string; full_name: string; email: string; course_name?: string
  amount: number; currency: string; payment_method: string
  payment_status: string; transaction_id?: string; transaction_date: string
}

export default function AdminFailedTransactionsPage() {
  const [txns, setTxns] = useState<Txn[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetch('/api/admin/failed-transactions')
      .then((r) => r.ok ? r.json() : [])
      .then((data: any) => { if (!cancelled) setTxns(data ?? []) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  if (loading) return <div className="text-center py-20 text-[#737373]">Loading…</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Failed transactions</h1>
          <p className="text-[#737373] text-sm mt-1">Payments that did not complete — follow up with students.</p>
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
              <th className="px-4 py-3 font-semibold text-[#737373] text-right">Date</th>
            </tr>
          </thead>
          <tbody>
            {txns.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-12 text-center text-[#737373]">No failed transactions.</td></tr>
            ) : (
              txns.map((t) => (
                <tr key={t.id} className="border-b border-[#E5E5E5]">
                  <td className="px-4 py-3">{t.full_name}</td>
                  <td className="px-4 py-3 text-[#737373]">{t.course_name ?? '—'}</td>
                  <td className="px-4 py-3 text-right text-[#737373]">
                    ZMW {(t.amount * 0.155).toFixed(0)}
                  </td>
                  <td className="px-4 py-3 text-center text-[#737373]">{t.payment_method}</td>
                  <td className="px-4 py-3 text-right text-[#737373]">
                    {t.transaction_date ? new Date(Number(t.transaction_date) * 1000).toLocaleDateString('en-GB') : '—'}
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
