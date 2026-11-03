import Link from 'next/link'
import { Calendar, Users, TrendingUp, Play, Award, ArrowRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/data'

const MASTERCLASSES = [
  {
    title: 'Monthly Live Masterclass',
    description: 'Regular monthly live classes covering the latest digital skills and tools.',
    icon: Calendar,
    color: '#E3F6EF',
    iconColor: '#1DB96B',
  },
  {
    title: 'Interactive Learning',
    description: 'Ask questions, get real-time feedback, and connect with other learners.',
    icon: Users,
    color: '#DBEAFE',
    iconColor: '#3B82F6',
  },
  {
    title: 'Expert Instruction',
    description: 'Learn directly from George J Kasonzo with years of practical experience.',
    icon: Award,
    color: '#E8F6EF',
    iconColor: '#0F7A42',
  },
]

export default function MasterclassesPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#10201A]">
      {/* Hero */}
      <section className="bg-[#0A0D14] text-white py-20 sm:py-28 px-4">
        <div className="mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center justify-center w-16 h-14 bg-[#1DB96B] rounded-xl mb-6">
            <Calendar className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-4">
            Monthly Live Masterclasses
          </h1>
          <p className="text-lg text-[#A3A3A3] mb-8 max-w-xl mx-auto">
            Join George J Kasonso for exclusive live training sessions every month. Learn cutting-edge digital skills, interact directly with the instructor, and connect with a community of African learners.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/subscribe"
              className="inline-flex h-12 items-center justify-center rounded-xl px-7 font-bold text-sm bg-[#1DB96B] text-[#111111] hover:bg-[#17A05D] transition-colors"
            >
              Join Masterclasses <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 sm:py-28 px-4">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] mb-12 text-center">
            What You Get
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {MASTERCLASSES.map((m, i) => (
              <div key={i} className="bg-white border border-[#E5E5E5] rounded-2xl p-6 text-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: m.color }}>
                  <m.icon className="w-6 h-6" style={{ color: m.iconColor }} />
                </div>
                <h3 className="text-xl font-bold text-[#111111] mb-2">{m.title}</h3>
                <p className="text-sm text-[#737373]">{m.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Masterclasses */}
      <section className="py-20 sm:py-28 px-4 bg-[#FFFFFF]">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] mb-12 text-center">
            Upcoming Masterclasses
          </h2>
          <div className="space-y-6">
            {[
              {
                title: 'AI for Beginners Class',
                date: 'Nov 2-6, 2026',
                time: '7:50PM-9:20PM CAT',
                price: 'ZMW 2,500',
                seats: '26/30 seats',
              },
              {
                title: 'AI Unlocked Cohort 2',
                date: 'May 18 - Jul 17, 2026',
                time: 'Evenings CAT',
                price: 'ZMW 3,690',
                seats: '22/25 seats',
              },
              {
                title: 'Meta Ads Explained 2026',
                date: 'Jun 22 - Jul 7, 2026',
                time: 'Mon & Wed CAT',
                price: 'ZMW 2,790',
                seats: '15/20 seats',
              },
            ].map((m, i) => (
              <div key={i} className="flex items-center justify-between bg-white border border-[#E5E5E5] rounded-2xl p-5">
                <div>
                  <h3 className="text-sm font-bold text-[#111111]">{m.title}</h3>
                  <p className="text-xs text-[#737373]">{m.date} · {m.time}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs font-medium text-[#0B854C]">{m.price}</span>
                  <span className="text-xs text-[#737373]">{m.seats}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-28 px-4 bg-[#1DB96B] text-[#111111]">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-4">
            Join the Next Masterclass
          </h2>
          <p className="text-sm text-[#111111]/80 mb-8 max-w-lg mx-auto">
            Limited seats available. Reserve your spot now for the next live masterclass.
          </p>
          <Link
            href="/subscribe"
            className="inline-flex h-12 items-center justify-center rounded-xl px-7 font-bold text-sm bg-[#10201A] text-[#FFFFFF] hover:bg-[#000000] transition-colors"
          >
            Reserve Your Seat <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </section>
    </div>
  )
}