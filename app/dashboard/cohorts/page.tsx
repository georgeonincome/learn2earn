import Link from 'next/link'
import { COHORTS } from '@/lib/data'
import DashboardLayout from '@/components/dashboard/DashboardLayout'

/**
 * My Cohorts Dashboard Page
 *
 * Route: /dashboard/cohorts
 *
 * Displays active, upcoming, and completed cohorts with enrollment status.
 */

export default function DashboardCohortsPage() {
  const upcomingCohorts = COHORTS.filter((c) => c.status === 'upcoming')
  const activeCohorts = COHORTS.filter((c) => c.status === 'active')
  const completedCohorts = COHORTS.filter((c) => c.status === 'completed')

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-extrabold mb-8">My Cohorts</h1>

      {/* Upcoming Cohorts */}
      {upcomingCohorts.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-extrabold mb-4">Upcoming Cohorts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingCohorts.map((c) => (
              <CohortCard key={c.slug} cohort={c} status="upcoming" />
            ))}
          </div>
        </section>
      )}

      {/* Active Cohorts */}
      {activeCohorts.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-extrabold mb-4">Active Cohorts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeCohorts.map((c) => (
              <CohortCard key={c.slug} cohort={c} status="active" />
            ))}
          </div>
        </section>
      )}

      {/* Completed Cohorts */}
      {completedCohorts.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-extrabold mb-4">Completed Cohorts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedCohorts.map((c) => (
              <CohortCard key={c.slug} cohort={c} status="completed" />
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {COHORTS.length === 0 && (
        <div className="text-center py-20">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E5E5E5] text-[#737373] mx-auto mb-4">
            <Clock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold">No Cohorts Yet</h2>
          <p className="text-[#737373] mt-2">
            Check back soon for upcoming cohort programs.
          </p>
        </div>
      )}
    </DashboardLayout>
  )
}

import { Clock } from 'lucide-react'

interface CohortCardProps {
  cohort: any
  status: 'upcoming' | 'active' | 'completed'
}

function CohortCard({ cohort, status }: CohortCardProps) {
  const statusConfig: Record<string, { label: string; color: string }> = {
    upcoming: { label: 'Upcoming', color: '#F59E0B' },
    active: { label: 'Active', color: '#1DB96B' },
    completed: { label: 'Completed', color: '#737373' },
  }
  const config = statusConfig[status]

  return (
    <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E5E5E5]/10 text-[#0B854C] text-xs font-bold">
          C
        </span>
        <span className="text-xs font-semibold text-[#737373]">
          {config.label}
        </span>
      </div>
      <h3 className="text-lg font-bold">{cohort.title}</h3>
      <p className="text-sm text-[#737373] mt-2">
        {cohort.description}
      </p>
      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2 text-xs text-[#737373]">
          <span className="flex h-2 w-2 items-center justify-center rounded-full bg-[#1DB96B] text-white text-[10px] font-bold">
            📅
          </span>
          <span>{cohort.startDate} - {cohort.endDate}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#737373]">
          <span className="flex h-2 w-2 items-center justify-center rounded-full bg-[#1DB96B] text-white text-[10px] font-bold">
            👥
          </span>
          <span>{cohort.enrolled} / {cohort.maxSeats} seats</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#737373]">
          <span className="flex h-2 w-2 items-center justify-center rounded-full bg-[#1DB96B] text-white text-[10px] font-bold">
            ⏰
          </span>
          <span>{cohort.schedule}</span>
        </div>
      </div>
      <div className="mt-4">
        <Link
          href={`/cohorts/${cohort.slug}`}
          className="w-full inline-flex items-center justify-center gap-2 rounded-lg px-6 py-2 text-sm font-semibold transition-colors" style={{ minHeight: 44, borderRadius: 8, background: '#1DB96B', color: '#fff', border: '1px solid #1DB96B', padding: '0 18px' }}
        >
          View Cohort
        </Link>
      </div>
    </div>
  )
}
