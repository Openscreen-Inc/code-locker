const {DefinePlugin} = require('webpack')
const MiniCssExtract = require('mini-css-extract-plugin')

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  output: {
    filename: '[name].[contenthash].js',
  },
  module: {
    rules: [{test: /\.css$/, use: [MiniCssExtract.loader, 'css-loader']}],
  },
  plugins: [
    new MiniCssExtract(),
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],
}
