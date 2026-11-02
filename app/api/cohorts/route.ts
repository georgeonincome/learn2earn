// List published cohorts (DB-backed; approved /cohorts page hooks this when ready).
import { NextResponse } from 'next/server'
import { all } from '@/lib/server/sql'

export const runtime = 'nodejs'

export async function GET() {
  const rows = await all(
    `SELECT id, slug, title, description, thumbnail_url, start_date, end_date,
            total_days, lesson_duration_minutes, status, max_students, price,
            price_usd, access_start_time, access_end_time, timezone,
            whatsapp_group_url, class_key, meet_url, enrollment_open, archived
       FROM cohorts
      WHERE is_published = 1 AND deleted_at IS NULL
      ORDER BY start_date ASC`,
  )
  return NextResponse.json({
    cohorts: rows.map((r) => ({
      id: String(r.id),
      slug: String(r.slug),
      title: String(r.title),
      description: String(r.description ?? ''),
      thumbnail_url: String(r.thumbnail_url ?? ''),
      start_date: String(r.start_date ?? ''),
      end_date: String(r.end_date ?? ''),
      total_days: Number(r.total_days ?? 0),
      lesson_duration_minutes: Number(r.lesson_duration_minutes ?? 25),
      status: String(r.status ?? 'upcoming'),
      max_students: Number(r.max_students ?? 100),
      price: Number(r.price ?? 0),
      price_usd: r.price_usd != null ? Number(r.price_usd) : undefined,
      access_start_time: String(r.access_start_time ?? ''),
      access_end_time: String(r.access_end_time ?? ''),
      timezone: String(r.timezone ?? 'Africa/Lusaka'),
      whatsapp_group_url: String(r.whatsapp_group_url ?? ''),
      class_key: String(r.class_key ?? ''),
      meet_url: String(r.meet_url ?? ''),
      enrollment_open: Boolean(r.enrollment_open),
      archived: Boolean(r.archived),
    })),
  })
}
