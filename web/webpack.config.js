const webpack = require('webpack')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const WebpackAssetsManifest = require('webpack-assets-manifest')

const devMode = process.env.NODE_ENV !== 'production'

const entryPoints = {
  'index': [
    'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
    './src/scripts/index.js'
  ]
}

const entryFunction = (key) => {
  return devMode ? entryPoints[key] : entryPoints[key][1]
}

module.exports = {
  mode: devMode ? 'development' : 'production',
  entry: {
    index: entryFunction('index')
  },
  output: {
    path: path.resolve(__dirname, 'src/public'),
    filename: devMode ? 'js/[name].bundle.js' : 'js/[name].[contenthash].js',
    chunkFilename: devMode ? 'js/[name].bundle.js' : 'js/[name].[chunkhash].js',
    publicPath: '/'
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: devMode ? 'css/[name].bundle.css' : 'css/[name].[contenthash].css'
    }),
    !devMode ? new WebpackAssetsManifest() : () => {},
    devMode ? new webpack.HotModuleReplacementPlugin() : () => {}
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
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
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
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
