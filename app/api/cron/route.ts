import { NextRequest, NextResponse } from 'next/server';

// This endpoint will be called by Vercel Cron at 9 AM daily
export async function GET(request: NextRequest) {
  try {
    // Verify the request is from Vercel Cron
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the FCM token from environment variable
    const fcmToken = process.env.FCM_TOKEN;
    
    if (!fcmToken) {
      return NextResponse.json({ error: 'FCM token not configured' }, { status: 500 });
    }

    // Send the notification
    const notificationResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/send-notification`, {
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

    const result = await notificationResponse.json();

    if (!notificationResponse.ok) {
      return NextResponse.json({ error: 'Failed to send notification', details: result }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Daily notification sent!', result });
  } catch (error) {
    console.error('Error in cron job:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
