// Individual cohort session player — mirrors reference CohortPlayer-CWsABBCl.js.
// Route: /cohort/[cohortId]/lesson/[lessonId]
import { notFound } from 'next/navigation'
import { getCohortPlayer } from '@/lib/server/cohort-player'
import { CohortSessionPlayer } from '@/components/cohort-player/CohortSessionPlayer'

export async function generateMetadata({ params }: { params: Promise<{ cohortId: string; lessonId: string }> }) {
  const { cohortId, lessonId } = await params
  const data = await getCohortPlayer(cohortId)
  if (!data) return { title: 'Session Not Found' }
  const session = data.sessions.find((s) => s.id === lessonId)
  return {
    title: `${session?.title ?? 'Session'} | ${data.cohort.title}`,
  }
}

export default async function CohortSessionPage({ params }: { params: Promise<{ cohortId: string; lessonId: string }> }) {
  const { cohortId, lessonId } = await params
  const data = await getCohortPlayer(cohortId)
  if (!data) notFound()
  const session = data.sessions.find((s) => s.id === lessonId)
  if (!session) notFound()
  return <CohortSessionPlayer cohortId={cohortId} lessonId={lessonId} />
}
