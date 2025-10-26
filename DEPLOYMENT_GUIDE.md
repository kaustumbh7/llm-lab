# LLM Lab - Deployment and Environment Configuration

## Overview

This document provides comprehensive guidance on deploying LLM Lab in different environments, from local development to production. It covers deployment choices, environment configuration, and best practices for different hosting platforms.

## Deployment Architecture

### Production Deployment Stack

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   (Vercel)      │◄──►│   (Railway)     │◄──►│   (PostgreSQL)  │
│                 │    │                 │    │                 │
│ • Next.js 16    │    │ • NestJS 11     │    │ • Railway DB    │
│ • Static Build  │    │ • Docker        │    │ • Prisma ORM    │
│ • Global CDN    │    │ • Auto Deploy   │    │ • Migrations    │
│ • Serverless    │    │ • Health Checks │    │ • Backups       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   External APIs │
                       │                 │
                       │ • Google Gemini │
                       │ • AI Studio     │
                       └─────────────────┘
```

## Hosting Platform Choices

### Frontend: Vercel

#### Why Vercel for Frontend?

- **Next.js Optimization**: Built specifically for Next.js applications
- **Global CDN**: Edge network for fast content delivery worldwide
- **Serverless Functions**: Built-in API routes and serverless functions
- **Automatic Deployments**: Seamless GitHub integration with preview deployments
- **Performance**: Optimized builds and automatic image optimization
- **Developer Experience**: Excellent debugging tools and analytics

### Backend: Railway

#### Why Railway for Backend?

- **Simplicity**: One-click deployment from GitHub
- **Full-Stack Support**: Handles backend services and databases
- **Database Integration**: Built-in PostgreSQL service
- **Environment Variables**: Secure configuration management
- **Auto-Deploy**: Automatic deployments on git push
- **Cost-Effective**: Competitive pricing for small to medium applications

#### Railway Configuration

```json
// railway.json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "pnpm start:prod",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### Alternative Platforms

For large-scale or enterprise deployments, consider:

- **Heroku**: Mature platform with extensive add-ons
- **AWS/GCP/Azure**: Maximum control and enterprise features
- **Netlify**: Alternative to Vercel for frontend hosting

## Environment Configuration

### Environment Variables

#### Backend Environment Variables

##### Required Variables

```bash
# Database Configuration
DATABASE_URL="postgresql://username:password@host:port/database"

# Google AI API
GOOGLE_AI_API_KEY="your_google_ai_api_key_here"

# Server Configuration
PORT=5000
NODE_ENV=production
```

##### Optional Variables

```bash
# CORS Configuration
FRONTEND_URL="https://your-frontend-domain.com"

# LLM Configuration
DEFAULT_MODEL="gemini-2.5-flash-lite"
TEMPERATURE_COMBINATIONS=2
TOP_P_COMBINATIONS=2
TOP_K_COMBINATIONS=2
MAX_TOKENS_COMBINATIONS=2

# Rate Limiting
MAX_CONCURRENT_REQUESTS=3
REQUEST_DELAY_MS=2000

# Logging
LOG_LEVEL="info"
```

#### Frontend Environment Variables

##### Required Variables

```bash
# API Configuration
NEXT_PUBLIC_API_URL="https://your-backend-domain.com"
```

##### Optional Variables

```bash
# Analytics (if implemented)
NEXT_PUBLIC_GA_ID="your_google_analytics_id"

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_EXPORT=true
```

### Environment-Specific Configurations

#### Development Environment

```bash
# Backend (.env)
DATABASE_URL="file:./dev.db"
GOOGLE_AI_API_KEY="your_dev_api_key"
PORT=5000
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"
LOG_LEVEL="debug"

# Frontend (.env.local)
NEXT_PUBLIC_API_URL="http://localhost:5000"
```

#### Staging Environment

