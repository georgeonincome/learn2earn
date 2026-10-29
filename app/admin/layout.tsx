'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, CreditCard, Clock, LogOut, ArrowRight, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Courses', href: '/admin/courses', icon: CreditCard },
  { label: 'Cohorts', href: '/admin/cohorts', icon: Clock },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Payments', href: '/admin/payments', icon: CreditCard },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen bg-[#FAFAFA] text-[#111111]">
      {/* Sidebar */}
      <aside className="hidden lg:flex lg:w-64 flex-col border-r border-[#E5E5E5] bg-white">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-[#1DB96B] rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </div>
            <span className="font-head font-extrabold text-lg">Learn2Earn</span>
          </Link>
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon
              const active = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                    active
                      ? 'bg-[#1DB96B]/10 text-[#1DB96B]'
                      : 'text-[#737373] hover:bg-[#F3FBF6] hover:text-[#111111]'
                  )}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {item.label}
                  {active && <ArrowRight className="ml-auto w-4 h-4" />}
                </Link>
              )
            })}
          </nav>
        </div>
        <div className="mt-auto p-6 border-t border-[#E5E5E5]">
          <Link
            href="/admin/logout"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#DC2626] hover:bg-[#FEE2E2] transition-colors"
          >
            <LogOut className="w-5 h-5" /> Sign out
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 p-6 lg:p-10">
        <main>{children}</main>
      </div>
    </div>
  )
}
