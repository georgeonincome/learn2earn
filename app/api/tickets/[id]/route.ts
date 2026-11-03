/**
 * Ticket detail — GET (ticket + messages), PATCH (staff: set status).
 * POST here adds a message to the ticket.
 */
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/server/auth'
import { getStudentByUserId } from '@/lib/server/students'
import { getTicket, addTicketMessage, setTicketStatus, listTicketMessages } from '@/lib/server/ops'
import { getAdminSession, requireAdminRole } from '@/lib/server/admin-session'

export const runtime = 'nodejs'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const ticket = await getTicket(id)
  if (!ticket) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const me_ = await me()
  const session = await getAdminSession()
  const isAdmin = Boolean(session && requireAdminRole(session, 'view_tickets').allowed)
  if (!isAdmin && ticket.student_id !== (me_?.student?.id ?? null)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const messages = await listTicketMessages(id)
  return NextResponse.json({ ticket, messages })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getAdminSession()
  if (!session || !requireAdminRole(session, 'view_tickets').allowed) {
    return NextResponse.json({ error: 'Admin required' }, { status: 403 })
  }
  const body = await req.json().catch(() => ({}))
  await setTicketStatus(id, body.status)
  return NextResponse.json({ ok: true })
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const ticket = await getTicket(id)
  if (!ticket) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const me_ = await me()
  if (!me_?.user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
  const session = await getAdminSession()
  const isAdmin = Boolean(session && requireAdminRole(session, 'view_tickets').allowed)
  if (!isAdmin && ticket.student_id !== me_!.student!.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const body = await req.json().catch(() => ({}))
  const student = await getStudentByUserId(me_!.user.id)
  const msg = await addTicketMessage({
    ticketId: id, senderId: me_!.user.id, senderRole: isAdmin ? 'staff' : 'student',
    senderName: student?.full_name ?? me_!.user.email, message: body.message ?? '',
    attachmentUrl: body.attachmentUrl ?? null,
  })
  return NextResponse.json(msg, { status: 201 })
}

async function me() {
  const user = await getCurrentUser()
  if (!user) return null
  const student = await getStudentByUserId(user.id)
  return { user, student: student ?? null }
}
