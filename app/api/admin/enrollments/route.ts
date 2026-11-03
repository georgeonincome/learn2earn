/**
 * Admin enrollments — reference `enrollments`. List + manual grant
 * (reference `/admin/enrollments` access-fix flow).
 */
import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession, requireAdminRole } from '@/lib/server/admin-session'
import { all, run } from '@/lib/server/sql'
import { uuid } from '@/lib/server/ids'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const session = await getAdminSession()
  if (!session || !requireAdminRole(session, 'view_enrollments').allowed) {
    return NextResponse.json({ error: 'Admin required' }, { status: 403 })
  }
  const { searchParams } = new URL(request.url)
  const studentId = searchParams.get('studentId') ?? undefined
  const courseId = searchParams.get('courseId') ?? undefined
  let sql = `SELECT e.*, s.full_name, s.email
             FROM enrollments e JOIN students s ON s.id = e.student_id`
  const args: unknown[] = []
  const conds: string[] = []
  if (studentId) { conds.push('e.student_id = ?'); args.push(studentId) }
  if (courseId) { conds.push('e.course_id = ?'); args.push(courseId) }
  if (conds.length) sql += ' WHERE ' + conds.join(' AND ')
  sql += ' ORDER BY e.enrolled_at DESC LIMIT 200'
  return NextResponse.json(await all(sql, args))
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession()
  if (!session || !requireAdminRole(session, 'create_enrollments').allowed) {
    return NextResponse.json({ error: 'Admin required' }, { status: 403 })
  }
  const body = await request.json().catch(() => ({}))
  if (!body.studentId || !body.courseId) {
    return NextResponse.json({ error: 'studentId and courseId required' }, { status: 400 })
  }
  const id = uuid()
  await run(
    `INSERT INTO enrollments (id, student_id, course_id, payment_status, enrollment_source, amount_paid, transaction_id, enrolled_at, created_at)
     VALUES (?, ?, ?, 'paid', 'manual', 0, NULL, unixepoch(), unixepoch())`,
    [id, body.studentId, body.courseId])
  return NextResponse.json({ id, ok: true }, { status: 201 })
}
