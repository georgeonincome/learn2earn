#!/usr/bin/env node
// Phase 8 DB setup (full operational parity with the Click2Skill reference):
// every reference table that earlier phases left behind, as observed in the
// Supabase dump / client chunk queries:
//
//   am_challenge_* (10 tables, exact dump columns from am_challenge.json +
//     observed insert/update keys in StudentDashboard-Dh-ypbFE.js & Day10 chunk),
//   reading_lab_* (18 tables, columns observed in StudentDashboard chunk),
//   tickets / ticket_messages, announcements + announcement_views (dump),
//   review_requests, assignments + assignment_submissions,
//   darasa_sessions + darasa_signups, user_roles + admin_users + admin_otp_codes,
//   training_session_enrollments, messages, early_access_users,
//   course_final_assessments + course_final_assessment_attempts (dump-OBSERVED
//     insert keys), transcripts, lesson_resources, avatars
// and seeds: reference `am_challenge` row (KES 1,980 → ZMW 307), the 4
// `announcements` rows (rebranded), platform_settings + user_roles bootstrap.
//
// Usage:  node --env-file=.env.local scripts/db-phase8.mjs

import { createClient } from '@libsql/client/node'
const url = process.env.TURSO_DATABASE_URL
const token = process.env.TURSO_AUTH_TOKEN
if (!url) { console.error('TURSO_DATABASE_URL missing'); process.exit(1) }
const client = createClient({ url, authToken: token || undefined })

const run = async (sql, args = []) => client.execute({ sql, args })

const DDL = [
  // ---- AM Challenge (dump: am_challenge.json has the 1 config row) ----------
  `CREATE TABLE IF NOT EXISTS am_challenge (
     id TEXT PRIMARY KEY, title TEXT, subtitle TEXT, description TEXT,
     start_date TEXT, duration_days INTEGER, price REAL, currency TEXT,
     access_start_time TEXT, access_end_time TEXT, timezone TEXT,
     min_days_for_certificate INTEGER, passing_grade REAL, is_active INTEGER,
     allow_replays INTEGER, created_at TEXT, updated_at TEXT)`,
  // day_number / title / video / quiz observed in the CourseLessonRoute + Day10 chunks
  `CREATE TABLE IF NOT EXISTS am_challenge_days (
     id TEXT PRIMARY KEY, challenge_id TEXT, day_number INTEGER, title TEXT,
     description TEXT, video_url TEXT, video_provider TEXT, duration_minutes INTEGER,
     quiz_questions TEXT, notes TEXT, is_active INTEGER, created_at TEXT)`,
  `CREATE TABLE IF NOT EXISTS am_challenge_checkins (
     id TEXT PRIMARY KEY, challenge_id TEXT, enrollment_id TEXT, student_id TEXT,
     checkin_date TEXT, day_number INTEGER, notes TEXT, points_earned REAL,
     created_at TEXT)`,
  `CREATE TABLE IF NOT EXISTS am_challenge_enrollments (
     id TEXT PRIMARY KEY, challenge_id TEXT, student_id TEXT, student_name TEXT,
     student_email TEXT, phone TEXT, payment_reference TEXT, amount_paid REAL,
     currency TEXT, payment_method TEXT, payment_status TEXT, enrolled_at TEXT,
     current_streak INTEGER, best_streak INTEGER, days_completed INTEGER,
     last_checkin_date TEXT, total_daily_score INTEGER, final_quiz_score REAL,
     certificate_issued INTEGER, certificate_issued_at TEXT, created_at TEXT,
     updated_at TEXT)`,
  `CREATE TABLE IF NOT EXISTS am_challenge_progress (
     id TEXT PRIMARY KEY, enrollment_id TEXT, student_id TEXT, day_id TEXT,
     lesson_completed INTEGER, lesson_completed_at TEXT, notes TEXT,
     quiz_answers TEXT, quiz_completed INTEGER, quiz_completed_at TEXT,
     quiz_score REAL, created_at TEXT)`,
  `CREATE TABLE IF NOT EXISTS am_challenge_final_assessment_config (
     id TEXT PRIMARY KEY, challenge_id TEXT, title TEXT, description TEXT,
     questions TEXT, total_questions INTEGER, passing_grade REAL,
     time_limit_minutes INTEGER, assessment_date TEXT, timezone TEXT,
     is_active INTEGER, created_at TEXT, updated_at TEXT)`,
  `CREATE TABLE IF NOT EXISTS am_challenge_final_assessment_attempts (
     id TEXT PRIMARY KEY, assessment_config_id TEXT, challenge_id TEXT, enrollment_id TEXT, student_id TEXT, score REAL,
     answers TEXT, passed INTEGER, submitted_at TEXT, timezone TEXT, user_agent TEXT)`,
  `CREATE TABLE IF NOT EXISTS am_challenge_certificates (
     id TEXT PRIMARY KEY, enrollment_id TEXT, student_id TEXT, certificate_number TEXT,
     student_name TEXT, challenge_year INTEGER, issue_date TEXT, certificate_data TEXT,
     created_at TEXT)`,
  // prep/exec assessment surfaces (chunks reference issue/count aggregation)
  `CREATE TABLE IF NOT EXISTS am_challenge_prep_assessments (
     id TEXT PRIMARY KEY, enrollment_id TEXT, student_id TEXT, day_number INTEGER,
     answers TEXT, score REAL, submitted_at TEXT, created_at TEXT)`,
  `CREATE TABLE IF NOT EXISTS am_challenge_exec_assessments (
     id TEXT PRIMARY KEY, enrollment_id TEXT, student_id TEXT,
     submitted_url TEXT, note TEXT, status TEXT, reviewed_by TEXT, feedback TEXT,
     submitted_at TEXT, created_at TEXT)`,
]

