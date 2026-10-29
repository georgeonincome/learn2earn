import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

/* Admin login — verifies credentials.
   In production with Turso, this queries the users table.
   For now, uses a demo admin (configured via env or hardcoded fallback).
*/

const DEMO_ADMIN = {
  email: 'admin@learn2earn.co.zm',
  password: 'admin123',
  name: 'George Admin',
  role: 'super_admin',
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    // Demo fallback — replace with Turso query when keys are configured
    if (email === DEMO_ADMIN.email && password === DEMO_ADMIN.password) {
      const cookieStore = await cookies()
      cookieStore.set('admin_session', JSON.stringify({ userId: 0, email, role: DEMO_ADMIN.role }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 8, // 8 hours
      })
      return NextResponse.json({ ok: true, user: DEMO_ADMIN })
    }

    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  } catch {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}

export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_session')
  return NextResponse.json({ ok: true })
}
