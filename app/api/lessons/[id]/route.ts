// GET lesson by UUID or internal id (reference shape for CoursePlayer data loading).
// In the reference, CoursePlayer resolves lessons from a `courses` + `lessons` query.
// This route is the server-side entry point.
import { NextRequest, NextResponse } from 'next/server'
import { getLessonById } from '@/lib/server/courses'

export const runtime = 'nodejs'

export async function GET(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const lesson = await getLessonById(id)
  if (!lesson) {
    return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
  }
  return NextResponse.json({ lesson })
}
