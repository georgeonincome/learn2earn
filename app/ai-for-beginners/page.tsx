'use client'

/**
 * AI for Beginners — separate from AI class. Reference ai-for-beginners route.
 */

import Link from 'next/link'
import { Bot, Play, ChevronRight } from 'lucide-react'

export default function AIBeginnersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">AI for Beginners</h1>
          <p className="text-[#737373] text-sm mt-1">What AI is, Claude, ChatGPT, Gemini, AI video — and how to use it. No coding required.</p>
        </div>
      </div>

      <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-6 space-y-6">
        <h2 className="font-bold text-lg">What you'll learn</h2>
        <ul className="space-y-3 list-disc list-inside text-sm text-[#737373]">
          <li>What AI is and how large language models work</li>
          <li>Claude, ChatGPT, Gemini — when to use which</li>
          <li>AI video generation and editing</li>
          <li>Prompting basics that actually work</li>
          <li>Using AI in your daily work without fear</li>
        </ul>
      </div>

      <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-6">
        <h2 className="font-bold text-lg mb-4">Five live evenings with George</h2>
        <p className="text-[#737373] text-sm mb-4">Join the AI class cohort — five practical sessions, Q&A, and a certificate when you finish.</p>
        <Link href="/courses/ai-class" className="inline-flex items-center gap-2 rounded-lg bg-[#1DB96B] px-6 py-3 text-sm font-bold text-white hover:bg-[#17A05D]">
          Join the AI class <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
