import { NextRequest, NextResponse } from 'next/server';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    : null;

  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { token, title, body } = await request.json();

    if (!token) {
      return NextResponse.json({ error: 'No FCM token provided' }, { status: 400 });
    }

    if (!admin.apps.length) {
      return NextResponse.json({ error: 'Firebase Admin not initialized' }, { status: 500 });
    }

    // Send notification using Firebase Admin SDK
    const message = {
      notification: {
        title: title || 'iAlwaysCare 💕',
        body: body || 'Your daily message is waiting for you!',
      },
      webpush: {
        notification: {
          icon: '/icon-192.png',
          badge: '/icon-192.png',
        },
        fcmOptions: {
          link: '/'
        }
      },
      token: token
    };

    const response = await admin.messaging().send(message);

    return NextResponse.json({ success: true, messageId: response });
  } catch (error: any) {
    console.error('Error sending notification:', error);
    return NextResponse.json({ 
      error: 'Failed to send notification', 
      details: error.message 
    }, { status: 500 });
  }
}
