'use client'

import Link from 'next/link'
import {
  BookOpen,
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
} from 'lucide-react'
import { SITE_CONFIG } from '@/lib/data'

/* Footer — exact 1:1 from click2skill reference:
   - Dark bg #0A0D14, "Stay Updated" newsletter strip top
   - 4 cols: brand+tagline, Explore links, "Talk to George", Follow + Payment
   - Legal bottom row
   - Mobile sticky bottom bar removed (cleaner than hardcoded price)
*/

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  )
}
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  )
}
function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}
function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

const SOCIALS = [
  { label: 'TikTok', href: SITE_CONFIG.social.tiktok, Icon: TikTokIcon },
  { label: 'Instagram', href: SITE_CONFIG.social.instagram, Icon: InstagramIcon },
  { label: 'YouTube', href: SITE_CONFIG.social.youtube, Icon: YouTubeIcon },
  { label: 'LinkedIn', href: SITE_CONFIG.social.linkedin, Icon: LinkedInIcon },
]

export function Footer() {
  const firstName = SITE_CONFIG.founder.name.split(' ').slice(-1).join(' ')

  return (
    <footer className="bg-[#0A0D14] text-white">
      {/* Newsletter strip */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-bold mb-1 text-white">Stay Updated</h3>
              <p className="text-sm text-gray-400">
                Get digital skills tips and course updates straight to your inbox.
              </p>
            </div>
            <form
              className="flex gap-2 w-full md:w-auto"
              action="/api/subscribe"
              method="POST"
            >
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-[hsl(var(--primary))]"
                required
              />
              <button
                type="submit"
                className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary-dark))] text-[hsl(var(--primary-foreground))] font-semibold px-5 py-2.5 rounded-lg text-sm shrink-0 transition-[var(--transition-smooth)]"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[hsl(var(--primary))] rounded-lg flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              </div>
              <span className="font-head text-xl font-extrabold text-white">Learn2Earn</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Practical digital skills — faster, smarter, and with real results.
            </p>
            <p className="text-sm text-gray-400 leading-relaxed mt-3">
              Run and maintained personally by{' '}
              <span className="text-white font-semibold">{SITE_CONFIG.founder.name}</span>. No support desk — you deal with {firstName} directly.
            </p>
            <p className="text-xs text-gray-500 leading-relaxed mt-3">
              Serving learners across Zambia and Africa · Based in{' '}
              {SITE_CONFIG.founder.location}
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-sm font-bold text-[hsl(var(--primary))] uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {[
                { label: 'Courses', href: '/courses' },
                { label: 'Cohorts', href: '/cohorts' },
                { label: 'Blog', href: '/blog' },
                { label: 'About', href: '/about' },
                { label: 'FAQs', href: '/faq' },
                { label: 'Contact', href: '/contact' },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-[hsl(var(--primary))] transition-[var(--transition-smooth)]">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Talk to George */}
          <div>
            <h4 className="text-sm font-bold text-[hsl(var(--primary))] uppercase tracking-wider mb-4">
              Talk to {firstName}
            </h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[hsl(var(--primary))] shrink-0" />
                <a href={`tel:${SITE_CONFIG.founder.phone.replace(/\s\/\s/g, '').replace(/\s/g, '')}`} className="hover:text-[hsl(var(--primary))] transition-[var(--transition-smooth)]">
                  {SITE_CONFIG.founder.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[hsl(var(--primary))] shrink-0" />
                <a
                  href={`https://wa.me/${SITE_CONFIG.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[hsl(var(--primary))] transition-[var(--transition-smooth)]"
                >
                  WhatsApp {firstName}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[hsl(var(--primary))] shrink-0" />
                <a href={`mailto:${SITE_CONFIG.founder.email}`} className="hover:text-[hsl(var(--primary))] transition-[var(--transition-smooth)]">
                  {SITE_CONFIG.founder.email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[hsl(var(--primary))] shrink-0" />
                {SITE_CONFIG.founder.location}
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[hsl(var(--primary))] shrink-0" />
                {SITE_CONFIG.founder.hours}
              </li>
            </ul>
          </div>

          {/* Follow Us + Payments */}
          <div>
            <h4 className="text-sm font-bold text-[hsl(var(--primary))] uppercase tracking-wider mb-4">
              Follow Us
            </h4>
            <ul className="space-y-3 text-sm text-gray-400">
              {SOCIALS.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-[hsl(var(--primary))] transition-[var(--transition-smooth)]"
                  >
                    <Icon className="w-4 h-4 text-[hsl(var(--primary))] shrink-0" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-5 border-t border-white/10">
              <p className="text-xs text-gray-500 mb-2">We accept</p>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="px-2 py-1 bg-white/5 rounded">MTN</span>
                <span className="px-2 py-1 bg-white/5 rounded">Airtel</span>
                <span className="px-2 py-1 bg-white/5 rounded">Card</span>
              </div>
            </div>
          </div>
        </div>

        {/* Legal bar */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {[
              { label: 'Terms', href: '/terms' },
              { label: 'Privacy', href: '/privacy-policy' },
              { label: 'Refunds', href: '/refund-policy' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-gray-500 hover:text-[hsl(var(--primary))] transition-[var(--transition-smooth)]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
