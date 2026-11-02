// Lesson route — deactivated until Phase 1 (CourseLessonRoute/CoursePlayer port).
// The old scaffold used an integer-`courses`/`lessons` demo model that no longer
// matches the reference data model (uuid ids, public_course_sections...). It had
// no consumers; it is rebuilt 1:1 from the reference in Phase 1.
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json(
    { error: 'Not implemented yet — Phase 1 (Course Player) ships this endpoint.' },
    { status: 501 },
  )
}

export async function PATCH() {
  return NextResponse.json(
    { error: 'Not implemented yet — Phase 1 (Course Player) ships this endpoint.' },
    { status: 501 },
  )
}
