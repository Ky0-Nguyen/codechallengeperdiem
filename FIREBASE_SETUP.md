# Firebase Setup Guide for React Native App

## Overview
This guide covers the complete setup of Firebase for your React Native application, including Authentication, Firestore Database, Storage, and Analytics.

## Prerequisites
- Node.js and npm installed
- React Native development environment set up
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

## Step 1: Firebase Project Setup

### 1.1 Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name (e.g., "CodeChallenge")
4. Choose whether to enable Google Analytics (recommended)
5. Click "Create project"

### 1.2 Enable Firebase Services
In your Firebase project console, enable the following services:

#### Authentication
1. Go to "Authentication" → "Get started"
2. Click "Sign-in method"
3. Enable "Email/Password" authentication
4. Optionally enable other providers (Google, Facebook, etc.)

#### Firestore Database
1. Go to "Firestore Database" → "Create database"
2. Choose "Start in test mode" for development
3. Select a location for your database
4. Click "Done"

#### Storage
1. Go to "Storage" → "Get started"
2. Choose "Start in test mode" for development
3. Select a location for your storage
4. Click "Done"

#### Analytics
1. Analytics is automatically enabled when you create the project
2. You can view analytics data in the "Analytics" section

## Step 2: Android Configuration

### 2.1 Download google-services.json
1. In Firebase Console, go to "Project settings" (gear icon)
2. Click "Add app" → "Android"
3. Enter your package name: `com.codechallenge`
4. Enter app nickname (optional)
5. Click "Register app"
6. Download the `google-services.json` file
7. Place it in `android/app/google-services.json`

### 2.2 Update Build Configuration
The following files have been updated:

#### android/build.gradle
```gradle
buildscript {
    dependencies {
        classpath("com.google.gms:google-services:4.4.2")
    }
}
```

#### android/app/build.gradle
```gradle
apply plugin: "com.google.gms.google-services"
```

## Step 3: iOS Configuration (Optional)

### 3.1 Download GoogleService-Info.plist
1. In Firebase Console, go to "Project settings"
2. Click "Add app" → "iOS"
3. Enter your bundle ID: `com.codechallenge`
4. Enter app nickname (optional)
5. Click "Register app"
6. Download the `GoogleService-Info.plist` file
7. Add it to your iOS project in Xcode

### 3.2 Install iOS Dependencies
```bash
cd ios && pod install
```

## Step 4: Install React Native Firebase

### 4.1 Install Dependencies
```bash
npm install @react-native-firebase/app @react-native-firebase/analytics @react-native-firebase/auth @react-native-firebase/firestore @react-native-firebase/storage
```

### 4.2 iOS Pod Installation
```bash
cd ios && pod install
```

## Step 5: Firebase Service Implementation

### 5.1 FirebaseService.ts
A comprehensive Firebase service has been created at `src/services/FirebaseService.ts` with the following features:

- **Authentication**: Sign up, sign in, sign out, auth state monitoring
- **Firestore**: CRUD operations for documents and collections
- **Storage**: File upload and download
- **Analytics**: Event logging and user properties

### 5.2 Usage Examples

#### Authentication
```typescript
import FirebaseService from '../services/FirebaseService';

// Sign up
await FirebaseService.signUpWithEmail(email, password);

// Sign in
await FirebaseService.signInWithEmail(email, password);

// Sign out
await FirebaseService.signOut();

// Get current user
const user = FirebaseService.getCurrentUser();
```

#### Firestore
```typescript
// Add document
const docId = await FirebaseService.addDocument('users', {
  name: 'John Doe',
  email: 'john@example.com',
  createdAt: new Date().toISOString()
});

// Get document
const user = await FirebaseService.getDocument('users', docId);

// Update document
await FirebaseService.updateDocument('users', docId, {
  name: 'Jane Doe'
});

// Get collection
const users = await FirebaseService.getCollection('users');
```

#### Storage
```typescript
// Upload file
const downloadUrl = await FirebaseService.uploadFile(
  '/path/to/local/file.jpg',
  'users/profile-images/user123.jpg'
);

// Delete file
await FirebaseService.deleteFile('users/profile-images/user123.jpg');
```

#### Analytics
```typescript
// Log event
await FirebaseService.logEvent('button_clicked', {
  button_name: 'login',
  user_id: 'user123'
});

// Set user property
await FirebaseService.setUserProperty('user_type', 'premium');

// Set user ID
await FirebaseService.setUserId('user123');
```

## Step 6: Demo Screen

A Firebase demo screen has been created at `src/screens/FirebaseDemoScreen.tsx` that showcases:

- User authentication (sign up, sign in, sign out)
- Firestore database operations (add, load documents)
- Analytics event logging

## Step 7: Security Rules

### 7.1 Firestore Security Rules
Update your Firestore security rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow authenticated users to read/write demo collection
    match /demo/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 7.2 Storage Security Rules
Update your Storage security rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow authenticated users to upload files
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Step 8: Testing

### 8.1 Run the App
```bash
# Android
npm run android

# iOS
npm run ios
```

### 8.2 Test Firebase Features
1. Open the app and navigate to the Firebase Demo screen
2. Test user registration and login
3. Add documents to Firestore
4. Load documents from Firestore
5. Log analytics events
6. Check Firebase Console for data

## Step 9: Production Considerations

### 9.1 Security Rules
- Update security rules for production
- Implement proper authentication flows
- Set up proper data validation

### 9.2 Performance
- Implement proper indexing for Firestore queries
- Use pagination for large collections
- Optimize image uploads for Storage

### 9.3 Monitoring
- Set up Firebase Crashlytics for crash reporting
- Monitor Firebase usage and costs
- Set up alerts for unusual activity

## Troubleshooting

### Common Issues

1. **Build Errors**
   - Ensure `google-services.json` is in the correct location
   - Clean and rebuild the project
   - Check that all dependencies are properly installed

2. **Authentication Issues**
   - Verify that Email/Password authentication is enabled in Firebase Console
   - Check that the package name matches your Firebase app configuration

3. **Firestore Permission Errors**
   - Update security rules to allow read/write access
   - Ensure users are properly authenticated

4. **iOS Build Issues**
   - Run `cd ios && pod install` after installing Firebase dependencies
   - Ensure `GoogleService-Info.plist` is added to the Xcode project

## Additional Resources

- [React Native Firebase Documentation](https://rnfirebase.io/)
- [Firebase Console](https://console.firebase.google.com/)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)
- [Firebase Performance Monitoring](https://firebase.google.com/docs/perf-mon)

## Support

For issues specific to this implementation, check the Firebase service implementation in `src/services/FirebaseService.ts` and the demo screen in `src/screens/FirebaseDemoScreen.tsx`.
