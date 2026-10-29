import Link from 'next/link'
import { Check, ArrowRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/data'

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#10201A]">
      <div className="mx-auto max-w-[480px] px-5 py-20 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E3F6EF] text-[#0F7A42] mx-auto mb-5">
          <Check className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-extrabold mb-3">Payment Successful</h1>
        <p className="text-lg text-[#737373] mb-8 max-w-xl mx-auto">
          Your payment has been processed successfully. You now have access to your courses. Nothing renews automatically.
        </p>
        <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 mb-8">
          <h3 className="text-sm font-extrabold text-[#1DB96B] mb-3 uppercase tracking-[0.12em]">Order Confirmation</h3>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-[#737373]">Order ID</span>
            <span className="font-mono text-sm font-medium text-[#111111]">L2E-2026-10-28-001</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-[#737373]">Amount Paid</span>
            <span className="font-medium text-[#111111]">ZMW 0.00</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-[#737373]">Payment Method</span>
            <span className="font-medium text-[#111111]">Mobile Money / Card</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-[#737373]">Status</span>
            <span className="flex items-center gap-1 text-[#0F7A42] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0F7A42]" />
              Completed
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <Link
            href="/courses"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1DB96B] text-[#111111] font-bold text-sm hover:bg-[#17A05D] transition-colors"
          >
            <ArrowRight className="w-4 h-4" /> Start Learning
          </Link>
          <Link
            href="/dashboard"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#E5E5E5] text-sm font-bold text-[#111111] hover:bg-[#F3F4F6] transition-colors"
          >
            View Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}