const LAB_DDL = [
  // ---- Reading Lab (exact dump columns from reading_labs.json) ------------
  `CREATE TABLE IF NOT EXISTS reading_labs (id TEXT PRIMARY KEY, title TEXT, book_name TEXT, author TEXT, cover_image_url TEXT, description TEXT, duration_days INTEGER, start_date TEXT, end_date TEXT, status TEXT, is_enrollment_open INTEGER, is_active INTEGER, max_inactive_days INTEGER, warning_day_2 INTEGER, warning_day_3 INTEGER, warning_day_4 INTEGER, enable_temp_lock INTEGER, enable_removal INTEGER, created_at TEXT, updated_at TEXT, created_by TEXT)`,
  `CREATE TABLE IF NOT EXISTS reading_lab_days (id TEXT PRIMARY KEY, reading_lab_id TEXT, day_number INTEGER, title TEXT, reading_assignment TEXT, thinking_prompts TEXT, created_at TEXT)`,
  `CREATE TABLE IF NOT EXISTS reading_lab_enrollments (id TEXT PRIMARY KEY, reading_lab_id TEXT, student_id TEXT, nickname TEXT, status TEXT, current_day INTEGER, last_active_date TEXT, completed_at TEXT, consecutive_inactive_days INTEGER, joined_at TEXT, created_at TEXT, updated_at TEXT)`,
  `CREATE TABLE IF NOT EXISTS reading_lab_progress (id TEXT PRIMARY KEY, lab_id TEXT, enrollment_id TEXT, student_id TEXT, day_id TEXT, day_number INTEGER, pages_read TEXT, reading_completed INTEGER, completed_at TEXT, created_at TEXT)`,
  `CREATE TABLE IF NOT EXISTS reading_lab_day_responses (id TEXT PRIMARY KEY, enrollment_id TEXT, student_id TEXT, day_number INTEGER, thinking_prompt TEXT, response TEXT, submitted_at TEXT, created_at TEXT)`,
  `CREATE TABLE IF NOT EXISTS reading_lab_reflections (id TEXT PRIMARY KEY, enrollment_id TEXT, student_id TEXT, day_number INTEGER, key_lesson TEXT, reflection TEXT, apply_action TEXT, submitted_at TEXT, created_at TEXT)`,
  `CREATE TABLE IF NOT EXISTS reading_lab_habits (id TEXT PRIMARY KEY, reading_lab_id TEXT, title TEXT, description TEXT, sort_order INTEGER, created_at TEXT)`,
  `CREATE TABLE IF NOT EXISTS reading_lab_student_habits (id TEXT PRIMARY KEY, enrollment_id TEXT, habit_id TEXT, active INTEGER, created_at TEXT)`,
  `CREATE TABLE IF NOT EXISTS reading_lab_habit_checkins (id TEXT PRIMARY KEY, enrollment_id TEXT, habit_id TEXT, student_id TEXT, day_number INTEGER, completed INTEGER, checkin_date TEXT, created_at TEXT)`,
  `CREATE TABLE IF NOT EXISTS reading_lab_weekly_summaries (id TEXT PRIMARY KEY, enrollment_id TEXT, student_id TEXT, week_number INTEGER, lessons_learned TEXT, win TEXT, challenge_faced TEXT, habit_implemented TEXT, submitted_at TEXT, created_at TEXT)`,
  `CREATE TABLE IF NOT EXISTS reading_lab_certificates (id TEXT PRIMARY KEY, enrollment_id TEXT, student_id TEXT, student_name TEXT, reading_lab_title TEXT, book_name TEXT, duration_days INTEGER, days_completed INTEGER, attendance_percentage INTEGER, reflections_submitted INTEGER, habit_consistency_score INTEGER, certificate_number TEXT, certificate_data TEXT, issue_date TEXT, created_at TEXT)`,
  `CREATE TABLE IF NOT EXISTS reading_lab_announcements (id TEXT PRIMARY KEY, reading_lab_id TEXT, title TEXT, message TEXT, is_published INTEGER, created_at TEXT)`,
  `CREATE TABLE IF NOT EXISTS reading_lab_chat_messages (id TEXT PRIMARY KEY, reading_lab_id TEXT, enrollment_id TEXT, sender TEXT, sender_name TEXT, content TEXT, created_at TEXT)`,
  `CREATE TABLE IF NOT EXISTS reading_lab_chat_reactions (id TEXT PRIMARY KEY, message_id TEXT, enrollment_id TEXT, sender TEXT, reaction TEXT, created_at TEXT)`,
]

