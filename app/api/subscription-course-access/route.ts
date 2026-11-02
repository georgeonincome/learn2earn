// `subscription-course-access` — reference edge function contract
// (CourseDetail/CoursePlayer/SocialMediaManagementCourseKenya etc.):
// invoke("subscription-course-access", { body: { courseId, open } }) →
//   { access: { [courseId]: { state: "included" | "owned" | "locked" } } }
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/server/auth'
import { getStudentByUserId } from '@/lib/server/students'
import { courseAccess } from '@/lib/server/subscription'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}))
  const user = await getCurrentUser()
  let student = null
  if (user) student = await getStudentByUserId(user.id)
  const summary = await courseAccess(student ? student.id : '', body.courseId ? ([] as string[]).concat(body.courseId) : [])
  return NextResponse.json({ access: summary.access })
}
