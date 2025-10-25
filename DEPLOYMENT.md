# 🚀 Deployment Guide - Railway + Vercel

This guide will help you deploy the LLM Lab application using Railway for the backend and Vercel for the frontend.

## 📋 Prerequisites

- Node.js 20+
- pnpm (recommended) or npm
- Google AI Studio API key
- Railway account (free tier available)
- Vercel account (free tier available)

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Next.js)     │◄──►│   (NestJS)      │◄──►│   (PostgreSQL)  │
│   Vercel        │    │   Railway      │    │   Railway       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🎯 Step 1: Backend Deployment (Railway)

### 1.1 Install Railway CLI

```bash
npm install -g @railway/cli
```

### 1.2 Login to Railway

```bash
railway login
```

### 1.3 Deploy Backend

```bash
cd api

# Initialize Railway project
railway init

# Deploy the application
railway up

# Or use the deployment script
./deploy.sh
```

### 1.4 Set Environment Variables

In the Railway dashboard, set these environment variables:

```env
# Database (Railway will provide this automatically)
DATABASE_URL=postgresql://...

# Google AI API Key
GOOGLE_AI_API_KEY=your_google_ai_api_key_here

# CORS Configuration
FRONTEND_URL=https://your-app-name.vercel.app

# Server Configuration
NODE_ENV=production
PORT=5000
```

### 1.5 Run Database Migrations

```bash
railway run pnpm db:push
```

### 1.6 Get Your Backend URL

```bash
railway domain
```

## 🎯 Step 2: Frontend Deployment (Vercel)

### 2.1 Install Vercel CLI

```bash
npm install -g vercel
```

### 2.2 Deploy Frontend

```bash
cd web

# Deploy to Vercel
vercel

# Follow the prompts:
# - Link to existing project? No
# - Project name: llm-lab-web (or your preferred name)
# - Directory: ./
# - Override settings? No
```

### 2.3 Set Environment Variables

In the Vercel dashboard, go to your project settings and add:

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
```

### 2.4 Update Backend CORS

Update the `FRONTEND_URL` in Railway with your Vercel domain:

```env
FRONTEND_URL=https://your-app-name.vercel.app
```

## 🔧 Configuration Files Created

### Backend Changes

1. **`api/Dockerfile`** - Production Docker configuration
2. **`api/railway.json`** - Railway deployment configuration
3. **`api/deploy.sh`** - Automated deployment script
4. **`api/package.json`** - Added deployment scripts
5. **`api/prisma/schema.prisma`** - Updated to use PostgreSQL
6. **`api/src/main.ts`** - Enhanced CORS configuration

### Frontend Changes

No changes needed - Vercel handles Next.js deployment automatically.

## 🧪 Testing Your Deployment

### 1. Test Backend API

```bash
# Test the API endpoint
curl https://your-backend-url.railway.app/

# Test LLM connection
curl -X POST https://your-backend-url.railway.app/test-llm \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Hello, how are you?",
    "parameters": {
      "temperature": 0.5,
      "topP": 0.8,
      "topK": 20,
      "maxTokens": 50
    }
  }'
```

### 2. Test Frontend

Visit your Vercel URL and verify:

- ✅ Page loads without errors
- ✅ Can create new experiments
- ✅ Can view experiment results
- ✅ API calls work correctly

## 🔍 Troubleshooting

### Common Issues

#### 1. CORS Errors

- **Problem**: Frontend can't connect to backend
- **Solution**: Check `FRONTEND_URL` in Railway matches your Vercel domain

#### 2. Database Connection Errors

- **Problem**: Backend can't connect to database
- **Solution**: Run `railway run pnpm db:push` to set up the database

#### 3. Environment Variables Not Set

- **Problem**: API calls fail with missing configuration
- **Solution**: Verify all environment variables are set in both Railway and Vercel

#### 4. Build Failures

- **Problem**: Railway deployment fails
- **Solution**: Check Dockerfile and ensure all dependencies are included

### Debugging Commands

```bash
# Check Railway logs
railway logs

# Check Railway status
railway status

# Check Vercel deployment status
vercel logs

# Test database connection
railway run pnpm db:studio
```

## 📊 Monitoring

### Railway Dashboard

- View deployment status
- Monitor resource usage
- Check logs and errors
- Manage environment variables

### Vercel Dashboard

- View deployment history
- Monitor performance
- Check build logs
- Manage domains

## 💰 Cost Estimation

### Railway (Backend + Database)

- **Free Tier**: $0/month (limited usage)
- **Hobby Plan**: $5/month (unlimited usage)
- **Pro Plan**: $20/month (advanced features)

### Vercel (Frontend)

- **Free Tier**: $0/month (100GB bandwidth)
- **Pro Plan**: $20/month (unlimited bandwidth)

### Total Monthly Cost

- **Free**: $0/month (with limitations)
- **Recommended**: $25/month (Railway Hobby + Vercel Pro)

## 🚀 Next Steps

1. **Custom Domain**: Set up custom domains for both frontend and backend
2. **SSL Certificates**: Automatically handled by both platforms
3. **Monitoring**: Set up error tracking and performance monitoring
4. **CI/CD**: Configure automatic deployments on git push
5. **Scaling**: Upgrade plans as your usage grows

## 📞 Support

- **Railway**: [docs.railway.app](https://docs.railway.app)
- **Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **Project Issues**: Check the project README for troubleshooting

---

🎉 **Congratulations!** Your LLM Lab application is now deployed and ready to use!
