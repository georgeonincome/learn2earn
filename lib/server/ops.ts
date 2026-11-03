/**
 * Operational surface — tickets, announcements, review requests, assignments,
 * messages. Mirrors the Click2Skill reference tables exactly.
 *
 * Timestamps are stored as unixepoch seconds to match the rest of the port.
 */

import { one, run, all, batch } from '@/lib/server/sql'
import { uuid } from '@/lib/server/ids'
import type { Row } from '@/lib/server/sql'

const now = () => Math.floor(Date.now() / 1000)

// ---------------------------------------------------------------- tickets ---

export type Ticket = Row & {
  id: string; student_id: string; student_name: string; student_email: string
  subject: string; category: string; message: string; status: string
  is_read: number; created_at: number; updated_at: number
}

export async function listTickets() {
  return all<Ticket>(
    'SELECT * FROM tickets ORDER BY created_at DESC')
}

export async function getTicket(id: string) {
  return one<Ticket>('SELECT * FROM tickets WHERE id = ? LIMIT 1', [id])
}

export async function createTicket({
  studentId, studentName, studentEmail, subject, category, message,
}: { studentId: string; studentName: string; studentEmail: string;
     subject: string; category: string; message: string }) {
  const id = uuid()
  const ts = now()
  await run(
    `INSERT INTO tickets (id, student_id, student_name, student_email, subject, category, message, status, is_read, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'open', 0, ?, ?)`,
    [id, studentId, studentName, studentEmail, subject, category, message, ts, ts])
  return { id }
}

