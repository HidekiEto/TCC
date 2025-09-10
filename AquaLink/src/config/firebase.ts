// Import Hermes polyfills first
import './hermesPolyfills';

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import Constants from 'expo-constants';

const {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_DATABASE_URL,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID
} = Constants.expoConfig?.extra || {};

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  databaseURL: FIREBASE_DATABASE_URL,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
};

// Verify config values
if (!FIREBASE_API_KEY || !FIREBASE_PROJECT_ID) {
  console.error('Firebase configuration is incomplete. Check your .env file.');
  console.log('Available config:', {
    FIREBASE_API_KEY: !!FIREBASE_API_KEY,
    FIREBASE_PROJECT_ID: !!FIREBASE_PROJECT_ID,
    FIREBASE_AUTH_DOMAIN: !!FIREBASE_AUTH_DOMAIN,
  });
}

// Initialize Firebase app with error handling
let app;
try {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
    console.log('Firebase app initialized successfully');
  } else {
    app = getApp();
    console.log('Using existing Firebase app');
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
  throw error;
}

// Initialize services with error handling
let auth, db, storage;

try {
  auth = getAuth(app);
  console.log('Firebase Auth initialized');
} catch (error) {
  console.error('Firebase Auth initialization error:', error);
  throw error;
}

try {
  db = getFirestore(app);
  console.log('Firestore initialized');
} catch (error) {
  console.error('Firestore initialization error:', error);
  throw error;
}

try {
  storage = getStorage(app);
  console.log('Firebase Storage initialized');
} catch (error) {
  console.error('Firebase Storage initialization error:', error);
  throw error;
}

export { auth, db, storage };
export default app;
