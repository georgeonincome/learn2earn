'use client'

import Link from 'next/link'
import {
  Check, X, Lightbulb, Zap, Target, Timer, Laptop, Bot, Rocket,
  GraduationCap, Users, PlayCircle, Briefcase, Sparkles, AlertTriangle,
} from 'lucide-react'
import { CountdownBadge } from '@/components/landings/offers'

/**
 * AIWebDesignLanding — 1:1 port of reference AIWebDesignLanding-B2cwTuR4.js
 * (course id e1766169-5561-445f-b135-b09976bb10cb).
 * Zambianized: Elvis → George, Nairobi → Lusaka, KES 2,860 → ZMW 443
 * (normal cost KES 12,600 → ZMW 1,953, Save 77%), M-Pesa → MTN/Airtel money
 * or card, wa.me → +260. Glowing WhatsApp float + sticky bottom CTA kept.
 */

const PRICE = 'ZMW 443'
const NORMAL = 'ZMW 1,953'
const CHECKOUT = '/checkout?course=ai-web-design'
const WHATSAPP =
  'https://wa.me/260979982819?text=Hi%20George!%20I%20have%20a%20question%20about%20the%20AI%20Web%20Design%20course'

const heroPoints = [
  'No HTML, CSS, or JavaScript required',
  'Use AI tools like ChatGPT & Lovable',
  'Go from idea to live website faster',
]

const whoFor = [
  { t: 'Coding Scares You', d: 'No HTML/CSS needed', icon: Bot },
  { t: 'Build Real Sites', d: 'Not just tutorials', icon: Laptop },
  { t: 'Want Speed', d: 'Days, not weeks', icon: Zap },
  { t: 'Serious Learners', d: 'Ready to invest', icon: GraduationCap },
]

const learn = [
  'How I plan websites using ChatGPT',
  'How I structure pages properly',
  'How I design and build websites using Lovable',
  'How to avoid overthinking and just build',
  'How to go from idea → live website faster',
]

const outcomes = [
  'Understand how modern websites are built',
  'Stop fearing web design',
  'Build faster with confidence',
  'Have a repeatable process you can reuse',
]

const aiShift = [
  'Planning became faster',
  'Content became clearer',
  'Design decisions became easier',
  'Delivery time dropped massively',
]

const tools = [
  { t: 'ChatGPT for SEO & Content', k: 'ChatGPT', d: 'SEO & Content Writing' },
  { t: 'Google Docs for Planning', k: 'Google Docs', d: 'Website Planning' },
  { t: 'Photopea for Image Editing', k: 'Photopea', d: 'Image Editing' },
  { t: 'Content Structure', k: 'Content Structure', d: 'Page Organization' },
]

const sites = [
  { label: 'Business Website — Hero Section', sub: 'Hero Section' },
  { label: 'Business Website — Feature Section', sub: 'Visual Storytelling' },
  { label: 'Business Website — About Page', sub: 'Professional Copy' },
]

const before = [
  'Confused by HTML, CSS, JavaScript',
  'Taking weeks to build one website',
  'Overwhelmed by design decisions',
  'Paying developers for simple sites',
  'Stuck watching endless tutorials',
]

const after = [
  'Building sites with AI, zero coding',
  'Completing projects in 2-3 days',
  'Confident in your design process',
  'Ready to take on client work',
  'Using a proven, repeatable system',
]

const transformation = ['Freelancing', 'Business websites', 'Personal projects', 'Client work']

const faqs = [
  {
    q: 'Do I need any coding experience?',
    a: "No! This course is specifically designed for complete beginners. You won't write a single line of HTML, CSS, or JavaScript. We use AI tools that handle all the technical stuff for you.",
  },
  {
    q: 'How long do I have access to the course?',
    a: "You get lifetime access! Once you enroll, you can watch the lessons as many times as you want, forever. Plus, you'll get any future updates for free.",
  },
  {
    q: 'Do I need to pay for extra tools?',
    a: "To get professional results, yes — tools like Lovable have paid plans (starting around $25/month). I'm upfront about this because real skills require real tools. But you can start learning with free trials.",
  },
  {
    q: 'How is this different from YouTube tutorials?',
    a: 'YouTube tutorials are scattered and often outdated. This course gives you my exact, step-by-step workflow in a structured format — the same process I use to build real client websites in 2-3 days instead of 2 weeks.',
  },
  {
    q: 'Can I build client websites after this course?',
    a: 'Absolutely! The skills you learn are the same ones I use for paid client work. Many students start taking on freelance projects right after completing the course.',
  },
]

