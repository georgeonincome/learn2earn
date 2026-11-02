// Auth endpoints — our password-session replacement for the Supabase auth the
// reference invokes (Q2, logged in docs/parity/phase-0-foundation.md).
// Register behaves like the reference Auth chunk: creates the auth user, then the
// `students` profile row (full_name from signup data, email copied).
import { NextRequest, NextResponse } from 'next/server'
import {
  registerUser,
  authenticateUser,
  createSession,
  destroyCurrentSession,
  getCurrentUser,
} from '@/lib/server/auth'

export const runtime = 'nodejs'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export async function POST(request: NextRequest, ctx: { params: Promise<{ action: string }> }) {
  const { action } = await ctx.params
  const body = await request.json().catch(() => ({}))
  const email = String(body.email ?? '').trim().toLowerCase()

  if (action === 'register') {
    if (!EMAIL_RE.test(email)) return NextResponse.json({ error: 'Enter a valid email address' }, { status: 400 })
    const fullName = String(body.fullName ?? '').trim()
    if (fullName.length < 3 || fullName.length > 200) {
      // Reference Checkout validation copy: name range is 3–200 chars
      return NextResponse.json(
        { error: 'Enter your full name. It goes on your certificate.' },
        { status: 400 },
      )
    }
    const password = String(body.password ?? '')
    if (password.length < 8) {
      return NextResponse.json({ error: 'Use at least 8 characters for your password.' }, { status: 400 })
    }
    const { user, created } = await registerUser(email, password, fullName)
    if (!created) return NextResponse.json({ error: 'That email already has an account' }, { status: 409 })
    await createSession(user.id)
    return NextResponse.json({ user })
  }

  if (action === 'login') {
    const user = await authenticateUser(email, String(body.password ?? ''))
    if (!user) return NextResponse.json({ error: 'Wrong email or password' }, { status: 401 })
    await createSession(user.id)
    return NextResponse.json({ user })
  }

  if (action === 'logout') {
    await destroyCurrentSession()
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 404 })
}

export async function GET(_request: NextRequest, ctx: { params: Promise<{ action: string }> }) {
  const { action } = await ctx.params
  if (action !== 'me') return NextResponse.json({ error: 'Unknown action' }, { status: 404 })
  const user = await getCurrentUser()
  return NextResponse.json({ user })
}
