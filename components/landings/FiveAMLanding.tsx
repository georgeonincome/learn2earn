import Link from 'next/link'
import { Check, Clock, PlayCircle, RefreshCw, Target, Brain, Zap, Lightbulb, Calendar, Play, CalendarClock, Laptop, Sunrise } from 'lucide-react'
import { CountdownBadge } from '@/components/landings/offers'

/**
 * FiveAMLanding — 1:1 port of reference FiveAMProductivityLanding-BnwX5Qtf.js.
 * Zambianized: Elvis → George, KES 1,980 → ZMW 307 (rate 0.155),
 * Paystack → MTN/Airtel money or card (Flutterwave), wa.me rebranched.
 * Structure (verbatim section order): hero + badges → course features (9) →
 * who-for (6 cards) → results chips → "Why Most People Never" (motivation vs
 * discipline) → Course content (9 lessons w/ durations) → This Is For →
 * Peek Inside (4 previews) → Return 100× → How the Course Works → For This /
 * founder story → Control cards → Promise → final CTA.
 */

const PRICE = 'ZMW 307'

const hero = {
  badge: 'PERSONAL PRODUCTIVITY SYSTEM',
  title: 'Build Personal Systems for Focus, Discipline & Consistent Execution',
  points: ['Practical systems, not motivation hacks', 'Lifetime access, learn at your pace'],
}

const courses = [
  'The 5AM Productivity System',
  'Discipline, Identity & Systems',
  'Morning Systems That Work',
  'Habit Formation That Survives Motivation Loss',
  'Distraction Control & Environment Design',
  'ChatGPT for Productivity',
  'Google Docs for Productivity',
  'Canva for Beginners',
  'CapCut for Beginners',
  'Personal Systems for Productivity, Remote Work & Freelancing',
]

const benefits = [
  'Build systems that remove decision fatigue',
  'Structure your mornings for clarity and deep work',
  'Form habits that survive busy days and low motivation',
  'Eliminate distractions by redesigning your environment',
  'Use ChatGPT as a thinking and planning partner',
  'Work faster using Google Docs, Canva, and CapCut',
  'Manage time, work, and energy — not just tasks',
  'Perform consistently in remote work and freelancing',
  'Finish what you start without burning out',
]

const whoFor = [
  { t: 'Starters', d: 'You start things but struggle to finish', icon: Play },
  { t: 'Busy People', d: 'Days feel busy but unproductive', icon: Clock },
  { t: 'Structure Seekers', d: 'Want structure without burnout', icon: Target },
  { t: 'Remote Workers', d: 'Work remotely or freelance', icon: Laptop },
  { t: 'Consistency Seekers', d: 'Tired of relying on motivation', icon: RefreshCw },
  { t: 'High Performers', d: 'Want consistency to become automatic', icon: Zap },
]

const results = ['Better focus, every day', 'Fewer wasted hours', 'Clearer decisions', 'Consistent execution', 'Less stress', 'More self-trust']

const failReasons = [
  'They make too many decisions every day',
  'They rely on motivation to start',
  "They don't know how to recover after missing a day",
  'Their environment works against them',
]

const lessons = [
  { title: 'Discipline, Identity & Systems', duration: '32 min' },
  { title: 'Morning Systems That Work', duration: '27 min' },
  { title: 'Habit Formation That Survives Motivation Loss', duration: '32 min' },
  { title: 'Distraction Control & Environment Design', duration: '35 min' },
  { title: 'ChatGPT for Productivity', duration: '35 min' },
  { title: 'Google Docs for Productivity', duration: '30 min' },
  { title: 'Canva for Beginners', duration: '35 min' },
  { title: 'CapCut for Beginners', duration: '36 min' },
  { title: 'Personal Systems for Productivity, Remote Work & Freelancing', duration: '30 min' },
]

const previews = [
  { label: 'Professional Video Lessons', caption: 'Course lesson player' },
  { label: '9 Structured Lessons', caption: 'Course content list' },
  { label: 'Real Actionable Content', caption: 'Lesson on habits' },
  { label: 'Tools & Practical Skills', caption: 'Canva lesson' },
]

const howWorks = [
  { icon: Play, text: '9 structured video sessions' },
  { icon: Zap, text: 'Practical, no-fluff lessons' },
  { icon: Clock, text: 'Lifetime access' },
  { icon: Calendar, text: 'Learn at your own pace' },
]

