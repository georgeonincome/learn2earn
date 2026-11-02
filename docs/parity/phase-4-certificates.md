# Phase 4 — Certificates & Reviews Verification

Status: **DONE** — Phase 4 implemented and smoke-tested against `file:./local.db` (Turso/libSQL local) on 2026-11-02.

Ported from reference: `web/clone/learn2earn/_reference/click2skill/`

## 1. Reference chunks extracted

| Chunk | Purpose |
|-------|---------|
| `CertificatePanel-CXemqskQ.js` | Certificate display with download (PDF/PNG) + share + QR code |
| `CertificateTemplate-4SLLODc7.js` | Visual certificate design template |
| `VerifyCertificate-CaPIuCye.js` | Public certificate verification page (3 types: certificate, skill check, transcript) |
| `downloadCertificate-DjDO-ZXq.js` | Certificate download to PDF/PNG |
| `share-2-DukWdDv0.js` | Share icon/component |
| `Reviews-m3j_a8u5.js` | Reviews page with helpful votes (server-side RPCs) |
| `WriteReview-CZ3oKIJe.js` | Write review form |
| `metaPixel-Dy9nrdR3.js` | Meta pixel tracking |
| `checkoutMetadata-D8-3-62L.js` | Checkout attribution metadata |

## 2. Data model additions

### New tables
- `course_certificates` — course completion certificates (certificateId, studentId, courseId, issueDate, isVerified)
- `review_helpful_votes` — helpful votes on reviews (reviewId, userId, createdAt)

### Existing tables (from Phase 2)
- `cohort_certificates` — cohort completion certificates

## 3. API routes

| Route | Methods | Purpose |
|-------|---------|---------|
| `/api/certificates` | GET | List user's certificates (course + cohort + book) |
| `/api/certificates/[id]` | GET | Get certificate details |
| `/api/certificates/[id]/verify` | GET | Public certificate verification |
| `/api/certificates/[id]/download` | GET | Download certificate (printable HTML page) |
| `/api/reviews/[id]/helpful` | POST | Mark a review as helpful/unhelpful |

## 4. Pages updated

- `/dashboard/certificates` — DB-backed certificate list (replaces mock data)
- `/verify/[certificateId]` — DB-backed verification (replaces static SAMPLE_CERTIFICATES)
- `/reviews` — Add helpful vote buttons

## 5. Components

- `CertificatePanel` — certificate display with download/share/verify actions
- `CertificateTemplate` — visual certificate design for print/download

## 6. Parity checklist

- [x] `course_certificates` table matches reference shape
- [x] `review_helpful_votes` table tracks helpful votes
- [x] Certificate list is DB-backed (not mock data)
- [x] Certificate verification is DB-backed (not static SAMPLE_CERTIFICATES)
- [x] Certificate download returns printable page with QR code
- [x] Reviews have helpful vote buttons with server-side persistence
- [x] Share via copy-to-clipboard for certificate verification URL
