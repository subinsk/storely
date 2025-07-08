import { NextRequest } from 'next/server';

export interface TenantInfo {
  organizationId: string;
  subdomain: string;
  customDomain?: string;
  isValid: boolean;
}

/**
 * Extract tenant information from request
 * Supports both subdomain and query parameter for development
 */
export function getTenantFromRequest(request: NextRequest): TenantInfo {
  const host = request.headers.get('host') || '';
  const url = new URL(request.url);
  
  // Development mode - check for org query parameter first
  const orgParam = url.searchParams.get('org');
  if (orgParam && (host.includes('localhost') || host.includes('127.0.0.1'))) {
    return {
      organizationId: '', // Will be resolved later
      subdomain: orgParam,
      isValid: true
    };
  }
  
  // Production mode - extract from subdomain
  const subdomain = extractSubdomain(host);
  if (subdomain) {
    return {
      organizationId: '', // Will be resolved later
      subdomain,
      isValid: true
    };
  }
  
  // Check for custom domain
  if (!host.includes('localhost') && !host.includes('127.0.0.1')) {
    return {
      organizationId: '', // Will be resolved later
      subdomain: '',
      customDomain: host,
      isValid: true
    };
  }
  
  return {
    organizationId: '',
    subdomain: '',
    isValid: false
  };
}

/**
 * Extract subdomain from host
 * Examples:
 * - acme.storely.com → acme
 * - acme.localhost:3000 → acme
 * - www.storely.com → null (main domain)
 */
function extractSubdomain(host: string): string | null {
  const parts = host.split('.');
  
  // For localhost development with subdomains
  if (host.includes('localhost')) {
    if (parts.length >= 2 && parts[0] !== 'www') {
      return parts[0];
    }
    return null;
  }
  
  // For production domains
  if (parts.length >= 3) {
    const subdomain = parts[0];
    // Ignore www and common subdomains
    if (subdomain === 'www' || subdomain === 'api' || subdomain === 'admin') {
      return null;
    }
    return subdomain;
  }
  
  return null;
}

/**
 * Generate tenant-aware URL
 */
export function generateTenantUrl(subdomain: string, path: string = '/', isDev: boolean = false): string {
  if (isDev) {
    return `http://${subdomain}.localhost:3000${path}`;
  }
  
  return `https://${subdomain}.${process.env.NEXT_PUBLIC_DOMAIN || 'storely.com'}${path}`;
}

/**
 * Check if current environment supports subdomain development
 */
export function supportsSubdomainDev(): boolean {
  return process.env.NODE_ENV === 'development' && 
         process.env.NEXT_PUBLIC_ENABLE_SUBDOMAIN_DEV === 'true';
}