```bash
# Backend
DATABASE_URL="postgresql://staging_user:password@staging_host:5432/staging_db"
GOOGLE_AI_API_KEY="your_staging_api_key"
PORT=5000
NODE_ENV=staging
FRONTEND_URL="https://staging.llm-lab.com"
LOG_LEVEL="info"

# Frontend
NEXT_PUBLIC_API_URL="https://staging-api.llm-lab.com"
```

#### Production Environment

```bash
# Backend (Railway)
DATABASE_URL="postgresql://prod_user:password@prod_host:5432/prod_db"
GOOGLE_AI_API_KEY="your_production_api_key"
PORT=5000
NODE_ENV=production
FRONTEND_URL="https://llm-lab.vercel.app"
LOG_LEVEL="warn"

# Frontend (Vercel)
NEXT_PUBLIC_API_URL="https://api.llm-lab.railway.app"
```

## Deployment Strategies

### Vercel Deployment (Frontend)

#### Vercel Configuration

##### Vercel Configuration

```json
// vercel.json
{
  "buildCommand": "cd web && pnpm build",
  "outputDirectory": "web/.next",
  "installCommand": "cd web && pnpm install",
  "framework": "nextjs",
  "functions": {
    "web/src/app/api/**/*.ts": {
      "runtime": "nodejs18.x"
    }
  }
}
```

##### Deployment Steps

1. **Connect Repository**: Link GitHub repository to Vercel
2. **Configure Build Settings**: Set build command and output directory
3. **Environment Variables**: Set frontend environment variables
4. **Deploy**: Automatic deployment on git push
5. **Custom Domain**: Configure custom domain (optional)

##### Environment Variables Setup

```bash
# In Vercel Dashboard
NEXT_PUBLIC_API_URL=https://api.llm-lab.railway.app
```

#### Vercel-Specific Features

##### Automatic Optimizations

- **Image Optimization**: Automatic image compression and format conversion
- **Bundle Optimization**: Automatic code splitting and tree shaking
- **Edge Caching**: Global CDN with edge caching for static assets
- **Performance Monitoring**: Built-in analytics and performance insights

##### Preview Deployments

- **Branch Deployments**: Automatic deployments for pull requests
- **Preview URLs**: Unique URLs for each deployment
- **Environment Variables**: Separate environment variables for preview deployments

##### Custom Domain Configuration

```bash
# In Vercel Dashboard
# Add custom domain: llm-lab.com
# Configure DNS records as instructed by Vercel
```

##### Vercel Analytics (Optional)

```typescript
// web/src/app/layout.tsx
import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Railway Deployment (Backend)

#### 1. Backend Deployment

##### Railway Configuration

```json
// railway.json (Backend)
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "pnpm start:prod",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

##### Deployment Steps

1. **Connect Repository**: Link GitHub repository to Railway
2. **Configure Environment**: Set environment variables
3. **Database Setup**: Create PostgreSQL service
4. **Deploy**: Automatic deployment on git push
5. **Health Check**: Verify deployment health

##### Environment Variables Setup

```bash
# In Railway Dashboard
DATABASE_URL=${{Postgres.DATABASE_URL}}
GOOGLE_AI_API_KEY=your_api_key_here
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://llm-lab.vercel.app
```

### Docker Deployment

#### Backend Dockerfile

```dockerfile
# Use Node.js 20 Alpine for smaller image size
FROM node:20-alpine

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Generate Prisma client
RUN pnpm db:generate

# Build the application
RUN pnpm build

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

# Start the application
CMD ["pnpm", "start:prod"]
```

#### Frontend Dockerfile

```dockerfile
# Use Node.js 20 Alpine for smaller image size
FROM node:20-alpine

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm build

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000 || exit 1

# Start the application
CMD ["pnpm", "start"]
```

#### Docker Compose (Local Development)

