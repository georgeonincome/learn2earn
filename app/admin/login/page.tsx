'use client'

import { useState } from 'react'
import { Mail, Lock, ArrowRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/data'

/* Admin login page — exact 1:1 from click2skill AdminAuth-DD9DuOs3.js:
   - Gradient dark background (gray-900 to black), no white anywhere
   - Centered card (gray-900/90 backdrop-blur, border-gray-700)
   - Shield icon in green circle
   - "Administrator Access" title + subtitle
   - Email + Password form with show/hide toggle
   - "Secure Login" button
   - 2FA Required info box
   - "All access attempts are logged and monitored"
   - No Navbar, No Footer (own layout)
   - Responsive: works on mobile, tablet, desktop
*/

const SHIELD_ICON = (
  <svg className="w-8 h-8 text-[#1DB96B]" aria-hidden="true">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
)

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      let data: any = {}
      try { data = await res.json() } catch { /* ignore parse errors on error responses */ }
      if (!res.ok) {
        setError(data.error || 'Login failed')
        setLoading(false)
        return
      }
      if (typeof window !== 'undefined') {
        window.location.href = '/admin'
      }
    } catch {
      setError('An unexpected error occurred')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md border-gray-700 bg-gray-900/90 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/5">
        {/* Header */}
        <div className="space-y-3 text-center mb-6">
          <div className="flex items-center justify-center mb-3">
            <div className="p-3 bg-[#1DB96B]/10 rounded-full border border-[#1DB96B]/20">
              {SHIELD_ICON}
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Administrator Access</h2>
          <p className="text-gray-400 text-sm">Secure login for authorized personnel only</p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-200">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-gray-700 bg-gray-800/50 text-white placeholder:text-gray-500 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1DB96B]/20 focus:border-[#1DB96B] transition-all"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-200">Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-gray-700 bg-gray-800/50 text-white placeholder:text-gray-500 pr-10 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1DB96B]/20 focus:border-[#1DB96B] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
              >
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.11A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1DB96B] hover:bg-[#17A05D] text-[#111111] font-bold text-sm py-3 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>

        {/* 2FA info */}
        <div className="mt-6 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
          <div className="flex items-center gap-2 text-amber-400 text-sm">
            {SHIELD_ICON}
            <span className="font-medium">2FA Required</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">An OTP will be sent to your email for verification</p>
        </div>

        {/* Footer note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">All access attempts are logged and monitored</p>
        </div>
      </div>
    </div>
  )
}