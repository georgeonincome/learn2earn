// Unified dashboard stats endpoint.
// Returns the exact data StudentDashboard-Dh-ypbFE.js queries separately.
import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/server/auth'
import { getStudentByUserId } from '@/lib/server/students'
import { getEnrollmentsForStudent } from '@/lib/server/enroll'
import { getAllLessonProgressForStudent } from '@/lib/server/lesson-progress'
import { getStudentStreak, getStudentPoints } from '@/lib/server/gamification'
import type { Row } from '@/lib/server/sql'

export const runtime = 'nodejs'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
  const student = await getStudentByUserId(user.id)
  if (!student) return NextResponse.json({ error: 'Student profile not found' }, { status: 404 })
  const studentId = student.id

  const [enrollments, lessonProgress, streak, points] = await Promise.all([
    getEnrollmentsForStudent(studentId),
    getAllLessonProgressForStudent(studentId),
    getStudentStreak(studentId),
    getStudentPoints(studentId),
  ])

  const completedLessons = lessonProgress.filter((lp) => lp.completed === 1).length
  const totalLessons = lessonProgress.length
  const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

  return NextResponse.json({
    student: { id: studentId, name: (student as unknown as Row).full_name ?? user.email.split('@')[0], email: user.email },
    stats: {
      coursesEnrolled: enrollments.length,
      lessonsCompleted: completedLessons,
      lessonsTotal: totalLessons,
      progressPercent,
      currentStreak: Number((streak as unknown as Row).current_streak ?? 0),
      longestStreak: Number((streak as unknown as Row).longest_streak ?? 0),
      totalPoints: Number((points as unknown as Row).total_points ?? 0),
      level: Number((points as unknown as Row).level ?? 1),
    },
    enrollments: enrollments.map((e) => ({
      id: e.id,
      courseId: e.course_id,
      paymentStatus: e.payment_status,
      enrolledAt: e.enrolled_at,
    })),
  })
}
