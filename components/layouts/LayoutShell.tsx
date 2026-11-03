'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from '@/components/layouts/Navbar'
import { Footer } from '@/components/layouts/Footer'

// Public routes that get Navbar + Footer wrapper
const PUBLIC_ROUTES = [
  '/', '/courses', '/cohorts', '/masterclasses', '/books', '/faq', '/contact',
  '/about', '/welcome', '/verify', '/skillcheck', '/va', '/virtual-assistant',
  '/virtual-assistant-classes-in-kenya', '/ads-oct-2026', '/ai-class', '/ai-web-design',
  '/claude', '/cdl', '/meta-ads', '/smm-meta-2027', '/video-editing', '/vibe-coding',
  '/darasa-sessions', '/privacy-policy', '/terms', '/refund-policy', '/bundle-success',
  '/payment-success', '/payment-failed', '/checkout'
]
const PUBLIC_PATH_PREFIXES = [
  '/courses/', '/cohorts/', '/cohort/', '/books/', '/bundle/', '/verify/',
  '/blog/', '/funnels/', '/masterclasses/', '/darasa-sessions/', '/ads-oct-2026/'
]

// Routes that should NOT get Navbar/Footer (have their own layout or no chrome)
const NO_CHROME_PREFIXES = ['/admin/', '/dashboard/']
const NO_CHROME_ROUTES = ['/auth', '/auth/login', '/auth/register', '/admin/login', '/admin/register']

export default function LayoutShell({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const isAuthRoute = NO_CHROME_ROUTES.some((r) => pathname === r || pathname.startsWith(r + '/'))
  const isNoChromeRoute =
    NO_CHROME_PREFIXES.some((p) => pathname.startsWith(p)) || isAuthRoute

  // Only show Navbar/Footer on public routes — NOT on admin, dashboard, or auth routes
  const isPublicRoute = !isNoChromeRoute && (
    PUBLIC_ROUTES.includes(pathname) ||
    PUBLIC_PATH_PREFIXES.some((p) => pathname.startsWith(p))
  )

  return (
    <>
      {isPublicRoute && <Navbar />}
      <main className="min-h-screen">
        {children}
      </main>
      {isPublicRoute && <Footer />}
    </>
  )
}