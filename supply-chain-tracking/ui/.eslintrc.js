module.exports = {
  env: {browser: true},
  parserOptions: {
    ecmaFeatures: {
      jsx: true, // Allows for the parsing of JSX
    },
    requireConfigFile: true,
    babelOptions: {
      configFile: require.resolve('./babel.config.js'),
    },
  },
  settings: {
    react: {pragma: 'React', version: 'detect'},
    'import/core-modules': ['lib', 'state/scanSlice', 'state/itemsSlice'],
  },
  extends: ['airbnb/hooks', '../.eslintrc.js'],
  rules: {
    'global-require': 'off',
    'no-param-reassign': 'off',
    'react/prop-types': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-filename-extension': 'off',
    'react/function-component-definition': 'off',
  },
}
