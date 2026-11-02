import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Calendar, Clock, Users, Check, ArrowRight } from 'lucide-react'
import { COHORTS } from '@/lib/data'
import { formatPrice } from '@/lib/utils'

export function generateStaticParams() {
  return COHORTS.map((cohort) => ({ slug: cohort.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cohort = COHORTS.find((x) => x.slug === slug)
  if (!cohort) return { title: 'Cohort Not Found' }
  return {
    title: `${cohort.title} | Learn2Earn`,
    description: cohort.description,
  }
}

export default async function CohortPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cohort = COHORTS.find((x) => x.slug === slug)

  if (!cohort) {
    notFound()
  }

  const isActive = cohort.status === 'active'
  const isUpcoming = cohort.status === 'upcoming'
  const isFull = cohort.maxSeats > 0 && cohort.enrolled >= cohort.maxSeats
  const showEarlyBird = !!cohort.originalPrice && cohort.originalPrice > cohort.price

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: '#FAFAFA', color: '#111111' }}>
      <main>
        {/* Header */}
        <section style={{ paddingTop: '4rem', paddingBottom: '3rem' }}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
            <div className="grid lg:grid-cols-[1.3fr_0.7fr] gap-8 lg:gap-12">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className="text-xs font-bold px-3 py-1 rounded-full border cursor-default"
                    style={{
                      background: isUpcoming ? '#E8F8F0' : '#F5F5F5',
                      color: isUpcoming ? '#0F7A42' : '#737373',
                      borderColor: isUpcoming ? '#1DB96B' : '#E5E5E5',
                    }}
                  >
                    {isUpcoming ? 'Coming soon' : isActive ? 'Live now' : 'Completed'}
                  </span>
                  <span className="text-xs text-[#737373]">{cohort.schedule}</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-[#111111] mb-4">
                  {cohort.title}
                </h1>
                <p className="text-lg text-[#404040] leading-relaxed mb-6 max-w-xl">
                  {cohort.description}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-[#737373]">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />{' '}
                    {new Date(cohort.startDate).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      timeZone: 'Africa/Lusaka',
                    })}{' - '}
                    {new Date(cohort.endDate).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      timeZone: 'Africa/Lusaka',
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {cohort.schedule}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" /> {cohort.enrolled}/{cohort.maxSeats} seats
                  </span>
                </div>
                {cohort.status === 'completed' && (
                  <p className="mt-4 text-xs text-[#737373] font-medium">
                    This class is over — watch the recording →
                  </p>
                )}
              </div>

              <div className="lg:sticky lg:top-32 lg:self-start">
                <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6">
                  <div className="aspect-[16/9] overflow-hidden rounded-xl mb-5">
                    <Image
                      src={cohort.status === 'completed' ? '/images/podium.jpg' : '/images/gallery-8.jpg'}
                      alt={`${cohort.title} class poster`}
                      width={600}
                      height={338}
                      loading="eager"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-3xl font-extrabold text-[#1DB96B]">
                      {formatPrice(cohort.price)}
                    </span>
                    {showEarlyBird && (
                      <span className="text-sm text-[#737373] line-through">
                        {formatPrice(cohort.originalPrice)}
                      </span>
                    )}
                  </div>
                  <div className="space-y-3 mb-6">
                    {[
                      `${cohort.maxSeats} total seats`,
                      'Recorded sessions included',
                      'Certificate of completion',
                      'WhatsApp group access',
                    ].map((t) => (
                      <div key={t} className="flex items-center gap-2 text-sm text-[#737373]">
                        <Check className="w-4 h-4 text-[#1DB96B]" />
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>
                  {cohort.status !== 'completed' && !isFull && (
                    <Link
                      href={`/checkout?type=cohort&id=${cohort.id}`}
                      className="flex h-12 w-full items-center justify-center rounded-xl font-bold text-sm transition-colors"
                      style={{ backgroundColor: '#1DB96B', color: '#111111' }}
                    >
                      Reserve my seat <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  )}
                  {isFull && (
                    <p className="flex h-12 w-full items-center justify-center rounded-xl font-bold text-sm border border-[#E5E5E5] text-[#737373]">
                      Class full — join waitlist
                    </p>
                  )}
                  {cohort.status === 'completed' && (
                    <Link
                      href={`/cohorts/${cohort.slug}#recording`}
                      className="flex h-12 w-full items-center justify-center rounded-xl font-bold text-sm border border-[#E5E5E5] text-[#737373] hover:border-[#D4D4D4] transition-colors"
                    >
                      Watch recording
                    </Link>
                  )}
                  <p className="text-xs text-center text-[#737373] mt-3">
                    {cohort.maxSeats - cohort.enrolled} spots remaining
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Curriculum */}
        <section style={{ paddingTop: '2rem', paddingBottom: '6rem' }}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
            <h2 className="text-2xl font-bold text-[#111111] mb-8">What you will learn</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
              {cohort.lessons.map((lesson, index) => (
                <div key={lesson} className="flex items-start gap-3 bg-white rounded-xl border border-[#E5E5E5] p-4">
                  <div className="w-8 h-8 bg-[#E8F8F0] rounded-lg flex items-center justify-center shrink-0 text-[#0F7A42]">
                    <span className="text-sm font-bold">{index + 1}</span>
                  </div>
                  <p className="text-sm text-[#404040]">{lesson}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
