# Dashboard Features Documentation

## Overview

The Smart Lab Management Dashboard is a comprehensive real-time monitoring solution built with Next.js 15, TypeScript, and Firebase Realtime Database.

## Core Features

### 1. Real-time Data Synchronization

- **Firebase Integration**: Seamless connection to Firebase Realtime Database
- **Live Updates**: Data updates automatically without page refresh
- **WebSocket Connection**: Maintains persistent connection for instant updates
- **Automatic Reconnection**: Handles network interruptions gracefully

### 2. Dashboard Home Page

**Location**: `/`

**Features**:
- **System Overview Cards**:
  - Total Sessions count
  - Active Sessions indicator
  - Total Energy consumption (Wh)
  - Current Power usage (W)

- **System Status Banner**:
  - Real-time status (Active/Idle)
  - Last update timestamp
  - Visual indicators with color coding

- **Recent Sessions Table**:
  - Last 5 sessions display
  - User information
  - Session duration
  - Energy consumption
  - Status badges (active/completed)

**Technical Details**:
- Uses `onValue()` from Firebase for real-time updates
- Calculates statistics from Firebase data
- Formats dates using `date-fns`
- Responsive grid layout with Tailwind CSS

### 3. Real-time Monitor Page

**Location**: `/monitor`

**Features**:
- **Live Metrics Display**:
  - Current (A) with 3 decimal precision
  - Power (W) with 2 decimal precision
  - Voltage display (12V DC)
  - Large, easy-to-read numbers

- **Interactive Charts**:
  - Current over time (line chart)
  - Power over time (line chart)
  - Last 20 data points displayed
  - Auto-updating every 5 seconds

- **Status Indicator**:
  - Animated pulse for active systems
  - Color-coded status banner
  - Last update timestamp

- **Formula Reference**:
  - Power calculation explanation
  - Educational display for users

**Technical Details**:
- Uses Recharts for data visualization
- Maintains rolling buffer of 20 data points
- Real-time chart updates
- Responsive charts that adapt to screen size

### 4. Sessions History Page

**Location**: `/sessions`

**Features**:
- **Statistics Cards**:
  - Total sessions count
  - Active sessions
  - Total energy consumed
  - Average session duration

- **Data Visualizations**:
  - Energy usage by day (bar chart)
  - Session status distribution (pie chart)
  - Last 7 days of data

- **Filtering System**:
  - View all sessions
  - Filter by active sessions
  - Filter by completed sessions
  - Tab-based navigation

- **Detailed Sessions Table**:
  - User information
  - Start and end times
  - Duration in minutes and seconds
  - Energy consumption
  - Status badges
  - End reason (manual logout, idle timeout, etc.)

**Technical Details**:
- Aggregates data for analytics
- Calculates averages and totals
- Sorts by most recent first
- Color-coded status indicators

### 5. Access Logs Page

**Location**: `/logs`

**Features**:
- **Event Statistics**:
  - Total events count
  - Login attempts
  - Logout events
  - Denied access attempts
  - Auto power-off events

- **Search Functionality**:
  - Search by username
  - Search by action type
  - Real-time search results

- **Filtering System**:
  - Filter by action type
  - Dropdown selector
  - Combined with search

- **Event Display**:
  - Action icons for visual recognition
  - Color-coded badges
  - Timestamp with date/time
  - Relative time ("2 hours ago")
  - Hover effects for better UX

**Technical Details**:
- Uses Lucide React for icons
- Implements client-side filtering
- Formats timestamps with date-fns
- Responsive table design

## UI/UX Features

### Design System

