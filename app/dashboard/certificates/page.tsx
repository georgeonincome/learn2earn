'use client'

/**
 * My Certificates Page — DB-backed (Phase 4).
 *
 * Route: /dashboard/certificates
 *
 * Displays earned certificates from the database with download and verify options.
 */

import { useEffect, useState } from 'react'
import Link from 'next/link'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { CertificatePanel } from '@/components/certificates/CertificatePanel'

export default function CertificatesPage() {
  const [certs, setCerts] = useState<Array<{
    id: string
    certificateId: string
    studentName: string
    courseTitle: string
    courseSlug: string | null
    issueDate: string | null
    isVerified: boolean
    kind: 'course' | 'cohort' | 'book'
  }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/certificates')
      .then((r) => r.ok ? r.json() : { certificates: [] })
      .then((data) => {
        setCerts(data.certificates ?? [])
        setLoading(false)
      })
      .catch((err) => {
        console.error('[CertificatesPage] load error', err)
        setLoading(false)
      })
  }, [])

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-extrabold">My Certificates</h1>
        <Link
          href="/courses"
          className="text-sm font-semibold text-[#0B854C] hover:underline"
        >
          Browse Courses
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-20 text-[#737373] text-sm">Loading certificates…</div>
      ) : certs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {certs.map((cert) => (
            <CertificatePanel key={cert.id} certificate={cert} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E5E5E5] text-[#737373] mx-auto mb-4">
            <span className="w-6 h-6">🏆</span>
          </div>
          <h2 className="text-xl font-bold">No Certificates Yet</h2>
          <p className="text-[#737373] mt-2">
            Complete courses to earn certificates. Display them proudly on your CV and LinkedIn.
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
