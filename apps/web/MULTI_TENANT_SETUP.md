# Development Environment Configuration

## Multi-tenant Webstore Setup

### Local Development Configuration

#### 1. Environment Variables
Add these to your `.env.local` file:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/storely_dev"

# Next.js
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# API
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# Multi-tenant Configuration
NEXT_PUBLIC_DOMAIN="localhost"
NEXT_PUBLIC_ENABLE_SUBDOMAIN_DEV="true"

# Cloudinary (optional)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
NEXT_PUBLIC_CLOUDINARY_API_KEY="your-api-key"
NEXT_PUBLIC_CLOUDINARY_API_SECRET="your-api-secret"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="your-upload-preset"
```

#### 2. Local Subdomain Testing

For development, you have two options:

**Option A: Using Query Parameter (Easier)**
- Access: `http://localhost:3000?org=acme`
- This will simulate the `acme` organization

**Option B: Using Local Subdomains (More realistic)**
- Edit your `hosts` file to add local subdomains:
  ```
  127.0.0.1 acme.localhost
  127.0.0.1 demo.localhost
  127.0.0.1 test.localhost
  ```
- Access: `http://acme.localhost:3000`

#### 3. Database Setup

1. Create organizations in your database:
```sql
INSERT INTO organizations (id, name, subdomain, plan, "isActive") VALUES
('org1', 'Acme Store', 'acme', 'premium', true),
('org2', 'Demo Store', 'demo', 'free', true),
('org3', 'Test Store', 'test', 'enterprise', true);
```

2. Create sample categories and products for each organization:
```sql
-- Categories for Acme Store
INSERT INTO categories (id, name, slug, "organizationId", "isActive") VALUES
('cat1', 'Furniture', 'furniture', 'org1', true),
('cat2', 'Electronics', 'electronics', 'org1', true);

-- Products for Acme Store
INSERT INTO products (id, name, slug, price, description, "categoryId", "organizationId", status) VALUES
('prod1', 'Modern Sofa', 'modern-sofa', 899.99, 'A comfortable modern sofa', 'cat1', 'org1', 'active'),
('prod2', 'Smart TV', 'smart-tv', 1299.99, 'A 55-inch smart TV', 'cat2', 'org1', 'active');
```

#### 4. Development Workflow

1. **Start the development server:**
   ```bash
   npm run dev:web
   ```

2. **Test multi-tenancy:**
   - Visit `http://localhost:3000?org=acme` to see Acme Store
   - Visit `http://localhost:3000?org=demo` to see Demo Store
   - Or use subdomains: `http://acme.localhost:3000`

3. **API Testing:**
   - Products API: `http://localhost:3000/api/products`
   - Categories API: `http://localhost:3000/api/categories`
   - Organization validation: `http://localhost:3000/api/organization/validate-subdomain/acme`

### Production Configuration

#### 1. DNS Setup
- Configure your domain to point to your server
- Set up wildcard subdomain: `*.yourdomain.com`

#### 2. Environment Variables
```bash
NEXT_PUBLIC_DOMAIN="yourdomain.com"
NEXT_PUBLIC_ENABLE_SUBDOMAIN_DEV="false"
```

#### 3. SSL Configuration
- Set up SSL certificates for your domain and wildcard subdomains
- Configure your reverse proxy (nginx/Apache) to handle subdomains

### Features Implemented

1. **Multi-tenant Architecture:**
   - Each organization has its own subdomain
   - Isolated data per organization
   - Custom domain support

2. **Tenant Detection:**
   - Middleware extracts organization from subdomain
   - Validates organization exists and is active
   - Passes organization context to all requests

3. **API Isolation:**
   - All API endpoints are organization-aware
   - Products and categories filtered by organization
   - Secure data isolation

4. **Frontend Integration:**
   - Organization context provider
   - Tenant-aware service calls
   - Organization-specific branding

### Next Steps

1. **Theme Customization:**
   - Add organization-specific themes
   - Custom logos and colors
   - Brand customization

2. **Advanced Features:**
   - Custom domains
   - Organization settings
   - Multi-store support

3. **Performance Optimization:**
   - Caching strategies
   - Database optimization
   - CDN integration

This setup provides a solid foundation for a multi-tenant e-commerce platform with proper isolation and scalability.
