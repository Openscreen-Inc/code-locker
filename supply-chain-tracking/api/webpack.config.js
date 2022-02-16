//------------------------------------------------------------ Global Imports --
const path = require('path')
const slsw = require('serverless-webpack')
const nodeExternals = require('webpack-node-externals')

//----------------------------------------------------------------- Variables --
const {isLocal} = slsw.lib.webpack

//------------------------------------------------------------- Module Export --
module.exports = {
  mode: isLocal ? 'development' : 'production',
  entry: slsw.lib.entries,
  context: __dirname,
  target: ['node', 'es2019'],
  devtool: isLocal ? 'eval-cheap-module-source-map' : 'source-map',
  externals: [nodeExternals()],
  externalsPresets: {node: true},
  stats: 'minimal',
  optimization: {minimize: false},
  performance: {hints: false},
  output: {
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
    libraryTarget: 'commonjs',
  },
}
