'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, Lock, ArrowRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/data'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Login failed')
        setLoading(false)
        return
      }
      // Redirect to admin dashboard
      if (typeof window !== 'undefined') {
        window.location.href = '/admin'
      }
    } catch {
      setError('An unexpected error occurred')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
      <div className="w-full max-w-md border border-white/10 bg-gray-900/90 backdrop-blur-md rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-[#1DB96B] rounded-lg mb-4">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white mb-2">Admin Login</h1>
          <p className="text-gray-400 text-sm">
            Sign in to manage Learn2Earn
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-700 bg-gray-800 text-white text-sm focus:outline-none focus:border-[#1DB96B] focus:ring-1 focus:ring-[#1DB96B] transition-all"
                placeholder="admin@learn2earn.co.zm"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-gray-400">Password</label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-700 bg-gray-800 text-white text-sm focus:outline-none focus:border-[#1DB96B] focus:ring-1 focus:ring-[#1DB96B] transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#1DB96B] text-[#111111] font-bold text-sm hover:bg-[#17A05D] transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {loading ? (
              <ArrowRight className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Sign in <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-500">
          Learn2Earn Admin · Run by {SITE_CONFIG.founder.name}
        </p>
      </div>
    </div>
  )
}
