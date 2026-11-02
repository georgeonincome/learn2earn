'use client'

/**
 * BundleLanding — client shell for /bundle/[slug].
 * Mirrors reference BundleLanding-Dzk1kmnS.js:
 *   hero (name, tagline, anchor-strike price, tick features), earnings grid,
 *   purchase form (name/email → /api/payments/initiate type:"bundle"),
 *   instant-access info rows, FAQ accordion, WhatsApp support.
 * Meta pixel: ViewContent on mount, InitiateCheckout on form open/submit.
 */

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Check, ChevronDown, ShieldCheck, Smartphone, MessageCircle } from 'lucide-react'
import { trackViewContent, trackInitiateCheckout, trackPurchase } from '@/lib/marketing'

// Bundle supplied to the landing page — mirrors lib/server/bundles BundleWithCourses,
// serialized for client use.
export type BundleWithCoursesType = {
  id: string
  slug: string
  name: string
  tagline: string | null
  description: string | null
  price: number
  anchor_price: number | null
  courses: Array<{ id: string; slug: string; title: string; price: number; image: string | null }>
}

const TICKS = [
  { t: 'Lifetime access', d: 'Buy once. The courses stay in your dashboard, including every future update to the material.' },
  { t: 'Verified certificates', d: 'Finish a course, pass the assessment, and download a certificate with a public verification link.' },
  { t: 'Watch on any device', d: 'Phone, laptop or a computer bureau machine. Progress follows your account, not the device.' },
  { t: 'Downloadable templates', d: 'Proposals, content calendars, pricing sheets and checklists you can reuse with clients.' },
  { t: 'Direct instructor support', d: 'Ask questions on WhatsApp and get answers from George, not a support ticket queue.' },
  { t: 'Practical projects', d: 'Every course ends with something you built, so your portfolio grows while you learn.' },
]

const EARNINGS = [
  { t: 'Social media management (retainer)', d: 'Small business, per month', v: 'ZMW 2,325 – 5,425' },
  { t: 'Short-form video editing', d: 'Per finished video', v: 'ZMW 233 – 775' },
  { t: 'Brand design pack', d: 'Logo, colours, templates', v: 'ZMW 1,240 – 3,875' },
  { t: 'Virtual assistant support', d: 'Part-time, per month', v: 'ZMW 3,100 – 6,975' },
  { t: 'AI workflow setup', d: 'Per system, one payment', v: 'ZMW 1,550 – 4,650' },
]

const FAQS = [
  { q: 'Do I have to start on a specific date?', a: 'Nothing is scheduled and nothing expires. Follow the path or jump to what you need first.' },
  { q: 'How long do I keep access?', a: 'Lifetime. Buy once and every course in this bundle stays in your dashboard, including future updates.' },
  { q: "What if I already bought one of these courses?", a: 'You keep it. The bundle fills in everything else — you are never charged twice for a course you own.' },
  { q: 'Can I pay with mobile money?', a: 'Yes. MTN and Airtel mobile money are the first options at checkout, and card payments work too.' },
  { q: 'Do I get certificates?', a: 'Yes. Verified certificates with a public verification link for every course you complete.' },
  { q: 'What do I need to get started?', a: 'A smartphone or laptop and an internet connection. The courses assume no prior experience.' },
]

