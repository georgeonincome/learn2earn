// Funnels server module — Phase 6.
// Mirrors the reference `course_funnels` dump shape. FunnelPageComponent
// renders DB rows first (getFunnelBySlug) and falls back to the static
// FUNNELS map for slugs the reference ships as hardcoded chunks.
import { all, one, run } from './sql'
import type { Row } from './sql'

export type FunnelRow = {
  id: string
  course_id: string | null
  slug: string
  headline: string | null
  subheadline: string | null
  description: string | null
  cta_text: string | null
  hero_image_url: string | null
  benefits: string[]
  testimonials: Array<{ name: string; role: string; text: string }>
  is_active: number
}

function parseArray(v: unknown): unknown[] {
  if (Array.isArray(v)) return v as unknown[]
  try {
    const parsed = JSON.parse(String(v ?? '[]'))
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function mapFunnel(r: Row): FunnelRow {
  return {
    id: String(r.id),
    course_id: r.course_id != null ? String(r.course_id) : null,
    slug: String(r.slug),
    headline: (r.headline as string) ?? null,
    subheadline: (r.subheadline as string) ?? null,
    description: (r.description as string) ?? null,
    cta_text: (r.cta_text as string) ?? null,
    hero_image_url: (r.hero_image_url as string) ?? null,
    benefits: parseArray(r.benefits) as unknown[] as string[],
    testimonials: parseArray(r.testimonials).map((t) => {
      const o = (t && typeof t === 'object' ? t : {}) as Record<string, unknown>
      return {
        name: String(o.name ?? ''),
        role: String(o.role ?? ''),
        text: String(o.text ?? ''),
      }
    }),
    is_active: Number(r.is_active ?? 0),
  }
}

export async function getFunnelBySlug(slug: string): Promise<FunnelRow | null> {
  const row = await one<Row>(
    'SELECT * FROM course_funnels WHERE slug = ? AND is_active = 1 LIMIT 1',
    [slug],
  )
  if (row) return mapFunnel(row)
  return null
}

export async function getFunnelBySlugWithCourse(slug: string) {
  const funnel = await getFunnelBySlug(slug)
  if (!funnel) return null
  let courseSlug: string | null = null
  let courseId: string | null = funnel.course_id
  if (funnel.course_id) {
    const course = await one<Row>(
      'SELECT id, slug FROM courses WHERE id = ? AND is_published = 1 LIMIT 1',
      [funnel.course_id],
    )
    if (course) {
      courseId = String(course.id)
      courseSlug = String(course.slug)
    }
  }
  return { funnel, courseId, courseSlug }
}

export async function listActiveFunnels(): Promise<FunnelRow[]> {
  const rows = await all<Row>('SELECT * FROM course_funnels WHERE is_active = 1 ORDER BY created_at ASC')
  return rows.map(mapFunnel)
}

// Kept for future funnel CRUD (admin tooling parity)
export async function upsertFunnel(funnel: FunnelRow) {
  await run(
    `INSERT INTO course_funnels
       (id, course_id, slug, headline, subheadline, description, cta_text,
        hero_image_url, benefits, testimonials, is_active, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, unixepoch(), unixepoch())
     ON CONFLICT(slug) DO UPDATE SET
       course_id=excluded.course_id, headline=excluded.headline,
       subheadline=excluded.subheadline, description=excluded.description,
       cta_text=excluded.cta_text, hero_image_url=excluded.hero_image_url,
       benefits=excluded.benefits, testimonials=excluded.testimonials,
       is_active=excluded.is_active, updated_at=unixepoch()`,
    [
      funnel.id,
      funnel.course_id,
      funnel.slug,
      funnel.headline,
      funnel.subheadline,
      funnel.description,
      funnel.cta_text,
      funnel.hero_image_url,
      JSON.stringify(funnel.benefits),
      JSON.stringify(funnel.testimonials),
      funnel.is_active ? 1 : 0,
    ],
  )
}
