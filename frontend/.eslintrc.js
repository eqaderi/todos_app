module.exports = {
  root: true,

  env: {
    browser: true,
    node: true
  },

  extends: [
    'standard',
    'plugin:vue/essential',
    '@vue/standard',
    'plugin:vue/strongly-recommended',
    'plugin:vue/recommended'
  ],

  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 2022
  },

  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/attributes-order': 'error',
    'vue/html-indent': 'error',
    'vue/order-in-components': ['error'],
    'vue/singleline-html-element-content-newline': 'off',
    'vue/html-closing-bracket-newline': ['error', {
      singleline: 'never',
      multiline: 'never'
    }]
  }
}
