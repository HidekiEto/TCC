// Firebase setup for React Native with Hermes compatibility
import { Platform } from 'react-native';

// Essential polyfills for Hermes engine
if (typeof global === 'undefined') {
  var global = globalThis;
}

if (typeof global.self === 'undefined') {
  global.self = global;
}

if (typeof global.window === 'undefined') {
  global.window = global;
}

if (typeof global.document === 'undefined') {
  global.document = {};
}

if (typeof global.navigator === 'undefined') {
  global.navigator = { userAgent: 'ReactNative' };
}

if (typeof global.location === 'undefined') {
  global.location = {
    protocol: 'https:',
    host: 'localhost',
    port: '',
    hostname: 'localhost',
    pathname: '/',
    search: '',
    hash: ''
  };
}

// Add crypto polyfill for Firebase
if (typeof global.crypto === 'undefined') {
  global.crypto = {
    getRandomValues: (array: any) => {
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
      return array;
    }
  };
}

// Add setTimeout and setInterval if not available
if (typeof global.setTimeout === 'undefined') {
  global.setTimeout = setTimeout;
}

if (typeof global.setInterval === 'undefined') {
  global.setInterval = setInterval;
}

if (typeof global.clearTimeout === 'undefined') {
  global.clearTimeout = clearTimeout;
}

if (typeof global.clearInterval === 'undefined') {
  global.clearInterval = clearInterval;
}

export {};
