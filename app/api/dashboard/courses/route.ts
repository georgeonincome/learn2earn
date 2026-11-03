/**
 * Dashboard courses — reference "My courses" + "Browse courses" tabs.
 * Returns enrolled courses with progress/state chips, and the public catalog
 * for browsing (plan-gated pricing).
 */
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/server/auth'
import { getStudentByUserId } from '@/lib/server/students'
import { getEnrollmentsForStudent, getOwnedCourseIds } from '@/lib/server/enroll'
import { buildSummary } from '@/lib/server/subscription'
import { all, one } from '@/lib/server/sql'

export const runtime = 'nodejs'

type CourseRow = {
  id: string; slug: string; title: string; description?: string
  regular_price: number; sale_price?: number; status: string
  sort_order: number
}

export async function GET(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
  const student = await getStudentByUserId(user.id)
  if (!student) return NextResponse.json({ error: 'Student profile not found' }, { status: 404 })

  const { searchParams } = new URL(request.url)
  const tab = searchParams.get('tab') ?? 'mine'

  if (tab === 'browse') {
    const courses = await all<CourseRow>(
      `SELECT id, slug, title, description, regular_price, sale_price, status, sort_order
       FROM courses WHERE status = 'published' ORDER BY sort_order ASC, created_at DESC`)
    const owned = await getOwnedCourseIds(student.id)
    const summary = await buildSummary(student.id)
    return NextResponse.json({
      courses: courses.map(c => ({
        ...c,
        inPlan: summary.isActive,
        owned: owned.includes(c.id),
        price: c.sale_price ?? c.regular_price,
      })),
      planActive: summary.isActive,
      planName: summary.plan?.name ?? null,
    })
  }

  // mine: enrolled courses with progress + state
  const enrollments = await getEnrollmentsForStudent(student.id)
  const courseIds = enrollments.map(e => e.course_id)
  const courses: any[] = []
  for (const courseId of courseIds) {
    const c = await one<CourseRow>('SELECT * FROM courses WHERE id = ? LIMIT 1', [courseId])
    if (!c) continue
    const enrollment = enrollments.find(e => e.course_id === courseId)!
    courses.push({
      id: c.id, slug: c.slug, title: c.title, description: c.description,
      status: enrollment.payment_status,
      enrolledAt: enrollment.enrolled_at,
      progress: 0, // lesson_progress aggregation handled by client from its own API
      certificate: null,
    })
  }
  const summary = await buildSummary(student.id)
  const planEnded = summary.status === 'expired' || summary.status === 'cancelled'
  return NextResponse.json({
    courses,
    planActive: summary.isActive,
    planEnded,
    planName: summary.plan?.name ?? null,
    daysLeft: summary.daysRemaining ?? null,
  })
}
