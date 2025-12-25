# iAlwaysCare - iPhone Deployment Roadmap

A Next.js PWA that sends daily loving messages to your wife's iPhone.

---

## Overview

Building a PWA for iOS has unique challenges compared to Android. iOS has strict limitations on background tasks and push notifications. This roadmap provides the most practical approach to get your app working on your wife's iPhone.

---

## Phase 1: PWA Setup for iOS

### 1.1 Configure Next.js as a PWA

**Install PWA plugin:**
```bash
npm install next-pwa
```

**Update `next.config.ts`:**
```typescript
import withPWA from 'next-pwa';

const config = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  // iOS-specific settings
  buildExcludes: [/middleware-manifest.json$/],
});

export default config;
```

### 1.2 Create manifest.json

Create `public/manifest.json`:
```json
{
  "name": "iAlwaysCare",
  "short_name": "iAlwaysCare",
  "description": "Daily loving messages from your husband",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#ff6b6b",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### 1.3 Add Apple-specific meta tags

In `app/layout.tsx`, add these meta tags:
```tsx
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />
<meta name="apple-mobile-web-app-title" content="iAlwaysCare" />
<link rel="apple-touch-icon" href="/apple-icon.png" />
```

### 1.4 Create app icons

You'll need:
- `public/icon-192.png` (192x192)
- `public/icon-512.png` (512x512)
- `public/apple-icon.png` (180x180, no transparency)

Use a tool like [PWA Asset Generator](https://www.pwabuilder.com/) or create them manually.

---

## Phase 2: The iOS Notification Challenge

### 2.1 Understanding iOS Limitations

**CRITICAL:** iOS Safari PWAs have severe limitations:
- ❌ No background Service Worker execution
- ❌ No Web Push API support (as of iOS 17)
- ❌ Cannot send notifications when app is closed
- ✅ Can show notifications when app is open
- ✅ Can use local reminders/badges

### 2.2 Workaround Solutions

**Option A: Daily Check-In Approach (Simplest)**
- User opens app once per day
- App shows today's message with a nice animation
- App uses badge on home screen to remind them
- Add a reminder icon if they haven't checked today

**Option B: Web Push Notifications (iOS 16.4+)**
- As of iOS 16.4, Safari supports Web Push API
- Requires HTTPS and proper permissions
- Works ONLY when app is added to home screen
- Still limited compared to native apps

**Option C: Scheduled Local Notifications (Recommended)**
- When user opens app, schedule notifications for upcoming days
- iOS allows scheduling local notifications
- They'll work even when app is closed
- Requires user permission

---

## Phase 3: Implement Daily Messages

### 3.1 Message Data Structure

Create `lib/messages.ts`:
```typescript
export interface Message {
  id: number;
  day: number; // 1-45
  type: 'affirmation' | 'bond' | 'reward';
  text: string;
  rewardDetails?: string; // For claimable rewards
  claimed?: boolean;
  claimedDate?: string;
}

export const messages: Message[] = [
  {
    id: 1,
    day: 1,
    type: 'affirmation',
    text: 'Your message here...',
  },
  // ... 44 more messages
];
```

### 3.2 Track Progress

Use `localStorage` to track:
- Current day (1-45)
- Start date
- Claimed rewards
- Last opened date

Create `lib/storage.ts`:
```typescript
interface AppState {
  startDate: string;
  currentDay: number;
  claimedRewards: number[];
  lastOpened: string;
}

export const getAppState = (): AppState | null => {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem('iAlwaysCare');
  return data ? JSON.parse(data) : null;
};

export const setAppState = (state: AppState) => {
  localStorage.setItem('iAlwaysCare', JSON.stringify(state));
};

export const initializeApp = () => {
  const existing = getAppState();
  if (!existing) {
    setAppState({
      startDate: new Date().toISOString(),
      currentDay: 1,
      claimedRewards: [],
      lastOpened: new Date().toISOString(),
    });
  }
};

