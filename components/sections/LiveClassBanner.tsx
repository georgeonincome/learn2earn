import Link from 'next/link'
import { Sparkles, ArrowRight } from 'lucide-react'
import { COHORTS } from '@/lib/data'

export function LiveClassBanner() {
  const upcomingCohort = COHORTS.find(c => c.status === 'upcoming')
  
  if (!upcomingCohort) return null

  return (
    <section className="section-padding py-8 md:py-12">
      <div className="container-wide">
        <div className="bg-gradient-to-r from-secondary/50 to-primary/5 rounded-2xl border border-border p-5 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-xs font-bold text-accent uppercase tracking-wider mb-1">Live class · starts {new Date(upcomingCohort.startDate).toLocaleDateString('en-ZM', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
              <h3 className="text-lg md:text-xl font-bold text-secondary mb-1">
                {upcomingCohort.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {upcomingCohort.description.slice(0, 80)}...
              </p>
            </div>
          </div>
          <Link 
            href={`/cohorts/${upcomingCohort.slug}`} 
            className="btn-primary whitespace-nowrap shrink-0"
          >
            Reserve my seat
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  )
}
