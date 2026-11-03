/**
 * Admin students — reference `students` list with search.
 */
import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession, requireAdminRole } from '@/lib/server/admin-session'
import { all } from '@/lib/server/sql'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const session = await getAdminSession()
  if (!session || !requireAdminRole(session, 'view_students').allowed) {
    return NextResponse.json({ error: 'Admin required' }, { status: 403 })
  }
  const q = new URL(request.url).searchParams.get('q') ?? ''
  let rows
  if (q) {
    rows = await all(
      `SELECT s.id, s.full_name, s.email, s.created_at
       FROM students s WHERE s.full_name LIKE ? OR s.email LIKE ?
       ORDER BY s.created_at DESC LIMIT 50`,
      [`%${q}%`, `%${q}%`])
  } else {
    rows = await all('SELECT id, full_name, email, created_at FROM students ORDER BY created_at DESC LIMIT 100')
  }
  return NextResponse.json(rows)
}
