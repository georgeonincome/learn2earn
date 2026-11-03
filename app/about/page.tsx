import Link from 'next/link'
import Image from 'next/image'
import { Layout, Award, Briefcase, GraduationCap, TrendingUp, Users, Heart, Play, ArrowRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/data'

/* About page — exact 1:1 from Click2Skill About-D0g2GHRy.js, Zambianized:
   - Hero: dark section with founder image + headline + stats
   - "One person runs everything" section
   - "Two ways to learn here" cards
   - "The Journey" timeline
   - "What I Do Today" grid
   - "Brands I've Worked With" chips
   - "What's next" grid
   - Dark CTA section
*/

const TIMELINE = [
  { year: '2019', title: 'Graduated from Dedan Kimathi University', icon: GraduationCap },
  { year: '2020', title: 'Started cyber café & freelancing during COVID', icon: Briefcase },
  { year: '2021', title: 'Began teaching digital skills on TikTok', icon: TrendingUp },
  { year: '2023', title: 'Reached 500K+ followers across platforms', icon: Users },
  { year: '2024', title: 'Launched Learn2Earn platform', icon: Layout },
  { year: '2025', title: '1.1M+ followers, 10,000+ students trained', icon: Award },
]

const WHAT_IDO_TODAY = [
  { title: 'Digital Marketing & Strategy', desc: 'Helping brands improve visibility and results.' },
  { title: 'Website Design & SEO', desc: 'Modern, SEO-friendly websites that perform.' },
  { title: 'Content Creation & Coaching', desc: 'Teaching creators to grow with systems, not luck.' },
  { title: 'Freelancing Training', desc: 'Helping beginners earn online ethically.' },
  { title: 'AI Productivity Training', desc: 'Teaching Africans to use AI tools to work smarter.' },
  { title: 'Digital Literacy Advocacy', desc: 'Mentoring youth on remote work and digital skills.' },
]

const BRANDS = ['Safaricom', 'iTel Kenya', 'ALX Africa', 'Servercore', 'Arvocap', 'Moringa School']

const WHATS_NEXT = [
  { title: 'A physical campus, 2027/28', desc: 'A physical Click2Skill campus in Nairobi is planned for 2027/28, for in-person classes and hands-on labs. Until it opens, everything runs online.' },
  { title: 'darasa.my', desc: 'A separate project Elvis is building alongside Click2Skill, extending the same practical teaching approach.' },
  { title: 'elvisw.online', desc: "Elvis' personal site — speaking, consulting, brand work and everything outside the classroom." },
]

const fullName = SITE_CONFIG.founder.name
const ACTION = '#0B854C'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0A0D14] text-white">
      {/* Hero section */}
      <section className="bg-[#0A0D14] text-white py-16 sm:py-20 px-6 lg:px-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-12 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-full mb-6">
            <Heart className="w-7 h-7 text-[hsl(var(--primary))]" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            About <span className="text-[hsl(var(--primary))]">Learn2Earn</span>
          </h1>
          <p className="text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto">
            A creator-led Zambian platform built to make practical digital skills accessible, fast, and affordable for everyone.
          </p>
        </div>
      </section>

      {/* Founder section */}
      <section className="px-6 lg:px-12 py-16">
        <div className="max-w-5xl mx-auto space-y-16">
          <section className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <Image
                src="/images/portrait-tight.jpg"
                alt={`${fullName}, founder of Learn2Earn`}
                className="rounded-2xl shadow-lg w-full"
                width={800}
                height={600}
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </div>
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[hsl(152_73%_42%_/0.1)] rounded-full">
                <Layout className="w-4 h-4 text-[hsl(var(--primary))]" />
                <span className="text-sm font-semibold text-[hsl(var(--primary))]">Meet the Founder</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">{fullName}</h2>
              <p className="text-[#A3A3A3] leading-relaxed">
                Kenyan digital educator, content strategist, and entrepreneur with{' '}
                <span className="font-bold text-white">1.1M+ followers</span> across platforms. I started from a small cyber café and turned self-taught skills into a mission to train Africa.
              </p>
              <div className="grid grid-cols-3 gap-4 pt-2">
                <div className="text-center p-3 bg-[#FAFAFA] rounded-xl">
                  <p className="text-xl font-bold text-[hsl(var(--primary))]">1.1M+</p>
                  <p className="text-xs text-[#737373]">Followers</p>
                </div>
                <div className="text-center p-3 bg-[#FAFAFA] rounded-xl">
                  <p className="text-xl font-bold text-[hsl(var(--primary))]">10K+</p>
                  <p className="text-xs text-[#737373]">Students</p>
                </div>
                <div className="text-center p-3 bg-[#FAFAFA] rounded-xl">
                  <p className="text-xl font-bold text-[hsl(var(--primary))]">15+</p>
                  <p className="text-xs text-[#737373]">Countries</p>
                </div>
              </div>
            </div>
          </section>

          {/* One person runs everything */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 text-center">
              One person runs <span className="text-[hsl(var(--primary))]">everything</span>
            </h2>
            <p className="text-[#A3A3A3] text-center max-w-2xl mx-auto mb-6">
              Learn2Earn is not a company with departments. It is built, taught and maintained personally by George — the courses, the live cohorts, the platform itself and the replies to your messages. You will not waste time being passed around a customer support queue. You deal with George directly.
            </p>
            <div className="max-w-3xl mx-auto">
              <Play className="w-8 h-8 text-[hsl(var(--primary))]" />
            </div>
          </section>

          {/* Two ways to learn here */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 text-center">
              Two ways to <span className="text-[hsl(var(--primary))]">learn here</span>
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
              <div className="bg-white border border-[#E5E5E5] rounded-xl p-5">
                <div className="w-9 h-9 rounded-full bg-[hsl(152_73%_42%_/0.1)] flex items-center justify-center mb-3">
                  <Award className="w-4 h-4 text-[hsl(var(--primary))]" />
                </div>
                <h3 className="font-semibold text-[#111111] mb-1">Buy a single programme</h3>
                <p className="text-sm text-[#737373]">
                  Pay once for a course, cohort or masterclass and it is yours to keep. Nothing renews, and what you bought stays unlocked forever.
                </p>
              </div>
              <div className="bg-white border border-[#E5E5E5] rounded-xl p-5">
                <div className="w-9 h-9 rounded-full bg-[hsl(152_73%_42%_/0.1)] flex items-center justify-center mb-3">
                  <Play className="w-4 h-4 text-[hsl(var(--primary))]" />
                </div>
                <h3 className="font-semibold text-[#111111] mb-1">Take a membership</h3>
                <p className="text-sm text-[#737373]">
                  A membership opens every published course for a fixed period. There is no auto renewal — it simply ends unless you choose to extend, and your progress and certificates survive any gap.
                </p>
              </div>
            </div>
          </section>

          {/* The Journey */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">
              The <span className="text-[hsl(var(--primary))]">Journey</span>
            </h2>
            <div className="relative">
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-[#E5E5E5] md:-translate-x-px" />
              <div className="space-y-8">
                {TIMELINE.map((t, i) => {
                  const Icon = t.icon
                  return (
                  <div key={t.year} className={`relative flex items-start gap-6 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    <div className="hidden md:block md:w-1/2" />
                    <div className="absolute left-4 md:left-1/2 w-8 h-8 -translate-x-1/2 bg-[hsl(var(--primary))] rounded-full flex items-center justify-center z-10">
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="ml-12 md:ml-0 md:w-1/2 bg-white border border-[#E5E5E5] rounded-xl p-4">
                      <span className="text-xs font-bold text-[hsl(var(--primary))]">{t.year}</span>
                      <p className="text-sm font-semibold text-[#111111] mt-1">{t.title}</p>
                    </div>
                  </div>
                )})}
              </div>
            </div>
          </section>

          {/* What I Do Today */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 text-center">
              What I <span className="text-[hsl(var(--primary))]">Do Today</span>
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {WHAT_IDO_TODAY.map((s) => (
                <div key={s.title} className="bg-white border border-[#E5E5E5] rounded-xl p-5">
                  <h3 className="font-semibold text-[#111111] mb-1">{s.title}</h3>
                  <p className="text-sm text-[#737373]">{s.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Brands I've Worked With */}
          <section className="text-center">
            <h2 className="text-2xl font-bold text-white mb-6">Brands I've Worked With</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {BRANDS.map((b) => (
                <span key={b} className="px-4 py-2 bg-[#FAFAFA] rounded-full text-sm font-medium text-[#111111]">{b}</span>
              ))}
            </div>
          </section>

          {/* What's next */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 text-center">
              What's <span className="text-[hsl(var(--primary))]">next</span>
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {WHATS_NEXT.map((item) => (
                <div key={item.title} className="bg-white border border-[#E5E5E5] rounded-xl p-5">
                  <div className="w-9 h-9 rounded-full bg-[hsl(152_73%_42%_/0.1)] flex items-center justify-center mb-3">
                    <Layout className="w-4 h-4 text-[hsl(var(--primary))]" />
                  </div>
                  <h3 className="font-semibold text-[#111111] mb-1">{item.title}</h3>
                  <p className="text-sm text-[#737373]">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Dark CTA */}
          <section className="bg-[#0A0D14] text-white p-8 sm:p-10 rounded-2xl text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">
              Africa doesn&apos;t need more degrees — <span className="text-[hsl(var(--primary))]">Africa needs more skills.</span>
            </h2>
            <p className="text-lg text-gray-300 mb-6 max-w-xl mx-auto">
              Your past doesn&apos;t define your potential. Your skill will.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/courses"
                className="inline-flex h-12 items-center justify-center rounded-lg px-6 font-bold text-sm" style={{ backgroundColor: ACTION, color: '#0D0D0D' }}
              >
                Explore Courses
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-12 items-center justify-center rounded-lg px-6 font-bold text-sm border-2 border-[hsl(var(--primary))] text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))] hover:text-[#0D0D0D]"
              >
                Get in Touch
              </Link>
            </div>
          </section>
        </div>
      </section>
    </div>
  )
}