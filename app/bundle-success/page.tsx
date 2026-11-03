'use client'

/**
 * BundleSuccess — mirrors reference BundleSuccess-Cc7dTlqs.js:
 *   reads ?ref=, polls the purchase summary, three states:
 *   "Confirming payment" (pending) → success (payment received, bundle unlocked)
 *   or "We could not confirm this payment" for unknown references.
 * Buttons: "Open my dashboard" + per-course course links, WhatsApp support.
 */

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Check, Clock, AlertTriangle, ShieldCheck } from 'lucide-react'

type PurchaseSummary = {
  status: string
  reference: string
  amount: number
  studentName: string | null
  studentEmail: string | null
  bundle: { id: string; slug: string; name: string; tagline: string | null; price: number; anchorPrice: number | null }
  courses: Array<{ id: string; slug: string; title: string }>
}

export default function BundleSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FCFCF9] flex items-center justify-center text-[#10201A]">
          <p className="text-sm text-[#5B6B64]">Loading…</p>
        </div>
      }
    >
      <BundleSuccessInner />
    </Suspense>
  )
}

function BundleSuccessInner() {
  const search = useSearchParams()
  const reference = search.get('ref') ?? ''
  const [purchase, setPurchase] = useState<PurchaseSummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!reference) return
    let cancelled = false
    const poll = async (attempt = 0) => {
      try {
        const res = await fetch(`/api/bundles/purchase/${encodeURIComponent(reference)}`, { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json() as PurchaseSummary
          if (data.status === 'paid') {
            if (!cancelled) { setPurchase(data); setLoading(false) }
            return
          }
          // pending → poll a few times (payment callback may still be in flight)
          if (attempt < 6) {
            setTimeout(() => poll(attempt + 1), 2000)
            return
          }
          if (!cancelled) { setPurchase(data); setLoading(false) }
          return
        }
        if (!cancelled) setLoading(false)
      } catch {
        if (!cancelled) setLoading(false)
      }
    }
    poll()
    return () => { cancelled = true }
  }, [reference])

  const paid = purchase?.status === 'paid'

  return (
    <div className="min-h-screen bg-[#FCFCF9] text-[#10201A]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <header className="border-b border-[#E3E8E5] bg-white">
        <div className="mx-auto flex h-16 max-w-[1000px] items-center justify-between px-4">
          <Link href="/" className="inline-flex items-center gap-2 font-head font-extrabold">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1DB96B] text-white">
              <ShieldCheck className="h-5 w-5" />
            </span>
            Learn2Earn
          </Link>
          {purchase && (
            <span className="text-xs font-semibold text-[#5B6B64]">
              Ref: <span className="font-mono">{purchase.reference}</span>
            </span>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-[640px] px-4 py-12">
        {/* Unknown reference */}
        {!reference && (
          <div className="rounded-2xl border border-[#E3E8E5] bg-white p-10 text-center">
            <AlertTriangle className="mx-auto mb-3 h-10 w-10 text-[#D97706]" />
            <h1 className="mb-2 text-xl font-extrabold">No payment reference found in this link.</h1>
            <p className="mb-6 text-sm text-[#5B6B64]">If money left your account, nothing is lost — contact support with your payment confirmation.</p>
            <Link href="/courses" className="inline-block rounded-lg px-5 py-3 text-sm font-bold text-white" style={{ backgroundColor: '#1DB96B' }}>
              Back to courses
            </Link>
          </div>
        )}

        {/* Loading / confirming */}
        {reference && (loading || !purchase) && (
          <div className="rounded-2xl border border-[#E3E8E5] bg-white p-10 text-center">
            <Clock className="mx-auto mb-3 h-10 w-10 animate-pulse text-[#0B854C]" />
            <h1 className="mb-2 text-xl font-extrabold">Confirming payment</h1>
            <p className="text-sm text-[#5B6B64]">Unlocking your courses… This takes a few seconds. Please keep this page open.</p>
            <p className="mt-4 text-xs text-[#5B6B64]">
              Please do not pay again. Keep your reference: <span className="font-mono font-bold">{reference}</span>
            </p>
          </div>
        )}

        {/* Found but not paid yet */}
        {reference && purchase && !paid && (
          <div className="rounded-2xl border border-[#E3E8E5] bg-white p-10 text-center">
            <Clock className="mx-auto mb-3 h-10 w-10 text-[#D97706]" />
            <h1 className="mb-2 text-xl font-extrabold">Not confirmed yet</h1>
            <p className="mb-6 text-sm text-[#5B6B64]">
              We could not confirm this payment yet. If money left your account, nothing is lost — send the reference{' '}
              <span className="font-mono font-bold">{purchase.reference}</span> to support.
            </p>
            <a
              href="https://wa.me/260774742019?text=Hi%20George%2C%20I%20paid%20for%20a%20bundle%2C%20here%20is%20my%20reference"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-bold text-white"
              style={{ backgroundColor: '#1DB96B' }}
            >
              Contact support
            </a>
          </div>
        )}

        {/* Paid */}
        {purchase && paid && (
          <div className="rounded-2xl border border-[#E3E8E5] bg-white p-10 text-center">
            <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#E8F6EF] text-[#0B6B3D]">
              <Check className="h-7 w-7" strokeWidth={3} />
            </span>
            <h1 className="mb-2 text-2xl font-extrabold">Payment confirmed</h1>
            <p className="mb-1 text-sm font-bold">{purchase.bundle.name}</p>
            <p className="mb-6 text-sm text-[#5B6B64]">
              Everything in this bundle is already in your dashboard. A confirmation email with links to every course is on its way
              {purchase.studentEmail ? <> to <strong className="font-semibold">{purchase.studentEmail}</strong></> : null}.
            </p>

            <div className="mb-6 rounded-xl border border-[#E3E8E5] bg-[#FCFCF9] p-5 text-left">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[#5B6B64]">Your bundle</p>
              {purchase.courses.map((c) => (
                <Link
                  key={c.id}
                  href={`/courses/${c.slug}`}
                  className="flex items-center justify-between border-b border-[#E3E8E5] py-3 text-sm font-semibold last:border-0 hover:text-[#0B6B3D]"
                >
                  <span>{c.title}</span>
                  <span className="text-xs text-[#5B6B64]">Open</span>
                </Link>
              ))}
              <p className="pt-3 text-xs text-[#5B6B64]">
                Paid ZMW {purchase.amount.toLocaleString('en-ZM')} · Ref <span className="font-mono">{purchase.reference}</span>
              </p>
            </div>

            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-bold text-white"
                style={{ backgroundColor: '#1DB96B' }}
              >
                Start learning — open my dashboard
              </Link>
              <a
                href="https://wa.me/260774742019?text=Hi%20George%2C%20I%20just%20bought%20a%20bundle%21"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-[#0B6B3D] hover:underline"
              >
                Contact George on WhatsApp
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
