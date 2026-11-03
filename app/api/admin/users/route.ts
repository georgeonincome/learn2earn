/**
 * Admin users — reference `admin_users`. Role-gated CRUD.
 */
import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession, requireAdminRole } from '@/lib/server/admin-session'
import { listAdminUsers, getAdminUser, createAdminUser, deleteAdminUser } from '@/lib/server/admin'

export const runtime = 'nodejs'

export async function GET() {
  const session = await getAdminSession()
  if (!session || !requireAdminRole(session, 'view_roles').allowed) {
    return NextResponse.json({ error: 'Admin required' }, { status: 403 })
  }
  return NextResponse.json(await listAdminUsers())
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession()
  if (!session || !requireAdminRole(session, 'edit_settings').allowed) {
    return NextResponse.json({ error: 'Admin required' }, { status: 403 })
  }
  const body = await request.json().catch(() => ({}))
  if (!body.name || !body.email) {
    return NextResponse.json({ error: 'name and email required' }, { status: 400 })
  }
  const admin = await createAdminUser({ name: body.name, email: body.email, userId: body.userId ?? null })
  return NextResponse.json(admin, { status: 201 })
}
