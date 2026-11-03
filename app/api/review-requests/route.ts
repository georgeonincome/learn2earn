/**
 * Review requests — reference `review_requests`. Staff create a token-linked
 * request after a course/class; student opens /review/[token] to write it.
 */
import { NextRequest, NextResponse } from 'next/server'
import { createReviewRequest, getReviewRequestByToken, updateReviewRequest } from '@/lib/server/ops'
import { getAdminSession, requireAdminRole } from '@/lib/server/admin-session'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const session = await getAdminSession()
  if (!session || !requireAdminRole(session, 'view_students').allowed) {
    return NextResponse.json({ error: 'Admin required' }, { status: 403 })
  }
  const body = await request.json().catch(() => ({}))
  const { studentId, studentEmail, studentName, itemType, itemId, itemTitle } = body
  if (!studentId || !studentEmail || !itemType || !itemId) {
    return NextResponse.json({ error: 'studentId, studentEmail, itemType, itemId required' }, { status: 400 })
  }
  const rr = await createReviewRequest({
    studentId, studentEmail, studentName: studentName ?? '', itemType, itemId, itemTitle: itemTitle ?? '',
  })
  return NextResponse.json(rr, { status: 201 })
}

export async function PATCH(request: NextRequest) {
  const session = await getAdminSession()
  if (!session || !requireAdminRole(session, 'view_students').allowed) {
    return NextResponse.json({ error: 'Admin required' }, { status: 403 })
  }
  const body = await request.json().catch(() => ({}))
  const { token, status, snoozedUntil } = body
  if (!token) return NextResponse.json({ error: 'token required' }, { status: 400 })
  await updateReviewRequest(token, { status, snoozed_until: snoozedUntil })
  return NextResponse.json({ ok: true })
}

// ----------------------------------------------------------- review token --

export async function GET(request: NextRequest, { params }: { params: Promise<{}> }) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')
  if (!token) return NextResponse.json({ error: 'token required' }, { status: 400 })
  const rr = await getReviewRequestByToken(token)
  if (!rr) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({
    token: rr.token, status: rr.status, itemType: rr.item_type, itemId: rr.item_id,
    itemTitle: rr.item_title, studentName: rr.student_name,
  })
}
