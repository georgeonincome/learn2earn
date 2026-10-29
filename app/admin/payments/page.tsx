import Link from 'next/link'
import { CreditCard, Clock, Users, Play, ArrowRight, Smartphone } from 'lucide-react'

const MOCK_PAYMENTS = [
  {
    id: 'AIB-001',
    customer: 'Mutale Chanda',
    type: 'Course',
    item: 'AI Automation Bootcamp',
    amount: 417,
    status: 'success',
    method: 'MTN Mobile Money',
    date: '2026-10-25',
    time: '14:30',
  },
  {
    id: 'AIB-002',
    customer: 'Lucy Banda',
    type: 'Membership',
    item: 'One Year Membership',
    amount: 7990,
    status: 'success',
    method: 'Card',
    date: '2026-10-24',
    time: '09:15',
  },
  {
    id: 'AIB-003',
    customer: 'Sarai Mwale',
    type: 'Cohort',
    item: 'AI Unlocked Cohort 2',
    amount: 3690,
    status: 'pending',
    method: 'Airtel Money',
    date: '2026-10-23',
    time: '16:45',
  },
  {
    id: 'AIB-004',
    customer: 'Gideon Phiri',
    type: 'Course',
    item: 'Meta Ads Mastery',
    amount: 851,
    status: 'success',
    method: 'MTN Mobile Money',
    date: '2026-10-22',
    time: '11:20',
  },
  {
    id: 'AIB-005',
    customer: 'Sandy Tembo',
    type: 'Course',
    item: 'Canva Masterclass',
    amount: 707,
    status: 'failed',
    method: 'Card',
    date: '2026-10-21',
    time: '19:00',
  },
  {
    id: 'AIB-006',
    customer: 'Martha Nkhata',
    type: 'Membership',
    item: 'Four Months Membership',
    amount: 2790,
    status: 'success',
    method: 'MTN Mobile Money',
    date: '2026-10-20',
    time: '13:55',
  },
]

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  success: { label: 'Success', color: '#0F7A42', bg: '#E8F6EF' },
  pending: { label: 'Pending', color: '#B45309', bg: '#FDF4E3' },
  failed: { label: 'Failed', color: '#DC2626', bg: '#FEE2E2' },
  refunded: { label: 'Refunded', color: '#6B7280', bg: '#F3F4F6' },
}

const TYPE_CONFIG: Record<string, { label: string; color: string }> = {
  course: { label: 'Course', color: '#1DB96B' },
  membership: { label: 'Membership', color: '#3B82F6' },
  cohort: { label: 'Cohort', color: '#8B5CF6' },
}

export default function AdminPayments() {
  const totalRevenue = MOCK_PAYMENTS
    .filter(p => p.status === 'success')
    .reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#111111]">Payments</h1>
          <p className="text-[#737373] text-sm">View and manage all transactions processed through Flutterwave.</p>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1DB96B] text-[#111111] text-sm font-bold hover:bg-[#17A05D] transition-colors"
        >
          View Dashboard <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        {[
          { label: 'Total Revenue', value: `ZMW ${totalRevenue.toLocaleString('en-ZM')}`, icon: CreditCard, color: '#1DB96B' },
          { label: 'Total Transactions', value: MOCK_PAYMENTS.length, icon: Clock },
          {
            label: 'Successful',
            value: MOCK_PAYMENTS.filter(p => p.status === 'success').length,
            icon: Play,
            color: '#0F7A42',
          },
          {
            label: 'Pending',
            value: MOCK_PAYMENTS.filter(p => p.status === 'pending').length,
            icon: Smartphone,
            color: '#B45309',
          },
        ].map((stat) => (
          <div key={stat.label} className="p-5 rounded-xl bg-[#FAFAFA] border border-[#E5E5E5]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-[#111111]">{stat.value}</p>
                <p className="text-xs text-[#737373]">{stat.label}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#1DB96B]/10 flex items-center justify-center">
                <stat.icon className="w-4 h-4 text-[#1DB96B]" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E5E5E5]">
                <th className="py-4 text-sm font-bold text-[#737373]">Reference</th>
                <th className="py-4 text-sm font-bold text-[#737373]">Customer</th>
                <th className="py-4 text-sm font-bold text-[#737373]">Type</th>
                <th className="py-4 text-sm font-bold text-[#737373]">Item</th>
                <th className="py-4 text-sm font-bold text-[#737373]">Amount</th>
                <th className="py-4 text-sm font-bold text-[#737373]">Status</th>
                <th className="py-4 text-sm font-bold text-[#737373]">Method</th>
                <th className="py-4 text-sm font-bold text-[#737373]">Date</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_PAYMENTS.map((payment) => {
                const status = STATUS_CONFIG[payment.status] ?? STATUS_CONFIG.success
                const type = TYPE_CONFIG[payment.type] ?? TYPE_CONFIG.course
                return (
                  <tr key={payment.id} className="border-b border-[#F3F4F6] hover:bg-[#FAFAFA] transition-colors">
                    <td className="py-4 text-xs font-mono font-medium text-[#111111]">{payment.id}</td>
                    <td className="py-4 text-sm text-[#111111]">{payment.customer}</td>
                    <td className="py-4">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#F3FBF6', color: type.color }}>
                        {type.label}
                      </span>
                    </td>
                    <td className="py-4 text-sm text-[#737373]">{payment.item}</td>
                    <td className="py-4 text-sm font-medium text-[#111111]">
                      ZMW {payment.amount.toLocaleString('en-ZM')}
                    </td>
                    <td className="py-4">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: status.bg, color: status.color }}>
                        {status.label}
                      </span>
                    </td>
                    <td className="py-4 text-sm text-[#737373]">{payment.method}</td>
                    <td className="py-4 text-sm text-[#737373]">
                      {payment.date} · {payment.time}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
