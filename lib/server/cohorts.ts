// Cohort access tokens — exact reference behavior from CohortAccess-CxKT6-jg.js
// and the RPCs it calls: `validate_cohort_access_token`, `increment_token_usage`.
import { all, one, run } from './sql'
import { nowIso, uuid } from './ids'
import type { Row } from './sql'
import { sendNotificationEmail } from './notifications'

export type CohortTokenRow = {
  id: string
  cohort_id: string
  name: string | null
  max_uses: number | null
  uses_count: number | null
  valid_from: string | null
  valid_until: string | null
  is_active: number | null
  cohort_title: string | null
  cohort_description: string | null
  cohort_thumbnail_url: string | null
  cohort_start_date: string | null
  cohort_end_date: string | null
  cohort_total_days: number | null
  cohort_access_start_time: string | null
  cohort_access_end_time: string | null
}

/**
 * `validate_cohort_access_token({p_token})` — one row: the token flattened with
 * its cohort join exactly as the reference component consumes it (cohort_title,
 * cohort_description, ... cohort_access_end_time).
 */
export async function validateCohortAccessToken(pToken: string): Promise<CohortTokenRow | null> {
  const row = await one<CohortTokenRow>(
    `SELECT t.id, t.cohort_id, t.name, t.max_uses, t.uses_count, t.valid_from, t.valid_until, t.is_active,
            c.title AS cohort_title, c.description AS cohort_description,
            c.thumbnail_url AS cohort_thumbnail_url, c.start_date AS cohort_start_date,
            c.end_date AS cohort_end_date, c.total_days AS cohort_total_days,
            c.access_start_time AS cohort_access_start_time, c.access_end_time AS cohort_access_end_time
       FROM enrollment_tokens t
       LEFT JOIN cohorts c ON c.id = t.cohort_id
      WHERE t.id = ? OR t.name = ?
      LIMIT 1`,
    [pToken, pToken],
  )
  return row
}

/** `increment_token_usage({token_id_param})` — bump uses_count by 1. */
export async function incrementTokenUsage(tokenId: string) {
  await run('UPDATE enrollment_tokens SET uses_count = COALESCE(uses_count, 0) + 1 WHERE id = ?', [tokenId])
}

// State machine — reference component states:
//   loading | invalid | not_started | expired | max_uses | already_enrolled | enrolling | success | valid
export type TokenState =
  | 'loading' | 'invalid' | 'not_started' | 'expired' | 'max_uses' | 'already_enrolled' | 'enrolling' | 'success' | 'valid'

export function evaluateTokenStates(token: CohortTokenRow) {
  if (!token) return { state: 'invalid' as TokenState, reason: 'This access link is not valid' }
  if (!token.is_active) {
    return { state: 'invalid' as TokenState, reason: 'This access link has been deactivated' }
  }
  const now = new Date()
  if (token.valid_from && new Date(token.valid_from) > now) {
    return { state: 'not_started' as TokenState, reason: `This access link will be valid from ${formatLongDate(token.valid_from)}` }
  }
  if (token.valid_until && new Date(token.valid_until) < now) {
    return { state: 'expired' as TokenState, reason: 'This access link has expired' }
  }
  if (token.max_uses !== null && Number(token.uses_count ?? 0) >= Number(token.max_uses)) {
    return { state: 'max_uses' as TokenState, reason: 'This access link has reached its maximum number of uses' }
  }
  return { state: 'valid' as TokenState, reason: null }
}

/** Reference date rendering: `format(date, "MMMM d, yyyy")` */
export function formatLongDate(d: string | null): string {
  if (!d) return ''
  const dt = new Date(d)
  return dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Africa/Lusaka' })
}

export function format12Hour(t: string | null): string {
  if (!t) return ''
  const [h, m] = t.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${ampm}`
}

export async function hasCohortEnrollment(studentId: string, cohortId: string) {
  const row = await one('SELECT id FROM cohort_enrollments WHERE cohort_id = ? AND student_id = ? LIMIT 1', [cohortId, studentId])
  return Boolean(row)
}

/**
 * Redemption: the exact insert the reference makes via the page:
 *   cohort_enrollments.insert({
 *     cohort_id, student_id, status:"active", payment_status:"paid",
 *     payment_method:"access_token", amount_paid:0, enrollment_source:"access_token"})
 *   cohort_token_redemptions.insert({token_id, student_id, enrollment_id})
 *   rpc increment_token_usage
 *   sendNotificationEmail({type:"cohort_enrollment", user, cohort:{...}})
 */
export async function redeemCohortToken({
  token,
  student,
}: {
  token: CohortTokenRow
  student: Row
}): Promise<{ state: TokenState; enrollmentId?: string }> {
  const studentId = String(student.id)
  const cohortId = token.cohort_id

  if (await hasCohortEnrollment(studentId, cohortId)) {
    return { state: 'already_enrolled' }
  }
  const check = evaluateTokenStates(token)
  if (check.state !== 'valid') return { state: check.state }

  const enrollmentId = uuid()
  try {
    await run(
      `INSERT INTO cohort_enrollments
         (id, cohort_id, student_id, status, payment_status, payment_method,
          amount_paid, enrollment_source, enrolled_at)
       VALUES (?, ?, ?, 'active', 'paid', 'access_token', 0, 'access_token', ?)`,
      [enrollmentId, cohortId, studentId, nowIso()],
    )
    await run(
      'INSERT INTO cohort_token_redemptions (id, token_id, student_id, enrollment_id) VALUES (?, ?, ?, ?)',
      [uuid(), token.id, studentId, enrollmentId],
    )
    await incrementTokenUsage(token.id)
    await sendNotificationEmail({
      type: 'cohort_enrollment',
      user: {
        id: studentId,
        email: String(student.email ?? ''),
        name: (student.full_name as string) ?? undefined,
      },
      cohort: {
        id: cohortId,
        title: String(token.cohort_title ?? ''),
        start_date: token.cohort_start_date ?? undefined,
        end_date: token.cohort_end_date ?? undefined,
        total_days: token.cohort_total_days ?? undefined,
      },
    })
    return { state: 'success', enrollmentId }
  } catch (err) {
    console.error('[redeemCohortToken]', err)
    return { state: 'valid' }
  }
}

/** Admin-facing helper (used later by cohortActions): create a token. */
export async function createCohortToken(input: {
  cohortId: string
  name?: string | null
  maxUses?: number | null
  validFrom?: string | null
  validUntil?: string | null
}) {
  const id = uuid()
  await run(
    `INSERT INTO enrollment_tokens (id, cohort_id, name, max_uses, uses_count, valid_from, valid_until, is_active)
     VALUES (?, ?, ?, ?, 0, ?, ?, 1)`,
    [id, input.cohortId, input.name ?? 'Special access invitation', input.maxUses, input.validFrom, input.validUntil],
  )
  const row = await one('SELECT * FROM enrollment_tokens WHERE id = ?', [id])
  return row
}
