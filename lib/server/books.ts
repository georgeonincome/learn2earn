// Books server module — Phase 3.
// Mirrors the Book / BookEnrollment types from lib/types.ts.
// All queries over Turso `books` and `book_enrollments` tables.
import { all, one, run } from './sql'
import { uuid, nowIso } from './ids'
import type { Row } from './sql'

export type BookRow = {
  id: string
  slug: string
  title: string
  author: string
  description: string
  excerpt: string
  price: number
  originalPrice: number | null
  category: string
  tags: string[]
  image: string
  pdfUrl: string | null
  pages: number | null
  language: string
  publishedDate: string | null
  featured: boolean
  inPlan: boolean
  isPublished: boolean
}

function parseBookRow(row: Row): BookRow {
  return {
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title),
    author: String(row.author),
    description: String(row.description),
    excerpt: String(row.excerpt),
    price: Number(row.price ?? 0),
    originalPrice: row.original_price != null ? Number(row.original_price) : null,
    category: String(row.category),
    tags: (() => { try { return JSON.parse(String(row.tags ?? '[]')) } catch { return [] } })(),
    image: String(row.image ?? ''),
    pdfUrl: (row.pdf_url as string) ?? null,
    pages: row.pages != null ? Number(row.pages) : null,
    language: String(row.language ?? 'English'),
    publishedDate: (row.published_date as string) ?? null,
    featured: Boolean(row.featured),
    inPlan: Boolean(row.in_plan),
    isPublished: Boolean(row.is_published),
  }
}

/** List published books. */
export async function getBooks(): Promise<BookRow[]> {
  const rows = await all<Row>(
    'SELECT * FROM books WHERE is_published = 1 ORDER BY featured DESC, created_at DESC',
  )
  return rows.map(parseBookRow)
}

/** Get a single book by slug. */
export async function getBookBySlug(slug: string): Promise<BookRow | null> {
  const row = await one<Row>(
    'SELECT * FROM books WHERE slug = ? AND is_published = 1 LIMIT 1',
    [slug],
  )
  if (!row) return null
  return parseBookRow(row)
}

/** Get a book by ID (internal). */
export async function getBookById(id: string): Promise<BookRow | null> {
  const row = await one<Row>(
    'SELECT * FROM books WHERE id = ? AND is_published = 1 LIMIT 1',
    [id],
  )
  if (!row) return null
  return parseBookRow(row)
}

/** Get books by category. */
export async function getBooksByCategory(category: string): Promise<BookRow[]> {
  const rows = await all<Row>(
    'SELECT * FROM books WHERE category = ? AND is_published = 1 ORDER BY featured DESC, created_at DESC',
    [category],
  )
  return rows.map(parseBookRow)
}

/** Get distinct categories. */
export async function getBookCategories(): Promise<string[]> {
  const rows = await all<Row>(
    'SELECT DISTINCT category FROM books WHERE is_published = 1 ORDER BY category ASC',
  )
  return rows.map((r) => String(r.category))
}

/** Check if a student has already purchased a book. */
export async function getBookEnrollment(studentId: string, bookId: string): Promise<Row | null> {
  return one<Row>(
    'SELECT * FROM book_enrollments WHERE student_id = ? AND book_id = ? LIMIT 1',
    [studentId, bookId],
  )
}

/** Get all book enrollments for a student. */
export async function getStudentBookEnrollments(studentId: string): Promise<Row[]> {
  return all<Row>(
    `SELECT be.*, b.title, b.slug, b.author, b.pdf_url, b.pages
       FROM book_enrollments be
       JOIN books b ON b.id = be.book_id
      WHERE be.student_id = ?
      ORDER BY be.created_at DESC`,
    [studentId],
  )
}

/** Purchase/enroll in a book — creates enrollment row + payment audit. */
export async function enrollInBook({
  studentId,
  bookId, // can be slug or id
  amount,
  paymentReference,
  paymentMethod,
}: {
  studentId: string
  bookId: string
  amount: number
  paymentReference?: string | null
  paymentMethod?: string | null
}) {
  // Resolve book by slug or id
  let book = await getBookById(bookId)
  if (!book) {
    book = await getBookBySlug(bookId)
  }
  if (!book) throw new Error('Book not found')

  const existing = await getBookEnrollment(studentId, bookId)
  if (existing) return { enrollmentId: String(existing.id), alreadyEnrolled: true }

  const enrollmentId = uuid()
  const reference = paymentReference ?? `learn2earn_book_${book.id}_${Date.now()}`
  const now = nowIso()

  await run(
    `INSERT INTO book_enrollments
       (id, student_id, book_id, purchased_at, amount, currency, download_count, created_at)
     VALUES (?, ?, ?, ?, ?, 'ZMW', 0, unixepoch())`,
    [enrollmentId, studentId, book.id, now, amount],
  )

  // Payment audit trail (source:"book")
  await run(
    `INSERT INTO transactions
       (id, student_id, student_email, student_name, book_id, payment_reference,
        amount, currency, original_price, payment_method, payment_status,
        source, enrollment_source, processed_by_name, transaction_date)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'ZMW', ?, ?, 'paid', 'book', ?, ?, unixepoch())`,
    [
      uuid(),
      studentId,
      '',
      '',
      bookId,
      reference,
      amount,
      Number(book.originalPrice ?? 0),
      paymentMethod ?? 'flutterwave',
      reference,
      'System (Flutterwave)',
    ],
  )

  return { enrollmentId, alreadyEnrolled: false, book }
}

/** Download a book — increments download_count, returns pdfUrl. */
export async function downloadBook(enrollmentId: string, studentId: string) {
  const enrollment = await one<Row>(
    'SELECT * FROM book_enrollments WHERE id = ? AND student_id = ? LIMIT 1',
    [enrollmentId, studentId],
  )
  if (!enrollment) return null

  await run(
    'UPDATE book_enrollments SET download_count = COALESCE(download_count, 0) + 1, last_accessed_at = unixepoch() WHERE id = ?',
    [enrollmentId],
  )

  const book = await one<Row>('SELECT pdf_url, title FROM books WHERE id = ? LIMIT 1', [
    String(enrollment.book_id),
  ])
  return {
    pdfUrl: (book?.pdf_url as string) ?? null,
    title: String(book?.title ?? ''),
    enrollmentId,
  }
}

/** Verify a book certificate — public endpoint. */
export async function verifyBookCertificate(certificateId: string) {
  // Book certificates are stored as book_enrollments; verification returns
  // enrollment + book info for public certificate verification pages.
  const row = await one<Row>(
    `SELECT be.*, b.title, b.author, b.slug, b.pdf_url
       FROM book_enrollments be
       JOIN books b ON b.id = be.book_id
      WHERE be.id = ? LIMIT 1`,
    [certificateId],
  )
  if (!row) return { found: false }
  return {
    found: true,
    certificateId: String(row.id),
    studentId: String(row.student_id),
    bookId: String(row.book_id),
    bookTitle: String(row.title),
    bookAuthor: String(row.author),
    bookSlug: String(row.slug),
    purchasedAt: String(row.purchased_at ?? ''),
    amount: Number(row.amount ?? 0),
    currency: String(row.currency ?? 'ZMW'),
    isVerified: true,
  }
}
