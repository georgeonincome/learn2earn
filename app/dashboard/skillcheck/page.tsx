'use client'

/**
 * Dashboard SkillCheck — reference SkillCheck product.
 * Free taster → paid full check → Skill Report with QR share link.
 */

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Play, RefreshCw, ShieldCheck, ChevronRight } from 'lucide-react'

type Check = { id: string; title: string; description: string; level_hint: string; is_free: number; price: number; member_price: number; currency: string; duration_minutes: number }

export default function SkillCheckPage() {
  const [checks, setChecks] = useState<Check[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetch('/api/skill-checks')
      .then((r) => r.ok ? r.json() : [])
      .then((data: any) => { if (!cancelled) setChecks(data ?? []) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  if (loading) return <div className="text-center py-20 text-[#737373]">Loading SkillChecks…</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">SkillCheck</h1>
          <p className="text-[#737373] text-sm mt-1">See your rough level in about 5 minutes. Get a Skill Report with a QR code anyone can check.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {checks.length === 0 ? (
          <div className="col-span-3 text-center py-12 text-[#737373]">No SkillChecks available right now.</div>
        ) : (
          checks.map((c) => (
            <div key={c.id} className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold">{c.title}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  c.is_free === 1 ? 'bg-[#F3FBF6] text-[#0B854C]' : 'bg-[#F5F5F5] text-[#737373]'
                }`}>{c.is_free === 1 ? 'Free taster' : 'Full check'}</span>
              </div>
              <p className="text-sm text-[#737373] mb-4">{c.description}</p>
              <div className="flex items-center gap-2 text-xs text-[#737373] mb-4">
                <Play className="w-3 h-3" /> {c.duration_minutes} min
              </div>
              <div className="flex gap-2">
                {c.is_free === 1 ? (
                  <Link
                    href={`/skillcheck/${c.id}`}
                    className="flex-1 rounded-lg bg-[#1DB96B] px-4 py-2 text-sm font-bold text-white text-center hover:bg-[#17A05D]"
                  >
                    Start taster
                  </Link>
                ) : (
                  <>
                    <Link
                      href={`/checkout?course=${c.id}`}
                      className="flex-1 rounded-lg border border-[#E5E5E5] px-4 py-2 text-sm font-bold text-[#737373] text-center hover:bg-[#F3FBF6]"
                    >
                      ZMW {(c.price * 0.155).toFixed(0)}
                    </Link>
                    <Link
                      href={`/checkout?course=${c.id}`}
                      className="flex-1 rounded-lg bg-[#1DB96B] px-4 py-2 text-sm font-bold text-white text-center hover:bg-[#17A05D]"
                    >
                      Member ZMW {(c.member_price * 0.155).toFixed(0)}
                    </Link>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="bg-[#F3FBF6] rounded-lg p-6">
        <h2 className="font-bold text-lg mb-3">What you get</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center">
            <ShieldCheck className="w-8 h-8 mx-auto mb-2 text-[#0B854C]" />
            <div className="text-sm font-semibold">Skill Report</div>
            <div className="text-xs text-[#737373]">QR code anyone can check</div>
          </div>
          <div className="text-center">
            <RefreshCw className="w-8 h-8 mx-auto mb-2 text-[#F59E0B]" />
            <div className="text-sm font-semibold">Score by topic</div>
            <div className="text-xs text-[#737373]">See your weakest areas</div>
          </div>
          <div className="text-center">
            <Play className="w-8 h-8 mx-auto mb-2 text-[#737373]" />
            <div className="text-sm font-semibold">Course fix</div>
            <div className="text-xs text-[#737373]">Exact course to fix weak areas</div>
          </div>
        </div>
      </div>
    </div>
  )
}
