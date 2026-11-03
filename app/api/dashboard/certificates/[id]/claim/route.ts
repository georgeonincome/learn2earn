/**
 * Certificate claim workflow — reference "Ready to claim" → "Send your work"
 * → "Needs changes + feedback" → "In review" → earned. Creates a review
 * request so the instructor can review and release the certificate.
 */
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/server/auth'
import { getStudentByUserId } from '@/lib/server/students'
import { createReviewRequest } from '@/lib/server/ops'
import { one, run } from '@/lib/server/sql'

export const runtime = 'nodejs'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
  const student = await getStudentByUserId(user.id)
  if (!student) return NextResponse.json({ error: 'Student profile not found' }, { status: 404 })

  const cert = await one<{ id: string; title: string; student_id: string }>(
    'SELECT id, title, student_id FROM course_certificates WHERE id = ? LIMIT 1', [id])
  if (!cert || cert.student_id !== student.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const body = await req.json().catch(() => ({}))
  const { workUrl, note } = body
  if (!workUrl) return NextResponse.json({ error: 'Link to your work is required' }, { status: 400 })

  await createReviewRequest({
    studentId: student.id, studentEmail: user.email, studentName: String(student.full_name ?? ''),
    itemType: 'certificate', itemId: cert.id, itemTitle: cert.title,
  })
  await run('UPDATE course_certificates SET status = \'pending\' WHERE id = ?', [id])
  return NextResponse.json({ ok: true, status: 'pending' })
}
