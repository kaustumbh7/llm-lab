# LLM Lab - Tech Stack Documentation

## Overview

This document provides a comprehensive overview of the technology stack used in the LLM Lab project, including versions, configurations, and rationale for technology choices.

## Frontend Technology Stack

### Core Framework

- **Next.js 16.0.0**
  - **Purpose**: Full-stack React framework with App Router
  - **Features**: Server-side rendering, static generation, API routes
  - **Benefits**: Performance optimization, SEO-friendly, developer experience
  - **Configuration**: `next.config.ts` with custom settings

### React Ecosystem

- **React 19.2.0**
  - **Purpose**: UI library for building user interfaces
  - **Features**: Concurrent features, automatic batching, suspense
  - **Benefits**: Modern React features, improved performance
- **React DOM 19.2.0**
  - **Purpose**: DOM rendering for React applications
  - **Integration**: Seamless integration with Next.js

### Styling and UI

- **Tailwind CSS 4**

  - **Purpose**: Utility-first CSS framework
  - **Features**: Responsive design, dark mode, custom components
  - **Configuration**: `tailwind.config.js` with custom theme
  - **Benefits**: Rapid development, consistent design system

- **Radix UI Components**

  - **@radix-ui/react-label**: Accessible form labels
  - **@radix-ui/react-slot**: Polymorphic component primitives
  - **@radix-ui/react-tabs**: Accessible tab components
  - **Purpose**: Headless UI components for accessibility
  - **Benefits**: WCAG compliant, customizable, lightweight

- **Custom UI Components**
  - **Button**: Variant-based button component
  - **Card**: Content container with header/body structure
  - **Form**: Form components with validation
  - **Input**: Styled input components
  - **Table**: Data display components
  - **Tabs**: Tabbed interface components
  - **Textarea**: Multi-line text input

### Data Visualization

- **Recharts 3.3.0**
  - **Purpose**: Chart library for data visualization
  - **Features**: Line charts, bar charts, scatter plots, responsive design
  - **Components Used**: BarChart, LineChart, ScatterChart, ResponsiveContainer
  - **Benefits**: React-native, customizable, responsive

### Form Management

- **React Hook Form 7.65.0**

  - **Purpose**: Form state management and validation
  - **Features**: Uncontrolled components, minimal re-renders
  - **Benefits**: Performance, developer experience, validation

- **@hookform/resolvers 5.2.2**

  - **Purpose**: Validation resolvers for React Hook Form
  - **Integration**: Zod schema validation
  - **Benefits**: Type-safe validation, schema-first approach

- **Zod 4.1.12**
  - **Purpose**: TypeScript-first schema validation
  - **Features**: Runtime type checking, inference
  - **Benefits**: Type safety, validation, error handling

### Icons and Assets

- **Lucide React 0.548.0**
  - **Purpose**: Icon library for UI elements
  - **Features**: SVG icons, customizable, tree-shakeable
  - **Benefits**: Consistent iconography, performance

### Utility Libraries

- **clsx 2.1.1**
  - **Purpose**: Conditional className utility
  - **Benefits**: Clean conditional styling
- **class-variance-authority 0.7.1**
  - **Purpose**: Component variant management
  - **Benefits**: Type-safe component variants
- **tailwind-merge 3.3.1**
  - **Purpose**: Tailwind CSS class merging
  - **Benefits**: Conflict resolution, optimization

### Development Tools

- **TypeScript 5**

  - **Purpose**: Static type checking
  - **Configuration**: Strict mode, path mapping
  - **Benefits**: Type safety, developer experience, refactoring

- **ESLint 9**

  - **Purpose**: Code linting and formatting
  - **Configuration**: Next.js config, Prettier integration
  - **Plugins**: Import sorting, Prettier integration
  - **Benefits**: Code quality, consistency

- **Prettier 3.6.2**
  - **Purpose**: Code formatting
  - **Configuration**: Tailwind CSS plugin
  - **Benefits**: Consistent formatting, readability

## Backend Technology Stack

### Core Framework

- **NestJS 11.0.1**
  - **Purpose**: Progressive Node.js framework
  - **Features**: Modular architecture, dependency injection, decorators
  - **Benefits**: Scalability, maintainability, TypeScript support
  - **Architecture**: Controller-Service-Repository pattern

### Runtime and Language

- **Node.js 20+**

  - **Purpose**: JavaScript runtime
  - **Features**: ES modules, performance improvements
  - **Benefits**: Modern JavaScript features, performance