```yaml
version: "3.8"

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: llm_lab
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./api
    ports:
      - "5000:5000"
    environment:
      DATABASE_URL: postgresql://postgres:password@postgres:5432/llm_lab
      GOOGLE_AI_API_KEY: ${GOOGLE_AI_API_KEY}
      PORT: 5000
      NODE_ENV: development
      FRONTEND_URL: http://localhost:3000
    depends_on:
      - postgres
    volumes:
      - ./api:/app
      - /app/node_modules

  frontend:
    build: ./web
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:5000
    depends_on:
      - backend
    volumes:
      - ./web:/app
      - /app/node_modules

volumes:
  postgres_data:
```

## Database Configuration

### PostgreSQL Setup

#### Production Database

```sql
-- Create database
CREATE DATABASE llm_lab_production;

-- Create user
CREATE USER llm_lab_user WITH PASSWORD 'secure_password';

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE llm_lab_production TO llm_lab_user;
```

#### Database Migrations

```bash
# Generate migration
pnpm db:generate

# Apply migrations
pnpm db:push

# Reset database (development only)
pnpm db:reset
```

## Security Configuration

### API Security

#### CORS Configuration

```typescript
// main.ts
app.enableCors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
});
```

#### Rate Limiting

```typescript
// rate-limiter.service.ts
@Injectable()
export class RateLimiterService {
  private readonly maxConcurrentRequests = 3;
  private readonly requestDelay = 2000;

  async waitForRateLimit(): Promise<void> {
    // Implementation
  }
}
```

#### Input Validation

```typescript
// dto/create-experiment.dto.ts
export class CreateExperimentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  prompt: string;

  @IsNumber()
  @Min(0)
  @Max(2)
  temperatureMin: number;

  @IsNumber()
  @Min(0)
  @Max(2)
  temperatureMax: number;
}
```

### Environment Security

#### Secret Management

```bash
# Use Railway's secret management
railway variables set GOOGLE_AI_API_KEY=your_secret_key

# Or use environment-specific files
echo "GOOGLE_AI_API_KEY=your_secret_key" >> .env.production
```

#### SSL/TLS Configuration

- **Railway**: Automatic SSL certificates
- **Custom Domain**: Configure SSL in Railway dashboard
- **API Security**: HTTPS-only in production

## Monitoring and Logging

### Application Monitoring

#### Health Checks

```typescript
// health.controller.ts
@Controller("health")
export class HealthController {
  @Get()
  check() {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
```

#### Logging Configuration

```typescript
// main.ts
import { Logger } from "@nestjs/common";

const logger = new Logger("Bootstrap");

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configure logging
  app.useLogger(logger);

  await app.listen(process.env.PORT || 5000);
  logger.log(`Application is running on: ${await app.getUrl()}`);
}
```

### Error Tracking

#### Error Handling

```typescript
// app.module.ts
@Module({
  imports: [
    // Error tracking middleware
    SentryModule.forRoot({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV,
    }),
  ],
})
export class AppModule {}
```

#### Performance Monitoring

```typescript
// metrics.service.ts
@Injectable()
export class MetricsService {
  private readonly logger = new Logger(MetricsService.name);

  async calculateMetrics(response: Response, experiment: Experiment) {
    const startTime = Date.now();

    try {
      // Calculate metrics
      const result = await this.performCalculation(response, experiment);

      const duration = Date.now() - startTime;
      this.logger.log(`Metrics calculated in ${duration}ms`);

      return result;
    } catch (error) {
      this.logger.error("Error calculating metrics:", error);
      throw error;
    }
  }
}
```

## Troubleshooting

### Common Deployment Issues

#### Database Connection Issues

```bash
# Check database connection
pnpm db:push

# Verify environment variables
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT 1;"
```

#### API Key Issues

```bash
# Verify API key
curl -X POST https://your-api-domain.com/test-llm \
  -H "Content-Type: application/json" \
  -d '{"prompt": "test", "parameters": {...}}'
```

#### Build Issues

```bash
# Clear cache and rebuild
rm -rf node_modules
rm -rf .next
pnpm install
pnpm build
```
