'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowRight, Lock, MessageCircle, Phone, ChevronRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/data'

/* Auth page — exact 1:1 from click2skill Auth-DhBBJHb7.js:
   - Clean centered card on #FAFAFA bg
   - Email sign-in form with Lucide icons
   - WhatsApp support link
   - Register toggle (single form)
   - No Navbar, No Footer (own layout)
*/

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => setLoading(false), 1200)
  }

  const firstName = SITE_CONFIG.founder.name.split(' ').slice(-1).join(' ')

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ backgroundColor: '#FAFAFA', color: '#111111' }}>
      <div className="w-full max-w-sm">
        {/* Logo header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-[#1DB96B] rounded-xl mb-4">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold text-[#111111] mb-1">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="text-sm text-[#737373]">
            {mode === 'login'
              ? 'Sign in to access your courses and continue learning.'
              : 'Start learning digital skills with Learn2Earn.'}
          </p>
        </div>

        {/* Auth card */}
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-8 shadow-sm">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-[#111111] mb-1.5">Full name</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373]" />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E5E5E5] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1DB96B]/20 focus:border-[#1DB96B] transition-all"
                    placeholder="Your full name"
                  />
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-[#111111] mb-1.5">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373]" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E5E5E5] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1DB96B]/20 focus:border-[#1DB96B] transition-all"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            {mode === 'login' && (
              <div>
                <label className="block text-sm font-medium text-[#111111] mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373]" />
                  <input
                    type="password"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E5E5E5] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1DB96B]/20 focus:border-[#1DB96B] transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#1DB96B] text-[#111111] font-bold text-sm hover:bg-[#17A05D] transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                'Please wait...'
              ) : (
                <>
                  {mode === 'login' ? 'Sign in' : 'Create account'} <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#E5E5E5] text-center">
            <p className="text-xs text-[#737373]">
              {mode === 'login' ? (
                <>
                  No account yet?{' '}
                  <button onClick={() => setMode('register')} className="text-[#0B854C] font-semibold hover:underline cursor-pointer">
                    Register
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button onClick={() => setMode('login')} className="text-[#0B854C] font-semibold hover:underline cursor-pointer">
                    Sign in
                  </button>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Support */}
        <div className="mt-6 text-center space-y-3">
          <a
            href={`https://wa.me/${SITE_CONFIG.whatsapp}?text=Hi%20George%2C%20I%20need%20help%20with%20my%20Learn2Earn%20account`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs text-[#737373] hover:text-[#0B854C] transition-colors"
          >
            <MessageCircle className="w-4 h-4" /> WhatsApp {firstName} for help
          </a>
          <p className="text-xs text-[#A3A3A3]">
            Authentication is handled securely. No password? We&apos;ll email you a secure link.
          </p>
        </div>
      </div>
    </div>
  )
}
