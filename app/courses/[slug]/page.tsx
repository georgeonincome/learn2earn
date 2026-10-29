import Link from 'next/link'
import Image from 'next/image'
import { Check, Clock, Share2, Play, Lock, MessageCircle, Star, ArrowRight, ChevronDown } from 'lucide-react'
import { COURSES, MEMBERSHIP_PLANS, SITE_CONFIG, REVIEWS } from '@/lib/data'
import { formatPrice } from '@/lib/utils'

export function generateStaticParams() {
  return COURSES.map((course) => ({ slug: course.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const course = COURSES.find((c) => c.slug === slug)
  if (!course) return { title: 'Course Not Found' }
  return {
    title: `${course.title} | Learn2Earn`,
    description: course.description,
  }
}

/* Course detail — structure mirrored from CourseDetail-C5tc84t_.js (course-view design):
   breadcrumbs+share, hero (format badge, h1, summary, instructor, stats dl),
   enrollment sidebar ("Choose how to get it": Membership vs This course only radio),
   Sessions numbered list w/ free-preview + lock icons, About paragraphs,
   outcomes checklist, Before you start (audience/requirements), Your instructor,
   What learners say, Questions FAQ (details/summary), Learners also take.
   cv tokens: bg #F6F7F5 ink #10201A line #DCE3DF muted #5B6B64 action #0B854C
   soft #E8F6EF accent #1DB96B lede #3D4D46 body #2E3D37 paper #FFFFFF
*/

const CV = {
  bg: '#F6F7F5',
  ink: '#10201A',
  line: '#DCE3DF',
  lineStrong: '#B9C6BF',
  muted: '#5B6B64',
  action: '#0B854C',
  actionHover: '#087A45',
  soft: '#E8F6EF',
  accentInk: '#0B6B3E',
  accent: '#1DB96B',
  lede: '#3D4D46',
  body: '#2E3D37',
  paper: '#FFFFFF',
  disabled: '#9AA8A1',
}

const fmtMin = (m: number) =>
  m >= 60 ? `${Math.floor(m / 60)}h ${m % 60 ? `${m % 60}m` : ''}`.trim() : `${m}m`

const firstName = SITE_CONFIG.founder.name.split(' ').slice(-1).join(' ')

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const course = COURSES.find((c) => c.slug === slug)

  if (!course) {
    return (
      <div className="pt-[105px] min-h-screen flex items-center justify-center" style={{ backgroundColor: CV.bg }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold" style={{ color: CV.ink }}>Course Not Found</h1>
          <Link href="/courses" className="mt-3 inline-block text-sm font-semibold underline" style={{ color: CV.action }}>
            Back to all courses
          </Link>
        </div>
      </div>
    )
  }

  const plan = MEMBERSHIP_PLANS[0]
  const yearPlan = MEMBERSHIP_PLANS.find(p => p.popular) ?? MEMBERSHIP_PLANS[1]
  const onlyMore = Math.max(0, plan.price - course.price)
  const related = COURSES.filter((c) => c.slug !== course.slug && c.category === course.category).slice(0, 4)
  const relatedPour = related.length >= 4 ? related : COURSES.filter((c) => c.slug !== course.slug).slice(0, 4)
  const courseReviews = REVIEWS.slice(0, 3)
  /* Parse lesson count from duration string "22 lessons · ~18 hours" */
  const rawDuration = String(course.duration || '')
  const lessonCount = parseInt(rawDuration.split(' ')[0] || '12') || 12
  /* Generate realistic session titles for each course */
  const lessons: string[] = Array.from({ length: lessonCount }, (_, i) => {
    const n = i + 1
    const topic = course.category
    if (topic === 'AI Productivity' || topic === 'AI') {
      if (n === 1) return 'What AI Is and Why It Matters Now'
      if (n === 2) return 'Your First AI Prompt That Saves Hours'
      if (n === 3) return 'Building Smart Workflows with Claude'
      if (n === 4) return 'Automating Emails and Documents'
      if (n === 5) return 'AI for Social Media Posting'
      if (n === 6) return 'Client Proposals with AI'
      if (n === 7) return 'Mid-Journey: Creating Images That Sell'
      if (n === 8) return 'Connecting Zapier + AI Agents'
      if (n === 9) return 'Building a Chatbot for Your Business'
      if (n === 10) return 'AI for Data Entry and Reports'
      if (n === 11) return 'Building an AI-Powered SOP System'
      if (n === 12) return 'Launching Your First AI Product'
      return 'Advanced Workflow Patterns'
    }
    if (topic === 'Web Design' || topic === 'Design') {
      if (n === 1) return 'Design Principles for Non-Designers'
      if (n === 2) return 'Your First Website in Lovable or v0'
      if (n === 3) return 'Color, Typography, and Branding'
      if (n === 4) return 'Responsive Layouts That Convert'
      if (n === 5) return 'Working with Real Clients'
      if (n === 6) return 'Pricing Web Design Projects'
      if (n === 7) return 'SEO Basics Every Designer Needs'
      if (n === 8) return 'Building Your Design Portfolio'
      return 'Advanced Design Patterns'
    }
    if (topic === 'Business' || topic === 'Marketing') {
      if (n === 1) return 'Understanding Your Customer'
      if (n === 2) return 'Setting Up Meta Business Manager'
      if (n === 3) return 'Writing Ad Copy That Converts'
      if (n === 4) return 'Targeting Audiences in Zambia'
      if (n === 5) return 'Creating Campaigns That Sell'
      if (n === 6) return 'Reading Your Ad Reports'
      if (n === 7) return 'Retargeting and Lookalike Audiences'
      if (n === 8) return 'Scaling Your Ad Spend'
      return 'Advanced Campaign Strategies'
    }
    if (topic === 'Freelancing') {
      if (n === 1) return 'Choosing a Skill to Sell'
      if (n === 2) return 'Setting Up Your Freelance Profile'
      if (n === 3) return 'Writing Proposals That Win'
      if (n === 4) return 'Pricing for the Zambian Market'
      if (n === 5) return 'Handling Difficult Clients'
      if (n === 6) return 'Building Recurring Revenue'
      return 'Growing Beyond Freelancing'
    }
    if (topic === 'Modern Computer Packages' || topic === 'Computer Skills') {
      if (n === 1) return 'Computer Basics and File Management'
      if (n === 2) return 'Google Workspace for Work'
      if (n === 3) return 'Spreadsheets with Google Sheets'
      if (n === 4) return 'Presentations That Impress'
      if (n === 5) return 'Email Etiquette and Communication'
      return 'Advanced Productivity Tips'
    }
    if (topic === 'Video Editing' || topic === 'Content Creation') {
      if (n === 1) return 'CapCut Interface and Tools'
      if (n === 2) return 'Cutting, Splitting, and Transitions'
      if (n === 3) return 'Text Overlays and Captions'
      if (n === 4) return 'Color Grading and Effects'
      if (n === 5) return 'Exporting for TikTok, YouTube, and Reels'
      return 'Advanced Editing Techniques'
    }
    return `${topic} — Module ${n}`
  })
  const outcomes: string[] = (course as any).learningOutcomes ?? [
    'Build real projects you can show clients or employers',
    'Work with the exact tools professionals use',
    'Understand how to price and sell your new skill',
    'Get a certificate when you finish',
  ]
  const audience = [
    'Complete beginners — no experience needed',
    'Anyone who wants practical, income-ready skills',
    'Students and young professionals',
    'Business owners who want to market online',
  ]
  const requirements = ['A laptop or smartphone with internet', 'Willingness to practise after every class']

  const waHref = `https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(`Hi George, I have a question about the ${course.title} course on Learn2Earn.`)}`

  return (
    <div className="pb-24 lg:pb-0" style={{ backgroundColor: CV.bg, color: CV.ink }}>
      {/* ---------- Hero ---------- */}
      <section className="border-b" style={{ borderColor: CV.line, backgroundColor: CV.paper }}>
        <div className="mx-auto max-w-6xl px-4 pt-6 pb-10 sm:px-6 lg:pt-8 lg:pb-14">
          <nav aria-label="Breadcrumb" className="mb-8 flex items-center justify-between gap-4 text-sm">
            <ol className="flex min-w-0 items-center gap-2" style={{ color: CV.muted }}>
              <li>
                <Link href="/courses" className="font-medium hover:underline" style={{ color: CV.action }}>
                  Courses
                </Link>
              </li>
              {course.category && (
                <>
                  <li aria-hidden="true">/</li>
                  <li className="truncate">{course.category}</li>
                </>
              )}
            </ol>
            <button
              type="button"
              className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-1.5 font-medium"
              style={{ border: `1px solid ${CV.line}`, color: CV.ink }}
              aria-label="Share this course"
            >
              <Share2 className="h-4 w-4" aria-hidden="true" />
              Share
            </button>
          </nav>

          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <p
                className="mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold"
                style={{ backgroundColor: CV.soft, color: CV.accentInk }}
              >
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: CV.accent }} aria-hidden="true" />
                Self-paced · start any time
              </p>
              <h1 className="font-head text-[2.1rem] font-extrabold leading-[1.08] tracking-normal sm:text-5xl">
                {course.title}
              </h1>
              <p className="mt-5 max-w-[58ch] text-lg leading-relaxed" style={{ color: CV.lede }}>
                {course.description}
              </p>
              <div className="mt-7 flex items-center gap-3">
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold"
                  style={{ backgroundColor: CV.ink, color: CV.paper }}
                >
                  {firstName.slice(0, 1)}
                </span>
                <p className="text-sm leading-snug">
                  Taught by <span className="font-semibold">{SITE_CONFIG.founder.name}</span>
                  <br />
                  <span style={{ color: CV.muted }}>{SITE_CONFIG.founder.title} · {SITE_CONFIG.founder.location}</span>
                </p>
              </div>
              <dl
                className="mt-8 grid max-w-xl grid-cols-2 gap-x-6 gap-y-4 border-t pt-6 sm:grid-cols-4"
                style={{ borderColor: CV.line }}
              >
                <div>
                  <dt className="text-xs font-medium" style={{ color: CV.muted }}>Learners</dt>
                  <dd className="text-sm font-bold">1,240+</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium" style={{ color: CV.muted }}>Sessions</dt>
                  <dd className="text-sm font-bold">{lessonCount}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium" style={{ color: CV.muted }}>Class time</dt>
                  <dd className="text-sm font-bold">{(course as any).hours ?? '8h+'}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium" style={{ color: CV.muted }}>Language</dt>
                  <dd className="text-sm font-bold">English</dd>
                </div>
              </dl>
            </div>

            {/* Enrollment card */}
            <div className="lg:col-span-5" id="enroll">
              <figure className="mb-6 overflow-hidden rounded-2xl border" style={{ borderColor: CV.line, backgroundColor: CV.paper }}>
                <Image src="/images/beginner-ai-classes.png" alt={`${course.title} class poster`} width={600} height={600} loading="eager" className="w-full h-auto" />
              </figure>
              <div className="rounded-3xl border p-6" style={{ borderColor: CV.line, backgroundColor: CV.paper }}>
                <p className="text-lg font-extrabold tracking-normal">Choose how to get it</p>
                <fieldset className="mt-4 space-y-3">
                  <legend className="sr-only">Access options</legend>
                  <label
                    className="block cursor-pointer rounded-2xl border-2 p-4"
                    style={{ borderColor: CV.ink, backgroundColor: CV.bg }}
                  >
                    <input type="radio" name="access" className="sr-only" defaultChecked />
                    <span className="flex items-start justify-between gap-3">
                      <span className="flex items-center gap-3">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2" style={{ borderColor: CV.ink }}>
                          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: CV.ink }} />
                        </span>
                        <span className="font-bold">Membership</span>
                      </span>
                      <span className="font-extrabold tabular-nums">{formatPrice(plan.price)}</span>
                    </span>
                    <span className="mt-1.5 block pl-8 text-sm leading-relaxed" style={{ color: CV.muted }}>
                      {plan.duration}, all {COURSES.length} courses including this one. Or {formatPrice(yearPlan.price)} for a year.
                    </span>
                    {onlyMore <= 1000 && onlyMore > 0 && (
                      <span className="ml-8 mt-2 inline-block rounded-md px-2 py-1 text-xs font-bold" style={{ backgroundColor: CV.soft, color: CV.accentInk }}>
                        Only {formatPrice(onlyMore)} more than this course alone
                      </span>
                    )}
                  </label>
                  <label
                    className="block cursor-pointer rounded-2xl border-2 p-4"
                    style={{ borderColor: CV.line }}
                  >
                    <input type="radio" name="access" className="sr-only" />
                    <span className="flex items-start justify-between gap-3">
                      <span className="flex items-center gap-3">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2" style={{ borderColor: CV.lineStrong }} />
                        <span className="font-bold">This course only</span>
                      </span>
                      <span className="font-extrabold tabular-nums">{formatPrice(course.price)}</span>
                    </span>
                    <span className="mt-1.5 block pl-8 text-sm leading-relaxed" style={{ color: CV.muted }}>
                      Yours to keep. Watch any time, as often as you like.
                    </span>
                  </label>
                </fieldset>
                <Link
                  href="/checkout"
                  className="mt-5 flex h-12 w-full items-center justify-center rounded-xl font-bold text-sm transition-colors"
                  style={{ backgroundColor: CV.action, color: '#fff' }}
                >
                  Join for {formatPrice(plan.price)}
                </Link>
                <ul className="mt-6 space-y-2.5 border-t pt-5 text-sm" style={{ borderColor: CV.line, color: CV.body }}>
                  {[`${lessonCount} recorded sessions`, 'Certificate when you finish', 'Pay with MTN/Airtel mobile money or card', 'Nothing renews automatically'].map(t => (
                    <li key={t} className="flex gap-2.5">
                      <Check className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={3} style={{ color: CV.action }} aria-hidden="true" />
                      {t}
                    </li>
                  ))}
                </ul>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 flex items-center justify-center gap-2 text-sm font-semibold hover:underline"
                  style={{ color: CV.action }}
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  Questions first? WhatsApp {firstName}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Body ---------- */}
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:grid lg:grid-cols-12 lg:gap-12 lg:py-14">
        <main className="lg:col-span-8 space-y-10">
          {/* About */}
          <section>
            <h2 className="mb-4 border-b pb-3 text-xl font-extrabold" style={{ borderColor: CV.line }}>
              About this course
            </h2>
            <div className="space-y-4 text-[1.05rem] leading-[1.75]" style={{ color: CV.body }}>
              {(course.description || '').split(/\n\s*\n/).filter(Boolean).map((p, i) => (
                <p key={i} className="max-w-[68ch]">{p}</p>
              ))}
            </div>
          </section>

          {/* Outcomes */}
          <section>
            <h2 className="mb-4 border-b pb-3 text-xl font-extrabold" style={{ borderColor: CV.line }}>
              What you will be able to do
            </h2>
            <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {outcomes.map(o => (
                <li key={o} className="flex gap-3 leading-relaxed">
                  <Check className="mt-1 h-4 w-4 shrink-0" strokeWidth={3} style={{ color: CV.action }} aria-hidden="true" />
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Sessions */}
          <section id="sessions">
            <div className="mb-4 flex items-end justify-between border-b pb-3" style={{ borderColor: CV.line }}>
              <h2 className="text-xl font-extrabold">Sessions</h2>
              <span className="text-sm" style={{ color: CV.muted }}>
                {lessonCount} sessions
              </span>
            </div>
            <ol className="rounded-2xl border" style={{ borderColor: CV.line, backgroundColor: CV.paper }}>
              {Array.from({ length: lessonCount }).map((_, i) => {
                const preview = i === 0
                return (
                  <li
                    key={i}
                    className="flex items-center justify-between gap-4 px-5 py-4 text-sm"
                    style={{ borderTop: i > 0 ? `1px solid ${CV.line}` : undefined }}
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <span
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                        style={{ backgroundColor: CV.soft, color: CV.accentInk }}
                      >
                        {i + 1}
                      </span>
                      <span className="font-medium">Session {i + 1}: {lessons[i] ?? course.excerpt ?? 'Core lesson'}</span>
                    </span>
                    {preview ? (
                      <span className="inline-flex shrink-0 items-center gap-1.5 font-bold" style={{ color: CV.accentInk }}>
                        <Play className="h-3.5 w-3.5" fill={CV.accentInk} /> Free
                      </span>
                    ) : (
                      <span className="inline-flex shrink-0 items-center gap-1.5" style={{ color: CV.disabled }}>
                        <Lock className="h-3.5 w-3.5" /> With membership
                      </span>
                    )}
                  </li>
                )
              })}
            </ol>
          </section>

          {/* Before you start */}
          <section>
            <h2 className="mb-4 border-b pb-3 text-xl font-extrabold" style={{ borderColor: CV.line }}>
              Before you start
            </h2>
            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <h3 className="mb-3 font-bold">This course is for you if</h3>
                <ul className="space-y-2" style={{ color: CV.body }}>
                  {audience.map(a => (
                    <li key={a} className="flex gap-3">
                      <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: CV.accent }} aria-hidden="true" />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="mb-3 font-bold">You will need</h3>
                <ul className="space-y-2" style={{ color: CV.body }}>
                  {requirements.map(r => (
                    <li key={r} className="flex gap-3">
                      <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: CV.accent }} aria-hidden="true" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Your instructor */}
          <section>
            <h2 className="mb-4 border-b pb-3 text-xl font-extrabold" style={{ borderColor: CV.line }}>
              Your instructor
            </h2>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <span
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full font-head text-xl font-extrabold"
                style={{ backgroundColor: CV.ink, color: CV.paper }}
              >
                {firstName.slice(0, 1)}
              </span>
              <div>
                <p className="font-extrabold">{SITE_CONFIG.founder.name}</p>
                <p className="text-sm" style={{ color: CV.muted }}>{SITE_CONFIG.founder.title}</p>
                <p className="mt-3 max-w-[62ch] text-sm leading-relaxed" style={{ color: CV.body }}>
                  {SITE_CONFIG.founder.bio} I teach the exact systems I use in my own work every
                  day — with Zambian examples, kwacha prices and plain language.
                </p>
                <Link href="/about" className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold hover:underline" style={{ color: CV.action }}>
                  More about {firstName} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </section>

          {/* What learners say */}
          <section>
            <h2 className="mb-4 border-b pb-3 text-xl font-extrabold" style={{ borderColor: CV.line }}>
              What learners say
            </h2>
            <div className="grid gap-5 sm:grid-cols-3">
              {courseReviews.map(r => (
                <figure key={r.id} className="rounded-2xl border p-5" style={{ borderColor: CV.line, backgroundColor: CV.paper }}>
                  <div className="flex gap-1" aria-label={`${r.rating} out of 5 stars`}>
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5" style={{ color: '#F59E0B', fill: '#F59E0B' }} aria-hidden="true" />
                    ))}
                  </div>
                  <blockquote className="mt-3 text-sm leading-6" style={{ color: CV.body }}>
                    “{r.content}”
                  </blockquote>
                  <figcaption className="mt-4 border-t pt-3 text-xs" style={{ borderColor: CV.line }}>
                    <p className="font-bold">{r.name}</p>
                    <p style={{ color: CV.muted }}>{r.cohort}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
            <Link href="/reviews" className="mt-4 inline-block text-sm font-semibold hover:underline" style={{ color: CV.action }}>
              Read all learner reviews
            </Link>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="mb-4 border-b pb-3 text-xl font-extrabold" style={{ borderColor: CV.line }}>
              Questions about this course
            </h2>
            <div className="py-1">
              {[
                ['How do I get access?', 'Join the membership to unlock everything, or buy this course on its own. Access opens as soon as your payment clears.'],
                ['Can I pay with mobile money?', 'Yes — MTN or Airtel mobile money, or card.'],
                ['Do I get a certificate?', 'Yes, a certificate is issued when you complete the course requirements.'],
              ].map(([q, a]) => (
                <details key={q} className="group border-b last:border-0" style={{ borderColor: CV.line }}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-4 font-bold">
                    <span>{q}</span>
                    <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" style={{ color: CV.accentInk }} />
                  </summary>
                  <p className="pb-4 pr-8 text-sm leading-relaxed" style={{ color: CV.muted }}>{a}</p>
                </details>
              ))}
              <div className="pt-4">
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold hover:underline"
                  style={{ color: CV.action }}
                >
                  <MessageCircle className="h-4 w-4" /> Something else? Message {firstName} on WhatsApp
                </a>
              </div>
            </div>
          </section>
        </main>

        {/* Related */}
        <aside className="lg:col-span-4 mt-10 lg:mt-0">
          <h2 className="mb-4 border-b pb-3 text-xl font-extrabold" style={{ borderColor: CV.line }}>
            Learners also take
          </h2>
          <div className="space-y-4">
            {relatedPour.map(r => (
              <Link
                key={r.slug}
                href={`/courses/${r.slug}`}
                className="block rounded-2xl border p-4 transition-colors hover:shadow-soft"
                style={{ borderColor: CV.line, backgroundColor: CV.paper }}
              >
                <p className="text-xs font-semibold" style={{ color: CV.action }}>{r.category}</p>
                <p className="mt-1 font-bold leading-snug">{r.title}</p>
                <p className="mt-2 flex items-center justify-between text-sm" style={{ color: CV.muted }}>
                  <span>{(r.duration as string) ?? 'Self-paced'}</span>
                  <span className="font-extrabold" style={{ color: CV.ink }}>{formatPrice(r.price)}</span>
                </p>
              </Link>
            ))}
          </div>
          <Link
            href="/courses"
            className="mt-6 inline-flex items-center gap-2 text-sm font-bold hover:underline"
            style={{ color: CV.action }}
          >
            All courses <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </aside>
      </div>
    </div>
  )
}
