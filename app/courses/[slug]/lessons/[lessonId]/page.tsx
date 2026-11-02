import { notFound } from 'next/navigation'
import { COURSES } from '@/lib/data'
import { COURSE_LESSONS } from '@/lib/lessons-data'
import CoursePlayer from '@/components/course-player/CoursePlayer'

/**
 * Course Lesson Route — mirrors reference CourseLessonRoute-DhTiTmen.js
 *
 * Route: /courses/[slug]/lessons/[lessonId]
 *
 * Behavior:
 * 1. Fetch course by slug, verify published
 * 2. Fetch lesson by ID + courseId, verify is_preview or user has access
 * 3. If loading → show loading state
 * 4. If not accessible → show access required message
 * 5. If accessible → render CoursePlayer with lesson data
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; lessonId: string }>
}) {
  const { slug, lessonId } = await params
  const course = COURSES.find((c) => c.slug === slug)
  const lessons = COURSE_LESSONS[course?.slug ?? '']
  const lesson = lessons?.find((l) => l.id === lessonId)

  return {
    title: lesson ? `${lesson.title} | ${course?.title}` : 'Lesson Not Found',
    description: lesson?.description || course?.description,
  }
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string; lessonId: string }>
}) {
  const { slug, lessonId } = await params
  const course = COURSES.find((c) => c.slug === slug)

  if (!course) {
    notFound()
  }

  const lessons = COURSE_LESSONS[course.slug]
  const lesson = lessons?.find((l) => l.id === lessonId)

  if (!lesson) {
    notFound()
  }

  // Check if lesson is preview (accessible without enrollment)
  const isPreview = lesson.isPreview ?? false

  // In production, this would check user enrollment/membership
  const hasAccess = isPreview

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111111]">
      <CoursePlayer
        course={course}
        lesson={lesson}
        isPreview={isPreview}
        hasAccess={hasAccess}
      />
    </div>
  )
}
