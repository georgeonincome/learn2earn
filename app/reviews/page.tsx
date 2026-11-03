'use client'

/**
 * Reviews page — Phase 4: adds helpful-vote buttons backed by /api/reviews/[id]/helpful.
 * Structure mirrored from click2skill Reviews-m3j_a8u5.js:
 * hero "Learner reviews" + filter chips by cohort, reviews grid with star ratings,
 * real review content, helpful-vote toggle, membership banner, Write review + support CTAs.
 */

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, Quote, ArrowRight, MessageCircle, ChevronUp, ChevronDown } from 'lucide-react'
import { REVIEWS, MEMBERSHIP_PLANS, SITE_CONFIG } from '@/lib/data'
import { formatPrice } from '@/lib/utils'

const firstName = SITE_CONFIG.founder.name.split(' ').slice(-1).join(' ')

type ReviewWithHelpful = {
  id: number
  name: string
  location: string
  content: string
  rating: number
  cohort: string
  verified?: boolean
  helpfulCount: number
  userVotedHelpful: boolean
}

export default function ReviewsPage() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [helpfulMap, setHelpfulMap] = useState<Record<number, { count: number; voted: boolean }>>({})
  const [voting, setVoting] = useState<Set<number>>(new Set())

  const cohorts = useMemo(
    () => ['All', ...Array.from(new Set(REVIEWS.map(r => r.cohort ?? 'Course')))]
    , []
  )

  // Fetch helpful vote counts from the API on mount
  useEffect(() => {
    const fetchCounts = async () => {
      const counts: Record<number, { count: number; voted: boolean }> = {}
      for (const r of REVIEWS) {
        try {
          const res = await fetch(`/api/reviews/${r.id}/helpful`, { cache: 'no-store' })
          if (res.ok) {
            const data = await res.json()
            counts[r.id] = { count: data.helpfulCount ?? 0, voted: data.helpful ?? false }
          } else {
            counts[r.id] = { count: 0, voted: false }
          }
        } catch {
          counts[r.id] = { count: 0, voted: false }
        }
      }
      setHelpfulMap(counts)
    }
    fetchCounts()
  }, [])

  const filtered = useMemo(() => {
    let list = REVIEWS.map((r) => ({
      ...r,
      helpfulCount: helpfulMap[r.id]?.count ?? 0,
      userVotedHelpful: helpfulMap[r.id]?.voted ?? false,
    }))
    if (activeFilter === 'All') return list
    return list.filter((r) => r.cohort === activeFilter)
  }, [activeFilter, helpfulMap])

  const handleHelpful = async (reviewId: number) => {
    const review = REVIEWS.find((r) => r.id === reviewId)
    if (!review) return
    const current = helpfulMap[reviewId]
    const currentlyVoted = current?.voted ?? false

    setVoting((prev) => new Set([...prev, reviewId]))

    try {
      const res = await fetch(`/api/reviews/${reviewId}/helpful`, {
        method: 'POST',
      })
      if (!res.ok) return
      const data = await res.json()

      setHelpfulMap((prev) => ({
        ...prev,
        [reviewId]: { count: data.helpfulCount ?? 0, voted: data.helpful ?? false },
      }))
    } catch {
      // ignore
    } finally {
      setVoting((prev) => {
        const next = new Set(prev)
        next.delete(reviewId)
        return next
      })
    }
  }

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: '#FAFAFA', color: '#111111' }}>
      {/* Hero */}
      <section style={{ paddingTop: '4rem', paddingBottom: '3rem' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="mb-4 inline-block text-[11px] font-bold tracking-[0.14em] uppercase text-[#0B854C] bg-[#E8F8F0] px-3 py-1 rounded-full">
                Testimonials
              </p>
              <h1 className="font-head text-4xl md:text-5xl font-extrabold leading-[1.05] mb-3">
                Learner reviews
              </h1>
              <p className="text-lg text-[#404040] max-w-2xl leading-8">
                What learners say after completing our courses and cohorts. Real feedback from real students building real skills.
              </p>
            </div>
            <div className="hidden lg:block aspect-[4/3] max-h-[320px] overflow-hidden rounded-2xl bg-[#EEF1EE]">
              <Image
                src="/images/podium.jpg"
                alt={`${firstName} teaching at Learn2Earn`}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filter + grid */}
      <section style={{ paddingTop: '2rem', paddingBottom: '5rem' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          {/* Filter chips */}
          <div className="flex flex-wrap gap-2 mb-8">
            {cohorts.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className="shrink-0 text-[13px] font-semibold px-[15px] py-2 rounded-full border transition-all cursor-pointer"
                style={{
                  background: activeFilter === cat ? '#1DB96B' : '#FFFFFF',
                  color: activeFilter === cat ? '#fff' : '#404040',
                  borderColor: activeFilter === cat ? '#1DB96B' : '#E5E5E5',
                }}
              >
                {cat}
              </button>
            ))}
            <button
              onClick={() => setActiveFilter('All')}
              className="ml-auto text-[13px] font-semibold text-[#737373] hover:text-[#111111] cursor-pointer"
              style={{ textDecoration: 'underline', padding: '4px 0' }}
            >
              View all
            </button>
          </div>

          {/* Reviews grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((review) => (
              <article key={review.id} className="bg-white border border-[#E5E5E5] rounded-xl p-6 hover:shadow-md transition-all">
                <Quote className="w-6 h-6 text-[#0B854C] mb-3" />
                <div className="flex gap-1 mb-3" aria-label={`${review.rating} out of 5 stars`}>
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-[#F59E0B]" fill="#F59E0B" />
                  ))}
                </div>
                <blockquote className="text-[15px] leading-7 text-[#404040] mb-4">
                  &ldquo;{review.content}&rdquo;
                </blockquote>
                <figcaption className="text-sm">
                  <div className="font-bold text-[#111111]">{review.name}</div>
                  <div className="text-[#737373] text-xs">{review.cohort ?? 'Learner'}</div>
                </figcaption>
                <div className="mt-4 flex items-center gap-2">
                  <button
                    onClick={() => handleHelpful(review.id)}
                    disabled={voting.has(review.id)}
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                      review.userVotedHelpful
                        ? 'border-[#0B6B3D] bg-[#F3FBF6] text-[#0B6B3D]'
                        : 'border-[#E5E5E5] text-[#737373] hover:border-[#9DB0A7] hover:text-[#111111]'
                    }`}
                  >
                    {voting.has(review.id) ? (
                      <span className="flex items-center gap-1">
                        <ChevronUp className="w-3 h-3" animate-pulse />
                        Voting…
                      </span>
                    ) : (
                      <>
                        {review.userVotedHelpful ? (
                          <span className="flex items-center gap-1">
                            <ChevronDown className="w-3 h-3 text-[#0B6B3D]" />
                            Helpful {review.helpfulCount}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <ChevronUp className="w-3 h-3 text-[#737373]" />
                            Helpful {review.helpfulCount}
                          </span>
                        )}
                      </>
                    )}
                  </button>
                  {review.verified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#E8F6EF] px-2.5 py-[3px] text-[12px] font-bold text-[#0B6B3D]">
                      Verified learner
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-[#A3A3A3] text-sm">No reviews in this category yet.</p>
            </div>
          )}

          {/* Bottom banner + CTAs */}
          <div className="mt-12 flex flex-col lg:flex-row gap-6 items-start justify-between">
            <div className="flex items-center gap-3">
              <a
                href={`https://wa.me/${SITE_CONFIG.whatsapp}?text=Hi%20George%2C%20I%20have%20feedback%20for%20Learn2Earn`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-[#0B854C] hover:underline inline-flex items-center gap-1"
              >
                <MessageCircle className="w-4 h-4" /> Send feedback
              </a>
              <Link href="/courses" className="text-sm font-medium text-[#737373] hover:text-[#111111] transition-colors inline-flex items-center gap-1">
                All courses <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="border border-[#C7EEDA] rounded-xl bg-[#E8F8F0] px-6 py-5 max-w-md">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#0F7A42] mb-2">
                Membership
              </p>
              <p className="text-[#404040] text-sm leading-6">
                One membership. Every course these learners took. {formatPrice(MEMBERSHIP_PLANS[0].price)} for four months or {formatPrice(MEMBERSHIP_PLANS[1].price)} for a year — every course, every recording, new classes as they launch.
              </p>
              <Link href="/subscribe" className="mt-3 inline-flex h-10 items-center justify-center rounded-lg px-5 text-sm font-bold text-white bg-[#1DB96B]">
                Get membership
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
