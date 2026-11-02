import { notFound } from 'next/navigation'
import { getCourseBySlug, getLessonById, getLessonsForCourse } from '@/lib/server/courses'
import CoursePlayer from '@/components/course-player/CoursePlayer'

export async function generateMetadata({ params }: { params: Promise<{ slug: string; lessonId: string }> }) {
  const { slug, lessonId } = await params
  const [course, lesson] = await Promise.all([
    getCourseBySlug(slug),
    getLessonById(lessonId),
  ])
  if (!course || !lesson) return { title: 'Lesson Not Found' }
  return {
    title: `${String(lesson.title)} | ${String(course.title)}`,
    description: String(lesson.description ?? course.description ?? ''),
  }
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string; lessonId: string }> }) {
  const { slug, lessonId } = await params
  const [course, lesson] = await Promise.all([
    getCourseBySlug(slug),
    getLessonById(lessonId),
  ])
  if (!course) notFound()
  if (!lesson) notFound()

  const allLessons = await getLessonsForCourse(String(course.id))
  const isPreview = Boolean(lesson.is_preview)

  // Access is determined client-side via subscription-course-access hook to avoid
  // heavy server session lookup on every lesson request.
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111111]">
      <CoursePlayer
        course={course}
        lesson={lesson}
        allLessons={allLessons}
        isPreview={isPreview}
      />
    </div>
  )
}
