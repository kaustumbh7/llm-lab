# ✅ Deployment Checklist

## Pre-Deployment

- [ ] Google AI API key obtained
- [ ] Railway account created
- [ ] Vercel account created
- [ ] Railway CLI installed (`npm install -g @railway/cli`)
- [ ] Vercel CLI installed (`npm install -g vercel`)

## Backend Deployment (Railway)

- [ ] Navigate to `api/` directory
- [ ] Run `railway login`
- [ ] Run `railway init` (if first time)
- [ ] Run `railway up` to deploy
- [ ] Set environment variables in Railway dashboard:
  - [ ] `GOOGLE_AI_API_KEY`
  - [ ] `FRONTEND_URL` (will be updated after frontend deployment)
  - [ ] `NODE_ENV=production`
- [ ] Run `railway run pnpm db:push` to set up database
- [ ] Get backend URL with `railway domain`
- [ ] Test backend API endpoint

## Frontend Deployment (Vercel)

- [ ] Navigate to `web/` directory
- [ ] Run `vercel` to deploy
- [ ] Set environment variable in Vercel dashboard:
  - [ ] `NEXT_PUBLIC_API_URL` (your Railway backend URL)
- [ ] Get frontend URL from Vercel dashboard
- [ ] Update `FRONTEND_URL` in Railway with your Vercel URL

## Post-Deployment Testing

- [ ] Frontend loads without errors
- [ ] Can create new experiments
- [ ] API calls work correctly
- [ ] Database operations work
- [ ] CORS is properly configured
- [ ] All environment variables are set

## Optional Enhancements

- [ ] Set up custom domain (if desired)
- [ ] Configure automatic deployments
- [ ] Set up monitoring and error tracking
- [ ] Optimize performance settings

## Troubleshooting

If you encounter issues:

1. **CORS Errors**: Check that `FRONTEND_URL` in Railway matches your Vercel domain
2. **Database Errors**: Run `railway run pnpm db:push` to set up the database
3. **Build Failures**: Check Railway logs with `railway logs`
4. **Environment Variables**: Verify all required variables are set in both platforms

## Success! 🎉

Your LLM Lab application should now be fully deployed and accessible via:

- **Frontend**: Your Vercel URL
- **Backend**: Your Railway URL
- **Database**: Managed by Railway PostgreSQL
