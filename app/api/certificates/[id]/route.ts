// Get certificate details by ID.
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getCertificateById } from '@/lib/server/certificates'

export const runtime = 'nodejs'

export async function GET(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const cert = await getCertificateById(id)
  if (!cert) return NextResponse.json({ error: 'Certificate not found' }, { status: 404 })
  return NextResponse.json({
    certificate: {
      id: cert.id,
      certificateId: cert.certificate_id,
      studentName: cert.student_name,
      courseTitle: cert.title,
      courseSlug: cert.slug,
      issueDate: cert.issue_date,
      isVerified: Boolean(cert.is_verified),
      kind: cert.kind,
    },
  })
}