export const calculateCurrentDay = (startDate: string): number => {
  const start = new Date(startDate);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - start.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return Math.min(diffDays + 1, 45);
};
```

---

## Phase 4: Build the UI

### 4.1 Main Page Features

Create a beautiful, simple UI:
- **Today's Message:** Large, centered, beautiful typography
- **Day Counter:** "Day X of 45"
- **Reward Button:** If today's message is a reward, show "Claim This Reward" button
- **Past Messages:** Scrollable list to see previous days
- **Animations:** Smooth fade-ins, confetti for rewards

### 4.2 Reward Claiming

When user clicks "Claim":
- Mark reward as claimed with timestamp
- Show celebration animation
- Store in localStorage
- Optionally send you a webhook notification

### 4.3 Suggested Pages

```
/                 - Today's message (main page)
/all-messages     - View all 45 messages (locked future ones)
/claimed-rewards  - List of claimed rewards
/settings         - Notification preferences, reset app
```

---

## Phase 5: Firebase Push Notifications (9 AM Daily)

### 5.1 Firebase Project Setup

**Create Firebase Project:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Name it "iAlwaysCare"
4. Disable Google Analytics (not needed)
5. Create project

**Enable Cloud Messaging:**
1. In Firebase Console, go to Project Settings (gear icon)
2. Click "Cloud Messaging" tab
3. Under "Web Push certificates", click "Generate key pair"
4. Save the VAPID key (you'll need it)

### 5.2 Install Firebase SDK

```bash
npm install firebase
```

### 5.3 Configure Firebase in Your App

Create `lib/firebase.ts`:
```typescript
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging
export const messaging = typeof window !== 'undefined' ? getMessaging(app) : null;

export const requestNotificationPermission = async () => {
  try {
    if (!messaging) return null;
    
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      // Get FCM token
      const token = await getToken(messaging, {
        vapidKey: 'YOUR_VAPID_KEY_FROM_FIREBASE'
      });
      
      console.log('FCM Token:', token);
      // Save this token to your backend/database
      await saveTokenToBackend(token);
      
      return token;
    }
  } catch (error) {
    console.error('Notification permission error:', error);
  }
  return null;
};

const saveTokenToBackend = async (token: string) => {
  // Save to your database or Vercel KV
  await fetch('/api/save-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token })
  });
};

// Handle foreground messages
export const onMessageListener = () =>
  new Promise((resolve) => {
    if (messaging) {
      onMessage(messaging, (payload) => {
        resolve(payload);
      });
    }
  });
```

### 5.4 Create Service Worker for Background Notifications

Create `public/firebase-messaging-sw.js`:
```javascript
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Background Message:', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon-192.png',
    badge: '/badge.png',
    vibrate: [200, 100, 200],
    tag: 'daily-message',
    requireInteraction: true, // Keeps notification visible
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/') // Opens your app
  );
});
```

### 5.5 Register Service Worker

Update `app/layout.tsx` to register the service worker:
```typescript
useEffect(() => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/firebase-messaging-sw.js')
      .then((registration) => {
        console.log('Service Worker registered:', registration);
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  }
}, []);
```

### 5.6 Request Permission on First Load

In your main page component:
```typescript
'use client';
import { useEffect, useState } from 'react';
import { requestNotificationPermission } from '@/lib/firebase';

