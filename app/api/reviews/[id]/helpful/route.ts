// Review helpful votes — POST to mark a review as helpful/unhelpful.
// Mirrors reference Reviews-m3j_a8u5.js helpful-vote RPC behavior.
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/server/auth'
import { getStudentByUserId } from '@/lib/server/students'
import { one, run } from '@/lib/server/sql'
import { uuid } from '@/lib/server/ids'

export const runtime = 'nodejs'

export async function POST(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id: reviewId } = await ctx.params
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
  const student = await getStudentByUserId(user.id)
  if (!student) return NextResponse.json({ error: 'Student profile not found' }, { status: 404 })

  const studentId = student.id

  // Check existing vote
  const existing = await one(
    'SELECT id FROM review_helpful_votes WHERE review_id = ? AND user_id = ? LIMIT 1',
    [reviewId, studentId],
  )

  let helpful = true
  if (existing) {
    // Toggle off
    await run('DELETE FROM review_helpful_votes WHERE id = ?', [String(existing.id)])
    helpful = false
  } else {
    // Vote helpful
    await run(
      'INSERT INTO review_helpful_votes (id, review_id, user_id, created_at) VALUES (?, ?, ?, unixepoch())',
      [uuid(), reviewId, studentId],
    )
    helpful = true
  }

  // Count total helpful votes for this review
  const count = await one(
    'SELECT COUNT(*) AS n FROM review_helpful_votes WHERE review_id = ?',
    [reviewId],
  )

  return NextResponse.json({
    helpful,
    helpfulCount: Number((count as any)?.n ?? 0),
  })
}
