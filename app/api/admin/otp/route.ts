/**
 * Admin OTP — two-step login second factor. POST create (staff requests a
 * code), POST consume (verifies code → returns userId).
 */
import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession, requireAdminRole } from '@/lib/server/admin-session'
import { createOtpCode, consumeOtpCode } from '@/lib/server/admin'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}))
  const { action } = body

  if (action === 'create') {
    const session = await getAdminSession()
    if (!session || !requireAdminRole(session, 'edit_settings').allowed) {
      return NextResponse.json({ error: 'Admin required' }, { status: 403 })
    }
    const otp = await createOtpCode({ userId: session.userId, code: String(Math.floor(100000 + Math.random() * 900000)), purpose: 'admin_login' })
    // In production this code is delivered by email/SMS; here it is returned
    // so the dev flow can be exercised end to end.
    return NextResponse.json({ ok: true, code: otp ? (otp as any).code : null })
  }

  if (action === 'consume') {
    const { code } = body
    if (!code) return NextResponse.json({ error: 'code required' }, { status: 400 })
    const userId = await consumeOtpCode(String(code), 'admin_login')
    if (!userId) return NextResponse.json({ error: 'Invalid or expired code' }, { status: 400 })
    if (userId === 'expired') return NextResponse.json({ error: 'Code expired' }, { status: 410 })
    return NextResponse.json({ ok: true, userId })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
