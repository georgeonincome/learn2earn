/**
 * Course studio — reference `admin_course_editor`. Courses list/create.
 */
import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession, requireAdminRole } from '@/lib/server/admin-session'
import { listCourses, createCourse, getCourse, updateCourse, deleteCourse } from '@/lib/server/course-studio'

export const runtime = 'nodejs'

export async function GET() {
  const session = await getAdminSession()
  if (!session || !requireAdminRole(session, 'view_courses').allowed) {
    return NextResponse.json({ error: 'Admin required' }, { status: 403 })
  }
  return NextResponse.json(await listCourses())
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession()
  if (!session || !requireAdminRole(session, 'edit_courses').allowed) {
    return NextResponse.json({ error: 'Admin required' }, { status: 403 })
  }
  const body = await request.json().catch(() => ({}))
  if (!body.slug || !body.title) {
    return NextResponse.json({ error: 'slug and title required' }, { status: 400 })
  }
  const course = await createCourse({
    slug: body.slug, title: body.title, description: body.description ?? null,
    categoryId: body.categoryId ?? null, requirements: body.requirements ?? null,
    whatYoullLearn: body.whatYoullLearn ?? null, courseType: body.courseType ?? 'self_paced',
    includeInPlan: body.includeInPlan ?? false, regularPrice: body.regularPrice ?? 0,
    salePrice: body.salePrice ?? null, saleEnds: body.saleEnds ?? null,
    status: body.status ?? 'draft', sortOrder: body.sortOrder ?? 0,
    googleTitle: body.googleTitle ?? null, googleDescription: body.googleDescription ?? null,
    seoKeywords: body.seoKeywords ?? null, shareImageUrl: body.shareImageUrl ?? null,
    publishAt: body.publishAt ?? null,
  })
  return NextResponse.json(course, { status: 201 })
}
