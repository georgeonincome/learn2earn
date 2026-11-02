// `subscription-summary` — reference edge function contract (useSubscription-CuULC_HM.js):
// invoke("subscription-summary", { body: {} }) →
//   { status, isActive, plan, currentPeriodEnd, currentPeriodStart, daysRemaining,
//     daysTotal, amount, currency, cancelAtPeriodEnd, lastPayment, counts, plans }
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/server/auth'
import { getStudentByUserId } from '@/lib/server/students'
import { buildSummary } from '@/lib/server/subscription'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Not signed in (session)' }, { status: 401 })
  const student = await getStudentByUserId(user.id)
  if (!student) return NextResponse.json({ error: 'Student profile not found' }, { status: 404 })
  const summary = await buildSummary(student.id)
  return NextResponse.json(summary)
}
