/**
 * 5AM Challenge — reference `am_challenge_*`. One route, dispatched by
 * `section` (GET) / `action` (POST) / body fields (PUT check-in).
 * GET ?section=days | config ; GET (challenge)
 * POST action=enroll | checkin | progress | quiz | final | certificate
 * PUT action=checkin  (alias)
 */
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/server/auth'
import { getStudentByUserId } from '@/lib/server/students'
import {
  getChallenge, listChallengeDays, getFinalAssessmentConfig, getEnrollment,
  createEnrollment, createCheckin, upsertProgress, recordQuiz, getProgress,
  submitFinalAttempt, getCertificate, issueCertificate,
} from '@/lib/server/am-challenge'

export const runtime = 'nodejs'

async function studentId() {
  const user = await getCurrentUser()
  if (!user) return null
  const student = await getStudentByUserId(user.id)
  return student?.id ?? null
}

async function requireEnrollment() {
  const sid = await studentId()
  if (!sid) return { error: NextResponse.json({ error: 'Not signed in' }, { status: 401 }) }
  const challenge = await getChallenge()
  if (!challenge) return { error: NextResponse.json({ error: 'No active challenge' }, { status: 404 }) }
  const enrollment = await getEnrollment(challenge.id, sid)
  if (!enrollment) return { error: NextResponse.json({ error: 'Not enrolled' }, { status: 404 }) }
  return { sid, challenge, enrollment }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const section = searchParams.get('section')
  const challenge = await getChallenge()
  if (!challenge) return NextResponse.json({ error: 'No active challenge' }, { status: 404 })

  if (section === 'days') {
    const days = await listChallengeDays(challenge.id)
    return NextResponse.json({ challenge, days })
  }
  if (section === 'config') {
    const config = await getFinalAssessmentConfig(challenge.id)
    return NextResponse.json({ challenge, config })
  }
  return NextResponse.json(challenge)
}

export async function POST(request: NextRequest) {
  const sid = await studentId()
  if (!sid) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
  const body = await request.json().catch(() => ({}))
  const { action } = body
  const challenge = await getChallenge()
  if (!challenge) return NextResponse.json({ error: 'No active challenge' }, { status: 404 })
  const user = await getCurrentUser()
  const student = await getStudentByUserId(user!.id)

  if (action === 'enroll') {
    const existing = await getEnrollment(challenge.id, sid)
    if (existing) return NextResponse.json(existing)
    const enrollment = await createEnrollment({
      challengeId: challenge.id, studentId: sid,
      studentName: String(student?.full_name ?? ''), studentEmail: user!.email,
      phone: body.phone ?? null, amount: Number(challenge.price),
      paymentReference: body.paymentReference ?? null,
      paymentMethod: body.paymentMethod ?? 'flutterwave',
      paymentStatus: body.paymentStatus ?? 'paid',
    })
    return NextResponse.json(enrollment, { status: 201 })
  }

  const req = await requireEnrollment()
  if ('error' in req) return req.error
  const { enrollment } = req

  if (action === 'checkin') {
    const checkin = await createCheckin({
      enrollmentId: enrollment.id, studentId: sid, challengeId: challenge.id,
      dayNumber: Number(body.dayNumber), notes: body.notes ?? null,
    })
    return NextResponse.json(checkin, { status: 201 })
  }
  if (action === 'progress') {
    const progress = await upsertProgress({
      enrollmentId: enrollment.id, studentId: sid, dayId: body.dayId,
      lessonCompleted: Boolean(body.lessonCompleted), notes: body.notes ?? null,
    })
    return NextResponse.json(progress, { status: 201 })
  }
  if (action === 'quiz') {
    const quiz = await recordQuiz({
      enrollmentId: enrollment.id, studentId: sid, dayId: body.dayId,
      answers: body.answers, score: Number(body.score), completed: true,
    })
    return NextResponse.json(quiz, { status: 201 })
  }
  if (action === 'final') {
    const config = await getFinalAssessmentConfig(challenge.id)
    if (!config) return NextResponse.json({ error: 'No final assessment configured' }, { status: 404 })
    const questions = JSON.parse(config.questions ?? '[]')
    let correct = 0
    for (const [i, q] of questions.entries()) {
      if ((body.answers as any[])?.[i] === q.correct) correct++
    }
    const score = Math.round((correct / Math.max(questions.length, 1)) * 100)
    const passed = score >= Number(config.passing_grade ?? 70)
    const attempt = await submitFinalAttempt({
      configId: config.id, challengeId: challenge.id, enrollmentId: enrollment.id,
      studentId: sid, score, answers: body.answers, passed,
      timezone: body.timezone ?? challenge.timezone, userAgent: body.userAgent,
    })
    return NextResponse.json({ attempt, score, passed })
  }
  if (action === 'certificate') {
    const existing = await getCertificate(enrollment.id)
    if (existing) return NextResponse.json(existing)
    const cert = await issueCertificate({
      enrollmentId: enrollment.id, studentId: sid,
      studentName: String(student?.full_name ?? ''),
      year: Number(body.year ?? new Date().getFullYear()),
    })
    return NextResponse.json(cert, { status: 201 })
  }
  if (action === 'progress-get') {
    return NextResponse.json(await getProgress(enrollment.id, body.dayId))
  }
  if (action === 'cert-get') {
    const cert = await getCertificate(enrollment.id)
    return NextResponse.json({ issued: !!cert, ...cert })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
