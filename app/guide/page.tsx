'use client'

/**
 * GuidePage — reference beginner's guide.
 * Step-by-step guide to getting started on Learn2Earn.
 */

import Link from 'next/link'
import { Play, ChevronRight, BookOpen, Mail, Lock, Settings } from 'lucide-react'

const steps = [
  { num: 1, title: 'Create your account', icon: Mail, desc: 'Register with your email and set a password. Your full name goes on your certificates.' },
  { num: 2, title: 'Browse courses', icon: BookOpen, desc: 'Pick from 23 practical courses — AI, Meta ads, social media, web design, CapCut and computer packages.' },
  { num: 3, title: 'Enrol', icon: ChevronRight, desc: 'Pay once with MTN/Airtel money or card. No automatic charges. Get instant access.' },
  { num: 4, title: 'Learn at your pace', icon: Play, desc: 'Watch video lessons, take quizzes, track progress and earn XP.' },
  { num: 5, title: 'Get certified', icon: Lock, desc: 'Send your work for review, get feedback, and claim your certificate.' },
  { num: 6, title: 'Update preferences', icon: Settings, desc: 'Dark mode, notifications, profile — all in Settings.' },
]

export default function GuidePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Beginner's Guide</h1>
          <p className="text-[#737373] text-sm mt-1">Welcome to Click2Skill! Step-by-step guide to getting started.</p>
        </div>
      </div>

      <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-6 space-y-6">
        <h2 className="font-bold text-lg">Step-by-step guide</h2>
        <div className="space-y-4">
          {steps.map((s) => (
            <div key={s.num} className="flex gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1DB96B]/10 text-[#1DB96B] font-bold text-xs shrink-0">
                {s.num}
              </div>
              <div>
                <div className="font-semibold text-[#111111]">{s.title}</div>
                <div className="text-sm text-[#737373] mt-1">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-6 space-y-4">
        <h2 className="font-bold text-lg">Frequently asked questions</h2>
        <div className="space-y-3">
          {[
            ['How do I access my courses?', 'Go to Dashboard → My Courses and click on any enrolled course.'],
            ['How do I get support?', 'Open a support ticket from Dashboard → Support, or message George on WhatsApp.'],
            ['How do I track my progress?', 'Your dashboard shows lessons completed, certificates earned and your current streak.'],
            ['How do I update my preferences?', 'Go to Dashboard → Settings — dark mode, privacy, notifications and password live there.'],
            ['How do I log out safely?', 'Use the Sign out link in the admin area, or clear your session from Dashboard → Settings → Sessions.'],
          ].map(([q, a]) => (
            <div key={q} className="border-b border-[#E5E5E5] pb-3 last:border-0">
              <div className="font-semibold text-[#111111]">{q}</div>
              <div className="text-sm text-[#737373] mt-1">{a}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-6 text-center">
        <h2 className="font-bold text-lg mb-4">Ready to start learning?</h2>
        <Link href="/courses" className="inline-flex items-center gap-2 rounded-lg bg-[#1DB96B] px-6 py-3 text-sm font-bold text-white hover:bg-[#17A05D]">
          Browse courses <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
