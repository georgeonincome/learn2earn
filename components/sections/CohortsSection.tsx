'use client'

import Link from 'next/link'
import { ArrowRight, Calendar, Users, Video } from 'lucide-react'
import { COHORTS } from '@/lib/data'
import { formatPrice } from '@/lib/utils'

export function CohortsSection() {
  const activeCohort = COHORTS.find(c => c.status === 'active')

  if (!activeCohort) {
    const upcomingCohort = COHORTS.find(c => c.status === 'upcoming')
    if (!upcomingCohort) return null

    return (
      <section className="section-padding py-16 md:py-24">
        <div className="container-wide">
          <UpcomingCohort cohort={upcomingCohort} />
        </div>
      </section>
    )
  }

  return (
    <section className="section-padding py-16 md:py-24">
      <div className="container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Image */}
          <div className="relative rounded-2xl overflow-hidden shadow-elevated aspect-[4/3]">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/30 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto bg-white rounded-2xl shadow-card flex items-center justify-center mb-3">
                  <Video className="w-10 h-10 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">Live class session</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <p className="heading-accent">Live learning</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-secondary mb-4">
              You are not learning alone.
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Recorded lessons carry the teaching. Live cohorts give you a place to ask questions and watch real work being done.
            </p>

            {/* Active Cohort Card */}
            <div className="bg-white rounded-2xl border border-border p-5 md:p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-success bg-success/10 px-3 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
                  Active
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(activeCohort.startDate).toLocaleDateString('en-ZM', { month: 'short', year: 'numeric' })}
                </span>
              </div>
              <h3 className="text-lg font-bold text-secondary mb-2">
                {activeCohort.title}
              </h3>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {activeCohort.schedule}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {activeCohort.maxSeats - activeCohort.enrolled} slots left
                </span>
              </div>
              <Link href={`/cohorts/${activeCohort.slug}`} className="btn-primary w-full text-center">
                See live cohorts
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function UpcomingCohort({ cohort }: { cohort: typeof COHORTS[0] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
      <div>
        <p className="heading-accent">Live learning</p>
        <h2 className="text-3xl md:text-4xl font-extrabold text-secondary mb-4">
          You are not learning alone.
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-6">
          Recorded lessons carry the teaching. Live cohorts give you a place to ask questions and watch real work being done.
        </p>
        
        <div className="bg-white rounded-2xl border border-border p-5 md:p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
              Coming soon
            </span>
          </div>
          <h3 className="text-lg font-bold text-secondary mb-2">{cohort.title}</h3>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {cohort.schedule}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {cohort.maxSeats} seats
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-primary">{formatPrice(cohort.price)}</span>
            <Link href={`/cohorts/${cohort.slug}`} className="link-primary flex items-center gap-1">
              Reserve seat <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
      
      <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-elevated bg-secondary/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center mb-3">
            <Calendar className="w-10 h-10 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">Upcoming live class</p>
        </div>
      </div>
    </div>
  )
}
