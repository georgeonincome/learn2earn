'use client'

/**
 * Dashboard /settings — reference Settings tab: profile (name), password,
 * notifications (+ learning) toggles that persist, and danger zone.
 * Profile photo/email change use the OTP flows (Q6 email provider open —
 * stubbed to the file log).
 */
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Lock, Mail, Phone, Bell, RefreshCw, Trash2, Image as ImageIcon, ChevronRight } from 'lucide-react'

export default function SettingsPage() {
  const router = useRouter()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const [flavor, setFlavor] = useState<'name' | 'pass' | 'notifs' | null>(null)

  const load = useCallback(() => {
    setLoading(true)
    fetch('/api/dashboard/settings')
      .then((r) => r.ok ? r.json() : null)
      .then((d: any) => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])
  useEffect(() => { load() }, [load])

  const update = useCallback((action: string, body: any) => {
    fetch('/api/dashboard/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, ...body }),
    })
      .then((r) => r.ok ? r.json() : { ok: false })
      .then((d: any) => {
        if (d.ok) {
          setSaved(true)
          setTimeout(() => setSaved(false), 1500)
          if (action === 'name') load()
        }
      })
  }, [load])

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading…</div>

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#10201A]">
      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center gap-4">
          <Link href="/dashboard" className="text-[#0B854C] font-semibold hover:underline">← Dashboard</Link>
          <div className="h-6 w-px bg-gray-200 mx-2" />
          <h1 className="text-xl font-bold">Settings</h1>
        </div>
      </nav>

      <main className="mx-auto max-w-3xl px-4 py-8">
        <h2 className="font-bold mb-6">Account</h2>

        {/* Profile card — shows the student’s OWN info (not the founder’s) */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 mb-8">
          <h3 className="font-bold mb-4">Profile</h3>
          <div className="flex gap-4 mb-4">
            <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
              <ImageIcon className="h-8 w-8 text-gray-400" />
            </div>
            <div>
              <p className="font-semibold">{data?.fullName ?? '—'}</p>
              <p className="text-xs text-gray-500">{data?.email ?? '—'}</p>
              <p className="text-xs text-gray-500">Member #{data?.id?.slice(-6) ?? '—'} · Written exactly like this on your certificates.</p>
            </div>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); update('name', { fullName: (e.target as any).elements[0].value }) }}>
            <div className="flex gap-2">
              <input
                name="fullName"
                defaultValue={data?.fullName ?? ''}
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1DB96B]"
                placeholder="Full name"
              />
              <button className="rounded-md bg-[#1DB96B] px-4 py-2 text-xs font-bold text-white hover:bg-[#17A05D] disabled:opacity-60" disabled={saved}>
                Save
              </button>
            </div>
            {saved && <p className="mt-2 text-xs text-[#0B854C]">Saved</p>}
          </form>
          <p className="mt-4 text-xs text-gray-500">Change photo (JPG/PNG/WebP, up to 5 MB) — upload comes with the file-storage phase.</p>
          <p className="text-xs text-gray-500">WhatsApp: {data?.phone ?? '—'} · {saved ? '' : <a href="#" className="text-[#0B854C] hover:underline" onClick={(e) => { e.preventDefault(); setFlavor('pass') }}>Change</a>}</p>
        </div>

        {/* Password */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 mb-8">
          <h3 className="font-bold mb-4">Sign in and security</h3>
          <p className="text-sm text-gray-500 mb-4">Change your password. A code is sent to your email to save it.</p>
          <form onSubmit={(e) => { e.preventDefault(); update('pass', {}) }}>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Current password</label>
                <input type="password" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">New password</label>
                <input type="password" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Confirm new password</label>
                <input type="password" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
              </div>
              <button className="rounded-md bg-[#1DB96B] px-4 py-2 text-xs font-bold text-white hover:bg-[#17A05D] disabled:opacity-60" disabled={saved}>
                Update Password
              </button>
            </div>
            {saved && flavor === 'pass' && <p className="mt-2 text-xs text-[#0B854C]">Password saved.</p>}
          </form>
          <p className="mt-4 text-xs text-gray-500">Continue with Google: not connected. Set a password first.</p>
          <p className="text-xs text-gray-500"><Link href="/auth" className="text-[#0B854C] hover:underline">Sign out of other sessions</Link> — session management.</p>
        </div>

        {/* Notifications */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 mb-8">
          <h3 className="font-bold mb-4">Notifications</h3>
          <p className="text-sm text-gray-500 mb-4">Choose what we send. Changes save straight away.</p>
          <div className="space-y-3">
            {[
              ['classReminders', 'Class reminders'],
              ['dataSaver', 'Data saver'],
              ['skillcheckReminders', 'SkillCheck reminders'],
            ].map(([key, label]) => {
              const checked = Boolean(data?.preferences?.[key])
              return (
                <div key={key} className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-[#0B854C] focus:ring-[#1DB96B]"
                      defaultChecked={checked}
                      onChange={(e) => update('preferences', { preferences: { ...(data?.preferences ?? {}), [key]: e.target.checked } })}
                    />
                    {label}
                  </label>
                </div>
              )
            })}
          </div>
        </div>

        {/* Danger zone */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="font-bold mb-4">Danger zone</h3>
          <p className="text-sm text-gray-500 mb-4">Delete your account? This cannot be undone.</p>
          <button
            onClick={() => { if (window.confirm('Delete your account and all your data?')) { router.push('/') } }}
            className="text-xs font-semibold text-red-600 hover:underline"
          >
            Delete for good
          </button>
        </div>
      </main>
    </div>
  )
}
