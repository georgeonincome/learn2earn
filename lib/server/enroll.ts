// Enrollment flows — exact reference behavior from:
//   CourseCatalog free-enroll:  enrollments.insert({student_id, course_id, payment_status:"free",
//                                               enrollment_source:"free", amount_paid:0})
//   CourseCatalog paid-enroll:  enrollments.insert({student_id, course_id,
//                                               payment_status:"paid", enrollment_source:"checkout",
//                                               amount_paid, payment_method, transaction_id=reference})
//   transaction row:            transactions.insert({student_id, student_email, student_name,
//                                               course_id, course_name, payment_reference,
//                                               amount, currency, original_price, discount_amount,
//                                               payment_method, payment_status, source,
//                                               enrollment_source, processed_by_name, transaction_date})
// Rebrand: enrollment_source "paystack_checkout" → "flutterwave_checkout";
//          payment_method "paystack" → "flutterwave"; processed_by_name
//          "System (Paystack)" → "System (Flutterwave)".
import { all, one, run } from './sql'
import { nowIso, uuid } from './ids'
import type { Row } from './sql'
import { getStudentByUserId } from './students'
import { sendNotificationEmail } from './notifications'

/** `enrollments` row shape used across the reference chunks. */
export type EnrollmentRow = {
  id: string
  student_id: string
  course_id: string | null
  cohort_id: string | null
  payment_status: string | null
  enrollment_source: string | null
  amount_paid: number | null
  payment_method: string | null
  transaction_id: string | null
  enrolled_at: string | null
  last_accessed: string | null
  completion_status: string | null
}

export async function getEnrollment(studentId: string, courseId: string): Promise<EnrollmentRow | null> {
  return one<EnrollmentRow>(
    'SELECT * FROM enrollments WHERE student_id = ? AND course_id = ? LIMIT 1',
    [studentId, courseId],
  )
}

export async function getEnrollmentsForStudent(studentId: string): Promise<EnrollmentRow[]> {
  const rows = await all('SELECT * FROM enrollments WHERE student_id = ? ORDER BY enrolled_at DESC', [studentId])
  return rows as unknown as EnrollmentRow[]
}

/** The catalog "Enroll free" path (CourseCatalog-C5tc84t_.js / CourseDetail `enrollFree`). */
export async function enrollFree(student: Row, course: Row) {
  const existing = await getEnrollment(String(student.id), String(course.id))
  if (existing) return existing
  await run(
    `INSERT INTO enrollments
       (id, student_id, course_id, payment_status, enrollment_source, amount_paid, enrolled_at)
     VALUES (?, ?, ?, 'free', 'free', 0, ?)`,
    [uuid(), String(student.id), String(course.id), nowIso()],
  )
  await sendNotificationEmail({
    type: 'free_enrollment',
    user: { id: String(student.id), email: String(student.email ?? ''), name: (student.full_name as string) ?? undefined },
    course: { id: String(course.id), title: String(course.title ?? course.name ?? '') },
  })
  return getEnrollment(String(student.id), String(course.id))
}

// --- paid path (auto-enroll on payment success) ------------------------------
export const REF_PROCESSED_BY = 'System (Flutterwave)'
export const REF_ENROLLMENT_SOURCE = 'flutterwave_checkout'
export const REF_PAYMENT_METHOD = 'flutterwave'

/** Write the audit-trail transaction row at payment initiation (payment_status "pending"). */
export async function createPendingCourseTransaction(args: {
  studentId: string | null
  email: string
  fullName: string
  course: Row
  amount: number
  transactionReference: string
}) {
  await run(
    `INSERT INTO transactions
       (id, student_id, student_email, student_name, course_id, course_name,
        payment_reference, amount, currency, original_price, discount_amount,
        payment_method, payment_status, source, enrollment_source,
        processed_by_name, transaction_date)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'ZMW', ?, ?, ?, 'pending', 'checkout', ?, ?, ?)
     ON CONFLICT(payment_reference) DO NOTHING`,
    [
      uuid(),
      args.studentId,
      args.email,
      args.fullName,
      String(args.course.id),
      String(args.course.title ?? args.course.name ?? ''),
      args.transactionReference,
      args.amount,
      Number(args.course.price ?? 0),
      Math.max(0, Number(args.course.price ?? 0) - args.amount),
      REF_PAYMENT_METHOD,
      REF_ENROLLMENT_SOURCE,
      REF_PROCESSED_BY,
      nowIso(),
    ],
  )
}

/** Cohort purchase (transactions `source:"cohort"`, per StudentDashboard joins). */
export async function createPendingCohortTransaction(args: {
  studentId: string | null
  email: string
  fullName: string
  cohort: Row
  amount: number
  transactionReference: string
}) {
  await run(
    `INSERT INTO transactions
       (id, student_id, student_email, student_name, cohort_id,
        payment_reference, amount, currency, original_price,
        payment_method, payment_status, source, enrollment_source,
        processed_by_name, transaction_date)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'ZMW', ?, ?, 'pending', 'cohort', ?, ?, ?)
     ON CONFLICT(payment_reference) DO NOTHING`,
    [
      uuid(),
      args.studentId,
      args.email,
      args.fullName,
      String(args.cohort.id),
      args.transactionReference,
      args.amount,
      Number(args.cohort.price ?? 0),
      REF_PAYMENT_METHOD,
      REF_ENROLLMENT_SOURCE,
      REF_PROCESSED_BY,
      nowIso(),
    ],
  )
}

