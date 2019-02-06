const webpack = require('webpack')
const path = require('path')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries")
const entryPoints = require('./entryPoints.js')

const globalStyleLoaders = [
  {
    loader: 'css-loader', options: {
      sourceMap: true
    }
  },
  {
    loader: 'postcss-loader', options: {
      sourceMap: true,
      config: {
        path: path.resolve(__dirname, './postcss.config.js')
      }
    }
  },
  {
    loader: 'sass-loader', options: {
      sourceMap: true
    }
  }
]

module.exports = {
  mode: 'development',
  entry: {
    index: entryPoints['index'],
    registration: entryPoints['registration']
  },
  output: {
    path: path.resolve(__dirname, '../src/server/public'),
    filename: 'js/[name].bundle.js',
    chunkFilename: 'js/[name].bundle.js',
    publicPath: '/'
  },
  plugins: [
    new FixStyleOnlyEntriesPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      chunkFilename: 'css/[id].css'
    }),
    new webpack.HotModuleReplacementPlugin()
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
        test: /src\/client\/css\/.*.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          ...globalStyleLoaders
        ]
      },
      {
        test: /src\/client\/components\/.*.(sa|sc|c)ss$/,
        use: [
          'style-loader',
          ...globalStyleLoaders
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
