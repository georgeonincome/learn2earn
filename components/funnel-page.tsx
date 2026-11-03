import Link from 'next/link'
import { Check } from 'lucide-react'
import { FUNNELS } from '@/lib/lessons-data'
import { getFunnelBySlugWithCourse } from '@/lib/server/funnels'
import { sanitizeRichHtml } from '@/lib/server/html'
import type { FunnelRow } from '@/lib/server/funnels'

/**
 * Funnel page — Phase 6 DB-backed.
 * Mirrors the reference `course_funnels` render contract (Funnel-uaRVZWa5.js):
 * DB row (headline/subheadline/description-HTML/benefits/testimonials/cta_text)
 * when the slug exists in `course_funnels`; otherwise the static FUNNELS map —
 * the reference ships the other funnel pages (50k, 5AM, …) as hardcoded chunks.
 */

type StaticFunnel = {
  slug: string
  title: string
  description: string
  ctaText: string
  ctaHref: string
  features: string[]
  testimonials: Array<{ name: string; role: string; content: string }>
  faqs: Array<{ question: string; answer: string }>
}

export async function FunnelPageComponent({ slug }: { slug: string }) {
  const db = await getFunnelBySlugWithCourse(slug)

  if (db) {
    return <DbFunnelView
      funnel={db.funnel}
      ctaHref={db.courseSlug ? `/checkout?course=${db.courseSlug}` : (FUNNELS[slug]?.ctaHref ?? '/courses')}
    />
  }

  const funnel = FUNNELS[slug] as StaticFunnel | undefined
  if (!funnel) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#10201A]">
        <h1 className="text-2xl font-bold">Page Not Found</h1>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#10201A]">
      <section className="bg-[#0A0D14] text-white py-20 sm:py-28 px-4">
        <div className="mx-auto max-w-5xl text-center">
          <span className="inline-block text-xs font-extrabold uppercase tracking-[0.14em] text-[#1DB96B] bg-[#1DB96B]/20 px-3 py-1 rounded-full mb-4">
            Live Class
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-4">
            {funnel.title}
          </h1>
          <p className="text-lg text-[#A3A3A3] mb-8 max-w-xl mx-auto">
            {funnel.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={funnel.ctaHref}
              className="inline-flex h-12 items-center justify-center rounded-lg px-7 font-bold text-sm bg-[#1DB96B] text-[#111111] hover:bg-[#17A05D] transition-colors"
            >
              {funnel.ctaText} →
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28 px-4">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] mb-12 text-center">
            What You&apos;ll Learn
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {funnel.features.map((feature: string, i: number) => (
              <div key={i} className="p-6 rounded-2xl border border-[#E5E5E5] bg-white">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-[#1DB96B] mb-4 bg-[#E3F6EF]">
                  <span className="text-xl">▶</span>
                </div>
                <h3 className="text-lg font-bold text-[#111111] mb-2">{feature}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28 px-4 bg-[#FFFFFF]">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] mb-12 text-center">
            What Learners Say
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {funnel.testimonials.map((t: { name?: string; role?: string; content?: string }, i: number) => (
              <div key={i} className="p-6 rounded-2xl border border-[#E5E5E5] bg-[#F3F4F6]">
                <div className="flex items-center gap-2 text-[#1DB96B] mb-3">
                  {[1, 2, 3, 4, 5].map((star, si) => (
                    <span key={si} className="w-3 h-3 fill-[#1DB96B]">★</span>
                  ))}
                </div>
                <p className="text-sm text-[#737373] mb-3">{t.content}</p>
                <p className="text-xs font-bold text-[#111111]">{t.name}</p>
                <p className="text-[10px] text-[#A3A3A3]">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28 px-4 bg-[#FAFAFA]">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] mb-12 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {funnel.faqs.map((faq: { question: string; answer: string }, i: number) => (
              <details key={i} className="group border border-[#E5E5E5] rounded-xl overflow-hidden">
                <summary className="list-none cursor-pointer px-4 py-3 text-sm font-medium text-[#111111] flex justify-between items-start transition-colors group-open:bg-[#F3F4F6]">
                  <span>{faq.question}</span>
                  <span className="text-sm">▾</span>
                </summary>
                <div className="px-4 pb-3 text-sm text-[#737373]">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28 px-4 bg-[#1DB96B] text-[#111111]">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-sm text-[#111111]/80 mb-8 max-w-lg mx-auto">
            Join George J Kasonso and start building practical digital skills today.
          </p>
          <Link
            href={funnel.ctaHref}
            className="inline-flex h-12 items-center justify-center rounded-lg px-7 font-bold text-sm bg-[#10201A] text-[#FFFFFF] hover:bg-[#000000] transition-colors"
          >
            {funnel.ctaText} →
          </Link>
        </div>
      </section>
    </div>
  )
}

/* ---------- DB-backed render path (course_funnels rows) ---------- */

function DbFunnelView({ funnel, ctaHref }: { funnel: FunnelRow; ctaHref: string }) {
  const headline = funnel.headline ?? funnel.slug
  const subheadline = funnel.subheadline ?? ''
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#10201A]">
      {/* hero */}
      <section className="bg-[#0A0D14] text-white py-20 sm:py-28 px-4">
        <div className="mx-auto max-w-5xl text-center">
          <span className="inline-block text-xs font-extrabold uppercase tracking-[0.14em] text-[#1DB96B] bg-[#1DB96B]/20 px-3 py-1 rounded-full mb-4">
            Live Class
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-4 max-w-3xl mx-auto leading-[1.1]">
            {headline}
          </h1>
          <p className="text-lg text-[#A3A3A3] mb-8 max-w-xl mx-auto">
            {subheadline}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={ctaHref}
              className="inline-flex h-12 items-center justify-center rounded-lg px-7 font-bold text-sm bg-[#1DB96B] text-[#111111] hover:bg-[#17A05D] transition-colors"
            >
              {funnel.cta_text ?? 'Enroll'} →
            </Link>
          </div>
        </div>
      </section>

      {/* benefits */}
      {funnel.benefits.length > 0 && (
        <section className="py-16 sm:py-20 px-4">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] mb-10 text-center">
              What You&apos;ll Walk Away With
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {funnel.benefits.map((b, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-[#E5E5E5] bg-white">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1DB96B] text-white">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  <p className="text-sm text-[#404040] leading-6">{b}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* description — rich HTML, allowlist-sanitized server-side */}
      {funnel.description && (
        <section className="py-16 sm:py-20 px-4 bg-white">
          <div className="mx-auto max-w-3xl">
            <h2 className="sr-only">Course details</h2>
            <div
              className="funnel-rich-html text-[#404040] text-[15px] leading-7 space-y-4 [&_h2]:text-2xl [&_h2]:font-extrabold [&_h2]:text-[#111111] [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-[#111111] [&_h3]:mt-8 [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1.5 [&_strong]:text-[#111111]"
              dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(funnel.description) }}
            />
          </div>
        </section>
      )}

      {/* testimonials */}
      {funnel.testimonials.length > 0 && (
        <section className="py-16 sm:py-20 px-4">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] mb-10 text-center">
              What Learners Say
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {funnel.testimonials.map((t, i) => (
                <div key={i} className="p-6 rounded-2xl border border-[#E3E8E5] bg-white">
                  <div className="flex items-center gap-2 text-[#1DB96B] mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className="w-3 h-3 fill-[#1DB96B]">★</span>
                    ))}
                  </div>
                  <p className="text-sm text-[#737373] mb-3">{t.text}</p>
                  <p className="text-xs font-bold text-[#111111]">{t.name}</p>
                  <p className="text-[10px] text-[#A3A3A3]">{t.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* final CTA */}
      <section className="py-20 sm:py-28 px-4 bg-[#1DB96B] text-[#111111]">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-sm text-[#111111]/80 mb-8 max-w-lg mx-auto">
            Join George J Kasonso and start building practical digital skills today.
          </p>
          <Link
            href={ctaHref}
            className="inline-flex h-12 items-center justify-center rounded-lg px-7 font-bold text-sm bg-[#10201A] text-[#FFFFFF] hover:bg-[#000000] transition-colors"
          >
            {funnel.cta_text ?? 'Enroll'} →
          </Link>
        </div>
      </section>
    </div>
  )
}
