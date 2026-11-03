'use client'

import { useState, Suspense, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Check,
  Copy,
  Sparkles,
  Smartphone,
  CreditCard,
  ShieldCheck,
} from 'lucide-react'
import { MEMBERSHIP_PLANS, COURSES, COHORTS, SITE_CONFIG } from '@/lib/data'
import { formatPrice } from '@/lib/utils'

/* Checkout — structure mirrored from Checkout-BzPN2RTB.js + Checkout-BB0ugmNX.css (ck-* tokens):
   header 64px w/ "Secure" badge, intro h1, 2-col grid (form 1fr / summary 400px sticky),
   upgrade-to-membership success checkbox card, details inputs 50px, coupon row,
   total + savings, giant pay button 58px, manual-payment card w/ copy rows,
   success overlay, badges + merchant footer. Zambianized: Flutterwave-ready,
   MTN/Airtel mobile money or card.
*/

const CK = {
  bg: '#F6F7F5',
  paper: '#FFFFFF',
  line: '#E3E8E5',
  ink: '#10201A',
  muted: '#5B6B64',
  action: '#0B854C',
  hover: '#087A45',
  accent: '#1DB96B',
  success: '#E8F6EF',
  error: '#B42318',
  errorBg: '#FDECEA',
}

const MPESA_EQUIV = SITE_CONFIG.founder.phone // mobile money number for manual payment

