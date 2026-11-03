import Link from 'next/link'
import {
  Play, Check, X, Lock, ShieldCheck, Users, Rocket, Wallet,
  BadgeCheck, PlayCircle, Smartphone,
} from 'lucide-react'
import { ExitIntentOffer, CountdownBadge } from '@/components/landings/offers'

/**
 * First50kLanding — 1:1 port of reference First50kLanding-B1y0MbS5.js
 * (course id 439b767a-5cce-4aa5-b5eb-faf75862703b).
 * Zambianized: Elvis → George, KES 50,000 → ZMW 50,000, M-Pesa/Paystack →
 * MTN/Airtel money or card via Flutterwave, wa.me → +260. Exit-intent modal
 * and 24h countdown carried over from the reference offer mechanics.
 */

const hero = {
  badge: 'NEW CLASS',
  titleA: 'Make Your First',
  titleB: 'ZMW 50,000 Online',
  titleC: 'Without Learning New Skills',
  subtitle: "If you already have a skill but you're still not earning from it — this is the missing piece.",
  stats: [
    { icon: Play, label: 'Video Lessons' },
    { icon: BadgeCheck, label: 'Lifetime Access' },
  ],
}

const insideCourse = [
  'Why having skills alone does not guarantee income',
  'The Skill → Problem → Offer → Client → Payment framework',
  "Skills that can make money fast in today's market",
  'How to choose one skill and focus for faster results',
  'Why execution matters more than perfection',
  'How to approach freelancing and service work the right way',
]

const isFor = [
  'You have a phone or laptop and internet access',
  "You're tired of consuming content without results",
  "You want to start earning online, even as a beginner",
  "You're willing to take action before feeling 'ready'",
]

const notFor = [
  "You're looking for quick riches without effort",
  "You're not willing to practice what you learn",
  'You want guarantees instead of responsibility',
]

const firstLesson = [
  'Why most people have skills but still struggle financially',
  'The difference between having a skill and offering a solution',
  'Why the world pays for problems solved, not talent alone',
  'How to package and sell your services the right way',
  'How to approach the course for maximum results',
]

const lessonsIntro = [
  'Welcome & The Reality of Making Money Online',
  'Why Most People Stay Broke Online',
]

const previews = [
  { label: 'Your Learning Dashboard', icon: Users },
  { label: 'HD Video Lessons', icon: Play },
  { label: 'Course Content & Lessons', icon: Rocket },
  { label: 'Track Your Progress', icon: BadgeCheck },
]

const faqs = [
  {
    q: 'Do I need experience to take this course?',
    a: "No, you don't need any prior experience. This course is designed for beginners who want to start earning online using skills they already have or can quickly learn.",
  },
  {
    q: 'How long do I have access to the course?',
    a: "You get lifetime access to all course content through Learn2Earn. This includes any future updates or additions to the course at no extra cost.",
  },
  {
    q: "What if I don't have any skills yet?",
    a: 'The course will help you identify skills you already have but haven\'t recognized as valuable. We also cover skills that are quick to learn and in high demand.',
  },
  {
    q: 'Can I really make ZMW 50,000 online?',
    a: 'Yes, but it requires consistent action. This course gives you the exact framework and strategies, but your results depend on how well you implement what you learn.',
  },
  {
    q: 'What payment methods are accepted?',
    a: 'We accept MTN and Airtel mobile money and all major debit/credit cards (Visa, Mastercard). Payment is processed securely through Flutterwave.',
  },
]

