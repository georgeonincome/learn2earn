// `subscription-profile` — reference edge function contract (Subscribe-DucfmV4N.js):
//   body { action: "name",  fullName }          → saves students.full_name (certificate name)
//   body { action: "email", email, reference }  → changes the login email + resends receipt
// → { email } on success; { error } on failure
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/server/auth'
import { getStudentByUserId, saveStudentName, saveStudentEmail } from '@/lib/server/students'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}))
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Not signed in (session)' }, { status: 401 })
  const student = await getStudentByUserId(user.id)
  if (!student) return NextResponse.json({ error: 'Student profile not found' }, { status: 404 })

  if (body.action === 'name') {
    if (typeof body.fullName !== 'string') return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    await saveStudentName(student.id, body.fullName.trim())
    return NextResponse.json({ email: student.email ?? user.email })
  }
  if (body.action === 'email') {
    const email = String(body.email ?? '').trim().toLowerCase()
    if (!/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({ error: 'could not save that email' }, { status: 400 })
    await saveStudentEmail(student.id, email)
    return NextResponse.json({ email })
  }
  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