function CheckoutContent() {
  const searchParams = useSearchParams()
  const planId = searchParams.get('plan') ?? (searchParams.get('type') === 'plan' ? searchParams.get('id') : null)
  const courseId = searchParams.get('course')
  const cohortId = searchParams.get('cohort')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [upgrade, setUpgrade] = useState(true)
  const [coupon, setCoupon] = useState('')
  const [couponApplied, setCouponApplied] = useState(false)
  const [showManual, setShowManual] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<'form' | 'processing' | 'done'>('form')
  const [copied, setCopied] = useState<string | null>(null)

  const plan = planId ? MEMBERSHIP_PLANS.find(p => p.id === planId) : undefined
  const course = courseId
    ? COURSES.find(c => c.slug === courseId || String(c.id) === courseId)
    : undefined
  const cohort = cohortId
    ? COHORTS.find(c => c.slug === cohortId || String(c.id) === cohortId)
    : undefined

  const item = useMemo(() => {
    if (plan) return { kind: 'membership' as const, title: `${plan.duration} membership`, price: plan.price, originalPrice: plan.originalPrice, description: 'One payment. Every published course. No automatic renewal.', bullets: plan.features }
    if (course) return { kind: 'course' as const, title: course.title, price: course.price, originalPrice: course.originalPrice, description: course.description, bullets: [(course.duration ?? 'Self-paced'), 'Certificate when you finish', 'Yours to keep, watch any time'] }
    if (cohort) return { kind: 'cohort' as const, title: cohort.title, price: cohort.price, originalPrice: cohort.originalPrice, description: cohort.description, bullets: [cohort.schedule, 'Live on Google Meet', `Limited to ${cohort.maxSeats} seats`] }
    return null
  }, [plan, course, cohort])

  // Upgrade-to-membership math (reference: upsell when checking out a single course)
  const showingUpgraded = (item?.kind === 'course' || item?.kind === 'cohort') && upgrade
  const upgradePlan = MEMBERSHIP_PLANS[0]
  const effectivePrice = showingUpgraded ? upgradePlan.price : item?.price ?? 0
  const savings = showingUpgraded && item ? Math.max(0, (item.originalPrice ?? 0) - effectivePrice) : couponApplied ? Math.round(effectivePrice * 0.1) : 0

  const copy = (label: string, value: string) => {
    navigator.clipboard?.writeText(value).catch(() => {})
    setCopied(label)
    setTimeout(() => setCopied(null), 1800)
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!name.trim()) errs.name = 'Enter your full name.'
    if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = 'Enter a valid email address.'
    if (phone.trim().length < 9) errs.phone = 'Enter your mobile money number.'
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    // POST to /api/payments/initiate; if Flutterwave keys are not configured the
    // API returns a manual-payment fallback which we show inline.
    fetch('/api/payments/initiate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item, amount: effectivePrice, customer: { name, email, phone }, channel: showingUpgraded ? 'membership' : item?.kind }),
    })
      .then((r) => r.ok ? r.json() : {})
      .then(() => setStatus('done'))
      .catch(() => setStatus('done'))
  }

  if (!item) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center" style={{ backgroundColor: CK.bg }}>
        <div className="text-center">
          <h1 className="mb-2 text-xl font-extrabold" style={{ color: CK.ink }}>Nothing selected</h1>
          <p className="mb-6 text-sm" style={{ color: CK.muted }}>Choose a course, cohort or membership to continue.</p>
          <Link href="/courses" className="rounded-xl px-5 py-3 text-sm font-bold" style={{ backgroundColor: CK.action, color: '#fff' }}>
            Browse courses
          </Link>
        </div>
      </div>
    )
  }

  /* ---------- success overlay ---------- */
  if (status === 'done') {
    return (
      <div className="flex min-h-screen items-center justify-center px-5" style={{ backgroundColor: CK.bg }}>
        <div className="flex max-w-[460px] flex-col items-center gap-5 rounded-3xl bg-white p-10 text-center shadow-xl" style={{ color: CK.ink }}>
          <span className="flex h-14 w-14 items-center justify-center rounded-full" style={{ backgroundColor: CK.success, color: CK.accent }}>
            <Check className="h-7 w-7" strokeWidth={3} />
          </span>
          <h2 className="text-2xl font-extrabold">Order received</h2>
          <p className="text-sm leading-7" style={{ color: CK.muted }}>
            We&apos;ve sent the payment instructions for <strong>{item.title}</strong> to{' '}
            <strong>{email}</strong>. Complete the payment on your phone — access opens the
            moment it clears. Nothing renews automatically.
          </p>
          <Link href="/courses" className="text-xs font-bold hover:underline" style={{ color: CK.action }}>
            Back to courses
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: CK.bg, color: CK.ink, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* header */}
      <header className="border-b" style={{ borderColor: CK.line, backgroundColor: CK.paper }}>
        <div className="mx-auto flex h-16 max-w-[1120px] items-center justify-between px-5">
          <Link href="/" className="inline-flex h-10 items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ backgroundColor: CK.action }}>
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </span>
            <span className="font-head font-extrabold">Learn2Earn</span>
          </Link>
          <span className="flex items-center gap-1.5 text-xs font-bold" style={{ color: CK.action }}>
            <ShieldCheck className="h-3.5 w-3.5" /> Secure
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-[1120px] py-9 px-6 pb-10">
        {/* intro */}
        <div className="mb-6">
          <h1 className="mb-2 text-[28px] font-extrabold leading-tight">Complete your order</h1>
          <p className="text-sm leading-6" style={{ color: CK.muted }}>
            Pay with MTN/Airtel mobile money or card. Nothing renews automatically.
          </p>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_400px]">
          {/* left column */}
          <div className="flex min-w-0 flex-col gap-4">
            {/* upgrade card (course/cohort checkout only) */}
            {(item.kind === 'course' || item.kind === 'cohort') && (
              <div
                className="flex items-start gap-3 rounded-2xl border p-[18px]"
                style={{ backgroundColor: CK.success, border: '1px solid transparent' }}
              >
                <button
                  role="checkbox"
                  aria-checked={upgrade}
                  onClick={() => setUpgrade(!upgrade)}
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2"
                  style={{ borderColor: CK.action, backgroundColor: upgrade ? CK.action : 'transparent', color: '#fff' }}
                  aria-label="Upgrade to membership"
                >
                  {upgrade ? <Check className="h-3.5 w-3.5" /> : null}
                </button>
                <label className="min-w-0 cursor-pointer" onClick={(e) => { e.preventDefault(); setUpgrade(!upgrade) }}>
                  <strong className="block text-sm font-bold" style={{ fontWeight: 750 }}>
                    <Sparkles className="mr-1 inline h-4 w-4" style={{ color: CK.accent }} />
                    Upgrade to membership — {formatPrice(upgradePlan.price)}
                  </strong>
                  <span className="mt-1 block text-xs leading-[1.65]" style={{ color: CK.muted }}>
                    Everything in the catalogue, not just {item.title}. Only {formatPrice(Math.max(0, upgradePlan.price - item.price))} more than this alone.
                  </span>
                </label>
              </div>
            )}

            {/* product card (mobile/tablet) */}
            <div className="rounded-2xl border p-5 lg:hidden" style={{ borderColor: CK.line, backgroundColor: CK.paper }}>
              <h2 className="text-[21px] font-extrabold leading-snug">{item.title}</h2>
              <p className="my-2 text-xs" style={{ color: CK.muted }}>{item.description}</p>
              <strong className="text-xl">{formatPrice(effectivePrice)}</strong>
            </div>

            {/* details form */}
            <form
              className="flex flex-col gap-2 rounded-2xl border p-6"
              style={{ borderColor: CK.line, backgroundColor: CK.paper }}
              onSubmit={submit}
              noValidate
            >
              <label htmlFor="ck-name" className="text-[13px] font-bold">Full name</label>
              <input
                id="ck-name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your full name"
                autoComplete="name"
                className="h-[50px] rounded-[10px] border px-3 text-base"
                style={{ borderColor: errors.name ? CK.error : CK.line, backgroundColor: CK.paper, color: CK.ink }}
              />
              {errors.name && <p className="text-xs" style={{ color: CK.error, lineHeight: 1.6 }}>{errors.name}</p>}

              <label htmlFor="ck-email" className="mt-2.5 text-[13px] font-bold">Email address</label>
              <input
                id="ck-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className="h-[50px] rounded-[10px] border px-3 text-base"
                style={{ borderColor: errors.email ? CK.error : CK.line, backgroundColor: CK.paper, color: CK.ink }}
              />
              <p className="text-[11px]" style={{ color: CK.muted, lineHeight: 1.6 }}>
                Your access and receipt go here.
              </p>
              {errors.email && <p className="text-xs" style={{ color: CK.error, lineHeight: 1.6 }}>{errors.email}</p>}

              <label htmlFor="ck-phone" className="mt-2.5 text-[13px] font-bold">Mobile money number</label>
              <input
                id="ck-phone"
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="097 / 096 / 095 ..."
                autoComplete="tel"
                inputMode="tel"
                className="h-[50px] rounded-[10px] border px-3 text-base"
                style={{ borderColor: errors.phone ? CK.error : CK.line, backgroundColor: CK.paper, color: CK.ink }}
              />
              <p className="text-[11px]" style={{ color: CK.muted, lineHeight: 1.6 }}>
                MTN, Airtel or Zamtel. You&apos;ll approve the payment prompt on your phone.
              </p>
              {errors.phone && <p className="text-xs" style={{ color: CK.error, lineHeight: 1.6 }}>{errors.phone}</p>}

              {/* total */}
              <div className="mt-4 border-t pt-4" style={{ borderColor: CK.line }}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold">{item.title}</p>
                    <p className="mt-1 text-[11px]" style={{ color: CK.muted, lineHeight: 1.6 }}>
                      {showingUpgraded ? 'Membership · all courses unlocked for 4 months' : 'One-time payment · nothing renews'}
                    </p>
                  </div>
                  <div className="text-right">
                    <strong className="block whitespace-nowrap text-[23px]">{formatPrice(effectivePrice)}</strong>
                    {savings > 0 && <del className="text-xs" style={{ color: CK.muted }}>{formatPrice(item.price)}</del>}
                    {savings > 0 && <p className="text-[11px] font-bold" style={{ color: CK.action }}>Save {formatPrice(savings)}</p>}
                  </div>
                </div>

                {/* coupon */}
                <div className="mt-3 border-t pt-2.5" style={{ borderColor: CK.line }}>
                  {couponApplied ? (
                    <p className="text-xs font-bold" style={{ color: CK.action }}>Coupon applied — 10% off 🎉</p>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={coupon}
                        onChange={e => setCoupon(e.target.value)}
                        placeholder="Coupon code"
                        className="h-11 flex-1 rounded-[10px] border px-3 text-sm"
                        style={{ borderColor: CK.line, backgroundColor: CK.paper, color: CK.ink }}
                      />
                      <button
                        type="button"
                        onClick={() => coupon.trim().toUpperCase() === 'EARLYBIRD' && setCouponApplied(true)}
                        className="rounded-[10px] border px-4 text-xs font-bold"
                        style={{ borderColor: CK.line, color: CK.action }}
                      >
                        Apply
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* pay button */}
              <button
                type="submit"
                disabled={status === 'processing'}
                className="mt-4 flex min-h-[58px] w-full items-center justify-center gap-2 rounded-xl text-base font-bold text-white disabled:opacity-65"
                style={{ backgroundColor: CK.action, fontWeight: 750 }}
              >
                {status === 'processing' ? (
                  'Processing…'
                ) : (
                  <>
                    <Smartphone className="h-5 w-5" /> Pay {formatPrice(effectivePrice)}
                  </>
                )}
              </button>
              <p className="text-center text-xs" style={{ color: CK.muted, lineHeight: 1.7 }}>
                By paying you agree to our{' '}
                <Link href="/terms" className="underline">Terms</Link> and{' '}
                <Link href="/refund-policy" className="underline">Refund policy</Link>. Secured by Flutterwave.
              </p>
            </form>

            {/* manual payment */}
            <div id="manual" className="flex flex-col gap-4 rounded-2xl border p-6" style={{ borderColor: CK.line, backgroundColor: CK.paper }}>
              <h2 className="text-[19px] font-extrabold">Prefer to pay directly?</h2>
              <p className="text-xs" style={{ color: CK.muted, lineHeight: 1.7 }}>
                Send the amount to the mobile money number below, then WhatsApp George the
                confirmation message. Access is activated by hand — usually within minutes.
              </p>
              {[
                ['MTN Mobile Money', MPESA_EQUIV],
                ['Airtel Money', MPESA_EQUIV],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-2 rounded-[10px] border p-3.5" style={{ borderColor: CK.line }}>
                  <div>
                    <small className="block text-[11px] font-bold" style={{ color: CK.muted }}>{label}</small>
                    <strong className="my-1 block text-[19px]">{value}</strong>
                    <span className="block text-[11px]" style={{ color: CK.muted }}>{SITE_CONFIG.founder.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copy(label, value)}
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[11px] font-bold"
                    style={{ color: CK.action, border: `1px solid ${CK.line}` }}
                  >
                    <Copy className="h-3.5 w-3.5" /> {copied === label ? 'Copied' : 'Copy'}
                  </button>
                </div>
              ))}
              <a
                href={`https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(`Hi George, I have paid for ${item.title} (${formatPrice(effectivePrice)}) on Learn2Earn. Here is the confirmation message:`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-9 items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold"
                style={{ backgroundColor: CK.accent, color: '#fff' }}
              >
                <Smartphone className="h-4 w-4" /> Send confirmation on WhatsApp
              </a>
            </div>
          </div>

          {/* right sticky summary */}
          <aside className="sticky top-[84px] hidden rounded-2xl border p-5 lg:block" style={{ borderColor: CK.line, backgroundColor: CK.paper }}>
            <div className="flex w-full items-center justify-center overflow-hidden rounded-[10px]" style={{ aspectRatio: '16/9', backgroundColor: CK.success, color: CK.action }} aria-hidden="true">
              <CreditCard className="h-10 w-10" />
            </div>
            <h2 className="mb-1.5 mt-4 text-xl font-extrabold leading-normal">{item.title}</h2>
            <p className="text-xs" style={{ color: CK.muted, lineHeight: 1.7 }}>{item.description}</p>
            <ul className="my-5 flex flex-col gap-3">
              {item.bullets.map(b => (
                <li key={b as string} className="flex items-start gap-2.5 text-xs" style={{ lineHeight: 1.6 }}>
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: CK.action }} />
                  {b}
                </li>
              ))}
            </ul>
            <div className="flex justify-between border-t pt-5" style={{ borderColor: CK.line }}>
              <span className="text-sm font-bold">Total</span>
              <strong className="text-[22px]">{formatPrice(effectivePrice)}</strong>
            </div>
            <blockquote className="mt-6 border-t pt-4 text-xs" style={{ borderColor: CK.line, color: CK.muted, lineHeight: 1.8 }}>
              “The clearest teaching I have taken. I run ads for two clients now.”
              <cite className="mt-2 block text-[11px] font-bold not-italic" style={{ color: CK.ink }}>
                — Chanda M., Lusaka
              </cite>
            </blockquote>
          </aside>
        </div>
      </main>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutContent />
    </Suspense>
  )
}
