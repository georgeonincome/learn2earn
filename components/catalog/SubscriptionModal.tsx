'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Loader2,
  Lock,
  ShieldCheck,
  X,
} from 'lucide-react'
import { MEMBERSHIP_PLANS, SITE_CONFIG } from '@/lib/data'
import { formatPrice } from '@/lib/utils'

/* Subscription modal — opens from the course card "Subscribe · from ZMW X/mo" button.
   Mirrors the reference subscribe page flow: plan select → email → payment → success.
*/

const E = {
  ink: 'hsl(0 86% 3%)',
  inkRaised: 'hsl(0 24% 8%)',
  cream: 'hsl(0 100% 99%)',
  paper: 'hsl(0 0% 100%)',
  sand: 'hsl(20 39% 93%)',
  action: 'hsl(22 100% 50%)',
  actionHover: 'hsl(21 100% 44%)',
  green: 'hsl(151 73% 42%)',
  greenDeep: 'hsl(153 85% 28%)',
  onDark: 'hsl(0 100% 99%)',
  onDarkMuted: 'hsl(354 4% 59%)',
  onLight: 'hsl(0 86% 3%)',
  onLightMuted: 'hsl(354 6% 39%)',
  lineDark: 'hsl(0 17% 14%)',
  lineLight: 'hsl(24 14% 88%)',
}

interface SubscriptionModalProps {
  course: { slug: string; title: string; price: number; referenceSale?: number; monthlySubPrice?: number }
  onClose: () => void
}

