/* eslint-env node, es2018 */
module.exports = {
  extends: [require.resolve('@jcoreio/toolchain/eslintConfig.cjs')],
  rules: {
    'react/react-in-jsx-scope': 0,
  },
}
