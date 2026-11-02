// Cohort detail by slug or ID.
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { one } from '@/lib/server/sql'

export const runtime = 'nodejs'

export async function GET(request: NextRequest, ctx: { params: Promise<{ cohortId: string }> }) {
  const { cohortId } = await ctx.params
  const row = await one(
    'SELECT * FROM cohorts WHERE (slug = ? OR id = ?) AND is_published = 1 AND deleted_at IS NULL LIMIT 1',
    [cohortId, cohortId],
  )
  if (!row) return NextResponse.json({ error: 'Cohort not found' }, { status: 404 })
  return NextResponse.json({ cohort: row })
}
