'use client'

import Link from 'next/link'
import { Check, ArrowRight, MessageCircle } from 'lucide-react'
import { MEMBERSHIP_PLANS, SITE_CONFIG } from '@/lib/data'
import { formatPrice } from '@/lib/utils'

export function PricingSection() {
  return (
    <section id="pricing" className="section-padding py-16 md:py-24">
      <div className="container-wide">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="heading-accent">Membership</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-secondary mb-4">
            Choose how long you want to learn.
          </h2>
          <p className="text-muted-foreground">
            One payment. Every published course. No automatic renewal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {MEMBERSHIP_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl border-2 p-6 md:p-8 transition-all duration-300 hover:shadow-elevated ${
                plan.popular
                  ? 'border-primary bg-primary/3'
                  : 'border-border bg-white hover:border-primary/30'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 right-6">
                  <span className="bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-secondary mb-1">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">{plan.duration}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl md:text-5xl font-extrabold text-primary">
                    {formatPrice(plan.price)}
                  </span>
                  {plan.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      {formatPrice(plan.originalPrice)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  One-time payment, no auto-renewal
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                    <span className="text-sm text-secondary">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={`/checkout?plan=${plan.id}`}
                className={`block w-full text-center py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  plan.popular
                    ? 'bg-primary text-white hover:bg-primary-600 shadow-button hover:shadow-lg'
                    : 'bg-secondary text-secondary-foreground hover:bg-zinc-200 border border-border'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Manual Payment CTA */}
        <div className="text-center mt-8">
          <a
            href={`https://wa.me/${SITE_CONFIG.whatsapp}?text=Hi%20George%2C%20I%20have%20a%20question%20about%20the%20${SITE_CONFIG.name}%20subscription`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-primary transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Ask about manual payment
          </a>
        </div>
      </div>
    </section>
  )
}
