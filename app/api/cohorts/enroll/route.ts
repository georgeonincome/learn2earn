// Enroll in a cohort — creates cohort_enrollments row (free or paid).
// Body: { cohortId, paymentReference?, amount?, paymentMethod? }
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/server/auth'
import { getStudentByUserId } from '@/lib/server/students'
import { one, run } from '@/lib/server/sql'
import { uuid } from '@/lib/server/ids'
import { sendNotificationEmail } from '@/lib/server/notifications'
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

  // Check already enrolled
  const existing = await one(
    'SELECT id FROM cohort_enrollments WHERE cohort_id = ? AND student_id = ? LIMIT 1',
    [cohortId, studentId],
  )
  if (existing) {
    return NextResponse.json({ error: 'Already enrolled', enrollmentId: String(existing.id) }, { status: 409 })
  }

  const cohort = await one<Row>('SELECT * FROM cohorts WHERE (id = ? OR slug = ?) AND deleted_at IS NULL LIMIT 1', [cohortId, cohortId])
  if (!cohort) return NextResponse.json({ error: 'Cohort not found' }, { status: 404 })

  const enrollmentId = uuid()
  const amount = Number(body.amount ?? cohort.price ?? 0)
  const paymentMethod = body.paymentMethod ?? 'flutterwave'
  const paymentStatus = body.paymentReference ? 'paid' : 'pending'

  await run(
    `INSERT INTO cohort_enrollments
       (id, cohort_id, student_id, status, payment_status, payment_method,
        amount_paid, enrollment_source, transaction_id, enrolled_at, created_at)
     VALUES (?, ?, ?, 'active', ?, ?, ?, ?, ?, unixepoch(), unixepoch())`,
    [
      enrollmentId,
      cohortId,
      studentId,
      paymentStatus,
      paymentMethod,
      amount,
      body.enrollmentSource ?? 'checkout',
      body.paymentReference ?? null,
    ],
  )

  // Notification
  await sendNotificationEmail({
    type: 'cohort_enrollment',
    user: { id: studentId, email: user.email, name: (student.full_name as string) ?? undefined },
    cohort: {
      id: cohortId,
      title: String(cohort.title ?? ''),
      start_date: (cohort.start_date as string) ?? undefined,
      end_date: (cohort.end_date as string) ?? undefined,
      total_days: (cohort.total_days as number) ?? undefined,
    },
  })

  return NextResponse.json({
    ok: true,
    enrollmentId,
    status: paymentStatus,
    amount,
    currency: 'ZMW',
  })
}
