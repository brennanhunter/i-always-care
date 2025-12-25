# Environment Variables

After deploying to Vercel, you need to add these environment variables:

## Required Variables

1. **FIREBASE_SERVICE_ACCOUNT**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project (ialwayscare-560a9)
   - Click ⚙️ → Project Settings
   - Go to "Service accounts" tab
   - Click "Generate new private key"
   - Download the JSON file
   - Copy the ENTIRE contents of the JSON file
   - Add to Vercel: `FIREBASE_SERVICE_ACCOUNT=paste_entire_json_here`
   - **IMPORTANT**: Paste as a single line (remove line breaks) or Vercel will have issues

2. **FCM_TOKEN**
   - After your wife installs the app and grants notification permission
   - Check the browser console for "FCM Token: ..."
   - Copy that token
   - Add to Vercel: `FCM_TOKEN=the_token_from_console`

3. **CRON_SECRET**
   - Generate a random string (e.g., use password generator)
   - Add to Vercel: `CRON_SECRET=your_random_secret_string`

4. **NEXT_PUBLIC_APP_URL**
   - Your deployed Vercel URL
   - Add to Vercel: `NEXT_PUBLIC_APP_URL=https://your-app.vercel.app`

## How to Add to Vercel

1. Go to your Vercel project dashboard
2. Click "Settings" tab
3. Click "Environment Variables" in sidebar
4. Add each variable with its value
5. Click "Save"
6. Redeploy your app for changes to take effect

## Testing Notifications

After setup, you can test by calling:
```
curl https://your-app.vercel.app/api/cron \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```
