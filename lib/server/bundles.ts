// Bundles server module — Phase 5.
// Mirrors reference BundleLanding-Dzk1kmnS.js + BundleSuccess-Cc7dTlqs.js and
// the Supabase `bundles`/`bundle_courses` shape. Bundle purchase = one
// transactions row (bundle_id set) that auto-enrolls every course in the
// bundle on payment success — mirrors enroll.autoEnrollOnPaymentSuccess.
import { all, one, run } from './sql'
import { nowIso, uuid } from './ids'
import { REF_PROCESSED_BY, REF_PAYMENT_METHOD, REF_ENROLLMENT_SOURCE } from './enroll'
import type { Row } from './sql'

export type BundleRow = {
  id: string
  slug: string
  name: string
  tagline: string | null
  description: string | null
  price: number
  anchor_price: number | null
  is_active: number
  cover_image_url: string | null
  created_at: number | null
}

export type BundleWithCourses = BundleRow & {
  courses: Array<{ id: string; slug: string; title: string; price: number; image: string | null }>
}

/** Active bundles (BundleLanding homepage-promo rows). */
export async function getActiveBundles(includeInactive = false): Promise<BundleRow[]> {
  const rows = await all<Row>(
    `SELECT * FROM bundles ${includeInactive ? '' : 'WHERE is_active = 1'} ORDER BY created_at ASC`,
  )
  return rows.map(mapBundle)
}

export async function getBundleBySlug(slug: string): Promise<BundleWithCourses | null> {
  const row = await one<Row>('SELECT * FROM bundles WHERE slug = ? LIMIT 1', [slug])
  if (!row) return null
  const bundle = mapBundle(row)
  const courseRows = await all<Row>(
    `SELECT c.id, c.slug, c.title, c.price, c.image
       FROM bundle_courses bc
       JOIN courses c ON c.id = bc.course_id
      WHERE bc.bundle_id = ?
      ORDER BY bc.position ASC`,
    [bundle.id],
  )
  return {
    ...bundle,
    courses: courseRows.map((r) => ({
      id: String(r.id),
      slug: String(r.slug),
      title: String(r.title),
      price: Number(r.price ?? 0),
      image: (r.image as string) ?? null,
    })),
  }
}

function mapBundle(r: Row): BundleRow {
  return {
    id: String(r.id),
    slug: String(r.slug),
    name: String(r.name),
    tagline: (r.tagline as string) ?? null,
    description: (r.description as string) ?? null,
    price: Number(r.price ?? 0),
    anchor_price: (r.anchor_price as number | string | null) != null ? Number(r.anchor_price) : null,
    is_active: Number(r.is_active ?? 0),
    cover_image_url: (r.cover_image_url as string) ?? null,
    created_at: (r.created_at as number) ?? null,
  }
}

/**
 * Bundle purchase creates ONE pending transaction bound to bundle_id
 * (source:"bundle"). autoEnrollOnPaymentSuccess expands it into per-course
 * enrollments when it sees bundle_id — BundleSuccess-Cc7dTlqs.js unlocks
 * "All courses in your bundle".
 */
export async function createPendingBundleTransaction(args: {
  studentId: string | null
  email: string
  fullName: string
  bundle: BundleRow
  amount: number
  transactionReference: string
}) {
  await run(
    `INSERT INTO transactions
       (id, student_id, student_email, student_name, bundle_id,
        payment_reference, amount, currency, original_price, discount_amount,
        payment_method, payment_status, source, enrollment_source,
        processed_by_name, transaction_date)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'ZMW', ?, ?, ?, 'pending', 'bundle', ?, ?, ?)
     ON CONFLICT(payment_reference) DO NOTHING`,
    [
      uuid(),
      args.studentId,
      args.email,
      args.fullName,
      args.bundle.id,
      args.transactionReference,
      args.amount,
      args.bundle.price ?? null,
      Math.max(0, Number(args.bundle.price ?? 0) - args.amount),
      REF_PAYMENT_METHOD,
      REF_ENROLLMENT_SOURCE,
      REF_PROCESSED_BY,
      nowIso(),
    ],
  )
}

/** Bundle purchase summary for the success page (BundleSuccess). */
export async function getBundlePurchaseByReference(reference: string) {
  const tx = await one<Row>(
    'SELECT * FROM transactions WHERE payment_reference = ? ORDER BY transaction_date DESC LIMIT 1',
    [reference],
  )
  if (!tx || !tx.bundle_id) return null
  const bundle = await one<Row>('SELECT * FROM bundles WHERE id = ? LIMIT 1', [String(tx.bundle_id)])
  if (!bundle) return null
  const courseRows = await all<Row>(
    `SELECT c.id, c.slug, c.title
       FROM bundle_courses bc
       JOIN courses c ON c.id = bc.course_id
      WHERE bc.bundle_id = ? ORDER BY bc.position ASC`,
    [String(tx.bundle_id)],
  )
  return {
    transaction: {
      reference: String(tx.payment_reference),
      amount: Number(tx.amount ?? 0),
      status: String(tx.payment_status ?? ''),
      studentName: (tx.student_name as string) ?? null,
      studentEmail: (tx.student_email as string) ?? null,
    },
    bundle: mapBundle(bundle),
    courses: courseRows.map((r) => ({ id: String(r.id), slug: String(r.slug), title: String(r.title) })),
  }
}