export async function addTicketMessage({
  ticketId, senderId, senderRole, senderName, message, attachmentUrl,
}: { ticketId: string; senderId: string; senderRole: string;
     senderName: string; message: string; attachmentUrl?: string }) {
  const id = uuid()
  const ts = now()
  await run(
    `INSERT INTO ticket_messages (id, ticket_id, sender_id, sender_role, sender_name, message, attachment_url, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, ticketId, senderId, senderRole, senderName, message, attachmentUrl ?? null, ts])
  await run('UPDATE tickets SET updated_at = ?, is_read = 0 WHERE id = ?', [ts, ticketId])
  return { id }
}

export async function listTicketMessages(ticketId: string) {
  return all(
    'SELECT * FROM ticket_messages WHERE ticket_id = ? ORDER BY created_at ASC', [ticketId])
}

export async function setTicketStatus(id: string, status: string) {
  await run('UPDATE tickets SET status = ?, updated_at = ? WHERE id = ?', [status, now(), id])
}

// ----------------------------------------------------------- announcements --

export type Announcement = Row & {
  id: string; title: string; message: string; content?: string; target_type: string
  target_course_id?: string; target_cohort_id?: string; scheduled_publish_date?: string
  is_published: number; audience_type: string; visibility_status: string
  published_at?: string; enable_notifications: number; views_count: number
  attachments?: string; author_id?: string; created_at: string; updated_at: string
}

export async function listAnnouncements({ publishedOnly = false }: { publishedOnly?: boolean } = {}) {
  const sql = publishedOnly
    ? `SELECT * FROM announcements WHERE is_published = 1
         AND (scheduled_publish_date IS NULL OR scheduled_publish_date <= datetime('now'))
         ORDER BY created_at DESC`
    : 'SELECT * FROM announcements ORDER BY created_at DESC'
  return all<Announcement>(sql)
}

export async function getAnnouncement(id: string) {
  return one<Announcement>('SELECT * FROM announcements WHERE id = ? LIMIT 1', [id])
}

export async function createAnnouncement(fields: Partial<Announcement>) {
  const id = uuid()
  const ts = new Date().toISOString()
  await run(
    `INSERT INTO announcements (id, title, message, content, target_type, target_course_id, target_cohort_id,
       scheduled_publish_date, is_published, audience_type, visibility_status, published_at,
       enable_notifications, views_count, attachments, author_id, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?)`,
    [id, fields.title, fields.message, fields.content ?? null, fields.target_type ?? 'all',
     fields.target_course_id ?? null, fields.target_cohort_id ?? null, fields.scheduled_publish_date ?? null,
     fields.is_published ? 1 : 0, fields.audience_type ?? 'everyone', fields.visibility_status ?? 'published',
     fields.is_published ? ts : null, fields.enable_notifications ? 1 : 0,
     fields.attachments ?? null, fields.author_id ?? null, ts, ts])
  await run('UPDATE announcements SET views_count = views_count + 1 WHERE id = ?', [id])
  return { id }
}

export async function recordAnnouncementView(announcementId: string, studentId: string) {
  await run(
    `INSERT OR IGNORE INTO announcement_views (id, student_id, announcement_id, viewed_at, acknowledged)
     VALUES (?, ?, ?, ?, 0)`,
    [uuid(), studentId, announcementId, now()])
  await run('UPDATE announcements SET views_count = views_count + 1 WHERE id = ?', [announcementId])
}

export async function listAnnouncementViews(announcementId: string) {
  return all('SELECT * FROM announcement_views WHERE announcement_id = ? ORDER BY viewed_at DESC', [announcementId])
}

// -------------------------------------------------------- review requests ---

export type ReviewRequest = Row & {
  id: string; student_id: string; student_email: string; student_name: string
  item_type: string; item_id: string; item_title: string; token: string
  status: string; snoozed_until?: string; created_at: string; sent_at?: string
}

export async function createReviewRequest({
  studentId, studentEmail, studentName, itemType, itemId, itemTitle,
}: { studentId: string; studentEmail: string; studentName: string;
     itemType: string; itemId: string; itemTitle: string }) {
  const id = uuid()
  const token = `${uuid()}${uuid()}`.replace(/-/g, '')
  const ts = new Date().toISOString()
  await run(
    `INSERT INTO review_requests (id, student_id, student_email, student_name, item_type, item_id, item_title, token, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
    [id, studentId, studentEmail, studentName, itemType, itemId, itemTitle, token, ts])
  return { id, token }
}

export async function getReviewRequestByToken(token: string) {
  return one<ReviewRequest>('SELECT * FROM review_requests WHERE token = ? LIMIT 1', [token])
}

export async function updateReviewRequest(token: string, fields: { status?: string; snoozed_until?: string }) {
  const sets: string[] = []
  const args: unknown[] = []
  if (fields.status !== undefined) { sets.push('status = ?'); args.push(fields.status) }
  if (fields.snoozed_until !== undefined) { sets.push('snoozed_until = ?'); args.push(fields.snoozed_until) }
  if (!sets.length) return
  args.push(token)
  await run(`UPDATE review_requests SET ${sets.join(', ')} WHERE token = ?`, args)
}

// -------------------------------------------------------- assignments -------

export type Assignment = Row & {
  id: string; course_id: string; cohort_id?: string; title: string
  description?: string; due_date?: string; weight: number; is_active: number
  created_at: string
}

export async function listAssignments({ courseId }: { courseId?: string } = {}) {
  if (courseId) {
    return all<Assignment>(
      'SELECT * FROM assignments WHERE course_id = ? AND is_active = 1 ORDER BY due_date ASC', [courseId])
  }
  return all<Assignment>('SELECT * FROM assignments WHERE is_active = 1 ORDER BY created_at DESC')
}

export async function createAssignment(fields: Partial<Assignment>) {
  const id = uuid()
  await run(
    `INSERT INTO assignments (id, course_id, cohort_id, title, description, due_date, weight, is_active, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, 1, datetime('now'))`,
    [id, fields.courseId, fields.cohortId ?? null, fields.title, fields.description ?? null,
     fields.dueDate ?? null, fields.weight ?? 1])
  return { id }
}

export type AssignmentSubmission = Row & {
  id: string; assignment_id: string; student_id: string; submission_file_url?: string
  submission_text?: string; ink?: string; note?: string; status: string
  declared: number; feedback?: string; reviewed_by?: string; submitted_at?: string
  created_at: string
}

export async function submitAssignment({
  assignmentId, studentId, submissionText, submissionFileUrl, note,
}: { assignmentId: string; studentId: string; submissionText?: string;
     submissionFileUrl?: string; note?: string }) {
  const id = uuid()
  await run(
    `INSERT INTO assignment_submissions (id, assignment_id, student_id, submission_text, submission_file_url, note,
       status, declared, created_at)
     VALUES (?, ?, ?, ?, ?, ?, 'submitted', 0, datetime('now'))`,
    [id, assignmentId, studentId, submissionText ?? null, submissionFileUrl ?? null, note ?? null])
  return { id }
}

export async function listAssignmentSubmissions(assignmentId: string) {
  return all<AssignmentSubmission>(
    'SELECT * FROM assignment_submissions WHERE assignment_id = ? ORDER BY created_at DESC', [assignmentId])
}

// ------------------------------------------------------------ messages ------

export type Message = Row & {
  id: string; sender_id: string; sender_role: string; receiver_id: string
  subject: string; content: string; attachment_url?: string; status: string
  created_at: string
}

export async function listMessages({ receiverId }: { receiverId?: string } = {}) {
  if (receiverId) {
    return all<Message>(
      'SELECT * FROM messages WHERE receiver_id = ? ORDER BY created_at DESC', [receiverId])
  }
  return all<Message>('SELECT * FROM messages ORDER BY created_at DESC')
}

export async function sendMessage({
  senderId, senderRole, receiverId, subject, content, attachmentUrl,
}: { senderId: string; senderRole: string; receiverId: string; subject: string;
     content: string; attachmentUrl?: string }) {
  const id = uuid()
  await run(
    `INSERT INTO messages (id, sender_id, sender_role, receiver_id, subject, content, attachment_url, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'delivered', datetime('now'))`,
    [id, senderId, senderRole, receiverId, subject, content, attachmentUrl ?? null])
  return { id }
}

export async function markMessageRead(id: string) {
  await run("UPDATE messages SET status = 'read' WHERE id = ?", [id])
}

export { now }
