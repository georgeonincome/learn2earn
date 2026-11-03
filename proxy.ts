import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  // Protect dashboard routes with the student session cookie (set by lib/server/auth)
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const token = request.cookies.get('l2e_session')?.value
    if (!token) {
      return NextResponse.redirect(new URL('/auth', request.url))
    }
  }

  // Protect admin routes with the admin_session cookie (role-checked at API/page level)
  if (
    request.nextUrl.pathname === '/admin' ||
    (request.nextUrl.pathname.startsWith('/admin/') &&
      !request.nextUrl.pathname.startsWith('/api/'))
  ) {
    const session = request.cookies.get('admin_session')?.value
    let authed = false
    if (session) {
      try {
        const s = JSON.parse(session)
        authed = Boolean(s && typeof s === 'object' && 'userId' in s)
      } catch { authed = false }
    }
    if (!authed && !request.nextUrl.pathname.startsWith('/admin/login')) {
      const url = new URL('/admin/login', request.url)
      url.searchParams.set('callbackUrl', request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
}
