import { sqliteTable, text, integer, real, blob } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone'),
  avatar: text('avatar'),
  role: text('role', { enum: ['student', 'admin'] }).default('student').notNull(),
  status: text('status', { enum: ['active', 'inactive', 'suspended'] }).default('active').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
})

export const memberships = sqliteTable('memberships', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  type: text('type', { enum: ['monthly', 'quarterly', 'yearly', 'lifetime'] }).notNull(),
  status: text('status', { enum: ['active', 'expired', 'cancelled', 'pending'] }).default('pending').notNull(),
  startDate: integer('start_date', { mode: 'timestamp' }).notNull(),
  endDate: integer('end_date', { mode: 'timestamp' }),
  amountPaid: real('amount_paid').notNull(),
  currency: text('currency').default('ZMW').notNull(),
  flutterwaveRef: text('flutterwave_ref'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
})

export const courses = sqliteTable('courses', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(),
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
  level: text('level', { enum: ['beginner', 'intermediate', 'advanced'] }).default('beginner').notNull(),
  status: text('status', { enum: ['published', 'draft', 'archived'] }).default('draft').notNull(),
  featured: integer('featured', { mode: 'boolean' }).default(false),
  image: text('image'),
  instructorId: integer('instructor_id').references(() => users.id),
  curriculum: text('curriculum', { mode: 'json' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
})

export const userCourses = sqliteTable('user_courses', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  courseId: integer('course_id').notNull().references(() => courses.id),
  status: text('status', { enum: ['enrolled', 'in_progress', 'completed'] }).default('enrolled').notNull(),
  progress: real('progress').default(0),
  enrolledAt: integer('enrolled_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  completedAt: integer('completed_at', { mode: 'timestamp' }),
})

export const lessons = sqliteTable('lessons', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  courseId: integer('course_id').notNull().references(() => courses.id),
  title: text('title').notNull(),
  description: text('description'),
  content: text('content'),
  videoUrl: text('video_url'),
  duration: text('duration'),
  sortOrder: integer('sort_order').default(0),
  isFree: integer('is_free', { mode: 'boolean' }).default(false),
  status: text('status', { enum: ['published', 'draft'] }).default('draft').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
})

export const cohorts = sqliteTable('cohorts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description').notNull(),
  courseId: integer('course_id').references(() => courses.id),
  startDate: integer('start_date', { mode: 'timestamp' }).notNull(),
  endDate: integer('end_date', { mode: 'timestamp' }).notNull(),
  price: real('price').notNull(),
  currency: text('currency').default('ZMW').notNull(),
  maxSeats: integer('max_seats').default(50),
  enrolled: integer('enrolled').default(0),
  status: text('status', { enum: ['upcoming', 'active', 'completed', 'cancelled'] }).default('upcoming').notNull(),
  image: text('image'),
  schedule: text('schedule'),
  meetingLink: text('meeting_link'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
})

export const payments = sqliteTable('payments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  type: text('type', { enum: ['membership', 'course', 'cohort'] }).notNull(),
  itemId: integer('item_id').notNull(),
  amount: real('amount').notNull(),
  currency: text('currency').default('ZMW').notNull(),
  status: text('status', { enum: ['pending', 'success', 'failed', 'refunded'] }).default('pending').notNull(),
  flutterwaveRef: text('flutterwave_ref'),
  flutterwaveTxId: text('flutterwave_tx_id'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
})

export const blogPosts = sqliteTable('blog_posts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  excerpt: text('excerpt').notNull(),
  content: text('content').notNull(),
  category: text('category').notNull(),
  image: text('image'),
  readTime: text('read_time'),
  published: integer('published', { mode: 'boolean' }).default(false),
  featured: integer('featured', { mode: 'boolean' }).default(false),
  authorId: integer('author_id').references(() => users.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
})

export const reviews = sqliteTable('reviews', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id),
  courseId: integer('course_id').references(() => courses.id),
  name: text('name').notNull(),
  content: text('content').notNull(),
  rating: integer('rating').default(5),
  verified: integer('verified', { mode: 'boolean' }).default(false),
  cohortName: text('cohort_name'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
})

export const faqs = sqliteTable('faqs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
  category: text('category').notNull(),
  sortOrder: integer('sort_order').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
})
