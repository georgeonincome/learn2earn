/**
 * 5AM Challenge server surface — mirrors the reference `am_challenge_*`
 * tables exactly. Commitment model: check in each day (05:00-09:00 Lusaka),
 * miss two days in a row and you're out; streak + daily score feed the
 * certificate at day 21 + Day-10 checkpoint.
 */

import { one, run, all } from '@/lib/server/sql'
import { uuid } from '@/lib/server/ids'
import type { Row } from '@/lib/server/sql'

const now = () => Math.floor(Date.now() / 1000)

export type Challenge = Row & {
  id: string; title: string; subtitle: string; description: string
  start_date: string; duration_days: number; price: number; currency: string
  access_start_time: string; access_end_time: string; timezone: string
  min_days_for_certificate: number; passing_grade: number
  is_active: number; allow_replays: number; created_at: string; updated_at: string
}

export async function getChallenge() {
  return one<Challenge>('SELECT * FROM am_challenge WHERE is_active = 1 LIMIT 1')
}

export type ChallengeDay = Row & {
  id: string; challenge_id: string; day_number: number; title: string
  description?: string; video_url?: string; video_provider?: string
  duration_minutes: number; quiz_questions?: string; notes?: string
  is_active: number; created_at: string
}

export async function listChallengeDays(challengeId: string) {
  return all<ChallengeDay>(
    'SELECT * FROM am_challenge_days WHERE challenge_id = ? AND is_active = 1 ORDER BY day_number ASC',
    [challengeId])
}

export async function getChallengeDay(challengeId: string, dayNumber: number) {
  return one<ChallengeDay>(
    'SELECT * FROM am_challenge_days WHERE challenge_id = ? AND day_number = ? LIMIT 1',
    [challengeId, dayNumber])
}

export type ChallengeEnrollment = Row & {
  id: string; challenge_id: string; student_id: string; student_name: string
  student_email: string; phone?: string; payment_reference?: string
  amount_paid: number; currency: string; payment_method: string
  payment_status: string; enrolled_at: string; current_streak: number
  best_streak: number; days_completed: number; last_checkin_date?: string
  total_daily_score: number; final_quiz_score?: number
  certificate_issued: number; certificate_issued_at?: string
  created_at: string; updated_at: string
}

export async function getEnrollment(challengeId: string, studentId: string) {
  return one<ChallengeEnrollment>(
    'SELECT * FROM am_challenge_enrollments WHERE challenge_id = ? AND student_id = ? LIMIT 1',
    [challengeId, studentId])
}

export async function createEnrollment({
  challengeId, studentId, studentName, studentEmail, phone, amount,
  paymentReference, paymentMethod, paymentStatus,
}: { challengeId: string; studentId: string; studentName: string;
     studentEmail: string; phone?: string; amount: number;
     paymentReference?: string; paymentMethod?: string; paymentStatus?: string }) {
  const id = uuid()
  const ts = now()
  await run(
    `INSERT INTO am_challenge_enrollments
       (id, challenge_id, student_id, student_name, student_email, phone,
        amount_paid, currency, payment_method, payment_status, enrolled_at,
        current_streak, best_streak, days_completed, total_daily_score,
        certificate_issued, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'ZMW', ?, ?, ?, 0, 0, 0, 0, 0, ?, ?)`,
    [id, challengeId, studentId, studentName, studentEmail, phone ?? null,
     amount, paymentMethod ?? 'flutterwave', paymentStatus ?? 'paid', ts, ts])
  return { id }
}

export type ChallengeCheckin = Row & {
  id: string; challenge_id: string; enrollment_id: string; student_id: string
  checkin_date: string; day_number: number; notes?: string
  points_earned: number; created_at: string
}

export async function createCheckin({
  enrollmentId, studentId, challengeId, dayNumber, notes,
}: { enrollmentId: string; studentId: string; challengeId: string;
     dayNumber: number; notes?: string }) {
  const id = uuid()
  const ts = now()
  const today = new Date().toISOString().slice(0, 10)
  await run(
    `INSERT INTO am_challenge_checkins
       (id, challenge_id, enrollment_id, student_id, checkin_date, day_number, notes, points_earned, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, 10, ?)`,
    [id, challengeId, enrollmentId, studentId, today, dayNumber, notes ?? null, ts])

  const enr = await one<ChallengeEnrollment>(
    'SELECT * FROM am_challenge_enrollments WHERE id = ? LIMIT 1', [enrollmentId])
  if (!enr) return { id }

  const lastCheckin = enr.last_checkin_date ? new Date(enr.last_checkin_date) : null
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  yesterday.setHours(0, 0, 0, 0)
  const streak = lastCheckin && lastCheckin.getTime() >= yesterday.getTime()
    ? enr.current_streak + 1 : 1
  const daysCompleted = enr.days_completed + 1
  await run(
    `UPDATE am_challenge_enrollments SET last_checkin_date = ?, current_streak = ?, best_streak = ?,
       days_completed = ?, total_daily_score = total_daily_score + 10, updated_at = ?
     WHERE id = ?`,
    [today, streak, Math.max(enr.best_streak, streak), daysCompleted, ts, enrollmentId])
  return { id, streak, daysCompleted }
}

export type ChallengeProgress = Row & {
  id: string; enrollment_id: string; student_id: string; day_id: string
  lesson_completed: number; lesson_completed_at?: string; notes?: string
  quiz_answers?: string; quiz_completed: number; quiz_completed_at?: string
  quiz_score?: number; created_at: string
}

