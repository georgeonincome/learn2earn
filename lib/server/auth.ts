// Auth — our own stand-in for the reference's Supabase auth (Q2 in
// docs/parity/phase-0-foundation.md). Password + HTTP-only session cookie.
// The reference client paths that depend on Supabase users map to these ids
// (`students.user_id` = auth_users.id).
import { cookies } from 'next/headers'
import { one, run } from './sql'
import { uuid } from './ids'
import { upsertStudentForUser } from './students'

const SESSION_COOKIE = 'l2e_session'
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000

// --- password hashing (node:crypto scrypt, no external dependencies) ----------

import { scryptSync, randomBytes, timingSafeEqual } from 'node:crypto'

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return `scrypt:${salt}:${hash}`
}

export function verifyPassword(password: string, stored: string): boolean {
  const [scheme, salt, hash] = stored.split(':')
  if (scheme !== 'scrypt' || !salt || !hash) return false
  const candidate = scryptSync(password, salt, 64)
  const original = Buffer.from(hash, 'hex')
  return candidate.length === original.length && timingSafeEqual(candidate, original)
}

// --- account + profile --------------------------------------------------------

export type AuthUser = { id: string; email: string }

/**
 * Reference `Auth` chunk behavior: createUser succeeds, student profile row is
 * created immediately (full_name from signup data, email copied).
 */
export async function registerUser(email: string, password: string, fullName?: string) {
  const normalized = email.trim().toLowerCase()
  const existing = await one<AuthUser & { password_hash: string }>(
    'SELECT id, email FROM auth_users WHERE email = ? LIMIT 1',
    [normalized],
  )
  if (existing) return { user: existing, created: false }
  const id = uuid()
  await run('INSERT INTO auth_users (id, email, password_hash) VALUES (?, ?, ?)', [
    id,
    normalized,
    hashPassword(password),
  ])
  await upsertStudentForUser({ userId: id, email: normalized, fullName: fullName ?? null })
  return { user: { id, email: normalized }, created: true }
}

export async function authenticateUser(email: string, password: string) {
  const normalized = email.trim().toLowerCase()
  const user = await one<{ id: string; email: string; password_hash: string }>(
    'SELECT id, email, password_hash FROM auth_users WHERE email = ? LIMIT 1',
    [normalized],
  )
  if (!user || !verifyPassword(password, user.password_hash)) return null
  return { id: user.id, email: user.email }
}

// --- sessions ------------------------------------------------------------------

export async function createSession(userId: string) {
  const token = `${uuid()}${uuid()}`.replace(/-/g, '')
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS)
  await run('INSERT INTO auth_sessions (token, user_id, expires_at) VALUES (?, ?, ?)', [
    token,
    userId,
    Math.floor(expiresAt.getTime() / 1000),
  ])
  const store = await cookies()
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: expiresAt,
  })
  return token
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const store = await cookies()
  const token = store.get(SESSION_COOKIE)?.value
  if (!token) return null
  const row = await one<{ id: string; email: string; expires_at: number }>(
    `SELECT u.id, u.email, s.expires_at
       FROM auth_sessions s JOIN auth_users u ON u.id = s.user_id
      WHERE s.token = ? LIMIT 1`,
    [token],
  )
  if (!row) return null
  if (row.expires_at * 1000 < Date.now()) {
    await run('DELETE FROM auth_sessions WHERE token = ?', [token])
    return null
  }
  return { id: row.id, email: row.email }
}

export async function destroyCurrentSession() {
  const store = await cookies()
  const token = store.get(SESSION_COOKIE)?.value
  if (token) {
    await run('DELETE FROM auth_sessions WHERE token = ?', [token])
    store.delete(SESSION_COOKIE)
  }
}
