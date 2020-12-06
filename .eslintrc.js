module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:react/recommended',
    'prettier',
  ],

  plugins: ['import', 'unicorn'],

  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },

  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true,
  },

  rules: {
    'import/no-default-export': 'off',
    'import/no-unresolved': 'error',
    'import/order': 'error',
    'unicorn/no-abusive-eslint-disable': 'error',
    'unicorn/prefer-dataset': 'error',

    'arrow-body-style': ['error', 'as-needed'],
    curly: ['error', 'multi-line'],
    eqeqeq: ['error', 'smart'],
    'func-style': ['error', 'declaration', { allowArrowFunctions: true }],
    'grouped-accessor-pairs': ['error', 'getBeforeSet'],
    'lines-between-class-members': [
      'error',
      'always',
      { exceptAfterSingleLine: true },
    ],
    'no-else-return': ['error', { allowElseIf: false }],
    'no-return-await': 'error',
    'no-template-curly-in-string': 'off',
    'no-throw-literal': 'error',
    'no-useless-return': 'error',
    'object-shorthand': ['error', 'always'],
    'one-var': ['error', 'never'],
    'prefer-arrow-callback': 'error',
    'prefer-const': ['error', { destructuring: 'all' }],
    'prefer-object-spread': 'error',
    'require-await': 'error',
    'react/prop-types': 'off',
    'import/namespace': 'off',
    'import/named': 'off',
    'import/default': 'off',
    'import/no-named-as-default': 'off',
    'import/no-named-as-default-member': 'off',
  },
};
