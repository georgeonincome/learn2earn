/**
 * learn2earn — Phase 0 data model.
 *
 * 1:1 port of the reference (Click2Skill) Supabase schema to Turso/libSQL.
 * Column names are kept EXACTLY as the reference (snake_case) — see docs/parity/phase-0-foundation.md.
 * UUIDs are TEXT pk columns (drizzle generates v4 ids in JS; the raw SQL mirror below has a
 * matching SQL default for scripts).
 */
import { sqliteTable, text, integer, real, uniqueIndex, index } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

// ---------------------------------------------------------------------------
// Auth infrastructure — stand-in for Supabase `auth.users` (service we don't have)
// (flagged in docs/parity/phase-0-foundation.md Q2 — password session auth)
// ---------------------------------------------------------------------------

export const authUsers = sqliteTable('auth_users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text('email').notNull(),
  passwordHash: text('password_hash').notNull(),
  emailConfirmedAt: integer('email_confirmed_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

export const authSessions = sqliteTable('auth_sessions', {
  token: text('token').primaryKey(),
  userId: text('user_id').notNull().references(() => authUsers.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
})

// ---------------------------------------------------------------------------
// Students / profiles (reference: `students`)
// Call sites: Auth-DhBBJHb7.js signup insert `{...m, user_id, email}`;
// selects used everywhere: `id, email, full_name` (+ avatar_url via student_set_avatar)
// ---------------------------------------------------------------------------

export const students = sqliteTable('students', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id'),
  email: text('email'),
  fullName: text('full_name'),
  avatarUrl: text('avatar_url'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
})

// ---------------------------------------------------------------------------
// Enrollments (reference: `enrollments`)
// insert shapes from CourseCatalog/CourseDetail/Funnel:
//   {student_id, course_id, payment_status:"free"|"paid", enrollment_source,
//    amount_paid, payment_method, transaction_id}
// CoursePlayer updates `last_accessed`; select includes `completion_status`
// ---------------------------------------------------------------------------

export const enrollments = sqliteTable(
  'enrollments',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    studentId: text('student_id').notNull().references(() => students.id),
    courseId: text('course_id'),
    cohortId: text('cohort_id'), // nullable — Q3 in docs/parity/phase-0-foundation.md
    paymentStatus: text('payment_status'), // "free" | "paid"
    enrollmentSource: text('enrollment_source'),
    amountPaid: real('amount_paid'),
    paymentMethod: text('payment_method'),
    transactionId: text('transaction_id'),
    enrolledAt: text('enrolled_at'), // ISO datetime (reference stores ISO strings)
    lastAccessed: text('last_accessed'),
    completionStatus: text('completion_status'),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  },
  (t) => [
    uniqueIndex('enrollments_student_course_uq').on(t.studentId, t.courseId),
  ],
)

// ---------------------------------------------------------------------------
// Lesson progress (reference: `lesson_progress`)
// CoursePlayer upserts {student_id, lesson_id, enrollment_id, completed,
// completed_at, last_position_seconds} onConflict (student_id, lesson_id)
// ---------------------------------------------------------------------------

export const lessonProgress = sqliteTable(
  'lesson_progress',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    studentId: text('student_id').notNull(),
    lessonId: text('lesson_id').notNull(),
    enrollmentId: text('enrollment_id'),
    completed: integer('completed', { mode: 'boolean' }),
    completedAt: text('completed_at'),
    lastPositionSeconds: integer('last_position_seconds'),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  },
  (t) => [
    uniqueIndex('lesson_progress_student_lesson_uq').on(t.studentId, t.lessonId),
    index('lesson_progress_enrollment_idx').on(t.enrollmentId),
  ],
)

// ---------------------------------------------------------------------------
// Cohort enrollments (reference: `cohort_enrollments`)
// CohortAccess insert: {cohort_id, student_id, status:"active", payment_status:"paid",
//   payment_method:"access_token", amount_paid:0, enrollment_source:"access_token"}
// ---------------------------------------------------------------------------

export const cohortEnrollments = sqliteTable(
  'cohort_enrollments',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    cohortId: text('cohort_id').notNull(),
    studentId: text('student_id').notNull(),
    status: text('status'), // "active"
    paymentStatus: text('payment_status'),
    paymentMethod: text('payment_method'),
    amountPaid: real('amount_paid'),
    enrollmentSource: text('enrollment_source'),
    transactionId: text('transaction_id'),
    enrolledAt: text('enrolled_at'),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  },
  (t) => [
    uniqueIndex('cohort_enrollments_student_cohort_uq').on(t.studentId, t.cohortId),
  ],
)

