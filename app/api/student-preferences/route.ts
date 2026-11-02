// Student preferences — `student_save_preferences` / `student_settings_data` contracts.
// GET  → normalized { notifications, learning }
// POST { updates }   → flips only provided keys, preserves the rest
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/server/auth'
import { getStudentByUserId } from '@/lib/server/students'
import { getStudentPreferences, saveStudentPreferences } from '@/lib/server/preferences'

export const runtime = 'nodejs'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Not signed in (session)' }, { status: 401 })
  const student = await getStudentByUserId(user.id)
  if (!student) return NextResponse.json({ error: 'Student profile not found' }, { status: 404 })
  return NextResponse.json(await getStudentPreferences(student.id))
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Not signed in (session)' }, { status: 401 })
  const student = await getStudentByUserId(user.id)
  if (!student) return NextResponse.json({ error: 'Student profile not found' }, { status: 404 })
  const body = await request.json().catch(() => ({}))
  const next = await saveStudentPreferences(student.id, body.updates ?? {})
  return NextResponse.json(next)
}
