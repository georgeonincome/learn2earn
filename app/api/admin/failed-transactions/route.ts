/**
 * Admin failed transactions — reference `failed_transactions` surface.
 */
import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession, requireAdminRole } from '@/lib/server/admin-session'
import { all } from '@/lib/server/sql'

export const runtime = 'nodejs'

export async function GET() {
  const session = await getAdminSession()
  if (!session || !requireAdminRole(session, 'view_failed_transactions').allowed) {
    return NextResponse.json({ error: 'Admin required' }, { status: 403 })
  }
  const rows = await all(
    `SELECT t.*, s.full_name, s.email
     FROM transactions t JOIN students s ON s.id = t.student_id
     WHERE t.payment_status = 'failed'
     ORDER BY t.transaction_date DESC LIMIT 200`)
  return NextResponse.json(rows)
}
