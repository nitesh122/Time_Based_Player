# Vercel Deployment Guide

This guide will help you deploy the Time-Based Music Player to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Push your code to GitHub
3. **Supabase Project**: Ensure your Supabase database is set up and accessible

## Deployment Steps

### 1. Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will automatically detect the configuration from `vercel.json`

### 2. Configure Environment Variables

In your Vercel project dashboard, go to **Settings > Environment Variables** and add:

#### Production Environment Variables
```
NODE_ENV=production
SUPABASE_URL=your-supabase-project-url
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
DB_PROVIDER=postgres
CORS_ORIGIN=https://your-vercel-app.vercel.app
```

#### Frontend Environment Variables
```
REACT_APP_API_URL=https://your-vercel-app.vercel.app/api
REACT_APP_NAME=Time-Based Music Player
REACT_APP_VERSION=1.0.0
```

**Important**: Replace `your-vercel-app` with your actual Vercel app domain.

### 3. Deploy

1. Click "Deploy" in Vercel
2. Wait for the build to complete
3. Your app will be available at `https://your-project-name.vercel.app`

## Project Structure

```
Time_Based_Player/
├── vercel.json              # Vercel configuration
├── package.json             # Root package.json for monorepo
├── .env.example            # Environment variables template
├── frontend/               # React frontend
│   ├── package.json
│   └── build/             # Built frontend (generated)
├── backend/               # Node.js API
│   ├── package.json
│   └── src/index.js       # API entry point
└── DEPLOYMENT.md          # This file
```

## How It Works

- **Frontend**: Built as a static site and served from `/`
- **Backend**: Deployed as serverless functions at `/api/*`
- **Database**: Connects to your existing Supabase instance
- **Routing**: Configured in `vercel.json` to handle both frontend and API routes

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure `CORS_ORIGIN` matches your Vercel domain
2. **API Not Found**: Check that API routes start with `/api/`
3. **Build Failures**: Ensure all dependencies are listed in package.json files
4. **Database Connection**: Verify Supabase environment variables are correct

### Logs and Debugging

- View deployment logs in Vercel dashboard
- Check function logs for API errors
- Use Vercel CLI for local testing: `vercel dev`

## Post-Deployment

1. Test all API endpoints
2. Verify time-based playlist switching works
3. Check that background images load correctly
4. Test music playback functionality

## Updates

To update your deployment:
1. Push changes to your GitHub repository
2. Vercel will automatically redeploy
3. Monitor the deployment in your Vercel dashboard
