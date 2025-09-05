const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add resolver configuration for Firebase and React Native compatibility
config.resolver.assetExts.push('cjs');
config.resolver.sourceExts.push('cjs');

// Add platform-specific extensions
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Ensure proper transformation of Firebase modules
config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

module.exports = config;