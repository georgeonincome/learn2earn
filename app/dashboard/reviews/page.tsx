'use client'

import Link from 'next/link'
import { Star, Edit, Trash2 } from 'lucide-react'
import { REVIEWS } from '@/lib/data'
import DashboardLayout from '@/components/dashboard/DashboardLayout'

/**
 * My Reviews Page
 *
 * Route: /dashboard/reviews
 *
 * Displays user's course reviews with edit/delete options.
 */

export default function ReviewsPage() {
  // Mock user reviews - in production this comes from database filtered by user
  const userReviews = REVIEWS.filter((r) => r.id <= 3)

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-extrabold">My Reviews</h1>
        <Link
          href="/courses"
          className="text-sm font-semibold text-[#1DB96B] hover:underline"
        >
          Browse Courses
        </Link>
      </div>

      {userReviews.length > 0 ? (
        <div className="space-y-4">
          {userReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E5E5E5] text-[#737373] mx-auto mb-4">
            <span className="w-6 h-6">⭐</span>
          </div>
          <h2 className="text-xl font-bold">No Reviews Yet</h2>
          <p className="text-[#737373] mt-2">
            Share your thoughts on courses you've completed.
          </p>
          <Link
            href="/courses"
            className="mt-4 inline-flex items-center gap-2 rounded-lg px-6 py-2 text-sm font-semibold transition-colors" style={{ minHeight: 44, borderRadius: 8, background: '#1DB96B', color: '#fff', border: '1px solid #1DB96B', padding: '0 18px' }}
          >
            Browse Courses
          </Link>
        </div>
      )}
    </DashboardLayout>
  )
}

interface ReviewCardProps {
  review: {
    id: number
    name: string
    location: string
    content: string
    rating: number
    cohort: string
    verified: boolean
  }
}

function ReviewCard({ review }: ReviewCardProps) {
  const stars = Array.from({ length: 5 }, (_, i) => i < review.rating)

  return (
    <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1">
          {stars.map((_, i) => (
            <Star
              key={i}
              className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]"
              aria-hidden="true"
            />
          ))}
          <span className="ml-1 text-xs font-semibold text-[#737373]">
            {review.rating}
          </span>
        </div>
        <span className="text-xs text-[#737373]">
          {review.verified ? '✓ Verified' : 'Unverified'}
        </span>
      </div>
      <h3 className="font-bold">{review.name}</h3>
      <p className="text-sm text-[#737373] mt-2">{review.content}</p>
      <div className="mt-3 flex items-center gap-2 text-xs text-[#737373]">
        <span className="font-semibold">{review.name}</span>
        <span>•</span>
        <span>{review.cohort}</span>
      </div>
      <div className="mt-3 flex gap-2">
        <button
          onClick={() => {}}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors" style={{ minHeight: 44, borderRadius: 8, background: '#1DB96B', color: '#fff', border: '1px solid #1DB96B', padding: '0 18px' }}
        >
          <Edit className="w-4 h-4" />
          Edit Review
        </button>
        <button
          onClick={() => {}}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg px-6 py-2 text-sm font-semibold transition-colors" style={{ minHeight: 44, borderRadius: 8, background: '#FFFFFF', color: '#EF4444', border: '1px solid #EF4444', padding: '0 18px' }}
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>
    </div>
  )
}
