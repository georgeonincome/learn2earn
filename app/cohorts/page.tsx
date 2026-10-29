'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Search,
  X,
  Calendar,
  Clock,
  Users,
  BookOpen,
  BadgeCheck,
  ArrowRight,
} from 'lucide-react'
import { COHORTS, SITE_CONFIG } from '@/lib/data'
import type { Cohort } from '@/lib/types'
import { formatPrice } from '@/lib/utils'

/* Cohorts catalog — exact 1:1 from click2skill CohortsCatalog-B3iMLcaa.js:
   Pill tabs, search, status chips, grid with real thumbnails,
   countdown, early-bird pricing, seat-full states.
*/

const C = {
  pageBg: '#FAFAFA',
  surface: '#FFFFFF',
  border: '#E5E5E5',
  shadow: '0 2px 8px rgba(0,0,0,0.06)',
  shadowHover: '0 4px 12px rgba(0,0,0,0.08)',
  primary: '#1DB96B',
  primaryHover: '#17A05D',
  badgeBg: '#E8F8F0',
  badgeText: '#0F7A42',
  text: '#111111',
  textSecondary: '#404040',
  textMuted: '#737373',
  timerWarn: '#B45309',
  radiusCard: 12,
  radiusBtn: 8,
  radiusPill: 9999,
}

const SORTS = [
  { value: 'starting_soon', label: 'Starting soon' },
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
] as const

type SortValue = (typeof SORTS)[number]['value']

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'Africa/Lusaka' })

