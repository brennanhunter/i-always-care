importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAfsZqoCLpSb00B4F7VoSbFffnEKvlCPQc",
  authDomain: "ialwayscare-560a9.firebaseapp.com",
  projectId: "ialwayscare-560a9",
  storageBucket: "ialwayscare-560a9.firebasestorage.app",
  messagingSenderId: "330012027362",
  appId: "1:330012027362:web:e63e558a059c862b2b71bb"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    data: { url: '/' }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});