export default function SubscriptionModal({ course, onClose }: SubscriptionModalProps) {
  const [planCode, setPlanCode] = useState(MEMBERSHIP_PLANS.find(p => p.popular)?.id ?? MEMBERSHIP_PLANS[0].id)
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState<string | null>(null)
  const [stage, setStage] = useState<'form' | 'waiting' | 'failed' | 'done'>('form')
  const [processing, setProcessing] = useState(false)

  const plan = MEMBERSHIP_PLANS.find(p => p.id === planCode) ?? MEMBERSHIP_PLANS[0]
  const total = formatPrice(plan.price)
  const perMonth = Math.round(plan.price / (plan.id === 'yearly' ? 12 : 4))
  const days = plan.id === 'yearly' ? 365 : 120

  const coursePrice = course.referenceSale ?? course.price
  const showingUpgrade = coursePrice > 0
  const upgradeOnlyMore = Math.max(0, plan.price - coursePrice)

  const pay = () => {
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError('Enter a valid email — your receipt goes here.')
      return
    }
    setEmailError(null)
    setProcessing(true)
    fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: plan.id, email }),
    })
      .then(() => new Promise(r => setTimeout(r, 900)))
      .then(() => {
        setProcessing(false)
        setStage('done')
      })
      .catch(() => {
        setProcessing(false)
        setStage('failed')
      })
  }

  const closeModal = () => {
    setStage('form')
    setEmail('')
    setEmailError(null)
    setPlanCode(MEMBERSHIP_PLANS.find(p => p.popular)?.id ?? MEMBERSHIP_PLANS[0].id)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="subscription-modal-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40"
        onClick={closeModal}
        aria-hidden="true"
      />
      {/* Modal panel */}
      <div
        className="relative w-full max-w-[480px] mx-4 rounded-2xl border"
        style={{ backgroundColor: E.paper, borderColor: E.lineLight, color: E.onLight }}
      >
        {/* Header */}
        <header className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: E.lineLight }}>
          <button
            onClick={closeModal}
            className="-ml-3 flex h-11 w-11 items-center justify-center rounded-lg"
            style={{ color: E.onDarkMuted }}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          <Link href="/" className="font-head text-lg font-extrabold" style={{ color: E.onLight }}>
            Learn2Earn
          </Link>
          <span className="flex items-center gap-1.5 text-[12px] font-semibold" style={{ color: E.greenDeep }}>
            <ShieldCheck className="h-3.5 w-3.5" /> Secure
          </span>
        </header>

        <main className="p-5 pb-40">
          {stage === 'form' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[11.5px] font-bold uppercase tracking-[0.1em]" style={{ color: E.onLightMuted }}>
                  Learn2Earn membership
                </p>
                <span className="text-[12px] font-bold" style={{ color: E.greenDeep }}>
                  Instant access
                </span>
              </div>

              <label htmlFor="sub-plan" className="mt-4 block text-[13px] font-semibold">
                Choose your plan
              </label>
              <div className="relative mt-1.5">
                <select
                  id="sub-plan"
                  value={planCode}
                  onChange={e => setPlanCode(e.target.value)}
                  className="h-[52px] w-full appearance-none rounded-[12px] pl-3.5 pr-11 text-[15px] font-bold"
                  style={{ backgroundColor: E.paper, border: `1px solid ${E.lineLight}`, color: E.onLight }}
                >
                  {MEMBERSHIP_PLANS.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} · {formatPrice(p.price)}
                      {p.originalPrice && p.originalPrice > p.price
                        ? ` · save ${Math.round((1 - p.price / p.originalPrice) * 100)}%`
                        : ''}
                    </option>
                  ))}
                </select>
                <ChevronRight className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 opacity-60" />
              </div>
              <p className="mt-1.5 text-[12px]" style={{ color: E.onLightMuted }}>
                {days} days · ZMW {perMonth.toLocaleString('en-ZM')}/month · everything unlocked. One
                payment, no auto renewal.
              </p>

              {showingUpgrade && (
                <div
                  className="flex items-center justify-between rounded-[12px] px-4 py-3"
                  style={{ backgroundColor: E.sand, color: E.onLight }}
                >
                  <span className="text-[13px] font-semibold">{plan.name}</span>
                  <span className="text-[17px] font-extrabold">{total}</span>
                </div>
              )}

              <div className="mt-4 space-y-3">
                <div>
                  <label htmlFor="sub-email" className="mb-1.5 block text-[13px] font-semibold">
                    Email address
                  </label>
                  <input
                    id="sub-email"
                    type="email"
                    value={email}
                    onChange={e => {
                      setEmail(e.target.value)
                      if (emailError) setEmailError(null)
                    }}
                    placeholder="you@example.com"
                    autoComplete="email"
                    inputMode="email"
                    className="h-[48px] w-full rounded-[12px] px-3.5 text-[16px]"
                    style={{
                      backgroundColor: E.paper,
                      border: `1px solid ${emailError ? '#c52020' : E.lineLight}`,
                      color: E.onLight,
                    }}
                  />
                  <p className={`mt-1.5 text-[12px] ${emailError ? 'text-[#c52020]' : ''}`} style={emailError ? undefined : { color: E.onLightMuted }}>
                    {emailError ?? 'Your access and receipt go here.'}
                  </p>
                </div>

                <button
                  onClick={pay}
                  disabled={processing}
                  className="h-[52px] w-full items-center justify-center gap-2 rounded-[12px] text-[16px] font-extrabold disabled:opacity-70"
                  style={{ backgroundColor: E.action, color: E.ink }}
                >
                  {processing ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Lock className="h-4 w-4" />
                  )}
                  Pay {total}
                </button>
                <p className="text-center text-[12px]" style={{ color: E.onLightMuted }}>
                  Secured by Flutterwave · you are charged once, nothing recurring.
                </p>
              </div>
            </div>
          )}

          {stage === 'waiting' && (
            <div className="rounded-2xl p-6 text-center" style={{ backgroundColor: E.cream, color: E.onLight, border: `1px solid ${E.lineLight}` }}>
              <Loader2 className="mx-auto h-9 w-9 animate-spin" style={{ color: E.green }} />
              <h1 className="mt-4 text-[20px] font-extrabold">Confirming your payment</h1>
              <p className="mt-1 text-[14px]" style={{ color: E.onLightMuted }}>
                Finish the payment in the mobile money window. If you chose card, complete it in the
                Flutterwave window.
              </p>
            </div>
          )}

          {stage === 'failed' && (
            <div className="rounded-2xl p-6" style={{ backgroundColor: E.cream, color: E.onLight, border: `1px solid ${E.lineLight}` }}>
              <h1 className="text-[20px] font-extrabold">Payment not completed</h1>
              <p className="mt-1.5 text-[14px]" style={{ color: E.onLightMuted }}>
                {emailError ?? 'The payment did not go through.'}{' '}
                <span className="font-semibold" style={{ color: E.onLight }}>
                  Nothing has been charged.
                </span>
              </p>
              <div className="mt-5 space-y-2.5">
                <button
                  onClick={() => {
                    setStage('form')
                    setEmailError(null)
                  }}
                  className="h-[47px] w-full rounded-[10px] text-[15px] font-bold"
                  style={{ backgroundColor: E.action, color: E.ink }}
                >
                  Try again
                </button>
              </div>
            </div>
          )}

          {stage === 'done' && (
            <div className="space-y-4">
              <div className="rounded-2xl p-6 text-center" style={{ backgroundColor: E.cream, color: E.onLight, border: `1px solid ${E.lineLight}` }}>
                <Check
                  className="mx-auto flex h-12 w-12 items-center justify-center rounded-full p-3"
                  style={{ backgroundColor: E.sand, color: E.greenDeep }}
                  strokeWidth={3}
                />
                <h1 className="mt-3 text-[20px] font-extrabold">You&apos;re in</h1>
                <p className="mt-1.5 text-[14px]" style={{ color: E.onLightMuted }}>
                  {plan.duration} of access is now active for{' '}
                  <span className="font-bold" style={{ color: E.onLight }}>
                    {email || 'your email'}
                  </span>
                  . A receipt is on its way. Nothing renews automatically.
                </p>
                <Link
                  href="/courses"
                  className="mt-5 flex h-[52px] w-full items-center justify-center gap-2 rounded-[12px] text-[16px] font-extrabold"
                  style={{ backgroundColor: E.action, color: E.ink }}
                >
                  Start learning <ChevronRight className="h-4 w-4" />
                </Link>
                <button
                  onClick={closeModal}
                  className="mt-2 flex h-[52px] w-full items-center justify-center gap-2 rounded-[12px] text-[16px] font-extrabold"
                  style={{ backgroundColor: E.paper, color: E.onLight, border: `1px solid ${E.lineLight}` }}
                >
                  See what&apos;s unlocked
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
