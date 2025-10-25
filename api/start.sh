#!/bin/sh

echo "🚀 Starting LLM Lab API..."

# Run database migrations
echo "🗄️ Running database migrations..."
pnpm db:push

# Start the application
echo "🌟 Starting NestJS application..."
pnpm start:prod
