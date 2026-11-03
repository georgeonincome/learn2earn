/**
 * Single skill check — GET by id (used alongside searchParams catalog).
 */
import { NextRequest, NextResponse } from 'next/server'
import { getSkillCheck } from '@/lib/server/skill-check'

export const runtime = 'nodejs'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return NextResponse.json(await getSkillCheck(id))
}
