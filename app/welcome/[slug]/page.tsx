'use client'

/**
 * Course-specific Welcome page — reference per-course welcome UIs.
 * Route: /welcome/[slug]
 */

import Link from 'next/link'
import { Play, ChevronRight, ShieldCheck, Clock } from 'lucide-react'

export default function WelcomeCoursePage({ searchParams }: { searchParams: { [key: string]: string } }) {
  const courseSlug = searchParams.course || 'ai-web-design'
  const courseTitles: Record<string, string> = {
    'ai-web-design': 'AI Web Design for Beginners',
    'the-5am-productivity-system': 'The 5AM Productivity System',
    'how-to-make-your-first-kes-50000': 'How to Make Your First ZMW 50,000 Online',
    'meta-ads-mastery-from-setup-to-sales': 'Meta Ads Mastery',
    'social-media-management-with-ai-august-2026': 'Social Media Management',
    'cutpro-video-editing-capcut': 'Video Editing with CapCut',
    'vibe-coding-for-beginners': 'Vibe Coding for Beginners',
    'computer-digital-skills-masterclass': 'Computer & Digital Skills',
  }
  const title = courseTitles[courseSlug] ?? courseSlug

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#10201A]">
      <nav className="border-b border-[#E5E5E5] bg-[#FFFFFF]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1DB96B]">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </div>
            <span className="font-head font-extrabold text-xl">Learn2Earn</span>
          </div>
          <Link href="/courses" className="text-[#1DB96B] font-semibold hover:underline">← Back to courses</Link>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-[#0A0D14] text-white rounded-3xl p-8 sm:p-12 mb-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1DB96B] mb-6">
            <Play className="w-7 h-7" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-4">Welcome to {title}</h1>
          <p className="text-lg text-[#A3A3A3] mb-8 max-w-xl mx-auto">
            Your journey starts here. Check your email for access details, then come back to start session one.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/courses/${courseSlug}`}
              className="flex items-center justify-center rounded-xl px-7 py-3 font-bold text-sm bg-[#1DB96B] text-[#111111] hover:bg-[#17A05D] transition-colors sm:w-auto"
            >
              Start Learning <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
            <Link
              href="/subscribe"
              className="flex items-center justify-center rounded-xl px-6 py-3 font-bold text-sm border border-[#A3A3A3] text-[#A3A3A3] hover:bg-[#F3F4F6] transition-colors sm:w-auto"
            >
              See all plans
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F3FBF6] text-[#1DB96B] mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold mb-2">Instant access</h3>
            <p className="text-sm text-[#737373]">Start session one the moment you enrol.</p>
          </div>
          <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F3FBF6] text-[#1DB96B] mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-bold mb-2">Learn at your pace</h3>
            <p className="text-sm text-[#737373]">Lifetime access — watch lessons as many times as you want.</p>
          </div>
          <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F3FBF6] text-[#1DB96B] mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold mb-2">Certificate included</h3>
            <p className="text-sm text-[#737373]">Earn a verified certificate when you complete the course.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
