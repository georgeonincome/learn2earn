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
