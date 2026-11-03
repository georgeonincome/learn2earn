/**
 * Dashboard plan — real subscription state (replaces the static page).
 */
import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/server/auth'
import { getStudentByUserId } from '@/lib/server/students'
import { buildSummary, getVisiblePlans } from '@/lib/server/subscription'

export const runtime = 'nodejs'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
  const student = await getStudentByUserId(user.id)
  if (!student) return NextResponse.json({ error: 'Student profile not found' }, { status: 404 })

  const summary = await buildSummary(student.id)
  const plans = await getVisiblePlans()
  return NextResponse.json({
    state: summary.status, planActive: summary.isActive, planName: summary.plan?.name ?? null,
    daysRemaining: summary.daysRemaining ?? null, pricePerMonth: null,
    startedAt: summary.currentPeriodStart ?? null, plans: summary.plans,
  })
}