export default function FiveAMLanding() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-gray-100 antialiased">
      {/* hero */}
      <section className="relative bg-gradient-to-br from-orange-950/60 via-[#0A0A0A] to-amber-900/40 px-4 py-20 md:py-28">
        <div className="mx-auto grid max-w-5xl items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.14em] text-orange-400">
              <Sunrise className="h-3.5 w-3.5" /> {hero.badge}
            </span>
            <h1 className="mb-4 text-3xl font-extrabold leading-[1.1] sm:text-5xl">{hero.title}</h1>
            <ul className="mb-8 space-y-2 text-gray-300">
              {hero.points.map((p) => (
                <li key={p} className="flex items-center gap-2 text-sm sm:text-base">
                  <Check className="h-4 w-4 text-orange-400" /> {p}
                </li>
              ))}
            </ul>
            <div className="mb-6 flex items-center gap-4">
              <div>
                <p className="text-sm text-gray-400">Price</p>
                <p className="text-3xl font-extrabold text-orange-400">{PRICE}</p>
              </div>
              <div className="h-12 w-px bg-gray-700" />
              <div>
                <p className="text-sm text-gray-400">Access</p>
                <p className="text-xl font-semibold text-white">Lifetime</p>
              </div>
            </div>
            <a
              href="/checkout?course=the-5am-productivity-system"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-4 text-base font-extrabold text-black shadow-lg shadow-orange-500/20 transition-transform hover:scale-[1.02]"
            >
              Instant access • <Clock className="h-4 w-4" /> {PRICE}
            </a>
            <p className="mt-3 text-xs text-gray-500">
              Fastest way: <span className="text-gray-300">MTN / Airtel money or card</span> · Secure payment
            </p>
            <div className="mt-8">
              <CountdownBadge />
            </div>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-sm lg:max-w-none">
            <div className="flex h-full w-full flex-col items-center justify-center rounded-2xl border border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-amber-500/10 shadow-2xl shadow-orange-500/10">
              <Sunrise className="mb-3 h-16 w-16 text-orange-400" />
              <p className="px-6 text-center text-sm font-medium text-gray-300">5AM — the training ground for people who execute</p>
              <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-orange-400">Systems &gt; motivation</p>
            </div>
          </div>
        </div>
      </section>

      {/* what this course includes + benefit list */}
      <section className="px-4 py-14 md:py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-3 text-center text-2xl text-gray-200 md:text-3xl font-bold">What is inside the <span className="text-orange-400">course</span></h2>
          <div className="mb-10 grid gap-2 text-center sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((c) => (
              <div key={c} className="rounded-lg border border-gray-800 bg-black/40 px-4 py-2.5 text-sm text-gray-300">{c}</div>
            ))}
          </div>
          <h2 className="mb-6 text-center text-2xl md:text-3xl font-bold">You will <span className="text-orange-400">learn</span></h2>
          <ul className="mx-auto max-w-3xl space-y-3">
            {benefits.map((b) => (
              <li key={b} className="flex items-start gap-3 rounded-lg border border-gray-800 bg-black/40 p-4">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" />
                <span className="text-sm text-gray-200">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* who is this for */}
      <section className="px-4 py-14 md:py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-10 text-center text-2xl md:text-3xl font-bold">Is this <span className="text-orange-400">for you</span>?</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {whoFor.map(({ t, d, icon: Icon }) => (
              <div key={t} className="rounded-xl border border-gray-800 bg-black/40 p-6">
                <Icon className="mb-3 h-8 w-8 text-orange-400" />
                <h3 className="mb-1 font-bold">{t}</h3>
                <p className="text-sm text-gray-400">{d}</p>
              </div>
            ))}
          </div>
          <div className="mx-auto mt-8 flex max-w-2xl flex-wrap justify-center gap-2">
            {results.map((r) => (
              <span key={r} className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1.5 text-xs font-semibold text-orange-400">
                <Check className="h-3 w-3" /> {r}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* why most people never */}
      <section className="px-4 py-14 md:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-2xl md:text-3xl font-bold">Why most people <span className="text-orange-400">never</span> stay consistent</h2>
          <p className="mb-8 text-gray-400">Here&apos;s the truth most productivity advice won&apos;t tell you: <b className="text-gray-200">Motivation is a feeling. Discipline is a system.</b> Without structure, even discipline collapses.</p>
          <div className="mx-auto grid max-w-2xl gap-3 text-left">
            {failReasons.map((r) => (
              <div key={r} className="flex items-start gap-3 rounded-lg border border-gray-800 bg-black/40 p-4">
                <Brain className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" />
                <span className="text-sm text-gray-300">{r}</span>
              </div>
            ))}
          </div>
          <p className="mt-6 text-lg font-bold text-orange-400">This course fixes that.</p>
        </div>
      </section>

      {/* founder story */}
      <section className="px-4 py-14 md:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="mb-6 text-xl font-semibold leading-8 text-gray-200">
            &quot;I built this course because I got tired of watching capable, intelligent people stay stuck. Not because they&apos;re lazy. Not because they lack talent. But because their days are chaotic.&quot;
          </p>
          <p className="mb-2 text-gray-400">They wake up with good intentions… then react to messages, notifications, and distractions. By evening, they&apos;re exhausted — with nothing meaningful to show for it.</p>
          <p className="text-gray-300">I&apos;ve been there. And what changed my life wasn&apos;t motivation. <span className="text-orange-400 font-semibold">It was systems.</span></p>
          <p className="mt-10 text-lg font-bold">This Course Is <span className="text-orange-400">Different</span></p>
          <p className="mb-6 text-gray-400">The 5AM Productivity System is not about suffering, hustle, or forcing yourself to wake up early just to feel productive. It&apos;s about control.</p>
          <div className="grid gap-4 sm:grid-cols-3">
            {['Control of Your Time', 'Control of Your Focus', 'Control of Your Decisions'].map((c) => (
              <div key={c} className="rounded-xl border border-orange-500/30 bg-orange-500/10 p-5 text-center text-sm font-bold text-orange-400">{c}</div>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-gray-500">Early mornings are simply the training ground.</p>
        </div>
      </section>

      {/* course content */}
      <section className="bg-[#111] px-4 py-14 md:py-20">
        <div className="mx-auto max-w-4xl">
          <p className="mb-2 text-center text-xs font-extrabold uppercase tracking-[0.2em] text-orange-400">Course content</p>
          <h2 className="mb-10 text-center text-2xl md:text-3xl font-bold">Nine sessions you can <span className="text-orange-400">use instantly</span></h2>
          <div className="space-y-2">
            {lessons.map((l, i) => (
              <div key={l.title} className="flex items-center justify-between gap-4 rounded-lg border border-gray-800 bg-black/40 p-4">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500/20 text-xs font-bold text-orange-400">{i + 1}</span>
                  <span className="truncate text-sm font-medium text-gray-200">{l.title}</span>
                </div>
                <span className="shrink-0 text-xs tabular-nums text-gray-500">{l.duration}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* peek inside */}
      <section className="px-4 py-14 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <span className="mb-3 inline-block rounded-md border border-orange-500/30 bg-orange-500/20 px-2 py-1 text-xs text-orange-400">Peek inside</span>
            <h2 className="mb-2 text-2xl md:text-3xl font-bold">See what you&apos;re <span className="text-orange-400">getting</span></h2>
            <p className="mx-auto max-w-xl text-sm text-gray-400">A professional learning experience with video lessons, progress tracking, and resources</p>
          </div>
          <div className="mb-8 grid gap-4 md:grid-cols-2 md:gap-6">
            {previews.map((p) => (
              <div key={p.label} className="group relative cursor-pointer overflow-hidden rounded-xl border border-gray-800 transition-all hover:border-orange-500/50">
                <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-orange-500/10 to-amber-900/20 transition-transform duration-300 group-hover:scale-[1.02]">
                  <PlayCircle className="h-10 w-10 text-orange-400" />
                </div>
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-4">
                  <span className="text-sm font-medium text-white">{p.label}</span>
                </div>
                <span className="absolute bottom-4 right-4 text-[10px] text-orange-400 opacity-0 transition-opacity group-hover:opacity-100">{p.caption}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* return 100x */}
      <section className="px-4 py-14 md:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <h2 className="mb-6 text-2xl md:text-3xl font-bold">Why the return is <span className="text-orange-400">100×</span></h2>
            <div className="mb-6 rounded-xl border border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-amber-500/10 p-8">
              <p className="mb-1 text-center text-sm text-gray-400">The course costs</p>
              <p className="mb-2 text-center text-4xl font-extrabold text-orange-400">{PRICE}</p>
              <p className="text-center text-sm text-gray-400">That&apos;s less than what most people spend on food in a week.</p>
            </div>
            <p className="mb-4 text-lg text-gray-200">But the return?</p>
            <div className="mb-6 grid grid-cols-2 gap-3">
              {results.slice(0, 4).map((r) => (
                <div key={r} className="flex items-center gap-2 rounded-lg bg-black/40 p-3">
                  <Check className="h-4 w-4 shrink-0 text-orange-400" />
                  <span className="text-sm text-gray-200">{r}</span>
                </div>
              ))}
            </div>
            <p className="text-gray-400">One system from this course can save you <span className="font-semibold text-orange-400">hundreds of hours</span> over a year.</p>
          </div>
          <div className="mx-auto aspect-square w-full max-w-sm lg:max-w-none">
            <div className="flex h-full w-full flex-col items-center justify-center rounded-2xl border-2 border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-amber-900/20 shadow-2xl shadow-orange-500/10">
              <Laptop className="mb-3 h-14 w-14 text-orange-400" />
              <p className="px-6 text-center text-sm text-gray-300">Remote work success — powered by systems you run every morning</p>
            </div>
          </div>
        </div>
      </section>

      {/* how the course works */}
      <section className="bg-[#111] px-4 py-14 md:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="order-1">
            <div className="mx-auto aspect-square w-full max-w-sm lg:max-w-none">
              <div className="flex h-full w-full flex-col items-center justify-center rounded-2xl border-2 border-orange-500/20 bg-gradient-to-br from-amber-500/10 to-orange-900/20 shadow-2xl shadow-orange-500/10">
                <CalendarClock className="mb-3 h-14 w-14 text-orange-400" />
                <p className="px-6 text-center text-sm text-gray-300">Learning and studying — designed for real life, not theory</p>
              </div>
            </div>
          </div>
          <div className="order-2">
            <h2 className="mb-8 text-2xl md:text-3xl font-bold">How the course <span className="text-orange-400">works</span></h2>
            <div className="mb-8 grid grid-cols-2 gap-4">
              {howWorks.map(({ icon: Icon, text }) => (
                <div key={text} className="rounded-lg border border-gray-800 bg-black/50 p-4">
                  <Icon className="mb-2 h-8 w-8 text-orange-400" />
                  <p className="text-sm text-gray-300">{text}</p>
                </div>
              ))}
            </div>
            <div className="mb-6 flex items-center gap-3 rounded-lg border border-gray-800 bg-black/50 p-4">
              <Target className="h-8 w-8 shrink-0 text-orange-400" />
              <p className="text-sm text-gray-300">Designed for real life, not theory</p>
            </div>
            <p className="mb-6 text-gray-400 italic">This is not content you watch once.<br /><span className="text-orange-400">It&apos;s a system you live with.</span></p>
          </div>
        </div>
      </section>

      {/* promise */}
      <section className="px-4 py-14 md:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="order-2 lg:order-1">
            <h2 className="mb-6 text-2xl md:text-3xl font-bold">My <span className="text-orange-400">promise</span> to you</h2>
            <p className="mb-4 text-gray-400">I&apos;m not promising overnight success.</p>
            <p className="mb-8 text-lg text-white">I&apos;m promising something better:</p>
            <div className="mb-8 flex flex-wrap gap-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/20 px-4 py-2 text-base text-orange-400"><Lightbulb className="mr-2 h-4 w-4" /> Clarity</span>
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/20 px-4 py-2 text-base text-amber-400"><Target className="mr-2 h-4 w-4" /> Structure</span>
              <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/20 px-4 py-2 text-base text-orange-400"><RefreshCw className="mr-2 h-4 w-4" /> Consistency</span>
            </div>
            <p className="text-gray-300">If you apply even 50% of what I teach here, your days will look different.</p>
            <p className="mt-2 font-medium text-orange-400">And when your days change, your life follows.</p>
          </div>
          <div className="order-1 lg:order-2">
            <div className="mx-auto aspect-square w-full max-w-sm lg:max-w-none">
              <div className="flex h-full w-full flex-col items-center justify-center rounded-2xl border-2 border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-amber-900/20 shadow-2xl shadow-orange-500/10">
                <Zap className="mb-3 h-14 w-14 text-orange-400" />
                <p className="px-6 text-center text-sm text-gray-300">Consistency, not hype — a personal operating system</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* final CTA */}
      <section className="bg-gradient-to-br from-orange-900/30 via-[#111] to-amber-900/30 px-4 py-16 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-2xl font-bold md:text-4xl">Ready to stop reacting and start <span className="text-orange-400">executing</span>?</h2>
          <p className="mb-8 text-gray-400">Join The 5AM Productivity System.</p>
          <div className="mb-8 rounded-xl border border-orange-500/40 bg-black/50 p-8">
            <div className="mb-6 flex items-center justify-center gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-400">Price</p>
                <p className="text-3xl font-bold text-orange-400" suppressHydrationWarning>{PRICE}</p>
              </div>
              <div className="h-12 w-px bg-gray-700" />
              <div className="text-center">
                <p className="text-sm text-gray-400">Access</p>
                <p className="text-xl font-semibold text-white">Lifetime</p>
              </div>
            </div>
            <a
              href="/checkout?course=the-5am-productivity-system"
              className="flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 py-4 text-base font-extrabold text-black hover:from-orange-600 hover:to-amber-600"
            >
              Instant access • {PRICE}
            </a>
          </div>
          <div className="space-y-1 text-gray-400">
            <p className="text-orange-400">Set your alarm.</p>
            <p>Build your systems.</p>
            <p className="font-medium text-white">Execute daily.</p>
          </div>
          <p className="mt-8 text-gray-500">— George J.</p>
          <p className="mt-10 text-xs text-gray-600">Build Systems. Execute Daily. Change Your Life.</p>
        </div>
      </section>
    </div>
  )
}
