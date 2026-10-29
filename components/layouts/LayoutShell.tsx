'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from '@/components/layouts/Navbar'
import { Footer } from '@/components/layouts/Footer'

const AUTH_ROUTES = ['/auth', '/auth/login', '/auth/register']

export default function LayoutShell({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAuthRoute = AUTH_ROUTES.some((r) => pathname === r || pathname.startsWith(r + '/'))

  return (
    <>
      {!isAuthRoute && <Navbar />}
      <main className="min-h-screen">
        {children}
      </main>
      {!isAuthRoute && <Footer />}
    </>
  )
}
