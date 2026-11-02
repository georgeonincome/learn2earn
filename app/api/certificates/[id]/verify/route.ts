// Public certificate verification — DB-backed replacement for static SAMPLE_CERTIFICATES.
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyCertificate } from '@/lib/server/certificates'

export const runtime = 'nodejs'

export async function GET(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const result = await verifyCertificate(id)
  if (!result.found) return NextResponse.json({ found: false }, { status: 404 })
  return NextResponse.json(result)
}
