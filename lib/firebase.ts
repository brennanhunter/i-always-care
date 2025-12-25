import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyAfsZqoCLpSb00B4F7VoSbFffnEKvlCPQc",
  authDomain: "ialwayscare-560a9.firebaseapp.com",
  projectId: "ialwayscare-560a9",
  storageBucket: "ialwayscare-560a9.firebasestorage.app",
  messagingSenderId: "330012027362",
  appId: "1:330012027362:web:e63e558a059c862b2b71bb",
  measurementId: "G-SVKSZVJDWS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = typeof window !== 'undefined' ? getMessaging(app) : null;

export { messaging };

export async function requestNotificationPermission() {
  if (!messaging) return null;
  
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: 'BLI8tlldaKT0wgNNQwZJHf6QuiKg_yuVpovDSjSIwq0-qZsF-bg4HW4_rzh6T6Sl8rGBVuhOy3YoZdmuOYtZjk4'
      });
      console.log('FCM Token:', token);
      // Store this token - you'll need it to send notifications
      localStorage.setItem('fcm-token', token);
      return token;
    }
  } catch (error) {
    console.error('Notification permission error:', error);
  }
  return null;
}

export function onMessageListener() {
  return new Promise((resolve) => {
    if (!messaging) return;
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
}
