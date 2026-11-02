// List published books (DB-backed; replaces static BOOKS import).
import { NextResponse } from 'next/server'
import { getBooks } from '@/lib/server/books'

export const runtime = 'nodejs'

export async function GET() {
  const books = await getBooks()
  return NextResponse.json({ books })
}
