// Students — reference `students` table access.
// Reference call pattern (every chunk): resolve the auth user, then
// `students.select(...).eq("user_id", user.id).maybeSingle()`.
import { one, run } from './sql'
import { uuid } from './ids'

export type StudentRow = {
  id: string
  user_id: string | null
  email: string | null
  full_name: string | null
  avatar_url: string | null
  created_at: number | null
  updated_at: number | null
}

export function getStudentByUserId(userId: string): Promise<StudentRow | null> {
  return one<StudentRow>(
    'SELECT * FROM students WHERE user_id = ? LIMIT 1',
    [userId],
  )
}

export async function getStudentById(id: string): Promise<StudentRow | null> {
  return one<StudentRow>('SELECT * FROM students WHERE id = ? LIMIT 1', [id])
}

/**
 * The reference `Auth` chunk creates the student profile at signup:
 *   `.from("students").insert({...m, user_id: l.id, email: l.email ?? ""})`
 * (full_name filled in from signup metadata; later updated by
 * `subscription-profile` action:"name").
 */
export async function upsertStudentForUser({
  userId,
  email,
  fullName,
}: {
  userId: string
  email: string
  fullName?: string | null
}): Promise<StudentRow> {
  const existing = await getStudentByUserId(userId)
  if (existing) {
    if (
      (fullName && existing.full_name !== fullName) ||
      (email && existing.email !== email)
    ) {
      await run(
        'UPDATE students SET full_name = COALESCE(?, full_name), email = COALESCE(?, email), updated_at = unixepoch() WHERE id = ?',
        [fullName ?? null, email ?? null, existing.id],
      )
      return { ...existing, full_name: fullName ?? existing.full_name, email: email ?? existing.email }
    }
    return existing
  }
  const id = uuid()
  await run(
    'INSERT INTO students (id, user_id, email, full_name) VALUES (?, ?, ?, ?)',
    [id, userId, email, fullName ?? null],
  )
  return (await getStudentById(id))! satisfies StudentRow as StudentRow
}

/** `subscription-profile` action:"name" — saves the certificate name (students.full_name). */
export async function saveStudentName(studentId: string, fullName: string) {
  await run(
    'UPDATE students SET full_name = ?, updated_at = unixepoch() WHERE id = ?',
    [fullName, studentId],
  )
}

/** `subscription-profile` action:"email" — changes the login/profile email. */
export async function saveStudentEmail(studentId: string, email: string) {
  await run(
    'UPDATE students SET email = ?, updated_at = unixepoch() WHERE id = ?',
    [email, studentId],
  )
}
