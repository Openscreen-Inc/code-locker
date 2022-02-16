module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    requireConfigFile: false,
  },
  extends: ['airbnb', 'prettier'],
  settings: {
    'import/extensions': 'off',
    'import/resolver': {
      node: {extensions: ['.js', '.json', '.ts']},
    },
  },
  rules: {
    semi: ['error', 'never'],
    'spaced-comment': 'off',
    'no-new': 'off',
    'no-console': 'off',
    'no-use-before-define': ['error', {functions: false, classes: false, variables: true}],
    'no-unused-vars': ['warn', {vars: 'all', args: 'after-used', ignoreRestSiblings: true}],
    'lines-between-class-members': ['error', 'always', {exceptAfterSingleLine: true}], // require or disallow an empty line between class members
    //
    // import
    //'import/extensions': 'off',
    'import/no-unresolved': ['error', {commonjs: true, caseSensitive: true, ignore: ['.ts$']}],
    'import/prefer-default-export': 'off', // require modules with a single export to use a default export
    'import/no-extraneous-dependencies': 'off',
    'import/no-dynamic-require': 'off',
  },
}
