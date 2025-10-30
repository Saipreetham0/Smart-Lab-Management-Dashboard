# Deployment Guide

## Environment Variables Setup for Vercel

To deploy this application to Vercel, you need to configure the following environment variables in your Vercel project settings:

### Required Environment Variables

Go to your Vercel project settings → Environment Variables and add the following:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyATNIR6WmGBaqJFdTWCfRb-j76uJ16ECLc
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=smart-lab-management-system.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://smart-lab-management-system-default-rtdb.asia-southeast1.firebasedatabase.app
NEXT_PUBLIC_FIREBASE_PROJECT_ID=smart-lab-management-system
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=smart-lab-management-system.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### Steps to Add Environment Variables in Vercel:

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project
3. Click on "Settings" tab
4. Click on "Environment Variables" in the left sidebar
5. Add each environment variable listed above
6. Make sure to add them for all environments (Production, Preview, and Development)
7. After adding all variables, redeploy your application

### Important Notes:

- The `NEXT_PUBLIC_` prefix is required for environment variables that need to be available in the browser
- Make sure to replace `your-sender-id` and `your-app-id` with your actual Firebase values from the Firebase Console
- These variables are required during the build process, not just at runtime
- Without these variables properly configured, the build will fail with a Firebase initialization error

### Getting Your Firebase Configuration:

1. Go to Firebase Console: https://console.firebase.google.com
2. Select your project: `smart-lab-management-system`
3. Click on the gear icon (Project Settings)
4. Scroll down to "Your apps" section
5. Select your web app or create one if needed
6. Copy the configuration values (apiKey, authDomain, etc.)
7. Use these values for your environment variables

### Local Development:

For local development, create a `.env.local` file in the root directory with the same variables. You can copy from `.env.local.example`:

```bash
cp .env.local.example .env.local
```

Then update the values in `.env.local` with your actual Firebase configuration.
