// Cohort player landing page — session list with progress.
// Route: /cohort/[cohortId]
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Calendar, Clock, Check, Play, Lock, ChevronRight } from 'lucide-react'
import { getCohortPlayer } from '@/lib/server/cohort-player'

export async function generateMetadata({ params }: { params: Promise<{ cohortId: string }> }) {
  const { cohortId } = await params
  const data = await getCohortPlayer(cohortId)
  if (!data) return { title: 'Cohort Not Found' }
  return { title: `${data.cohort.title} | Learn2Earn` }
}

export default async function CohortPlayerPage({ params }: { params: Promise<{ cohortId: string }> }) {
  const { cohortId } = await params
  const data = await getCohortPlayer(cohortId)
  if (!data) notFound()

  const total = data.sessions.length
  const done = data.sessions.filter((s) => s.done).length
  const progressPercent = total > 0 ? Math.round((done / total) * 100) : 0

  return (
    <div className="min-h-screen bg-[#F6F7F5] text-[#10201A]">
      <header className="border-b border-[#E3E8E5] bg-white sticky top-0 z-20">
        <div className="mx-auto max-w-[1500px] px-4 sm:px-5 py-2.5">
          <div className="flex items-center gap-2">
            <Link
              href="/cohorts"
              className="rounded-lg p-2 hover:bg-[#F1F4F2] text-[#10201A]"
              aria-label="Back to my live classes"
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
            </Link>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[15px] font-bold">{data.cohort.title}</p>
              <div className="mt-1 flex items-center gap-2.5">
                <div className="h-1.5 w-24 overflow-hidden rounded-full bg-[#E8EEEA] sm:w-40">
                  <span className="block h-full rounded-full bg-[#1DB96B]" style={{ width: `${progressPercent}%` }} />
                </div>
                <span className="whitespace-nowrap text-xs text-[#5B6B64]">
                  {done} of {total} done
                </span>
              </div>
            </div>
            {data.cohort.whatsappGroupUrl && (
              <a
                href={data.cohort.whatsappGroupUrl}
                target="_blank"
                rel="noreferrer"
                className="hidden rounded-lg p-2 text-[#1E9E57] hover:bg-[#E8F6EF] sm:block"
                aria-label="Class WhatsApp group"
              >
                <span className="w-4 h-4" />
              </a>
            )}
            <a
              href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(data.cohort.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-lg p-2 text-[#1E9E57] hover:bg-[#E8F6EF] sm:block"
              aria-label="Add to Google Calendar"
            >
              <span className="w-4 h-4" />
            </a>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1500px] py-8">
        <main className="min-w-0 pb-28">
          <div className="px-4 pt-4 sm:px-5 sm:pt-5">
            {data.sessions.map((session) => (
              <SessionItem
                key={session.id}
                session={session}
                current={false}
                onSelect={() => {}}
              />
            ))}
          </div>
        </main>
        <aside className="hidden border-l border-[#E3E8E5] bg-white lg:block">
          <div className="sticky top-[61px] max-h-[calc(100dvh-61px)] overflow-y-auto p-4">
            <p className="mb-2 px-3 text-sm font-bold">
              Sessions{' '}
              <span className="font-semibold text-[#5B6B64]">· {done} of {total} done</span>
            </p>
            <ol className="space-y-0.5">
              {data.sessions.map((session, idx) => (
                <li key={session.id}>
                  <button
                    onClick={() => {}}
                    className="flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-[#F1F4F2]"
                  >
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold tabular-nums border border-[#CBD5D0] text-[#5B6B64]">
                      {idx + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[14px] leading-snug font-semibold">{session.title}</span>
                      <span className="mt-0.5 flex items-center gap-2 text-xs text-[#5B6B64]">
                        {session.minutes} min
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </div>
    </div>
  )
}

function SessionItem({ session, current, onSelect }: { session: any; current: boolean; onSelect: () => void }) {
  const stage = 'ready' // simplified
  return (
    <li>
      <button
        onClick={onSelect}
        className="flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-[#F1F4F2]"
      >
        <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold tabular-nums bg-[#0B854C] text-white">
          ✓
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[14px] leading-snug font-bold">{session.title}</span>
          <span className="mt-0.5 flex items-center gap-2 text-xs text-[#5B6B64]">
            <Calendar className="w-3 h-3" />
            {new Date(session.startsAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'Africa/Lusaka' })}
            <span>•</span>
            <Clock className="w-3 h-3" />
            {session.minutes} min
          </span>
        </span>
        <Check className="w-3.5 h-3.5 text-[#0B854C]" />
      </button>
    </li>
  )
}
