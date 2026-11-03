'use client'
import Link from 'next/link'
import { AlertTriangle, ArrowRight, RefreshCcw, MessageCircle } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/data'

export default function PaymentFailedPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#10201A]">
      <div className="mx-auto max-w-[480px] px-5 py-20 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FDECEA] text-[#B42318] mx-auto mb-5">
          <AlertTriangle className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-extrabold mb-3">Payment Not Completed</h1>
        <p className="text-lg text-[#737373] mb-8 max-w-xl mx-auto">
          Your payment did not go through. Nothing has been charged. You can try again or pay manually.
        </p>
        <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 mb-8">
          <h3 className="text-sm font-extrabold text-[#0B854C] mb-3 uppercase tracking-[0.12em]">What happened?</h3>
          <p className="text-sm text-[#737373] mb-4">
            The payment was not completed successfully. This could be due to network issues, insufficient funds, or the payment timing out.
          </p>
          <div className="bg-[#F3F4F6] rounded-xl p-4 text-sm text-[#737373] mb-4">
            <p className="font-semibold text-[#111111] mb-2">No charge was made:</p>
            <p>Your card or mobile money account has not been charged. If you see a pending authorization, it will be released automatically.</p>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => window.location.reload()}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1DB96B] text-[#111111] font-bold text-sm hover:bg-[#17A05D] transition-colors"
          >
            <RefreshCcw className="w-4 h-4" /> Try Again
          </button>
          <Link
            href="/checkout"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#E5E5E5] text-sm font-bold text-[#111111] hover:bg-[#F3F4F6] transition-colors"
          >
            Choose Another Payment Method <ArrowRight className="w-4 h-4" />
          </Link>
          <div className="border-t border-[#E5E5E5] pt-6">
            <p className="text-sm text-[#737373] mb-3">
              Still having trouble? Message George directly for manual payment assistance.
            </p>
            <a
              href={`https://wa.me/${SITE_CONFIG.whatsapp}?text=Hi%20George%2C%20my%20payment%20did%20not%20go%20through%20on%20Learn2Earn`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-bold text-[#0B854C] hover:text-[#17A05D] transition-colors"
            >
              <MessageCircle className="w-3 h-3" /> WhatsApp George
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}