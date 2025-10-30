# Dashboard Setup Checklist

Use this checklist to ensure everything is set up correctly.

## ✅ Installation (Completed)

- [x] Next.js project structure created
- [x] All dependencies installed (549 packages)
- [x] TypeScript configured
- [x] Tailwind CSS configured
- [x] ESLint configured
- [x] All components created
- [x] All pages created
- [x] Firebase library configured
- [x] Documentation written

## 🔧 Configuration (You Need to Complete)

### Firebase Configuration

- [ ] Open [Firebase Console](https://console.firebase.google.com/)
- [ ] Go to Project Settings
- [ ] Copy Messaging Sender ID
- [ ] Copy App ID
- [ ] Update `dashboard/.env.local` with these values:
  ```
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-value-here
  NEXT_PUBLIC_FIREBASE_APP_ID=your-value-here
  ```

### RFID UID Configuration (if needed)

Current UID is set to: `f77c7551`

If your RFID card has a different UID, update it in these files:

- [ ] [dashboard/app/page.tsx](app/page.tsx) - Line 18
- [ ] [dashboard/app/monitor/page.tsx](app/monitor/page.tsx) - Line 9
- [ ] [dashboard/app/sessions/page.tsx](app/sessions/page.tsx) - Line 10
- [ ] [dashboard/app/logs/page.tsx](app/logs/page.tsx) - Line 9

## 🚀 Testing

### 1. Start Development Server

```bash
cd dashboard
npm run dev
```

Expected output:
```
▲ Next.js 15.0.0
- Local:        http://localhost:3000
- Ready in Xms
```

- [ ] Development server starts successfully
- [ ] No error messages in terminal
- [ ] Port 3000 is available

### 2. Browser Testing

Open http://localhost:3000

**Dashboard Home Page (/)**
- [ ] Page loads without errors
- [ ] Sidebar is visible with navigation
- [ ] Stats cards are displayed
- [ ] Recent sessions table appears
- [ ] Loading spinner appears initially
- [ ] Check browser console for errors

**Real-time Monitor (/monitor)**
- [ ] Navigate to monitor page
- [ ] Current and power metrics display
- [ ] Charts render correctly
- [ ] Status banner shows
- [ ] No console errors

**Sessions Page (/sessions)**
- [ ] Navigate to sessions page
- [ ] Statistics cards display
- [ ] Charts render (bar and pie)
- [ ] Filter tabs work
- [ ] Table displays sessions

**Access Logs Page (/logs)**
- [ ] Navigate to logs page
- [ ] Statistics cards show
- [ ] Search box works
- [ ] Filter dropdown works
- [ ] Table displays log entries

### 3. Responsive Testing

- [ ] Dashboard works on desktop (1920x1080)
- [ ] Dashboard works on tablet (768px width)
- [ ] Dashboard works on mobile (375px width)
- [ ] Sidebar collapses on mobile
- [ ] Tables are scrollable on small screens

### 4. Dark Mode Testing

- [ ] Change system to dark mode
- [ ] Dashboard switches to dark theme
- [ ] All text is readable
- [ ] Charts render correctly in dark mode

## 🔥 Firebase Testing

### Database Rules Setup

- [ ] Go to Firebase Console → Realtime Database
- [ ] Click on "Rules" tab
- [ ] Set rules for testing:
  ```json
  {
    "rules": {
      ".read": true,
      ".write": true
    }
  }
  ```
- [ ] Click "Publish"

**⚠️ Important**: Change these rules before production!

### Data Verification

- [ ] Firebase Realtime Database is accessible
- [ ] Database URL is correct
- [ ] Check if data exists at path: `users/f77c7551/`
- [ ] If no data yet, that's okay - ESP32 will create it

## 🎮 ESP32 Integration Testing

### Before Testing
- [ ] ESP32 is powered on
- [ ] ESP32 connected to WiFi (check Serial Monitor)
- [ ] ESP32 successfully connected to Firebase
- [ ] Dashboard is running on http://localhost:3000

### Test Login
1. [ ] Scan authorized RFID card on ESP32
2. [ ] Check ESP32 Serial Monitor shows "Power ON"
3. [ ] Refresh dashboard
4. [ ] Verify in Dashboard Home:
   - Active sessions count increased
   - Recent sessions table shows new entry
5. [ ] Go to Monitor page:
   - Current reading displays
   - Power reading displays
   - Charts start showing data
6. [ ] Go to Logs page:
   - New LOGIN entry appears

### Test Real-time Updates
1. [ ] Keep dashboard open
2. [ ] Connect a load to ESP32 relay
3. [ ] Watch Monitor page (don't refresh)
4. [ ] Verify:
   - Current value updates automatically
   - Power value updates automatically
   - Charts update in real-time

### Test Logout
1. [ ] Scan RFID card again on ESP32
2. [ ] Check Serial Monitor shows "Power OFF"
3. [ ] Go to Logs page
4. [ ] Verify new LOGOUT entry appears
5. [ ] Go to Sessions page
6. [ ] Verify session shows "completed" status

### Test Auto Power-off
1. [ ] Scan RFID card to login
2. [ ] Wait 15+ seconds without any load
3. [ ] ESP32 should auto power-off
4. [ ] Check Logs page for AUTO_POWEROFF entry
5. [ ] Check Sessions page for completed session

## 📱 Feature Checklist

### Real-time Features
- [ ] Data updates without page refresh
- [ ] Charts animate with new data
- [ ] Status indicators change in real-time
- [ ] Timestamps update automatically

### Navigation
- [ ] All sidebar links work
- [ ] Active page is highlighted
- [ ] Back button works correctly
- [ ] URLs are correct

### Data Display
- [ ] Numbers format correctly (2-3 decimals)
- [ ] Dates/times format properly
- [ ] Tables are sortable/readable
- [ ] Charts have legends and labels

### Search and Filter
- [ ] Search in logs works
- [ ] Filter by action type works
- [ ] Session filter tabs work
- [ ] Results update immediately

## 🚢 Production Checklist (When Ready)

### Security
- [ ] Update Firebase rules for production:
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
- [ ] Environment variables not committed to git
- [ ] `.env.local` in `.gitignore`

### Performance
- [ ] Run `npm run build` successfully
- [ ] No build errors or warnings
- [ ] Lighthouse score checked
- [ ] Images optimized (if any added)

### Deployment
- [ ] Choose deployment platform
- [ ] Set environment variables in platform
- [ ] Deploy successfully
- [ ] Test production URL
- [ ] Custom domain configured (optional)

## 📊 Success Criteria

Your dashboard is ready when:

- [x] All dependencies installed
- [ ] Firebase configured with correct credentials
- [ ] Development server runs without errors
- [ ] All 4 pages load correctly
- [ ] Charts render properly
- [ ] Real-time updates work
- [ ] ESP32 data appears in dashboard
- [ ] No console errors
- [ ] Responsive on all devices
- [ ] Dark mode works

## 🆘 Troubleshooting

### Common Issues

**"Module not found" errors**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Firebase connection errors**
- Verify `.env.local` has all variables
- Check Firebase console for correct values
- Ensure database URL includes region

**No data showing**
- Check ESP32 Serial Monitor
- Verify ESP32 connected to WiFi
- Check ESP32 connected to Firebase
- Verify Firebase database has data
- Check browser console for errors

**Charts not rendering**
```bash
npm list recharts
# Should show recharts@2.12.0 or similar
```

**Port 3000 already in use**
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

## 📝 Notes

- Keep this checklist until everything is working
- Mark items as you complete them
- If stuck, check browser console first
- Refer to README.md for detailed help

## ✅ Final Verification

Once everything above is checked:

- [ ] Dashboard loads and shows data
- [ ] All pages work correctly
- [ ] Real-time updates function
- [ ] ESP32 integration works
- [ ] Ready for demonstration
- [ ] Ready for mini project presentation

---

**Last Updated**: 2025-10-26
**Project**: Smart Lab Management System Dashboard
**Status**: Ready for Configuration and Testing
