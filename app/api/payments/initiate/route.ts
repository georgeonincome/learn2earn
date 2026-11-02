// Initiate a payment. Reference flow: the checkout collects product + buyer,
// payment runs, then the server writes the `transactions` audit row and
// auto-enrolls / activates on success. Mirrored here with Flutterwave:
//   1. Insert the pending `transactions` row at initiation (payment_status "pending",
//      bound to the signed-in student when there is one — the reference checkout
//      signs the buyer in before payment; its `checkout-auto-login` UX is Phase 3)
//   2. Return the payment link; verification happens in /api/payments/verify
// This route's frontend contract (link/txRef/demo) is unchanged.
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/server/auth'
import { getStudentByUserId } from '@/lib/server/students'
import {
  createPendingCourseTransaction,
  createPendingCohortTransaction,
  createPendingSubscriptionTransaction,
} from '@/lib/server/enroll'
import { createPendingBundleTransaction } from '@/lib/server/bundles'
import { one } from '@/lib/server/sql'
import { toZMW } from '@/lib/config'

export const runtime = 'nodejs'

const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY || ''

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, itemId, txRef } = body

    if (!type || !itemId) {
      return NextResponse.json({ error: 'type and itemId are required' }, { status: 400 })
    }

    const reference =
      txRef || `learn2earn_${type}_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`

    const user = await getCurrentUser()
    const student = user ? await getStudentByUserId(user.id) : null
    const buyerEmail = (student?.email as string) ?? user?.email ?? String(body.email ?? '').trim().toLowerCase()
    const buyerName = (student?.full_name as string) ?? String(body.fullName ?? '').trim()

    let amount = 0
    let itemName = ''

    if (type === 'course') {
      const course = await one('SELECT * FROM courses WHERE id = ? LIMIT 1', [itemId])
      if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 })
      amount = toZMW(Number(course.price ?? 0))
      itemName = String(course.title ?? '')
      await createPendingCourseTransaction({
        studentId: (student?.id as string) ?? null,
        email: buyerEmail,
        fullName: buyerName,
        course: course as unknown as Record<string, unknown>,
        amount,
        transactionReference: reference,
      })
    } else if (type === 'cohort') {
      const cohort = await one('SELECT * FROM cohorts WHERE id = ? LIMIT 1', [itemId])
      if (!cohort) return NextResponse.json({ error: 'Cohort not found' }, { status: 404 })
      amount = toZMW(Number(cohort.price ?? 0))
      itemName = String(cohort.title ?? '')
      await createPendingCohortTransaction({
        studentId: (student?.id as string) ?? null,
        email: buyerEmail,
        fullName: buyerName,
        cohort: cohort as unknown as Record<string, unknown>,
        amount,
        transactionReference: reference,
      })
    } else if (type === 'bundle') {
      // Bundles are seeded in ZMW already — no KES conversion.
      const bundle = await one('SELECT * FROM bundles WHERE id = ? OR slug = ? LIMIT 1', [itemId, itemId])
      if (!bundle) return NextResponse.json({ error: 'Bundle not found' }, { status: 404 })
      amount = Number(bundle.price ?? 0)
      itemName = String(bundle.name ?? 'Bundle')
      await createPendingBundleTransaction({
        studentId: (student?.id as string) ?? null,
        email: buyerEmail,
        fullName: buyerName,
        bundle: bundle as unknown as import('@/lib/server/bundles').BundleRow,
        amount,
        transactionReference: reference,
      })
    } else if (type === 'membership') {
      const plan = await one('SELECT * FROM subscription_plans WHERE id = ? LIMIT 1', [itemId])
      if (!plan) return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
      amount = toZMW(Number(plan.price_kes ?? 0))
      itemName = String(plan.name ?? 'Membership')
      await createPendingSubscriptionTransaction({
        studentId: (student?.id as string) ?? null,
        email: buyerEmail,
        fullName: buyerName,
        plan: plan as unknown as Record<string, unknown>,
        amount,
        transactionReference: reference,
      })
    } else {
      return NextResponse.json({ error: 'Unknown payment type' }, { status: 400 })
    }

    const paymentData = {
      tx_ref: reference,
      amount,
      currency: 'ZMW',
      redirect_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/payments/verify`,
      customer: {
        email: buyerEmail,
        name: buyerName || buyerEmail.split('@')[0],
      },
      customizations: {
        title: 'Learn2Earn',
        description: itemName,
        logo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/images/logo.svg`,
      },
      meta: { item_type: type, item_id: String(itemId), customer_email: buyerEmail },
    }

    if (FLW_SECRET_KEY && FLW_SECRET_KEY.startsWith('FLWSECK')) {
      const response = await fetch('https://api.flutterwave.com/v3/payments', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${FLW_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      })
      const data = await response.json()
      if (data.status === 'success' && data.data?.link) {
        return NextResponse.json({ link: data.data.link, txRef: data.data.tx_ref || reference })
      }
      return NextResponse.json({ error: data.message || 'Payment initiation failed' }, { status: 400 })
    }

    // Demo mode — simulated link (existing approved-flow behavior)
    return NextResponse.json({
      link: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/payments/verify?status=completed&tx_ref=${reference}&transaction_id=demo_${Date.now()}`,
      txRef: reference,
      demo: true,
    })
  } catch (error) {
    console.error('Payment initiation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
