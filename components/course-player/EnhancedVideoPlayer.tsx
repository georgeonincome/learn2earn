'use client'

/**
 * EnhancedVideoPlayer — mirrors reference CourseLessonRoute video handling
 *
 * Supports YouTube, Vimeo, Supabase, and external video providers.
 * For Supabase URLs, calls the get-course-video-url edge function to get signed URLs.
 *
 * Props:
 *   videoUrl: string - The video URL
 *   videoProvider: string - 'youtube' | 'vimeo' | 'supabase' | 'external'
 *   title: string - Video title for accessibility
 *   lessonId: string - Lesson ID (for Supabase URL generation)
 *   cohortLessonId: string - Cohort lesson ID (optional)
 *   amChallengeDayId: string - AM challenge day ID (optional)
 */

import { useState, useEffect } from 'react'
import { AspectRatio } from '@/components/ui/aspect-ratio'

export function EnhancedVideoPlayer({
  videoUrl,
  videoProvider = 'external',
  title,
  lessonId,
  cohortLessonId,
  amChallengeDayId,
}: {
  videoUrl: string
  videoProvider?: string
  title: string
  lessonId?: string
  cohortLessonId?: string
  amChallengeDayId?: string
}) {
  const [resolvedUrl, setResolvedUrl] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setError(null)

    if (!videoUrl) {
      setResolvedUrl('')
      return
    }

    // If not a Supabase course video URL, use as-is
    if (!videoUrl.includes('/course-videos/')) {
      setResolvedUrl(videoUrl)
      return
    }

    // Fetch signed URL from edge function
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/course-videos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            video_url: videoUrl,
            lesson_id: lessonId,
            cohort_lesson_id: cohortLessonId,
            am_challenge_day_id: amChallengeDayId,
          }),
        })

        if (cancelled) return

        if (!res.ok) {
          setError(res.statusText || 'Unable to load video')
          return
        }

        const data = await res.json()
        if (!data || !data.url) {
          setError(data.error || 'Unable to load video')
          return
        }

        setResolvedUrl(data.url)
      } catch (err) {
        if (cancelled) return
        setError(err instanceof Error ? err.message : 'Unable to load video')
      }
    })()

    return () => {
      cancelled = true
    }
  }, [videoUrl, lessonId, cohortLessonId, amChallengeDayId])

  // Extract YouTube video ID
  const getYouTubeId = (url: string): string | null => {
    try {
      const u = new URL(url)
      if (u.hostname === 'youtu.be') return u.pathname.slice(1).split('?')[0]
      if (u.hostname.includes('youtube.com')) {
        if (u.pathname.includes('/watch')) return u.searchParams.get('v') || null
        if (u.pathname.includes('/embed/'))
          return u.pathname.split('/embed/')[1]?.split('?')[0] || null
        if (u.pathname.includes('/shorts/'))
          return u.pathname.split('/shorts/')[1]?.split('?')[0] || null
      }
    } catch {
      // Fallback to regex
      if (url.includes('youtu.be/'))
        return url.split('youtu.be/')[1]?.split(/[?&]/)[0] || null
      if (url.includes('watch?v='))
        return url.split('v=')[1]?.split(/[?&#]/)[0] || null
      if (url.includes('/embed/'))
        return url.split('/embed/')[1]?.split(/[?&#]/)[0] || null
      if (url.includes('/shorts/'))
        return url.split('/shorts/')[1]?.split(/[?&#]/)[0] || null
    }
    return null
  }

  // Build embed URL based on provider
  const buildEmbedUrl = (): string | null => {
    if (!videoUrl) return null

    if (videoProvider === 'youtube') {
      const id = getYouTubeId(videoUrl)
      return id
        ? `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&autoplay=1`
        : null
    }

    if (videoProvider === 'vimeo') {
      const match = videoUrl.match(/vimeo\.com\/(?:[\w-]+\/)*?(\d+)/)
      const id = match ? match[1] : null
      if (!id) return null
      const hash = new URL(videoUrl, 'https://vimeo.com').searchParams.get('h') || ''
      return `https://player.vimeo.com/video/${id}${hash ? `?h=${hash}` : ''}`
    }

    if (videoProvider === 'supabase' || videoProvider === 'external') {
      return resolvedUrl || videoUrl
    }

    return videoUrl
  }

  const embedUrl = buildEmbedUrl()

  if (!videoUrl) {
    return (
      <AspectRatio ratio={16 / 9} className="bg-muted rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">No video available</p>
      </AspectRatio>
    )
  }

  if (error) {
    return (
      <AspectRatio ratio={16 / 9} className="bg-muted rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground text-sm">{error}</p>
      </AspectRatio>
    )
  }

  if (!embedUrl) {
    return (
      <AspectRatio ratio={16 / 9} className="bg-muted rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">Unable to load video</p>
      </AspectRatio>
    )
  }

  if (videoProvider === 'youtube' || videoProvider === 'vimeo') {
    return (
      <AspectRatio ratio={16 / 9} className="bg-black rounded-lg overflow-hidden">
        <iframe
          src={embedUrl}
          title={title}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </AspectRatio>
    )
  }

  // Supabase or external - HTML5 video
  return (
    <AspectRatio ratio={16 / 9} className="bg-black rounded-lg overflow-hidden">
      <video
        controls
        autoPlay
        className="w-full h-full"
        src={embedUrl}
        title={title}
        controlsList="nodownload"
      >
        Your browser does not support the video tag.
      </video>
    </AspectRatio>
  )
}
