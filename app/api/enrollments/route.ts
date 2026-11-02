// `enrollments` delete/restart helper — reference `reset_my_lesson_progress` RPC is
// Phase 1; this route only reports a student's enrollments (Dashboard reads).
import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/server/auth'
import { getStudentByUserId } from '@/lib/server/students'
import { getEnrollmentsForStudent } from '@/lib/server/enroll'

export const runtime = 'nodejs'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Not signed in (session)' }, { status: 401 })
  const student = await getStudentByUserId(user.id)
  if (!student) return NextResponse.json({ error: 'Student profile not found' }, { status: 404 })
  const rows = await getEnrollmentsForStudent(student.id)
  return NextResponse.json({ enrollments: rows })
}
