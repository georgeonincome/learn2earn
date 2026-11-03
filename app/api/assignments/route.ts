/**
 * Assignments — reference `assignments` / `assignment_submissions`.
 * GET lists assignments (optionally ?courseId=); POST creates (staff).
 */
import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession, requireAdminRole } from '@/lib/server/admin-session'
import { listAssignments, createAssignment } from '@/lib/server/ops'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const courseId = request.url.includes('courseId=')
    ? new URL(request.url).searchParams.get('courseId') ?? undefined
    : undefined
  return NextResponse.json(await listAssignments({ courseId }))
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession()
  if (!session || !requireAdminRole(session, 'edit_courses').allowed) {
    return NextResponse.json({ error: 'Admin required' }, { status: 403 })
  }
  const body = await request.json().catch(() => ({}))
  if (!body.courseId || !body.title) {
    return NextResponse.json({ error: 'courseId and title required' }, { status: 400 })
  }
  const assignment = await createAssignment({
    courseId: body.courseId, cohortId: body.cohortId ?? null,
    title: body.title, description: body.description ?? null,
    dueDate: body.dueDate ?? null, weight: body.weight ?? 1,
  })
  return NextResponse.json(assignment, { status: 201 })
}
