'use client'

import { useState, Suspense, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Loader2,
  RotateCcw,
  PartyPopper,
  Lock,
} from 'lucide-react'
import { MEMBERSHIP_PLANS, SITE_CONFIG } from '@/lib/data'
import { formatPrice } from '@/lib/utils'

/* Subscribe page — structure mirrored from Subscribe-DucfmV4N.js (echelon-checkout):
   mobile-first compact checkout, max-w 480px, ec-* classes:
     ec-head (ink-raised bg) · ec-card (cream) · ec-muted / ec-muted-dark
     ec-select (paper) · ec-primary (action) · ec-green (green-deep)
     ec-total (sand) · ec-bar (ink-raised)
   states: form → waiting → failed → code → success (post-payment profile cards)
   Zambianized: Paystack → Flutterwave, M-Pesa Till → MTN/Airtel manual.
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

const firstName = SITE_CONFIG.founder.name.split(' ').slice(-1).join(' ')

function SubscribeContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const requestedPlan = searchParams.get('plan')

  const [planCode, setPlanCode] = useState(
    requestedPlan ?? MEMBERSHIP_PLANS.find(p => p.popular)?.id ?? MEMBERSHIP_PLANS[0].id,
  )
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState<string | null>(null)
  const [stage, setStage] = useState<'form' | 'waiting' | 'failed' | 'code' | 'done'>('form')
  const [processing, setProcessing] = useState(false)
  const [failedReason, setFailedReason] = useState<string | null>(null)
  const [secondsLeft, setSecondsLeft] = useState(600)

  const plan =
    MEMBERSHIP_PLANS.find(p => p.id === planCode) ??
    MEMBERSHIP_PLANS[0]
  const total = formatPrice(plan.price)
  const perMonth = Math.round(plan.price / (plan.id === 'yearly' ? 12 : 4))
  const days = plan.id === 'yearly' ? 365 : 120
  const savingsPct =
    plan.originalPrice ? Math.round((1 - plan.price / plan.originalPrice) * 100) : 0

  useEffect(() => {
    if (stage !== 'waiting') return
    const t = setInterval(() => setSecondsLeft(s => Math.max(0, s - 1)), 1000)
    return () => clearInterval(t)
  }, [stage])

  const pay = () => {
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError('Enter a valid email — your receipt goes here.')
      return
    }
    setEmailError(null)
    setProcessing(true)
    // Flutterwave manual-flow parity: without live keys, the API responds with a
    // pending instruction; we show the waiting state exactly like the reference.
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
        setFailedReason('We could not reach the payment service.')
        setStage('failed')
      })
  }

  return (
    <div
      className="min-h-[100dvh]"
      style={{ backgroundColor: E.ink, color: E.onDark, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* ---- ec-head ---- */}
      <header style={{ backgroundColor: E.inkRaised, borderBottom: `1px solid ${E.lineDark}` }}>
        <div className="mx-auto flex h-14 w-full max-w-[480px] items-center justify-between px-5">
          <button
            onClick={() => router.back()}
            className="-ml-3 flex h-11 w-11 items-center justify-center rounded-lg"
            style={{ color: E.onDarkMuted }}
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <Link href="/" className="font-head text-lg font-extrabold" style={{ color: E.onDark }}>
            Learn2Earn
          </Link>
          <span className="flex items-center gap-1.5 text-[12px] font-semibold" style={{ color: E.greenDeep === E.greenDeep ? E.green : E.green }}>
            <ShieldCheck className="h-3.5 w-3.5" /> Secure
          </span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[480px] px-5 pb-40 pt-6">
        {stage === 'form' && (
          <div
            className="rounded-2xl p-5"
            style={{ backgroundColor: E.cream, color: E.onLight, border: `1px solid ${E.lineLight}` }}
          >
            <div className="flex items-center justify-between gap-3">
              <p
                className="text-[11.5px] font-bold uppercase tracking-[0.1em]"
                style={{ color: E.onLightMuted }}
              >
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
                value={plan.id}
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
              <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 opacity-60" />
            </div>
            <p className="mt-1.5 text-[12px]" style={{ color: E.onLightMuted }}>
              {days} days · ZMW {perMonth.toLocaleString('en-ZM')}/month · everything unlocked. One
              payment, no auto renewal.
            </p>

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

              <div
                className="flex items-center justify-between rounded-[12px] px-4 py-3"
                style={{ backgroundColor: E.sand, color: E.onLight }}
              >
                <span className="text-[13px] font-semibold">{plan.name}</span>
                <span className="text-[17px] font-extrabold">{total}</span>
              </div>

              <button
                onClick={pay}
                disabled={processing}
                className="hidden h-[52px] w-full items-center justify-center gap-2 rounded-[12px] text-[16px] font-extrabold disabled:opacity-70 md:flex"
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
          <div
            className="rounded-2xl p-6 text-center"
            style={{ backgroundColor: E.cream, color: E.onLight, border: `1px solid ${E.lineLight}` }}
          >
            <Loader2 className="mx-auto h-9 w-9 animate-spin" style={{ color: E.green }} />
            <h1 className="mt-4 text-[20px] font-extrabold">Confirming your payment</h1>
            <p className="mt-1 text-[14px]" style={{ color: E.onLightMuted }}>
              Finish the payment in the mobile money window. If you chose card, complete it in the
              Flutterwave window.
            </p>
            <ol className="mx-auto mt-5 max-w-[280px] space-y-2.5 text-left">
              {['Payment started', 'Waiting for confirmation', 'Unlocking everything'].map((t, i) => (
                <li key={t} className="flex items-center gap-2.5 text-[13px]">
                  <span
                    className="flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold"
                    style={
                      i === 0
                        ? { backgroundColor: E.green, color: E.cream }
                        : { backgroundColor: E.sand, color: E.onLightMuted }
                    }
                  >
                    {i === 0 ? <Check className="h-3 w-3" strokeWidth={3} /> : i + 1}
                  </span>
                  <span style={i === 0 ? { color: E.onLight, fontWeight: 600 } : { color: E.onLightMuted }}>
                    {t}
                  </span>
                </li>
              ))}
            </ol>
            <p className="mt-5 text-[13px] font-semibold" style={{ color: E.onLightMuted }}>
              {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, '0')} left
            </p>
            {secondsLeft <= 540 && (
              <button
                onClick={() => setStage('form')}
                className="mx-auto mt-3 flex items-center gap-1.5 text-[13px] font-semibold hover:underline"
                style={{ color: E.greenDeep }}
              >
                <RotateCcw className="h-3.5 w-3.5" /> Nothing happened? Try again
              </button>
            )}
          </div>
        )}

        {stage === 'failed' && (
          <div
            className="rounded-2xl p-6"
            style={{ backgroundColor: E.cream, color: E.onLight, border: `1px solid ${E.lineLight}` }}
          >
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
                and send the confirmation message to {firstName} on WhatsApp — we activate it by
                hand.
              </p>
            </div>
          </div>
        )}

        {stage === 'code' && (
          <div
            className="rounded-2xl p-6 text-center"
            style={{ backgroundColor: E.cream, color: E.onLight, border: `1px solid ${E.lineLight}` }}
          >
            <PartyPopper className="mx-auto h-8 w-8" style={{ color: E.green }} />
            <h1 className="mt-3 text-[20px] font-extrabold">Payment received</h1>
            <p className="mt-1.5 text-[14px]" style={{ color: E.onLightMuted }}>
              Your subscription has been added to your existing account. Enter the code we just sent
              to{' '}
              <span className="font-bold" style={{ color: E.onLight }}>
                {email}
              </span>{' '}
              to open it.
            </p>
            <Link
              href="/auth"
              className="mx-auto mt-5 flex h-[47px] w-full items-center justify-center rounded-[10px] text-[15px] font-bold"
              style={{ backgroundColor: E.greenDeep, color: E.cream }}
            >
              Sign in to continue
            </Link>
            <p className="mt-4 text-[12px]" style={{ color: E.onLightMuted }}>
              Your subscription is already active either way. Nothing is waiting on this code.
            </p>
          </div>
        )}

        {stage === 'done' && (
          <div className="space-y-4">
            <div
              className="rounded-2xl p-6 text-center"
              style={{ backgroundColor: E.cream, color: E.onLight, border: `1px solid ${E.lineLight}` }}
            >
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
              <Link
                href="/courses"
                className="mt-2 flex h-[52px] w-full items-center justify-center gap-2 rounded-[12px] text-[16px] font-extrabold"
                style={{ backgroundColor: E.paper, color: E.onLight, border: `1px solid ${E.lineLight}` }}
              >
                See what&apos;s unlocked
              </Link>
            </div>
            <div
              className="rounded-2xl p-5"
              style={{ backgroundColor: E.cream, color: E.onLight, border: `1px solid ${E.lineLight}` }}
            >
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

      {/* ---- ec-bar (mobile sticky pay) ---- */}
      {stage === 'form' && (
        <div
          className="fixed inset-x-0 bottom-0 z-40 p-4 md:hidden"
          style={{ backgroundColor: E.inkRaised, borderTop: `1px solid ${E.lineDark}` }}
        >
          <button
            onClick={pay}
            disabled={processing}
            className="flex h-[52px] w-full items-center justify-center gap-2 rounded-[12px] text-[16px] font-extrabold disabled:opacity-70"
            style={{ backgroundColor: E.action, color: E.ink }}
          >
            {processing ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Lock className="h-4 w-4" />
            )}
            Pay {total}
          </button>
        </div>
      )}
    </div>
  )
}

export default function SubscribePage() {
  return (
    <Suspense fallback={null}>
      <SubscribeContent />
    </Suspense>
  )
}
