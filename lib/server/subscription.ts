// Subscription domain — reference contracts:
//   `subscription-summary` (client use in useSubscription-CuULC_HM.js)
//   `subscription-course-access` (client use in CoursePlayer/CourseDetail/etc.)
//   `subscription-activate` (client use in Subscribe-DucfmV4N.js)
// Rebrand: KES → ZMW, locale en-KE → en-ZM, Africa/Nairobi → Africa/Lusaka.
import { all, one, run } from './sql'
import { nowIso } from './ids'
import type { Row } from './sql'

const DAY_MS = 24 * 60 * 60 * 1000

export type PlanSummary = {
  id: string
  code: string
  name: string
  duration_days: number
  price_kes: number
  price_usd?: number
  is_visible: boolean
  is_recommended: boolean
  sort_order: number
}

export type SubscriptionState = 'none' | 'active' | 'expired' | 'cancelled'

export type SubscriptionSummary = {
  status: SubscriptionState
  isActive: boolean
  plan: PlanSummary | null
  currentPeriodEnd: string | null
  currentPeriodStart: string | null
  daysRemaining: number | null
  daysTotal: number | null
  amount: number
  currency: string
  cancelAtPeriodEnd: boolean
  lastPayment: string | null
  counts: { courses: number; resources: number; darasaSessions: number; owned: number; certificates: number }
  plans: PlanSummary[]
}

/** Reference ExportBox `f`: `KES ${Math.round(n).toLocaleString("en-KE")}` → ZMW / en-ZM */
export function formatCurrency(amount: number): string {
  return `ZMW ${Math.round(amount).toLocaleString('en-ZM')}`
}

/** Reference ExportBox `m`: Math.round(amount / (durationDays / 30)) */
export function pricePerMonth(amount: number, durationDays: number): number {
  return durationDays ? Math.round(amount / (durationDays / 30)) : amount
}

/** Serialize a subscription_plans row to the client contract. */
export function toPlanSummary(row: Row): PlanSummary {
  return {
    id: String(row.id),
    code: String(row.code ?? ''),
    name: String(row.name ?? ''),
    duration_days: Number(row.duration_days ?? 0),
    price_kes: Number(row.price_kes ?? 0),
    price_usd: row.price_usd != null ? Number(row.price_usd) : undefined,
    is_visible: Boolean(row.is_visible),
    is_recommended: Boolean(row.is_recommended),
    sort_order: Number(row.sort_order ?? 0),
  }
}

export async function getVisiblePlans(): Promise<PlanSummary[]> {
  const rows = await all(
    'SELECT * FROM subscription_plans WHERE is_visible = 1 ORDER BY sort_order ASC',
  )
  return rows.map(toPlanSummary)
}

type SubRow = {
  id: string
  student_id: string
  plan_id: string
  status: string | null
  current_period_start: string | null
  current_period_end: string | null
  cancel_at_period_end: number | null
  last_payment: string | null
  amount: number | null
  currency: string | null
}

/** Latest subscription row for a student (most-recently created wins). */
export async function getSubscription(studentId: string): Promise<SubRow | null> {
  return one<SubRow>(
    'SELECT * FROM subscriptions WHERE student_id = ? ORDER BY created_at DESC, id DESC LIMIT 1',
    [studentId],
  )
}

/** Derive current status: an active-looking row whose period ended is "expired". */
export function deriveStatus(sub: SubRow | null): { status: SubscriptionState; isActive: boolean } {
  if (!sub) return { status: 'none', isActive: false }
  const end = sub.current_period_end ? new Date(sub.current_period_end).getTime() : 0
  if (end && end < Date.now()) return { status: sub.status === 'cancelled' ? 'cancelled' : 'expired', isActive: false }
  const isActive = sub.status === 'active'
  return { status: isActive ? 'active' : ((sub.status ?? 'none') as SubscriptionState), isActive }
}

/** `subscription-summary` implementation (client contract in useSubscription). */
export async function buildSummary(studentId: string): Promise<SubscriptionSummary> {
  const plans = await getVisiblePlans()
  const sub = await getSubscription(studentId)
  const { status, isActive } = deriveStatus(sub)
  const plan = sub ? plans.find((p) => p.id === sub.plan_id) ?? plans[0] ?? null : null

  let daysRemaining: number | null = null
  let daysTotal: number | null = null
  if (sub?.current_period_end && sub.current_period_start) {
    const end = new Date(sub.current_period_end).getTime()
    const start = new Date(sub.current_period_start).getTime()
    daysTotal = Math.ceil((end - start) / DAY_MS)
    daysRemaining = Math.max(0, Math.ceil((end - Date.now()) / DAY_MS))
  }

  return {
    status,
    isActive,
    plan,
    currentPeriodEnd: sub?.current_period_end ?? null,
    currentPeriodStart: sub?.current_period_start ?? null,
    daysRemaining,
    daysTotal,
    amount: sub ? Number(sub.amount ?? 0) : 0,
    currency: sub?.currency ?? 'ZMW',
    cancelAtPeriodEnd: Boolean(sub?.cancel_at_period_end),
    lastPayment: sub?.last_payment ?? null,
    counts: await buildCounts(studentId),
    plans,
  }
}

