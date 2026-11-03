/**
 * Course studio — sections: POST create.
 */
import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession, requireAdminRole } from '@/lib/server/admin-session'
import { createSection } from '@/lib/server/course-studio'

export const runtime = 'nodejs'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session || !requireAdminRole(session, 'edit_courses').allowed) {
    return NextResponse.json({ error: 'Admin required' }, { status: 403 })
  }
  const { id } = await params
  const body = await req.json().catch(() => ({}))
  if (!body.title) return NextResponse.json({ error: 'title required' }, { status: 400 })
  const section = await createSection(id, body.title)
  return NextResponse.json(section, { status: 201 })
}
