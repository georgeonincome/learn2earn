// Book checkout — server shell.
// Route: /books/[slug]/checkout
// The page previously called useState/useEffect inside an `async` component
// (invalid React — hooks only run in client components). Fixed: the page
// resolves the book server-side via lib/server/books and renders the client
// BookCheckoutForm. Structure (chant + form + manual-payment card) mirrored
// from the original Phase 3 port of the reference book checkout.
import type { Metadata } from 'next'
import Link from 'next/link'
import { getBookBySlug, getBookById } from '@/lib/server/books'
import { BookCheckoutForm } from '@/components/books/BookCheckoutForm'

export const runtime = 'nodejs'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  return { title: `Checkout — ${slug} | Learn2Earn` }
}

export default async function BookCheckoutPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  // Accept slug or UUID (same contract as Phase 3 book_purchase flow)
  const book = await getBookBySlug(slug) ?? await getBookById(slug)
  if (!book) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] text-[#111111] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#111111] mb-2">Book Not Found</h1>
          <Link href="/books" className="text-[#0B854C] font-medium hover:text-[#17A05D]">
            Browse Books
          </Link>
        </div>
      </div>
    )
  }

  return (
    <BookCheckoutForm
      book={{
        id: book.id,
        slug: book.slug,
        title: book.title,
        category: book.category,
        price: book.price,
        image: book.image,
      }}
    />
  )
}
