---
title: Reliable Cross-Platform Mobile Push Notifications with FCM and APNs
date: 2026-07-30
description: Implement end-to-end mobile push notification systems handling background payload routing, device token registration, FCM/APNs authentication, and deep-linking.
tags: [mobile, push-notifications, firebase, iOS, android]
---

## The Push Notification Delivery Pipeline

Push notifications are critical for user retention, transaction verification, and real-time alerts. However, reliable cross-platform delivery across iOS (APNs) and Android (FCM) requires managing token lifecycles, background payload handlers, and deep-linking routing.

## End-to-End Notification Workflow

```
  +------------------------------------------------------------------+
  |                     Push Notification System                     |
  |                                                                  |
  |  [ Mobile Client App ]                                           |
  |        |                                                         |
  |     Request Token (FCM / APNs)                                   |
  |        v                                                         |
  |  [ Registration Token ] ── Store ──> [ Backend Database ]       |
  |                                              |                   |
  |                                     Event Trigger                |
  |                                              v                   |
  |                                  [ Firebase Admin SDK ]          |
  |                                         /        \               |
  |                                        v          v              |
  |                                    [ APNs ]    [ FCM Gateway ]   |
  |                                        \          /              |
  |                                         v        v               |
  |                                   [ Mobile Hardware ]            |
  +------------------------------------------------------------------+
```

## Step 1 — Client Token Registration (`PushNotificationService.ts`)

Request user permission and extract push tokens using React Native Messaging:

```typescript
import messaging from '@react-native-firebase/messaging';
import { Alert, PermissionsAndroid, Platform } from 'react-native';

export class PushNotificationService {
  public static async requestPermission(): Promise<boolean> {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }

    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    return enabled;
  }

  public static async registerDeviceToken(): Promise<string | null> {
    const hasPermission = await this.requestPermission();
    if (!hasPermission) {
      console.warn('User rejected push notification permissions');
      return null;
    }

    // Get FCM token (Works for both Android & iOS APNs bridging)
    const token = await messaging().getToken();
    console.log('Registered Device Push Token:', token);

    // Sync token with application backend API
    await fetch('https://api.myapp.com/v1/user/device-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, platform: Platform.OS }),
    });

    return token;
  }
}
```

## Step 2 — Background & Foreground Payload Handlers (`index.js`)

Register top-level notification handlers to catch incoming messages when apps are minimized or killed:

```javascript
import messaging from '@react-native-firebase/messaging';
import { AppRegistry } from 'react-native';
import App from './App';

// Background message handler (Must be registered early outside React lifecycles)
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('Message handled in the background!', remoteMessage.notification);
  
  if (remoteMessage.data?.action === 'OPEN_ORDER') {
    // Save state for navigation deep linking on app launch
    global.pendingDeepLink = `myapp://orders/${remoteMessage.data.orderId}`;
  }
});

AppRegistry.registerComponent('MyApp', () => App);
```

## Step 3 — Node.js Backend Dispatcher with Firebase Admin SDK (`pushSender.ts`)

Send structured HTTP v1 messages using FCM Firebase Admin SDK:

```typescript
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export async function sendTargetedPushNotification(
  deviceToken: string,
  title: string,
  body: string,
  deepLinkUrl: string
) {
  const message: admin.messaging.Message = {
    token: deviceToken,
    notification: {
      title,
      body,
    },
    data: {
      url: deepLinkUrl,
      timestamp: String(Date.now()),
    },
    android: {
      priority: 'high',
      notification: {
        sound: 'default',
        channelId: 'high_priority_notifications',
      },
    },
    apns: {
      payload: {
        aps: {
          sound: 'default',
          badge: 1,
        },
      },
    },
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('Successfully dispatched notification:', response);
    return response;
  } catch (error) {
    console.error('Failed to send push message:', error);
    throw error;
  }
}
```

## Push Notification Best Practices

1. **Token Refresh Listener**: Listen to `messaging().onTokenRefresh` to handle token rotations automatically.
2. **Channel Separation (Android)**: Define high-priority notification channels for urgent transactions and silent channels for promotional updates.
3. **Payload Limitations**: Keep JSON data payloads under 4KB to prevent delivery truncations by APNs/FCM gateways.
