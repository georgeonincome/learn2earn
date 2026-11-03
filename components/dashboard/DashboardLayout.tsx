/**
 * Dashboard Layout — sidebar navigation for dashboard pages
 * Mirrors reference StudentDashboard navigation structure
 */

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  BookOpen,
  Clock,
  Award,
  FileText,
  Menu,
  Settings,
  Mail,
  Ticket,
  Book,
  Play,
  Zap,
  Send,
  Megaphone,
  FileCheck,
  Users,
} from 'lucide-react'

const DASHBOARD_NAV = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'My Courses', href: '/dashboard/courses', icon: BookOpen },
  { label: 'Cohorts', href: '/dashboard/cohorts', icon: Clock },
  { label: 'Certificates', href: '/dashboard/certificates', icon: Award },
  { label: 'Reviews', href: '/dashboard/reviews', icon: FileText },
  { label: 'Plan', href: '/dashboard/plan', icon: Ticket },
  { label: 'Reading Lab', href: '/dashboard/reading-lab', icon: Book },
  { label: 'AM Challenge', href: '/dashboard/am-challenge', icon: Play },
  { label: 'SkillCheck', href: '/dashboard/skillcheck', icon: Zap },
  { label: 'Support', href: '/dashboard/support', icon: Mail },
  { label: 'Announcements', href: '/dashboard/announcements', icon: Megaphone },
  { label: 'Assignments', href: '/dashboard/assignments', icon: FileCheck },
  { label: 'Transcripts', href: '/dashboard/transcripts', icon: Users },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111111]">
      <header className="border-b border-[#E5E5E5] bg-[#FFFFFF]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1DB96B]">
              <svg
                viewBox="0 0 24 24"
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </div>
            <span className="font-head font-extrabold text-xl">Learn2Earn</span>
          </div>
          <nav className="flex items-center gap-8 text-sm font-medium text-[#737373]">
            {DASHBOARD_NAV.map((item) => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${active ? 'text-[#1DB96B] font-bold border-b-2 border-[#1DB96B]' : 'text-[#737373] hover:text-[#1DB96B]'}`}
                >
                  {item.icon === LayoutDashboard ? (
                    <LayoutDashboard className="w-4 h-4" />
                  ) : item.icon === BookOpen ? (
                    <BookOpen className="w-4 h-4" />
                  ) : item.icon === Clock ? (
                    <Clock className="w-4 h-4" />
                  ) : item.icon === Award ? (
                    <Award className="w-4 h-4" />
                  ) : item.icon === FileText ? (
                    <FileText className="w-4 h-4" />
                  ) : item.icon === Ticket ? (
                    <Ticket className="w-4 h-4" />
                  ) : item.icon === Settings ? (
                    <Settings className="w-4 h-4" />
                  ) : item.icon === Book ? (
                    <Book className="w-4 h-4" />
                  ) : item.icon === Play ? (
                    <Play className="w-4 h-4" />
                  ) : item.icon === Zap ? (
                    <Zap className="w-4 h-4" />
                  ) : item.icon === Mail ? (
                    <Mail className="w-4 h-4" />
                  ) : item.icon === Megaphone ? (
                    <Megaphone className="w-4 h-4" />
                  ) : item.icon === FileCheck ? (
                    <FileCheck className="w-4 h-4" />
                  ) : item.icon === Users ? (
                    <Users className="w-4 h-4" />
                  ) : (
                    <Settings className="w-4 h-4" />
                  )}
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  )
}
