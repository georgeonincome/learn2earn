// Funnel data — GET /api/funnels/[slug]
// DB row from course_funnels when present (is_active=1), null otherwise.
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getFunnelBySlugWithCourse } from '@/lib/server/funnels'

export const runtime = 'nodejs'

export async function GET(request: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params
  const db = await getFunnelBySlugWithCourse(slug)
  if (!db) return NextResponse.json({ funnel: null }, { status: 404 })
  return NextResponse.json({
    funnel: {
      id: db.funnel.id,
      slug: db.funnel.slug,
      headline: db.funnel.headline,
      subheadline: db.funnel.subheadline,
      description: db.funnel.description,
      ctaText: db.funnel.cta_text,
      heroImageUrl: db.funnel.hero_image_url,
      benefits: db.funnel.benefits,
      testimonials: db.funnel.testimonials,
      isActive: Boolean(db.funnel.is_active),
      courseId: db.courseId,
      courseSlug: db.courseSlug,
    },
  })
}
