/**
 * Course studio — final assessment builder (upsert).
 */
import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession, requireAdminRole } from '@/lib/server/admin-session'
import { upsertFinalAssessment, deleteFinalAssessment } from '@/lib/server/course-studio'

export const runtime = 'nodejs'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session || !requireAdminRole(session, 'edit_courses').allowed) {
    return NextResponse.json({ error: 'Admin required' }, { status: 403 })
  }
  const { id } = await params
  const body = await req.json().catch(() => ({}))
  if (body.action === 'delete') {
    await deleteFinalAssessment(id)
    return NextResponse.json({ ok: true })
  }
  const assessment = await upsertFinalAssessment({
    courseId: id, title: body.title, description: body.description,
    questions: body.questions, totalQuestions: body.totalQuestions,
    passingScore: body.passingScore, retakeFeeKes: body.retakeFeeKes,
    showResults: body.showResults, shuffleQuestions: body.shuffleQuestions,
    shuffleOptions: body.shuffleOptions, timeLimit: body.timeLimit,
    isPublished: body.isPublished,
  })
  return NextResponse.json(assessment, { status: 201 })
}
