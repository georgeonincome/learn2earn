'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Play, Star, ArrowRight, BookOpen, Download, FileText } from 'lucide-react'
import { BOOKS } from '@/lib/books-data'
import { SITE_CONFIG } from '@/lib/data'

export default function BooksPage() {
  const [categoryFilter, setCategoryFilter] = useState('all')

  const categories = ['All', ...new Set(BOOKS.map(b => b.category))]

  const filteredBooks = categoryFilter === 'All'
    ? BOOKS
    : BOOKS.filter(b => b.category === categoryFilter)

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#10201A]">
      {/* Hero */}
      <section className="bg-[#0A0D14] text-white py-20 sm:py-28 px-4">
        <div className="mx-auto max-w-5xl text-center">
          <span className="inline-block text-xs font-extrabold uppercase tracking-[0.14em] text-[#1DB96B] bg-[#1DB96B]/20 px-3 py-1 rounded-full mb-4">
            E-Books
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-4">
            Downloadable E-Books
          </h1>
          <p className="text-lg text-[#A3A3A3] mb-8 max-w-xl mx-auto">
            Practical digital skills books by George J Kasonso. Instant PDF downloads. Learn at your own pace.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="#all-books"
              className="inline-flex h-12 items-center justify-center rounded-lg px-7 font-bold text-sm bg-[#1DB96B] text-[#111111] hover:bg-[#17A05D] transition-colors"
            >
              Browse Books <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-10 px-4">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  categoryFilter === cat
                    ? 'bg-[#1DB96B] text-white'
                    : 'bg-white border border-[#E5E5E5] text-[#737373] hover:bg-[#F3F4F6]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Books Grid */}
      <section id="all-books" className="py-20 sm:py-28 px-4">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] mb-12 text-center">
            Featured Books
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {filteredBooks.map((book, i) => (
              <div key={book.id} className="bg-white border border-[#E5E5E5] rounded-2xl p-6 hover:shadow-lg transition-all group">
                <div className="aspect-[3/4] rounded-xl bg-[#EEF1EE] overflow-hidden mb-4">
                  <Link href={`/books/${book.slug}`}>
                    <img
                      src={book.image}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </Link>
                </div>
                <span className="text-xs font-bold text-[#1DB96B] uppercase tracking-[0.1em] mb-2 block">
                  {book.category}
                </span>
                <h3 className="text-lg font-bold text-[#111111] mb-2">
                  {book.title}
                </h3>
                <p className="text-sm text-[#737373] mb-4">
                  {book.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-[#1DB96B]">
                    ZMW {book.price.toLocaleString('en-ZM')}
                  </span>
                  {book.originalPrice && book.originalPrice > book.price && (
                    <span className="text-sm text-[#737373] line-through">
                      ZMW {book.originalPrice.toLocaleString('en-ZM')}
                    </span>
                  )}
                </div>
                <Link
                  href={`/books/${book.slug}`}
                  className="flex items-center justify-center gap-2 rounded-lg bg-[#1DB96B] text-[#111111] font-bold text-sm py-2 mt-4 hover:bg-[#17A05D] transition-colors"
                >
                  Buy Now <ArrowRight className="w-3 h-3 ml-1" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 sm:py-28 px-4 bg-[#1DB96B] text-[#111111]">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-4">
            Why Learn2Earn Books?
          </h2>
          <p className="text-lg text-[#111111]/80 mb-8 max-w-xl mx-auto">
            Practical knowledge delivered instantly. Download and start learning immediately.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '📚', title: 'Instant Download', desc: 'Get immediate access after purchase.' },
              { icon: '📱', title: 'Any Device', desc: 'Read on phone, tablet, or computer.' },
              { icon: '💳', title: 'Mobile Money', desc: 'Pay with MTN, Airtel, or card.' },
            ].map((item, i) => (
              <div key={i}>
                <div className="w-12 h-12 rounded-full bg-white text-[#1DB96B] flex items-center justify-center mx-auto mb-4 text-xl">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-[#111111]/80">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}