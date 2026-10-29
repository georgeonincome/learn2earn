import Link from 'next/link'
import { BookOpen, Users, Clock, CreditCard, TrendingUp, Award, Play } from 'lucide-react'
import { COURSES, COHORTS, MEMBERSHIP_PLANS, REVIEWS } from '@/lib/data'

const statCards = [
  {
    title: 'Total Courses',
    value: COURSES.length,
    icon: BookOpen,
    color: '#1DB96B',
    link: '/admin/courses',
  },
  {
    title: 'Active Cohorts',
    value: COHORTS.filter(c => c.status === 'active').length,
    icon: Clock,
    color: '#3B82F6',
    link: '/admin/cohorts',
  },
  {
    title: 'Total Users',
    value: 1240,
    icon: Users,
    color: '#8B5CF6',
    link: '/admin/users',
  },
  {
    title: 'Total Payments',
    value: 'ZMW 48,200',
    icon: CreditCard,
    color: '#F59E0B',
    link: '/admin/payments',
  },
]

const recentActivity = [
  { user: 'Mutale Chanda', action: 'Enrolled in AI Automation Bootcamp', time: '2 hours ago', type: 'course' },
  { user: 'Lucy Banda', action: 'Purchased membership (1 year)', time: '5 hours ago', type: 'membership' },
  { user: 'Sarai Mwale', action: 'Joined AI Unlocked Cohort 2', time: '1 day ago', type: 'cohort' },
  { user: 'Gideon Phiri', action: 'Completed Canva Masterclass', time: '2 days ago', type: 'course' },
  { user: 'Sandy Tembo', action: 'Paid via MTN Mobile Money', time: '3 days ago', type: 'payment' },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#111111]">Dashboard</h1>
          <p className="text-[#737373] text-sm">Welcome back, George. Here&apos;s what&apos;s happening with Learn2Earn.</p>
        </div>
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1DB96B] text-[#111111] text-sm font-bold hover:bg-[#17A05D] transition-colors"
        >
          <Play className="w-4 h-4" /> View Site
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
        {statCards.map((card) => (
          <Link
            key={card.title}
            href={card.link}
            className="bg-white rounded-xl border border-[#E5E5E5] p-6 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: card.color + '10', color: card.color }}>
              <card.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-extrabold text-[#111111]">{card.value}</p>
            <p className="text-[#737373] text-sm mt-1">{card.title}</p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Link
          href="/admin/courses"
          className="bg-white rounded-xl border border-[#E5E5E5] p-6 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#1DB96B]/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-[#1DB96B]" />
            </div>
            <TrendingUp className="w-5 h-5 text-[#A3A3A3]" />
          </div>
          <h3 className="font-bold text-[#111111] mb-1">Manage Courses</h3>
          <p className="text-[#737373] text-sm">{COURSES.length} courses published</p>
        </Link>

        <Link
          href="/admin/cohorts"
          className="bg-white rounded-xl border border-[#E5E5E5] p-6 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#3B82F6]/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-[#3B82F6]" />
            </div>
            <Award className="w-5 h-5 text-[#A3A3A3]" />
          </div>
          <h3 className="font-bold text-[#111111] mb-1">Manage Cohorts</h3>
          <p className="text-[#737373] text-sm">{COHORTS.length} live programs</p>
        </Link>

        <Link
          href="/admin/users"
          className="bg-white rounded-xl border border-[#E5E5E5] p-6 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-[#8B5CF6]" />
            </div>
            <CreditCard className="w-5 h-5 text-[#A3A3A3]" />
          </div>
          <h3 className="font-bold text-[#111111] mb-1">Manage Users</h3>
          <p className="text-[#737373] text-sm">1,240 registered learners</p>
        </Link>

        <Link
          href="/admin/payments"
          className="bg-white rounded-xl border border-[#E5E5E5] p-6 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-[#F59E0B]" />
            </div>
            <Play className="w-5 h-5 text-[#A3A3A3]" />
          </div>
          <h3 className="font-bold text-[#111111] mb-1">Manage Payments</h3>
          <p className="text-[#737373] text-sm">ZMW 48,200 processed</p>
        </Link>
      </div>

      {/* Recent activity */}
      <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
        <h2 className="text-xl font-bold text-[#111111] mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#1DB96B]" /> Recent Activity
        </h2>
        <div className="space-y-4">
          {recentActivity.map((activity, i) => (
            <div key={i} className="flex items-start gap-4 py-3 border-b last:border-0">
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#F3FBF6', color: '#1DB96B' }}>
                {activity.type === 'course' ? (
                  <BookOpen className="w-4 h-4" />
                ) : activity.type === 'membership' ? (
                  <CreditCard className="w-4 h-4" />
                ) : activity.type === 'cohort' ? (
                  <Clock className="w-4 h-4" />
                ) : (
                  <Award className="w-4 h-4" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[#111111]">
                  <span className="font-bold">{activity.user}</span>{' '}
                  {activity.action}
                </p>
                <p className="text-xs text-[#737373]">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
