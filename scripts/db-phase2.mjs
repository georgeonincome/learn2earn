#!/usr/bin/env node
// Phase 2 DB setup: adds full cohort model tables + seeds with reference data.
//
// Usage:  node --env-file=.env.local scripts/db-phase2.mjs

import { createClient } from '@libsql/client/node'
const url = process.env.TURSO_DATABASE_URL
const token = process.env.TURSO_AUTH_TOKEN
if (!url) { console.error('TURSO_DATABASE_URL missing'); process.exit(1) }
const client = createClient({ url, authToken: token || undefined })

async function run(sql, args = []) {
  await client.execute({ sql, args })
}

async function runAll(sqls) {
  for (const { sql, args } of sqls) {
    try { await run(sql, args) } catch (e) { console.warn('SKIP:', sql.slice(0, 60), '-', e.message) }
  }
}

async function main() {
  // --- Expand the minimal Phase 0 cohorts table ---
  const haveCohorts = (await client.execute('PRAGMA table_info(cohorts)')).rows.map(r => r.name)
  const COHORT_COLS = [
    'slug TEXT', 'lesson_duration_minutes INTEGER', 'status TEXT',
    'max_students INTEGER', 'price_usd REAL', 'discount_price REAL',
    'discount_end_date TEXT', 'is_published INTEGER DEFAULT 0',
    'access_start_time TEXT', 'access_end_time TEXT',
    'enforce_access_window INTEGER DEFAULT 0', 'require_checkin INTEGER DEFAULT 0',
    'timezone TEXT DEFAULT \'Africa/Lusaka\'', 'whatsapp_link TEXT',
    'whatsapp_group_url TEXT', 'meet_url TEXT', 'class_key TEXT',
    'enable_post_replay INTEGER DEFAULT 0', 'max_replay_requests INTEGER DEFAULT 3',
    'points_deduction_per_replay INTEGER DEFAULT 5',
    'daily_quiz_question_count INTEGER DEFAULT 15',
    'daily_quiz_time_minutes INTEGER DEFAULT 10',
    'missed_session_penalty_points INTEGER DEFAULT 5',
    'access_type TEXT DEFAULT \'paid\'', 'enable_checkins INTEGER DEFAULT 0',
    'checkin_start_time TEXT', 'checkin_end_time TEXT', 'checkin_points INTEGER DEFAULT 10',
    'all_lessons_unlocked INTEGER DEFAULT 0', 'unlock_all_date TEXT',
    'unlocked_by TEXT', 'registration_closes_at TEXT',
    'enrollment_open INTEGER DEFAULT 1', 'archived INTEGER DEFAULT 0',
    'auto_issue_transcripts INTEGER DEFAULT 0',
    'deleted_at INTEGER', 'created_by TEXT',
    'updated_at INTEGER DEFAULT (unixepoch())',
  ]
  const cohortAlters = COHORT_COLS.filter(c => !haveCohorts.includes(c.split(' ')[0]))
    .map(c => `ALTER TABLE cohorts ADD COLUMN ${c}`)
  await runAll(cohortAlters.map(sql => ({ sql, args: [] })))
  console.log('cohorts alters applied:', cohortAlters.length)

  // --- Add completed_at + final_score to cohort_enrollments ---
  const haveEnrollments = (await client.execute('PRAGMA table_info(cohort_enrollments)')).rows.map(r => r.name)
  const ENROLLMENT_COLS = ['completed_at TEXT', 'final_score REAL']
  const enrollAlters = ENROLLMENT_COLS.filter(c => !haveEnrollments.includes(c.split(' ')[0]))
    .map(c => `ALTER TABLE cohort_enrollments ADD COLUMN ${c}`)
  await runAll(enrollAlters.map(sql => ({ sql, args: [] })))
  console.log('enrollment alters applied:', enrollAlters.length)

  // --- Create new Phase 2 tables ---
  const tables = [
    `CREATE TABLE IF NOT EXISTS cohort_lessons (
      id TEXT PRIMARY KEY, cohort_id TEXT NOT NULL, title TEXT NOT NULL,
      starts_at TEXT NOT NULL, minutes INTEGER DEFAULT 25, video_url TEXT,
      video_provider TEXT DEFAULT 'external', content TEXT, description TEXT,
      resources TEXT, quiz_questions TEXT, position INTEGER DEFAULT 0,
      created_at INTEGER DEFAULT (unixepoch()), updated_at INTEGER DEFAULT (unixepoch())
    );`,
    `CREATE INDEX IF NOT EXISTS cohort_lessons_cohort_idx ON cohort_lessons(cohort_id);`,
    `CREATE TABLE IF NOT EXISTS cohort_certificates (
      id TEXT PRIMARY KEY, certificate_id TEXT NOT NULL,
      student_id TEXT NOT NULL, cohort_id TEXT NOT NULL, enrollment_id TEXT,
      student_name TEXT NOT NULL, cohort_title TEXT NOT NULL, issue_date TEXT,
      download_url TEXT, is_verified INTEGER DEFAULT 1,
      created_at INTEGER DEFAULT (unixepoch())
    );`,
    `CREATE UNIQUE INDEX IF NOT EXISTS cohort_certificates_cert_id_uq ON cohort_certificates(certificate_id);`,
    `CREATE INDEX IF NOT EXISTS cohort_certificates_student_idx ON cohort_certificates(student_id);`,
    `CREATE TABLE IF NOT EXISTS cohort_checkins (
      id TEXT PRIMARY KEY, student_id TEXT NOT NULL, cohort_id TEXT NOT NULL,
      day_id TEXT NOT NULL, checkin_at TEXT, points INTEGER DEFAULT 10,
      created_at INTEGER DEFAULT (unixepoch())
    );`,
    `CREATE INDEX IF NOT EXISTS cohort_checkins_student_cohort_idx ON cohort_checkins(student_id, cohort_id);`,
    `CREATE TABLE IF NOT EXISTS cohort_final_assessments (
      id TEXT PRIMARY KEY, cohort_id TEXT NOT NULL, title TEXT NOT NULL,
      total_questions INTEGER DEFAULT 0, passing_score INTEGER DEFAULT 70,
      time_limit_minutes INTEGER, is_published INTEGER DEFAULT 0,
      created_at INTEGER DEFAULT (unixepoch())
    );`,
    `CREATE INDEX IF NOT EXISTS final_assessment_cohort_idx ON cohort_final_assessments(cohort_id);`,
    `CREATE TABLE IF NOT EXISTS cohort_final_assessment_attempts (
      id TEXT PRIMARY KEY, assessment_id TEXT NOT NULL, enrollment_id TEXT NOT NULL,
      score INTEGER DEFAULT 0, percentage INTEGER DEFAULT 0, passed INTEGER DEFAULT 0,
      status TEXT, submitted_at TEXT, answers TEXT,
      created_at INTEGER DEFAULT (unixepoch())
    );`,
    `CREATE INDEX IF NOT EXISTS final_assessment_attempt_enrollment_idx ON cohort_final_assessment_attempts(enrollment_id);`,
  ]
  await runAll(tables.map(sql => ({ sql, args: [] })))
  console.log('tables created')

  // --- Seed cohorts ---
  const KES_TO_ZMW = 0.155
  const REF_COHORTS = [
    {
      id: '35989dd1-4b88-4c86-a9f4-2faa7ea3dbd3', slug: 'cutpro-video-editing-march-2026',
      title: 'CutPro: Video Editing with CapCut — March 2026',
      description: 'Master CapCut for desktop in 10 daily lessons.',
      thumbnail_url: '/images/cohorts/cutpro-march-2026.png',
      start_date: '2026-03-10', end_date: '2026-03-21', total_days: 10,
      lesson_duration_minutes: 25, status: 'completed', max_students: 100,
      price: 2890 * KES_TO_ZMW, price_usd: 25, is_published: 1,
      access_start_time: '05:00:00', access_end_time: '23:30:00',
      timezone: 'Africa/Lusaka', whatsapp_group_url: 'https://chat.whatsapp.com/BSLM3C78Eod2ieH9HyyIsL',
      enable_checkins: 1, checkin_start_time: '05:00:00', checkin_end_time: '22:00:00', checkin_points: 10,
      class_key: 'cutpro: video editing with capcut — march 2026', meet_url: null,
      enrollment_open: 1, archived: 0, auto_issue_transcripts: 0,
    },
    {
      id: '82def641-4da6-43bd-aa8f-d14466bd82ad', slug: 'ai-unlocked-cohort-2',
      title: 'AI Unlocked Cohort 2',
      description: 'Learn how to package your AI skills and make some income.',
      thumbnail_url: '/images/cohorts/ai-unlocked-2.png',
      start_date: '2026-05-18', end_date: '2026-07-17', total_days: 5,
      lesson_duration_minutes: 90, status: 'active', max_students: 1000,
      price: 3690 * KES_TO_ZMW, price_usd: 36.9, is_published: 1,
      access_start_time: '05:00:00', access_end_time: '08:30:00',
      timezone: 'Africa/Lusaka', class_key: 'ai unlocked',
      enrollment_open: 1, archived: 0, auto_issue_transcripts: 0,
    },
    {
      id: '8cbb3b12-389c-4176-b316-64b54d6525b8', slug: 'meta-ads-explained-2026',
      title: 'Meta Ads Explained 2026',
      description: 'Stop boosting posts and hoping. Build real Meta Ads campaigns.',
      thumbnail_url: '/images/cohorts/meta-ads-2026.png',
      start_date: '2026-06-22', end_date: '2026-07-07', total_days: 19,
      lesson_duration_minutes: 25, status: 'active', max_students: 250,
      price: 2790 * KES_TO_ZMW, price_usd: 28, is_published: 1,
      access_start_time: '05:00:00', access_end_time: '08:30:00',
      timezone: 'Africa/Lusaka', class_key: 'meta ads explained 2026',
      enrollment_open: 1, archived: 0, auto_issue_transcripts: 0,
    },
    {
      id: 'e0b096c4-dc8b-4df7-a7a4-f9d70b3295fd', slug: 'ai-automation-cohort',
      title: 'AI Automation Cohort',
      description: 'A beginner\'s guide to automation. Live, in front of the class.',
      thumbnail_url: '/images/cohorts/ai-automation.png',
      start_date: '2026-06-10', end_date: '2026-06-20', total_days: 10,
      lesson_duration_minutes: 30, status: 'active', max_students: 100,
      price: 3500 * KES_TO_ZMW, price_usd: 35, is_published: 1,
      access_start_time: '05:00:00', access_end_time: '08:30:00',
      timezone: 'Africa/Lusaka', whatsapp_group_url: 'https://chat.whatsapp.com/Emjqcqu0m6YLMO07LPnxRR',
      class_key: 'ai automation cohort', recording_course_id: '3b6efcbb-716f-459e-a311-4b00ff56f5f7',
      enrollment_open: 1, archived: 0, auto_issue_transcripts: 0,
    },
    {
      id: '3d333f1c-47b6-4e06-955c-dfcb2919e8d6', slug: 'va-classes-october-2026',
      title: 'VA Classes October 2026',
      description: 'Learn the work, the tools and where to find clients.',
      thumbnail_url: '/images/cohorts/va-oct-2026.png',
      start_date: '2026-10-08', end_date: '2026-10-28', total_days: 21,
      lesson_duration_minutes: 60, status: 'active', max_students: 100,
      price: 5690 * KES_TO_ZMW, price_usd: 56.9, is_published: 1,
      access_start_time: '05:00:00', access_end_time: '08:30:00',
      timezone: 'Africa/Lusaka', class_key: 'va classes october 2026',
      recording_course_id: '80b528f2-a9db-4c36-bb32-89227159ac52',
      enrollment_open: 1, archived: 0, auto_issue_transcripts: 0,
    },
  ]

  const seedStmts = []
  for (const c of REF_COHORTS) {
    const v = (x) => x === undefined ? null : x
    seedStmts.push({
      sql: `INSERT INTO cohorts (id, slug, title, description, thumbnail_url, start_date, end_date,
        total_days, lesson_duration_minutes, status, max_students, price, price_usd, is_published,
        access_start_time, access_end_time, timezone, whatsapp_group_url, class_key, meet_url,
        enable_checkins, checkin_start_time, checkin_end_time, checkin_points,
        enrollment_open, archived, auto_issue_transcripts, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, unixepoch(), unixepoch())
       ON CONFLICT(id) DO UPDATE SET
         title=excluded.title, slug=excluded.slug, description=excluded.description,
         thumbnail_url=excluded.thumbnail_url, start_date=excluded.start_date, end_date=excluded.end_date,
         total_days=excluded.total_days, lesson_duration_minutes=excluded.lesson_duration_minutes,
         status=excluded.status, max_students=excluded.max_students, price=excluded.price,
         price_usd=excluded.price_usd, is_published=excluded.is_published,
         access_start_time=excluded.access_start_time, access_end_time=excluded.access_end_time,
         timezone=excluded.timezone, whatsapp_group_url=excluded.whatsapp_group_url,
         class_key=excluded.class_key, meet_url=excluded.meet_url,
         enable_checkins=excluded.enable_checkins, checkin_start_time=excluded.checkin_start_time,
         checkin_end_time=excluded.checkin_end_time, checkin_points=excluded.checkin_points,
         enrollment_open=excluded.enrollment_open, archived=excluded.archived,
         auto_issue_transcripts=excluded.auto_issue_transcripts, updated_at=unixepoch()`,
      args: [c.id, c.slug, c.title, c.description, c.thumbnail_url, c.start_date, c.end_date,
        c.total_days, c.lesson_duration_minutes, c.status, c.max_students, c.price, c.price_usd,
        c.is_published, c.access_start_time, c.access_end_time, c.timezone, v(c.whatsapp_group_url),
        c.class_key, v(c.meet_url), v(c.enable_checkins), v(c.checkin_start_time), v(c.checkin_end_time),
        v(c.checkin_points), c.enrollment_open, c.archived, c.auto_issue_transcripts],
    })
    // Free access token for each cohort
    const tokenId = crypto.randomUUID()
    seedStmts.push({
      sql: `INSERT INTO enrollment_tokens (id, cohort_id, name, max_uses, uses_count, is_active)
       VALUES (?, ?, 'Free access invitation', 100, 0, 1)`,
      args: [tokenId, c.id],
    })
  }
  await runAll(seedStmts)
  console.log('seed applied:', seedStmts.length, 'statements')

  const cohortCount = (await client.execute('SELECT COUNT(*) AS n FROM cohorts WHERE is_published = 1')).rows[0].n
  const tokenCount = (await client.execute('SELECT COUNT(*) AS n FROM enrollment_tokens')).rows[0].n
  console.log(`seed: ${cohortCount} cohorts, ${tokenCount} access tokens`)
}

main().catch(e => { console.error(e); process.exit(1) })
