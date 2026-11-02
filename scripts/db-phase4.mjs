#!/usr/bin/env node
// Phase 4 DB setup: adds course_certificates and review_helpful_votes tables.
//
// Usage:  node --env-file=.env.local scripts/db-phase4.mjs

import { createClient } from '@libsql/client/node'
const url = process.env.TURSO_DATABASE_URL
const token = process.env.TURSO_AUTH_TOKEN
if (!url) { console.error('TURSO_DATABASE_URL missing'); process.exit(1) }
const client = createClient({ url, authToken: token || undefined })

async function run(sql, args = []) {
  await client.execute({ sql, args })
}

async function main() {
  // --- course_certificates ---
  await run(`
    CREATE TABLE IF NOT EXISTS course_certificates (
      id TEXT PRIMARY KEY,
      certificate_id TEXT NOT NULL,
      student_id TEXT NOT NULL,
      course_id TEXT NOT NULL,
      enrollment_id TEXT,
      student_name TEXT NOT NULL,
      course_title TEXT NOT NULL,
      course_slug TEXT NOT NULL,
      issue_date TEXT,
      download_url TEXT,
      is_verified INTEGER DEFAULT 1,
      created_at INTEGER DEFAULT (unixepoch())
    );
  `)
  await run(`CREATE UNIQUE INDEX IF NOT EXISTS course_certificates_cert_id_uq ON course_certificates(certificate_id);`)
  await run(`CREATE INDEX IF NOT EXISTS course_certificates_student_idx ON course_certificates(student_id);`)

  // --- review_helpful_votes ---
  await run(`
    CREATE TABLE IF NOT EXISTS review_helpful_votes (
      id TEXT PRIMARY KEY,
      review_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      created_at INTEGER DEFAULT (unixepoch())
    );
  `)
  await run(`CREATE UNIQUE INDEX IF NOT EXISTS review_helpful_votes_review_user_uq ON review_helpful_votes(review_id, user_id);`)
  await run(`CREATE INDEX IF NOT EXISTS review_helpful_votes_review_idx ON review_helpful_votes(review_id);`)

  console.log('Phase 4 tables created: course_certificates, review_helpful_votes')
}

main().catch(e => { console.error(e); process.exit(1) })
