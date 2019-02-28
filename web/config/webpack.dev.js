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
    path: path.resolve(__dirname, '../src/server/public'),
    filename: 'js/[name].bundle.js',
    chunkFilename: 'js/[name].bundle.js',
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
        test: /\.(sa|sc|c)ss$/,
        include: [path.resolve(__dirname, '../src/client/css')],
        use: [MiniCssExtractPlugin.loader, ...SharedConfig.styleLoaders]
      },
      {
        test: /\.(sa|sc|c)ss$/,
        include: [path.resolve(__dirname, '../src/client/js/components')],
        use: ['style-loader', ...SharedConfig.styleLoaders]
      },
      ...SharedConfig.sharedLoaders
    ]
  }
}
