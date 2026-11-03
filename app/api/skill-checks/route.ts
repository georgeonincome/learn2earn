/**
 * SkillCheck — reference `skill_checks` / `skill_check_attempts` /
 * `skill_check_credits`. Public catalog; student starts/submits attempts;
 * share-token report; admin create/update.
 */
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/server/auth'
import { getStudentByUserId } from '@/lib/server/students'
import {
  listSkillChecks, getSkillCheck, createSkillCheck, updateSkillCheck,
  startAttempt, submitAttempt, getAttempt, getAttemptByShareToken,
  listAttemptsByStudent, creditAttempt,
} from '@/lib/server/skill-check'

export const runtime = 'nodejs'

async function studentId() {
  const user = await getCurrentUser()
  if (!user) return null
  const student = await getStudentByUserId(user.id)
  return student?.id ?? null
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const token = searchParams.get('token')
  const mine = searchParams.get('mine')
  if (id) return NextResponse.json(await getSkillCheck(id))
  if (token) {
    const attempt = await getAttemptByShareToken(token)
    if (!attempt) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(attempt)
  }
  return NextResponse.json(await listSkillChecks())
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}))
  const { action } = body

  if (action === 'create' || action === 'update') {
    // admin-only write surface (full admin pages wired separately)
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
    const id = body.id
    if (action === 'update' && id) {
      await updateSkillCheck(id, {
        title: body.title, description: body.description, levelHint: body.levelHint,
        isFeatured: body.isFeatured, isFree: body.isFree, price: body.price,
        memberPrice: body.memberPrice, currency: body.currency,
        retakeDiscountPct: body.retakeDiscountPct, durationMinutes: body.durationMinutes,
        questions: body.questions, candidateJobPaths: body.candidateJobPaths,
        isActive: body.isActive,
      })
      return NextResponse.json({ ok: true })
    }
    const check = await createSkillCheck({
      title: body.title, description: body.description, levelHint: body.levelHint,
      isFeatured: body.isFeatured, isFree: body.isFree, price: body.price,
      memberPrice: body.memberPrice, currency: body.currency,
      retakeDiscountPct: body.retakeDiscountPct, durationMinutes: body.durationMinutes,
      questions: body.questions, candidateJobPaths: body.candidateJobPaths,
    })
    return NextResponse.json(check, { status: 201 })
  }

  if (action === 'start') {
    const sid = await studentId()
    if (!sid) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
    const user = await getCurrentUser()
    const student = await getStudentByUserId(user!.id)
    const attempt = await startAttempt({
      skillCheckId: body.skillCheckId, studentId: sid,
      studentName: String(student?.full_name ?? ''), studentEmail: user!.email,
      isFree: body.isFree,
    })
    return NextResponse.json(attempt, { status: 201 })
  }
  if (action === 'submit') {
    const sid = await studentId()
    if (!sid) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
    const attempt = await submitAttempt({
      attemptId: body.attemptId, answers: body.answers, score: Number(body.score),
      topicScores: body.topicScores, weakestTopics: body.weakestTopics,
    })
    return NextResponse.json(attempt)
  }
  if (action === 'credit') {
    const sid = await studentId()
    if (!sid) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
    await creditAttempt({
      attemptId: body.attemptId, paymentReference: body.paymentReference,
      amountPaid: Number(body.amountPaid), currency: body.currency ?? 'ZMW',
    })
    return NextResponse.json({ ok: true })
  }
  if (action === 'mine') {
    const sid = await studentId()
    if (!sid) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
    return NextResponse.json(await listAttemptsByStudent(sid))
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}

export async function GET_ONE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return NextResponse.json(await getSkillCheck(id))
}
