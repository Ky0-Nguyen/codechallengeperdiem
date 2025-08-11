# Firebase Authentication Integration Guide

## Overview
This guide covers the complete integration of Firebase Authentication with Google Sign-In and Email/Password authentication in your React Native app, including persistence and user management.

## Features Implemented

### ✅ Authentication Methods
1. **Google Sign-In/Sign-Up**
   - One-tap Google authentication
   - Automatic user profile creation
   - Seamless sign-in experience

2. **Email/Password Authentication**
   - User registration (sign-up)
   - User login (sign-in)
   - Password validation
   - Error handling

3. **User Persistence**
   - Automatic session restoration
   - Persistent login state
   - User profile storage in MMKV

4. **User Profile Management**
   - Display user name and email
   - Profile photo support (Google)
   - Provider information tracking

## Implementation Details

### 1. Firebase Service (`src/services/FirebaseService.ts`)

#### Google Sign-In Configuration
```typescript
constructor() {
  GoogleSignin.configure({
    webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
  });
}
```

#### Authentication Methods
```typescript
// Email/Password Authentication
async signInWithEmail(email: string, password: string)
async signUpWithEmail(email: string, password: string)

// Google Sign-In
async signInWithGoogle()
async signOutFromGoogle()
async isSignedInWithGoogle()

// General Authentication
async signOut()
getCurrentUser()
onAuthStateChanged(callback)
```

### 2. App Store Integration (`src/stores/AppStore.ts`)

#### Firebase Auth State Management
```typescript
private initializeFirebaseAuth() {
  const unsubscribe = FirebaseService.onAuthStateChanged((user) => {
    runInAction(() => {
      this.firebaseUser = user;
      if (user) {
        // User is signed in - create profile
        this.userProfile = {
          id: user.uid,
          email: user.email || '',
          name: user.displayName || user.email?.split('@')[0] || 'User',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          photoURL: user.photoURL || null,
          provider: user.providerData[0]?.providerId || 'email',
        };
        this.isAuthenticated = true;
        MMKVStorage.setUserProfile(this.userProfile);
      } else {
        // User is signed out
        this.isAuthenticated = false;
        this.userProfile = null;
        MMKVStorage.delete(STORAGE_KEYS.USER_PROFILE);
      }
    });
  });
}
```

#### Authentication Methods
```typescript
async signInWithEmail(email: string, password: string)
async signUpWithEmail(email: string, password: string)
async signInWithGoogle()
logout() // Includes Firebase sign out
```

### 3. Login Screen (`src/screens/LoginScreen.tsx`)

#### Features
- **Dual Mode**: Sign In / Sign Up toggle
- **Google Sign-In Button**: One-tap authentication
- **Email/Password Form**: Traditional authentication
- **Demo Account**: Quick testing
- **Loading States**: Visual feedback during authentication
- **Error Handling**: User-friendly error messages

#### Key Components
```typescript
// Google Sign-In
const handleGoogleSignIn = async () => {
  try {
    await appStore.signInWithGoogle();
    onLoginSuccess();
  } catch (error: any) {
    Alert.alert('Error', error.message || 'Failed to sign in with Google');
  }
};

// Email Authentication
const handleEmailAuth = async () => {
  try {
    if (isSignUp) {
      await appStore.signUpWithEmail(email, password);
      Alert.alert('Success', 'Account created successfully!');
    } else {
      await appStore.signInWithEmail(email, password);
    }
    onLoginSuccess();
  } catch (error: any) {
    Alert.alert('Error', error.message || 'Authentication failed');
  }
};
```

### 4. Home Screen Integration (`src/screens/HomeScreen.tsx`)

#### User Display
```typescript
<Text style={homeScreenStyles.userName}>
  Welcome, {appStore.userDisplayName || 'User'}
</Text>
```

#### Logout Functionality
```typescript
const handleLogout = () => {
  Alert.alert(
    'Logout',
    'Are you sure you want to logout?',
    [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Logout', 
        style: 'destructive',
        onPress: () => {
          appStore.logout(); // Includes Firebase sign out
        }
      }
    ]
  );
};
```

## Setup Instructions

### 1. Firebase Console Configuration

#### Enable Authentication
1. Go to Firebase Console → Authentication
2. Click "Get started"
3. Enable "Email/Password" provider
4. Enable "Google" provider
5. Configure Google Sign-In:
   - Add your app's SHA-1 fingerprint
   - Download `google-services.json` (Android)
   - Download `GoogleService-Info.plist` (iOS)

#### Configure Google Sign-In
1. Go to Google Cloud Console
2. Enable Google Sign-In API
3. Create OAuth 2.0 credentials
4. Add authorized origins and redirect URIs

### 2. Android Configuration

#### Update `android/app/google-services.json`
Replace the placeholder values with your actual Firebase configuration:
```json
{
  "project_info": {
    "project_number": "YOUR_PROJECT_NUMBER",
    "project_id": "YOUR_PROJECT_ID",
    "storage_bucket": "YOUR_PROJECT_ID.appspot.com"
  },
  "client": [
    {
      "client_info": {
        "mobilesdk_app_id": "1:YOUR_PROJECT_NUMBER:android:YOUR_APP_ID",
        "android_client_info": {
          "package_name": "com.codechallenge"
        }
      },
      "oauth_client": [
        {
          "client_id": "YOUR_CLIENT_ID.apps.googleusercontent.com",
          "client_type": 3
        }
      ],
      "api_key": [
        {
          "current_key": "YOUR_API_KEY"
        }
      ]
    }
  ]
}
```

