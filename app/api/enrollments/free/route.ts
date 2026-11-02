// Free enrollment — the reference's direct enroll insert (CourseDetail/CourseCatalog):
//   enrollments.insert({student_id, course_id, payment_status:"free",
//                       enrollment_source:"free", amount_paid:0})
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/server/auth'
import { getStudentByUserId } from '@/lib/server/students'
import { enrollFree } from '@/lib/server/enroll'
import type { Row } from '@/lib/server/sql'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}))
  const courseId = String(body.courseId ?? '')
  if (!courseId) return NextResponse.json({ error: 'courseId is required' }, { status: 400 })

  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Not signed in (session)' }, { status: 401 })
  const student = await getStudentByUserId(user.id)
  if (!student) return NextResponse.json({ error: 'Failed to create student profile' }, { status: 500 })

  const enrollment = await enrollFree(student as unknown as Row, { id: courseId, title: body.courseTitle ?? null } as unknown as Row)
  if (!enrollment) return NextResponse.json({ error: 'Could not enroll. Please try again.' }, { status: 500 })
  return NextResponse.json({ enrollment })
}
