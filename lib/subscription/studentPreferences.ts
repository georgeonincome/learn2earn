'use client'

/**
 * studentPreferences — client hook for student notification/learning preferences.
 * Mirror of the reference studentPreferences chunk defaults, now persisted via
 * /api/student-preferences (`student_save_preferences` / `student_settings_data` contracts).
 */

import { useState, useEffect, useCallback } from 'react'

export type StudentPreferences = {
  notifications: {
    classReminders: boolean
    whatsappReminders: boolean
    courseUpdates: boolean
    skillcheckReminders: boolean
    offers: boolean
    weeklyProgress: boolean
  }
  learning: {
    dataSaver: boolean
    autoplayNext: boolean
    captions: boolean
  }
}

// Reference studentPreferences-k8XJ8C4f.js defaults:
// notifications: classReminders true, whatsappReminders false, courseUpdates true,
//                skillcheckReminders true, offers true, weeklyProgress false
// learning:      dataSaver false, autoplayNext true, captions true
export const DEFAULT_PREFERENCES: StudentPreferences = {
  notifications: {
    classReminders: true,
    whatsappReminders: false,
    courseUpdates: true,
    skillcheckReminders: true,
    offers: true,
    weeklyProgress: false,
  },
  learning: {
    dataSaver: false,
    autoplayNext: true,
    captions: true,
  },
}

export function useStudentPreferences() {
  const [prefs, setPrefs] = useState<StudentPreferences>(DEFAULT_PREFERENCES)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch('/api/student-preferences')
      if (res.status === 401) {
        setPrefs(DEFAULT_PREFERENCES)
        return
      }
      if (!res.ok) throw new Error('Could not load preferences')
      setPrefs(await res.json())
    } catch (err) {
      console.error('[useStudentPreferences] load', err)
      setError((err as Error)?.message ?? 'Could not load preferences')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  /** Upsert the provided keys only (reference `student_save_preferences`). */
  const update = useCallback(async (updates: Partial<StudentPreferences>) => {
    const flat: Record<string, boolean> = {
      ...(updates.notifications ?? {}),
      ...(updates.learning ?? {}),
    }
    setPrefs((prev) => ({
      notifications: { ...prev.notifications, ...(updates.notifications ?? {}) },
      learning: { ...prev.learning, ...(updates.learning ?? {}) },
    }))
    const res = await fetch('/api/student-preferences', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ updates: flat }),
    })
    if (!res.ok) console.error('[useStudentPreferences] save failed')
  }, [])

  return { prefs, loading, error, update, refresh }
}
