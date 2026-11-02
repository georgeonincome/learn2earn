// Daily check-in for cohort attendance.
// Body: { cohortId, dayId? }
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/server/auth'
import { getStudentByUserId } from '@/lib/server/students'
import { one, run } from '@/lib/server/sql'
import { uuid } from '@/lib/server/ids'
import { awardPoints } from '@/lib/server/gamification'
import type { Row } from '@/lib/server/sql'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}))
  const cohortId = body.cohortId
  if (!cohortId) return NextResponse.json({ error: 'cohortId is required' }, { status: 400 })

  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
  const student = await getStudentByUserId(user.id)
  if (!student) return NextResponse.json({ error: 'Student profile not found' }, { status: 404 })

  const studentId = student.id
  const today = new Date().toISOString().slice(0, 10)
  const dayId = body.dayId ?? today

  // Check already checked in today
  const existing = await one(
    'SELECT id FROM cohort_checkins WHERE student_id = ? AND cohort_id = ? AND day_id = ? LIMIT 1',
    [studentId, cohortId, dayId],
  )
  if (existing) {
    return NextResponse.json({ ok: true, alreadyCheckedIn: true })
  }

  const cohort = await one<Row>(
    'SELECT checkin_points FROM cohorts WHERE id = ? AND deleted_at IS NULL LIMIT 1',
    [cohortId],
  )
  const points = cohort ? Number((cohort as Row).checkin_points ?? 10) : 10

  await run(
    'INSERT INTO cohort_checkins (id, student_id, cohort_id, day_id, checkin_at, points) VALUES (?, ?, ?, ?, unixepoch(), ?)',
    [uuid(), studentId, cohortId, dayId, points],
  )

  // Award check-in points
  await awardPoints({ studentId, points, reason: 'cohort_checkin', referenceId: cohortId })

  return NextResponse.json({ ok: true, points, dayId })
}
