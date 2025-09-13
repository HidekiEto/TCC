module.exports = {
  assets: ["./src/assets/fonts"],
  dependencies: {
    '@react-native-async-storage/async-storage': {
      platforms: {
        android: {
          sourceDir: '../node_modules/@react-native-async-storage/async-storage/android',
          packageImportPath: 'io.github.reactnativecommunity.asyncstorage',
        },
      },
    },
  },
};