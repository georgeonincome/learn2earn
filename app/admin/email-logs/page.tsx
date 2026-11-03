'use client'

/**
 * Admin Email Logs — reference admin email-logs page.
 * Lists outbound emails sent from the platform (stubbed to file log until email provider is confirmed).
 */

import { useEffect, useState } from 'react'

type EmailLog = { at: string; to: string; type: string; code?: string }

export default function AdminEmailLogsPage() {
  const [logs, setLogs] = useState<EmailLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    // Email logs are stored in .data/email-log.jsonl on the server; this endpoint is a stub
    // until Q6 email provider is confirmed. For now, show an informative empty state.
    setLogs([])
    setLoading(false)
  }, [])

  if (loading) return <div className="text-center py-20 text-[#737373]">Loading…</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Email logs</h1>
          <p className="text-[#737373] text-sm mt-1">Outbound email audit trail (password resets, email changes, enrolment notifications).</p>
        </div>
      </div>

      <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-6">
        <p className="text-sm text-[#737373] mb-4">
          Email sending is stubbed to <code className="text-xs bg-[#F5F5F5] px-1.5 py-0.5 rounded">.data/email-log.jsonl</code> until the email provider is confirmed (Q6 open). No emails have been sent through a provider yet.
        </p>
        <div className="bg-[#F9F9F9] rounded-lg p-4 border border-[#E5E5E5]">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold">Last email</span>
            <span className="text-xs text-[#737373]">—</span>
          </div>
          <p className="text-sm text-[#737373]">No provider-sent emails logged. Password-reset and email-change codes are written to the file log for review.</p>
        </div>
      </div>
    </div>
  )
}
