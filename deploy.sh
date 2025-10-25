#!/bin/bash

# Railway Deployment Script for LLM Lab API
echo "🚀 Starting Railway deployment..."

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

# Login to Railway (if not already logged in)
echo "🔐 Checking Railway authentication..."
railway whoami || railway login

# Navigate to API directory
cd api

# Deploy to Railway
echo "📦 Deploying to Railway..."
railway up

# Run database migrations
echo "🗄️ Running database migrations..."
railway run pnpm db:push

echo "✅ Deployment complete!"
echo "🌐 Your API is now live at: $(railway domain)"
