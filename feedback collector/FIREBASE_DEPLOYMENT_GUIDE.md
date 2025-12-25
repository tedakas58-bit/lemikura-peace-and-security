# Firebase Deployment Guide - Customer Satisfaction Dashboard

## Prerequisites

1. **Google Account** (for Firebase Console)
2. **Node.js** installed (you already have this)
3. **Firebase CLI** (we'll install this)

## Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

## Step 2: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"**
3. Project name: `customer-satisfaction-dashboard`
4. Enable Google Analytics (optional)
5. Click **"Create project"**

## Step 3: Initialize Firebase in Your Project

```bash
# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init
```

**During initialization, select:**
- ✅ **Hosting: Configure files for Firebase Hosting**
- Choose **"Use an existing project"**
- Select your `customer-satisfaction-dashboard` project
- **Public directory**: `frontend/dist`
- **Single-page app**: `Yes`
- **Automatic builds with GitHub**: `No` (for now)

## Step 4: Configure Firebase

This will create:
- `firebase.json` (configuration)
- `.firebaserc` (project settings)

## Step 5: Build Your Project

```bash
npm run frontend:build
```

## Step 6: Deploy to Firebase

```bash
firebase deploy
```

## Step 7: Your Live URL

After deployment, you'll get a URL like:
`https://customer-satisfaction-dashboard-xxxxx.web.app`

## Environment Variables Setup

Since Firebase Hosting is static, your environment variables are built into the app during build time. Make sure your `frontend/.env` has:

```
VITE_SUPABASE_URL=https://rrkhgjaabfryowpaepxb.supabase.co
VITE_SUPABASE_ANON_KEY=your_actual_supabase_anon_key
```

## Automatic Deployment (Optional)

Set up GitHub Actions for automatic deployment:

1. In Firebase Console → Project Settings → Service Accounts
2. Generate new private key
3. Add to GitHub Secrets as `FIREBASE_SERVICE_ACCOUNT`
4. Create `.github/workflows/firebase-hosting.yml`

## Commands Reference

```bash
# Build project
npm run frontend:build

# Deploy to Firebase
firebase deploy

# Deploy only hosting
firebase deploy --only hosting

# View deployment history
firebase hosting:sites:list

# Open Firebase Console
firebase open hosting
```

## Advantages of Firebase over Vercel

✅ **Better caching** - More aggressive caching  
✅ **Global CDN** - Google's infrastructure  
✅ **Custom domains** - Easy SSL setup  
✅ **Analytics** - Built-in performance monitoring  
✅ **Reliability** - Google's uptime guarantee  

## Troubleshooting

**Build fails:**
```bash
# Clear cache and rebuild
rm -rf frontend/dist
npm run frontend:build
```

**Deployment fails:**
```bash
# Check Firebase CLI version
firebase --version

# Re-login if needed
firebase logout
firebase login
```

**Environment variables not working:**
- Environment variables are built into the app at build time
- Make sure `frontend/.env` exists with correct values
- Rebuild after changing environment variables

## Your Project Structure After Setup

```
your-project/
├── frontend/
│   ├── dist/          # Built files (deployed to Firebase)
│   ├── src/           # Source code
│   └── .env           # Environment variables
├── firebase.json      # Firebase configuration
├── .firebaserc        # Firebase project settings
└── package.json
```

## Success Checklist

- [ ] Firebase CLI installed
- [ ] Firebase project created
- [ ] Project initialized with `firebase init`
- [ ] Environment variables configured
- [ ] Project builds successfully (`npm run frontend:build`)
- [ ] Deployed to Firebase (`firebase deploy`)
- [ ] Application accessible at Firebase URL
- [ ] Supabase connection working
- [ ] All features functional

Your Customer Satisfaction Dashboard will be live on Firebase with all your latest changes including the updated organization name! 🎉