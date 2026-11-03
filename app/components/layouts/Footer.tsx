'use client'

import Link from 'next/link'
import { SITE_CONFIG } from '@/lib/data'

const NAV_LINKS = [
  { label: 'Courses', href: '/courses' },
  { label: 'Cohorts', href: '/cohorts' },
  { label: 'Masterclasses', href: '/masterclasses' },
  { label: 'Books', href: '/books' },
  { label: 'FAQs', href: '/faq' },
  { label: 'Contact', href: '/contact' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms of Use', href: '/terms' },
  { label: 'Refund Policy', href: '/refund-policy' },
]

export default function Footer() {
  return (
    <footer className="border-t border-[#E5E5E5] bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row justify-between gap-8">
          {/* Brand column */}
          <div className="mb-6 lg:mb-0 lg:w-1/3">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#1DB96B] rounded-lg flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              </div>
              <span className="font-head font-extrabold text-lg tracking-tight">Learn2Earn</span>
            </div>
            <p className="text-sm text-[#737373] max-w-[32ch] mt-2">
              Practical digital skills taught by George J. Kasonso. Learn AI, Meta ads, social media, web design, and video editing. Practical courses from ZMW 432.
            </p>
          </div>

          {/* Navigation columns */}
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="flex-1">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#737373] mb-4">Learn</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/courses" className="text-sm text-[#737373] hover:text-[#111111] hover:underline transition-colors">
                    Browse Courses
                  </Link>
                </li>
                <li>
                  <Link href="/cohorts" className="text-sm text-[#737373] hover:text-[#111111] hover:underline transition-colors">
                    Live Cohorts
                  </Link>
                </li>
                <li>
                  <Link href="/masterclasses" className="text-sm text-[#737373] hover:text-[#111111] hover:underline transition-colors">
                    Masterclasses
                  </Link>
                </li>
                <li>
                  <Link href="/books" className="text-sm text-[#737373] hover:text-[#111111] hover:underline transition-colors">
                    E-Books
                  </Link>
                </li>
              </ul>
            </div>
            <div className="flex-1">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#737373] mb-4">Company</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/about" className="text-sm text-[#737373] hover:text-[#111111] hover:underline transition-colors">
                    About George
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sm text-[#737373] hover:text-[#111111] hover:underline transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-sm text-[#737373] hover:text-[#111111] hover:underline transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div className="flex-1">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#737373] mb-4">Legal</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/terms" className="text-sm text-[#737373] hover:text-[#111111] hover:underline transition-colors">
                    Terms of Use
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="text-sm text-[#737373] hover:text-[#111111] hover:underline transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/refund-policy" className="text-sm text-[#737373] hover:text-[#111111] hover:underline transition-colors">
                    Refund Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-[#E5E5E5] flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#737373]">Learn2Earn © {new Date().getFullYear()}. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <a href={SITE_CONFIG.social.tiktok} className="text-[#737373] hover:text-[#111111] hover:underline transition-colors" target="_blank" rel="noopener noreferrer">
              <span className="sr-only">TikTok</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12.04 18.62c1.43-.11 2.54-.77 3.07-1.78 1.65-2.08 1.58-5.08-.35-7.54-1.64-2.05-4.12-3.25-7.06-3.25-2.53 0-4.87 1.47-6.41 3.79-2.47 3.76-2.38 9.16 1.51 11.79 2.47 1.58 5.68 1.24 7.01-1.94.98-2.36-.32-4.51-2.66-4.92-2.09-.71-2.84-1.4-2.84-1.4 0-1.66 1.45-2.98 3.33-3.12 2.44-.61 4.36 1.64 4.94 2.63 0 0 2.43-4.79-2.91-11.52-1.31-1.73-3.53-2.98-6.68-2.98-4.48 0-7.66 4.42-6.32 8.46-.66 3.51.5 6.76 1.92 8.66.94 1.19 2.65 1.87 4.55 1.87 1.85 0 4.27-1.38 4.53-1.46 0-.31-.06-2.38 1.11-2.48 1.73-.39 4.25-.83 5.58-3.2 2.05-2.78 2.02-6.1 2.07-9.61.01-.08 0-.15.01-.22 0-1.72.36-3.53 1.24-5.26 2.32-1.75 2.51-1.43 6.07-.03 7.32 1.12 1.16 3.08 1.38 3.24 1.36v.01c-.42-.08-.87-.14-1.31-.23-1.36-.35-2.72-.77-4.06-1.36-2.3-1.11-4.62-2.53-6.38-4.37-.07-.03-.14-.07-.22-.1-.03-.01-.06-.01-.09-.01v-.01c0-3.06-2.49-5.54-5.54-5.54-3.05 0-5.53 2.49-5.53 5.54 0 1.35.78 2.61 1.96 3.08.26.42.37.85.54 1.26q1.135 3.465 4.635 4.48c.62.22 1.24.39 1.89.39 3.51 0 6.72-2.28 7.95-3.37 1.38-1.19 2.5-2.78 2.5-4.99.01-2.17-2.06-3.94-4.59-3.94-1.32 0-2.47 1.12-2.87 2.83-.21 2.71-2.02 4.64-5.16 3.63-2.54-.65-5.32 1.32-4.46 4.43.91 3.41 3.49 5.35 6.92 5.35 1.15 0 2.24-.32 3.14-1.01q.195-.18.4-.33 1.41-1.09 1.62-2.53 1.34-2.68.09-.69.37-1.49.39-1.59-.19-2.91-1.59-2.91 0-.01-.04-.02-.01-.02h-.01c.28-.12.54-.31.79-.48"/></svg>
            </a>
            <a href={SITE_CONFIG.social.instagram} className="text-[#737373] hover:text-[#111111] hover:underline transition-colors" target="_blank" rel="noopener noreferrer">
              <span className="sr-only">Instagram</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
            </a>
            <a href={SITE_CONFIG.social.youtube} className="text-[#737373] hover:text-[#111111] hover:underline transition-colors" target="_blank" rel="noopener noreferrer">
              <span className="sr-only">YouTube</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </a>
          </div>
        </div>
      </div>
      </footer>
  )
}