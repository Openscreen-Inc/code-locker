const path = require('path')
const {DefinePlugin, HotModuleReplacementPlugin} = require('webpack')

const resolve = (...paths) => path.resolve(__dirname, ...paths)

module.exports = {
  mode: 'development',
  devtool: 'eval-source-map',
  output: {
    filename: 'bundle.[hash].js',
  },
  module: {
    rules: [{test: /\.css$/i, use: ['style-loader', 'css-loader']}],
  },
  devServer: {
    hot: true,
    port: 3000,
    open: true,
    static: resolve('..', 'dist'),
    historyApiFallback: true,
  },
  plugins: [
    new HotModuleReplacementPlugin(),
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
  ],
}
