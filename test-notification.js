const fs = require('fs');
const path = require('path');

// Read FCM token from .env.local
const envContent = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');
const fcmTokenMatch = envContent.match(/FCM_TOKEN=(.+)/);
const fcmToken = fcmTokenMatch ? fcmTokenMatch[1].trim() : null;

if (!fcmToken) {
  console.error('❌ FCM_TOKEN not found in .env.local');
  process.exit(1);
}

console.log('🔔 Testing notification...');
console.log('Token:', fcmToken.substring(0, 20) + '...');

fetch('http://localhost:3000/api/send-notification', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    token: fcmToken,
    title: 'Test Notification 💕',
    body: 'This is a test notification from iAlwaysCare!'
  })
})
  .then(res => res.json())
  .then(data => {
    console.log('\n✅ Response:', data);
    if (data.success) {
      console.log('\n🎉 Notification sent successfully!');
      console.log('Check your browser for the notification.');
    } else {
      console.log('\n❌ Failed to send notification');
    }
  })
  .catch(err => {
    console.error('\n❌ Error:', err.message);
  });
