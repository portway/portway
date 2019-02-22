const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// Prod only plugs
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
// Custom stuff
const SharedConfig = require('./webpack.shared')
const entryPoints = require('./entryPoints.js')

module.exports = {
  mode: 'production',
  entry: entryPoints,
  output: {
    path: path.resolve(__dirname, '../dist/server/public'),
    filename: 'js/[name].[contenthash].js',
    chunkFilename: 'js/[name].[chunkhash].js',
    publicPath: '/'
  },
  plugins: SharedConfig.plugins.concat([
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css',
      chunkFilename: 'css/[id].[contenthash].css'
    })
  ]),
  resolve: {
    alias: SharedConfig.resolvers
  },
  optimization: {
    splitChunks: SharedConfig.optimization.splitChunks,
    minimizer: [new OptimizeCSSAssetsPlugin({})]
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [MiniCssExtractPlugin.loader, ...SharedConfig.styleLoaders]
      },
      ...SharedConfig.sharedLoaders
    ]
  }
}
