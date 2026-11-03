/**
 * Admin session helpers — reads the admin_session cookie set by
 * app/api/admin/login/route.ts. Used by admin page layouts and API routes.
 */

import { cookies } from 'next/headers'

export type AdminSession = { userId: string; email: string; role: string }

export async function getAdminSession(): Promise<AdminSession | null> {
  const store = await cookies()
  let cookie
  try { cookie = store.get('admin_session') } catch { return null }
  if (!cookie) return null
  try {
    const s = JSON.parse(cookie.value) as AdminSession
    if (s && typeof s === 'object' && 'userId' in s) return s
  } catch { /* ignore */ }
  return null
}

export function requireAdminRole(session: AdminSession | null, permission: string) {
  if (!session) return { allowed: false, reason: 'not signed in' as const }
  return { allowed: true, session }
}
