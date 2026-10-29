import Link from 'next/link'
import { notFound } from 'next/navigation'
import { COURSES, COURSE_LESSONS, SITE_CONFIG } from '@/lib/data'
import type { Lesson } from '@/lib/types'
import { ArrowLeft, Check, Play, Lock, ArrowRight, Star, ThumbsUp, MessageCircle } from 'lucide-react'

export function generateStaticParams() {
  return COURSES.flatMap((course) =>
    (COURSE_LESSONS[course.slug] || []).map((lesson) => ({
      slug: course.slug,
      lessonId: lesson.id,
    }))
  )
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; lessonId: string }> }) {
  const { slug, lessonId } = await params
  const course = COURSES.find((c) => c.slug === slug)
  const lesson = (COURSE_LESSONS[course.slug] || []).find((l) => l.id === lessonId)
  if (!course || !lesson) return { title: 'Lesson Not Found' }
  return {
    title: `${lesson.title} | ${course.title} | Learn2Earn`,
    description: lesson.description || course.description,
  }
}

export default async function CourseLessonPage({ params }: { params: Promise<{ slug: string; lessonId: string }> }) {
  const { slug, lessonId } = await params
  const course = COURSES.find((c) => c.slug === slug)
  const lesson = (COURSE_LESSONS[course.slug] || []).find((l) => l.id === lessonId)

  if (!course || !lesson) {
    notFound()
  }

  const allLessons = COURSE_LESSONS[course.slug] || []
  const currentIndex = allLessons.findIndex((l) => l.id === lessonId)
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null
  const isFirst = currentIndex === 0
  const isLast = currentIndex === allLessons.length - 1
  const progress = ((currentIndex + 1) / allLessons.length) * 100

  const isPreview = lesson.isFree || lesson.isPreview
  const isEnrolled = true // Simulated - in production check user enrollment

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#10201A]">
      {/* Header */}
      <header className="border-b border-[#E5E5E5] bg-white sticky top-0 z-40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link
            href={`/courses/${slug}`}
            className="flex items-center gap-2 text-[#1DB96B] font-semibold text-sm hover:text-[#17A05D] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to course
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/courses" className="text-xs font-medium text-[#737373] hover:text-[#111111]">Courses</Link>
            <span className="text-xs text-[#A3A3A3]">/</span>
            <span className="text-xs font-medium text-[#111111]">{course.title}</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Video Player */}
          <div className="lg:w-3/4">
            <div className="aspect-[16/9] bg-[#EEF1EE] rounded-2xl overflow-hidden relative">
              {isPreview || isEnrolled ? (
                <iframe
                  src={lesson.videoUrl}
                  title={lesson.title}
                  className="w-full h-full"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 bg-[#F3F4F6]">
                  <Lock className="w-12 h-12 text-[#A3A3A3] mb-4" />
                  <h3 className="text-lg font-bold text-[#111111] mb-2">Lock Lesson</h3>
                  <p className="text-sm text-[#737373] mb-6">
                    Enroll in this course to watch this lesson.
                  </p>
                  <Link
                    href="/checkout"
                    className="inline-flex h-11 items-center justify-center rounded-xl px-6 font-bold text-sm bg-[#1DB96B] text-[#111111] hover:bg-[#17A05D]"
                  >
                    Enroll Now
                  </Link>
                </div>
              )}
            </div>

            <div className="mt-6">
              <h1 className="text-2xl font-bold text-[#111111] mb-2">{lesson.title}</h1>
              <p className="text-sm text-[#737373] mb-4">{lesson.description}</p>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-xs text-[#737373]">
                  <span>{lesson.duration}</span>
                  <span>•</span>
                  <span>{currentIndex + 1} of {allLessons.length}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#737373]">
                  <Star className="w-3.5 h-3.5 text-[#A3A3A3]" />
                  <span>4.8</span>
                </div>
              </div>

              {/* Lesson Actions */}
              <div className="flex items-center gap-3 mb-6">
                <button
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#E5E5E5] text-sm font-medium text-[#111111] hover:bg-[#F3F4F6] transition-colors"
                >
                  <ThumbsUp className="w-4 h-4 text-[#A3A3A3]" />
                  <span>Helpful</span>
                </button>
                <button
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#E5E5E5] text-sm font-medium text-[#111111] hover:bg-[#F3F4F6] transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-[#A3A3A3]" />
                  <span>Discuss</span>
                </button>
                <button
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#E5E5E5] text-sm font-medium text-[#111111] hover:bg-[#F3F4F6] transition-colors"
                >
                  <span className="flex items-center gap-1">
                    <span>Mark Complete</span>
                    <Check className="w-3.5 h-3.5 text-[#1DB96B]" />
                  </span>
                </button>
              </div>

              {/* Lesson Content */}
              {lesson.content && (
                <div className="prose prose-lg text-[#737373] mb-6">
                  {lesson.content.split('\n\n').map((p, i) => (
                    <p key={i} className="mb-4">{p}</p>
                  ))}
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between pt-6 border-t border-[#E5E5E5]">
                {prevLesson && (
                  <Link
                    href={`/courses/${slug}/lessons/${prevLesson.id}`}
                    className="flex items-center gap-2 text-sm font-medium text-[#1DB96B] hover:text-[#17A05D] transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" /> {prevLesson.title}
                  </Link>
                )}
                {nextLesson && (
                  <Link
                    href={`/courses/${slug}/lessons/${nextLesson.id}`}
                    className="flex items-center gap-2 text-sm font-medium text-[#1DB96B] hover:text-[#17A05D] transition-colors"
                  >
                    {nextLesson.title} <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
                {!nextLesson && (
                  <span className="text-sm font-medium text-[#737373]">Last lesson</span>
                )}
              </div>

              {/* Progress */}
              <div className="mt-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-[#111111]">Progress</span>
                  <span className="text-[#737373]">{Math.round(progress)}%</span>
                </div>
                <div className="w-full h-2 bg-[#E5E5E5] rounded-full overflow-hidden">
                  <div className="h-full bg-[#1DB96B] rounded-full" style={{ width: `${progress}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Sidebar */}
          <div className="lg:w-1/4 space-y-6">
            {/* Course Info */}
            <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#EEF1EE] flex items-center justify-center">
                  <span className="text-sm font-bold">{course.title.slice(0, 1)}</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-[#111111]">{course.title}</p>
                  <p className="text-xs text-[#737373]">{course.category}</p>
                </div>
              </div>
              <p className="text-xs text-[#737373] mb-4">{course.excerpt || course.description.slice(0, 100)}...</p>
              <div className="flex items-center justify-between pt-4 border-t border-[#E5E5E5]">
                <span className="text-sm font-bold text-[#1DB96B]">
                  {course.price === 0 ? 'Free' : `ZMW ${course.price.toLocaleString('en-ZM')}`}
                </span>
                {course.originalPrice && course.originalPrice > course.price && (
                  <span className="text-xs text-[#737373] line-through">
                    ZMW {course.originalPrice.toLocaleString('en-ZM')}
                  </span>
                )}
              </div>
            </div>

            {/* All Lessons */}
            <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6">
              <h3 className="text-sm font-bold text-[#111111] mb-4">All Lessons</h3>
              <div className="space-y-2">
                {allLessons.map((l) => (
                  <Link
                    key={l.id}
                    href={`/courses/${slug}/lessons/${l.id}`}
                    className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      l.id === lessonId
                        ? 'bg-[#F3FBF6] text-[#1DB96B] font-medium border border-[#1DB96B]/30'
                        : 'text-[#737373] hover:bg-[#F3F4F6] hover:text-[#111111]'
                    }`}
                  >
                    <div className="flex-1">
                      <span className="text-[10px] font-bold text-[#A3A3A3] uppercase">{l.sortOrder}</span>
                      <p className="text-sm truncate">{l.title}</p>
                    </div>
                    {l.isFree || l.isPreview || isEnrolled ? (
                      <Play className="w-3 h-3 text-[#1DB96B]" />
                    ) : (
                      <Lock className="w-3 h-3 text-[#A3A3A3]" />
                    )}
                  </Link>
                ))}
              </div>
            </div>

            {/* Instructor Info */}
            <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#E5E5E5] flex items-center justify-center">
                  <span className="text-sm font-bold text-[#111111]">G</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-[#111111]">George J Kasonso</p>
                  <p className="text-xs text-[#737373]">Founder & Instructor</p>
                </div>
              </div>
              <p className="text-xs text-[#737373] mb-4">
                Zambian digital educator teaching practical skills with real-world examples.
              </p>
              <div className="flex gap-2">
                <a
                  href={`https://wa.me/${SITE_CONFIG.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-bold bg-[#1DB96B] text-[#111111]"
                >
                  <MessageCircle className="w-3 h-3" /> WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}