export default function CohortsPage() {
  const [query, setQuery] = useState('')
  const [debounced, setDebounced] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<'all' | 'upcoming' | 'active' | 'completed'>('all')
  const [sort, setSort] = useState<SortValue>('starting_soon')

  useMemo(() => {
    const t = setTimeout(() => setDebounced(query), 250)
    return () => clearTimeout(t)
  }, [query])

  const today = new Date()

  const counts = useMemo(() => {
    const all = COHORTS as Cohort[]
    return {
      all: all.length,
      upcoming: all.filter(c => c.status === 'upcoming').length,
      active: all.filter(c => c.status === 'active').length,
      completed: all.filter(c => c.status === 'completed').length,
    }
  }, [])

  const filtered = useMemo(() => {
    let list = [...(COHORTS as Cohort[])]
    if (debounced.trim()) {
      const q = debounced.toLowerCase()
      list = list.filter(c => (c.title + ' ' + c.description).toLowerCase().includes(q))
    }
    if (statusFilter !== 'all') list = list.filter(c => c.status === statusFilter)
    switch (sort) {
      case 'newest':
        list.sort((a, b) => Number(b.id) - Number(a.id))
        break
      case 'price_asc':
        list.sort((a, b) => a.price - b.price)
        break
      case 'price_desc':
        list.sort((a, b) => b.price - a.price)
        break
      default:
        list.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    }
    return list
  }, [debounced, statusFilter, sort])

  const daysUntil = (iso: string) =>
    Math.ceil((new Date(iso).getTime() - today.getTime()) / 86_400_000)

  return (
    <div className="min-h-screen font-sans" style={{ background: C.pageBg, color: C.text }}>
      <main className="pt-28 pb-16">
        {/* Tabs row */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 mb-6">
          <div className="inline-flex p-1 gap-1" style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 999 }}>
            <Link
              href="/courses"
              className="text-sm capitalize"
              style={{ padding: '8px 18px', borderRadius: 999, color: C.textSecondary, minHeight: 38, fontWeight: 400, display: 'inline-flex', alignItems: 'center' }}
            >
              courses
            </Link>
            <span
              className="text-sm capitalize"
              style={{ padding: '8px 18px', borderRadius: 999, background: C.primary, color: '#fff', minHeight: 38, fontWeight: 500, display: 'inline-flex', alignItems: 'center' }}
            >
              cohorts
            </span>
          </div>
          <p className="text-xs mt-2" style={{ color: C.textMuted }}>
            <strong style={{ color: C.textSecondary, fontWeight: 500 }}>Courses</strong> = self-paced learning.{' '}
            <strong style={{ color: C.textSecondary, fontWeight: 500 }}>Cohorts</strong> = live, group-based programs with deadlines.
          </p>
        </div>

        {/* Title + search */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 mb-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold" style={{ color: C.text }}>
                Cohort Training Programs
              </h1>
              <p className="text-sm mt-1 max-w-2xl" style={{ color: C.textSecondary }}>
                Live, structured programs with daily lessons, quizzes, and a supportive community.
              </p>
            </div>
            <div className="flex items-center">
              {searchOpen ? (
                <div className="flex items-center gap-2">
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search programs..."
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    className="text-sm focus:outline-none w-48 sm:w-64"
                    style={{
                      minHeight: 44, padding: '0 14px', borderRadius: C.radiusBtn,
                      background: C.surface, border: `1px solid ${C.border}`, color: C.text,
                    }}
                  />
                  <button
                    onClick={() => { setSearchOpen(false); setQuery('') }}
                    className="p-2"
                    style={{ color: C.textSecondary }}
                    aria-label="Close search"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="transition-colors"
                  style={{
                    padding: 12, borderRadius: C.radiusBtn,
                    background: C.surface, border: `1px solid ${C.border}`, color: C.textSecondary,
                  }}
                  aria-label="Search programs"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Status chips */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 mb-4">
          <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-hide -mx-1 px-1">
            {([
              ['all', `All (${counts.all})`],
              ['upcoming', `Upcoming (${counts.upcoming})`],
              ['active', `Active (${counts.active})`],
              ['completed', `Past (${counts.completed})`],
            ] as const).map(([value, label]) => (
              <button
                key={value}
                onClick={() => setStatusFilter(value)}
                className="shrink-0 text-sm transition-colors"
                style={{
                  padding: '8px 16px', borderRadius: C.radiusPill,
                  background: statusFilter === value ? C.primary : '#fff',
                  color: statusFilter === value ? '#fff' : C.text,
                  border: `1px solid ${statusFilter === value ? C.primary : C.border}`,
                  fontWeight: statusFilter === value ? 500 : 400,
                  minHeight: 40, cursor: 'pointer',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Count + sort */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 mb-5">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <p className="text-sm" style={{ color: C.textMuted }}>
              {filtered.length} {filtered.length === 1 ? 'program' : 'programs'}
            </p>
            <select
              value={sort}
              onChange={e => setSort(e.target.value as SortValue)}
              className="text-sm bg-white cursor-pointer focus:outline-none"
              style={{
                height: 40,
                padding: '0 32px 0 14px',
                borderRadius: C.radiusBtn,
                border: '1px solid #D4D4D4',
                color: C.text,
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23737373' stroke-width='2'><polyline points='6 9 12 15 18 9'/></svg>")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 10px center',
              }}
            >
              {SORTS.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          {filtered.length === 0 ? (
            <div className="text-center py-16" style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: C.radiusCard }}>
              <BookOpen className="h-12 w-12 mx-auto mb-4" style={{ color: C.textMuted }} />
              <p style={{ color: C.textSecondary }}>
                {debounced ? 'No programs match your search.' : 'Check back soon for upcoming programs.'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 20 }}>
              {filtered.map(c => {
                const until = daysUntil(c.startDate)
                const isFull = c.maxSeats > 0 && c.enrolled >= c.maxSeats
                const showEarlyBird = !!c.originalPrice && c.originalPrice > c.price
                const ended = c.status === 'completed'
                return (
                  <article
                    key={c.slug}
                    className="group flex flex-col overflow-hidden"
                    style={{
                      background: C.surface, border: `1px solid ${C.border}`,
                      borderRadius: C.radiusCard, boxShadow: C.shadow,
                      transition: 'box-shadow 200ms ease',
                    }}
                  >
                    {/* Thumb with real image */}
                    <Link href={`/cohorts/${c.slug}`}>
                      <div className="relative w-full aspect-square bg-[#EEF1EE]" aria-hidden="true">
                        <Image
                          src={ended ? '/images/elvis-mic.webp' : '/images/beginner-ai-classes.png'}
                          alt={c.title}
                          fill
                          className="object-cover"
                          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 100vw"
                        />
                        <div className="absolute top-2 right-2">
                          {ended ? (
                            <span className="inline-flex items-center px-2.5 py-1 text-[11px] font-medium" style={{ background: '#F5F5F5', color: C.textMuted, borderRadius: C.radiusPill, border: '1px solid #E5E5E5' }}>
                              Ended
                            </span>
                          ) : c.status === 'active' ? (
                            <span className="inline-flex items-center px-2.5 py-1 text-[11px] font-medium" style={{ background: C.badgeBg, color: C.badgeText, borderRadius: C.radiusPill, border: `1px solid ${C.badgeBg}` }}>
                              <BadgeCheck className="w-3 h-3 mr-1" /> Live now
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 text-[11px] font-medium" style={{ background: C.badgeBg, color: C.badgeText, borderRadius: C.radiusPill, border: `1px solid ${C.badgeBg}` }}>
                              Starting soon
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                    {/* body */}
                    <div className="flex flex-1 flex-col gap-2 p-4">
                      <span style={{ color: '#A3A3A3', fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.03em', fontWeight: 500 }}>
                        {c.lessons.length * 2 || 10} day cohort
                      </span>
                      <Link href={`/cohorts/${c.slug}`}>
                        <h3 className="line-clamp-2" style={{ color: C.text, fontSize: 14.5, fontWeight: 600, lineHeight: 1.35, minHeight: '2.7em' }}>
                          {c.title}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-3 text-xs flex-wrap" style={{ color: C.textMuted }}>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" /> {fmtDate(c.startDate)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {c.schedule.split('·')[0].trim()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" /> {c.enrolled}
                        </span>
                      </div>
                      {!ended && until >= 0 && until <= 14 && (
                        <div className="text-xs" style={{ color: C.primary, fontWeight: 500 }}>
                          {until === 0 ? 'Starts today' : until === 1 ? 'Starts tomorrow' : `Starts in ${until} days`}
                          {showEarlyBird && <span style={{ color: C.textMuted, fontWeight: 400 }}> · Early bird open</span>}
                        </div>
                      )}
                      {isFull && !ended && (
                        <div className="text-xs" style={{ color: C.timerWarn, fontWeight: 500 }}>
                          Class is full — join the waitlist
                        </div>
                      )}
                      {/* price row */}
                      <div style={{ marginTop: 2 }}>
                        {!ended && (
                          <div className="flex items-center gap-2 flex-wrap">
                            <span style={{ color: C.primary, fontWeight: 700, fontSize: 16 }}>
                              {formatPrice(c.price)}
                            </span>
                            {showEarlyBird && (
                              <span style={{ color: C.textMuted, fontSize: 12, textDecoration: 'line-through' }}>
                                {formatPrice(c.originalPrice!)}
                              </span>
                            )}
                          </div>
                        )}
                        {ended && (
                          <div className="text-xs" style={{ color: C.textSecondary, fontWeight: 500 }}>
                            This class is over — watch the recording →
                          </div>
                        )}
                      </div>
                      <Link
                        href={ended ? `/cohorts/${c.slug}` : `/checkout?cohort=${c.slug}`}
                        className="mt-auto inline-flex items-center justify-center text-sm font-semibold transition-colors"
                        style={{
                          minHeight: 44, borderRadius: C.radiusBtn,
                          background: ended ? '#F5F5F5' : C.primary,
                          color: ended ? C.textMuted : '#fff',
                          border: `1px solid ${ended ? C.border : C.primary}`,
                          cursor: ended ? 'default' : 'pointer', padding: '0 18px',
                        }}
                      >
                        {ended ? 'View recordings' : isFull ? 'Join waitlist' : 'Reserve a seat'}
                        {!ended && !isFull && <ArrowRight className="w-4 h-4 ml-1" />}
                      </Link>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
