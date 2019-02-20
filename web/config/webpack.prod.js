const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const WebpackAssetsManifest = require('webpack-assets-manifest')
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries')
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
  plugins: [
    new FixStyleOnlyEntriesPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css'
    }),
    new CopyWebpackPlugin([
      {
        from: 'src/client/images',
        to: 'images'
      },
      {
        from: 'src/client/manifest.webmanifest',
        to: 'manifest.webmanifest'
      }
    ]),
    new WebpackAssetsManifest()
  ],
  resolve: {
    alias: SharedConfig.resolvers
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          name: 'vendor',
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true
        }
      }
    },
    minimizer: [new OptimizeCSSAssetsPlugin({})]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              config: {
                path: path.resolve(__dirname, './postcss.config.js')
              }
            }
          },
          'sass-loader'
        ]
      },
      {
        test: /\.(png|jp(e*)g|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8000, // Convert images < 8kb to base64 strings
              name: 'images/[hash]-[name].[ext]'
            }
          }
        ]
      }
    ]
  }
}
