module.exports = {
  root: true,
  extends: '@react-native',
  rules: {
    // The base config reports unused variables as a warning for .js but as an
    // error for .ts/.tsx. Converting the codebase therefore turned ~200
    // pre-existing warnings into build-breaking errors overnight. Keep the
    // original severity so the signal stays visible without failing the lint,
    // and drop this override once the backlog is cleared.
    '@typescript-eslint/no-unused-vars': 'warn',
  },
};