// ---------------------------------------------------------------------------
// Cohort lesson progress (reference: `cohort_lesson_progress`)
// CohortPlayer upserts {enrollment_id, lesson_id, student_id, is_completed,
// completed_at, watch_time_seconds, position_seconds}
// conflict (enrollment_id, lesson_id)
// ---------------------------------------------------------------------------

export const cohortLessonProgress = sqliteTable(
  'cohort_lesson_progress',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    enrollmentId: text('enrollment_id').notNull(),
    lessonId: text('lesson_id').notNull(),
    studentId: text('student_id').notNull(),
    isCompleted: integer('is_completed', { mode: 'boolean' }),
    completedAt: text('completed_at'),
    watchTimeSeconds: integer('watch_time_seconds'),
    positionSeconds: integer('position_seconds'),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  },
  (t) => [
    uniqueIndex('clp_enrollment_lesson_uq').on(t.enrollmentId, t.lessonId),
  ],
)

// ---------------------------------------------------------------------------
// Cohort access tokens (reference: `enrollment_tokens` via validate_cohort_access_token)
// token columns from CohortAccess: id, cohort_id, name, max_uses, uses_count,
// valid_from, valid_until, is_active
// ---------------------------------------------------------------------------

export const enrollmentTokens = sqliteTable(
  'enrollment_tokens',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    cohortId: text('cohort_id').notNull(),
    name: text('name'),
    maxUses: integer('max_uses'),
    usesCount: integer('uses_count'),
    validFrom: text('valid_from'),
    validUntil: text('valid_until'),
    isActive: integer('is_active', { mode: 'boolean' }),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  },
  (t) => [index('enrollment_tokens_cohort_idx').on(t.cohortId)],
)

export const cohortTokenRedemptions = sqliteTable('cohort_token_redemptions', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  tokenId: text('token_id').notNull().references(() => enrollmentTokens.id),
  studentId: text('student_id').notNull().references(() => students.id),
  enrollmentId: text('enrollment_id'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
})

// ---------------------------------------------------------------------------
// Transactions — full payment audit trail (reference: `transactions`)
// insert shape from CourseCatalog:
//   {student_id, student_email, student_name, course_id, course_name,
//    payment_reference, amount, currency, original_price, discount_amount,
//    payment_method, payment_status, source, enrollment_source,
//    processed_by_name, transaction_date}
// StudentDashboard reads `source:"cohort"` rows and joins courses(id,title)
// ---------------------------------------------------------------------------

export const transactions = sqliteTable(
  'transactions',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    studentId: text('student_id'),
    studentEmail: text('student_email'),
    studentName: text('student_name'),
    courseId: text('course_id'),
    courseName: text('course_name'),
    cohortId: text('cohort_id'), // Q3 — flagged in docs/parity; used for source:"cohort" rows
    paymentReference: text('payment_reference'),
    amount: real('amount'),
    currency: text('currency'),
    originalPrice: real('original_price'),
    discountAmount: real('discount_amount'),
    planId: text('plan_id'), // subscription purchases — Q3b flagged in docs/parity
    paymentMethod: text('payment_method'),
    paymentStatus: text('payment_status'),
    source: text('source'), // "checkout" | "subscribe" | "cohort" ...
    enrollmentSource: text('enrollment_source'),
    processedByName: text('processed_by_name'),
    transactionDate: text('transaction_date'),
  },
  (t) => [
    uniqueIndex('transactions_reference_uq').on(t.paymentReference),
    index('transactions_student_idx').on(t.studentId),
  ],
)

// ---------------------------------------------------------------------------
// Subscription plans (reference: `subscription_plans` — exact dump columns)
// ---------------------------------------------------------------------------

export const subscriptionPlans = sqliteTable('subscription_plans', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  code: text('code'),
  name: text('name'),
  durationDays: integer('duration_days'),
  priceKes: real('price_kes'),
  priceUsd: real('price_usd'),
  isVisible: integer('is_visible', { mode: 'boolean' }),
  isRecommended: integer('is_recommended', { mode: 'boolean' }),
  sortOrder: integer('sort_order'),
  createdAt: text('created_at'),
  updatedAt: text('updated_at'),
})

