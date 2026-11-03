/**
 * Admin server surface — reference permission model (29 keys), role-gated
 * reads/writes, OTP two-step login, needs-attention panel and dashboard
 * metrics. Tables: user_roles, admin_users, admin_otp_codes plus the
 * operational tables in lib/server/ops.ts.
 */

import { one, run, all } from '@/lib/server/sql'
import { uuid } from '@/lib/server/ids'
import { hashPassword, verifyPassword } from '@/lib/server/auth'

const now = () => Math.floor(Date.now() / 1000)

// ---------------------------------------------------------------- roles -----

export type AdminUser = {
  id: string; user_id?: string; name: string; email: string; created_at: string
}

export type UserRole = { user_id: string; email: string; role: string; created_at: string }

export const ADMIN_ROLES = ['super_admin', 'finance', 'support', 'instructor', 'manager'] as const
export type AdminRole = (typeof ADMIN_ROLES)[number]

// 29 granular permission keys observed in the reference admin chunk.
export const PERMISSIONS: Record<AdminRole, string[]> = {
  super_admin: [
    'view_dashboard','view_students','view_student_profiles','edit_students','delete_students',
    'view_enrollments','create_enrollments','view_payment_amounts','edit_pricing','issue_refunds',
    'view_cohorts','manage_cohort_operations','edit_cohort_content','view_courses','edit_courses',
    'create_announcements','view_email_logs','view_failed_transactions','view_transaction_amounts',
    'view_financial_reports','download_financial_data','view_orders','view_revenue_data',
    'view_certificates','edit_certificates','regenerate_certificates','view_roles','edit_settings',
  ],
  manager: ['view_dashboard','view_students','view_enrollments','view_cohorts','view_courses'],
  finance: ['view_dashboard','view_payment_amounts','view_financial_reports','download_financial_data','view_orders','view_revenue_data','view_enrollments'],
  support: ['view_dashboard','view_students','view_student_profiles','view_tickets','create_announcements','view_enrollments'],
  instructor: ['view_dashboard','view_courses','edit_courses','view_cohorts','manage_cohort_operations','edit_cohort_content','view_students'],
}

export function hasRole(role: AdminRole | undefined, permission: string) {
  if (!role) return false
  return PERMISSIONS[role]?.includes(permission) ?? false
}

export async function listAdminUsers() {
  return all<AdminUser>('SELECT * FROM admin_users ORDER BY created_at DESC')
}

export async function getAdminUser(id: string) {
  return one<AdminUser>('SELECT * FROM admin_users WHERE id = ? LIMIT 1', [id])
}

export async function createAdminUser({ userId, name, email }: { userId?: string; name: string; email: string }) {
  const id = uuid()
  await run('INSERT INTO admin_users (id, user_id, name, email, created_at) VALUES (?, ?, ?, ?, datetime("now"))',
    [id, userId ?? null, name, email])
  return { id }
}

export async function deleteAdminUser(id: string) {
  await run('DELETE FROM admin_users WHERE id = ?', [id])
}

// ---------------------------------------------------------------- OTP -------

export type OtpCode = { id: string; user_id: string; code: string; purpose: string; expires_at: string; used: number; created_at: string }

export async function createOtpCode({ userId, code, purpose, ttlMinutes = 10 }: { userId: string; code: string; purpose: string; ttlMinutes?: number }) {
  const id = uuid()
  const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000).toISOString()
  await run('INSERT INTO admin_otp_codes (id, user_id, code, purpose, expires_at, used, created_at) VALUES (?, ?, ?, ?, 0, datetime("now"))',
    [id, userId, code, purpose, expiresAt])
  return { id }
}

export async function consumeOtpCode(code: string, purpose: string) {
  const row = await one<OtpCode>(
    'SELECT * FROM admin_otp_codes WHERE code = ? AND purpose = ? AND used = 0 ORDER BY created_at DESC LIMIT 1', [code, purpose])
  if (!row) return null
  const expired = new Date(row.expires_at) < new Date()
  if (expired) return 'expired'
  await run('UPDATE admin_otp_codes SET used = 1 WHERE id = ?', [row.id])
  return row.user_id
}

export async function listOtpCodes() {
  return all<OtpCode>('SELECT * FROM admin_otp_codes ORDER BY created_at DESC')
}

// ------------------------------------------------------------ auth/roles ---

