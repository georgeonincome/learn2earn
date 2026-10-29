import Link from 'next/link'
import Image from 'next/image'
import { Award, Globe, Users, MapPin, Phone, Mail, Clock, MessageCircle, ArrowRight, BookOpen } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/data'

/* About page — exact 1:1 from click2skill About-D0g2GHRy.js:
   
   - Hero: founder image (real), headline "I teach what I do for a living.", stats pills
   - Stats band: Students, Community, Countries + CTA pills
   - Timeline: George's journey
   - Skills grid + real founder image
   - Campus note + personal site note
   - Final CTA
*/

const TIMELINE = [
  { year: '2019', event: 'Started freelancing during university — digital marketing and content creation for local Zambian businesses' },
  { year: '2020', event: 'Launched first online course on social media management for beginners' },
  { year: '2021', event: 'Reached 20K+ followers across platforms, began hosting live workshops' },
  { year: '2023', event: 'Trained 2,000+ students across Zambia and Africa through online programs' },
  { year: '2024', event: 'Expanded to AI and automation training, launched cohort-based live classes' },
  { year: '2025', event: 'Launched Learn2Earn platform — accessible, practical digital skills for Africans' },
  { year: '2026', event: '5,000+ students trained, community of 100K+, multi-course catalog live' },
]

const SKILLS = [
  'Digital Marketing & Strategy',
  'Website Design & SEO',
  'Content Creation & Coaching',
  'Freelancing Training',
  'AI Productivity Training',
  'Meta & Google Advertising',
  'Social Media Management',
  'Video Editing & Production',
]

const firstName = SITE_CONFIG.founder.name.split(' ').slice(-1).join(' ')

