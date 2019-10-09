const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries')
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')
const Constants = require('../src/shared/constants')

const SharedConfig = {
  resolvers: {
    Actions: path.resolve(__dirname, '../src/client/js/actions'),
    Components: path.resolve(__dirname, '../src/client/js/components'),
    CSS: path.resolve(__dirname, '../src/client/css'),
    Hooks: path.resolve(__dirname, '../src/client/js/hooks'),
    Libs: path.resolve(__dirname, '../src/client/js/libs'),
    Sections: path.resolve(__dirname, '../src/client/js/sections'),
    Shared: path.resolve(__dirname, '../src/shared'),
  },
  plugins: [
    new FixStyleOnlyEntriesPlugin({ silent: true, ignore: 'webpack-hot-middleware' }),
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
    new webpack.DefinePlugin({
      VAR_API_URL: JSON.stringify(process.env.API_PUBLIC_URL)
    })
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      maxAsyncRequests: 5, // didn't have this before
      maxInitialRequests: 10, // had Infinity for all the files could increase for http2
      // maxSize: 200000, // didn't have this before
      cacheGroups: {
        vendor: {
          name: 'vendor',
          test: /[\\/]node_modules[\\/]/,
          maxSize: 200000, // didn't have this before
          name(module) {
            // get the name. E.g. node_modules/packageName/not/this/part.js
            // or node_modules/packageName
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
            // npm package names are URL-safe, but some servers don't like @ symbols
            return `npm.${packageName.replace('@', '')}`
          }
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
        minimize: true,
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
