const path = require('path')
const webpack = require('webpack')
// Prod only plugs
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const CompressionPlugin = require('compression-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
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
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      reportFilename: path.resolve(__dirname, '../webpack-report.html')
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
