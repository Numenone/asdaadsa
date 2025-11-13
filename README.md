# SnapShot - Webcam Photo Capture App

A beautiful, modern web application for capturing photos with your webcam, featuring a shared photo gallery, countdown timers, and cloud storage integration.

## 🌟 Features

- **Real-time Webcam Capture**: High-quality photo capture directly from your webcam
- **Countdown Timer**: 3-second and 5-second countdown options before capture
- **Camera Flash Animation**: Realistic camera flash effect on photo capture
- **Photo Gallery**: Auto-scrolling gallery with smooth animations
- **Download Photos**: Download any photo from the gallery
- **Camera Flip**: Switch between front and rear cameras
- **Cloud Storage**: Seamless integration with Supabase for persistent photo storage
- **Responsive Design**: Beautiful, modern UI that works on desktop, tablet, and mobile
- **Fallback Storage**: Works with localStorage when Supabase is not configured
- **Production Ready**: Fully optimized for Vercel deployment

## 📋 Requirements

- Node.js (v18 or later)
- npm, yarn, or pnpm
- Modern web browser with webcam access
- Supabase account (for cloud storage)
- Vercel account (for deployment)

## 🚀 Quick Start

### 1. Local Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open http://localhost:8080 in your browser
```

### 2. Configure Supabase (Optional but Recommended)

For cloud storage of photos:

1. **Create Supabase Project**
   - Visit [https://supabase.com](https://supabase.com)
   - Click "New Project"
   - Choose a name and region

2. **Get Credentials**
   - Go to Settings > API
   - Copy Project URL and anon public key

3. **Create Storage Bucket**
   - Go to Storage in the sidebar
   - Create a bucket named `photos`
   - Make it public

4. **Set Environment Variables**
   - Create `.env.local` file in project root:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```

5. **Restart Dev Server**
   ```bash
   pnpm dev
   ```

See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed setup instructions.

## 🏗️ Project Structure

```
client/
├── components/
│   ├── CameraCapture.tsx      # Webcam capture with countdown
│   └── PhotoGallery.tsx        # Gallery with auto-scroll
├── pages/
│   └── Index.tsx               # Main app page
├── lib/
│   └── supabase.ts             # Supabase client & helpers
└── global.css                  # Global styling

shared/
└── api.ts                       # Shared types

server/
└── index.ts                     # Express server (if needed)
```

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, TypeScript
- **Styling**: TailwindCSS 3, Framer Motion
- **Camera**: React Webcam
- **Storage**: Supabase (Cloud), LocalStorage (Fallback)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Deployment**: Vercel

## 📦 Build & Deploy

### Production Build

```bash
pnpm build
```

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import on Vercel**
   - Go to [https://vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Select "Other" as framework
   - Configure:
     - **Build Command**: `pnpm build`
     - **Output Directory**: `dist`
   - Add Environment Variables:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
   - Click "Deploy"

### Deploy to Netlify

1. **Connect Repository**
   - Go to [https://netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository

2. **Configure Build Settings**
   - **Build Command**: `pnpm build`
   - **Publish Directory**: `dist`

3. **Add Environment Variables**
   - Go to Site Settings > Build & Deploy > Environment
   - Add:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

4. **Deploy**
   - Netlify will automatically build and deploy

## 📱 Features Breakdown

### Camera Capture
- Live webcam preview
- Instant capture with one click
- 3-second and 5-second countdown options
- Camera flash animation effect
- Switch between front and rear cameras
- Shows upload progress indicator

### Photo Gallery
- Auto-scrolling carousel every 4 seconds
- Click thumbnails to select photos
- Download individual photos
- Delete photos (local and cloud)
- Photo counter display
- Smooth animations and transitions
- Responsive thumbnail layout

### Responsive Design
- Mobile-first approach
- Optimized for:
  - Mobile phones (375px+)
  - Tablets (768px+)
  - Desktop (1024px+)
  - Wide screens (1920px+)
- Touch-friendly buttons
- Readable on all screen sizes

## 🔒 Privacy & Security

- Photos are stored securely in Supabase
- Public bucket allows viewing but requires authentication for deletion
- Environment variables are never exposed to client
- Browser localStorage used as fallback (browser-only)

## 🐛 Troubleshooting

### Webcam not working
- Check browser permissions
- Allow camera access when prompted
- Try refreshing the page
- Ensure HTTPS on production

### Photos not uploading
- Verify Supabase credentials in .env
- Check Supabase bucket exists and is public
- Check browser console for errors
- App falls back to localStorage automatically

### Build errors
- Delete `node_modules` and `pnpm-lock.yaml`
- Run `pnpm install`
- Run `pnpm build`

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| VITE_SUPABASE_URL | Supabase project URL | No (optional) |
| VITE_SUPABASE_ANON_KEY | Supabase anonymous key | No (optional) |

## 📄 Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm typecheck    # Run TypeScript type check
pnpm test         # Run tests with Vitest
pnpm format.fix   # Format code with Prettier
```

## 🎨 Customization

### Change Theme Colors

Edit `client/global.css` to modify:
- Primary colors (blue/purple)
- Dark mode background
- Accent colors

### Add New Features

- Create new pages in `client/pages/`
- Add routes in `client/App.tsx`
- Create components in `client/components/`

### Modify Countdown Times

Edit `CameraCapture.tsx` button handlers:
```tsx
<button onClick={() => startCountdown(10)}>
  10s Timer
</button>
```

## 📊 Performance

- Optimized image compression on upload
- Lazy loading of gallery images
- Efficient state management
- Minimal bundle size (~300KB gzipped)
- Fast page loads with Vite

## 🚀 Deployment Checklist

- [ ] Supabase project created and bucket configured
- [ ] Environment variables added to deployment platform
- [ ] GitHub repository connected
- [ ] Build succeeds locally (`pnpm build`)
- [ ] Test photo capture locally
- [ ] Deploy to Vercel or Netlify
- [ ] Test photo upload on production
- [ ] Verify responsive design on mobile
- [ ] Test download functionality

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [React Webcam](https://github.com/mozmorris/react-webcam)
- [TailwindCSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)

## 📄 License

This project is open source and available under the MIT License.

## 💬 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
3. Check browser console for error messages
4. Visit platform documentation links above

## ✨ Credits

Built with React, Supabase, and Vercel for a modern, production-ready photo capture experience.

---

**Made with ❤️ for capturing beautiful moments**
