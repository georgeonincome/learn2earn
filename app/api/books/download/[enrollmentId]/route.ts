// Download a purchased book — increments download_count, returns pdfUrl.
// Route: GET /api/books/download/[enrollmentId]
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getCurrentUser } from '@/lib/server/auth'
import { getStudentByUserId } from '@/lib/server/students'
import { downloadBook } from '@/lib/server/books'

export const runtime = 'nodejs'

export async function GET(request: NextRequest, ctx: { params: Promise<{ enrollmentId: string }> }) {
  const { enrollmentId } = await ctx.params
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
  const student = await getStudentByUserId(user.id)
  if (!student) return NextResponse.json({ error: 'Student profile not found' }, { status: 404 })

  const result = await downloadBook(enrollmentId, student.id)
  if (!result) return NextResponse.json({ error: 'Enrollment not found' }, { status: 404 })

  return NextResponse.json(result)
}
