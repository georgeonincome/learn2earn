// Currency conversion configuration
// Rate: 1 KES = 0.155 ZMW (as of 2026-10-28)

export const ZMW_RATE = 0.155

export function toZMW(kes: number): number {
  return Math.round(kes * ZMW_RATE)
}
