// Bundle purchase lookup — GET /api/bundles/purchase/[reference]
// Powers BundleSuccess-Cc7dTlqs.js: transaction status + bundle + course list.
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getBundlePurchaseByReference } from '@/lib/server/bundles'

export const runtime = 'nodejs'

export async function GET(request: NextRequest, ctx: { params: Promise<{ reference: string }> }) {
  const { reference } = await ctx.params
  const purchase = await getBundlePurchaseByReference(reference)
  if (!purchase) return NextResponse.json({ error: 'Bundle purchase not found' }, { status: 404 })
  return NextResponse.json({
    status: purchase.transaction.status,
    reference: purchase.transaction.reference,
    amount: purchase.transaction.amount,
    studentName: purchase.transaction.studentName,
    studentEmail: purchase.transaction.studentEmail,
    bundle: {
      id: purchase.bundle.id,
      slug: purchase.bundle.slug,
      name: purchase.bundle.name,
      tagline: purchase.bundle.tagline,
      price: purchase.bundle.price,
      anchorPrice: purchase.bundle.anchor_price,
    },
    courses: purchase.courses,
  })
}
