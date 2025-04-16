const { defineConfig, globalIgnores } = require('eslint/config')

module.exports = defineConfig([
  ...require('@jcoreio/toolchain/eslintConfig.cjs'),
  globalIgnores(['docs/babel.config.js']),
  {
    rules: {
      'no-console': 2,
    },
  },
  {
    files: ['docs/**'],
    rules: {
      'react/react-in-jsx-scope': 0,
    },
  },
])
