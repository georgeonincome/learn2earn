// Download certificate — returns a printable HTML page (browser print to PDF).
// The certificate data is embedded server-side so the print view is self-contained.
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getCertificateById } from '@/lib/server/certificates'

export const runtime = 'nodejs'

export async function GET(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const cert = await getCertificateById(id)
  if (!cert) return NextResponse.json({ error: 'Certificate not found' }, { status: 404 })

  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://learn2earn.co.zm'}/verify/${cert.certificate_id}`
  const issueDate = cert.issue_date
    ? new Date(cert.issue_date).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : ''

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Learn2Earn Certificate — ${cert.certificate_id}</title>
<style>
  @page { size: A4 landscape; margin: 0; }
  * { box-sizing: border-box; }
  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin: 0; padding: 0;
    background: #FCFCF9;
    color: #10201A;
    width: 297mm; height: 210mm;
  }
  .certificate {
    width: 100%; height: 100%;
    background: #FCFCF9;
    display: grid;
    grid-template-columns: 292px 1fr;
    overflow: hidden;
  }
  .aside {
    background: #0E2A1E;
    color: white;
    padding: 40px 36px;
    display: flex; flex-direction: column;
    position: relative;
  }
  .aside .logo {
    width: 176px; height: auto; margin-bottom: 40px;
  }
  .aside h2 {
    font-family: 'Instrument Serif', serif;
    font-size: 58px; line-height: 1; margin: 0 0 8px 0;
    letter-spacing: -0.01em;
  }
  .aside .of {
    font-family: 'Instrument Serif', serif;
    font-size: 42px; italic; line-height: 1.02;
    color: #1BC995; margin: 0;
  }
  .badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: #E8F6EF; color: #0B6B3D;
    border-radius: 9999px; padding: 4px 12px;
    font-size: 13px; font-weight: bold; margin-bottom: 30px;
  }
  .meta {
    display: flex; justify-content: space-between;
    font-size: 13px; font-weight: bold; color: #5B6B64;
    margin-top: auto;
  }
  .main {
    padding: 60px; display: flex; flex-direction: column;
    justify-content: space-between;
  }
  .header-row {
    display: flex; justify-content: space-between; align-items: center;
    font-size: 13px; font-weight: bold; color: #5B6B64;
    margin-bottom: 10px;
  }
  .kind-badge {
    background: #E8F6EF; color: #0B6B3D;
    border-radius: 9999px; padding: 4px 12px; font-size: 13px;
  }
  .issued {
    display: flex; gap: 6px; align-items: center;
  }
  .content {
    display: flex; flex-direction: column; justify-content: center;
    flex: 1;
  }
  .certifies {
    font-size: 16px; color: #5B6B64; margin-bottom: 8px;
  }
  .student-name {
    font-family: 'Instrument Serif', serif;
    font-size: 76px; font-weight: normal;
    line-height: 1.02; letter-spacing: -0.01em;
    margin: 0 0 28px 0;
  }
  .completed {
    font-size: 16px; color: #5B6B64; margin-bottom: 8px;
  }
  .course-title {
    font-family: 'Instrument Serif', serif;
    font-size: 29px; font-weight: bold;
    line-height: 1.18; letter-spacing: -0.02em;
    margin: 0 0 26px 0;
    max-width: 700px;
  }
  .facts {
    display: flex; gap: 40px; border-top: 1px solid #E3E8E5;
    padding-top: 20px; margin-top: 26px;
  }
  .fact {
    font-size: 13px; color: #5B6B64;
  }
  .fact dt {
    font-weight: bold; color: #10201A; margin-bottom: 3px;
  }
  .signatures {
    display: flex; justify-content: space-between; align-items: flex-end;
    margin-top: auto;
  }
  .signature {
    display: flex; flex-direction: column;
  }
  .sig-line {
    height: 1px; background: #9DB0A7; width: 260px; margin-bottom: 10px;
  }
  .sig-name {
    font-size: 15px; font-weight: bold; color: #10201A;
  }
  .sig-title {
    font-size: 13px; color: #5B6B64;
  }
  .qr-code {
    width: 96px; height: 96px;
    background: white;
    border: 8px solid white;
    border-radius: 10px;
    margin-bottom: 10px;
  }
  .qr-label {
    font-size: 12.5px; color: #5B6B64; font-family: monospace;
    text-align: center; letter-spacing: 0.02em;
  }
  .footer {
    font-size: 10.5px; line-height: normal; color: #7A8A83;
    max-width: 720px;
    margin-top: 5px;
  }
  .footer b { color: #5B6B64; }
  @media print {
    body { background: white; -webkit-print-color-adjust: exact; }
    .certificate { background: #FCFCF9; }
  }
</style>
</head>
<body>
  <div class="certificate">
    <div class="aside">
      <svg class="logo" viewBox="0 0 24 24" fill="none" stroke="#1BC995" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
      <div class="badge">Free Access Granted!</div>
      <h2>Certificate</h2>
      <p class="of">of<br/>completion</p>
      <div class="meta">
        <span>Issued ${issueDate}</span>
      </div>
    </div>
    <div class="main">
      <div class="header-row">
        <span class="kind-badge">${cert.kind === 'course' ? 'Course' : cert.kind === 'cohort' ? 'Cohort' : 'Book'} Completion</span>
        <span class="issued">Issued ${issueDate}</span>
      </div>
      <div class="content">
        <p class="certifies">This certifies that</p>
        <div class="student-name">${cert.student_name}</div>
        <p class="completed">has completed</p>
        <div class="course-title">${cert.title}</div>
        <div class="facts">
          <div class="fact">
            <dt>Certificate ID</dt>
            <div style="font-family: monospace; font-weight: bold;">${cert.certificate_id}</div>
          </div>
          <div class="fact">
            <dt>Verify at</dt>
            <div style="font-size: 11px;">${verifyUrl}</div>
          </div>
        </div>
      </div>
      <div class="signatures">
        <div class="signature">
          <div class="sig-line"></div>
          <div class="sig-name">George</div>
          <div class="sig-title">Founder &amp; Lead Instructor</div>
        </div>
        <div style="text-align: right;">
          <div class="qr-code">
            <svg width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
              <path d="M7 7h7M14 14h-7M9 9h1M9 12h1M12 9h1"/>
            </svg>
          </div>
          <div class="qr-label">Scan to verify<br/>${cert.certificate_id}</div>
        </div>
      </div>
      <p class="footer">
        <b>This certificate records completion, not competence.</b> Competence is proven by the work you produce with what you learned. Learn2Earn is not a government or board accredited institution, and this is not an accredited qualification.
      </p>
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
      'Content-Disposition': `attachment; filename="Learn2Earn-Certificate-${cert.certificate_id}.html"`,
    },
  })
}
