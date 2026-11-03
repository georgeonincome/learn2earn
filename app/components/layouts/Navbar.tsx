'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Play, Zap, ShieldCheck, Clock, Search, LayoutDashboard, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SITE_CONFIG } from '@/lib/data'

const NAV_ITEMS = [
  { label: 'Courses', href: '/courses', icon: Play },
  { label: 'Cohorts', href: '/cohorts', icon: Clock },
  { label: 'Masterclasses', href: '/masterclasses', icon: Zap },
  { label: 'Meta Ads', href: '/meta-ads', icon: ShieldCheck },
  { label: 'Books', href: '/books', icon: LayoutDashboard },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="fixed w-full z-40 border-b border-white/10 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 rounded-lg bg-[#1DB96B] px-3 py-2">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
              <span className="font-head font-extrabold text-sm tracking-tight">Learn2Earn</span>
            </Link>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <nav className="flex items-center gap-6">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon
                const active = pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                        active
                          ? 'bg-[#1DB96B]/10 text-[#0B854C]'
                          : 'text-[#737373] hover:text-[#111111] hover:bg-[#F3FBF6]'
                    )}
                  >
                    <Icon className="w-4 h-5 shrink-0" />
                    {item.label}
                    {active && <span className="sr-only">Current page</span>}
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <a href="/subscribe" className="hidden sm:flex items-center gap-2 rounded-lg bg-[#1DB96B] px-4 py-2 text-xs font-bold text-white hover:bg-[#17A05D] transition-colors">
              Get Membership
            </a>
            <button className="relative flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold text-white bg-[#0A0D1A] hover:bg-[#171D25] transition-colors">
              Sign In
              <ArrowRight className="w-3 h-3 ml-1" />
            </button>
            <button className="lg:hidden p-2 rounded-lg text-[#111111] hover:bg-gray-100 transition-colors" aria-label="Open menu">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
