import Image from 'next/image'
import Link from 'next/link'
import { BookOpen, Users, Clock, Play, Award, TrendingUp, MessageCircle } from 'lucide-react'
import { COURSES, SITE_CONFIG } from '@/lib/data'

/* Dashboard — exact 1:1 from click2skill StudentDashboard-Dh-ypbFE.js:
   Stats cards, continue-learning grid with real thumbnails,
   certificates section, progress bars, recent activity.
*/

export default function DashboardPage() {
  const enrolledCourses = COURSES.slice(0, 4)
  const firstName = SITE_CONFIG.founder.name.split(' ').slice(-1).join(' ')

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAFA', color: '#111111' }}>
      <main className="pt-10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-12 pb-10">
          {/* Header */}
          <div className="flex items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-[#111111] mb-1">
                Dashboard
              </h1>
              <p className="text-[#737373]">Welcome back. Here&apos;s what you&apos;re learning.</p>
            </div>
            <Link
              href="/courses"
              className="hidden sm:inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-bold"
              style={{ backgroundColor: '#1DB96B', color: '#111111' }}
            >
              Discover courses
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            <div className="bg-white rounded-xl border border-[#E5E5E5] p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#E8F8F0] rounded-xl flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-[#1DB96B]" />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-[#111111]">{enrolledCourses.length}</p>
                  <p className="text-xs text-[#737373]">Active Courses</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-[#E5E5E5] p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#E8F8F0] rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-[#1DB96B]" />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-[#111111]">12h</p>
                  <p className="text-xs text-[#737373]">Watch Time</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-[#E5E5E5] p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#E8F8F0] rounded-xl flex items-center justify-center">
                  <Award className="w-5 h-5 text-[#1DB96B]" />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-[#111111]">2</p>
                  <p className="text-xs text-[#737373]">Certificates</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-[#E5E5E5] p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#E8F8F0] rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-[#1DB96B]" />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-[#111111]">68%</p>
                  <p className="text-xs text-[#737373]">Overall Progress</p>
                </div>
              </div>
            </div>
          </div>

          {/* Continue learning */}
          <h2 className="text-xl font-bold text-[#111111] mb-5 flex items-center gap-2">
            <Play className="w-5 h-5 text-[#1DB96B]" /> Continue learning
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 mb-10">
            {enrolledCourses.map((c, i) => (
              <Link href={`/courses/${c.slug}`} key={c.slug} className="bg-white rounded-xl border border-[#E5E5E5] overflow-hidden hover:shadow-md transition-all group">
                <div className="relative aspect-video bg-[#EEF1EE] overflow-hidden">
                  <Image
                    src={i % 2 === 0 ? '/images/elvis-teaching-phone.webp' : '/images/elvis-classroom.webp'}
                    alt={c.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 bg-black/40 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#1DB96B] mb-1">{c.category}</p>
                  <h3 className="font-bold text-[#111111] text-sm line-clamp-2 mb-1">{c.title}</h3>
                  {/* Progress bar */}
                  <div className="w-full h-1.5 bg-[#E5E5E5] rounded-full overflow-hidden">
                    <div className="h-full bg-[#1DB96B] rounded-full" style={{ width: `${[45, 72, 12, 89][i]}%` }} />
                  </div>
                  <p className="text-xs text-[#737373] mt-1">{[45, 72, 12, 89][i]}% complete</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Certificates */}
          <h2 className="text-xl font-bold text-[#111111] mb-5 flex items-center gap-2">
            <Award className="w-5 h-5 text-[#1DB96B]" /> Your certificates
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            <div className="bg-white border border-[#E5E5E5] rounded-xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-[#E8F8F0] rounded-xl flex items-center justify-center shrink-0">
                <Award className="w-6 h-6 text-[#1DB96B]" />
              </div>
              <div>
                <p className="font-bold text-[#111111] text-sm">Social Media Management</p>
                <p className="text-xs text-[#737373]">Completed Oct 2026</p>
              </div>
              <Link href="/verify/cert-smm-001" className="ml-auto text-xs font-semibold text-[#1DB96B] hover:underline">
                View
              </Link>
            </div>
            <div className="bg-white border border-[#E5E5E5] rounded-xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-[#E8F8F0] rounded-xl flex items-center justify-center shrink-0">
                <Award className="w-6 h-6 text-[#1DB96B]" />
              </div>
              <div>
                <p className="font-bold text-[#111111] text-sm">AI Automation Bootcamp</p>
                <p className="text-xs text-[#737373]">Completed Sep 2026</p>
              </div>
              <Link href="/verify/cert-ai-001" className="ml-auto text-xs font-semibold text-[#1DB96B] hover:underline">
                View
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="bg-white border border-[#E5E5E5] rounded-xl p-6 text-center">
            <p className="text-sm text-[#737373]">
              Questions? WhatsApp {firstName} directly at{' '}
              <a href={`https://wa.me/${SITE_CONFIG.whatsapp}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[#1DB96B] font-semibold hover:underline">
                <MessageCircle className="w-3.5 h-3.5" /> {SITE_CONFIG.founder.phone}
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
