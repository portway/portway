const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')
// We'll enable this in a future release. Leaving it here to know to check in on it
// This currently doesn't work with beta 4 of HTMLWebpackPlugin, which we need
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
    new HtmlWebpackPlugin({
      title: 'Portway',
      filename: '../app.html',
      inlineSource: /initialRender/,
      template: path.resolve(__dirname, '../src/client/index.html'),
      excludeChunks: ['index', 'registration']
      // @todo order it so initialRender is first
    }),
    // new HtmlWebpackInlineSourcePlugin(HtmlWebpackPlugin),
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
