'use client'

import { useState } from 'react'
import { Mail, Lock, ArrowRight, MessageCircle, Phone, ChevronRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/data'

/* Auth page — email + password login (no 2FA code flow):
   - Desktop: dark left aside panel (#0E2A1E) + main card on right (#F6F7F5)
   - Mobile: full-screen centered card
   - Topbar: logo
   - Simple email + password sign in
   - Register link for new accounts
   - Forgot password link
   - WhatsApp support link
   - No Navbar, No Footer (own layout)
*/

const LOGO_SVG = (
  <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
)

const LOGO_SVG_DARK = (
  <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#10201A]" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
)

const CHECK_ICON = (
  <svg className="mt-0.5 h-5 w-5 shrink-0 text-[#1BC995]" aria-hidden="true">
    <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
)

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mode, setMode] = useState<'signin' | 'register'>('signin')

  const [name, setName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (mode === 'register') {
        if (!name.trim()) {
          setError('Please enter your full name')
          setLoading(false)
          return
        }
        if (password !== confirmPassword) {
          setError('Passwords do not match')
          setLoading(false)
          return
        }
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim().toLowerCase(), password, fullName: name.trim() }),
        })
        const data = await res.json()
        if (!res.ok) {
          setError(data.error || 'Registration failed')
          setLoading(false)
          return
        }
        // Auto-login after registration
        const loginRes = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
        })
        if (!loginRes.ok) {
          setError(data.error || 'Account created. Please sign in.')
          setLoading(false)
          return
        }
        if (typeof window !== 'undefined') {
          window.location.href = '/dashboard'
        }
      } else {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
        })
        const data = await res.json()
        if (!res.ok) {
          setError(data.error || 'Invalid email or password')
          setLoading(false)
          return
        }
        if (typeof window !== 'undefined') {
          window.location.href = '/dashboard'
        }
      }
    } catch {
      setError('An unexpected error occurred')
      setLoading(false)
    }
  }

  const firstName = SITE_CONFIG.founder.name.split(' ').slice(-1).join(' ')

  return (
    <div className="min-h-[100dvh] bg-white font-sans text-[#10201A] lg:grid lg:grid-cols-[1fr_1.1fr] lg:bg-[#F6F7F5]">
      {/* Desktop left aside panel */}
      <aside className="relative hidden overflow-hidden bg-[#0E2A1E] p-12 text-white lg:flex lg:flex-col">
        <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,.03)_0_1px,transparent_1px_16px)]" />
        <div className="pointer-events-none absolute -bottom-40 -right-40 h-[520px] w-[520px] rounded-full border-[70px] border-[rgba(27,201,149,.10)]" />
        <div className="relative h-8 w-auto self-start">{LOGO_SVG}</div>
        <div className="relative my-auto max-w-md">
          <h2 className="font-serif text-[52px] leading-[1.02] font-bold">
            Skills you can <em className="text-[#1BC995] font-bold">use on Monday.</em>
          </h2>
          <ul className="mt-8 space-y-4 text-[15px] text-white/85">
            <li className="flex gap-3">
              {CHECK_ICON}
              <span>Practical courses in AI, websites, ads and social media</span>
            </li>
            <li className="flex gap-3">
              {CHECK_ICON}
              <span>Learn on your phone, at your own pace</span>
            </li>
            <li className="flex gap-3">
              {CHECK_ICON}
              <span>Certificates anyone can check with a QR code</span>
            </li>
          </ul>
        </div>
        <p className="relative mt-auto text-sm text-white/55">
          Taught by {SITE_CONFIG.founder.name}
        </p>
      </aside>

      {/* Main content */}
      <main className="flex min-h-[100dvh] flex-col px-5 pb-8 pt-4 sm:px-8 lg:min-h-0 lg:items-center lg:justify-center lg:py-12">
        <div className="w-full lg:max-w-[440px] lg:rounded-3xl lg:bg-white lg:p-10 lg:shadow-[0_20px_60px_rgba(16,32,26,.08)]">
          {/* Topbar */}
          <div className="flex items-center justify-between mb-6">
            <div className="h-6 w-auto lg:hidden">{LOGO_SVG_DARK}</div>
          </div>

          {mode === 'signin' ? (
            <section>
              <h1 className="text-[28px] font-extrabold leading-tight tracking-[-0.02em] mb-1">
                Welcome back
              </h1>
              <p className="text-[15px] text-[#5B6B64] mb-6">
                Sign in to access your courses and continue learning.
              </p>
              <form onSubmit={handleSubmit} noValidate>
                {error && (
                  <p className="mb-4 rounded-lg bg-[#FDECEA] px-3 py-2 text-sm text-[#B42318]">{error}</p>
                )}
                <label className="block text-sm font-semibold mb-1.5">Email address</label>
                <input
                  id="auth-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  autoCapitalize="none"
                  spellCheck={false}
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError('') }}
                  placeholder="you@gmail.com"
                  className="w-full rounded-xl border border-[#D9E0DC] bg-white px-3.5 py-3 text-base text-[#10201A] outline-none placeholder:text-[#9AA7A1] focus:border-[#0B854C] focus:ring-4 focus:ring-[#0B854C]/10"
                  required
                />
                <label className="block text-sm font-semibold mt-4 mb-1.5">Password</label>
                <input
                  id="auth-password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-[#D9E0DC] bg-white px-3.5 py-3 text-base text-[#10201A] outline-none placeholder:text-[#9AA7A1] focus:border-[#0B854C] focus:ring-4 focus:ring-[#0B854C]/10"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl bg-[#0B854C] px-4 py-3.5 text-[15px] font-bold text-white hover:bg-[#087A45] disabled:opacity-60 mt-6 ${loading ? 'opacity-60' : ''}`}
                >
                  {loading ? 'Signing in…' : 'Sign in'}
                </button>
              </form>
              <p className="mt-5 text-center text-sm text-[#5B6B64]">
                Don't have an account?{' '}
                <button
                  onClick={() => { setMode('register'); setError('') }}
                  className="font-semibold text-[#0B854C] hover:underline"
                >
                  Create account
                </button>
              </p>
            </section>
          ) : (
            <section>
              <h1 className="text-[28px] font-extrabold leading-tight tracking-[-0.02em] mb-1">
                Create your account
              </h1>
              <p className="text-[15px] text-[#5B6B64] mb-6">
                Start learning digital skills with Learn2Earn.
              </p>
              <form onSubmit={handleSubmit} noValidate>
                {error && (
                  <p className="mb-4 rounded-lg bg-[#FDECEA] px-3 py-2 text-sm text-[#B42318]">{error}</p>
                )}
                <label className="block text-sm font-semibold mb-1.5">Full name</label>
                <input
                  id="auth-name"
                  type="text"
                  autoComplete="name"
                  autoCapitalize="words"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="George J. Kasonso"
                  className="w-full rounded-xl border border-[#D9E0DC] bg-white px-3.5 py-3 text-base text-[#10201A] outline-none placeholder:text-[#9AA7A1] focus:border-[#0B854C] focus:ring-4 focus:ring-[#0B854C]/10"
                  required
                />
                <label className="block text-sm font-semibold mt-4 mb-1.5">Email address</label>
                <input
                  id="auth-register-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  autoCapitalize="none"
                  spellCheck={false}
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError('') }}
                  placeholder="you@gmail.com"
                  className="w-full rounded-xl border border-[#D9E0DC] bg-white px-3.5 py-3 text-base text-[#10201A] outline-none placeholder:text-[#9AA7A1] focus:border-[#0B854C] focus:ring-4 focus:ring-[#0B854C]/10"
                  required
                />
                <label className="block text-sm font-semibold mt-4 mb-1.5">Password</label>
                <input
                  id="auth-register-password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-[#D9E0DC] bg-white px-3.5 py-3 text-base text-[#10201A] outline-none placeholder:text-[#9AA7A1] focus:border-[#0B854C] focus:ring-4 focus:ring-[#0B854C]/10"
                  required
                />
                <label className="block text-sm font-semibold mt-4 mb-1.5">Confirm password</label>
                <input
                  id="auth-confirm-password"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-[#D9E0DC] bg-white px-3.5 py-3 text-base text-[#10201A] outline-none placeholder:text-[#9AA7A1] focus:border-[#0B854C] focus:ring-4 focus:ring-[#0B854C]/10"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl bg-[#0B854C] px-4 py-3.5 text-[15px] font-bold text-white hover:bg-[#087A45] disabled:opacity-60 mt-6 ${loading ? 'opacity-60' : ''}`}
                >
                  {loading ? 'Creating account…' : 'Create account'}
                </button>
              </form>
              <p className="mt-5 text-center text-sm text-[#5B6B64]">
                Already have an account?{' '}
                <button
                  onClick={() => { setMode('signin'); setError('') }}
                  className="font-semibold text-[#0B854C] hover:underline"
                >
                  Sign in
                </button>
              </p>
            </section>
          )}

          <div className="mt-8 flex items-center gap-3 text-xs font-semibold text-[#9AA7A1]">
            <span className="h-px flex-1 bg-[#E3E8E5]" />
            or
            <span className="h-px flex-1 bg-[#E3E8E5]" />
          </div>

          <button
            onClick={() => { setError('') }}
            className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-[#D9E0DC] bg-white px-4 py-3.5 text-[15px] font-semibold text-[#10201A] hover:border-[#9DB0A7] transition-colors"
          >
            Continue with Google
          </button>

          {/* Support footer */}
          <p className="mt-10 text-center text-sm text-[#5B6B64]">
            Trouble signing in?{' '}
            <a
              href={`https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent('Hi, I need help signing in to Learn2Earn. My email is ' + (email || ''))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#0B854C] inline-flex items-center gap-1 hover:underline"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp us
            </a>
          </p>
        </div>
      </main>
    </div>
  )
}