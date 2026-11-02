'use client'

import Link from 'next/link'
import type { CSSProperties } from 'react'

/* Shared pill tabs for the /courses, /cohorts and /books catalog views —
   identical row on all three pages; the active tab renders as a green pill,
   the other two render as links, so switching tabs keeps the same sequence. */

const COLORS = {
  surface: '#FFFFFF',
  border: '#E5E5E5',
  primary: '#1DB96B',
  textSecondary: '#404040',
}

const TABS = [
  { key: 'courses', href: '/courses' },
  { key: 'cohorts', href: '/cohorts' },
  { key: 'books', href: '/books' },
] as const

export type CatalogTab = (typeof TABS)[number]['key']

const pillBase: CSSProperties = {
  padding: '8px 18px',
  borderRadius: 999,
  minHeight: 38,
  fontWeight: 500,
  display: 'inline-flex',
  alignItems: 'center',
}

export default function CatalogTabs({ active }: { active: CatalogTab }) {
  return (
    <div
      className="inline-flex p-1 gap-1"
      style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 999 }}
    >
      {TABS.map(tab => {
        const isActive = tab.key === active
        const className = 'text-sm capitalize transition-colors'
        if (isActive) {
          return (
            <button
              key={tab.key}
              type="button"
              className={className}
              style={{ ...pillBase, background: COLORS.primary, color: '#fff', border: 'none', cursor: 'pointer' }}
              aria-current="page"
            >
              {tab.key}
            </button>
          )
        }
        return (
          <Link
            key={tab.key}
            href={tab.href}
            className={className}
            style={{ ...pillBase, background: 'transparent', color: COLORS.textSecondary, fontWeight: 400 }}
          >
            {tab.key}
          </Link>
        )
      })}
    </div>
  )
}
