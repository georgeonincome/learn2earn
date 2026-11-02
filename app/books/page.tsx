'use client'

/**
 * Books catalog — DB-backed (Phase 3).
 * Fetches books from /api/books instead of static BOOKS import.
 * Same view sequence as /courses and /cohorts:
 * pill tabs (books active) → title + search → category chips → count → grid.
 */

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, X, ArrowRight, BookOpen } from 'lucide-react'
import CatalogTabs from '@/components/catalog/CatalogTabs'

const C = {
  pageBg: '#FAFAFA',
  surface: '#FFFFFF',
  border: '#E5E5E5',
  shadow: '0 2px 8px rgba(0,0,0,0.06)',
  primary: '#1DB96B',
  badgeBg: '#E8F8F0',
  badgeText: '#0F7A42',
  text: '#111111',
  textSecondary: '#404040',
  textMuted: '#737373',
  radiusCard: 12,
  radiusBtn: 8,
  radiusPill: 9999,
}

const SORTS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
] as const

type SortValue = (typeof SORTS)[number]['value']

const fmtZMW = (n?: number | null) => (n == null ? '' : `ZMW ${n.toLocaleString('en-ZM')}`)

interface Book {
  id: string
  slug: string
  title: string
  author: string
  description: string
  excerpt: string
  price: number
  originalPrice: number | null
  category: string
  tags: string[]
  image: string
  pdfUrl: string | null
  pages: number | null
  language: string
  publishedDate: string | null
  featured: boolean
  inPlan: boolean
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [debounced, setDebounced] = useState('')
  const [category, setCategory] = useState('all')
  const [sort, setSort] = useState<SortValue>('newest')

  useEffect(() => {
    fetch('/api/books')
      .then((r) => r.json())
      .then((data) => { setBooks(data.books ?? []); setLoading(false) })
      .catch((err) => { console.error('[BooksPage] load error', err); setLoading(false) })
  }, [])

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 250)
    return () => clearTimeout(t)
  }, [query])

  const countsByCategory = useMemo(() => {
    const map = new Map<string, number>()
    for (const b of books) map.set(b.category, (map.get(b.category) ?? 0) + 1)
    return map
  }, [books])

  const filtered = useMemo(() => {
    let list = [...books]
    if (debounced.trim()) {
      const q = debounced.toLowerCase()
      list = list.filter(b => (b.title + ' ' + (b.description ?? '')).toLowerCase().includes(q))
    }
    if (category !== 'all') list = list.filter(b => b.category === category)
    switch (sort) {
      case 'price_asc':
        list.sort((a, b) => a.price - b.price)
        break
      case 'price_desc':
        list.sort((a, b) => b.price - a.price)
        break
      default:
        list.sort((a, b) => a.title.localeCompare(b.title))
    }
    return list
  }, [books, debounced, category, sort])

  if (loading) {
    return (
      <div className="min-h-screen font-sans" style={{ background: C.pageBg, color: C.text }}>
        <main className="pt-28 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
            <div className="text-center py-20 text-[#737373] text-sm">Loading books…</div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen font-sans" style={{ background: C.pageBg, color: C.text }}>
      <main className="pt-28 pb-16">
        {/* Tabs row */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 mb-6">
          <CatalogTabs active="books" />
          <p className="text-xs mt-2" style={{ color: C.textMuted }}>
            <strong style={{ color: C.textSecondary, fontWeight: 500 }}>Books</strong> = instant PDF downloads,
            study at your own pace.
          </p>
        </div>

        {/* Title + search */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 mb-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h1 className="text-2xl lg:text-3xl font-bold" style={{ color: C.text }}>
              Browse E-Books
            </h1>
            <div className="flex items-center">
              <input
                autoFocus
                type="text"
                placeholder="Search books..."
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

        {/* Category chips + sort */}
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
                  fontWeight: category === 'all' ? 500 : 400, minHeight: 40, cursor: 'pointer',
                }}
              >
                All ({books.length})
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
                    fontWeight: category === name ? 500 : 400, minHeight: 40, cursor: 'pointer',
                  }}
                >
                  {name} ({count})
                </button>
              ))}
            </div>
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

        {/* Count */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 mb-5">
          <p className="text-sm" style={{ color: C.textMuted }}>
            {filtered.length} {filtered.length === 1 ? 'book' : 'books'}
          </p>
        </div>

        {/* Grid — same card style as /courses */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 20 }}>
            {filtered.map(b => {
              const showSave = !!b.originalPrice && b.originalPrice > b.price
              const savePct = showSave && b.originalPrice ? Math.round(((b.originalPrice - b.price) / b.originalPrice) * 100) : 0

              return (
                <article
                  key={b.slug}
                  style={{
                    background: C.surface, border: `1px solid ${C.border}`,
                    borderRadius: C.radiusCard, boxShadow: C.shadow,
                    overflow: 'hidden', transition: 'box-shadow 150ms ease, transform 150ms ease',
                  }}
                  className="hover:-translate-y-0.5 hover:shadow-md"
                >
                  <Link href={`/books/${b.slug}`}>
                    <div className="relative w-full aspect-square" style={{ background: '#EEF1EE' }}>
                      <Image
                        src={b.image}
                        alt={b.title}
                        fill
                        className="object-cover"
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 100vw"
                      />
                      <div className="absolute top-2 right-2">
                        <span
                          className="inline-flex items-center px-2.5 py-1 text-[11px] font-medium"
                          style={{ background: C.badgeBg, color: C.badgeText, borderRadius: C.radiusPill }}
                        >
                          PDF · {b.pages ?? 0} pages
                        </span>
                      </div>
                    </div>
                  </Link>
                  <div className="p-4">
                    <p className="text-xs font-semibold mb-1" style={{ color: C.primary }}>
                      {b.category}
                    </p>
                    <Link href={`/books/${b.slug}`}>
                      <h3 className="font-bold text-sm leading-snug line-clamp-2" style={{ color: C.text }}>
                        {b.title}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-2 text-xs flex-wrap mt-2 mb-3" style={{ color: C.textSecondary }}>
                      <span style={{ color: C.textMuted }}>· {b.author}</span>
                    </div>
                    {/* price row */}
                    <div className="flex items-center gap-2 flex-wrap mb-3">
                      <span className="text-lg font-medium" style={{ color: C.primary }}>
                        {b.price === 0 ? 'Free' : fmtZMW(b.price)}
                      </span>
                      {showSave && (
                        <>
                          <span className="text-sm line-through" style={{ color: C.textMuted }} aria-hidden="true">
                            {fmtZMW(b.originalPrice)}
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
                    {/* action */}
                    <Link
                      href={`/books/${b.slug}`}
                      className="inline-flex items-center justify-center gap-1.5 w-full text-sm font-semibold transition-colors"
                      style={{ minHeight: 44, borderRadius: C.radiusBtn, background: C.primary, color: '#fff', border: `1px solid ${C.primary}`, padding: '0 18px' }}
                    >
                      View book · {fmtZMW(b.price)} <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20" style={{ color: C.textMuted }}>
              <BookOpen className="w-10 h-10 mx-auto mb-4" style={{ color: C.textMuted }} />
              <p className="font-semibold" style={{ color: C.text }}>No books match your filters</p>
              <p className="text-sm mt-2">Try clearing the search or picking another category.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
