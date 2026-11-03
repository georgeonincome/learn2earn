/**
 * Reading Lab server surface — mirrors the reference `reading_lab_*` tables.
 * Commitment-based guided reading: daily reading + reflections + habits +
 * weekly check-ins, with inactivity warnings (day 2/3/4/5) and certificate
 * on completion.
 */

import { one, run, all } from '@/lib/server/sql'
import { uuid } from '@/lib/server/ids'
import type { Row } from '@/lib/server/sql'

const now = () => Math.floor(Date.now() / 1000)

export type ReadingLab = Row & {
  id: string; title: string; book_name: string; author: string
  cover_image_url?: string; description: string; duration_days: number
  start_date: string; end_date: string; status: string
  is_enrollment_open: number; is_active: number; max_inactive_days: number
  warning_day_2: number; warning_day_3: number; warning_day_4: number
  enable_temp_lock: number; enable_removal: number
  created_at: string; updated_at: string; created_by?: string
}

export async function getReadingLab() {
  return one<ReadingLab>('SELECT * FROM reading_labs WHERE is_active = 1 LIMIT 1')
}

export type ReadingLabDay = Row & {
  id: string; reading_lab_id: string; day_number: number; title: string
  reading_assignment: string; thinking_prompts: string; created_at: string
}

export async function listReadingLabDays(labId: string) {
  return all<ReadingLabDay>(
    'SELECT * FROM reading_lab_days WHERE reading_lab_id = ? ORDER BY day_number ASC', [labId])
}

export type ReadingLabEnrollment = Row & {
  id: string; reading_lab_id: string; student_id: string; nickname: string
  status: string; current_day: number; last_active_date?: string
  completed_at?: string; consecutive_inactive_days: number
  joined_at: string; created_at: string; updated_at: string
}

export async function getLabEnrollment(labId: string, studentId: string) {
  return one<ReadingLabEnrollment>(
    'SELECT * FROM reading_lab_enrollments WHERE reading_lab_id = ? AND student_id = ? LIMIT 1',
    [labId, studentId])
}

export async function createLabEnrollment({
  labId, studentId, nickname,
}: { labId: string; studentId: string; nickname: string }) {
  const id = uuid()
  const ts = now()
  const today = new Date().toISOString().slice(0, 10)
  await run(
    `INSERT INTO reading_lab_enrollments
       (id, reading_lab_id, student_id, nickname, status, current_day,
        last_active_date, consecutive_inactive_days, joined_at, created_at, updated_at)
     VALUES (?, ?, ?, ?, 'active', 1, ?, 0, ?, datetime('now'), datetime('now'))`,
    [id, labId, studentId, nickname, today, today])
  return { id }
}

export type ReadingLabDayResponse = Row & {
  id: string; enrollment_id: string; student_id: string; day_number: number
  thinking_prompt: string; response: string; submitted_at: string; created_at: string
}

