// Course / lesson access — used by the lesson page route and CoursePlayer.
// Replaces the old static COURSE_LESSONS / COURSE_SKILL_CHECKS data.
// All queries are over the reference schema: courses + course_sections + lessons.
import { one, all, run } from './sql'
import type { Row } from './sql'

export async function getCourseBySlug(slug: string): Promise<Row | null> {
  return one<Row>('SELECT * FROM courses WHERE slug = ? AND deleted_at IS NULL LIMIT 1', [slug])
}

export async function getCourseByIdOrSlug(idOrSlug: string): Promise<Row | null> {
  let row = await getCourseBySlug(idOrSlug)
  if (!row && /^[0-9a-f-]{36}$/i.test(idOrSlug)) {
    row = await one<Row>('SELECT * FROM courses WHERE id = ? AND deleted_at IS NULL LIMIT 1', [idOrSlug])
  }
  return row
}

export async function getSectionsForCourse(courseId: string): Promise<Row[]> {
  return all('SELECT * FROM course_sections WHERE course_id = ? ORDER BY section_order ASC', [courseId])
}

export async function getLessonsForCourse(courseId: string): Promise<Row[]> {
  return all(
    `SELECT * FROM lessons WHERE course_id = ? AND deleted_at IS NULL ORDER BY lesson_order ASC`,
    [courseId],
  )
}

export async function getLessonsForCourseGrouped(courseId: string): Promise<{ section: Row | null; lessons: Row[] }[]> {
  const sections = await getSectionsForCourse(courseId)
  const lessons = await getLessonsForCourse(courseId)
  if (sections.length === 0) return [{ section: null, lessons }]
  const secMap = new Map<string, Row[]>()
  for (const l of lessons) {
    const sid = String(l.section_id ?? '_none')
    if (!secMap.has(sid)) secMap.set(sid, [])
    secMap.get(sid)!.push(l)
  }
  const out: { section: Row | null; lessons: Row[] }[] = []
  for (const s of sections) {
    const sid = String(s.id)
    out.push({ section: s, lessons: secMap.get(sid) ?? [] })
  }
  const orphan = secMap.get('_none')
  if (orphan && orphan.length > 0) out.push({ section: null, lessons: orphan })
  return out
}

export async function getLessonById(lessonId: string): Promise<Row | null> {
  return one<Row>('SELECT * FROM lessons WHERE id = ? AND deleted_at IS NULL LIMIT 1', [lessonId])
}

export async function getQuizForLesson(lessonId: string): Promise<Row | null> {
  return one<Row>(
    'SELECT * FROM course_lesson_quizzes WHERE lesson_id = ? AND is_published = 1 LIMIT 1',
    [lessonId],
  )
}

export async function countPublishedLessons(courseId: string): Promise<number> {
  const rows = await all<{ n: number }>(
    'SELECT COUNT(*) AS n FROM lessons WHERE course_id = ? AND deleted_at IS NULL',
    [courseId],
  )
  return Number(rows[0]?.n ?? 0)
}
