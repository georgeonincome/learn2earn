// Gamification — reference contracts from CoursePlayer-2icA96ky.js.
// Side effects on lesson completion:
//   awardPoints(10, "lesson_complete", lessonId) + updateStreak() + checkAchievements()
// Tables: student_points, student_streaks, student_achievements, achievement_definitions
import { one, all, run } from './sql'
import { nowIso, uuid } from './ids'
import type { Row } from './sql'

// ---------------------------------------------------------------------------
// Points
// ---------------------------------------------------------------------------

export async function getStudentPoints(studentId: string) {
  const row = await one<Row>('SELECT * FROM student_points WHERE student_id = ? LIMIT 1', [studentId])
  if (!row) {
    await run(
      'INSERT INTO student_points (id, student_id, total_points, level, points_to_next_level) VALUES (?, ?, 0, 1, 100)',
      [uuid(), studentId],
    )
    return one<Row>('SELECT * FROM student_points WHERE student_id = ? LIMIT 1', [studentId])!
  }
  return row
}

/** `award_points` RPC replacement. Awards points, levels up as needed. */
export async function awardPoints({
  studentId,
  points,
  reason,
  referenceId,
}: {
  studentId: string
  points: number
  reason: string
  referenceId?: string | null
}) {
  const current = await getStudentPoints(studentId)
  if (!current) throw new Error('Student points row not found')
  const currentTotal = Number(current.total_points ?? 0)
  const currentLevel = Number(current.level ?? 1)
  let nextTotal = currentTotal + points
  let nextLevel = currentLevel
  let threshold = pointsToNextLevel(currentLevel)
  while (nextTotal >= threshold) {
    nextTotal -= threshold
    nextLevel++
    threshold = pointsToNextLevel(nextLevel)
  }
  await run(
    'UPDATE student_points SET total_points = ?, level = ?, points_to_next_level = ?, updated_at = unixepoch() WHERE student_id = ?',
    [nextTotal, nextLevel, threshold, studentId],
  )
  return {
    total_points: nextTotal,
    level: nextLevel,
    points_to_next_level: threshold,
    points_awarded: points,
    reason,
    reference_id: referenceId,
  }
}

function pointsToNextLevel(level: number): number {
  // Reference level curve (simple linear growth)
  return level * 100
}

// ---------------------------------------------------------------------------
// Streaks
// ---------------------------------------------------------------------------

export async function getStudentStreak(studentId: string) {
  const row = await one<Row>('SELECT * FROM student_streaks WHERE student_id = ? LIMIT 1', [studentId])
  if (!row) {
    await run(
      'INSERT INTO student_streaks (id, student_id, current_streak, longest_streak) VALUES (?, ?, 0, 0)',
      [uuid(), studentId],
    )
    return one<Row>('SELECT * FROM student_streaks WHERE student_id = ? LIMIT 1', [studentId])!
  }
  return row
}

/** `update_student_streak` RPC replacement. Call on every activity. */
export async function updateStreak(studentId: string) {
  const row = await getStudentStreak(studentId)
  const today = new Date().toISOString().slice(0, 10)
  if (!row) return { current_streak: 1, longest_streak: 1, last_activity_date: today }
  const lastStr = (row.last_activity_date as string) ?? ''
  const lastDate = lastStr ? lastStr.slice(0, 10) : ''
  let current = Number(row.current_streak ?? 0)
  let longest = Number(row.longest_streak ?? 0)

  if (lastDate === today) {
    // Already active today — noop
  } else {
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
    if (lastDate === yesterday) {
      current++
    } else if (lastDate !== today) {
      current = 1
    }
    longest = Math.max(longest, current)
  }

  await run(
    'UPDATE student_streaks SET current_streak = ?, longest_streak = ?, last_activity_date = ?, updated_at = unixepoch() WHERE student_id = ?',
    [current, longest, nowIso(), studentId],
  )

  return { current_streak: current, longest_streak: longest, last_activity_date: lastDate }
}

// ---------------------------------------------------------------------------
// Achievements
// ---------------------------------------------------------------------------

export async function getAchievementDefinitions(): Promise<Row[]> {
  return all('SELECT * FROM achievement_definitions ORDER BY created_at DESC')
}

export async function getStudentAchievements(studentId: string): Promise<Row[]> {
  return all(
    `SELECT sa.*, ad.code, ad.name, ad.description, ad.icon, ad.points_reward
       FROM student_achievements sa
       JOIN achievement_definitions ad ON ad.id = sa.achievement_id
      WHERE sa.student_id = ?
      ORDER BY sa.earned_at DESC`,
    [studentId],
  )
}

export async function hasAchievement(studentId: string, achievementCode: string): Promise<boolean> {
  const row = await one(
    `SELECT 1 FROM student_achievements sa
       JOIN achievement_definitions ad ON ad.id = sa.achievement_id
      WHERE sa.student_id = ? AND ad.code = ?
      LIMIT 1`,
    [studentId, achievementCode],
  )
  return Boolean(row)
}

/** `check_achievements` RPC replacement. Evaluates criteria for each definition
// and inserts earned rows plus awards points. Reference behavior fires a toast via
// realtime channel on INSERT (we stub this via the return value). */
export async function checkAchievements(studentId: string) {
  const defs = await getAchievementDefinitions()
  const newlyEarned: Row[] = []
  for (const d of defs) {
    const code = String(d.code ?? '')
    if (!code) continue
    if (await hasAchievement(studentId, code)) continue

    // Evaluate criteria — very lightweight server-side matching
    const criteria = d.criteria
    let earned = false
    if (typeof criteria === 'string') {
      try {
        const parsed = JSON.parse(criteria)
        earned = await evaluateCriteria(studentId, parsed)
      } catch {
        earned = false
      }
    } else if (criteria && typeof criteria === 'object') {
      earned = await evaluateCriteria(studentId, criteria as Record<string, unknown>)
    }

    if (earned) {
      await run(
        `INSERT INTO student_achievements (id, student_id, achievement_id, earned_at)
         VALUES (?, ?, ?, ?)`,
        [uuid(), studentId, String(d.id), nowIso()],
      )
      const pointsReward = Number(d.points_reward ?? 0)
      if (pointsReward > 0) {
        await awardPoints({ studentId, points: pointsReward, reason: `achievement_${code}` })
      }
      newlyEarned.push({ ...d, student_id: studentId, earned_at: nowIso() })
    }
  }
  return newlyEarned
}

async function evaluateCriteria(
  studentId: string,
  criteria: Record<string, unknown>,
): Promise<boolean> {
  const type = String(criteria.type ?? '')
  if (type === 'lesson_count') {
    const completedLessons = await all<{ n: number }>(
      'SELECT COUNT(*) AS n FROM lesson_progress WHERE student_id = ? AND completed = 1',
      [studentId],
    )
    return Number(completedLessons[0]?.n ?? 0) >= Number(criteria.count ?? 1)
  }
  if (type === 'streak_days') {
    const row = await one<Row>('SELECT current_streak FROM student_streaks WHERE student_id = ?', [studentId])
    return Number(row?.current_streak ?? 0) >= Number(criteria.count ?? 1)
  }
  if (type === 'points_total') {
    const row = await one<Row>('SELECT total_points FROM student_points WHERE student_id = ?', [studentId])
    return Number(row?.total_points ?? 0) >= Number(criteria.count ?? 1)
  }
  // Default: true for any undefined criteria (reference edge function may do more)
  return false
}