// ---------------------------------------------------------------------------
// Subscriptions (reference: `subscriptions`) — columns = client contract of
// `subscription-summary` / `subscription-activate` (server DDL unavailable; Q4)
// ---------------------------------------------------------------------------

export const subscriptions = sqliteTable(
  'subscriptions',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    studentId: text('student_id').notNull().references(() => students.id),
    planId: text('plan_id').notNull().references(() => subscriptionPlans.id),
    status: text('status'), // "active" | "expired" | "cancelled"
    currentPeriodStart: text('current_period_start'),
    currentPeriodEnd: text('current_period_end'),
    cancelAtPeriodEnd: integer('cancel_at_period_end', { mode: 'boolean' }),
    lastPayment: text('last_payment'),
    amount: real('amount'),
    currency: text('currency'),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  },
  (t) => [index('subscriptions_student_idx').on(t.studentId)],
)

// ---------------------------------------------------------------------------
// Student preferences (reference: `studentPreferences-k8XJ8C4f.js` defaults +
// `student_save_preferences` RPC contract)
// ---------------------------------------------------------------------------

export const studentPreferences = sqliteTable(
  'student_preferences',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    studentId: text('student_id').notNull().references(() => students.id),
    classReminders: integer('class_reminders', { mode: 'boolean' }),
    whatsappReminders: integer('whatsapp_reminders', { mode: 'boolean' }),
    courseUpdates: integer('course_updates', { mode: 'boolean' }),
    skillcheckReminders: integer('skillcheck_reminders', { mode: 'boolean' }),
    offers: integer('offers', { mode: 'boolean' }),
    weeklyProgress: integer('weekly_progress', { mode: 'boolean' }),
    dataSaver: integer('data_saver', { mode: 'boolean' }),
    autoplayNext: integer('autoplay_next', { mode: 'boolean' }),
    captions: integer('captions', { mode: 'boolean' }),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  },
  (t) => [uniqueIndex('student_preferences_student_uq').on(t.studentId)],
)

// ---------------------------------------------------------------------------
// Phase 1 additions — Courses, Lessons, Quizzes & Gamification
// ---------------------------------------------------------------------------

export const courses = sqliteTable('courses', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  slug: text('slug').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  excerpt: text('excerpt'),
  category: text('category'),
  tags: text('tags'),
  price: real('price'),
  originalPrice: real('original_price'),
  currency: text('currency').default('ZMW'),
  duration: text('duration'),
  lessonsCount: integer('lessons_count').default(0),
  level: text('level').default('beginner'),
  status: text('status').default('draft'),
  featured: integer('featured', { mode: 'boolean' }).default(false),
  image: text('image'),
  curriculum: text('curriculum', { mode: 'json' }),
  isPublished: integer('is_published', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
})

export const courseSections = sqliteTable(
  'course_sections',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    courseId: text('course_id').notNull().references(() => courses.id),
    title: text('title').notNull(),
    description: text('description'),
    sectionOrder: integer('section_order').default(0),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  },
  (t) => [index('course_sections_course_idx').on(t.courseId)],
)

export const lessons = sqliteTable(
  'lessons',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    courseId: text('course_id').notNull().references(() => courses.id),
    sectionId: text('section_id').references(() => courseSections.id),
    title: text('title').notNull(),
    lessonOrder: integer('lesson_order').default(0),
    videoUrl: text('video_url'),
    notes: text('notes'),
    documentUrl: text('document_url'),
    durationMinutes: integer('duration_minutes'),
    lessonType: text('lesson_type').default('video'),
    content: text('content'),
    isPreview: integer('is_preview', { mode: 'boolean' }).default(false),
    quizData: text('quiz_data', { mode: 'json' }),
    videoProvider: text('video_provider'),
    description: text('description'),
    learningOutcomes: text('learning_outcomes', { mode: 'json' }),
    timestamps: text('timestamps', { mode: 'json' }),
    seoKeywords: text('seo_keywords'),
    adminNotes: text('admin_notes'),
    deletedAt: integer('deleted_at', { mode: 'timestamp' }),
    videoProcessing: text('video_processing'),
    sourceSessionId: text('source_session_id'),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  },
  (t) => [index('lessons_course_idx').on(t.courseId), index('lessons_section_idx').on(t.sectionId)],
)

