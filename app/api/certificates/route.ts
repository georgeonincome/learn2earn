// List user's certificates — DB-backed replacement for mock data in dashboard.
import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/server/auth'
import { getStudentByUserId } from '@/lib/server/students'
import { getStudentCertificates } from '@/lib/server/certificates'

export const runtime = 'nodejs'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
  const student = await getStudentByUserId(user.id)
  if (!student) return NextResponse.json({ error: 'Student profile not found' }, { status: 404 })
  const certs = await getStudentCertificates(student.id)
  return NextResponse.json({
    certificates: certs.map((c) => ({
      id: c.id,
      certificateId: c.certificate_id,
      studentName: c.student_name,
      courseTitle: c.title,
      courseSlug: c.slug,
      issueDate: c.issue_date,
      isVerified: Boolean(c.is_verified),
      kind: c.kind,
    })),
  })
}
