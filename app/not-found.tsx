import Link from 'next/link'
import { Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAFAFA' }}>
      <div className="text-center">
        <Search className="w-10 h-10 text-[#1DB96B] mb-4" />
        <h1 className="text-4xl font-extrabold text-[#111111] mb-2">404</h1>
        <h2 className="text-xl font-bold text-[#111111] mb-4">Page not found</h2>
        <p className="text-[#737373] mb-8">We couldn&apos;t find that page.</p>
        <Link
          href="/courses"
          className="inline-flex h-12 items-center justify-center rounded-xl px-6 font-bold text-sm transition-colors"
          style={{ backgroundColor: '#1DB96B', color: '#111111' }}
        >
          Browse courses
        </Link>
      </div>
    </div>
  )
}
