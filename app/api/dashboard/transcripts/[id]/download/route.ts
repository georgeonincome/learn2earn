// Download transcript — returns a printable HTML page (browser print to PDF).
// Transcript data is embedded server-side so the print view is self-contained.
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getTranscript } from '@/lib/server/transcripts'

export const runtime = 'nodejs'

export async function GET(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const transcript = await getTranscript(id)
  if (!transcript) return NextResponse.json({ error: 'Transcript not found' }, { status: 404 })

  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://learn2earn.co.zm'}/verify/${transcript.share_token || transcript.id}`
  const issuedAt = transcript.issued_at
    ? new Date(transcript.issued_at).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : ''

  const items = Array.isArray(transcript.items) ? transcript.items : []

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Learn2Earn Transcript — ${transcript.id}</title>
<style>
  @page { size: A4 portrait; margin: 20mm; }
  * { box-sizing: border-box; }
  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin: 0; padding: 0;
    background: #FCFCF9;
    color: #10201A;
  }
  .transcript {
    max-width: 800px; margin: 0 auto; background: white; padding: 40px;
    border: 2px solid #10201A; border-radius: 8px;
  }
  .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #1DB96B; }
  .logo { width: 48px; height: auto; }
  .org-name { font-family: 'Instrument Serif', serif; font-size: 28px; font-weight: bold; color: #10201A; letter-spacing: 0.02em; }
  .org-sub { font-size: 12px; color: #5B6B64; margin-top: 2px; }
  .doc-title { font-size: 24px; font-weight: bold; text-align: center; color: #1DB96B; letter-spacing: 0.05em; text-transform: uppercase; margin: 30px 0; }
  .student-info { display: flex; justify-content: space-between; background: #F3FBF6; border-radius: 6px; padding: 20px; margin-bottom: 30px; border: 1px solid #E3E8E5; }
  .student-info div { flex: 1; }
  .label { font-size: 11px; font-weight: bold; color: #5B6B64; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
  .value { font-size: 15px; color: #10201A; font-weight: 500; }
  h2 { font-size: 18px; color: #10201A; border-bottom: 1px solid #E3E8E5; padding-bottom: 8px; margin: 30px 0 16px 0; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
  th { text-align: left; font-size: 12px; font-weight: bold; color: #5B6B64; padding: 10px 8px; border-bottom: 2px solid #E3E8E5; text-transform: uppercase; letter-spacing: 0.05em; }
  td { font-size: 14px; color: #10201A; padding: 12px 8px; border-bottom: 1px solid #F3F4F6; }
  tr:hover { background: #F8FAF9; }
  .summary { display: flex; gap: 30px; margin: 30px 0; padding: 20px; background: #F3FBF6; border-radius: 6px; border: 1px solid #E3E8E5; }
  .summary-item { flex: 1; text-align: center; }
  .summary-value { font-size: 24px; font-weight: bold; color: #1DB96B; }
  .summary-label { font-size: 11px; color: #5B6B64; font-weight: bold; text-transform: uppercase; margin-top: 4px; }
  .share-box { margin-top: 30px; padding: 20px; background: white; border: 1px solid #1DB96B; border-radius: 6px; }
  .share-title { font-size: 13px; font-weight: bold; color: #1DB96B; margin-bottom: 10px; }
  .share-url { font-family: monospace; font-size: 11px; color: #5B6B64; word-break: break-all; }
  .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #E3E8E5; font-size: 10.5px; color: #7A8A83; line-height: 1.6; }
  .footer b { color: #5B6B64; }
  @media print {
    body { background: white; -webkit-print-color-adjust: exact; }
    .transcript { border: none; box-shadow: none; }
  }
</style>
</head>
<body>
  <div class="transcript">
    <div class="header">
      <img class="logo" src="/logo.svg" alt="Learn2Earn logo" />
      <div>
        <div class="org-name">Learn2Earn</div>
        <div class="org-sub">Practical skills. Real work. Zambian context.</div>
      </div>
    </div>
    <div class="doc-title">Academic Transcript</div>
    <div class="student-info">
      <div>
        <div class="label">Student Name</div>
        <div class="value">${transcript.student_name}</div>
      </div>
      <div>
        <div class="label">Student ID</div>
        <div class="value">${transcript.student_id}</div>
      </div>
      <div>
        <div class="label">Issued Date</div>
        <div class="value">${issuedAt}</div>
      </div>
    </div>
    <div class="summary">
      <div class="summary-item">
        <div class="summary-value">${transcript.lessons_completed}</div>
        <div class="summary-label">Lessons Completed</div>
      </div>
      <div class="summary-item">
        <div class="summary-value">${transcript.lessons_total}</div>
        <div class="summary-label">Total Lessons</div>
      </div>
      <div class="summary-item">
        <div class="summary-value">${transcript.quiz_average.toFixed(1)}</div>
        <div class="summary-label">Quiz Average</div>
      </div>
    </div>
    <h2>Course Record — ${transcript.item_title}</h2>
    <table>
      <thead>
        <tr><th>Item</th><th>Type</th><th>Status</th></tr>
      </thead>
      <tbody>
        ${items.map((item: any) => `
          <tr>
            <td>${item.title || item.item_title || 'Untitled'}</td>
            <td>${item.item_type || 'Lesson'}</td>
            <td style="color:#1DB96B;font-weight:600">Completed</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <div class="share-box">
      <div class="share-title">Share this transcript</div>
      <div class="share-url">${verifyUrl}</div>
    </div>
    <div class="footer">
      <p><b>This transcript records completion, not competence.</b> Competence is proven by the work you produce with what you learned.</p>
      <p>Learn2Earn is not a government or board accredited institution, and this is not an accredited qualification.</p>
      <p>Verify this transcript at: ${verifyUrl}</p>
    </div>
  </div>
  <script>
    window.print();
  </script>
</body>
</html>`

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
      'Content-Disposition': `attachment; filename="Learn2Earn-Transcript-${transcript.id}.html"`,
    },
  })
}
