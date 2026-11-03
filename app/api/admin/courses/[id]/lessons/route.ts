/**
 * Course studio — lessons: POST create under a course.
 */
import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession, requireAdminRole } from '@/lib/server/admin-session'
import { createLesson, getLesson, updateLesson, deleteLesson } from '@/lib/server/course-studio'

export const runtime = 'nodejs'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session || !requireAdminRole(session, 'edit_courses').allowed) {
    return NextResponse.json({ error: 'Admin required' }, { status: 403 })
  }
  const { id } = await params
  const body = await req.json().catch(() => ({}))
  if (!body.title) return NextResponse.json({ error: 'title required' }, { status: 400 })
  const lesson = await createLesson({ courseId: id, ...body })
  return NextResponse.json(lesson, { status: 201 })
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session || !requireAdminRole(session, 'edit_courses').allowed) {
    return NextResponse.json({ error: 'Admin required' }, { status: 403 })
  }
  const { id } = await params
  const body = await req.json().catch(() => ({}))
  await updateLesson(id, body)
  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session || !requireAdminRole(session, 'edit_courses').allowed) {
    return NextResponse.json({ error: 'Admin required' }, { status: 403 })
  }
  const { id } = await params
  await deleteLesson(id)
  return NextResponse.json({ ok: true })
}
