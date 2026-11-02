import Link from 'next/link'
import { MEMBERSHIP_PLANS } from '@/lib/data'
import { formatPrice } from '@/lib/utils'
import DashboardLayout from '@/components/dashboard/DashboardLayout'

/**
 * Subscription Plan Page
 *
 * Route: /dashboard/plan
 *
 * Displays current membership plan and upgrade options.
 */

export default function PlanPage() {
  const currentPlan = MEMBERSHIP_PLANS.find((p) => p.popular) ?? MEMBERSHIP_PLANS[0]

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-extrabold">Membership Plan</h1>
        <Link
          href="/subscribe"
          className="text-sm font-semibold text-[#1DB96B] hover:underline"
        >
          Change Plan
        </Link>
      </div>

      {/* Current Plan */}
      <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-6 mb-8">
        <h2 className="text-xl font-extrabold mb-4">Current Plan</h2>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">{currentPlan.name}</h3>
            <p className="text-sm text-[#737373]">{currentPlan.duration} membership</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{formatPrice(currentPlan.price)}</div>
            {currentPlan.originalPrice && (
              <span className="text-sm text-[#737373] line-through">
                {formatPrice(currentPlan.originalPrice)}
              </span>
            )}
          </div>
        </div>
        <div className="mt-4">
          <h4 className="text-sm font-semibold mb-2">What's Included:</h4>
          <ul className="space-y-2">
            {currentPlan.features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-[#737373]">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1DB96B]/10 text-[#1DB96B] text-xs">
                  ✓
                </span>
                {f}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-4">
          <Link
            href="/subscribe"
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg px-6 py-2 text-sm font-semibold transition-colors" style={{ minHeight: 44, borderRadius: 8, background: '#1DB96B', color: '#fff', border: '1px solid #1DB96B', padding: '0 18px' }}
          >
            Manage Subscription
          </Link>
        </div>
      </div>

      {/* All Plans */}
      <section className="mb-8">
        <h2 className="text-xl font-extrabold mb-6">All Plans</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {MEMBERSHIP_PLANS.map((p) => (
            <PlanCard key={p.id} plan={p} isPopular={p.popular} />
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="text-xl font-extrabold mb-4">Frequently Asked Questions</h2>
        <div className="space-y-2">
          <FaqItem
            question="Can I cancel my membership?"
            answer="Yes, you can cancel anytime. Your access continues until the end of your billing period."
          />
          <FaqItem
            question="What happens when my membership ends?"
            answer="Your membership access expires, but any courses you purchased individually stay in your account."
          />
          <FaqItem
            question="Can I pay with mobile money?"
            answer="Yes, we accept MTN, Airtel, and Zamtel mobile money, as well as card payments."
          />
        </div>
      </section>
    </DashboardLayout>
  )
}

interface PlanCardProps {
  plan: any
  isPopular: boolean
}

function PlanCard({ plan, isPopular }: PlanCardProps) {
  return (
    <div className={`rounded-xl border p-6 ${
      isPopular ? 'border-[#1DB96B] bg-[#F3FBF6]' : 'border-[#E5E5E5] bg-[#FFFFFF]'
    }`}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold">{plan.name}</h3>
        {isPopular && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1DB96B] text-white text-xs font-bold">
            Popular
          </span>
        )}
      </div>
      <div className="text-3xl font-bold">{formatPrice(plan.price)}</div>
      <p className="text-sm text-[#737373] mt-2">{plan.duration} membership</p>
      <ul className="mt-4 space-y-2">
        {plan.features.map((f: string) => (
          <li key={f} className="flex items-center gap-2 text-sm text-[#737373]">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#1DB96B]/10 text-[#1DB96B] text-xs">
              ✓
            </span>
            {f}
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <Link
          href={`/subscribe?plan=${plan.id}`}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg px-6 py-2 text-sm font-semibold transition-colors" style={{ minHeight: 44, borderRadius: 8, background: isPopular ? '#1DB96B' : '#FFFFFF', color: isPopular ? '#fff' : '#111111', border: `1px solid ${isPopular ? '#1DB96B' : '#E5E5E5'}`, padding: '0 18px' }}
        >
          {isPopular ? 'Get This Plan' : 'Choose Plan'}
        </Link>
      </div>
    </div>
  )
}

interface FaqItemProps {
  question: string
  answer: string
}

function FaqItem({ question, answer }: FaqItemProps) {
  return (
    <div className="border-b border-[#E5E5E5] pb-4 last:border-0">
      <h3 className="text-sm font-bold">{question}</h3>
      <p className="text-sm text-[#737373] mt-1">{answer}</p>
    </div>
  )
}
