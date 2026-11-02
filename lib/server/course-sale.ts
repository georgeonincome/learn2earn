// Reference contract: `subscription.course-enrollment` + course-sale helpers.

/** `course-enrollment-CqvAmHjd.js` — courses with an active enrollment-issue notice. */
export const COURSE_ENROLLMENT_ISSUES = [
  '8f1c2b54-8fb6-45ef-b0c3-d9accce4c98b',
  'efd85a61-393f-450d-bb65-ae4ccbf3bdc4',
] as const

export const COURSE_ENROLLMENT_ISSUE_MESSAGE =
  'A few errors are being resolved for these classes.'

/** `course-enrollment-CqvAmHjd.js` export `i` — is this one of the affected courses? */
export function hasEnrollmentIssue(courseId: string) {
  return (COURSE_ENROLLMENT_ISSUES as readonly string[]).some((id) => id === courseId)
}

// The August-2026 cohort style constant (export `S`/`C`) is branding-specific.
// Replaced with our Zambian course catalog id once Phase 1 hooks it in.
// Reference: {id:"1c6a3588-...", slug:"social-media-management-with-ai-august-2026"}

/**
 * `course-sale-DD8S12IM.js` — verbatim rule:
 * sale price applies when `sale_price != null && Number(sale_price) < Number(price)`
 * and (`sale_ends_at` is null OR in the future). Second param is now-injection.
 */
export function effectivePrice<T extends { price?: unknown; sale_price?: unknown; sale_ends_at?: unknown | null }>(
  x: T,
  now = Date.now(),
): number {
  const price = Number(x.price ?? 0)
  if (
    x.sale_price != null &&
    Number(x.sale_price) < price &&
    (!x.sale_ends_at || Date.parse(x.sale_ends_at as unknown as string) > now)
  ) {
    return Number(x.sale_price)
  }
  return price
}
