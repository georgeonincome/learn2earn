'use client'

import { useEffect, useRef, useState } from 'react'
import { BookOpen, FileCheck, Sparkles, Award } from 'lucide-react'
import { toZMW } from '@/lib/data'

const features = [
  {
    icon: BookOpen,
    title: 'All published courses',
    description: 'Access every course across every category from day one',
  },
  {
    icon: FileCheck,
    title: 'Templates & resources',
    description: 'Downloadable checklists, templates and class resources',
  },
  {
    icon: Award,
    title: 'Completion certificates',
    description: 'Verified certificates for every eligible course you finish',
  },
  {
    icon: Sparkles,
    title: 'New courses at no extra cost',
    description: 'New courses added while your access stays active',
  },
]

export function FeaturesSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="section-padding py-16 md:py-24">
      <div className="container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 lg:gap-20 items-center">
          {/* Stats */}
          <div>
            <div className="flex items-baseline gap-6 mb-8">
              <div>
                <span className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-primary">
                  12
                </span>
                <p className="text-sm text-muted-foreground mt-2">Published courses</p>
              </div>
              <div className="w-px h-16 bg-border" />
              <div>
                <span className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-primary">
                  2
                </span>
                <p className="text-sm text-muted-foreground mt-2">Access plans</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 mb-12">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-success rounded-full" />
                <span className="text-sm text-muted-foreground">Self-paced</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-primary rounded-full" />
                <span className="text-sm text-muted-foreground">Learn on your schedule</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-accent rounded-full" />
                <span className="text-sm text-muted-foreground">Direct support from George</span>
              </div>
            </div>

            <p className="heading-accent">What you get</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-secondary mb-6">
              Everything opens the day you join.
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Not one course. Not a sample. Every published course unlocks when your payment clears, including new lessons added while your access is active.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={
                  `bg-white rounded-2xl border border-border p-5 md:p-6 hover:shadow-card transition-all duration-300` +
                  (isVisible ? ' animate-slide-up' : '')
                }
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-base font-bold text-secondary mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