export default function First50kLanding() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-gray-100 antialiased">
      <ExitIntentOffer
        title="Don't Leave Empty-Handed!"
        saveText="Save on your enrollment today"
        ctaText="Enroll Me Now"
        ctaHref="/checkout?course=how-to-make-your-first-kes-50000"
      />

      {/* hero */}
      <section className="bg-gradient-to-br from-emerald-950/50 via-[#0A0A0A] to-emerald-900/30 px-4 py-16 md:py-24">
        <div className="mx-auto max-w-5xl text-center">
          <span className="mb-4 inline-block rounded-full bg-[#1DB96B]/20 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.14em] text-[#1DB96B]">
            {hero.badge} • Start Learning Immediately
          </span>
          <h1 className="mx-auto mb-4 max-w-3xl text-4xl font-extrabold leading-[1.08] sm:text-6xl">
            {hero.titleA} <span className="text-[#1DB96B]">{hero.titleB}</span> {hero.titleC}
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-gray-400">{hero.subtitle}</p>
          <div className="mb-8 flex items-center justify-center gap-6">
            {hero.stats.map(({ icon: Icon, label }) => (
              <span key={label} className="flex items-center gap-2 text-sm text-gray-300">
                <Icon className="h-4 w-4 text-[#1DB96B]" /> {label}
              </span>
            ))}
          </div>
          <CountdownBadge />
          <div className="mx-auto mt-8 max-w-md">
            <Link
              href="/checkout?course=how-to-make-your-first-kes-50000"
              className="flex w-full items-center justify-center rounded-lg bg-[#1DB96B] px-8 py-4 text-base font-extrabold text-[#0A0D14] hover:bg-[#17A05D]"
            >
              Yes! Enroll Me Now
            </Link>
            <div className="mt-3 flex items-center justify-center gap-4 text-[11px] text-gray-500">
              <span className="flex items-center gap-1"><Lock className="h-3 w-3" /> Secure Payment</span>
              <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> Money-Back Guarantee</span>
            </div>
          </div>
        </div>
      </section>

      {/* why most people stay broke */}
      <section className="px-4 py-14 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-2xl font-bold md:text-4xl">Why Most People Stay <span className="text-[#1DB96B]">Broke Online</span></h2>
          <p className="mb-4 text-gray-400">Even after learning multiple skills…</p>
          <p className="mb-4 text-lg text-gray-200">Most people don&apos;t fail online because they lack skills. They fail because they don&apos;t know how to <span className="font-bold text-[#1DB96B]">turn skills into income</span>.</p>
          <p className="mb-2 text-gray-300">In today&apos;s economy, people don&apos;t pay you for what you know. They pay you for the <span className="font-bold text-[#1DB96B]">problems you solve</span>.</p>
          <p className="text-sm text-gray-500">This course will help you make that shift.</p>
        </div>
      </section>

      {/* what you'll learn */}
      <section className="px-4 py-14 md:py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-10 text-center text-2xl font-bold md:text-3xl">What You&apos;ll Learn <span className="text-[#1DB96B]">Inside the Course</span></h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {insideCourse.map((i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg border border-gray-800 bg-black/40 p-4">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#1DB96B]" />
                <span className="text-sm text-gray-200">{i}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* is this right for you */}
      <section className="px-4 py-14 md:py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-10 text-center text-2xl font-bold md:text-3xl">Is This Course <span className="text-[#1DB96B]">Right For You?</span></h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-[#1DB96B]/30 bg-[#1DB96B]/5 p-6">
              <h3 className="mb-4 font-bold text-[#1DB96B]">This Course IS For You If:</h3>
              <ul className="space-y-3">
                {isFor.map((i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-200">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#1DB96B]" /> {i}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-6">
              <h3 className="mb-4 font-bold text-red-400">This Course is NOT For You If:</h3>
              <ul className="space-y-3">
                {notFor.map((i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-200">
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-red-400" /> {i}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* first lesson preview */}
      <section className="bg-[#111] px-4 py-14 md:py-20">
        <div className="mx-auto max-w-4xl">
          <p className="mb-2 text-center text-xs font-extrabold uppercase tracking-[0.2em] text-[#1DB96B]">Course introduction</p>
          <h2 className="mb-10 text-center text-2xl font-bold md:text-3xl">Watch the Opening <span className="text-[#1DB96B]">Lesson Preview</span></h2>
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="group relative cursor-pointer overflow-hidden rounded-xl border border-gray-800">
                <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-[#1DB96B]/10 to-emerald-900/20">
                  <PlayCircle className="h-14 w-14 text-[#1DB96B]" />
                </div>
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-4">
                  <span className="text-sm font-medium">{lessonsIntro[0]}</span>
                </div>
              </div>
              <p className="mt-3 text-xs text-gray-500">Watch the opening lesson to see exactly what you&apos;re getting inside this course.</p>
            </div>
            <div>
              <h3 className="mb-4 font-bold">What You&apos;ll Learn in This Lesson:</h3>
              <ul className="space-y-3">
                {firstLesson.map((i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-200">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#1DB96B]" /> {i}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* peek inside */}
      <section className="px-4 py-14 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <span className="mb-3 inline-block rounded-md border border-[#1DB96B]/30 bg-[#1DB96B]/20 px-2 py-1 text-xs text-[#1DB96B]">Peek inside</span>
            <h2 className="text-2xl font-bold md:text-3xl">Your premium learning platform</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {previews.map(({ label, icon: Icon }) => (
              <div key={label} className="rounded-xl border border-gray-800 bg-black/40 p-6 text-center">
                <Icon className="mx-auto mb-3 h-9 w-9 text-[#1DB96B]" />
                <p className="text-sm font-semibold text-gray-200">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* instructor */}
      <section className="bg-[#111] px-4 py-14 md:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-2 text-sm text-gray-400">Meet</p>
          <h2 className="mb-2 text-2xl font-bold md:text-3xl">George J. Kasonso — <span className="text-[#1DB96B]">Your Instructor</span></h2>
          <p className="mb-8 text-lg text-[#1DB96B]">Hello! Learn to Earn — from skills you already have.</p>
          <div className="mx-auto mb-8 h-40 w-40 overflow-hidden rounded-full border-2 border-[#1DB96B]/30 shadow-2xl shadow-[#1DB96B]/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/portrait.jpg" alt="George J Kasonso — instructor" className="h-full w-full object-cover" />
          </div>
          <p className="mx-auto mb-6 max-w-2xl text-gray-300">
            Across my platforms, I&apos;ve grown a following of students and business owners who came for one thing: results they can use the same week. I don&apos;t teach theory. I teach what works.
          </p>
          <Link href="/about" className="font-bold text-[#1DB96B] hover:underline">Learn From George Today →</Link>
        </div>
      </section>

      {/* steps */}
      <section className="px-4 py-14 md:py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-10 text-center text-2xl font-bold md:text-3xl">Get Started <span className="text-[#1DB96B]">Now</span></h2>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { i: 1, icon: Rocket, t: 'Click Enroll', d: 'Tap the enroll button below' },
              { i: 2, icon: Smartphone, t: 'Make Payment', d: 'Pay securely via MTN / Airtel money or Card' },
              { i: 3, icon: Play, t: 'Start Learning', d: 'Instant access to all lessons' },
            ].map(({ i, icon: Icon, t, d }) => (
              <div key={i} className="rounded-xl border border-gray-800 bg-black/40 p-6 text-center">
                <p className="mb-3 text-xs font-extrabold text-[#1DB96B]">STEP {i}</p>
                <Icon className="mx-auto mb-3 h-8 w-8 text-[#1DB96B]" />
                <h3 className="mb-1 font-bold text-white">{t}</h3>
                <p className="text-xs text-gray-400">{d}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/checkout?course=how-to-make-your-first-kes-50000" className="inline-flex items-center justify-center rounded-lg bg-[#1DB96B] px-8 py-4 text-base font-extrabold text-[#0A0D14] hover:bg-[#17A05D]">
              Get Started Now
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[#111] px-4 py-14 md:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-10 text-center text-2xl font-bold md:text-3xl">Frequently Asked <span className="text-[#1DB96B]">Questions</span></h2>
          <div className="space-y-3">
            {faqs.map((f) => (
              <details key={f.q} className="group overflow-hidden rounded-lg border border-gray-800">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 bg-[#1a1a1a] p-4 text-left text-sm font-bold group-open:bg-[#222]">
                  {f.q}
                  <span className="text-[#1DB96B]">▾</span>
                </summary>
                <p className="px-4 pb-4 text-sm text-gray-400">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* final CTA */}
      <section className="px-4 py-16 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-2xl font-bold md:text-4xl">Start learning <span className="text-[#1DB96B]">today</span></h2>
          <p className="mb-8 text-gray-400">Everything in the opening lesson applies from day one.</p>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-800 bg-black/40 px-4 py-2 text-xs text-gray-400">
            <Wallet className="h-3.5 w-3.5 text-[#1DB96B]" /> Secure payment · MTN/Airtel money or card
          </div>
          <Link href="/checkout?course=how-to-make-your-first-kes-50000" className="block w-full rounded-lg bg-[#1DB96B] px-8 py-4 text-base font-extrabold text-[#0A0D14] hover:bg-[#17A05D] md:mx-auto md:max-w-md">
            Yes! Enroll Me Now
          </Link>
        </div>
      </section>
    </div>
  )
}
