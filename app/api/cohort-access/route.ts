// Server half of the reference CohortAccess-CxKT6-jg.js flow (the `/cohort-access`
// page UI ships in Phase 2; these are the RPC replacements it calls):
//   action "validate"  → validate_cohort_access_token + client-side state machine inputs
//   action "redeem"    → the exact insert/redemption/increment sequence
// Response mirrors the token row projection + `state`/`reason` for feedback.
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/server/auth'
import { getStudentByUserId } from '@/lib/server/students'
import {
  validateCohortAccessToken,
  evaluateTokenStates,
  redeemCohortToken,
} from '@/lib/server/cohorts'
import type { Row } from '@/lib/server/sql'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}))
  const token = String(body.token ?? '')
  if (!token) {
    return NextResponse.json({ token: null, state: 'invalid', reason: 'No access token provided' })
  }
  const row = await validateCohortAccessToken(token)
  if (!row) {
    return NextResponse.json({ token: null, state: 'invalid', reason: 'This access link is not valid' })
  }
  const cohort = row.cohort_title
    ? {
        id: row.cohort_id,
        title: row.cohort_title,
        description: row.cohort_description,
        thumbnail_url: row.cohort_thumbnail_url,
        start_date: row.cohort_start_date,
        end_date: row.cohort_end_date,
        total_days: row.cohort_total_days,
        access_start_time: row.cohort_access_start_time,
        access_end_time: row.cohort_access_end_time,
      }
    : null

  if (!cohort) {
    return NextResponse.json({
      token: row,
      cohort: null,
      state: 'invalid',
      reason: 'This access link is no longer valid (cohort not found)',
    })
  }
  const check = evaluateTokenStates(row)
  if (check.state !== 'valid') {
    return NextResponse.json({ token: row, cohort, state: check.state, reason: check.reason })
  }

  if (body.action === 'redeem') {
    const user = await getCurrentUser()
    if (!user) {
      // Reference behavior: not signed in → "Sign In to Enroll" button
      return NextResponse.json({
        token: row,
        cohort,
        state: 'valid',
        signedIn: false,
        authUrl: `/auth?mode=signup&returnTo=${encodeURIComponent(`/cohort-access?token=${token}`)}`,
      })
    }
    const student = await getStudentByUserId(user.id)
    if (!student) {
      return NextResponse.json({
        token: row, cohort, state: 'valid', signedIn: true,
        notice: 'Your account is still being set up. Please refresh in a few seconds and try again.',
      })
    }
    const result = await redeemCohortToken({ token: row, student: student as unknown as Row })
    if (result.state === 'success') {
      return NextResponse.json({ token: row, cohort, state: 'success', signedIn: true, enrollmentId: result.enrollmentId })
    }
    return NextResponse.json({
      token: row, cohort, state: result.state === 'valid' ? 'valid' : result.state,
      signedIn: true,
      reason: result.state === 'valid' ? 'Failed to enroll. Please try again.' : null,
      alreadyEnrolled: result.state === 'already_enrolled',
    })
  }

  // validate (also checks "already_enrolled" like the reference when signed in)
  const user = await getCurrentUser()
  if (user) {
    const student = await getStudentByUserId(user.id)
    if (student) {
      const { one } = await import('@/lib/server/sql')
      const existing = await one(
        'SELECT id FROM cohort_enrollments WHERE cohort_id = ? AND student_id = ? LIMIT 1',
        [row.cohort_id, (student as unknown as Row).id],
      )
      if (existing) {
        return NextResponse.json({ token: row, cohort, state: 'already_enrolled', signedIn: true })
      }
    }
  }
  return NextResponse.json({ token: row, cohort, state: 'valid', signedIn: Boolean(user) })
}
