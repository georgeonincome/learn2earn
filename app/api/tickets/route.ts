/**
 * Support tickets — reference `tickets` / `ticket_messages`.
 * Collection: students list their own / create; staff list all.
 */
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/server/auth'
import { getStudentByUserId } from '@/lib/server/students'
import { listTickets, createTicket } from '@/lib/server/ops'
import { getAdminSession, requireAdminRole } from '@/lib/server/admin-session'

export const runtime = 'nodejs'

async function me() {
  const user = await getCurrentUser()
  if (!user) return null
  const student = await getStudentByUserId(user.id)
  return { user, student: student ?? null }
}

export async function GET() {
  const session = await getAdminSession()
  const isAdmin = Boolean(session && requireAdminRole(session, 'view_tickets').allowed)
  const me_ = await me()
  if (!me_?.user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
  const tickets = await listTickets()
  if (isAdmin) return NextResponse.json(tickets)
  return NextResponse.json(tickets.filter((t: any) => t.student_id === me_!.student!.id))
}

export async function POST(request: NextRequest) {
  const me_ = await me()
  if (!me_?.user || !me_!.student) {
    return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
  }
  const body = await request.json().catch(() => ({}))
  const { subject, category, message } = body
  if (!subject || !message) {
    return NextResponse.json({ error: 'subject and message are required' }, { status: 400 })
  }
  const student = me_!.student
  const ticket = await createTicket({
    studentId: student.id, studentName: String(student.full_name ?? ''),
    studentEmail: me_!.user.email, subject, category: category ?? 'general', message,
  })
  return NextResponse.json(ticket, { status: 201 })
}
