'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, X, ArrowRight, Check, BookOpen, Lock, ChevronRight } from 'lucide-react'
import { COURSES, MEMBERSHIP_PLANS } from '@/lib/data'
import { BOOKS } from '@/lib/books-data'
import type { Course } from '@/lib/types'
import CatalogTabs from '@/components/catalog/CatalogTabs'
import SubscriptionModal from '@/components/catalog/SubscriptionModal'

/* Courses catalog — exact 1:1 from click2skill CourseCatalog-CSQkCmX2.js + shared-BssGVXN1.js:
   - Pill tabs for Courses/Cohorts
   - Category chips with counts
   - All/Free/Paid toggle
   - Debounced search, sort, auto-fill grid
   - Square thumbnails with real category images
   - Price with savings, subscribe button (opens modal), buy button
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
  radiusCard: 12,
  radiusBtn: 8,
  radiusPill: 9999,
}

/* Map categories to representative images */
const CATEGORY_IMAGES: Record<string, string> = {
  'AI Productivity': '/images/gallery-8.jpg',
  'Web Design': '/images/gallery-7.jpg',
  'Business': '/images/speaking.jpg',
  'Video Editing': '/images/gallery-3.jpg',
  'Freelancing': '/images/office.jpg',
  'Content Creation': '/images/live_teaching.jpg',
  'Other': '/images/teaching.jpg',
}

function getCategoryImage(category: string): string {
  return CATEGORY_IMAGES[category] ?? CATEGORY_IMAGES['Other']
}

const SORTS = [
  { value: 'popular', label: 'Most popular' },
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
] as const

type SortValue = (typeof SORTS)[number]['value']

const PER_PAGE = 24

const fmtZMW = (n?: number) => (n == null ? '' : `ZMW ${n.toLocaleString('en-ZM')}`)

