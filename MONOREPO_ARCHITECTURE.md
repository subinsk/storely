# Storely Monorepo Architecture

## Overview
This is a modern monorepo architecture for the Storely e-commerce platform that combines the admin dashboard and web store applications with shared components, utilities, and database schema.

## Architecture Philosophy
- **Modular Design**: Clear separation of concerns with reusable components
- **Shared Dependencies**: Common utilities, types, and database schema
- **Independent Deployment**: Each app can be built and deployed independently
- **Type Safety**: Full TypeScript coverage across all packages
- **Performance Optimized**: Shared build configurations and optimizations

## Directory Structure

```
storely/
├── README.md
├── package.json                     # Root package.json for workspace management
├── turbo.json                       # Turborepo configuration
├── tsconfig.json                    # Base TypeScript configuration
├── .gitignore
├── .env.example
├── docs/                           # Documentation
│   ├── SETUP.md
│   ├── DEPLOYMENT.md
│   └── API.md
├── packages/                       # Shared packages
│   ├── shared/                     # Shared utilities, types, and components
│   │   ├── package.json
│   │   ├── src/
│   │   │   ├── components/         # Reusable UI components
│   │   │   ├── utils/              # Utility functions
│   │   │   ├── types/              # TypeScript type definitions
│   │   │   ├── constants/          # Application constants
│   │   │   ├── hooks/              # Custom React hooks
│   │   │   ├── schemas/            # Validation schemas
│   │   │   └── theme/              # Material-UI theme configuration
│   │   └── tsconfig.json
│   ├── database/                   # Database package
│   │   ├── package.json
│   │   ├── prisma/
│   │   │   ├── schema.prisma       # Unified Prisma schema
│   │   │   ├── migrations/         # Database migrations
│   │   │   └── seed.ts             # Database seeding
│   │   └── src/
│   │       ├── client.ts           # Prisma client configuration
│   │       └── types.ts            # Generated types
│   └── config/                     # Shared configuration
│       ├── package.json
│       ├── eslint.config.js        # ESLint configuration
│       ├── tailwind.config.js      # Tailwind CSS configuration
│       └── next.config.base.js     # Base Next.js configuration
├── apps/                           # Applications
│   ├── admin/                      # Admin dashboard
│   │   ├── package.json
│   │   ├── next.config.mjs
│   │   ├── tsconfig.json
│   │   ├── tailwind.config.js
│   │   ├── src/
│   │   │   ├── app/                # Next.js 13+ app directory
│   │   │   ├── components/         # Admin-specific components
│   │   │   ├── lib/                # Admin-specific utilities
│   │   │   ├── middleware.ts       # Admin middleware
│   │   │   └── types/              # Admin-specific types
│   │   └── public/                 # Admin static assets
│   └── web/                        # Customer-facing web store
│       ├── package.json
│       ├── next.config.mjs
│       ├── tsconfig.json
│       ├── tailwind.config.js
│       ├── src/
│       │   ├── app/                # Next.js 13+ app directory
│       │   ├── components/         # Web-specific components
│       │   ├── lib/                # Web-specific utilities
│       │   ├── middleware.ts       # Web middleware
│       │   └── types/              # Web-specific types
│       └── public/                 # Web static assets
└── tools/                          # Development tools and scripts
    ├── scripts/                    # Build and deployment scripts
    └── docker/                     # Docker configurations
```

## Package Management
- **Workspace Manager**: npm workspaces for dependency management
- **Build System**: Turborepo for fast, cached builds
- **Package Versions**: Centralized dependency management

## Shared Packages

### @storely/shared
Contains reusable components, utilities, and types used across applications:
- UI Components (forms, buttons, modals, etc.)
- Custom React hooks
- Utility functions
- TypeScript types and interfaces
- Validation schemas (Zod)
- Material-UI theme configuration

### @storely/database
Centralized database package:
- Unified Prisma schema
- Database client configuration
- Migration management
- Seeding scripts
- Generated types

### @storely/config
Shared configuration files:
- ESLint rules
- Tailwind CSS configuration
- Next.js base configuration
- TypeScript configuration

## Technology Stack

### Core Technologies
- **Next.js 14+**: React framework with App Router
- **TypeScript**: Type safety and better developer experience
- **Prisma**: Database ORM and migration tool
- **NextAuth.js**: Authentication solution
- **Material-UI**: UI component library
- **Tailwind CSS**: Utility-first CSS framework

### Build Tools
- **Turborepo**: Monorepo build system
- **npm workspaces**: Package management
- **ESLint**: Code linting
- **Prettier**: Code formatting

### Database
- **PostgreSQL**: Primary database
- **Prisma**: ORM and query builder
- **Database URL**: Shared across applications

## Development Workflow

### Setup Commands
```bash
# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate:dev

# Start development servers
npm run dev              # Start both apps
npm run dev:admin        # Start admin only
npm run dev:web          # Start web only

# Build applications
npm run build            # Build all apps
npm run build:admin      # Build admin only
npm run build:web        # Build web only
```

### Scripts Organization
All scripts are managed at the root level with proper workspace targeting:
- Development: `dev`, `dev:admin`, `dev:web`
- Building: `build`, `build:admin`, `build:web`
- Database: `db:generate`, `db:migrate:dev`, `db:reset`
- Linting: `lint`, `lint:fix`
- Testing: `test`, `test:admin`, `test:web`

## Benefits

### Developer Experience
- **Fast Builds**: Turborepo caching and parallel execution
- **Type Safety**: Shared types across applications
- **Code Reuse**: Shared components and utilities
- **Consistent Tooling**: Unified ESLint, Prettier, and TypeScript configs

### Maintainability
- **Single Source of Truth**: Centralized database schema and types
- **Consistent UI**: Shared design system and components
- **Easy Updates**: Update shared dependencies once
- **Clear Boundaries**: Well-defined package boundaries

### Performance
- **Bundle Optimization**: Tree-shaking of unused shared code
- **Incremental Builds**: Only rebuild changed packages
- **Shared Dependencies**: Reduced bundle duplication
- **Optimized Images**: Shared image optimization utilities

## Migration Strategy

### Phase 1: Setup Infrastructure
1. Create monorepo structure
2. Setup package.json with workspaces
3. Configure Turborepo
4. Setup shared TypeScript configuration

### Phase 2: Extract Shared Code
1. Identify common components and utilities
2. Create shared packages
3. Migrate database schema to shared package
4. Update import paths

### Phase 3: Migrate Applications
1. Move admin app to apps/admin
2. Move web app to apps/web
3. Update configurations
4. Test and validate functionality

### Phase 4: Optimization
1. Optimize build processes
2. Setup CI/CD pipelines
3. Performance monitoring
4. Documentation updates

## Best Practices

### Code Organization
- Use absolute imports with path mapping
- Follow consistent naming conventions
- Implement proper error boundaries
- Use TypeScript strict mode

### Component Development
- Create reusable components in shared package
- Use compound component patterns
- Implement proper prop interfaces
- Follow accessibility guidelines

### State Management
- Use Zustand for client state
- Implement server state with React Query
- Follow single responsibility principle
- Use proper TypeScript types

### Performance
- Implement code splitting
- Use dynamic imports for heavy components
- Optimize images and assets
- Implement proper caching strategies

This architecture provides a solid foundation for scaling the Storely platform while maintaining code quality and developer productivity.
