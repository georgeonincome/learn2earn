/**
 * Reading Lab — reference `reading_lab_*`. Dispatched by `action`.
 * GET ?action=lab|days|habits|messages|announcements|enrollment|certificate
 * POST action=enroll|response|reflection|habit|weekly|message|reaction|certificate
 */
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/server/auth'
import { getStudentByUserId } from '@/lib/server/students'
import {
  getReadingLab, listReadingLabDays, getLabEnrollment, createLabEnrollment,
  submitDayResponse, submitReflection, listLabHabits, toggleStudentHabit,
  listStudentHabits, checkinHabit, submitWeeklySummary, issueLabCertificate,
  getLabCertificate, sendLabMessage, listLabMessages, reactToMessage,
  listLabAnnouncements,
} from '@/lib/server/reading-lab'

export const runtime = 'nodejs'

async function studentId() {
  const user = await getCurrentUser()
  if (!user) return null
  const student = await getStudentByUserId(user.id)
  return student?.id ?? null
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action') ?? 'lab'
  const lab = await getReadingLab()
  if (!lab) return NextResponse.json({ error: 'No active reading lab' }, { status: 404 })

  if (action === 'days') return NextResponse.json(await listReadingLabDays(lab.id))
  if (action === 'announcements') return NextResponse.json(await listLabAnnouncements(lab.id))

  const sid = await studentId()
  if (!sid) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })

  if (action === 'habits') {
    const enrollment = await getLabEnrollment(lab.id, sid)
    if (!enrollment) return NextResponse.json({ error: 'Not enrolled' }, { status: 404 })
    return NextResponse.json(await listStudentHabits(enrollment.id))
  }
  if (action === 'enrollment') {
    const enrollment = await getLabEnrollment(lab.id, sid)
    return NextResponse.json(enrollment ?? null)
  }
  if (action === 'certificate') {
    const enrollment = await getLabEnrollment(lab.id, sid)
    if (!enrollment) return NextResponse.json({ error: 'Not enrolled' }, { status: 404 })
    const cert = await getLabCertificate(enrollment.id)
    return NextResponse.json({ issued: !!cert, ...cert })
  }
  if (action === 'messages') {
    return NextResponse.json(await listLabMessages(lab.id))
  }
  return NextResponse.json(lab)
}

export async function POST(request: NextRequest) {
  const sid = await studentId()
  if (!sid) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
  const body = await request.json().catch(() => ({}))
  const { action } = body
  const lab = await getReadingLab()
  if (!lab) return NextResponse.json({ error: 'No active reading lab' }, { status: 404 })

  if (action === 'enroll') {
    const existing = await getLabEnrollment(lab.id, sid)
    if (existing) return NextResponse.json(existing)
    const user = await getCurrentUser()
    const enrollment = await createLabEnrollment({
      labId: lab.id, studentId: sid,
      nickname: body.nickname ?? String((user?.email ?? '').split('@')[0]),
    })
    return NextResponse.json(enrollment, { status: 201 })
  }

  const enrollment = await getLabEnrollment(lab.id, sid)
  if (!enrollment) return NextResponse.json({ error: 'Not enrolled' }, { status: 404 })

  if (action === 'response') {
    const r = await submitDayResponse({
      enrollmentId: enrollment.id, studentId: sid, dayNumber: Number(body.dayNumber),
      prompt: body.prompt ?? '', response: body.response ?? '',
    })
    return NextResponse.json(r, { status: 201 })
  }
  if (action === 'reflection') {
    const r = await submitReflection({
      enrollmentId: enrollment.id, studentId: sid, dayNumber: Number(body.dayNumber),
      keyLesson: body.keyLesson ?? '', reflection: body.reflection ?? '', applyAction: body.applyAction ?? '',
    })
    return NextResponse.json(r, { status: 201 })
  }
  if (action === 'habit') {
    const r = await toggleStudentHabit({
      enrollmentId: enrollment.id, habitId: body.habitId, active: Boolean(body.active),
    })
    return NextResponse.json(r, { status: 201 })
  }
  if (action === 'habit-checkin') {
    const r = await checkinHabit({
      enrollmentId: enrollment.id, studentId: sid, habitId: body.habitId,
      dayNumber: Number(body.dayNumber), completed: Boolean(body.completed),
    })
    return NextResponse.json(r, { status: 201 })
  }
  if (action === 'weekly') {
    const r = await submitWeeklySummary({
      enrollmentId: enrollment.id, studentId: sid, weekNumber: Number(body.weekNumber),
      lessonsLearned: body.lessonsLearned ?? '', win: body.win ?? '',
      challengeFaced: body.challengeFaced ?? '', habitImplemented: body.habitImplemented ?? '',
    })
    return NextResponse.json(r, { status: 201 })
  }
  if (action === 'message') {
    const user = await getCurrentUser()
    const r = await sendLabMessage({
      labId: lab.id, enrollmentId: enrollment.id, sender: 'student',
      senderName: String(user?.email ?? sid), content: body.content ?? '',
    })
    return NextResponse.json(r, { status: 201 })
  }
  if (action === 'reaction') {
    const r = await reactToMessage({
      messageId: body.messageId, enrollmentId: enrollment.id, sender: 'student',
      reaction: body.reaction ?? '❤️',
    })
    return NextResponse.json(r, { status: 201 })
  }
  if (action === 'certificate') {
    const existing = await getLabCertificate(enrollment.id)
    if (existing) return NextResponse.json(existing)
    const user = await getCurrentUser()
    const cert = await issueLabCertificate({
      enrollmentId: enrollment.id, studentId: sid,
      studentName: String(user?.email ?? sid), labTitle: lab.title,
      bookName: lab.book_name, durationDays: lab.duration_days,
      daysCompleted: Number(body.daysCompleted ?? enrollment.current_day),
      attendance: Number(body.attendance ?? 100),
      reflections: Number(body.reflections ?? 0), habitScore: Number(body.habitScore ?? 0),
    })
    return NextResponse.json(cert, { status: 201 })
  }
  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