export const courseLessonQuizzes = sqliteTable(
  'course_lesson_quizzes',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    lessonId: text('lesson_id').notNull().references(() => lessons.id),
    courseId: text('course_id').references(() => courses.id),
    title: text('title'),
    passingScore: integer('passing_score').default(70),
    timeLimitMinutes: integer('time_limit_minutes'),
    questions: text('questions', { mode: 'json' }),
    isPublished: integer('is_published', { mode: 'boolean' }).default(false),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  },
  (t) => [index('quiz_lesson_idx').on(t.lessonId)],
)

export const courseLessonQuizAttempts = sqliteTable(
  'course_lesson_quiz_attempts',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    quizId: text('quiz_id').notNull().references(() => courseLessonQuizzes.id),
    lessonId: text('lesson_id').notNull().references(() => lessons.id),
    courseId: text('course_id').references(() => courses.id),
    studentId: text('student_id').notNull().references(() => students.id),
    enrollmentId: text('enrollment_id').references(() => enrollments.id),
    score: integer('score').default(0),
    maxScore: integer('max_score').default(0),
    percentage: integer('percentage').default(0),
    passed: integer('passed', { mode: 'boolean' }).default(false),
    answers: text('answers', { mode: 'json' }),
    startedAt: text('started_at'),
    timeSpentSeconds: integer('time_spent_seconds'),
    attemptDate: text('attempt_date'),
    attemptNumber: integer('attempt_number').default(1),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  },
  (t) => [index('quiz_attempt_student_idx').on(t.studentId), index('quiz_attempt_lesson_idx').on(t.lessonId)],
)

// Gamification — points, streaks, achievements

export const achievementDefinitions = sqliteTable('achievement_definitions', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  code: text('code').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  icon: text('icon'),
  pointsReward: integer('points_reward').default(0),
  criteria: text('criteria', { mode: 'json' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
})

export const studentPoints = sqliteTable(
  'student_points',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    studentId: text('student_id').notNull().references(() => students.id),
    totalPoints: integer('total_points').default(0),
    level: integer('level').default(1),
    pointsToNextLevel: integer('points_to_next_level').default(100),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  },
  (t) => [uniqueIndex('student_points_student_uq').on(t.studentId)],
)

export const studentStreaks = sqliteTable(
  'student_streaks',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    studentId: text('student_id').notNull().references(() => students.id),
    currentStreak: integer('current_streak').default(0),
    longestStreak: integer('longest_streak').default(0),
    lastActivityDate: text('last_activity_date'),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  },
  (t) => [uniqueIndex('student_streaks_student_uq').on(t.studentId)],
)

export const studentAchievements = sqliteTable('student_achievements', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  studentId: text('student_id').notNull().references(() => students.id),
  achievementId: text('achievement_id').notNull().references(() => achievementDefinitions.id),
  earnedAt: text('earned_at'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
})

// ---------------------------------------------------------------------------
// Legacy local demo tables (kept only so pre-phase routes compile; they get
// replaced by the reference model phases 1–4). NOT part of the reference model.
// ---------------------------------------------------------------------------

export const legacyCourses = sqliteTable('lp_courses', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  excerpt: text('excerpt'),
  category: text('category').notNull(),
  tags: text('tags'),
  price: real('price').notNull(),
  originalPrice: real('original_price'),
  currency: text('currency').default('ZMW').notNull(),
  duration: text('duration'),
  lessonsCount: integer('lessons_count').default(0),
  level: text('level').default('beginner').notNull(),
  status: text('status').default('draft').notNull(),
  featured: integer('featured', { mode: 'boolean' }).default(false),
  image: text('image'),
  curriculum: text('curriculum', { mode: 'json' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
})

export const legacyLessons = sqliteTable('lp_lessons', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  courseId: integer('course_id').notNull().references(() => legacyCourses.id),
  title: text('title').notNull(),
  description: text('description'),
  content: text('content'),
  videoUrl: text('video_url'),
  duration: text('duration'),
  sortOrder: integer('sort_order').default(0),
  isFree: integer('is_free', { mode: 'boolean' }).default(false),
  status: text('status').default('draft').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
})
