/**
 * User roles — reference `user_roles`. GET lists (with student email), POST
 * sets a role (super_admin | finance | support | instructor | manager).
 */
import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession, requireAdminRole } from '@/lib/server/admin-session'
import {
  getUserRole, setUserRole, listAdminUsers, ADMIN_ROLES,
} from '@/lib/server/admin'
import { all } from '@/lib/server/sql'

export const runtime = 'nodejs'

export async function GET() {
  const session = await getAdminSession()
  if (!session || !requireAdminRole(session, 'view_roles').allowed) {
    return NextResponse.json({ error: 'Admin required' }, { status: 403 })
  }
  const rows = await all<{ user_id: string; email: string; role: string }>(
    'SELECT user_id, email, role FROM user_roles ORDER BY role, email')
  return NextResponse.json({ roles: rows, availableRoles: ADMIN_ROLES })
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession()
  if (!session || !requireAdminRole(session, 'edit_settings').allowed) {
    return NextResponse.json({ error: 'Admin required' }, { status: 403 })
  }
  const body = await request.json().catch(() => ({}))
  if (!body.userId || !body.email || !body.role) {
    return NextResponse.json({ error: 'userId, email, role required' }, { status: 400 })
  }
  if (!ADMIN_ROLES.includes(body.role)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
  }
  await setUserRole({ userId: body.userId, email: body.email, role: body.role })
  return NextResponse.json({ ok: true })
}
