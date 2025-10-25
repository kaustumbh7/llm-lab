# Railway Deployment Notes

## 🔄 Force Rebuild (Clear Cache)

If Railway is using cached layers and not picking up your changes:

### Option 1: Clear Build Cache via Dashboard

1. Go to your Railway project
2. Click on your service
3. Go to **Settings** tab
4. Scroll down to **Danger Zone**
5. Click **Clear Build Cache**
6. Redeploy

### Option 2: Force Rebuild via CLI

```bash
cd api
railway up --detach
```

### Option 3: Add a Cache-Busting Comment

Add a comment to your Dockerfile to force a rebuild:

```dockerfile
# Build version: 2024-01-XX
```

## 🐛 Current Issue: Prisma Config

The `prisma.config.ts` file was causing build failures because it tries to load `DATABASE_URL` during Docker build time.

### Solution Applied:

1. Added `prisma.config.ts` to `.dockerignore` to exclude it from Docker build
2. Set `ENV DATABASE_URL="postgresql://dummy:dummy@dummy:5432/dummy"` in Dockerfile for build time
3. The real `DATABASE_URL` from Railway is used at runtime

## ✅ Deployment Checklist

1. **Clear Railway cache** (if needed)
2. **Commit and push changes** to trigger rebuild
3. **Deploy**: `cd api && railway up`
4. **Check logs**: `railway logs`
5. **Verify environment variables** are set in Railway dashboard

## 🔍 Debugging

### Check if Dockerfile changes are being used:

```bash
railway logs --build
```

### Check runtime logs:

```bash
railway logs
```

### Verify environment variables:

```bash
railway variables
```

## 📝 Important Files

- `api/Dockerfile` - Production Docker configuration
- `api/.dockerignore` - Files to exclude from Docker build
- `api/start.sh` - Startup script (runs migrations and starts app)
- `api/railway.json` - Railway-specific configuration
