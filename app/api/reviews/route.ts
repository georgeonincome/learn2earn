/**
 * Reviews — reference `reviews` + `review_helpful_votes`.
 * GET ?mine=1 (my reviews) / staff list all; POST create a review.
 */
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/server/auth'
import { getStudentByUserId } from '@/lib/server/students'
import { all, run, one } from '@/lib/server/sql'
import { uuid } from '@/lib/server/ids'

export const runtime = 'nodejs'

async function studentId() {
  const user = await getCurrentUser()
  if (!user) return null
  const student = await getStudentByUserId(user.id)
  return student?.id ?? null
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const mine = searchParams.get('mine')
  const sid = mine === '1' ? await studentId() : null
  if (mine === '1' && !sid) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
  const rows = await all<{ id: string; item_id: string; item_type: string; item_title: string; rating: number; text: string; status: string; created_at: string }>(
    mine === '1'
      ? 'SELECT * FROM reviews WHERE student_id = ? ORDER BY created_at DESC'
      : 'SELECT * FROM reviews ORDER BY created_at DESC',
    mine === '1' ? [sid] : [])
  return NextResponse.json(rows)
}

export async function POST(request: NextRequest) {
  const sid = await studentId()
  if (!sid) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
  const user = await getCurrentUser()
  const student = await getStudentByUserId(user!.id)
  const body = await request.json().catch(() => ({}))
  const { itemId, itemType, rating, text } = body
  if (!itemId || !itemType || !rating || !text) {
    return NextResponse.json({ error: 'itemId, itemType, rating, text required' }, { status: 400 })
  }
  const id = uuid()
  await run(
    `INSERT INTO reviews (id, student_id, item_id, item_type, item_title, rating, text, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', datetime('now'))`,
    [id, sid, itemId, itemType, itemTitle(text), Number(rating), text])
  await run(
    `INSERT INTO review_requests (id, student_id, student_email, student_name, item_type, item_id, item_title, token, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', datetime('now'))`,
    [uuid(), sid, user!.email, String(student?.full_name ?? ''), itemType, itemId, itemTitle(text), `${id}-${uuid()}`])
  return NextResponse.json({ id, status: 'pending' }, { status: 201 })
}

function itemTitle(text: string) {
  return text.slice(0, 60)
}
