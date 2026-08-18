---
title: Securing Mobile Apps: Biometric Auth, Encrypted Storage, and Certificate Pinning
date: 2026-08-03
description: Implement enterprise security patterns in mobile applications, including iOS Keychain and Android Keystore encryption, FaceID/Fingerprint authentication, and SSL Certificate Pinning.
tags: [mobile, security, biometrics, react-native, security-best-practices]
---

## Mobile Security Threat Vectors

Mobile apps run in untrusted environments on user physical hardware. Threat actors can reverse-engineer APK/IPA binaries, inspect unencrypted SQLite databases, or execute Man-in-the-Middle (MitM) proxy attacks to inspect network traffic.

To secure sensitive application data, mobile architectures must enforce three security defenses:
1. **Encrypted Hardware Storage**: iOS Keychain & Android Keystore API.
2. **Biometric Gatekeeping**: FaceID / TouchID / BiometricPrompt verification.
3. **SSL Certificate Pinning**: Enforce public key hash verification on HTTP requests.

## Security Architecture Stack

```
 +------------------------------------------------------------------+
 |                     Mobile Security Layers                       |
 |                                                                  |
 |  [ Biometric Auth Layer ] (FaceID / Fingerprint Prompt)           |
 |             |                                                    |
 |        Unlocked?                                                 |
 |             v                                                    |
 |  [ Secure Enclave / Hardware KeyStore ]                          |
 |             |                                                    |
 |      Decrypt Secret                                              |
 |             v                                                    |
 |  [ Encrypted Keychain Storage ] (JWT / Refresh Tokens)            |
 |             |                                                    |
 |       Make API Request                                           |
 |             v                                                    |
 |  [ SSL Certificate Pinning Layer ] ── Validate Hash ──> [ Server ]
 +------------------------------------------------------------------+
```

## Step 1 — Encrypted Secure Storage (`SecureStorageService.ts`)

Store JWT tokens securely using hardware-backed keychains (`react-native-keychain`):

```typescript
import * as Keychain from 'react-native-keychain';

export class SecureStorageService {
  public static async saveUserSession(accessToken: string, refreshToken: string): Promise<boolean> {
    try {
      const payload = JSON.stringify({ accessToken, refreshToken });
      
      const result = await Keychain.setGenericPassword('auth_session', payload, {
        service: 'com.myapp.auth',
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
        securityLevel: Keychain.SECURITY_LEVEL.SECURE_HARDWARE,
      });
      
      return !!result;
    } catch (error) {
      console.error('Failed to encrypt session into Keychain:', error);
      return false;
    }
  }

  public static async getUserSession(): Promise<{ accessToken: string; refreshToken: string } | null> {
    try {
      const credentials = await Keychain.getGenericPassword({
        service: 'com.myapp.auth',
      });

      if (credentials) {
        return JSON.parse(credentials.password);
      }
      return null;
    } catch (error) {
      console.error('Failed to read decrypted session from Keychain:', error);
      return null;
    }
  }
}
```

## Step 2 — Biometric Authentication Manager (`BiometricAuthService.ts`)

Authenticate users with FaceID / TouchID before releasing session keys:

```typescript
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';

const rnBiometrics = new ReactNativeBiometrics({ allowDeviceCredentials: true });

export class BiometricAuthService {
  public static async checkBiometricAvailability(): Promise<boolean> {
    const { biometryType, available } = await rnBiometrics.isSensorAvailable();

    if (available && (biometryType === BiometryTypes.FaceID || biometryType === BiometryTypes.Biometrics)) {
      console.log('Biometric sensor available:', biometryType);
      return true;
    }
    return false;
  }

  public static async authenticateUser(promptReason: string): Promise<boolean> {
    try {
      const { success } = await rnBiometrics.simplePrompt({
        promptMessage: promptReason,
        cancelButtonText: 'Cancel',
      });

      return success;
    } catch (error) {
      console.error('Biometric authentication failed:', error);
      return false;
    }
  }
}
```

## Step 3 — SSL Certificate Pinning (`networkClient.ts`)

Reject network connections if server public key certificates do not match trusted pinned SHA-256 hashes:

```typescript
import { fetch as pinnedFetch } from 'react-native-ssl-pinning';

export async function secureApiCall(endpoint: string, options: any = {}) {
  try {
    const response = await pinnedFetch(`https://api.myapp.com${endpoint}`, {
      method: options.method || 'GET',
      headers: options.headers,
      body: options.body,
      sslPinning: {
        certs: ['api_myapp_com_cert'], // Bundled certificate file name
      },
      timeoutInterval: 10000,
    });

    return response;
  } catch (error: any) {
    if (error.message.includes('Certificate pinning failed')) {
      console.error('CRITICAL: Man-in-the-Middle (MitM) attack detected!');
    }
    throw error;
  }
}
```

## Essential Mobile Security Checklist

1. **Obfuscate Production Binaries**: Enable ProGuard/R8 on Android and Swift compiler obfuscation on iOS to prevent reverse engineering.
2. **Disable Root/Jailbreak Execution**: Check device integrity at startup to restrict execution on rooted hardware.
3. **Wipe Decrypted Tokens on Logout**: Explicitly clear keychains when users log out.