export async function submitDayResponse({
  enrollmentId, studentId, dayNumber, prompt, response,
}: { enrollmentId: string; studentId: string; dayNumber: number;
     prompt: string; response: string }) {
  const id = uuid()
  const ts = now()
  await run(
    `INSERT INTO reading_lab_day_responses
       (id, enrollment_id, student_id, day_number, thinking_prompt, response, submitted_at, created_at)
     VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
    [id, enrollmentId, studentId, dayNumber, prompt, response])
  await run(
    `UPDATE reading_lab_enrollments SET current_day = ?, last_active_date = ?,
       consecutive_inactive_days = 0, updated_at = datetime('now') WHERE id = ?`,
    [dayNumber, new Date().toISOString().slice(0, 10), enrollmentId])
  return { id }
}

export type ReadingLabReflection = Row & {
  id: string; enrollment_id: string; student_id: string; day_number: number
  key_lesson: string; reflection: string; apply_action: string
  submitted_at: string; created_at: string
}

export async function submitReflection({
  enrollmentId, studentId, dayNumber, keyLesson, reflection, applyAction,
}: { enrollmentId: string; studentId: string; dayNumber: number;
     keyLesson: string; reflection: string; applyAction: string }) {
  const id = uuid()
  await run(
    `INSERT INTO reading_lab_reflections
       (id, enrollment_id, student_id, day_number, key_lesson, reflection, apply_action, submitted_at, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
    [id, enrollmentId, studentId, dayNumber, keyLesson, reflection, applyAction])
  return { id }
}

export type ReadingLabHabit = Row & {
  id: string; reading_lab_id: string; title: string; description: string
  sort_order: number; created_at: string
}

export async function listLabHabits(labId: string) {
  return all<ReadingLabHabit>(
    'SELECT * FROM reading_lab_habits WHERE reading_lab_id = ? ORDER BY sort_order ASC', [labId])
}

export async function toggleStudentHabit({
  enrollmentId, habitId, active,
}: { enrollmentId: string; habitId: string; active: boolean }) {
  const id = uuid()
  await run(
    `INSERT OR REPLACE INTO reading_lab_student_habits (id, enrollment_id, habit_id, active, created_at)
     VALUES (?, ?, ?, ?, datetime('now'))`,
    [id, enrollmentId, habitId, active ? 1 : 0])
  return { id }
}

export async function listStudentHabits(enrollmentId: string) {
  return all(
    `SELECT h.*, s.active FROM reading_lab_habits h
     LEFT JOIN reading_lab_student_habits s ON s.habit_id = h.id AND s.enrollment_id = ?
     WHERE h.reading_lab_id = (SELECT reading_lab_id FROM reading_lab_enrollments WHERE id = ?)
     ORDER BY h.sort_order ASC`, [enrollmentId, enrollmentId])
}

export type ReadingLabHabitCheckin = Row & {
  id: string; enrollment_id: string; habit_id: string; student_id: string
  day_number: number; completed: number; checkin_date: string; created_at: string
}

export async function checkinHabit({
  enrollmentId, studentId, habitId, dayNumber, completed,
}: { enrollmentId: string; studentId: string; habitId: string;
     dayNumber: number; completed: boolean }) {
  const id = uuid()
  const today = new Date().toISOString().slice(0, 10)
  await run(
    `INSERT OR REPLACE INTO reading_lab_habit_checkins
       (id, enrollment_id, habit_id, student_id, day_number, completed, checkin_date, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
    [id, enrollmentId, habitId, studentId, dayNumber, completed ? 1 : 0, today])
  return { id }
}

export type ReadingLabWeeklySummary = Row & {
  id: string; enrollment_id: string; student_id: string; week_number: number
  lessons_learned: string; win: string; challenge_faced: string
  habit_implemented: string; submitted_at: string; created_at: string
}

export async function submitWeeklySummary({
  enrollmentId, studentId, weekNumber, lessonsLearned, win, challengeFaced, habitImplemented,
}: { enrollmentId: string; studentId: string; weekNumber: number;
     lessonsLearned: string; win: string; challengeFaced: string;
     habitImplemented: string }) {
  const id = uuid()
  await run(
    `INSERT INTO reading_lab_weekly_summaries
       (id, enrollment_id, student_id, week_number, lessons_learned, win,
        challenge_faced, habit_implemented, submitted_at, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
    [id, enrollmentId, studentId, weekNumber, lessonsLearned, win, challengeFaced, habitImplemented])
  return { id }
}

export type ReadingLabCertificate = Row & {
  id: string; enrollment_id: string; student_id: string; student_name: string
  reading_lab_title: string; book_name: string; duration_days: number
  days_completed: number; attendance_percentage: number
  reflections_submitted: number; habit_consistency_score: number
  certificate_number: string; certificate_data?: string; issue_date: string
  created_at: string
}

export async function issueLabCertificate({
  enrollmentId, studentId, studentName, labTitle, bookName, durationDays,
  daysCompleted, attendance, reflections, habitScore,
}: { enrollmentId: string; studentId: string; studentName: string;
     labTitle: string; bookName: string; durationDays: number;
     daysCompleted: number; attendance: number; reflections: number;
     habitScore: number }) {
  const id = uuid()
  const certNumber = `L2E-LAB-${String(studentId).slice(-6).toUpperCase()}`
  await run(
    `INSERT INTO reading_lab_certificates
       (id, enrollment_id, student_id, student_name, reading_lab_title, book_name,
        duration_days, days_completed, attendance_percentage, reflections_submitted,
        habit_consistency_score, certificate_number, issue_date, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
    [id, enrollmentId, studentId, studentName, labTitle, bookName, durationDays,
     daysCompleted, attendance, reflections, habitScore, certNumber,
     new Date().toISOString().slice(0, 10)])
  return { id, certificateNumber: certNumber }
}

export async function getLabCertificate(enrollmentId: string) {
  return one<ReadingLabCertificate>(
    'SELECT * FROM reading_lab_certificates WHERE enrollment_id = ? LIMIT 1', [enrollmentId])
}

// ------------------------------------------------------- chat + announcements

export type ReadingLabChatMessage = Row & {
  id: string; reading_lab_id: string; enrollment_id: string; sender: string
  sender_name: string; content: string; created_at: string
}

export async function sendLabMessage({
  labId, enrollmentId, sender, senderName, content,
}: { labId: string; enrollmentId: string; sender: string; senderName: string;
     content: string }) {
  const id = uuid()
  await run(
    `INSERT INTO reading_lab_chat_messages (id, reading_lab_id, enrollment_id, sender, sender_name, content, created_at)
     VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`,
    [id, labId, enrollmentId, sender, senderName, content])
  return { id }
}

export async function listLabMessages(labId: string, limit = 100) {
  return all(
    'SELECT * FROM reading_lab_chat_messages WHERE reading_lab_id = ? ORDER BY created_at ASC LIMIT ?',
    [labId, limit])
}

export type ReadingLabReaction = Row & {
  id: string; message_id: string; enrollment_id: string; sender: string
  reaction: string; created_at: string
}

export async function reactToMessage({
  messageId, enrollmentId, sender, reaction,
}: { messageId: string; enrollmentId: string; sender: string; reaction: string }) {
  const id = uuid()
  await run(
    `INSERT INTO reading_lab_chat_reactions (id, message_id, enrollment_id, sender, reaction, created_at)
     VALUES (?, ?, ?, ?, ?, datetime('now'))`,
    [id, messageId, enrollmentId, sender, reaction])
  return { id }
}

export type ReadingLabAnnouncement = Row & {
  id: string; reading_lab_id: string; title: string; message: string
  is_published: number; created_at: string
}

export async function listLabAnnouncements(labId: string) {
  return all<ReadingLabAnnouncement>(
    'SELECT * FROM reading_lab_announcements WHERE reading_lab_id = ? AND is_published = 1 ORDER BY created_at DESC',
    [labId])
}

export { now }
