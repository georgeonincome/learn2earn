/**
 * Review helpful votes — reference `review_helpful_votes`.
 */
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/server/auth'
import { getStudentByUserId } from '@/lib/server/students'
import { all, run, one } from '@/lib/server/sql'
import { uuid } from '@/lib/server/ids'

export const runtime = 'nodejs'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
  const student = await getStudentByUserId(user.id)
  if (!student) return NextResponse.json({ error: 'Student profile not found' }, { status: 404 })
  const existing = await one('SELECT id FROM review_helpful_votes WHERE review_id = ? AND student_id = ? LIMIT 1', [id, student.id])
  if (existing) return NextResponse.json({ error: 'Already voted' }, { status: 409 })
  await run('INSERT INTO review_helpful_votes (id, review_id, student_id, created_at) VALUES (?, ?, ?, datetime("now"))', [uuid(), id, student.id])
  return NextResponse.json({ ok: true })
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const row = await one('SELECT COUNT(*) AS c FROM review_helpful_votes WHERE review_id = ?', [id])
  return NextResponse.json({ count: Number(row?.c ?? 0) })
}
