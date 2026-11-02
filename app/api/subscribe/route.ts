// Subscription purchase initiation. Frontend contract of the approved
// /subscribe page is unchanged (link/txRef). Adds the reference audit trail:
// a pending `transactions` row (source:"subscribe", plan_id bound) that
// /api/payments/verify marks paid and /api/subscription-activate converts
// into a `subscriptions` row (120 s / 3 s polling contract preserved client-side).
import { NextRequest, NextResponse } from 'next/server'
import { createPendingSubscriptionTransaction, setTransactionResult } from '@/lib/server/enroll'
import { one } from '@/lib/server/sql'

export const runtime = 'nodejs'

const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY || ''

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, plan, txRef } = body

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
    }
    if (!plan) {
      return NextResponse.json({ error: 'Plan is required' }, { status: 400 })
    }

    const planRow = await one('SELECT * FROM subscription_plans WHERE code = ? LIMIT 1', [plan])
    // price_kes holds the ZMW-converted value (seed applies the KES→ZMW rate;
    // see docs/parity/phase-0-foundation.md Q5). Do not convert again.
    const amount = planRow ? Number(planRow.price_kes ?? 0) : null
    if (!amount) {
      return NextResponse.json({ error: 'Plan is required' }, { status: 400 })
    }

    const txRef2 = txRef || `learn2earn_${plan}_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`
    const normalizedEmail = String(email).trim().toLowerCase()

    let student = await one('SELECT * FROM students WHERE email = ? LIMIT 1', [normalizedEmail])
    if (!student) {
      // Signed-in buyers already have profiles; guest purchases keep
      // student_id null until account creation (reference checkout-auto-login).
      student = null
    }

    await createPendingSubscriptionTransaction({
      studentId: (student?.id as string) ?? null,
      email: normalizedEmail,
      fullName: String(body.fullName ?? ''),
      plan: planRow as unknown as Record<string, unknown>,
      amount,
      transactionReference: txRef2,
    })

    const paymentData = {
      tx_ref: txRef2,
      amount,
      currency: 'ZMW',
      redirect_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/payments/verify`,
      customer: {
        email: normalizedEmail,
        name: normalizedEmail.split('@')[0],
      },
      customizations: {
        title: 'Learn2Earn Membership',
        description: `Learn2Earn ${String(planRow?.name ?? plan)} membership`,
        logo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/images/logo.svg`,
      },
      meta: { plan_code: plan, customer_email: normalizedEmail },
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
        return NextResponse.json({ link: data.data.link, txRef: data.data.tx_ref || txRef2 })
      }
      await setTransactionResult(txRef2, 'failed')
      return NextResponse.json({ error: data.message || 'Payment initiation failed' }, { status: 400 })
    }

    // Demo mode — simulated link (approved demo behavior)
    return NextResponse.json({
      link: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/payments/verify?status=completed&tx_ref=${txRef2}&transaction_id=demo_${Date.now()}`,
      txRef: txRef2,
      demo: true,
    })
  } catch (error) {
    console.error('Payment initiation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
