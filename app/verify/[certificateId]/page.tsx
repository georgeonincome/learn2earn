import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ShieldCheck, Check, ArrowLeft } from 'lucide-react'

export async function generateMetadata({ params }: { params: Promise<{ certificateId: string }> }) {
  const { certificateId } = await params
  return {
    title: `Verify Certificate ${certificateId} | Learn2Earn`,
    description: `Verify the certificate ${certificateId}`,
  }
}

export default async function VerifyCertificatePage({ params }: { params: Promise<{ certificateId: string }> }) {
  const { certificateId } = await params

  // Fetch certificate verification from the API
  const res = await fetch(`/api/certificates/${certificateId}/verify`, { cache: 'no-store' })
  if (!res.ok) notFound()
  const data = await res.json()
  if (!data.found) notFound()

  const issueDate = data.issueDate
    ? new Date(data.issueDate).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : ''

  return (
    <div className="min-h-screen bg-[#F3F7F5] text-[#10201A]">
      <header className="border-b border-[#E3E8E5] bg-white sticky top-0 z-40">
        <div className="mx-auto max-w-[1000px] px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-[#1DB96B] hover:text-[#17A05D]">
            <ShieldCheck className="h-6 w-6" /> Learn2Earn
          </Link>
          <span className="text-sm font-semibold text-[#5B6B64]">Certificate check</span>
        </div>
      </header>

      <main className="mx-auto max-w-[1000px] px-4 py-8 sm:py-12">
        <div className="rounded-2xl border border-[#E3E8E5] bg-white p-6 sm:p-10 text-center">
          <ShieldCheck className="mx-auto h-10 w-10 text-[#1DB96B] mb-3" />
          <h1 className="mt-3 text-2xl font-extrabold">Certificate Verified</h1>
          <p className="mx-auto mt-2 max-w-md text-[#5B6B64]">
            This certificate is valid and has been issued by Learn2Earn.
          </p>

          <div className="mt-10 bg-[#F6F7F5] rounded-xl p-8 text-left">
            <div className="flex items-center gap-3 mb-2">
              <Check className="w-5 h-5 text-[#1DB96B]" />
              <span className="text-sm font-medium text-[#111111]">Certificate ID</span>
              <span className="ml-auto text-xs font-mono text-[#5B6B64]">{data.certificateId}</span>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-sm font-medium text-[#111111]">Student Name</span>
              <span className="ml-auto text-xs font-semibold text-[#1DB96B]">{data.studentName}</span>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-sm font-medium text-[#111111]">Course</span>
              <span className="ml-auto text-xs text-[#5B6B64]">{data.courseTitle}</span>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-sm font-medium text-[#111111]">Issue Date</span>
              <span className="ml-auto text-xs text-[#5B6B64]">{issueDate}</span>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-sm font-medium text-[#111111]">Status</span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#0F7A42]" />
                <span className="text-xs font-medium text-[#0F7A42]">Verified</span>
              </span>
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-3">
            <Link
              href="/courses"
              className="flex items-center gap-2 text-sm font-medium text-[#1DB96B] hover:text-[#17A05D] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Browse Courses
            </Link>
            <Link
              href={`/verify/${certificateId}`}
              className="flex items-center gap-2 text-sm font-medium text-[#737373] hover:text-[#111111] transition-colors"
            >
              Verify Another
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
