// Book detail by slug.
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getBookBySlug } from '@/lib/server/books'

export const runtime = 'nodejs'

export async function GET(request: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params
  const book = await getBookBySlug(slug)
  if (!book) return NextResponse.json({ error: 'Book not found' }, { status: 404 })
  return NextResponse.json({ book })
}
