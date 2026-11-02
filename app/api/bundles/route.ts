// Bundle list endpoint — GET /api/bundles
// Returns active bundles (BundleLanding promo data).
import { NextResponse } from 'next/server'
import { getActiveBundles } from '@/lib/server/bundles'

export const runtime = 'nodejs'

export async function GET() {
  const rows = await getActiveBundles()
  return NextResponse.json({
    bundles: rows.map((b) => ({
      id: b.id,
      slug: b.slug,
      name: b.name,
      tagline: b.tagline,
      description: b.description,
      price: b.price,
      anchorPrice: b.anchor_price,
      isActive: Boolean(b.is_active),
      coverImageUrl: b.cover_image_url,
    })),
  })
}
