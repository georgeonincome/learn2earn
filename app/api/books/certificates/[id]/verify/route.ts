// Verify a book certificate — public endpoint.
// Route: GET /api/books/certificates/[id]/verify
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyBookCertificate } from '@/lib/server/books'

export const runtime = 'nodejs'

export async function GET(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const result = await verifyBookCertificate(id)
  if (!result.found) return NextResponse.json({ found: false }, { status: 404 })
  return NextResponse.json(result)
}
