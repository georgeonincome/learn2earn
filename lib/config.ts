// Currency conversion configuration
// Rate: 1 KES = 0.155 ZMW (as of 2026-10-28)

export const KES_TO_ZMW_RATE = 0.155

export function toZMW(kes: number): number {
  return Math.round(kes * KES_TO_ZMW_RATE)
}
