import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Users, Globe, Award } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/data'

export function AboutInstructorSection() {
  return (
    <section className="section-padding py-16 md:py-24 bg-secondary/20">
      <div className="container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-12 lg:gap-16 items-center">
          {/* Image */}
          <div className="relative">
            <div className="aspect-[3/4] md:aspect-[4/5] rounded-2xl overflow-hidden shadow-elevated bg-gradient-to-br from-primary/10 to-secondary/30 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-32 h-32 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-4xl font-bold text-primary">G</span>
                </div>
                <p className="text-sm text-muted-foreground">{SITE_CONFIG.founder.name}</p>
              </div>
            </div>

            {/* Floating stat cards */}
            <div className="absolute -right-4 top-8 bg-white rounded-xl shadow-card p-4 border border-border hidden md:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-secondary">5,000+</p>
                  <p className="text-xs text-muted-foreground">Students</p>
                </div>
              </div>
            </div>

            <div className="absolute -left-4 bottom-16 bg-white rounded-xl shadow-card p-4 border border-border hidden md:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-bold text-secondary">15+</p>
                  <p className="text-xs text-muted-foreground">Countries</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <p className="heading-accent">About {SITE_CONFIG.founder.name.split(' ')[0]}</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-secondary mb-6">
              I teach what I do for a living.
            </h2>
            <div className="prose prose-sm max-w-none mb-8">
              <p className="text-muted-foreground leading-relaxed">
                I'm {SITE_CONFIG.founder.name}. I build websites, run marketing campaigns and teach the exact digital systems I use in my own work every day.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                My lessons use Zambian examples, kwacha prices and plain language — because that is how I work too.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                {SITE_CONFIG.name} has no support desk. When you message, you are speaking directly with me.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <Link href="/courses" className="btn-primary">
                Learn with me
              </Link>
              <Link href="/about" className="btn-secondary group">
                Read my story
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
