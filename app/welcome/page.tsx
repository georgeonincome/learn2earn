import Link from 'next/link'
import { Play, Check, ArrowRight, ShieldCheck, BookOpen } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/data'

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#10201A]">
      {/* Hero */}
      <section className="bg-[#0A0D14] text-white py-20 sm:py-28 px-4">
        <div className="mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center justify-center w-16 h-14 bg-[#1DB96B] rounded-xl mb-6">
            <Play className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-4">
            Welcome to <span className="text-[#0B854C]">Learn2Earn</span>
          </h1>
          <p className="text-lg text-[#A3A3A3] mb-8 max-w-xl mx-auto">
            Practical digital skills for Zambia. Taught personally by George J Kasonso.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/courses"
              className="inline-flex h-12 items-center justify-center rounded-xl px-7 font-bold text-sm bg-[#1DB96B] text-[#111111] hover:bg-[#17A05D] transition-colors"
            >
              Start Learning <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
            <Link
              href="/subscribe"
              className="inline-flex h-12 items-center justify-center rounded-xl px-6 font-bold text-sm border border-[#A3A3A3] text-[#A3A3A3] hover:bg-[#F3F4F6] transition-colors"
            >
              View Plans
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 sm:py-28 px-4">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] mb-12 text-center">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Play,
                title: 'Choose a Course',
                desc: 'Browse our catalog of practical digital skills courses and pick the one you need.',
              },
              {
                icon: Check,
                title: 'Enroll & Pay',
                description: 'Pay with MTN/Airtel mobile money or card. Nothing renews automatically.',
              },
              {
                icon: ArrowRight,
                title: 'Start Learning',
                desc: 'Watch lessons, complete quizzes, and earn your certificate.',
              },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-4 text-center p-6">
                <div className="w-12 h-12 rounded-full bg-[#1DB96B]/10 flex items-center justify-center text-[#0B854C]">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#111111] mb-2">{item.title}</h3>
                <p className="text-sm text-[#737373]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Learn2Earn */}
      <section className="py-20 sm:py-28 px-4 bg-[#FFFFFF]">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] mb-6">
                Why Learn2Earn?
              </h2>
              <ul className="space-y-4">
                {[
                  'No support desk — you deal with George directly',
                  'Practical skills with Zambian examples and kwacha pricing',
                  'Mobile money and card payments',
                  'Certificates for every eligible course',
                  'Nothing renews automatically',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-[#0B854C]" />
                    <span className="text-sm text-[#737373]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1">
              <div className="bg-[#F3F4F6] rounded-2xl p-8 text-center">
                <BookOpen className="w-16 h-16 text-[#0B854C] mx-auto mb-4" />
                <h3 className="text-lg font-bold text-[#111111] mb-2">George</h3>
                <p className="text-sm text-[#737373] mb-4">
                  Founder & Instructor at Learn2Earn. Zambian digital educator teaching practical skills since 2019.
                </p>
                <a
                  href={`https://wa.me/${SITE_CONFIG.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#0B854C] hover:underline"
                >
                  WhatsApp George <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-28 px-4 bg-[#1DB96B] text-[#111111]">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-sm text-[#111111]/80 mb-8 max-w-lg mx-auto">
            Choose your first course and start building practical skills today.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/courses"
              className="inline-flex h-12 items-center justify-center rounded-xl px-7 font-bold text-sm bg-[#10201A] text-[#FFFFFF] hover:bg-[#000000] transition-colors"
            >
              Browse Courses
            </Link>
            <Link
              href="/subscribe"
              className="inline-flex h-12 items-center justify-center rounded-xl px-7 font-bold text-sm border border-[#10201A] text-[#111111] hover:bg-[#000000] hover:text-[#FFFFFF] transition-colors"
            >
              Get Membership
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}