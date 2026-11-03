/**
 * Messages — reference `messages`. GET ?receiverId= lists; POST sends.
 */
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/server/auth'
import { listMessages, sendMessage, markMessageRead } from '@/lib/server/ops'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
  const receiverId = new URL(request.url).searchParams.get('receiverId') ?? undefined
  return NextResponse.json(await listMessages({ receiverId }))
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
  const body = await request.json().catch(() => ({}))
  if (!body.receiverId || !body.subject || !body.content) {
    return NextResponse.json({ error: 'receiverId, subject, content required' }, { status: 400 })
  }
  const msg = await sendMessage({
    senderId: user.id, senderRole: 'student', receiverId: body.receiverId,
    subject: body.subject, content: body.content,
    attachmentUrl: body.attachmentUrl ?? null,
  })
  return NextResponse.json(msg, { status: 201 })
}

export async function PATCH(request: NextRequest) {
  const body = await request.json().catch(() => ({}))
  if (!body.id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  await markMessageRead(body.id)
  return NextResponse.json({ ok: true })
}
