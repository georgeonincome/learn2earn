'use client'

import Link from 'next/link'
import { BookOpen, Check, Award, Flame, Play, Clock, Settings, BarChart3 } from 'lucide-react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { useSubscription } from '@/lib/subscription/useSubscription'
import { useStudentPreferences } from '@/lib/subscription/studentPreferences'
import { useEffect, useState } from 'react'

interface DashboardStats {
  student: { id: string; name: string; email: string }
  stats: {
    coursesEnrolled: number
    lessonsCompleted: number
    lessonsTotal: number
    progressPercent: number
    currentStreak: number
    longestStreak: number
    totalPoints: number
    level: number
  }
  enrollments: { id: string; courseId: string | null; paymentStatus: string | null; enrolledAt: string | null }[]
}

export default function DashboardPage() {
  const { plan, status, isActive, daysRemaining, loading: subLoading } = useSubscription()
  const { prefs } = useStudentPreferences()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then((r) => { if (r.ok) return r.json(); return null })
      .then((data) => { setStats(data); setStatsLoading(false) })
      .catch((err) => { console.error('[Dashboard] stats error', err); setStatsLoading(false) })
  }, [])

  const name = stats?.student?.name ?? 'Student'
  const isMember = isActive

  return (
    <DashboardLayout>
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold">Dashboard</h1>
            <p className="text-[#737373] text-sm mt-1">
              Welcome back, <span className="font-semibold text-[#111111]">{name}</span>!
              {isMember && plan && (
                <span className="ml-2 inline-flex items-center gap-1 text-xs font-medium text-[#0B854C] bg-[#F3FBF6] px-2 py-0.5 rounded-full">
                  <Award className="w-3 h-3" /> {plan.name} member
                </span>
              )}
            </p>
          </div>
          {stats && (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-bold text-[#0B854C]">Level {stats.stats.level}</div>
                <div className="text-xs text-[#737373]">{stats.stats.totalPoints} XP</div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8F6EF] text-[#0B854C] font-bold text-sm">
                {name.charAt(0).toUpperCase()}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Courses Enrolled"
          value={stats?.stats.coursesEnrolled ?? 0}
          icon={<BookOpen className="w-4 h-4" />}
          color="#1DB96B"
        />
        <StatCard
          title="Lessons Completed"
          value={stats?.stats.lessonsCompleted ?? 0}
          icon={<Check className="w-4 h-4" />}
          color="#1DB96B"
        />
        <StatCard
          title="Certificates"
          value={0}
          icon={<Award className="w-4 h-4" />}
          color="#F59E0B"
        />
        <StatCard
          title="Current Streak"
          value={stats?.stats.currentStreak ?? 0}
          icon={<Flame className="w-4 h-4" />}
          color="#F59E0B"
          subtitle={`Best: ${stats?.stats.longestStreak ?? 0} days`}
        />
      </div>

      {/* Progress Section */}
      <section className="mb-8">
        <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-extrabold">Course Progress</h2>
            <span className="text-sm font-semibold text-[#0B854C]">
              {stats?.stats.progressPercent ?? 0}%
            </span>
          </div>
          <div className="w-full bg-[#E5E5E5] rounded-full h-4">
            <div
              className="h-full bg-[#1DB96B] rounded-full transition-all duration-500"
              style={{ width: `${stats?.stats.progressPercent ?? 0}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-[#737373] mt-2">
            <span>{stats?.stats.lessonsCompleted ?? 0} of {stats?.stats.lessonsTotal ?? 0} lessons completed</span>
            <span>{stats?.stats.progressPercent ?? 0}% complete</span>
          </div>
        </div>
      </section>

      {/* Enrolled Courses */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-extrabold">My Courses</h2>
          <Link href="/courses" className="text-sm font-semibold text-[#0B854C] hover:underline">
            Browse courses
          </Link>
        </div>
        {statsLoading ? (
          <div className="text-center py-8 text-[#737373] text-sm">Loading your courses…</div>
        ) : stats && stats.enrollments.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.enrollments.map((e) => (
              <div key={e.id} className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-5 hover:border-[#1DB96B] transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1DB96B]/10 text-[#0B854C] text-xs font-bold">C</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    e.paymentStatus === 'free' ? 'bg-[#F3FBF6] text-[#0B854C]' :
                    e.paymentStatus === 'paid' ? 'bg-[#E8F6EF] text-[#0B854C]' :
                    'bg-[#F5F5F5] text-[#737373]'
                  }`}>
                    {e.paymentStatus === 'free' ? 'Free' : e.paymentStatus === 'paid' ? 'Purchased' : e.paymentStatus}
                  </span>
                </div>
                <h3 className="font-bold text-sm truncate">Course enrollment</h3>
                <p className="text-xs text-[#737373] mt-1">
                  Enrolled {e.enrolledAt ? new Date(e.enrolledAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'recently'}
                </p>
                <Link
                  href={`/courses/${e.courseId ?? ''}`}
                  className="mt-3 inline-block text-xs font-semibold text-[#0B854C] hover:underline"
                >
                  Go to course →
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 rounded-xl border border-[#E5E5E5] bg-[#FFFFFF]">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-[#737373]" />
            <h3 className="font-bold">No enrolled courses yet</h3>
            <p className="text-sm text-[#737373] mt-1">Start your learning journey by enrolling in a course.</p>
            <Link href="/courses" className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg px-6 py-2 text-sm font-semibold transition-colors" style={{ background: '#1DB96B', color: '#fff', borderRadius: 8, minHeight: 44, padding: '0 18px' }}>
              Browse Courses
            </Link>
          </div>
        )}
      </section>

      {/* Quick Actions */}
      <section className="mb-8">
        <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-6">
          <h2 className="text-xl font-extrabold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <QuickActionCard
              title="Start Learning"
              description="Continue your courses where you left off"
              icon={<Play className="w-4 h-4" />}
              href="/courses"
              color="#1DB96B"
            />
            <QuickActionCard
              title="View Certificates"
              description="Download your completion certificates"
              icon={<Award className="w-4 h-4" />}
              href="/dashboard/certificates"
              color="#F59E0B"
            />
            <QuickActionCard
              title="Join a Cohort"
              description="Live group-based programs with deadlines"
              icon={<Clock className="w-4 h-4" />}
              href="/cohorts"
              color="#F59E0B"
            />
            <QuickActionCard
              title="Update Profile"
              description="Manage your account settings"
              icon={<Settings className="w-4 h-4" />}
              href="/dashboard/settings"
              color="#737373"
            />
          </div>
        </div>
      </section>
    </DashboardLayout>
  )
}

function StatCard({
  title,
  value,
  icon,
  color,
  subtitle,
}: {
  title: string
  value: number | string
  icon: React.ReactNode
  color: string
  subtitle?: string
}) {
  return (
    <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: color + '15', color }}>
          {icon}
        </div>
        <span className="text-xs font-semibold text-[#737373]">{title}</span>
      </div>
      <div className="text-2xl font-extrabold">{value}</div>
      {subtitle && <div className="text-xs text-[#737373] mt-1">{subtitle}</div>}
    </div>
  )
}

function QuickActionCard({ title, description, icon, href, color }: {
  title: string
  description: string
  icon: React.ReactNode
  href: string
  color: string
}) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-5 hover:border-[#1DB96B] hover:bg-[#F3FBF6] transition-all cursor-pointer group block no-underline text-inherit"
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: color + '15', color }}>
        {icon}
      </div>
      <h3 className="font-bold mt-3 text-[#111111]">{title}</h3>
      <p className="text-sm text-[#737373] mt-2">{description}</p>
      <span className="mt-4 inline-block text-xs font-semibold text-[#0B854C]">
        Go →
      </span>
    </Link>
  )
}
