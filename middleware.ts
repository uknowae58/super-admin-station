import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const { pathname } = request.nextUrl

  // Check if the path is a protected route
  if (pathname.startsWith('/protected')) {
    // Check for access token in cookies or headers
    const accessToken = request.cookies.get('access_token')?.value
    
    // If no token, redirect to login
    if (!accessToken) {
      const loginUrl = new URL('/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  // If user is logged in and tries to access login page, redirect to dashboard
  if (pathname === '/login') {
    const accessToken = request.cookies.get('access_token')?.value
    if (accessToken) {
      const dashboardUrl = new URL('/protected/dashboard', request.url)
      return NextResponse.redirect(dashboardUrl)
    }
  }

  // Redirect root to dashboard if authenticated, otherwise to login
  if (pathname === '/') {
    const accessToken = request.cookies.get('access_token')?.value
    if (accessToken) {
      const dashboardUrl = new URL('/protected/dashboard', request.url)
      return NextResponse.redirect(dashboardUrl)
    } else {
      const loginUrl = new URL('/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/protected/:path*',
  ],
}