export async function upsertProgress({
  enrollmentId, studentId, dayId, lessonCompleted, notes,
}: { enrollmentId: string; studentId: string; dayId: string;
     lessonCompleted: boolean; notes?: string }) {
  const id = uuid()
  const ts = now()
  const existing = await one<ChallengeProgress>(
    'SELECT * FROM am_challenge_progress WHERE enrollment_id = ? AND day_id = ? LIMIT 1',
    [enrollmentId, dayId])
  if (existing) {
    await run(
      `UPDATE am_challenge_progress SET lesson_completed = ?,
         lesson_completed_at = CASE WHEN ? = 1 THEN datetime('now') ELSE lesson_completed_at END,
         notes = ?, updated_at = ? WHERE id = ?`,
      [lessonCompleted ? 1 : 0, lessonCompleted ? 1 : 0, notes ?? null, ts, existing.id])
    return { id: existing.id }
  }
  await run(
    `INSERT INTO am_challenge_progress
       (id, enrollment_id, student_id, day_id, lesson_completed,
        lesson_completed_at, notes, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
    [id, enrollmentId, studentId, dayId, lessonCompleted ? 1 : 0,
     lessonCompleted ? 1 : 0, notes ?? null])
  return { id }
}

export async function recordQuiz({
  enrollmentId, studentId, dayId, answers, score, completed,
}: { enrollmentId: string; studentId: string; dayId: string;
     answers: unknown; score: number; completed: boolean }) {
  const id = uuid()
  const ts = now()
  const existing = await one<ChallengeProgress>(
    'SELECT * FROM am_challenge_progress WHERE enrollment_id = ? AND day_id = ? LIMIT 1',
    [enrollmentId, dayId])
  if (existing) {
    await run(
      `UPDATE am_challenge_progress SET quiz_answers = ?, quiz_score = ?,
         quiz_completed = ?, quiz_completed_at = datetime('now'), updated_at = ?
       WHERE id = ?`,
      [JSON.stringify(answers), score, completed ? 1 : 0, ts, existing.id])
    return { id: existing.id }
  }
  await run(
    `INSERT INTO am_challenge_progress
       (id, enrollment_id, student_id, day_id, quiz_answers, quiz_score,
        quiz_completed, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
    [id, enrollmentId, studentId, dayId, JSON.stringify(answers), score, completed ? 1 : 0])
  return { id }
}

export async function getProgress(enrollmentId: string, dayId: string) {
  return one<ChallengeProgress>(
    'SELECT * FROM am_challenge_progress WHERE enrollment_id = ? AND day_id = ? LIMIT 1',
    [enrollmentId, dayId])
}

// ------------------------------------------- final assessment + certificate --

export type ChallengeCertificate = Row & {
  id: string; enrollment_id: string; student_id: string
  certificate_number: string; student_name: string; challenge_year: number
  issue_date: string; certificate_data?: string; created_at: string
}

export async function issueCertificate({
  enrollmentId, studentId, studentName, year,
}: { enrollmentId: string; studentId: string; studentName: string; year: number }) {
  const id = uuid()
  const certNumber = `L2E-5AM-${year}-${String(studentId).slice(-6).toUpperCase()}`
  const issueDate = new Date().toISOString().slice(0, 10)
  await run(
    `INSERT INTO am_challenge_certificates
       (id, enrollment_id, student_id, certificate_number, student_name, challenge_year, issue_date, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
    [id, enrollmentId, studentId, certNumber, studentName, year, issueDate])
  await run(
    'UPDATE am_challenge_enrollments SET certificate_issued = 1, certificate_issued_at = datetime(\'now\'), updated_at = datetime(\'now\') WHERE id = ?',
    [enrollmentId])
  return { id, certificateNumber: certNumber, issueDate }
}

export async function getCertificate(enrollmentId: string) {
  return one<ChallengeCertificate>(
    'SELECT * FROM am_challenge_certificates WHERE enrollment_id = ? LIMIT 1', [enrollmentId])
}

export type ChallengeFinalConfig = Row & {
  id: string; challenge_id: string; title: string; description: string
  questions: string; total_questions: number; passing_grade: number
  time_limit_minutes: number; assessment_date?: string; timezone: string
  is_active: number; created_at: string; updated_at: string
}

export async function getFinalAssessmentConfig(challengeId: string) {
  return one<ChallengeFinalConfig>(
    'SELECT * FROM am_challenge_final_assessment_config WHERE challenge_id = ? AND is_active = 1 LIMIT 1',
    [challengeId])
}

export type ChallengeFinalAttempt = Row & {
  id: string; assessment_config_id: string; challenge_id: string
  enrollment_id: string; student_id: string; score: number; answers?: string
  passed: number; submitted_at: string; timezone: string; user_agent?: string
}

export async function submitFinalAttempt({
  configId, challengeId, enrollmentId, studentId, score, answers, passed, timezone, userAgent,
}: { configId: string; challengeId: string; enrollmentId: string; studentId: string;
     score: number; answers: unknown; passed: boolean; timezone: string; userAgent?: string }) {
  const id = uuid()
  await run(
    `INSERT INTO am_challenge_final_assessment_attempts
       (id, assessment_config_id, challenge_id, enrollment_id, student_id, score,
        answers, passed, submitted_at, timezone, user_agent)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), ?, ?)`,
    [id, configId, challengeId, enrollmentId, studentId, score,
     JSON.stringify(answers), passed ? 1 : 0, timezone, userAgent ?? null])
  return { id }
}

export { now }
