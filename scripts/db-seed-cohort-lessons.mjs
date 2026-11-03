#!/usr/bin/env node
// Cohort session seed — fills cohort_lessons so the cohort player has sessions.
//
// NOTE: the reference Supabase dump contains 0 rows in cohort_lessons (the
// reference platform manages sessions live per class), so these seeds are
// generated from each cohort's own metadata (total_days, start_date, title).
// Local demo data only — not authoritative reference content.
//
// Sessions: one per day, starting `start_date` at 06:00 Africa/Lusaka
// (UTC+2 => 04:00 UTC), video_url null (player shows the empty-video state).
//
// Usage:  node --env-file=.env.local scripts/db-seed-cohort-lessons.mjs

import { createClient } from '@libsql/client/node'
const url = process.env.TURSO_DATABASE_URL
const token = process.env.TURSO_AUTH_TOKEN
if (!url) { console.error('TURSO_DATABASE_URL missing'); process.exit(1) }
const client = createClient({ url, authToken: token || undefined })

const THEMES = {
  'cutpro-video-editing-march-2026': [
    'CapCut for desktop — interface & project setup',
    'Trimming, splitting & the rhythm of cuts',
    'Transitions that don\'t look cheap',
    'Text titles & animated captions',
    'Color grading basics (LUTs & sliders)',
    'Audio: music, ducking and volume curves',
    'Keyframes & smooth movement',
    'Speed ramps & freeze frames',
    'Exporting clean files for every platform',
    'Project day: edit a full 60-second ad',
  ],
  'ai-unlocked-cohort-2': [
    'AI fundamentals — what can it actually do?',
    'Prompting for Zambian business content',
    'AI content calendar & batching',
    'Selling AI-assisted services',
    'Package your AI skills into offers',
  ],
  'ai-automation-cohort': [
    'Automation mindset & mapping workflows',
    'Make.com from scratch',
    'Google Sheets as automation memory',
    'Connecting AI brains to workflows',
    'Auto-responders for WhatsApp & email',
    'Facebook comments to content pipeline',
    'Forms, triggers and routing',
    'Make.com vs Zapier — picking tools',
    'Selling automation services',
    'Project day: ship a working automation',
  ],
  'meta-ads-explained-2026': [
    'Business Manager setup the right way',
    'Pixels, events & conversions (Zambia)',
    'Campaign structure & objectives',
    'Audience research for Lusaka',
    'Creative: images vs video vs text',
    'Writing ads that convert',
    'Budgets & bidding basics',
    'Lead ads & instant forms',
    'WhatsApp ads (message campaigns)',
    'Retargeting warm audiences',
    'Custom & lookalike audiences',
    'Reading the metrics that matter',
    'Split testing without wasting money',
    'Common reasons campaigns fail',
    'Scaling what works',
    'Agency workflow: managing client ads',
    'Case study breakdown',
    'Your 7-day ad plan',
    'Project day: launch your first campaign',
  ],
  'va-classes-october-2026': [
    'The VA business model & choosing a niche',
    'Email inbox management systems',
    'Calendar & scheduling like a pro',
    'Document skills: Docs, Sheets & templates',
    'Canva basics for social media servicing',
    'Community management (DMs & comments)',
    'Video captioning & repurposing',
    'Client communication & reporting',
    'Tools stack: Trello, Slack, Notion',
    'Finding clients on Upwork',
    'Finding clients on Fiverr',
    'Finding clients directly (cold outreach)',
    'Pricing your packages in ZMW',
    'Onboarding a new client',
    'SOPs: doing repeatable work fast',
    'Time management as a VA',
    'Portfolio building for beginners',
    'Interviews & test tasks',
    'Taxes & getting paid in Zambia',
    'Growing from VA to agency',
    'Project day: land your first retainer',
  ],
}

function pad(n) { return n < 10 ? '0' + n : String(n) }

async function main() {
  const cohorts = await client.execute(
    'SELECT id, slug, title, total_days, start_date FROM cohorts WHERE deleted_at IS NULL ORDER BY start_date ASC'
  )
  let seeded = 0
  for (const row of cohorts.rows) {
    const slug = String(row.slug)
    const totalDays = Math.min(Number(row.total_days ?? 0), 30)
    const startDate = String(row.start_date ?? '')
    if (!startDate || totalDays === 0) { console.warn(`skip ${slug}: no dates`); continue }

    const existing = await client.execute({
      sql: 'SELECT COUNT(*) AS n FROM cohort_lessons WHERE cohort_id = ?',
      args: [row.id],
    })
    if (Number(existing.rows[0].n) > 0) { console.log(`skip ${slug}: already has sessions`); continue }

    const themes = THEMES[slug] || []
    const start = new Date(`${startDate}T04:00:00Z`) // 06:00 Africa/Lusaka
    const batch = []
    for (let i = 0; i < totalDays; i++) {
      // Skip Sundays (class rest days across weekly cohorts)
      const d = new Date(start)
      d.setUTCDate(start.getUTCDate() + i)
      // push to Monday when landing on a Sunday
      if (d.getUTCDay() === 0) d.setUTCDate(d.getUTCDate() + 1)
      const startsAt = `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}T04:00:00Z`
      const theme = themes[i] || `Session Day ${i + 1}`
      batch.push({
        sql: `INSERT INTO cohort_lessons (id, cohort_id, title, starts_at, minutes, video_url, video_provider, description, position, created_at, updated_at)
              VALUES (?, ?, ?, ?, ?, NULL, 'external', ?, ?, unixepoch(), unixepoch())`,
        args: [
          `${slug}-day-${i + 1}`,
          row.id,
          `Day ${i + 1}: ${theme}`,
          startsAt,
          slug === 'meta-ads-explained-2026' ? 45 : 25,
          `Live class for ${row.title}. Recording posted after the session.`,
          i + 1,
        ],
      })
    }
    for (const s of batch) await client.execute(s)
    seeded += batch.length
    console.log(`${slug}: ${batch.length} sessions (start ${batch[0].args[2]})`)
  }
  console.log(`Seeded ${seeded} cohort_lessons rows`)
}

main().catch(e => { console.error(e); process.exit(1) })
