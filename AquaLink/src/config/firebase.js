// Re-export the TypeScript implementation to ensure a single source of truth.
// This file exists so existing JS imports (`../config/firebase`) continue to work
// while the TypeScript file (`firebase.ts`) contains the actual initialization
// (including React Native persistence when available).
module.exports = require('./firebase');
