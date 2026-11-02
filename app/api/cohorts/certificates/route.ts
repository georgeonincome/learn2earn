// List student's cohort certificates.
import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/server/auth'
import { getStudentByUserId } from '@/lib/server/students'
import { all } from '@/lib/server/sql'

export const runtime = 'nodejs'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
  const student = await getStudentByUserId(user.id)
  if (!student) return NextResponse.json({ error: 'Student profile not found' }, { status: 404 })

  const rows = await all(
    `SELECT c.*, co.title AS cohort_title, co.start_date AS cohort_start_date,
            co.end_date AS cohort_end_date
       FROM cohort_certificates c
       JOIN cohorts co ON co.id = c.cohort_id
      WHERE c.student_id = ?
      ORDER BY c.created_at DESC`,
    [student.id],
  )

  return NextResponse.json({
    certificates: rows.map((r) => ({
      id: String(r.id),
      certificateId: String(r.certificate_id),
      studentName: String(r.student_name),
      cohortTitle: String(r.cohort_title),
      cohortStartDate: String(r.cohort_start_date ?? ''),
      cohortEndDate: String(r.cohort_end_date ?? ''),
      issueDate: String(r.issue_date ?? ''),
      isVerified: Boolean(r.is_verified),
    })),
  })
}
