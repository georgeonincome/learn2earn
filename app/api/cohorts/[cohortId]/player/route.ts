// Cohort player data — student_cohort_player RPC equivalent.
// Returns sessions, enrollment, student, cohort for the player UI.
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/server/auth'
import { getStudentByUserId } from '@/lib/server/students'
import { getCohortPlayer } from '@/lib/server/cohort-player'
import type { Row } from '@/lib/server/sql'

export const runtime = 'nodejs'

export async function GET(request: NextRequest, ctx: { params: Promise<{ cohortId: string }> }) {
  const { cohortId } = await ctx.params
  let studentId: string | null = null
  const user = await getCurrentUser()
  if (user) {
    const student = await getStudentByUserId(user.id)
    if (student) studentId = student.id
  }
  const data = await getCohortPlayer(cohortId, studentId)
  if (!data) return NextResponse.json({ error: 'Cohort not found' }, { status: 404 })
  return NextResponse.json(data)
}