export function BundleLanding({ bundle }: { bundle: BundleWithCoursesType }) {
  const router = useRouter()
  const [formOpen, setFormOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({})
  const [busy, setBusy] = useState(false)
  const [fatal, setFatal] = useState<string | null>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    trackViewContent(bundle.name, bundle.price)
  }, [bundle.name, bundle.price])

  const pay = (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!name.trim()) errs.name = 'Enter your full name.'
    if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = 'Enter a valid email address.'
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    setBusy(true)
    trackInitiateCheckout(bundle.name, bundle.price)
    const eventId = `ic_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
    try {
      window.sessionStorage.setItem(`c2s_ic:${bundle.slug}`, eventId)
    } catch { /* ignore */ }

    fetch('/api/payments/initiate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'bundle',
        itemId: bundle.slug,
        email,
        fullName: name,
        meta: { meta_event_id: eventId, bundle_slug: bundle.slug },
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (!data.txRef) throw new Error(data.error || 'no reference')
        if (data.demo) {
          // Demo mode: settle immediately via the verify link, then show success.
          return fetch(data.link)
            .catch(() => null)
            .then(() => {
              trackPurchase(bundle.name, bundle.price, eventId)
              router.push(`/bundle-success?ref=${encodeURIComponent(data.txRef)}`)
            })
        }
        // Real Flutterwave link → hosted checkout; success lands on bundle-success?ref=
        trackPurchase(bundle.name, bundle.price, eventId)
        window.location.href = data.link
      })
      .catch(() => {
        setFatal('We could not start the payment. Please try again.')
        setBusy(false)
      })
  }

  return (
    <div className="min-h-screen bg-[#FCFCF9] text-[#10201A]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* hero */}
      <section className="bg-[#0A0D14] py-20 text-center text-white">
        <div className="mx-auto max-w-3xl px-5">
          <span className="mb-4 inline-block rounded-full bg-[#1DB96B]/20 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.14em] text-[#1DB96B]">
            Bundle
          </span>
          <h1 className="mb-4 text-3xl font-extrabold sm:text-5xl">{bundle.name}</h1>
          <p className="mb-8 text-lg text-[#A3A3A3]">{bundle.tagline ?? 'One payment. Every course in the bundle, for life.'}</p>
          <p className="mb-8 text-2xl font-extrabold">
            ZMW {bundle.price.toLocaleString('en-ZM')}{' '}
            {bundle.anchor_price ? (
              <span className="text-lg font-semibold text-[#6B7280] line-through">
                ZMW {Number(bundle.anchor_price).toLocaleString('en-ZM')}
              </span>
            ) : null}
          </p>
          {!formOpen ? (
            <button
              onClick={() => { setFormOpen(true); trackInitiateCheckout(bundle.name, bundle.price) }}
              className="rounded-xl px-8 py-4 text-base font-bold text-white transition-colors"
              style={{ backgroundColor: '#1DB96B' }}
            >
              Get instant access
            </button>
          ) : (
            <form onSubmit={pay} className="mx-auto mt-2 flex max-w-sm flex-col gap-3 text-left" suppressHydrationWarning>
              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-[50px] rounded-lg border border-[#E5E5E5] bg-white px-4 text-sm text-[#10201A]"
              />
              {errors.name && <p className="-mt-1 text-xs font-semibold text-[#DC2626]">{errors.name}</p>}
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-[50px] rounded-lg border border-[#E5E5E5] bg-white px-4 text-sm text-[#10201A]"
              />
              {errors.email && <p className="-mt-1 text-xs font-semibold text-[#DC2626]">{errors.email}</p>}
              <button
                type="submit"
                disabled={busy}
                className="h-[54px] rounded-lg px-6 text-base font-bold text-white"
                style={{ backgroundColor: '#1DB96B' }}
              >
                {busy ? 'Starting payment…' : `Pay ZMW ${bundle.price.toLocaleString('en-ZM')}`}
              </button>
              {fatal && <p className="text-xs font-semibold text-[#DC2626]">{fatal}</p>}
              <ul className="mt-3 space-y-1.5 text-xs text-[#A3A3A3]">
                <li className="flex items-center gap-1.5"><Smartphone className="h-3.5 w-3.5 text-[#1DB96B]" /> MTN / Airtel mobile money or card. One payment covers every course in the bundle.</li>
                <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-[#1DB96B]" /> Get instant access — your account is created automatically and all courses appear in your dashboard.</li>
                <li className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-[#1DB96B]" /> Nothing is scheduled and nothing expires. Follow the path or jump to what you need first.</li>
              </ul>
            </form>
          )}
        </div>
      </section>

      {/* course grid */}
      <section className="mx-auto max-w-5xl px-5 py-14">
        <h2 className="mb-6 text-2xl font-extrabold">Everything in "{bundle.name}"</h2>
        <div className="overflow-hidden rounded-2xl border border-[#E3E8E5] bg-white">
          {bundle.courses.map((c, i) => (
            <div key={c.id} className={`flex items-center justify-between gap-4 p-5 ${i > 0 ? 'border-t border-[#E3E8E5]' : ''}`}>
              <div>
                <div className="text-sm font-bold">Week {i + 1} — {c.title}</div>
                <div className="mt-1 text-xs text-[#5B6B64]">Sold separately: ZMW {c.price.toLocaleString('en-ZM')}</div>
              </div>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#E8F6EF] text-[#0B6B3D]">
                <Check className="h-4 w-4" strokeWidth={2.5} />
              </span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-[#5B6B64]">{bundle.description}</p>
      </section>

      {/* feature ticks */}
      <section className="mx-auto max-w-5xl px-5 pb-14">
        <div className="grid gap-4 sm:grid-cols-2">
          {TICKS.map((t) => (
            <div key={t.t} className="rounded-2xl border border-[#E3E8E5] bg-white p-5">
              <div className="mb-1 flex items-center gap-2 text-sm font-bold">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1DB96B] text-white">
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-3 w-3">
                    <path d="M4 10.5l4 4 8-9" />
                  </svg>
                </span>
                {t.t}
              </div>
              <p className="text-sm text-[#5B6B64]">{t.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* earnings grid */}
      <section className="mx-auto max-w-5xl px-5 pb-14">
        <h2 className="mb-2 text-2xl font-extrabold">What these skills earn</h2>
        <p className="mb-6 text-sm text-[#5B6B64]">Real service rates in Zambia once you finish the bundle.</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {EARNINGS.map((e) => (
            <div key={e.t} className="rounded-2xl border border-[#E3E8E5] bg-white p-5">
              <div className="text-sm font-bold">{e.t}</div>
              <div className="mt-1 text-xs text-[#5B6B64]">{e.d}</div>
              <div className="mt-3 text-base font-extrabold text-[#0B6B3D]">{e.v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-5 pb-16">
        <h2 className="mb-6 text-2xl font-extrabold">Common questions</h2>
        <div className="overflow-hidden rounded-2xl border border-[#E3E8E5] bg-white">
          {FAQS.map((f, i) => (
            <div key={f.q} className={i > 0 ? 'border-t border-[#E3E8E5]' : ''}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 p-5 text-left text-sm font-bold"
                aria-expanded={openFaq === i}
              >
                {f.q}
                <ChevronDown className={`h-4 w-4 shrink-0 text-[#5B6B64] transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === i && <p className="px-5 pb-5 text-sm text-[#5B6B64]">{f.a}</p>}
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <a
            href="https://wa.me/260774742019?text=Hi%20George%2C%20I%20have%20a%20question%20about%20the%20bundle"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0B6B3D] hover:underline"
          >
            <MessageCircle className="h-4 w-4" /> Ask George on WhatsApp
          </a>
          <Link href="/courses" className="text-sm text-[#5B6B64] hover:text-[#10201A] underline">
            Browse individual courses
          </Link>
        </div>
      </section>
    </div>
  )
}
