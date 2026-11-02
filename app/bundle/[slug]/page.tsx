import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getBundleBySlug } from '@/lib/server/bundles'
import { BundleLanding } from '@/components/bundle/BundleLanding'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const bundle = await getBundleBySlug(slug)
  if (!bundle) return { title: 'Bundle not found' }
  return {
    title: `${bundle.name} | Learn2Earn`,
    description: bundle.description ?? bundle.tagline ?? `Get ${bundle.name} — one payment, lifetime access.`,
  }
}

export default async function BundlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const bundle = await getBundleBySlug(slug)
  if (!bundle || !bundle.is_active) notFound()

  return (
    <BundleLanding
      bundle={{
        id: bundle.id,
        slug: bundle.slug,
        name: bundle.name,
        tagline: bundle.tagline,
        description: bundle.description,
        price: bundle.price,
        anchor_price: bundle.anchor_price,
        courses: bundle.courses,
      }}
    />
  )
}
