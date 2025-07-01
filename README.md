# Storely - Modern E-commerce Monorepo

A comprehensive, modern e-commerce platform built with Next.js, TypeScript, Prisma, and Material-UI in a monorepo architecture.

## 🏗️ Architecture

This monorepo contains:

- **Admin Dashboard** (`apps/admin`) - Comprehensive e-commerce management platform
- **Web Store** (`apps/web`) - Customer-facing e-commerce storefront
- **Shared Package** (`packages/shared`) - Reusable components, utilities, and types
- **Database Package** (`packages/database`) - Centralized Prisma schema and client
- **Config Package** (`packages/config`) - Shared configuration files

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm 10+
- PostgreSQL database

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd storely
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your database URL and other configurations
   ```

3. **Set up the database:**
   ```bash
   npm run db:generate
   npm run db:migrate:dev
   npm run db:seed
   ```

4. **Start development servers:**
   ```bash
   # Start both applications
   npm run dev

   # Or start individually
   npm run dev:admin  # Admin dashboard on http://localhost:3001
   npm run dev:web    # Web store on http://localhost:3000
   ```

## 📦 Available Scripts

### Root Level Commands

```bash
# Development
npm run dev              # Start both apps
npm run dev:admin        # Start admin dashboard only
npm run dev:web          # Start web store only

# Building
npm run build            # Build all apps
npm run build:admin      # Build admin only
npm run build:web        # Build web only

# Database
npm run db:generate      # Generate Prisma client
npm run db:migrate:dev   # Run database migrations
npm run db:migrate:reset # Reset database
npm run db:seed          # Seed database with demo data
npm run db:studio        # Open Prisma Studio

# Code Quality
npm run lint             # Lint all packages
npm run lint:fix         # Fix linting issues
npm run type-check       # Run TypeScript checks
npm run format           # Format code with Prettier

# Testing
npm run test             # Run all tests
npm run test:admin       # Run admin tests
npm run test:web         # Run web tests
```

## 🏛️ Project Structure

```
storely/
├── apps/
│   ├── admin/                    # Admin Dashboard (Port 3001)
│   │   ├── src/
│   │   │   ├── app/             # Next.js 13+ app directory
│   │   │   ├── components/      # Admin-specific components
│   │   │   └── lib/             # Admin utilities
│   │   ├── package.json
│   │   └── next.config.mjs
│   └── web/                     # Web Store (Port 3000)
│       ├── src/
│       │   ├── app/             # Next.js 13+ app directory
│       │   ├── components/      # Web-specific components
│       │   └── lib/             # Web utilities
│       ├── package.json
│       └── next.config.mjs
├── packages/
│   ├── shared/                  # Shared UI components & utilities
│   │   ├── src/
│   │   │   ├── components/      # Reusable UI components
│   │   │   ├── hooks/           # Custom React hooks
│   │   │   ├── utils/           # Utility functions
│   │   │   ├── types/           # TypeScript types
│   │   │   ├── schemas/         # Validation schemas
│   │   │   └── theme/           # Material-UI theme
│   │   └── package.json
│   ├── database/                # Database package
│   │   ├── prisma/
│   │   │   ├── schema.prisma    # Unified database schema
│   │   │   ├── migrations/      # Database migrations
│   │   │   └── seed.ts          # Database seeding
│   │   ├── src/
│   │   │   └── client.ts        # Prisma client configuration
│   │   └── package.json
│   └── config/                  # Shared configurations
│       ├── eslint.config.js     # ESLint configuration
│       ├── tailwind.config.js   # Tailwind CSS config
│       ├── next.config.base.js  # Base Next.js config
│       └── package.json
├── package.json                 # Root package.json
├── turbo.json                   # Turborepo configuration
└── tsconfig.json                # Base TypeScript config
```

## 🛠️ Technology Stack

### Core Technologies
- **Next.js 14+** - React framework with App Router
- **TypeScript** - Type safety and better DX
- **Prisma** - Database ORM and migrations
- **NextAuth.js** - Authentication solution
- **Material-UI** - Component library
- **Tailwind CSS** - Utility-first CSS framework

### Build Tools
- **Turborepo** - Monorepo build system
- **npm workspaces** - Package management
- **ESLint** - Code linting
- **Prettier** - Code formatting

### Database
- **PostgreSQL** - Primary database
- **Prisma Client** - Type-safe database client

## 🎨 Features

### Admin Dashboard
- 📊 **Analytics Dashboard** - Sales, orders, and customer insights
- 📦 **Product Management** - Full CRUD with variants and inventory
- 🛒 **Order Management** - Order processing and fulfillment
- 👥 **Customer Management** - Customer profiles and support
- 🎨 **Store Customization** - Theme and layout settings
- 📈 **Reports & Analytics** - Business intelligence tools
- 👤 **User Management** - Multi-user with role-based access
- ⚙️ **Settings** - Store configuration and integrations

### Web Store
- 🛍️ **Product Catalog** - Beautiful product browsing
- 🔍 **Search & Filters** - Advanced product discovery
- 🛒 **Shopping Cart** - Persistent cart with variants
- 💳 **Checkout** - Secure payment processing
- 👤 **User Accounts** - Registration and profile management
- 📱 **Responsive Design** - Mobile-first approach
- ⚡ **Performance** - Optimized for speed and SEO
- 🎨 **Customizable** - Theme and branding options

## 🔧 Development

### Adding New Features

1. **Shared Components**: Add to `packages/shared/src/components/`
2. **Utilities**: Add to `packages/shared/src/utils/`
3. **Database Changes**: Modify `packages/database/prisma/schema.prisma`
4. **Admin Features**: Add to `apps/admin/src/`
5. **Store Features**: Add to `apps/web/src/`

### Code Quality

This project enforces high code quality through:

- **TypeScript** for type safety
- **ESLint** for code consistency
- **Prettier** for code formatting
- **Husky** for pre-commit hooks
- **Conventional Commits** for clear history

### Testing

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 🚀 Deployment

### Environment Variables

Required environment variables:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/storely"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Optional: Cloud services
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

STRIPE_SECRET_KEY=""
STRIPE_PUBLISHABLE_KEY=""
```

### Build for Production

```bash
# Build all applications
npm run build

# Start production servers
npm run start
```

### Docker Support

```bash
# Build and run with Docker
docker-compose up --build

# Or build individual services
docker build -f apps/admin/Dockerfile -t storely-admin .
docker build -f apps/web/Dockerfile -t storely-web .
```

## 📚 Documentation

- [Monorepo Architecture](./MONOREPO_ARCHITECTURE.md)
- [API Documentation](./docs/API.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Contributing Guide](./docs/CONTRIBUTING.md)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Email: support@storely.com
- 💬 Discord: [Join our community](https://discord.gg/storely)
- 📖 Documentation: [docs.storely.com](https://docs.storely.com)
- 🐛 Issues: [GitHub Issues](https://github.com/storely/storely/issues)

---

Built with ❤️ by the Storely team
