/**
 * Dashboard settings — profile (name), password, notifications persistence.
 * Reference Settings tab: profile photo/name/WhatsApp/email change + member
 * number + save/undo; notification toggles persist straight away.
 */
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/server/auth'
import { getStudentByUserId, saveStudentName, saveStudentEmail } from '@/lib/server/students'
import { getStudentPreferences, saveStudentPreferences } from '@/lib/server/preferences'

export const runtime = 'nodejs'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
  const student = await getStudentByUserId(user.id)
  if (!student) return NextResponse.json({ error: 'Student profile not found' }, { status: 404 })
  const prefs = await getStudentPreferences(student.id)
  return NextResponse.json({
    id: student.id, fullName: student.full_name, email: student.email,
    preferences: prefs,
  })
}

export async function PUT(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
  const student = await getStudentByUserId(user.id)
  if (!student) return NextResponse.json({ error: 'Student profile not found' }, { status: 404 })
  const body = await request.json().catch(() => ({}))
  const { action } = body

  if (action === 'name') {
    if (!body.fullName || body.fullName.length < 3) {
      return NextResponse.json({ error: 'Enter your full name. It goes on your certificate.' }, { status: 400 })
    }
    await saveStudentName(student.id, body.fullName)
    return NextResponse.json({ ok: true, fullName: body.fullName })
  }
  if (action === 'email') {
    // reference: 3-step change (send code → confirm); here we accept verified
    // email updates once a code flow is wired (Q6 email provider open).
    return NextResponse.json({ error: 'Email change requires the verification flow (Q6 open)' }, { status: 501 })
  }
  if (action === 'preferences') {
    const prefs = body.preferences ?? {}
    await saveStudentPreferences(student.id, prefs)
    return NextResponse.json({ ok: true })
  }
  if (action === 'password') {
    return NextResponse.json({ error: 'Password change uses the reset flow' }, { status: 501 })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
