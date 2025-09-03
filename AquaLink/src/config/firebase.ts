import { initializeApp } from "firebase/app";
import { initializeAuth, getAuth } from "firebase/auth";

// Try to find the RN persistence helper from firebase. Different firebase
// releases expose this helper from different entry points, so try both.
let getReactNativePersistence: ((storage: any) => any) | undefined;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  getReactNativePersistence = require('firebase/auth/react-native')?.getReactNativePersistence;
} catch (e) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    getReactNativePersistence = require('firebase/auth')?.getReactNativePersistence;
  } catch (e2) {
    getReactNativePersistence = undefined;
  }
}
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import Constants from "expo-constants";

const {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_DATABASE_URL,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
} = (Constants.expoConfig?.extra ?? {}) as Record<string, string | undefined>;

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  databaseURL: FIREBASE_DATABASE_URL,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

// Initialize Auth and prefer React Native persistence (AsyncStorage) when
// available. This code is defensive: it attempts to require AsyncStorage and
// the persistence helper, logs actionable messages, and falls back to the
// default in-memory persistence if anything is missing.
let authInstance: any;
try {
  if (getReactNativePersistence) {
    // try to require AsyncStorage dynamically so we can provide a clear
    // diagnostic if it's missing (and avoid hard failures in environments
    // that don't include the package).
    let AsyncStorageLib: any;
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const maybe = require('@react-native-async-storage/async-storage');
      // the package may export the module as default or as the module itself
      AsyncStorageLib = maybe?.default ?? maybe;
    } catch (e) {
      AsyncStorageLib = undefined;
    }

    if (AsyncStorageLib) {
      authInstance = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorageLib) });
    } else {
      // Informative warning that instructs how to enable persistence.
      // Firebase prints a similar message; we make it clearer and actionable.
      // eslint-disable-next-line no-console
      console.warn(
        "[Firebase] @react-native-async-storage/async-storage not found. " +
          "Auth state will default to in-memory persistence and will not persist between sessions. " +
          "Install '@react-native-async-storage/async-storage' and rebuild the app to enable persistent auth."
      );
  authInstance = initializeAuth(app);
    }
  } else {
    // persistence helper not available in this firebase build; fall back.
    // eslint-disable-next-line no-console
    console.warn(
      "[Firebase] getReactNativePersistence is not available from firebase/auth in this environment. " +
        "Auth will use default (memory) persistence. If you expect persistence on React Native, consider using a firebase build that exposes 'firebase/auth/react-native'."
    );
  authInstance = initializeAuth(app);
  }
} catch (err: any) {
  // If initializeAuth throws because auth is already initialized (HMR or
  // duplicate import), fall back to the existing instance via getAuth.
  // Otherwise log the error and still attempt to obtain an auth instance.
  // eslint-disable-next-line no-console
  console.warn('[Firebase] initializeAuth failed to set up persistence:', err?.message ?? err);

  try {
    authInstance = getAuth(app);
  } catch (err2) {
    // eslint-disable-next-line no-console
    console.error('[Firebase] Failed to obtain existing Auth instance:', err2);
    throw err2;
  }
}
export const auth = authInstance as ReturnType<typeof initializeAuth>;
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
