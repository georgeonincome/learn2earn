import Link from 'next/link'
import { SITE_CONFIG } from '@/lib/data'
import DashboardLayout from '@/components/dashboard/DashboardLayout'

/**
 * Settings Page
 *
 * Route: /dashboard/settings
 *
 * Account settings, notification preferences, and account management.
 */

export default function SettingsPage() {
  const firstName = SITE_CONFIG.founder.name.split(' ').slice(-1).join(' ')

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-extrabold mb-8">Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Account Settings */}
        <div className="lg:col-span-2">
          <section className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-6 mb-8">
            <h2 className="text-xl font-extrabold mb-6">Account Information</h2>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1DB96B]/10 text-[#1DB96B]">
                  <span className="w-6 h-6">G</span>
                </div>
                <div>
                  <h3 className="font-bold">{SITE_CONFIG.founder.name}</h3>
                  <p className="text-sm text-[#737373]">{SITE_CONFIG.founder.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 border-t border-[#E5E5E1] pt-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F59E0B]/10 text-[#F59E0B]">
                  <span className="w-6 h-6">📱</span>
                </div>
                <div>
                  <h3 className="font-bold">Mobile Number</h3>
                  <p className="text-sm text-[#737373]">{SITE_CONFIG.founder.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 border-t border-[#E5E5E5] pt-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E5E5E5] text-[#737373]">
                  <span className="w-6 h-6">🏠</span>
                </div>
                <div>
                  <h3 className="font-bold">Location</h3>
                  <p className="text-sm text-[#737373]">{SITE_CONFIG.founder.location}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-6">
            <h2 className="text-xl font-extrabold mb-6">Change Password</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Current Password</label>
                <input
                  type="password"
                  className="w-full rounded-lg border border-[#E5E5E5] px-4 py-2 text-sm focus:outline-none focus:border-[#1DB96B]"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">New Password</label>
                <input
                  type="password"
                  className="w-full rounded-lg border border-[#E5E5E5] px-4 py-2 text-sm focus:outline-none focus:border-[#1DB96B]"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Confirm Password</label>
                <input
                  type="password"
                  className="w-full rounded-lg border border-[#E5E5E5] px-4 py-2 text-sm focus:outline-none focus:border-[#1DB96B]"
                  placeholder="••••••••"
                />
              </div>
              <button
                className="w-full rounded-lg px-6 py-2 text-sm font-semibold transition-colors" style={{ minHeight: 44, borderRadius: 8, background: '#1DB96B', color: '#fff', border: '1px solid #1DB96B', padding: '0 18px' }}
              >
                Update Password
              </button>
            </form>
          </section>
        </div>

        {/* Right Column - Notification Preferences */}
        <div className="lg:col-span-1">
          <section className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-6 mb-8 sticky top-24">
            <h2 className="text-xl font-extrabold mb-6">Notification Preferences</h2>
            <div className="space-y-4">
              <PreferenceToggle
                label="Class Reminders"
                description="Get notified about upcoming classes and sessions"
                checked={true}
              />
              <PreferenceToggle
                label="WhatsApp Reminders"
                description="Receive reminders via WhatsApp"
                checked={false}
              />
              <PreferenceToggle
                label="Course Updates"
                description="Get notified about new courses and content"
                checked={true}
              />
              <PreferenceToggle
                label="Quiz Reminders"
                description="Get notified about upcoming quizzes"
                checked={true}
              />
              <PreferenceToggle
                label="Special Offers"
                description="Receive promotional offers and discounts"
                checked={true}
              />
              <PreferenceToggle
                label="Weekly Progress"
                description="Receive weekly progress summary"
                checked={false}
              />
            </div>
          </section>

          <section className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-6">
            <h2 className="text-xl font-extrabold mb-6">Danger Zone</h2>
            <div className="space-y-4">
              <div className="p-4 rounded-lg border border-[#FEE2E2] bg-[#FEF2F2]">
                <h3 className="font-bold text-[#991B1B]">Delete Account</h3>
                <p className="text-sm text-[#991B1B] mt-1">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <button
                  className="mt-3 inline-flex items-center gap-2 rounded-lg px-6 py-2 text-sm font-semibold transition-colors" style={{ minHeight: 44, borderRadius: 8, background: '#FEE2E2', color: '#991B1B', border: '1px solid #FCA5A5', padding: '0 18px' }}
                >
                  Delete Account
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  )
}

interface PreferenceToggleProps {
  label: string
  description: string
  checked: boolean
}

function PreferenceToggle({ label, description, checked }: PreferenceToggleProps) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-[#E5E5E5] bg-[#FFFFFF]">
      <div>
        <h3 className="font-bold text-sm">{label}</h3>
        <p className="text-xs text-[#737373]">{description}</p>
      </div>
      <div className="relative inline-flex w-14 h-7">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          defaultChecked={checked}
        />
        <div className="relative inline-flex w-14 h-7 rounded-full bg-[#E5E5E5] peer-checked:bg-[#1DB96B] transition-colors duration-200 focus:outline-none">
          <span className="inline-block h-5 w-5 rounded-full bg-white shadow shadow-sm transition-all duration-200 peer-checked:translate-x-7"></span>
        </div>
      </div>
    </div>
  )
}
