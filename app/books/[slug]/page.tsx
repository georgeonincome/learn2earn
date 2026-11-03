import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Play, Star, ArrowRight, BookOpen, Download, FileText, ChevronRight, Check } from 'lucide-react'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const res = await fetch(`/api/books/${slug}`)
  if (!res.ok) return { title: 'Book Not Found' }
  const data = await res.json()
  const book = data.book
  if (!book) return { title: 'Book Not Found' }
  return {
    title: `${book.title} | Learn2Earn`,
    description: book.excerpt,
  }
}

export default async function BookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const res = await fetch(`/api/books/${slug}`, { cache: 'no-store' })
  if (!res.ok) notFound()
  const data = await res.json()
  const book = data.book
  if (!book) notFound()

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#10201A]">
      <header className="border-b border-[#E5E5E5] bg-white sticky top-0 z-40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-[#0B854C] hover:text-[#17A05D] cursor-pointer">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#1DB96B]">
              <BookOpen className="w-5 h-5 text-white" />
            </span>
            <span className="font-head font-extrabold text-[#111111]">Learn2Earn</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/books" className="text-sm font-medium text-[#737373] hover:text-[#0B854C] transition-colors">
              ← Back to Books
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1000px] px-4 sm:px-6 lg:px-8 py-8">
        <section className="mb-12">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="rounded-2xl overflow-hidden border border-[#E5E5E5] shadow-sm">
              <img src={book.image} alt={book.title} className="w-full h-[400px] object-cover" />
              <div className="absolute top-4 right-4">
                <span className="flex items-center gap-1 px-2 py-1 rounded bg-[#1DB96B] text-white text-xs font-bold">
                  {book.price === 0 ? 'Free' : `ZMW ${book.price.toLocaleString('en-ZM')}`}
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#0B854C] mb-3">{book.category}</p>
              <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight sm:text-4xl">{book.title}</h1>
              <p className="text-lg text-[#737373] mb-6">{book.excerpt}</p>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-bold text-[#0B854C] bg-[#E3F6EF] px-2 py-1 rounded">{book.category}</span>
                <span className="text-xs font-medium text-[#737373]">{book.pages} pages • {book.language} • {book.publishedDate ? new Date(book.publishedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}</span>
              </div>
              <div className="mb-6"><span className="text-2xl font-bold text-[#0B854C]">ZMW {book.price.toLocaleString('en-ZM')}</span>{book.originalPrice && book.originalPrice > book.price && <span className="ml-2 text-sm text-[#737373] line-through">ZMW {book.originalPrice.toLocaleString('en-ZM')}</span>}</div>
              <div className="flex gap-3">
                <Link href={`/books/${book.slug}/checkout`} className="flex-1 flex h-12 items-center justify-center gap-2 rounded-lg bg-[#1DB96B] text-[#111111] font-bold text-sm hover:bg-[#17A05D] transition-colors">
                  <Download className="w-4 h-4" /> Buy Now
                </Link>
                <Link href="/courses" className="flex h-12 items-center justify-center gap-2 rounded-lg border border-[#E5E5E5] text-sm font-bold text-[#111111] hover:bg-[#F3F4F6] transition-colors">Browse courses</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12"><h2 className="text-2xl font-bold text-[#111111] mb-6">Description</h2><div className="text-[#737373] text-lg leading-relaxed max-w-2xl">{book.description.split('\n\n').map((p: string, i: number) => <p key={i} className="mb-4">{p}</p>)}</div></section>

        {book.learningOutcomes && book.learningOutcomes.length > 0 && (
          <section className="mb-12"><h2 className="text-2xl font-bold text-[#111111] mb-6">What You'll Learn</h2><div className="space-y-4">{book.learningOutcomes.map((outcome: string, i: number) => <div key={i} className="flex items-start gap-3"><Check className="w-4 h-4 text-[#0B854C] flex-shrink-0 mt-1" /><p className="text-[#737373] text-sm">{outcome}</p></div>)}</div></section>
        )}
        {book.faqs && book.faqs.length > 0 && (
          <section className="mb-12"><h2 className="text-2xl font-bold text-[#111111] mb-6">Frequently Asked Questions</h2><div className="space-y-4">{book.faqs.map((faq: { question: string; answer: string }, i: number) => <details key={i} className="border border-[#E5E5E5] rounded-xl overflow-hidden"><summary className="list-none cursor-pointer px-4 py-3 text-sm font-medium text-[#111111] flex justify-between items-start transition-colors group-open:bg-[#F3F4F6]"><span>{faq.question}</span><span className="text-sm text-[#737373]">▾</span></summary><div className="px-4 pb-3 text-sm text-[#737373]">{faq.answer}</div></details>)}</div></section>
        )}
      </main>
    </div>
  )
}
