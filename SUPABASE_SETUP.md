# Supabase Setup Guide for SnapShot

This guide will help you set up Supabase for photo storage and enable the app to work in production.

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in with your account
3. Click "New Project"
4. Choose a name (e.g., "SnapShot")
5. Create a strong database password
6. Select a region closest to your users
7. Click "Create New Project"

Wait for the project to be initialized (2-3 minutes).

## 2. Get Your Credentials

1. Go to your project's **Settings** > **API**
2. Copy the following values:
   - **Project URL** (your `VITE_SUPABASE_URL`)
   - **anon public** key (your `VITE_SUPABASE_ANON_KEY`)

## 3. Create Storage Bucket

1. Go to **Storage** in the sidebar
2. Click **Create Bucket**
3. Name it `photos`
4. Make it **Public** (toggle on)
5. Click **Create Bucket**

## 4. Set Up Bucket Policies

1. Click on the `photos` bucket you just created
2. Go to the **Policies** tab
3. Click **New Policy** (or use the suggested policy template)
4. Set up public read access:
   - Allow: `SELECT`
   - For: `public`
   - Target role: `public`

5. Create a policy for authenticated uploads:
   - Click **New Policy**
   - Allow: `INSERT`, `UPDATE`, `DELETE`
   - For: `authenticated`
   - With check: `true` (or define your custom logic)

## 5. Update Your Environment Variables

1. Create a `.env.local` file in your project root (or update existing)
2. Add your Supabase credentials:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

3. Save the file

## 6. Test the Connection

1. Run the development server: `pnpm dev`
2. Open http://localhost:3000
3. Try capturing a photo with the camera
4. The photo should be uploaded to Supabase and appear in the gallery

## 7. Deploy to Vercel

### Prerequisites
- GitHub account
- Vercel account

### Steps

1. **Push to GitHub**
   - Initialize a git repo: `git init`
   - Add files: `git add .`
   - Commit: `git commit -m "Initial commit"`
   - Push to GitHub

2. **Connect to Vercel**
   - Go to [https://vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select "Other" as the framework
   - Configure:
     - Build Command: `pnpm build`
     - Output Directory: `dist`
   - Add Environment Variables (same as .env.local):
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
   - Click "Deploy"

3. **Your app is now live!** 🚀

## Troubleshooting

### Photos not uploading
- Check that the `photos` bucket exists and is public
- Verify your Supabase credentials in .env
- Check browser console for error messages

### CORS errors
- Ensure your Supabase bucket is public
- Check bucket policies allow public access

### Photos not persisting
- If Supabase is not configured, photos are stored in browser localStorage
- This data will be lost if you clear browser storage
- Set up Supabase for persistent storage

## Local Development with Fallback

The app works with or without Supabase:
- **With Supabase**: Photos are stored in the cloud and persist across devices
- **Without Supabase**: Photos are stored in browser localStorage (current session only)

## Production Deployment Checklist

- [ ] Supabase project created and configured
- [ ] Environment variables added to Vercel
- [ ] GitHub repository created and pushed
- [ ] Vercel project deployed
- [ ] Test photo upload on production
- [ ] Test gallery viewing on production
- [ ] Test download functionality
- [ ] Test responsive design on mobile

## Support

For issues with Supabase, visit: https://supabase.com/docs
For issues with Vercel, visit: https://vercel.com/docs
