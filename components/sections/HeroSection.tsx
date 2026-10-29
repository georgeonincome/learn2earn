'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { SITE_CONFIG, toZMW } from '@/lib/data'

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] md:min-h-[85vh] flex items-center overflow-hidden pt-[105px] md:pt-[105px]">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-accent/3" />
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

      <div className="section-padding relative z-10 w-full">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">
            {/* Content */}
            <div className="max-w-[640px]">
              <p className="text-sm md:text-base font-semibold text-accent mb-4 tracking-wide">
                {SITE_CONFIG.tagline}
              </p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-extrabold text-secondary leading-[1.1] mb-6">
                Learn digital skills that pay.
              </h1>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-8 max-w-[540px]">
                One membership unlocks practical courses in AI, ads, social media, video editing, web design and online work.
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                <Link href="/courses" className="btn-primary group">
                  Get my membership
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href={`https://wa.me/${SITE_CONFIG.whatsapp}?text=Hi%20George%2C%20I%20have%20a%20question%20about%20the%20${SITE_CONFIG.name}%20subscription`}
                  className="btn-secondary group"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="w-4 h-4 mr-2 text-primary" />
                  WhatsApp George
                </a>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl md:text-3xl font-extrabold text-primary">
                    ZMW {toZMW(2790)}
                  </span>
                </div>
                <span className="text-muted-foreground text-sm">for 4 months</span>
                <span className="text-muted-foreground text-sm hidden sm:inline">or</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl md:text-3xl font-extrabold text-primary">
                    ZMW {toZMW(7990)}
                  </span>
                </div>
                <span className="text-muted-foreground text-sm">a year</span>
              </div>

              <div className="mt-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-success rounded-full" />
                  Mobile money or card · nothing renews automatically · certificates included
                </span>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative hidden lg:block">
              <div className="relative rounded-2xl overflow-hidden shadow-elevated">
                {/* Placeholder for founder image */}
                <div className="aspect-[4/3] bg-gradient-to-br from-secondary/30 to-primary/10 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <span className="text-5xl font-bold text-primary">G</span>
                    </div>
                    <p className="text-sm text-muted-foreground">George at his desk in Lusaka</p>
                  </div>
                </div>
                {/* Image overlay for premium feel */}
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/20 to-transparent" />
              </div>

              {/* Floating badge */}
              <div className="absolute -left-6 top-1/4 bg-white rounded-xl shadow-card p-4 border border-border animate-float hidden xl:block">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-secondary">5,000+</p>
                    <p className="text-xs text-muted-foreground">Students trained</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
