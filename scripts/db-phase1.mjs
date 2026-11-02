#!/usr/bin/env node
// Phase 1 DB setup: adds course, lesson, quiz, and gamification tables + seeds
// with real reference data + achievement definitions.
//
// Usage:  node --env-file=.env.local scripts/db-phase1.mjs

import { createClient } from '@libsql/client/node'
const url = process.env.TURSO_DATABASE_URL
const token = process.env.TURSO_AUTH_TOKEN
if (!url) { console.error('TURSO_DATABASE_URL missing'); process.exit(1) }
const client = createClient({ url, authToken: token || undefined })

// Phase 0 placeholder had courses(id, title, description, price, original_price, created_at).
// ALTER TABLE to add remaining columns (IF NOT EXISTS does not extend tables).
await (async () => {
  const needs = [
    'slug text', 'excerpt text', 'category text', 'tags text',
    'currency text DEFAULT \'ZMW\'', 'duration text', 'lessons_count INTEGER DEFAULT 0',
    'level text DEFAULT \'beginner\'', 'status text DEFAULT \'draft\'', 'featured INTEGER DEFAULT 0',
    'image text', 'curriculum text', 'is_published INTEGER DEFAULT 0',
    'updated_at INTEGER DEFAULT (unixepoch())', 'deleted_at INTEGER'
  ]
  const have = (await client.execute('PRAGMA table_info(courses)')).rows.map(r => r.name)
  for (const colDef of needs) {
    const col = colDef.split(' ')[0]
    if (!have.includes(col)) {
      try { await client.execute(`ALTER TABLE courses ADD COLUMN ${colDef}`); } catch {}
    }
  }
})()

const DDL = `
-- Phase 1 tables (skip if already created by Phase 0)
CREATE TABLE IF NOT EXISTS courses (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  excerpt TEXT,
  category TEXT,
  tags TEXT,
  price REAL,
  original_price REAL,
  currency TEXT DEFAULT 'ZMW',
  duration TEXT,
  lessons_count INTEGER DEFAULT 0,
  level TEXT DEFAULT 'beginner',
  status TEXT DEFAULT 'draft',
  featured INTEGER DEFAULT 0,
  image TEXT,
  curriculum TEXT,
  is_published INTEGER DEFAULT 0,
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch()),
  deleted_at INTEGER
);
CREATE UNIQUE INDEX IF NOT EXISTS courses_slug_uq ON courses(slug);

CREATE TABLE IF NOT EXISTS course_sections (
  id TEXT PRIMARY KEY,
  course_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  section_order INTEGER DEFAULT 0,
  created_at INTEGER DEFAULT (unixepoch())
);
CREATE INDEX IF NOT EXISTS course_sections_course_idx ON course_sections(course_id);

CREATE TABLE IF NOT EXISTS lessons (
  id TEXT PRIMARY KEY,
  course_id TEXT NOT NULL,
  section_id TEXT,
  title TEXT NOT NULL,
  lesson_order INTEGER DEFAULT 0,
  video_url TEXT,
  notes TEXT,
  document_url TEXT,
  duration_minutes INTEGER,
  lesson_type TEXT DEFAULT 'video',
  content TEXT,
  is_preview INTEGER DEFAULT 0,
  quiz_data TEXT,
  video_provider TEXT,
  description TEXT,
  learning_outcomes TEXT,
  timestamps TEXT,
  seo_keywords TEXT,
  admin_notes TEXT,
  deleted_at INTEGER,
  video_processing TEXT,
  source_session_id TEXT,
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);
CREATE INDEX IF NOT EXISTS lessons_course_idx ON lessons(course_id);
CREATE INDEX IF NOT EXISTS lessons_section_idx ON lessons(section_id);

CREATE TABLE IF NOT EXISTS course_lesson_quizzes (
  id TEXT PRIMARY KEY,
  lesson_id TEXT NOT NULL,
  course_id TEXT,
  title TEXT,
  passing_score INTEGER DEFAULT 70,
  time_limit_minutes INTEGER,
  questions TEXT,
  is_published INTEGER DEFAULT 0,
  created_at INTEGER DEFAULT (unixepoch())
);
CREATE INDEX IF NOT EXISTS quiz_lesson_idx ON course_lesson_quizzes(lesson_id);

CREATE TABLE IF NOT EXISTS course_lesson_quiz_attempts (
  id TEXT PRIMARY KEY,
  quiz_id TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  course_id TEXT,
  student_id TEXT NOT NULL,
  enrollment_id TEXT,
  score INTEGER DEFAULT 0,
  max_score INTEGER DEFAULT 0,
  percentage INTEGER DEFAULT 0,
  passed INTEGER DEFAULT 0,
  answers TEXT,
  started_at TEXT,
  time_spent_seconds INTEGER,
  attempt_date TEXT,
  attempt_number INTEGER DEFAULT 1,
  created_at INTEGER DEFAULT (unixepoch())
);
CREATE INDEX IF NOT EXISTS quiz_attempt_student_idx ON course_lesson_quiz_attempts(student_id);
CREATE INDEX IF NOT EXISTS quiz_attempt_lesson_idx ON course_lesson_quiz_attempts(lesson_id);

CREATE TABLE IF NOT EXISTS achievement_definitions (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  points_reward INTEGER DEFAULT 0,
  criteria TEXT,
  created_at INTEGER DEFAULT (unixepoch())
);
CREATE UNIQUE INDEX IF NOT EXISTS achievement_code_uq ON achievement_definitions(code);

CREATE TABLE IF NOT EXISTS student_points (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  total_points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  points_to_next_level INTEGER DEFAULT 100,
  updated_at INTEGER DEFAULT (unixepoch())
);
CREATE UNIQUE INDEX IF NOT EXISTS student_points_student_uq ON student_points(student_id);

CREATE TABLE IF NOT EXISTS student_streaks (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date TEXT,
  updated_at INTEGER DEFAULT (unixepoch())
);
CREATE UNIQUE INDEX IF NOT EXISTS student_streaks_student_uq ON student_streaks(student_id);

CREATE TABLE IF NOT EXISTS student_achievements (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  achievement_id TEXT NOT NULL,
  earned_at TEXT,
  created_at INTEGER DEFAULT (unixepoch())
);
`

