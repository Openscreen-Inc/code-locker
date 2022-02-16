const path = require('path')
const {merge} = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const Dotenv = require('dotenv-webpack')

const resolve = (...paths) => path.resolve(__dirname, '..', ...paths)

//------------------------------------------------------------- Common Config --
const common = {
  entry: resolve('./src/index.js'),
  devtool: 'inline-source-map',
  output: {
    path: resolve('dist'),
    publicPath: '/',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [resolve('src'), 'node_modules'],
    alias: {
      'react-dom': '@hot-loader/react-dom',
      lib: resolve('src/lib'),
      state: resolve('src/state'),
      assets: resolve('src/assets'),
      containers: resolve('src/containers'),
      components: resolve('src/components'),
    },
  },
  module: {
    rules: [
      {test: /\.(js|jsx)$/, exclude: /node_modules/, use: ['babel-loader']},
      {test: /\.(?:ico|gif|png|jpg|jpeg)$/i, type: 'asset/resource'},
      {test: /\.svg$/, use: ['@svgr/webpack', 'url-loader']},
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Supply Chain Demo',
      manifest: resolve('./public/manifest.json'),
      favicon: resolve('./public/favicon.ico'),
      template: resolve('./public/index.html'),
    }),
    new Dotenv({path: resolve('../.env')}),
  ],
}

//------------------------------------------------------------- Merged Config --
module.exports = ({env}) => {
  const config = require(`./webpack.${env}.js`)

  return merge(common, config)
}
