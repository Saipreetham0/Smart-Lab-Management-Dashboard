# Smart Lab Management System - Dashboard

A modern Next.js dashboard for monitoring and managing your Smart Lab Management System in real-time.

## Features

- **Real-time Monitoring**: Live power consumption, current, and voltage monitoring
- **Session Tracking**: Complete session history with energy usage analytics
- **Access Logs**: Detailed access logs with filtering and search capabilities
- **Interactive Charts**: Visual representations of energy usage and power consumption
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Dark Mode Support**: Automatic dark mode based on system preferences

## Tech Stack

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Firebase Realtime Database**: Real-time data synchronization
- **Recharts**: Beautiful and responsive charts
- **Lucide React**: Modern icon library
- **date-fns**: Date formatting and manipulation

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 18.x or higher
- npm or yarn package manager
- Access to the Firebase project (same one used by ESP32)

## Installation

1. Navigate to the dashboard directory:

```bash
cd dashboard
```

2. Install dependencies:

```bash
npm install
```

3. Create environment file:

```bash
cp .env.local.example .env.local
```

4. Configure environment variables in `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_DATABASE_URL=your-database-url
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### Getting Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `smart-lab-management-system`
3. Click on the gear icon (Settings) > Project settings
4. Scroll down to "Your apps" section
5. Click on the web app (</>) icon or create a new web app
6. Copy the configuration values to your `.env.local` file

## Configuration

### Update User UID

In the following files, update the `AUTHORIZED_UID` constant with your RFID card UID:

- `app/page.tsx`
- `app/monitor/page.tsx`
- `app/sessions/page.tsx`
- `app/logs/page.tsx`

```typescript
const AUTHORIZED_UID = 'f77c7551'; // Replace with your RFID card UID
```

### Customize Motor Voltage

If your motor voltage is different from 12V, you can update the display in:

- `app/monitor/page.tsx` (line with "12.0V")

## Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The dashboard will automatically connect to your Firebase Realtime Database and start displaying data.

## Building for Production

1. Build the production bundle:

```bash
npm run build
```

2. Start the production server:

```bash
npm start
```

## Project Structure

```
dashboard/
├── app/
│   ├── layout.tsx          # Root layout with sidebar and header
│   ├── page.tsx            # Dashboard home page
│   ├── monitor/
│   │   └── page.tsx        # Real-time monitoring page
│   ├── sessions/
│   │   └── page.tsx        # Session history page
│   ├── logs/
│   │   └── page.tsx        # Access logs page
│   └── globals.css         # Global styles
├── components/
│   ├── Sidebar.tsx         # Navigation sidebar
│   ├── Header.tsx          # Top header
│   └── StatsCard.tsx       # Reusable stats card component
├── lib/
│   ├── firebase.ts         # Firebase configuration
│   └── types.ts            # TypeScript type definitions
├── public/                 # Static assets
├── .env.local             # Environment variables (create this)
├── .env.local.example     # Environment template
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript configuration
├── tailwind.config.ts     # Tailwind CSS configuration
└── next.config.mjs        # Next.js configuration
```

## Pages Overview

### Dashboard (/)
- Overview statistics (total sessions, active sessions, energy usage)
- System status indicator
- Recent sessions table
- Real-time updates

### Real-time Monitor (/monitor)
- Live current and power readings
- Interactive line charts showing trends
- Voltage display
- Auto-updating every 5 seconds

### Sessions (/sessions)
- Complete session history
- Energy usage by day chart
- Session status distribution
- Filterable table (all/active/completed)
- Statistics: total sessions, active, energy, avg duration

### Access Logs (/logs)
- All access events (login, logout, denied, auto power off)
- Search functionality
- Filter by action type
- Event statistics
- Timestamp with relative time

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The dashboard can be deployed to any platform that supports Next.js:

- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform
- Self-hosted with Docker

## Troubleshooting

### No data showing

1. Check Firebase Realtime Database rules allow read access
2. Verify `.env.local` has correct Firebase configuration
3. Ensure ESP32 is connected and sending data to Firebase
4. Check browser console for errors

### Firebase connection errors

1. Verify API key and project ID are correct
2. Check if Firebase Realtime Database is enabled
3. Ensure database URL includes the region (e.g., asia-southeast1)

### Charts not displaying

1. Clear browser cache
2. Check if `recharts` is installed: `npm list recharts`
3. Verify data is available in Firebase

## Firebase Database Structure

The dashboard expects data in this format:

```json
{
  "users": {
    "f77c7551": {
      "accessLog": {
        "timestamp_1": {
          "action": "LOGIN",
          "timestamp": "1234567890",
          "userName": "User"
        }
      },
      "sessions": {
        "session_id_1": {
          "startTime": 1234567890,
          "endTime": 1234567900,
          "duration": 300,
          "userName": "User",
          "energyUsed": 12.5,
          "status": "completed",
          "endReason": "manual_logout"
        }
      },
      "currentStatus": {
        "current": 0.5,
        "power": 6.0,
        "status": "active",
        "lastUpdate": 1234567890
      }
    }
  }
}
```

## Security

### Firebase Security Rules

Update your Firebase Realtime Database rules for production:

```json
{
  "rules": {
    "users": {
      ".read": true,
      "$uid": {
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```

For development, you can use:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

**Note**: Change this before deploying to production!

## Customization

### Colors

Edit `tailwind.config.ts` to customize the color scheme:

```typescript
theme: {
  extend: {
    colors: {
      primary: '#your-color',
      secondary: '#your-color',
    },
  },
}
```

### Branding

Update the following files:

- Sidebar logo: `components/Sidebar.tsx`
- Page title: `app/layout.tsx` (metadata)
- Company name: `components/Sidebar.tsx`

## Support

For issues and questions:

1. Check this README
2. Review Firebase Console for data
3. Check browser console for errors
4. Verify ESP32 is sending data correctly

## License

This project is part of the Smart Lab Management System by KSP Electronics.

## Version

- Dashboard Version: 1.0.0
- Last Updated: 2025
- Compatible with ESP32 firmware version: 1.0.0
