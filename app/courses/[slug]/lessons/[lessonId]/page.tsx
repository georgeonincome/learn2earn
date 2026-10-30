'use client'
import Link from 'next/link'
import { COURSES, SITE_CONFIG } from '@/lib/data'
import { COURSE_LESSONS } from '@/lib/lessons-data'
import { ArrowRight, Check, Play, Lock, Star } from 'lucide-react'

export default async function CourseLessonPage({ params }: { params: Promise<{ slug: string; lessonId: string }> }) {
  const { slug, lessonId } = await params
  const course = COURSES.find((c) => c.slug === slug)
if (!course) return null
  const lesson = COURSE_LESSONS[course!.slug]?.find((l) => l.id === lessonId)

  if (!course || !lesson) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] text-[#10201A] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#111111] mb-2">Lesson Not Found</h1>
          <Link href="/courses" className="text-[#1DB96B] font-medium hover:text-[#17A05D]">
            Browse Courses <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    )
  }

  const allLessons = COURSE_LESSONS[course.slug] || []
  const currentIndex = allLessons.findIndex((l) => l.id === lessonId)
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#10201A]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link href={`/courses/${slug}`} className="text-[#1DB96B] font-medium hover:text-[#17A05D] flex items-center gap-2">
            <ArrowRight className="w-4 h-4" /> Back to {course.title}
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#1DB96B]">{course.category}</span>
            <span className="text-xs text-[#737373]">Lesson {currentIndex + 1} of {allLessons.length}</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-3/4">
            <div className="aspect-[16/9] rounded-2xl border border-[#E5E5E5] bg-[#EEF1EE] overflow-hidden relative">
              {lesson.videoUrl ? (
                <iframe src={lesson.videoUrl} title={lesson.title} className="w-full h-full object-cover" allowFullScreen />
              ) : (
                <div className="w-full h-[400px] bg-[#EEF1EE] flex items-center justify-center text-center">
                  <div className="text-center">
                    <div className="w-12 h-16 rounded-full bg-[#1DB96B] flex items-center justify-center mx-auto mb-3">
                      <Play className="w-6 h-6 text-[#111111]" />
                    </div>
                    <p className="text-sm text-[#737373] mt-2">Video not available</p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex-1 px-8">
              <h1 className="text-3xl font-bold text-[#111111] mb-4">{lesson.title}</h1>
              <p className="text-sm text-[#737373] leading-relaxed">{lesson.description}</p>
              <div className="flex items-center justify-between pt-6 border-t border-[#E5E5E5]">
                <div className="flex items-center gap-2 text-sm text-[#737373]">
                  <span className="font-bold text-[#111111]">Duration</span>
                  <span>{lesson.duration}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-[#111111]">
                  <span className="text-[#737373]">Status</span>
                  <span className="text-[#1DB96B] font-medium">{lesson.status}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/4 space-y-6">
            <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6">
              <h3 className="text-sm font-bold text-[#111111] mb-4">Course Outline</h3>
              <div className="space-y-3">
                {allLessons.map((l) => (
                  <Link
                    key={l.id}
                    href={`/courses/${slug}/lessons/${l.id}`}
                    className={`flex items-center justify-between p-3 rounded-lg transition-colors ${l.id === lessonId ? 'bg-[#E3F6EF] text-[#1DB96B] font-bold border border-[#1DB96B]' : 'text-[#737373] hover:bg-[#F3F4F6] hover:text-[#111111]'}`}
                  >
                    <span>{l.title}</span>
                    <span className="text-xs text-[#A3A3A3]">{l.duration}</span>
                  </Link>
                ))}
              </div>
            </div>
            <div className="bg-[#F3F4F6] rounded-xl p-6">
              <h3 className="text-sm font-bold text-[#111111] mb-4">Lesson Info</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm text-[#111111]">
                  <span className="text-[#737373]">Duration</span>
                  <span>{lesson.duration}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-[#111111]">
                  <span className="text-[#737373]">Type</span>
                  <span className="text-[#1DB96B] font-medium">{lesson.isFree ? 'Free Preview' : 'Enroll to Access'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}