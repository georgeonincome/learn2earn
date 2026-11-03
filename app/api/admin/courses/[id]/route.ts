/**
 * Course studio — single course: GET, PUT (publish/unpublish/archive/restore),
 * DELETE (archive).
 */
import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession, requireAdminRole } from '@/lib/server/admin-session'
import { getCourse, updateCourse, deleteCourse, restoreCourse } from '@/lib/server/course-studio'

export const runtime = 'nodejs'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session || !requireAdminRole(session, 'view_courses').allowed) {
    return NextResponse.json({ error: 'Admin required' }, { status: 403 })
  }
  const { id } = await params
  const course = await getCourse(id)
  if (!course) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(course)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session || !requireAdminRole(session, 'edit_courses').allowed) {
    return NextResponse.json({ error: 'Admin required' }, { status: 403 })
  }
  const { id } = await params
  const body = await req.json().catch(() => ({}))
  if (body.action === 'publish') await updateCourse(id, { status: 'published' })
  else if (body.action === 'unpublish') await updateCourse(id, { status: 'unlisted' })
  else if (body.action === 'archive') await deleteCourse(id)
  else if (body.action === 'restore') await restoreCourse(id)
  else await updateCourse(id, {
    title: body.title, description: body.description, categoryId: body.categoryId,
    requirements: body.requirements, whatYoullLearn: body.whatYoullLearn,
    courseType: body.courseType, includeInPlan: body.includeInPlan,
    regularPrice: body.regularPrice, salePrice: body.salePrice, saleEnds: body.saleEnds,
    status: body.status, sortOrder: body.sortOrder,
    googleTitle: body.googleTitle, googleDescription: body.googleDescription,
    seoKeywords: body.seoKeywords, shareImageUrl: body.shareImageUrl, publishAt: body.publishAt,
  })
  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session || !requireAdminRole(session, 'edit_courses').allowed) {
    return NextResponse.json({ error: 'Admin required' }, { status: 403 })
  }
  const { id } = await params
  await deleteCourse(id)
  return NextResponse.json({ ok: true })
}
