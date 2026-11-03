/**
 * Assignment submissions — reference `assignment_submissions`.
 * GET ?assignmentId= lists submissions; POST submits (student).
 */
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/server/auth'
import { getStudentByUserId } from '@/lib/server/students'
import { submitAssignment, listAssignmentSubmissions } from '@/lib/server/ops'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const assignmentId = new URL(request.url).searchParams.get('assignmentId')
  if (!assignmentId) return NextResponse.json({ error: 'assignmentId required' }, { status: 400 })
  return NextResponse.json(await listAssignmentSubmissions(assignmentId))
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
  const student = await getStudentByUserId(user.id)
  if (!student) return NextResponse.json({ error: 'Student profile not found' }, { status: 404 })
  const body = await request.json().catch(() => ({}))
  if (!body.assignmentId) return NextResponse.json({ error: 'assignmentId required' }, { status: 400 })
  const submission = await submitAssignment({
    assignmentId: body.assignmentId, studentId: student.id,
    submissionText: body.submissionText ?? null,
    submissionFileUrl: body.submissionFileUrl ?? null, note: body.note ?? null,
  })
  return NextResponse.json(submission, { status: 201 })
}
