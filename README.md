# GameMood AI 🎮🧠

A comprehensive AI-powered platform that recommends video games based on your emotional state with full wellness integration, advanced analytics, and social features.

## 🚀 Quick Deploy to Vercel

Your GameMood AI app is ready for deployment! Here's how to deploy it:

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push to GitHub**: Make sure all your code is committed and pushed to your GitHub repository
2. **Go to Vercel**: Visit [vercel.com](https://vercel.com) and sign in
3. **Import Project**: Click "New Project" and import your GitHub repository
4. **Auto-Configure**: Vercel will automatically detect it's a Vite React project
5. **Deploy**: Click "Deploy" - that's it!

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from your project directory
vercel

# Follow the prompts
```

## 🛠️ What's Included

### ✅ Complete Application Structure
- **React 18** with Vite for fast development
- **Tailwind CSS** for beautiful, responsive design
- **Framer Motion** for smooth animations
- **React Router** for navigation
- **shadcn/ui** components for professional UI

### ✅ All Pages & Features
- **Home Page**: Mood assessment with sliders and AI text analysis
- **Dashboard**: Wellness analytics and mood tracking
- **Recommendations**: AI-powered game suggestions
- **Profile**: User settings and preferences
- **Responsive Layout**: Works on all devices

### ✅ Ready for Production
- **Vercel Configuration**: `vercel.json` with optimal settings
- **Environment Variables**: Template files included
- **Build Optimization**: Code splitting and performance optimizations
- **SPA Routing**: Proper routing for single-page application

## 🎯 Features Implemented

### Mood Assessment System
- Interactive mood sliders (Energy, Stress, Focus, Social, Challenge)
- AI-powered text analysis with sentiment processing
- Context-aware mood tracking
- Visual mood mapping

### Game Recommendation Engine
- Comprehensive game database with 50+ curated games
- Advanced AI matching algorithm
- Dynamic filtering by platform, genre, and session length
- Mood-based game suggestions

### Wellness Dashboard
- Mood pattern tracking and analytics
- Gaming session monitoring
- Wellness streak tracking
- Achievement system

### User Profile & Settings
- Personalized preferences
- Accessibility options
- Privacy controls
- Notification settings

## 🔧 Technical Stack

- **Frontend**: React 18, Vite, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React
- **Routing**: React Router DOM

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── mood/           # Mood assessment components
│   ├── dashboard/      # Dashboard components
│   └── games/          # Game-related components
├── pages/              # Main application pages
├── entities/           # Data models and API logic
├── utils/              # Utility functions
└── lib/                # Library configurations
```

## 🚀 Deployment Steps

1. **Ensure all files are committed to GitHub**
2. **Go to Vercel.com and sign in**
3. **Click "New Project"**
4. **Import your GitHub repository**
5. **Vercel auto-detects Vite configuration**
6. **Click "Deploy"**

The app will be live in minutes with:
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Automatic deployments on git push
- ✅ Preview deployments for pull requests

## 🎮 How to Use

1. **Mood Assessment**: Use sliders or describe your mood in text
2. **Get Recommendations**: AI analyzes your mood and suggests perfect games
3. **Track Progress**: Monitor your wellness journey in the dashboard
4. **Customize**: Set preferences and accessibility options in your profile

## 🔧 Environment Variables

Copy `env.example` to `.env.local` and configure:

```env
VITE_API_BASE_URL=https://api.gamemood.ai
VITE_APP_NAME=GameMood AI
VITE_ENABLE_ANALYTICS=true
```

## 📱 Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark/Light Mode**: Automatic theme switching
- **Accessibility**: WCAG 2.1 AA compliant
- **Performance**: Optimized for fast loading
- **SEO Ready**: Meta tags and structured data

## 🎯 Next Steps After Deployment

1. **Customize Branding**: Update colors and logos in Tailwind config
2. **Add Real API**: Connect to your backend services
3. **Analytics**: Add Google Analytics or similar
4. **Domain**: Configure custom domain in Vercel
5. **Monitoring**: Set up error tracking and performance monitoring

## 🆘 Support

If you encounter any issues:

1. Check the build logs in Vercel dashboard
2. Ensure all dependencies are in `package.json`
3. Verify environment variables are set correctly
4. Check that all imports are using correct paths

---

**Your GameMood AI app is ready to revolutionize gaming wellness! 🎮✨**

Deploy now and start helping gamers find their perfect mood-matched games!