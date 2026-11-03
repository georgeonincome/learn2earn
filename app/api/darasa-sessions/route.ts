/**
 * Darasa sessions — DB-driven live session list (reference darasa_sessions).
 */

import { NextResponse } from 'next/server'
import { all } from '@/lib/server/sql'

export const runtime = 'nodejs'

export async function GET() {
  const rows = await all(
    'SELECT * FROM darasa_sessions WHERE is_active = 1 ORDER BY starts_at ASC'
  )
  return NextResponse.json(rows)
}
