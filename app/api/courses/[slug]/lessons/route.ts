// Return all published lessons + sections for a course slug.
// Used by CoursePlayer for its lesson list / sidebar.  Signed-in caller
// also gets progress per lesson.
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getCourseBySlug } from '@/lib/server/courses'
import { getLessonsForCourseGrouped } from '@/lib/server/courses'
import { getCurrentUser } from '@/lib/server/auth'
import { getStudentByUserId } from '@/lib/server/students'
import { getAllLessonProgressForStudent } from '@/lib/server/lesson-progress'

export const runtime = 'nodejs'

export async function GET(request: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params
  const course = await getCourseBySlug(slug)
  if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 })

  const grouped = await getLessonsForCourseGrouped(String(course.id))
  const user = await getCurrentUser()
  let progressMap: Record<string, { completed: boolean; last_position_seconds: number | null }> = {}
  if (user) {
    const student = await getStudentByUserId(user.id)
    if (student) {
      const prog = await getAllLessonProgressForStudent(student.id)
      for (const p of prog) {
        if (p.lesson_id) {
          progressMap[String(p.lesson_id)] = {
            completed: Boolean(p.completed),
            last_position_seconds: p.last_position_seconds != null ? Number(p.last_position_seconds) : null,
          }
        }
      }
    }
  }

  const payload = grouped.map((g) => ({
    section: g.section
      ? { id: String(g.section.id), title: String(g.section.title), description: (g.section.description as string) ?? null }
      : null,
    lessons: g.lessons.map((l) => ({
      id: String(l.id),
      title: String(l.title),
      lesson_order: Number(l.lesson_order ?? 0),
      duration_minutes: Number(l.duration_minutes ?? 0),
      is_preview: Boolean(l.is_preview),
      video_url: String(l.video_url ?? ''),
      video_provider: String(l.video_provider ?? 'external'),
      description: String(l.description ?? ''),
      content: String(l.content ?? ''),
      progress: progressMap[String(l.id)] ?? null,
    })),
  }))

  return NextResponse.json({
    course: { id: String(course.id), slug: String(course.slug), title: String(course.title) },
    sections: payload,
    total_lessons: grouped.reduce((acc, g) => acc + g.lessons.length, 0),
  })
}
