/**
 * Course studio server surface — reference `admin_course_editor`: course
 * CRUD (draft/unlisted/published/archived), sections, lessons, resources,
 * lesson quizzes, final assessments. Mirrors courses / lessons /
 * course_lesson_quizzes / course_final_assessments tables.
 */

import { one, run, all } from '@/lib/server/sql'
import { uuid } from '@/lib/server/ids'
import type { Row } from '@/lib/server/sql'

const now = () => Math.floor(Date.now() / 1000)

export type Course = Row & {
  id: string; slug: string; title: string; description?: string
  category_id?: string; requirements?: string; what_youll_learn?: string
  course_type: string; include_in_plan: number; regular_price: number
  sale_price: number; sale_ends?: string; status: string
  sort_order: number; google_title?: string; google_description?: string
  seo_keywords?: string; share_image_url?: string; publish_at?: string
  created_at: string; updated_at: string
}

export async function listCourses({ status }: { status?: string } = {}) {
  if (status) {
    return all<Course>('SELECT * FROM courses WHERE status = ? ORDER BY sort_order ASC, created_at DESC', [status])
  }
  return all<Course>('SELECT * FROM courses ORDER BY sort_order ASC, created_at DESC')
}

export async function getCourse(id: string) {
  return one<Course>('SELECT * FROM courses WHERE id = ? LIMIT 1', [id])
}

export async function getCourseBySlug(slug: string) {
  return one<Course>('SELECT * FROM courses WHERE slug = ? LIMIT 1', [slug])
}

