// Lesson progress tracking — deactivated until Phase 1.
// The real implementation is ported 1:1 from CoursePlayer-C2icA96ky.js (lesson
// upsert shapes: `lesson_progress` {student_id, lesson_id, enrollment_id,
// completed, completed_at, last_position_seconds} on conflict (student_id,
// lesson_id)). Scaffold's old integer-user model was removed with the Phase 0
// data-model port (docs/parity/phase-0-foundation.md).
import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json(
    { error: 'Not implemented yet — Phase 1 (Course Player) ships this endpoint.' },
    { status: 501 },
  )
}
