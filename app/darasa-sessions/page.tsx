import Link from 'next/link'
import { Clock, Calendar, Users, Play, ShieldCheck, ArrowRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/data'

const DARASA_SESSIONS = [
  {
    title: 'Digital Skills for Beginners',
    description: 'Learn the fundamentals of using computers, the internet, and basic productivity tools.',
    date: 'Every Saturday',
    time: '10:00 AM - 11:00 AM CAT',
    duration: '60 minutes',
    seats: '50 seats available',
  },
  {
    title: 'Social Media Basics',
    description: 'How to use Facebook, WhatsApp, and Instagram for personal and business purposes.',
    date: 'Every Wednesday',
    time: '7:00 PM - 8:00 PM CAT',
    duration: '60 minutes',
    seats: '45 seats available',
  },
  {
    title: 'AI Tools for Everyday Work',
    description: 'Practical introduction to using ChatGPT, Claude, and Gemini in your daily tasks.',
    date: 'Every Friday',
    time: '6:00 PM - 7:00 PM CAT',
    duration: '60 minutes',
    seats: '40 seats available',
  },
]

export default function DarasaSessionsPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#10201A]">
      {/* Hero */}
      <section className="bg-[#0A0D14] text-white py-20 sm:py-28 px-4">
        <div className="mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center justify-center w-16 h-14 bg-[#1DB96B] rounded-xl mb-6">
            <Calendar className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-4">
            Darasa Sessions
          </h1>
          <p className="text-lg text-[#A3A3A3] mb-8 max-w-xl mx-auto">
            Free live classes every week. Learn practical digital skills from George J Kasonso. No payment required.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/subscribe"
              className="inline-flex h-12 items-center justify-center rounded-xl px-7 font-bold text-sm bg-[#1DB96B] text-[#111111] hover:bg-[#17A05D] transition-colors"
            >
              Join Next Session <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 sm:py-28 px-4">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] mb-12 text-center">
            How Darasa Sessions Work
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Clock,
                title: 'Free Live Sessions',
                desc: 'Every week, George hosts a free live class on a practical digital skill topic.',
              },
              {
                icon: Calendar,
                title: 'Weekly Schedule',
                desc: 'Sessions run every week on Saturday, Wednesday, and Friday evenings.',
              },
              {
                icon: Users,
                title: 'Community Learning',
                desc: 'Learn alongside other students and ask questions during the live session.',
              },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-4 text-center p-6">
                <div className="w-12 h-12 rounded-full bg-[#1DB96B]/10 flex items-center justify-center text-[#1DB96B]">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#111111] mb-2">{item.title}</h3>
                <p className="text-sm text-[#737373]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Sessions */}
      <section className="py-20 sm:py-28 px-4">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] mb-12 text-center">
            Upcoming Sessions
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {DARASA_SESSIONS.map((s, i) => (
              <div key={i} className="bg-white border border-[#E5E5E5] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-[#1DB96B] uppercase tracking-[0.1em]">Live Session</span>
                  <span className="text-xs font-bold text-[#1DB96B]">Free</span>
                </div>
                <h3 className="text-lg font-bold text-[#111111] mb-2">{s.title}</h3>
                <p className="text-sm text-[#737373] mb-3">{s.description}</p>
                <div className="space-y-1 text-xs text-[#737373]">
                  <p><span className="font-bold text-[#111111]">Date:</span> {s.date}</p>
                  <p><span className="font-bold text-[#111111]">Time:</span> {s.time}</p>
                  <p><span className="font-bold text-[#111111]">Duration:</span> {s.duration}</p>
                  <p><span className="font-bold text-[#111111]">Seats:</span> {s.seats}</p>
                </div>
                <Link
                  href={`https://wa.me/${SITE_CONFIG.whatsapp}?text=Hi%20George%2C%20I%20want%20to%20join%20the%20${s.title}%20Darasa%20Session`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-bold bg-[#1DB96B] text-[#111111] mt-4"
                >
                  <ShieldCheck className="w-3 h-3" /> Join Session
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 sm:py-28 px-4 bg-[#FAFAFA]">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] mb-12 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              { q: 'Is it really free?', a: 'Yes. Every Darasa Session is free to attend. There is nothing to pay and no card needed at any point.' },
              { q: 'How do I get the Google Meet link?', a: 'On WhatsApp. Once you enrol, we send the link and a reminder to the number you gave, shortly before the class begins.' },
              { q: 'Do I need any experience?', a: 'None at all. This session assumes you are starting from zero, and there is time at the end for questions.' },
              { q: 'What if I miss the class?', a: 'A replay is sent out after each session to everyone on the list.' },
              { q: 'Do I enrol again every week?', a: 'No. One enrolment puts you on the list for every future Darasa Session.' },
              { q: 'What do I need to join?', a: 'A phone or laptop with internet, and a quiet 60 minutes. Google Meet works on both.' },
            ].map((faq, i) => (
              <details key={i} className="group border border-[#E5E5E5] rounded-xl overflow-hidden">
                <summary
                  className="list-none cursor-pointer px-4 py-3 text-sm font-medium text-[#111111] flex justify-between items-start transition-colors group-open:bg-[#F3F4F6]"
                >
                  <span>{faq.q}</span>
                  <span className="text-sm">▾</span>
                </summary>
                <div className="px-4 pb-3 text-sm text-[#737373]">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}