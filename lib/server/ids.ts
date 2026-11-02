// UUID + time helpers
export function uuid(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  // Deterministic fallback (nodecrypto like the reference subscriptionTracking chunk)
  return [8, 4, 4, 4, 12]
    .map((n) => Math.random().toString(36).slice(2, 2 + n).padEnd(n, '0'))
    .join('-')
}

export function nowIso(): string {
  return new Date().toISOString()
}
