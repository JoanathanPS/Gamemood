# GameMood AI - Deployment Guide

## 🚀 Vercel Deployment

This guide will help you deploy GameMood AI to Vercel.

### Prerequisites

1. **GitHub Repository**: Your code should be in a GitHub repository
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **Node.js**: Version 18 or higher

### Step 1: Prepare Your Repository

1. Make sure all files are committed to your GitHub repository
2. Ensure your `package.json` has the correct build scripts:
   ```json
   {
     "scripts": {
       "dev": "vite",
       "build": "vite build",
       "preview": "vite preview"
     }
   }
   ```

### Step 2: Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will automatically detect it's a Vite project
5. Configure the following settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
6. Click "Deploy"

#### Option B: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. In your project directory, run:
   ```bash
   vercel
   ```

3. Follow the prompts to configure your deployment

### Step 3: Environment Variables (Optional)

If you need environment variables:

1. Go to your Vercel project dashboard
2. Navigate to Settings > Environment Variables
3. Add any required variables (see `env.example` for reference)

### Step 4: Custom Domain (Optional)

1. In your Vercel project dashboard, go to Settings > Domains
2. Add your custom domain
3. Configure DNS settings as instructed

### Build Configuration

The project includes a `vercel.json` configuration file with:

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Framework**: Vite
- **Rewrites**: SPA routing support
- **Headers**: Asset caching optimization

### Troubleshooting

#### Common Issues:

1. **Build Fails**: Check that all dependencies are in `package.json`
2. **Routing Issues**: Ensure `vercel.json` includes the SPA rewrite rule
3. **Environment Variables**: Make sure all required env vars are set in Vercel dashboard

#### Build Commands:

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Preview production build locally
npm run preview
```

### Performance Optimization

The deployment includes several optimizations:

- **Code Splitting**: Automatic chunking for better loading
- **Asset Caching**: Long-term caching for static assets
- **Compression**: Automatic gzip compression
- **CDN**: Global content delivery network

### Monitoring

After deployment, you can monitor your app:

1. **Analytics**: Built-in Vercel Analytics
2. **Performance**: Core Web Vitals tracking
3. **Errors**: Real-time error monitoring
4. **Logs**: Function and build logs

### Updates

To update your deployment:

1. Push changes to your GitHub repository
2. Vercel will automatically trigger a new deployment
3. Preview deployments are created for pull requests

### Support

For deployment issues:

1. Check Vercel documentation: [vercel.com/docs](https://vercel.com/docs)
2. Review build logs in Vercel dashboard
3. Ensure all dependencies are compatible

---

**Your GameMood AI app should now be live on Vercel! 🎮✨**
