/**
 * Announcements — reference `announcements` + `announcement_views`.
 * GET lists (published ones for students, all for staff); POST creates (staff).
 */
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/server/auth'
import {
  listAnnouncements, getAnnouncement, createAnnouncement, recordAnnouncementView,
} from '@/lib/server/ops'
import { getAdminSession, requireAdminRole } from '@/lib/server/admin-session'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const session = await getAdminSession()
  const isAdmin = Boolean(session && requireAdminRole(session, 'view_tickets').allowed)
  const announcements = await listAnnouncements({ publishedOnly: !isAdmin })
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (id) {
    const a = await getAnnouncement(id)
    if (!a) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (!isAdmin) {
      const user = await getCurrentUser()
      if (user) await recordAnnouncementView(id, user.id)
    }
    return NextResponse.json(a)
  }
  return NextResponse.json(announcements)
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession()
  if (!session || !requireAdminRole(session, 'create_announcements').allowed) {
    return NextResponse.json({ error: 'Admin required' }, { status: 403 })
  }
  const body = await request.json().catch(() => ({}))
  if (!body.title || !body.message) {
    return NextResponse.json({ error: 'title and message are required' }, { status: 400 })
  }
  const announcement = await createAnnouncement({
    title: body.title, message: body.message, content: body.content ?? null,
    targetType: body.targetType ?? 'all', isPublished: body.isPublished ?? true,
    enableNotifications: body.enableNotifications ?? false,
    authorId: session.userId,
  })
  return NextResponse.json(announcement, { status: 201 })
}