/** Subscription purchase rows carry plan_id (Q3b, flagged in docs/parity). */
export async function createPendingSubscriptionTransaction(args: {
  studentId: string | null
  email: string
  fullName: string
  plan: Row
  amount: number
  transactionReference: string
}) {
  await run(
    `INSERT INTO transactions
       (id, student_id, student_email, student_name, plan_id,
        payment_reference, amount, currency, original_price,
        payment_method, payment_status, source, enrollment_source,
        processed_by_name, transaction_date)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'ZMW', ?, ?, 'pending', 'subscribe', ?, ?, ?)
     ON CONFLICT(payment_reference) DO NOTHING`,
    [
      uuid(),
      args.studentId,
      args.email,
      args.fullName,
      String(args.plan.id),
      args.transactionReference,
      args.amount,
      Number(args.plan.price_kes ?? 0),
      REF_PAYMENT_METHOD,
      REF_ENROLLMENT_SOURCE,
      REF_PROCESSED_BY,
      nowIso(),
    ],
  )
}

/** Mark the pending transaction paid/failed once verification completes. */
export async function setTransactionResult(reference: string, status: 'paid' | 'failed') {
  await run('UPDATE transactions SET payment_status = ? WHERE payment_reference = ?', [status, reference])
}

/**
 * Auto-enroll on payment success (the reference edge-function behavior the
 * client relies on: after Paystack callback, `enrollments` gains a
 * `{payment_status:"paid", enrollment_source:"checkout", amount_paid,
 * payment_method, transaction_id}` row bound to the transaction's reference).
 */
export async function autoEnrollOnPaymentSuccess(reference: string) {
  const tx = await one<Row>(
    'SELECT * FROM transactions WHERE payment_reference = ? ORDER BY transaction_date DESC LIMIT 1',
    [reference],
  )
  if (!tx) return { ok: false, reason: 'unknown_reference' as const }
  if (tx.payment_status !== 'paid') return { ok: false, reason: 'not_paid' as const }

  // Bind the buyer when the transaction had no account yet (student_id null:
  // resolve/create the students row by transaction email — reference creates the
  // student profile after signup; pending-payment flow binds at this point).
  let studentId = String(tx.student_id ?? '')
  if (!studentId) {
    const email = String(tx.student_email ?? '').toLowerCase()
    if (email) {
      let s = await one<Row>('SELECT * FROM students WHERE email = ? LIMIT 1', [email])
      if (!s) {
        const id = uuid()
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

  // Cohort purchase → cohort_enrollments (source:"cohort")
  if (tx.cohort_id) {
    const existing = await one(
      'SELECT id FROM cohort_enrollments WHERE student_id = ? AND cohort_id = ? LIMIT 1',
      [studentId, String(tx.cohort_id)],
    )
    if (existing) return { ok: true, enrollment: existing, alreadyEnrolled: true }
    const enrollmentId = uuid()
    await run(
      `INSERT INTO cohort_enrollments
         (id, cohort_id, student_id, status, payment_status, payment_method,
          amount_paid, enrollment_source, transaction_id, enrolled_at)
       VALUES (?, ?, ?, 'active', 'paid', ?, ?, ?, ?, ?)`,
      [
        enrollmentId,
        String(tx.cohort_id),
        studentId,
        String(tx.payment_method ?? REF_PAYMENT_METHOD),
        Number(tx.amount ?? 0),
        String(tx.enrollment_source ?? REF_ENROLLMENT_SOURCE),
        String(tx.payment_reference),
        nowIso(),
      ],
    )
    return { ok: true, enrollment: { id: enrollmentId } }
  }

  if (!tx.course_id) return { ok: false, reason: 'not_a_course_purchase' as const }

  const existing = await getEnrollment(studentId, String(tx.course_id))
  if (existing && existing.payment_status === 'paid') {
    return { ok: true, enrollment: existing, alreadyEnrolled: true }
  }
  if (existing) {
    await run(
      `UPDATE enrollments
         SET payment_status = 'paid', enrollment_source = ?, amount_paid = ?,
             payment_method = ?, transaction_id = ?, enrolled_at = ?
       WHERE id = ?`,
      [String(tx.enrollment_source ?? REF_ENROLLMENT_SOURCE), Number(tx.amount ?? 0),
        String(tx.payment_method ?? REF_PAYMENT_METHOD), String(tx.payment_reference),
        nowIso(), existing.id],
    )
    return { ok: true, enrollment: await getEnrollment(studentId, String(tx.course_id)) }
  }
  await run(
    `INSERT INTO enrollments
       (id, student_id, course_id, payment_status, enrollment_source, amount_paid,
        payment_method, transaction_id, enrolled_at)
     VALUES (?, ?, ?, 'paid', ?, ?, ?, ?, ?)`,
    [
      uuid(),
      studentId,
      String(tx.course_id),
      String(tx.enrollment_source ?? REF_ENROLLMENT_SOURCE),
      Number(tx.amount ?? 0),
      String(tx.payment_method ?? REF_PAYMENT_METHOD),
      String(tx.payment_reference),
      nowIso(),
    ],
  )
  return { ok: true, enrollment: await getEnrollment(studentId, String(tx.course_id)) }
}

/** CoursePlayer: update `enrollments.last_accessed` on every player load. */
export async function touchEnrollmentAccess(enrollmentId: string) {
  await run('UPDATE enrollments SET last_accessed = ? WHERE id = ?', [nowIso(), enrollmentId])
}

/** Ownership scan used by catalog badges (CourseCatalog `ge`). */
export async function getOwnedCourseIds(studentId: string): Promise<string[]> {
  const rows = await all('SELECT course_id FROM enrollments WHERE student_id = ? AND course_id IS NOT NULL', [studentId])
  return rows.map((r) => String(r.course_id))
}

/** Conveniences for route handlers. */
export async function resolveStudentFromUser(userId: string): Promise<Row | null> {
  return getStudentByUserId(userId)
}
