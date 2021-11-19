module.exports = {
  presets: ['@babel/preset-env', ['@babel/preset-react', {runtime: 'automatic'}]],
  plugins: ['react-hot-loader/babel', ['@babel/plugin-transform-runtime', {regenerator: true}]],
}
