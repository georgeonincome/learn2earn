'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Clock, BarChart3 } from 'lucide-react'
import { COURSES } from '@/lib/data'
import { formatPrice } from '@/lib/utils'

export function CoursesPreviewSection() {
  const featuredCourses = COURSES.filter(c => c.featured).slice(0, 6)

  return (
    <section className="section-padding py-16 md:py-24 bg-secondary/20">
      <div className="container-wide">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
          <div>
            <p className="heading-accent">The catalogue</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-secondary">
              Skills people are actually paying for.
            </h2>
          </div>
          <Link href="/courses" className="flex items-center gap-1 text-sm font-semibold text-accent hover:text-primary transition-colors group">
            Browse all {COURSES.length} courses
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {featuredCourses.map((course, index) => (
            <Link
              key={course.id}
              href={`/courses/${course.slug}`}
              className="group bg-white rounded-2xl border border-border overflow-hidden hover:shadow-card transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative aspect-[3/2] bg-secondary/30 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center">
                  <span className="text-6xl font-bold text-primary/10">{String(index + 1).padStart(2, '0')}</span>
                </div>
                {course.originalPrice && (
                  <div className="absolute top-3 right-3 bg-danger/90 text-white text-xs font-bold px-2 py-1 rounded-lg">
                    Save {Math.round((1 - course.price / course.originalPrice) * 100)}%
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <span className="inline-block w-1.5 h-1.5 bg-success rounded-full" />
                  {course.category}
                </div>
                <h3 className="text-base font-bold text-secondary mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-xs text-muted-foreground mb-4 line-clamp-2">
                  {course.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    {course.duration}
                  </div>
                  <span className="text-sm font-bold text-primary">
                    {formatPrice(course.price)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
