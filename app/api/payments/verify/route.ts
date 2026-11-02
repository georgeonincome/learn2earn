// Verify a payment — hooks the approved checkout/subscription UIs.
// Reference sequence on payment success:
//   transactions.payment_status → "paid"  (audit trail complete)
//   enrollments / cohort_enrollments / subscriptions materialize ("auto enrolled")
//   notification events fire (receipt + admin enrollment notification)
// Flutterwave verification when keys are present; demo-mode parity otherwise.
import { NextRequest, NextResponse } from 'next/server'
import { setTransactionResult, autoEnrollOnPaymentSuccess } from '@/lib/server/enroll'

export const runtime = 'nodejs'

const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY || ''

export async function POST(request: NextRequest) {
  return handle(new URL(request.url))
}

export async function GET(request: NextRequest) {
  return handle(new URL(request.url))
}

async function handle(url: URL) {
  try {
    const txRef = String(url.searchParams.get('tx_ref') ?? '')
    const transactionId = String(url.searchParams.get('transaction_id') ?? '')
    const statusParam = url.searchParams.get('status') // demo-mode completion jump
    const completed = statusParam === 'completed'

    if (!txRef && !transactionId) {
      return NextResponse.json({ error: 'Transaction reference is required' }, { status: 400 })
    }
    if (!txRef) {
      return NextResponse.json({ error: 'txRef is required to match the audit trail' }, { status: 400 })
    }

    let gatewayStatus: string
    let gatewayTxId: string | null = transactionId || null
    let amount: number | null = null
    let currency: string | null = null

    if (process.env.FLW_SECRET_KEY && FLW_SECRET_KEY.startsWith('FLWSECK')) {
      const verifyUrl = txRef
        ? `https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${txRef}`
        : `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`
      const response = await fetch(verifyUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${FLW_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      })
      const data = (await response.json()) as {
        status?: string
        data?: { status?: string; id?: number; tx_ref?: string; amount?: number; currency?: string }
      }
      gatewayStatus = data.status === 'success' && data.data?.status === 'successful' ? 'completed' : (data.data?.status ?? 'pending')
      gatewayTxId = data.data?.id ? String(data.data.id) : gatewayTxId
      amount = data.data?.amount ?? null
      currency = data.data?.currency ?? null
    } else {
      // Demo mode — payment counted complete when the simulator says so
      gatewayStatus = completed || statusParam === 'completed' ? 'completed' : 'pending'
    }

    if (gatewayStatus !== 'completed') {
      if (gatewayStatus === 'failed') await setTransactionResult(txRef, 'failed')
      return NextResponse.json({ status: gatewayStatus, transaction_id: gatewayTxId, tx_ref: txRef })
    }

    await setTransactionResult(txRef, 'paid')
    const result = await autoEnrollOnPaymentSuccess(txRef)
    if (!result.ok) {
      console.error('[payments/verify] auto-enroll failed', txRef, result)
    }
    return NextResponse.json({
      status: 'completed',
      transaction_id: gatewayTxId ?? `demo_${Date.now()}`,
      tx_ref: txRef,
      amount: amount ?? 0,
      currency: currency ?? 'ZMW',
      enrollment: result.ok ? true : undefined,
    })
  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
