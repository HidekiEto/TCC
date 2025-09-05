// Firebase initialization with Hermes compatibility
import { Platform } from 'react-native';

// Polyfills for Hermes compatibility
if (Platform.OS === 'android' || Platform.OS === 'ios') {
  // Required polyfills for Firebase on React Native
  if (typeof global.btoa === 'undefined') {
    global.btoa = function (str) {
      return Buffer.from(str, 'binary').toString('base64');
    };
  }

  if (typeof global.atob === 'undefined') {
    global.atob = function (b64Encoded) {
      return Buffer.from(b64Encoded, 'base64').toString('binary');
    };
  }
}

// Export dummy functions for now to prevent crashes
export const auth = {
  currentUser: null,
  onAuthStateChanged: () => () => {},
};

export const db = {};
export const storage = {};

export default null;
