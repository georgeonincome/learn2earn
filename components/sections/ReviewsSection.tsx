'use client'

import { Star, Quote } from 'lucide-react'
import { REVIEWS } from '@/lib/data'

export function ReviewsSection() {
  return (
    <section className="section-padding py-16 md:py-24 bg-secondary/20">
      <div className="container-wide">
        <div className="text-center mb-12">
          <p className="heading-accent">Learner reviews</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-secondary">
            What learners say after taking the classes.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 max-w-6xl mx-auto">
          {REVIEWS.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-2xl border border-border p-5 md:p-6 hover:shadow-card transition-all duration-300"
            >
              <Quote className="w-8 h-8 text-primary/20 mb-4" />
              <p className="text-sm text-secondary leading-relaxed mb-4">
                "{review.content}"
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-secondary">{review.name}</p>
                  <p className="text-xs text-muted-foreground">{review.cohort}</p>
                </div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href="/reviews"
            className="text-sm font-semibold text-accent hover:text-primary transition-colors"
          >
            Read all learner reviews
          </a>
        </div>
      </div>
    </section>
  )
}
