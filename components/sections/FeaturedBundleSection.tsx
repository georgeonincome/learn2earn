import Link from 'next/link'
import { ArrowRight, Award, Infinity, PiggyBank } from 'lucide-react'
import { FEATURED_BUNDLE } from '@/lib/data'
import { formatPrice } from '@/lib/utils'

export function FeaturedBundleSection() {
  return (
    <section className="section-padding py-16 md:py-24">
      <div className="container-wide">
        <div className="bg-gradient-to-br from-secondary/30 to-primary/5 rounded-3xl border border-border overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0">
            {/* Content */}
            <div className="p-6 md:p-10 lg:p-14 flex flex-col justify-center">
              <div className="mb-2">
                <span className="inline-block text-xs font-bold text-accent uppercase tracking-wider">
                  Featured bundle
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-secondary mb-4">
                {FEATURED_BUNDLE.title}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {FEATURED_BUNDLE.description}
              </p>
              <ul className="space-y-3 mb-8">
                {FEATURED_BUNDLE.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5">
                    <Award className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-sm text-secondary">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-primary">
                    {formatPrice(FEATURED_BUNDLE.price)}
                  </span>
                  {FEATURED_BUNDLE.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      {formatPrice(FEATURED_BUNDLE.originalPrice)}
                    </span>
                  )}
                </div>
                <span className="text-xs text-success font-semibold bg-success/10 px-3 py-1.5 rounded-full">
                  {FEATURED_BUNDLE.savings}
                </span>
              </div>
              <div className="mt-6 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Infinity className="w-3.5 h-3.5" />
                  Lifetime access
                </span>
                <span>·</span>
                <span className="inline-flex items-center gap-1">
                  <PiggyBank className="w-3.5 h-3.5" />
                  Mobile money or card
                </span>
              </div>
            </div>

            {/* Image */}
            <div className="relative aspect-[4/3] lg:aspect-auto bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-32 h-32 mx-auto bg-white/50 rounded-2xl backdrop-blur-sm flex items-center justify-center border border-white/30 shadow-elevated mb-4">
                  <span className="text-5xl font-bold text-primary/40">📱</span>
                </div>
                <p className="text-sm text-muted-foreground">George managing social media for clients</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
