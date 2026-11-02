#!/usr/bin/env node
// Phase 0 DB setup: creates the reference-model tables and seeds
// subscription_plans with the two real reference rows (rebranded KES→ZMW,
// rate 1 KES = 0.155 ZMW per lib/config.ts — currently in review with owner).
//
// Usage:  node --env-file=.env.local scripts/db-phase0.mjs
//         node --env-file=.env        scripts/db-phase0.mjs   (remote Turso)

import { createClient } from '@libsql/client/node'

const url = process.env.TURSO_DATABASE_URL
const token = process.env.TURSO_AUTH_TOKEN
if (!url) { console.error('TURSO_DATABASE_URL missing'); process.exit(1) }

const client = createClient({ url, authToken: token || undefined })

const DDL = `
CREATE TABLE IF NOT EXISTS auth_users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  email_confirmed_at INTEGER,
  created_at INTEGER DEFAULT (unixepoch())
);
CREATE UNIQUE INDEX IF NOT EXISTS auth_users_email_uq ON auth_users(email);

CREATE TABLE IF NOT EXISTS auth_sessions (
  token TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES auth_users(id),
  created_at INTEGER DEFAULT (unixepoch()),
  expires_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);
CREATE UNIQUE INDEX IF NOT EXISTS students_user_id_uq ON students(user_id) WHERE user_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS enrollments (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  course_id TEXT,
  cohort_id TEXT,
  payment_status TEXT,
  enrollment_source TEXT,
  amount_paid REAL,
  payment_method TEXT,
  transaction_id TEXT,
  enrolled_at TEXT,
  last_accessed TEXT,
  completion_status TEXT,
  created_at INTEGER DEFAULT (unixepoch())
);
CREATE UNIQUE INDEX IF NOT EXISTS enrollments_student_course_uq ON enrollments(student_id, course_id);

CREATE TABLE IF NOT EXISTS lesson_progress (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  enrollment_id TEXT,
  completed INTEGER,
  completed_at TEXT,
  last_position_seconds INTEGER,
  updated_at INTEGER DEFAULT (unixepoch())
);
CREATE UNIQUE INDEX IF NOT EXISTS lesson_progress_student_lesson_uq ON lesson_progress(student_id, lesson_id);
CREATE INDEX IF NOT EXISTS lesson_progress_enrollment_idx ON lesson_progress(enrollment_id);

CREATE TABLE IF NOT EXISTS cohort_enrollments (
  id TEXT PRIMARY KEY,
  cohort_id TEXT NOT NULL,
  student_id TEXT NOT NULL,
  status TEXT,
  payment_status TEXT,
  payment_method TEXT,
  amount_paid REAL,
  enrollment_source TEXT,
  transaction_id TEXT,
  enrolled_at TEXT,
  created_at INTEGER DEFAULT (unixepoch())
);
CREATE UNIQUE INDEX IF NOT EXISTS cohort_enrollments_student_cohort_uq ON cohort_enrollments(student_id, cohort_id);

CREATE TABLE IF NOT EXISTS cohort_lesson_progress (
  id TEXT PRIMARY KEY,
  enrollment_id TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  student_id TEXT NOT NULL,
  is_completed INTEGER,
  completed_at TEXT,
  watch_time_seconds INTEGER,
  position_seconds INTEGER,
  updated_at INTEGER DEFAULT (unixepoch())
);
CREATE UNIQUE INDEX IF NOT EXISTS clp_enrollment_lesson_uq ON cohort_lesson_progress(enrollment_id, lesson_id);

-- Minimal courses support table: the paid-checkout route resolves the item's
-- title/price here. The full reference course model ships with Phase 1.
CREATE TABLE IF NOT EXISTS courses (
  id TEXT PRIMARY KEY,
  title TEXT,
  description TEXT,
  price REAL,
  original_price REAL,
  created_at INTEGER DEFAULT (unixepoch())
);

-- Minimal cohorts support table: required now because validate_cohort_access_token
-- (CohortAccess contract) joins it. The full cohort model ships with the cohort phase.
CREATE TABLE IF NOT EXISTS cohorts (
  id TEXT PRIMARY KEY,
  title TEXT,
  description TEXT,
  thumbnail_url TEXT,
  price REAL,
  start_date TEXT,
  end_date TEXT,
  total_days INTEGER,
  access_start_time TEXT,
  access_end_time TEXT,
  created_at INTEGER DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS enrollment_tokens (
  id TEXT PRIMARY KEY,
  cohort_id TEXT NOT NULL,
  name TEXT,
  max_uses INTEGER,
  uses_count INTEGER,
  valid_from TEXT,
  valid_until TEXT,
  is_active INTEGER,
  created_at INTEGER DEFAULT (unixepoch())
);
CREATE INDEX IF NOT EXISTS enrollment_tokens_cohort_idx ON enrollment_tokens(cohort_id);

CREATE TABLE IF NOT EXISTS cohort_token_redemptions (
  id TEXT PRIMARY KEY,
  token_id TEXT NOT NULL REFERENCES enrollment_tokens(id),
  student_id TEXT NOT NULL REFERENCES students(id),
  enrollment_id TEXT,
  created_at INTEGER DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY,
  student_id TEXT,
  student_email TEXT,
  student_name TEXT,
  course_id TEXT,
  course_name TEXT,
  cohort_id TEXT,
  payment_reference TEXT,
  amount REAL,
  currency TEXT,
  original_price REAL,
  discount_amount REAL,
  plan_id TEXT,
  payment_method TEXT,
  payment_status TEXT,
  source TEXT,
  enrollment_source TEXT,
  processed_by_name TEXT,
  transaction_date TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS transactions_reference_uq ON transactions(payment_reference);
CREATE INDEX IF NOT EXISTS transactions_student_idx ON transactions(student_id);

CREATE TABLE IF NOT EXISTS subscription_plans (
  id TEXT PRIMARY KEY,
  code TEXT,
  name TEXT,
  duration_days INTEGER,
  price_kes REAL,
  price_usd REAL,
  is_visible INTEGER,
  is_recommended INTEGER,
  sort_order INTEGER,
  created_at TEXT,
  updated_at TEXT
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL REFERENCES students(id),
  plan_id TEXT NOT NULL REFERENCES subscription_plans(id),
  status TEXT,
  current_period_start TEXT,
  current_period_end TEXT,
  cancel_at_period_end INTEGER,
  last_payment TEXT,
  amount REAL,
  currency TEXT,
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);
CREATE INDEX IF NOT EXISTS subscriptions_student_idx ON subscriptions(student_id);

CREATE TABLE IF NOT EXISTS student_preferences (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL REFERENCES students(id),
  class_reminders INTEGER,
  whatsapp_reminders INTEGER,
  course_updates INTEGER,
  skillcheck_reminders INTEGER,
  offers INTEGER,
  weekly_progress INTEGER,
  data_saver INTEGER,
  autoplay_next INTEGER,
  captions INTEGER,
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);
CREATE UNIQUE INDEX IF NOT EXISTS student_preferences_student_uq ON student_preferences(student_id);
`