/**
 * `counts` consumed by the dashboard (courses owned / platform resources /
 * darasa sessions / owned courses / certificates). Tables for resources,
 * darasa sessions and certificates arrive with later phases; those reads are
 * guarded and return 0 until those tables are ported (same shape either way).
 */
async function buildCounts(studentId: string): Promise<SubscriptionSummary['counts']> {
  const counts = { courses: 0, resources: 0, darasaSessions: 0, owned: 0, certificates: 0 }
  try {
    const r = await all('SELECT COUNT(*) AS n FROM enrollments WHERE student_id = ?', [studentId])
    counts.owned = Number(r[0]?.n ?? 0)
    counts.courses = counts.owned
    // certificates tables arrive with Phases 1–2; counts keep the contract shape
  } catch (err) {
    console.error('[subscription-summary] counts', err)
  }
  return counts
}

/**
 * `subscription-course-access` — access states seen in the client:
 *   "owned"    — the student has an enrollments row for that course
 *   "included" — the student has an active (non-expired) membership
 *   "locked"   — neither
 */
export async function courseAccess(studentId: string, courseIds: string[]) {
  const access: Record<string, { state: string }> = {}
  let included = false
  if (studentId) {
    const sub = await getSubscription(studentId)
   included = deriveStatus(sub).isActive
    if (courseIds.length > 0) {
      const marks = courseIds.map(() => '?').join(', ')
      const owned = await all(
        `SELECT DISTINCT course_id FROM enrollments WHERE student_id = ? AND course_id IN (${marks})`,
        [studentId, ...courseIds],
      )
      const ownedIds = new Set(owned.map((r) => String(r.course_id)))
      for (const id of courseIds) {
        access[id] = { state: ownedIds.has(id) ? 'owned' : included ? 'included' : 'locked' }
      }
      return { access }
    }
  }
  for (const id of courseIds) {
    access[id] = { state: included ? 'included' : 'locked' }
  }
  return { access }
}

/**
 * `subscription-activate` — body {reference}.
 * Client polling expects: {status:"pending"|"failed"|"success",
 *  reason?, email?, amount?, planName?, periodEnd?, stacked?, mode?, token_hash?}
 */
export async function activateByReference(reference: string) {
  const tx = await one<Row>(
    'SELECT * FROM transactions WHERE payment_reference = ? ORDER BY transaction_date DESC LIMIT 1',
    [reference],
  )
  if (!tx) return { status: 'pending' as const }
  if (tx.payment_status === 'failed') {
    return {
      status: 'failed' as const,
      reason: (tx.processed_by_name as string) ?? 'The payment did not go through.',
    }
  }
  if (tx.payment_status !== 'paid') return { status: 'pending' as const }

  const plan = tx.plan_id
    ? await one<Row>('SELECT * FROM subscription_plans WHERE id = ? LIMIT 1', [tx.plan_id])
    : null

  if (!plan) return { status: 'pending' as const }

  // Resolve the buyer (guest purchases carry student_id null — bind by email,
  // matching autoEnrollOnPaymentSuccess).
  let studentId = tx.student_id ? String(tx.student_id) : ''
  if (!studentId) {
    const email = String(tx.student_email ?? '').toLowerCase()
    if (email) {
      let s = await one<Row>('SELECT * FROM students WHERE email = ? LIMIT 1', [email])
      if (!s) {
        const id = crypto.randomUUID()
        await run('INSERT INTO students (id, email, full_name) VALUES (?, ?, ?)', [
          id,
          email,
          String(tx.student_name ?? ''),
        ])
        s = await one<Row>('SELECT * FROM students WHERE id = ? LIMIT 1', [id])
      }
      studentId = String(s!.id)
      await run('UPDATE transactions SET student_id = ? WHERE id = ?', [studentId, String(tx.id)])
    }
  }
  if (!studentId) return { status: 'pending' as const }
  const durationMs = Number(plan.duration_days ?? 0) * DAY_MS
  const now = Date.now()

  // Existing non-expired subscription ⇒ "stacked" renewal extends the period end.
  const existing = await getSubscription(studentId)
  const existingEnd = existing?.current_period_end ? new Date(existing.current_period_end).getTime() : 0
  const stacked = Boolean(existing) && existingEnd > now
  const start = stacked ? existingEnd! : now
  const end = start + durationMs

  await run(
    `INSERT INTO subscriptions
      (id, student_id, plan_id, status, current_period_start, current_period_end,
       cancel_at_period_end, last_payment, amount, currency, created_at, updated_at)
     VALUES (?, ?, ?, 'active', ?, ?, 0, ?, ?, ?, unixepoch(), unixepoch())`,
    [
      crypto.randomUUID(),
      studentId,
      String(plan.id),
      new Date(start).toISOString(),
      new Date(end).toISOString(),
      nowIso(),
      Number(tx.amount ?? plan.price_kes ?? 0),
      'ZMW',
    ],
  )

  return {
    status: 'success' as const,
    email: (tx.student_email as string) ?? null,
    amount: Number(tx.amount ?? 0),
    planName: String(plan.name ?? 'Subscription'),
    periodEnd: new Date(end).toISOString(),
    stacked,
  }
}
