'use client'

/**
 * Admin Certificates — reference admin certificates view.
 * Lists issued certificates with regenerate action.
 */

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { RefreshCw, ChevronRight, ShieldCheck } from 'lucide-react'

type Certificate = {
  id: string
  certificate_id: string
  student_name: string
  course_title: string
  course_slug: string | null
  issue_date: string
  is_verified: boolean
  kind: string
}

export default function AdminCertificatesPage() {
  const [certs, setCerts] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetch('/api/dashboard/certificates')
      .then((r) => r.ok ? r.json() : { certificates: [] })
      .then((data: any) => { if (!cancelled) setCerts(data.certificates ?? []) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const regenerate = async (id: string) => {
    // Regenerate endpoint to be wired when admin certificate API is confirmed.
    setCerts(certs.map((c) => c.id === id ? { ...c, is_verified: true } : c))
  }

  if (loading) return <div className="text-center py-20 text-[#737373]">Loading certificates…</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Certificates</h1>
          <p className="text-[#737373] text-sm mt-1">View, verify, and regenerate issued certificates.</p>
        </div>
        <Link href="/dashboard/certificates" className="text-sm font-semibold text-[#0B854C] hover:underline">Student view →</Link>
      </div>

      <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#E5E5E5] bg-[#F9F9F9]">
              <th className="px-4 py-3 font-semibold text-[#737373]">Student</th>
              <th className="px-4 py-3 font-semibold text-[#737373]">Course</th>
              <th className="px-4 py-3 font-semibold text-[#737373] text-center">Certificate ID</th>
              <th className="px-4 py-3 font-semibold text-[#737373] text-center">Verified</th>
              <th className="px-4 py-3 font-semibold text-[#737373] text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {certs.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-12 text-center text-[#737373]">No certificates issued yet.</td></tr>
            ) : (
              certs.map((c) => (
                <tr key={c.id} className="border-b border-[#E5E5E5]">
                  <td className="px-4 py-3">{c.student_name}</td>
                  <td className="px-4 py-3">{c.course_title}</td>
                  <td className="px-4 py-3 text-center text-[#737373] font-mono text-xs">{c.certificate_id}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${c.is_verified ? 'bg-[#F3FBF6] text-[#0B854C]' : 'bg-[#F5F5F5] text-[#737373]'}`}>
                      {c.is_verified ? 'Verified' : 'Unverified'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => regenerate(c.id)}
                      className="mr-2 text-xs text-[#0B854C] hover:underline">Regenerate</button>
                    <Link href={`/verify/${c.certificate_id}`} className="text-xs text-[#737373] hover:underline">View</Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-[#F3FBF6] rounded-lg p-4">
        <h3 className="font-bold text-lg mb-2">Certificate administration</h3>
        <p className="text-sm text-[#737373]">
          Regenerate re-issues the certificate PDF and refreshes the verification record.
          <br />
          <span className="text-xs text-[#737373] mt-1 block">Certificate regenerate API endpoint to be wired when the admin certificate API is confirmed.</span>
        </p>
      </div>
    </div>
  )
}
