import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  MessageCircle,
  Megaphone,
  Play,
  Star,
  Video,
} from 'lucide-react'
import {
  SITE_CONFIG,
  MEMBERSHIP_PLANS,
  COURSES,
  FEATURED_BUNDLE,
  COHORTS,
  REVIEWS,
} from '@/lib/data'

/* Home page — mirrored 1:1 from click2skill ZD.
   Echelon tokens ref: .echelon-home, .aib-poster-theme, .aib-gradient-text
   Images from click2skill.com downloaded to public/images/
*/

const INK = 'hsl(0 86% 3%)'
const INK_RAISED = 'hsl(0 24% 8%)'
const SAND = 'hsl(20 39% 93%)'
const CREAM = 'hsl(0 100% 99%)'
const ACTION = 'hsl(152 73% 42%)'
const GREEN = 'hsl(151 73% 42%)'
const GREEN_DEEP = 'hsl(153 85% 28%)'
const ON_DARK_MUTED = 'hsl(354 4% 59%)'
const LINE_DARK = 'hsl(0 17% 14%)'
const ON_LIGHT_MUTED = 'hsl(354 6% 39%)'
const LINE_LIGHT = 'hsl(24 14% 88%)'

const fmt = (n: number) => `ZMW ${n.toLocaleString('en-ZM')}`
const firstName = SITE_CONFIG.founder.name.split(' ').slice(-1).join(' ')

const HOME_FAQS: [string, string][] = [
  ['Do I get every course?', 'Yes. Your membership unlocks every published course, plus new courses added while your access is active.'],
  ['Do I need experience?', 'No. Courses begin with the foundations and move into practical projects you can complete at your own pace.'],
  ['How long do I have access?', 'Choose four months or one year. Access begins when payment is confirmed and nothing renews automatically.'],
  ['Can I pay with mobile money?', 'Yes. Pay with MTN or Airtel mobile money through the checkout, or contact George directly if you need help with a manual payment.'],
  ['Are certificates included?', 'Yes. You can earn a certificate for each eligible course you complete.'],
  ['Can I speak directly to George?', `Yes. Learn2Earn has no support desk. WhatsApp ${SITE_CONFIG.founder.phone} and you are speaking with George directly.`],
]

const BENEFITS = [
  'All published courses across every category',
  'Templates, checklists and class resources',
  'A certificate for every eligible course',
  'New courses added at no extra cost',
]

const CLASSROOM_CARDS: [string, string][] = [
  ['Real questions', 'Students ask what you would have asked — pricing, clients, mistakes — and you hear the full answer.'],
  ['Real conversations', 'The discussions, debates and follow-ups that make a live class valuable are all captured on the recording.'],
  ['Real work, on screen', 'You watch actual projects being built and campaigns being run, not rehearsed demos.'],
]

const TIKTOK_VIDEOS: { title: string; desc: string; duration: string; href: string; image: string }[] = [
  {
    title: 'AI Prompting for Beginners',
    desc: 'Write better prompts and save hours every day with Claude and ChatGPT.',
    duration: '45s',
    href: 'https://www.tiktok.com/@george_kasonso',
    image: '/images/elvis-teaching-phone.webp',
  },
  {
    title: '5 Digital Skills to Learn in 2026',
    desc: 'AI prompting, vibe coding, video editing, paid advertising and email automation.',
    duration: '60s',
    href: 'https://www.tiktok.com/@george_kasonso',
    image: '/images/elvis-slide-wide.webp',
  },
  {
    title: 'Skills for Remote Work',
    desc: 'Build a practical craft, learn continuously and turn that skill into income.',
    duration: '52s',
    href: 'https://www.tiktok.com/@george_kasonso',
    image: '/images/elvis-classroom.webp',
  },
  {
    title: 'What Your Laptop Can Help You Build',
    desc: 'A quick reminder that the right digital skills can turn an everyday laptop into a working tool.',
    duration: '38s',
    href: 'https://www.tiktok.com/@george_kasonso',
    image: '/images/elvis-desk-wide.webp',
  },
  {
    title: 'Digital Marketing Explained Simply',
    desc: 'How content, websites, Google Ads and Meta Ads work together to bring a business customers.',
    duration: '55s',
    href: 'https://www.tiktok.com/@george_kasonso',
    image: '/images/smm-elvis-001.webp',
  },
  {
    title: 'How Long Does Web Design Take to Learn?',
    desc: 'A practical look at learning web design consistently and using it to solve business problems.',
    duration: '48s',
    href: 'https://www.tiktok.com/@george_kasonso',
    image: '/images/elvis-mic.webp',
  },
]

