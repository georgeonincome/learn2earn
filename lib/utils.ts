import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(amount: number, currency: string = 'ZMW'): string {
  if (amount === 0) return 'Free'
  return `${currency} ${amount.toLocaleString('en-ZM')}`
}

export function formatPhoneNumber(phone: string): string {
  // Format Zambian phone numbers
  return phone.replace(/(\+260)(\d{2})(\d{3})(\d{4})/, '+260 $2 $3 $4')
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '')
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

export function getReadingTime(content: string): string {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  const minutes = Math.ceil(wordCount / wordsPerMinute)
  return `${minutes} min read`
}