- **TypeScript 5.7.3**
  - **Purpose**: Static type checking for backend
  - **Configuration**: Strict mode, decorators, path mapping
  - **Benefits**: Type safety, developer experience, refactoring

### Database and ORM

- **Prisma 6.18.0**

  - **Purpose**: Database ORM and query builder
  - **Features**: Type-safe queries, migrations, introspection
  - **Benefits**: Developer experience, type safety, performance
  - **Configuration**: `prisma/schema.prisma`

- **@prisma/client 6.18.0**
  - **Purpose**: Generated Prisma client
  - **Features**: Type-safe database operations
  - **Benefits**: Compile-time type checking, autocomplete

### Database

- **PostgreSQL** (Production)

  - **Purpose**: Primary database for production
  - **Features**: ACID compliance, JSON support, full-text search
  - **Benefits**: Reliability, performance, scalability

- **SQLite** (Development)
  - **Purpose**: Local development database
  - **Features**: File-based, zero configuration
  - **Benefits**: Simplicity, portability, development speed

### External API Integration

- **@google/generative-ai 0.24.1**
  - **Purpose**: Google Gemini AI API client
  - **Features**: Text generation, parameter configuration
  - **Benefits**: Official SDK, type safety, error handling

### Validation and Transformation

- **class-validator 0.14.2**

  - **Purpose**: Decorator-based validation
  - **Features**: DTO validation, custom validators
  - **Benefits**: Type-safe validation, error handling

- **class-transformer 0.5.1**
  - **Purpose**: Object transformation
  - **Features**: Serialization, deserialization, mapping
  - **Benefits**: Data transformation, API consistency

### Configuration Management

- **@nestjs/config 4.0.2**

  - **Purpose**: Configuration management
  - **Features**: Environment variables, validation
  - **Benefits**: Centralized config, type safety

- **dotenv 17.2.3**
  - **Purpose**: Environment variable loading
  - **Benefits**: Development environment setup

### Development Tools

- **@nestjs/cli 11.0.0**

  - **Purpose**: NestJS command-line interface
  - **Features**: Project generation, build tools
  - **Benefits**: Developer productivity, project management

- **Jest 30.0.0**

  - **Purpose**: Testing framework
  - **Features**: Unit testing, mocking, coverage
  - **Configuration**: TypeScript support, custom matchers
  - **Benefits**: Comprehensive testing, CI/CD integration

- **ESLint 9.18.0**

  - **Purpose**: Code linting
  - **Configuration**: NestJS-specific rules, Prettier integration
  - **Benefits**: Code quality, consistency

- **Prettier 3.4.2**
  - **Purpose**: Code formatting
  - **Benefits**: Consistent formatting, readability

## Package Management

### Package Manager

- **pnpm**
  - **Purpose**: Fast, disk space efficient package manager
  - **Features**: Monorepo support, strict dependency resolution
  - **Benefits**: Performance, disk efficiency, reliability
  - **Configuration**: `pnpm-lock.yaml` for lockfile

### Workspace Structure

```
llm-lab/
├── api/                 # Backend package
│   ├── package.json     # Backend dependencies
│   └── pnpm-lock.yaml   # Backend lockfile
├── web/                 # Frontend package
│   ├── package.json     # Frontend dependencies
│   └── pnpm-lock.yaml   # Frontend lockfile
└── pnpm-workspace.yaml  # Workspace configuration
```

## Development Environment

### Build Tools

- **TypeScript Compiler**

  - **Purpose**: TypeScript to JavaScript compilation
  - **Configuration**: `tsconfig.json` with strict settings
  - **Benefits**: Type checking, modern JavaScript features

- **Next.js Build System**

  - **Purpose**: Frontend build and optimization
  - **Features**: Code splitting, image optimization, static generation
  - **Benefits**: Performance, SEO, developer experience

- **NestJS Build System**
  - **Purpose**: Backend build and compilation
  - **Features**: TypeScript compilation, dependency injection
  - **Benefits**: Type safety, modular architecture

### Development Servers

- **Next.js Dev Server**

  - **Port**: 3000
  - **Features**: Hot reloading, fast refresh, error overlay
  - **Benefits**: Rapid development, debugging

- **NestJS Dev Server**
  - **Port**: 5000
  - **Features**: Hot reloading, TypeScript compilation
  - **Benefits**: Rapid development, debugging

### Database Tools

- **Prisma Studio**

  - **Purpose**: Database GUI for development
  - **Features**: Data browsing, editing, querying
  - **Benefits**: Development productivity, data inspection

