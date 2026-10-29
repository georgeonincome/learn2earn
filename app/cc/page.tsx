import Link from 'next/link'
import { ShieldCheck, Check, ArrowRight, Download } from 'lucide-react'

export default function CcPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#10201A]">
      <div className="mx-auto max-w-[480px] px-5 py-20 text-center">
        <div className="flex h-16 w-14 items-center justify-center rounded-full bg-[#E3F6EF] text-[#0F7A42] mx-auto mb-5">
          <ShieldCheck className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-extrabold mb-3">Course Completed</h1>
        <p className="text-lg text-[#737373] mb-8 max-w-xl mx-auto">
          You have successfully completed the course. Your certificate is ready to download.
        </p>
        <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-[#111111]">Certificate ID</span>
            <span className="text-xs font-mono text-[#1DB96B] font-bold">L2E-2026-001</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-[#737373]">Student Name</span>
            <span className="font-medium text-[#111111]">George J Kasonso</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-[#737373]">Course</span>
            <span className="font-medium text-[#111111]">AI Automation Bootcamp</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-[#737373]">Issue Date</span>
            <span className="font-medium text-[#111111]">October 15, 2026</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-[#737373]">Status</span>
            <span className="flex items-center gap-1 text-[#0F7A42] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0F7A42]" />
              Verified
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <a
            href="/verify/L2E-2026-001"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1DB96B] text-[#111111] font-bold text-sm hover:bg-[#17A05D] transition-colors"
          >
            <ShieldCheck className="w-4 h-4" /> Verify Certificate
          </a>
          <Link
            href="/courses"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#E5E5E5] text-sm font-bold text-[#111111] hover:bg-[#F3F4F6] transition-colors"
          >
            Browse More Courses <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}