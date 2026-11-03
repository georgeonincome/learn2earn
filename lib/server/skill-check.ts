/**
 * SkillCheck product server surface — reference `skill_checks`, `skill_check_attempts`,
 * `skill_check_credits`. Free taster → paid full check → Skill Report with QR
 * share link, score by topic, weakest topics, retake flow, member pricing.
 */

import { one, run, all } from '@/lib/server/sql'
import { uuid } from '@/lib/server/ids'
import type { Row } from '@/lib/server/sql'

const now = () => Math.floor(Date.now() / 1000)

export type SkillCheck = Row & {
  id: string; title: string; description: string; level_hint: string
  is_featured: number; is_free: number; price: number; member_price: number
  currency: string; retake_discount_pct: number; duration_minutes: number
  questions?: string; candidate_job_paths?: string; is_active: number
  created_at: string; updated_at: string
}

export async function listSkillChecks({ onlyActive = true }: { onlyActive?: boolean } = {}) {
  const sql = onlyActive
    ? 'SELECT * FROM skill_checks WHERE is_active = 1 ORDER BY is_free DESC, price ASC'
    : 'SELECT * FROM skill_checks ORDER BY is_free DESC, price ASC'
  return all<SkillCheck>(sql)
}

export async function getSkillCheck(id: string) {
  return one<SkillCheck>('SELECT * FROM skill_checks WHERE id = ? LIMIT 1', [id])
}

export async function createSkillCheck(fields: Partial<SkillCheck>) {
  const id = uuid()
  await run(
    `INSERT INTO skill_checks (id, title, description, level_hint, is_featured, is_free,
       price, member_price, currency, retake_discount_pct, duration_minutes,
       questions, candidate_job_paths, is_active, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, datetime('now'), datetime('now'))`,
    [id, fields.title, fields.description, fields.level_hint ?? 'All levels',
     fields.isFeatured ? 1 : 0, fields.isFree ? 1 : 0, fields.price ?? 0,
     fields.memberPrice ?? null, fields.currency ?? 'ZMW',
     fields.retakeDiscountPct ?? 0, fields.durationMinutes ?? 25,
     fields.questions ?? null, fields.candidateJobPaths ?? null])
  return { id }
}

export async function updateSkillCheck(id: string, fields: Partial<SkillCheck>) {
  const sets: string[] = []
  const args: unknown[] = []
  for (const [k, v] of Object.entries({
    title: fields.title, description: fields.description, level_hint: fields.levelHint,
    is_featured: fields.isFeatured !== undefined ? fields.isFeatured ? 1 : 0 : undefined,
    is_free: fields.isFree !== undefined ? fields.isFree ? 1 : 0 : undefined,
    price: fields.price, member_price: fields.memberPrice, currency: fields.currency,
    retake_discount_pct: fields.retakeDiscountPct, duration_minutes: fields.durationMinutes,
    questions: fields.questions, candidate_job_paths: fields.candidateJobPaths,
    is_active: fields.isActive !== undefined ? fields.isActive ? 1 : 0 : undefined,
  })) {
    if (v !== undefined) { sets.push(`${k} = ?`); args.push(v) }
  }
  if (!sets.length) return
  args.push(id)
  await run(`UPDATE skill_checks SET ${sets.join(', ')}, updated_at = datetime('now') WHERE id = ?`, args)
}

export type SkillCheckAttempt = Row & {
  id: string; skill_check_id: string; student_id: string; student_name: string
  student_email: string; status: string; answers?: string; score: number
  topic_scores?: string; weakest_topics?: string; is_free: number
  payment_reference?: string; amount_paid: number; currency: string
  start_time: string; submitted_at?: string; share_token?: string
  created_at: string
}

export async function startAttempt({
  skillCheckId, studentId, studentName, studentEmail, isFree,
}: { skillCheckId: string; studentId: string; studentName: string;
     studentEmail: string; isFree: boolean }) {
  const id = uuid()
  await run(
    `INSERT INTO skill_check_attempts
       (id, skill_check_id, student_id, student_name, student_email, status,
        score, is_free, amount_paid, currency, start_time, created_at)
     VALUES (?, ?, ?, ?, ?, 'started', 0, ?, 0, 'ZMW', datetime('now'), datetime('now'))`,
    [id, skillCheckId, studentId, studentName, studentEmail, isFree ? 1 : 0])
  return { id }
}

export async function submitAttempt({
  attemptId, answers, score, topicScores, weakestTopics,
}: { attemptId: string; answers: unknown; score: number;
     topicScores?: unknown; weakestTopics?: string }) {
  const id = uuid()
  const token = `${uuid()}${uuid()}`.replace(/-/g, '')
  await run(
    `UPDATE skill_check_attempts SET status = 'submitted', answers = ?, score = ?,
       topic_scores = ?, weakest_topics = ?, submitted_at = datetime('now'),
       share_token = ? WHERE id = ?`,
    [JSON.stringify(answers), score, JSON.stringify(topicScores ?? {}),
     weakestTopics ?? null, token, attemptId])
  return { id, shareToken: token }
}

export async function getAttempt(id: string) {
  return one<SkillCheckAttempt>(
    'SELECT * FROM skill_check_attempts WHERE id = ? LIMIT 1', [id])
}

export async function getAttemptByShareToken(token: string) {
  return one<SkillCheckAttempt>(
    'SELECT * FROM skill_check_attempts WHERE share_token = ? LIMIT 1', [token])
}

export async function listAttemptsByStudent(studentId: string) {
  return all<SkillCheckAttempt>(
    'SELECT * FROM skill_check_attempts WHERE student_id = ? ORDER BY created_at DESC', [studentId])
}

export async function creditAttempt({
  attemptId, paymentReference, amountPaid, currency,
}: { attemptId: string; paymentReference: string; amountPaid: number;
     currency: string }) {
  await run(
    `UPDATE skill_check_attempts SET payment_reference = ?, amount_paid = ?,
       currency = ?, status = 'paid' WHERE id = ?`,
    [paymentReference, amountPaid, currency, attemptId])
}

export type SkillCheckCredit = Row & {
  id: string; student_id: string; user_id?: string; skill_check_id: string
  amount: number; source: string; note?: string; created_at: string
}

export async function grantCredit({
  studentId, userId, skillCheckId, amount, source, note,
}: { studentId: string; userId?: string; skillCheckId?: string; amount: number;
     source: string; note?: string }) {
  const id = uuid()
  await run(
    `INSERT INTO skill_check_credits (id, student_id, user_id, skill_check_id, amount, source, note, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
    [id, studentId, userId ?? null, skillCheckId ?? null, amount, source, note ?? null])
  return { id }
}

export { now }