- **Dark Mode Support**: Automatic dark mode based on system preferences
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Color Scheme**:
  - Yellow (#EAB308) - Primary accent
  - Green (#10B981) - Success/Active
  - Red (#EF4444) - Error/Denied
  - Blue (#3B82F6) - Info/Logout
  - Gray scale for backgrounds

### Navigation

- **Sidebar Navigation**:
  - Fixed sidebar on desktop
  - Icons with labels
  - Active state highlighting
  - Company branding
  - User profile section

- **Header**:
  - Search bar (prepared for future features)
  - Notifications bell icon
  - Mobile menu toggle

### Components

**Reusable Components**:

1. **StatsCard**:
   - Icon with customizable color
   - Title and value display
   - Optional description
   - Optional trend indicator
   - Responsive sizing

2. **Sidebar**:
   - Logo and branding
   - Navigation links
   - Active route highlighting
   - Profile section

3. **Header**:
   - Search functionality
   - Notification center
   - Mobile responsive

## Data Management

### Firebase Integration

**Connection**:
```typescript
database: Firebase Realtime Database
endpoint: https://smart-lab-management-system-default-rtdb.asia-southeast1.firebasedatabase.app
```

**Data Structure**:
```
users/
  └── {RFID_UID}/
      ├── accessLog/
      ├── sessions/
      └── currentStatus/
```

**Real-time Listeners**:
- Dashboard: `users/{uid}`
- Monitor: `users/{uid}/currentStatus`
- Sessions: `users/{uid}/sessions`
- Logs: `users/{uid}/accessLog`

### Type Safety

**TypeScript Interfaces**:
- `AccessLog`: Access event structure
- `Session`: Session data structure
- `CurrentStatus`: Real-time status
- `UserData`: Complete user data
- `DashboardStats`: Calculated statistics

## Performance Features

### Optimization

- **Code Splitting**: Automatic with Next.js App Router
- **Lazy Loading**: Components load on demand
- **Efficient Re-renders**: React hooks optimization
- **Data Caching**: Firebase local persistence

### Best Practices

- **TypeScript**: Full type safety
- **ESLint**: Code quality checks
- **Component Isolation**: Reusable components
- **Error Handling**: Graceful error states
- **Loading States**: User feedback during data fetch

## Security Features

### Environment Variables

- All sensitive data in `.env.local`
- Not committed to version control
- Separate config for production

### Firebase Security

- Read/Write rules configuration
- Authentication ready (for future)
- Secure database access

## Browser Support

**Tested Browsers**:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Mobile Support**:
- iOS Safari 14+
- Chrome Mobile
- Samsung Internet

## Accessibility

- **Semantic HTML**: Proper heading hierarchy
- **ARIA Labels**: Screen reader support
- **Keyboard Navigation**: Full keyboard support
- **Color Contrast**: WCAG AA compliant
- **Focus Indicators**: Clear focus states

## Charts and Visualizations

### Recharts Integration

**Chart Types Used**:
1. **Line Charts**: Current and power over time
2. **Bar Charts**: Energy usage by day
3. **Pie Charts**: Session status distribution

**Features**:
- Responsive sizing
- Dark mode support
- Tooltips on hover
- Legend display
- Custom colors
- Grid lines
- Axis labels

## Future Enhancement Possibilities

### Phase 2 Features
- User authentication
- Multiple device support
- Email notifications
- PDF report generation
- Data export (CSV, Excel)
- Advanced analytics
- Predictive maintenance
- Cost calculations
- Booking system
- Mobile app

### Technical Improvements
- Server-side rendering for better SEO
- Progressive Web App (PWA)
- Offline support
- Push notifications
- WebSocket direct connection
- GraphQL integration
- Advanced caching strategies

## Development Workflow

### Local Development
```bash
npm run dev       # Start dev server
npm run build     # Build for production
npm start         # Start production server
npm run lint      # Run ESLint
```

### File Structure
```
dashboard/
├── app/              # Next.js App Router pages
├── components/       # Reusable React components
├── lib/             # Utilities and configurations
├── public/          # Static assets
└── types/           # TypeScript definitions
```

## Deployment Options

### Supported Platforms
- **Vercel**: One-click deployment (recommended)
- **Netlify**: Static hosting
- **AWS Amplify**: Full-stack hosting
- **Railway**: Container deployment
- **Self-hosted**: Docker or traditional hosting

### Environment Setup
- Set environment variables in platform
- Configure custom domain (optional)
- Enable HTTPS (automatic on most platforms)
- Configure build settings

## Monitoring and Analytics

### Built-in Metrics
- Firebase Analytics ready
- Performance monitoring
- Error tracking setup
- User activity logging

### Custom Events
- Page views
- Session interactions
- Filter usage
- Search queries
- Chart interactions

## Documentation

### Available Docs
- **README.md**: Full documentation
- **QUICKSTART.md**: 5-minute setup guide
- **FEATURES.md**: This document
- Code comments throughout

## Support and Maintenance

### Updating Dependencies
```bash
npm outdated        # Check for updates
npm update         # Update packages
npm audit          # Security audit
npm audit fix      # Fix vulnerabilities
```

### Troubleshooting
- Check browser console
- Verify Firebase connection
- Review environment variables
- Check ESP32 data output
- Validate database structure

---

**Version**: 1.0.0
**Last Updated**: 2025
**Maintained by**: KSP Electronics Team
