// Firebase Configuration
export const FIREBASE_CONFIG = {
  // Google Sign-In Configuration
  GOOGLE_SIGN_IN: {
    webClientId: '62408832184-5555d3t8v2ude4un9vgms3vf8pnomlai.apps.googleusercontent.com',
    iosClientId: '62408832184-5555d3t8v2ude4un9vgms3vf8pnomlai.apps.googleusercontent.com',
    offlineAccess: true,
  },
  
  // Firebase Project Configuration
  PROJECT_ID: 'your-firebase-project-id',
  STORAGE_BUCKET: 'your-firebase-project-id.appspot.com',
  
  // API Keys (these should be in environment variables in production)
  API_KEY: 'your-api-key',
  AUTH_DOMAIN: 'your-project-id.firebaseapp.com',
  MESSAGING_SENDER_ID: '123456789',
  APP_ID: 'your-app-id',
};

// Environment-specific configurations
export const getFirebaseConfig = () => {
  if (__DEV__) {
    // Development environment
    return {
      ...FIREBASE_CONFIG,
      // Add development-specific settings here
    };
  }
  
  // Production environment
  return FIREBASE_CONFIG;
};