// Seed achievement definitions — reference behavior (CoursePlayer-2icA96ky.js)
// checks these codes after lesson completion.
const ACHIEVEMENTS = [
  { id: 'ach-first-lesson', code: 'first_lesson', name: 'First Steps', description: 'Complete your first lesson.', icon: '🎯', points_reward: 10, criteria: '{"type":"lesson_count","count":1}' },
  { id: 'ach-5-lessons', code: 'five_lessons', name: 'Quick Learner', description: 'Complete 5 lessons.', icon: '📚', points_reward: 25, criteria: '{"type":"lesson_count","count":5}' },
  { id: 'ach-10-lessons', code: 'ten_lessons', name: 'Learning Machine', description: 'Complete 10 lessons.', icon: '🎓', points_reward: 50, criteria: '{"type":"lesson_count","count":10}' },
  { id: 'ach-3-day-streak', code: 'three_day_streak', name: 'Consistency', description: 'Maintain a 3-day learning streak.', icon: '🔥', points_reward: 15, criteria: '{"type":"streak_days","count":3}' },
  { id: 'ach-50-points', code: 'fifty_points', name: 'Point Collector', description: 'Earn 50 points.', icon: '⭐', points_reward: 0, criteria: '{"type":"points_total","count":50}' },
]

// Seed a demo published course from the local COURSE_LESSONS data
const DEMO_COURSES = [
  {
    id: '3b6efcbb-716f-459e-a311-4b00ff56f5f7',
    slug: 'ai-productivity-digital-workflows',
    title: 'AI Productivity & Digital Workflows',
    description: 'Master AI tools and workflow automation.',
    excerpt: 'Learn to use AI to get more done every day.',
    category: 'AI',
    price: 2500,
    original_price: 3790,
    currency: 'ZMW',
    duration: '5 lessons',
    lessons_count: 5,
    level: 'beginner',
    status: 'published',
    featured: true,
    is_published: true,
  },
  {
    id: 'aa0e5a0e-5a0e-5a0e-5a0e-5a0e5a0e5a0e',
    slug: 'ai-automation-bootcamp',
    title: 'AI Automation Bootcamp',
    description: 'Build real automations with Make.com, Google Sheets, and AI.',
    excerpt: 'Automate your digital workflows from zero to hero.',
    category: 'Automation',
    price: 3500,
    original_price: 4990,
    currency: 'ZMW',
    duration: '8 lessons',
    lessons_count: 8,
    level: 'intermediate',
    status: 'published',
    featured: true,
    is_published: true,
  },
]

