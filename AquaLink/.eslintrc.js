module.exports = {
  root: true,
  env: {
    es2021: true,
    node: true,
    'react-native/react-native': true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  plugins: ['react', 'react-hooks', '@typescript-eslint', 'react-native'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-native/all',
    'prettier',
  ],
  settings: { react: { version: 'detect' } },
  rules: {
    'react/prop-types': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'react-native/no-unused-styles': 'warn',
    'react-native/split-platform-components': 'warn',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
  },
};