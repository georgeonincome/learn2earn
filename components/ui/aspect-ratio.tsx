'use client'

/**
 * AspectRatio — maintains a consistent aspect ratio for content.
 *
 * Mirrors reference aspect-ratio component.
 *
 * Props:
 *   ratio: number - Aspect ratio (e.g., 16 / 9)
 *   className: string - Additional CSS classes
 *   children: ReactNode - Content to display
 */

import { useState, useEffect } from 'react'

export function AspectRatio({
  ratio,
  className,
  children,
}: {
  ratio: number
  className?: string
  children: React.ReactNode
}) {
  const [height, setHeight] = useState(0)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const updateDimensions = () => {
      const parentWidth = window.innerWidth
      setWidth(parentWidth)
      setHeight(parentWidth / ratio)
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [ratio])

  const paddingBottom = (1 / ratio) * 100

  return (
    <div
      className={`relative ${className ?? ''}`}
      style={{ width: '100%', paddingBottom: `${paddingBottom}%` }}
    >
      <div
        className="absolute inset-0 w-full h-full"
        style={{ width: '100%', height: '100%' }}
      >
        {children}
      </div>
    </div>
  )
}