// Reference rows from _reference/click2skill/supabase/subscription_plans.json
// Rebrand: KES→ZMW at 0.155 (documented rate), USD untouched.
const KES_TO_ZMW = 0.155
const PLANS = [
  {
    id: '88a928e3-44b1-42a4-ad1d-d22d8a94e48a',
    code: 'quarterly', name: '4 months', duration_days: 120,
    price_kes: 2_790 * KES_TO_ZMW, price_usd: 20.0,
    is_visible: true, is_recommended: false, sort_order: 2,
    created_at: '2026-08-26T03:09:01.198541+00:00', updated_at: new Date().toISOString(),
  },
  {
    id: '09131b09-b7df-4332-be22-aa517a4d8198',
    code: 'annual', name: '12 months', duration_days: 365,
    price_kes: 7_990 * KES_TO_ZMW, price_usd: 64.0,
    is_visible: true, is_recommended: true, sort_order: 3,
    created_at: '2026-08-26T03:09:01.198541+00:00', updated_at: new Date().toISOString(),
  },
]

const stmts = DDL.split(';').map((s) => s.trim()).filter(Boolean)
const batch = []
for (const s of stmts) batch.push({ sql: s, args: [] })

// Migration for DBs created before a later column addition (CREATE IF NOT EXISTS
// won't extend an existing table) — fails harmlessly when the column exists.
try {
  await client.execute('ALTER TABLE transactions ADD COLUMN plan_id TEXT')
  console.log('migrated: transactions.plan_id added')
} catch (err) {
  if (!String(err).includes('duplicate column name')) console.error('plan_id migration:', err)
}

for (const p of PLANS) {
  batch.push({
    sql: `INSERT INTO subscription_plans
      (id, code, name, duration_days, price_kes, price_usd, is_visible, is_recommended, sort_order, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET name=excluded.name, duration_days=excluded.duration_days,
        price_kes=excluded.price_kes, price_usd=excluded.price_usd, is_visible=excluded.is_visible,
        is_recommended=excluded.is_recommended, sort_order=excluded.sort_order, updated_at=excluded.updated_at`,
    args: [p.id, p.code, p.name, p.duration_days, p.price_kes, p.price_usd,
      p.is_visible ? 1 : 0, p.is_recommended ? 1 : 0, p.sort_order, p.created_at, p.updated_at],
  })
}

const res = await client.batch(batch, 'write')
console.log(`Applied ${batch.length} statements on ${url}`)
const r = await client.execute('SELECT code, name, duration_days, price_kes, price_usd, is_recommended, sort_order FROM subscription_plans ORDER BY sort_order')
for (const row of r.rows) console.log('plan:', JSON.stringify(row))
