// Marketing tracking — mirrors reference metaPixel-Dy9nrdR3.js contract:
//   f  = trackPurchase(value, txRef)        → fbq('track','Purchase',...)
//   m  = trackViewContent(value)            → fbq('track','ViewContent',...)
//   g  = lead/contact events                → fbq('lead', ...)
//   t  = dispatch(event, {content_name, value})
// The reference stubs window.fbq calls safely when no pixel is loaded, so an
// absent Meta pixel degrades to a console listener — never an error.
export type MetaEvent = 'ViewContent' | 'InitiateCheckout' | 'Purchase' | 'CompleteRegistration'

type Payload = Record<string, unknown>

export function pageSlug(): string {
  if (typeof window === 'undefined') return 'page'
  return (
    window.location.pathname
      .split('/')
      .filter(Boolean)[0]
      ?.toLowerCase() || 'home'
  )
}

function basePayload(name?: string, value?: number): Payload {
  return {
    content_ids: [pageSlug()],
    content_type: 'product',
    content_name: name || (typeof document !== 'undefined' ? document.title : 'Learn2Earn'),
    value: Number(value) || 0,
    currency: 'ZMW',
  }
}

function fbq(event: MetaEvent | 'Lead', payload?: Payload, eventId?: string) {
  if (typeof window === 'undefined') return
  const w = window as unknown as {
    fbq?: (...args: unknown[]) => void
    __l2eEvents?: Array<{ event: string; payload?: Payload; eventId?: string; at: number }>
  }
  w.__l2eEvents = w.__l2eEvents || []
  w.__l2eEvents.push({ event, payload, eventId, at: Date.now() })
  try {
    w.fbq?.('track', event, payload, eventId ? { eventID: eventId } : undefined)
  } catch {
    // pixel not loaded — no-op (reference behavior)
  }
}

export function trackViewContent(name?: string, value?: number) {
  fbq('ViewContent', basePayload(name, value))
}

export function trackInitiateCheckout(name?: string, value?: number) {
  fbq('InitiateCheckout', basePayload(name, value))
}

export function trackPurchase(name?: string, value?: number, eventId?: string) {
  fbq('Purchase', basePayload(name, value), eventId)
}

export function trackLead(name?: string) {
  fbq('Lead', basePayload(name))
}

export function dispatchMetaEvent(
  event: MetaEvent,
  extra?: { content_name?: string; value?: number },
) {
  fbq(event, basePayload(extra?.content_name, extra?.value))
}

/**
 * checkoutMetadata-D8-3-62L.js — attribution payload attached to every
 * checkout initiation: meta_event_id (session-scoped), buyer email/phone,
 * product slug, user agent, advertising choice.
 */
export function buildCheckoutMetadata(extra?: {
  productId?: string
  email?: string
  phone?: string
}): Record<string, unknown> {
  if (typeof window === 'undefined') return {}
  const meta: Record<string, unknown> = {}

  const params = new URLSearchParams(window.location.search)
  let metaEventId = params.get('meta_event_id')
  if (!metaEventId && extra?.productId) {
    metaEventId = window.sessionStorage.getItem(`c2s_ic:${extra.productId}`)
  }
  if (!metaEventId) {
    for (let i = 0; i < window.sessionStorage.length; i++) {
      const key = window.sessionStorage.key(i)
      if (key?.startsWith('c2s_ic:')) {
        metaEventId = window.sessionStorage.getItem(key) || ''
        break
      }
    }
  }
  if (metaEventId) meta.meta_event_id = metaEventId
  if (extra?.productId) meta.product_id_slug = extra.productId
  meta.user_agent = navigator.userAgent
  if (extra?.email) meta.buyer_email = extra.email.trim().toLowerCase()
  if (extra?.phone) meta.buyer_phone = extra.phone.trim()
  return meta
}
