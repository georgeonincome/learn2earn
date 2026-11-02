# Phase 3 — Books: Catalog, Purchase, Download & Verification

Status: **DONE** — Phase 3 implemented and smoke-tested against `file:./local.db` (Turso/libSQL local) on 2026-11-02.

Books are a Learn2Earn-specific feature (no direct Click2Skill reference table).
Ported from: `lib/books-data.ts` static data → Turso DB.

## 1. Data model additions

### New tables
- `books` — mirrors `Book` type from `lib/books-data.ts` (slug, title, author, price ZMW, pdfUrl, pages, etc.)
- `book_enrollments` — purchased books (book_id, student_id, amount, currency, purchased_at, download_count, last_accessed_at)

## 2. API routes

| Route | Methods | Purpose |
|-------|---------|---------|
| `/api/books` | GET | List books (DB-backed, replaces static BOOKS) |
| `/api/books/[slug]` | GET | Book detail |
| `/api/books/enroll` | POST | Purchase/enroll in a book (creates book_enrollments row) |
| `/api/books/download/[enrollmentId]` | GET | Download a purchased book (increments download_count) |
| `/api/books/certificates/[id]/verify` | GET | Verify a book certificate |

## 3. Components / Pages

- `app/books/page.tsx` — DB-backed book list (replaces static BOOKS import)
- `app/books/[slug]/page.tsx` — DB-backed book detail
- `app/books/[slug]/checkout/page.tsx` — DB-backed book purchase (uses /api/books/enroll)

## 4. Parity checklist

- [x] `books` table matches Book type fields
- [x] `book_enrollments` table tracks purchases
- [x] `/api/books` returns books from DB
- [x] `/api/books/[slug]` returns single book
- [x] Book purchase creates enrollment row + payment audit
- [x] Book download increments download_count
- [x] Certificate verification endpoint works
- [x] Books page uses DB data (not static BOOKS)