export default function Home() {
  useEffect(() => {
    // Request permission after a short delay (better UX)
    const timer = setTimeout(() => {
      requestNotificationPermission();
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // ... rest of your component
}
```

### 5.7 Backend: Schedule Daily Notifications

**Option A: Vercel Cron Jobs (Recommended)**

Create `app/api/send-daily-notification/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export async function POST(request: NextRequest) {
  // Verify cron secret to prevent unauthorized calls
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get stored FCM token (from your database/KV)
    const token = await getStoredFCMToken();
    
    // Calculate which day it is
    const startDate = new Date('2025-12-25'); // Christmas!
    const today = new Date();
    const dayNumber = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    // Get today's message
    const message = getMessageForDay(dayNumber);
    
    // Send notification
    await admin.messaging().send({
      token: token,
      notification: {
        title: '💝 iAlwaysCare',
        body: message.preview, // First 50 chars or a teaser
      },
      data: {
        day: dayNumber.toString(),
        fullMessage: message.text,
        type: message.type,
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1,
          },
        },
      },
    });

    return NextResponse.json({ success: true, day: dayNumber });
  } catch (error) {
    console.error('Error sending notification:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

// Helper to get message for specific day
function getMessageForDay(day: number) {
  // Import your messages array
  const messages = [
    { day: 1, text: "Merry Christmas Princess! 🎄❤️", preview: "Merry Christmas Princess! 🎄❤️", type: 'affirmation' },
    // ... rest of your 45 messages
  ];
  
  return messages.find(m => m.day === day) || messages[0];
}

async function getStoredFCMToken() {
  // Retrieve from Vercel KV, Postgres, or even a JSON file
  // For simplicity, you could use Vercel KV:
  // const { kv } = await import('@vercel/kv');
  // return await kv.get('fcm-token');
  
  // Or for a single-user app, just use an environment variable:
  return process.env.FCM_TOKEN;
}
```

**Configure Vercel Cron:**

Create `vercel.json` in your project root:
```json
{
  "crons": [
    {
      "path": "/api/send-daily-notification",
      "schedule": "0 9 * * *"
    }
  ]
}
```

This runs every day at 9:00 AM UTC. Adjust for her timezone:
- **EST (UTC-5):** `"0 14 * * *"` (9 AM EST = 2 PM UTC)
- **PST (UTC-8):** `"0 17 * * *"` (9 AM PST = 5 PM UTC)
- **CST (UTC-6):** `"0 15 * * *"` (9 AM CST = 3 PM UTC)

Add environment variables in Vercel dashboard:
- `CRON_SECRET` (generate a random string)
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `FCM_TOKEN` (you'll get this after she grants permission)

**Option B: GitHub Actions (Free Alternative)**

Create `.github/workflows/daily-notification.yml`:
```yaml
name: Send Daily Notification

on:
  schedule:
    - cron: '0 14 * * *' # 9 AM EST
  workflow_dispatch: # Allows manual trigger

jobs:
  send-notification:
    runs-on: ubuntu-latest
    steps:
      - name: Send Notification
        run: |
          curl -X POST https://your-app.vercel.app/api/send-daily-notification \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```

### 5.8 Special Christmas Morning Setup

**The Night Before (Christmas Eve):**

1. **Get FCM Token:**
   - Open the app on her iPhone (Safari)
   - Add to home screen
   - Grant notification permission
   - Check browser console for "FCM Token: ..."
   - Copy this token

2. **Save Token:**
   - Add to Vercel environment variables as `FCM_TOKEN`
   - Or save to your database

3. **Test Notification:**
   Create a test endpoint `/api/test-notification` to verify it works

4. **Set Start Date:**
   In your code, set `startDate = '2025-12-25T00:00:00'`

**Christmas Morning:**
- At 9:00 AM, she'll receive: "💝 iAlwaysCare - Merry Christmas Princess! 🎄❤️"
- When she taps it, the app opens with the full message

### 5.9 Testing Before Christmas

**Test the notification flow:**

```bash
# Send a test notification using curl
curl -X POST https://your-app.vercel.app/api/send-daily-notification \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

Or create a simple test page at `/test-notifications`:
```typescript
export default function TestPage() {
  const sendTest = async () => {
    const response = await fetch('/api/send-daily-notification', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET}`
      }
    });
    alert('Check your phone!');
  };
  
  return <button onClick={sendTest}>Send Test Notification</button>;
}
```

### 5.10 Troubleshooting iOS Notifications

**Common Issues:**

1. **Notifications don't appear:**
   - ✅ App must be added to home screen (not just Safari bookmark)
   - ✅ User must grant notification permission
   - ✅ Check iOS Settings → iAlwaysCare → Notifications (enabled?)
   - ✅ Verify VAPID key is correct
   - ✅ Service worker must be registered

2. **Wrong timezone:**
   - Adjust cron schedule for her timezone
   - Remember Vercel cron runs in UTC

3. **Token expires:**
   - FCM tokens can expire or change
   - Implement token refresh in your app
   - Catch errors and request new token

**iOS-Specific Settings:**
- Sound must be `"default"` (custom sounds don't work for PWAs)
- Badge notifications work well on iOS
- Use `requireInteraction: true` to keep notification visible

---

## Phase 6: Deployment

### 6.1 Deploy to Vercel (Recommended)

**Why Vercel:**
- Built by Next.js creators
- Free tier perfect for this
- Automatic HTTPS (required for iOS PWA)
- Easy deployment

**Steps:**
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Deploy (takes ~2 minutes)
5. You'll get a URL like `i-always-care.vercel.app`

**Custom Domain (Optional):**
- Buy a domain like `ialwayscare.app` from Vercel or Namecheap
- Add to Vercel project
- Makes it more special: `ialwayscare.app`

### 6.2 Alternative: Netlify

Similar to Vercel:
```bash
npm install -g netlify-cli
netlify deploy --prod
```

---

## Phase 7: Installing on Her iPhone

### 7.1 Prerequisites

- iPhone with iOS 16.4+ (for best PWA support)
- Safari browser (required)
- Internet connection

### 7.2 Installation Steps

**For You (Before Gifting):**
1. Open Safari on her iPhone
2. Navigate to your deployed URL
3. Tap the Share button (square with arrow)
4. Scroll and tap "Add to Home Screen"
5. Name it "iAlwaysCare"
6. Tap "Add"
7. The app icon appears on home screen

**For Her (Gifting Experience):**
- Option 1: Pre-install it before giving her the phone
- Option 2: Create a beautiful card with QR code and instructions
- Option 3: Install it together as part of the gift reveal

### 7.3 Testing Before Gifting

**Critical Tests:**
1. ✅ App opens from home screen
2. ✅ Runs in fullscreen (no Safari UI)
3. ✅ Today's message displays correctly
4. ✅ Day counter is accurate
5. ✅ Rewards can be claimed
6. ✅ Notifications work (if enabled)
7. ✅ Works offline (basic functionality)

---

## Phase 8: Advanced Features (Optional)

### 8.1 Webhook Notifications to You

When she claims a reward, send you a notification:

```typescript
const notifyYou = async (reward: string) => {
  await fetch('YOUR_WEBHOOK_URL', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: `She claimed: ${reward}`,
      timestamp: new Date().toISOString(),
    }),
  });
};
```

Use services like:
- Discord webhook
- Telegram bot
- Email via SendGrid/Resend
- SMS via Twilio

### 8.2 Admin Panel

Create a secret admin page (`/admin?key=YOUR_SECRET`) where you can:
- See which rewards she's claimed
- Update messages remotely (using a backend)
- Add bonus messages

### 8.3 Offline Support

Make sure the app works without internet:
- Service worker caches all assets
- Messages stored in code/localStorage
- Gracefully handle offline reward claims

### 8.4 Animations & Polish

- **Confetti:** Use `canvas-confetti` package
- **Smooth Transitions:** Framer Motion
- **Beautiful Typography:** Use web fonts
- **Theme:** Warm colors (pinks, reds, golds)
- **Sound:** Optional gentle chime when opening daily message

---

## Technical Architecture Summary

```
┌─────────────────────────────────────┐
│         iPhone Home Screen          │
│              (PWA Icon)             │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│        Next.js App (Vercel)         │
│  ┌─────────────────────────────┐   │
│  │    Daily Message Display    │   │
│  │  - Calculate current day     │   │
│  │  - Show message              │   │
│  │  - Reward claiming           │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │    Local Storage            │   │
│  │  - Start date               │   │
│  │  - Claimed rewards          │   │
│  │  - User progress            │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │   Service Worker (PWA)      │   │
│  │  - Offline caching          │   │
│  │  - Install prompt           │   │
│  │  - (Limited notifications)  │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│     Optional: Webhook to You        │
│  (When rewards are claimed)         │
└─────────────────────────────────────┘
```

---

## Realistic Expectations for iOS

### What Works Well ✅
- Beautiful, native-feeling app experience
- Reliable daily message display
- Reward tracking and claiming
- Offline functionality
- Installable to home screen
- Full-screen experience

### iOS Limitations ⚠️
- Push notifications are limited (she needs to add to home screen for any notification support)
- Can't send automatic daily notifications while app is closed (without workarounds)
- No background sync like Android
- Must open Safari specifically (not Chrome/Firefox on iOS)

### Recommended Approach 🎯
**Focus on the experience when she opens the app, not automatic notifications.**

Make opening the app a delightful daily ritual:
- Beautiful animations
- Thoughtful messages
- Exciting reward reveals
- Progress tracking
- Maybe add a widget reminder

Many couples use apps like this as a morning ritual - she'll naturally want to open it daily to see your message.

---

## Timeline Estimate

- **Phase 1-3 (Core Setup):** 4-6 hours
- **Phase 4 (UI/UX):** 6-8 hours
- **Phase 5 (Firebase Push Notifications):** 4-6 hours
- **Phase 6 (Deployment):** 1 hour
- **Phase 7 (Testing & Christmas Eve Setup):** 3-4 hours
- **Phase 8 (Polish):** 4-6 hours

**Total:** ~22-35 hours for a polished app with push notifications

**Christmas Eve Checklist (Critical!):**
- [ ] Deploy final version to Vercel
- [ ] Get her phone after she's asleep
- [ ] Open Safari and go to your app URL
- [ ] Add to home screen as "iAlwaysCare"
- [ ] Grant notification permission
- [ ] Copy FCM token from console (F12 → Console)
- [ ] Add FCM token to Vercel environment variables
- [ ] Send test notification to verify it works
- [ ] Close app, put phone back
- [ ] Set alarm for yourself to verify 9 AM notification works
- [ ] 🎄 Wait for Christmas morning magic!

---

## Quick Start Checklist

**Phase 1-2: Foundation**
- [ ] Set up Next.js PWA configuration
- [ ] Create app icons (192x192, 512x512, 180x180)
- [ ] Set up Firebase project
- [ ] Get VAPID key from Firebase
- [ ] Install Firebase SDK

**Phase 3-4: Core App**
- [ ] Write all 45 messages in `messages.ts`
- [ ] Build main message display page
- [ ] Implement day calculation logic (starts Dec 25)
- [ ] Add localStorage for progress tracking
- [ ] Create reward claiming functionality
- [ ] Set up past messages view

**Phase 5: Push Notifications**
- [ ] Create Firebase config file
- [ ] Create service worker for background notifications
- [ ] Build notification permission flow
- [ ] Create `/api/send-daily-notification` endpoint
- [ ] Set up Vercel cron job (9 AM her timezone)
- [ ] Add Firebase Admin credentials to Vercel

**Phase 6-7: Deployment & Testing**
- [ ] Deploy to Vercel
- [ ] Test on iPhone (Safari only!)
- [ ] Verify "Add to Home Screen" works
- [ ] Test notification permission flow
- [ ] Send test notification from API
- [ ] Verify notification appears on locked screen
- [ ] Test reward claiming
- [ ] Verify offline functionality

**Phase 8: Polish**
- [ ] Add animations (confetti for rewards!)
- [ ] Style with warm, loving colors
- [ ] Add sound/haptics (optional)
- [ ] Test all 3 message types display correctly
- [ ] Final design polish

**Christmas Eve (CRITICAL!):**
- [ ] Deploy final production build
- [ ] Wait until she's asleep 😴
- [ ] Take her phone
- [ ] Open Safari → your app URL
- [ ] Add to Home Screen
- [ ] Grant notification permission
- [ ] Copy FCM token from browser console
- [ ] Add FCM_TOKEN to Vercel environment
- [ ] Send test notification
- [ ] Verify it arrives on her phone
- [ ] Return phone to bedside
- [ ] Double-check cron job is set for 9 AM
- [ ] 🎁 Give to your wife (or let her discover it!)

---

## Emergency Christmas Morning Troubleshooting

If notification doesn't arrive at 9 AM:

1. **Manual trigger:** Go to `/api/send-daily-notification` and call it manually
2. **Check Vercel logs:** See if cron job ran
3. **Verify timezone:** Make sure cron is configured for her local time
4. **Token check:** Confirm FCM_TOKEN env var is set correctly
5. **Backup plan:** If all else fails, send a text saying "Check the new app on your home screen ❤️"

---

## Resources

- [Next.js PWA Guide](https://github.com/shadowwalker/next-pwa)
- [iOS PWA Support](https://developer.apple.com/documentation/webkit/configuring_your_app)
- [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)
- [Firebase Admin SDK Setup](https://firebase.google.com/docs/admin/setup)
- [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)
- [Web App Manifest](https://web.dev/add-manifest/)
- [PWA Builder](https://www.pwabuilder.com/) - Icon generator
- [Vercel Deployment](https://vercel.com/docs)
- [iOS Web Push](https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/)
- [Testing FCM Notifications](https://firebase.google.com/docs/cloud-messaging/js/client)

---

## The Most Important Part ❤️

This is an incredibly thoughtful gift. Your wife will treasure not just the technology, but the time, care, and love you put into creating 45 personalized messages for her. Focus on making each message meaningful - the technical implementation is secondary to the love you're expressing.

Good luck, and Merry Christmas! 🎄