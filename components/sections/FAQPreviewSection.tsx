'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, MessageCircle } from 'lucide-react'
import { FAQS, SITE_CONFIG } from '@/lib/data'
import { cn } from '@/lib/utils'

export function FAQPreviewSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const previewFaqs = FAQS.slice(0, 6)

  return (
    <section className="section-padding py-16 md:py-24 bg-secondary/20">
      <div className="container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-[0.4fr_0.6fr] gap-12 lg:gap-16">
          {/* Sticky header */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <p className="heading-accent">Questions</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-secondary mb-4">
              Before you join.
            </h2>
            <p className="text-muted-foreground mb-6">
              Still unsure? Message George directly and get a clear answer.
            </p>
            <a
              href={`https://wa.me/${SITE_CONFIG.whatsapp}?text=Hi%20George%2C%20I%20have%20a%20question%20about%20the%20${SITE_CONFIG.name}%20subscription`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              <MessageCircle className="w-4 h-4 mr-2 text-primary" />
              WhatsApp George
            </a>
          </div>

          {/* FAQ List */}
          <div className="divide-y divide-border">
            {previewFaqs.map((faq, index) => (
              <div key={index} className="py-4">
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between text-left group"
                >
                  <span className="text-sm font-semibold text-secondary group-hover:text-primary transition-colors pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={cn(
                      'w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-200',
                      openIndex === index && 'rotate-180'
                    )}
                  />
                </button>
                <div
                  className={cn(
                    'overflow-hidden transition-all duration-200',
                    openIndex === index ? 'max-h-96 mt-3' : 'max-h-0'
                  )}
                >
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-10">
          <Link href="/faq" className="link-primary">
            See all FAQs
          </Link>
        </div>
      </div>
    </section>
  )
}
