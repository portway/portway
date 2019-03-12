const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const WebpackAssetsManifest = require('webpack-assets-manifest')
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries')
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')
const Constants = require('../src/shared/constants')

const SharedConfig = {
  resolvers: {
    Sections: path.resolve(__dirname, '../src/client/js/sections'),
    Components: path.resolve(__dirname, '../src/client/js/components'),
    Actions: path.resolve(__dirname, '../src/client/js/actions'),
    Hooks: path.resolve(__dirname, '../src/client/js/hooks'),
    Shared: path.resolve(__dirname, '../src/shared'),
    CSS: path.resolve(__dirname, '../src/client/css')
  },
  plugins: [
    new FixStyleOnlyEntriesPlugin(),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../src/client/images'),
        to: 'images'
      },
      {
        from: path.resolve(__dirname, '../src/client/css/fonts'),
        to: 'css/fonts/'
      },
      {
        from: path.resolve(__dirname, '../src/client/manifest.webmanifest'),
        to: 'manifest.webmanifest'
      }
    ]),
    new SWPrecacheWebpackPlugin({
      cacheId: Constants.PRODUCT_ID,
      dontCacheBustUrlsMatching: /\.\w{8}\./,
      filename: 'service-worker.js',
      logger(message) {
        if (message.indexOf('Total precache size is') === 0) {
          return
        }
        console.info(message)
      },
      minify: true,
      staticFileGlobsIgnorePatterns: [/\.map$/, /manifest\.json$/]
    }),
    new WebpackAssetsManifest(),
    new webpack.DefinePlugin({
      VAR_API_URL: JSON.stringify(process.env.API_PUBLIC_URL)
    })
  ],
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
    }
  },
  styleLoaders: [
    {
      loader: 'css-loader',
      options: {
        sourceMap: true
      }
    },
    {
      loader: 'postcss-loader',
      options: {
        sourceMap: true,
        config: {
          path: path.resolve(__dirname, './postcss.config.js')
        }
      }
    },
    {
      loader: 'sass-loader',
      options: {
        sourceMap: true
      }
    }
  ],
  sharedLoaders: [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader'
      }
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

module.exports = SharedConfig
