/**
 * Admin orders — reference `transactions`. List + issue refund.
 */
import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession, requireAdminRole } from '@/lib/server/admin-session'
import { all, run } from '@/lib/server/sql'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const session = await getAdminSession()
  if (!session || !requireAdminRole(session, 'view_orders').allowed) {
    return NextResponse.json({ error: 'Admin required' }, { status: 403 })
  }
  const rows = await all(
    `SELECT t.*, s.full_name, s.email
     FROM transactions t JOIN students s ON s.id = t.student_id
     ORDER BY t.transaction_date DESC LIMIT 200`)
  return NextResponse.json(rows)
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession()
  if (!session || !requireAdminRole(session, 'issue_refunds').allowed) {
    return NextResponse.json({ error: 'Admin required' }, { status: 403 })
  }
  const body = await request.json().catch(() => ({}))
  if (!body.id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  await run("UPDATE transactions SET payment_status = 'refunded' WHERE id = ?", [body.id])
  return NextResponse.json({ ok: true })
}
