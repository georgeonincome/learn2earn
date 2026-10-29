import { MetadataRoute } from 'next'
import { COURSES, BLOG_POSTS, COHORTS } from '@/lib/data'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://learn2earn.co.zm'

  const staticRoutes = [
    '',
    '/about',
    '/courses',
    '/cohorts',
    '/blog',
    '/faq',
    '/contact',
    '/reviews',
    '/privacy-policy',
    '/terms',
    '/refund-policy',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  const courseRoutes = COURSES.map((course) => ({
    url: `${baseUrl}/courses/${course.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const blogRoutes = BLOG_POSTS.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  const cohortRoutes = COHORTS.map((cohort) => ({
    url: `${baseUrl}/cohorts/${cohort.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...courseRoutes, ...blogRoutes, ...cohortRoutes]
}
