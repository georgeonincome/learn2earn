#!/usr/bin/env node
// Phase 6 DB setup: course_funnels table (exact reference dump columns) + seed
// of the reference `virtual-assistant` funnel row, rebranded:
//   Elvis/@Elviswarutumo -> George, KES currency mentions -> ZMW.
// course_id keeps the reference value; the CTA resolver falls back to the
// static funnel when the linked course isn't in our DB.
//
// Usage:  node --env-file=.env.local scripts/db-phase6-funnels.mjs

import { createClient } from '@libsql/client/node'
const url = process.env.TURSO_DATABASE_URL
const token = process.env.TURSO_AUTH_TOKEN
if (!url) { console.error('TURSO_DATABASE_URL missing'); process.exit(1) }
const client = createClient({ url, authToken: token || undefined })

async function run(sql, args = []) {
  await client.execute({ sql, args })
}

const DESCRIPTION = '<h2>What This Course Covers</h2>\n<p>This intensive 7-day program transforms complete beginners into job-ready Virtual Assistants. You\'ll learn the exact systems, tools, and strategies top VAs use to land and retain high-paying clients.</p>\n\n<h3>🎯 Who This Is For</h3>\n<ul>\n<li>Anyone stuck in a 9-5 looking for freelance income</li>\n<li>Stay-at-home parents wanting flexible remote work</li>\n<li>Students earning side income while studying</li>\n<li>Career changers exploring remote work opportunities</li>\n<li>Beginners with zero VA experience</li>\n</ul>\n\n<h3>📚 Course Structure</h3>\n<p><strong>Day 1:</strong> What Is a Virtual Assistant? Understand the business model, niches, pricing, and service packages that sell.<br>\n<strong>Day 2:</strong> AI for VAs - Master ChatGPT prompts and workflows that save hours.<br>\n<strong>Day 3:</strong> Content Creation - Blog writing, LinkedIn, TikTok & Facebook content strategies.<br>\n<strong>Day 4:</strong> Instagram Mastery - Algorithm secrets, engagement tactics, and growth strategies.<br>\n<strong>Day 5:</strong> Essential Digital Tools - Google Workspace, Canva, scheduling tools, and automation.<br>\n<strong>Day 6:</strong> Data & Analytics - Track performance, summarize insights with AI.<br>\n<strong>Day 7:</strong> Client Acquisition - Scripts, proposals, pricing, and retention strategies.</p>\n\n<h3>✅ What You Get</h3>\n<ul>\n<li>7 full recorded masterclass sessions (9+ hours of content)</li>\n<li>Ready-to-use templates, scripts, and proposals</li>\n<li>Lifetime access to course materials and updates</li>\n<li>Certificate of completion after final project</li>\n<li>Community support and Q&A access</li>\n</ul>'

const BENEFITS = JSON.stringify([
  'Master AI tools like ChatGPT to work 10x faster on client tasks',
  'Build a professional VA portfolio even with zero experience',
  'Learn proven client acquisition scripts and proposals that convert',
  'Master Google Workspace, Canva, and scheduling tools',
  'Create scroll-stopping content for Instagram, TikTok, LinkedIn & Facebook',
  "Understand VA pricing, packages, and how to charge what you're worth",
  'Get replays and templates you can use immediately',
  'Earn your certificate and start landing clients within weeks',
])

const TESTIMONIALS = JSON.stringify([
  { name: 'Racheal Banda', role: 'VA Student', text: 'This was the best online skill session I have ever followed — from demonstrations to mastery and practical sessions. Honestly no kwacha was wasted. Thank you @Georgejackson' },
  { name: 'Gabriel Mwansa', role: 'Freelance VA', text: 'Learning Virtual Assistance with Mr George felt less like a class and more like a friendly workshop where everyone actually gets it. He explained things so clearly and patiently that even the most confused among us eventually caught up. George somehow managed to teach, mentor, and crack a smile all at once, just a rare combo these days.' },
  { name: 'Chipo Ngoma', role: 'Career Changer', text: 'If your career revolves around a 9-5 and you are looking for a freelance opportunity to escape that, this is for you. Very informative, detailed, with real-life examples and steps on how you will shift into the world of virtual assistance. Grab it NOW, not LATER.' },
  { name: 'Mwansa Chibuye', role: 'VA Student', text: 'Helped me raise my virtual assistance package through added skills like Google Forms and reporting.' },
  { name: 'Kondwani Phiri', role: 'VA Student', text: 'I gained a lot of practical knowledge. Thank you Mr George for the opportunity.' },
  { name: 'Bupe Musonda', role: 'VA Student', text: 'The course was very detailed and excellent.' },
])

async function main() {
  await run(`
    CREATE TABLE IF NOT EXISTS course_funnels (
      id TEXT PRIMARY KEY,
      course_id TEXT,
      slug TEXT NOT NULL,
      headline TEXT,
      subheadline TEXT,
      description TEXT,
      cta_text TEXT,
      hero_image_url TEXT,
      benefits TEXT,
      testimonials TEXT,
      is_active INTEGER DEFAULT 1,
      created_at TEXT,
      updated_at TEXT
    );
  `)
  await run(`CREATE UNIQUE INDEX IF NOT EXISTS course_funnels_slug_uq ON course_funnels(slug);`)

  await run(
    `INSERT INTO course_funnels (id, course_id, slug, headline, subheadline, description, cta_text, hero_image_url, benefits, testimonials, is_active, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, NULL, ?, ?, 1, '2025-11-30T21:52:29.316739+00:00', '2025-11-30T21:52:29.316739+00:00')
     ON CONFLICT(slug) DO UPDATE SET
       headline=excluded.headline, subheadline=excluded.subheadline, description=excluded.description,
       cta_text=excluded.cta_text, benefits=excluded.benefits, testimonials=excluded.testimonials,
       is_active=1, updated_at=excluded.updated_at`,
    [
      'bc3a8d19-088b-4288-8695-9f7bf830723e',
      '8f1c2b54-8fb6-45ef-b0c3-d9accce4c98b',
      'virtual-assistant',
      'Become a Client-Ready Virtual Assistant in 7 Days',
      'Learn how to package your services, use AI to work faster, and land paid work—without guesswork.',
      DESCRIPTION,
      'Start Your VA Journey Today',
      BENEFITS,
      TESTIMONIALS,
    ],
  )

  console.log('Phase 6 ready: course_funnels table + virtual-assistant seed')
}

main().catch(e => { console.error(e); process.exit(1) })
