'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, Search, LogIn, Megaphone, ArrowRight } from 'lucide-react'
import { SITE_CONFIG, COURSES } from '@/lib/data'
import { cn } from '@/lib/utils'

/* Navbar — exact match to click2skill ZL component:
   - Announcement bar + social icons
   - Dark sticky header #0D1117 top-[36px]
   - Rounded-full nav links
   - Mobile: overlay drawer (no duplicate header row), search modal cmd+K
*/

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Courses', href: '/courses' },
  { label: 'Cohorts', href: '/cohorts' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'FAQs', href: '/faq' },
]

const ANNOUNCEMENT_TEXT = 'New class: How to Become a Virtual Assistant — live evenings starting soon'
const ANNOUNCEMENT_HREF = '/cohorts'
const ANNOUNCEMENT_CTA = 'Reserve your seat →'

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  )
}
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  )
}
function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}
function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/'
  return pathname.startsWith(href)
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* cmd+k shortcut */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(s => !s)
      }
      if (e.key === 'Escape') {
        setSearchOpen(false)
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const filtered = COURSES.filter(c =>
    (c.title + ' ' + c.category).toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 8)

  const go = useCallback((href: string) => {
    setSearchOpen(false)
    setIsOpen(false)
    router.push(href)
  }, [router])

  return (
    <>
      {/* Search modal overlay */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/55 flex items-start justify-center pt-28 sm:pt-32 px-4"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-[#0D1117] border border-[#1E293B] rounded-2xl shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 p-4 border-b border-[#1E293B]">
              <Search className="w-5 h-5 text-[#94A3B8] shrink-0" />
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search courses…"
                className="flex-1 bg-transparent text-white text-base outline-none placeholder:text-[#94A3B8]"
              />
              <kbd className="hidden sm:inline-block px-2 py-1 rounded-md bg-white/10 text-[#94A3B8] text-[11px] font-bold">
                ESC
              </kbd>
            </div>
            <div className="max-h-[65vh] overflow-y-auto">
              {filtered.length > 0 ? filtered.map(c => (
                <button
                  key={c.slug}
                  onClick={() => go(`/courses/${c.slug}`)}
                  className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-white/5 border-b border-[#1E293B] last:border-0 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-white">{c.title}</p>
                    <p className="text-xs text-[#94A3B8]">{c.category} · ZMW {c.price.toLocaleString('en-ZM')}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#94A3B8] shrink-0" />
                </button>
              )) : (
                <div className="px-5 py-8 text-center">
                  <p className="text-sm text-[#94A3B8]">No courses match “{searchQuery}”</p>
                </div>
              )}
            </div>
            <div className="hidden sm:flex items-center justify-between px-5 py-2.5 border-t border-[#1E293B] text-[11px] text-[#94A3B8]">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-white/10 font-bold">↑↓</kbd> to navigate</span>
                <span><kbd className="px-1.5 py-0.5 rounded bg-white/10 font-bold">↵</kbd> to select</span>
              </div>
              <button onClick={() => setSearchOpen(false)} className="font-bold hover:text-white transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Announcement bar */}
      <div className="bg-foreground text-background py-2 text-xs sm:text-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between">
          <Link href={ANNOUNCEMENT_HREF} className="group flex min-w-0 items-center gap-2 font-medium hover:text-[hsl(var(--primary))] transition-[var(--transition-smooth)]">
            <Megaphone className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">
              {ANNOUNCEMENT_TEXT}
              <span className="hidden sm:inline text-[hsl(var(--primary))] group-hover:underline"> {ANNOUNCEMENT_CTA}</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <a href={SITE_CONFIG.social.tiktok} target="_blank" rel="noopener noreferrer" className="hover:text-[hsl(var(--primary))] transition-[var(--transition-smooth)]" aria-label="TikTok"><TikTokIcon className="h-4 w-4" /></a>
            <a href={SITE_CONFIG.social.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-[hsl(var(--primary))] transition-[var(--transition-smooth)]" aria-label="Instagram"><InstagramIcon className="h-4 w-4" /></a>
            <a href={SITE_CONFIG.social.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-[hsl(var(--primary))] transition-[var(--transition-smooth)]" aria-label="YouTube"><YouTubeIcon className="h-4 w-4" /></a>
            <a href={SITE_CONFIG.social.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-[hsl(var(--primary))] transition-[var(--transition-smooth)]" aria-label="LinkedIn"><LinkedInIcon className="h-4 w-4" /></a>
          </div>
        </div>
      </div>

      {/* Dark header */}
      <header className={cn('sticky top-[36px] z-40 bg-[#0D1117] border-b border-[#1E293B] transition-all duration-300', scrolled && 'shadow-lg backdrop-blur-md bg-[#0D1117]/95')}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex items-center justify-between h-[72px]">
            {/* Logo */}
            <Link href="/" className="flex items-center flex-shrink-0 hover:opacity-80 transition-opacity">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary rounded-xl flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              </div>
              <span className="font-head text-xl sm:text-2xl font-extrabold text-white ml-2 tracking-tight">Learn2Earn</span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {NAV_LINKS.map((item) => {
                const active = isActive(pathname, item.href)
                return (
                  <Link key={item.href} href={item.href} className={cn('px-4 py-2 rounded-full font-semibold text-sm transition-all relative group', active ? 'text-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.15)]' : 'text-[#94A3B8] hover:text-white hover:bg-white/5')}>
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            {/* Desktop actions */}
            <div className="hidden lg:flex items-center gap-3">
              <button onClick={() => setSearchOpen(true)} className="font-semibold text-sm text-[#94A3B8] hover:text-white hover:bg-white/10 px-4 py-2 rounded-full transition-all flex items-center gap-2">
                <Search className="w-4 h-4" />
                <span className="hidden xl:inline">Search</span>
                <kbd className="hidden xl:inline-block px-1.5 py-0.5 rounded bg-white/10 text-[#94A3B8] text-[11px]">⌘K</kbd>
              </button>
              <Link href="/auth" className="font-semibold text-sm text-[#94A3B8] hover:text-white hover:bg-white/10 px-4 py-2 rounded-full transition-all">Login</Link>
              <Link href="/courses" className="bg-[hsl(var(--primary))] hover:bg-[#1BBF83] text-[#0D0D0D] font-bold text-sm px-5 py-2.5 rounded-full shadow-lg shadow-[hsl(var(--primary)/0.2)] hover:shadow-md transition-all">Get Started</Link>
            </div>

            {/* Mobile actions */}
            <div className="flex lg:hidden items-center gap-1">
              <button onClick={() => setSearchOpen(true)} className="p-2 min-h-[44px] min-w-[44px] text-[#94A3B8] hover:text-white hover:bg-white/10 rounded-full transition-all" aria-label="Search">
                <Search className="h-5 w-5" />
              </button>
              <Link href="/auth" className="p-2 min-h-[44px] min-w-[44px] text-[#94A3B8] hover:text-white hover:bg-white/10 rounded-full transition-all" aria-label="Login">
                <LogIn className="h-5 w-5" />
              </Link>
              <button onClick={() => setIsOpen(!isOpen)} className="p-2 min-h-[44px] min-w-[44px] text-[#94A3B8] hover:text-white hover:bg-white/10 rounded-full transition-all" aria-label="Toggle menu">
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile drawer — NO duplicate header row, clean overlay */}
        {isOpen && (
          <div className="lg:hidden bg-[#0D1117] border-t border-[#1E293B]">
            <nav className="flex flex-col p-5 space-y-1">
              <button onClick={() => { setIsOpen(false); setSearchOpen(true) }} className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-[#94A3B8] hover:bg-white/10 transition-all text-sm font-semibold">
                <Search className="h-4 w-4" />
                Search Learn2Earn…
                <kbd className="ml-auto px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-bold">⌘K</kbd>
              </button>
              {NAV_LINKS.map((item) => {
                const active = isActive(pathname, item.href)
                return (
                  <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)} className={cn('flex items-center px-4 py-3 rounded-lg font-semibold text-base transition-all min-h-[48px]', active ? 'bg-[hsl(var(--primary)/0.15)] text-[hsl(var(--primary))] border-l-4 border-[hsl(var(--primary))]' : 'text-[#94A3B8] hover:bg-white/5 hover:text-white')}>
                    {item.label}
                  </Link>
                )
              })}
            </nav>
            <div className="p-5 pt-2 space-y-3">
              <Link href="/auth" onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-2 w-full min-h-[48px] font-semibold text-[#94A3B8] border-2 border-[#1E293B] hover:bg-white/5 hover:border-[hsl(var(--primary))] hover:text-white rounded-full transition-all">
                Login
              </Link>
              <Link href="/courses" onClick={() => setIsOpen(false)} className="flex items-center justify-center w-full bg-[hsl(var(--primary))] hover:bg-[#1BBF83] text-[#0D0D0D] font-bold shadow-sm min-h-[48px] rounded-full transition-all">
                Start Learning Now
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  )
}
