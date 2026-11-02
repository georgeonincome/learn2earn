'use client'

/**
 * CertificatePanel — mirrors reference CertificatePanel-CXemqskQ.js
 *
 * Displays a single certificate with download, share, and verify actions.
 *
 * Props:
 *   certificate: Certificate row from the DB
 *   showShare: whether to show the share button (default true)
 */

import { useState } from 'react'
import { Download, Share2, Link as LinkIcon, Check, Copy } from 'lucide-react'

export type CertificatePanelProps = {
  certificate: {
    id: string
    certificateId: string
    studentName: string
    courseTitle: string
    courseSlug: string | null
    issueDate: string | null
    isVerified: boolean
    kind: 'course' | 'cohort' | 'book'
  }
  showShare?: boolean
}

export function CertificatePanel({ certificate, showShare = true }: CertificatePanelProps) {
  const [copied, setCopied] = useState(false)
  const [downloaded, setDownloaded] = useState(false)

  const verifyUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/verify/${certificate.certificateId}`
  const issueDate = certificate.issueDate
    ? new Date(certificate.issueDate).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : ''

  const handleDownload = () => {
    setDownloaded(true)
    setTimeout(() => setDownloaded(false), 2000)
    if (typeof window !== 'undefined') {
      window.location.href = `/api/certificates/${certificate.id}/download`
    }
  }

  const handleCopy = async () => {
    if (typeof navigator.clipboard === 'undefined') return
    try {
      await navigator.clipboard.writeText(verifyUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // ignore
    }
  }

  const kindLabel = certificate.kind === 'course' ? 'Course' : certificate.kind === 'cohort' ? 'Cohort' : 'Book'

  return (
    <article className="rounded-2xl border border-[#E3E8E5] bg-white p-6 sm:p-8 text-[#10201A]">
      <header className="mb-6">
        <div className="flex flex-wrap items-start gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F6EF] px-3 py-[3px] text-[12px] font-bold text-[#0B6B3D]">
            {kindLabel} Completion
          </span>
          <span className="flex items-center gap-1 text-xs text-[#5B6B64]">
            <Check className="w-3 h-3" />
            Issued {issueDate}
          </span>
        </div>
        <h1 className="mt-4 text-2xl font-bold leading-tight sm:text-[28px]">
          {certificate.courseTitle}
        </h1>
        <p className="mt-1 text-[13px] text-[#5B6B64]">
          This certifies that <span className="font-bold">{certificate.studentName}</span> has successfully completed the program.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#E3E8E5] pt-5">
        <div className="flex flex-col">
          <dt className="text-xs font-semibold text-[#5B6B64]">Certificate ID</dt>
          <dd className="mt-0.5 font-mono text-sm text-[#10201A]">{certificate.certificateId}</dd>
        </div>
        <div className="flex flex-col">
          <dt className="text-xs font-semibold text-[#5B6B64]">Verify at</dt>
          <dd className="mt-0.5 text-[11px] font-mono text-[#1DB96B] break-all">{verifyUrl}</dd>
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleDownload}
          disabled={downloaded}
          className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-[#0B6B3D] border border-[#0B6B3D] bg-[#F3FBF6] hover:bg-[#0B6B3D]/50 transition-colors"
        >
          {downloaded ? (
            <span className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5" />
              Downloaded
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Download className="w-3.5 h-3.5" /> Download PDF
            </span>
          )}
        </button>
        {showShare && (
          <button
            onClick={handleCopy}
            className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white bg-[#1DB96B] hover:bg-[#17A05D] transition-colors"
          >
            {copied ? (
              <span className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5" />
                Copied
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Share2 className="w-3.5 h-3.5" /> Share
              </span>
            )}
          </button>
        )}
        <a
          href={`/verify/${certificate.certificateId}`}
          className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-[#5B6B64] border border-[#E3E8E5] hover:bg-[#F3F4F6] transition-colors"
        >
          <span className="flex items-center gap-2">
            <LinkIcon className="w-3.5 h-3.5" /> Verify
          </span>
        </a>
      </div>

      <p className="mt-6 max-w-[720px] text-[10.5px] leading-normal text-[#7A8A83]">
        <b>This certificate records completion, not competence.</b> Competence is proven by the work you produce with what you learned. Learn2Earn is not a government or board accredited institution, and this is not an accredited qualification.
      </p>
    </article>
  )
}
