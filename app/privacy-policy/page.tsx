import Link from 'next/link'
import { SITE_CONFIG } from '@/lib/data'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAFA', color: '#111111' }}>
      <main className="pt-10">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-12 py-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#111111] mb-8">
            Privacy Policy
          </h1>
          <p className="text-[#404040] leading-7 mb-8">
            Learn2Earn is run by {SITE_CONFIG.founder.name}. This notice explains what we collect
            and why.
          </p>

          <h2 className="text-xl font-bold text-[#111111] mt-12 mb-4">Information we collect</h2>
          <p className="text-[#404040] leading-7 mb-6">
            Name, email, phone number and payment channel when you check out; progress and
            certificates as you learn; and messages you send on WhatsApp or email.
          </p>

          <h2 className="text-xl font-bold text-[#111111] mt-12 mb-4">How we use your information</h2>
          <p className="text-[#404040] leading-7 mb-6">
            To give you access to courses, send receipts, activate manual mobile-money payments,
            and contact you about your learning. We never sell your data.
          </p>

          <h2 className="text-xl font-bold text-[#111111] mt-12 mb-4">Data security</h2>
          <p className="text-[#404040] leading-7 mb-6">
            Cards are never stored by us — Flutterwave handles them. Your account is protected by
            your email and password.
          </p>

          <h2 className="text-xl font-bold text-[#111111] mt-12 mb-4">Your choices</h2>
          <p className="text-[#404040] leading-7 mb-6">
            You can ask for your data or delete your account by messaging George on WhatsApp.
          </p>

          <p className="mt-14 text-sm text-[#737373] border-t pt-6">
            Questions? Message {SITE_CONFIG.founder.name} at{' '}
            <Link href={`https://wa.me/${SITE_CONFIG.whatsapp}`} className="text-[#1DB96B] hover:underline">
              {SITE_CONFIG.founder.phone}
            </Link>{' · '}
            <Link href="/terms" className="text-[#1DB96B] hover:underline">Terms of Use</Link>{' · '}
            <Link href="/refund-policy" className="text-[#1DB96B] hover:underline">Refund Policy</Link>
          </p>
        </div>
      </main>
    </div>
  )
}
