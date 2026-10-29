import Link from 'next/link'
import { COHORTS } from '@/lib/data'
import { Clock, Users, Calendar, Lock, ArrowRight, TrendingUp } from 'lucide-react'

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  upcoming: { label: 'Upcoming', color: '#B45309', bg: '#FDF4E3' },
  active: { label: 'Active', color: '#0F7A42', bg: '#E8F6EF' },
  completed: { label: 'Completed', color: '#6B7280', bg: '#F3F4F6' },
}

export default function AdminCohorts() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#111111]">Cohorts</h1>
          <p className="text-[#737373] text-sm">Manage live cohort programs and enrollment.</p>
        </div>
        <Link
          href="/cohorts"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1DB96B] text-[#111111] text-sm font-bold hover:bg-[#17A05D] transition-colors"
        >
          View Cohorts <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E5E5E5]">
                <th className="py-4 text-sm font-bold text-[#737373]">Cohort</th>
                <th className="py-4 text-sm font-bold text-[#737373]">Status</th>
                <th className="py-4 text-sm font-bold text-[#737373]">Dates</th>
                <th className="py-4 text-sm font-bold text-[#737373]">Price</th>
                <th className="py-4 text-sm font-bold text-[#737373]">Seats</th>
                <th className="py-4 text-sm font-bold text-[#737373]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {COHORTS.map((cohort) => {
                const status = STATUS_CONFIG[cohort.status] ?? STATUS_CONFIG.upcoming
                const seatsLeft = cohort.maxSeats - cohort.enrolled
                return (
                  <tr key={cohort.slug} className="border-b border-[#F3F4F6] hover:bg-[#FAFAFA] transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#EEF1EE] flex items-center justify-center text-center font-bold text-[#111111]">
                          {cohort.title.slice(0, 1)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#111111]">{cohort.title}</p>
                          <p className="text-xs text-[#737373]">{cohort.instructor}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: status.bg, color: status.color }}>
                        {status.label}
                      </span>
                    </td>
                    <td className="py-4 text-sm text-[#737373]">
                      {new Date(cohort.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} &mdash;{' '}
                      {new Date(cohort.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </td>
                    <td className="py-4 text-sm font-medium text-[#111111]">
                      ZMW {cohort.price.toLocaleString('en-ZM')}
                    </td>
                    <td className="py-4 text-sm text-[#737373]">
                      {cohort.enrolled} / {cohort.maxSeats}
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/cohorts/${cohort.slug}`}
                          className="text-xs font-medium text-[#1DB96B] hover:underline"
                        >
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
        <h2 className="text-lg font-bold text-[#111111] mb-6">Cohort Statistics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { label: 'Total Cohorts', value: COHORTS.length, icon: Calendar },
            { label: 'Active', value: COHORTS.filter(c => c.status === 'active').length, icon: TrendingUp },
            {
              label: 'Total Enrolled',
              value: COHORTS.reduce((sum, c) => sum + c.enrolled, 0),
              icon: Users,
            },
          ].map((stat) => (
            <div key={stat.label} className="p-5 rounded-xl bg-[#FAFAFA] border border-[#E5E5E5]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-[#111111]">{stat.value}</p>
                  <p className="text-xs text-[#737373]">{stat.label}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#1DB96B]/10 flex items-center justify-center">
                  <stat.icon className="w-4 h-4 text-[#1DB96B]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