- **Prisma CLI**
  - **Purpose**: Database management commands
  - **Features**: Migrations, schema generation, seeding
  - **Benefits**: Database versioning, deployment

## Deployment and Infrastructure

### Containerization

- **Docker**

  - **Purpose**: Application containerization
  - **Configuration**: Multi-stage builds, Alpine Linux base
  - **Benefits**: Consistency, portability, scalability

- **Dockerfile Structure**
  ```dockerfile
  FROM node:20-alpine
  RUN corepack enable && corepack prepare pnpm@latest --activate
  WORKDIR /app
  COPY package.json pnpm-lock.yaml ./
  RUN pnpm install --frozen-lockfile
  COPY . .
  RUN pnpm db:generate
  RUN pnpm build
  EXPOSE 5000
  CMD ["pnpm", "start:prod"]
  ```

### Deployment Platforms

- **Vercel** (Frontend)

  - **Purpose**: Next.js optimized hosting with global CDN
  - **Features**: Automatic deployments, preview deployments, edge caching
  - **Benefits**: Optimal Next.js performance, global reach

- **Railway** (Backend)
  - **Purpose**: Backend and database hosting
  - **Features**: Automatic deployments, PostgreSQL integration
  - **Benefits**: Simplicity, scalability, cost-effective

For detailed deployment configuration, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md).

## Security Stack

### API Security

- **CORS**: Cross-origin resource sharing configuration
- **Input Validation**: Class-validator for request validation
- **Rate Limiting**: Custom rate limiter for API protection
- **Error Handling**: Sanitized error messages

### Data Security

- **Environment Variables**: Secure configuration management
- **Database Security**: Connection string encryption
- **API Key Management**: Secure storage of external API keys

### Frontend Security

- **TypeScript**: Compile-time type safety
- **Input Sanitization**: Form validation with Zod
- **XSS Protection**: React's built-in XSS protection
- **CSRF Protection**: Next.js CSRF protection

## Performance Optimization

### Frontend Performance

- **Next.js Optimizations**

  - Server-side rendering (SSR)
  - Static site generation (SSG)
  - Image optimization
  - Code splitting
  - Bundle optimization

- **React Optimizations**
  - Automatic batching
  - Concurrent features
  - Suspense for data fetching
  - Memoization where appropriate

### Backend Performance

- **NestJS Optimizations**

  - Dependency injection
  - Modular architecture
  - Async/await patterns
  - Connection pooling

- **Database Optimizations**
  - Prisma query optimization
  - Strategic indexing
  - Connection pooling
  - Query caching

### Build Optimizations

- **TypeScript**: Strict compilation for performance
- **Tree Shaking**: Unused code elimination
- **Minification**: Code and asset minification
- **Compression**: Gzip compression for assets

## Monitoring and Logging

### Application Logging

- **NestJS Logger**: Built-in logging system
- **Log Levels**: Debug, Info, Warn, Error
- **Structured Logging**: JSON-formatted logs
- **Context**: Request IDs and user context

### Error Tracking

- **Error Boundaries**: React error boundaries
- **Exception Handling**: Comprehensive error handling
- **Logging**: Structured error logging
- **Monitoring**: Error rate tracking

### Performance Monitoring

- **Response Times**: API endpoint monitoring
- **Database Performance**: Query performance tracking
- **Memory Usage**: Application memory monitoring
- **Error Rates**: Error frequency tracking

## Version Compatibility

### Node.js Compatibility

- **Minimum Version**: Node.js 20+
- **Recommended**: Node.js 20 LTS
- **Features**: ES modules, modern JavaScript features

### Browser Compatibility

- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **ES2020+**: Modern JavaScript features
- **CSS Grid**: Modern CSS layout features
- **Web APIs**: Modern web API support

### Database Compatibility

- **PostgreSQL**: 13+ (production)
- **SQLite**: 3.35+ (development)
- **Prisma**: Database-agnostic ORM

## Migration and Upgrade Paths

### Framework Upgrades

- **Next.js**: Regular updates for security and features
- **NestJS**: LTS version support
- **React**: Concurrent with Next.js updates
- **TypeScript**: Regular updates for language features

### Dependency Management

- **Security Updates**: Regular security patch updates
- **Feature Updates**: Planned feature updates
- **Breaking Changes**: Careful migration planning
- **Testing**: Comprehensive testing before updates

This tech stack documentation provides a comprehensive overview of all technologies used in the LLM Lab project, their purposes, configurations, and benefits. It serves as a reference for developers, DevOps engineers, and stakeholders to understand the technical foundation of the system.
