'use client'

import { useState } from 'react'
import { Mail, ArrowRight, Lock, MessageCircle, Phone, ChevronRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/data'

/* Auth page — exact 1:1 from click2skill Auth-DhBBJHb7.js:
   - Desktop: dark left aside panel (#0E2A1E) + main card on right (#F6F7F5)
   - Mobile: full-screen centered card
   - Topbar: back button + logo
   - Steps: start → email → code → profile → done
   - 6-digit code email auth, no password needed (default)
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

type AuthStep = 'start' | 'email' | 'code' | 'profile' | 'password' | 'member' | 'forgot_sent'

export default function AuthPage() {
  const [step, setStep] = useState<AuthStep>('start')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [memberNo, setMemberNo] = useState('')
  const [name, setName] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resendSeconds, setResendSeconds] = useState(0)

  const handleBack = () => {
    if (step === 'start' || step === 'profile') {
      return
    }
    setStep('start')
    setError('')
  }

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault()
    if (!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(email.trim())) {
      setError('Enter a full email address, for example you@gmail.com')
      return
    }
    setLoading(true)
    setError('')
    setTimeout(() => {
      setLoading(false)
      setStep('code')
    }, 1000)
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
          <div className="flex items-center justify-between">
            {(step !== 'start' && step !== 'profile') ? (
              <button
                onClick={handleBack}
                className="-ml-2 inline-flex items-center gap-1.5 rounded-lg px-2 py-2 text-sm font-semibold text-[#5B6B64] hover:text-[#10201A]"
              >
                <ChevronRight className="h-4 w-4 rotate-180" /> Back
              </button>
            ) : (
              <span />
            )}
            <div className="h-6 w-auto lg:hidden">{LOGO_SVG_DARK}</div>
          </div>

          {/* Step: start */}
          {step === 'start' && (
            <section className="mt-6 lg:mt-2">
              <h1 className="text-[28px] font-extrabold leading-tight tracking-[-0.02em]">
                Sign in or create your account
              </h1>
              <p className="mt-2 text-[15px] text-[#5B6B64]">
                We send a 6 digit code to your email. No password needed.
              </p>
              <form className="mt-6" onSubmit={handleSendCode} noValidate>
                <label className="block text-sm font-semibold">Email address</label>
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
                  className="mt-1.5 w-full rounded-xl border border-[#D9E0DC] bg-white px-3.5 py-3 text-base text-[#10201A] outline-none placeholder:text-[#9AA7A1] focus:border-[#0B854C] focus:ring-4 focus:ring-[#0B854C]/10"
                  aria-invalid={!!error}
                />
                {error && (
                  <p className="mt-2 rounded-lg bg-[#FDECEA] px-3 py-2 text-sm text-[#B42318]">{error}</p>
                )}
                <button
                  disabled={loading}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl bg-[#0B854C] px-4 py-3.5 text-[15px] font-bold text-white hover:bg-[#087A45] disabled:cursor-not-allowed disabled:opacity-60 mt-4 ${loading ? 'opacity-60' : ''}`}
                >
                  {loading ? 'Sending your code…' : 'Continue with email'}
                </button>
              </form>
              {!loading && (
                <>
                  <div className="my-5 flex items-center gap-3 text-xs font-semibold text-[#9AA7A1]">
                    <span className="h-px flex-1 bg-[#E3E8E5]" />
                    or
                    <span className="h-px flex-1 bg-[#E3E8E5]" />
                  </div>
                  <button
                    onClick={() => { setStep('password'); setError('') }}
                    className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-[#D9E0DC] bg-white px-4 py-3.5 text-[15px] font-semibold text-[#10201A] hover:border-[#9DB0A7]"
                  >
                    Continue with Google
                  </button>
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm">
                    <button
                      onClick={() => { setStep('password'); setError('') }}
                      className="font-semibold text-[#0B854C] hover:underline rounded"
                    >
                      Use a password
                    </button>
                    <button
                      onClick={() => { setStep('member'); setError('') }}
                      className="font-semibold text-[#0B854C] hover:underline rounded"
                    >
                      Use my member number
                    </button>
                  </div>
                </>
              )}
            </section>
          )}

          {/* Step: password */}
          {step === 'password' && (
            <section className="mt-6 lg:mt-2">
              <h1 className="text-[26px] font-extrabold tracking-[-0.02em]">Sign in with a password</h1>
              <form className="mt-6 space-y-4" onSubmit={e => {
                e.preventDefault()
                setLoading(true)
                setError('')
                setTimeout(() => {
                  setLoading(false)
                  setStep('start')
                }, 1000)
              }}>
                <label className="block text-sm font-semibold">
                  Email address
                  <input
                    type="email"
                    inputMode="email"
                    autoComplete="username"
                    autoCapitalize="none"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-[#D9E0DC] bg-white px-3.5 py-3 text-base text-[#10201A] outline-none placeholder:text-[#9AA7A1] focus:border-[#0B854C] focus:ring-4 focus:ring-[#0B854C]/10"
                  />
                </label>
                <label className="block text-sm font-semibold">
                  Password
                  <input
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-[#D9E0DC] bg-white px-3.5 py-3 text-base text-[#10201A] outline-none placeholder:text-[#9AA7A1] focus:border-[#0B854C] focus:ring-4 focus:ring-[#0B854C]/10"
                  />
                </label>
                {error && (
                  <p className="mt-2 rounded-lg bg-[#FDECEA] px-3 py-2 text-sm text-[#B42318]">{error}</p>
                )}
                <button
                  disabled={loading}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl bg-[#0B854C] px-4 py-3.5 text-[15px] font-bold text-white hover:bg-[#087A45] disabled:opacity-60 ${loading ? 'opacity-60' : ''}`}
                >
                  {loading ? 'Signing in…' : 'Sign in'}
                </button>
              </form>
              <div className="mt-5 flex flex-wrap justify-between gap-2 text-sm">
                <button
                  onClick={() => { setError('Enter your email first, then tap Forgot password.') }}
                  className="font-semibold text-[#0B854C] hover:underline rounded"
                >
                  Forgot password?
                </button>
                <button
                  onClick={() => { setStep('start'); setError('') }}
                  className="font-semibold text-[#0B854C] hover:underline rounded"
                >
                  Get a code instead
                </button>
              </div>
            </section>
          )}

          {/* Step: code */}
          {step === 'code' && (
            <section className="mt-6 lg:mt-2">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#E8F6EF] text-[#0B854C]">
                <svg className="h-6 w-6" aria-hidden="true">
                  <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              </span>
              <h1 className="mt-4 text-[26px] font-extrabold tracking-[-0.02em]">Check your email</h1>
              <p className="mt-2 text-[15px] text-[#5B6B64]">
                We sent a 6 digit code to <b className="break-all text-[#10201A]">{email}</b>. It works for 10 minutes.
              </p>
              <label htmlFor="auth-code" className="mt-6 block text-sm font-semibold">Your code</label>
              <div className="relative mt-1.5">
                <div className="grid grid-cols-6 gap-2" aria-hidden="true">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <span
                      key={i}
                      className={`grid h-14 place-items-center rounded-xl border-2 bg-white font-mono text-2xl font-semibold tabular-nums ${code.length > i ? 'border-[#9DB0A7]' : 'border-[#D9E0DC]'}`}
                    >
                      {code[i] || ''}
                    </span>
                  ))}
                </div>
                <input
                  id="auth-code"
                  value={code}
                  onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]*"
                  maxLength={6}
                  className="absolute inset-0 h-full w-full cursor-text bg-transparent text-transparent caret-transparent opacity-0 outline-none"
                />
              </div>
              <p className="sr-only">Type or paste the 6 digit code. It checks by itself when complete.</p>
              {error && (
                <p className="mt-3 inline-flex items-center gap-2 text-sm text-[#5B6B64]">{error}</p>
              )}
              <div className="mt-4 flex flex-wrap justify-between gap-2 text-sm">
                {resendSeconds > 0 ? (
                  <span className="text-[#7A8A83]">Resend in {resendSeconds}s</span>
                ) : (
                  <button
                    onClick={() => { setResendSeconds(60); setError('') }}
                    className="font-semibold text-[#0B854C] hover:underline rounded"
                  >
                    Send a new code
                  </button>
                )}
                <button
                  onClick={() => { setStep('start'); setError('') }}
                  className="font-semibold text-[#0B854C] hover:underline rounded"
                >
                  Wrong email? Change it
                </button>
              </div>
            </section>
          )}

          {/* Step: profile */}
          {step === 'profile' && (
            <section className="mt-6 lg:mt-2">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#E8F6EF] text-[#0B854C]">
                <svg className="h-6 w-6" aria-hidden="true">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              </span>
              <h1 className="mt-4 text-[26px] font-extrabold tracking-[-0.02em]">Welcome to Learn2Earn</h1>
              <p className="mt-2 text-[15px] text-[#5B6B64]">One last thing before you start.</p>
              <form className="mt-6 space-y-4" onSubmit={e => {
                e.preventDefault()
                setLoading(true)
                setError('')
                setTimeout(() => {
                  setLoading(false)
                }, 1000)
              }}>
                <label className="block text-sm font-semibold">
                  Full name
                  <input
                    autoFocus
                    autoComplete="name"
                    autoCapitalize="words"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="For example George J. Kasonso"
                    className="mt-1.5 w-full rounded-xl border border-[#D9E0DC] bg-white px-3.5 py-3 text-base text-[#10201A] outline-none placeholder:text-[#9AA7A1] focus:border-[#0B854C] focus:ring-4 focus:ring-[#0B854C]/10"
                  />
                  <span className="mt-1.5 block text-xs font-normal text-[#5B6B64]">Written exactly like this on your certificates.</span>
                </label>
                <label className="block text-sm font-semibold">
                  WhatsApp number <span className="font-normal text-[#7A8A83]">(optional)</span>
                  <input
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={whatsapp}
                    onChange={e => setWhatsapp(e.target.value)}
                    placeholder="097 123 4567"
                    className="mt-1.5 w-full rounded-xl border border-[#D9E0DC] bg-white px-3.5 py-3 text-base text-[#10201A] outline-none placeholder:text-[#9AA7A1] focus:border-[#0B854C] focus:ring-4 focus:ring-[#0B854C]/10"
                  />
                  <span className="mt-1.5 block text-xs font-normal text-[#5B6B64]">Only for class reminders. We never share it.</span>
                </label>
                {error && (
                  <p className="mt-2 rounded-lg bg-[#FDECEA] px-3 py-2 text-sm text-[#B42318]">{error}</p>
                )}
                <button
                  disabled={loading}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl bg-[#0B854C] px-4 py-3.5 text-[15px] font-bold text-white hover:bg-[#087A45] disabled:opacity-60 ${loading ? 'opacity-60' : ''}`}
                >
                  {loading ? 'Starting…' : 'Start learning'}
                </button>
              </form>
            </section>
          )}

          {/* Step: member */}
          {step === 'member' && (
            <section className="mt-6 lg:mt-2">
              <h1 className="text-[26px] font-extrabold tracking-[-0.02em]">Use your member number</h1>
              <p className="mt-2 text-[15px] text-[#5B6B64]">We send a code to the email on your membership, so only you can sign in.</p>
              <form className="mt-6" onSubmit={e => {
                e.preventDefault()
                setLoading(true)
                setError('')
                setTimeout(() => {
                  setLoading(false)
                  setStep('code')
                }, 1000)
              }}>
                <label className="block text-sm font-semibold" htmlFor="auth-member">Member number</label>
                <div className="relative mt-1.5">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 mt-[3px] -translate-y-1/2 font-mono text-base text-[#5B6B64]">C2S-</span>
                  <input
                    id="auth-member"
                    inputMode="numeric"
                    autoComplete="off"
                    value={memberNo}
                    onChange={e => setMemberNo(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="0148"
                    className="w-full rounded-xl border border-[#D9E0DC] bg-white px-3.5 py-3 text-base text-[#10201A] outline-none pl-[3.6rem] font-mono tracking-wider focus:border-[#0B854C] focus:ring-4 focus:ring-[#0B854C]/10"
                  />
                </div>
                {error && (
                  <p className="mt-2 rounded-lg bg-[#FDECEA] px-3 py-2 text-sm text-[#B42318]">{error}</p>
                )}
                <button
                  disabled={loading}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl bg-[#0B854C] px-4 py-3.5 text-[15px] font-bold text-white hover:bg-[#087A45] disabled:opacity-60 mt-4 ${loading ? 'opacity-60' : ''}`}
                >
                  {loading ? 'Sending your code…' : 'Send me a code'}
                </button>
              </form>
            </section>
          )}

          {/* Step: forgot_sent */}
          {step === 'forgot_sent' && (
            <section className="mt-6 lg:mt-2">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#E8F6EF] text-[#0B854C]">
                <svg className="h-6 w-6" aria-hidden="true">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.124" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  <path d="M22 4L12 18.02-9 11.12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              </span>
              <h1 className="mt-4 text-[26px] font-extrabold tracking-[-0.02em]">Check your email</h1>
              <p className="mt-2 text-[15px] text-[#5B6B64]">
                If <b className="text-[#10201A]">{email}</b> has an account, we sent a link to set a new password. It works for 1 hour.
              </p>
              <button
                onClick={() => { setStep('start'); setError('') }}
                className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-[#D9E0DC] bg-white px-4 py-3.5 text-[15px] font-semibold text-[#10201A] hover:border-[#9DB0A7] mt-6"
              >
                Sign in with a code instead
              </button>
            </section>
          )}

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