'use client'

import Link from 'next/link'
import DashboardLayout from '@/components/dashboard/DashboardLayout'

/**
 * My Certificates Page
 *
 * Route: /dashboard/certificates
 *
 * Displays earned certificates with download and verify options.
 */

export default function CertificatesPage() {
  // Mock certificates - in production this comes from database
  const certificates = [
    {
      id: 1,
      certificateId: 'L2E-2026-001',
      courseTitle: 'Digital Skills Training in Lusaka',
      courseSlug: 'digital-skills-zambia',
      issueDate: '2026-10-15',
      isVerified: true,
    },
    {
      id: 2,
      certificateId: 'L2E-2026-002',
      courseTitle: 'Computer Skills Zambia',
      courseSlug: 'computer-skills-zambia',
      issueDate: '2026-09-20',
      isVerified: true,
    },
    {
      id: 3,
      certificateId: 'L2E-2026-003',
      courseTitle: 'Copywriting Zambia',
      courseSlug: 'copywriting-zambia',
      issueDate: '2026-08-10',
      isVerified: true,
    },
  ]

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-extrabold">My Certificates</h1>
        <Link
          href="/courses"
          className="text-sm font-semibold text-[#1DB96B] hover:underline"
        >
          Browse Courses
        </Link>
      </div>

      {certificates.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {certificates.map((cert) => (
            <CertificateCard key={cert.id} certificate={cert} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E5E5E5] text-[#737373] mx-auto mb-4">
            <span className="w-6 h-6">🏆</span>
          </div>
          <h2 className="text-xl font-bold">No Certificates Yet</h2>
          <p className="text-[#737373] mt-2">
            Complete courses to earn certificates. Display them proudly on your
            CV and LinkedIn.
          </p>
          <Link
            href="/courses"
            className="mt-4 inline-flex items-center gap-2 rounded-lg px-6 py-2 text-sm font-semibold transition-colors" style={{ minHeight: 44, borderRadius: 8, background: '#1DB96B', color: '#fff', border: '1px solid #1DB96B', padding: '0 18px' }}
          >
            Browse Courses
          </Link>
        </div>
      )}
    </DashboardLayout>
  )
}

interface CertificateCardProps {
  certificate: {
    id: number
    certificateId: string
    courseTitle: string
    courseSlug: string
    issueDate: string
    isVerified: boolean
  }
}

function CertificateCard({ certificate }: CertificateCardProps) {
  const date = new Date(certificate.issueDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  return (
    <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1DB96B]/10 text-[#1DB96B]">
          <span className="w-6 h-6">🎓</span>
        </div>
        <span className="text-xs font-semibold text-[#1DB96B]">
          Verified
        </span>
      </div>
      <h3 className="text-lg font-bold">{certificate.courseTitle}</h3>
      <p className="text-sm text-[#737373] mt-1">
        Course completion certificate
      </p>
      <div className="mt-4 space-y-1 text-sm text-[#737373]">
        <div className="flex justify-between">
          <span>Certificate ID:</span>
          <span className="font-mono text-xs">{certificate.certificateId}</span>
        </div>
        <div className="flex justify-between">
          <span>Issued:</span>
          <span>{date}</span>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => {}}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg px-6 py-2 text-sm font-semibold transition-colors" style={{ minHeight: 44, borderRadius: 8, background: '#1DB96B', color: '#fff', border: '1px solid #1DB96B', padding: '0 18px' }}
        >
          <span className="w-4 h-4">📄</span>
          Download
        </button>
        <Link
          href={`/verify/${certificate.certificateId}`}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg px-6 py-2 text-sm font-semibold transition-colors" style={{ minHeight: 44, borderRadius: 8, background: '#FFFFFF', color: '#111111', border: '1px solid #E5E5E5', padding: '0 18px' }}
        >
          Verify
        </Link>
      </div>
    </div>
  )
}