export default function AboutPage() {
  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: '#FAFAFA', color: '#111111' }}>
      {/* Hero */}
      <section style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <p className="mb-5 inline-block text-[11px] font-bold tracking-[0.14em] uppercase text-[#1DB96B] bg-[#E8F8F0] px-3 py-1 rounded-full">
                Meet the founder
              </p>
              <h1 className="font-head text-4xl md:text-5xl font-extrabold leading-[1.05] tracking-[-0.02em]">
                I teach what I do for a living.
              </h1>
              <p className="mt-6 text-lg leading-8 text-[#404040] max-w-lg">
                Hi, I&apos;m {SITE_CONFIG.founder.name}. {SITE_CONFIG.founder.bio} I teach
                the exact systems I use in my own work every day — with Zambian examples,
                kwacha prices and plain language.
              </p>
              <div className="mt-8 flex gap-3">
                <Link
                  href="/courses"
                  className="inline-flex h-12 items-center justify-center rounded-xl px-6 font-bold text-sm"
                  style={{ backgroundColor: '#1DB96B', color: '#111111' }}
                >
                  Explore courses
                </Link>
                <a
                  href={`https://wa.me/${SITE_CONFIG.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center justify-center rounded-xl px-6 font-bold text-sm border border-[#E5E5E5] text-[#111111]"
                >
                  Get in touch
                </a>
              </div>
            </div>
            <div className="relative hidden lg:block aspect-[4/5] max-h-[600px] overflow-hidden rounded-2xl bg-[#EEF1EE]">
              <Image
                src="/images/elvis-desk-wide.webp"
                alt={`${SITE_CONFIG.founder.name}, founder of Learn2Earn, working in Lusaka`}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section style={{ paddingTop: '4rem', paddingBottom: '4rem', backgroundColor: '#FFFFFF' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {SITE_CONFIG.founder.stats.map((s) => (
              <div key={s.label} className="p-4">
                <p className="text-3xl font-extrabold">{s.value}</p>
                <p className="mt-1 text-sm text-[#737373]">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/subscribe" className="inline-flex h-12 items-center justify-center rounded-xl px-6 font-bold text-sm" style={{ backgroundColor: '#1DB96B', color: '#111111' }}>
              Get membership
            </Link>
            <Link href="/courses" className="inline-flex h-12 items-center justify-center rounded-xl px-6 font-bold text-sm border border-[#E5E5E5] text-[#111111]">
              <BookOpen className="mr-2 h-4 w-4" /> Browse all courses
            </Link>
          </div>
        </div>
      </section>

      {/* Journey timeline */}
      <section style={{ paddingTop: '5rem', paddingBottom: '5rem' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <h2 className="font-head text-3xl font-extrabold leading-tight mb-10 text-center">
            The journey so far
          </h2>
          <ul className="max-w-3xl mx-auto space-y-8">
            {TIMELINE.map((t, i) => (
              <li key={t.year} className="relative pl-12">
                <span
                  className="absolute left-0 top-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center text-[11px] font-bold"
                  style={{ borderColor: '#1DB96B', color: '#1DB96B' }}
                >
                  {t.year.slice(2)}
                </span>
                <p className="font-bold text-sm text-[#111111]">{t.year}</p>
                <p className="text-[#404040] text-sm leading-7">{t.event}</p>
                {i < TIMELINE.length - 1 && (
                  <div className="absolute left-3 top-6 w-px h-[60px] bg-[#E5E5E5]" />
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Skills + Image */}
      <section style={{ paddingTop: '5rem', paddingBottom: '5rem', backgroundColor: '#FFFFFF' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="aspect-[4/5] max-h-[540px] overflow-hidden rounded-2xl bg-[#EEF1EE]">
              <Image
                src="/images/elvis-mic.webp"
                alt={`${SITE_CONFIG.founder.name} teaching a digital skills class`}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </div>
            <div>
              <h2 className="font-head text-3xl font-extrabold leading-tight mb-8">
                What I teach
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SKILLS.map((s) => (
                  <li key={s} className="bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl p-4 text-sm font-medium text-[#111111] flex items-center gap-3">
                    <Award className="w-4 h-4 text-[#1DB96B] shrink-0" /> {s}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm text-[#737373] leading-relaxed">
                Everything is practical, project-based, and taught from real client work and campaigns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Direct contact banner */}
      <section style={{ paddingTop: '4rem', paddingBottom: '4rem', backgroundColor: '#FAFAFA' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="bg-white border border-[#E5E5E5] rounded-2xl p-8 text-center">
            <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#1DB96B] mb-3">
              Direct access
            </p>
            <h2 className="font-head text-2xl font-extrabold mb-4">
              No support desk. Just {firstName}.
            </h2>
            <p className="text-[#404040] max-w-xl mx-auto mb-6 text-sm leading-7">
              When you message Learn2Earn, you&apos;re speaking directly with the person who teaches every class. 
              WhatsApp is the fastest way — replies usually within an hour during work hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href={`https://wa.me/${SITE_CONFIG.whatsapp}`} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center justify-center rounded-xl px-6 font-bold text-sm" style={{ backgroundColor: '#1DB96B', color: '#111111' }}>
                <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp {firstName}
              </a>
              <a href={`mailto:${SITE_CONFIG.founder.email}`} className="inline-flex h-12 items-center justify-center rounded-xl px-6 font-bold text-sm border border-[#E5E5E5] text-[#111111]">
                <Mail className="mr-2 h-4 w-4" /> Email
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Campus + personal */}
      <section style={{ paddingTop: '5rem', paddingBottom: '6rem', backgroundColor: '#FFFFFF' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 grid lg:grid-cols-2 gap-10">
          <div className="bg-[#FAFAFA] border border-[#E5E5E5] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-[#E8F8F0] rounded-xl flex items-center justify-center">
                <MapPin className="w-5 h-5 text-[#1DB96B]" />
              </div>
              <div>
                <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#1DB96B]">Physical campus</p>
                <h3 className="text-xl font-extrabold">A physical campus, 2027/28</h3>
              </div>
            </div>
            <p className="text-[#404040] leading-7 text-sm">
              A separate project {firstName} is building alongside Learn2Earn, extending the same
              practical teaching approach to in-person, hands-on training. Everything stays online until then.
            </p>
          </div>
          <div className="bg-[#FAFAFA] border border-[#E5E5E5] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-[#E8F8F0] rounded-xl flex items-center justify-center">
                <Globe className="w-5 h-5 text-[#1DB96B]" />
              </div>
              <div>
                <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#1DB96B]">Beyond the classroom</p>
                <h3 className="text-xl font-extrabold">{firstName}&apos;s personal work</h3>
              </div>
            </div>
            <p className="text-[#404040] leading-7 text-sm">
              Speaking, consulting, brand work and everything {firstName} does beyond Learn2Earn.
              Follow on social media to see the latest projects.
            </p>
            <div className="mt-4 flex gap-2">
              <a href={SITE_CONFIG.social.tiktok} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-[#1DB96B] hover:underline">TikTok</a>
              <span className="text-[#E5E5E5]">·</span>
              <a href={SITE_CONFIG.social.instagram} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-[#1DB96B] hover:underline">Instagram</a>
              <span className="text-[#E5E5E5]">·</span>
              <a href={SITE_CONFIG.social.youtube} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-[#1DB96B] hover:underline">YouTube</a>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ paddingTop: '6rem', paddingBottom: '8rem', backgroundColor: '#FAFAFA' }}>
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-12 text-center">
          <p className="text-sm font-bold text-[#1DB96B] mb-4 uppercase tracking-wider">
            Your past doesn&apos;t define your potential. Your skill will.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/courses"
              className="inline-flex h-12 items-center justify-center rounded-xl px-6 font-bold text-sm"
              style={{ backgroundColor: '#1DB96B', color: '#111111' }}
            >
              Explore courses <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <a
              href={`https://wa.me/${SITE_CONFIG.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-xl px-6 font-bold text-sm border border-[#E5E5E5] text-[#111111]"
            >
              Get in touch
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