function WhatsAppFloat() {
  return (
    <a
      href={WHATSAPP}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform duration-200 hover:scale-110"
    >
      <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 013.011 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    </a>
  )
}

export default function AIWebDesignLanding() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-16 text-gray-100 antialiased">
      <WhatsAppFloat />

      {/* hero */}
      <section className="bg-gradient-to-br from-indigo-950/60 via-[#0A0A0A] to-purple-900/40 px-4 py-16 md:py-24">
        <div className="mx-auto grid max-w-5xl items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.14em] text-indigo-300">
              <Sparkles className="h-3.5 w-3.5" /> AI-powered web design
            </span>
            <h1 className="mb-4 text-3xl font-extrabold leading-[1.1] sm:text-5xl">
              I Used to Take <span className="text-indigo-300">7–14 Days</span>
              {' — '}Now I Can Do It in <span className="text-indigo-300">Days</span>
            </h1>
            <ul className="mb-8 space-y-2">
              {heroPoints.map((p) => (
                <li key={p} className="flex items-center gap-2 text-sm text-gray-300 sm:text-base">
                  <Check className="h-4 w-4 text-indigo-400" /> {p}
                </li>
              ))}
            </ul>
            <div className="mb-6 rounded-xl border border-indigo-500/30 bg-black/50 p-6">
              <p className="text-sm text-gray-400">Normal web design courses cost</p>
              <p className="mb-1 text-xl font-bold text-gray-400 line-through">{NORMAL}</p>
              <p className="text-3xl font-extrabold text-indigo-300">
                {PRICE} <span className="align-middle text-sm font-bold text-emerald-400">Save 77%</span>
              </p>
              <p className="mt-3 text-xs text-gray-400">Short • Practical • Beginner-friendly</p>
              <p className="mt-1 text-xs text-gray-500">Fastest way: Google account</p>
            </div>
            <div className="mb-4"><CountdownBadge label="Launch price ends in" /></div>
            <Link
              href={CHECKOUT}
              className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 px-8 py-4 text-base font-extrabold text-black shadow-lg shadow-indigo-500/20 transition-transform hover:scale-[1.02]"
            >
              Enroll Now
            </Link>
            <p className="mt-3 text-xs text-gray-500">✓ Instant access • ✓ Lifetime access • ✓ MTN/Airtel money or card</p>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-sm lg:max-w-none">
            <div className="flex h-full w-full flex-col items-center justify-center rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 shadow-2xl shadow-indigo-500/10">
              <Bot className="mb-3 h-16 w-16 text-indigo-300" />
              <p className="px-6 text-center text-sm font-medium text-gray-300">Websites built by AI — no code, no fear</p>
              <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-indigo-400">Idea → live site</p>
            </div>
          </div>
        </div>
      </section>

      {/* who is this for */}
      <section className="px-4 py-14 md:py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-10 text-center text-2xl font-bold md:text-3xl">Is this <span className="text-indigo-300">for you</span>?</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {whoFor.map(({ t, d, icon: Icon }) => (
              <div key={t} className="rounded-xl border border-gray-800 bg-black/40 p-6">
                <Icon className="mb-3 h-8 w-8 text-indigo-400" />
                <h3 className="mb-1 font-bold">{t}</h3>
                <p className="text-sm text-gray-400">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* what you'll learn */}
      <section className="px-4 py-14 md:py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-10 text-center text-2xl font-bold md:text-3xl">What You&apos;ll <span className="text-indigo-300">Learn</span></h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {learn.map((i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg border border-gray-800 bg-black/40 p-4">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" />
                <span className="text-sm text-gray-200">{i}</span>
              </div>
            ))}
          </div>
          <ul className="mx-auto mt-6 flex max-w-2xl flex-wrap justify-center gap-2">
            {outcomes.map((o) => (
              <li key={o} className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-300">
                <Target className="h-3 w-3" /> {o}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* why I created this */}
      <section className="bg-[#111] px-4 py-14 md:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-4 text-2xl font-bold md:text-3xl">How I Created This Course — <span className="text-indigo-300">When AI Tools Changed Everything</span></h2>
          <p className="mb-4 text-gray-400">I created this course because I&apos;ve been exactly where you are. When I started building websites in 2019, everything was slow. WordPress. Themes. Plugins. Revisions. Delays.</p>
          <p className="mb-6 text-gray-300">When I started using AI tools like ChatGPT and Lovable, everything shifted.</p>
          <div className="mb-8 grid grid-cols-2 gap-3">
            {aiShift.map((s) => (
              <div key={s} className="rounded-lg border border-gray-800 bg-black/40 p-4 text-sm text-gray-200">{s}</div>
            ))}
          </div>
          <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-6">
            <p className="mb-4 text-lg text-gray-200">What used to take me</p>
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-2xl font-extrabold text-gray-400 line-through">7–14 days</span>
              <span className="text-indigo-400">→</span>
              <span className="text-2xl font-extrabold text-indigo-300">2–3 days</span>
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">more than 5×</span>
            </div>
          </div>
        </div>
      </section>

      {/* old way vs modern way */}
      <section className="px-4 py-14 md:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-10 text-2xl font-bold md:text-3xl">This Is <span className="text-indigo-300">NOT</span> the Old Way</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-6">
              <h3 className="mb-4 font-bold text-red-400">❌ The Old Way</h3>
              <ul className="space-y-3">
                {before.slice(0, 4).map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-sm text-gray-200">
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-red-400" /> {b}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6">
              <h3 className="mb-4 font-bold text-emerald-400">✅ The Modern Way</h3>
              <ul className="space-y-3">
                {after.slice(0, 4).map((a) => (
                  <li key={a} className="flex items-start gap-2.5 text-sm text-gray-200">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" /> {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-8 text-gray-400">This course teaches you <span className="font-bold text-indigo-300">modern web design</span>.</p>
        </div>
      </section>

      {/* tools */}
      <section className="bg-[#111] px-4 py-14 md:py-20">
        <div className="mx-auto max-w-5xl">
          <p className="mb-2 text-center text-xs font-extrabold uppercase tracking-[0.2em] text-indigo-400">Real tools, real results</p>
          <h2 className="mb-2 text-center text-2xl font-bold md:text-3xl">Outcomes: <span className="text-indigo-300">AI Tools You&apos;ll Master</span></h2>
          <p className="mx-auto mb-10 max-w-xl text-center text-sm text-gray-400">See exactly what you&apos;ll learn to use and what you&apos;ll be able to build</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {tools.map((t) => (
              <div key={t.k} className="rounded-xl border border-gray-800 bg-black/40 p-5 text-center">
                <Laptop className="mx-auto mb-3 h-9 w-9 text-indigo-400" />
                <h3 className="mb-1 text-sm font-bold">{t.k}</h3>
                <p className="text-xs text-gray-500">{t.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* real websites you'll build */}
      <section className="px-4 py-14 md:py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-10 text-center text-2xl font-bold md:text-3xl">Real Websites <span className="text-indigo-300">You&apos;ll Build</span></h2>
          <div className="grid gap-4 md:grid-cols-3">
            {sites.map((s) => (
              <div key={s.label} className="group cursor-pointer overflow-hidden rounded-xl border border-gray-800 transition-all hover:border-indigo-500/50">
                <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-indigo-500/10 to-purple-900/20 transition-transform duration-300 group-hover:scale-[1.02]">
                  <Laptop className="h-10 w-10 text-indigo-400" />
                </div>
                <div className="p-4">
                  <p className="text-sm font-medium text-white">{s.label}</p>
                  <p className="text-[11px] text-gray-500">{s.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* learning experience */}
      <section className="px-4 py-14 md:py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-10 text-center text-2xl font-bold md:text-3xl">Your Learning <span className="text-indigo-300">Experience</span></h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { icon: PlayCircle, label: 'Interactive Video Lessons', d: 'Learn with gamification, progress tracking & XP rewards' },
              { icon: Rocket, label: 'Structured Course Content', d: 'Clear modules with estimated time for each lesson' },
            ].map(({ icon: Icon, label, d }) => (
              <div key={label} className="rounded-xl border border-gray-800 bg-black/40 p-6">
                <Icon className="mb-3 h-10 w-10 text-indigo-400" />
                <h3 className="mb-1 font-bold">{label}</h3>
                <p className="text-sm text-gray-400">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* who this is for + tools honesty */}
      <section className="bg-[#111] px-4 py-14 md:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-4 text-2xl font-bold md:text-3xl">I Built This Course For <span className="text-indigo-300">You</span></h2>
          <p className="mb-2 text-gray-400">This is <b className="text-gray-100">beginner-friendly</b>, but it&apos;s not a toy project — it&apos;s for people who are <b className="text-gray-100">serious</b>.</p>
          <div className="mt-8 rounded-xl border border-amber-500/30 bg-amber-500/5 p-6">
            <p className="mb-3 flex items-center gap-2 font-bold text-amber-400"><AlertTriangle className="h-5 w-5" /> Important Note About Tools (Read This)</p>
            <p className="mb-2 text-sm text-gray-300">I need to be honest with you.<br />To get the best results, <b>you will need paid tools</b> like Lovable.</p>
            <p className="mb-2 text-sm text-gray-400">I don&apos;t hide this because <b className="text-gray-200">real skills require real tools</b>.</p>
            <p className="text-sm text-gray-400">Free tools are okay for testing. Paid tools are what help you deliver professionally.</p>
          </div>
        </div>
      </section>

      {/* course duration */}
      <section className="px-4 py-14 md:py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-10 text-center text-2xl font-bold md:text-3xl">How Long the Course <span className="text-indigo-300">Takes</span></h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { icon: Timer, label: '3–5 Hours', d: 'Total Length' },
              { icon: Zap, label: 'Step-by-Step', d: 'Practical Format' },
              { icon: Briefcase, label: 'Practice', d: 'Best Results' },
            ].map(({ icon: Icon, label, d }) => (
              <div key={label} className="rounded-xl border border-gray-800 bg-black/40 p-6 text-center">
                <Icon className="mx-auto mb-3 h-8 w-8 text-indigo-400" />
                <p className="font-bold text-white">{label}</p>
                <p className="text-xs text-gray-500">{d}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-gray-400">Practice is where the skill sticks.</p>
        </div>
      </section>

      {/* before vs after */}
      <section className="px-4 py-14 md:py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-10 text-center text-2xl font-bold md:text-3xl">Your Transformation — <span className="text-indigo-300">Before vs After This Course</span></h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-800 bg-black/40 p-6">
              <h3 className="mb-4 font-bold text-gray-400">Before The Course</h3>
              <ul className="space-y-3">
                {before.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-sm text-gray-300">
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-red-400" /> {b}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6">
              <h3 className="mb-4 font-bold text-emerald-400">After The Course</h3>
              <ul className="space-y-3">
                {after.map((a) => (
                  <li key={a} className="flex items-start gap-2.5 text-sm text-gray-200">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" /> {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-8 text-center text-sm text-gray-400">This skill can be used for:</p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {transformation.map((t) => (
              <span key={t} className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-300">
                <Briefcase className="h-3 w-3" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* instructor */}
      <section className="bg-[#111] px-4 py-14 md:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-2 text-sm text-gray-400">Hey!</p>
          <h2 className="mb-2 text-2xl font-bold md:text-3xl">George J. Kasonso — <span className="text-indigo-300">Digital Skills Trainer</span></h2>
          <p className="mb-8 text-gray-400">I&apos;m a digital creator from Lusaka, Zambia. I believe practical skills change lives.</p>
          <div className="mx-auto mb-8 grid max-w-2xl gap-4 sm:grid-cols-3">
            {[
              { icon: GraduationCap, v: '3,800+ Students', d: 'Trained in practical digital skills' },
              { icon: Users, v: '4 Platforms', d: 'Growing organically across social media' },
              { icon: Rocket, v: '5× Faster Delivery', d: 'From using AI in my web design workflow' },
            ].map(({ icon: Icon, v, d }) => (
              <div key={v} className="rounded-xl border border-gray-800 bg-black/40 p-5">
                <Icon className="mx-auto mb-2 h-7 w-7 text-indigo-400" />
                <p className="font-bold">{v}</p>
                <p className="text-xs text-gray-500">{d}</p>
              </div>
            ))}
          </div>
          <Link href="/about" className="font-bold text-indigo-300 hover:underline">Learn From George Today →</Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-14 md:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="mb-2 text-center text-xs font-extrabold uppercase tracking-[0.2em] text-indigo-400">Common questions</p>
          <h2 className="mb-10 text-center text-2xl font-bold md:text-3xl">Frequently Asked <span className="text-indigo-300">Questions</span></h2>
          <div className="space-y-3">
            {faqs.map((f) => (
              <details key={f.q} className="group overflow-hidden rounded-lg border border-gray-800">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 bg-[#1a1a1a] p-4 text-left text-sm font-bold group-open:bg-[#222]">
                  {f.q}
                  <span className="text-indigo-400">▾</span>
                </summary>
                <p className="px-4 pb-4 text-sm text-gray-400">{f.a}</p>
              </details>
            ))}
          </div>
          <div className="mt-8 rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-6 text-center">
            <h3 className="mb-1 font-bold">Got Questions?</h3>
            <p className="mb-4 text-sm text-gray-400">Chat with me directly on WhatsApp. I&apos;m here to help you succeed!</p>
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg bg-[#25D366] px-6 py-3 text-sm font-bold text-white hover:bg-[#1eb855]"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* final word + CTA */}
      <section className="bg-gradient-to-br from-indigo-950/40 via-[#111] to-purple-900/30 px-4 py-16 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-2xl font-bold md:text-4xl">Final Word From Me</h2>
          <p className="mb-4 text-gray-300">If you&apos;ve been waiting for a simple, modern, realistic way to learn web design — <span className="font-bold text-indigo-300">this is it</span>.</p>
          <p className="mb-10 text-gray-400">No coding pressure. No unnecessary complexity. Just tools that work.</p>
          <div className="rounded-xl border border-indigo-500/40 bg-black/50 p-8">
            <p className="mb-1 font-bold">🚀 Start Building Today</p>
            <p className="mb-4 text-gray-400">Learn <span className="font-bold text-indigo-300">AI Web Design</span> — {PRICE}</p>
            <p className="mb-6 text-sm font-bold text-emerald-400">Save 77% · Short • Practical • Beginner-friendly</p>
            <Link href={CHECKOUT} className="flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 py-4 text-base font-extrabold text-black hover:from-indigo-600 hover:to-purple-600">
              ENROLL NOW
            </Link>
            <p className="mt-3 text-xs text-gray-500">✓ Instant access • ✓ Lifetime access • ✓ MTN/Airtel money or card</p>
          </div>
          <p className="mt-8 text-sm text-gray-400 flex items-center justify-center gap-2"><Lightbulb className="h-4 w-4 text-indigo-400" /> AI Tools · No Coding</p>
          <p className="mt-6 text-xs text-gray-600">— George J. Kasonso</p>
        </div>
      </section>

      {/* sticky bottom bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-800 bg-[#0A0D14]/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-xs font-bold text-indigo-300">AI Web Design</p>
            <p className="text-[11px] text-gray-500">AI Tools · No Coding · <span className="font-bold text-white">{PRICE}</span></p>
          </div>
          <Link
            href={CHECKOUT}
            className="flex shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 px-5 py-2.5 text-sm font-extrabold text-black hover:from-indigo-600 hover:to-purple-600"
          >
            GO TO COURSE · ENROLL NOW
          </Link>
        </div>
      </div>
    </div>
  )
}
