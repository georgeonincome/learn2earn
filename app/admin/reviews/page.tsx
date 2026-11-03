'use client'

/**
 * Admin Reviews — reference admin reviews moderation page.
 * Lists all submitted reviews with moderation actions (approve/reject).
 */

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronRight, ShieldCheck, X, Clock } from 'lucide-react'

type Review = {
  id: string
  student_id: string
  item_id: string
  item_type: string
  item_title: string
  rating: number
  text: string
  status: string
  created_at: string
}

const STATUS_COLOR: Record<string, string> = {
  published: '#1DB96B',
  pending: '#F59E0B',
  rejected: '#DC2626',
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetch('/api/reviews')
      .then((r) => r.ok ? r.json() : [])
      .then((data: any) => { if (!cancelled) setReviews(data ?? []) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const setStatus = (id: string, status: string) => {
    // Note: admin review moderation endpoint to be wired when Q6/Q7 admin moderation API is confirmed.
    // For now, optimistically update UI.
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
  }

  if (loading) return <div className="text-center py-20 text-[#737373]">Loading reviews…</div>

  const pendingCount = reviews.filter((r) => r.status === 'pending').length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Reviews moderation</h1>
          <p className="text-[#737373] text-sm mt-1">Approve or reject student reviews before they appear publicly.</p>
        </div>
        {pendingCount > 0 && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FEE2E2] text-xs font-bold text-[#DC2626] border border-[#DC2626]/30">
            {pendingCount} pending
          </span>
        )}
      </div>

      <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#E5E5E5] bg-[#F9F9F9]">
              <th className="px-4 py-3 font-semibold text-[#737373]">Course / item</th>
              <th className="px-4 py-3 font-semibold text-[#737373] text-center">Rating</th>
              <th className="px-4 py-3 font-semibold text-[#737373]">Review</th>
              <th className="px-4 py-3 font-semibold text-[#737373] text-center">Status</th>
              <th className="px-4 py-3 font-semibold text-[#737373] text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-[#737373]">
                  No reviews yet.
                </td>
              </tr>
            ) : (
              reviews.map((r) => {
                const color =
                  STATUS_COLOR[r.status] ?? '#737373'
                const stars =
                  Array.from({ length: r.rating }, () => '★').join('') +
                  Array.from({ length: 5 - r.rating }, () => '☆').join('')

                return (
                  <tr key={r.id} className="border-b border-[#E5E5E5]">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-[#111111]">{r.item_title}</div>
                      <div className="text-xs text-[#737373]">{r.item_type}</div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1 text-[#B45308] font-bold">
                        {stars}
                      </div>
                      <div className="text-xs text-[#737373]">{r.rating} / 5</div>
                    </td>
                    <td className="px-4 py-3 text-[#737373] max-w-[400px] truncate">
                      {r.text}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          color === '#1DB96B'
                            ? 'bg-[#F3FBF6] text-[#0B854C]'
                            : color === '#DC2626'
                              ? 'bg-[#FEE2E2] text-[#DC2626]'
                              : 'bg-[#F3FBF6] text-[#F59E0B]'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {r.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => setStatus(r.id, 'published')}
                            className="mr-2 text-xs text-[#0B854C] hover:underline"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => setStatus(r.id, 'rejected')}
                            className="text-xs text-[#DC2626] hover:underline"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <Link
                          href={`/courses/${r.item_id}`}
                          className="text-xs text-[#737373] hover:underline"
                        >
                          View item
                        </Link>
                      )}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-[#F3FBF6] rounded-lg p-4">
        <h3 className="font-bold text-lg mb-2">Moderation notes</h3>
        <p className="text-sm text-[#737373]">
          Reviews are held in <b>pending</b> status until you approve them. Approved reviews appear on course pages; rejected reviews are hidden from students.
          <br />
          <span className="text-xs text-[#737373] mt-1 block">
            Admin review-moderation API endpoint (approve/reject) to be wired when the admin moderation API is confirmed.
          </span>
        </p>
      </div>
    </div>
  )
}
