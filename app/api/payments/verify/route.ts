import { NextRequest, NextResponse } from 'next/server'

const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY || ''

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const txRef = searchParams.get('tx_ref')
    const transactionId = searchParams.get('transaction_id')

    if (status === 'cancelled') {
      return NextResponse.redirect(new URL('/checkout?error=cancelled', request.url))
    }

    // In production, verify with Flutterwave API
    if (FLW_SECRET_KEY && FLW_SECRET_KEY.startsWith('FLWSECK') && transactionId) {
      const response = await fetch(`https://api.flutterwave.com/v3/transactions/${transactionId}/verify`, {
        headers: {
          Authorization: `Bearer ${FLW_SECRET_KEY}`,
        },
      })

      const data = await response.json()
      
      if (data.status === 'success' && data.data.status === 'successful') {
        // Store payment in database
        // Redirect to success page
        return NextResponse.redirect(new URL('/dashboard?success=true', request.url))
      }
    }

    // Demo mode - accept all payments
    return NextResponse.redirect(new URL('/dashboard?success=true', request.url))
  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.redirect(new URL('/checkout?error=verification_failed', request.url))
  }
}
