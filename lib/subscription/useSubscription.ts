'use client'

/**
 * useSubscription — hook for subscription state management.
 *
 * Matches reference useSubscription-CuULC_HM.js:
 * - Calls the `subscription-summary` contract (our endpoint: POST /api/subscription-summary)
 * - Returns subscription state: status, isActive, plan, periods, daysRemaining, daysTotal,
 *   amount, currency, cancelAtPeriodEnd, lastPayment, counts, plans
 * - Helpers: formatCurrency (ZMW rebrand), pricePerMonth
 * - `loading` starts true; a signed-out session keeps the default state (status "none")
 */

import { useState, useEffect, useCallback } from 'react'

type PlanSummary = {
  id: string
  code: string
  name: string
  duration_days: number
  price_kes: number
  price_usd?: number
  is_visible: boolean
  is_recommended: boolean
  sort_order: number
}

// Default subscription state (matches the reference initial state, `o` in the chunk)
const DEFAULT_SUBSCRIPTION = {
  status: 'none' as 'none' | 'active' | 'expired' | 'cancelled',
  isActive: false,
  plan: null as PlanSummary | null,
  currentPeriodEnd: null as Date | null,
  currentPeriodStart: null as Date | null,
  daysRemaining: null as number | null,
  daysTotal: null as number | null,
  amount: 0,
  currency: 'ZMW' as const,
  cancelAtPeriodEnd: false,
  lastPayment: null as Date | null,
  counts: { courses: 0, resources: 0, darasaSessions: 0, owned: 0, certificates: 0 },
  plans: [] as PlanSummary[],
}

export function useSubscription() {
  const [state, setState] = useState<typeof DEFAULT_SUBSCRIPTION>(DEFAULT_SUBSCRIPTION)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch('/api/subscription-summary', { method: 'POST' })
      if (res.status === 401) {
        setState(DEFAULT_SUBSCRIPTION)
        return
      }
      if (!res.ok) throw new Error('Could not load subscription')
      const summary = await res.json()
      setState({
        ...DEFAULT_SUBSCRIPTION,
        ...summary,
        currentPeriodEnd: summary.currentPeriodEnd ? new Date(summary.currentPeriodEnd) : null,
        currentPeriodStart: summary.currentPeriodStart ? new Date(summary.currentPeriodStart) : null,
        counts: { ...DEFAULT_SUBSCRIPTION.counts, ...(summary.counts ?? {}) },
        plans: summary.plans ?? [],
      })
    } catch (err) {
      console.error('[useSubscription]', err)
      setError((err as Error)?.message ?? 'Could not load subscription')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { ...state, loading, error, refresh }
}

/**
 * formatCurrency — formats an amount as ZMW.
 * Reference: `KES ${Math.round(amount).toLocaleString("en-KE")}` → rebranded.
 */
export function formatCurrency(amount: number): string {
  return `ZMW ${Math.round(amount).toLocaleString('en-ZM')}`
}

/** pricePerMonth — Reference: Math.round(amount / (durationDays / 30)) */
export function pricePerMonth(amount: number, durationDays: number): number {
  return durationDays > 0 ? Math.round(amount / (durationDays / 30)) : amount
}
