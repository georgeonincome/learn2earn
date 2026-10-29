import Link from 'next/link'
import { Users, Clock, Lock, CreditCard, Play, ArrowRight } from 'lucide-react'

const MOCK_USERS = [
  {
    id: 1,
    name: 'Mutale Chanda',
    email: 'mutale@example.com',
    phone: '+260 97 123 4567',
    role: 'student',
    status: 'active',
    joined: '2026-01-15',
    courses: 3,
    lastActive: '2 days ago',
  },
  {
    id: 2,
    name: 'Lucy Banda',
    email: 'lucy@example.com',
    phone: '+260 96 234 5678',
    role: 'student',
    status: 'active',
    joined: '2026-02-20',
    courses: 2,
    lastActive: '5 hours ago',
  },
  {
    id: 3,
    name: 'Sarai Mwale',
    email: 'sarai@example.com',
    phone: '+260 95 345 6789',
    role: 'student',
    status: 'active',
    joined: '2026-03-10',
    courses: 1,
    lastActive: '1 week ago',
  },
  {
    id: 4,
    name: 'Gideon Phiri',
    email: 'gideon@example.com',
    phone: '+260 97 456 7890',
    role: 'student',
    status: 'active',
    joined: '2026-04-05',
    courses: 4,
    lastActive: '3 days ago',
  },
  {
    id: 5,
    name: 'Sandy Tembo',
    email: 'sandy@example.com',
    phone: '+260 96 567 8901',
    role: 'student',
    status: 'active',
    joined: '2026-05-12',
    courses: 2,
    lastActive: '6 hours ago',
  },
]

const ROLE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  student: { label: 'Student', color: '#6B7280', bg: '#F3F4F6' },
  admin: { label: 'Admin', color: '#1DB96B', bg: '#E8F6EF' },
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  active: { label: 'Active', color: '#0F7A42', bg: '#E8F6EF' },
  inactive: { label: 'Inactive', color: '#6B7280', bg: '#F3F4F6' },
  suspended: { label: 'Suspended', color: '#DC2626', bg: '#FEE2E2' },
}

export default function AdminUsers() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#111111]">Users</h1>
          <p className="text-[#737373] text-sm">Manage registered learners and their accounts.</p>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1DB96B] text-[#111111] text-sm font-bold hover:bg-[#17A05D] transition-colors"
        >
          View Dashboard <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E5E5E5]">
                <th className="py-4 text-sm font-bold text-[#737373]">User</th>
                <th className="py-4 text-sm font-bold text-[#737373]">Role</th>
                <th className="py-4 text-sm font-bold text-[#737373]">Status</th>
                <th className="py-4 text-sm font-bold text-[#737373]">Courses</th>
                <th className="py-4 text-sm font-bold text-[#737373]">Last Active</th>
                <th className="py-4 text-sm font-bold text-[#737373]">Joined</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_USERS.map((user) => {
                const role = ROLE_CONFIG[user.role] ?? ROLE_CONFIG.student
                const status = STATUS_CONFIG[user.status] ?? STATUS_CONFIG.active
                return (
                  <tr key={user.id} className="border-b border-[#F3F4F6] hover:bg-[#FAFAFA] transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#EEF1EE] flex items-center justify-center text-center font-semibold text-[#111111]">
                          {user.name.slice(0, 1)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#111111]">{user.name}</p>
                          <p className="text-xs text-[#737373]">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: role.bg, color: role.color }}>
                        {role.label}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: status.bg, color: status.color }}>
                        {status.label}
                      </span>
                    </td>
                    <td className="py-4 text-sm text-[#737373]">{user.courses}</td>
                    <td className="py-4 text-sm text-[#737373]">{user.lastActive}</td>
                    <td className="py-4 text-sm text-[#737373]">{user.joined}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
        <h2 className="text-lg font-bold text-[#111111] mb-6">User Statistics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { label: 'Total Users', value: MOCK_USERS.length, icon: Users },
            { label: 'Active Students', value: MOCK_USERS.filter(u => u.status === 'active').length, icon: Play },
            { label: 'Admins', value: MOCK_USERS.filter(u => u.role === 'admin').length, icon: Lock },
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
      </div>
    </div>
  )
}
