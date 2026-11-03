/**
 * Admin training-session enrollments — reference "The Room — Enrollments"
 * (`training_session_enrollments`) with CSV export (?export=csv).
 */
import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession, requireAdminRole } from '@/lib/server/admin-session'
import { all } from '@/lib/server/sql'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const session = await getAdminSession()
  if (!session || !requireAdminRole(session, 'manage_cohort_operations').allowed) {
    return NextResponse.json({ error: 'Admin required' }, { status: 403 })
  }
  const { searchParams } = new URL(request.url)
  if (searchParams.get('export') === 'csv') {
    const rows = await all('SELECT * FROM training_session_enrollments ORDER BY enrolled_at DESC')
    const lines = ['# Name,Email,Phone,Payment Ref,Amount,Currency,Status,Date']
    for (const r of rows) {
      lines.push([r.student_name, r.student_email, r.phone, r.payment_reference, r.amount, r.currency, r.status, r.enrolled_at].map(String).join(','))
    }
    return new NextResponse(lines.join('\n'), {
      status: 200,
      headers: { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename="training-enrollments.csv"' },
    })
  }
  const rows = await all('SELECT * FROM training_session_enrollments ORDER BY enrolled_at DESC')
  return NextResponse.json(rows)
}
