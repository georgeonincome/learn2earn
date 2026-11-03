'use client'

/**
 * SMMGuide — reference SMM guide page.
 * Social media management guide for freelancers.
 */

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export default function SMMGuidePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Social Media Management Guide</h1>
          <p className="text-[#737373] text-sm mt-1">Turn social media skills into paying clients — a practical guide for Zambian freelancers.</p>
        </div>
      </div>

      <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-6 space-y-6">
        <h2 className="font-bold text-lg">What the work actually involves</h2>
        <ul className="space-y-3 list-disc list-inside text-sm text-[#737373]">
          <li>Writing captions and planning a monthly content calendar</li>
          <li>Designing simple graphics in Canva</li>
          <li>Shooting and editing short video for TikTok, Instagram Reels and WhatsApp Status</li>
          <li>Replying to DMs and comments (community management)</li>
          <li>Occasionally running Meta Ads for a page or campaign</li>
        </ul>
      </div>

      <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-6 space-y-6">
        <h2 className="font-bold text-lg">What to charge in Zambia</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-lg border border-[#E5E5E5] p-4">
            <div className="text-xs font-semibold text-[#737373]">New manager — content management</div>
            <div className="text-2xl font-extrabold text-[#1DB96B]">ZMW 1,500–2,500 / client / month</div>
          </div>
          <div className="rounded-lg border border-[#E5E5E5] p-4">
            <div className="text-xs font-semibold text-[#737373]">With ads management added</div>
            <div className="text-2xl font-extrabold text-[#1DB96B]">ZMW 4,000+ / month retainers</div>
          </div>
        </div>
        <p className="text-[#737373] text-sm">Charge per month, not per post — monthly pricing pushes you toward building systems rather than chasing individual posts.</p>
      </div>

      <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-6">
        <h2 className="font-bold text-lg mb-4">The fastest way to build proof</h2>
        <p className="text-[#737373] text-sm mb-4">Official certificates matter far less than pages you can point at. In your first month, run one account for free or heavily discounted, take before/after screenshots, and turn that into your pitch. Two small case studies beat a CV.</p>
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 rounded-lg bg-[#1DB96B] px-6 py-3 text-sm font-bold text-white hover:bg-[#17A05D]"
        >
          Start learning <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