export async function getUserRole(userId: string) {
  return one<UserRole>('SELECT * FROM user_roles WHERE user_id = ? LIMIT 1', [userId])
}

export async function setUserRole({ userId, email, role }: { userId: string; email: string; role: AdminRole }) {
  await run(
    `INSERT INTO user_roles (user_id, email, role, created_at) VALUES (?, ?, ?, datetime('now'))
     ON CONFLICT(user_id) DO UPDATE SET email = excluded.email, role = excluded.role`,
    [userId, email, role])
}

export async function verifyAdminPassword(email: string, password: string) {
  // admin_users carries email; password verified against auth_users (student-side auth).
  const admin = await one<{ email: string }>('SELECT * FROM admin_users WHERE email = ? LIMIT 1', [email])
  if (!admin) return null
  const authUser = await one<{ id: string; email: string; password_hash: string }>(
    'SELECT id, email, password_hash FROM auth_users WHERE email = ? LIMIT 1', [email])
  if (!authUser || !verifyPassword(password, authUser.password_hash)) return null
  return { userId: authUser.id, email }
}

// -------------------------------------------------------- dashboard metrics --

export type AdminMetrics = {
  totalStudents: number; activeStudents: number; newStudentsToday: number
  totalEnrollments: number; newEnrollmentsToday: number; totalCourses: number
  activeCohorts: number; openTickets: number; certificatesIssued: number
  revenueToday: number; paidOrdersToday: number
}

export async function adminMetrics() {
  const startOfDay = Math.floor(new Date(new Date().setHours(0, 0, 0, 0)).getTime() / 1000)
  const [
    students, enrollments, courses, cohorts, tickets, certs, txns,
  ] = await Promise.all([
    all('SELECT COUNT(*) AS c FROM students'),
    all('SELECT COUNT(*) AS c FROM enrollments'),
    all("SELECT COUNT(*) AS c FROM courses WHERE status = 'published'"),
    all('SELECT COUNT(*) AS c FROM cohorts'),
    all("SELECT COUNT(*) AS c FROM tickets WHERE status = 'open'"),
    all("SELECT COUNT(*) AS c FROM course_certificates WHERE is_verified = 1"),
    all("SELECT COUNT(*) AS c, COALESCE(SUM(amount),0) AS s FROM transactions WHERE payment_status = 'paid'"),
  ])
  const todayStudents = (await all('SELECT COUNT(*) AS c FROM students WHERE created_at >= ?', [startOfDay]))[0].c
  const todayEnrollments = (await all('SELECT COUNT(*) AS c FROM enrollments WHERE enrolled_at >= ?', [startOfDay]))[0].c
  const paid = txns[0]
  return {
    totalStudents: students[0].c, activeStudents: students[0].c, newStudentsToday: todayStudents,
    totalEnrollments: enrollments[0].c, newEnrollmentsToday: todayEnrollments,
    totalCourses: courses[0].c, activeCohorts: cohorts[0].c, openTickets: tickets[0].c,
    certificatesIssued: certs[0].c,
    revenueToday: Number(paid.s ?? 0), paidOrdersToday: paid.c,
  } as AdminMetrics
}

// -------------------------------------------------------- needs attention ----

export type AttentionCase = {
  kind: 'no_access' | 'manual_mpesa' | 'meta_missing' | 'failed_payments' |
        'pending_reviews' | 'failed_certificates' | 'memberships_ending'
  label: string; count: number; route: string
}

export async function attentionCases() {
  const cases: AttentionCase[] = []
  const failedPayments = Number((await all<{ c: unknown }>("SELECT COUNT(*) AS c FROM transactions WHERE payment_status = 'failed'"))[0].c)
  const pendingReviews = Number((await all<{ c: unknown }>("SELECT COUNT(*) AS c FROM reviews WHERE status = 'pending'"))[0].c)
  const openTickets = Number((await all<{ c: unknown }>("SELECT COUNT(*) AS c FROM tickets WHERE status = 'open'"))[0].c)
  if (failedPayments > 0) cases.push({ kind: 'failed_payments', label: 'Failed payments', count: failedPayments, route: '/admin/failed-transactions' })
  if (pendingReviews > 0) cases.push({ kind: 'pending_reviews', label: 'Pending reviews', count: pendingReviews, route: '/admin/reviews' })
  if (openTickets > 0) cases.push({ kind: 'manual_mpesa', label: 'Open support tickets', count: openTickets, route: '/admin/tickets' })
  return cases
}
