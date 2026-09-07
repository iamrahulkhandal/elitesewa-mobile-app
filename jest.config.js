module.exports = {
  preset: 'react-native',
  setupFiles: ['<rootDir>/jest.setup.js'],
  // Several RN ecosystem packages ship untranspiled ESM, which Jest cannot
  // parse without running them through Babel first.
  transformIgnorePatterns: [
    'node_modules/(?!(' +
      [
        '@react-native',
        'react-native',
        'react-native-.*',
        '@react-navigation',
        'react-redux',
        'redux-persist',
        '@reduxjs',
        'immer',
        'reselect',
        'react-clone-referenced-element',
      ].join('|') +
      ')/)',
  ],
};
