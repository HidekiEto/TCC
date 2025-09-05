// Polyfills for Firebase compatibility with React Native
if (typeof global.self === 'undefined') {
  global.self = global;
}

if (typeof global.window === 'undefined') {
  global.window = global;
}

// Fix for Firebase Auth with Hermes
if (typeof global.location === 'undefined') {
  global.location = {};
}

if (typeof global.navigator === 'undefined') {
  global.navigator = {};
}

// Fix for crypto functions
if (typeof global.crypto === 'undefined') {
  global.crypto = {
    getRandomValues: (array) => {
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
    }
  };
}