export async function createCourse(fields: Partial<Course>) {
  const id = uuid()
  const ts = new Date().toISOString()
  await run(
    `INSERT INTO courses (id, slug, title, description, category_id, requirements, what_youll_learn,
       course_type, include_in_plan, regular_price, sale_price, sale_ends, status,
       sort_order, google_title, google_description, seo_keywords, share_image_url,
       publish_at, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, fields.slug, fields.title, fields.description ?? null, fields.categoryId ?? null,
     fields.requirements ?? null, fields.whatYoullLearn ?? null, fields.courseType ?? 'self_paced',
     fields.includeInPlan ? 1 : 0, fields.regularPrice ?? 0, fields.salePrice ?? null,
     fields.saleEnds ?? null, fields.status ?? 'draft', fields.sortOrder ?? 0,
     fields.googleTitle ?? null, fields.googleDescription ?? null, fields.seoKeywords ?? null,
     fields.shareImageUrl ?? null, fields.publishAt ?? null, ts, ts])
  return { id }
}

export async function updateCourse(id: string, fields: Partial<Course>) {
  const sets: string[] = []
  const args: unknown[] = []
  const map: Record<string, unknown> = {
    slug: fields.slug, title: fields.title, description: fields.description,
    category_id: fields.categoryId, requirements: fields.requirements,
    what_youll_learn: fields.whatYoullLearn, course_type: fields.courseType,
    include_in_plan: fields.includeInPlan !== undefined ? fields.includeInPlan ? 1 : 0 : undefined,
    regular_price: fields.regularPrice, sale_price: fields.salePrice,
    sale_ends: fields.saleEnds, status: fields.status, sort_order: fields.sortOrder,
    google_title: fields.googleTitle, google_description: fields.googleDescription,
    seo_keywords: fields.seoKeywords, share_image_url: fields.shareImageUrl,
    publish_at: fields.publishAt, updated_at: new Date().toISOString(),
  }
  for (const [k, v] of Object.entries(map)) {
    if (v !== undefined) { sets.push(`${k} = ?`); args.push(v) }
  }
  if (!sets.length) return
  args.push(id)
  await run(`UPDATE courses SET ${sets.join(', ')} WHERE id = ?`, args)
}

export async function deleteCourse(id: string) {
  await run("UPDATE courses SET status = 'archived', updated_at = ? WHERE id = ?", [new Date().toISOString(), id])
}

export async function restoreCourse(id: string) {
  await run("UPDATE courses SET status = 'draft', updated_at = ? WHERE id = ?", [new Date().toISOString(), id])
}

// ---------------------------------------------------------------- sections --

export type Section = Row & {
  id: string; course_id: string; title: string; sort_order: number
  created_at: string
}

export async function listSections(courseId: string) {
  return all<Section>('SELECT * FROM course_sections WHERE course_id = ? ORDER BY sort_order ASC', [courseId])
}

export async function createSection(courseId: string, title: string) {
  const id = uuid()
  const max = await one<{ max: number }>('SELECT COALESCE(MAX(sort_order),0) AS max FROM course_sections WHERE course_id = ?', [courseId])
  await run('INSERT INTO course_sections (id, course_id, title, sort_order, created_at) VALUES (?, ?, ?, ?, datetime("now"))',
    [id, courseId, title, (max?.max ?? 0) + 1])
  return { id }
}

export async function updateSection(id: string, fields: { title?: string; sortOrder?: number }) {
  const sets: string[] = []; const args: unknown[] = []
  if (fields.title !== undefined) { sets.push('title = ?'); args.push(fields.title) }
  if (fields.sortOrder !== undefined) { sets.push('sort_order = ?'); args.push(fields.sortOrder) }
  if (!sets.length) return
  args.push(id)
  await run(`UPDATE course_sections SET ${sets.join(', ')} WHERE id = ?`, args)
}

export async function deleteSection(id: string) {
  await run('DELETE FROM course_sections WHERE id = ?', [id])
}

// ---------------------------------------------------------------- lessons ---

export type Lesson = Row & {
  id: string; course_id: string; section_id?: string; title: string
  lesson_order: number; video_url?: string; video_provider?: string
  duration_minutes: number; notes?: string; document_url?: string
  content?: string; is_preview: number; quiz_data?: string
  description?: string; learning_outcomes?: string; timestamps?: string
  seo_keywords?: string; admin_notes?: string; source_session_id?: string
  created_at: string; updated_at: string
}

export async function listLessons(courseId: string) {
  return all<Lesson>(
    'SELECT * FROM lessons WHERE course_id = ? ORDER BY lesson_order ASC, id ASC', [courseId])
}

export async function getLesson(id: string) {
  return one<Lesson>('SELECT * FROM lessons WHERE id = ? LIMIT 1', [id])
}

export async function createLesson(fields: Partial<Lesson>) {
  const id = uuid()
  const max = await one<{ max: number }>('SELECT COALESCE(MAX(lesson_order),0) AS max FROM lessons WHERE course_id = ?', [fields.courseId])
  await run(
    `INSERT INTO lessons (id, course_id, section_id, title, lesson_order, video_url, video_provider,
       duration_minutes, notes, document_url, content, is_preview, quiz_data, description,
       learning_outcomes, timestamps, seo_keywords, admin_notes, source_session_id, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
    [id, fields.courseId, fields.sectionId ?? null, fields.title, (max?.max ?? 0) + 1,
     fields.videoUrl ?? null, fields.videoProvider ?? null, fields.durationMinutes ?? 0,
     fields.notes ?? null, fields.documentUrl ?? null, fields.content ?? null,
     fields.isPreview ? 1 : 0, fields.quizData ?? null, fields.description ?? null,
     fields.learningOutcomes ?? null, fields.timestamps ?? null, fields.seoKeywords ?? null,
     fields.adminNotes ?? null, fields.sourceSessionId ?? null])
  return { id }
}

export async function updateLesson(id: string, fields: Partial<Lesson>) {
  const sets: string[] = []; const args: unknown[] = []
  const map: Record<string, unknown> = {
    section_id: fields.sectionId, title: fields.title, lesson_order: fields.lessonOrder,
    video_url: fields.videoUrl, video_provider: fields.videoProvider,
    duration_minutes: fields.durationMinutes, notes: fields.notes,
    document_url: fields.documentUrl, content: fields.content,
    is_preview: fields.isPreview !== undefined ? fields.isPreview ? 1 : 0 : undefined,
    quiz_data: fields.quizData, description: fields.description,
    learning_outcomes: fields.learningOutcomes, timestamps: fields.timestamps,
    seo_keywords: fields.seoKeywords, admin_notes: fields.adminNotes,
    source_session_id: fields.sourceSessionId, updated_at: new Date().toISOString(),
  }
  for (const [k, v] of Object.entries(map)) {
    if (v !== undefined) { sets.push(`${k} = ?`); args.push(v) }
  }
  if (!sets.length) return
  args.push(id)
  await run(`UPDATE lessons SET ${sets.join(', ')} WHERE id = ?`, args)
}

export async function deleteLesson(id: string) {
  await run('DELETE FROM lessons WHERE id = ?', [id])
}

// ----------------------------------------------------------- lesson quizzes --

export type LessonQuiz = Row & {
  id: string; lesson_id: string; title: string; type: string
  difficulty: string; pass_mark: number; time_limit_minutes?: number
  shuffle_questions: number; shuffle_options: number; show_results: number
  points: number; explanation?: string; questions: string
  is_published: number; created_at: string; updated_at: string
}

export async function getLessonQuiz(lessonId: string) {
  return one<LessonQuiz>(
    'SELECT * FROM course_lesson_quizzes WHERE lesson_id = ? LIMIT 1', [lessonId])
}

export async function upsertLessonQuiz({
  lessonId, title, type, difficulty, passMark, timeLimit,
  shuffleQuestions, shuffleOptions, showResults, points, explanation, questions, isPublished,
}: { lessonId: string; title?: string; type?: string; difficulty?: string;
     passMark?: number; timeLimit?: number; shuffleQuestions?: boolean;
     shuffleOptions?: boolean; showResults?: boolean; points?: number;
     explanation?: string; questions?: unknown; isPublished?: boolean }) {
  const existing = await getLessonQuiz(lessonId)
  const ts = new Date().toISOString()
  if (existing) {
    const sets: string[] = []; const args: unknown[] = []
    const map: Record<string, unknown> = {
      title, type, difficulty, pass_mark: passMark, time_limit_minutes: timeLimit,
      shuffle_questions: shuffleQuestions !== undefined ? shuffleQuestions ? 1 : 0 : undefined,
      shuffle_options: shuffleOptions !== undefined ? shuffleOptions ? 1 : 0 : undefined,
      show_results: showResults !== undefined ? showResults ? 1 : 0 : undefined,
      points, explanation, questions: questions !== undefined ? JSON.stringify(questions) : undefined,
      is_published: isPublished !== undefined ? isPublished ? 1 : 0 : undefined,
      updated_at: ts,
    }
    for (const [k, v] of Object.entries(map)) {
      if (v !== undefined) { sets.push(`${k} = ?`); args.push(v) }
    }
    args.push(existing.id)
    await run(`UPDATE course_lesson_quizzes SET ${sets.join(', ')} WHERE id = ?`, args)
    return { id: existing.id }
  }
  const id = uuid()
  await run(
    `INSERT INTO course_lesson_quizzes
       (id, lesson_id, title, type, difficulty, pass_mark, time_limit_minutes,
        shuffle_questions, shuffle_options, show_results, points, explanation,
        questions, is_published, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
    [id, lessonId, title ?? 'Lesson Quiz', type ?? 'single', difficulty ?? 'easy',
     passMark ?? 70, timeLimit ?? null, 1, 1, 1, points ?? 10, explanation ?? null,
     questions !== undefined ? JSON.stringify(questions) : '[]', isPublished ? 1 : 0])
  return { id }
}

export async function deleteLessonQuiz(lessonId: string) {
  await run('DELETE FROM course_lesson_quizzes WHERE lesson_id = ?', [lessonId])
}

// ------------------------------------------------------- final assessments ---

export type FinalAssessment = Row & {
  id: string; course_id: string; title: string; description?: string
  questions: string; total_questions: number; passing_score: number
  retake_fee_kes: number; show_results_immediately: number
  shuffle_questions: number; shuffle_options: number; time_limit_minutes?: number
  is_published: number; created_at: string; updated_at: string
}

export async function getFinalAssessment(courseId: string) {
  return one<FinalAssessment>(
    'SELECT * FROM course_final_assessments WHERE course_id = ? LIMIT 1', [courseId])
}

export async function upsertFinalAssessment({
  courseId, title, description, questions, totalQuestions, passingScore,
  retakeFeeKes, showResults, shuffleQuestions, shuffleOptions, timeLimit, isPublished,
}: { courseId: string; title?: string; description?: string; questions?: unknown;
     totalQuestions?: number; passingScore?: number; retakeFeeKes?: number;
     showResults?: boolean; shuffleQuestions?: boolean; shuffleOptions?: boolean;
     timeLimit?: number; isPublished?: boolean }) {
  const existing = await getFinalAssessment(courseId)
  const ts = new Date().toISOString()
  if (existing) {
    const sets: string[] = []; const args: unknown[] = []
    const map: Record<string, unknown> = {
      title, description, total_questions: totalQuestions, passing_score: passingScore,
      retake_fee_kes: retakeFeeKes,
      show_results_immediately: showResults !== undefined ? showResults ? 1 : 0 : undefined,
      shuffle_questions: shuffleQuestions !== undefined ? shuffleQuestions ? 1 : 0 : undefined,
      shuffle_options: shuffleOptions !== undefined ? shuffleOptions ? 1 : 0 : undefined,
      time_limit_minutes: timeLimit,
      is_published: isPublished !== undefined ? isPublished ? 1 : 0 : undefined,
      updated_at: ts,
    }
    if (questions !== undefined) { sets.push('questions = ?'); args.push(JSON.stringify(questions)) }
    for (const [k, v] of Object.entries(map)) {
      if (v !== undefined) { sets.push(`${k} = ?`); args.push(v) }
    }
    args.push(existing.id)
    await run(`UPDATE course_final_assessments SET ${sets.join(', ')} WHERE id = ?`, args)
    return { id: existing.id }
  }
  const id = uuid()
  await run(
    `INSERT INTO course_final_assessments
       (id, course_id, title, description, questions, total_questions, passing_score,
        retake_fee_kes, show_results_immediately, shuffle_questions, shuffle_options,
        time_limit_minutes, is_published, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
    [id, courseId, title ?? 'Final Assessment', description ?? null,
     questions !== undefined ? JSON.stringify(questions) : '[]',
     totalQuestions ?? 0, passingScore ?? 70, retakeFeeKes ?? 0,
     showResults ? 1 : 0, 1, 1, timeLimit ?? null, isPublished ? 1 : 0])
  return { id }
}

export async function deleteFinalAssessment(courseId: string) {
  await run('DELETE FROM course_final_assessments WHERE course_id = ?', [courseId])
}

export { now }
