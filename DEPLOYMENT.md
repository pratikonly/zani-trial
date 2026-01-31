# Deployment Guide for Zani

This guide will help you deploy the Zani anime streaming website to Vercel.

## Quick Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit - Zani anime streaming website"
   git push origin main
   ```

2. **Import to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables**
   - In the Vercel project settings, add:
   ```
   NEXT_PUBLIC_API_BASE_URL=https://anime-api-pratik.vercel.app
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for the build to complete
   - Your site will be live!

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Set Environment Variables**
   ```bash
   vercel env add NEXT_PUBLIC_API_BASE_URL
   # Enter: https://anime-api-pratik.vercel.app
   ```

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## Environment Variables

Make sure to set these in your Vercel project:

| Variable | Value | Description |
|----------|-------|-------------|
| `NEXT_PUBLIC_API_BASE_URL` | `https://anime-api-pratik.vercel.app` | API endpoint for anime data |

## Build Configuration

The project is pre-configured for Vercel with:

- **Framework**: Next.js (auto-detected)
- **Build Command**: `npm run build`
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install`
- **Dev Command**: `npm run dev`

## Custom Domain (Optional)

To add a custom domain:

1. Go to your project in Vercel Dashboard
2. Navigate to Settings → Domains
3. Add your custom domain
4. Follow DNS configuration instructions
5. Wait for SSL certificate to be issued

## Performance Optimizations

The site is pre-configured with:

- ✅ Image optimization via Next.js Image component
- ✅ Code splitting and lazy loading
- ✅ Static page generation where possible
- ✅ Turbopack for faster builds
- ✅ Minification and compression

## Monitoring

After deployment, monitor your site:

1. **Analytics**: Enable Vercel Analytics in project settings
2. **Speed Insights**: Enable Vercel Speed Insights
3. **Logs**: View real-time logs in Vercel Dashboard

## Troubleshooting

### Build Fails

- Check that all dependencies are in `package.json`
- Verify environment variables are set correctly
- Review build logs in Vercel Dashboard

### API Errors

- Verify `NEXT_PUBLIC_API_BASE_URL` is set correctly
- Check if the anime API is accessible
- Review browser console for CORS errors

### Images Not Loading

- External images require proper `remotePatterns` in `next.config.ts` (already configured)
- Check that image URLs are valid and accessible

## Post-Deployment Checklist

- [ ] Site loads without errors
- [ ] Search functionality works
- [ ] Anime details page loads correctly
- [ ] Video player streams content
- [ ] Mobile responsiveness verified
- [ ] SEO meta tags are correct
- [ ] Disclaimer page is accessible
- [ ] All links work properly

## Support

For issues:
- Check the [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- Visit [Vercel Support](https://vercel.com/support)
- Review project logs in Vercel Dashboard

---

Built with Next.js 15 + React + TypeScript + Tailwind CSS
