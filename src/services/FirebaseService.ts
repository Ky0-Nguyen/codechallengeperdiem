import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import analytics from '@react-native-firebase/analytics';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { getFirebaseConfig } from '../config/firebase';

class FirebaseService {
  constructor() {
    // Initialize Google Sign-In
    GoogleSignin.configure({
      webClientId: '62408832184-5555d3t8v2ude4un9vgms3vf8pnomlai.apps.googleusercontent.com',
      iosClientId: '62408832184-i2oco868l0uvp7veel34284d8mq2suf1.apps.googleusercontent.com',
      offlineAccess:true
    });
  }

  // Authentication methods
  async signInWithEmail(email: string, password: string): Promise<FirebaseAuthTypes.UserCredential> {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      console.log('User signed in successfully:', userCredential.user.uid);
      return userCredential;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  async signUpWithEmail(email: string, password: string): Promise<FirebaseAuthTypes.UserCredential> {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      console.log('User created successfully:', userCredential.user.uid);
      return userCredential;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      await auth().signOut();
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  getCurrentUser(): FirebaseAuthTypes.User | null {
    return auth().currentUser;
  }

  onAuthStateChanged(callback: (user: FirebaseAuthTypes.User | null) => void): () => void {
    return auth().onAuthStateChanged(callback);
  }

  // Google Sign-In methods
  async signInWithGoogle(): Promise<FirebaseAuthTypes.UserCredential> {
    try {
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices();
      
      // Get the users ID token
      const userInfo = await GoogleSignin.signIn();
      const { accessToken } = await GoogleSignin.getTokens();

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(null, accessToken);

      // Sign-in the user with the credential
      const userCredential = await auth().signInWithCredential(googleCredential);
      console.log('User signed in with Google successfully:', userCredential.user.uid);
      return userCredential;
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    }
  }

  async signOutFromGoogle(): Promise<void> {
    try {
      await auth().signOut();
      await GoogleSignin.signOut();
      console.log('User signed out from Google successfully');
    } catch (error) {
      console.error('Google sign out error:', error);
      throw error;
    }
  }

  async isSignedInWithGoogle(): Promise<boolean> {
    try {
      const isSignedIn = await GoogleSignin.getCurrentUser();
      return isSignedIn !== null;
    } catch (error) {
      console.error('Check Google sign in status error:', error);
      return false;
    }
  }

  // Firestore methods
  async addDocument(collection: string, data: any): Promise<string> {
    try {
      const docRef = await firestore().collection(collection).add(data);
      console.log('Document added with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Add document error:', error);
      throw error;
    }
  }

  async getDocument(collection: string, docId: string): Promise<any> {
    try {
      const doc = await firestore().collection(collection).doc(docId).get();
      if (doc.exists()) {
        return { id: doc.id, ...doc.data() };
      } else {
        throw new Error('Document not found');
      }
    } catch (error) {
      console.error('Get document error:', error);
      throw error;
    }
  }

  async updateDocument(collection: string, docId: string, data: any): Promise<void> {
    try {
      await firestore().collection(collection).doc(docId).update(data);
      console.log('Document updated successfully');
    } catch (error) {
      console.error('Update document error:', error);
      throw error;
    }
  }

  async deleteDocument(collection: string, docId: string): Promise<void> {
    try {
      await firestore().collection(collection).doc(docId).delete();
      console.log('Document deleted successfully');
    } catch (error) {
      console.error('Delete document error:', error);
      throw error;
    }
  }

  async getCollection(collection: string): Promise<any[]> {
    try {
      const snapshot = await firestore().collection(collection).get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Get collection error:', error);
      throw error;
    }
  }

  // Storage methods
  async uploadFile(filePath: string, storagePath: string): Promise<string> {
    try {
      const reference = storage().ref(storagePath);
      await reference.putFile(filePath);
      const url = await reference.getDownloadURL();
      console.log('File uploaded successfully:', url);
      return url;
    } catch (error) {
      console.error('Upload file error:', error);
      throw error;
    }
  }

  async deleteFile(storagePath: string): Promise<void> {
    try {
      const reference = storage().ref(storagePath);
      await reference.delete();
      console.log('File deleted successfully');
    } catch (error) {
      console.error('Delete file error:', error);
      throw error;
    }
  }

  // Analytics methods
  async logEvent(eventName: string, parameters?: { [key: string]: any }): Promise<void> {
    try {
      await analytics().logEvent(eventName, parameters);
      console.log('Analytics event logged:', eventName);
    } catch (error) {
      console.error('Log event error:', error);
      throw error;
    }
  }

  async setUserProperty(name: string, value: string): Promise<void> {
    try {
      await analytics().setUserProperty(name, value);
      console.log('User property set:', name, value);
    } catch (error) {
      console.error('Set user property error:', error);
      throw error;
    }
  }

  async setUserId(userId: string): Promise<void> {
    try {
      await analytics().setUserId(userId);
      console.log('User ID set:', userId);
    } catch (error) {
      console.error('Set user ID error:', error);
      throw error;
    }
  }
}

export default new FirebaseService();