export default function CoursesPage() {
  const [courses] = useState<Course[]>(COURSES as unknown as Course[])
  const [query, setQuery] = useState('')
  const [debounced, setDebounced] = useState('')
  const [category, setCategory] = useState('all')
  const [paidFilter, setPaidFilter] = useState<'all' | 'free' | 'paid'>('all')
  const [sort, setSort] = useState<SortValue>('popular')
  const [limit, setLimit] = useState(PER_PAGE)
  const [subscribeModal, setSubscribeModal] = useState<{ open: boolean; course?: Course }>({ open: false })

  useMemo(() => {
    const t = setTimeout(() => setDebounced(query), 250)
    return () => clearTimeout(t)
  }, [query])

  const countsByCategory = useMemo(() => {
    const map = new Map<string, number>()
    for (const c of courses) {
      const key = c.category ?? 'Other'
      map.set(key, (map.get(key) ?? 0) + 1)
    }
    return map
  }, [courses])

  const filtered = useMemo(() => {
    let list = [...courses]
    if (debounced.trim()) {
      const q = debounced.toLowerCase()
      list = list.filter(c => (c.title + ' ' + (c.description ?? '')).toLowerCase().includes(q))
    }
    if (category !== 'all') list = list.filter(c => (c.category ?? 'Other') === category)
    if (paidFilter === 'free') list = list.filter(c => c.price === 0)
    if (paidFilter === 'paid') list = list.filter(c => c.price > 0)
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
        break // popular = data order
    }
    return list
  }, [courses, debounced, category, paidFilter, sort])

  const visible = filtered.slice(0, limit)
  const hasMore = filtered.length > limit

  return (
    <div className="min-h-screen font-sans" style={{ background: C.pageBg, color: C.text }}>
      <main className="pt-28 pb-16">
        {/* Tabs row */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 mb-6">
          <CatalogTabs active="courses" />
          <p className="text-xs mt-2" style={{ color: C.textMuted }}>
            <strong style={{ color: C.textSecondary, fontWeight: 500 }}>Courses</strong> = self-paced learning.{' '}
            <strong style={{ color: C.textSecondary, fontWeight: 500 }}>Cohorts</strong> = live, group-based programs with deadlines.
          </p>
        </div>

        {/* Title + search */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 mb-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h1 className="text-2xl lg:text-3xl font-bold" style={{ color: C.text }}>
              Browse Courses
            </h1>
            <div className="flex items-center">
              <input
                autoFocus
                type="text"
                placeholder="Search courses..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="text-sm focus:outline-none w-48 sm:w-64"
                style={{
                  minHeight: 44,
                  padding: '0 14px',
                  borderRadius: C.radiusBtn,
                  background: C.surface,
                  border: `1px solid ${C.border}`,
                  color: C.text,
                }}
              />
              {query ? (
                <button
                  onClick={() => setQuery('')}
                  className="p-2"
                  style={{ color: C.textSecondary }}
                  aria-label="Clear search"
                >
                  <X className="w-5 h-5" />
                </button>
              ) : (
                <span className="p-2" style={{ color: C.textMuted }}>
                  <Search className="w-5 h-5" />
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Category chips + paid toggle */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 mb-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-hide w-full sm:w-auto -mx-1 px-1">
              <button
                onClick={() => setCategory('all')}
                className="shrink-0 text-sm transition-colors"
                style={{
                  padding: '8px 16px', borderRadius: C.radiusPill,
                  background: category === 'all' ? C.primary : '#fff',
                  color: category === 'all' ? '#fff' : C.text,
                  border: `1px solid ${category === 'all' ? C.primary : C.border}`,
                  fontWeight: category === 'all' ? 500 : 400, minHeight: 40, cursor: 'pointer'
                }}
              >
                All ({courses.length})
              </button>
              {[...countsByCategory.entries()].map(([name, count]) => (
                <button
                  key={name}
                  onClick={() => setCategory(name)}
                  className="shrink-0 text-sm transition-colors"
                  style={{
                    padding: '8px 16px', borderRadius: C.radiusPill,
                    background: category === name ? C.primary : '#fff',
                    color: category === name ? '#fff' : C.text,
                    border: `1px solid ${category === name ? C.primary : C.border}`,
                    fontWeight: category === name ? 500 : 400, minHeight: 40, cursor: 'pointer'
                  }}
                >
                  {name} ({count})
                </button>
              ))}
            </div>
            <div
              className="inline-flex p-1 gap-1"
              style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 999 }}
            >
              {(['all', 'free', 'paid'] as const).map(v => (
                <button
                  key={v}
                  onClick={() => setPaidFilter(v)}
                  className="text-sm capitalize transition-colors"
                  style={{
                    padding: '6px 14px', borderRadius: 999,
                    background: paidFilter === v ? C.primary : 'transparent',
                    color: paidFilter === v ? '#fff' : C.textSecondary,
                    fontWeight: paidFilter === v ? 500 : 400, border: 'none',
                    minHeight: 36, cursor: 'pointer',
                  }}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Count + sort */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 mb-5">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <p className="text-sm" style={{ color: C.textMuted }}>
              {filtered.length} {filtered.length === 1 ? 'course' : 'courses'}
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
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Membership banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 mb-4">
          <div
            className="rounded-xl px-4 py-3 text-[12.5px] font-semibold"
            style={{ background: '#F3FBF6', border: '1px solid #C7EEDA', color: '#17A05D' }}
          >
            {MEMBERSHIP_PLANS[1].name} from {fmtZMW(MEMBERSHIP_PLANS[0].price)} · everything unlocked.{' '}
            <Link href="/subscribe" className="underline">
              Get membership →
            </Link>
          </div>
        </div>

        {/* Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 20 }}>
            {visible.map(c => {
              const refSale = c.referenceSale
              const eff = refSale ?? c.price
              const showSave = refSale != null && refSale < c.price
              const savePct = showSave ? Math.round(((c.price - refSale) / c.price) * 100) : 0
              const isNew = (added: string) => {
                if (!added) return false
                const d = new Date(added)
                const cutoff = new Date()
                cutoff.setDate(cutoff.getDate() - 30)
                return d > cutoff
              }

              return (
                <article
                  key={c.slug}
                  style={{
                    background: C.surface, border: `1px solid ${C.border}`,
                    borderRadius: C.radiusCard, boxShadow: C.shadow,
                    overflow: 'hidden', transition: 'box-shadow 150ms ease, transform 150ms ease',
                  }}
                  className="hover:-translate-y-0.5 hover:shadow-md"
                >
                  {/* Thumbnail with real image */}
                  <Link href={`/courses/${c.slug}`}>
                    <div className="relative w-full aspect-square" style={{ background: '#EEF1EE' }}>
                      <Image
                        src={getCategoryImage(c.category ?? 'Other')}
                        alt={c.title}
                        fill
                        className="object-cover"
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 100vw"
                      />
                      <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                      {/* NEW badge (reference: new within 30 days of addedDate) */}
                      {c.featured && c.addedDate && isNew(c.addedDate) && (
                        <span
                          className="inline-flex items-center px-2.5 py-1 text-[11px] font-medium"
                          style={{ background: C.primary, color: '#fff', borderRadius: C.radiusPill }}
                        >
                          NEW
                        </span>
                      )}
                      </div>
                    </div>
                  </Link>
                  {/* body */}
                  <div className="p-4">
                    <p className="text-xs font-semibold mb-1" style={{ color: C.primary }}>
                      {c.category ?? 'Course'} · {c.format ?? 'Self-paced'}
                    </p>
                    <Link href={`/courses/${c.slug}`}>
                      <h3 className="font-bold text-sm leading-snug line-clamp-1" style={{ color: C.text }}>
                        {c.title}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-2 text-xs flex-wrap mt-1 mb-2" style={{ color: C.textMuted }}>
                      {c.enrolled && c.enrolled > 0 && (
                        <span>{c.enrolled} enrolled</span>
                      )}
                      <span>Added {c.addedDate}</span>
                    </div>
                    {/* price row */}
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className="text-lg font-medium" style={{ color: C.primary }}>
                        {eff === 0 ? 'Free' : fmtZMW(eff)}
                      </span>
                      {showSave && (
                        <>
                          <span className="text-sm line-through" style={{ color: C.textMuted }} aria-hidden="true">
                            {fmtZMW(c.price)}
                          </span>
                          <span
                            className="text-[11px] font-medium px-2 py-0.5"
                            style={{ background: C.badgeBg, color: C.badgeText, borderRadius: C.radiusPill }}
                          >
                            Save {savePct}%
                          </span>
                        </>
                      )}
                    </div>
                    {/* Subscribe button (opens subscription modal) */}
                    {c.inPlan && (
                      <button
                        type="button"
                        onClick={() => setSubscribeModal({ open: true, course: c })}
                        className="inline-flex w-full items-center justify-center gap-1.5 mt-1 text-sm font-semibold transition-colors"
                        style={{ minHeight: 40, borderRadius: C.radiusBtn, background: '#F3FBF6', color: C.primary, border: `1px solid ${C.primary}`, padding: '0 18px' }}
                      >
                        <Lock className="w-3 h-3" /> Subscribe · from {fmtZMW(c.monthlySubPrice)}/mo
                      </button>
                    )}
                    {/* action */}
                    <Link
                      href={`/checkout?course=${c.slug}`}
                      className="inline-flex w-full items-center justify-center gap-1.5 mt-1 text-sm font-semibold transition-colors"
                      style={{ minHeight: 44, borderRadius: C.radiusBtn, background: C.primary, color: '#fff', border: `1px solid ${C.primary}`, padding: '0 18px' }}
                    >
                      Buy this course · {fmtZMW(eff)} <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>

          {hasMore && (
            <div className="mt-10 text-center">
              <button
                onClick={() => setLimit(l => l + PER_PAGE)}
                className="inline-flex items-center gap-2 text-sm font-semibold px-6"
                style={{ minHeight: 44, borderRadius: C.radiusBtn, background: '#fff', color: C.text, border: `1px solid ${C.border}`, cursor: 'pointer' }}
              >
                Show more <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {visible.length === 0 && (
            <div className="text-center py-20" style={{ color: C.textMuted }}>
              <BookOpen className="w-10 h-10 mx-auto mb-4" style={{ color: C.textMuted }} />
              <p className="font-semibold" style={{ color: C.text }}>No courses match your filters</p>
              <p className="text-sm mt-2">Try clearing the search or picking another category.</p>
            </div>
          )}
        </div>
      </main>

      {/* Subscription modal */}
      {subscribeModal.open && subscribeModal.course && (
        <SubscriptionModal
          course={subscribeModal.course}
          onClose={() => setSubscribeModal({ open: false })}
        />
      )}
    </div>
  )
}
