import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getCourseBySlug } from '@/lib/server/courses'

export const runtime = 'nodejs'

export async function GET(request: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params
  const course = await getCourseBySlug(slug)
  if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 })
  return NextResponse.json({ course })
}
