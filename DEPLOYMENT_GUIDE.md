# SnapShot Deployment Guide

This guide will help you deploy your SnapShot app to production with Supabase and Vercel.

## Prerequisites

Before starting, ensure you have:

- GitHub account (for version control)
- Supabase account (free tier available)
- Vercel account (free tier available)
- This repository pushed to GitHub

## Step 1: Set Up Supabase Storage

### 1.1 Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in the form:
   - **Name**: SnapShot (or your preferred name)
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your users
5. Wait 2-3 minutes for initialization

### 1.2 Create Storage Bucket

1. In Supabase Dashboard, click **Storage** in the sidebar
2. Click **Create Bucket**
3. Configure:
   - **Name**: `photos`
   - **Public bucket**: Toggle ON
   - Click **Create bucket**

### 1.3 Set Bucket Policies

1. Click the `photos` bucket
2. Go to **Policies** tab
3. Click **New Policy** → **For all other roles**
4. Paste this policy:

```json
{
  "name": "Public SELECT",
  "definition": "true",
  "roles": ["public"],
  "action": "SELECT"
}
```

5. Click **Review** → **Save policy**

6. For authenticated uploads, click **New Policy** again:
   - Select **INSERT** and **UPDATE** and **DELETE**
   - For **authenticated** role
   - Click **Save**

### 1.4 Get Your Credentials

1. Go to **Settings** → **API**
2. Copy these values (you'll need them later):
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key

## Step 2: Push Code to GitHub

### 2.1 Initialize Git (if not already done)

```bash
git init
git add .
git commit -m "Initial commit: SnapShot photo capture app"
git branch -M main
```

### 2.2 Create GitHub Repository

1. Go to [https://github.com/new](https://github.com/new)
2. Create repository named `snapshot` (or your preference)
3. **Do NOT initialize with README**
4. Click **Create repository**

### 2.3 Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/snapshot.git
git push -u origin main
```

## Step 3: Deploy to Vercel

### 3.1 Connect to Vercel

1. Go to [https://vercel.com/new](https://vercel.com/new)
2. Click **Continue with GitHub**
3. Select your `snapshot` repository
4. Click **Import**

### 3.2 Configure Project

On the import screen, configure:

**Project Name**: `snapshot` (or your preferred name)

**Framework Preset**: Select "Other" (since it's a custom setup)

**Build Settings**:

- **Build Command**: `pnpm build`
- **Output Directory**: `dist`
- **Install Command**: `pnpm install`

**Environment Variables**:

Click **Add New** and add these two variables:

1. **VITE_SUPABASE_URL**
   - Value: Paste your Supabase Project URL

2. **VITE_SUPABASE_ANON_KEY**
   - Value: Paste your Supabase anon public key

### 3.3 Deploy

1. Click **Deploy**
2. Wait for build to complete (3-5 minutes)
3. You'll see "Congratulations! Your project has been successfully deployed"
4. Click **Visit** to see your live app!

## Step 4: Test Production App

### 4.1 Test Camera Capture

1. Go to your Vercel URL
2. Click "Capture" button
3. Allow camera access
4. Take a photo
5. Verify photo appears in gallery

### 4.2 Test File Upload

After capturing a photo:

- Click download icon to download the photo
- Check that photo was uploaded to Supabase (optional):
  1. Go to Supabase Dashboard
  2. Click Storage → photos bucket
  3. You should see `public` folder with your photos

### 4.3 Test Gallery Features

- Try the timer options (3s, 5s)
- Try the flip camera button
- Click thumbnails to switch photos
- Verify auto-scroll in gallery

### 4.4 Test on Mobile

- Visit your Vercel URL on a mobile phone
- Test camera capture on mobile
- Verify responsive layout
- Test touch interactions

## Step 5: Custom Domain (Optional)

### 5.1 Add Custom Domain

1. In Vercel Dashboard, go to your project
2. Click **Settings** → **Domains**
3. Enter your domain name
4. Follow Vercel's instructions to update DNS

## Step 6: Continuous Deployment

Your app is now set up for continuous deployment:

1. Make changes locally
2. Commit and push to GitHub: `git push origin main`
3. Vercel automatically rebuilds and deploys
4. Your updates go live in 1-2 minutes

## Troubleshooting

### Build Fails on Vercel

**Error**: "pnpm: command not found"

- Solution: Add to Environment Variables → **ENABLE_PNPM=true**

**Error**: "Supabase client error"

- Solution: Verify environment variables are correctly set in Vercel
- Check Settings → Environment Variables

**Error**: "Photos not uploading"

- Solution:
  1. Check Supabase bucket is public
  2. Verify bucket policies are set
  3. Check environment variables

### Webcam Issues on Production

**Issue**: Camera not working

- Solution: Ensure you're using HTTPS (Vercel provides this by default)
- Some browsers require HTTPS for camera access

**Issue**: Permission denied

- Solution: Clear browser cache and cookies, reload page, allow camera access

### Photos Not Persisting

**Issue**: Photos disappear after refresh

- Cause: Supabase not configured properly
- Check browser console for errors
- Verify environment variables in Vercel

## Advanced: Custom Domain + SSL

If you have a custom domain:

1. Get your domain's nameservers from registrar
2. In Vercel, add your domain
3. Update nameservers at your domain registrar
4. Vercel auto-generates SSL certificate (free)

## Monitoring

### 1. Monitor Supabase Usage

1. Go to Supabase Dashboard
2. Click **Storage** → **Photos**
3. Check storage usage under bucket info

### 2. Monitor Vercel Analytics

1. Go to Vercel Dashboard
2. Click your project
3. Check **Analytics** for:
   - Page views
   - Response times
   - Errors

## Security Notes

- ✅ Never commit `.env.local` to GitHub
- ✅ Use Vercel environment variables for secrets
- ✅ Supabase bucket is public (read-only)
- ✅ Photos are signed URLs (unique URLs)
- ✅ Consider adding authentication later if needed

## Rollback/Disaster Recovery

### If Something Goes Wrong

1. Go to Vercel Dashboard
2. Click **Deployments**
3. Find previous successful deployment
4. Click the three dots
5. Select **Redeploy**

Your previous version is now live!

## Next Steps

1. ✅ Deployed to Vercel
2. Share your app URL with others!
3. Consider these enhancements:
   - Add user authentication (Supabase Auth)
   - Add filters/effects to photos
   - Add sharing capabilities
   - Add analytics

## Support Resources

- [Vercel Docs](https://vercel.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [React Webcam Issues](https://github.com/mozmorris/react-webcam/issues)
- [TailwindCSS](https://tailwindcss.com)

---

**Your SnapShot app is now live! 🎉**

Share your URL and start capturing memories!
