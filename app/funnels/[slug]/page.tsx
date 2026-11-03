import Link from 'next/link'
import { notFound } from 'next/navigation'
import { FUNNELS } from '@/lib/lessons-data'

export async function generateStaticParams() {
  return Object.keys(FUNNELS).map((slug) => ({ slug }))
}

export default async function FunnelPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const funnel = FUNNELS[slug]

  if (!funnel) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#10201A]">
      {/* Hero */}
      <section className="bg-[#0A0D14] text-white py-20 sm:py-28 px-4">
        <div className="mx-auto max-w-5xl text-center">
          <span className="inline-block text-xs font-extrabold uppercase tracking-[0.14em] text-[#0B854C] bg-[#1DB96B]/20 px-3 py-1 rounded-full mb-4">
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

      {/* Features */}
      <section className="py-20 sm:py-28 px-4">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] mb-12 text-center">
            What You'll Learn
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {funnel.features.map((feature: string, i: number) => (
              <div key={i} className="p-6 rounded-2xl border border-[#E5E5E5] bg-white">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-[#0B854C] mb-4 bg-[#E3F6EF]">
                  ▶
                </div>
                <h3 className="text-lg font-bold text-[#111111] mb-2">{feature}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 sm:py-28 px-4 bg-[#FFFFFF]">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] mb-12 text-center">
            What Learners Say
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {funnel.testimonials.map((t: any, i: number) => (
              <div key={i} className="p-6 rounded-2xl border border-[#E5E5E5] bg-[#F3F4F6]">
                <div className="flex items-center gap-2 text-[#0B854C] mb-3">
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

      {/* FAQ */}
      <section className="py-20 sm:py-28 px-4 bg-[#FAFAFA]">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] mb-12 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {funnel.faqs.map((faq: any, i: number) => (
              <details key={i} className="group border border-[#E5E5E5] rounded-xl overflow-hidden">
                <summary
                  className="list-none cursor-pointer px-4 py-3 text-sm font-medium text-[#111111] flex justify-between items-start transition-colors group-open:bg-[#F3F4F6]"
                >
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

      {/* CTA */}
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