/**
 * Needs-attention panel (standalone, also included in /api/admin/metrics).
 */
import { NextResponse } from 'next/server'
import { getAdminSession, requireAdminRole } from '@/lib/server/admin-session'
import { attentionCases } from '@/lib/server/admin'

export const runtime = 'nodejs'

export async function GET() {
  const session = await getAdminSession()
  if (!session || !requireAdminRole(session, 'view_dashboard').allowed) {
    return NextResponse.json({ error: 'Admin required' }, { status: 403 })
  }
  return NextResponse.json(await attentionCases())
}
