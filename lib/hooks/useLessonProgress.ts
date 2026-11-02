'use client'
import { useState, useEffect, useCallback } from 'react'

export type LessonProgress = {
  lesson_id: string
  completed: boolean
  last_position_seconds: number | null
  completed_at: string | null
  updated_at: number | null
} | null

export function useLessonProgress(lessonId: string) {
  const [progress, setProgress] = useState<LessonProgress>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!lessonId) return
    try {
      const res = await fetch(`/api/lessons/${lessonId}/progress`)
      if (res.status === 401) { setProgress(null); return }
      if (!res.ok) throw new Error('Failed to load progress')
      const data = await res.json()
      setProgress(data.progress ?? null)
    } catch (err) {
      console.error('[useLessonProgress]', err)
    } finally {
      setLoading(false)
    }
  }, [lessonId])

  useEffect(() => { refresh() }, [refresh])

  const savePosition = useCallback(async (seconds: number, enrollmentId?: string) => {
    if (!lessonId || seconds == null) return
    await fetch(`/api/lessons/${lessonId}/progress`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action: 'progress', lastPositionSeconds: Math.round(seconds), enrollmentId }),
    })
  }, [lessonId])

  const saveComplete = useCallback(async (enrollmentId?: string) => {
    if (!lessonId) return null
    const res = await fetch(`/api/lessons/${lessonId}/progress`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action: 'complete', completed: true, enrollmentId }),
    })
    if (!res.ok) return null
    const data = await res.json()
    setProgress(data.progress ?? null)
    return data
  }, [lessonId])

  return { progress, loading, refresh, savePosition, saveComplete }
}
