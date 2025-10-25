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

# Set a dummy DATABASE_URL for build time (Prisma needs it for generation)
ENV DATABASE_URL="postgresql://dummy:dummy@dummy:5432/dummy"

# Copy source code (prisma.config.ts is excluded via .dockerignore)
COPY . .

# Generate Prisma client (with dummy URL)
RUN pnpm db:generate

# Build the application
RUN pnpm build

# Expose port
EXPOSE 5000

# Copy startup script
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Start the application
CMD ["/app/start.sh"]
