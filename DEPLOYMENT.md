# Deployment Guide

## Deploying Frontend to Vercel

This project contains a monorepo structure with frontend and backend in separate folders. The frontend (`fronend/`) is a Next.js app ready for Vercel deployment.

### Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. Your backend API deployed and accessible (e.g., on Railway, Render, Heroku, AWS, etc.)
3. Git repository pushed to GitHub/GitLab/Bitbucket

### Deployment Steps

#### 1. Push to Git Repository

Make sure your code is pushed to a Git repository (GitHub, GitLab, or Bitbucket).

```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

#### 2. Import Project to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your Git repository
3. Vercel should auto-detect the Next.js framework

#### 3. Configure Build Settings

Since this is a monorepo, Vercel needs to know where the frontend is:

- **Root Directory**: Leave as `.` (repository root)
- The `vercel.json` file at the root already tells Vercel to build from `fronend/`

If Vercel doesn't pick up `vercel.json` properly, you can manually set:

- **Root Directory**: `fronend`
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (default)

#### 4. Set Environment Variables

In the Vercel dashboard, under your project settings → Environment Variables, add:

| Name                  | Value                     | Example                                |
| --------------------- | ------------------------- | -------------------------------------- |
| `NEXT_PUBLIC_API_URL` | Your backend API base URL | `https://your-backend.example.com/api` |

**Important**:

- `NEXT_PUBLIC_` prefix makes the variable available to the browser
- Include `/api` at the end if your Django backend serves API endpoints under `/api`
- Example for Django: `https://mybackend.railway.app/api`

#### 5. Deploy

Click "Deploy" and Vercel will:

1. Install dependencies
2. Build your Next.js app
3. Deploy to a production URL

### Post-Deployment

#### Testing

Visit your Vercel deployment URL (e.g., `https://your-app.vercel.app`) and test:

- [ ] Sign up functionality
- [ ] Login functionality
- [ ] API calls to backend
- [ ] Subscription features
- [ ] Payment flow (if applicable)

#### CORS Configuration (Backend)

Make sure your Django backend allows requests from your Vercel domain. In `backend/config/settings.py`:

```python
CORS_ALLOWED_ORIGINS = [
    "https://your-app.vercel.app",
    "http://localhost:3000",  # for local development
]

CSRF_TRUSTED_ORIGINS = [
    "https://your-app.vercel.app",
]
```

#### Custom Domain (Optional)

1. Go to Vercel project → Settings → Domains
2. Add your custom domain
3. Follow Vercel's instructions to configure DNS

### Troubleshooting

**Build fails**:

- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify TypeScript has no errors: `cd fronend && npm run build`

**API calls fail**:

- Verify `NEXT_PUBLIC_API_URL` is set correctly in Vercel
- Check browser DevTools Network tab for the actual URL being called
- Ensure backend CORS settings allow Vercel domain

**Environment variables not working**:

- Variables must start with `NEXT_PUBLIC_` to be available in browser
- Redeploy after adding/changing environment variables

### Local Testing

To test the production build locally:

```bash
cd fronend
npm install
npm run build
npm run start
```

Then visit `http://localhost:3000`

### Continuous Deployment

Vercel automatically redeploys when you push to your main branch. You can:

- Configure preview deployments for pull requests
- Set up production and staging environments
- Use Vercel CLI for manual deployments: `vercel --prod`

---

## Backend Deployment

The Django backend (`backend/`) can be deployed to:

- Railway
- Render
- Heroku
- AWS/GCP/Azure
- DigitalOcean

Make sure to:

1. Set Django `ALLOWED_HOSTS` to include your domain
2. Configure `CORS_ALLOWED_ORIGINS` for your Vercel frontend URL
3. Set up PostgreSQL database (if not using SQLite)
4. Configure static files serving
5. Set `DEBUG = False` in production
6. Use environment variables for secrets

---

For questions or issues, check the [Vercel documentation](https://vercel.com/docs) or [Next.js deployment guide](https://nextjs.org/docs/app/building-your-application/deploying).
