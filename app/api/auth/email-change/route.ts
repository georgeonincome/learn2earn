/**
 * Email change — reference 3-step flow (send code → 6-digit code → confirm).
 * Q6 email provider is open, so this stubs to the file log and accepts any
 * 6-digit code until a provider is wired.
 */
import { NextRequest, NextResponse } from 'next/server'
import { appendFileSync } from 'node:fs'
import { join } from 'node:path'
import { getCurrentUser } from '@/lib/server/auth'
import { run, one } from '@/lib/server/sql'
import { uuid } from '@/lib/server/ids'

const LOG = join(process.cwd(), '.data', 'email-log.jsonl')

export const runtime = 'nodejs'

function log(email: string, code: string) {
  try { appendFileSync(LOG, JSON.stringify({ at: new Date().toISOString(), to: email, type: 'email-change', code }) + '\n') } catch { /* */ }
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
  const body = await request.json().catch(() => ({}))
  const { action } = body

  if (action === 'start') {
    const email = String(body.email ?? '').trim().toLowerCase()
    const existing = await one('SELECT id FROM auth_users WHERE email = ? AND id <> ? LIMIT 1', [email, user.id])
    if (existing) return NextResponse.json({ error: 'That email already has an account' }, { status: 409 })
    const code = String(Math.floor(100000 + Math.random() * 900000))
    log(email, code)
    await run(
      `INSERT INTO admin_otp_codes (id, user_id, code, purpose, expires_at, used, created_at)
       VALUES (?, ?, ?, 'email_change', datetime('now','+15 minutes'), 0, datetime('now'))`,
      [`eml-${uuid()}`, user.id, code])
    return NextResponse.json({ ok: true })
  }

  if (action === 'confirm') {
    const { email, code } = body
    const row = await one<{ code: string; expires_at: string; id: string }>(
      `SELECT * FROM admin_otp_codes WHERE user_id = ? AND purpose = 'email_change' AND used = 0
       ORDER BY created_at DESC LIMIT 1`, [user.id])
    if (!row || row.code !== code) return NextResponse.json({ error: 'Invalid code' }, { status: 400 })
    if (new Date(row.expires_at) < new Date()) return NextResponse.json({ error: 'Code expired' }, { status: 410 })
    await run('UPDATE auth_users SET email = ? WHERE id = ?', [String(email).trim().toLowerCase(), user.id])
    await run('UPDATE admin_otp_codes SET used = 1 WHERE id = ?', [row.id])
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
