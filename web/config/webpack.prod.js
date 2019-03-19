const path = require('path')
const webpack = require('webpack')
const fs = require('fs')
// Prod only plugins
const CompressionPlugin = require('compression-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const EntryPointWithSiblings = require('./plugins/entryPointWithSiblings')
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
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css',
      chunkFilename: 'css/[id].[contenthash].css'
    }),
    new CompressionPlugin({
      test: /\.(js|css|html|svg)$/
    }),
    new EntryPointWithSiblings({
      callback: (stats, bundles) => {
        const outputPath = path.join(stats.toJson().outputPath, '../', 'entrypoints.json')
        fs.writeFileSync(outputPath, JSON.stringify(bundles, null, 2))
      }
    })
  ]),
  resolve: {
    alias: SharedConfig.resolvers
  },
  optimization: {
    splitChunks: SharedConfig.optimization.splitChunks,
    minimizer: [
      new TerserPlugin({ parallel: true, sourceMap: true }),
      new OptimizeCSSAssetsPlugin({})
    ]
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
