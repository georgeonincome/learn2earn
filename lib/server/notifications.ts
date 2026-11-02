// Notifications (reference `send-notification-email` chunk + edge function).
// Event vocabulary is copied from the reference: free_enrollment, cohort_enrollment.
//
// Q6 (docs/parity/phase-0-foundation.md): no email provider configured yet —
// this writes every event to a clearly-marked stub log so the sequence of
// notifications and payloads stays identical and swappable.

import { nowIso } from './ids'

export type NotificationEvent =
  | { type: 'free_enrollment'; user: { id: string; email: string; name?: string }; course: { id: string; title: string } }
  | {
      type: 'cohort_enrollment'
      user: { id: string; email: string; name?: string }
      cohort: { id: string; title: string; start_date?: string; end_date?: string; total_days?: number }
    }
  | { type: 'abandoned_checkout'; user: { email: string }; context: Record<string, unknown> }

function logPath(): string {
  return process.env.EMAIL_LOG_PATH || '.data/email-log.jsonl'
}

const VALID_TYPES = ['free_enrollment', 'cohort_enrollment', 'abandoned_checkout']

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function sendNotificationEmail(event: NotificationEvent): Promise<void> {
  if (!VALID_TYPES.includes(event.type)) {
    throw new Error(`Unknown notification type: ${(event as any).type}`)
  }
  if (process.env.EMAIL_PROVIDER === 'none' || !process.env.EMAIL_PROVIDER) {
    const { mkdirSync, appendFileSync } = await import('node:fs')
    const { dirname } = await import('node:path')
    try {
      mkdirSync(dirname(logPath()), { recursive: true })
      appendFileSync(logPath(), JSON.stringify({ ...event, sent_at: nowIso() }) + '\n')
    } catch (err) {
      console.error('[sendNotificationEmail] could not write stub log', err)
    }
    console.log(`[sendNotificationEmail:stub] ${event.type} ${'email' in event.user ? event.user.email : ''}`)
    return
  }
  // Real provider integration lands here once an account is supplied (Q6 open).
  console.warn('[sendNotificationEmail] EMAIL_PROVIDER set but no implementation; event logged only.')
}
