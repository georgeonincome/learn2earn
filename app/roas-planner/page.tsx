'use client'

/**
 * RoasPlanner — reference RoasPlanner UI.
 * ROAS calculator for Meta-ads students: fill in your numbers to see the verdict.
 */

import { useState } from 'react'
import { ChevronRight } from 'lucide-react'

export default function RoasPlannerPage() {
  const [dailyBudget, setDailyBudget] = useState(5000)
  const [costPerLead, setCostPerLead] = useState(250)
  const [conversionRate, setConversionRate] = useState(5)

  const clicks = Math.round(dailyBudget / costPerLead)
  const leads = Math.round((clicks * conversionRate) / 100)
  const estimatedRevenue = leads * 5000
  const breakEvenRoas = dailyBudget / estimatedRevenue
  const estimatedProfit = estimatedRevenue - dailyBudget

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Roas Planner</h1>
          <p className="text-[#737373] text-sm mt-1">Fill in your numbers to see the verdict.</p>
        </div>
      </div>

      <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-6 space-y-6">
        <h2 className="font-bold text-lg">Your numbers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#737373]">Daily budget (KES)</label>
            <input
              type="number"
              className="w-full rounded-md border border-[#E5E5E5] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1DB96B]"
              value={dailyBudget}
              onChange={(e) => setDailyBudget(Math.max(0, Number(e.target.value) || 0))}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#737373]">Cost per lead (KES)</label>
            <input
              type="number"
              className="w-full rounded-md border border-[#E5E5E5] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1DB96B]"
              value={costPerLead}
              onChange={(e) => setCostPerLead(Math.max(1, Number(e.target.value) || 1))}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#737373]">Conversion rate (%)</label>
            <input
              type="number"
              className="w-full rounded-md border border-[#E5E5E5] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1DB96B]"
              value={conversionRate}
              onChange={(e) => setConversionRate(Math.max(0, Math.min(100, Number(e.target.value) || 0)))}
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-6 space-y-4">
        <h2 className="font-bold text-lg">Estimated results</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-lg border border-[#E5E5E5] p-4 text-center">
            <div className="text-xs font-semibold text-[#737373]">Estimated clicks</div>
            <div className="text-2xl font-extrabold">{clicks}</div>
          </div>
          <div className="rounded-lg border border-[#E5E5E5] p-4 text-center">
            <div className="text-xs font-semibold text-[#737373]">Estimated leads</div>
            <div className="text-2xl font-extrabold">{leads}</div>
          </div>
          <div className="rounded-lg border border-[#E5E5E5] p-4 text-center">
            <div className="text-xs font-semibold text-[#737373]">Estimated revenue (KES)</div>
            <div className="text-2xl font-extrabold">{estimatedRevenue.toFixed(0)}</div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-lg border border-[#E5E5E5] p-4 text-center">
            <div className="text-xs font-semibold text-[#737373]">Break-even ROAS</div>
            <div className="text-2xl font-extrabold">{breakEvenRoas.toFixed(2)}x</div>
          </div>
          <div className="rounded-lg border border-[#E5E5E5] p-4 text-center">
            <div className="text-xs font-semibold text-[#737373]">Estimated profit (KES)</div>
            <div className="text-2xl font-extrabold">{estimatedProfit.toFixed(0)}</div>
          </div>
        </div>
        <div className="bg-[#F3FBF6] rounded-lg p-4">
          <p className="text-sm font-semibold text-[#1DB96B]">
            {estimatedProfit > 0 ? 'Profitable — scale it.' : 'Not yet profitable — lower your cost per lead or improve conversion.'}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-6">
        <h2 className="font-bold text-lg mb-4">Want to go deeper?</h2>
        <p className="text-[#737373] text-sm mb-4">Learn to run Meta Ads profitably in our Meta Ads Masterclass.</p>
        <a
          href="/checkout?course=meta-ads-mastery-from-setup-to-sales"
          className="inline-flex items-center gap-2 rounded-lg bg-[#1DB96B] px-6 py-3 text-sm font-bold text-white hover:bg-[#17A05D]"
        >
          Enrol now — KES 2,490 <ChevronRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  )
}
