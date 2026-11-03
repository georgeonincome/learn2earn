/**
 * Admin dashboard metrics — reference metric widgets + needs-attention panel.
 */
import { NextResponse } from 'next/server'
import { getAdminSession, requireAdminRole } from '@/lib/server/admin-session'
import { adminMetrics, attentionCases } from '@/lib/server/admin'

export const runtime = 'nodejs'

export async function GET() {
  const session = await getAdminSession()
  if (!session || !requireAdminRole(session, 'view_dashboard').allowed) {
    return NextResponse.json({ error: 'Admin required' }, { status: 403 })
  }
  const [metrics, attention] = await Promise.all([adminMetrics(), attentionCases()])
  return NextResponse.json({ metrics, attention })
}