// ---- Tickets, announcements, reviews, assignments, darasa ------------------
const OPS_DDL = [
  `CREATE TABLE IF NOT EXISTS tickets (id TEXT PRIMARY KEY, student_id TEXT, student_name TEXT, student_email TEXT, subject TEXT, category TEXT, message TEXT,
     status TEXT DEFAULT 'open', is_read INTEGER, created_at TEXT, updated_at TEXT)`,
  `CREATE TABLE IF NOT EXISTS ticket_messages (
     id TEXT PRIMARY KEY, ticket_id TEXT, sender_id TEXT, sender_role TEXT,
     sender_name TEXT, message TEXT, attachment_url TEXT, created_at TEXT)`,
  `CREATE TABLE IF NOT EXISTS announcements (
     id TEXT PRIMARY KEY, title TEXT, message TEXT, content TEXT, target_type TEXT,
     target_course_id TEXT, target_cohort_id TEXT, scheduled_publish_date TEXT,
     is_published INTEGER, audience_type TEXT, visibility_status TEXT, published_at TEXT,
     enable_notifications INTEGER, views_count INTEGER, attachments TEXT, author_id TEXT,
     created_at TEXT, updated_at TEXT)`,
  `CREATE TABLE IF NOT EXISTS announcement_views (
     id TEXT PRIMARY KEY, student_id TEXT, announcement_id TEXT, viewed_at TEXT, acknowledged INTEGER)`,
  `CREATE TABLE IF NOT EXISTS reviews (
     id TEXT PRIMARY KEY, student_id TEXT, item_id TEXT, item_type TEXT, item_title TEXT,
     rating INTEGER, text TEXT, status TEXT DEFAULT 'pending', created_at TEXT)`,
  `CREATE TABLE IF NOT EXISTS review_requests (
     id TEXT PRIMARY KEY, student_id TEXT, student_email TEXT, student_name TEXT, item_type TEXT, item_id TEXT, item_title TEXT,
     token TEXT, status TEXT, snoozed_until TEXT, created_at TEXT, sent_at TEXT)`,
  `CREATE TABLE IF NOT EXISTS assignments (id TEXT PRIMARY KEY, course_id TEXT, cohort_id TEXT, title TEXT, description TEXT, due_date TEXT, weight INTEGER, is_active INTEGER, created_at TEXT)`,
  `CREATE TABLE IF NOT EXISTS assignment_submissions (id TEXT PRIMARY KEY, assignment_id TEXT, student_id TEXT, submission_file_url TEXT, submission_text TEXT, ink TEXT, note TEXT, status TEXT, declared INTEGER, feedback TEXT, reviewed_by TEXT, submitted_at TEXT, created_at TEXT)`,
  `CREATE TABLE IF NOT EXISTS darasa_sessions (id TEXT PRIMARY KEY, session_key TEXT, title TEXT, description TEXT, session_type TEXT, host TEXT, scheduled_text TEXT, starts_at TEXT, seconds INTEGER, seats INTEGER, platform TEXT, is_active INTEGER, created_at TEXT)`,
  `CREATE TABLE IF NOT EXISTS darasa_signups (id TEXT PRIMARY KEY, session_key TEXT, full_name TEXT, email TEXT, whatsapp TEXT, source TEXT, signed_up_at TEXT, created_at TEXT)`,
  `CREATE TABLE IF NOT EXISTS user_roles (user_id TEXT, email TEXT, role TEXT, created_at TEXT)`,
  `CREATE TABLE IF NOT EXISTS admin_users (id TEXT PRIMARY KEY, user_id TEXT, name TEXT, email TEXT, created_at TEXT)`,
  `CREATE TABLE IF NOT EXISTS admin_otp_codes (id TEXT PRIMARY KEY, user_id TEXT, code TEXT, purpose TEXT, expires_at TEXT, used INTEGER, created_at TEXT)`,
  `CREATE TABLE IF NOT EXISTS training_session_enrollments (id TEXT PRIMARY KEY, course_id TEXT, session_key TEXT, student_name TEXT, student_email TEXT, phone TEXT, payment_reference TEXT, amount REAL, currency TEXT, payment_method TEXT, status TEXT, enrolled_at TEXT, created_at TEXT)`,
  `CREATE TABLE IF NOT EXISTS messages (id TEXT PRIMARY KEY, sender_id TEXT, sender_role TEXT, receiver_id TEXT, subject TEXT, content TEXT, attachment_url TEXT, status TEXT, created_at TEXT)`,
  `CREATE TABLE IF NOT EXISTS early_access_users (id TEXT PRIMARY KEY, email TEXT, name TEXT, source TEXT, created_at TEXT)`,
  `CREATE TABLE IF NOT EXISTS course_final_assessments (id TEXT PRIMARY KEY, course_id TEXT, title TEXT, description TEXT, questions TEXT, total_questions INTEGER, passing_score REAL,
     retake_fee_kes REAL, show_results_immediately INTEGER, shuffle_questions INTEGER, shuffle_options INTEGER, time_limit_minutes INTEGER, is_published INTEGER, created_at TEXT, updated_at TEXT)`,
  `CREATE TABLE IF NOT EXISTS course_final_assessment_attempts (id TEXT PRIMARY KEY, course_id TEXT, assessment_id TEXT, enrollment_id TEXT, student_id TEXT, attempt_number INTEGER, status TEXT, score REAL, answers TEXT, start_time TEXT, end_time TEXT, created_at TEXT)`,
  `CREATE TABLE IF NOT EXISTS transcripts (id TEXT PRIMARY KEY, student_id TEXT, student_name TEXT, item_type TEXT, item_id TEXT, item_title TEXT, lessons_total INTEGER, lessons_completed INTEGER,
     quiz_average REAL, certificate_number TEXT, items TEXT, share_token TEXT, issued_at TEXT, created_at TEXT)`,
  `CREATE TABLE IF NOT EXISTS lesson_resources (id TEXT PRIMARY KEY, lesson_id TEXT, title TEXT, kind TEXT, url TEXT, file_path TEXT, mime_type TEXT, size_bytes INTEGER, sort_order INTEGER, created_at TEXT)`,
  `CREATE TABLE IF NOT EXISTS avatars (id TEXT PRIMARY KEY, user_id TEXT, student_id TEXT, mime_type TEXT, size_bytes INTEGER, data TEXT, updated_at TEXT)`,
  `CREATE TABLE IF NOT EXISTS platform_settings (id TEXT PRIMARY KEY, category TEXT, key TEXT, value TEXT, description TEXT, updated_by TEXT, created_at TEXT, updated_at TEXT)`,
  `CREATE TABLE IF NOT EXISTS meta_events (id TEXT PRIMARY KEY, event_name TEXT, event_id TEXT, course_id TEXT, student_email TEXT, payload TEXT, tracked INTEGER, created_at TEXT)`,
  `CREATE TABLE IF NOT EXISTS skill_checks (id TEXT PRIMARY KEY, title TEXT, description TEXT, level_hint TEXT, is_featured INTEGER, is_free INTEGER, price REAL, member_price REAL, currency TEXT,
     retake_discount_pct INTEGER, duration_minutes INTEGER, questions TEXT, candidate_job_paths TEXT, is_active INTEGER, created_at TEXT, updated_at TEXT)`,
  `CREATE TABLE IF NOT EXISTS skill_check_attempts (id TEXT PRIMARY KEY, skill_check_id TEXT, student_id TEXT, student_name TEXT, student_email TEXT, status TEXT, answers TEXT, score REAL,
     topic_scores TEXT, weakest_topics TEXT, is_free INTEGER, payment_reference TEXT, amount_paid REAL, currency TEXT, start_time TEXT, submitted_at TEXT, share_token TEXT, created_at TEXT)`,
  `CREATE TABLE IF NOT EXISTS skill_check_credits (id TEXT PRIMARY KEY, student_id TEXT, user_id TEXT, skill_check_id TEXT, amount REAL, source TEXT, note TEXT, created_at TEXT)`,
]