function mkLesson(id, courseId, title, order, videoUrl, duration, isPreview = false) {
  return {
    id, course_id: courseId, title, lesson_order: order,
    video_url: videoUrl, duration_minutes: duration,
    lesson_type: 'video', is_preview: isPreview ? 1 : 0,
  }
}

const DEMO_LESSONS = [
  mkLesson('l1-ai-prod', DEMO_COURSES[0].id, 'AI Fundamentals', 1, 'https://youtu.be/ai-productivity-1', 15, true),
  mkLesson('l2-ai-prod', DEMO_COURSES[0].id, 'Prompt Engineering', 2, 'https://youtu.be/ai-productivity-2', 14, false),
  mkLesson('l3-ai-prod', DEMO_COURSES[0].id, 'Content Creation with AI', 3, 'https://youtu.be/ai-productivity-3', 18, false),
  mkLesson('l4-ai-prod', DEMO_COURSES[0].id, 'Workflow Automation', 4, 'https://youtu.be/ai-productivity-4', 22, false),
  mkLesson('l5-ai-prod', DEMO_COURSES[0].id, 'AI Tools Stack', 5, 'https://youtu.be/ai-productivity-5', 15, false),

  mkLesson('l1-ai-auto', DEMO_COURSES[1].id, 'Introduction to AI Automation', 1, 'https://player.vimeo.com/video/ai-automation-1', 12, true),
  mkLesson('l2-ai-auto', DEMO_COURSES[1].id, 'Make.com from Scratch', 2, 'https://player.vimeo.com/video/ai-automation-2', 18, false),
  mkLesson('l3-ai-auto', DEMO_COURSES[1].id, 'Google Sheets as Automation Memory', 3, 'https://player.vimeo.com/video/ai-automation-3', 15, false),
  mkLesson('l4-ai-auto', DEMO_COURSES[1].id, 'AI Brain Integration', 4, 'https://player.vimeo.com/video/ai-automation-4', 22, false),
  mkLesson('l5-ai-auto', DEMO_COURSES[1].id, 'Gmail Auto-Reply Bot', 5, 'https://player.vimeo.com/video/ai-automation-5', 20, false),
  mkLesson('l6-ai-auto', DEMO_COURSES[1].id, 'Facebook Comments to Content', 6, 'https://player.vimeo.com/video/ai-automation-6', 16, false),
  mkLesson('l7-ai-auto', DEMO_COURSES[1].id, 'Make.com vs Zapier', 7, 'https://player.vimeo.com/video/ai-automation-7', 14, false),
  mkLesson('l8-ai-auto', DEMO_COURSES[1].id, 'Selling Automation Services', 8, 'https://player.vimeo.com/video/ai-automation-8', 19, false),
]

const DEMO_QUIZZES = [
  {
    id: 'q1-ai-prod', lesson_id: 'l5-ai-prod', course_id: DEMO_COURSES[0].id,
    title: 'AI Productivity Final Quiz', passing_score: 70, time_limit_minutes: 15,
    questions: JSON.stringify([
      { id: 'q1', question: 'What is the best way to structure AI prompts?', options: ['Be vague', 'Be specific with context', 'Use one word', 'Copy and paste everything'], correct: 1 },
      { id: 'q2', question: 'Which tool can automate workflows?', options: ['Make.com', 'Microsoft Paint', 'Calculator', 'Phone'], correct: 0 },
      { id: 'q3', question: 'AI can help with which of these?', options: ['Content creation', 'None of these', 'Only emails', 'Only spreadsheets'], correct: 0 },
    ]),
    is_published: 1,
  },
  {
    id: 'q1-ai-auto', lesson_id: 'l8-ai-auto', course_id: DEMO_COURSES[1].id,
    title: 'AI Automation Assessment', passing_score: 70, time_limit_minutes: 20,
    questions: JSON.stringify([
      { id: 'a1', question: 'What is an AI agent?', options: ['Executes tasks autonomously', 'Plays music', 'Takes photos', 'Sends emails only'], correct: 0 },
      { id: 'a2', question: 'Which tool is used for workflow automation?', options: ['Make.com', 'Microsoft Word', 'Adobe Photoshop', 'Spotify'], correct: 0 },
      { id: 'a3', question: 'What does Make.com do?', options: ['Connects apps for automation', 'Makes coffee', 'Designs websites', 'Prints documents'], correct: 0 },
    ]),
    is_published: 1,
  },
]

