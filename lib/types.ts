import type { LucideIcon } from 'lucide-react'

/* Domain types for Learn2Earn — mirrors the Click2Skill data model
   (see _reference/click2skill/supabase/courses.json etc., localized to ZMW). */

export interface Course {
  id: number
  slug: string
  title: string
  category: string
  price: number // ZMW
  salePrice?: number
  originalPrice?: number
  description: string
  excerpt?: string
  duration?: string
  lessonCount?: number
  hours?: number
  level?: 'beginner' | 'intermediate' | 'advanced'
  image?: string
  featured?: boolean
  inPlan?: boolean
  tags?: string[]
  learningOutcomes?: string[]
  faqs?: [string, string][]
}

export interface MembershipPlan {
  id: string
  name: string
  price: number // ZMW
  originalPrice?: number
  duration: string
  features: string[]
  cta: string
  popular: boolean
  badge?: string
}

export interface Cohort {
  id: number
  slug: string
  title: string
  description: string
  startDate: string
  endDate: string
  price: number
  originalPrice?: number
  maxSeats: number
  enrolled: number
  schedule: string
  image?: string
  instructor: string
  location: string
  status: 'upcoming' | 'active' | 'completed'
  lessons: string[]
}

export interface Review {
  id: number
  name: string
  location: string
  content: string
  rating: number
  cohort: string
  verified?: boolean
}

export interface Faq {
  question: string
  answer: string
  category: string
}

export interface BlogPost {
  slug: string
  title: string
  description: string
  excerpt: string
  content: string
  date: string
  readTime: string
  category: string
  image?: string
  id?: number
  featured?: boolean
  ctaTitle?: string
  ctaText?: string
  courses?: { path: string; label: string }[]
  tags?: string[]
  author?: string
}

export interface NavItem {
  label: string
  href: string
  icon?: LucideIcon
}

export interface SocialLink {
  label: string
  href: string
  icon: string
}

/* ---------- Lesson & Learning Types ---------- */

export interface Lesson {
  id: string
  courseId: string | number
  title: string
  description?: string
  content?: string
  videoUrl?: string
  duration?: string // e.g. "12:30"
  sortOrder: number
  isFree: boolean
  status: 'published' | 'draft'
  isPreview?: boolean
}

export interface LessonProgress {
  lessonId: string
  userId: string | number
  status: 'not_started' | 'in_progress' | 'completed'
  watchTime: number // seconds watched
  completedAt?: string
  lastAccessedAt: string
}

export interface Certificate {
  id: string
  certificateId: string // public verification code
  studentName: string
  courseTitle: string
  courseSlug: string
  cohortTitle?: string
  issueDate: string
  downloadUrl?: string
  isVerified: boolean
}

export interface Enrollment {
  id: string
  userId: string | number
  courseId?: string | number
  cohortId?: string | number
  type: 'course' | 'cohort' | 'membership'
  status: 'enrolled' | 'in_progress' | 'completed'
  progress: number // 0-100
  enrolledAt: string
  completedAt?: string
  certificateId?: string
}

export interface QuizAttempt {
  id: string
  lessonId: string
  userId: string | number
  score: number
  total: number
  passed: boolean
  attemptedAt: string
}

export interface CertificateVerification {
  certificateId: string
  found: boolean
  studentName?: string
  courseTitle?: string
  issueDate?: string
  isVerified: boolean
}

/* ---------- Funnel Types ---------- */

export interface FunnelPage {
  slug: string
  title: string
  description: string
  price: number
  originalPrice?: number
  ctaText: string
  ctaHref: string
  features: string[]
  testimonials: { name: string; role: string; content: string; rating: number }[]
  faqs: { question: string; answer: string }[]
}