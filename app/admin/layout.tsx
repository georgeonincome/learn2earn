'use client'

import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Clock,
  LogOut,
  ArrowRight,
  ChevronRight,
  Ticket,
  FileText,
  ShieldCheck,
  Award,
  Mail,
  RefreshCw,
  Smartphone,
  Play,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Courses', href: '/admin/courses', icon: CreditCard },
  { label: 'Cohorts', href: '/admin/cohorts', icon: Clock },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Payments', href: '/admin/payments', icon: CreditCard },
  { label: 'Students', href: '/admin/students', icon: Users },
  { label: 'Enrollments', href: '/admin/enrollments', icon: Smartphone },
  { label: 'Orders', href: '/admin/orders', icon: Play },
  { label: 'Tickets', href: '/admin/tickets', icon: Ticket },
  { label: 'Reviews', href: '/admin/reviews', icon: FileText },
  { label: 'Certificates', href: '/admin/certificates', icon: Award },
  { label: 'Roles', href: '/admin/roles', icon: ShieldCheck },
  { label: 'OTP', href: '/admin/otp', icon: Mail },
  { label: 'Email Logs', href: '/admin/email-logs', icon: Mail },
  { label: 'Failed Transactions', href: '/admin/failed-transactions', icon: RefreshCw },
  { label: 'Meta Events', href: '/admin/meta-events', icon: Play },
  { label: 'Training Enrollments', href: '/admin/training-session-enrollments', icon: Play },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const isAuthPage = pathname === '/admin/login' || pathname === '/admin/register'

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/admin/logout', {
        method: 'POST',
      })
      if (res.ok) {
        router.push('/admin/login')
      }
    } catch {
      // logout failed, still redirect
      router.push('/admin/login')
    }
  }

  return (
    <div className="flex min-h-screen bg-[#FAFAFA] text-[#111111]">
      {!isAuthPage && (
        <aside className="hidden lg:flex lg:flex-col lg:fixed lg:top-0 lg:left-0 lg:h-screen lg:w-64 lg:border-r lg:border-[#E5E5E5] lg:bg-white lg:overflow-hidden z-20">
          {/* Logo — pinned top */}
          <div className="p-6 shrink-0">
            <Link href="/" className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 bg-[#1DB96B] rounded-lg flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              </div>
              <span className="font-head font-extrabold text-lg">Learn2Earn</span>
            </Link>
          </div>

          {/* Nav links — scrollable independently */}
          <nav className="flex-1 overflow-y-auto p-0 space-y-1">
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
                      ? 'bg-[#1DB96B]/10 text-[#0B854C]'
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
          <div className="p-6 border-t border-[#E5E5E5] shrink-0">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-[#DC2626] hover:bg-[#FEE2E2] transition-colors"
            >
              <LogOut className="w-5 h-5" /> Sign out
            </button>
          </div>
        </aside>
      )}
      {!isAuthPage ? (
        <div className="flex-1 lg:ml-64 p-6 lg:p-10 overflow-y-auto">
          <main className="min-h-[calc(100vh-4rem)]">{children}</main>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-6 lg:p-10">
          <div className="max-w-md w-full">
            {children}
          </div>
        </div>
      )}
    </div>
  )
}