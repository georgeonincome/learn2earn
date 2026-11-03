import Link from 'next/link'
import Image from 'next/image'
import { Check, Clock, Share2, Play, Lock, MessageCircle, ArrowRight, ChevronDown, Star } from 'lucide-react'
import { COURSES, MEMBERSHIP_PLANS, SITE_CONFIG, REVIEWS } from '@/lib/data'
import { formatPrice } from '@/lib/utils'
import { REFERENCE_LESSONS, type Lesson } from '@/lib/reference-lessons'

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

/* Course detail — exact structure from CourseDetail-C5tc84t_.js (course-view):
   hero (breadcrumb+share, format pill, h1, summary, instructor, stats dl),
   hero right: course cover image OR category+title fallback (es),
   compact sessions bar (ss),
   body grid: main (col-span-8) + sticky right sidebar (col-span-4)
   main: mobile enrollment card at top, then About, Outcomes, Sessions,
   Before you start, Your instructor, What learners say, Questions FAQ,
   Related courses + membership upsell
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
  accent: '#1DB96B',
  accentInk: '#0B6B3E',
  lede: '#3D4D46',
  body: '#2E3D37',
  paper: '#FFFFFF',
  disabled: '#9AA8A1',
}

const fmtMin = (m: number) =>
  m >= 60 ? `${Math.floor(m / 60)}h ${m % 60 ? `${m % 60}m` : ''}`.trim() : `${m}m`

const fmtDate = (iso: string) =>
  iso ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''

const firstName = SITE_CONFIG.founder.name.split(' ').slice(-1).join(' ')

const plan = MEMBERSHIP_PLANS[0]
const yearPlan = MEMBERSHIP_PLANS.find((p) => p.popular) ?? MEMBERSHIP_PLANS[1]

// Group lessons by section (matching Xe in reference)
function groupLessons(lessons: Lesson[]) {
  const groups: { title: string | undefined; lessons: { lesson: Lesson; index: number }[] }[] = []
  // Since our lesson data doesn't have sections, all lessons go in one group
  if (lessons.length === 0) return []
  groups.push({ title: undefined, lessons: lessons.map((l, i) => ({ lesson: l, index: i })) })
  return groups
}

const StatItem = ({ label, value }: { label: string; value: string }) => (
  <div>
    <dt className="text-sm text-[var(--cv-muted)]">{label}</dt>
    <dd className="mt-0.5 text-lg font-bold tabular-nums">{value}</dd>
  </div>
)

const CourseSection = ({ title, id, aside, children }: { title: string; id?: string; aside?: React.ReactNode; children: React.ReactNode }) => (
  <section
    id={id}
    className="scroll-mt-24 border-t border-[var(--cv-line)] py-10"
  >
    <div className="mb-6 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
      <h2 className="text-2xl font-extrabold tracking-normal">{title}</h2>
      {aside}
    </div>
    {children}
  </section>
)

const EnrollmentOption = ({ name, checked, title, price, note, highlight }: {
  name: string
  checked: boolean
  title: string
  price: string
  note: string
  highlight?: string
}) => (
  <label
    className={`block cursor-pointer rounded-2xl border-2 p-4 transition-colors motion-reduce:transition-none has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--cv-action)] ${checked ? 'border-[var(--cv-ink)] bg-[var(--cv-bg)]' : 'border-[var(--cv-line)] hover:border-[var(--cv-line-strong)]'}`}
  >
    <input type="radio" name={name} className="sr-only" checked={checked} defaultChecked={checked} />
    <span className="flex items-start justify-between gap-3">
      <span className="flex items-center gap-3">
        <span
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${checked ? 'border-[var(--cv-ink)]' : 'border-[var(--cv-line-strong)]'}`}
          aria-hidden="true"
        >
          {checked && <span className="h-2.5 w-2.5 rounded-full bg-[var(--cv-ink)]" />}
        </span>
        <span className="font-bold">{title}</span>
      </span>
      <span className="font-extrabold tabular-nums">{price}</span>
    </span>
    <span className="mt-1.5 block pl-8 text-sm leading-relaxed text-[var(--cv-muted)]">{note}</span>
    {highlight && (
      <span className="ml-8 mt-2 inline-block rounded-md bg-[var(--cv-soft)] px-2 py-1 text-xs font-bold text-[var(--cv-accent-ink)]">
        {highlight}
      </span>
    )}
  </label>
)

const PrimaryButton = ({ children, mt }: { children: React.ReactNode; mt?: string }) => (
  <button
    className={`flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--cv-action)] px-5 py-4 text-base font-bold text-[var(--cv-paper)] hover:bg-[var(--cv-action-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cv-action)] ${mt ?? ''}`}
  >
    {children}
  </button>
)

const SecondaryButton = ({ children, mt }: { children: React.ReactNode; mt?: string }) => (
  <button
    className={`flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--cv-line)] bg-[var(--cv-paper)] px-5 py-3.5 font-semibold hover:border-[var(--cv-line-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cv-action)] ${mt ?? ''}`}
  >
    {children}
  </button>
)

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const course = COURSES.find((c) => c.slug === slug)

  if (!course) {
    return (
      <div className="pt-[105px] min-h-screen flex items-center justify-center" style={{ backgroundColor: CV.bg }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold" style={{ color: CV.ink }}>
            Course Not Found
          </h1>
          <Link href="/courses" className="mt-3 inline-block text-sm font-semibold underline" style={{ color: CV.action }}>
            Back to all courses
          </Link>
        </div>
      </div>
    )
  }

  const lessons = REFERENCE_LESSONS[course.slug] ?? []
  const totalMin = lessons.reduce((a: number, l: Lesson) => a + l.durationMin, 0)
  const refSale = (course as any).referenceSale
  const eff = refSale != null ? refSale : course.price
  const showSave = refSale != null && refSale < course.price
  const savePct = showSave ? (course as any).discountPercentage ?? Math.round(((course.price - refSale) / course.price) * 100) : 0
  const related = COURSES.filter((c) => c.slug !== course.slug && c.category === course.category).slice(0, 4)
  const relatedPour = related.length >= 4 ? related : COURSES.filter((c) => c.slug !== course.slug).slice(0, 4)
  const courseReviews = REVIEWS.slice(0, 3)
  const groupedLessons = groupLessons(lessons)
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

  /* ---------- Hero right: course cover image or category+title fallback (es) ---------- */
  const HeroImage = () => {
    if (course.image) {
      return (
        <div className="overflow-hidden rounded-3xl bg-[#E8F6EF]">
          <Image
            src={course.image}
            alt={`${course.title} on Learn2Earn`}
            className="aspect-video h-full w-full object-cover object-center"
            loading="eager"
            width={720}
            height={720}
          />
        </div>
      )
    }
    return (
      <div className="flex aspect-video flex-col justify-end rounded-3xl bg-[#10201A] p-7 text-[#FFFFFF]">
        <span className="text-sm font-semibold text-[#1DB96B]">{course.category ?? 'Learn2Earn'}</span>
        <span className="mt-2 text-3xl font-extrabold leading-tight tracking-normal">{course.title}</span>
      </div>
    )
  }

  /* ---------- Enrollment card (rs) - used in mobile top + desktop sticky sidebar ---------- */
  const EnrollmentCard = () => {
    // Not enrolled state (default - no auth system in this project)
    const y = plan.price - course.price
    const highlight = y > 0 && y <= 1000 ? `Only ${formatPrice(y)} more than this course alone` : undefined

    return (
      <div className="rounded-3xl border p-6" style={{ borderColor: CV.line, backgroundColor: CV.paper }}>
        {(course as any).enrollmentNotice && (
          <>
            <p className="mb-4 rounded-xl bg-[#FEF3C7] px-4 py-3 text-sm leading-relaxed text-[#92400E]">
              {(course as any).enrollmentNotice}
            </p>
            {(course as any).freeLesson && (
              <SecondaryButton mt="mt-5" children="Watch a free session" />
            )}
          </>
        )}
        {(course as any).isFree && (
          <>
            <p className="text-3xl font-extrabold tracking-normal">Free</p>
            <p className="mt-1 text-sm text-[var(--cv-muted)]">
              {lessons.length} sessions, {fmtMin(totalMin)}. Sign in to save your progress.
            </p>
            <PrimaryButton mt="mt-5" children="Start learning" />
          </>
        )}
        {!((course as any).enrollmentNotice) && !((course as any).isFree) && (
          <>
            {(() => {
              // No auth: show not_enrolled state
              return null
            })()}
            <p className="text-lg font-extrabold tracking-normal">Choose how to get it</p>
            <fieldset className="mt-4 space-y-3">
              <legend className="sr-only">Access options</legend>
              <EnrollmentOption
                name="access"
                checked={true}
                title="Membership"
                price={formatPrice(plan.price)}
                note={`${plan.duration}, all ${COURSES.length} courses including this one${yearPlan.price ? `. Or ${formatPrice(yearPlan.price)} for a year.` : '.'}`}
                highlight={highlight}
              />
              <EnrollmentOption
                name="access"
                checked={false}
                title="This course only"
                price={formatPrice(course.price)}
                note="Yours to keep. Watch any time, as often as you like."
              />
            </fieldset>
            <PrimaryButton
              mt="mt-5"
              children={`Buy for ${formatPrice(course.price)}`}
            />
          </>
        )}
      </div>
    )
  }

  return (
    <div className="pb-24 lg:pb-0" style={{ backgroundColor: CV.bg, color: CV.ink }}>
      {/* ---------- Hero ---------- */}
      <section className="border-b" style={{ borderColor: CV.line, backgroundColor: CV.paper }}>
        <div className="mx-auto max-w-6xl px-4 pt-6 pb-10 sm:px-6 lg:pt-8 lg:pb-14">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            {/* Hero content */}
            <div className="lg:col-span-7">
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

              {course.format === 'Live Recording' && (
                <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#E8F6EF] px-3 py-1 text-sm font-semibold text-[#0B6B3E]">
                  <span className="h-2 w-2 rounded-full bg-[#1DB96B]" aria-hidden="true" />
                  Recorded live with a real class
                </p>
              )}

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
                  <span style={{ color: CV.muted }}>{SITE_CONFIG.founder.title}</span>
                </p>
              </div>
              <dl
                className="mt-8 grid max-w-xl grid-cols-2 gap-x-6 gap-y-4 border-t pt-6 sm:grid-cols-4"
                style={{ borderColor: CV.line }}
              >
                <StatItem label="Learners" value={course.enrolled && course.enrolled > 0 ? course.enrolled.toLocaleString() : 'New'} />
                <StatItem label="Sessions" value={String(lessons.length)} />
                <StatItem label="Class time" value={fmtMin(totalMin)} />
                <StatItem label="Added" value={fmtDate((course as any).addedDate ?? '')} />
              </dl>
            </div>

            {/* Hero right: course cover image or fallback */}
            <div className="lg:col-span-5">
              <HeroImage />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Compact sessions bar (ss) ---------- */}
      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="mt-12" style={{ backgroundColor: CV.paper }}>
          <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm" style={{ color: CV.muted }}>
            <p className="font-semibold">{lessons.length ? `${lessons.length} recorded sessions, ${fmtMin(totalMin)} in total` : 'Recorded sessions'}</p>
          </div>
          <ol className="flex h-14 items-end gap-1 sm:gap-1.5" style={{ color: CV.muted }}>
            {lessons.map((l, h) => {
              const maxDur = Math.max(1, ...lessons.map((z) => z.durationMin))
              const y = 34 + (l.durationMin / maxDur) * 66
              const isPreview = l.isPreview
              return (
                <li key={h} className="flex h-full min-w-0 items-end" style={{ flexGrow: Math.max(1, l.durationMin / maxDur), flexBasis: 0, height: '8%' }}>
                  <button
                    className="w-full rounded-md transition-[height,background-color] duration-700 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B854C]"
                    style={{
                      backgroundColor: isPreview ? CV.accent : CV.line,
                      color: isPreview ? '#fff' : CV.ink,
                    }}
                    title={`${h + 1}. ${l.title}, ${fmtMin(l.durationMin)}`}
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold tabular-nums" style={{ ...(isPreview ? { background: CV.accent, color: '#fff' } : { background: '#F5F5F5', color: CV.ink, border: `1px solid ${CV.line}` }) }}>
                      {isPreview ? <Play className="h-4 w-4" fill="#fff" /> : h + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold leading-snug">{l.title}</span>
                      {isPreview && <span className="mt-1 block text-sm font-semibold text-[#0B854C]">Free to watch</span>}
                    </span>
                    <span className="shrink-0 text-sm tabular-nums" style={{ color: CV.muted }}>
                      {fmtMin(l.durationMin)}
                    </span>
                    <span className="hidden w-5 shrink-0 justify-end sm:flex" aria-hidden="true">
                      {isPreview ? <Check className="h-4 w-4 fill-[#0B854C] text-[#0B854C]" /> : <Clock className="h-4 w-4 text-[#C4C4C4]" />}
                    </span>
                  </button>
                </li>
              )
            })}
          </ol>
          <div className="mt-2 flex justify-between text-xs tabular-nums" style={{ color: CV.muted }}>
            <span>Session 1</span>
            <span>Session {lessons.length}</span>
          </div>
        </div>
      </section>

      {/* ---------- Body ---------- */}
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:grid lg:grid-cols-12 lg:gap-12 lg:py-14">
        <main className="lg:col-span-8 [&>section:first-of-type]:border-t-0 [&>section:first-of-type]:pt-0 space-y-10">
          {/* Mobile: enrollment card at top */}
          <div className="mb-10 outline-none lg:hidden">
            <EnrollmentCard />
          </div>

          {/* About */}
          <section className="scroll-mt-24 border-t border-[var(--cv-line)] py-10">
            <div className="mb-6 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
              <h2 className="text-2xl font-extrabold tracking-normal">About this course</h2>
            </div>
            <div className="space-y-4 text-[1.05rem] leading-[1.75]" style={{ color: CV.body }}>
              {(course.description || '').split(/\n\s*\n/).filter(Boolean).map((p, i) => (
                <p key={i} className="max-w-[68ch]">{p}</p>
              ))}
            </div>
          </section>

          {/* Outcomes */}
          <section className="scroll-mt-24 border-t border-[var(--cv-line)] py-10">
            <div className="mb-6 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
              <h2 className="text-2xl font-extrabold tracking-normal">What you will be able to do</h2>
            </div>
            <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {outcomes.map((o) => (
                <li key={o} className="flex gap-3 leading-relaxed">
                  <Check className="mt-1 h-4 w-4 shrink-0" strokeWidth={3} style={{ color: CV.action }} aria-hidden="true" />
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Sessions */}
          <section id="sessions" className="scroll-mt-24 border-t border-[var(--cv-line)] py-10">
            <div className="mb-6 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
              <h2 className="text-2xl font-extrabold tracking-normal">Sessions</h2>
              <span className="text-sm text-[var(--cv-muted)]">{lessons.length} lessons, {fmtMin(totalMin)}</span>
            </div>
            {groupedLessons.map((group, gi) => (
              <div key={gi} className={gi ? 'mt-8' : ''}>
                {group.title && <h3 className="mb-3 font-bold">{group.title}</h3>}
                <ol className="divide-y divide-[var(--cv-line)] overflow-hidden rounded-2xl border border-[var(--cv-line)] bg-[var(--cv-paper)]">
                  {group.lessons.map(({ lesson, index: wi }) => {
                    const isPreview = lesson.isPreview
                    const firstLocked = lessons.findIndex((x) => !x.isPreview)
                    const isUpNext = wi === firstLocked && !isPreview
                    return (
                      <li key={wi} className="flex w-full items-center gap-4 px-4 py-4 text-left hover:bg-[#F6F7F5] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#0B854C] sm:px-5">
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold tabular-nums ${isPreview ? 'bg-[#1DB96B] text-[#FFFFFF]' : isUpNext ? 'bg-[#10201A] text-[#FFFFFF]' : 'bg-[#F5F5F5] text-[#10201A] ring-1 ring-inset ring-[#DCE3DF]'}`}
                        >
                          {isPreview || isUpNext ? <Play className="h-4 w-4" fill="#fff" /> : wi + 1}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-semibold leading-snug">{lesson.title}</span>
                          {(isUpNext || (isPreview && !isPreview)) && (
                            <span className="mt-1 block text-sm font-semibold text-[#0B854C]">
                              {isUpNext ? 'Up next' : 'Free to watch'}
                            </span>
                          )}
                        </span>
                        <span className="shrink-0 text-sm tabular-nums text-[var(--cv-muted)]">{fmtMin(lesson.durationMin)}</span>
                        <span className="hidden w-5 shrink-0 justify-end sm:flex" aria-hidden="true">
                          {isPreview ? <Play className="h-4 w-4 fill-[#0B854C] text-[#0B854C]" /> : <Clock className="h-4 w-4 text-[#C4C4C4]" />}
                        </span>
                      </li>
                    )
                  })}
                </ol>
              </div>
            ))}
            {groupedLessons.length > 0 && groupedLessons[0].lessons.length > 3 && (
              <SecondaryButton mt="mt-4" children={`Show all ${groupedLessons[0].lessons.length} sessions`} />
            )}
          </section>

          {/* Before you start */}
          <section className="scroll-mt-24 border-t border-[var(--cv-line)] py-10">
            <div className="mb-6 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
              <h2 className="text-2xl font-extrabold tracking-normal">Before you start</h2>
            </div>
            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <h3 className="mb-3 font-bold">This course is for you if</h3>
                <ul className="space-y-2" style={{ color: CV.body }}>
                  {audience.map((a) => (
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
                  {requirements.map((r) => (
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
          <section className="scroll-mt-24 border-t border-[var(--cv-line)] py-10">
            <div className="mb-6 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
              <h2 className="text-2xl font-extrabold tracking-normal">Your instructor</h2>
            </div>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <span
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full font-head text-xl font-extrabold"
                style={{ backgroundColor: CV.ink, color: CV.paper }}
              >
                {firstName.slice(0, 1)}
              </span>
              <div>
                <p className="font-extrabold">{SITE_CONFIG.founder.name}</p>
                <p className="text-sm" style={{ color: CV.muted }}>
                  {SITE_CONFIG.founder.title}
                </p>
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
          <section className="scroll-mt-24 border-t border-[var(--cv-line)] py-10">
            <div className="mb-6 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
              <h2 className="text-2xl font-extrabold tracking-normal">What learners say</h2>
              <span className="text-sm text-[var(--cv-muted)] flex items-center gap-2">
                <span className="text-sm font-bold">4.5</span>
                <span>from {courseReviews.length}</span>
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {courseReviews.map((r) => (
                <figure key={r.id} className="rounded-2xl border p-5" style={{ borderColor: CV.line, backgroundColor: CV.paper }}>
                  <div className="flex gap-1" aria-label={`${r.rating} out of 5 stars`}>
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5" style={{ color: '#F59E0B', fill: '#F59E0B' }} aria-hidden="true" />
                    ))}
                  </div>
                  <figcaption className="mt-4 border-t pt-3 text-xs" style={{ borderColor: CV.line }}>
                    <p className="font-bold">{r.name}</p>
                    {r.verified && <span className="ml-2 text-[var(--cv-action)]">Verified learner</span>}
                  </figcaption>
                </figure>
              ))}
            </div>
            <Link href="/reviews" className="mt-5 inline-block text-sm font-semibold text-[#0B854C] hover:underline">
              Read all {courseReviews.length} reviews <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </section>

          {/* FAQ */}
          <section className="scroll-mt-24 border-t border-[var(--cv-line)] py-10">
            <div className="mb-6 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
              <h2 className="text-2xl font-extrabold tracking-normal">Questions about this course</h2>
            </div>
            <div className="divide-y divide-[var(--cv-line)] rounded-2xl border border-[var(--cv-line)] bg-[var(--cv-paper)]">
              {[
                ['How do I get access?', 'Join the membership to unlock everything, or buy this course on its own. Access opens as soon as your payment clears.'],
                ['Can I pay with mobile money?', 'Yes — MTN or Airtel mobile money, or card.'],
                ['Do I get a certificate?', 'Yes, a certificate is issued when you complete the course requirements.'],
              ].map(([q, a]) => (
                <details key={q} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-bold focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#0B854C] [&::-webkit-details-marker]:hidden">
                    <span>{q}</span>
                    <ChevronDown className="h-5 w-5 shrink-0 text-[var(--cv-muted)] transition-transform group-open:rotate-180 motion-reduce:transition-none" aria-hidden="true" />
                  </summary>
                  <p className="px-5 pb-5 leading-relaxed text-[var(--cv-body)]">{a}</p>
                </details>
              ))}
            </div>
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
          </section>

          {/* Related courses */}
          <section className="border-t border-[var(--cv-line)] bg-[var(--cv-paper)]">
              <div className="mb-6 flex items-end justify-between gap-4">
                <h2 className="text-2xl font-extrabold tracking-normal">Learners also take</h2>
                <Link href="/courses" className="shrink-0 text-sm font-semibold text-[#0B854C] hover:underline">
                  All courses <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {relatedPour.map((r) => (
                  <li key={r.slug}>
                    <Link
                      href={`/courses/${r.slug}`}
                      className="group block rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0B854C]"
                    >
                      {r.image ? (
                        <div className="aspect-video overflow-hidden rounded-xl bg-[#E8F6EF]">
                          <Image
                            src={r.image}
                            alt=""
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none"
                            width={600}
                            height={600}
                          />
                        </div>
                      ) : (
                        <div className="flex h-full items-end rounded-xl bg-[#10201A] p-3">
                          <span className="text-sm font-bold text-[#1DB96B]">{r.category ?? 'Learn2Earn'}</span>
                        </div>
                      )}
                      <p className="mt-3 line-clamp-2 font-semibold leading-snug group-hover:underline">{r.title}</p>
                      <p className="mt-1 text-sm text-[var(--cv-muted)]">
                        {r.category ?? ''}, {formatPrice(r.price)}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
                {plan && (
                <p className="mt-8 rounded-xl bg-[#F6F7F5] px-5 py-4 text-sm leading-relaxed text-[var(--cv-body)]">
                  All of these are included in the membership: {COURSES.length} courses for {formatPrice(plan.price)}
                  for {plan.duration}.{' '}
                  <Link href="/subscribe" className="font-semibold text-[#0B854C] hover:underline">
                    See membership <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </p>
              )}
            </div>
          </section>

          {/* Rate this class */}
          <section className="border-t border-[var(--cv-line)] bg-[var(--cv-paper)]">
            <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
              <h2 className="text-2xl font-extrabold tracking-normal mb-6">Rate this class</h2>
              <p className="text-sm text-[var(--cv-muted)] mb-6">Help other learners decide — how was your experience?</p>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-[#10201A] text-[#FFFFFF] hover:bg-[#1DB96B] transition-colors"
                  >
                    ★
                  </button>
                ))}
              </div>
              <p className="mt-4 text-xs text-[var(--cv-muted)]">Your rating helps the community. Thank you, {firstName}.</p>
            </div>
          </section>
        </main>

        {/* Desktop: sticky right sidebar enrollment */}
        <aside className="hidden lg:col-span-4 lg:block">
          <div className="sticky top-24 outline-none">
            <EnrollmentCard />
          </div>
        </aside>
      </div>
    </div>
  )
}
