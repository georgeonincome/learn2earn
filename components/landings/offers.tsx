'use client'

/**
 * ExitIntentOffer — mirrors the reference First50kLanding exit-intent modal:
 * fires on mouseleave (desktop) once per session, showing the "Wait! Special
 * Offer" panel with enroll/decline choices. TrackInitiateCheckout on open.
 */

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Sparkles, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/data'
import { trackInitiateCheckout } from '@/lib/marketing'

const WHATSAPP_INTL = `260${SITE_CONFIG.whatsapp.slice(1)}`

export function ExitIntentOffer({
  title,
  ctaText,
  ctaHref,
  saveText,
}: {
  title: string
  ctaText: string
  ctaHref: string
  saveText: string
}) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    let fired = window.sessionStorage.getItem('l2e_exit_intent') === '1'
    const handler = (e: MouseEvent) => {
      if (fired || e.clientY > 0) return
      fired = true
      try {
        window.sessionStorage.setItem('l2e_exit_intent', '1')
      } catch { /* ignore */ }
      setOpen(true)
      trackInitiateCheckout(title)
    }
    document.addEventListener('mouseleave', handler)
    return () => document.removeEventListener('mouseleave', handler)
  }, [title])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4" role="dialog" aria-modal="true">
      <div className="relative w-full max-w-md rounded-2xl border border-[#1DB96B]/40 bg-[#0A0D14] p-8 text-center shadow-2xl">
        <button
          onClick={() => setOpen(false)}
          aria-label="Close offer"
          className="absolute right-3 top-3 text-[#A3A3A3] hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
        <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#1DB96B]/20 text-[#1DB96B]">
          <Sparkles className="h-6 w-6" />
        </span>
        <h2 className="mb-1 text-xl font-extrabold text-white">{title}</h2>
        <p className="mb-6 text-sm text-[#A3A3A3]">This offer expires when you leave this page.</p>

        <p className="mb-6 text-lg font-bold text-[#1DB96B]">{saveText}</p>

        <Link
          href={ctaHref}
          onClick={() => setOpen(false)}
          className="mb-3 flex w-full items-center justify-center rounded-lg bg-[#1DB96B] px-5 py-3 text-sm font-bold text-[#0A0D14] hover:bg-[#17A05D]"
        >
          Yes! {ctaText}
        </Link>
        <a
          href={`https://wa.me/${WHATSAPP_INTL}?text=Hi%20George%2C%20tell%20me%20about%20this%20offer`}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-3 flex w-full items-center justify-center rounded-lg border border-[#1DB96B]/50 px-5 py-3 text-sm font-bold text-[#1DB96B] hover:bg-[#1DB96B]/10"
        >
          Talk to George First
        </a>
        <button
          onClick={() => setOpen(false)}
          className="w-full py-2 text-center text-xs font-semibold text-[#6B7280] hover:text-[#A3A3A3]"
        >
          No thanks, I&apos;ll pay full price later
        </button>
      </div>
    </div>
  )
}

/**
 * CountdownBadge — "Early access price ends in" HH:MM:SS ticker (24h window
 * anchored to midnight, like the reference's end-of-day launch pricing).
 */
export function CountdownBadge({ label = 'Early access price ends in' }: { label?: string }) {
  const [time, setTime] = useState<string | null>(null)

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      const end = new Date(now)
      end.setHours(23, 59, 59, 0)
      const diff = Math.max(0, end.getTime() - now.getTime())
      const h = Math.floor(diff / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      const pad = (n: number) => String(n).padStart(2, '0')
      setTime(`${pad(h)}:${pad(m)}:${pad(s)}`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  if (!time) return null
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-[#F59E0B]/40 bg-[#F59E0B]/10 px-4 py-2 text-sm">
      <span className="font-semibold text-[#F59E0B]">{label}</span>
      <span className="font-mono font-bold tabular-nums text-white">{time}</span>
    </div>
  )
}
