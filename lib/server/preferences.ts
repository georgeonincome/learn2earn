// Student preferences — 1:1 port of studentPreferences-k8XJ8C4f.js defaults +
// the normalizer logic, backed by the `student_preferences` table (the
// reference calls this via `student_save_preferences` / `student_settings_data`).
import { one, run } from './sql'

export type PreferenceGroup = Record<string, boolean>

/** Notification defaults (reference export `a`). */
const NOTIFICATION_DEFAULTS: PreferenceGroup = {
  classReminders: true,
  whatsappReminders: false,
  courseUpdates: true,
  skillcheckReminders: true,
  offers: true,
  weeklyProgress: false,
}

/** Learning defaults (reference export `c`). */
const LEARNING_DEFAULTS: PreferenceGroup = {
  dataSaver: false,
  autoplayNext: true,
  captions: true,
}

/**
 * Reference normalizer (chunk `i`): given any stored object, return
 * { notifications, learning } using defaults for missing/non-boolean keys.
 */
export function normalizePreferences(stored: unknown): {
  notifications: PreferenceGroup
  learning: PreferenceGroup
} {
  const s = stored && typeof stored === 'object' ? (stored as Record<string, unknown>) : {}
  const norm = (defaults: PreferenceGroup): PreferenceGroup =>
    Object.fromEntries(
      Object.entries(defaults).map(([key, def]) => [key, typeof s[key] === 'boolean' ? (s[key] as boolean) : def]),
    )
  return { notifications: norm(NOTIFICATION_DEFAULTS), learning: norm(LEARNING_DEFAULTS) }
}

const COLUMN_BY_KEY: Record<string, string> = {
  classReminders: 'class_reminders',
  whatsappReminders: 'whatsapp_reminders',
  courseUpdates: 'course_updates',
  skillcheckReminders: 'skillcheck_reminders',
  offers: 'offers',
  weeklyProgress: 'weekly_progress',
  dataSaver: 'data_saver',
  autoplayNext: 'autoplay_next',
  captions: 'captions',
}

type PrefRow = Record<string, number | null>

function rowToPrefs(row: PrefRow) {
  const stored: Record<string, boolean> = {}
  for (const [key, col] of Object.entries(COLUMN_BY_KEY)) {
    if (row[col] != null) stored[key] = Boolean(row[col])
  }
  return normalizePreferences(stored)
}

export async function getStudentPreferences(studentId: string) {
  const row = await one<PrefRow>('SELECT * FROM student_preferences WHERE student_id = ? LIMIT 1', [studentId])
  return row ? rowToPrefs(row) : normalizePreferences({})
}

/**
 * `student_save_preferences` — full Upsert semantics: flips only the provided
 * keys, preserves others, and keeps defaults for anything never set.
 */
export async function saveStudentPreferences(studentId: string, updates: Record<string, boolean>) {
  const current = await getStudentPreferences(studentId)
  const merged: Record<string, boolean> = { ...current.notifications, ...current.learning }
  for (const [key, value] of Object.entries(updates)) {
    if (key in COLUMN_BY_KEY) merged[key] = Boolean(value)
  }
  const cols = Object.entries(COLUMN_BY_KEY)
  const values = cols.map(([key]) => (merged[key] ? 1 : 0))
  const placeholders = cols.map(() => '?').join(', ')
  const colList = cols.map(([, col]) => col).join(', ')
  await run(
    `INSERT INTO student_preferences (id, student_id, ${colList})
     VALUES (?, ?, ${placeholders})
     ON CONFLICT(student_id) DO UPDATE SET ${cols.map(([, col]) => `${col}=excluded.${col}`).join(', ')}, updated_at = unixepoch()`,
    [crypto.randomUUID(), studentId, ...values],
  )
  return getStudentPreferences(studentId)
}
