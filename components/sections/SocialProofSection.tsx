'use client'

import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { SOCIAL_LINKS } from '@/lib/data'

export function SocialProofSection() {
  return (
    <section className="section-padding py-16 md:py-24">
      <div className="container-wide text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-secondary mb-3">
          Check the teaching before you pay.
        </h2>
        <p className="text-muted-foreground mb-10 max-w-2xl mx-auto">
          George shares practical digital skills content across five platforms. Watch a few lessons first and decide whether the teaching style works for you.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 max-w-4xl mx-auto mb-12">
          {[
            { label: 'TikTok', handle: '@george_kasonso', href: SOCIAL_LINKS.find(s => s.label === 'TikTok')?.href || '#' },
            { label: 'Instagram', handle: '@george_kasonso', href: SOCIAL_LINKS.find(s => s.label === 'Instagram')?.href || '#' },
            { label: 'YouTube', handle: '@georgekasonso', href: SOCIAL_LINKS.find(s => s.label === 'YouTube')?.href || '#' },
            { label: 'Facebook', handle: 'George Kasonso', href: SOCIAL_LINKS.find(s => s.label === 'Facebook')?.href || '#' },
            { label: 'LinkedIn', handle: 'George Kasonso', href: SOCIAL_LINKS.find(s => s.label === 'LinkedIn')?.href || '#' },
          ].map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-2xl border border-border p-4 md:p-5 hover:shadow-card hover:-translate-y-1 transition-all duration-300 group"
            >
              <span className="text-sm font-bold text-secondary group-hover:text-primary transition-colors">
                {social.label}
              </span>
              <p className="text-xs text-muted-foreground mt-1">{social.handle}</p>
            </a>
          ))}
        </div>

        <Link href="/courses" className="btn-primary">
          Ready? Get membership
        </Link>

        {/* Video Lessons Preview */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-secondary mb-2">Watch and learn</h3>
          <p className="text-muted-foreground mb-8">Practical lessons from George.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {[
              {
                title: 'Your degree does not define your potential',
                desc: 'Why curiosity and self-taught digital skills can create opportunities beyond your coursework.',
              },
              {
                title: 'Five digital skills to learn in 2026',
                desc: 'AI prompting, vibe coding, video editing, paid advertising and email automation.',
              },
              {
                title: 'Skills for remote work',
                desc: 'Build a practical craft, learn continuously and turn that skill into income.',
              },
            ].map((video, i) => (
              <div key={i} className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-card transition-all">
                <div className="aspect-video bg-gradient-to-br from-secondary/50 to-primary/5 flex items-center justify-center group cursor-pointer">
                  <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-elevated group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </div>
                </div>
                <div className="p-4 text-left">
                  <h4 className="text-sm font-bold text-secondary mb-1 line-clamp-2">{video.title}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">{video.desc}</p>
                  <span className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-accent">
                    Watch on TikTok <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
