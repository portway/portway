const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')
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
      filename: 'index.html',
      inlineSource: /initialRender/,
      template: path.resolve(__dirname, '../src/client/index.html'),
      chunks: ['initialRender', 'app']
    }),
    new HtmlWebpackInlineSourcePlugin(),
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
    namedChunks: true,
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minChunks: 2,
      minSize: 0,
      cacheGroups: {
        vendor: {
          name: 'vendor',
          test: /[\\/]node_modules[\\/]/,
          priority: -10
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
