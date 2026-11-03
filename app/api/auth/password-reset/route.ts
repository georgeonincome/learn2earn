/**
 * Password reset — reference auth screens: request reset (email → one-time
 * code logged to .data/email-log.jsonl until Q6 provider confirmed), confirm
 * (code + new password → scrypt rehash).
 */
import { NextRequest, NextResponse } from 'next/server'
import { appendFileSync } from 'node:fs'
import { join } from 'node:path'
import { verifyPassword, hashPassword } from '@/lib/server/auth'
import { one, run } from '@/lib/server/sql'
import { uuid } from '@/lib/server/ids'

const LOG = join(process.cwd(), '.data', 'email-log.jsonl')

function logReset(email: string, code: string) {
  try {
    appendFileSync(LOG, JSON.stringify({ at: new Date().toISOString(), to: email, type: 'password-reset', code }) + '\n')
  } catch { /* .data dir may not exist — dev-only stub */ }
}

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}))
  const { action } = body

  if (action === 'request') {
    const email = String(body.email ?? '').trim().toLowerCase()
    const user = await one('SELECT id FROM auth_users WHERE email = ? LIMIT 1', [email])
    // Always reply OK to avoid enumerating accounts.
    if (user) {
      const code = String(Math.floor(100000 + Math.random() * 900000))
      logReset(email, code)
      await run(
        `INSERT INTO admin_otp_codes (id, user_id, code, purpose, expires_at, used, created_at)
         VALUES (?, ?, ?, 'password_reset', datetime('now','+15 minutes'), 0, datetime('now'))`,
        [`rst-${uuid()}`, user.id, code])
    }
    return NextResponse.json({ ok: true })
  }

  if (action === 'confirm') {
    const { email, code, password } = body
    if (!email || !code || !password || password.length < 8) {
      return NextResponse.json({ error: 'Invalid reset request' }, { status: 400 })
    }
    const user = await one<{ id: string; email: string }>(
      'SELECT id, email FROM auth_users WHERE email = ? LIMIT 1', [String(email).trim().toLowerCase()])
    if (!user) return NextResponse.json({ error: 'Invalid reset request' }, { status: 400 })
    const row = await one<{ code: string; expires_at: string; id: string; used: number }>(
      `SELECT * FROM admin_otp_codes WHERE user_id = ? AND purpose = 'password_reset' AND used = 0
       ORDER BY created_at DESC LIMIT 1`, [user.id])
    if (!row) return NextResponse.json({ error: 'Invalid or expired code' }, { status: 400 })
    if (new Date(row.expires_at) < new Date()) return NextResponse.json({ error: 'Code expired' }, { status: 410 })
    if (row.code !== code) return NextResponse.json({ error: 'Invalid code' }, { status: 400 })
    await run('UPDATE auth_users SET password_hash = ? WHERE id = ?', [hashPassword(password), user.id])
    await run('UPDATE admin_otp_codes SET used = 1 WHERE id = ?', [row.id])
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
