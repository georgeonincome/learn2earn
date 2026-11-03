import Link from 'next/link'
import { SITE_CONFIG } from '@/lib/data'

export default function TermsPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAFA', color: '#111111' }}>
      <main className="pt-10">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-12 py-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#111111] mb-8">
            Terms of Use
          </h1>
          <p className="text-[#404040] leading-7 mb-8">
            Welcome to Learn2Earn. These terms govern your use of our courses, cohorts and
            membership. By using the site you agree to them.
          </p>

          <h2 className="text-xl font-bold text-[#111111] mt-12 mb-4">Accepting terms</h2>
          <p className="text-[#404040] leading-7 mb-6">
            Learn2Earn is run by {SITE_CONFIG.founder.name} ({SITE_CONFIG.founder.location}). If
            you do not agree with these terms, please do not use the site.
          </p>

          <h2 className="text-xl font-bold text-[#111111] mt-12 mb-4">Course access</h2>
          <p className="text-[#404040] leading-7 mb-6">
            Courses you buy individually are yours to keep. Memberships unlock every published
            course for the period you pay for. Nothing renews automatically.
          </p>

          <h2 className="text-xl font-bold text-[#111111] mt-12 mb-4">Payments</h2>
          <p className="text-[#404040] leading-7 mb-6">
            Payments are processed securely through Flutterwave. We never see or store your card
            details. Mobile money approvals happen on your phone.
          </p>

          <h2 className="text-xl font-bold text-[#111111] mt-12 mb-4">Conduct</h2>
          <p className="text-[#404040] leading-7 mb-6">
            Be respectful to George and other learners. Abuse or spam will get you removed without
            a refund.
          </p>

          <h2 className="text-xl font-bold text-[#111111] mt-12 mb-4">Changes</h2>
          <p className="text-[#404040] leading-7 mb-6">
            We may update these terms from time to time. Continued use means you accept the
            updated terms.
          </p>

          <p className="mt-14 text-sm text-[#737373] border-t pt-6">
            Questions? Message {SITE_CONFIG.founder.name} on WhatsApp at{' '}
            <Link href={`https://wa.me/${SITE_CONFIG.whatsapp}`} className="text-[#0B854C] hover:underline">
              {SITE_CONFIG.founder.phone}
            </Link>{' · '}
            <Link href="/privacy-policy" className="text-[#0B854C] hover:underline">Privacy Policy</Link>{' · '}
            <Link href="/refund-policy" className="text-[#0B854C] hover:underline">Refund Policy</Link>
          </p>
        </div>
      </main>
    </div>
  )
}
