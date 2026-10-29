import Link from 'next/link'
import { MessageCircle, Users, Play, TrendingUp, ArrowRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/data'

export default function SMPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#10201A]">
      {/* Hero */}
      <section className="bg-[#0A0D14] text-white py-20 sm:py-28 px-4">
        <div className="mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center justify-center w-16 h-14 bg-[#1DB96B] rounded-xl mb-6">
            <MessageCircle className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-4">
            Social Media Management
          </h1>
          <p className="text-lg text-[#A3A3A3] mb-8 max-w-xl mx-auto">
            Learn to manage social media accounts for clients, create content that converts, and run ads that get results.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/courses/social-media-management"
              className="inline-flex h-12 items-center justify-center rounded-xl px-7 font-bold text-sm bg-[#1DB96B] text-[#111111] hover:bg-[#17A05D] transition-colors"
            >
              Enroll in SMM Course <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* What you learn */}
      <section className="py-20 sm:py-28 px-4">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] mb-12 text-center">
            What You&apos;ll Learn
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Content Creation',
                desc: 'Create engaging posts, reels, and stories for Facebook, Instagram, TikTok, and LinkedIn.',
              },
              {
                title: 'Meta Ads',
                description: 'Run profitable Facebook and Instagram ad campaigns that bring real customers.',
              },
              {
                title: 'Client Management',
                description: 'Onboard clients, create content calendars, and deliver monthly reports.',
              },
            ].map((item, i) => (
              <div key={i} className="bg-white border border-[#E5E5E5] rounded-2xl p-6">
                <h3 className="text-lg font-bold text-[#111111] mb-2">{item.title}</h3>
                <p className="text-sm text-[#737373]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-28 px-4 bg-[#1DB96B] text-[#111111]">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-4">
            Start Your Social Media Career
          </h2>
          <p className="text-sm text-[#111111]/80 mb-8 max-w-lg mx-auto">
            Learn to manage social media for clients and earn from anywhere in Zambia.
          </p>
          <Link
            href="/courses/social-media-management"
            className="inline-flex h-12 items-center justify-center rounded-lg px-7 font-bold text-sm bg-[#10201A] text-[#FFFFFF] hover:bg-[#000000] transition-colors"
          >
            Enroll in SMM Course <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </section>
    </div>
  )
}