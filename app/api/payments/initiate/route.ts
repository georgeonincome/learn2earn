import { NextRequest, NextResponse } from 'next/server'

const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY || ''
const FLW_PUBLIC_KEY = process.env.FLW_PUBLIC_KEY || ''

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, amount, type, itemId, planId } = body

    // Validate required fields
    if (!name || !email || !phone || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const txRef = `learn2earn_${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const paymentData = {
      tx_ref: txRef,
      amount: amount,
      currency: 'ZMW',
      redirect_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/payments/verify`,
      customer: {
        email: email,
        phonenumber: phone,
        name: name,
      },
      customizations: {
        title: 'Learn2Earn Courses',
        description: `Payment for ${type}${planId ? ' plan' : ''}`,
        logo: 'https://learn2earn.co.zm/images/logo.svg',
      },
      meta: {
        type: type,
        itemId: itemId || '',
        planId: planId || '',
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
      },
    }

    // In production, make actual Flutterwave API call
    // For now, return a demo link
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
      
      if (data.status === 'success') {
        return NextResponse.json({ link: data.data.link, txRef })
      }
      
      return NextResponse.json(
        { error: data.message || 'Payment initiation failed' },
        { status: 400 }
      )
    }

    // Demo mode - return a simulated payment link
    return NextResponse.json({
      link: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/payments/verify?status=completed&tx_ref=${txRef}&transaction_id=demo_${Date.now()}`,
      txRef,
      demo: true,
    })
  } catch (error) {
    console.error('Payment initiation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
