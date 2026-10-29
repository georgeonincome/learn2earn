import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function CTASection() {
  return (
    <section className="section-padding py-16 md:py-24">
      <div className="container-wide">
        <div className="bg-gradient-to-r from-primary to-accent rounded-2xl md:rounded-3xl p-8 md:p-12 lg:p-16 text-center text-white relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-4">
              Pick the skill. Do the work. Build the proof.
            </h2>
            <p className="text-white/80 mb-8">
              Join Learn2Earn and start with the course that moves you forward now.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/courses" className="inline-flex items-center justify-center px-7 py-3.5 bg-white text-primary font-bold rounded-xl text-sm hover:bg-white/90 transition-all shadow-elevated">
                Get my membership
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <Link href="/courses" className="inline-flex items-center justify-center px-7 py-3.5 bg-primary-700 text-white font-bold rounded-xl text-sm hover:bg-primary-600 transition-all border-2 border-white/20">
                Browse courses
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
