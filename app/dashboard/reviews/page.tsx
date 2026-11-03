'use client'

/**
 * Dashboard /reviews — reference Reviews tab: write review (rating + text),
 * courses/live classes tabs, waiting-for-review list, published reviews with
 * moderation states.
 */
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Star, ChevronRight, RefreshCw, ShieldCheck } from 'lucide-react'

export default function DashboardReviewsPage() {
  const [tab, setTab] = useState<'courses' | 'classes'>('courses')
  const [reviews, setReviews] = useState<any[]>([])
  const [waiting, setWaiting] = useState<any[]>([])
  const [rating, setRating] = useState(0)
  const [text, setText] = useState('')
  const [target, setTarget] = useState('')

  useEffect(() => {
    let cancelled = false
    Promise.all([
      fetch('/api/reviews?mine=1').then((r) => r.ok ? r.json() : []),
      fetch('/api/review-requests').then((r) => r.ok ? r.json() : []),
    ]).then(([my, req]: any) => {
      if (cancelled) return
      setReviews(my ?? [])
      setWaiting(req ?? [])
    }).catch(() => {})
    return () => { cancelled = true }
  }, [])

  const stars = (n: number) => [...Array(5)].map((_, i) => (
    <button key={i} onClick={() => setRating(i + 1)} className={`text-yellow-400 ${i < rating ? 'fill-yellow-400' : 'text-gray-300'}`}>
      <Star className="h-6 w-6" />
    </button>
  ))

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#10201A]">
      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center gap-4">
          <Link href="/dashboard" className="text-[#0B854C] font-semibold hover:underline">← Dashboard</Link>
          <div className="h-6 w-px bg-gray-200 mx-2" />
          <h1 className="text-xl font-bold">Reviews</h1>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-8">
          <h2 className="font-bold">Reviews</h2>
          <p className="text-gray-600">Tell other students what a course or live class did for you.</p>
        </div>

        <div className="flex gap-2 mb-6">
          {['courses', 'classes'].map((t) => (
            <button key={t} onClick={() => setTab(t as 'courses' | 'classes')} className={`px-4 py-2 text-sm rounded-md border transition ${
              tab === t ? 'bg-[#1DB96B] text-white' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}>
              {t === 'courses' ? 'Courses' : 'Live classes'}
            </button>
          ))}
        </div>

        {/* Waiting for your review */}
        <div className="mb-8">
          <h3 className="font-semibold mb-3">Waiting for your review</h3>
          {waiting.length === 0 ? (
            <p className="text-sm text-gray-500">No review requests right now.</p>
          ) : (
            waiting.map((r: any) => (
              <div key={r.id} className="mb-4 rounded-xl border border-gray-200 bg-white p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{r.itemTitle}</span>
                  <span className="text-xs text-gray-500">{r.itemType}</span>
                </div>
                <div className="flex items-center gap-2 mb-3">{stars(0)}</div>
                <textarea
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1DB96B]"
                  rows={3} placeholder="What did you think? A client, a job, income, time saved — numbers help."
                  onChange={(e) => setText(e.target.value)}
                />
                <div className="flex gap-2 mt-3">
                  <button
                    disabled={rating === 0 || !text.trim()}
                    onClick={() => {
                      fetch('/api/reviews', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ itemId: target, itemType: tab, rating, text }),
                      }).then((resp) => resp.ok && location.reload())
                    }}
                    className="rounded-md bg-[#1DB96B] px-4 py-2 text-xs font-bold text-white hover:bg-[#17A05D] disabled:opacity-60"
                  >
                    Post review
                  </button>
                  <button onClick={() => setRating(0)} className="text-xs text-gray-500 hover:underline">Cancel</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Your reviews */}
        <div className="mb-8">
          <h3 className="font-semibold mb-3">Your reviews</h3>
          {reviews.length === 0 ? (
            <p className="text-sm text-gray-500">No reviews yet.</p>
          ) : (
            reviews.map((r: any) => (
              <div key={r.id} className="mb-4 rounded-xl border border-gray-200 bg-white p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{r.itemTitle}</span>
                  <span className={`text-xs font-bold ${r.status === 'published' ? 'text-[#0B854C]' : 'text-amber-500'}`}>
                    {r.status === 'published' ? 'Published' : r.status === 'pending' ? 'Waiting for approval' : 'Not shown publicly'}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-2">{stars(r.rating ?? 0)}</div>
                <p className="text-sm text-gray-600 mb-2">{r.text}</p>
                <p className="text-xs text-gray-400">{new Date(r.createdAt ?? r.created_at).toLocaleDateString()} {r.adminReply ? `· Reply from Learn2Earn: ${r.adminReply}` : ''}</p>
                {r.status === 'pending' && (
                  <button className="text-xs text-[#0B854C] hover:underline mt-2 block">Edit</button>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
