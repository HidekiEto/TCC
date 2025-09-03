import 'dotenv/config';

export default {
  expo: {
    name: "AquaLink",
    slug: "aqualink",
    version: "1.0.0",
    extra: {
      FIREBASE_API_KEY: process.env.VITE_APP_FIREBASE_API_KEY,
      FIREBASE_AUTH_DOMAIN: process.env.VITE_APP_FIREBASE_AUTH_DOMAIN,
      FIREBASE_PROJECT_ID: process.env.VITE_APP_FIREBASE_PROJECT_ID,
      FIREBASE_DATABASE_URL: process.env.VITE_APP_FIREBASE_DATABASE_URL,
      FIREBASE_STORAGE_BUCKET: process.env.VITE_APP_FIREBASE_STORAGE_BUCKET,
      FIREBASE_MESSAGING_SENDER_ID: process.env.VITE_APP_FIREBASE_MESSAGING_SENDER_ID,
      FIREBASE_APP_ID: process.env.VITE_APP_FIREBASE_APP_ID
    }
  }
};
