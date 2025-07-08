# Development Testing Setup

## Prerequisites
1. Add these entries to your hosts file:
   ```
   127.0.0.1   acme.localhost
   127.0.0.1   techcorp.localhost
   127.0.0.1   fashionhub.localhost
   ```

2. Create test organizations in your database:
   ```sql
   INSERT INTO organizations (id, name, subdomain, plan, isActive) VALUES
   ('org-1', 'Acme Corp', 'acme', 'premium', true),
   ('org-2', 'TechCorp', 'techcorp', 'enterprise', true),
   ('org-3', 'FashionHub', 'fashionhub', 'free', false);
   ```

## Testing Different Stores

### Method 1: Local Subdomains (Recommended)
- Store 1: http://acme.localhost:3000
- Store 2: http://techcorp.localhost:3000
- Store 3: http://fashionhub.localhost:3000 (should show inactive page)

### Method 2: Query Parameters (Current)
- Store 1: http://localhost:3000/?org=acme
- Store 2: http://localhost:3000/?org=techcorp
- Store 3: http://localhost:3000/?org=fashionhub

### Method 3: Different Ports (For parallel testing)
```bash
# Terminal 1 - Store 1
PORT=3000 ORG_ID=org-1 npm run dev:web

# Terminal 2 - Store 2  
PORT=3001 ORG_ID=org-2 npm run dev:web

# Terminal 3 - Store 3
PORT=3002 ORG_ID=org-3 npm run dev:web
```

## Testing Subscription States

### Active Store (Premium Plan)
- URL: http://acme.localhost:3000
- Should show: Full store functionality

### Inactive Store  
- URL: http://fashionhub.localhost:3000
- Should show: "Store Unavailable" page

### Expired Store
1. Update organization plan to 'expired':
   ```sql
   UPDATE organizations SET plan = 'expired' WHERE subdomain = 'acme';
   ```
2. Visit: http://acme.localhost:3000
3. Should show: "Subscription Expired" page

### Suspended Store
1. Update organization plan to 'suspended':
   ```sql
   UPDATE organizations SET plan = 'suspended' WHERE subdomain = 'techcorp';
   ```
2. Visit: http://techcorp.localhost:3000
3. Should show: "Store Suspended" page

## Admin Dashboard Testing

### Super Admin Access
- URL: http://localhost:3001/dashboard/organizations
- Should show: All organizations with switcher

### Organization Admin Access
- URL: http://localhost:3001/dashboard
- Should show: Only their organization's data

### Testing Organization Switching
1. Login as super admin
2. Visit: http://localhost:3001/dashboard/organizations
3. Use organization switcher to switch between orgs
4. Verify data changes based on selected org

## Production Testing

### Custom Domains
1. Set up DNS records:
   ```
   acme.yourdomain.com → Your app IP
   techcorp.yourdomain.com → Your app IP
   ```

2. Update organization records:
   ```sql
   UPDATE organizations SET customDomain = 'acme.yourdomain.com' WHERE subdomain = 'acme';
   ```

### SSL Setup
Ensure your reverse proxy (Nginx/Cloudflare) handles SSL for all subdomains and custom domains.

## Troubleshooting

### Common Issues
1. **Subdomain not resolving**: Check hosts file or DNS
2. **Store shows wrong data**: Clear browser cache and cookies
3. **Authentication issues**: Ensure session cookies work across subdomains
4. **API calls failing**: Check CORS settings for subdomains

### Debug Commands
```bash
# Check current organization
curl http://localhost:3000/api/organization/validate-subdomain/acme

# Check middleware headers
curl -H "Host: acme.localhost" http://localhost:3000/api/debug/headers
```
