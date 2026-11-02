// Single bundle endpoint — GET /api/bundles/[slug]
// Returns the bundle plus its courses (ordered by position).
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getBundleBySlug } from '@/lib/server/bundles'

export const runtime = 'nodejs'

export async function GET(request: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params
  const bundle = await getBundleBySlug(slug)
  if (!bundle) return NextResponse.json({ error: 'Bundle not found' }, { status: 404 })
  return NextResponse.json({
    bundle: {
      id: bundle.id,
      slug: bundle.slug,
      name: bundle.name,
      tagline: bundle.tagline,
      description: bundle.description,
      price: bundle.price,
      anchorPrice: bundle.anchor_price,
      isActive: Boolean(bundle.is_active),
      coverImageUrl: bundle.cover_image_url,
      courses: bundle.courses,
    },
  })
}
