const webpack = require('webpack')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// Custom stuff
const SharedConfig = require('./webpack.shared')
const entryPoints = require('./entryPoints.js')

module.exports = {
  mode: 'development',
  entry: entryPoints,
  output: {
    chunkFilename: 'js/[name].bundle.js',
    filename: 'js/[name].bundle.js',
    path: path.resolve(__dirname, '../src/server/public'),
    publicPath: '/'
  },
  plugins: SharedConfig.plugins.concat([
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      chunkFilename: 'css/[id].css'
    }),
    new webpack.HotModuleReplacementPlugin()
  ]),
  resolve: {
    alias: SharedConfig.resolvers
  },
  optimization: SharedConfig.optimization,
  module: {
    rules: [
      {
        include: [path.resolve(__dirname, '../src/client/css')],
        test: /\.(sa|sc|c)ss$/,
        use: [MiniCssExtractPlugin.loader, ...SharedConfig.styleLoaders]
      },
      {
        include: [path.resolve(__dirname, '../src/client/js')],
        test: /\.(sa|sc|c)ss$/,
        use: ['style-loader', ...SharedConfig.styleLoaders]
      },
      ...SharedConfig.sharedLoaders
    ]
  }
}
