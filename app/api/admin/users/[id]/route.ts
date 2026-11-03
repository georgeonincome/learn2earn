/**
 * Admin user delete.
 */
import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession, requireAdminRole } from '@/lib/server/admin-session'
import { deleteAdminUser } from '@/lib/server/admin'

export const runtime = 'nodejs'

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session || !requireAdminRole(session, 'edit_settings').allowed) {
    return NextResponse.json({ error: 'Admin required' }, { status: 403 })
  }
  const { id } = await params
  await deleteAdminUser(id)
  return NextResponse.json({ ok: true })
}
