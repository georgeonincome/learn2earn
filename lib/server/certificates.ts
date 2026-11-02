// Certificates server module — Phase 4.
// Mirrors reference CertificatePanel-CXemqskQ.js + VerifyCertificate-CaPIuCye.js.
// Certificates are issued on course/cohort/book completion and can be
// downloaded (printable page) and publicly verified by certificateId.
import { all, one, run } from './sql'
import { nowIso, uuid } from './ids'
import type { Row } from './sql'

export type CertificateRow = {
  id: string
  certificate_id: string
  student_id: string
  student_name: string
  title: string
  slug: string | null
  kind: 'course' | 'cohort' | 'book'
  issue_date: string | null
  download_url: string | null
  is_verified: number | null
  created_at: number | null
}

export type CertificatePublic = {
  certificateId: string
  studentName: string
  courseTitle: string
  courseSlug: string | null
  issueDate: string | null
  isVerified: boolean
}

/** List all certificates for a student (course + cohort + book). */
export async function getStudentCertificates(studentId: string): Promise<CertificateRow[]> {
  const courseCerts = await all<Row>(
    `SELECT c.id, c.certificate_id, c.student_id, c.student_name,
            c.course_title AS title, c.course_slug AS slug, 'course' AS kind,
            c.issue_date, c.download_url, c.is_verified, c.created_at
       FROM course_certificates c
      WHERE c.student_id = ?
      UNION ALL
     SELECT c.id, c.certificate_id, c.student_id, c.student_name,
            c.cohort_title AS title, NULL AS slug, 'cohort' AS kind,
            c.issue_date, c.download_url, c.is_verified, c.created_at
       FROM cohort_certificates c
      WHERE c.student_id = ?
      ORDER BY created_at DESC`,
    [studentId, studentId],
  )
  return courseCerts.map((r) => ({
    id: String(r.id),
    certificate_id: String(r.certificate_id),
    student_id: String(r.student_id),
    student_name: String(r.student_name),
    title: String(r.title),
    slug: (r.slug as string) ?? null,
    kind: String(r.kind) as 'course' | 'cohort' | 'book',
    issue_date: (r.issue_date as string) ?? null,
    download_url: (r.download_url as string) ?? null,
    is_verified: Number(r.is_verified ?? 0),
    created_at: Number(r.created_at ?? 0),
  }))
}

/** Get a certificate by its public verification code or internal id. */
export async function getCertificateById(certificateId: string): Promise<CertificateRow | null> {
  // Try by internal id first, then by public certificate_id
  let row = await one<Row>(
    `SELECT c.id, c.certificate_id, c.student_id, c.student_name,
            c.course_title AS title, c.course_slug AS slug, 'course' AS kind,
            c.issue_date, c.download_url, c.is_verified, c.created_at
       FROM course_certificates c
      WHERE c.id = ? LIMIT 1`,
    [certificateId],
  )
  if (row) return mapRow(row)

  row = await one<Row>(
    `SELECT c.id, c.certificate_id, c.student_id, c.student_name,
            c.course_title AS title, c.course_slug AS slug, 'course' AS kind,
            c.issue_date, c.download_url, c.is_verified, c.created_at
       FROM course_certificates c
      WHERE c.certificate_id = ? LIMIT 1`,
    [certificateId],
  )
  if (row) return mapRow(row)

  // Try cohort certificates by id
  row = await one<Row>(
    `SELECT c.id, c.certificate_id, c.student_id, c.student_name,
            c.cohort_title AS title, NULL AS slug, 'cohort' AS kind,
            c.issue_date, c.download_url, c.is_verified, c.created_at
       FROM cohort_certificates c
      WHERE c.id = ? LIMIT 1`,
    [certificateId],
  )
  if (row) return mapRow(row)

  // Try cohort certificates by certificate_id
  row = await one<Row>(
    `SELECT c.id, c.certificate_id, c.student_id, c.student_name,
            c.cohort_title AS title, NULL AS slug, 'cohort' AS kind,
            c.issue_date, c.download_url, c.is_verified, c.created_at
       FROM cohort_certificates c
      WHERE c.certificate_id = ? LIMIT 1`,
    [certificateId],
  )
  if (row) return mapRow(row)

  return null
}

function mapRow(row: Row): CertificateRow {
  return {
    id: String(row.id),
    certificate_id: String(row.certificate_id),
    student_id: String(row.student_id),
    student_name: String(row.student_name),
    title: String(row.title),
    slug: (row.slug as string) ?? null,
    kind: String(row.kind) as 'course' | 'cohort' | 'book',
    issue_date: (row.issue_date as string) ?? null,
    download_url: (row.download_url as string) ?? null,
    is_verified: Number(row.is_verified ?? 0),
    created_at: Number(row.created_at ?? 0),
  }
}

/** Public-facing certificate verification. */
export async function verifyCertificate(certificateId: string) {
  const cert = await getCertificateById(certificateId)
  if (!cert) return { found: false }
  return {
    found: true,
    certificateId: cert.certificate_id,
    studentName: cert.student_name,
    courseTitle: cert.title,
    courseSlug: cert.slug,
    issueDate: cert.issue_date,
    isVerified: Boolean(cert.is_verified),
  }
}

/** Issue a course completion certificate. Called after course completion. */
export async function issueCourseCertificate({
  studentId,
  courseId,
  enrollmentId,
  studentName,
  courseTitle,
  courseSlug,
}: {
  studentId: string
  courseId: string
  enrollmentId?: string | null
  studentName: string
  courseTitle: string
  courseSlug: string
}) {
  const certificateId = `L2E-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 4)}`
  const now = nowIso()
  await run(
    `INSERT INTO course_certificates
       (id, certificate_id, student_id, course_id, enrollment_id, student_name,
        course_title, course_slug, issue_date, is_verified, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, unixepoch())`,
    [uuid(), certificateId, studentId, courseId, enrollmentId ?? null,
      studentName, courseTitle, courseSlug, now],
  )
  return { certificateId, studentName, courseTitle, courseSlug, issueDate: now, isVerified: true }
}

/** Issue a cohort completion certificate. */
export async function issueCohortCertificate({
  studentId,
  cohortId,
  enrollmentId,
  studentName,
  cohortTitle,
}: {
  studentId: string
  cohortId: string
  enrollmentId?: string | null
  studentName: string
  cohortTitle: string
}) {
  const certificateId = `L2E-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 4)}`
  const now = nowIso()
  await run(
    `INSERT INTO cohort_certificates
       (id, certificate_id, student_id, cohort_id, enrollment_id, student_name,
        cohort_title, issue_date, is_verified, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, unixepoch())`,
    [uuid(), certificateId, studentId, cohortId, enrollmentId ?? null,
      studentName, cohortTitle, now],
  )
  return { certificateId, studentName, cohortTitle, issueDate: now, isVerified: true }
}
