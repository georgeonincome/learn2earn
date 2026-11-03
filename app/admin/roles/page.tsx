'use client'

/**
 * Admin Roles — reference `user_roles` management + 29-key permission map.
 */

import { useEffect, useState } from 'react'

type RoleRow = { user_id: string; email: string; role: string }

const ROLES = ['super_admin', 'finance', 'support', 'instructor', 'manager'] as const

export default function AdminRolesPage() {
  const [rows, setRows] = useState<RoleRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetch('/api/admin/roles')
      .then((r) => r.ok ? r.json() : { roles: [], availableRoles: [] })
      .then((data: any) => { if (!cancelled) setRows(data.roles ?? []) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const setRole = async (userId: string, email: string, role: string) => {
    await fetch('/api/admin/roles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, email, role }),
    })
    setRows(rows.map((r) => r.user_id === userId ? { ...r, role } : r))
  }

  if (loading) return <div className="text-center py-20 text-[#737373]">Loading…</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">User roles</h1>
          <p className="text-[#737373] text-sm mt-1">Assign admin roles and permissions.</p>
        </div>
      </div>

      <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#E5E5E5] bg-[#F9F9F9]">
              <th className="px-4 py-3 font-semibold text-[#737373]">Email</th>
              <th className="px-4 py-3 font-semibold text-[#737373]">Role</th>
              <th className="px-4 py-3 font-semibold text-[#737373] text-right">Change role</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={3} className="px-4 py-12 text-center text-[#737373]">No roles assigned yet.</td></tr>
            ) : (
              rows.map((r) => (
                <tr key={r.user_id} className="border-b border-[#E5E5E5]">
                  <td className="px-4 py-3">{r.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      r.role === 'super_admin' ? 'bg-[#F3FBF6] text-[#1DB96B]' :
                      r.role === 'finance' ? 'bg-[#FEE2E2] text-[#DC2626]' :
                      r.role === 'support' ? 'bg-[#FEF3C7] text-[#92400E]' :
                      r.role === 'instructor' ? 'bg-[#E0E7FF] text-[#3730A3]' :
                      'bg-[#F5F5F5] text-[#737373]'
                    }`}>{r.role}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <select
                      value={r.role}
                      onChange={(e) => setRole(r.user_id, r.email, e.target.value)}
                      className="rounded-md border border-[#E5E5E5] px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#1DB96B]"
                    >
                      {ROLES.map((role) => (
                        <option key={role} value={role}>{role.replace('_', ' ')}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-[#F3FBF6] rounded-lg p-4">
        <h3 className="font-bold text-lg mb-2">Permission model</h3>
        <p className="text-sm text-[#1DB96B]">29 granular permission keys across 5 roles.</p>
        <ul className="text-sm text-[#737373] list-disc list-inside mt-2 space-y-1">
          <li><b>super_admin</b> — full access (all 29 keys)</li>
          <li><b>manager</b> — restricted operational view (no financial/certificates)</li>
          <li><b>finance</b> — payments, revenue, orders, enrollments</li>
          <li><b>support</b> — students, tickets, announcements</li>
          <li><b>instructor</b> — courses, cohorts, lesson content</li>
        </ul>
      </div>
    </div>
  )
}
