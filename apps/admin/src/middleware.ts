import { type NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

const secret = process.env.NEXTAUTH_SECRET || ''

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret })

  // Protect /dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard') && !token) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Extract organization from user token or query parameter
  const response = NextResponse.next()
  
  if (token?.email) {
    response.headers.set('x-user-email', token.email)
  }

  // Add organization context for admin
  if (token?.organizationId) {
    response.headers.set('x-organization-id', token.organizationId)
  }

  // For super admin, allow org switching via query parameter
  if (token?.role === 'super_admin') {
    const orgId = request.nextUrl.searchParams.get('orgId')
    if (orgId) {
      response.headers.set('x-organization-id', orgId)
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
