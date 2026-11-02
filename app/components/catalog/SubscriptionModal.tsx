'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import {
  Loader2,
  Lock,
  Check,
  ChevronRight,
  ShieldCheck,
  RotateCcw,
  PartyPopper,
  ArrowLeft,
  X,
} from 'lucide-react'
import { MEMBERSHIP_PLANS, SITE_CONFIG } from '@/lib/data'
import { formatPrice } from '@/lib/utils'

/* SubscriptionModal — exact 1:1 from reference SubscribeDialog-BgKSf8GX.js
   States: form → verifying → success / failed
   Paystack for card, M-Pesa fallback via mobile money
   Clean form → verifying → success / failed flow
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
  error: '#EF4444',
  errorBg: '#FEF7F6',
}

interface SubscriptionModalProps {
  course: { slug: string; title: string; price: number; referenceSale?: number; monthlySubPrice?: number }
  onClose: () => void
}

export default function SubscriptionModal({ course, onClose }: SubscriptionModalProps) {
  const [planCode, setPlanCode] = useState(MEMBERSHIP_PLANS.find(p => p.popular)?.id ?? MEMBERSHIP_PLANS[0].id)
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState<string | null>(null)
  const [stage, setStage] = useState<'form' | 'verifying' | 'failed' | 'success'>('form')
  const [processing, setProcessing] = useState(false)
  const [failedReason, setFailedReason] = useState<string | null>(null)
  const [secondsLeft, setSecondsLeft] = useState(120)

  const verifyIntervalRef = useRef<number | null>(null)
  const countdownIntervalRef = useRef<number | null>(null)

  const plan = MEMBERSHIP_PLANS.find(p => p.id === planCode) ?? MEMBERSHIP_PLANS[0]
  const total = formatPrice(plan.price)
  const perMonth = Math.round(plan.price / (plan.id === 'yearly' ? 12 : 4))
  const days = plan.id === 'yearly' ? 365 : 120

  const coursePrice = course.referenceSale ?? course.price
  const showingUpgrade = coursePrice > 0
  const upgradeOnlyMore = Math.max(0, plan.price - coursePrice)

  const verifyPayment = useCallback(async (reference: string) => {
    try {
      const response = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference }),
      })
      const data = await response.json()
      if (data.status === 'completed') {
        return 'success'
      } else if (data.status === 'failed') {
        return 'failed'
      }
      return 'pending'
    } catch {
      return 'pending'
    }
  }, [])

  const countdown = useCallback(() => {
    if (countdownIntervalRef.current) window.clearInterval(countdownIntervalRef.current)
    countdownIntervalRef.current = window.setInterval(() => {
      setSecondsLeft(s => Math.max(0, s - 1))
    }, 1000)
  }, [])

  const startVerification = useCallback((reference: string) => {
    setStage('verifying')
    countdown()

    if (verifyIntervalRef.current) window.clearInterval(verifyIntervalRef.current)
    verifyIntervalRef.current = window.setInterval(async () => {
      const status = await verifyPayment(reference)
      if (status === 'success') {
        if (verifyIntervalRef.current) window.clearInterval(verifyIntervalRef.current)
        if (countdownIntervalRef.current) window.clearInterval(countdownIntervalRef.current)
        setStage('success')
      } else if (status === 'failed') {
        if (verifyIntervalRef.current) window.clearInterval(verifyIntervalRef.current)
        if (countdownIntervalRef.current) window.clearInterval(countdownIntervalRef.current)
        setStage('failed')
        setFailedReason('The payment did not go through.')
      }
    }, 3000)
  }, [])

  const startPayment = () => {
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError('Enter a valid email — your receipt goes here.')
      return
    }
    setEmailError(null)
    setProcessing(true)
    setFailedReason(null)

    // Call Flutterwave/Paystack charge endpoint
    fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: plan.id, email }),
    })
      .then(r => r.json())
      .then(data => {
        setProcessing(false)
        if (data.link && data.txRef) {
          // Open Paystack/Flutterwave popup
          const width = 600
          const height = 700
          const left = window.screenX + (window.outerWidth - width) / 2
          const top = window.screenY + (window.outerHeight - height) / 2
          const popup = window.open(data.link, 'flutterwave-pay', `width=${width},height=${height},left=${left},top=${top}`)
          if (popup) {
            setStage('verifying')
            startVerification(data.txRef)
          } else {
            setProcessing(false)
            setStage('failed')
            setFailedReason('Popup blocked. Please allow popups for this site.')
          }
        } else if (data.manual) {
          // Manual payment fallback
          setProcessing(false)
          setFailedReason(data.message || 'Manual payment required')
          setStage('failed')
        } else {
          setProcessing(false)
          setStage('failed')
          setFailedReason(data.error || 'Payment initiation failed')
        }
      })
      .catch(() => {
        setProcessing(false)
        setStage('failed')
        setFailedReason('Could not start payment. Please try again.')
      })
  }

  const closeModal = () => {
    if (verifyIntervalRef.current) window.clearInterval(verifyIntervalRef.current)
    if (countdownIntervalRef.current) window.clearInterval(countdownIntervalRef.current)
    setStage('form')
    setEmail('')
    setEmailError(null)
    setProcessing(false)
    setFailedReason(null)
    onClose()
  }

  // Cleanup on unmount
  useEffect(() => () => {
    if (verifyIntervalRef.current) window.clearInterval(verifyIntervalRef.current)
    if (countdownIntervalRef.current) window.clearInterval(countdownIntervalRef.current)
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="subscription-modal-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={closeModal}
        aria-hidden="true"
      />
      {/* Modal panel */}
      <div
        className="relative w-full max-w-[480px] mx-auto rounded-2xl border"
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
          {/* Form state */}
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

              {/* Upgrade summary when buying a single course */}
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
                      border: `1px solid ${emailError ? E.error : E.lineLight}`,
                      color: E.onLight,
                    }}
                  />
                  <p className={`mt-1.5 text-[12px] ${emailError ? `text-[${E.error}]` : ''}`} style={emailError ? undefined : { color: E.onLightMuted }}>
                    {emailError ?? 'Your access and receipt go here.'}
                  </p>
                </div>

                <button
                  onClick={startPayment}
                  disabled={processing}
                  className="h-[52px] w-full items-center justify-center gap-2 rounded-[12px] text-[16px] font-extrabold disabled:opacity-70"
                  style={{ backgroundColor: E.action, color: E.ink }}
                >
                  {processing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Lock className="h-4 w-4" />}
                  Pay {total}
                </button>
                <p className="text-center text-[12px]" style={{ color: E.onLightMuted }}>
                  Secured by Flutterwave · you are charged once, nothing recurring.
                </p>
              </div>
            </div>
          )}

          {/* Verifying state — Paystack popup open, polling for confirmation */}
          {stage === 'verifying' && (
            <div className="rounded-2xl p-6 text-center" style={{ backgroundColor: E.cream, color: E.onLight, border: `1px solid ${E.lineLight}` }}>
              <Loader2 className="mx-auto h-9 w-9 animate-spin" style={{ color: E.green }} />
              <h1 className="mt-4 text-[20px] font-extrabold">Confirming your payment</h1>
              <p className="mt-1 text-[14px]" style={{ color: E.onLightMuted }}>
                Finish the payment in the Flutterwave window. If you chose mobile money, complete it on your phone.
              </p>
              <div className="mt-4 font-mono text-[18px] font-bold" style={{ color: E.onLight }}>
                {Math.floor(secondsLeft / 60).toString().padStart(2, '0')}:{String(secondsLeft % 60).padStart(2, '0')} left
              </div>
            </div>
          )}

          {/* Failed state */}
          {stage === 'failed' && (
            <div className="rounded-2xl p-6" style={{ backgroundColor: E.cream, color: E.onLight, border: `1px solid ${E.lineLight}` }}>
              <h1 className="text-[20px] font-extrabold">Payment not completed</h1>
              <p className="mt-1.5 text-[14px]" style={{ color: E.onLightMuted }}>
                {failedReason ?? 'The payment did not go through.'}{' '}
                <span className="font-semibold" style={{ color: E.onLight }}>
                  Nothing has been charged.
                </span>
              </p>
              <div className="mt-5 space-y-2.5">
                <button
                  onClick={() => {
                    setStage('form')
                    setFailedReason(null)
                    setProcessing(false)
                  }}
                  className="h-[47px] w-full rounded-[10px] text-[15px] font-bold"
                  style={{ backgroundColor: E.action, color: E.ink }}
                >
                  Try again
                </button>
                <p className="rounded-xl px-4 py-3 text-[13px]" style={{ backgroundColor: E.sand, color: E.onLightMuted }}>
                  Or pay manually to MTN/Airtel{' '}
                  <span className="font-bold" style={{ color: E.onLight }}>
                    {SITE_CONFIG.founder.phone}
                  </span>{' '}
                  and send the confirmation message on WhatsApp — we activate it by hand.
                </p>
              </div>
            </div>
          )}

          {/* Success state */}
          {stage === 'success' && (
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
              <div className="rounded-2xl p-5" style={{ backgroundColor: E.cream, color: E.onLight, border: `1px solid ${E.lineLight}` }}>
                <p className="text-[14px] font-bold">Certificate name</p>
                <p className="mt-1 text-[12px]" style={{ color: E.onLightMuted }}>
                  What name should we put on your certificates? You can change this later.
                </p>
                <input
                  type="text"
                  placeholder="Your full name"
                  className="mt-3 h-[48px] w-full rounded-[12px] px-3.5 text-[15px]"
                  style={{ backgroundColor: E.paper, border: `1px solid ${E.lineLight}`, color: E.onLight }}
                />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}