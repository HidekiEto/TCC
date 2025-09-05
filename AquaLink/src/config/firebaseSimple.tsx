// Simplified Firebase configuration that works with Hermes
import { Platform } from 'react-native';

// Minimal polyfills required for Firebase
if (Platform.OS === 'android' || Platform.OS === 'ios') {
  // @ts-ignore
  if (typeof global.self === 'undefined') {
    // @ts-ignore
    global.self = global;
  }
  
  // @ts-ignore
  if (typeof global.window === 'undefined') {
    // @ts-ignore
    global.window = global;
  }
}

// Mock auth service to prevent crashes while we fix Firebase
export const auth = {
  currentUser: null,
  onAuthStateChanged: (callback: (user: any) => void) => {
    // Return unsubscribe function
    return () => {};
  },
  signOut: () => Promise.resolve(),
};

export const db = {
  // Mock Firestore operations
};

export const storage = {
  // Mock Storage operations
};

export default null;