async function main() {
  const batch = []
  for (const sql of [...DDL, ...LAB_DDL, ...OPS_DDL]) batch.push({ sql })
  const half = Math.ceil(batch.length / 2)
  await client.batch(batch.slice(0, half).map(s => ({ sql: s.sql })), 'write')
  await client.batch(batch.slice(half).map(s => ({ sql: s.sql })), 'write')

  // ---- seeds ------------------------------------------------------------
  // am_challenge config row (KES 1,980 → ZMW 307 at rate 0.155)
  await run(`INSERT OR IGNORE INTO am_challenge (id,title,subtitle,description,start_date,duration_days,price,currency,access_start_time,access_end_time,timezone,min_days_for_certificate,passing_grade,is_active,allow_replays,created_at,updated_at)
    VALUES ('5d0d79cc-2cdd-4ff9-a1ab-677d38b3ea44','The 5AM Challenge','Wake up at 5AM, watch the lesson, check in, and build the streak.',
      'A 21-day commitment challenge. Every morning 05:00–09:00 you open the lesson, take the quick quiz, and check in. Miss two days in a row and you are out. The streak is the reward.',
      '2026-12-01','21', 307, 'ZMW', '05:00', '09:00', 'Africa/Lusaka', 17, 70, 1, 1, '2026-11-03T08:00:00Z', '2026-11-03T08:00:00Z')`)

  // reference announcements.json — 4 rows, rebranded (Elvis → George, KES → ZMW)
  await run(`INSERT INTO announcements (id,title,message,content,target_type,is_published,audience_type,visibility_status,enable_notifications,views_count,created_at)
    VALUES ('b6d2b025-7f34-46f1-ac9e-897b80d05f35','Welcome to the Learn2Earn community!','Hi George here 👋 welcome to your Learn2Earn account. Pick any course and go straight to the first lesson.',
      '<p>Hi George here 👋 welcome to your Learn2Earn account.</p><p>Pick any course and go straight to the first lesson. If you are stuck or completely flipped, ask a support ticket. Real answers, quick.</p>','all',1,'everyone','published',0,0,'2026-11-03 07:00:00')
    ON CONFLICT(id) DO NOTHING`)
  await run(`INSERT INTO announcements (id,title,message,content,target_type,is_published,audience_type,visibility_status,enable_notifications,views_count,created_at)
    VALUES ('b21a5299-863f-468b-be17-199504ed58f8','New changes on classes','Live class pages now show replays for enrolled students. Watch at your own pace — recordings stay in your dashboard.',
      '<p>Live class pages now show replays for enrolled students. Watch at your own pace — recordings stay in your dashboard.</p>','all',1,'everyone','published',0,0,'2026-11-03 08:00:00')
    ON CONFLICT(id) DO NOTHING`)
  await run(`INSERT INTO announcements (id,title,message,content,target_type,is_published,audience_type,visibility_status,enable_notifications,views_count,created_at)
    VALUES ('f773c256-aad2-4f08-a2b2-aaec5a21b6ca','How certificates work','Complete the final one, and every section completed. Send one piece of work, George reviews it and releases your certificate in 48 hours.',
      '<p>Complete the final one, and every section completed. Send one piece of work. George reviews it and releases your certificate in 48 hours.</p>','all',1,'everyone','published',0,0,'2026-11-03 09:00:00')
    ON CONFLICT(id) DO NOTHING`)
  await run(`INSERT INTO announcements (id,title,message,content,target_type,is_published,audience_type,visibility_status,enable_notifications,views_count,created_at)
    VALUES ('c9820400-8759-451b-bdaa-dcee2172ce12','Subscribe and save with the plan','All 23 courses are included in the Learn2Earn plan from ZMW 432. Pay once with MTN/Airtel money or card. No automatic charges.',
      '<p>All 23 courses are included in the Learn2Earn plan from ZMW 432. Pay once with MTN/Airtel money or card. No automatic charges.</p><p><a href="/subscribe">See the plans →</a></p>','all',1,'everyone','published',0,0,'2026-11-03 10:00:00')
    ON CONFLICT(id) DO NOTHING`)
  await run(`INSERT INTO platform_settings (id,category,key,value,description,updated_by,created_at,updated_at)
    VALUES ('e8f7d3f2-2a29-49b3-8f55-2b3467cc6ae2','platform','site','{"name":"Learn2Earn","currency":"ZMW","rate":0.155,"whatsapp":"0979982819"}','Site-wide JSON settings','system','2026-11-03 08:00:00','2026-11-03T08:00:00Z')
    ON CONFLICT(id) DO NOTHING`)

  // 5AM challenge day skeleton (21 days, one quick quiz each; render is DB-first)
  await run(`DELETE FROM am_challenge_days WHERE challenge_id='5d0d79cc-2cdd-4ff9-a1ab-677d38b3ea44'`)
  for (let d = 1; d <= 21; d++) {
    await run(`INSERT INTO am_challenge_days (id,challenge_id,day_number,title,description,video_url,video_provider,duration_minutes,quiz_questions,notes,is_active,created_at)
      VALUES (?,?,?,?,?,?,?,?,?,?,1,'2026-11-03T08:00:00Z')`,
      [`amd-5d0d79cc-21-${d}`, '5d0d79cc-2cdd-4ff9-a1ab-677d38b3ea44', d,
       `Day ${d} — Show up and execute`,
       'Morning lesson for the 5AM window. Watch it before you check in.',
       null, null, 12,
       JSON.stringify([{ id: `amd-${d}-q1`, question: 'What is the one commitment for this challenge each morning?', options: ['Check in after watching the lesson', 'Skip if sleepy', 'Wake at noon instead', 'Wait for motivation'], correct: 0 }]),
       d === 10 ? 'Day 10 carries the checkpoint quiz — its score counts toward your certificate.' : null])
  }

  // Reading Lab seed = reference reading_labs.json row (course is free;
  // cover image uses a local placeholder — the cdn.atticbooks URL is Kenya-side)
  await run(`INSERT OR IGNORE INTO reading_labs (id,title,book_name,author,cover_image_url,description,duration_days,start_date,end_date,status,is_enrollment_open,is_active,max_inactive_days,warning_day_2,warning_day_3,warning_day_4,enable_temp_lock,enable_removal,created_at,updated_at,created_by)
    VALUES ('7f122a31-ea0e-46f5-826a-4ad217a76814','Who Moved My Cheese? – 14-Day Reading Lab','Who Moved My Cheese?','Spencer Johnson',NULL,
      'This is a commitment-based, guided reading experience designed to help learners understand change, overcome fear, and build consistency through daily reading and reflection. This is not a casual book club.',
      14,'2026-12-01','2026-12-14','free',1,1,5,1,1,1,1,1,'2026-11-03T08:00:00Z','2026-11-03T08:00:00Z',NULL)`)
  // day plan: 14 days with reading assignment + thinking prompts each
  await run(`DELETE FROM reading_lab_days WHERE reading_lab_id='7f122a31-ea0e-46f5-826a-4ad217a76814'`)
  const dayPrompts = [
    ['Pages 1–12', "What does the 'maze' in this story remind you of in your own life today?"],
    ['Pages 13–24', 'Which character do you most behave like when something changes: Sniff, Scurry, Hem or Haw?'],
    ['Pages 25–36', 'Name one "cheese" you are holding onto that is no longer serving you.'],
    ['Pages 37–48', 'What fear has kept you from moving to new cheese — in work, money or skills?'],
    ['Pages 49–60', 'What is one small step you could take this week toward new cheese?'],
    ['Pages 61–72', 'How did it feel the last time you adapted quickly? What made it possible?'],
    ['Pages 73–84', 'Haw writes lessons on the wall. What would your wall say today?'],
    ['Pages 85–96', 'Where have you been "smelling the cheese less" — checking for change too late?'],
    ['Pages 97–108', 'What is one thing you expect to change in your industry in the next 2 years?'],
    ['Pages 109–120', 'When is imagination useful in adapting — and when is it denial?'],
    ['Pages 121–132', 'Which habit from this list would make change easier: reading daily, asking for feedback, saving money, building in public?'],
    ['Pages 133–144', 'What moved without you noticing? Clients, tools, people, prices?'],
    ['Pages 145–156', "What's your new cheese — describe it concretely."],
    ['Pages 157 to the end', 'Write the one-sentence version of the book you could teach a friend tomorrow.'],
  ]
  for (let d = 1; d <= 14; d++) {
    const [assignment, prompt] = dayPrompts[d - 1]
    await run(`INSERT INTO reading_lab_days (id,reading_lab_id,day_number,title,reading_assignment,thinking_prompts,created_at)
      VALUES (?,?,?,?,?,?, '2026-11-03T08:00:00Z')`,
      [`rld-7f122a31-${d}`, '7f122a31-ea0e-46f5-826a-4ad217a76814', d,
       `Day ${d}`, assignment, JSON.stringify([prompt, 'What would you tell a person in this labyrinth that you know better today?'])])
  }
  // starter habits from the reference's tips list
  const habits = [
    ['Set a consistent reading time', 'Same time each day. Morning works best for most students.'],
    ['Take notes while you read', 'Notes make reflections easy and honest.'],
    ['Engage in the community chat', 'Learn from others — share one insight per day.'],
    ['Apply one small lesson daily', 'Focus on applying one small lesson each day.'],
  ]
  for (let i = 0; i < habits.length; i++) {
    const [t, d] = habits[i]
    await run(`INSERT INTO reading_lab_habits (id,reading_lab_id,title,description,sort_order,created_at)
      VALUES (?,?,?,?,?,'2026-11-03T08:00:00Z')`,
      [`rlh-7f122a31-${i + 1}`, '7f122a31-ea0e-46f5-826a-4ad217a76814', t, d, i + 1])
  }

  // skill_checks seed — one free taster-style check + one full check.
  // Price rebranded from reference "Every Little Thing" — no dump rows, so
  // these are demo products (flagged non-authoritative like cohort lessons).
  const skillCheckQuestions = JSON.stringify([
    { id:'q1', topic:'Computer basics', question:'Which of these is a practical digital skill you can monetize online?', options:['Watching TikTok videos','Social media management','Scrolling Facebook','Playing mobile games'], correct:1, type:'single' },
    { id:'q2', topic:'Computer basics', question:'What is the most important factor when choosing a digital skill to learn?', options:['What your friends are doing','Market demand and your interest','What looks easiest','What costs the least'], correct:1, type:'single' },
    { id:'q3', topic:'Internet tools', question:'Where do you go to check if an email sender is legitimate (not a scam)?', options:['Sender email exact spelling','Grammar only','Number of emojis','Whether it is long'], correct:0, type:'single' },
    { id:'q4', topic:'Internet tools', question:'You want to email a 25 MB file. What is the practical option?', options:['Attach to email anyway','Compress or upload to Drive and share the link','Print and post it','Email it twice'], correct:1, type:'single' },
    { id:'q5', topic:'Productivity', question:'Which tool combination best describes a basic remote-work stack?', options:['Calculator + radio','Google Docs + WhatsApp Business + Canva','DSLR + printer','None of these'], correct:1, type:'single' },
  ])
  await run(`INSERT INTO skill_checks (id,title,description,level_hint,is_featured,is_free,price,member_price,currency,retake_discount_pct,duration_minutes,questions,candidate_job_paths,is_active,created_at,updated_at)
    VALUES
      ('sc-taster-01','Digital Literacy Taster','A free 5-question taster. See your rough level in about 5 minutes.','Beginner',0,1,0,0,'ZMW',0,5,'${skillCheckQuestions}','["Social media manager","Virtual assistant","Customer support"]',1,'2026-11-03T08:00:00Z','2026-11-03T08:00:00Z'),
      ('sc-full-01','Full Digital Skills SkillCheck','20 questions, 25 minutes. You get a Skill Report with a QR code anyone can check, score by topic and the exact course to fix each weak area.','All levels',1,0,129,86,'ZMW',0,25, NULL,'["Social media manager","Virtual assistant","Data entry"]',1,'2026-11-03T08:00:00Z','2026-11-03T08:00:00Z')`)
  // the full check's question bank is regenerated by the admin SkillCheck page

  const cnt = await client.execute({ sql: `SELECT
    (SELECT COUNT(*) FROM announcements WHERE id IN ('b6d2b025-7f34-46f1-ac9e-897b80d05f35','b21a5299-863f-468b-be17-199504ed58f8','f773c256-aad2-4f08-a2b2-aaec5a21b6ca','c9820400-8759-451b-bdaa-dcee2172ce12')) AS ann,
    (SELECT COUNT(*) FROM am_challenge_days) AS days,
    (SELECT COUNT(*) FROM reading_lab_days WHERE reading_lab_id='7f122a31-ea0e-46f5-826a-4ad217a76814') AS lab_days,
    (SELECT COUNT(*) FROM skill_checks) AS checks,
    (SELECT COUNT(*) FROM am_challenge) AS ch` })
  const r = cnt.rows[0] ?? {}
  console.log('seed verify:', { ann: r.ann, days: r.days, labDays: r.lab_days, checks: r.checks, challenges: r.ch })
  console.log('Phase 8 schema ready:', DDL.length + LAB_DDL.length + OPS_DDL.length, 'tables')
}

main().catch(e => { console.error(e); process.exit(1) })
