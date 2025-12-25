const fetch = require('node-fetch');

// Test notification at specific time
const testNotification = async () => {
  const fcmToken = 'd6WPPnRXlh9wKzFPNfg4E0:APA91bEK38H5HEGBTSOQ71y5hruFzCr_U6HU8hEaXvy9egFMEcjVzvPu6Hb_Zi8XA9hil8jvnvqrRtyiG4a3fwvEMeBUnmGkS6bjJgdfPDehZMiJInnfOgQ';
  
  console.log('🔔 Sending test notification...');
  console.log('Time:', new Date().toLocaleString());
  
  try {
    const response = await fetch('https://i-always-care.vercel.app/api/send-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: fcmToken,
        title: 'Good morning Princess! 💕',
        body: 'Your daily message from me is ready! Open the app to see it. ❤️'
      })
    });

    const data = await response.json();
    
    console.log('\nFull response:', JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log('\n✅ Notification sent successfully!');
      console.log('Message ID:', data.messageId);
      console.log('\nCheck her iPhone for the notification! 🎉');
    } else {
      console.log('\n❌ Failed to send notification');
      console.log('Error:', JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
};

testNotification();
