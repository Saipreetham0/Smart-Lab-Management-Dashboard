# Quick Start Guide

Get your Smart Lab Dashboard up and running in 5 minutes!

## Step 1: Install Dependencies

```bash
cd dashboard
npm install
```

This will install all required packages including Next.js, React, Firebase, and charting libraries.

## Step 2: Configure Firebase

The `.env.local` file has been created with your Firebase configuration. You need to add the missing values:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `smart-lab-management-system`
3. Go to Project Settings (gear icon)
4. Scroll to "Your apps" and select or create a Web app
5. Copy these values to `.env.local`:
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`

## Step 3: Update RFID UID (Optional)

If your RFID card UID is different from `f77c7551`, update it in these files:

- [app/page.tsx](app/page.tsx) - Line 18
- [app/monitor/page.tsx](app/monitor/page.tsx) - Line 9
- [app/sessions/page.tsx](app/sessions/page.tsx) - Line 10
- [app/logs/page.tsx](app/logs/page.tsx) - Line 9

Search for `const AUTHORIZED_UID = 'f77c7551'` and replace with your UID.

## Step 4: Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 5: Verify Data

1. Make sure your ESP32 is powered on and connected to WiFi
2. Use your RFID card to log in on the device
3. The dashboard should show:
   - Active session
   - Real-time current and power readings
   - Access log entry

## Troubleshooting

### "No data showing"

Check:
- ESP32 is connected to WiFi (check Serial Monitor)
- Firebase credentials are correct in `.env.local`
- Firebase Realtime Database is accessible

### "Failed to connect to Firebase"

Check:
- All environment variables are set in `.env.local`
- Firebase project ID matches
- Database URL includes the region suffix

### "Module not found" errors

Run:
```bash
rm -rf node_modules package-lock.json
npm install
```

## What's Next?

### Deploy to Production

Deploy your dashboard to Vercel:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Follow the prompts and add your environment variables in the Vercel dashboard.

### Customize the Dashboard

- Change colors in [tailwind.config.ts](tailwind.config.ts)
- Update branding in [components/Sidebar.tsx](components/Sidebar.tsx)
- Modify charts in monitor and sessions pages
- Add more statistics or pages as needed

## Key Features

### Dashboard Home (/)
- Overview of all system stats
- Recent sessions table
- System status indicator

### Real-time Monitor (/monitor)
- Live current and power graphs
- Updates every 5 seconds
- Historical data visualization

### Sessions (/sessions)
- Complete session history
- Energy usage charts
- Filter by status
- Detailed analytics

### Access Logs (/logs)
- All access events
- Search and filter
- Event statistics

## Need Help?

1. Read the full [README.md](README.md)
2. Check Firebase Console for data structure
3. Inspect browser console for errors
4. Verify ESP32 Serial Monitor output

## Success Checklist

- [ ] Dependencies installed
- [ ] Firebase configured in `.env.local`
- [ ] Development server running
- [ ] Dashboard loads at http://localhost:3000
- [ ] Can see sidebar and navigation
- [ ] Data appears from ESP32
- [ ] Charts are rendering
- [ ] Real-time updates working

## Firebase Database Rules

For development, use these rules (Firebase Console → Realtime Database → Rules):

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

**Important**: Update these rules for production to secure your data!

## Common Commands

```bash
# Start development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Install new package
npm install package-name
```

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Recharts Examples](https://recharts.org/en-US/examples)

---

**Congratulations!** Your Smart Lab Dashboard is ready to use. Monitor your lab equipment in real-time with beautiful visualizations and detailed analytics.
