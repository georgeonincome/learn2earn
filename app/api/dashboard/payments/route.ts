/**
 * Dashboard payments / receipts — reference transactions list + receipt download.
 */
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/server/auth'
import { getStudentByUserId } from '@/lib/server/students'
import { all } from '@/lib/server/sql'

export const runtime = 'nodejs'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
  const student = await getStudentByUserId(user.id)
  if (!student) return NextResponse.json({ error: 'Student profile not found' }, { status: 404 })

  const rows = await all(
    `SELECT t.id, t.course_id, c.title AS course_name, t.amount_paid, t.currency,
            t.payment_method, t.payment_status, t.transaction_id, t.created_at
     FROM transactions t LEFT JOIN courses c ON c.id = t.course_id
     WHERE t.student_id = ?
     ORDER BY t.created_at DESC`, [student.id])
  return NextResponse.json(rows)
}
