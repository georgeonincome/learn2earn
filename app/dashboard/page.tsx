'use client'

import Link from 'next/link'
import { BookOpen, Check, Award, Flame, Play, Clock, Settings } from 'lucide-react'
import { COURSES } from '@/lib/data'
import { COURSE_LESSONS } from '@/lib/lessons-data'
import { MEMBERSHIP_PLANS } from '@/lib/data'
import { formatPrice } from '@/lib/utils'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { useSubscription } from '@/lib/subscription/useSubscription'

/**
 * Student Dashboard — mirrors reference StudentDashboard-Dh-ypbFE.js
 *
 * Route: /dashboard
 *
 * Features:
 * - Welcome header with user info
 * - Stats cards (courses enrolled, lessons completed, certificates earned, streak days)
 * - Progress section with overall completion
 * - Active cohorts with countdown timers
 * - Upcoming lessons
 * - Announcements
 * - Quick actions
 */

interface LessonWithProgress {
  id: string
  title: string
  duration?: string
  isPreview?: boolean
  completed: boolean
}

export default function DashboardPage() {
  const userId = 1 // In production, this comes from auth session
  const { plan, status, isActive, currentPeriodEnd, daysRemaining, refresh } =
    useSubscription()

  // Calculate dashboard stats from mock data
  const enrolledCourses = COURSES.filter((c) => c.featured).slice(0, 4)
  const totalLessons = COURSES.reduce(
    (acc, c) => acc + (COURSE_LESSONS[c.slug]?.length ?? 0),
    0
  )
  const completedLessons = 3 // Mock: user has completed 3 lessons
  const progressPercent =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

  // Mock streak data
  const currentStreak = 5
  const longestStreak = 12

  // Mock certificates earned
  const certificatesEarned = 2

  // Active cohorts
  const activeCohorts = COURSES.filter((c) => c.featured).slice(0, 3)

  // Announcements
  const announcements = [
    {
      id: 1,
      title: 'Welcome to Learn2Earn',
      message:
        'Start your digital skills journey with our practical courses. All courses are self-paced with lifetime access.',
      publishedAt: new Date().toISOString(),
      isRead: false,
    },
    {
      id: 2,
      title: 'New: AI Automation Bootcamp',
      message:
        'Build real automations with Make.com, Google Sheets, and AI. Live cohort starting soon.',
      publishedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      isRead: false,
    },
    {
      id: 3,
      title: 'Certificate Update',
      message:
        'All certificates now include verification links. Share them on LinkedIn and your CV.',
      publishedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      isRead: true,
    },
  ]

  return (
    <DashboardLayout>
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold">Dashboard</h1>
            <p className="text-[#737373] text-sm mt-1">
              Welcome back, {plan?.name ? 'Member' : 'Student'}!
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E8F6EF] text-[#1DB96B] font-bold text-sm">
              G
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Courses Enrolled"
          value={enrolledCourses.length}
          icon="BookOpen"
          color="#1DB96B"
        />
        <StatCard
          title="Lessons Completed"
          value={completedLessons}
          icon="Check"
          color="#1DB96B"
        />
        <StatCard
          title="Certificates"
          value={certificatesEarned}
          icon="Award"
          color="#F59E0B"
        />
        <StatCard
          title="Current Streak"
          value={currentStreak}
          icon="Flame"
          color="#F59E0B"
          subtitle={`Best: ${longestStreak} days`}
        />
      </div>

      {/* Progress Section */}
      <section className="mb-8">
        <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-extrabold">Course Progress</h2>
            <span className="text-sm font-semibold text-[#1DB96B]">
              {progressPercent}%
            </span>
          </div>
          <div className="w-full bg-[#E5E5E5] rounded-full h-4">
            <div
              className="h-full bg-[#1DB96B] rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-[#737373] mt-2">
            <span>{completedLessons} of {totalLessons} lessons</span>
            <span>{progressPercent}% complete</span>
          </div>
        </div>
      </section>

      {/* Active Cohorts */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-extrabold">Active Cohorts</h2>
          <Link
            href="/cohorts"
            className="text-sm font-semibold text-[#1DB96B] hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeCohorts.map((c) => (
            <CohortCard key={c.slug} course={c} />
          ))}
        </div>
      </section>

      {/* Announcements */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-extrabold">Announcements</h2>
          <Link
            href="/dashboard"
            className="text-sm font-semibold text-[#1DB96B] hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="space-y-3">
          {announcements.map((a) => (
            <AnnouncementCard key={a.id} announcement={a} />
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="mb-8">
        <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-6">
          <h2 className="text-xl font-extrabold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <QuickActionCard
              title="Start Learning"
              description="Continue your courses where you left off"
              icon="Play"
              href="/courses"
              color="#1DB96B"
            />
            <QuickActionCard
              title="View Certificates"
              description="Download your completion certificates"
              icon="Award"
              href="/dashboard/certificates"
              color="#F59E0B"
            />
            <QuickActionCard
              title="Join a Cohort"
              description="Live group-based programs with deadlines"
              icon="Clock"
              href="/cohorts"
              color="#F59E0B"
            />
            <QuickActionCard
              title="Update Profile"
              description="Manage your account settings"
              icon="Settings"
              href="/dashboard/settings"
              color="#737373"
            />
          </div>
        </div>
      </section>
    </DashboardLayout>
  )
}

interface StatCardProps {
  title: string
  value: number | string
  icon: string
  color: string
  subtitle?: string
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen,
  Check,
  Award,
  Flame,
  Play,
  Clock,
  Settings,
}

function StatCard({
  title,
  value,
  icon: iconName,
  color,
  subtitle,
}: StatCardProps) {
  const Icon = ICON_MAP[iconName] || BookOpen
  return (
    <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1DB96B]/10 text-[#1DB96B]">
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-xs font-semibold text-[#737373]">{title}</span>
      </div>
      <div className="text-2xl font-extrabold">{value}</div>
      {subtitle && <div className="text-xs text-[#737373] mt-1">{subtitle}</div>}
    </div>
  )
}

interface CohortCardProps {
  course: any
}

function CohortCard({ course }: CohortCardProps) {
  return (
    <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1DB96B]/10 text-[#1DB96B] text-xs font-bold">
          C
        </span>
        <span className="text-xs font-medium text-[#737373]">Cohort</span>
      </div>
      <h3 className="text-lg font-bold">{course.title}</h3>
      <p className="text-sm text-[#737373] mt-2">
        {course.category ?? 'Digital Skills'}
      </p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm font-bold">{formatPrice(course.price)}</span>
        <Link
          href={`/courses/${course.slug}`}
          className="text-xs font-semibold text-[#1DB96B] hover:underline"
        >
          Join Cohort
        </Link>
      </div>
    </div>
  )
}

interface AnnouncementCardProps {
  announcement: {
    id: number
    title: string
    message: string
    publishedAt: string
    isRead: boolean
  }
}

function AnnouncementCard({ announcement }: AnnouncementCardProps) {
  const date = new Date(announcement.publishedAt).toLocaleDateString(
    'en-GB',
    {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }
  )
  return (
    <div className="rounded-lg border border-[#E5E5E5] bg-[#FFFFFF] p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-bold">{announcement.title}</h3>
          <p className="text-sm text-[#737373] mt-1">
            {announcement.message}
          </p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs text-[#737373]">{date}</span>
          {!announcement.isRead && (
            <span className="flex h-2 w-2 items-center justify-center rounded-full bg-[#1DB96B] text-white text-[10px] font-bold">
              NEW
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

interface QuickActionCardProps {
  title: string
  description: string
  icon: string
  href: string
  color: string
}

function QuickActionCard({
  title,
  description,
  icon: iconName,
  href,
  color,
}: QuickActionCardProps) {
  const Icon = ICON_MAP[iconName] || BookOpen
  return (
    <a
      href={href}
      className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-5 hover:border-[#1DB96B] hover:bg-[#F3FBF6] transition-all cursor-pointer group"
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1DB96B]/10 text-[#1DB96B] mb-3">
        <Icon className="w-4 h-4" />
      </div>
      <h3 className="font-bold">{title}</h3>
      <p className="text-sm text-[#737373] mt-2">{description}</p>
      <span className="mt-4 inline-block text-xs font-semibold text-[#1DB96B] hover:underline">
        Go →
      </span>
    </a>
  )
}
