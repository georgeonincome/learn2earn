'use client'

/**
 * Search results — reference SearchResults page.
 * Search courses and content across Learn2Earn.
 */

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Search, ChevronRight } from 'lucide-react'

export default function SearchPage({ searchParams }: { searchParams: { [key: string]: string } }) {
  const [query, setQuery] = useState(searchParams.q || '')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query) return
    let cancelled = false
    setLoading(true)
    fetch(`/api/courses?search=${encodeURIComponent(query)}`)
      .then((r) => r.ok ? r.json() : [])
      .then((data: any) => { if (!cancelled) setResults(data ?? []) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [query])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Search results</h1>
          <p className="text-[#737373] text-sm mt-1">{query ? `Results for “${query}”` : 'Search courses and content.'}</p>
        </div>
      </div>

      <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -mt-2.5 h-4 w-4 text-[#737373]" />
          <input
            className="w-full rounded-md border border-[#E5E5E5] pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1DB96B]"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search courses…"
          />
        </div>
      </div>

      {loading && <div className="text-center py-10 text-[#737373] text-sm">Searching…</div>}

      {!loading && results.length === 0 && query && (
        <div className="text-center py-10 text-[#737373]">No results for “{query}”.</div>
      )}

      {!loading && results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((c: any) => (
            <div key={c.id} className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-4">
              <h3 className="font-semibold">{c.title}</h3>
              <p className="text-xs text-[#737373]">{c.description ?? ''}</p>
              <Link href={`/courses/${c.slug}`} className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#0B854C] hover:underline">
                Open course <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
