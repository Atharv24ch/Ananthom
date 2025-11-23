# Render Deployment Guide for Django Backend

## Prerequisites
1. Render account (sign up at [render.com](https://render.com))
2. Backend code pushed to GitHub

## Deployment Steps

### 1. Create PostgreSQL Database on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **New** → **PostgreSQL**
3. Configure:
   - **Name**: `ananthom-db` (or your preferred name)
   - **Database**: `ananthom_db`
   - **User**: (auto-generated)
   - **Region**: Choose closest to your users
   - **Plan**: Free tier is fine for testing
4. Click **Create Database**
5. **Copy the Internal Database URL** - you'll need this

### 2. Create Web Service on Render

1. Click **New** → **Web Service**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `ananthom-backend` (or your preferred name)
   - **Region**: Same as database
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `./build.sh`
   - **Start Command**: `gunicorn config.wsgi:application`

### 3. Add Environment Variables

In the **Environment** section, add these variables:

| Key | Value | Notes |
|-----|-------|-------|
| `SECRET_KEY` | Generate a new secret key | Use [Djecrety](https://djecrety.ir/) or Django's `get_random_secret_key()` |
| `DEBUG` | `False` | Never set to True in production |
| `DATABASE_URL` | *Paste Internal Database URL* | From PostgreSQL database you created |
| `ALLOWED_HOSTS` | `your-app-name.onrender.com` | Replace with your actual Render app name |
| `CORS_ALLOWED_ORIGINS` | `https://ananthomss.vercel.app` | Your Vercel frontend URL |
| `CSRF_TRUSTED_ORIGINS` | `https://ananthomss.vercel.app` | Your Vercel frontend URL |
| `RAZORPAY_KEY_ID` | Your Razorpay key | From Razorpay dashboard |
| `RAZORPAY_KEY_SECRET` | Your Razorpay secret | From Razorpay dashboard |
| `PYTHON_VERSION` | `3.11.0` | Optional, specified in runtime.txt |

### 4. Deploy

1. Click **Create Web Service**
2. Render will automatically:
   - Install dependencies from `requirements.txt`
   - Run `build.sh` (collect static files, migrate database)
   - Start the application with Gunicorn

### 5. Update Frontend Environment Variable

Once deployed, update your Vercel environment variable:

1. Go to Vercel → Your Project → Settings → Environment Variables
2. Update `NEXT_PUBLIC_API_URL` to: `https://your-app-name.onrender.com/api`
3. Redeploy your frontend

### 6. Test the Deployment

Visit: `https://your-app-name.onrender.com/api/auth/csrf/`

You should see a successful response (no 404 or 500 errors).

## Important Notes

### Free Tier Limitations
- Render's free tier spins down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds
- Database is also free tier with 90-day expiration (can be renewed)

### Security Settings
- `SESSION_COOKIE_SECURE` and `CSRF_COOKIE_SECURE` are set to `True` in production (HTTPS required)
- `SESSION_COOKIE_SAMESITE` and `CSRF_COOKIE_SAMESITE` are set to `'None'` for cross-domain cookies

### Database Backups
Free tier doesn't include automatic backups. For production:
- Upgrade to a paid database plan, or
- Set up manual backup procedures

## Troubleshooting

**Build fails:**
- Check build logs in Render dashboard
- Ensure `build.sh` has correct permissions
- Verify all required packages in `requirements.txt`

**500 errors:**
- Check application logs in Render dashboard
- Verify environment variables are set correctly
- Check `DATABASE_URL` is the Internal Database URL

**CORS errors:**
- Verify `CORS_ALLOWED_ORIGINS` includes your Vercel domain (with `https://`)
- Check `CSRF_TRUSTED_ORIGINS` is set correctly
- Ensure no trailing slashes in origins

**Database connection errors:**
- Use the **Internal Database URL** (not External)
- Ensure database and web service are in the same region
- Check database is running and not suspended

## Monitoring

- Check logs: Render Dashboard → Your Service → Logs
- Monitor metrics: Dashboard shows CPU, memory, and request metrics
- Set up alerts: Render can notify you of deployment failures

---

For more details, see [Render's Django deployment guide](https://render.com/docs/deploy-django).
