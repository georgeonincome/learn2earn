#!/usr/bin/env node
// Phase 5 DB setup: bundles + bundle_courses tables, bundle_id on transactions,
// and seed rows mirroring _reference/click2skill/supabase/bundles.json with
// ZMW rebranding (rate 0.155, rounded):
//   complete-digital-skills-bundle: 4690 KES -> 727 ZMW, anchor 20814 -> 3226
//   smm-meta-2027:                  4690 KES -> 727 ZMW, anchor  5380 ->  834
// Bundle→course links are remapped to the courses that exist in our DB (the
// reference course IDs belong to the reference Supabase instance).
//
// Usage:  node --env-file=.env.local scripts/db-phase5.mjs

import { createClient } from '@libsql/client/node'
const url = process.env.TURSO_DATABASE_URL
const token = process.env.TURSO_AUTH_TOKEN
if (!url) { console.error('TURSO_DATABASE_URL missing'); process.exit(1) }
const client = createClient({ url, authToken: token || undefined })

async function run(sql, args = []) {
  await client.execute({ sql, args })
}

async function main() {
  // --- bundles ---
  await run(`
    CREATE TABLE IF NOT EXISTS bundles (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL,
      name TEXT NOT NULL,
      tagline TEXT,
      description TEXT,
      price REAL,
      anchor_price REAL,
      is_active INTEGER DEFAULT 1,
      cover_image_url TEXT,
      created_at INTEGER DEFAULT (unixepoch())
    );
  `)
  await run(`CREATE UNIQUE INDEX IF NOT EXISTS bundles_slug_uq ON bundles(slug);`)

  // --- bundle_courses ---
  await run(`
    CREATE TABLE IF NOT EXISTS bundle_courses (
      id TEXT PRIMARY KEY,
      bundle_id TEXT NOT NULL,
      course_id TEXT NOT NULL,
      position INTEGER,
      created_at INTEGER DEFAULT (unixepoch())
    );
  `)
  await run(`CREATE UNIQUE INDEX IF NOT EXISTS bundle_courses_bundle_course_uq ON bundle_courses(bundle_id, course_id);`)
  await run(`CREATE INDEX IF NOT EXISTS bundle_courses_bundle_idx ON bundle_courses(bundle_id);`)

  // --- transactions.bundle_id (mirrors book_id ALTER from Phase 3) ---
  const cols = await client.execute(`PRAGMA table_info(transactions);`)
  if (!cols.rows.some((r) => String(r.name) === 'bundle_id')) {
    await run(`ALTER TABLE transactions ADD COLUMN bundle_id TEXT;`)
  }

  // --- seed bundles (upsert) ---
  const bundleSeeds = [
    {
      id: '6089fe3c-a72e-4ace-af65-450ce0df89cc',
      slug: 'complete-digital-skills-bundle',
      name: 'Complete Digital Skills Bundle',
      tagline: 'Six courses. One payment.',
      description: 'Every Learn2Earn course in one bundle — lifetime access, verified certificates, and every future update.',
      price: 727,
      anchor_price: 3226,
    },
    {
      id: '4259cee5-bbc2-4fdc-9401-57e8f0801c44',
      slug: 'smm-meta-2027',
      name: 'Social Media Management + Meta Ads',
      tagline: null,
      description: 'Lifetime access to Social Media Management With AI and Meta Ads — the two skills clients pay retainers for.',
      price: 727,
      anchor_price: 834,
    },
  ]
  for (const b of bundleSeeds) {
    await run(
      `INSERT INTO bundles (id, slug, name, tagline, description, price, anchor_price, is_active, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, 1, unixepoch())
       ON CONFLICT(id) DO UPDATE SET
         slug=excluded.slug, name=excluded.name, tagline=excluded.tagline,
         description=excluded.description, price=excluded.price,
         anchor_price=excluded.anchor_price, is_active=1`,
      [b.id, b.slug, b.name, b.tagline, b.description, b.price, b.anchor_price],
    )
  }

  // --- seed bundle_courses: remap to the courses that exist in our DB ---
  const courseRows = await client.execute(
    `SELECT id, slug FROM courses ORDER BY created_at ASC LIMIT 6;`,
  )
  const courseIds = courseRows.rows.map((r) => String(r.id))
  for (const b of bundleSeeds) {
    for (let i = 0; i < courseIds.length; i++) {
      await run(
        `INSERT INTO bundle_courses (id, bundle_id, course_id, position, created_at)
         VALUES (?, ?, ?, ?, unixepoch())
         ON CONFLICT(bundle_id, course_id) DO UPDATE SET position=excluded.position`,
        [`${b.id}-c${i + 1}`, b.id, courseIds[i], i + 1],
      )
    }
    console.log(`bundle ${b.slug}: ${courseIds.length} courses`)
  }

  console.log('Phase 5 tables ready: bundles, bundle_courses, transactions.bundle_id')
}

main().catch(e => { console.error(e); process.exit(1) })
