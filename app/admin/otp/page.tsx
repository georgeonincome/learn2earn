'use client'

/**
 * Admin OTP — two-step login second factor (reference `OTPVerificationModal`).
 * Codes are shown in dev so the flow can be exercised end to end.
 */

import { useEffect, useState } from 'react'

type Otp = { id: string; user_id: string; code: string; purpose: string; used: number; created_at: string }

export default function AdminOtpPage() {
  const [codes, setCodes] = useState<Otp[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetch('/api/admin/otp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'create' }) })
      .then((r) => r.ok ? r.json() : null)
      .then((d: any) => {
        if (d?.code) setCodes((prev) => [...prev, { id: 'otp-' + Date.now(), user_id: 'admin', code: d.code, purpose: 'admin_login', used: 0, created_at: new Date().toISOString() }])
      })
      .finally(() => setLoading(false))
  }, [])

  const consume = async (code: string) => {
    const res = await fetch('/api/admin/otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'consume', code }),
    })
    const d = res.ok ? await res.json() : { ok: false }
    alert(d.ok ? `OTP valid for user ${d.userId}` : d.error || 'Invalid code')
    setCodes(codes.filter((c) => c.code !== code))
  }

  if (loading) return <div className="text-center py-20 text-[#737373]">Loading…</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Admin OTP</h1>
          <p className="text-[#737373] text-sm mt-1">Two-step login second factor (dev flow).</p>
        </div>
      </div>

      <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-6 space-y-4">
        <p className="text-sm text-[#737373]">Generate a one-time code, then consume it to verify the admin login second step.</p>
        <div className="flex gap-3">
          <button onClick={() => window.location.reload()} className="rounded-lg bg-[#1DB96B] px-4 py-2 text-sm font-bold text-white hover:bg-[#17A05D]">Generate code</button>
        </div>
        {codes.length === 0 ? (
          <p className="text-[#737373] text-sm">No active codes.</p>
        ) : (
          <div className="space-y-2">
            {codes.map((c) => (
              <div key={c.id} className="flex items-center justify-between px-4 py-3 border-b border-[#E5E5E5]">
                <div>
                  <div className="font-mono font-bold text-[#111111]">{c.code}</div>
                  <div className="text-xs text-[#737373]">{c.purpose} · used: {c.used === 1 ? 'yes' : 'no'}</div>
                </div>
                <button onClick={() => consume(c.code)} className="rounded-md bg-[#F3FBF6] px-3 py-1 text-xs font-bold text-[#0B854C] hover:bg-[#E0F5EC]">Verify</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
