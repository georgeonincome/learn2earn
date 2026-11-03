/**
 * Sessions — reference settings "Sign in and security": list active sessions
 * and revoke ("Sign out others").
 */
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/server/auth'
import { all, run } from '@/lib/server/sql'

export const runtime = 'nodejs'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
  const rows = await all<{ token: string; expires_at: number }>(
    'SELECT token, expires_at FROM auth_sessions WHERE user_id = ? ORDER BY expires_at DESC', [user.id])
  return NextResponse.json(rows.map(r => ({ token: r.token.slice(-8), expiresAt: r.expires_at, current: false })))
}

export async function DELETE(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
  const body = await request.json().catch(() => ({}))
  if (body.allExceptCurrent) {
    // current token is the cookie; delete everything else
    const store = await (await import('next/headers')).cookies()
    const current = store.get('l2e_session')?.value
    if (current) {
      await run('DELETE FROM auth_sessions WHERE user_id = ? AND token <> ?', [user.id, current])
    } else {
      await run('DELETE FROM auth_sessions WHERE user_id = ?', [user.id])
    }
  } else if (body.token) {
    await run('DELETE FROM auth_sessions WHERE user_id = ? AND token = ?', [user.id, body.token])
  }
  return NextResponse.json({ ok: true })
}