#### Update Firebase Service
Replace the web client ID in `src/services/FirebaseService.ts`:
```typescript
GoogleSignin.configure({
  webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
});
```

### 3. iOS Configuration (Optional)

#### Add `GoogleService-Info.plist`
1. Download from Firebase Console
2. Add to Xcode project
3. Ensure it's included in the app bundle

#### Install Pods
```bash
cd ios && pod install
```

## Usage Examples

### 1. User Registration
```typescript
// In your component
const handleSignUp = async () => {
  try {
    await appStore.signUpWithEmail(email, password);
    // User will be automatically signed in
  } catch (error) {
    console.error('Sign up failed:', error);
  }
};
```

### 2. User Login
```typescript
// Email/Password login
const handleSignIn = async () => {
  try {
    await appStore.signInWithEmail(email, password);
    // User will be automatically signed in
  } catch (error) {
    console.error('Sign in failed:', error);
  }
};

// Google Sign-In
const handleGoogleSignIn = async () => {
  try {
    await appStore.signInWithGoogle();
    // User will be automatically signed in
  } catch (error) {
    console.error('Google sign in failed:', error);
  }
};
```

### 3. User Logout
```typescript
const handleLogout = () => {
  appStore.logout();
  // User will be automatically signed out from Firebase
  // and redirected to login screen
};
```

### 4. Check Authentication Status
```typescript
// Check if user is authenticated
if (appStore.isAuthenticated) {
  console.log('User is logged in:', appStore.userDisplayName);
} else {
  console.log('User is not logged in');
}

// Get current user info
const user = appStore.userProfile;
console.log('User email:', user?.email);
console.log('User name:', user?.name);
console.log('Provider:', user?.provider);
```

## Error Handling

### Common Authentication Errors
```typescript
// Email already in use
if (error.code === 'auth/email-already-in-use') {
  Alert.alert('Error', 'An account with this email already exists');
}

// Invalid email
if (error.code === 'auth/invalid-email') {
  Alert.alert('Error', 'Please enter a valid email address');
}

// Weak password
if (error.code === 'auth/weak-password') {
  Alert.alert('Error', 'Password should be at least 6 characters');
}

// Wrong password
if (error.code === 'auth/wrong-password') {
  Alert.alert('Error', 'Incorrect password');
}

// User not found
if (error.code === 'auth/user-not-found') {
  Alert.alert('Error', 'No account found with this email');
}
```

## Security Considerations

### 1. Firebase Security Rules
Update your Firestore security rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 2. Storage Security Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow users to upload files to their own folder
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Testing

### 1. Test Authentication Flow
1. Open the app
2. Try signing up with a new email
3. Try signing in with existing credentials
4. Test Google Sign-In
5. Test logout functionality
6. Verify persistence by closing and reopening the app

### 2. Test Error Scenarios
1. Try signing up with existing email
2. Try signing in with wrong password
3. Try signing in with non-existent email
4. Test network connectivity issues

### 3. Test User Profile
1. Verify user name is displayed correctly
2. Check that user email is saved
3. Verify provider information is tracked
4. Test profile persistence across app restarts

## Troubleshooting

### Common Issues

1. **Google Sign-In Not Working**
   - Verify SHA-1 fingerprint is correct
   - Check web client ID configuration
   - Ensure Google Sign-In API is enabled

2. **Authentication State Not Persisting**
   - Check MMKV storage configuration
   - Verify Firebase Auth state listener
   - Check for storage permissions

3. **Build Errors**
   - Clean and rebuild project
   - Verify all dependencies are installed
   - Check Firebase configuration files

4. **iOS Build Issues**
   - Run `pod install` after adding Firebase
   - Verify `GoogleService-Info.plist` is added to Xcode
   - Check bundle identifier matches Firebase config

## Performance Optimization

### 1. Lazy Loading
- Only initialize Firebase when needed
- Use authentication state listener efficiently

### 2. Error Handling
- Implement proper error boundaries
- Show user-friendly error messages
- Log errors for debugging

### 3. User Experience
- Show loading states during authentication
- Provide clear feedback for all actions
- Implement proper navigation flow

## Future Enhancements

### 1. Additional Authentication Methods
- Facebook Sign-In
- Apple Sign-In (iOS)
- Phone number authentication
- Anonymous authentication

### 2. Advanced Features
- Password reset functionality
- Email verification
- Multi-factor authentication
- Account linking

### 3. Analytics Integration
- Track authentication events
- Monitor user engagement
- Analyze conversion rates

## Support

For issues specific to this implementation:
- Check the Firebase service in `src/services/FirebaseService.ts`
- Review the AppStore authentication methods in `src/stores/AppStore.ts`
- Examine the login screen in `src/screens/LoginScreen.tsx`
- Refer to the Firebase documentation for detailed API information
