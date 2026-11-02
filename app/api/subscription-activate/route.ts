// `subscription-activate` — reference edge function contract (Subscribe-DucfmV4N.js)
// invoke("subscription-activate", { body: { reference } }) →
//   { status: "pending"|"failed"|"success", reason?, email?, amount?,
//     planName?, periodEnd?, stacked?, mode?, token_hash? }
import { NextRequest, NextResponse } from 'next/server'
import { activateByReference } from '@/lib/server/subscription'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}))
  if (!body.reference) {
    return NextResponse.json({ error: 'reference is required' }, { status: 400 })
  }
  return NextResponse.json(await activateByReference(String(body.reference)))
}
