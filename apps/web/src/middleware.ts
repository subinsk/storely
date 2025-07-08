import { type NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { getTenantFromRequest } from './lib/tenant';

const secret = process.env.NEXTAUTH_SECRET || '';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret });
  const tenantInfo = getTenantFromRequest(request);

  // DEV: Always require org param for tenant pages
  if (request.nextUrl.hostname.includes('localhost')) {
    const orgParam = request.nextUrl.searchParams.get('org');
    if (!orgParam && request.nextUrl.pathname !== '/') {
      return new NextResponse(
        `<html><body style="font-family: system-ui; text-align: center; padding: 50px;">
          <h1>Missing org parameter</h1>
          <p>Please use <code>?org=yourorg</code> in the URL for tenant testing.</p>
        </body></html>`,
        { status: 400, headers: { 'Content-Type': 'text/html' } }
      );
    }
  }
  
  // If no valid tenant found, show error in dev
  if (!tenantInfo.isValid) {
    if (request.nextUrl.hostname.includes('localhost')) {
      return new NextResponse(
        `<html><body style="font-family: system-ui; text-align: center; padding: 50px;">
          <h1>Invalid Tenant</h1>
          <p>No valid tenant found for this URL.</p>
        </body></html>`,
        { status: 404, headers: { 'Content-Type': 'text/html' } }
      );
    }
    return NextResponse.redirect(new URL('https://storely.com', request.url));
  }

  // Validate organization exists and is active
  if (tenantInfo.subdomain || tenantInfo.customDomain) {
    try {
      const orgValidation = await validateOrganization(tenantInfo);
      console.log('Organization Validation:', orgValidation);
      if (!orgValidation.isValid) {
        if (request.nextUrl.hostname.includes('localhost')) {
          return new NextResponse(
            `<html><body style="font-family: system-ui; text-align: center; padding: 50px;">
              <h1>Organization Not Found</h1>
              <p>Organization "${tenantInfo.subdomain || tenantInfo.customDomain}" not found or inactive.</p>
            </body></html>`,
            { status: 404, headers: { 'Content-Type': 'text/html' } }
          );
        }
        return NextResponse.redirect(new URL('https://storely.com/not-found', request.url));
      }
      // Add debug header
      const response = NextResponse.next();
      response.headers.set('x-organization-id', orgValidation.organizationId);
      response.headers.set('x-tenant-subdomain', tenantInfo.subdomain || '');
      response.headers.set('x-debug-tenant', tenantInfo.subdomain || tenantInfo.customDomain || 'none');
      return response;
    } catch (error) {
      if (request.nextUrl.hostname.includes('localhost')) {
        return new NextResponse(
          `<html><body style="font-family: system-ui; text-align: center; padding: 50px;">
            <h1>Error Validating Organization</h1>
            <p>${error instanceof Error ? error.message : 'Unknown error'}</p>
          </body></html>`,
          { status: 500, headers: { 'Content-Type': 'text/html' } }
        );
      }
      return NextResponse.redirect(new URL('https://storely.com/error', request.url));
    }
  }

  // Protect /dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard') && !token) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  return NextResponse.next();
}

/**
 * Check if organization plan is active
 */
function isPlanActive(plan: string): boolean {
  // Add your subscription validation logic here
  // For now, allow all plans except expired ones
  return plan !== 'expired' && plan !== 'suspended';
}

/**
 * Validate organization exists and is active
 */
async function validateOrganization(tenantInfo: any): Promise<{ isValid: boolean; organizationId: string }> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  
  try {
    const endpoint = tenantInfo.subdomain 
      ? `${apiUrl}/organization/validate-subdomain/${tenantInfo.subdomain}`
      : `${apiUrl}/organization/validate-domain/${tenantInfo.customDomain}`;
    
    console.log('Validating organization at:', endpoint);
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      return { isValid: false, organizationId: '' };
    }
    
    const data = await response.json();
    return {
      isValid: data.success && data.organization?.isActive && isPlanActive(data.organization.plan),
      organizationId: data.organization?.id || ''
    };
  } catch (error) {
    console.error('Organization validation error:', error);
    return { isValid: false, organizationId: '' };
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api routes (handled separately)
     */
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
};
