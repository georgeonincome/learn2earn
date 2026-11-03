/**
 * Transcripts server surface — reference `transcripts`, `cohort_transcripts`.
 * A record of every lesson taken and quiz score, with a shareable link.
 */

import { one, run, all } from '@/lib/server/sql'
import { uuid } from '@/lib/server/ids'
import type { Row } from '@/lib/server/sql'

const now = () => Math.floor(Date.now() / 1000)

export type Transcript = Row & {
  id: string; student_id: string; student_name: string; item_type: string
  item_id: string; item_title: string; lessons_total: number
  lessons_completed: number; quiz_average: number; certificate_number?: string
  items: string; share_token?: string; issued_at?: string; created_at: string
}

export async function listTranscripts(studentId: string) {
  return all<Transcript>(
    'SELECT * FROM transcripts WHERE student_id = ? ORDER BY created_at DESC', [studentId])
}

export async function getTranscript(id: string) {
  return one<Transcript>('SELECT * FROM transcripts WHERE id = ? LIMIT 1', [id])
}

export async function getTranscriptByShareToken(token: string) {
  return one<Transcript>('SELECT * FROM transcripts WHERE share_token = ? LIMIT 1', [token])
}

export async function upsertTranscript({
  studentId, studentName, itemType, itemId, itemTitle, lessonsTotal,
  lessonsCompleted, quizAverage, items, certificateNumber,
}: { studentId: string; studentName: string; itemType: string;
     itemId: string; itemTitle: string; lessonsTotal: number;
     lessonsCompleted: number; quizAverage: number; items: unknown;
     certificateNumber?: string }) {
  const existing = await one<Transcript>(
    'SELECT * FROM transcripts WHERE student_id = ? AND item_type = ? AND item_id = ? LIMIT 1',
    [studentId, itemType, itemId])
  const ts = new Date().toISOString()
  if (existing) {
    await run(
      `UPDATE transcripts SET lessons_total = ?, lessons_completed = ?,
         quiz_average = ?, items = ?, updated_at = ? WHERE id = ?`,
      [lessonsTotal, lessonsCompleted, quizAverage, JSON.stringify(items), ts, existing.id])
    return { id: existing.id, shareToken: existing.share_token }
  }
  const id = uuid()
  const shareToken = `${uuid()}${uuid()}`.replace(/-/g, '')
  await run(
    `INSERT INTO transcripts
       (id, student_id, student_name, item_type, item_id, item_title, lessons_total,
        lessons_completed, quiz_average, items, certificate_number, share_token,
        issued_at, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
    [id, studentId, studentName, itemType, itemId, itemTitle, lessonsTotal,
     lessonsCompleted, quizAverage, JSON.stringify(items),
     certificateNumber ?? null, shareToken])
  return { id, shareToken }
}

export async function issueTranscriptCertificate(transcriptId: string, certificateNumber: string) {
  await run('UPDATE transcripts SET certificate_number = ?, issued_at = datetime("now") WHERE id = ?',
    [certificateNumber, transcriptId])
}

export { now }