const stmts = DDL.split(';').map((s) => s.trim()).filter(Boolean)
const batch = []
for (const s of stmts) batch.push({ sql: s, args: [] })

for (const c of DEMO_COURSES) {
  batch.push({
    sql: `INSERT INTO courses (id, slug, title, description, excerpt, category, price, original_price, currency,
      duration, lessons_count, level, status, featured, is_published, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, unixepoch(), unixepoch())
     ON CONFLICT(id) DO UPDATE SET
       title=excluded.title, description=excluded.description, excerpt=excluded.excerpt,
       category=excluded.category, price=excluded.price, original_price=excluded.original_price,
       duration=excluded.duration, lessons_count=excluded.lessons_count, level=excluded.level,
       status=excluded.status, featured=excluded.featured, is_published=excluded.is_published,
       updated_at=unixepoch()`,
    args: [c.id, c.slug, c.title, c.description, c.excerpt, c.category, c.price, c.original_price,
      c.currency, c.duration, c.lessons_count, c.level, c.status, c.featured, c.is_published],
  })
}

for (const l of DEMO_LESSONS) {
  batch.push({
    sql: `INSERT INTO lessons (id, course_id, title, lesson_order, video_url, duration_minutes, lesson_type, is_preview, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, unixepoch(), unixepoch())
     ON CONFLICT(id) DO UPDATE SET
       title=excluded.title, lesson_order=excluded.lesson_order, video_url=excluded.video_url,
       duration_minutes=excluded.duration_minutes, is_preview=excluded.is_preview,
       updated_at=unixepoch()`,
    args: [l.id, l.course_id, l.title, l.lesson_order, l.video_url, l.duration_minutes, l.lesson_type, l.is_preview],
  })
}

for (const q of DEMO_QUIZZES) {
  batch.push({
    sql: `INSERT INTO course_lesson_quizzes (id, lesson_id, course_id, title, passing_score, time_limit_minutes, questions, is_published, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, unixepoch())
     ON CONFLICT(id) DO UPDATE SET
       title=excluded.title, passing_score=excluded.passing_score, questions=excluded.questions,
       is_published=excluded.is_published`,
    args: [q.id, q.lesson_id, q.course_id, q.title, q.passing_score, q.time_limit_minutes, q.questions, q.is_published],
  })
}

for (const a of ACHIEVEMENTS) {
  batch.push({
    sql: `INSERT INTO achievement_definitions (id, code, name, description, icon, points_reward, criteria, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, unixepoch())
     ON CONFLICT(id) DO UPDATE SET
       name=excluded.name, description=excluded.description, icon=excluded.icon,
       points_reward=excluded.points_reward, criteria=excluded.criteria`,
    args: [a.id, a.code, a.name, a.description, a.icon, a.points_reward, a.criteria],
  })
}

const res = await client.batch(batch, 'write')
console.log(`Applied ${batch.length} statements on ${url}`)

const coursesCount = await client.execute('SELECT COUNT(*) AS n FROM courses WHERE is_published = 1')
const lessonsCount = await client.execute('SELECT COUNT(*) AS n FROM lessons')
const quizzesCount = await client.execute('SELECT COUNT(*) AS n FROM course_lesson_quizzes WHERE is_published = 1')
const achievementsCount = await client.execute('SELECT COUNT(*) AS n FROM achievement_definitions')
console.log(`seed: ${coursesCount.rows[0].n} courses, ${lessonsCount.rows[0].n} lessons, ${quizzesCount.rows[0].n} quizzes, ${achievementsCount.rows[0].n} achievements`)