const LIVE_CLASS = COHORTS.find(c => c.status === 'upcoming') ?? COHORTS[0]

const dateRange = (a?: string, b?: string) => {
  if (!a || !b) return ''
  const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', timeZone: 'Africa/Lusaka' }
  return `${new Date(a).toLocaleDateString('en-GB', opts)} – ${new Date(b).toLocaleDateString('en-GB', opts)}`
}

const fmtMin = (m: number) => m >= 60 ? `${Math.floor(m / 60)}h ${m % 60 ? `${m % 60}m` : ''}`.trim() : `${m}m`

export default function HomePage() {
  const h = MEMBERSHIP_PLANS.find(p => !p.popular) ?? MEMBERSHIP_PLANS[0]
  const f = MEMBERSHIP_PLANS.find(p => p.popular) ?? MEMBERSHIP_PLANS[1]
  const courseCount = COURSES.length
  const courseList = COURSES.slice(0, 12)
  const nextCohort = COHORTS[0]

  return (
    <div className="min-h-screen overflow-x-hidden pb-[76px] md:pb-0" style={{ backgroundColor: CREAM, color: 'hsl(0 86% 3%)' }}>
      <main>
        {/* ============ HERO ============ */}
        <section style={{ backgroundColor: INK, color: 'hsl(0 100% 99%)' }}>
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.04fr_.96fr] lg:px-12 lg:py-24">
            <div>
              <p className="mb-5 text-xs font-extrabold uppercase tracking-[0.18em]" style={{ color: ACTION }}>
                Practical skills. Real work. Zambian context.
              </p>
              <h1 className="max-w-[13ch] font-head text-4xl font-extrabold leading-[1.06] sm:text-5xl lg:text-[55px] text-[hsl(0_100%_99%)]">
                Learn digital skills that pay.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8" style={{ color: ON_DARK_MUTED }}>
                One membership unlocks practical courses in AI, ads, social media, video editing, web design and online work.
              </p>
              <div className="mt-7 inline-flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-xl px-5 py-4" style={{ border: `1px solid ${LINE_DARK}`, backgroundColor: INK_RAISED }}>
                <strong className="text-3xl font-extrabold text-[hsl(0_100%_99%)]">{fmt(h.price)}</strong>
                <span className="text-sm" style={{ color: ON_DARK_MUTED }}>for 4 months</span>
                <span className="hidden h-7 w-px sm:block" style={{ backgroundColor: LINE_DARK }} />
                <span className="text-sm" style={{ color: ON_DARK_MUTED }}>or <b style={{ color: GREEN }}>{fmt(f.price)}</b> a year</span>
              </div>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a href="#pricing" className="inline-flex h-14 items-center justify-center gap-2 rounded-lg px-7 font-bold text-sm" style={{ backgroundColor: ACTION, color: INK }}>
                  Get my membership <ArrowRight className="h-4 w-4" />
                </a>
                <a href={`https://wa.me/${SITE_CONFIG.whatsapp}`} target="_blank" rel="noopener noreferrer" className="inline-flex h-14 items-center justify-center gap-2 rounded-lg px-7 font-bold text-sm" style={{ backgroundColor: GREEN_DEEP, color: 'hsl(0 100% 99%)' }}>
                  <MessageCircle className="h-4 w-4" /> WhatsApp {firstName}
                </a>
              </div>
              <p className="mt-4 text-sm" style={{ color: ON_DARK_MUTED }}>
                MTN/Airtel mobile money or card · nothing renews automatically · certificates included
              </p>
            </div>
            <div className="aspect-[4/5] max-h-[640px] overflow-hidden rounded-2xl bg-[hsl(0_24%_8%)]">
              <Image src="/images/elvis-desk-wide.webp" alt="Learn2Earn founder George J Kasonso working in Lusaka" width={778} height={839} priority className="h-full w-full object-cover" />
            </div>
          </div>
        </section>

        {/* ============ LIVE CLASS BAND ============ */}
        <div className="aib-poster-theme">
          <section aria-labelledby="ai-beginners-heading" className="bg-[hsl(var(--echelon-ink-raised))] text-[hsl(0_100%_99%)]">
            <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
              <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                <div>
                  <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[hsl(var(--echelon-action))] px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] text-[hsl(var(--echelon-action))]">
                    Live class · {dateRange(LIVE_CLASS.startDate, LIVE_CLASS.endDate)}
                  </p>
                  <h2 id="ai-beginners-heading" className="font-head text-3xl font-extrabold leading-tight sm:text-4xl">
                    {LIVE_CLASS.title.replace(/ Class$/, '')}{' '}
                    <span className="aib-gradient-text">Class</span>
                  </h2>
                  <p className="mt-4 max-w-xl text-lg leading-8 text-[hsl(0_100%_99%)]">
                    {LIVE_CLASS.description}
                  </p>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Link href={`/cohorts/${LIVE_CLASS.slug}`} className="inline-flex h-12 items-center justify-center gap-2 rounded-lg px-6 font-bold text-sm text-[hsl(var(--echelon-ink))] bg-[hsl(var(--echelon-action))] hover:bg-[hsl(var(--echelon-action-hover))] transition-all">
                      Reserve my seat <ArrowRight className="h-4 w-4" />
                    </Link>
                    <p className="text-sm text-[hsl(0_100%_99%)]">
                      <b className="text-[hsl(var(--echelon-on-dark))]">{fmt(LIVE_CLASS.price)}</b> · {LIVE_CLASS.schedule}
                    </p>
                  </div>
                </div>
                <figure className="overflow-hidden rounded-2xl border border-[hsl(var(--echelon-line-dark))] bg-[hsl(var(--echelon-ink))]">
                  <Image src="/images/beginner-ai-classes.png" alt={`${LIVE_CLASS.title} poster — live class starting ${dateRange(LIVE_CLASS.startDate, LIVE_CLASS.endDate)}, ${LIVE_CLASS.schedule}`} width={1080} height={1080} loading="lazy" className="h-auto w-full" />
                </figure>
              </div>
              <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:mt-12">
                {LIVE_CLASS.lessons.map(v => (
                  <li key={v} className="flex items-start gap-3 rounded-xl border border-[hsl(var(--echelon-line-dark))] bg-[hsl(var(--echelon-ink))] p-4 text-sm font-medium text-[hsl(var(--echelon-on-dark))]">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--echelon-action))]" /> {v}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* ============ MEMBERSHIP HIGHLIGHTS ============ */}
          <section className="border-y border-[hsl(var(--echelon-line-dark))] bg-[hsl(var(--echelon-ink-raised))] text-[hsl(0_100%_99%)]">
            <div className="mx-auto grid max-w-7xl grid-cols-2 px-5 sm:px-8 lg:grid-cols-4 lg:px-12">
              {[[String(courseCount), "Published courses"], ["2", "Access plans"], ["Self-paced", "Learn on your schedule"], ["Direct", "Support from George"]].map(([v, g]) => (
                <div key={g} className="border-b border-r border-[hsl(var(--echelon-line-dark))] px-3 py-7 text-center lg:border-b-0">
                  <p className="text-2xl font-extrabold text-[hsl(var(--echelon-green))] sm:text-3xl">{v}</p>
                  <p className="mt-2 text-xs text-[hsl(0_100%_99%)]">{g}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ============ 01 — WHAT YOU GET ============ */}
        <section style={{ backgroundColor: 'hsl(0 100% 99%)' }}>
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:px-12 lg:py-28">
            <div>
              <p className="mb-5 text-xs font-extrabold uppercase tracking-[0.18em]" style={{ color: GREEN_DEEP }}>01 — What you get</p>
              <h2 className="font-head text-3xl font-extrabold leading-tight sm:text-4xl">Everything opens the day you join.</h2>
              <p className="mt-5 text-lg leading-8" style={{ color: ON_LIGHT_MUTED }}>Not one course. Not a sample. Every published course unlocks when your payment clears, including new lessons added while your access is active.</p>
              <ol className="mt-6 border-y" style={{ borderColor: LINE_LIGHT }}>
                {BENEFITS.map((b, i) => (
                  <li key={b} className="flex gap-4 py-4 text-base" style={{ borderBottom: i < BENEFITS.length - 1 ? `1px solid ${LINE_LIGHT}` : undefined }}>
                    <span className="font-bold" style={{ color: GREEN_DEEP }}>0{i + 1}</span>
                    {b}
                  </li>
                ))}
              </ol>
              <a href="#pricing" className="mt-8 inline-flex h-12 items-center justify-center rounded-lg px-6 font-bold text-sm" style={{ backgroundColor: ACTION, color: INK }}>Get my membership</a>
            </div>
            <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-[hsl(20_39%_93%)]">
              <Image src="/images/elvis-classroom.webp" alt="A practical Learn2Earn digital skills class" width={778} height={973} loading="lazy" className="h-full w-full object-cover" />
            </div>
          </div>
        </section>

        {/* ============ 02 — THE CATALOGUE ============ */}
        <section id="courses" style={{ backgroundColor: INK, color: 'hsl(0 100% 99%)' }}>
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:px-12 lg:py-28">
            <div>
              <p className="mb-5 text-xs font-extrabold uppercase tracking-[0.18em]" style={{ color: ACTION }}>02 — The catalogue</p>
              <h2 className="font-head text-3xl font-extrabold leading-tight text-[hsl(0_100%_99%)] sm:text-4xl">Skills people are actually paying for.</h2>
              <p className="mt-5 text-lg leading-8" style={{ color: 'hsl(0 100% 99%)' }}>Choose the skill you need now, then move through the full catalogue at your own pace.</p>
              <ul className="mt-7 grid sm:grid-cols-2 sm:gap-x-8">
                {courseList.map((c: any) => (
                  <li key={c.slug ?? c.title} className="border-t py-3.5 text-sm font-medium" style={{ borderColor: LINE_DARK }}>
                    <Link href={c.slug ? `/courses/${c.slug}` : '/courses'} className="flex items-center justify-between gap-3 hover:text-[hsl(151_73%_42%)] transition-all">
                      {c.title} <ArrowRight className="h-4 w-4 shrink-0" />
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href="/courses" className="mt-8 inline-flex h-12 items-center justify-center rounded-lg px-6 font-bold text-sm" style={{ backgroundColor: ACTION, color: INK }}>Browse all {courseCount} courses</Link>
            </div>
            <div className="aspect-[11/9] overflow-hidden rounded-2xl bg-[hsl(0_24%_8%)]">
              <Image src="/images/elvis-slide-wide.webp" alt="Learn2Earn digital skills training in progress" width={1080} height={886} loading="lazy" className="h-full w-full object-cover" />
            </div>
          </div>
        </section>

        {/* ============ FEATURED BUNDLE ============ */}
        <section aria-labelledby="smm-bundle-heading" style={{ backgroundColor: SAND }}>
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:px-12 lg:py-28">
            <div className="lg:order-2">
              <p className="mb-5 text-xs font-extrabold uppercase tracking-[0.18em]" style={{ color: GREEN_DEEP }}>Featured bundle</p>
              <h2 id="smm-bundle-heading" className="font-head text-3xl font-extrabold leading-tight sm:text-4xl">Social Media Management + Meta Ads, together.</h2>
              <p className="mt-5 text-lg leading-8" style={{ color: ON_LIGHT_MUTED }}>{FEATURED_BUNDLE.description} Two full courses, one payment.</p>
              <ul className="mt-7 space-y-3 text-sm">
                {FEATURED_BUNDLE.features.map((v: string) => (
                  <li key={v} className="flex items-start gap-3 rounded-xl border bg-[hsl(0_100%_100%)] p-4 font-medium" style={{ borderColor: LINE_LIGHT }}>
                    <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: GREEN_DEEP }} /> {v}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                <Link href="/checkout" className="inline-flex h-12 items-center justify-center rounded-lg px-6 font-bold text-sm" style={{ backgroundColor: ACTION, color: INK }}>Get the bundle — {fmt(FEATURED_BUNDLE.price)}</Link>
                <Link href="/courses" className="inline-flex h-12 items-center justify-center rounded-lg px-6 font-bold text-sm border" style={{ borderColor: GREEN_DEEP, color: GREEN_DEEP }}>See full details <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </div>
            </div>
            <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-white">
              <Image src="/images/smm-elvis-001.webp" alt="Social media management + Meta ads bundle" width={1080} height={1350} loading="lazy" className="h-full w-full object-cover" />
            </div>
          </div>
        </section>

        {/* ============ 03 — LIVE LEARNING ============ */}
        <section style={{ backgroundColor: 'hsl(0 100% 99%)' }}>
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:px-12 lg:py-28">
            <div>
              <p className="mb-5 text-xs font-extrabold uppercase tracking-[0.18em]" style={{ color: GREEN_DEEP }}>03 — Live learning</p>
              <h2 className="font-head text-3xl font-extrabold leading-tight sm:text-4xl">You are not learning alone.</h2>
              <p className="mt-5 text-lg leading-8" style={{ color: ON_LIGHT_MUTED }}>Recorded lessons carry the teaching. Live cohorts give you a place to ask questions and watch real work being done.</p>
              {nextCohort && (
                <div className="mt-6 rounded-xl p-5 border" style={{ borderColor: LINE_LIGHT, backgroundColor: CREAM }}>
                  <p className="font-bold text-foreground">{nextCohort.title}</p>
                  <p className="mt-2 flex items-center gap-2 text-sm" style={{ color: ON_LIGHT_MUTED }}>
                    <Video className="h-4 w-4" style={{ color: GREEN_DEEP }} /> {dateRange(nextCohort.startDate, nextCohort.endDate)} · {nextCohort.schedule}
                  </p>
                </div>
              )}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/cohorts" className="inline-flex h-12 items-center justify-center rounded-lg px-6 font-bold text-sm" style={{ backgroundColor: ACTION, color: INK }}>See live cohorts</Link>
                <a href={`https://wa.me/${SITE_CONFIG.whatsapp}`} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center justify-center rounded-lg px-6 font-bold text-sm border" style={{ borderColor: GREEN_DEEP, color: GREEN_DEEP }}>Ask {firstName}</a>
              </div>
            </div>
            <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-[hsl(0_100%_99%)]">
              <Image src="/images/elvis-teaching-phone.webp" alt={`${firstName} teaching a live digital skills session`} width={778} height={973} loading="lazy" className="h-full w-full object-cover" />
            </div>
          </div>
        </section>

        {/* ============ 04 — CLASSROOM EXPERIENCE ============ */}
        <section style={{ backgroundColor: CREAM }}>
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
            <div className="max-w-3xl">
              <p className="mb-5 text-xs font-extrabold uppercase tracking-[0.18em]" style={{ color: GREEN_DEEP }}>04 — The classroom experience</p>
              <h2 className="font-head text-3xl font-extrabold leading-tight sm:text-4xl">Recorded classes that still feel live.</h2>
              <p className="mt-5 text-lg leading-8" style={{ color: ON_LIGHT_MUTED }}>Most of our classes are recorded with a real cohort in the room. When you press play, you are not watching slides read aloud — you are sitting in the class. You hear the questions students actually asked, the conversations that followed, and the answers that came from working through real problems together.</p>
            </div>
            <ul className="mt-10 grid gap-5 sm:grid-cols-3">
              {CLASSROOM_CARDS.map(([title, body]) => (
                <li key={title} className="rounded-2xl border bg-[hsl(20_39%_93%)] p-6" style={{ borderColor: LINE_LIGHT }}>
                  <p className="font-extrabold">{title}</p>
                  <p className="mt-2 text-sm leading-6" style={{ color: ON_LIGHT_MUTED }}>{body}</p>
                </li>
              ))}
            </ul>
            <a href="#pricing" className="mt-10 inline-flex h-12 items-center justify-center rounded-lg px-6 font-bold text-sm" style={{ backgroundColor: ACTION, color: INK }}>Experience a class</a>
          </div>
        </section>

        {/* ============ 05 — ABOUT GEORGE ============ */}
        <section id="founder" style={{ backgroundColor: INK, color: 'hsl(0 100% 99%)' }}>
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:px-12 lg:py-28">
            <div>
              <p className="mb-5 text-xs font-extrabold uppercase tracking-[0.18em]" style={{ color: ACTION }}>05 — About {firstName}</p>
              <h2 className="font-head text-3xl font-extrabold leading-tight text-[hsl(0_100%_99%)] sm:text-4xl">I teach what I do for a living.</h2>
              <p className="mt-5 text-lg leading-8" style={{ color: ON_DARK_MUTED }}>
                I&apos;m {SITE_CONFIG.founder.name}. {SITE_CONFIG.founder.bio} My lessons use Zambian examples, kwacha prices and plain language — because that is how I work too.
              </p>
              <p className="mt-4 text-lg leading-8" style={{ color: ON_DARK_MUTED }}>Learn2Earn has no support desk. When you message, you are speaking directly with me.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="#pricing" className="inline-flex h-12 items-center justify-center rounded-lg px-6 font-bold text-sm" style={{ backgroundColor: ACTION, color: INK }}>Learn with me</a>
                <Link href="/about" className="inline-flex h-12 items-center justify-center rounded-lg px-6 font-bold text-sm border text-[hsl(0_100%_99%)]" style={{ borderColor: LINE_DARK }}>Read my story</Link>
              </div>
            </div>
            <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-[hsl(0_24%_8%)]">
              <Image src="/images/elvis-mic.webp" alt={`${SITE_CONFIG.founder.name}, founder and instructor at Learn2Earn`} width={778} height={973} loading="lazy" className="h-full w-full object-cover" />
            </div>
          </div>
        </section>

        {/* ============ WATCH AND LEARN ============ */}
        <section aria-labelledby="watch-learn-heading" style={{ backgroundColor: INK, color: 'hsl(0 100% 99%)' }}>
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <p className="mb-5 text-xs font-extrabold uppercase tracking-[0.18em]" style={{ color: ACTION }}>
                  Watch and learn
                </p>
                <h2 id="watch-learn-heading" className="font-head text-3xl font-extrabold leading-tight sm:text-4xl text-[hsl(0_100%_99%)]">
                  Practical lessons from {firstName}
                </h2>
                <p className="mt-5 text-lg leading-8" style={{ color: 'hsl(0 100% 99%)' }}>
                  Short lessons on digital skills, freelancing, web design and turning what you know into useful work.
                </p>
                <a href={SITE_CONFIG.social.tiktok} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-lg px-7 font-bold text-sm" style={{ backgroundColor: ACTION, color: INK }}>
                  Watch on TikTok <ArrowRight className="h-4 w-4" />
                </a>
              </div>
              <div className="relative aspect-video overflow-hidden rounded-2xl border border-[#1E293B] bg-[#0A0D14]">
                <Image
                  src="/images/elvis-teaching-phone.webp"
                  alt={`${firstName} teaching digital skills`}
                  width={1080}
                  height={608}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
                    <Play className="w-5 h-5 text-[#0A0D14] ml-0.5" fill="#0A0D14" />
                  </div>
                </div>
              </div>
            </div>

            {/* TikTok video cards */}
            <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {TIKTOK_VIDEOS.map((v, i) => (
                <a
                  key={`tiktok-${i}`}
                  href={v.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-2xl border bg-[hsl(0_100%_100%)] overflow-hidden hover:shadow-md transition-all"
                  style={{ borderColor: LINE_LIGHT }}
                >
                  <div className="relative aspect-video bg-[#EEF1EE]">
                    <Image
                      src={v.image}
                      alt={v.title}
                      width={600}
                      height={338}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
                        <Play className="w-6 h-6 text-[#0A0D14] ml-0.5" fill="#0A0D14" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded">
                      {v.duration}
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="font-bold text-foreground mb-1">{v.title}</p>
                    <p className="text-xs" style={{ color: ON_LIGHT_MUTED }}>{v.desc}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="flex items-center gap-1 text-xs font-semibold text-[#2E3D37]">
                        <span className="bg-[#E8F8F0] text-[#0F7A42] px-2 py-0.5 rounded text-[10px]">TikTok</span> @george_kasonso
                      </span>
                      <ArrowRight className="w-3 h-3 text-[#2E3D37]" />
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {/* Learner reviews */}
            <div className="mt-16 rounded-2xl border bg-[hsl(0_100%_100%)] p-8" style={{ borderColor: LINE_LIGHT }}>
              <div className="flex items-center gap-2 mb-4">
                <Megaphone className="h-4 w-4" style={{ color: GREEN_DEEP }} />
                <p className="font-extrabold text-foreground">Learner reviews</p>
              </div>
              <p className="text-sm text-[hsl(0_100%_99%)/70] mb-6">
                What learners say after taking the classes.
              </p>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {REVIEWS.slice(0, 6).map((r) => (
                  <div key={r.id} className="p-5 rounded-xl border bg-[hsl(0_24%_8%)]" style={{ borderColor: LINE_LIGHT }}>
                    <div className="flex gap-1 mb-3" aria-label={`${r.rating} out of 5 stars`}>
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4" style={{ color: ACTION, fill: ACTION }} aria-hidden="true" />
                      ))}
                    </div>
                    <blockquote className="text-sm leading-6 mb-4" style={{ color: 'hsl(0 100% 99%)/90' }}>
                      &ldquo;{r.content}&rdquo;
                    </blockquote>
                    <figcaption className="text-xs">
                      <p className="font-extrabold text-[hsl(0_100%_99%)]">{r.name}</p>
                      <p className="text-[hsl(0_100%_99%)/60]">{r.cohort}</p>
                    </figcaption>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Link href="/reviews" className="text-sm font-extrabold underline" style={{ color: ACTION }}>
                  Read all learner reviews <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ============ MEMBERSHIP PRICING ============ */}
        <section id="pricing" style={{ backgroundColor: CREAM }}>
          <div className="mx-auto max-w-5xl px-5 py-20 text-center sm:px-8 lg:px-12 lg:py-28">
            <p className="mb-5 text-xs font-extrabold uppercase tracking-[0.18em]">Membership</p>
            <h2 className="font-head text-3xl font-extrabold leading-tight sm:text-4xl">Choose how long you want to learn.</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg" style={{ color: ON_LIGHT_MUTED }}>One payment. Every published course. No automatic renewal.</p>
            <div className="mt-10 grid gap-5 text-left md:grid-cols-2">
              {MEMBERSHIP_PLANS.map(plan => {
                const isYear = plan.popular
                return (
                  <article key={plan.id} className="relative rounded-2xl bg-[hsl(0_100%_100%)] p-7" style={{ border: isYear ? `2px solid ${ACTION}` : `1px solid ${LINE_LIGHT}` }}>
                    {isYear && plan.badge && <span className="absolute right-5 top-0 -translate-y-1/2 rounded-full px-3 py-1 text-xs font-extrabold" style={{ backgroundColor: ACTION, color: INK }}>{plan.badge}</span>}
                    <p className="text-sm font-bold" style={{ color: GREEN_DEEP }}>{isYear ? 'One year' : 'Four months'}</p>
                    <p className="mt-3 text-4xl font-extrabold">{fmt(plan.price)}</p>
                    <ul className="mt-6 space-y-3 text-sm" style={{ color: ON_LIGHT_MUTED }}>
                      {plan.features.slice(0, 4).map((b: string) => (
                        <li key={b} className="flex items-center gap-2"><Check className="h-4 w-4 shrink-0" style={{ color: GREEN_DEEP }} /> {b}</li>
                      ))}
                    </ul>
                    <Link href={`/subscribe?plan=${plan.id}`} className="mt-7 flex h-12 w-full items-center justify-center rounded-lg font-bold text-sm" style={isYear ? { backgroundColor: ACTION, color: INK } : { backgroundColor: INK, color: 'hsl(0 100% 99%)' }}>
                      {isYear ? 'Get the year' : 'Get 4 months'}
                    </Link>
                  </article>
                )
              })}
            </div>
            <a href={`https://wa.me/${SITE_CONFIG.whatsapp}`} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-lg px-6 font-bold text-sm border" style={{ borderColor: GREEN_DEEP, color: GREEN_DEEP }}>
              <MessageCircle className="h-4 w-4" /> Ask about manual payment
            </a>
          </div>
        </section>

        {/* ============ QUESTIONS / FAQ ============ */}
        <section id="faq" style={{ backgroundColor: INK, color: 'hsl(0 100% 99%)' }}>
          <div className="mx-auto grid max-w-7xl items-start gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:gap-20 lg:px-12 lg:py-28">
            <div>
              <p className="mb-5 text-xs font-extrabold uppercase tracking-[0.18em]" style={{ color: ACTION }}>Questions</p>
              <h2 className="font-head text-3xl font-extrabold leading-tight text-[hsl(0_100%_99%)] sm:text-4xl">Before you join.</h2>
              <p className="mt-5 text-lg leading-8" style={{ color: ON_DARK_MUTED }}>Still unsure? Message {firstName} directly and get a clear answer.</p>
              <a href={`https://wa.me/${SITE_CONFIG.whatsapp}`} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-lg px-6 font-bold text-sm" style={{ backgroundColor: GREEN_DEEP, color: 'hsl(0 100% 99%)' }}>
                <MessageCircle className="h-4 w-4" /> WhatsApp {firstName}
              </a>
            </div>
            <div className="border-y" style={{ borderColor: LINE_DARK }}>
              {HOME_FAQS.map(([q, a]) => (
                <details key={q} className="group" style={{ borderBottom: `1px solid ${LINE_DARK}` }}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-5 font-bold text-[hsl(0_100%_99%)]">
                    <span>{q}</span>
                    <ChevronDown className="h-5 w-5 shrink-0 transition-transform group-open:rotate-180" style={{ color: GREEN }} />
                  </summary>
                  <p className="pb-5 pr-10 leading-7" style={{ color: ON_DARK_MUTED }}>{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ============ FINAL CTA ============ */}
        <section style={{ backgroundColor: SAND }}>
          <div className="mx-auto max-w-3xl px-5 py-20 text-center sm:px-8 lg:py-24">
            <h2 className="font-head text-3xl font-extrabold leading-tight sm:text-4xl">Pick the skill. Do the work. Build the proof.</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8" style={{ color: ON_LIGHT_MUTED }}>Join {SITE_CONFIG.name} and start with the course that moves you forward now.</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a href="#pricing" className="inline-flex h-14 items-center justify-center rounded-lg px-7 font-bold text-sm" style={{ backgroundColor: ACTION, color: INK }}>Get my membership</a>
              <Link href="/courses" className="inline-flex h-14 items-center justify-center rounded-lg px-7 font-bold text-sm border" style={{ borderColor: GREEN_DEEP, color: GREEN_DEEP }}>Browse courses</Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
