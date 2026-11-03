import Link from 'next/link'
import { SITE_CONFIG } from '@/lib/data'

export default function RefundPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAFA', color: '#111111' }}>
      <main className="pt-10">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-12 py-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#111111] mb-8">
            Refund Policy
          </h1>
          <p className="text-[#404040] leading-7 mb-8">
            Fair, plain-language refunds for courses, live cohorts and memberships.
          </p>

          <h2 className="text-xl font-bold text-[#111111] mt-12 mb-4">Self-paced courses</h2>
          <p className="text-[#404040] leading-7 mb-6">
            You can request a refund within 7 days of purchase, as long as you&apos;ve barely
            started and haven&apos;t downloaded the main resources.
          </p>

          <h2 className="text-xl font-bold text-[#111111] mt-12 mb-4">Live cohorts</h2>
          <p className="text-[#404040] leading-7 mb-6">
            Refunds are available up to 48 hours before the cohort start date. Once it begins,
            recordings stay in your account.
          </p>

          <h2 className="text-xl font-bold text-[#111111] mt-12 mb-4">Memberships</h2>
          <p className="text-[#404040] leading-7 mb-6">
            Memberships are one-time payments for a fixed period — nothing renews automatically.
            Refunds within 7 days of purchase if you haven&apos;t started any course.
          </p>

          <h2 className="text-xl font-bold text-[#111111] mt-12 mb-4">How to request</h2>
          <p className="text-[#404040] leading-7 mb-6">
            WhatsApp {SITE_CONFIG.founder.name} at{' '}
            <Link href={`https://wa.me/${SITE_CONFIG.whatsapp}`} className="text-[#0B854C] hover:underline">
              {SITE_CONFIG.founder.phone}
            </Link>{' '}
            with your transaction reference. Payment or access issues are handled first.
          </p>

          <p className="mt-14 text-sm text-[#737373] border-t pt-6">
            Questions? Message us on WhatsApp or email{' '}
            <a href={`mailto:${SITE_CONFIG.founder.email}`} className="text-[#0B854C] hover:underline">
              {SITE_CONFIG.founder.email}
            </a>{' · '}
            <Link href="/terms" className="text-[#0B854C] hover:underline">Terms of Use</Link>{' · '}
            <Link href="/privacy-policy" className="text-[#0B854C] hover:underline">Privacy Policy</Link>
          </p>
        </div>
      </main>
    </div>
  )
}
